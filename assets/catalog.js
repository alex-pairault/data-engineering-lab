import { lessons } from "./curriculum.js";
import { pythonLessons } from "./python-curriculum.js";

export const allLessons = [...lessons, ...pythonLessons];
export const lessonById = (id) => allLessons.find((lesson) => lesson.id === id);
export const trackLessons = (lesson) =>
  lesson?.track === "python" ? pythonLessons : lessons;
