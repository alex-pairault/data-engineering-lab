const table = (columns, rows, trace, note) => ({ columns, rows, trace, note });
function cors(mode) {
  const same = mode === "same",
    preflight = mode === "preflight-denied",
    credentialed = mode === "credentials";
  const origin = "https://app.example.test",
    target = same ? origin : "https://api.example.test";
  const allow = mode === "allowed" ? origin : credentialed ? "*" : null;
  const sent = !preflight,
    readable = same || (allow === origin && !preflight);
  return table(
    ["Observation", "Value"],
    [
      ["Page origin", origin],
      ["API origin", target],
      ["Actual GET sent", sent ? "yes" : "no"],
      ["Response readable by page", readable ? "yes" : "no"],
      ["Allow-Origin", allow ?? "absent"],
    ],
    preflight
      ? [
          "Browser sends OPTIONS for a custom-header request.",
          "Preflight permission is denied.",
          "The actual GET is not sent.",
        ]
      : [
          "Browser sends the simple GET.",
          "Server handles the request.",
          "Browser checks response access.",
        ],
    credentialed
      ? "Credentialed CORS cannot use wildcard Allow-Origin. Authentication remains a separate check."
      : sent && !readable
        ? "The server handled this GET even though page JavaScript cannot read its response."
        : "Origin is scheme, host and effective port; paths do not change it.",
  );
}
function boundaryTests(mode) {
  const pure = (q) => {
    if (!Number.isInteger(q) || q < 1) throw Error("invalid");
    return q * 10;
  };
  const quantity = mode === "happy" ? 2 : 0,
    store = [];
  let status;
  try {
    pure(quantity);
    status = 201;
  } catch {
    status = 400;
  }
  const buggy = mode !== "fixed";
  if (status === 201 || (buggy && mode === "integration")) store.push(quantity);
  const unitPassed = quantity > 0 ? pure(quantity) === 20 : status === 400;
  return table(
    ["Check", "Observed", "Expected", "Result"],
    [
      [
        "Domain result",
        status,
        quantity > 0 ? 201 : 400,
        unitPassed ? "PASS" : "FAIL",
      ],
      [
        "Stored rows",
        store.length,
        status === 400 ? 0 : 1,
        store.length === (status === 400 ? 0 : 1) ? "PASS" : "FAIL",
      ],
    ],
    [
      "Call the domain rule.",
      "Map success or validation error.",
      "Inspect the storage effect separately.",
    ],
    mode === "integration"
      ? "The domain unit check passes, but the application incorrectly writes after rejection. A storage-boundary check exposes it."
      : "A passing unit check establishes only the boundary and cases it exercises.",
  );
}
function network(mode) {
  const stages = [
    "DNS",
    "TLS to proxy",
    "Nginx HTTP handling",
    "HTTP upstream",
  ];
  const fail = { dns: 0, tls: 1, upstream: 3 }[mode];
  return table(
    ["Stage", "Observation"],
    stages.map((stage, i) => [
      stage,
      fail === undefined || i < fail
        ? "succeeds"
        : i === fail
          ? {
              dns: "name lookup fails",
              tls: "certificate identity mismatch",
              upstream: "connection refused",
            }[mode]
          : "not reached",
    ]),
    stages.slice(0, fail === undefined ? 4 : fail + 1),
    mode === "upstream"
      ? "In this controlled case Nginx returns 502 after an upstream refusal. Real 502s have other causes; inspect the proxy error log."
      : mode === "tls"
        ? "No HTTP response is available from this failed TLS exchange. Do not bypass certificate checks."
        : mode === "dns"
          ? "A failed lookup prevents this client from reaching TLS or HTTP."
          : "TLS to Nginx and its HTTP upstream are separate connections. PHP-FPM would use FastCGI configuration instead.",
  );
}
function logs(mode) {
  const records = [
    { request: "r-17", release: "demo-a", stage: "http", status: 200 },
    { request: "r-18", release: "demo-b", stage: "proxy", status: 502 },
    {
      request: "r-18",
      release: "demo-b",
      stage: "upstream_connect",
      status: "refused",
    },
  ];
  const selected =
    mode === "uncorrelated"
      ? records
      : records.filter((r) => r.request === "r-18");
  const planted = { ...selected.at(-1), session_token: "SYNTHETIC_DO_NOT_LOG" };
  const safe = Object.fromEntries(
    Object.entries(planted).filter(([key]) =>
      ["request", "release", "stage", "status"].includes(key),
    ),
  );
  return table(
    ["Request", "Release", "Stage", "Outcome"],
    selected.map((r) => Object.values(r)),
    mode === "scrubbed"
      ? [
          "Start with a deliberately narrow context schema.",
          JSON.stringify(safe),
          "Verify the planted token is absent.",
        ]
      : [
          "Follow request r-18 across components.",
          "Compare release and failing stage before choosing a check.",
        ],
    mode === "scrubbed"
      ? "Only allowed fields are serialized. This local exercise sends no Sentry event."
      : mode === "uncorrelated"
        ? "A nearby 200 belongs to a different request. Correlation matters."
        : "A sample Sentry event would report evidence, not repair the upstream. An issue groups related events; avoid secrets in context.",
  );
}
function injection(mode) {
  const orders = [
    { id: 901, owner: "Mina", note: "paid" },
    { id: 902, owner: "Owen", note: "paid" },
  ];
  const input = mode === "ordinary" ? "paid" : "' OR 1=1 --";
  const bound = mode === "bound";
  const rows = orders.filter((o) =>
    bound
      ? o.owner === "Mina" && o.note === input
      : input.includes("OR 1=1") || (o.owner === "Mina" && o.note === input),
  );
  return table(
    ["Returned order", "Owner"],
    rows.map((o) => [o.id, o.owner]),
    [
      bound
        ? "Bind owner and note as values."
        : "Concatenate text into query syntax.",
      `Input: ${input}`,
      `Returned ${rows.length} rows.`,
    ],
    bound
      ? "The injection-shaped value is data, so it matches nothing. This browser is a fixed relational model; the download executes actual SQLite."
      : "Concatenation lets the planted expression widen the result. Parameter binding does not replace authorization; bind the authenticated owner too.",
  );
}
function api(mode) {
  let attempts = 0,
    state = "unknown",
    error = "none";
  const responses = {
    ok: [200],
    retry: [503, 200],
    json: [200],
    schema: [200],
    timeout: ["timeout"],
    post: ["timeout"],
  }[mode];
  for (const response of responses) {
    attempts++;
    if (response === 503 && mode === "retry") continue;
    if (response === "timeout") {
      error = mode === "post" ? "outcome_unknown" : "transport_timeout";
      break;
    }
    if (mode === "json") {
      error = "invalid_json";
      break;
    }
    if (mode === "schema") {
      error = "invalid_schema";
      break;
    }
    state = "validated";
  }
  return table(
    ["Metric", "Value"],
    [
      ["Method", mode === "post" ? "POST" : "GET"],
      ["Attempts", attempts],
      ["Data state", state],
      ["Error category", error],
    ],
    [
      "Use an explicit per-attempt timeout.",
      "Classify transport, HTTP, parsing and schema boundaries.",
      "Retry only within the chosen bounded policy.",
    ],
    mode === "post"
      ? "A timeout does not establish that a write failed. Do not blindly retry an unknown side effect."
      : mode === "retry"
        ? "This prepared GET retries a selected transient status once; it is not a universal retry policy."
        : "Failure remains explicit instead of becoming a success-shaped empty result.",
  );
}
function peers(mode) {
  const host =
    mode === "loopback"
      ? "127.0.0.1"
      : mode === "host-port"
        ? "app:18080"
        : "app:8000";
  const success = host === "app:8000";
  return table(
    ["Context", "Address", "Outcome"],
    [
      [
        "Proxy container",
        host,
        success ? "reaches peer service" : "wrong endpoint",
      ],
      ["Host browser", "127.0.0.1:18080", "published proxy endpoint"],
      ["Persistent counter", "named volume at /data", "retained on recreation"],
    ],
    [
      "Inside a container, loopback points to itself.",
      "Compose service DNS names locate peers.",
      "Use the peer container port, not its host mapping.",
    ],
    success
      ? "A healthcheck can gate initial readiness; later disconnects still need handling."
      : "A process name or host mapping does not change what localhost means in a bridge-network container.",
  );
}
function trace(mode) {
  const values = mode === "invalidate" ? [120, 120] : [100, 120];
  const rows =
    mode === "browser"
      ? [
          ["A", 100, 120],
          ["B", 120, 120],
        ]
      : [
          ["A", values[0], 120],
          ["B", values[1], 120],
        ];
  return table(
    ["Instance", "HTTP response price", "Database price"],
    rows,
    mode === "browser"
      ? [
          "Disable the browser cache in this controlled scenario.",
          "Compare the response body, not only the displayed text.",
        ]
      : mode === "compare"
        ? [
            "Send equivalent requests to each instance.",
            "Compare response bodies with the same source record.",
          ]
        : [
            "Invalidate the stale application entry on A.",
            "Repeat both instance requests.",
          ],
    mode === "invalidate"
      ? "Both now return 120. Together with the earlier observations, this supports the stale instance-cache hypothesis for this scenario."
      : mode === "compare"
        ? "The responses differ by instance while source data agrees. That narrows the next investigation to server-side state."
        : "Browser cache settings did not change the response split. That observation alone does not identify every possible cause.",
  );
}
function balancing(mode) {
  const shared = mode === "shared" || mode === "revoked";
  const valid = mode !== "revoked";
  const targets = mode === "affinity" ? ["A", "A", "B"] : ["A", "B", "A"];
  const rows = targets.map((server, i) => [
    i + 1,
    server,
    valid && (shared || server === "A") ? 200 : 401,
  ]);
  return table(
    ["Request", "Instance", "HTTP status"],
    rows,
    [
      "Sign in creates a synthetic session on A.",
      "Route subsequent requests across instances.",
      "Check which instance can resolve the session.",
    ],
    mode === "affinity"
      ? "Affinity hides the split until A disappears; it does not replicate local state."
      : shared
        ? "Both replicas consult the shared session store and the same revocation state. Kubernetes does not create this store automatically."
        : "Per-instance session storage causes intermittent authentication when requests reach B.",
  );
}
export const webModels = {
  "browser-origins": {
    title: "Separate sending a request from reading its response",
    diagram: [
      ["Page", "scheme + host + port"],
      ["Browser policy", "same origin / CORS"],
      ["API", "independent authentication"],
    ],
    cases: [
      ["same", "Same-origin GET"],
      ["blocked", "Cross-origin simple GET; no permission"],
      ["preflight-denied", "Custom-header request; preflight denied"],
      ["allowed", "Cross-origin GET; explicit permission"],
      ["credentials", "Credentialed request; wildcard permission"],
    ],
    run: cors,
  },
  "test-boundaries": {
    title: "A pure-rule pass can miss a storage effect",
    diagram: [
      ["Domain unit check", "calculation / validation"],
      ["Application operation", "coordinate rule + write"],
      ["Storage check", "inspect actual effects"],
    ],
    cases: [
      ["happy", "Happy-path domain check"],
      ["integration", "Domain rejection plus incorrect write"],
      ["fixed", "Rejection with no storage write"],
    ],
    run: boundaryTests,
  },
  "dns-tls-nginx": {
    title: "Stop at the first failing connection boundary",
    diagram: [
      ["DNS", "resolve host"],
      ["TLS → Nginx", "verify peer; handle HTTP"],
      ["Application upstream", "separate connection"],
    ],
    cases: [
      ["ok", "Successful request path"],
      ["dns", "DNS lookup failure"],
      ["tls", "Certificate identity mismatch"],
      ["upstream", "Nginx upstream connection refused"],
    ],
    run: network,
  },
  "logs-sentry": {
    title: "Follow one operation through its evidence",
    diagram: [
      ["Request r-18", "release demo-b"],
      ["Proxy log", "502"],
      ["Upstream context", "connection refused"],
    ],
    cases: [
      ["uncorrelated", "Read the mixed request stream"],
      ["correlated", "Correlate request r-18"],
      ["scrubbed", "Serialize only allowed context"],
    ],
    run: logs,
  },
  "web-security": {
    title: "Keep input values out of query syntax",
    diagram: [
      ["Input", "untrusted note text"],
      ["Query boundary", "concatenate or bind"],
      ["Rows", "owner must remain scoped"],
    ],
    cases: [
      ["ordinary", "Ordinary note search"],
      ["unsafe", "Injection-shaped input; concatenation"],
      ["bound", "Same input; bound values"],
    ],
    run: injection,
  },
  "python-errors": {
    title: "Keep failed requests distinguishable",
    diagram: [
      ["Transport / HTTP", "timeout or status"],
      ["Parse / validate", "JSON and schema"],
      ["Caller", "data or explicit error"],
    ],
    cases: [
      ["ok", "Valid response"],
      ["retry", "503 then successful GET"],
      ["json", "Malformed JSON"],
      ["schema", "Valid JSON; wrong schema"],
      ["timeout", "GET timeout"],
      ["post", "POST timeout; outcome unknown"],
    ],
    run: api,
  },
  "container-network": {
    title: "Use the address from the caller’s network context",
    diagram: [
      ["Host", "published 18080"],
      ["Proxy container", "service-name lookup"],
      ["App container", "internal 8000 + volume"],
    ],
    cases: [
      ["loopback", "Peer URL uses container localhost"],
      ["host-port", "Peer URL uses the host port"],
      ["service", "Peer URL uses service name + internal port"],
    ],
    run: peers,
  },
  "mixed-trace": {
    title: "Choose observations before naming the cause",
    attempt: true,
    diagram: [
      ["Request A / B", "same product and caller"],
      ["HTTP bodies", "compare observed values"],
      ["Source record", "current price 120"],
    ],
    cases: [
      ["browser", "Try the browser-cache hypothesis"],
      ["compare", "Compare response and source per instance"],
      ["invalidate", "Test application-cache invalidation"],
    ],
    run: trace,
  },
  "load-balancing": {
    title: "Route the request, then locate session state",
    diagram: [
      ["Load balancer", "A or B"],
      ["Application replicas", "local or shared lookup"],
      ["Session store", "expiry / revocation"],
    ],
    cases: [
      ["local", "Alternating requests; local sessions"],
      ["affinity", "Affinity, then instance A disappears"],
      ["shared", "Alternating requests; shared sessions"],
      ["revoked", "Shared session is revoked"],
    ],
    run: balancing,
  },
};
