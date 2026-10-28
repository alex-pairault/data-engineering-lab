import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import {
  createServiceModel,
  quoteTotal,
  runQuote,
  mergeChecks,
  frozenInstall,
  createContainerModel,
  grainRows,
} from "../assets/foundation-models.js";
const fixture = JSON.parse(
  readFileSync(new URL("../assets/fixtures/grain-data.json", import.meta.url)),
);
test("a running listener keeps startup config and route errors differ from refusal", () => {
  const m = createServiceModel();
  assert.equal(m.request(8000).status, null);
  m.start();
  assert.equal(m.request(8000).status, 200);
  assert.equal(m.request(8000, "/missing").status, 404);
  m.configure(9000);
  assert.equal(m.request(8000).status, 200);
  assert.equal(m.request(9000).status, null);
  m.start();
  assert.equal(m.request(9000).status, 200);
  assert.equal(m.request(8000).status, null);
  m.stop();
  assert.equal(m.request(9000).status, null);
  assert.throws(() => m.configure(-1));
});
test("both adapters share business validation and no invalid quote reaches storage", () => {
  for (const amount of [0, 101, 10000])
    assert.equal(
      runQuote({ amount, source: "http" }).total,
      runQuote({ amount, source: "job" }).total,
    );
  assert.equal(quoteTotal(101), 91);
  for (const amount of [-1, 1.5, 1000001, true, "10000", null]) {
    assert.throws(() => quoteTotal(amount));
    for (const source of ["http", "job"])
      assert.equal(runQuote({ amount, source }).writes, 0);
  }
  assert.notEqual(
    runQuote({ amount: 10000, source: "http", layout: "duplicated" }).total,
    runQuote({ amount: 10000, source: "job", layout: "duplicated" }).total,
  );
});
test("one-sided conflict resolutions each fail relevant criteria and frozen restore rejects mismatch", () => {
  assert.ok(mergeChecks("main").some((r) => !r.pass));
  assert.ok(mergeChecks("feature").some((r) => !r.pass));
  assert.ok(mergeChecks("combined").every((r) => r.pass));
  assert.throws(() => mergeChecks("unknown"));
  assert.equal(frozenInstall(false, true).ok, false);
  assert.equal(frozenInstall(true, false).ok, false);
  assert.equal(frozenInstall(true, true).ok, true);
});
test("container replacement loses its writable layer but reuses a named volume", () => {
  const m = createContainerModel();
  m.create({ published: false });
  assert.equal(m.increment().ok, false);
  m.remove();
  m.create();
  assert.equal(m.increment().value, 1);
  m.stop();
  assert.equal(m.increment().ok, false);
  m.start();
  assert.equal(m.snapshot.container.writable, 1);
  assert.throws(() => m.create());
  m.remove();
  m.create();
  assert.equal(m.snapshot.container.writable, 0);
  m.remove();
  m.create({ persistent: true });
  m.increment();
  m.remove();
  m.create({ persistent: true });
  assert.equal(m.increment().value, 2);
  assert.equal(m.snapshot.container.writable, 0);
});
test("fanout, value deduplication and preaggregation differ even for legitimate equal amounts", () => {
  assert.deepEqual(grainRows(fixture, "fanout")[0], {
    order_id: 901,
    line_total: 300,
    payment_total: 200,
  });
  assert.deepEqual(grainRows(fixture, "distinct")[0], {
    order_id: 901,
    line_total: 50,
    payment_total: 70,
  });
  assert.deepEqual(grainRows(fixture, "aggregate")[0], {
    order_id: 901,
    line_total: 100,
    payment_total: 100,
  });
  const changed = structuredClone(fixture);
  changed.orders.push({ id: 903 });
  assert.equal(grainRows(changed, "fanout").length, 2);
  assert.deepEqual(grainRows(changed, "aggregate")[2], {
    order_id: 903,
    line_total: 0,
    payment_total: 0,
  });
});
