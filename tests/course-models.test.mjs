import test from "node:test";
import assert from "node:assert/strict";
import { courseModels, runScenario } from "../assets/course-labs.js";
const rows = (id, key) => runScenario(id, key).rows;
test("all 22 remaining mechanisms provide inspectable bounded result tables", () => {
  assert.equal(Object.keys(courseModels).length, 22);
  for (const [id, model] of Object.entries(courseModels)) {
    assert.equal(
      new Set(model.cases.map(([key]) => key)).size,
      model.cases.length,
    );
    for (const [key] of model.cases) {
      const result = runScenario(id, key);
      assert.ok(result.note.length > 20);
      assert.ok(result.trace.length >= 1, `${id}/${key} has no trace`);
      assert.ok(
        result.rows.every((row) => row.length === result.columns.length),
      );
    }
    assert.throws(() => runScenario(id, "invented-scenario"));
  }
});
test("CORS distinguishes simple request delivery from preflight denial and response access", () => {
  assert.equal(rows("browser-origins", "blocked")[2][1], "yes");
  assert.equal(rows("browser-origins", "blocked")[3][1], "no");
  assert.equal(rows("browser-origins", "preflight-denied")[2][1], "no");
  assert.equal(rows("browser-origins", "allowed")[3][1], "yes");
  assert.equal(rows("browser-origins", "credentials")[3][1], "no");
});
test("a passing domain result can coexist with an incorrect rejected-operation write", () => {
  assert.equal(rows("test-boundaries", "integration")[0][3], "PASS");
  assert.equal(rows("test-boundaries", "integration")[1][3], "FAIL");
  assert.equal(rows("test-boundaries", "fixed")[1][3], "PASS");
});
test("guarded stock changes prevent two accepted sales from one unit and rollback restores stock", () => {
  assert.equal(rows("transactions", "stale")[1][1], 2);
  assert.equal(rows("transactions", "guarded")[1][1], 1);
  assert.equal(rows("transactions", "rollback")[2][1], 1);
});
test("replay and update-on-change use explicit stable source identity", () => {
  assert.equal(rows("idempotent-imports", "append").length, 5);
  assert.equal(rows("idempotent-imports", "upsert").length, 3);
  assert.equal(
    rows("idempotent-imports", "changed").reduce(
      (sum, [, amount]) => sum + amount,
      0,
    ),
    65,
  );
});
test("data assertions expose each planted source violation instead of relying on a model run", () => {
  assert.ok(rows("dbt-quality", "clean").every(([, n]) => n === 0));
  for (const mode of ["duplicate", "null", "negative", "orphan"])
    assert.ok(rows("dbt-quality", mode).some(([, n]) => n > 0));
});
test("failed network stages stop later boundaries, and private-value binding preserves the owner filter", () => {
  assert.equal(rows("dns-tls-nginx", "dns")[1][1], "not reached");
  assert.equal(rows("dns-tls-nginx", "upstream")[3][1], "connection refused");
  assert.equal(rows("web-security", "unsafe").length, 2);
  assert.equal(rows("web-security", "bound").length, 0);
});
test("API failures stay distinguishable and a timed-out write is not blindly retried", () => {
  const asObject = (key) => Object.fromEntries(rows("python-errors", key));
  assert.equal(asObject("retry").Attempts, 2);
  assert.equal(asObject("json")["Error category"], "invalid_json");
  assert.equal(asObject("schema")["Error category"], "invalid_schema");
  assert.equal(asObject("post").Attempts, 1);
  assert.equal(asObject("post")["Error category"], "outcome_unknown");
});
test("green checks do not approve a different source artifact", () => {
  assert.equal(
    rows("ci-delivery", "wrong-artifact")[3][1],
    "blocks deployment",
  );
  assert.equal(rows("ci-delivery", "failed-tests")[3][1], "blocks deployment");
  assert.equal(rows("ci-delivery", "matching")[3][1], "allows this artifact");
});
test("duplicate delivery repeats an unsafe effect and preserves one deduplicated effect", () => {
  assert.equal(rows("orchestration", "raw").at(-1)[2], 2);
  assert.equal(rows("orchestration", "deduplicated").at(-1)[2], 1);
  assert.ok(rows("orchestration", "unordered")[0][1].includes("blocked"));
});
test("the mixed failure trace holds the shared source constant across hypotheses", () => {
  for (const mode of ["browser", "compare", "invalidate"])
    assert.ok(rows("mixed-trace", mode).every((row) => row[2] === 120));
  assert.deepEqual(
    rows("mixed-trace", "compare").map((r) => r[1]),
    [100, 120],
  );
  assert.deepEqual(
    rows("mixed-trace", "invalidate").map((r) => r[1]),
    [120, 120],
  );
});
test("replica-local state differs from a shared revoked session", () => {
  assert.deepEqual(
    rows("load-balancing", "local").map((r) => r[2]),
    [200, 401, 200],
  );
  assert.ok(rows("load-balancing", "shared").every((r) => r[2] === 200));
  assert.ok(rows("load-balancing", "revoked").every((r) => r[2] === 401));
  assert.equal(rows("load-balancing", "affinity").at(-1)[2], 401);
});
test("Airflow retry budget and external effect safety are separate mechanisms", () => {
  assert.equal(rows("airflow-failures", "no-retry")[1][1], 1);
  assert.equal(rows("airflow-failures", "retry")[1][1], 2);
  assert.equal(rows("airflow-failures", "unsafe")[3][1], 4);
  assert.equal(rows("airflow-failures", "idempotent")[3][1], 2);
});
test("restoring a valid snapshot can still omit later committed writes", () => {
  assert.equal(rows("recovery", "code-only")[2][2], 0);
  assert.equal(rows("recovery", "restore")[2][2], 30);
  assert.equal(rows("recovery", "stale-snapshot")[1][2], 40);
});
test("review cases reject the happy-path-only patch and sample forms do not authenticate execution", () => {
  assert.ok(rows("agent-diff", "happy").every((r) => r[1] === "yes"));
  assert.ok(rows("agent-diff", "negative").some((r) => r[1] === "no"));
  assert.ok(rows("agent-diff", "fixed").every((r) => r[1] === "yes"));
  assert.ok(
    runScenario("capstone", "executed").note.includes("does not authenticate"),
  );
});
