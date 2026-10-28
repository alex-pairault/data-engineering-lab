export const foundationLessonData = {
  "processes-ports": {
    recall:
      "A browser request fails. How would you distinguish no connection to the service from an HTTP 404? What do a PID and a port each identify?",
    reflection:
      "Trace the client address/port to the listening process. Compare refusal, 200 and 404, then explain why editing startup configuration did not move the running listener. Include one observation from the Python probe if you ran it.",
    evidence:
      "Observe refusal, a successful request, a missing route, unchanged running configuration, and a restart on the new port.",
    checks: [
      {
        id: "q1",
        question:
          "In this demo, why does a refused connection have no HTTP 404 status?",
        options: [
          "The browser deleted session cookies",
          "No HTTP responder was reached",
          "The database rejected every query",
          "The application rejected the route",
        ],
        answer: 1,
        hint: "Separate making a connection from handling an HTTP route.",
        feedback:
          "HTTP status codes arrive from a responder. A controlled refusal happens before that HTTP exchange.",
      },
      {
        id: "q2",
        question:
          "The service reads its port at startup. What applies an edited port configuration?",
        options: [
          "Restart with the intended configuration",
          "Refresh only the browser window",
          "Rename only the Python file",
          "Delete only the browser cookies",
        ],
        answer: 0,
        hint: "Look at when the running process reads this value.",
        feedback:
          "Restart the service with the intended configuration and verify the active listener. A browser refresh does not reconfigure the process.",
      },
    ],
    review: {
      question:
        "A request gets 404 from an unexpected service. What would narrow the cause?",
      options: [
        "Assume the intended service answered",
        "Conclude every process has stopped",
        "Remove all local database files",
        "Inspect responder identity and endpoint",
      ],
      answer: 3,
      feedback:
        "A status proves a responder, not the intended deployment. Compare the address/port, service label, and relevant logs.",
    },
  },
  "code-boundaries": {
    recall:
      "A discount works through a web endpoint but differs in a background job. Where would you look for the rule, and what should be shared?",
    reflection:
      "Locate input translation, the domain invariant, application orchestration, and storage. Explain the two-caller disagreement and show why invalid amounts must fail before any write. State which rule you changed or would change once.",
    evidence:
      "Compare duplicated and shared-rule implementations from both callers, including an invalid amount that must not reach storage.",
    checks: [
      {
        id: "q1",
        question:
          "Where should the discount invariant live so HTTP and jobs both enforce it?",
        options: [
          "Inside the shared domain operation",
          "Inside only the browser form",
          "Inside only the HTTP handler",
          "Inside only the stylesheet file",
        ],
        answer: 0,
        hint: "Which caller might bypass the HTTP path?",
        feedback:
          "Keep the invariant in the shared domain operation. Adapters may also validate their input format, but every entry point must obey the rule.",
      },
      {
        id: "q2",
        question:
          "A negative amount reaches the domain operation. What should happen before storage?",
        options: [
          "Save before checking the amount",
          "Convert every negative into zero",
          "Trust every background job input",
          "Reject without saving a quote",
        ],
        answer: 3,
        hint: "The invariant applies regardless of caller.",
        feedback:
          "Reject the invalid business input before a write. A different transport may report the error differently, but storage should remain unchanged.",
      },
    ],
    review: {
      question:
        "A new CLI caller needs the same discount. Which reuse preserves the responsibility boundary?",
      options: [
        "Duplicate the calculation without tests",
        "Move the formula into CSS",
        "Call the shared domain operation",
        "Copy the entire HTTP handler",
      ],
      answer: 2,
      feedback:
        "Translate CLI input, call the shared operation, and preserve domain invariants. Reuse business behaviour rather than the HTTP transport.",
    },
  },
  "git-dependencies": {
    recall:
      "Git marks a conflict. Does choosing one side prove the result is correct? What does a dependency lockfile preserve that a version range does not?",
    reflection:
      "State both accepted business changes, the checks that reject each one-sided resolution, and the combined result. Explain what npm ci expects and which runtime or platform details a lockfile does not reproduce.",
    evidence:
      "Compare three source resolutions and both a matching and mismatched manifest/lock restore. Then use the disposable Git exercise for an actual merge conflict.",
    checks: [
      {
        id: "q1",
        question: "What establishes a useful source-conflict resolution?",
        options: [
          "Remove markers without reading changes",
          "Choose the newest branch blindly",
          "Stage everything without running checks",
          "Preserve requirements and verify behaviour",
        ],
        answer: 3,
        hint: "Git resolves history and text; your acceptance criteria define behaviour.",
        feedback:
          "A syntactically clean file can still lose a required change. Inspect the diff and run relevant behavioural checks.",
      },
      {
        id: "q2",
        question:
          "For this npm example, what happens when the manifest and lockfile disagree?",
        options: [
          "Git automatically fixes the dependencies",
          "Browsers automatically choose package versions",
          "npm ci rejects the mismatch",
          "npm ci silently rewrites everything",
        ],
        answer: 2,
        hint: "A clean install should use the reviewed dependency graph.",
        feedback:
          "npm ci fails on a manifest/lock mismatch and does not rewrite the pair. Update the intended dependencies deliberately and review the new lock.",
      },
    ],
    review: {
      question:
        "A teammate has the same lockfile but a different native runtime. What follows?",
      options: [
        "Skip all installation failure messages",
        "Check runtime and platform assumptions",
        "Assume the entire machine matches",
        "Delete the lockfile before investigating",
      ],
      answer: 1,
      feedback:
        "The dependency graph is only part of reproducibility. Check runtime, package-manager flags and platform-dependent components.",
    },
  },
  "docker-basics": {
    recall:
      "What differs between an image and a running container? Would a file survive stopping a container? What about removing it and creating another?",
    reflection:
      "Trace host port 18080 to container port 8000. Compare stop/start and remove/recreate for the writable layer and named volume. Include the real commands and observations if you ran them; state one limit of persistence.",
    evidence:
      "Observe an unpublished endpoint, stop/start retention, writable-layer loss on replacement, and named-volume retention across replacement.",
    checks: [
      {
        id: "q1",
        question:
          "What survives stopping and restarting the same container in this exercise?",
        options: [
          "Every file from unrelated containers",
          "Nothing from its previous execution",
          "Its existing container writable layer",
          "Only the original browser cookies",
        ],
        answer: 2,
        hint: "Stopping the process is different from removing the container.",
        feedback:
          "The writable layer remains on stop/start of that container. Removing and replacing the container discards that layer.",
      },
      {
        id: "q2",
        question:
          "What makes the counter survive removing and replacing the container?",
        options: [
          "Add only an EXPOSE instruction",
          "Reuse the same named volume",
          "Reuse only the image name",
          "Change only the browser URL",
        ],
        answer: 1,
        hint: "Locate the file outside the disposable writable layer.",
        feedback:
          "Mount the same named volume at the data path. An image or EXPOSE declaration alone does not preserve runtime writes.",
      },
    ],
    review: {
      question:
        "The host mapping is 18080:8000. Which port should the process inside listen on?",
      options: [
        "Listen on container port 8000",
        "Listen on host port 18080",
        "Listen on browser port 443",
        "Listen on database port 5432",
      ],
      answer: 0,
      feedback:
        "The mapping forwards the host endpoint to the container endpoint. Publishing does not reconfigure the internal application listener.",
    },
  },
  "sql-grain": {
    recall:
      "An order has two lines and three payment rows. How many rows result if you join both collections directly by order ID? What might happen to each sum?",
    reflection:
      "State the grain of lines, payments, the direct join, and the repaired result. Explain why DISTINCT loses legitimate values. Include the actual constraint failures if you ran SQLite and explain why foreign keys do not enforce one child per order.",
    evidence:
      "Compare direct fanout, SUM(DISTINCT amount), and preaggregation. Execute the shared fixture for actual SQL and duplicate-key, orphan-reference, and check-constraint failures.",
    checks: [
      {
        id: "q1",
        question:
          "Two lines and three payments match one order. How many direct join pairs result?",
        options: [
          "One matching line and payment pair",
          "Six matching line and payment pairs",
          "Two matching line and payment pairs",
          "Three matching line and payment pairs",
        ],
        answer: 1,
        hint: "Every matching line can pair with every matching payment.",
        feedback:
          "Two times three is six. Aggregating that join repeats line amounts three times and payment amounts twice.",
      },
      {
        id: "q2",
        question:
          "Why is SUM(DISTINCT amount) an incorrect general fanout repair?",
        options: [
          "It removes legitimate equal amounts",
          "It preserves every original row",
          "It automatically checks business keys",
          "It enforces every foreign key",
        ],
        answer: 0,
        hint: "Distinguish equal values from duplicate business records.",
        feedback:
          "Two different lines or payments can legitimately have equal amounts. Aggregate at the required grain instead of deduplicating numeric values.",
      },
    ],
    review: {
      question:
        "An order has a valid foreign key from every line. Can multiple lines still reference it?",
      options: [
        "No foreign keys prohibit that",
        "Only if every amount differs",
        "Only after removing primary keys",
        "Yes foreign keys permit that",
      ],
      answer: 3,
      feedback:
        "A foreign key checks references, not one-to-one cardinality. Add an appropriate uniqueness constraint when the business rule requires it.",
    },
  },
};
