// Small inspectable teaching models; no host processes, Git, Docker or SQL run here.
export function createServiceModel() {
  let configuredPort = 8000,
    activePort = null;
  return {
    get snapshot() {
      return { configuredPort, activePort, running: activePort !== null };
    },
    configure(port) {
      if (![8000, 9000].includes(port))
        throw new Error("Use one of the demo ports.");
      configuredPort = port;
    },
    start() {
      activePort = configuredPort;
    },
    stop() {
      activePort = null;
    },
    request(port, path = "/health") {
      if (activePort === null || port !== activePort)
        return { transport: "refused", status: null, body: null };
      return path === "/health"
        ? {
            transport: "connected",
            status: 200,
            body: { service: "orders-demo", port: activePort },
          }
        : {
            transport: "connected",
            status: 404,
            body: { error: "route_not_found" },
          };
    },
  };
}
export function quoteTotal(amount) {
  if (!Number.isInteger(amount) || amount < 0 || amount > 1000000)
    throw new Error("amount_cents must be an integer from 0 to 1000000.");
  return amount - Math.floor(amount / 10);
}
export function runQuote({ amount, source = "http", layout = "shared" }) {
  if (
    !["http", "job"].includes(source) ||
    !["shared", "duplicated"].includes(layout)
  )
    throw new Error("Unknown adapter or layout.");
  let total;
  try {
    total = quoteTotal(amount);
  } catch (error) {
    return {
      status: source === "http" ? 400 : "rejected",
      total: null,
      writes: 0,
      error: error.message,
    };
  }
  if (layout === "duplicated" && source === "job")
    total = amount - Math.floor(amount / 20);
  return { status: source === "http" ? 200 : "saved", total, writes: 1 };
}
export const MERGE_RULES = {
  main: { threshold: 10000, divisor: 20 },
  feature: { threshold: 5000, divisor: 10 },
  combined: { threshold: 10000, divisor: 10 },
};
export function mergeDiscount(amount, resolution) {
  if (!Object.hasOwn(MERGE_RULES, resolution))
    throw new Error("Choose a resolution.");
  const { threshold, divisor } = MERGE_RULES[resolution];
  return amount < threshold ? 0 : Math.floor(amount / divisor);
}
export function mergeChecks(resolution) {
  return [
    [9999, 0],
    [10000, 1000],
    [20000, 2000],
  ].map(([amount, expected]) => ({
    amount,
    expected,
    actual: mergeDiscount(amount, resolution),
    pass: mergeDiscount(amount, resolution) === expected,
  }));
}
export function frozenInstall(manifestMatches, lockPresent) {
  return !lockPresent
    ? {
        ok: false,
        reason: "No lockfile present: npm ci requires an existing lockfile.",
      }
    : !manifestMatches
      ? {
          ok: false,
          reason:
            "npm ci rejects a manifest/lock mismatch instead of rewriting the lock.",
        }
      : {
          ok: true,
          reason:
            "Restore the locked graph with npm ci; runtime, registry access and platform still matter.",
        };
}
export function createContainerModel() {
  let container = null,
    volume = 0,
    next = 0;
  return {
    get snapshot() {
      return { container: container ? { ...container } : null, volume };
    },
    create({ persistent = false, published = true } = {}) {
      if (container)
        throw new Error(
          "Remove the demo container before creating its replacement.",
        );
      container = {
        id: ++next,
        running: true,
        persistent,
        published,
        writable: 0,
        image: "counter-demo:v1",
      };
    },
    stop() {
      if (container) container.running = false;
    },
    start() {
      if (container) container.running = true;
    },
    remove() {
      container = null;
    },
    increment() {
      if (!container?.running)
        return { ok: false, reason: "The process is stopped or absent." };
      if (!container.published)
        return {
          ok: false,
          reason: "No host port is published in this model.",
        };
      const value = container.persistent ? ++volume : ++container.writable;
      return { ok: true, value };
    },
  };
}
export function grainRows(fixture, mode) {
  if (!["fanout", "distinct", "aggregate"].includes(mode))
    throw new Error("Unknown query preset.");
  if (mode === "aggregate")
    return fixture.orders.map((order) => ({
      order_id: order.id,
      line_total: fixture.lines
        .filter((line) => line.order_id === order.id)
        .reduce((sum, line) => sum + line.amount, 0),
      payment_total: fixture.payments
        .filter((payment) => payment.order_id === order.id)
        .reduce((sum, payment) => sum + payment.amount, 0),
    }));
  return fixture.orders.flatMap((order) => {
    const lines = fixture.lines.filter((line) => line.order_id === order.id);
    const payments = fixture.payments.filter(
      (payment) => payment.order_id === order.id,
    );
    if (!lines.length || !payments.length) return [];
    return [
      {
        order_id: order.id,
        line_total:
          mode === "distinct"
            ? [...new Set(lines.map((line) => line.amount))].reduce(
                (s, n) => s + n,
                0,
              )
            : lines.reduce((s, line) => s + line.amount, 0) * payments.length,
        payment_total:
          mode === "distinct"
            ? [...new Set(payments.map((payment) => payment.amount))].reduce(
                (s, n) => s + n,
                0,
              )
            : payments.reduce((s, payment) => s + payment.amount, 0) *
              lines.length,
      },
    ];
  });
}
