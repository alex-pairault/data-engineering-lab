export const pythonGroup1 = {
  "py-runtime": {
    recall:
      "What is the difference between Python, CPython, a virtual environment, and pip? Predict which interpreter python -m pip uses.",
    reflection:
      "In your own words, explain the mechanism you used. Include the exact command and observed result, one changed case, and any hints, documentation, agent help, or reference code you used. What remains untested?",
    evidence:
      "Implement the local exercise, run its tests, add a changed case, then record what actually happened below.",
    checks: [
      {
        id: "q1",
        question: "Which command installs into the selected interpreter?",
        options: [
          "python -m pip install pytest",
          "pip from any terminal session",
          "Copy packages into your source",
          "Change only the script filename",
        ],
        answer: 0,
        hint: "Check the major and minor fields separately.",
        feedback:
          "python -m pip runs pip through that selected Python executable.",
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
        "A venv was moved to a different path and imports fail. What is the reproducible repair?",
      options: [
        "Assume all environments are portable",
        "Recreate it from recorded dependencies",
        "Copy one interpreter symlink manually",
        "Remove every declared package version",
      ],
      answer: 1,
      feedback:
        "Recreate the environment using its recorded Python and dependency inputs.",
    },
  },
  "py-values": {
    recall:
      'Predict bool(0), bool("0"), bool([]), and bool(None). Which represent missing data in an API?',
    reflection:
      "In your own words, explain the mechanism you used. Include the exact command and observed result, one changed case, and any hints, documentation, agent help, or reference code you used. What remains untested?",
    evidence:
      "Implement the local exercise, run its tests, add a changed case, then record what actually happened below.",
    checks: [
      {
        id: "q1",
        question: "A valid count is zero. Which fallback preserves it?",
        options: [
          "Use a None identity check",
          "Use count or default instead",
          "Treat every falsy value missing",
          "Compare numeric values with is",
        ],
        answer: 0,
        hint: "The fallback contract names one singleton, not every falsy value.",
        feedback:
          "An explicit None check preserves zero and distinguishes absence from value.",
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
      question: "A quantity may be 0 or None. Which condition means missing?",
      options: [
        "not quantity alone",
        "quantity is zero",
        "quantity is None",
        "quantity == False",
      ],
      answer: 2,
      feedback:
        "Only the explicit None condition matches this missing-data contract.",
    },
  },
  "py-collections": {
    recall:
      "When would you use a list, tuple, dict, or set? Which one helps a lookup by customer ID?",
    reflection:
      "In your own words, explain the mechanism you used. Include the exact command and observed result, one changed case, and any hints, documentation, agent help, or reference code you used. What remains untested?",
    evidence:
      "Implement the local exercise, run its tests, add a changed case, then record what actually happened below.",
    checks: [
      {
        id: "q1",
        question: "Which collection maps a customer to their total?",
        options: [
          "A dictionary keyed by customer",
          "A set containing every amount",
          "A tuple containing one amount",
          "A string joining customer names",
        ],
        answer: 0,
        hint: "Read the previous total before assigning the next one.",
        feedback:
          "A dictionary represents the key-to-total relationship; accumulation handles repeated customers.",
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
        "A dict assignment replaces the previous amount. What preserves the sum?",
      options: [
        "Overwrite with the newest row",
        "Deduplicate every amount by value",
        "Sort customers before each assignment",
        "Add to the previous value",
      ],
      answer: 3,
      feedback: "Accumulating by customer preserves repeated legitimate rows.",
    },
  },
  "py-functions": {
    recall:
      "When is a default argument evaluated? Predict two calls to a function whose default is [].",
    reflection:
      "In your own words, explain the mechanism you used. Include the exact command and observed result, one changed case, and any hints, documentation, agent help, or reference code you used. What remains untested?",
    evidence:
      "Implement the local exercise, run its tests, add a changed case, then record what actually happened below.",
    checks: [
      {
        id: "q1",
        question: "When is a normal default argument evaluated?",
        options: [
          "When the function is defined",
          "Before every loop body runs",
          "After each returned value exists",
          "Only when the module exits",
        ],
        answer: 0,
        hint: "A new list is needed even when an existing list is supplied.",
        feedback:
          "Definition-time evaluation explains why a default list can persist across calls.",
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
        "Two calls unexpectedly share a default dictionary. What removes the shared default?",
      options: [
        "Create a dictionary per call",
        "Rename the dictionary argument only",
        "Clear it after every return",
        "Add more global dictionary keys",
      ],
      answer: 0,
      feedback: "A fresh per-call object avoids sharing a mutable default.",
    },
  },
  "py-references": {
    recall:
      'If b = a and then b["tags"].append("x"), what changes in a? What does dict(a) copy?',
    reflection:
      "In your own words, explain the mechanism you used. Include the exact command and observed result, one changed case, and any hints, documentation, agent help, or reference code you used. What remains untested?",
    evidence:
      "Implement the local exercise, run its tests, add a changed case, then record what actually happened below.",
    checks: [
      {
        id: "q1",
        question: "What does a shallow dict copy do?",
        options: [
          "Reuses references to nested values",
          "Recursively duplicates every nested object",
          "Makes every nested value immutable",
          "Transfers ownership away from original",
        ],
        answer: 0,
        hint: "Copy the outer dict and the list that will change.",
        feedback:
          "The outer mapping is new while nested object references are reused.",
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
        "A copied outer dict shares its tags list. Which mutation remains isolated?",
      options: [
        "Delete an unrelated local variable",
        "Mutate a separately copied list",
        "Append to the shared list",
        "Rename the outer dictionary variable",
      ],
      answer: 1,
      feedback: "The nested list needs its own copy for isolated mutation.",
    },
  },
  "py-errors": {
    recall:
      "What information does a traceback show? When is catching Exception and returning 0 dangerous?",
    reflection:
      "In your own words, explain the mechanism you used. Include the exact command and observed result, one changed case, and any hints, documentation, agent help, or reference code you used. What remains untested?",
    evidence:
      "Implement the local exercise, run its tests, add a changed case, then record what actually happened below.",
    checks: [
      {
        id: "q1",
        question: "Why should malformed input not return zero?",
        options: [
          "It disguises failure as valid",
          "It necessarily uses more memory",
          "It always prevents all retries",
          "It makes Python integers immutable",
        ],
        answer: 0,
        hint: "Validate the string shape before converting, and do not catch the error into zero.",
        feedback:
          "Zero is a valid amount, so it cannot also stand for an unreported parse failure.",
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
        "What should protect an external-input rule in optimized execution?",
      options: [
        "A comment above the parameter",
        "A type hint without validation",
        "An explicit validation and exception",
        "An assertion as sole validation",
      ],
      answer: 2,
      feedback:
        "Explicit validation remains active when assertions are disabled.",
    },
  },
  "py-memory": {
    recall:
      "Why can a script have high elapsed time but little CPU time? Does tracemalloc report all process memory?",
    reflection:
      "In your own words, explain the mechanism you used. Include the exact command and observed result, one changed case, and any hints, documentation, agent help, or reference code you used. What remains untested?",
    evidence:
      "Implement the local exercise, run its tests, add a changed case, then record what actually happened below.",
    checks: [
      {
        id: "q1",
        question: "What does tracemalloc peak directly describe?",
        options: [
          "Peak traced Python allocation bytes",
          "Total machine physical memory capacity",
          "Complete native process resident memory",
          "Time waiting for disk operations",
        ],
        answer: 0,
        hint: "Pass a generator expression to sum instead of constructing a list.",
        feedback:
          "Traced Python allocations are narrower than process RSS and machine RAM.",
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
        "Elapsed time grows while CPU time stays small. What is a plausible first hypothesis?",
      options: [
        "Python arithmetic became fully parallel",
        "Every object leaked permanently forever",
        "The CPU cache stores sessions",
        "The process spends time waiting",
      ],
      answer: 3,
      feedback:
        "Waiting for I/O or scheduling is plausible; measure before choosing a remedy.",
    },
  },
  "py-iteration": {
    recall:
      "How does an iterable differ from an iterator? What happens when you iterate an exhausted generator again?",
    reflection:
      "In your own words, explain the mechanism you used. Include the exact command and observed result, one changed case, and any hints, documentation, agent help, or reference code you used. What remains untested?",
    evidence:
      "Implement the local exercise, run its tests, add a changed case, then record what actually happened below.",
    checks: [
      {
        id: "q1",
        question: "When does a generator normally run its body?",
        options: [
          "When the consumer requests items",
          "When its filename is imported",
          "After every program has exited",
          "Before the function is defined",
        ],
        answer: 0,
        hint: "A function containing yield does not execute its body at the initial call.",
        feedback:
          "Advancing the generator executes it until its next yield or completion.",
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
      question: "Why can sorted(a_generator) still use growing memory?",
      options: [
        "It collects items for sorting",
        "Generators prohibit sorting all values",
        "It automatically writes to disk",
        "The iterator duplicates CPU cores",
      ],
      answer: 0,
      feedback:
        "Sorting the full input materializes items even if the producer is lazy.",
    },
  },
  "py-files": {
    recall:
      "Why use with open(...)? How does JSON Lines differ from one large JSON array?",
    reflection:
      "In your own words, explain the mechanism you used. Include the exact command and observed result, one changed case, and any hints, documentation, agent help, or reference code you used. What remains untested?",
    evidence:
      "Implement the local exercise, run its tests, add a changed case, then record what actually happened below.",
    checks: [
      {
        id: "q1",
        question: "Which argument makes text decoding explicit?",
        options: [
          'encoding="utf-8" on this text file',
          "A .json suffix by itself",
          "A larger Python integer type",
          "Using str on binary bytes",
        ],
        answer: 0,
        hint: "Put the with block inside the generator so the handle belongs to iteration.",
        feedback: "The encoding argument states how bytes become text.",
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
      question: "Which parser handles CSV fields containing quoted commas?",
      options: [
        "The list sort method",
        "The standard csv reader",
        "A plain comma split",
        "The pickle data loader",
      ],
      answer: 1,
      feedback:
        "csv understands quoting and field boundaries; splitting does not.",
    },
  },
  "py-complexity": {
    recall:
      "How many comparisons might repeated membership checks perform as a list grows?",
    reflection:
      "In your own words, explain the mechanism you used. Include the exact command and observed result, one changed case, and any hints, documentation, agent help, or reference code you used. What remains untested?",
    evidence:
      "Implement the local exercise, run its tests, add a changed case, then record what actually happened below.",
    checks: [
      {
        id: "q1",
        question: "What state grows in exact deduplication here?",
        options: [
          "The set of distinct IDs",
          "Only the current loop index",
          "A fixed three-element output buffer",
          "No state beyond the iterator",
        ],
        answer: 0,
        hint: "The set answers membership; the list records order.",
        feedback:
          "Remembering every distinct ID uses memory proportional to their count.",
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
      question: "How do you preserve first-seen order with fast membership?",
      options: [
        "Use a set alone always",
        "Repeat a full list scan",
        "Keep a set and list",
        "Sort all input IDs first",
      ],
      answer: 2,
      feedback:
        "The set handles membership and the list records the chosen order.",
    },
  },
};
