import {
  lessonById,
  readyLessons,
  lessonUrl,
  escapeHtml as e,
} from "./curriculum.js";
import { store, practiceReady, entryStatus } from "./store.js";
import { lessonData } from "./lesson-data.js";
import { mountShell, toast, refreshSaveIndicator, base } from "./shell.js";
import { mountLab } from "./labs.js";
const id = document.body.dataset.lesson,
  lesson = lessonById(id),
  data = lessonData[id];
mountShell("lesson", id);
document.querySelector("#main").classList.add("lesson-main");
function update(change) {
  try {
    return store.update(id, change);
  } catch (error) {
    toast(error.message);
    refreshSaveIndicator();
    return null;
  }
}
if (!store.entry(id)) update({});
const entry = () => store.entry(id);
const recall = document.querySelector("#recall-answer");
recall.value = entry()?.recall || "";
recall.placeholder = data.recall;
document.querySelector("#recall-prompt").textContent = data.recall;
const reflection = document.querySelector("#reflection-answer");
reflection.value = entry()?.reflection || "";
document.querySelector("#reflection-prompt").textContent = data.reflection;
function autosave(field, input) {
  let timer;
  input.addEventListener("input", () => {
    clearTimeout(timer);
    timer = setTimeout(() => update({ [field]: input.value }), 350);
  });
  input.addEventListener("blur", () => {
    clearTimeout(timer);
    update({ [field]: input.value });
  });
}
autosave("recall", recall);
autosave("reflection", reflection);
window.addEventListener("pagehide", () => {
  const current = entry(),
    change = {};
  if (recall.value !== current?.recall) change.recall = recall.value;
  if (reflection.value !== current?.reflection)
    change.reflection = reflection.value;
  if (Object.keys(change).length) update(change);
});
document.querySelector("#save-recall").onclick = () => {
  if (update({ recall: recall.value }))
    toast("Recall attempt saved. Now compare it with the visual explanation.");
};
const confidence = document.querySelector("#confidence");
confidence.innerHTML = [1, 2, 3, 4, 5]
  .map(
    (value) =>
      `<label><input type="radio" name="confidence" value="${value}" ${entry()?.confidence === value ? "checked" : ""}>${value}${value === 1 ? " · unsure" : value === 5 ? " · confident" : ""}</label>`,
  )
  .join("");
