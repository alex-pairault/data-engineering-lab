export const decisionsQuestions = {
  "product-criteria": {
    recall:
      "An agent proposes “add Redis to make the dashboard better.” What user-visible result would let you accept or reject that proposal?",
    reflection:
      "Explain the define what better means mechanism in your own words. Record one prediction, the observed result, one failure or tradeoff, and the limits of the evidence. Distinguish browser-model practice from any command you actually ran and state the help used.",
    evidence:
      "Predict and inspect all 4 prepared scenarios, then use the focused practical task below. Model completion is guided practice, not a claim that you ran an external tool.",
    checks: [
      {
        id: "q1",
        question: "Which criterion states an observable user outcome?",
        options: [
          "Install Redis on every server",
          "Rename the main Python module",
          "Choose an unspecified modern framework",
          "Updated orders appear within 60s",
        ],
        answer: 3,
        hint: "Trace the boundary and distinguish the observation from a broader claim.",
        feedback:
          "State the observable result and its conditions; a tool choice alone is not acceptance evidence.",
      },
      {
        id: "q2",
        question:
          "One sampled request is below a latency threshold. What follows?",
        options: [
          "All user needs are satisfied",
          "All permission checks are correct",
          "Only that sample was observed",
          "Every future request meets p95",
        ],
        answer: 2,
        hint: "Trace the boundary and distinguish the observation from a broader claim.",
        feedback:
          "A sampled latency observation does not establish a percentile, future guarantee or unrelated requirement.",
      },
    ],
    review: {
      question:
        "A fast response exposes another user’s rows. How should acceptance treat it?",
      options: [
        "Ignore because the browser rendered",
        "Reject the failed isolation criterion",
        "Accept because performance always dominates",
        "Accept because JSON remained parseable",
      ],
      answer: 1,
      feedback:
        "Isolation is an independent required condition in this exercise.",
    },
  },
  "context-packets": {
    recall:
      "An agent gets a large repository dump and a vague request. Which missing details could still make its implementation unsafe or impossible to review?",
    reflection:
      "Explain the give the agent the right context mechanism in your own words. Record one prediction, the observed result, one failure or tradeoff, and the limits of the evidence. Distinguish browser-model practice from any command you actually ran and state the help used.",
    evidence:
      "Predict and inspect all 3 prepared scenarios, then use the focused practical task below. Model completion is guided practice, not a claim that you ran an external tool.",
    checks: [
      {
        id: "q1",
        question: "Which packet most helps make a change reviewable?",
        options: [
          "Only a confident completion request",
          "Bounded context with explicit checks",
          "Every file without any objective",
          "Only the preferred framework name",
        ],
        answer: 1,
        hint: "Trace the boundary and distinguish the observation from a broader claim.",
        feedback:
          "Supply the user problem, relevant context, invariants, acceptance cases and verification.",
      },
      {
        id: "q2",
        question: "Does a detailed packet guarantee agent correctness?",
        options: [
          "No; independent verification remains necessary",
          "Yes generated claims become evidence",
          "Only when prompts are longer",
          "Only when responses are longer",
        ],
        answer: 0,
        hint: "Trace the boundary and distinguish the observation from a broader claim.",
        feedback:
          "A task description is not proof that the resulting implementation satisfies it.",
      },
    ],
    review: {
      question: "Why keep the requested change small?",
      options: [
        "Every dependency becomes automatically secure",
        "All future requirements disappear permanently",
        "Every review finding becomes irrelevant",
        "Smaller changes simplify relevant review",
      ],
      answer: 3,
      feedback:
        "Small, focused changes reduce the amount a reviewer must reason about at once.",
    },
  },
  "ci-delivery": {
    recall:
      "CI is green for commit A, but the artifact was built from commit B. Which claim is still unverified?",
    reflection:
      "Explain the let the checks travel with the change mechanism in your own words. Record one prediction, the observed result, one failure or tradeoff, and the limits of the evidence. Distinguish browser-model practice from any command you actually ran and state the help used.",
    evidence:
      "Predict and inspect all 3 prepared scenarios, then use the focused practical task below. Model completion is guided practice, not a claim that you ran an external tool.",
    checks: [
      {
        id: "q1",
        question:
          "Green checks for A support deploying which artifact directly?",
        options: [
          "The artifact verified from A",
          "Any artifact with similar filenames",
          "Any artifact from another branch",
          "Any artifact with newer timestamps",
        ],
        answer: 0,
        hint: "Trace the boundary and distinguish the observation from a broader claim.",
        feedback: "Tie the artifact to the verified source and build evidence.",
      },
      {
        id: "q2",
        question: "What makes a deployment job wait for a required check job?",
        options: [
          "A later position in YAML",
          "A longer deployment job name",
          "A larger source code file",
          "An explicit workflow job dependency",
        ],
        answer: 3,
        hint: "Trace the boundary and distinguish the observation from a broader claim.",
        feedback:
          "Use an explicit dependency such as needs; independent jobs may run separately.",
      },
    ],
    review: {
      question: "Does passing CI prove production behaviour is correct?",
      options: [
        "Only after renaming every job",
        "Only after deleting every log",
        "No; its checked boundary matters",
        "Yes every user outcome follows",
      ],
      answer: 2,
      feedback:
        "CI establishes the assertions and environment it exercised, not every production property.",
    },
  },
  "agent-diff": {
    recall:
      "A patch scopes the SQL query to the authenticated user but keeps one shared cache key. Which return path needs a changed-user regression check?",
    reflection:
      "Explain the review the actual change mechanism in your own words. Record one prediction, the observed result, one failure or tradeoff, and the limits of the evidence. Distinguish browser-model practice from any command you actually ran and state the help used.",
    evidence:
      "Predict and inspect all 3 prepared scenarios, then use the focused practical task below. Model completion is guided practice, not a claim that you ran an external tool.",
    checks: [
      {
        id: "q1",
        question:
          "Which path can remain unsafe after scoping only the SQL query?",
        options: [
          "The length of the README",
          "The warm shared cache return",
          "The name of the stylesheet",
          "The position of browser tabs",
        ],
        answer: 1,
        hint: "Trace the boundary and distinguish the observation from a broader claim.",
        feedback: "A cache hit can bypass the newly scoped database query.",
      },
      {
        id: "q2",
        question: "What makes the regression test useful for this review?",
        options: [
          "It rejects the broken behaviour",
          "It always passes every patch",
          "It only checks status 200",
          "It only repeats agent claims",
        ],
        answer: 0,
        hint: "Trace the boundary and distinguish the observation from a broader claim.",
        feedback:
          "A useful regression fails the relevant broken implementation and verifies the intended result.",
      },
    ],
    review: {
      question:
        "A repair returns no records for everyone. What must the review check?",
      options: [
        "Only the absence of exceptions",
        "Only the new function names",
        "Only the shortened response length",
        "Required data presence and ownership",
      ],
      answer: 3,
      feedback:
        "Isolation includes returning the correct required data, not silently dropping it all.",
    },
  },
  "interview-practice": {
    recall:
      "Explain one recent technical change in your own words: what was the requirement, what happened across the system, and what did you actually verify?",
    reflection:
      "Explain the explain a system out loud mechanism in your own words. Record one prediction, the observed result, one failure or tradeoff, and the limits of the evidence. Distinguish browser-model practice from any command you actually ran and state the help used.",
    evidence:
      "Predict and inspect all 3 prepared scenarios, then use the focused practical task below. Model completion is guided practice, not a claim that you ran an external tool.",
    checks: [
      {
        id: "q1",
        question:
          "Which claim is supported by running a prepared local exercise?",
        options: [
          "Experience executing that bounded exercise",
          "Years operating every production dependency",
          "Independent mastery of every topic",
          "Proof of all future performance",
        ],
        answer: 0,
        hint: "Trace the boundary and distinguish the observation from a broader claim.",
        feedback:
          "Describe the concrete work and assistance honestly; local practice is valuable without overstating its scope.",
      },
      {
        id: "q2",
        question: "When an interviewer changes one important fact, what helps?",
        options: [
          "Repeat the memorized answer unchanged",
          "Ignore every new failure observation",
          "Claim certainty without checking evidence",
          "Clarify assumptions and test hypotheses",
        ],
        answer: 3,
        hint: "Trace the boundary and distinguish the observation from a broader claim.",
        feedback:
          "Use the changed fact to refine assumptions and choose a discriminating next check.",
      },
    ],
    review: {
      question:
        "What strengthens a technical explanation beyond naming a tool?",
      options: [
        "Only a more confident tone",
        "Only a newer framework name",
        "Mechanism evidence tradeoff and limitation",
        "Only a longer tool list",
      ],
      answer: 2,
      feedback:
        "Connect purpose and mechanism to evidence, a tradeoff and the limits of your experience.",
    },
  },
  capstone: {
    recall:
      "Which existing slice can you reproduce and change today? What evidence would distinguish your own work from the course’s generated scaffolding?",
    reflection:
      "Explain the show what you can verify mechanism in your own words. Record one prediction, the observed result, one failure or tradeoff, and the limits of the evidence. Distinguish browser-model practice from any command you actually ran and state the help used.",
    evidence:
      "Predict and inspect all 3 prepared scenarios, then use the focused practical task below. Model completion is guided practice, not a claim that you ran an external tool.",
    checks: [
      {
        id: "q1",
        question:
          "What turns scaffolding into a stronger personal evidence record?",
        options: [
          "Only copying the generated README",
          "Only opening every lesson page",
          "Only increasing the confidence rating",
          "Your executed change and explanation",
        ],
        answer: 3,
        hint: "Trace the boundary and distinguish the observation from a broader claim.",
        feedback:
          "Record your actual change, execution, explanation and assistance; generated materials alone do not demonstrate your understanding.",
      },
      {
        id: "q2",
        question: "What should the final 30-minute session mainly reuse?",
        options: [
          "Every orchestration tool ever mentioned",
          "Every possible cloud deployment option",
          "One existing verified project slice",
          "An entirely new production platform",
        ],
        answer: 2,
        hint: "Trace the boundary and distinguish the observation from a broader claim.",
        feedback:
          "A bounded existing slice leaves time to execute a changed case and explain the evidence.",
      },
    ],
    review: {
      question:
        "Does a complete sample evidence form authenticate its claimed execution?",
      options: [
        "Only if templates are lengthy",
        "No; actual work needs review",
        "Yes every field proves mastery",
        "Only if wording sounds confident",
      ],
      answer: 1,
      feedback:
        "Field presence is not proof of execution or understanding; review the actual work and reasoning.",
    },
  },
};
