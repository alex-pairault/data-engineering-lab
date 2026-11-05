export const pythonGroup3 = {
  "py-dataframes": {
    recall:
      "What is one row in your input and output? What happens if you filter after a left join?",
    reflection:
      "In your own words, explain the mechanism you used. Include the exact command and observed result, one changed case, and any hints, documentation, agent help, or reference code you used. What remains untested?",
    evidence:
      "Implement the local exercise, run its tests, add a changed case, then record what actually happened below.",
    checks: [
      {
        id: "q1",
        question: "Which design preserves a customer with no paid orders?",
        options: [
          "Left merge totals onto customers",
          "Filter paid rows after merging",
          "Inner merge customers onto orders",
          "Drop every zero-valued output row",
        ],
        answer: 0,
        hint: "Aggregate before merging; preserve the complete customer table on the left.",
        feedback:
          "A left merge of preaggregated paid totals retains the full customer set.",
      },
      {
        id: "q2",
        question: "What is useful evidence after this coding session?",
        options: [
          "Record my command, changed case, and help",
          "Record only the page title and date",
          "Copy the solution and mark work independent",
          "Treat a correct quiz as executed code",
        ],
        answer: 0,
        hint: "Distinguish executing your own code from reading or copying a provided implementation.",
        feedback:
          "Record your actual command and result, the changed case, and assistance used. This is practice bookkeeping; correctness and independence still need review.",
      },
    ],
    review: {
      question: "Does vectorized code guarantee low peak RAM?",
      options: [
        "No, Python forbids vectorized operations",
        "No, intermediates can allocate memory",
        "Yes, arrays bypass physical memory",
        "Yes, every group streams automatically",
      ],
      answer: 1,
      feedback:
        "Measure peak state and intermediate allocations; vectorized does not mean memory-free.",
    },
  },
  "py-composition": {
    recall:
      "Which part of a total calculation belongs to the domain, and which part fetches rows?",
    reflection:
      "In your own words, explain the mechanism you used. Include the exact command and observed result, one changed case, and any hints, documentation, agent help, or reference code you used. What remains untested?",
    evidence:
      "Implement the local exercise, run its tests, add a changed case, then record what actually happened below.",
    checks: [
      {
        id: "q1",
        question: "What does injecting a repository help separate?",
        options: [
          "Storage access from business calculation",
          "Customer identity from all permissions",
          "Every exception from all callers",
          "Python syntax from its interpreter",
        ],
        answer: 0,
        hint: "The repository supplies data; the function applies the paid-only rule.",
        feedback:
          "A narrow injected boundary lets you test domain rules without a database.",
      },
      {
        id: "q2",
        question: "What is useful evidence after this coding session?",
        options: [
          "Record my command, changed case, and help",
          "Record only the page title and date",
          "Copy the solution and mark work independent",
          "Treat a correct quiz as executed code",
        ],
        answer: 0,
        hint: "Distinguish executing your own code from reading or copying a provided implementation.",
        feedback:
          "Record your actual command and result, the changed case, and assistance used. This is practice bookkeeping; correctness and independence still need review.",
      },
    ],
    review: {
      question: "Does a Protocol prove a repository enforces access rights?",
      options: [
        "Yes, annotations encrypt every record",
        "No, protocols prohibit repository methods",
        "No, behavioural checks remain necessary",
        "Yes, all permissions are automatic",
      ],
      answer: 2,
      feedback:
        "Static interface compatibility does not establish correct authorization behaviour.",
    },
  },
  "py-caching": {
    recall:
      "What can lru_cache retain? What makes caching a function with hidden changing state unsafe?",
    reflection:
      "In your own words, explain the mechanism you used. Include the exact command and observed result, one changed case, and any hints, documentation, agent help, or reference code you used. What remains untested?",
    evidence:
      "Implement the local exercise, run its tests, add a changed case, then record what actually happened below.",
    checks: [
      {
        id: "q1",
        question: "What does lru_cache maxsize directly limit?",
        options: [
          "The count of retained entries",
          "The bytes per cached result",
          "The seconds before every expiry",
          "The number of authenticated users",
        ],
        answer: 0,
        hint: "The decorator belongs directly above the function definition.",
        feedback:
          "Entry count does not directly bound bytes and provides no TTL.",
      },
      {
        id: "q2",
        question: "What is useful evidence after this coding session?",
        options: [
          "Record my command, changed case, and help",
          "Record only the page title and date",
          "Copy the solution and mark work independent",
          "Treat a correct quiz as executed code",
        ],
        answer: 0,
        hint: "Distinguish executing your own code from reading or copying a provided implementation.",
        feedback:
          "Record your actual command and result, the changed case, and assistance used. This is practice bookkeeping; correctness and independence still need review.",
      },
    ],
    review: {
      question: "What object can a cached bound method retain through its key?",
      options: [
        "Only its copied function name",
        "No objects beyond one integer",
        "Every process on the machine",
        "The instance passed as self",
      ],
      answer: 3,
      feedback:
        "Cache arguments retain references, including self for a bound method.",
    },
  },
  "py-versions": {
    recall:
      "What is the difference between parsing a module and executing an if sys.version_info branch?",
    reflection:
      "In your own words, explain the mechanism you used. Include the exact command and observed result, one changed case, and any hints, documentation, agent help, or reference code you used. What remains untested?",
    evidence:
      "Implement the local exercise, run its tests, add a changed case, then record what actually happened below.",
    checks: [
      {
        id: "q1",
        question:
          "Can a runtime if guard unsupported syntax in the same parsed module?",
        options: [
          "No, parsing happens before execution",
          "Yes, conditions skip initial parsing",
          "Yes, all Python syntax backports",
          "No, Python never supports conditions",
        ],
        answer: 0,
        hint: "The compatibility policy is an explicit supported family, not a guess about all future Python.",
        feedback:
          "The whole module must parse before runtime conditions can run.",
      },
      {
        id: "q2",
        question: "What is useful evidence after this coding session?",
        options: [
          "Record my command, changed case, and help",
          "Record only the page title and date",
          "Copy the solution and mark work independent",
          "Treat a correct quiz as executed code",
        ],
        answer: 0,
        hint: "Distinguish executing your own code from reading or copying a provided implementation.",
        feedback:
          "Record your actual command and result, the changed case, and assistance used. This is practice bookkeeping; correctness and independence still need review.",
      },
    ],
    review: {
      question: "What must an upgrade check beyond new syntax?",
      options: [
        "Dependencies, removals, and changed behaviour",
        "Only the interpreter filename spelling",
        "Only whether README text changed",
        "Nothing once the import succeeds",
      ],
      answer: 0,
      feedback:
        "Read porting/removal notes and test the real dependency environment.",
    },
  },
  "py-threads": {
    recall:
      "Which work is waiting on I/O and which is executing Python bytecode? Does the GIL make a business operation atomic?",
    reflection:
      "In your own words, explain the mechanism you used. Include the exact command and observed result, one changed case, and any hints, documentation, agent help, or reference code you used. What remains untested?",
    evidence:
      "Implement the local exercise, run its tests, add a changed case, then record what actually happened below.",
    checks: [
      {
        id: "q1",
        question: "What does the normal CPython GIL not guarantee?",
        options: [
          "Atomic multi-step shared business operations",
          "One bytecode-executing thread at once",
          "Possible overlap during blocking I/O",
          "A distinction from free-threaded builds",
        ],
        answer: 0,
        hint: "Iterate the mapped results; merely submitting work can leave failures unobserved.",
        feedback:
          "The GIL does not replace locks, transactions, or correct shared-state design.",
      },
      {
        id: "q2",
        question: "What is useful evidence after this coding session?",
        options: [
          "Record my command, changed case, and help",
          "Record only the page title and date",
          "Copy the solution and mark work independent",
          "Treat a correct quiz as executed code",
        ],
        answer: 0,
        hint: "Distinguish executing your own code from reading or copying a provided implementation.",
        feedback:
          "Record your actual command and result, the changed case, and assistance used. This is practice bookkeeping; correctness and independence still need review.",
      },
    ],
    review: {
      question: "How should a caller notice a worker exception?",
      options: [
        "Catch every error into empty data",
        "Consume the future or mapped result",
        "Only count the submitted worker functions",
        "Ignore all results after creating threads",
      ],
      answer: 1,
      feedback:
        "Retrieving results propagates exceptions to a place where they can be handled.",
    },
  },
  "py-async": {
    recall:
      "What happens when time.sleep runs inside an async function? Is async the same as CPU parallelism?",
    reflection:
      "In your own words, explain the mechanism you used. Include the exact command and observed result, one changed case, and any hints, documentation, agent help, or reference code you used. What remains untested?",
    evidence:
      "Implement the local exercise, run its tests, add a changed case, then record what actually happened below.",
    checks: [
      {
        id: "q1",
        question: "Does a semaphore alone bound all created task objects?",
        options: [
          "No, pending tasks still consume memory",
          "Yes, no other bound is needed",
          "Yes, TaskGroup persists tasks to disk",
          "No, semaphores prevent all coroutine awaits",
        ],
        answer: 0,
        hint: "Acquire the semaphore inside each task; keep tasks in input order before reading result().",
        feedback:
          "It bounds active work, while eagerly creating one task per input still uses input-sized state.",
      },
      {
        id: "q2",
        question: "What is useful evidence after this coding session?",
        options: [
          "Record my command, changed case, and help",
          "Record only the page title and date",
          "Copy the solution and mark work independent",
          "Treat a correct quiz as executed code",
        ],
        answer: 0,
        hint: "Distinguish executing your own code from reading or copying a provided implementation.",
        feedback:
          "Record your actual command and result, the changed case, and assistance used. This is practice bookkeeping; correctness and independence still need review.",
      },
    ],
    review: {
      question:
        "What happens if CPU-heavy synchronous code runs on the event loop?",
      options: [
        "All work becomes nonblocking instantly",
        "The GIL permanently disappears globally",
        "Other tasks can be delayed",
        "The loop adds cores automatically",
      ],
      answer: 2,
      feedback:
        "Cooperative scheduling needs yielding; blocking CPU work occupies the loop.",
    },
  },
  "py-processes": {
    recall:
      "Why must process-pool functions be importable? What is copied or serialized between workers?",
    reflection:
      "In your own words, explain the mechanism you used. Include the exact command and observed result, one changed case, and any hints, documentation, agent help, or reference code you used. What remains untested?",
    evidence:
      "Implement the local exercise, run its tests, add a changed case, then record what actually happened below.",
    checks: [
      {
        id: "q1",
        question: "Why can process pools increase memory use?",
        options: [
          "Workers have separate process state",
          "All workers share Python memory",
          "Serialization removes every input copy",
          "Each worker disables its RAM",
        ],
        answer: 0,
        hint: "Put square at module level, not inside parallel_squares or in a lambda.",
        feedback:
          "Separate interpreters, imported modules, buffers and serialized values can multiply memory.",
      },
      {
        id: "q2",
        question: "What is useful evidence after this coding session?",
        options: [
          "Record my command, changed case, and help",
          "Record only the page title and date",
          "Copy the solution and mark work independent",
          "Treat a correct quiz as executed code",
        ],
        answer: 0,
        hint: "Distinguish executing your own code from reading or copying a provided implementation.",
        feedback:
          "Record your actual command and result, the changed case, and assistance used. This is practice bookkeeping; correctness and independence still need review.",
      },
    ],
    review: {
      question: "Which worker function fits a spawn process pool?",
      options: [
        "A local capturing lambda expression",
        "An open database connection object",
        "A coroutine without awaiting it",
        "An importable named module-level function",
      ],
      answer: 3,
      feedback:
        "The callable and arguments must be serializable and importable in spawned workers.",
    },
  },
  "py-quality": {
    recall:
      "What can Ruff check, and what still requires behaviour tests? Why should input text never go into eval?",
    reflection:
      "In your own words, explain the mechanism you used. Include the exact command and observed result, one changed case, and any hints, documentation, agent help, or reference code you used. What remains untested?",
    evidence:
      "Implement the local exercise, run its tests, add a changed case, then record what actually happened below.",
    checks: [
      {
        id: "q1",
        question: "What does a clean lint report establish?",
        options: [
          "Selected static rules are satisfied",
          "All business behaviour is correct",
          "Every dependency is vulnerability-free forever",
          "Users own every returned record",
        ],
        answer: 0,
        hint: "Parse only JSON, then validate both allowed keys and the exact integer type.",
        feedback:
          "Linting complements tests and review; it does not prove domain correctness.",
      },
      {
        id: "q2",
        question: "What is useful evidence after this coding session?",
        options: [
          "Record my command, changed case, and help",
          "Record only the page title and date",
          "Copy the solution and mark work independent",
          "Treat a correct quiz as executed code",
        ],
        answer: 0,
        hint: "Distinguish executing your own code from reading or copying a provided implementation.",
        feedback:
          "Record your actual command and result, the changed case, and assistance used. This is practice bookkeeping; correctness and independence still need review.",
      },
    ],
    review: {
      question: "Which parser should handle untrusted JSON configuration?",
      options: [
        "json.loads followed by schema validation",
        "eval followed by exception suppression",
        "pickle.loads on arbitrary incoming bytes",
        "A shell command parsing text",
      ],
      answer: 0,
      feedback:
        "Parse data with a data parser and validate the allowed schema.",
    },
  },
  "py-pipeline": {
    recall:
      "What should happen when a source repeats a stable order ID? When should malformed input fail?",
    reflection:
      "In your own words, explain the mechanism you used. Include the exact command and observed result, one changed case, and any hints, documentation, agent help, or reference code you used. What remains untested?",
    evidence:
      "Implement the local exercise, run its tests, add a changed case, then record what actually happened below.",
    checks: [
      {
        id: "q1",
        question: "What is this exercise policy for conflicting duplicate IDs?",
        options: [
          "Reject the conflicting replay explicitly",
          "Always silently keep the latest",
          "Always silently keep the first",
          "Add both amounts to totals",
        ],
        answer: 0,
        hint: "Validate first. Compare the entire validated record when the ID already exists.",
        feedback:
          "Conflict handling is an explicit contract, not a side effect of dictionary assignment.",
      },
      {
        id: "q2",
        question: "What is useful evidence after this coding session?",
        options: [
          "Record my command, changed case, and help",
          "Record only the page title and date",
          "Copy the solution and mark work independent",
          "Treat a correct quiz as executed code",
        ],
        answer: 0,
        hint: "Distinguish executing your own code from reading or copying a provided implementation.",
        feedback:
          "Record your actual command and result, the changed case, and assistance used. This is practice bookkeeping; correctness and independence still need review.",
      },
    ],
    review: {
      question: "Why validate pending rows before filtering?",
      options: [
        "Pydantic cannot validate any paid rows",
        "Invalid source data still violates contract",
        "Pending rows always consume no memory",
        "Filtering automatically authenticates every input row",
      ],
      answer: 1,
      feedback:
        "An irrelevant status does not make an invalid source row acceptable.",
    },
  },
  "py-capstone": {
    recall:
      "What evidence would let a reviewer trust an agent-assisted endpoint? Which parts would a local test still leave unproven?",
    reflection:
      "In your own words, explain the mechanism you used. Include the exact command and observed result, one changed case, and any hints, documentation, agent help, or reference code you used. What remains untested?",
    evidence:
      "Implement the local exercise, run its tests, add a changed case, then record what actually happened below.",
    checks: [
      {
        id: "q1",
        question: "What does a local FastAPI TestClient test establish?",
        options: [
          "The tested local application behaviour",
          "A production TLS certificate configuration",
          "An independently assessed learner skill",
          "An account authorization deployment policy",
        ],
        answer: 0,
        hint: "Define the two models at module scope, then register the route inside build_app.",
        feedback:
          "The local app behaviour is real, while network/deployment and independent skill are separate evidence.",
      },
      {
        id: "q2",
        question: "What is useful evidence after this coding session?",
        options: [
          "Record my command, changed case, and help",
          "Record only the page title and date",
          "Copy the solution and mark work independent",
          "Treat a correct quiz as executed code",
        ],
        answer: 0,
        hint: "Distinguish executing your own code from reading or copying a provided implementation.",
        feedback:
          "Record your actual command and result, the changed case, and assistance used. This is practice bookkeeping; correctness and independence still need review.",
      },
    ],
    review: {
      question: "What belongs in an honest portfolio write-up?",
      options: [
        "An unsupported claim of production scale",
        "A copied solution labelled fully independent",
        "Own explanation, commands, help, and limits",
        "Only a generated automatic completion badge",
      ],
      answer: 2,
      feedback:
        "Record exactly what you ran, can explain, and received help with.",
    },
  },
};
