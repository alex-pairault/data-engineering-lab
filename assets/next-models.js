// Inspectable lesson mechanisms. These are teaching models, not production APIs/caches.
const PRODUCTS = [
  { id: "P-01", name: "Notebook", price_cents: 1200 },
  { id: "P-02", name: "Pencil", price_cents: 250 },
  { id: "P-03", name: "Folder", price_cents: 700 },
];
export function catalogResponse({
  limit = "2",
  cursor = "",
  breaking = false,
} = {}) {
  const problem = (detail) => ({
    status: 400,
    body: {
      type: "https://example.invalid/problems/invalid-query",
      title: "Invalid query",
      status: 400,
      detail,
    },
  });
  if (!["1", "2"].includes(String(limit)))
    return problem("limit must be 1 or 2.");
  const start = cursor
    ? PRODUCTS.findIndex((product) => `after:${product.id}` === cursor) + 1
    : 0;
  if (cursor && start === 0) return problem("cursor is not recognized.");
  const selected = PRODUCTS.slice(start, start + Number(limit));
  return {
    status: 200,
    body: {
      items: selected.map((product) =>
        breaking
          ? {
              id: product.id,
              name: product.name,
              price: { amount_cents: product.price_cents, currency: "EUR" },
            }
          : { ...product },
      ),
      next_cursor:
        start + selected.length < PRODUCTS.length
          ? `after:${selected.at(-1).id}`
          : null,
    },
  };
}
export function catalogContractErrors(body) {
  const errors = [];
  if (!body || !Array.isArray(body.items)) return ["items must be an array"];
  if (body.next_cursor !== null && typeof body.next_cursor !== "string")
    errors.push("next_cursor must be a string or null");
  for (const item of body.items)
    if (
      !item ||
      typeof item.id !== "string" ||
      typeof item.name !== "string" ||
      !Number.isInteger(item.price_cents) ||
      item.price_cents < 0
    )
      errors.push(
        "each item requires id, name, and a non-negative integer price_cents",
      );
  return errors;
}
export function paidTotals(fixture, mode) {
  if (!["where", "raw", "on", "case"].includes(mode))
    throw new Error("Unknown query preset.");
  return fixture.customers.flatMap((customer) => {
    const all = fixture.orders.filter(
      (order) => order.customer_id === customer.id,
    );
    const paid = all.filter((order) => order.status === "paid");
    if (mode === "where" && !paid.length) return [];
    return [
      {
        customer_id: customer.id,
        name: customer.name,
        paid_total:
          mode === "raw" && !paid.length
            ? null
            : paid.reduce((total, order) => total + order.amount, 0),
      },
    ];
  });
}
export function createPriceCache(ttl = 10) {
  if (!Number.isFinite(ttl) || ttl < 1 || ttl > 120)
    throw new Error("Choose a TTL from 1 to 120 seconds.");
  let now = 0,
    source = 100,
    entry = null,
    loads = 0;
  return {
    get snapshot() {
      return {
        now,
        source,
        loads,
        entry: entry ? { ...entry } : null,
        remaining: entry ? Math.max(0, entry.expires - now) : 0,
      };
    },
    advance(seconds) {
      if (!Number.isFinite(seconds) || seconds < 0)
        throw new Error("Time must move forward.");
      now += seconds;
    },
    update(value) {
      if (!Number.isFinite(value)) throw new Error("Invalid source value.");
      source = value;
    },
    invalidate() {
      entry = null;
    },
    read() {
      const hit = Boolean(entry && entry.expires > now);
      if (!hit) {
        loads++;
        entry = { value: source, loadedAt: now, expires: now + ttl };
      }
      return {
        value: entry.value,
        hit,
        stale: entry.value !== source,
        now,
        age: now - entry.loadedAt,
      };
    },
  };
}
const EVENTS = {
  before: [
    ["begin", "Prepare update to 120"],
    ["invalidate", "Delete before commit"],
    ["read", "Reader fills from old source"],
    ["commit", "Commit source = 120"],
    ["read", "Read after commit"],
  ],
  after: [
    ["begin", "Prepare update to 120"],
    ["read", "Reader sees pre-commit source"],
    ["commit", "Commit source = 120"],
    ["invalidate", "Delete after commit"],
    ["read", "Read after invalidation"],
  ],
  rollback: [
    ["begin", "Prepare update to 120"],
    ["rollback", "Roll back the update"],
    ["read", "Read unchanged source"],
  ],
};
export function createInvalidationScenario(strategy = "before") {
  if (!Object.hasOwn(EVENTS, strategy)) throw new Error("Unknown scenario.");
  const cache = createPriceCache(60);
  cache.read();
  let index = 0,
    pending = false,
    lastRead = null;
  return {
    events: EVENTS[strategy].map(([id, label]) => ({ id, label })),
    get snapshot() {
      return {
        ...cache.snapshot,
        index,
        pending,
        lastRead: lastRead ? { ...lastRead } : null,
        done: index === EVENTS[strategy].length,
      };
    },
    step() {
      if (index >= EVENTS[strategy].length) return null;
      const [id, label] = EVENTS[strategy][index++];
      if (id === "begin") pending = true;
      if (id === "invalidate") cache.invalidate();
      if (id === "commit") {
        cache.update(120);
        pending = false;
      }
      if (id === "rollback") pending = false;
      if (id === "read") lastRead = cache.read();
      return { id, label, ...this.snapshot };
    },
  };
}
export function validateResourceReport(input) {
  if (
    !input ||
    input.kind !== "fieldnotes-resource-report" ||
    input.schema !== 1 ||
    !Array.isArray(input.cases) ||
    input.cases.length !== 4
  )
    throw new Error(
      "Paste a report produced by profile_records.py (four measured cases).",
    );
  const rows = [...new Set(input.cases.map((run) => run?.rows))].sort(
    (a, b) => a - b,
  );
  if (
    rows.length !== 2 ||
    !Number.isInteger(rows[0]) ||
    rows[0] < 1000 ||
    rows[0] > 20000 ||
    rows[1] !== 2 * rows[0]
  )
    throw new Error(
      "The report needs two bounded input sizes, with the second twice the first.",
    );
  const seen = new Set();
  const cases = input.cases.map((run) => {
    const key = `${run.rows}:${run.mode}`;
    if (
      !["eager", "stream"].includes(run.mode) ||
      seen.has(key) ||
      run.count !== run.rows
    )
      throw new Error(
        "Each input size needs one eager and one stream result with the expected count.",
      );
    seen.add(key);
    const expected =
      Math.floor(run.rows / 97) * 4656 +
      ((run.rows % 97) * ((run.rows % 97) - 1)) / 2;
    if (run.checksum !== expected)
      throw new Error(
        "A result differs from the synthetic fixture checksum. Check the script before comparing performance.",
      );
    for (const key of ["elapsed_s", "cpu_s", "traced_peak_bytes"])
      if (!Number.isFinite(run[key]) || run[key] < 0)
        throw new Error("The report contains an invalid measurement.");
    if (
      run.rss_peak_bytes !== null &&
      (!Number.isFinite(run.rss_peak_bytes) || run.rss_peak_bytes < 0)
    )
      throw new Error("The report contains invalid process-memory data.");
    return {
      mode: run.mode,
      rows: run.rows,
      count: run.count,
      checksum: run.checksum,
      elapsed_s: run.elapsed_s,
      cpu_s: run.cpu_s,
      traced_peak_bytes: run.traced_peak_bytes,
      rss_peak_bytes: run.rss_peak_bytes,
    };
  });
  return { kind: input.kind, schema: 1, cases };
}
