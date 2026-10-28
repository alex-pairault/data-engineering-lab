import { runReviewCases } from "../lab-models.js";
const table = (columns, rows, trace, note) => ({ columns, rows, trace, note });
function criteria(mode) {
  const candidates = {
    vague: { age: 120, latency: 900, leaks: 0 },
    fast: { age: 90, latency: 200, leaks: 0 },
    leaky: { age: 20, latency: 500, leaks: 1 },
    balanced: { age: 20, latency: 500, leaks: 0 },
  };
  const c = candidates[mode],
    checks = [
      ["Observed age after change", c.age, "≤ 60s", c.age <= 60],
      ["Sample response latency", c.latency, "≤ 1000ms", c.latency <= 1000],
      ["Cross-user records", c.leaks, "0", c.leaks === 0],
    ];
  return table(
    ["Criterion", "Observed", "Target", "Result"],
    checks.map(([name, value, target, ok]) => [
      name,
      value,
      target,
      ok ? "PASS" : "FAIL",
    ]),
    [
      "Define an actor, initial state and triggering change.",
      "Measure the observable result against explicit conditions.",
      "Include a failure or isolation case.",
    ],
    checks.every(([, , , ok]) => ok)
      ? "This synthetic sample meets these criteria. Real p95/SLO claims need a defined representative measurement window."
      : "“Add a cache” is an implementation proposal, not evidence of acceptable user-visible behaviour.",
  );
}
function packet(mode) {
  const packets = {
    vague: { goal: true },
    dump: { goal: true, context: true },
    bounded: {
      goal: true,
      context: true,
      invariant: true,
      cases: true,
      command: true,
      stop: true,
    },
  };
  const p = packets[mode];
  const fields = [
    ["goal", "User problem and bounded change"],
    ["context", "Relevant files and current behaviour"],
    ["invariant", "Ownership and other invariants"],
    ["cases", "Positive and negative acceptance cases"],
    ["command", "Verification command and expected result"],
    ["stop", "Scope limit and unresolved questions"],
  ];
  return table(
    ["Packet element", "Included"],
    fields.map(([id, label]) => [label, p[id] ? "yes" : "missing"]),
    [
      "State why the change exists.",
      "Supply the smallest relevant context.",
      "Require evidence and a stop condition.",
    ],
    mode === "bounded"
      ? "This is a useful task-writing pattern, not a guarantee that an agent will obey it. Inspect the resulting change."
      : mode === "dump"
        ? "A large repository dump does not replace explicit invariants, scope and checks."
        : "The agent cannot infer a reliable acceptance boundary from this vague request alone.",
  );
}
function delivery(mode) {
  const checked = "commit-A",
    artifact = mode === "wrong-artifact" ? "commit-B" : "commit-A";
  const testsPass = mode !== "failed-tests";
  const canDeploy = testsPass && checked === artifact;
  return table(
    ["Stage", "Identity / result"],
    [
      ["Source checked", checked],
      ["Tests", testsPass ? "pass" : "fail"],
      ["Artifact source", artifact],
      [
        "Release gate",
        canDeploy ? "allows this artifact" : "blocks deployment",
      ],
    ],
    [
      "Run checks for a particular source state.",
      "Build and retain its artifact provenance.",
      "Require successful checks and the matching artifact.",
    ],
    canDeploy
      ? "A passing gate supports these checks for this artifact; production health and rollback still need observation."
      : testsPass
        ? "Green checks for A do not verify an artifact built from B."
        : "A dependent deployment job must wait for checks, for example with needs. Independent jobs can otherwise run separately.",
  );
}
function review(mode) {
  const ids =
    mode === "happy"
      ? ["single"]
      : ["single", "cross", "reverse", "hit", "empty"];
  const results = runReviewCases(ids),
    fixed = mode === "fixed";
  return table(
    ["Behavioural case", "Candidate passes"],
    results.map((r) => [r.id, (fixed ? r.fixed : r.buggy) ? "yes" : "no"]),
    [
      "Patch claim: “The query is scoped to the user.”",
      "Inspect both the cold query and the warm cache return.",
      "Compare the actual returned owners, not only status 200.",
    ],
    mode === "happy"
      ? "The happy-path-only test passes the broken implementation. It does not establish isolation."
      : fixed
        ? "The per-user key passes these changed-order and warm-read cases. Review its expiry, revocation and tenant boundaries separately."
        : "The warm cache path still leaks data. A concise finding names the path, a reproducing case and the missing boundary.",
  );
}
function interview(mode) {
  const prompts = {
    trace: [
      ["Assumptions", "Identify actor, API and data ownership."],
      [
        "Mechanism",
        "Trace browser → app → session/permission → storage/cache.",
      ],
      ["Evidence", "Name an observed response and a negative case."],
    ],
    changed: [
      ["New fact", "Only one instance returns stale values."],
      ["Next check", "Compare its response, cache and shared source."],
      ["Limit", "Do not name a cause before discriminating evidence."],
    ],
    coding: [
      ["Task", "Repair paid_total in the downloadable drill."],
      ["Cases", "Two paid rows, an excluded row, zero and empty input."],
      ["Explain", "State the accumulator rule and what your test establishes."],
    ],
  };
  return table(
    ["Prompt", "Self-check guide"],
    prompts[mode],
    [
      "Give your own attempt before opening this guide.",
      "Speak for two minutes with a concrete example.",
      "Ask your tutor to challenge one assumption.",
    ],
    "This guide does not grade the correctness or clarity of your answer. Quiz feedback and confidence are separate from interview competence.",
  );
}
function capstone(mode) {
  const records = {
    scaffold: { scope: true },
    model: { scope: true, prediction: true, limits: true },
    executed: {
      scope: true,
      prediction: true,
      commands: true,
      results: true,
      changed_case: true,
      assistance: true,
      limits: true,
    },
  };
  const r = records[mode];
  const fields = [
    "scope",
    "prediction",
    "commands",
    "results",
    "changed_case",
    "assistance",
    "limits",
  ];
  return table(
    ["Evidence record field", "Present in sample"],
    fields.map((field) => [field, r[field] ? "yes" : "missing"]),
    [
      "Choose an existing project slice.",
      "Run it, change one edge case and verify again.",
      "Write your own explanation, commands, results and assistance.",
    ],
    mode === "executed"
      ? "The sample record has the requested fields. Field presence does not authenticate execution or establish understanding."
      : "Generated code or a completed browser model is not yet your executed portfolio demonstration.",
  );
}
export const decisionModels = {
  "product-criteria": {
    title: "Evaluate observable behaviour against a stated need",
    diagram: [
      ["User need", "updated and private order summary"],
      ["Acceptance conditions", "age, response, isolation"],
      ["Evidence", "inspect each requirement"],
    ],
    cases: [
      ["vague", "Vague freshness proposal"],
      ["fast", "Fast but too stale"],
      ["leaky", "Fresh but crosses user boundary"],
      ["balanced", "Meets the stated sample criteria"],
    ],
    run: criteria,
  },
  "context-packets": {
    title: "Make the agent’s task reviewable",
    diagram: [
      ["Problem + context", "why; relevant sources"],
      ["Constraints + cases", "what must remain true"],
      ["Verification + stop", "evidence and bounded scope"],
    ],
    cases: [
      ["vague", "One-line vague request"],
      ["dump", "Repository dump without constraints"],
      ["bounded", "Focused context and acceptance packet"],
    ],
    run: packet,
  },
  "ci-delivery": {
    title: "Tie checks and artifacts to the same source state",
    diagram: [
      ["Commit", "source identity"],
      ["Checks + build", "bounded verification"],
      ["Release", "matching artifact and health check"],
    ],
    cases: [
      ["failed-tests", "Checks fail"],
      ["wrong-artifact", "Checks pass; artifact is from another commit"],
      ["matching", "Checks and artifact match"],
    ],
    run: delivery,
  },
  "agent-diff": {
    title: "Test what the patch leaves on the return path",
    attempt: true,
    diagram: [
      ["Claimed repair", "scoped database query"],
      ["Actual return paths", "cold query + warm cache"],
      ["Review evidence", "two users; both orders"],
    ],
    cases: [
      ["happy", "Broken patch; happy-path test only"],
      ["negative", "Broken patch; isolation regression cases"],
      ["fixed", "Scoped cache key; same regression cases"],
    ],
    run: review,
  },
  "interview-practice": {
    title: "Attempt an explanation, then use the self-check guide",
    attempt: true,
    diagram: [
      ["Explain", "assumptions and mechanism"],
      ["Change", "one unfamiliar failure"],
      ["Verify", "small code case and honest limits"],
    ],
    cases: [
      ["trace", "System trace guide"],
      ["changed", "Changed failure guide"],
      ["coding", "Python drill guide"],
    ],
    run: interview,
  },
  capstone: {
    title: "Turn one verified slice into an honest evidence record",
    attempt: true,
    diagram: [
      ["Existing slice", "reuse prepared code"],
      ["Changed edge case", "predict and execute"],
      ["Portfolio record", "reasoning, results and help"],
    ],
    cases: [
      ["scaffold", "Agent scaffolding only"],
      ["model", "Browser-model practice only"],
      ["executed", "Sample record with executed-evidence fields"],
    ],
    run: capstone,
  },
};
