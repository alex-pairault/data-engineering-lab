const table = (columns, rows, trace, note) => ({ columns, rows, trace, note });
function transactions(mode) {
  let stock = 1,
    accepted = 0;
  const trace = [];
  if (mode === "stale") {
    const a = stock,
      b = stock;
    trace.push(`A and B read ${a} outside a protecting transaction.`);
    for (const saved of [a, b]) {
      stock = saved - 1;
      accepted++;
      trace.push(`Caller writes ${stock} from its stale read.`);
    }
  } else if (mode === "guarded") {
    for (const caller of ["A", "B"]) {
      const affected = stock > 0 ? 1 : 0;
      if (affected) {
        stock--;
        accepted++;
      }
      trace.push(`${caller}: conditional UPDATE affects ${affected} row(s).`);
    }
  } else {
    const before = stock;
    stock--;
    trace.push(
      "Update runs inside a transaction.",
      "A deliberate error aborts the unit of work.",
    );
    stock = before;
    trace.push("Rollback restores stock.");
  }
  return table(
    ["Measure", "Observed"],
    [
      ["Initial stock", 1],
      ["Accepted sales", accepted],
      ["Final stock", stock],
    ],
    trace,
    mode === "stale"
      ? "Both decisions used stale reads before independent writes. This is not a claim that SQLite permits two simultaneous protected writers."
      : mode === "guarded"
        ? "The atomic quantity > 0 predicate and affected-row check protect this single-row sale. Transactions do not automatically fix every race."
        : "Rollback concerns uncommitted database effects; it does not reverse external side effects.",
  );
}
function imports(mode) {
  const source = [
    { id: "A", amount: 10 },
    { id: "B", amount: 20 },
    { id: "C", amount: 30 },
  ];
  const rows = [],
    map = new Map();
  const apply = (record) =>
    mode === "append"
      ? rows.push({ ...record })
      : map.set(record.id, { ...record });
  source.slice(0, 2).forEach(apply);
  source.forEach(apply);
  if (mode === "changed") apply({ id: "B", amount: 25 });
  const output = mode === "append" ? rows : [...map.values()];
  return table(
    ["External ID", "Amount"],
    output.map((r) => [r.id, r.amount]),
    [
      "Commit the first two input records, then simulate a crash.",
      "Replay the complete input using the same external identities.",
      `Stored rows: ${output.length}; total: ${output.reduce((s, r) => s + r.amount, 0)}.`,
    ],
    mode === "changed"
      ? "This snapshot-import contract updates the amount for a reused ID. An event-processing contract might instead reject changed content; define the rule."
      : mode === "append"
        ? "Blind append duplicates the two committed records on replay."
        : "UPSERT preserves one row per stable source ID. Atomic business effects still matter for payments or other external writes.",
  );
}
function quality(mode) {
  const rows = [
    { id: "A", customer: 1, amount: 10 },
    { id: "B", customer: 2, amount: 20 },
  ];
  if (mode === "duplicate") rows.push({ ...rows[0] });
  if (mode === "null") rows[0].id = null;
  if (mode === "negative") rows[0].amount = -1;
  if (mode === "orphan") rows[0].customer = 999;
  const ids = rows.map((r) => r.id),
    failures = [
      ["not_null external_id", ids.filter((id) => id === null).length],
      [
        "unique external_id",
        ids.filter((id, i) => id !== null && ids.indexOf(id) !== i).length
          ? 2
          : 0,
      ],
      ["nonnegative amount", rows.filter((r) => r.amount < 0).length],
      [
        "known customer",
        rows.filter((r) => ![1, 2].includes(r.customer)).length,
      ],
    ];
  return table(
    ["Modeled data test", "Failing rows"],
    failures,
    [
      "Seed synthetic records.",
      "Build the model at its documented grain.",
      "Evaluate rows violating each assertion.",
    ],
    failures.every(([, n]) => n === 0)
      ? "Zero modeled failures. Passing selected tests does not establish completeness or every business requirement."
      : "Data tests inspect current data; they do not enforce future warehouse writes. Test source/staging assumptions before filters can hide them.",
  );
}
function workflow(mode) {
  if (mode === "ordered" || mode === "unordered") {
    const completed = new Set();
    const order =
      mode === "ordered"
        ? ["extract", "transform", "load"]
        : ["load", "extract", "transform"];
    const requirements = {
      extract: [],
      transform: ["extract"],
      load: ["transform"],
    };
    const rows = order.map((task) => {
      const ok = requirements[task].every((p) => completed.has(p));
      if (ok) completed.add(task);
      return [task, ok ? "completed" : "blocked: dependency missing"];
    });
    return table(
      ["Task", "Outcome"],
      rows,
      order,
      mode === "ordered"
        ? "Dependencies express the workflow order. A schedule determines when a run is created, not whether each task succeeded."
        : "Running a command first does not supply its missing input dependency.",
    );
  }
  const seen = new Set();
  let effects = 0;
  const rows = ["event-7", "event-7"].map((id) => {
    const duplicate = seen.has(id);
    if (mode === "raw" || !duplicate) effects++;
    seen.add(id);
    return [id, duplicate ? "redelivery" : "first delivery", effects];
  });
  return table(
    ["Event", "Delivery", "Business effects so far"],
    rows,
    [
      "Worker applies an effect.",
      "Acknowledgement is lost in this scenario.",
      "The same event is delivered again.",
    ],
    mode === "raw"
      ? "At-least-once delivery can repeat the business effect without idempotency."
      : "Record the event identity and its database effect atomically. A webhook, queue and scheduled DAG solve different parts of the flow.",
  );
}
function plans(mode) {
  const orders = Array.from({ length: 5 }, (_, i) => ({ id: i + 1 }));
  const lines = orders.flatMap((o) => [
    { order: o.id, amount: 10 },
    { order: o.id, amount: 20 },
  ]);
  const totals = orders.map((o) => [
    o.id,
    lines.filter((l) => l.order === o.id).reduce((s, l) => s + l.amount, 0),
  ]);
  const queries = mode === "nplusone" ? 1 + orders.length : 2;
  return table(
    ["Order", "Verified total"],
    totals,
    [
      `Load parent rows: 1 SELECT.`,
      mode === "nplusone"
        ? `Fetch children separately: ${orders.length} additional SELECTs.`
        : "Fetch the bounded parent set’s children in one SELECT.",
      `Total SELECTs: ${queries}.`,
    ],
    mode === "index"
      ? "The downloadable SQLite exercise prints actual filter plans before and after an index. This browser does not invent planner timings or promise an index always wins."
      : `${queries} modeled SELECTs; results agree. For large parent sets, bound batches and memory as well as query count.`,
  );
}
function airflow(mode) {
  let effects = 0;
  const retries = mode === "no-retry" ? 0 : 1,
    trace = ["extract succeeds; input [2, 3]."];
  let success = false,
    attempts = 0;
  for (let attempt = 1; attempt <= 1 + retries; attempt++) {
    attempts++;
    if (mode === "unsafe") effects += 2;
    else if (mode === "idempotent") effects = 2;
    trace.push(`transform attempt ${attempt}`);
    if (attempt === 1) {
      trace.push("Deliberate failure; downstream verify stays blocked.");
      continue;
    }
    success = true;
    trace.push("transform succeeds with total 10.");
  }
  return table(
    ["Measure", "Value"],
    [
      ["Configured retries", retries],
      ["Transform attempts", attempts],
      ["Downstream verify", success ? "runs; total 10" : "blocked"],
      ["External effects in this model", effects],
    ],
    trace,
    mode === "unsafe"
      ? "Retry repeated a side effect that happened before failure. Airflow task state alone does not undo external writes."
      : mode === "idempotent"
        ? "An idempotent sink kept two effects despite two attempts. The runnable introductory DAG uses pure computation instead."
        : "One retry means up to two attempts. dag.test() is a local serialized check, not a production distributed-executor test.",
  );
}
function recovery(mode) {
  const backup = [
    { id: 1, amount: 10 },
    { id: 2, amount: 20 },
  ];
  const afterBackup = [...backup, { id: 3, amount: 10 }];
  const live = [];
  const restored = mode === "code-only" ? live : backup;
  return table(
    ["Measure", "Rows", "Total"],
    [
      ["Verified snapshot", backup.length, 30],
      ["Data just before loss", afterBackup.length, 40],
      [
        "After chosen recovery",
        restored.length,
        restored.reduce((s, r) => s + r.amount, 0),
      ],
    ],
    mode === "code-only"
      ? [
          "A destructive change removes rows.",
          "Revert application code.",
          "Rows remain missing.",
        ]
      : [
          "Restore the snapshot into a separate disposable database.",
          "Check row IDs, schema and total.",
          "Compare snapshot time with later writes.",
        ],
    mode === "code-only"
      ? "Code rollback does not restore deleted data."
      : mode === "stale-snapshot"
        ? "The snapshot restores 30, but the later write is absent. Define the acceptable recovery point and reconcile later work."
        : "A successful restore check proves this snapshot can be read and meets these assertions. It is not a complete disaster-recovery guarantee.",
  );
}
export const dataModels = {
  transactions: {
    title: "Control the interleaving of two sale attempts",
    diagram: [
      ["Readers A + B", "starting stock 1"],
      ["Write boundary", "stale value or guarded update"],
      ["Result", "accepted count + remaining stock"],
    ],
    cases: [
      ["stale", "Two stale reads, then blind writes"],
      ["guarded", "Conditional decrement and affected-row check"],
      ["rollback", "Error followed by rollback"],
    ],
    run: transactions,
  },
  "idempotent-imports": {
    title: "Replay a partially committed snapshot import",
    diagram: [
      ["Source IDs", "A, B, C"],
      ["Partial commit", "A and B stored"],
      ["Replay", "append or UPSERT"],
    ],
    cases: [
      ["append", "Blind append after partial failure"],
      ["upsert", "UPSERT with stable external ID"],
      ["changed", "Same ID; explicit update-on-change policy"],
    ],
    run: imports,
  },
  "dbt-quality": {
    title: "Make data assumptions return failing rows",
    diagram: [
      ["Seeds", "synthetic source records"],
      ["dbt model", "document row grain"],
      ["Data tests", "zero or more violations"],
    ],
    cases: [
      ["clean", "Clean fixture"],
      ["duplicate", "Duplicate external ID"],
      ["null", "Missing external ID"],
      ["negative", "Negative amount"],
      ["orphan", "Unknown customer reference"],
    ],
    run: quality,
  },
  orchestration: {
    title: "Separate workflow order from event delivery",
    diagram: [
      ["Trigger", "schedule or event"],
      ["Execution", "DAG or worker"],
      ["Effects", "acknowledgement + retry boundary"],
    ],
    cases: [
      ["unordered", "Run load before its input"],
      ["ordered", "Follow extract → transform → load"],
      ["raw", "Redeliver one event without deduplication"],
      ["deduplicated", "Redeliver with atomic identity/effect handling"],
    ],
    run: workflow,
  },
  "query-plans": {
    title: "Compare equal results and count access operations",
    diagram: [
      ["Parent query", "five orders"],
      ["Child access", "per order or bounded batch"],
      ["Evidence", "same totals; different query count"],
    ],
    cases: [
      ["nplusone", "One child query per parent"],
      ["batch", "One batched child query"],
      ["index", "Inspect the plan experiment’s boundary"],
    ],
    run: plans,
  },
  "airflow-failures": {
    title: "Trace attempts, retries and blocked downstream tasks",
    diagram: [
      ["extract", "[2, 3]"],
      ["transform", "deliberate first failure"],
      ["verify", "only after successful transform"],
    ],
    cases: [
      ["no-retry", "Failure with no retry"],
      ["retry", "Failure then one retry"],
      ["unsafe", "Retry repeats an external effect"],
      ["idempotent", "Retry with idempotent effect handling"],
    ],
    run: airflow,
  },
  recovery: {
    title: "Check the recovered data, not just the backup file",
    diagram: [
      ["Snapshot", "rows and total at backup time"],
      ["Failure", "later data removed"],
      ["Restore copy", "verify and reconcile"],
    ],
    cases: [
      ["code-only", "Revert application code only"],
      ["restore", "Restore and verify a snapshot"],
      ["stale-snapshot", "Compare with a post-backup write"],
    ],
    run: recovery,
  },
};
