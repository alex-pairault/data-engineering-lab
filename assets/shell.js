import { readyLessons, lessonUrl, escapeHtml as e } from "./curriculum.js";
import { store, entryStatus } from "./store.js";
export const base = document.body.dataset.page === "lesson" ? "../" : "./";
let toastTimer;
export function toast(message) {
  let element = document.querySelector("#toast");
  if (!element) {
    element = document.createElement("div");
    element.id = "toast";
    element.className = "toast";
    element.setAttribute("role", "status");
    document.body.append(element);
  }
  element.textContent = message;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => (element.textContent = ""), 7000);
}
export function exportProgress() {
  const url = URL.createObjectURL(
    new Blob([JSON.stringify(store.export(), null, 2)], {
      type: "application/json",
    }),
  );
  const link = document.createElement("a");
  link.href = url;
  link.download = `fieldnotes-progress-${new Date().toISOString().slice(0, 10)}.json`;
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
  toast("Progress backup downloaded.");
}
export function showDialog(title, content) {
  document.querySelector("#app-dialog")?.remove();
  const dialog = document.createElement("dialog");
  dialog.id = "app-dialog";
  dialog.setAttribute("aria-label", title);
  dialog.innerHTML = `<button class="button-secondary close-dialog" aria-label="Close dialog">Close</button><p class="eyebrow">Fieldnotes</p><h2>${e(title)}</h2><div class="dialog-content">${content}</div>`;
  dialog.querySelector(".close-dialog").onclick = () => dialog.close();
  dialog.addEventListener("click", (event) => {
    if (event.target === dialog && event.offsetX < 0) dialog.close();
  });
  dialog.addEventListener("close", () => dialog.remove());
  document.body.append(dialog);
  dialog.showModal();
  return dialog;
}
export function mountShell(section = "today", lessonId = null) {
  document.querySelector(".sidebar")?.remove();
  document.querySelector(".topbar")?.remove();
  const sidebar = document.createElement("aside");
  sidebar.className = "sidebar";
  sidebar.id = "sidebar";
  sidebar.setAttribute("aria-label", "Course navigation");
  const state = store.get();
  const nav = [
    ["today", "◷", "Today"],
    ["course", "≡", "Course map"],
    ["evidence", "✓", "Practice evidence"],
    ["backups", "↥", "Backups"],
  ];
  sidebar.innerHTML = `<a class="brand" href="${base}index.html"><span class="brand-mark" aria-hidden="true">F</span><span><strong>Fieldnotes</strong><small>Engineering practice</small></span></a><nav class="main-nav" aria-label="Main">${nav.map(([id, symbol, label]) => `<a href="${base}index.html#${id}" ${section === id ? 'aria-current="page"' : ""}><span class="nav-symbol" aria-hidden="true">${symbol}</span>${label}</a>`).join("")}</nav><p class="side-title">Your first five sessions</p><nav class="side-lessons" aria-label="Available lessons">${readyLessons.map((lesson) => `<a href="${lessonUrl(lesson, base)}" class="${lesson.id === lessonId ? "current" : ""}" ${lesson.id === lessonId ? 'aria-current="page"' : ""}><span class="side-number">${String(lesson.number).padStart(2, "0")}</span><span>${e(lesson.title)}<small>${entryStatus(state.lessons[lesson.id])}</small></span></a>`).join("")}</nav><div class="sidebar-footer"><p>Thirty minutes.<br/>One thing you can explain.</p><p style="margin-top:15px">Progress stays in this browser.<br/><a href="${base}index.html#backups">Export a backup</a></p><p style="margin-top:18px"><a href="https://github.com/alex-pairault/data-engineering-lab" target="_blank" rel="noopener">Project source ↗</a></p></div>`;
  const topbar = document.createElement("header");
  topbar.className = "topbar";
  topbar.innerHTML = `<button class="menu-toggle" aria-controls="sidebar" aria-expanded="false">Menu</button><span class="topbar-title">Engineering foundations <span style="color:#a9b7cd;padding:0 10px">/</span> ${lessonId ? "Lesson workspace" : { today: "Your next session", course: "The complete route", evidence: "Evidence of practice", backups: "Your progress, portable" }[section] || "Your next session"}</span><span class="save-indicator ${store.error() ? "error" : ""}" role="status"><span class="save-dot" aria-hidden="true"></span><span>${store.error() ? "Storage needs attention" : "Saved in this browser"}</span></span>`;
  topbar.querySelector(".menu-toggle").onclick = (event) => {
    const expanded = sidebar.classList.toggle("open");
    event.currentTarget.setAttribute("aria-expanded", String(expanded));
  };
  sidebar.addEventListener("click", (event) => {
    if (event.target.closest("a")) {
      sidebar.classList.remove("open");
      topbar
        .querySelector(".menu-toggle")
        .setAttribute("aria-expanded", "false");
    }
  });
  document.body.prepend(topbar);
  document.body.prepend(sidebar);
  const main = document.querySelector("#main");
  main.classList.add("page-main");
  if (store.error()) {
    const warning = document.createElement("p");
    warning.className = "notice warning";
    warning.setAttribute("role", "alert");
    warning.textContent = store.error();
    main.prepend(warning);
  }
}
window.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    document.querySelector(".sidebar")?.classList.remove("open");
    document
      .querySelector(".menu-toggle")
      ?.setAttribute("aria-expanded", "false");
  }
});
export function refreshSaveIndicator() {
  const indicator = document.querySelector(".save-indicator");
  if (!indicator) return;
  indicator.classList.toggle("error", Boolean(store.error()));
  indicator.querySelector("span:last-child").textContent = store.error()
    ? "Progress is not saving"
    : "Saved in this browser";
  let recovery = document.querySelector("#storage-recovery");
  if (store.error()) {
    if (!recovery) {
      recovery = document.createElement("aside");
      recovery.id = "storage-recovery";
      recovery.className = "storage-recovery";
      recovery.setAttribute("role", "alert");
      recovery.innerHTML =
        '<p></p><button class="button-secondary">Export current draft</button>';
      recovery.querySelector("button").onclick = exportProgress;
      document.body.append(recovery);
    }
    recovery.querySelector("p").textContent = store.error();
  } else recovery?.remove();
  document.querySelectorAll(".side-lessons a").forEach((anchor, index) => {
    const lesson = readyLessons[index];
    if (lesson)
      anchor.querySelector("small").textContent = entryStatus(
        store.entry(lesson.id),
      );
  });
}
window.addEventListener("fieldnotes:change", refreshSaveIndicator);
