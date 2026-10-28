export const COURSE = "fieldnotes-engineering-v1";
export const COURSE_START = "2026-11-03";
export const DOMAINS = {
  web: { name: "Web fundamentals", short: "Web", color: "#315fec" },
  code: {
    name: "Programming & databases",
    short: "Code & data",
    color: "#7b54a2",
  },
  infra: { name: "Infrastructure", short: "Infrastructure", color: "#0a7f82" },
  reliability: {
    name: "Reliability & delivery",
    short: "Reliability",
    color: "#ba6107",
  },
  data: { name: "Data systems", short: "Data systems", color: "#527136" },
  agents: {
    name: "Product & agent workflow",
    short: "Agent workflow",
    color: "#ad4f76",
  },
  review: { name: "Mixed reviews", short: "Review", color: "#52617b" },
};
const items = [
  [
    "request-trace",
    "web",
    "Where did this value come from?",
    "Trace a request and separate the response from what the page displays.",
    "0001-request-response.html",
  ],
  [
    "authentication",
    "web",
    "Prove who is signing in",
    "Follow identity verification and distinguish it from permission checks.",
    "0002-authentication.html",
  ],
  [
    "sessions",
    "web",
    "A session has two sides",
    "Connect a browser-held identifier to server-held identity and validity.",
    "0003-sessions.html",
  ],
  [
    "cache-isolation",
    "web",
    "Keep each user’s data separate",
    "Trace a shared cache through two users and repair its isolation boundary.",
    "0004-cache-isolation.html",
  ],
  [
    "agent-verification",
    "agents",
    "Evidence before approval",
    "Build a regression check that catches a plausible agent mistake.",
    "0005-agent-verification.html",
  ],
  [
    "api-contracts",
    "web",
    "Make an API promise",
    "Specify inputs, errors, pagination, and compatibility.",
    "0006-api-contracts.html",
  ],
  [
    "python-debug",
    "code",
    "Hardware for scripts: CPU, RAM, and I/O",
    "Profile a Python script and compare eager loading with streaming to explain CPU work, memory use, and I/O waits.",
    "0007-hardware-resources.html",
  ],
  [
    "sql-joins",
    "code",
    "Keep the rows you intended",
    "Test joins, filters, nulls, and aggregation with edge-case fixtures.",
    "0008-sql-outer-joins.html",
  ],
  [
    "cache-freshness",
    "web",
    "How old may this value be?",
    "Connect cache keys, hits, misses, and TTL to an acceptable freshness rule.",
    "0009-cache-freshness.html",
  ],
  [
    "cache-invalidation",
    "web",
    "When the underlying data changes",
    "Choose what to invalidate and verify the next read.",
    "0010-cache-invalidation.html",
  ],
  [
    "processes-ports",
    "infra",
    "Find the running service",
    "Connect processes, listening ports, environment, and configuration.",
    "0011-processes-ports.html",
  ],
  [
    "code-boundaries",
    "code",
    "Give each rule a home",
    "Separate request handling, business rules, and storage.",
    "0012-code-boundaries.html",
  ],
  [
    "git-dependencies",
    "reliability",
    "Make a change reproducible",
    "Read a diff, resolve a conflict, and understand pinned dependencies.",
    "0013-git-dependencies.html",
  ],
  [
    "docker-basics",
    "infra",
    "An image becomes a container",
    "Build a repeatable local run and identify persistent state.",
    "0014-docker-basics.html",
  ],
  [
    "sql-grain",
    "code",
    "One row means one thing",
    "Define grain, keys, and constraints before trusting a metric.",
    "0015-sql-grain.html",
  ],
  [
    "browser-origins",
    "web",
    "Understand the browser boundary",
    "Investigate browser state, JavaScript, origins, and CORS.",
  ],
  [
    "test-boundaries",
    "reliability",
    "Test behaviour at a boundary",
    "Choose useful unit and integration checks, including a negative case.",
  ],
  [
    "transactions",
    "code",
    "Two requests at once",
    "Trace a race condition and protect the intended database result.",
  ],
  [
    "idempotent-imports",
    "data",
    "Retry without duplicating effects",
    "Implement a stable-identity import and replay a partial run.",
  ],
  [
    "dns-tls-nginx",
    "infra",
    "Follow a request into the server",
    "Connect DNS, TLS, reverse proxies, and the application runtime.",
  ],
  [
    "product-criteria",
    "agents",
    "Define what better means",
    "Turn a user problem into measurable acceptance criteria and constraints.",
  ],
  [
    "logs-sentry",
    "reliability",
    "Find the evidence of failure",
    "Use logs, request context, and error reporting to narrow a cause.",
  ],
  [
    "web-security",
    "web",
    "Follow the trust boundary",
    "Investigate a focused injection, XSS, or CSRF example.",
  ],
  [
    "dbt-quality",
    "data",
    "Make a data assumption executable",
    "Build a small dbt model with quality checks and documentation.",
  ],
  [
    "python-errors",
    "code",
    "Handle the failure path",
    "Validate input, manage exceptions, and test a small API client.",
  ],
  [
    "container-network",
    "infra",
    "Connect the local stack",
    "Explain container networks, volumes, configuration, and service discovery.",
  ],
  [
    "context-packets",
    "agents",
    "Give the agent the right context",
    "Prepare a bounded task with relevant sources, constraints, and checks.",
  ],
  [
    "ci-delivery",
    "reliability",
    "Let the checks travel with the change",
    "Run verification in CI and explain the release boundary.",
  ],
  [
    "orchestration",
    "data",
    "Dependencies, schedules, and events",
    "Distinguish a scheduled workflow from a queue or webhook.",
  ],
  [
    "query-plans",
    "code",
    "Measure before optimising",
    "Inspect a query plan and recognise an N+1 access pattern.",
  ],
  [
    "mixed-trace",
    "review",
    "Trace an unfamiliar failure",
    "Apply the same reasoning to a changed scenario without the worked example.",
  ],
  [
    "load-balancing",
    "infra",
    "One application, several instances",
    "Explain shared state, routing, and where Kubernetes fits.",
  ],
  [
    "airflow-failures",
    "data",
    "A workflow fails halfway",
    "Use a small Airflow example to inspect retries, dependencies, and recovery.",
  ],
  [
    "recovery",
    "reliability",
    "Make the way back explicit",
    "Reason through migrations, rollback, backups, and a restore check.",
  ],
  [
    "agent-diff",
    "agents",
    "Review the actual change",
    "Check the diff, its evidence, and the assumptions it leaves behind.",
  ],
  [
    "interview-practice",
    "review",
    "Explain a system out loud",
    "Practise a short interview with concrete examples and honest limits.",
  ],
  [
    "capstone",
    "review",
    "Show what you can verify",
    "Revisit the reference project and assemble reproducible portfolio evidence.",
  ],
];
function weekdayDates(start, count) {
  const dates = [];
  for (
    let day = new Date(`${start}T12:00:00Z`);
    dates.length < count;
    day.setUTCDate(day.getUTCDate() + 1)
  ) {
    if (day.getUTCDay() !== 0 && day.getUTCDay() !== 6)
      dates.push(day.toISOString().slice(0, 10));
  }
  return dates;
}
const dates = weekdayDates(COURSE_START, items.length);
export const lessons = items.map(
  ([id, domain, title, objective, file], index) => ({
    id,
    domain,
    title,
    objective,
    file: file || null,
    ready: Boolean(file),
    number: index + 1,
    date: dates[index],
    minutes: 30,
  }),
);
export const readyLessons = lessons.filter((lesson) => lesson.ready);
export const lessonById = (id) => lessons.find((lesson) => lesson.id === id);
export const matchesLesson = (lesson, query) =>
  `${lesson.id} ${lesson.title} ${lesson.objective} ${DOMAINS[lesson.domain].name}`
    .toLowerCase()
    .includes(query.trim().toLowerCase());
export const lessonUrl = (lesson, base = "./") =>
  `${base}lessons/${lesson.file}`;
export const formatDate = (value, month = "short") =>
  new Intl.DateTimeFormat("en", { month, day: "numeric" }).format(
    new Date(`${value.slice(0, 10)}T12:00:00`),
  );
export const escapeHtml = (value) =>
  String(value ?? "").replace(
    /[&<>"']/g,
    (char) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        char
      ],
  );
