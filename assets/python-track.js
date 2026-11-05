import { pythonLessons, matchesPythonLesson } from "./python-curriculum.js";
import { escapeHtml as e, lessonUrl } from "./curriculum.js";
import { entryStatus, store } from "./store.js";

export function renderPython(main, openReview) {
  const state = store.get();
  const done = pythonLessons.filter(
    (l) => state.lessons[l.id]?.practicedAt,
  ).length;
  const next = pythonLessons.find((l) => !state.lessons[l.id]?.practicedAt);
  const due = pythonLessons.filter(
    (l) => entryStatus(state.lessons[l.id]) === "Review due",
  );
  const stages = [...new Set(pythonLessons.map((l) => l.stage))];
  const started = pythonLessons.filter((l) => state.lessons[l.id]);
  main.innerHTML = `<div class="page-heading"><div><p class="eyebrow">Python / write · test · explain</p><h1>Your next 30 minutes of Python.</h1><p>30 practical sessions, from a restart to a small verified API. Real local code, a changed case, and reasoning you can defend in an interview.</p></div><span class="pill teal">Self-paced · 15 hours of core practice</span></div>
  <div class="python-hero"><div><p class="eyebrow">${next ? `Suggested next / Python ${String(next.number).padStart(2, "0")}` : "All sessions recorded"}</p><h2>${e(next?.title || "Return to a changed challenge.")}</h2><p>${e(next?.objective || "Use spaced review and unseen cases to check retention.")}</p><a class="button" ${next ? `href="${lessonUrl(next)}"` : 'href="#python" data-python-evidence'}>${next ? "Open coding session →" : "View your evidence →"}</a></div><div class="python-terminal" aria-label="Practice cycle: write your attempt, run pytest, add a changed case, explain the result"><p><span>01</span> write an attempt</p><p><span>02</span> run the tests</p><p><span>03</span> change one case</p><p><span>04</span> explain the result</p><label for="python-progress-bar">${done} / 30 sessions practised</label><progress id="python-progress-bar" max="30" value="${done}"></progress><small>Practice is recorded separately from mastery.</small></div></div>
  <p class="notice">One session per study day. Alternate with the engineering track to keep a 30-minute total, or use Python as additional practice. Your November 3–December 23 engineering calendar is unchanged. Setup and optional stretches sit outside the timer.</p>
  ${due.length ? `<div class="notice"><strong>${due.length} Python review${due.length === 1 ? "" : "s"} due.</strong> Try from memory first. ${due.map((l) => `<button class="text-button" data-python-review="${l.id}">${e(l.title)}</button>`).join(" ")}</div>` : ""}
  <section class="panel python-setup" id="python-setup"><p class="eyebrow">Before session 01</p><h2>Prepare one workspace.</h2><p>Download the source bundle, unzip it into a new folder, and open <strong>SETUP.txt</strong>. It contains starters, behaviour tests, fixtures, tools, and separate reference solutions. Use Python 3.12 for the recorded library environment.</p><div class="button-row"><a class="button-secondary" href="assets/python-exercises.zip" download>Download Python workspace ↓</a><a href="assets/python-exercises/SETUP.txt">Setup for macOS, Linux &amp; Windows</a><a href="reference/0006-python-field-guide.html">Python field guide &amp; library map</a></div><details><summary>Quick start · Linux / macOS</summary><p>Run inside the extracted folder with Python 3.12 installed. The full setup includes Windows and optional uv commands.</p><pre><code>python3.12 -m venv .venv
.venv/bin/python -m pip install -r requirements.lock.txt
.venv/bin/python tools/check.py 01</code></pre><p>The unfinished starter should fail. Edit <code>exercises/day01.py</code>, rerun, then add a test in <code>tests/test_01.py</code>. The lesson's short <code>python</code> command assumes you activated this environment.</p></details><details><summary>How practice and solutions work</summary><p>Use the core timer: recall 5m, explore 5m, code 15m, explain 5m. If the task needs another session, save your attempt and resume. Compare the reference after trying; record any help honestly. Command evidence is self-reported, and no code is uploaded or executed by the site.</p><p>Start with the easy sessions even if they look familiar. Skip ahead after you can solve a changed case and explain it without copying. A correct quiz or reference run alone is not independent coding evidence.</p></details></section>
  <div class="section-heading"><h2>From restart to engineering practice</h2><label class="field-label" for="python-search">Find a topic</label></div><input id="python-search" type="search" placeholder="Search memory, Pydantic, async…" class="python-search"><div id="python-results" aria-live="polite"></div>
  <section id="python-progress" class="python-progress-section"><div class="section-heading"><h2>Your Python evidence</h2><a href="#backups">Back up both tracks →</a></div>${
    started.length
      ? `<div class="python-records">${started
          .map((l) => {
            const v = state.lessons[l.id];
            return `<article class="panel"><div class="card-top"><span class="lesson-label">PYTHON ${String(l.number).padStart(2, "0")}</span><span class="pill ${v.practicedAt ? "teal" : ""}">${entryStatus(v)}</span></div><h3><a href="${lessonUrl(l)}">${e(l.title)}</a></h3><p class="small muted">Confidence: ${v.confidence ? `${v.confidence}/5 (self-report)` : "not recorded"} · ${v.labComplete ? "local coding reported" : "coding evidence pending"}</p>${v.reflection ? `<p class="python-reflection">${e(v.reflection)}</p>` : "<p>Your explanation is still empty.</p>"}${v.reviewDueAt ? `<p class="small muted">Next review: ${new Date(v.reviewDueAt).toLocaleDateString("en", { month: "short", day: "numeric" })} · ${v.reviews.length} attempts</p>` : ""}</article>`;
          })
          .join("")}</div>`
      : '<div class="empty-state"><p>Your own attempts, explanations, confidence, and spaced reviews will appear here. Opening a session does not mark it complete.</p></div>'
  }</section>`;
  main
    .querySelector("[data-python-evidence]")
    ?.addEventListener("click", (event) => {
      event.preventDefault();
      main.querySelector("#python-progress").scrollIntoView({ block: "start" });
    });
  const results = main.querySelector("#python-results");
  const search = main.querySelector("#python-search");
  function filter() {
    const query = search.value.trim().toLowerCase();
    const matching = pythonLessons.filter((l) => matchesPythonLesson(l, query));
    results.innerHTML = matching.length
      ? `<p class="small muted">${matching.length} coding sessions</p>${stages
          .map((stage) => {
            const group = matching.filter((l) => l.stage === stage);
            return group.length
              ? `<section class="python-stage"><p class="eyebrow">${e(stage)}</p><div class="lesson-grid">${group.map((l) => `<article class="lesson-card"><div class="card-top"><span class="lesson-label">PYTHON ${String(l.number).padStart(2, "0")}</span><span class="pill ${state.lessons[l.id]?.practicedAt ? "teal" : ""}">${entryStatus(state.lessons[l.id])}</span></div><h3>${e(l.title)}</h3><p>${e(l.objective)}</p><a class="button-quiet" href="${lessonUrl(l)}">${state.lessons[l.id] ? "Continue coding" : "Open lesson"} →</a></article>`).join("")}</div></section>`
              : "";
          })
          .join("")}`
      : '<div class="empty-state"><p>No matching Python sessions. Try “memory”, “types”, or “tests”.</p></div>';
  }
  search.addEventListener("input", filter);
  filter();
  main
    .querySelectorAll("[data-python-review]")
    .forEach(
      (button) =>
        (button.onclick = () => openReview(button.dataset.pythonReview)),
    );
}
