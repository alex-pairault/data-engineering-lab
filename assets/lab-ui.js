export const controls = (html) => `<div class="lab-controls">${html}</div>`;
export const button = (id, label, kind = "button-secondary") =>
  `<button class="${kind}" data-action="${id}">${label}</button>`;
export function frame(root, title, body) {
  root.innerHTML = `<div class="lab-top"><strong>${title}</strong><span>Interactive experiment</span></div><div class="lab-body">${body}</div>`;
}
export function log(root, message) {
  const target = root.querySelector(".lab-log");
  target.textContent += `${target.textContent ? "\n" : ""}${message}`;
  target.scrollTop = target.scrollHeight;
}
export function status(root, message, type = "") {
  const target = root.querySelector(".lab-status");
  target.textContent = message;
  target.className = `lab-status ${type}`;
}
