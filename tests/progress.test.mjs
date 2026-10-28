import test from "node:test";
import assert from "node:assert/strict";
import {
  lessons,
  readyLessons,
  DOMAINS,
  COURSE,
  matchesLesson,
  lessonById,
} from "../assets/curriculum.js";
import { lessonData } from "../assets/lesson-data.js";
import {
  blankState,
  blankEntry,
  validateState,
  mergeStates,
  createStore,
  STORAGE_KEY,
  practiceReady,
  completePractice,
  recordReview,
  entryStatus,
} from "../assets/store.js";
import {
  createNoteCache,
  createSessionModel,
  USERS,
  runReviewCases,
  TEST_CASES,
} from "../assets/lab-models.js";

const at = new Date("2026-11-02T10:00:00Z");
const memory = (initial) => {
  const values = new Map(Object.entries(initial || {}));
  return {
    getItem: (key) => values.get(key) || null,
    setItem: (key, value) => values.set(key, value),
    values,
  };
};
const completedEntry = () => ({
  ...blankEntry(at),
  labComplete: true,
  labEvidence: ["Observed a changed result"],
  checks: {
    q1: { correct: true, attempts: 1, hinted: false },
    q2: { correct: true, attempts: 1, hinted: false },
  },
  reflection:
    "The response and displayed state were different; I inspected the boundary.",
});

