import { controls, button, frame, log, status } from "./lab-ui.js";
import {
  createServiceModel,
  runQuote,
  mergeChecks,
  frozenInstall,
  createContainerModel,
  grainRows,
} from "./foundation-models.js";
const tail =
  '<div class="lab-status" role="status"></div><div class="lab-log" aria-label="Experiment observations">No observations yet.</div>';
function serviceLab(root, complete) {
  frame(
    root,
    "Find the endpoint that answers",
    `
    <div class="node-track" role="img" aria-label="A client connects to the address and port on which a process listens. A response status appears only after connecting."><div class="node">Client<span>127.0.0.1 + target port</span></div><span class="node-connector" aria-hidden="true">→</span><div class="node">Listening process<span id="service-active">Stopped</span></div><span class="node-connector" aria-hidden="true">→</span><div class="node">HTTP router<span>/health or /missing</span></div></div>
    <div class="lab-split"><div><label class="field-label" for="service-config">Port configured for the next start</label><select id="service-config"><option>8000</option><option>9000</option></select></div><div><label class="field-label" for="service-target">Client target port</label><select id="service-target"><option>8000</option><option>9000</option></select></div></div>
    <label class="field-label" for="service-path">Request path</label><select id="service-path"><option>/health</option><option>/missing</option></select>
    ${controls(button("start", "Start / restart service", "button") + button("stop", "Stop service") + button("request", "Send modeled request"))}<pre id="service-response">No request yet.</pre>${tail}
    <p class="figure-caption">One IPv4 loopback process/endpoint model, not a network probe. It assumes no firewall or proxy and reports a controlled connection refusal. Real diagnosis also checks address family, protocol and network namespace.</p>`,
  );
  const model = createServiceModel(),
    seen = new Set();
  let restartedPort = null;
  const render = () => {
    const s = model.snapshot;
    root.querySelector("#service-active").textContent = s.running
      ? `Listening on 127.0.0.1:${s.activePort}`
      : "Stopped · no listener";
  };
  const progress = () => {
    status(
      root,
      `${seen.size}/5: refusal, 200, 404, unchanged running configuration, and a restarted listener.`,
    );
    if (seen.size === 5)
      complete([
        "Distinguished no connection from an HTTP 404",
        "Observed startup configuration remain unchanged until restart",
        "Matched the client address/port to the restarted listener",
      ]);
  };
  root.querySelector("#service-config").onchange = (event) => {
    model.configure(Number(event.target.value));
    render();
    log(
      root,
      "Edited next-start configuration; the running listener did not move.",
    );
  };
  root.querySelector("[data-action=start]").onclick = () => {
    const old = model.snapshot;
    if (old.running && old.activePort !== old.configuredPort)
      restartedPort = old.configuredPort;
    model.start();
    render();
    log(root, `Started listener on ${model.snapshot.activePort}.`);
    progress();
  };
  root.querySelector("[data-action=stop]").onclick = () => {
    model.stop();
    render();
    log(root, "Stopped the modeled process.");
  };
  root.querySelector("[data-action=request]").onclick = () => {
    const s = model.snapshot,
      target = Number(root.querySelector("#service-target").value),
      path = root.querySelector("#service-path").value;
    const response = model.request(target, path);
    seen.add(
      response.status === null
        ? "refusal"
        : response.status === 200
          ? "ok"
          : "404",
    );
    if (response.status === 200 && s.activePort !== s.configuredPort)
      seen.add("startup");
    if (response.status === 200 && target === restartedPort)
      seen.add("restart");
    root.querySelector("#service-response").textContent = JSON.stringify(
      response,
      null,
      2,
    );
    log(
      root,
      `${target}${path} → ${response.status === null ? "connection refused; no HTTP status" : `HTTP ${response.status}`}`,
    );
    progress();
  };
  render();
  progress();
}
function boundariesLab(root, complete) {
  frame(
    root,
    "One business rule, two entry points",
    `
    <div class="node-track" role="img" aria-label="HTTP and job callers apply the same domain rule before storage."><div class="node">HTTP / job<span>Translate the input</span></div><span class="node-connector" aria-hidden="true">→</span><div class="node">Domain rule<span>Valid cents; 10% discount</span></div><span class="node-connector" aria-hidden="true">→</span><div class="node">Storage<span>Save a valid total</span></div></div>
    <label class="field-label" for="boundary-layout">Implementation</label><select id="boundary-layout"><option value="duplicated">Duplicated rules: job drifted to 5%</option><option value="shared">Shared domain function: both use 10%</option></select>
    <label class="field-label" for="boundary-amount">Input amount in cents</label><select id="boundary-amount"><option value="10000">10000 (valid)</option><option value="101">101 (rounding case)</option><option value="-1">-1 (invalid)</option></select>
    ${controls(button("compare", "Compare both entry points", "button"))}<pre id="boundary-result">Predict both results.</pre>${tail}
    <p class="figure-caption">A local JavaScript behaviour model. The downloadable Python exercise has a pure domain function, application orchestration, a JSON adapter, and an in-memory repository; neither example is a production API.</p>`,
  );
  const seen = new Set();
  root.querySelector("[data-action=compare]").onclick = () => {
    const layout = root.querySelector("#boundary-layout").value,
      amount = Number(root.querySelector("#boundary-amount").value);
    const http = runQuote({ layout, amount, source: "http" }),
      job = runQuote({ layout, amount, source: "job" });
    root.querySelector("#boundary-result").textContent = JSON.stringify(
      { http, job },
      null,
      2,
    );
    seen.add(amount < 0 ? "invalid" : layout);
    log(
      root,
      `${layout}, amount ${amount}: HTTP ${http.total ?? "rejected"}; job ${job.total ?? "rejected"}; writes ${http.writes + job.writes}.`,
    );
    status(
      root,
      http.total !== job.total
        ? "Duplicated rules disagree for the same business input."
        : amount < 0
          ? "Both callers reject invalid domain input before storage."
          : "Both callers use the same rule and produce the same total.",
      http.total !== job.total ? "danger" : "success",
    );
    if (seen.size === 3)
      complete([
        "Observed policy drift across duplicated entry points",
        "Compared shared-rule results for both callers",
        "Checked invalid inputs do not reach storage",
      ]);
  };
}
function gitLab(root, complete) {
  frame(
    root,
    "Resolve the requirement, then restore the dependency graph",
    `
    <p>Both accepted changes must survive: threshold becomes <strong>10000 cents</strong>; discount rate becomes <strong>10%</strong>. The base had threshold 5000 and rate 5%.</p>
    <div class="node-track" role="img" aria-label="Main changes the threshold; feature changes the rate; a merge must preserve both requirements."><div class="node">main<span>Threshold 10000; rate 5%</span></div><span class="node-connector" aria-hidden="true">→</span><div class="node">Resolved result<span>Check both requirements</span></div><span class="node-connector" aria-hidden="true">←</span><div class="node">feature<span>Threshold 5000; rate 10%</span></div></div>
    <label class="field-label" for="merge-choice">Source resolution</label><select id="merge-choice"><option value="main">Keep main only</option><option value="feature">Keep feature only</option><option value="combined">Combine threshold 10000 and rate 10%</option></select>${controls(button("merge", "Run behavioural checks", "button"))}<div id="merge-result" aria-live="polite"></div>
    <label class="field-label" for="lock-choice">Dependency restore state</label><select id="lock-choice"><option value="mismatch">Manifest differs from committed lock</option><option value="matching">Manifest matches committed lock</option><option value="missing">Lockfile is missing from checkout</option></select>${controls(button("install", "Model npm ci"))}<p id="lock-result" class="notice" aria-live="polite">Predict whether the frozen restore proceeds.</p>${tail}
    <p class="figure-caption">Local fixed-case models; no Git merge or package installation occurs in the page. The downloadable Git exercise creates a real conflict in a new folder. npm ci can replace node_modules in its target project; run it only in the intended checkout.</p>`,
  );
  const sourceSeen = new Set(),
    lockSeen = new Set();
  const done = () => {
    if (
      sourceSeen.size === 3 &&
      lockSeen.has("matching") &&
      lockSeen.has("mismatch")
    )
      complete([
        "Compared both one-sided resolutions against the combined acceptance criterion",
        "Checked the combined source result",
        "Distinguished a matching lock restore from a rejected manifest/lock mismatch",
      ]);
  };
  root.querySelector("[data-action=merge]").onclick = () => {
    const choice = root.querySelector("#merge-choice").value,
      rows = mergeChecks(choice);
    sourceSeen.add(choice);
    root.querySelector("#merge-result").innerHTML =
      `<div class="table-scroll"><table class="result-table"><thead><tr><th>Cents</th><th>Expected discount</th><th>Actual</th><th>Check</th></tr></thead><tbody>${rows.map((r) => `<tr><td>${r.amount}</td><td>${r.expected}</td><td>${r.actual}</td><td>${r.pass ? "PASS" : "FAIL"}</td></tr>`).join("")}</tbody></table></div>`;
    log(
      root,
      `${choice}: ${rows.filter((r) => r.pass).length}/3 behavioural checks passed.`,
    );
    status(
      root,
      rows.every((r) => r.pass)
        ? "Both business changes survive these checks."
        : "Removing conflict markers would not fix the missing requirement.",
      rows.every((r) => r.pass) ? "success" : "danger",
    );
    done();
  };
  root.querySelector("[data-action=install]").onclick = () => {
    const choice = root.querySelector("#lock-choice").value,
      r = frozenInstall(choice !== "mismatch", choice !== "missing");
    lockSeen.add(choice);
    root.querySelector("#lock-result").textContent =
      `${r.ok ? "PROCEED" : "STOP"}: ${r.reason}`;
    log(root, `Frozen restore ${choice}: ${r.ok ? "proceed" : "stop"}.`);
    done();
  };
}
function dockerLab(root, complete) {
  frame(
    root,
    "Stopping is different from replacing",
    `
    <div class="node-track" role="img" aria-label="An image starts a container process, reached through a published host port; a named volume stores data outside the container writable layer."><div class="node">Image<span>counter-demo:v1</span></div><span class="node-connector" aria-hidden="true">→</span><div class="node">Container process<span>Port 8000; writable layer</span></div><span class="node-connector" aria-hidden="true">↔</span><div class="node">Named volume<span>Mounted at /data</span></div></div>
    <div class="lab-split"><div><label class="field-label" for="docker-storage">Next container storage</label><select id="docker-storage"><option value="layer">Container writable layer</option><option value="volume">Named volume mounted at /data</option></select></div><div><label class="field-label" for="docker-port">Next container host mapping</label><select id="docker-port"><option value="yes">127.0.0.1:18080 → container:8000</option><option value="no">No published host port</option></select></div></div>
    <p id="docker-state" class="notice" aria-live="polite"></p>${controls(button("create", "Create container", "button") + button("post", "POST: increment counter") + button("stop", "Stop") + button("start", "Start same container") + button("remove", "Remove container"))}${tail}
    <p class="figure-caption">A single-container JavaScript lifecycle model; it does not call Docker. Storage and port choices apply only when creating a new container. No real files or volumes are deleted here.</p>`,
  );
  const model = createContainerModel(),
    seen = new Set();
  let previousRemoved = null,
    stoppedValue = null;
  const count = (s) =>
    s.container?.persistent ? s.volume : s.container?.writable;
  const render = () => {
    const s = model.snapshot,
      c = s.container;
    root.querySelector("#docker-state").textContent = c
      ? `Container #${c.id}: ${c.running ? "running" : "stopped"}; ${c.persistent ? "volume" : "writable-layer"} counter ${count(s)}. Named volume value: ${s.volume}.`
      : `No container. Named volume value: ${s.volume}.`;
    root.querySelector("[data-action=create]").disabled = Boolean(c);
    root.querySelector("[data-action=stop]").disabled = !c?.running;
    root.querySelector("[data-action=start]").disabled = !c || c.running;
    root.querySelector("[data-action=remove]").disabled = !c;
  };
  const done = () => {
    if (
      ["unpublished", "restart", "lost", "persisted"].every((k) => seen.has(k))
    )
      complete([
        "Distinguished image, container and published host port",
        "Observed stop/start preserve a container writable layer",
        "Compared writable-layer loss and named-volume persistence across replacement",
      ]);
  };
  root.querySelector("[data-action=create]").onclick = () => {
    const persistent = root.querySelector("#docker-storage").value === "volume";
    model.create({
      persistent,
      published: root.querySelector("#docker-port").value === "yes",
    });
    if (
      previousRemoved &&
      previousRemoved.persistent === persistent &&
      previousRemoved.value > 0
    ) {
      if (persistent && count(model.snapshot) === previousRemoved.value)
        seen.add("persisted");
      if (!persistent && count(model.snapshot) === 0) seen.add("lost");
    }
    previousRemoved = null;
    render();
    status(
      root,
      "A new container was created. Inspect its current counter above.",
    );
    log(root, "Created a new container from the same image.");
    done();
  };
  root.querySelector("[data-action=post]").onclick = () => {
    const s = model.snapshot,
      r = model.increment();
    if (!r.ok && s.container?.running && !s.container.published)
      seen.add("unpublished");
    status(
      root,
      r.ok ? `HTTP 200: counter ${r.value}.` : r.reason,
      r.ok ? "success" : "danger",
    );
    log(root, r.ok ? `POST increments to ${r.value}.` : r.reason);
    render();
    done();
  };
  root.querySelector("[data-action=stop]").onclick = () => {
    const s = model.snapshot;
    stoppedValue = s.container ? { id: s.container.id, value: count(s) } : null;
    model.stop();
    render();
    status(
      root,
      "The process is stopped. Starting this same container retains its writable layer.",
    );
    log(root, "Stopped the container process; its writable layer remains.");
  };
  root.querySelector("[data-action=start]").onclick = () => {
    model.start();
    const s = model.snapshot;
    if (
      stoppedValue &&
      s.container &&
      !s.container.persistent &&
      stoppedValue.id === s.container.id &&
      stoppedValue.value > 0 &&
      count(s) === stoppedValue.value
    )
      seen.add("restart");
    render();
    status(
      root,
      "The same container is running again. Compare its counter above.",
    );
    log(root, "Started the same container; no replacement occurred.");
    done();
  };
  root.querySelector("[data-action=remove]").onclick = () => {
    const s = model.snapshot;
    previousRemoved = s.container
      ? { persistent: s.container.persistent, value: count(s) }
      : null;
    model.remove();
    stoppedValue = null;
    render();
    status(
      root,
      "The container was removed. Its writable layer is gone; the named volume remains.",
    );
    log(root, "Removed only the modeled container. The named volume remains.");
  };
  render();
}
async function grainLab(root, complete) {
  frame(
    root,
    "Check what one joined row represents",
    `
    <div class="node-track" role="img" aria-label="Order 901 has two lines and three payments. Joining both children directly produces six matching line/payment pairs."><div class="node">2 lines<span>50 + 50 = 100</span></div><span class="node-connector" aria-hidden="true">×</span><div class="node">Order 901<span>Six joined pairs</span></div><span class="node-connector" aria-hidden="true">×</span><div class="node">3 payments<span>30 + 30 + 40 = 100</span></div></div>
    <label class="field-label" for="grain-mode">Query strategy</label><select id="grain-mode"><option value="fanout">Join both child collections directly</option><option value="distinct">Try SUM(DISTINCT amount)</option><option value="aggregate">Preaggregate each child per order</option></select><pre id="grain-query">Loading shared fixture…</pre>${controls(button("run", "Run relational model", "button"))}<div id="grain-result" aria-live="polite"></div>${tail}
    <p class="figure-caption">Fixed JavaScript relational examples, not an SQL engine. Download <a href="../assets/exercises/sql_grain_lab.py" download>sql_grain_lab.py</a> and <a href="../assets/fixtures/grain-data.json" download>grain-data.json</a> to one folder, then run <code>python sql_grain_lab.py</code> for actual SQLite queries and rejected constraint violations.</p>`,
  );
  const run = root.querySelector("[data-action=run]");
  run.disabled = true;
  try {
    const response = await fetch(
      new URL("./fixtures/grain-data.json", import.meta.url),
      { cache: "no-store" },
    );
    if (!response.ok) throw new Error(`Fixture returned ${response.status}`);
    const fixture = await response.json(),
      seen = new Set(),
      select = root.querySelector("#grain-mode");
    const query = () => {
      root.querySelector("#grain-query").textContent =
        fixture.queries[select.value];
    };
    query();
    select.onchange = query;
    run.disabled = false;
    run.onclick = () => {
      const mode = select.value,
        rows = grainRows(fixture, mode);
      seen.add(mode);
      root.querySelector("#grain-result").innerHTML =
        `<div class="table-scroll"><table class="result-table"><thead><tr><th>Order</th><th>Line total</th><th>Payment total</th></tr></thead><tbody>${rows.map((r) => `<tr><td>${r.order_id}</td><td>${r.line_total}</td><td>${r.payment_total}</td></tr>`).join("")}</tbody></table></div>`;
      status(
        root,
        mode === "fanout"
          ? "Order 901 inflated to 300 / 200: the join repeats each measure."
          : mode === "distinct"
            ? "Order 901 fell to 50 / 70: DISTINCT removed legitimate equal amounts."
            : "One row per order; each child total appears once. Order 901 is 100 / 100.",
        mode === "aggregate" ? "success" : "danger",
      );
      log(
        root,
        `${mode}: ${rows.map((r) => `${r.order_id} = ${r.line_total}/${r.payment_total}`).join("; ")}`,
      );
      if (seen.size === 3)
        complete([
          "Compared direct join totals for two lines and three payments",
          "Observed inflated sums and the incorrect DISTINCT repair",
          "Compared preaggregated one-row-per-order totals",
        ]);
    };
  } catch (error) {
    status(
      root,
      `Could not load fixture: ${error.message}. Reload after checking the server.`,
      "danger",
    );
  }
}
export const foundationLabs = {
  "processes-ports": serviceLab,
  "code-boundaries": boundariesLab,
  "git-dependencies": gitLab,
  "docker-basics": dockerLab,
  "sql-grain": grainLab,
};