confidence.addEventListener("change", (event) =>
  update({ confidence: Number(event.target.value) }),
);
function renderChecks() {
  document.querySelector("#concept-checks").innerHTML = data.checks
    .map((question, questionIndex) => {
      const saved = entry()?.checks[question.id];
      const rotation = (lesson.number + questionIndex) % 4,
        indices = [0, 1, 2, 3].map((n) => (n + rotation) % 4);
      return `<form class="quiz" data-question="${question.id}"><fieldset><legend>${e(question.question)}</legend>${indices.map((index) => `<label class="quiz-choice"><input type="radio" name="answer-${question.id}" value="${index}" ${saved?.choice === index ? "checked" : ""}>${e(question.options[index])}</label>`).join("")}</fieldset><div class="quiz-actions"><button class="button-secondary" type="submit">Check answer</button><button class="text-button" type="button" data-hint="${question.id}">Show hint</button></div><div class="hint" id="hint-${question.id}" ${saved?.hinted ? "" : "hidden"}>${e(question.hint)}</div><p class="quiz-feedback ${saved?.correct ? "correct" : saved?.attempts ? "incorrect" : ""}" role="status">${saved?.correct ? `Correct. ${e(question.feedback)}` : saved?.attempts ? "A previous attempt needs another look. Try again." : ""}</p><p class="small muted" data-attempts>${saved?.attempts ? `${saved.attempts} attempt${saved.attempts === 1 ? "" : "s"}${saved.hinted ? " · hint used" : ""}` : ""}</p></form>`;
    })
    .join("");
  document.querySelectorAll("[data-question]").forEach((form) => {
    const question = data.checks.find((q) => q.id === form.dataset.question);
    form.onsubmit = (event) => {
      event.preventDefault();
      const selected = form.querySelector("input:checked");
      if (!selected) {
        form.querySelector(".quiz-feedback").textContent =
          "Choose an answer first.";
        return;
      }
      const current = entry(),
        old = current?.checks[question.id] || { attempts: 0, hinted: false },
        correct = Number(selected.value) === question.answer;
      const updated = update({
        checks: {
          ...current?.checks,
          [question.id]: {
            ...old,
            attempts: old.attempts + 1,
            correct,
            choice: Number(selected.value),
          },
        },
      });
      if (!updated) return;
      form.querySelector(".quiz-feedback").textContent =
        `${correct ? "Correct." : "Not yet."} ${question.feedback}`;
      form.querySelector(".quiz-feedback").className =
        `quiz-feedback ${correct ? "correct" : "incorrect"}`;
      form.querySelector("[data-attempts]").textContent =
        `${old.attempts + 1} attempt${old.attempts + 1 === 1 ? "" : "s"}${old.hinted ? " · hint used" : ""}`;
      refreshCompletion();
    };
    form.querySelector("[data-hint]").onclick = () => {
      const current = entry(),
        old = current?.checks[question.id] || {
          attempts: 0,
          correct: false,
          choice: null,
        };
      if (
        update({
          checks: {
            ...current?.checks,
            [question.id]: { ...old, hinted: true },
          },
        })
      ) {
        form.querySelector(".hint").hidden = false;
        form.querySelector("[data-attempts]").textContent =
          `${old.attempts} attempts · hint used`;
      }
    };
  });
}
renderChecks();
const evidenceLabel = document.querySelector("#lab-evidence");
document.querySelector("#lab-task").textContent = data.evidence;
mountLab(document.querySelector("#interactive-lab"), id, (evidence) => {
  if (update({ labComplete: true, labEvidence: evidence })) {
    evidenceLabel.textContent = "✓ Lab observations recorded";
    evidenceLabel.classList.add("done");
    refreshCompletion();
  }
});
if (entry()?.labComplete) {
  evidenceLabel.textContent = "✓ Lab observations recorded in an earlier visit";
  evidenceLabel.classList.add("done");
}
function refreshCompletion() {
  const current = entry();
  document.querySelector("#completion-list").innerHTML = [
    ["Lab observed", current?.labComplete],
    [
      "Two checks correct",
      current?.checks.q1?.correct && current?.checks.q2?.correct,
    ],
    ["Your explanation saved", current?.reflection.trim().length >= 30],
  ]
    .map(
      ([label, done]) =>
        `<span class="${done ? "done" : ""}">${done ? "✓" : "○"} ${label}</span>`,
    )
    .join("");
  const button = document.querySelector("#save-practice");
  button.disabled = !practiceReady(current);
  button.textContent = current?.practicedAt
    ? "Practice already recorded"
    : "Save practice session";
  document.querySelector("#practice-status").textContent = current?.practicedAt
    ? `${entryStatus(current)}. Next spaced review: ${new Intl.DateTimeFormat("en", { month: "short", day: "numeric" }).format(new Date(current.reviewDueAt))}. Your explanation remains editable.`
    : "Your draft saves automatically. Recording practice requires the lab, two checks, and your own explanation (at least 30 characters).";
}
document.querySelector("#save-practice").onclick = () => {
  update({ reflection: reflection.value });
  try {
    store.practice(id);
    refreshCompletion();
    toast("Practice recorded. A spaced review is scheduled in two days.");
  } catch (error) {
    toast(error.message);
  }
};
window.addEventListener("fieldnotes:change", refreshCompletion);
refreshCompletion();
const next = readyLessons[readyLessons.findIndex((l) => l.id === id) + 1];
document.querySelector("#next-lesson").innerHTML = next
  ? `<a class="button-secondary" href="${lessonUrl(next, base)}">Next: ${e(next.title)} →</a>`
  : `<a class="button-secondary" href="${base}index.html#evidence">View your practice evidence →</a>`;
