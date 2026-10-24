export const USERS = {
  mina: { id: 17, name: "Mina" },
  owen: { id: 28, name: "Owen" },
};
export function createNoteCache(scoped = false) {
  const cache = new Map();
  let now = 0,
    reads = 0;
  const records = {
    17: [{ id: "N-17", owner: 17, title: "Mina’s release notes" }],
    28: [{ id: "N-28", owner: 28, title: "Owen’s research notes" }],
  };
  return {
    get now() {
      return now;
    },
    get reads() {
      return reads;
    },
    get keys() {
      return [...cache.keys()];
    },
    advance(seconds) {
      now += seconds;
    },
    clear() {
      cache.clear();
    },
    changeTitle(user, title) {
      records[user.id] = records[user.id].map((note) => ({ ...note, title }));
    },
    empty(user) {
      records[user.id] = [];
    },
    read(user) {
      if (!Object.values(USERS).some((known) => known.id === user?.id))
        return { status: 401, notes: [], hit: false, key: null };
      const key = scoped ? `notes:${user.id}` : "notes",
        entry = cache.get(key);
      if (entry && entry.expires > now)
        return {
          status: 200,
          notes: structuredClone(entry.notes),
          hit: true,
          key,
        };
      reads++;
      const notes = structuredClone(records[user.id]);
      cache.set(key, { notes, expires: now + 60 });
      return { status: 200, notes, hit: false, key };
    },
  };
}
export function createSessionModel() {
  let cookie = null,
    now = 0,
    serial = 0,
    claim = "Mina";
  const records = new Map();
  return {
    get cookie() {
      return cookie;
    },
    get now() {
      return now;
    },
    get claim() {
      return claim;
    },
    get records() {
      return [...records].map(([id, record]) => ({ id, ...record }));
    },
    signIn() {
      cookie = `demo-session-${++serial}`;
      records.set(cookie, { user: "Mina", expires: now + 300 });
      return cookie;
    },
    setClaim(value) {
      claim = value;
    },
    expire() {
      now += 301;
    },
    logout() {
      if (cookie) records.delete(cookie);
      cookie = null;
    },
    request() {
      const record = records.get(cookie);
      return record && record.expires > now
        ? { status: 200, user: record.user }
        : { status: 401, user: null };
    },
  };
}
function hasExpectedNote(result, user) {
  return (
    result.status === 200 &&
    result.notes.length === 1 &&
    result.notes[0].id === `N-${user.id}` &&
    result.notes[0].owner === user.id
  );
}
export const TEST_CASES = {
  single: {
    label: "One user reads with an empty cache",
    run(model) {
      return hasExpectedNote(model.read(USERS.mina), USERS.mina);
    },
  },
  cross: {
    label: "Mina reads, then Owen reads the warm cache",
    run(model) {
      return [USERS.mina, USERS.owen].every((user) =>
        hasExpectedNote(model.read(user), user),
      );
    },
  },
  reverse: {
    label: "Owen reads, then Mina reads the warm cache",
    run(model) {
      return [USERS.owen, USERS.mina].every((user) =>
        hasExpectedNote(model.read(user), user),
      );
    },
  },
  hit: {
    label: "One user repeats a cached request",
    run(model) {
      model.read(USERS.mina);
      model.read(USERS.mina);
      return model.reads === 1;
    },
  },
  expiry: {
    label: "Updated data becomes visible after expiry",
    run(model) {
      model.read(USERS.mina);
      model.changeTitle(USERS.mina, "Updated note");
      model.advance(60);
      return model.read(USERS.mina).notes[0].title === "Updated note";
    },
  },
  empty: {
    label: "An empty list is still a cached result",
    run(model) {
      model.empty(USERS.mina);
      model.read(USERS.mina);
      return model.read(USERS.mina).notes.length === 0 && model.reads === 1;
    },
  },
};
export function runReviewCases(ids) {
  return ids
    .filter((id) => Object.hasOwn(TEST_CASES, id))
    .map((id) => ({
      id,
      label: TEST_CASES[id].label,
      buggy: TEST_CASES[id].run(createNoteCache(false)),
      fixed: TEST_CASES[id].run(createNoteCache(true)),
    }));
}
