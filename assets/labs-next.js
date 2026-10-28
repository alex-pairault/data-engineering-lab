import { controls, button, frame, log, status } from "./lab-ui.js";
import { escapeHtml as e } from "./curriculum.js";
import {
  catalogResponse,
  catalogContractErrors,
  paidTotals,
  createPriceCache,
  createInvalidationScenario,
  validateResourceReport,
} from "./next-models.js";
const tail =
  '<div class="lab-status" role="status"></div><div class="lab-log" aria-label="Experiment observations">No observations yet.</div>';
const rowsTable = (rows) =>
  `<div class="table-scroll"><table class="result-table"><thead><tr><th scope="col">Customer</th><th scope="col">Name</th><th scope="col">Paid total</th></tr></thead><tbody>${rows.map((row) => `<tr><td>${row.customer_id}</td><td>${e(row.name)}</td><td>${row.paid_total === null ? "NULL" : row.paid_total}</td></tr>`).join("")}</tbody></table></div>`;
function apiLab(root, complete) {
  frame(
    root,
    "A contract has two sides",
    `<div class="node-track" role="img" aria-label="Validate the request, produce a response, then check the response against the existing client contract."><div class="node">Request<span>GET /v1/products</span></div><span class="node-connector" aria-hidden="true">→</span><div class="node">Server validation<span>limit is 1 or 2</span></div><span class="node-connector" aria-hidden="true">→</span><div class="node">Client contract<span>items[].price_cents is an integer</span></div></div><div class="lab-split"><div><label class="field-label" for="api-limit">Requested limit</label><select id="api-limit"><option value="2">2</option><option value="1">1</option><option value="0">0 (invalid)</option><option value="many">many (invalid)</option></select></div><div><label class="field-label" for="api-shape">Shape served by the same v1 endpoint</label><select id="api-shape"><option value="stable">Keep price_cents as an integer</option><option value="breaking">Replace price_cents with a price object</option></select></div></div><p class="small muted" id="api-request" style="margin-top:18px">No request yet.</p>${controls(button("request", "Send modeled request", "button") + button("next", "Request next page"))}<p id="api-result" class="notice" aria-live="polite">Predict what the old client will accept.</p><pre id="api-body">Response body</pre>${tail}<p class="figure-caption">A local JavaScript server/client model. It executes validation and contract checks, but sends no network request and starts no API server. The 400 rule is this example's documented choice.</p>`,
  );
  let nextCursor = null;
  const seen = new Set();
  const nextButton = root.querySelector("[data-action=next]");
  nextButton.disabled = true;
  function send(cursor = "") {
    const limit = root.querySelector("#api-limit").value,
      breaking = root.querySelector("#api-shape").value === "breaking";
    const response = catalogResponse({ limit, cursor, breaking });
    const errors =
      response.status === 200 ? catalogContractErrors(response.body) : [];
    root.querySelector("#api-request").textContent =
      `GET /v1/products?limit=${limit}${cursor ? `&cursor=${cursor}` : ""}`;
    root.querySelector("#api-body").textContent = JSON.stringify(
      response.body,
      null,
      2,
    );
    const message =
      response.status !== 200
        ? "Request rejected with a structured error."
        : errors.length
          ? "HTTP 200, but the old client contract FAILS."
          : "HTTP 200 and the old client contract passes.";
    root.querySelector("#api-result").textContent =
      `${response.status} · ${message}${errors.length ? ` ${errors.join("; ")}` : ""}`;
    nextCursor =
      response.status === 200 && !errors.length
        ? response.body.next_cursor
        : null;
    nextButton.disabled = !nextCursor;
    if (response.status === 400) seen.add("invalid");
    else if (errors.length) seen.add("breaking");
    else {
      seen.add("compatible");
      if (cursor) seen.add("page");
    }
    log(
      root,
      `${cursor ? "Next page" : "First page"} → ${response.status}; ${errors.length ? "response shape rejected" : response.status === 400 ? "invalid input" : "contract passed"}`,
    );
    status(
      root,
      `${seen.size}/4 observations: valid input, invalid input, pagination, and a breaking response change.`,
    );
    if (seen.size === 4)
      complete([
        "Observed documented request validation and a structured 400 error",
        "Followed a returned next-page cursor",
        "Rejected a breaking response shape despite status 200",
      ]);
  }
  root.querySelector("[data-action=request]").onclick = () => send();
  nextButton.onclick = () => {
    if (nextCursor) send(nextCursor);
  };
}
function resourceLab(root, complete) {
  frame(
    root,
    "Measure the script on your machine",
    `<div class="node-track" role="img" aria-label="Storage supplies records into RAM, then CPU cores process them. Hardware caches sit near the CPU."><div class="node">Storage / I/O<span>Move the file's bytes</span></div><span class="node-connector" aria-hidden="true">↔</span><div class="node">RAM<span>Keep the working objects</span></div><span class="node-connector" aria-hidden="true">↔</span><div class="node">CPU + caches<span>Execute and reuse data</span></div></div><p>Run the prepared standard-library exercise locally. It uses bounded synthetic records and compares two input sizes in fresh processes.</p><p style="margin-top:12px"><a class="button-secondary" href="../assets/exercises/profile_records.py" download>Download Python exercise</a></p><pre><code>python profile_records.py &gt; resource-report.json</code></pre><label class="field-label" for="resource-report">Paste your resource-report.json contents</label><textarea id="resource-report" rows="6" maxlength="30000" placeholder="Paste the JSON produced by the script. Nothing is uploaded."></textarea>${controls(button("inspect", "Inspect local report", "button"))}<div id="resource-results" aria-live="polite"></div><label class="field-label"><input type="checkbox" id="resource-ran"> I ran the script locally and compared both input sizes.</label>${controls(button("record", "Record my comparison"))}${tail}<p class="figure-caption">The page does not run Python or benchmark your hardware. Report validation checks structure, counts, and checksums; it does not authenticate the file or grade your explanation. Only a short measurement summary is saved.</p>`,
  );
  let report = null;
  const inspect = root.querySelector("[data-action=inspect]"),
    record = root.querySelector("[data-action=record]");
  record.disabled = true;
  const reset = () => {
    report = null;
    record.disabled = true;
    root.querySelector("#resource-ran").checked = false;
    root.querySelector("#resource-results").replaceChildren();
  };
  root.querySelector("#resource-report").addEventListener("input", reset);
  inspect.onclick = () => {
    reset();
    try {
      report = validateResourceReport(
        JSON.parse(root.querySelector("#resource-report").value),
      );
      const max = Math.max(
        1,
        ...report.cases.map((run) => run.traced_peak_bytes),
      );
      const mib = (value) => (value / 1048576).toFixed(2);
      root.querySelector("#resource-results").innerHTML =
        `<div class="table-scroll"><table class="result-table"><caption>Measured locally; timing and allocation tracing use separate runs.</caption><thead><tr><th>Mode / rows</th><th>Elapsed s</th><th>CPU s</th><th>Traced peak MiB</th><th>Process peak RSS MiB</th></tr></thead><tbody>${report.cases.map((run) => `<tr><td>${run.mode} / ${run.rows}</td><td>${run.elapsed_s.toFixed(4)}</td><td>${run.cpu_s.toFixed(4)}</td><td>${mib(run.traced_peak_bytes)}</td><td>${run.rss_peak_bytes === null ? "Unavailable" : mib(run.rss_peak_bytes)}</td></tr>`).join("")}</tbody></table></div><div class="resource-bars" aria-label="Comparison of peak traced Python allocations">${report.cases.map((run) => `<div><span>${run.mode} · ${run.rows} rows · ${mib(run.traced_peak_bytes)} MiB</span><progress max="${max}" value="${run.traced_peak_bytes}" aria-label="${run.mode}, ${run.rows} rows: ${mib(run.traced_peak_bytes)} MiB peak traced allocations"></progress></div>`).join("")}</div><p class="small muted">RSS includes the process baseline and is not the same as traced Python allocations. File generation/startup are excluded from timings; OS file caching can affect repeated reads.</p>`;
      record.disabled = false;
      status(
        root,
        "Four cases validated with equal output. Compare how peak allocations change when input doubles.",
        "success",
      );
      log(
        root,
        "Validated counts/checksums for eager and stream at two input sizes.",
      );
    } catch (error) {
      status(
        root,
        error instanceof SyntaxError
          ? "This is not valid JSON. Your saved progress is unchanged."
          : error.message,
        "danger",
      );
    }
  };
  record.onclick = () => {
    if (!report) return;
    if (!root.querySelector("#resource-ran").checked) {
      status(
        root,
        "Run the script and compare both sizes before recording your observation.",
      );
      return;
    }
    const summary = report.cases.map(
      (run) =>
        `${run.mode}/${run.rows}: ${(run.traced_peak_bytes / 1048576).toFixed(2)} MiB traced peak`,
    );
    complete([
      "Learner supplied a local report with four consistent counts/checksums",
      "Learner reported running and comparing both input sizes",
      ...summary,
    ]);
    status(
      root,
      "Your comparison is recorded as guided practice. Explain what the measurements support and what they cannot establish.",
      "success",
    );
  };
}
async function sqlLab(root, complete) {
  frame(
    root,
    "Keep every customer in the result",
    `<p>Requirement: one row per customer, summing only paid orders. Customers with no qualifying orders get zero. Amounts are synthetic integer units.</p><div id="sql-fixture"></div><label class="field-label" for="sql-mode">Choose a query to investigate</label><select id="sql-mode"><option value="where">WHERE filters the right-hand table</option><option value="raw">ON filters paid orders, SUM alone</option><option value="on">ON filters paid orders, COALESCE supplies zero</option><option value="case">CASE sums only paid amounts</option></select><pre id="sql-query">Loading the shared fixture…</pre>${controls(button("run", "Run relational model", "button"))}<div id="sql-result" aria-live="polite"></div>${tail}<p class="figure-caption">The browser computes these fixed relational examples in JavaScript; it does not execute arbitrary SQL. Download <a href="../assets/exercises/sql_join_lab.py" download>sql_join_lab.py</a> and <a href="../assets/fixtures/join-data.json" download>join-data.json</a> into the same folder and run <code>python sql_join_lab.py</code> to execute these queries in a real, disposable SQLite database.</p>`,
  );
  const run = root.querySelector("[data-action=run]");
  run.disabled = true;
  try {
    const response = await fetch(
      new URL("./fixtures/join-data.json", import.meta.url),
      { cache: "no-store" },
    );
    if (!response.ok) throw new Error(`Fixture returned ${response.status}`);
    const fixture = await response.json();
    root.querySelector("#sql-fixture").innerHTML =
      `<div class="table-scroll"><table class="result-table"><caption>Customers: ${fixture.customers.map((c) => e(c.name)).join(", ")}. Cy has no orders.</caption><thead><tr><th>Order</th><th>Customer</th><th>Status</th><th>Amount</th></tr></thead><tbody>${fixture.orders.map((order) => `<tr><td>${order.id}</td><td>${order.customer_id}</td><td>${e(order.status)}</td><td>${order.amount}</td></tr>`).join("")}</tbody></table></div>`;
    const seen = new Set(),
      select = root.querySelector("#sql-mode");
    const showQuery = () =>
      (root.querySelector("#sql-query").textContent =
        fixture.queries[select.value]);
    select.onchange = showQuery;
    showQuery();
    run.disabled = false;
    run.onclick = () => {
      const mode = select.value,
        rows = paidTotals(fixture, mode);
      seen.add(mode);
      root.querySelector("#sql-result").innerHTML = rowsTable(rows);
      status(
        root,
        mode === "where"
          ? "Only two customers survive. COALESCE cannot restore the missing groups."
          : mode === "raw"
            ? "All four customers survive, but two sums are NULL."
            : "All four customers survive with paid totals 20, 0, 0, 0.",
        mode === "on" || mode === "case" ? "success" : "",
      );
      log(
        root,
        `${mode}: ${rows.length} customers; totals ${rows.map((row) => (row.paid_total === null ? "NULL" : row.paid_total)).join(", ")}`,
      );
      if (seen.size === 4)
        complete([
          "Observed lost groups after a right-side WHERE filter",
          "Distinguished a retained NULL sum from a missing group",
          "Compared ON/COALESCE and CASE fixes against the same fixture",
        ]);
    };
  } catch (error) {
    status(
      root,
      `Could not load the fixture: ${error.message}. Reload after checking the server.`,
      "danger",
    );
  }
}
function freshnessLab(root, complete) {
  frame(
    root,
    "A live entry may already be stale",
    `<label class="field-label" for="fresh-ttl">Fixed TTL (seconds)</label><select id="fresh-ttl"><option value="10">10</option><option value="30">30</option><option value="5">5</option></select><div class="lab-split" style="margin-top:20px"><div class="lab-box"><h4>Source</h4><p id="fresh-source"></p></div><div class="lab-box"><h4>Application cache</h4><p id="fresh-entry"></p><label class="field-label" for="fresh-remaining">Entry lifetime remaining</label><progress id="fresh-remaining" max="10" value="0"></progress></div></div><p id="fresh-clock" class="small muted" style="margin-top:15px"></p>${controls(button("read", "Read value", "button") + button("change", "Change source +20") + button("advance", "Advance 5 seconds"))}${tail}<p class="figure-caption">A cache-aside model with a fake clock and a current source. Reads do not extend this fixed TTL. No real Redis, database, browser cache, or clock changes are made.</p>`,
  );
  let model = createPriceCache(10);
  const seen = new Set();
  function render() {
    const s = model.snapshot;
    root.querySelector("#fresh-source").textContent =
      `Current value: ${s.source}`;
    root.querySelector("#fresh-entry").textContent = s.entry
      ? `Cached ${s.entry.value}; loaded at ${s.entry.loadedAt}s, expires at ${s.entry.expires}s.`
      : "No entry";
    root.querySelector("#fresh-clock").textContent =
      `Demo clock: ${s.now}s · source loads: ${s.loads}`;
    const progress = root.querySelector("#fresh-remaining");
    progress.max = Number(root.querySelector("#fresh-ttl").value);
    progress.value = s.remaining;
  }
  root.querySelector("[data-action=read]").onclick = () => {
    const r = model.read();
    if (!r.hit && !r.stale)
      seen.add(seen.has("stale") ? "refreshed" : "loaded");
    if (r.hit && r.stale) seen.add("stale");
    log(
      root,
      `t=${r.now}s → ${r.hit ? "HIT" : "MISS"} → ${r.value}${r.stale ? " (source changed; cached value is stale)" : ""}`,
    );
    status(
      root,
      `${r.hit ? "HIT" : "MISS"}: returned ${r.value}. ${r.stale ? "The entry is eligible for reuse but differs from the source." : "Compare the source and the entry lifetime."}`,
      r.stale ? "danger" : "success",
    );
    render();
    if (seen.has("loaded") && seen.has("stale") && seen.has("refreshed"))
      complete([
        "Loaded a value and observed a live but stale cache hit",
        "Advanced past expiry and observed a later miss reload the changed source",
        "Distinguished entry lifetime from freshness of the source value",
      ]);
  };
  root.querySelector("[data-action=change]").onclick = () => {
    model.update(model.snapshot.source + 20);
    render();
    status(
      root,
      "The source changed. Predict the next read before running it.",
    );
    log(
      root,
      `Source changed to ${model.snapshot.source}; the cache was not invalidated.`,
    );
  };
  root.querySelector("[data-action=advance]").onclick = () => {
    model.advance(5);
    render();
    status(
      root,
      "Only time moved. Expiry does not load a replacement; send a read.",
    );
  };
  root.querySelector("#fresh-ttl").onchange = (event) => {
    model = createPriceCache(Number(event.target.value));
    seen.clear();
    render();
    status(
      root,
      "The demo was reset for this TTL. Saved lesson progress is unchanged.",
    );
    log(root, `Reset with fixed TTL ${event.target.value}s.`);
  };
  render();
  status(
    root,
    "Read at t=0, change the source, read again, then advance beyond expiry and read.",
  );
}
function invalidationLab(root, complete) {
  frame(
    root,
    "Control the order of events",
    `<label class="field-label" for="invalidation-strategy">Writer / reader scenario</label><select id="invalidation-strategy"><option value="before">Delete before commit (ordering bug)</option><option value="after">Delete after successful commit</option><option value="rollback">Roll back; no after-commit invalidation</option></select><ol id="invalidation-events" class="event-list"></ol><div class="lab-split"><div class="lab-box"><h4>Committed source</h4><p id="invalidation-source"></p></div><div class="lab-box"><h4>Shared cache</h4><p id="invalidation-cache"></p></div></div>${controls(button("step", "Step next event", "button") + button("reset", "Restart this scenario"))}${tail}<p class="figure-caption">A deterministic, single-key transaction/cache model, with a fake 60-second TTL and no elapsed time. It demonstrates one ordering race. After-commit deletion does not solve late in-flight refills or failed invalidation; those need additional coordination or recovery.</p>`,
  );
  let model = createInvalidationScenario("before");
  const seen = new Set();
  const step = root.querySelector("[data-action=step]");
  function render() {
    const s = model.snapshot;
    root.querySelector("#invalidation-events").innerHTML = model.events
      .map(
        (event, index) =>
          `<li class="${index < s.index ? "done" : ""}">${index < s.index ? "✓ " : ""}${e(event.label)}</li>`,
      )
      .join("");
    root.querySelector("#invalidation-source").textContent =
      `Value ${s.source}${s.pending ? " · update pending, not committed" : ""}`;
    root.querySelector("#invalidation-cache").textContent = s.entry
      ? `Value ${s.entry.value} · eligible until ${s.entry.expires}s`
      : "Empty";
    step.disabled = s.done;
  }
  function reset() {
    model = createInvalidationScenario(
      root.querySelector("#invalidation-strategy").value,
    );
    render();
    status(
      root,
      "The source and cache start at 100. Predict each step before advancing.",
    );
  }
  step.onclick = () => {
    const s = model.step();
    if (!s) return;
    log(
      root,
      `${s.label} → committed ${s.source}, cached ${s.entry ? s.entry.value : "empty"}${s.lastRead ? `; last read ${s.lastRead.value}` : ""}`,
    );
    render();
    if (s.done) {
      const strategy = root.querySelector("#invalidation-strategy").value;
      seen.add(strategy);
      status(
        root,
        strategy === "before"
          ? "The source is 120 but the reader returns cached 100: a stale refill survived commit."
          : strategy === "after"
            ? "The post-commit invalidation makes the next read miss and load 120."
            : "Rollback left the source at 100. No after-commit invalidation ran.",
        strategy === "before" ? "danger" : "success",
      );
      if (seen.size === 3)
        complete([
          "Reproduced delete-before-commit stale refill with a controlled interleaving",
          "Checked the next read after a successful commit and invalidation",
          "Checked rollback: no source change and no after-commit deletion",
        ]);
    } else status(root, "Inspect the state, then predict the next event.");
  };
  root.querySelector("#invalidation-strategy").onchange = reset;
  root.querySelector("[data-action=reset]").onclick = reset;
  reset();
}
export const nextLabs = {
  "api-contracts": apiLab,
  "python-debug": resourceLab,
  "sql-joins": sqlLab,
  "cache-freshness": freshnessLab,
  "cache-invalidation": invalidationLab,
};
