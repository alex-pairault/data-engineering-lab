import test from "node:test";
import assert from "node:assert/strict";
import { lessons } from "../assets/curriculum.js";
import {
  pythonLessons,
  matchesPythonLesson,
} from "../assets/python-curriculum.js";
import { allLessons, lessonById, trackLessons } from "../assets/catalog.js";
import { pythonLessonData } from "../assets/python-lesson-data.js";
import {
  blankState,
  blankEntry,
  createStore,
  validateState,
  mergeStates,
} from "../assets/store.js";

test("Python is a separate route without extending or redating engineering", () => {
  assert.equal(lessons.length, 37);
  assert.equal(lessons[0].date, "2026-11-03");
  assert.equal(lessons.at(-1).date, "2026-12-23");
  assert.equal(pythonLessons.length, 30);
  assert.equal(new Set(allLessons.map((l) => l.id)).size, 67);
  for (const l of pythonLessons) {
    assert.equal(l.date, undefined);
    assert.equal(trackLessons(lessonById(l.id)), pythonLessons);
  }
  assert.equal(trackLessons(lessons[0]), lessons);
});

test("old engineering backups remain valid and both tracks survive export/import", () => {
  const old = blankState();
  old.lessons[lessons[0].id] = blankEntry(new Date("2026-11-03T10:00:00Z"));
  const storage = new Map();
  const local = createStore({
    getItem: (k) => storage.get(k) || null,
    setItem: (k, v) => storage.set(k, v),
  });
  local.import(old);
  local.update("py-memory", {
    recall: "My own prediction",
    labEvidence: ["Self-recorded command"],
    confidence: 2,
  });
  const exported = validateState(local.export());
  assert.equal(
    exported.lessons[lessons[0].id].startedAt,
    old.lessons[lessons[0].id].startedAt,
  );
  assert.equal(exported.lessons["py-memory"].recall, "My own prediction");
  const merged = mergeStates(exported, old);
  assert.deepEqual(merged, exported);
  assert.equal(merged.lessons["py-memory"].practicedAt, null);
});

test("spaced Python reviews do not expose one constant answer position", () => {
  const positions = Object.values(pythonLessonData).map(
    (data) => data.review.answer,
  );
  assert.deepEqual([...new Set(positions)].sort(), [0, 1, 2, 3]);
  for (const answer of [0, 1, 2, 3]) {
    assert.ok(positions.filter((value) => value === answer).length >= 7);
  }
});

test("topic search finds library names and memory beyond the lesson title", () => {
  const find = (query) =>
    pythonLessons
      .filter((l) => matchesPythonLesson(l, query))
      .map((l) => l.number);
  assert.deepEqual(find(" Pytest "), [11]);
  assert.deepEqual(find("pydantic"), [13, 14, 29]);
  assert.ok(find("memory").includes(7));
  assert.deepEqual(find("nothing-like-this"), []);
});
