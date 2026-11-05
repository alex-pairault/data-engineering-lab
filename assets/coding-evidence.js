import { store } from "./store.js";

export function codingEvidence(
  root,
  id,
  complete,
  command = "python tools/check.py 01",
) {
  root.innerHTML = `<div class="lab-heading"><h3>Record your local coding run</h3></div>
    <div class="lab-body python-evidence-form">
    <p>Run Python on your computer, then record the result here. This page does not execute or authenticate your code. Saved evidence is your own report.</p>
    <label class="field-label" for="coding-result">Command, observed result, and changed case</label>
    <textarea id="coding-result" rows="5" maxlength="4000" placeholder="${command} → …\nMy added case was …; it showed …"></textarea>
    <label class="field-label"><input type="checkbox" id="coding-ran"> I ran my exercise and its tests locally.</label>
    <label class="field-label"><input type="checkbox" id="coding-changed"> I added and ran a changed case, and can explain its result.</label>
    <button class="button-secondary" id="record-code">Record coding evidence</button>
    <p id="coding-status" role="status"></p></div>`;
  const input = root.querySelector("textarea");
  const saved = store.entry(id)?.labEvidence || [];
  // Evidence is plain text. Never render a pasted traceback or source as HTML.
  if (saved.length) input.value = saved.slice(1).join("");
  root.querySelector("#record-code").onclick = () => {
    const result = root.querySelector("#coding-status");
    if (
      !root.querySelector("#coding-ran").checked ||
      !root.querySelector("#coding-changed").checked ||
      input.value.trim().length < 30
    ) {
      result.textContent =
        "Run both cases, check the two statements, and describe your command and result (at least 30 characters). An unfinished attempt can stay in your lesson explanation.";
      return;
    }
    // Existing bounded evidence storage also travels in the normal JSON backup.
    const lines = input.value.match(/[\s\S]{1,240}/g) || [];
    if (
      !complete(["Self-recorded local Python run and changed case", ...lines])
    )
      return;
    result.textContent =
      "Coding evidence recorded from your report. Include help used in your explanation; a tutor can review the code and reasoning.";
  };
}
