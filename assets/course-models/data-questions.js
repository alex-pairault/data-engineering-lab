export const dataQuestions = {
  transactions: {
    recall:
      "Two callers read stock 1, then both write stock 0 and accept a sale. What is wrong even though stock never becomes negative?",
    reflection:
      "Explain the two requests at once mechanism in your own words. Record one prediction, the observed result, one failure or tradeoff, and the limits of the evidence. Distinguish browser-model practice from any command you actually ran and state the help used.",
    evidence:
      "Predict and inspect all 3 prepared scenarios, then use the focused practical task below. Model completion is guided practice, not a claim that you ran an external tool.",
    checks: [
      {
        id: "q1",
        question:
          "Which observation proves the stale-read example is incorrect?",
        options: [
          "Both callers used valid SQL",
          "The table has a constraint",
          "Two sales consumed one unit",
          "Stock is stored as zero",
        ],
        answer: 2,
        hint: "Trace the boundary and distinguish the observation from a broader claim.",
        feedback:
          "Accepted sales exceeded available stock even though the stored quantity stayed nonnegative.",
      },
      {
        id: "q2",
        question:
          "What must the guarded sale inspect before recording success?",
        options: [
          "The name of the function",
          "The affected database row count",
          "The browser rendering frame rate",
          "The length of the URL",
        ],
        answer: 1,
        hint: "Trace the boundary and distinguish the observation from a broader claim.",
        feedback:
          "Only the guarded update that affects one row may record this sale.",
      },
    ],
    review: {
      question: "Does a database rollback undo an already sent email?",
      options: [
        "No; external effects remain separate",
        "Yes every effect disappears automatically",
        "Only browser cookies are restored",
        "Only function names are restored",
      ],
      answer: 0,
      feedback:
        "A database rollback does not reverse already completed external side effects.",
    },
  },
  "idempotent-imports": {
    recall:
      "A run commits two records before stopping. What should happen if you replay the complete input with the same source IDs?",
    reflection:
      "Explain the retry without duplicating effects mechanism in your own words. Record one prediction, the observed result, one failure or tradeoff, and the limits of the evidence. Distinguish browser-model practice from any command you actually ran and state the help used.",
    evidence:
      "Predict and inspect all 3 prepared scenarios, then use the focused practical task below. Model completion is guided practice, not a claim that you ran an external tool.",
    checks: [
      {
        id: "q1",
        question:
          "Which identity supports safe replay of this source snapshot?",
        options: [
          "A newly generated display label",
          "A stable external record identifier",
          "A new random attempt identifier",
          "A current browser tab identifier",
        ],
        answer: 1,
        hint: "Trace the boundary and distinguish the observation from a broader claim.",
        feedback:
          "Keep source identity stable across attempts and enforce its uniqueness.",
      },
      {
        id: "q2",
        question: "The same ID arrives with changed content. What is needed?",
        options: [
          "An explicit content change policy",
          "A silent blanket ignore policy",
          "A different random key always",
          "A browser cache refresh only",
        ],
        answer: 0,
        hint: "Trace the boundary and distinguish the observation from a broader claim.",
        feedback:
          "Choose update or reject semantics deliberately; identity alone does not define content-change behaviour.",
      },
    ],
    review: {
      question:
        "Deduplication is recorded before its effect commits. What is missing?",
      options: [
        "A longer browser session cookie",
        "A different stylesheet file name",
        "A larger request query string",
        "Atomic identity and effect handling",
      ],
      answer: 3,
      feedback:
        "The identity and database business effect must commit together to avoid suppressing an unapplied effect.",
    },
  },
  "dbt-quality": {
    recall:
      "A dbt model ran successfully. Does that establish unique IDs, valid references and nonnegative source amounts?",
    reflection:
      "Explain the make a data assumption executable mechanism in your own words. Record one prediction, the observed result, one failure or tradeoff, and the limits of the evidence. Distinguish browser-model practice from any command you actually ran and state the help used.",
    evidence:
      "Predict and inspect all 5 prepared scenarios, then use the focused practical task below. Model completion is guided practice, not a claim that you ran an external tool.",
    checks: [
      {
        id: "q1",
        question: "What does a default dbt data test evaluate?",
        options: [
          "Rows violating its declared assertion",
          "Every future warehouse write automatically",
          "Every possible business requirement simultaneously",
          "Every upstream service uptime guarantee",
        ],
        answer: 0,
        hint: "Trace the boundary and distinguish the observation from a broader claim.",
        feedback:
          "Data tests evaluate violations in current data; default passing is zero failures, subject to configuration.",
      },
      {
        id: "q2",
        question: "Why test a source key before aggregation?",
        options: [
          "Aggregation always enforces source uniqueness",
          "Every null becomes valid automatically",
          "Every join becomes one-to-one automatically",
          "Aggregation can hide invalid records",
        ],
        answer: 3,
        hint: "Trace the boundary and distinguish the observation from a broader claim.",
        feedback:
          "Filtering or aggregation can conceal a violated input assumption while still producing an output model.",
      },
    ],
    review: {
      question:
        "A relationships test passes with null foreign keys. What else may be required?",
      options: [
        "A different browser cache setting",
        "A larger model description field",
        "A separate not null assertion",
        "A longer SQL file name",
      ],
      answer: 2,
      feedback:
        "References and missingness are distinct assertions; add not_null when required.",
    },
  },
  orchestration: {
    recall:
      "How do “run every morning,” “process each queued job,” and “receive an HTTP event” differ? Could a system use all three?",
    reflection:
      "Explain the dependencies, schedules, and events mechanism in your own words. Record one prediction, the observed result, one failure or tradeoff, and the limits of the evidence. Distinguish browser-model practice from any command you actually ran and state the help used.",
    evidence:
      "Predict and inspect all 4 prepared scenarios, then use the focused practical task below. Model completion is guided practice, not a claim that you ran an external tool.",
    checks: [
      {
        id: "q1",
        question: "What primarily expresses task order in this workflow?",
        options: [
          "The length of task names",
          "The time the browser opens",
          "The filename of a stylesheet",
          "Explicit dependencies between the tasks",
        ],
        answer: 3,
        hint: "Trace the boundary and distinguish the observation from a broader claim.",
        feedback:
          "Dependencies express when a task has the inputs or upstream success it requires.",
      },
      {
        id: "q2",
        question:
          "An effect commits but its acknowledgement is lost. What can happen?",
        options: [
          "Every consumer automatically forgets everything",
          "Every task becomes permanently successful",
          "The same event is redelivered",
          "The database always rolls back",
        ],
        answer: 2,
        hint: "Trace the boundary and distinguish the observation from a broader claim.",
        feedback:
          "Redelivery can repeat an effect unless the operation handles stable identity safely.",
      },
    ],
    review: {
      question: "Can one system use webhooks, queues and schedules together?",
      options: [
        "Only after removing all dependencies",
        "Yes; they serve different roles",
        "No they are identical protocols",
        "Only if every payload differs",
      ],
      answer: 1,
      feedback:
        "A webhook can enqueue work while a scheduled workflow performs reconciliation.",
    },
  },
  "query-plans": {
    recall:
      "A page loads five orders and then queries each order’s lines separately. How many SELECTs does that create, and what could a batched alternative change?",
    reflection:
      "Explain the measure before optimising mechanism in your own words. Record one prediction, the observed result, one failure or tradeoff, and the limits of the evidence. Distinguish browser-model practice from any command you actually ran and state the help used.",
    evidence:
      "Predict and inspect all 3 prepared scenarios, then use the focused practical task below. Model completion is guided practice, not a claim that you ran an external tool.",
    checks: [
      {
        id: "q1",
        question:
          "Five parent rows plus one child query each produces how many SELECTs?",
        options: [
          "Five SELECTs for this example",
          "One SELECT for this example",
          "Six SELECTs for this example",
          "Two SELECTs for this example",
        ],
        answer: 2,
        hint: "Trace the boundary and distinguish the observation from a broader claim.",
        feedback: "There is one parent query plus five child queries.",
      },
      {
        id: "q2",
        question:
          "What must remain true when batching replaces per-parent access?",
        options: [
          "Every response becomes automatically small",
          "Results preserve the required meaning",
          "Every index becomes automatically unnecessary",
          "Every workload becomes infinitely faster",
        ],
        answer: 1,
        hint: "Trace the boundary and distinguish the observation from a broader claim.",
        feedback:
          "Verify equal intended results and consider bounds, round trips and memory separately.",
      },
    ],
    review: {
      question:
        "What is special about EXPLAIN ANALYZE compared with a plan estimate?",
      options: [
        "It actually executes the statement",
        "It never touches any data",
        "It always repairs every index",
        "It always proves universal speedups",
      ],
      answer: 0,
      feedback:
        "EXPLAIN ANALYZE executes the statement; treat write statements accordingly.",
    },
  },
  "airflow-failures": {
    recall:
      "A task retries once after failing. How many attempts are possible, and what must happen before a dependent task can proceed?",
    reflection:
      "Explain the a workflow fails halfway mechanism in your own words. Record one prediction, the observed result, one failure or tradeoff, and the limits of the evidence. Distinguish browser-model practice from any command you actually ran and state the help used.",
    evidence:
      "Predict and inspect all 4 prepared scenarios, then use the focused practical task below. Model completion is guided practice, not a claim that you ran an external tool.",
    checks: [
      {
        id: "q1",
        question: "With retries=1, how many total attempts are permitted here?",
        options: [
          "One attempt including the first",
          "Three attempts including the first",
          "Four attempts including the first",
          "Two attempts including the first",
        ],
        answer: 3,
        hint: "Trace the boundary and distinguish the observation from a broader claim.",
        feedback: "One retry is one extra attempt beyond the initial attempt.",
      },
      {
        id: "q2",
        question:
          "A failed attempt already wrote externally. What does retry alone guarantee?",
        options: [
          "Every duplicate is automatically suppressed",
          "Every downstream task runs immediately",
          "No automatic reversal of effects",
          "Every external write disappears automatically",
        ],
        answer: 2,
        hint: "Trace the boundary and distinguish the observation from a broader claim.",
        feedback:
          "Task retries do not undo prior external effects; the business operation needs its own safety boundary.",
      },
    ],
    review: {
      question: "What does this dag.test() execution establish directly?",
      options: [
        "Every external API remains idempotent",
        "The prepared local task behaviour",
        "Every distributed executor configuration works",
        "Every production scheduler stays available",
      ],
      answer: 1,
      feedback:
        "Local DAG testing supports the prepared local task behaviour, not every production deployment property.",
    },
  },
  recovery: {
    recall:
      "A backup file exists and an application deployment was reverted. What would prove that the needed data can actually be recovered?",
    reflection:
      "Explain the make the way back explicit mechanism in your own words. Record one prediction, the observed result, one failure or tradeoff, and the limits of the evidence. Distinguish browser-model practice from any command you actually ran and state the help used.",
    evidence:
      "Predict and inspect all 3 prepared scenarios, then use the focused practical task below. Model completion is guided practice, not a claim that you ran an external tool.",
    checks: [
      {
        id: "q1",
        question: "What verifies this backup beyond its mere existence?",
        options: [
          "Only revert the application code",
          "Only restart the browser process",
          "Restore and check required data",
          "Only inspect its filename length",
        ],
        answer: 2,
        hint: "Trace the boundary and distinguish the observation from a broader claim.",
        feedback:
          "Restore into a separate disposable target and verify the required rows and business assertions.",
      },
      {
        id: "q2",
        question:
          "An older snapshot restores successfully. What may still be missing?",
        options: [
          "Only the browser stylesheet file",
          "Writes committed after that snapshot",
          "Every original database table necessarily",
          "Every original snapshot row necessarily",
        ],
        answer: 1,
        hint: "Trace the boundary and distinguish the observation from a broader claim.",
        feedback:
          "A valid old snapshot can still lose later writes; recovery-point and reconciliation requirements matter.",
      },
    ],
    review: {
      question:
        "Does reverting application code restore already deleted database rows?",
      options: [
        "No; data recovery remains separate",
        "Yes every row returns automatically",
        "Only after renaming the deployment",
        "Only after changing the browser",
      ],
      answer: 0,
      feedback: "Code rollback is not data restoration.",
    },
  },
};
