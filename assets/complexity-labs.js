import { complexityLessons } from "./complexity-curriculum.js";
import { complexityModel } from "./complexity-models.js";
import { codingEvidence } from "./coding-evidence.js";
import { escapeHtml as e } from "./curriculum.js";

function mountComplexity(root, lesson, complete) {
  const sizes =
    lesson.id === "cx-sorting" ? [4, 8, 16] : [4, 8, 16, 32, 64, 128];
  root.innerHTML = `<div class="complexity-experiment"><h3>Predict a count, then inspect the model.</h3>
    <p class="small muted">This browser experiment uses explicit formulas and a small binary-search trace. It does not run Python or measure seconds. Record your real Python run below.</p>
    <div class="complexity-controls"><label>Input size n<select id="cx-size">${sizes.map((n) => `<option value="${n}">${n} items</option>`).join("")}</select></label>
    <label ${["cx-loops", "cx-indexing"].includes(lesson.id) ? "" : "hidden"}>Second input m<select id="cx-width">${[4, 8, 16, 32].map((n) => `<option value="${n}" ${n === 8 ? "selected" : ""}>${n} items</option>`).join("")}</select></label>
    <label>Count to predict<select id="cx-case"></select></label>
    <label>Your predicted count<input id="cx-prediction" type="number" min="0" step="1" placeholder="Predict before revealing"></label></div>
    <button class="button-secondary" id="cx-reveal">Reveal model counts</button><p id="cx-feedback" role="status"></p><div id="cx-result"></div></div><div id="cx-code"></div>`;
  const size = root.querySelector("#cx-size"),
    width = root.querySelector("#cx-width"),
    selected = root.querySelector("#cx-case"),
    prediction = root.querySelector("#cx-prediction");
  const model = () =>
    complexityModel(lesson.id, Number(size.value), Number(width.value));
  selected.innerHTML = model()
    .rows.map(
      (row, index) => `<option value="${index}">${e(row.label)}</option>`,
    )
    .join("");
  if (model().rows.length > 1) selected.value = "1";
  for (const input of [size, width, selected])
    input.onchange = () => {
      prediction.value = "";
      root.querySelector("#cx-result").replaceChildren();
      root.querySelector("#cx-feedback").textContent =
        "Predict again for this input before revealing the counts.";
    };
  root.querySelector("#cx-reveal").onclick = () => {
    const feedback = root.querySelector("#cx-feedback");
    if (
      !prediction.value.trim() ||
      !Number.isSafeInteger(Number(prediction.value)) ||
      Number(prediction.value) < 0
    ) {
      feedback.textContent =
        "Enter a nonnegative whole-number prediction first.";
      return;
    }
    const result = model(),
      target = result.rows[Number(selected.value)];
    feedback.textContent = `${Number(prediction.value) === target.count ? "Your count matches this model." : `You predicted ${Number(prediction.value).toLocaleString("en")}; this model gives ${target.count.toLocaleString("en")}.`} Trace the operations and explain the difference before changing n.`;
    const max = Math.max(1, ...result.rows.map((row) => row.count));
    root.querySelector("#cx-result").innerHTML =
      `<div class="table-scroll"><table class="result-table"><caption>Illustrative counts at n=${size.value}, m=${width.value}; growth labels assume the stated model</caption><thead><tr><th>Case</th><th>Count and unit</th><th>Usual growth</th></tr></thead><tbody>${result.rows.map((row) => `<tr><td>${e(row.label)}</td><td><strong>${row.count.toLocaleString("en")}</strong> ${e(row.unit)}<span class="complexity-bar" aria-hidden="true" style="width:${(100 * row.count) / max}%"></span></td><td>${e(row.growth)}</td></tr>`).join("")}</tbody></table></div><p class="small">${e(result.note)}</p><p class="small muted">Bars use a linear relative scale; the table states every value. A few sizes illustrate growth, while code reasoning justifies the bound.</p>`;
  };
  codingEvidence(
    root.querySelector("#cx-code"),
    lesson.id,
    complete,
    `python tools/check.py --complexity ${String(lesson.number).padStart(2, "0")}`,
  );
}

export const complexityLabs = Object.fromEntries(
  complexityLessons.map((lesson) => [
    lesson.id,
    (root, complete) => mountComplexity(root, lesson, complete),
  ]),
);
