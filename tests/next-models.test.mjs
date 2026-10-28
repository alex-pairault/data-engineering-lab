import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import {
  catalogResponse,
  catalogContractErrors,
  paidTotals,
  createPriceCache,
  createInvalidationScenario,
  validateResourceReport,
} from "../assets/next-models.js";
const fixture = JSON.parse(
  readFileSync(new URL("../assets/fixtures/join-data.json", import.meta.url)),
);

test("API validation, cursor pagination and response compatibility are independent checks", () => {
  for (const limit of ["0", "3", "many", "1.5"])
    assert.equal(catalogResponse({ limit }).status, 400);
  assert.equal(catalogResponse({ cursor: "invented-token" }).status, 400);
  const first = catalogResponse(),
    second = catalogResponse({ cursor: first.body.next_cursor });
  assert.equal(first.status, 200);
  assert.deepEqual(catalogContractErrors(first.body), []);
  assert.deepEqual(
    [...first.body.items, ...second.body.items].map((item) => item.id),
    ["P-01", "P-02", "P-03"],
  );
  assert.equal(second.body.next_cursor, null);
  const changed = catalogResponse({ breaking: true });
  assert.equal(changed.status, 200);
  assert.ok(catalogContractErrors(changed.body).length);
  assert.deepEqual(
    catalogContractErrors({ ...first.body, optional_metadata: "new" }),
    [],
  );
  assert.ok(
    catalogContractErrors({
      items: [{ id: "x", name: "x", price_cents: "1200" }],
      next_cursor: null,
    }).length,
  );
  assert.ok(catalogContractErrors({ items: [] }).length);
});
test("outer-join examples distinguish missing groups from retained NULL aggregates", () => {
  assert.deepEqual(
    paidTotals(fixture, "where").map((row) => row.customer_id),
    [1, 4],
  );
  assert.deepEqual(
    paidTotals(fixture, "raw").map((row) => row.paid_total),
    [20, null, null, 0],
  );
  for (const mode of ["on", "case"])
    assert.deepEqual(
      paidTotals(fixture, mode).map((row) => [row.customer_id, row.paid_total]),
      [
        [1, 20],
        [2, 0],
        [3, 0],
        [4, 0],
      ],
    );
  const changed = structuredClone(fixture);
  changed.orders.push({ id: 106, customer_id: 2, status: "paid", amount: 6 });
  assert.equal(paidTotals(changed, "on")[1].paid_total, 6);
  assert.throws(() => paidTotals(fixture, "freeform"));
});
test("fixed TTL does not extend on reads or reload on clock advancement", () => {
  const model = createPriceCache(10);
  assert.equal(model.read().hit, false);
  model.update(120);
  model.advance(9);
  assert.deepEqual(model.read(), {
    value: 100,
    hit: true,
    stale: true,
    now: 9,
    age: 9,
  });
  assert.equal(model.snapshot.entry.expires, 10);
  model.advance(1);
  assert.equal(model.snapshot.loads, 1);
  assert.equal(model.snapshot.entry.value, 100);
  assert.equal(model.read().value, 120);
  assert.equal(model.snapshot.loads, 2);
  assert.equal(model.snapshot.entry.expires, 20);
  assert.throws(() => model.advance(-1));
  assert.throws(() => createPriceCache(0));
});
test("the controlled interleaving reproduces early refill and verifies commit/rollback boundaries", () => {
  for (const strategy of ["before", "after", "rollback"]) {
    const scenario = createInvalidationScenario(strategy);
    const steps = [];
    while (!scenario.snapshot.done) steps.push(scenario.step());
    const end = scenario.snapshot;
    assert.equal(end.lastRead.value, strategy === "after" ? 120 : 100);
    assert.equal(end.source, strategy === "rollback" ? 100 : 120);
    assert.equal(end.lastRead.stale, strategy === "before");
    assert.equal(scenario.step(), null);
    if (strategy === "rollback")
      assert.equal(
        steps.some((step) => step.id === "invalidate"),
        false,
      );
    if (strategy === "after")
      assert.ok(
        steps.findIndex((step) => step.id === "commit") <
          steps.findIndex((step) => step.id === "invalidate"),
      );
  }
});
const checksum = (n) =>
  Math.floor(n / 97) * 4656 + ((n % 97) * ((n % 97) - 1)) / 2;
const report = () => ({
  kind: "fieldnotes-resource-report",
  schema: 1,
  cases: [1000, 2000].flatMap((rows) =>
    ["eager", "stream"].map((mode) => ({
      mode,
      rows,
      count: rows,
      checksum: checksum(rows),
      elapsed_s: 0.1,
      cpu_s: 0.08,
      traced_peak_bytes: mode === "eager" ? rows * 600 : 5000,
      rss_peak_bytes: null,
    })),
  ),
});
test("resource reports require four consistent bounded cases without claiming a speedup", () => {
  assert.equal(validateResourceReport(report()).cases.length, 4);
  const slower = report();
  slower.cases[1].elapsed_s = 10;
  assert.equal(validateResourceReport(slower).cases[1].elapsed_s, 10);
  for (const mutate of [
    (r) => (r.schema = 2),
    (r) => r.cases[0].checksum++,
    (r) => r.cases[0].count--,
    (r) => (r.cases[1].mode = "eager"),
    (r) => (r.cases[0].cpu_s = -1),
    (r) => (r.cases[0].traced_peak_bytes = Infinity),
    (r) => (r.cases[0].rss_peak_bytes = "unknown"),
  ]) {
    const invalid = report();
    mutate(invalid);
    assert.throws(() => validateResourceReport(invalid));
  }
  const extra = report();
  extra.personal_note = "<script>";
  assert.equal(validateResourceReport(extra).personal_note, undefined);
});
