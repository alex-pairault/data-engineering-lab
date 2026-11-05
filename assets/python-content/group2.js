export const pythonGroup2 = {
  "py-tests": {
    recall:
      "What makes a test useful beyond merely executing a function? Which second case would expose overwriting a running total?",
    reflection:
      "In your own words, explain the mechanism you used. Include the exact command and observed result, one changed case, and any hints, documentation, agent help, or reference code you used. What remains untested?",
    evidence:
      "Implement the local exercise, run its tests, add a changed case, then record what actually happened below.",
    checks: [
      {
        id: "q1",
        question: "Which input exposes replacing a running total?",
        options: [
          "Two paid rows with amounts",
          "One pending row without payment",
          "An empty sequence of orders",
          "One paid row by itself",
        ],
        answer: 0,
        hint: "Choose inputs that produce different results for replacement and accumulation.",
        feedback:
          "Repeated paid rows distinguish accumulation from taking only the last amount.",
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
      question: "What should a regression check establish before the repair?",
      options: [
        "It accepts every possible implementation",
        "It reproduces source code exactly",
        "It only imports the module",
        "It rejects the faulty behaviour",
      ],
      answer: 3,
      feedback:
        "A useful regression check fails on the bug and passes on the intended correction.",
    },
  },
  "py-typing": {
    recall:
      "Do Python annotations enforce types at runtime? Is a frozen dataclass deeply immutable?",
    reflection:
      "In your own words, explain the mechanism you used. Include the exact command and observed result, one changed case, and any hints, documentation, agent help, or reference code you used. What remains untested?",
    evidence:
      "Implement the local exercise, run its tests, add a changed case, then record what actually happened below.",
    checks: [
      {
        id: "q1",
        question: "What do ordinary Python type hints provide?",
        options: [
          "Declared intent for static checking",
          "Automatic validation of every argument",
          "Mandatory coercion of incoming strings",
          "Deep immutability of nested values",
        ],
        answer: 0,
        hint: "Create the Customer class above your factory; annotate fields, then validate before constructing.",
        feedback:
          "Annotations support tooling and communication; runtime validation needs code or a validation library.",
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
      question: "Why can a frozen dataclass still hold mutable state?",
      options: [
        "A nested list can mutate",
        "Every frozen field is copied",
        "The annotation disables all exceptions",
        "Dataclasses never store object references",
      ],
      answer: 0,
      feedback:
        "Frozen applies to field assignment, not recursive immutability.",
    },
  },
  "py-pydantic": {
    recall:
      'Where should untrusted JSON become trusted application data? What would accepting "12" as an integer hide?',
    reflection:
      "In your own words, explain the mechanism you used. Include the exact command and observed result, one changed case, and any hints, documentation, agent help, or reference code you used. What remains untested?",
    evidence:
      "Implement the local exercise, run its tests, add a changed case, then record what actually happened below.",
    checks: [
      {
        id: "q1",
        question: "Which call validates an incoming Python dictionary?",
        options: [
          "Order.model_validate with configured input constraints",
          "Order.model_construct with directly supplied fields",
          "A type hint without execution",
          "An unchecked dictionary field access",
        ],
        answer: 0,
        hint: "Define your model above parse_order. Strictness and extra-field policy are separate choices.",
        feedback:
          "model_validate executes the model schema; model_construct deliberately skips validation.",
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
      question: "A validated order ID is positive. What still needs checking?",
      options: [
        "Whether the field has a name",
        "Whether this user may access it",
        "Whether the integer annotations were written",
        "Whether model_dump returns an ordinary dictionary",
      ],
      answer: 1,
      feedback: "Schema validity does not establish ownership or permission.",
    },
  },
  "py-serialization": {
    recall:
      "Is serializing every internal field a safe default for an API response? Which Pydantic v1 methods changed names in v2?",
    reflection:
      "In your own words, explain the mechanism you used. Include the exact command and observed result, one changed case, and any hints, documentation, agent help, or reference code you used. What remains untested?",
    evidence:
      "Implement the local exercise, run its tests, add a changed case, then record what actually happened below.",
    checks: [
      {
        id: "q1",
        question: "What best controls fields in a public response?",
        options: [
          "An explicit public response schema",
          "Dumping every internal object field",
          "Logging the entire input payload",
          "Removing only one known secret",
        ],
        answer: 0,
        hint: "Construct a separate response model from an explicit list of fields.",
        feedback:
          "An allowlist stays narrow when new internal fields are added.",
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
        "Which Pydantic v2 method replaces typical v1 dict serialization?",
      options: [
        "parse_obj without checking its version",
        "model_config as a function call",
        "model_dump on the validated model",
        "model_construct on untrusted user data",
      ],
      answer: 2,
      feedback:
        "model_dump is the v2 serialization API; migration requires consulting its guide.",
    },
  },
  "py-money-time": {
    recall:
      'Why is Decimal("0.1") different from Decimal(0.1)? What distinguishes timezone-aware and naive datetimes?',
    reflection:
      "In your own words, explain the mechanism you used. Include the exact command and observed result, one changed case, and any hints, documentation, agent help, or reference code you used. What remains untested?",
    evidence:
      "Implement the local exercise, run its tests, add a changed case, then record what actually happened below.",
    checks: [
      {
        id: "q1",
        question: "Which input preserves the intended decimal text?",
        options: [
          "Decimal built from original text",
          "Decimal built from binary float",
          "Rounding every float before parsing",
          "Converting money into complex numbers",
        ],
        answer: 0,
        hint: "Check finiteness before comparisons or integer conversion; catch InvalidOperation narrowly.",
        feedback:
          "Original decimal text avoids importing an existing binary-float approximation.",
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
      question: "Which clock should measure a retry deadline?",
      options: [
        "A local wall-clock string",
        "A naive midnight datetime",
        "The file modification timestamp",
        "A monotonic duration clock",
      ],
      answer: 3,
      feedback:
        "A monotonic clock avoids wall-clock adjustments when measuring elapsed durations.",
    },
  },
  "py-modules": {
    recall:
      "Why can naming your file json.py break an import? Why is a requirements file not always a complete lock?",
    reflection:
      "In your own words, explain the mechanism you used. Include the exact command and observed result, one changed case, and any hints, documentation, agent help, or reference code you used. What remains untested?",
    evidence:
      "Implement the local exercise, run its tests, add a changed case, then record what actually happened below.",
    checks: [
      {
        id: "q1",
        question: "What can run when a module is imported?",
        options: [
          "Its directly executable top-level statements",
          "Only its function type annotations",
          "Only code inside main guards",
          "Nothing until every function runs",
        ],
        answer: 0,
        hint: "Validate the parsed shape instead of relying on a KeyError as your public contract.",
        feedback:
          "Import executes module-level statements; guard CLI side effects explicitly.",
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
        "Why can a lower-bound requirements file resolve differently later?",
      options: [
        "Transitive dependency versions can change",
        "The interpreter ignores all requirements",
        "A virtual environment freezes time",
        "Every import recreates the lockfile",
      ],
      answer: 0,
      feedback:
        "A resolved environment snapshot or lock captures more than broad declared ranges.",
    },
  },
  "py-cli": {
    recall:
      "Where should a script receive paths and batch sizes? Which information belongs in logs rather than a secret payload?",
    reflection:
      "In your own words, explain the mechanism you used. Include the exact command and observed result, one changed case, and any hints, documentation, agent help, or reference code you used. What remains untested?",
    evidence:
      "Implement the local exercise, run its tests, add a changed case, then record what actually happened below.",
    checks: [
      {
        id: "q1",
        question: "Where should command-line parsing normally happen?",
        options: [
          "At the application entry boundary",
          "Inside every arithmetic helper function",
          "During every imported module initialization",
          "Only after database writes finish",
        ],
        answer: 0,
        hint: "Use type=int for parsing, then enforce the business range with parser.error.",
        feedback:
          "Parsing at the boundary keeps core functions independent and testable.",
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
        "A batch size comes from an environment variable. What still applies?",
      options: [
        "Treat it as an integer automatically",
        "Parse and validate its allowed bounds",
        "Trust it because it is configuration",
        "Log all configured environment variable contents",
      ],
      answer: 1,
      feedback:
        "Environment configuration is external text, not automatically valid typed data.",
    },
  },
  "py-http": {
    recall:
      "How do transport failure, HTTP 500, invalid JSON, and an invalid schema differ?",
    reflection:
      "In your own words, explain the mechanism you used. Include the exact command and observed result, one changed case, and any hints, documentation, agent help, or reference code you used. What remains untested?",
    evidence:
      "Implement the local exercise, run its tests, add a changed case, then record what actually happened below.",
    checks: [
      {
        id: "q1",
        question: "What does MockTransport verify in this exercise?",
        options: [
          "Client logic against prepared responses",
          "Real DNS and TLS negotiation",
          "A remote service production uptime",
          "Operating system socket timeout timing",
        ],
        answer: 0,
        hint: "Check status before JSON/schema. Keep the provided client injectable.",
        feedback:
          "MockTransport exercises your HTTPX logic without a real network boundary.",
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
      question: "What does a successful HTTP status establish?",
      options: [
        "The user owns every returned object",
        "The JSON parser cannot raise errors",
        "The received HTTP response indicates success",
        "The returned application schema is correct",
      ],
      answer: 2,
      feedback:
        "Parsing, schema rules, and authorization remain separate checks.",
    },
  },
  "py-retries": {
    recall:
      "If a POST times out, does that prove the server did not commit it? What should control a retry?",
    reflection:
      "In your own words, explain the mechanism you used. Include the exact command and observed result, one changed case, and any hints, documentation, agent help, or reference code you used. What remains untested?",
    evidence:
      "Implement the local exercise, run its tests, add a changed case, then record what actually happened below.",
    checks: [
      {
        id: "q1",
        question: "What does a timed-out write prove?",
        options: [
          "The final outcome remains unknown",
          "The server definitely rolled back",
          "The operation is automatically idempotent",
          "The client may retry forever",
        ],
        answer: 0,
        hint: "Two attempts means one original call and at most one retry.",
        feedback:
          "A write can commit before its response is lost, so reconcile or use its idempotency contract.",
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
        "A policy permits one retry. What is the maximum total attempt count?",
      options: [
        "One total HTTP attempt",
        "Three total HTTP attempts",
        "An unlimited attempt count",
        "Two total HTTP attempts",
      ],
      answer: 3,
      feedback: "The initial attempt plus one retry gives two attempts.",
    },
  },
  "py-database": {
    recall:
      "If the debit succeeds but the credit fails, what should a transaction do? Does an ORM eliminate SQL reasoning?",
    reflection:
      "In your own words, explain the mechanism you used. Include the exact command and observed result, one changed case, and any hints, documentation, agent help, or reference code you used. What remains untested?",
    evidence:
      "Implement the local exercise, run its tests, add a changed case, then record what actually happened below.",
    checks: [
      {
        id: "q1",
        question: "What rolls back engine.begin() changes here?",
        options: [
          "An exception escapes the context",
          "A comment requests eventual rollback",
          "A SELECT returns zero rows",
          "The Python variable is renamed",
        ],
        answer: 0,
        hint: "Let the exception escape the transaction context so rollback occurs.",
        feedback:
          "The context rolls back when its block exits with an exception.",
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
      question: "Which test checks atomicity after a partial operation?",
      options: [
        "A missing target preserves source balance",
        "A successful transfer prints a message",
        "The SQL text contains UPDATE twice",
        "A connection variable has a name",
      ],
      answer: 0,
      feedback:
        "Failing after the debit and checking rollback probes the actual atomicity guarantee.",
    },
  },
};
