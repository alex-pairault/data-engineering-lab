import {
  lessons,
  readyLessons,
  DOMAINS,
  lessonById,
  lessonUrl,
  formatDate,
  matchesLesson,
  escapeHtml as e,
} from "./curriculum.js";
import { store, entryStatus, validateState } from "./store.js";
import { lessonData } from "./lesson-data.js";
import {
  mountShell,
  showDialog,
  toast,
  exportProgress,
  base,
} from "./shell.js";
const main = document.querySelector("#main");
const scheduleLabel = `${formatDate(lessons[0].date, "long")}–${formatDate(lessons.at(-1).date, "long")}`;
const statusPill = (entry) =>
  `<span class="pill ${entry?.practicedAt ? "teal" : entry ? "blue" : ""}">${entryStatus(entry)}</span>`;
const domainLabel = (lesson) =>
  `<span class="domain-label" style="--domain:${DOMAINS[lesson.domain].color}"><span class="domain-dot" aria-hidden="true"></span>${DOMAINS[lesson.domain].short}</span>`;
function card(lesson, state) {
  return `<article class="lesson-card"><div class="card-top"><span class="lesson-label">SESSION ${String(lesson.number).padStart(2, "0")}</span>${statusPill(state.lessons[lesson.id])}</div><h3>${e(lesson.title)}</h3><p>${e(lesson.objective)}</p>${domainLabel(lesson)}<a class="button-quiet" href="${lessonUrl(lesson)}">${state.lessons[lesson.id] ? "Continue lesson" : "Open lesson"} <span aria-hidden="true">→</span></a></article>`;
}
function heading(eyebrow, title, description, badge = "") {
  return `<div class="page-heading"><div><p class="eyebrow">${eyebrow}</p><h1>${title}</h1><p>${description}</p></div>${badge}</div>`;
}
function today() {
  const state = store.get(),
    entries = Object.values(state.lessons),
    practised = readyLessons.filter(
      (l) => state.lessons[l.id]?.practicedAt,
    ).length;
  const due = readyLessons.filter(
    (l) => entryStatus(state.lessons[l.id]) === "Review due",
  );
  const next =
    readyLessons.find(
      (l) => state.lessons[l.id] && !state.lessons[l.id].practicedAt,
    ) || readyLessons.find((l) => !state.lessons[l.id]?.practicedAt);
  const upcoming = readyLessons.slice(
    next ? readyLessons.indexOf(next) : 0,
    (next ? readyLessons.indexOf(next) : 0) + 5,
  );
  main.innerHTML =
    heading(
      "Your learning workspace",
      "Your next 30 minutes.",
      `${scheduleLabel} · 30 minutes each weekday. One visual explanation, one experiment, and your own reasoning.`,
      `<span class="pill blue">${readyLessons.length} lessons ready · ${lessons.length} sessions planned</span>`,
    ) +
    `${due.length ? `<div class="notice"><strong>${due.length} spaced review${due.length === 1 ? " is" : "s are"} due.</strong> Try recalling the mechanism before reopening the lesson. <button class="text-button" id="open-due">Open review queue</button></div>` : ""}<div class="two-column"><section class="panel next-session">${next ? `<div class="lesson-label"><span class="pill blue">Suggested next</span> SESSION ${String(next.number).padStart(2, "0")} · 30 MIN</div><h2>${e(next.title)}</h2><p>${e(next.objective)}</p><div class="request-map" role="img" aria-label="A request travels from browser to application to database, then returns a response."><div class="map-stop"><div class="map-box">Browser</div><small>inspect the response</small></div><div class="map-line"></div><div class="map-stop"><div class="map-box accent">Application</div><small>trace the decision</small></div><div class="map-line"></div><div class="map-stop"><div class="map-box">Data & state</div><small>check the boundary</small></div></div><a class="button" href="${lessonUrl(next)}">${state.lessons[next.id] ? "Continue session" : "Begin session"} <span aria-hidden="true">→</span></a><p class="small muted" style="margin:13px 0 0">Your answers and progress stay in this browser.</p>` : `<p class="lesson-label">AVAILABLE SESSIONS</p><h2>Your available practice sessions are recorded.</h2><p>Revisit a lesson, try a due review, or bring an explanation to your tutor. Later sessions are outlined in the course map.</p><a class="button" href="#evidence">View practice evidence →</a>`}<div class="stats-row"><div class="stat"><strong>${practised}<span style="display:inline;font-size:17px"> / ${readyLessons.length}</span></strong><span>sessions practised</span></div><div class="stat"><strong>${due.length}</strong><span>reviews due</span></div><div class="stat"><strong>${entries.filter((v) => v.reflection.trim()).length}</strong><span>explanations saved</span></div></div></section><aside class="panel week-panel"><p class="eyebrow">A small, repeatable routine</p><h3 style="margin-top:10px">Learn by tracing.</h3><div class="phase-strip" aria-hidden="true"><span style="flex:5"></span><span style="flex:5"></span><span style="flex:15"></span><span style="flex:5"></span></div><div class="phase-labels"><span>Recall · 5m</span><span>Explore · 5m</span><span>Try · 15m</span><span>Explain · 5m</span></div><div class="week-list">${upcoming.map((l) => `<div class="week-item"><span class="week-date">${formatDate(l.date).replace(" ", "<br>")}</span><div><a href="${lessonUrl(l)}">${e(l.title)}</a><small>${entryStatus(state.lessons[l.id])}</small></div></div>`).join("")}</div></aside></div><div class="section-heading"><h2>Your available lessons</h2><a class="button-quiet" href="#course">See the complete route →</a></div><div class="lesson-grid">${readyLessons.map((l) => card(l, state)).join("")}</div><p class="outline-note">The initial diagnostic is complete. It is kept separately from this app. Lesson visits and correct answers are practice evidence, not a claim of mastery.</p>`;
  document.querySelector("#open-due")?.addEventListener("click", () => {
    location.hash = "evidence";
  });
}
function course() {
  main.innerHTML =
    heading(
      "The complete route",
      "A foundation across domains.",
      `${lessons.length} weekday sessions: ${scheduleLabel}. ${readyLessons.length} lessons are ready; later sessions have honest outlines and will be authored as you progress.`,
    ) +
    `<div class="filters"><label class="sr-only" for="course-search">Search lessons</label><input id="course-search" type="search" placeholder="Search a topic, such as Docker or sessions"><label class="sr-only" for="domain-filter">Filter domain</label><select id="domain-filter"><option value="all">All domains</option>${Object.entries(
      DOMAINS,
    )
      .map(([id, d]) => `<option value="${id}">${d.name}</option>`)
      .join(
        "",
      )}</select><label class="sr-only" for="ready-filter">Filter availability</label><select id="ready-filter"><option value="all">Ready + planned</option><option value="ready">Ready lessons</option><option value="planned">Planned sessions</option></select></div><div id="course-results" aria-live="polite"></div>`;
  const render = () => {
    const search = document.querySelector("#course-search").value.toLowerCase(),
      domain = document.querySelector("#domain-filter").value,
      availability = document.querySelector("#ready-filter").value,
      state = store.get();
    const filtered = lessons.filter(
      (l) =>
        (domain === "all" || l.domain === domain) &&
        (availability === "all" ||
          (availability === "ready" ? l.ready : !l.ready)) &&
        matchesLesson(l, search),
    );
    document.querySelector("#course-results").innerHTML = filtered.length
      ? `<p class="small muted" style="margin-bottom:14px">${filtered.length} session${filtered.length === 1 ? "" : "s"}</p><div class="course-list">${filtered.map((l) => `<article class="course-row"><span class="course-number">${String(l.number).padStart(2, "0")}</span><div>${domainLabel(l)}<h3>${e(l.title)}</h3><p>${e(l.objective)}</p><span class="date">${formatDate(l.date)} · 30 minutes</span></div><div class="course-status">${l.ready ? statusPill(state.lessons[l.id]) : '<span class="pill">Planned</span>'}</div><div class="course-action">${l.ready ? `<a class="button-secondary" href="${lessonUrl(l)}">Open lesson</a>` : `<button class="button-secondary" data-outline="${l.id}">View outline</button>`}</div></article>`).join("")}</div>`
      : '<div class="empty-state"><h2>No matching sessions</h2><p>Try another topic or choose All domains.</p></div>';
    document.querySelectorAll("[data-outline]").forEach(
      (button) =>
        (button.onclick = () => {
          const l = lessonById(button.dataset.outline);
          showDialog(
            l.title,
            `<p>${e(l.objective)}</p><div class="notice">Planned for ${formatDate(l.date)}. This lesson has not been authored yet.</div><p>Your tutor will choose a focused exercise and primary reference when preparing this session. It cannot be marked as practised from an outline.</p>`,
          );
        }),
    );
  };
  ["course-search", "domain-filter", "ready-filter"].forEach((id) =>
    document
      .getElementById(id)
      .addEventListener(id === "course-search" ? "input" : "change", render),
  );
  render();
}
function evidence() {
  const state = store.get(),
    started = readyLessons.filter((l) => state.lessons[l.id]);
  main.innerHTML =
    heading(
      "Practice evidence",
      "Keep the reasoning, too.",
      "Saved attempts, lab checks, and your own explanations. Confidence is recorded separately; a later review checks recall on a changed question.",
    ) +
    `${
      started.length
        ? `<div class="two-column"><div>${started
            .map((l) => {
              const v = state.lessons[l.id],
                due = entryStatus(v) === "Review due";
              return `<article class="evidence-item"><div class="button-row">${statusPill(v)}${domainLabel(l)}</div><h2>${e(l.title)}</h2><div class="evidence-meta"><span>${v.labComplete ? "Lab check recorded" : "Lab check pending"}</span><span>${[v.checks.q1, v.checks.q2].filter((q) => q?.correct).length}/2 concept checks</span><span>Confidence: ${v.confidence ? `${v.confidence}/5` : "not recorded"}</span></div>${v.reflection ? `<blockquote>${e(v.reflection)}</blockquote>` : '<p class="small muted" style="margin:18px 0">No explanation saved yet.</p>'}${v.reviews.length ? `<p class="small muted" style="margin:14px 0">${v.reviews.filter((r) => r.correct && !r.assisted).length} unassisted review pass${v.reviews.filter((r) => r.correct && !r.assisted).length === 1 ? "" : "es"} · ${v.reviews.length} review attempt${v.reviews.length === 1 ? "" : "s"}</p>` : ""}<div class="button-row" style="margin-top:18px"><a class="button-secondary" href="${lessonUrl(l)}">Continue lesson</a>${due ? `<button class="button" data-review="${l.id}">Try spaced review</button>` : v.reviewDueAt ? `<span class="small muted">Next review ${formatDate(v.reviewDueAt)}</span>` : ""}<button class="text-button" data-tutor="${l.id}">Bring to tutor</button></div></article>`;
            })
            .join(
              "",
            )}</div><aside class="panel"><p class="eyebrow">Breadth check</p><h3 style="margin-top:10px">Practice by domain</h3><div class="domain-progress">${Object.entries(
            DOMAINS,
          )
            .map(([id, d]) => {
              const all = lessons.filter((l) => l.domain === id),
                done = all.filter(
                  (l) => state.lessons[l.id]?.practicedAt,
                ).length;
              return `<div><span>${d.short}<small style="display:block;color:var(--muted)">${done} / ${all.length} planned sessions</small></span><progress aria-label="${d.name} sessions practised" value="${done}" max="${all.length}"></progress></div>`;
            })
            .join(
              "",
            )}</div><p class="small muted" style="margin-top:22px">These counts describe recorded practice. They do not score your overall engineering ability.</p></aside></div>`
        : '<div class="empty-state"><p class="eyebrow">Your first entry</p><h2 style="margin-top:12px">Start with one experiment.</h2><p>Open the first lesson, save a recall attempt, and try the lab. Your progress will appear here.</p><a class="button" href="' +
          lessonUrl(readyLessons[0]) +
          '">Begin the first lesson →</a></div>'
    }`;
  document
    .querySelectorAll("[data-review]")
    .forEach(
      (button) => (button.onclick = () => openReview(button.dataset.review)),
    );
  document.querySelectorAll("[data-tutor]").forEach(
    (button) =>
      (button.onclick = () => {
        const l = lessonById(button.dataset.tutor),
          v = store.entry(l.id);
        const prompt = `I am working on Fieldnotes lesson: ${l.title}.\nObjective: ${l.objective}\n\nMy initial recall:\n${v.recall || "(not recorded)"}\n\nMy explanation:\n${v.reflection || "(not recorded)"}\n\nLab evidence: ${v.labEvidence.join("; ") || "pending"}.\nPlease check my reasoning, ask one transfer question, and distinguish hints from independent understanding.`;
        const dialog = showDialog(
          "Bring this to your tutor",
          '<p>Copy this context into your conversation. Nothing is sent automatically.</p><textarea id="tutor-context" rows="12" aria-label="Context for your tutor" readonly></textarea><button class="button" id="copy-context">Copy context</button>',
        );
        dialog.querySelector("textarea").value = prompt;
        dialog.querySelector("#copy-context").onclick = async () => {
          try {
            await navigator.clipboard.writeText(prompt);
            toast("Tutor context copied.");
          } catch {
            dialog.querySelector("textarea").select();
            toast("Select and copy the context from the text box.");
          }
        };
      }),
  );
}
function openReview(id) {
  const l = lessonById(id),
    question = lessonData[id].review;
  const dialog = showDialog(
    `Review: ${l.title}`,
    `<p class="small muted">Try from memory before reopening the lesson. This is a changed question.</p><p class="review-question">${e(question.question)}</p><div class="review-choices">${question.options.map((option, index) => `<button data-choice="${index}">${e(option)}</button>`).join("")}</div><label class="field-label"><input type="checkbox" id="review-assisted"> I used a hint, notes, or outside help</label><p id="review-result" role="status"></p>`,
  );
  dialog.querySelectorAll("[data-choice]").forEach(
    (button) =>
      (button.onclick = () => {
        const correct = Number(button.dataset.choice) === question.answer;
        try {
          store.review(
            id,
            correct,
            dialog.querySelector("#review-assisted").checked,
          );
          dialog
            .querySelectorAll("[data-choice]")
            .forEach((b) => (b.disabled = true));
          dialog.querySelector("#review-result").textContent =
            `${correct ? "Correct." : "Not yet."} ${question.feedback} Your next review has been scheduled.`;
          dialog.addEventListener("close", () => render(), { once: true });
        } catch (error) {
          toast(error.message);
        }
      }),
  );
}
function backups() {
  main.innerHTML =
    heading(
      "Your progress, portable",
      "Keep a copy of your work.",
      "Progress is saved in this browser on this device. Export a backup to carry it to another browser or protect your notes.",
    ) +
    `<div class="backup-grid"><section class="panel"><p class="eyebrow">Save a copy</p><h2 style="margin-top:12px">Export your fieldnotes</h2><p>Download your lesson attempts, explanations, lab evidence, and review dates as a JSON file. The file may contain personal notes; choose where to keep it.</p><button class="button" id="export-progress">Export progress</button></section><section class="panel"><p class="eyebrow">Bring a copy back</p><h2 style="margin-top:12px">Restore a backup</h2><p>Choose a Fieldnotes backup. For each lesson, the entry with the most recent saved date is kept. Export your current copy before merging if you want to preserve both versions.</p><label class="field-label" for="import-file">Fieldnotes JSON backup</label><input id="import-file" class="file-input" type="file" accept="application/json,.json"><p id="import-preview" class="small muted" role="status">No file selected.</p><button class="button-secondary" id="import-progress" disabled>Merge backup</button></section></div><div class="notice">Your diagnostic answers are not included in this app. No analytics or automatic cloud sync is used. Clearing this site’s browser data also removes its saved progress.</div>`;
  document.querySelector("#export-progress").onclick = exportProgress;
  let pending = null;
  document.querySelector("#import-file").onchange = async (event) => {
    pending = null;
    document.querySelector("#import-progress").disabled = true;
    const file = event.target.files[0];
    if (!file) return;
    try {
      if (file.size > 1024 * 1024)
        throw new Error("Choose a backup smaller than 1 MB.");
      pending = validateState(JSON.parse(await file.text()));
      document.querySelector("#import-preview").textContent =
        `Compatible backup: ${Object.keys(pending.lessons).length} lesson entries. Review the merge rule above, then choose Merge backup.`;
      document.querySelector("#import-progress").disabled = false;
    } catch (error) {
      document.querySelector("#import-preview").textContent =
        error instanceof SyntaxError
          ? "This file is not valid JSON. Your saved progress has not changed."
          : error.message;
    }
  };
  document.querySelector("#import-progress").onclick = () => {
    if (!pending) return;
    try {
      store.import(pending);
      pending = null;
      document.querySelector("#import-progress").disabled = true;
      document.querySelector("#import-preview").textContent =
        "Backup merged. Your progress is saved in this browser.";
      toast("Backup merged.");
    } catch (error) {
      toast(error.message);
    }
  };
}
function render() {
  const section = location.hash.slice(1) || "today";
  (({ today, course, evidence, backups })[section] || today)();
  mountShell(
    ["today", "course", "evidence", "backups"].includes(section)
      ? section
      : "today",
  );
  window.scrollTo(0, 0);
}
window.addEventListener("hashchange", render);
render();
