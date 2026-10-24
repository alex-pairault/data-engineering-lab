import { COURSE, lessons } from "./curriculum.js";
export const STORAGE_KEY = "fieldnotes.progress.v1";
const validIds = new Set(lessons.map((lesson) => lesson.id));
const text = (value, max = 6000) =>
  typeof value === "string" ? value.slice(0, max) : "";
const date = (value) =>
  typeof value === "string" && Number.isFinite(Date.parse(value))
    ? new Date(value).toISOString()
    : null;
const count = (value) =>
  Number.isInteger(value) && value >= 0 ? Math.min(value, 1000) : 0;
export const blankState = () => ({ schema: 1, course: COURSE, lessons: {} });
export function blankEntry(now = new Date()) {
  return {
    startedAt: now.toISOString(),
    updatedAt: now.toISOString(),
    recall: "",
    reflection: "",
    confidence: null,
    checks: {},
    labComplete: false,
    labEvidence: [],
    practicedAt: null,
    reviewDueAt: null,
    reviews: [],
  };
}
export function validateState(input) {
  if (
    !input ||
    input.schema !== 1 ||
    input.course !== COURSE ||
    !input.lessons ||
    typeof input.lessons !== "object" ||
    Array.isArray(input.lessons)
  )
    throw new Error("This is not a compatible Fieldnotes backup.");
  const result = blankState();
  for (const [id, raw] of Object.entries(input.lessons)) {
    if (!validIds.has(id) || !raw || typeof raw !== "object")
      throw new Error(
        "This backup contains an unknown lesson or an invalid entry.",
      );
    const entry = blankEntry(new Date(0));
    entry.startedAt = date(raw.startedAt) || entry.startedAt;
    entry.updatedAt = date(raw.updatedAt) || entry.updatedAt;
    entry.recall = text(raw.recall);
    entry.reflection = text(raw.reflection);
    entry.confidence =
      Number.isInteger(raw.confidence) &&
      raw.confidence >= 1 &&
      raw.confidence <= 5
        ? raw.confidence
        : null;
    entry.labComplete = raw.labComplete === true;
    entry.labEvidence = Array.isArray(raw.labEvidence)
      ? raw.labEvidence
          .filter((v) => typeof v === "string")
          .slice(-30)
          .map((v) => v.slice(0, 250))
      : [];
    for (const key of ["q1", "q2", "review"]) {
      const check = raw.checks?.[key];
      if (check && typeof check === "object")
        entry.checks[key] = {
          attempts: count(check.attempts),
          correct: check.correct === true,
          hinted: check.hinted === true,
          choice:
            Number.isInteger(check.choice) &&
            check.choice >= 0 &&
            check.choice < 4
              ? check.choice
              : null,
        };
    }
    entry.practicedAt = date(raw.practicedAt);
    entry.reviewDueAt = date(raw.reviewDueAt);
    entry.reviews = Array.isArray(raw.reviews)
      ? raw.reviews
          .filter((r) => r && date(r.at))
          .slice(-50)
          .map((r) => ({
            at: date(r.at),
            correct: r.correct === true,
            assisted: r.assisted === true,
          }))
      : [];
    result.lessons[id] = entry;
  }
  return result;
}
export function practiceReady(entry) {
  return Boolean(
    entry?.labComplete &&
      entry.checks?.q1?.correct &&
      entry.checks?.q2?.correct &&
      entry.reflection.trim().length >= 30,
  );
}
export function entryStatus(entry, now = new Date()) {
  if (!entry) return "Not started";
  if (!entry.practicedAt) return "In progress";
  if (entry.reviewDueAt && new Date(entry.reviewDueAt) <= now)
    return "Review due";
  return "Practised";
}
export function addDays(now, days) {
  const next = new Date(now);
  next.setDate(next.getDate() + days);
  return next.toISOString();
}
export function completePractice(entry, now = new Date()) {
  if (!practiceReady(entry))
    throw new Error(
      "Complete the lab and both checks, then add your explanation (at least 30 characters).",
    );
  if (entry.practicedAt) return entry;
  return {
    ...entry,
    practicedAt: now.toISOString(),
    reviewDueAt: addDays(now, 2),
    updatedAt: now.toISOString(),
  };
}
export function recordReview(entry, correct, assisted, now = new Date()) {
  if (!entry?.practicedAt)
    throw new Error("Save a practice session before recording a review.");
  if (!entry.reviewDueAt || new Date(entry.reviewDueAt) > now)
    throw new Error(
      "This spaced review is not due yet. You can revisit the lesson meanwhile.",
    );
  return {
    ...entry,
    reviews: [
      ...entry.reviews,
      {
        at: now.toISOString(),
        correct: Boolean(correct),
        assisted: Boolean(assisted),
      },
    ].slice(-50),
    reviewDueAt: addDays(now, correct && !assisted ? 7 : 1),
    updatedAt: now.toISOString(),
  };
}
export function mergeStates(current, incoming) {
  const merged = validateState(current),
    safe = validateState(incoming);
  for (const [id, entry] of Object.entries(safe.lessons)) {
    if (
      !merged.lessons[id] ||
      new Date(entry.updatedAt) > new Date(merged.lessons[id].updatedAt)
    )
      merged.lessons[id] = entry;
  }
  return merged;
}
export function createStore(suppliedStorage) {
  let storage = suppliedStorage,
    state = blankState(),
    readError = null,
    writeError = null;
  try {
    storage = storage || globalThis.localStorage;
    if (!storage) throw new Error("Storage unavailable");
    const raw = storage.getItem(STORAGE_KEY);
    if (raw) state = validateState(JSON.parse(raw));
  } catch (error) {
    readError =
      "Saved progress could not be read. Existing data has been left untouched. Restore a valid backup from Backups.";
  }
  const emit = () => {
    if (typeof window !== "undefined")
      window.dispatchEvent(new CustomEvent("fieldnotes:change"));
  };
  function persist(next, { restore = false } = {}) {
    if (readError && !restore) throw new Error(readError);
    const safe = validateState(next);
    try {
      storage.setItem(STORAGE_KEY, JSON.stringify(safe));
    } catch (error) {
      state = safe;
      writeError =
        "Progress could not be saved in this browser. Your current work is kept in memory; export a backup before leaving.";
      emit();
      throw new Error(writeError);
    }
    state = safe;
    readError = null;
    writeError = null;
    emit();
    return state;
  }
  return {
    get: () => structuredClone(state),
    error: () => readError || writeError,
    entry: (id) =>
      state.lessons[id] ? structuredClone(state.lessons[id]) : null,
    update(id, change) {
      if (!validIds.has(id)) throw new Error("Unknown lesson.");
      const next = structuredClone(state),
        entry = next.lessons[id] || blankEntry();
      next.lessons[id] = {
        ...entry,
        ...change,
        updatedAt: new Date().toISOString(),
      };
      return persist(next).lessons[id];
    },
    practice(id) {
      const next = structuredClone(state);
      next.lessons[id] = completePractice(next.lessons[id]);
      return persist(next).lessons[id];
    },
    review(id, correct, assisted) {
      const next = structuredClone(state);
      next.lessons[id] = recordReview(next.lessons[id], correct, assisted);
      return persist(next).lessons[id];
    },
    import(input) {
      return persist(mergeStates(state, input), { restore: true });
    },
    export: () => ({
      ...structuredClone(state),
      exportedAt: new Date().toISOString(),
    }),
  };
}
export const store = typeof window === "undefined" ? null : createStore();
