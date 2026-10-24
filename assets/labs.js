import {
  createNoteCache,
  createSessionModel,
  USERS,
  TEST_CASES,
  runReviewCases,
} from "./lab-models.js";
import { escapeHtml as e } from "./curriculum.js";
const controls = (html) => `<div class="lab-controls">${html}</div>`;
const button = (id, label, kind = "button-secondary") =>
  `<button class="${kind}" data-action="${id}">${label}</button>`;
function frame(root, title, body) {
  root.innerHTML = `<div class="lab-top"><strong>${title}</strong><span>Interactive experiment</span></div><div class="lab-body">${body}</div>`;
}
function log(root, message) {
  const target = root.querySelector(".lab-log");
  target.textContent += `${target.textContent ? "\n" : ""}${message}`;
  target.scrollTop = target.scrollHeight;
}
function status(root, message, type = "") {
  const target = root.querySelector(".lab-status");
  target.textContent = message;
  target.className = `lab-status ${type}`;
}
function requestLab(root, complete) {
  frame(
    root,
    "Follow a real response",
    `<div class="node-track" role="img" aria-label="Browser sends a request to the lesson server, which returns a fixture response."><div class="node" data-node="browser">Browser<span>Displays the page</span></div><span class="node-connector" aria-hidden="true">→</span><div class="node" data-node="server">Lesson server<span>Serves a JSON fixture</span></div><span class="node-connector" aria-hidden="true">→</span><div class="node" data-node="response">Response<span>Inspect what arrived</span></div></div><div class="lab-split"><div class="lab-box"><h4>On the page</h4><p>Workshop notebook</p><p style="font:600 35px var(--display);margin:8px 0" id="display-price">20</p><small class="muted">This displayed value starts stale.</small></div><div class="lab-box"><h4>Received evidence</h4><p id="response-summary">No request sent yet.</p><pre id="response-body" aria-live="polite">The response body will appear here.</pre></div></div>${controls(button("send", "Send request", "button") + button("apply", "Apply response to page"))}<div class="lab-status" role="status">Predict the response before sending the request.</div><p class="figure-caption">This fetch is real. It reads a static, synthetic JSON fixture from this lesson server. It does not contact a live product API or database.</p><div class="lab-log" aria-label="Request experiment log">Waiting for a request.</div>`,
  );
  let response = null;
  root.querySelector("[data-action=apply]").disabled = true;
  root.querySelector("[data-action=send]").onclick = async (event) => {
    const sendButton = event.currentTarget;
    sendButton.disabled = true;
    try {
      root.querySelector("[data-node=server]").classList.add("active");
      const result = await fetch(
        new URL("./fixtures/product.json", import.meta.url),
        { cache: "no-store" },
      );
      if (!result.ok) throw new Error(`Request returned ${result.status}`);
      response = await result.json();
      root.querySelector("#response-summary").textContent =
        `HTTP ${result.status} · ${result.headers.get("content-type") || "content type not supplied"}`;
      root.querySelector("#response-body").textContent = JSON.stringify(
        response,
        null,
        2,
      );
      root.querySelector("[data-node=response]").classList.add("active");
      root.querySelector("[data-action=apply]").disabled = false;
      status(
        root,
        "The response contains 25, while the page still displays 20. The two observations are different.",
      );
      log(
        root,
        `GET assets/fixtures/product.json → ${result.status}; response.price = ${response.price}`,
      );
    } catch (error) {
      status(
        root,
        `The request failed: ${error.message}. Serve the built app over HTTP and try again.`,
        "danger",
      );
    } finally {
      sendButton.disabled = false;
    }
  };
  root.querySelector("[data-action=apply]").onclick = () => {
    if (!response) return;
    root.querySelector("#display-price").textContent = response.price;
    root.querySelector("[data-node=browser]").classList.add("active");
    status(
      root,
      "The page now uses the received value. You located the difference after the response arrived.",
      "success",
    );
    log(
      root,
      `Rendered response.price (${response.price}) instead of the previous page value.`,
    );
    complete([
      "Sent and inspected a real fixture response",
      "Applied the response value to the displayed state",
    ]);
  };
}
function authenticationLab(root, complete) {
  frame(
    root,
    "Trace an identity check",
    `<div class="node-track" role="img" aria-label="Submitted credentials are checked by a server-side verifier before an identity is accepted."><div class="node">Submitted credentials<span>Untrusted input</span></div><span class="node-connector" aria-hidden="true">→</span><div class="node" data-node="verify">Server verifier<span>password_verify(candidate, storedHash)</span></div><span class="node-connector" aria-hidden="true">→</span><div class="node" data-node="identity">Identity decision<span>No permission decision yet</span></div></div><label class="field-label" for="credential-case">Simulated submitted credentials</label><select id="credential-case"><option value="valid">Matches the stored verifier</option><option value="invalid">Does not match the verifier</option></select>${controls(button("verify", "Attempt sign-in", "button"))}<div class="lab-status" role="status">Try both outcomes. Do not enter any real password.</div><div class="lab-log" aria-label="Identity check log">No credentials checked.</div><p class="figure-caption">This model shows decisions, not cryptographic implementation. It does not hash a password, sign anyone in, or create a real session. Production verification belongs on the server using established libraries or a provider.</p>`,
  );
  const seen = new Set();
  root.querySelector("[data-action=verify]").onclick = () => {
    const valid = root.querySelector("#credential-case").value === "valid";
    seen.add(valid);
    root.querySelector("[data-node=verify]").classList.add("active");
    root
      .querySelector("[data-node=identity]")
      .classList.toggle("active", valid);
    status(
      root,
      valid
        ? "Identity accepted as Mina. Access to a particular resource still needs authorization."
        : "Identity rejected. The supplied credential did not pass verification.",
      valid ? "success" : "danger",
    );
    log(
      root,
      `Receive credential → check stored verifier → ${valid ? "ACCEPT identity Mina" : "REJECT sign-in"}. No secret value is logged.`,
    );
    if (seen.size === 2)
      complete([
        "Observed accepted and rejected credential checks",
        "Distinguished identity verification from resource permission",
      ]);
  };
}
function sessionLab(root, complete) {
  const model = createSessionModel();
  let tampered = false,
    requestPassed = false,
    observedTamper = false,
    observedExpiry = false;
  frame(
    root,
    "Inspect both sides of a session",
    `<div class="lab-split"><div class="lab-box"><h4>Browser-held values</h4><span class="credential-chip" id="cookie-value">Session cookie: none</span><label class="field-label" for="browser-claim">Editable browser claim: user_id</label><select id="browser-claim"><option>Mina</option><option>Owen</option></select><p class="small muted" style="margin-top:10px">This claim is deliberately untrusted.</p></div><div class="lab-box"><h4>Server-side session store</h4><pre id="session-record">No authenticated session.</pre></div></div>${controls(button("login", "Sign in as Mina", "button") + button("request", "Send protected request") + button("expire", "Advance past server expiry") + button("logout", "Log out"))}<div class="lab-status" role="status">Sign in, send a request, change the claim, then test expiry.</div><div class="lab-log" aria-label="Session experiment log">Server clock starts at 0 seconds.</div><p class="figure-caption">A simulation of opaque-ID, server-backed sessions. These readable demo identifiers are illustrative; real session identifiers must be unpredictable. No real browser cookies or authentication are created.</p>`,
  );
  const render = () => {
    root.querySelector("#cookie-value").textContent =
      `Session cookie: ${model.cookie || "none"}`;
    root.querySelector("#session-record").textContent = model.records.length
      ? model.records
          .map(
            (r) =>
              `${r.id}\n  user: ${r.user}\n  valid until: ${r.expires}s\n  server clock: ${model.now}s`,
          )
          .join("\n")
      : "No authenticated session.";
  };
  root.querySelector("[data-action=login]").onclick = () => {
    model.signIn();
    render();
    status(
      root,
      "The browser has an identifier; the server record binds it to Mina.",
    );
    log(root, `Sign-in creates ${model.cookie} → server record: Mina.`);
  };
  root.querySelector("#browser-claim").onchange = (event) => {
    model.setClaim(event.target.value);
    tampered = event.target.value === "Owen";
    log(
      root,
      `Browser claim changed to ${model.claim}; server record is unchanged.`,
    );
  };
  root.querySelector("[data-action=request]").onclick = () => {
    const result = model.request();
    if (result.status === 200) {
      requestPassed = true;
      if (tampered && result.user === "Mina") observedTamper = true;
      status(
        root,
        `200 — recognized as ${result.user}. The server used the session record, not the editable browser claim.`,
        "success",
      );
    } else {
      if (model.cookie) observedExpiry = true;
      status(
        root,
        "401 — no valid authenticated session. The cookie or claim cannot override server validity.",
        "danger",
      );
    }
    log(
      root,
      `Protected request → ${result.status}${result.user ? `; server identity = ${result.user}` : ""}`,
    );
    if (requestPassed && observedTamper && observedExpiry)
      complete([
        "Validated the identifier against server-side state",
        "A changed browser identity claim did not change the server identity",
        "An expired server session was rejected",
      ]);
    render();
  };
  root.querySelector("[data-action=expire]").onclick = () => {
    model.expire();
    render();
    status(
      root,
      "The server clock moved past expiry. Send another request to observe the decision.",
    );
    log(root, `Server clock → ${model.now}s; cookie still present.`);
  };
  root.querySelector("[data-action=logout]").onclick = () => {
    model.logout();
    render();
    status(
      root,
      "Logout invalidated the server record and removed the browser-held identifier.",
    );
    log(root, "Server session invalidated; cookie removed.");
  };
}
function cacheLab(root, complete) {
  let scoped = false,
    model = createNoteCache(false),
    leakSeen = false;
  const correctRequests = { mina: 0, owen: 0 };
  frame(
    root,
    "Trace two users through a cache",
    `<label class="field-label" for="cache-mode">Cache-key strategy</label><select id="cache-mode"><option value="shared">One shared key: notes</option><option value="scoped">A key per user: notes:{user.id}</option></select><div class="lab-split" style="margin-top:20px"><div class="lab-box"><h4>Authenticated requests</h4><p>Mina → user 17<br>Owen → user 28</p>${controls(button("mina", "Request as Mina", "button") + button("owen", "Request as Owen"))}</div><div class="lab-box"><h4>Shared application cache</h4><pre id="cache-keys">Empty</pre><p class="small muted">This cache is separate from the browser’s HTTP cache.</p></div></div>${controls(button("clear", "Clear demo cache"))}<div class="lab-status" role="status">With the shared key, request as one user, then the other.</div><div class="lab-log" aria-label="Cache experiment log">Demo cache is empty.</div><p class="figure-caption">A simplified fixed-permission model. User-specific keys address this example; real protected cache hits must also respect current authorization, tenant/query context, and invalidation rules.</p>`,
  );
  const render = () =>
    (root.querySelector("#cache-keys").textContent = model.keys.length
      ? model.keys.join("\n")
      : "Empty");
  for (const name of ["mina", "owen"])
    root.querySelector(`[data-action=${name}]`).onclick = () => {
      const user = USERS[name],
        result = model.read(user),
        correct = result.notes.every((note) => note.owner === user.id);
      if (!correct) leakSeen = true;
      if (scoped && correct) correctRequests[name]++;
      status(
        root,
        `${user.name}: ${result.hit ? "cache HIT" : "cache MISS"} → ${result.notes.map((n) => n.title).join(", ")}. ${correct ? "Ownership matches." : "Wrong user’s data returned."}`,
        correct ? "success" : "danger",
      );
      log(
        root,
        `${user.name} → key ${result.key} → ${result.hit ? "HIT" : "MISS"} → ${correct ? "owner check PASS" : "owner check FAIL"}`,
      );
      render();
      if (leakSeen && correctRequests.mina >= 2 && correctRequests.owen >= 2)
        complete([
          "Observed a cross-user leak with one shared key",
          "Used keys derived from authenticated user identity",
          "Checked both users across cache misses and hits",
        ]);
    };
  root.querySelector("#cache-mode").onchange = (event) => {
    scoped = event.target.value === "scoped";
    model = createNoteCache(scoped);
    correctRequests.mina = 0;
    correctRequests.owen = 0;
    render();
    status(
      root,
      scoped
        ? "The demo cache was cleared. Request as each user twice to inspect misses and hits."
        : "The demo cache was cleared. Try two different identities.",
    );
    log(
      root,
      `Strategy → ${scoped ? "per-user keys" : "shared key"}; cache cleared.`,
    );
  };
  root.querySelector("[data-action=clear]").onclick = () => {
    model.clear();
    render();
    status(root, "Demo cache cleared. Saved lesson progress is unchanged.");
    log(root, "Demo cache cleared.");
  };
}
function verificationLab(root, complete) {
  frame(
    root,
    "Challenge the agent’s claim",
    `<p>Select behaviours to check against the buggy and repaired builds. Each case starts with an isolated demo cache.</p><div class="test-options">${Object.entries(
      TEST_CASES,
    )
      .map(
        ([id, test]) =>
          `<label><input type="checkbox" name="test-case" value="${id}" ${id === "single" ? "checked" : ""}>${e(test.label)}</label>`,
      )
      .join(
        "",
      )}</div>${controls(button("run", "Run selected checks", "button"))}<div class="lab-status" role="status">Start with the one-user case. Does it expose the bug?</div><div id="test-results" aria-live="polite"></div><div class="lab-log" aria-label="Regression check log">No checks run yet.</div><p class="figure-caption">These checks execute small JavaScript cache/database models in this page. They test the illustrated behaviour, not a production deployment. A real browser test would use separate authenticated contexts and the shared backend state under test.</p>`,
  );
  root.querySelector("[data-action=run]").onclick = () => {
    const selected = [
      ...root.querySelectorAll("input[name=test-case]:checked"),
    ].map((input) => input.value);
    if (!selected.length) {
      status(root, "Choose at least one behaviour to check.");
      return;
    }
    const results = runReviewCases(selected);
    root.querySelector("#test-results").innerHTML =
      `<table class="result-table"><caption class="small muted" style="text-align:left;padding-bottom:8px">Same assertions, two implementations</caption><thead><tr><th scope="col">Behaviour</th><th scope="col">Buggy build</th><th scope="col">Repaired build</th></tr></thead><tbody>${results.map((result) => `<tr><td>${e(result.label)}</td><td class="${result.buggy ? "pass" : "fail"}">${result.buggy ? "PASS" : "FAIL"}</td><td class="${result.fixed ? "pass" : "fail"}">${result.fixed ? "PASS" : "FAIL"}</td></tr>`).join("")}</tbody></table>`;
    const catchesBug = results.some((r) => !r.buggy),
      repairPasses = results.every((r) => r.fixed);
    status(
      root,
      catchesBug
        ? `Your checks rejected the buggy build. ${repairPasses ? "The repaired build passes these selected behaviours." : "The repaired build still needs attention."}`
        : "Both builds pass these checks. That does not establish cross-user isolation.",
      catchesBug && repairPasses ? "success" : "",
    );
    log(
      root,
      `${results.length} checks → buggy ${results.filter((r) => r.buggy).length}/${results.length} pass; repaired ${results.filter((r) => r.fixed).length}/${results.length} pass.`,
    );
    if (
      selected.includes("cross") &&
      selected.includes("reverse") &&
      catchesBug &&
      repairPasses
    )
      complete([
        "A regression check failed on the buggy build",
        "Both user request orders passed on the repaired build",
        "Verification used assertions about returned ownership",
      ]);
  };
}
export function mountLab(root, id, complete) {
  ({
    "request-trace": requestLab,
    authentication: authenticationLab,
    sessions: sessionLab,
    "cache-isolation": cacheLab,
    "agent-verification": verificationLab,
  })[id](root, complete);
}
