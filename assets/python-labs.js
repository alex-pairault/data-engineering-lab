import { pythonLessons } from "./python-curriculum.js";
import { codingEvidence } from "./coding-evidence.js";

export const pythonLabs = Object.fromEntries(
  pythonLessons.map(({ id, number }) => [
    id,
    (root, complete) =>
      codingEvidence(
        root,
        id,
        complete,
        `python tools/check.py ${String(number).padStart(2, "0")}`,
      ),
  ]),
);