test("the honest course allocation has 37 weekdays, ten ready lessons, and balanced domains", () => {
  assert.equal(lessons.length, 37);
  assert.equal(readyLessons.length, 10);
  assert.equal(lessons[0].date, "2026-11-03");
  assert.equal(lessons.at(-1).date, "2026-12-23");
  assert.deepEqual(
    readyLessons.slice(0, 5).map((lesson) => lesson.date),
    ["2026-11-03", "2026-11-04", "2026-11-05", "2026-11-06", "2026-11-09"],
  );
  assert.equal(lessonById("python-debug").date, "2026-11-11");
  assert.equal(new Set(lessons.map((lesson) => lesson.date)).size, 37);
  assert.deepEqual(
    Object.fromEntries(
      Object.keys(DOMAINS).map((id) => [
        id,
        lessons.filter((l) => l.domain === id).length,
      ]),
    ),
    {
      web: 9,
      code: 7,
      infra: 5,
      reliability: 5,
      data: 4,
      agents: 4,
      review: 3,
    },
  );
  assert.equal(new Set(lessons.map((l) => l.id)).size, 37);
  for (const lesson of lessons) {
    assert.ok(lesson.date);
    assert.ok(
      ![0, 6].includes(new Date(`${lesson.date}T12:00:00Z`).getUTCDay()),
    );
    assert.ok(lesson.ready === Boolean(lesson.file));
  }
});
test("checks have equal-word-count choices without answer-length clues", () => {
  for (const data of Object.values(lessonData))
    for (const question of [...data.checks, data.review]) {
      assert.equal(question.options.length, 4);
      assert.ok(question.answer >= 0 && question.answer < 4);
      assert.equal(
        new Set(
          question.options.map((option) => option.trim().split(/\s+/).length),
        ).size,
        1,
        question.question,
      );
    }
});
test("topic search matches the tool name even when the lesson title uses a concept", () => {
  assert.equal(matchesLesson(lessonById("docker-basics"), " Docker "), true);
  assert.equal(matchesLesson(lessonById("airflow-failures"), "AIRFLOW"), true);
  assert.equal(matchesLesson(lessonById("sessions"), "no-such-topic"), false);
});
test("reading or a single correct check cannot complete practice", () => {
  const entry = blankEntry(at);
  assert.equal(practiceReady(entry), false);
  assert.throws(() => completePractice(entry, at));
  entry.checks = { q1: { correct: true }, q2: { correct: true } };
  entry.labComplete = true;
  assert.equal(practiceReady(entry), false);
  entry.reflection =
    "My own explanation of the observed state and the evidence I checked.";
  assert.equal(practiceReady(entry), true);
  const done = completePractice(entry, at);
  assert.equal(done.practicedAt, at.toISOString());
  assert.equal(entryStatus(done, at), "Practised");
  assert.equal(
    entryStatus(done, new Date("2026-11-05T10:00:00Z")),
    "Review due",
  );
  assert.equal(
    completePractice(done, new Date("2026-11-06T10:00:00Z")).practicedAt,
    done.practicedAt,
  );
});
test("spaced review rejects early completion and records assistance independently", () => {
  const entry = completePractice(completedEntry(), at);
  assert.throws(() => recordReview(entry, true, false, at), /not due/);
  const now = new Date("2026-11-05T10:00:00Z");
  const passed = recordReview(entry, true, false, now);
  assert.equal(passed.reviews[0].assisted, false);
  assert.equal(passed.reviewDueAt, "2026-11-12T10:00:00.000Z");
  const assisted = recordReview(entry, true, true, now);
  assert.equal(assisted.reviewDueAt, "2026-11-06T10:00:00.000Z");
  assert.equal(assisted.reviews[0].assisted, true);
});
test("backup validation rejects unrelated data and unknown lesson IDs, bounds note fields", () => {
  assert.throws(() =>
    validateState({ schema: 2, course: COURSE, lessons: {} }),
  );
  assert.throws(() =>
    validateState({ schema: 1, course: COURSE, lessons: { unknown: {} } }),
  );
  const raw = blankState();
  raw.lessons.sessions = {
    ...blankEntry(at),
    reflection: "x".repeat(7000),
    confidence: 99,
    secret: "must disappear",
  };
  const safe = validateState(raw);
  assert.equal(safe.lessons.sessions.reflection.length, 6000);
  assert.equal(safe.lessons.sessions.confidence, null);
  assert.equal(safe.lessons.sessions.secret, undefined);
  assert.equal(Object.hasOwn(safe.lessons, "__proto__"), false);
});
test("backup merging preserves newer local work and admits newer imported work", () => {
  const current = blankState(),
    incoming = blankState();
  current.lessons.sessions = { ...blankEntry(at), reflection: "Newest local" };
  incoming.lessons.sessions = {
    ...blankEntry(new Date("2026-11-01T10:00:00Z")),
    reflection: "Older backup",
  };
  assert.equal(
    mergeStates(current, incoming).lessons.sessions.reflection,
    "Newest local",
  );
  incoming.lessons.sessions.updatedAt = "2026-11-03T10:00:00Z";
  assert.equal(
    mergeStates(current, incoming).lessons.sessions.reflection,
    "Older backup",
  );
});
test("corrupt browser data stays untouched until an explicit valid restore", () => {
  const storage = memory({ [STORAGE_KEY]: "{broken json" }),
    model = createStore(storage);
  assert.ok(model.error());
  assert.throws(() => model.update("sessions", { recall: "Do not overwrite" }));
  assert.equal(storage.getItem(STORAGE_KEY), "{broken json");
  model.import(blankState());
  assert.equal(model.error(), null);
  assert.equal(JSON.parse(storage.getItem(STORAGE_KEY)).schema, 1);
});
test("a failed browser write reports failure and keeps a draft available for export", () => {
  const model = createStore({
    getItem: () => null,
    setItem: () => {
      throw new Error("quota");
    },
  });
  assert.throws(
    () => model.update("sessions", { recall: "draft" }),
    /could not be saved/,
  );
  assert.ok(model.error());
  assert.equal(model.entry("sessions").recall, "draft");
  assert.equal(model.export().lessons.sessions.recall, "draft");
});
test("notes, checks, confidence, and lab evidence persist across a new store instance", () => {
  const storage = memory(),
    first = createStore(storage);
  first.update("sessions", completedEntry());
  first.practice("sessions");
  const second = createStore(storage),
    entry = second.entry("sessions");
  assert.ok(entry.practicedAt);
  assert.equal(entry.labComplete, true);
  assert.equal(entry.checks.q1.correct, true);
  assert.equal(entry.reflection, completedEntry().reflection);
  assert.deepEqual(second.export().lessons, first.export().lessons);
});
test("the unsafe model reproduces a cross-user leak; the scoped model isolates both request orders and warm hits", () => {
  const unsafe = createNoteCache();
  unsafe.read(USERS.mina);
  assert.equal(unsafe.read(USERS.owen).notes[0].owner, 17);
  for (const pair of [
    [USERS.mina, USERS.owen],
    [USERS.owen, USERS.mina],
  ]) {
    const safe = createNoteCache(true);
    for (const user of [...pair, ...pair])
      assert.ok(safe.read(user).notes.every((note) => note.owner === user.id));
    assert.equal(safe.reads, 2);
  }
  assert.equal(createNoteCache(true).read({ id: 999 }).status, 401);
});
test("cache expiry refreshes a changed value and an empty list remains a hit", () => {
  const cache = createNoteCache(true);
  cache.read(USERS.mina);
  cache.changeTitle(USERS.mina, "Updated");
  cache.advance(59);
  assert.notEqual(cache.read(USERS.mina).notes[0].title, "Updated");
  cache.advance(1);
  assert.equal(cache.read(USERS.mina).notes[0].title, "Updated");
  const empty = createNoteCache(true);
  empty.empty(USERS.mina);
  empty.read(USERS.mina);
  assert.equal(empty.read(USERS.mina).hit, true);
  assert.equal(empty.reads, 1);
});
test("the session model uses server identity and rejects expiry and logout", () => {
  const session = createSessionModel();
  assert.equal(session.request().status, 401);
  session.signIn();
  session.setClaim("Owen");
  assert.equal(session.request().user, "Mina");
  session.expire();
  assert.equal(session.request().status, 401);
  assert.ok(session.cookie);
  session.signIn();
  session.logout();
  assert.equal(session.request().status, 401);
  assert.equal(session.cookie, null);
});
test("regression cases expose the bug instead of relying on passing happy paths", () => {
  const results = runReviewCases([
    "single",
    "cross",
    "reverse",
    "hit",
    "expiry",
    "empty",
  ]);
  assert.equal(results[0].buggy, true);
  assert.equal(results.find((r) => r.id === "cross").buggy, false);
  assert.equal(results.find((r) => r.id === "reverse").buggy, false);
  assert.ok(results.every((r) => r.fixed));
});

test("isolation checks reject empty success responses for users with seeded notes", () => {
  const silentlyDropsData = { read: () => ({ status: 200, notes: [] }) };
  for (const id of ["single", "cross", "reverse"])
    assert.equal(TEST_CASES[id].run(silentlyDropsData), false);
});
