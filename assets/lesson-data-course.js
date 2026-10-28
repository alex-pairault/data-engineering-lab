import { webQuestions } from "./course-models/web-questions.js";
import { dataQuestions } from "./course-models/data-questions.js";
import { decisionsQuestions } from "./course-models/decisions-questions.js";
export const courseLessonData = {
  ...webQuestions,
  ...dataQuestions,
  ...decisionsQuestions,
};
