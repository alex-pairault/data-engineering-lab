import { lessons } from "./curriculum.js";
import { pythonLessons } from "./python-curriculum.js";
import { complexityLessons } from "./complexity-curriculum.js";

export const practiceTracks = {
  python: {
    title: "Python practice",
    sidebar: "Python coding sessions",
    lessons: pythonLessons,
  },
  complexity: {
    title: "Complexity",
    sidebar: "Complexity from zero",
    lessons: complexityLessons,
  },
};
export const allLessons = [...lessons, ...pythonLessons, ...complexityLessons];
export const lessonById = (id) => allLessons.find((lesson) => lesson.id === id);
export const trackLessons = (lesson) =>
  practiceTracks[lesson?.track]?.lessons || lessons;
