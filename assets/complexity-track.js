import { complexityLessons } from "./complexity-curriculum.js";
import { entryStatus, store } from "./store.js";
import { lessonUrl, escapeHtml as e } from "./curriculum.js";

export function renderComplexity(main, openReview) {
  const state = store.get();
  const next = complexityLessons.find((l) => !state.lessons[l.id]?.practicedAt);
  const done = complexityLessons.filter(
    (l) => state.lessons[l.id]?.practicedAt,
  ).length;
  const due = complexityLessons.filter(
    (l) => entryStatus(state.lessons[l.id]) === "Review due",
  );
  main.innerHTML = `<div class="page-heading"><div><p class="eyebrow">Python / complexity from zero</p><h1>See what grows.</h1><p>Eight 30-minute lessons to understand O(1), O(n), and the patterns behind them. Start with counts and pictures, then explain real Python code.</p></div><span class="pill teal">Self-paced · 4 hours</span></div>
    <div class="python-hero"><div><p class="eyebrow">${next ? `Suggested next / Complexity ${String(next.number).padStart(2, "0")}` : "All practice sessions recorded"}</p><h2>${e(next?.title || "Try a changed case after a delay.")}</h2><p>${e(next?.objective || "Use the review queue and your explanations to check retention.")}</p>${next ? `<a class="button" href="${lessonUrl(next)}">Start from here →</a>` : ""}</div><div class="python-terminal"><p><span>n</span> number of input items</p><p><span>O(1)</span> work stays bounded</p><p><span>O(n)</span> work grows linearly</p><p><span>O(n²)</span> all pairs grow quadratically</p><label for="cx-progress">${done} / 8 sessions practised</label><progress id="cx-progress" max="8" value="${done}"></progress></div></div>
    <p class="notice">Do this sequence after Python 09 (files and generators), before Python 10 (lookup costs), or revisit it whenever needed. Use one daily slot per lesson; no additional calendar deadline is imposed. You need only basic Python loops and functions. Save unfinished attempts and resume.</p>
    <section class="panel python-setup"><p class="eyebrow">A small idea before any symbols</p><h2>What happens when the input gets bigger?</h2><p>If reading one known list position takes one selected read, growing the list does not add reads: O(1). If you inspect every item, 10 items need 10 reads and 20 need 20: O(n). If every item is paired with every item, 10 items give 100 pairs and 20 give 400: O(n²).</p><p>n names an input size. Big-O describes a growth bound under a stated case and cost model; it is not a time in seconds. We use the tightest usual growth class in beginner questions. You do not need to memorize formulas before tracing examples.</p><div class="button-row"><a class="button-secondary" href="assets/python-exercises.zip" download>Download updated Python workspace ↓</a><a href="assets/python-exercises/SETUP.txt">Setup &amp; complexity commands</a><a href="reference/0007-complexity-field-guide.html">Complexity field guide</a><a href="#python">Return to Python practice</a></div><pre><code>python tools/check.py --complexity 01
python tools/complexity_probe.py 01</code></pre><p class="small muted">Use the prepared Python environment. Edit complexity_exercises/c01.py and add a case in complexity_tests/test_01.py. The site does not execute Python; the probe counts selected operations in your actual local code.</p></section>
    ${due.length ? `<div class="notice"><strong>${due.length} complexity review${due.length === 1 ? "" : "s"} due.</strong> ${due.map((l) => `<button class="text-button" data-cx-review="${l.id}">${e(l.title)}</button>`).join(" ")}</div>` : ""}
    <div class="section-heading"><h2>Your route, one mechanism at a time</h2><a href="#backups">Back up all tracks →</a></div><div class="lesson-grid">${complexityLessons
      .map((l) => {
        const v = state.lessons[l.id];
        return `<article class="lesson-card"><div class="card-top"><span class="lesson-label">COMPLEXITY ${String(l.number).padStart(2, "0")}</span><span class="pill ${v?.practicedAt ? "teal" : ""}">${entryStatus(v)}</span></div><h3>${e(l.title)}</h3><p>${e(l.objective)}</p><a class="button-quiet" href="${lessonUrl(l)}">${v ? "Continue lesson" : "Open lesson"} →</a></article>`;
      })
      .join("")}</div>
    <div class="section-heading"><h2>Your reasoning and evidence</h2></div><div class="python-records">${
      complexityLessons
        .filter((l) => state.lessons[l.id])
        .map((l) => {
          const v = state.lessons[l.id];
          return `<article class="panel"><h3><a href="${lessonUrl(l)}">${e(l.title)}</a></h3><p class="small muted">${entryStatus(v)} · confidence ${v.confidence ? `${v.confidence}/5, self-report` : "not recorded"} · ${v.labComplete ? "local run reported" : "coding evidence pending"}</p><p class="python-reflection">${e(v.reflection || "Your explanation is still empty.")}</p>${v.reviewDueAt ? `<p class="small muted">Next review ${new Date(v.reviewDueAt).toLocaleDateString("en", { month: "short", day: "numeric" })} · ${v.reviews.length} review attempts</p>` : ""}</article>`;
        })
        .join("") ||
      '<div class="empty-state"><p>Your own explanations and changed-case evidence will appear here. Opening a lesson does not complete it.</p></div>'
    }</div>`;
  main
    .querySelectorAll("[data-cx-review]")
    .forEach(
      (button) => (button.onclick = () => openReview(button.dataset.cxReview)),
    );
}
