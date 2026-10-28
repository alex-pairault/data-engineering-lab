import { webModels } from "./course-models/web.js";
import { dataModels } from "./course-models/data.js";
import { decisionModels } from "./course-models/decisions.js";
import { escapeHtml as e } from "./curriculum.js";
import { frame, controls, button, log, status } from "./lab-ui.js";
export const courseModels = { ...webModels, ...dataModels, ...decisionModels };
export function runScenario(id, key) {
  const model = courseModels[id];
  if (!model || !model.cases.some(([candidate]) => candidate === key))
    throw new Error("Unknown lesson scenario.");
  return model.run(key);
}
function mountScenario(root, id, complete) {
  const model = courseModels[id];
  frame(
    root,
    model.title,
    `<p>Use the mechanism above to predict the next observation.</p>
 ${model.attempt ? '<label class="field-label" for="scenario-attempt">Your attempt before feedback</label><textarea id="scenario-attempt" rows="3" maxlength="1200" placeholder="Write a hypothesis, explanation, or evidence plan in your own words. This scratch attempt is not saved; keep your reasoning in the lesson explanation below."></textarea>' : ""}
 <label class="field-label" for="scenario-choice">Scenario to investigate</label><select id="scenario-choice">${model.cases.map(([key, label]) => `<option value="${e(key)}">${e(label)}</option>`).join("")}</select><p id="scenario-description" class="small muted" style="margin-top:10px"></p>${controls(button("scenario", "Run scenario", "button"))}
 <div id="scenario-result" aria-live="polite"><p>Predict an observation, then run the scenario.</p></div><div class="lab-status" role="status"></div><div class="lab-log" aria-label="Experiment observations">No observations yet.</div><p class="figure-caption">Local JavaScript teaching model. It does not run a server, SQL, Docker, dbt, Airflow, Sentry or a deployment. The lesson identifies separately runnable exercises and what they verify.</p>`,
  );
  const run = root.querySelector("[data-action=scenario]"),
    attempt = root.querySelector("#scenario-attempt"),
    seen = new Set();
  const select = root.querySelector("#scenario-choice");
  const selectedLabel = () => model.cases.find(([key]) => key === select.value)[1];
  const describe = () => {
    root.querySelector("#scenario-description").textContent = `Selected: ${selectedLabel()}. Run to update the observations below.`;
  };
  select.addEventListener("change", describe);
  describe();
  if (attempt) {
    run.disabled = true;
    attempt.addEventListener("input", () => {
      run.disabled = attempt.value.trim().length < 10;
    });
  }
  const progress = () =>
    status(
      root,
      `${seen.size}/${model.cases.length} scenarios observed.${attempt ? " Your scratch attempt is not automatically graded." : ""}`,
    );
  run.onclick = () => {
    const key = root.querySelector("#scenario-choice").value;
    const r = runScenario(id, key);
    root.querySelector("#scenario-result").innerHTML =
      `<h4>Observed: ${e(selectedLabel())}</h4><div class="table-scroll"><table class="result-table"><thead><tr>${r.columns.map((c) => `<th scope="col">${e(c)}</th>`).join("")}</tr></thead><tbody>${r.rows.map((row) => `<tr>${row.map((value) => `<td>${e(value)}</td>`).join("")}</tr>`).join("")}</tbody></table></div><ol class="event-list">${r.trace.map((item) => `<li>${e(item)}</li>`).join("")}</ol><p class="notice">${e(r.note)}</p>`;
    seen.add(key);
    log(
      root,
      `${model.cases.find(([candidate]) => candidate === key)[1]}: ${r.rows.length} result row(s) inspected.`,
    );
    progress();
    if (seen.size === model.cases.length)
      complete([
        `Observed all ${seen.size} prepared ${id} model scenarios`,
        "Compared the displayed boundary observations and limitations",
        ...(attempt
          ? ["Entered an ungraded scratch attempt before model feedback"]
          : []),
      ]);
  };
  progress();
}
export const courseLabs = Object.fromEntries(
  Object.keys(courseModels).map((id) => [
    id,
    (root, complete) => mountScenario(root, id, complete),
  ]),
);
