import test from "node:test";
import assert from "node:assert/strict";
import { complexityModel } from "../assets/complexity-models.js";
import { complexityLessons } from "../assets/complexity-curriculum.js";
import { allLessons, trackLessons } from "../assets/catalog.js";
import {
  blankState,
  blankEntry,
  validateState,
  mergeStates,
} from "../assets/store.js";

test("constant and linear counts react differently to quadrupling n", () => {
  const small = complexityModel("cx-growth", 8).rows;
  const large = complexityModel("cx-growth", 32).rows;
  assert.equal(large[0].count, small[0].count);
  assert.equal(large[1].count, 4 * small[1].count);
});

test("sequential, fixed-inner, triangular, and independent loops retain their real bounds", () => {
  assert.deepEqual(
    complexityModel("cx-loops", 8, 4).rows.map((r) => r.count),
    [16, 24, 64, 28, 32],
  );
  const doubled = complexityModel("cx-loops", 16, 8).rows.map((r) => r.count);
  assert.equal(doubled[0], 32);
  assert.equal(doubled[2], 256);
  assert.equal(doubled[4], 128);
});

test("binary midpoint counts increase one per doubling without charging slices", () => {
  let previous = 0;
  for (const n of [4, 8, 16, 32, 64, 128]) {
    const result = complexityModel("cx-halving", n);
    assert.equal(result.rows[1].count, Math.log2(n) + 1);
    if (previous) assert.equal(result.rows[1].count, previous + 1);
    previous = result.rows[1].count;
  }
});

test("copy work, auxiliary state, and output storage stay distinct", () => {
  assert.deepEqual(
    complexityModel("cx-python-costs", 32).rows.map((r) => r.count),
    [1, 32, 16],
  );
  assert.deepEqual(
    complexityModel("cx-space", 32).rows.map((r) => r.count),
    [1, 32, 32],
  );
  assert.match(complexityModel("cx-space", 32).rows[1].growth, /output/);
});

test("indexed totals include setup while repeated scans multiply independent inputs", () => {
  const model = complexityModel("cx-indexing", 32, 8);
  assert.deepEqual(
    model.rows.map((r) => r.count),
    [256, 40],
  );
  assert.match(model.rows[1].growth, /expected/);
});

test("sorting curves distinguish candidate counts and enforce exact-number bounds", () => {
  const result = complexityModel("cx-sorting", 16);
  assert.deepEqual(
    result.rows.map((r) => r.count),
    [16, 64, 65536, 20922789888000],
  );
  assert.match(result.note, /candidate counts exclude/);
  assert.throws(() => complexityModel("cx-sorting", 32));
  assert.throws(() => complexityModel("cx-growth", 1e12));
  assert.throws(() => complexityModel("unknown", 8));
});

test("the final model labels an expected set improvement rather than a worst-case guarantee", () => {
  const result = complexityModel("cx-review", 32);
  assert.deepEqual(
    result.rows.map((r) => r.count),
    [496, 64],
  );
  assert.match(result.rows[1].growth, /expected/);
  assert.match(result.note, /collisions/);
});

test("complexity practice joins backups without replacing Python or engineering entries", () => {
  assert.equal(complexityLessons.length, 8);
  assert.equal(allLessons.length, 75);
  const before = blankState();
  before.lessons["py-memory"] = blankEntry(new Date("2026-11-05T10:00:00Z"));
  const incoming = blankState();
  incoming.lessons["cx-growth"] = {
    ...blankEntry(),
    reflection: "My own counting explanation",
  };
  const merged = mergeStates(before, incoming);
  assert.deepEqual(merged.lessons["py-memory"], before.lessons["py-memory"]);
  assert.equal(
    validateState(merged).lessons["cx-growth"].reflection,
    "My own counting explanation",
  );
  assert.equal(merged.lessons["cx-growth"].practicedAt, null);
  assert.equal(trackLessons(complexityLessons[0]), complexityLessons);
});
