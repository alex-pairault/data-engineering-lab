export const webQuestions = {
  "browser-origins": {
    recall:
      "A cross-origin fetch fails in the browser. Does that prove the server never received it? Define an origin before checking the example.",
    reflection:
      "Explain the understand the browser boundary mechanism in your own words. Record one prediction, the observed result, one failure or tradeoff, and the limits of the evidence. Distinguish browser-model practice from any command you actually ran and state the help used.",
    evidence:
      "Predict and inspect all 5 prepared scenarios, then use the focused practical task below. Model completion is guided practice, not a claim that you ran an external tool.",
    checks: [
      {
        id: "q1",
        question: "What defines a web origin?",
        options: [
          "Scheme host and effective port",
          "Path query and fragment only",
          "Cookie name and cookie value",
          "HTML title and stylesheet filename",
        ],
        answer: 0,
        hint: "Trace the boundary and distinguish the observation from a broader claim.",
        feedback:
          "An origin is scheme, host and effective port. Paths do not change it.",
      },
      {
        id: "q2",
        question:
          "A simple GET has a CORS-blocked response. What can still be true?",
        options: [
          "Browser always blocks every request",
          "CORS establishes the caller identity",
          "CORS replaces every permission check",
          "Server may receive the request",
        ],
        answer: 3,
        hint: "Trace the boundary and distinguish the observation from a broader claim.",
        feedback:
          "A simple request may reach the server even when page JavaScript cannot read the response.",
      },
    ],
    review: {
      question: "A preflight is denied in this example. What happens next?",
      options: [
        "Browser rewrites the database records",
        "Server receives every private cookie",
        "Actual request is not sent",
        "Actual request always bypasses authentication",
      ],
      answer: 2,
      feedback:
        "The browser withholds the actual preflighted request after a failed preflight.",
    },
  },
  "test-boundaries": {
    recall:
      "A pure calculation test passes, but saving an order fails. Which boundary has not been exercised?",
    reflection:
      "Explain the test behaviour at a boundary mechanism in your own words. Record one prediction, the observed result, one failure or tradeoff, and the limits of the evidence. Distinguish browser-model practice from any command you actually ran and state the help used.",
    evidence:
      "Predict and inspect all 3 prepared scenarios, then use the focused practical task below. Model completion is guided practice, not a claim that you ran an external tool.",
    checks: [
      {
        id: "q1",
        question: "What does a passing pure-rule unit test establish here?",
        options: [
          "Every production database schema matches",
          "Every external API remains available",
          "Every deployment uses correct credentials",
          "Its exercised calculation and validation",
        ],
        answer: 3,
        hint: "Trace the boundary and distinguish the observation from a broader claim.",
        feedback:
          "A unit result supports its actual boundary and cases; it does not establish unexercised integrations.",
      },
      {
        id: "q2",
        question: "Which check exposes writing after an invalid operation?",
        options: [
          "Check only the function name",
          "Mock every dependency as successful",
          "Inspect actual stored row changes",
          "Check only the returned status",
        ],
        answer: 2,
        hint: "Trace the boundary and distinguish the observation from a broader claim.",
        feedback: "Inspect the storage effect as well as the error response.",
      },
    ],
    review: {
      question: "A mock repository accepts any column. What can it miss?",
      options: [
        "The current lesson confidence rating",
        "The real database schema mismatch",
        "The chosen Python function name",
        "The displayed browser tab title",
      ],
      answer: 1,
      feedback:
        "A permissive mock cannot prove that actual SQL and schema fit.",
    },
  },
  "dns-tls-nginx": {
    recall:
      "A request returns 502 from Nginx. Which connections have probably succeeded in this controlled example, and which evidence would you inspect next?",
    reflection:
      "Explain the follow a request into the server mechanism in your own words. Record one prediction, the observed result, one failure or tradeoff, and the limits of the evidence. Distinguish browser-model practice from any command you actually ran and state the help used.",
    evidence:
      "Predict and inspect all 4 prepared scenarios, then use the focused practical task below. Model completion is guided practice, not a claim that you ran an external tool.",
    checks: [
      {
        id: "q1",
        question: "A 502 from this proxy should lead first to which evidence?",
        options: [
          "Relevant proxy and upstream observations",
          "Deleting every browser session cookie",
          "Replacing every database table immediately",
          "Disabling certificate validation for everyone",
        ],
        answer: 0,
        hint: "Trace the boundary and distinguish the observation from a broader claim.",
        feedback:
          "Use the specific proxy error and upstream observations to narrow the cause; 502 has multiple possible causes.",
      },
      {
        id: "q2",
        question: "What does TLS termination at Nginx protect directly?",
        options: [
          "Every future database connection automatically",
          "Every browser script against injection",
          "Every application permission check automatically",
          "The client to Nginx connection",
        ],
        answer: 3,
        hint: "Trace the boundary and distinguish the observation from a broader claim.",
        feedback:
          "The upstream is a separate connection whose protection and protocol need their own configuration.",
      },
    ],
    review: {
      question:
        "Can HTTP proxy_pass replace PHP-FPM FastCGI configuration unchanged?",
      options: [
        "Only after deleting all cookies",
        "Only after changing CSS files",
        "No; they use different protocols",
        "Yes both names mean PHP",
      ],
      answer: 2,
      feedback: "HTTP proxying and FastCGI forwarding use different protocols.",
    },
  },
  "logs-sentry": {
    recall:
      "A request failed near a successful log line. How would you decide whether those two records describe the same operation?",
    reflection:
      "Explain the find the evidence of failure mechanism in your own words. Record one prediction, the observed result, one failure or tradeoff, and the limits of the evidence. Distinguish browser-model practice from any command you actually ran and state the help used.",
    evidence:
      "Predict and inspect all 3 prepared scenarios, then use the focused practical task below. Model completion is guided practice, not a claim that you ran an external tool.",
    checks: [
      {
        id: "q1",
        question: "Which context best connects records for one operation?",
        options: [
          "The longest available error message",
          "The newest installed font family",
          "A consistent request correlation identifier",
          "The closest browser window position",
        ],
        answer: 2,
        hint: "Trace the boundary and distinguish the observation from a broader claim.",
        feedback:
          "A consistent operation identity helps correlate relevant evidence across components.",
      },
      {
        id: "q2",
        question: "What does capturing an exception in Sentry accomplish?",
        options: [
          "Guarantees removal of all secrets",
          "Reports evidence for later investigation",
          "Repairs every failed database operation",
          "Restores every deleted business record",
        ],
        answer: 1,
        hint: "Trace the boundary and distinguish the observation from a broader claim.",
        feedback:
          "Error reporting supplies evidence; it does not repair the failed operation or guarantee arbitrary context is safe.",
      },
    ],
    review: {
      question:
        "A logging schema allows a field name. What still needs review?",
      options: [
        "Its actual value and sensitivity",
        "Only the displayed font size",
        "Only the source file extension",
        "Only the current browser width",
      ],
      answer: 0,
      feedback:
        "Field allowlisting is useful, but the actual values and their sensitivity still matter.",
    },
  },
  "web-security": {
    recall:
      "A search string contains an apostrophe or SQL-shaped text. How should the database distinguish that value from query syntax?",
    reflection:
      "Explain the follow the trust boundary mechanism in your own words. Record one prediction, the observed result, one failure or tradeoff, and the limits of the evidence. Distinguish browser-model practice from any command you actually ran and state the help used.",
    evidence:
      "Predict and inspect all 3 prepared scenarios, then use the focused practical task below. Model completion is guided practice, not a claim that you ran an external tool.",
    checks: [
      {
        id: "q1",
        question: "Why does parameter binding stop the illustrated injection?",
        options: [
          "All browser cookies become encrypted",
          "Input stays data not syntax",
          "Every caller becomes an administrator",
          "The database ignores all predicates",
        ],
        answer: 1,
        hint: "Trace the boundary and distinguish the observation from a broader claim.",
        feedback:
          "Binding values preserves the query structure; it does not replace ownership checks.",
      },
      {
        id: "q2",
        question:
          "Which mechanism describes attacker-controlled browser script execution?",
        options: [
          "Cross site scripting through output",
          "A database transaction rollback operation",
          "A server process restart operation",
          "A scheduled workflow retry operation",
        ],
        answer: 0,
        hint: "Trace the boundary and distinguish the observation from a broader claim.",
        feedback:
          "XSS concerns browser code execution. SQL injection and CSRF have different mechanisms and defenses.",
      },
    ],
    review: {
      question:
        "Does CORS alone prevent every cookie-authenticated forged action?",
      options: [
        "Yes every request becomes authenticated",
        "Only after increasing cache lifetimes",
        "Only after changing database names",
        "No server defenses remain necessary",
      ],
      answer: 3,
      feedback: "CORS response-access policy is not a complete CSRF defense.",
    },
  },
  "python-errors": {
    recall:
      "An API client returns an empty list after every exception. Which failures become impossible for the caller to distinguish?",
    reflection:
      "Explain the handle the failure path mechanism in your own words. Record one prediction, the observed result, one failure or tradeoff, and the limits of the evidence. Distinguish browser-model practice from any command you actually ran and state the help used.",
    evidence:
      "Predict and inspect all 6 prepared scenarios, then use the focused practical task below. Model completion is guided practice, not a claim that you ran an external tool.",
    checks: [
      {
        id: "q1",
        question:
          "Valid JSON arrives with the wrong application shape. What is needed?",
        options: [
          "Assume HTTP success proves correctness",
          "Return empty data as success",
          "Retry every write without limit",
          "Validate the expected data schema",
        ],
        answer: 3,
        hint: "Trace the boundary and distinguish the observation from a broader claim.",
        feedback: "Parsing and schema validation are separate boundaries.",
      },
      {
        id: "q2",
        question:
          "A POST times out after possible server commit. What follows?",
        options: [
          "The write definitely happened twice",
          "The browser automatically reversed it",
          "The operation outcome is uncertain",
          "The write definitely never happened",
        ],
        answer: 2,
        hint: "Trace the boundary and distinguish the observation from a broader claim.",
        feedback:
          "A transport timeout does not establish whether a business effect committed.",
      },
    ],
    review: {
      question:
        "What is wrong with returning empty success after every exception?",
      options: [
        "All retries become automatically safe",
        "Failures become indistinguishable from emptiness",
        "Every real failure gets repaired",
        "Every response becomes more accurate",
      ],
      answer: 1,
      feedback:
        "The caller loses the distinction between valid empty data and a failed operation.",
    },
  },
  "container-network": {
    recall:
      "A proxy container calls localhost:18080 to reach its peer. Whose loopback is that, and which port does the peer actually listen on?",
    reflection:
      "Explain the connect the local stack mechanism in your own words. Record one prediction, the observed result, one failure or tradeoff, and the limits of the evidence. Distinguish browser-model practice from any command you actually ran and state the help used.",
    evidence:
      "Predict and inspect all 3 prepared scenarios, then use the focused practical task below. Model completion is guided practice, not a claim that you ran an external tool.",
    checks: [
      {
        id: "q1",
        question:
          "Inside this bridge-network proxy, what does localhost identify?",
        options: [
          "Only the Docker host globally",
          "Only the external database globally",
          "That proxy container’s own loopback",
          "Every peer container simultaneously automatically",
        ],
        answer: 2,
        hint: "Trace the boundary and distinguish the observation from a broader claim.",
        feedback: "Loopback is local to the caller’s network context.",
      },
      {
        id: "q2",
        question: "Which endpoint should the proxy use for this app peer?",
        options: [
          "Its host username and password",
          "Service name plus internal port",
          "Its browser origin and fragment",
          "Its stylesheet name and extension",
        ],
        answer: 1,
        hint: "Trace the boundary and distinguish the observation from a broader claim.",
        feedback:
          "Peers use their service DNS name and internal port, here app:8000.",
      },
    ],
    review: {
      question:
        "Does initial startup order guarantee later dependency readiness?",
      options: [
        "No; later disconnects need handling",
        "Yes every future connection succeeds",
        "Only when every cookie expires",
        "Only when browser caches disappear",
      ],
      answer: 0,
      feedback:
        "A healthcheck can gate initial readiness, but later failures still need handling.",
    },
  },
  "mixed-trace": {
    recall:
      "Facts: identical product requests return 100 from instance A and 120 from B. The shared source now contains 120. What observation would discriminate a browser problem from server-side state?",
    reflection:
      "Explain the trace an unfamiliar failure mechanism in your own words. Record one prediction, the observed result, one failure or tradeoff, and the limits of the evidence. Distinguish browser-model practice from any command you actually ran and state the help used.",
    evidence:
      "Predict and inspect all 3 prepared scenarios, then use the focused practical task below. Model completion is guided practice, not a claim that you ran an external tool.",
    checks: [
      {
        id: "q1",
        question: "What distinguishes a hypothesis from an observation?",
        options: [
          "It removes every remaining uncertainty",
          "It proposes a possible explanation",
          "It always proves the cause",
          "It replaces every measured response",
        ],
        answer: 1,
        hint: "Trace the boundary and distinguish the observation from a broader claim.",
        feedback:
          "A hypothesis is a possible explanation to test against observations.",
      },
      {
        id: "q2",
        question:
          "Which comparison narrows this instance-specific response split?",
        options: [
          "Equivalent responses and source values",
          "Unrelated users and unrelated products",
          "Only the browser window dimensions",
          "Only the newest file timestamp",
        ],
        answer: 0,
        hint: "Trace the boundary and distinguish the observation from a broader claim.",
        feedback:
          "Hold relevant request conditions constant and compare response paths with the intended source.",
      },
    ],
    review: {
      question:
        "One cache invalidation fixes this controlled symptom. What should be stated?",
      options: [
        "Every production cache is broken",
        "All future incidents are solved",
        "Every database query is unnecessary",
        "Evidence supports this bounded explanation",
      ],
      answer: 3,
      feedback:
        "Explain the combined evidence and its limits instead of claiming a universal cause.",
    },
  },
  "load-balancing": {
    recall:
      "A user signs in on instance A, then some requests to B return 401. Where might the session live, and what would affinity fail to protect?",
    reflection:
      "Explain the one application, several instances mechanism in your own words. Record one prediction, the observed result, one failure or tradeoff, and the limits of the evidence. Distinguish browser-model practice from any command you actually ran and state the help used.",
    evidence:
      "Predict and inspect all 4 prepared scenarios, then use the focused practical task below. Model completion is guided practice, not a claim that you ran an external tool.",
    checks: [
      {
        id: "q1",
        question:
          "Why can local sessions fail when requests reach another replica?",
        options: [
          "Replica memory is not shared",
          "Cookies contain every session detail",
          "Load balancing disables all authentication",
          "Every database automatically loses rows",
        ],
        answer: 0,
        hint: "Trace the boundary and distinguish the observation from a broader claim.",
        feedback:
          "Independent processes do not automatically share session state.",
      },
      {
        id: "q2",
        question: "What does routing affinity fail to guarantee?",
        options: [
          "The selected browser font family",
          "The original request method name",
          "The syntax of JSON strings",
          "Durable replicated application session state",
        ],
        answer: 3,
        hint: "Trace the boundary and distinguish the observation from a broader claim.",
        feedback:
          "Affinity can hide local-state symptoms while one instance survives; it does not replicate the state.",
      },
    ],
    review: {
      question:
        "Does creating a Kubernetes Service replicate application session contents?",
      options: [
        "Only after increasing cookie lifetimes",
        "Only after renaming every Pod",
        "No; application state needs design",
        "Yes every local file replicates",
      ],
      answer: 2,
      feedback:
        "A Service provides network access to changing backends, not automatic application-state replication.",
    },
  },
};
