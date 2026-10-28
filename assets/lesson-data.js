import { nextLessonData } from "./lesson-data-next.js";
export const lessonData = {
  ...nextLessonData,
  "request-trace": {
    recall:
      "A page displays an old value. Before changing code, what evidence would you collect to locate the problem?",
    reflection:
      "Explain the difference between a response body and the rendered page. Record the response you inspected and your next investigation step.",
    evidence:
      "Send the fixture request, inspect the received value, then apply it to the page.",
    checks: [
      {
        id: "q1",
        question:
          "The response body contains price 25, while the page shows 20. What is the first useful investigation?",
        options: [
          "The browser rendering logic",
          "The database update statement",
          "The application’s DNS records",
          "The server certificate chain",
        ],
        answer: 0,
        hint: "Compare what arrived with what the browser chose to display.",
        feedback:
          "The received value is already current. Start with how the browser stores or renders that response; the response alone does not prove every application path works.",
      },
      {
        id: "q2",
        question:
          "A request returns HTTP 200. What can you conclude from that status alone?",
        options: [
          "The requested HTTP operation succeeded",
          "The displayed interface contains truth",
          "The complete application works correctly",
          "The cached information remains current",
        ],
        answer: 0,
        hint: "A status describes this HTTP operation, not the whole product.",
        feedback:
          "200 describes a successful HTTP request. Later requests, rendering, application state, and the correctness of the returned data need their own checks.",
      },
    ],
    review: {
      question:
        "A new account balance is 80 in the response and 65 on screen. Where would you inspect first?",
      options: [
        "The browser’s state and rendering",
        "The database’s backup and restore",
        "The server’s certificate and issuer",
        "The network’s hostname and resolver",
      ],
      answer: 0,
      feedback:
        "Trace the value after receipt: response handling, browser state, and rendering. Then check that your hypothesis fits the observations.",
    },
  },
  authentication: {
    recall:
      "What evidence should a server require before it treats a request as belonging to a particular person?",
    reflection:
      "Describe the identity check in your own words. Explain what a stored password verifier is for and why a successful sign-in does not grant every permission.",
    evidence:
      "Trace one rejected credential attempt and one accepted attempt in the sign-in model.",
    checks: [
      {
        id: "q1",
        question:
          "For password-based authentication, what is the stored verifier normally used to do?",
        options: [
          "Check a supplied password safely",
          "Recover a forgotten password directly",
          "Permit every database operation automatically",
          "Trust a browser identity blindly",
        ],
        answer: 0,
        hint: "Use a dedicated password-verification function; it checks a submitted secret against a stored verifier.",
        feedback:
          "A vetted password-verification function checks the submitted password against its stored salted password hash. It does not recover the original password or decide every resource permission.",
      },
      {
        id: "q2",
        question: "Which pair uses two distinct authentication factor types?",
        options: [
          "A password and another PIN",
          "A password and security key",
          "A password and another password",
          "A PIN and secret phrase",
        ],
        answer: 1,
        hint: "A factor type can be something you know, something you possess, or something you are.",
        feedback:
          "A password is a knowledge factor; a security key is a possession factor. Two knowledge secrets do not by themselves make two distinct factors.",
      },
    ],
    review: {
      question:
        "Someone signs in successfully but is denied access to a colleague’s private file. Which explanation fits?",
      options: [
        "Identity passed; resource permission failed",
        "Identity failed; resource permission passed",
        "Password expired; browser rendering failed",
        "Network failed; database backup passed",
      ],
      answer: 0,
      feedback:
        "Authentication establishes identity. Authorization decides whether that identity may perform this operation on this resource.",
    },
  },
  sessions: {
    recall:
      "After sign-in, what could the browser send on the next request, and what would the server need to validate?",
    reflection:
      "Trace the cookie identifier to the server-side record. Explain the tampering result and what changed when you expired or invalidated the session.",
    evidence:
      "Sign in, send a request, change the browser’s user claim and request again, then expire the session and see it rejected.",
    checks: [
      {
        id: "q1",
        question:
          "In this opaque-ID session model, where is the meaning of the session identifier kept?",
        options: [
          "Inside the browser’s display markup",
          "Inside the server’s session record",
          "Inside the address bar’s hostname",
          "Inside the browser’s stylesheet rules",
        ],
        answer: 1,
        hint: "The identifier points to the record; it does not let the browser choose the authenticated identity.",
        feedback:
          "In this model, the server-held record binds the opaque identifier to an authenticated user and validity information. Other session architectures exist, but this lesson explicitly models server-backed sessions.",
      },
      {
        id: "q2",
        question:
          "Logout only deletes the browser cookie. A copied identifier remains accepted. What is missing?",
        options: [
          "Invalidate the server’s session record",
          "Change the browser’s stylesheet rules",
          "Refresh the page’s visible heading",
          "Rename the server’s database table",
        ],
        answer: 0,
        hint: "Think about the other copy of the identifier and the record that still accepts it.",
        feedback:
          "Deleting one browser’s cookie does not invalidate a copied credential. Logout must revoke the corresponding server-side session in this model.",
      },
    ],
    review: {
      question:
        "The browser cookie lasts a week, but the server revoked the session today. What should the next protected request do?",
      options: [
        "Accept because cookie expiry wins",
        "Reject because server validity fails",
        "Accept because browser storage exists",
        "Reject because page styling changed",
      ],
      answer: 1,
      feedback:
        "A cookie’s presence and lifetime do not override server-side validity. The server must reject a revoked session.",
    },
  },
  "cache-isolation": {
    recall:
      "A database query filters by the signed-in user. Could a cache still break the user-isolation rule? Trace the possibilities.",
    reflection:
      "Describe a request sequence that exposed the bug, the key you changed, and the evidence that the changed example keeps the two users separate.",
    evidence:
      "Observe a wrong-user result with a shared key. Switch to per-user keys and request both users twice.",
    checks: [
      {
        id: "q1",
        question:
          "Why can a correctly filtered database query fail to protect a cached response?",
        options: [
          "The cached path bypasses it",
          "The database always ignores it",
          "The browser always deletes it",
          "The network always encrypts it",
        ],
        answer: 0,
        hint: "Trace which return statement executes when the cache already has a value.",
        feedback:
          "On a cache hit, the function may return before the correctly scoped database query runs. Trace and authorize every protected return path.",
      },
      {
        id: "q2",
        question:
          "In this fixed-permission example, which cache key separates each authenticated user’s note list?",
        options: [
          "A single constant notes key",
          "A key per authenticated user",
          "A key per browser colour",
          "A key per response size",
        ],
        answer: 1,
        hint: "The value changes with the authenticated identity, so the key needs that identity context.",
        feedback:
          "User-specific keys address this example. A real design must also account for tenants, query parameters, changing permissions, and invalidation where those affect the response.",
      },
    ],
    review: {
      question:
        "A report cache is isolated by user, but that user’s permission was revoked. What else needs checking?",
      options: [
        "Whether the cache still bypasses authorization",
        "Whether the browser still displays headings",
        "Whether the stylesheet still contains colours",
        "Whether the hostname still contains letters",
      ],
      answer: 0,
      feedback:
        "A user-specific key is not a substitute for authorization. Cached access must respect current permission and invalidation rules.",
    },
  },
  "agent-verification": {
    recall:
      "An agent says its change works. What evidence would make that claim reviewable?",
    reflection:
      "State the acceptance rule, the test that rejected the buggy change, and the evidence needed before accepting the repair. Include a question about allowed staleness.",
    evidence:
      "Choose checks that expose the buggy build and pass on the repaired build. Include a two-user request sequence.",
    checks: [
      {
        id: "q1",
        question:
          "Which check best challenges a shared-cache privacy assumption?",
        options: [
          "One user opens their notes",
          "Two users read sequentially, cached",
          "One heading matches its screenshot",
          "One request returns without crashing",
        ],
        answer: 1,
        hint: "Use a second identity after the first identity has already populated shared state.",
        feedback:
          "A sequential two-user check crosses the shared-state boundary. A one-user happy path can pass while the data-leak bug remains.",
      },
      {
        id: "q2",
        question: "What should be clarified before choosing a cache lifetime?",
        options: [
          "The acceptable age of data",
          "The preferred colour of headings",
          "The alphabetical order of functions",
          "The spelling length of variables",
        ],
        answer: 0,
        hint: "The product question concerns what users need to know immediately and what can wait.",
        feedback:
          "Agree how stale the result may be and which updates or permission changes must take effect immediately. Measure the performance benefit as well.",
      },
    ],
    review: {
      question:
        "The agent’s tests pass, but they all use a single account. What is the most useful next action?",
      options: [
        "Add a cross-user cached-request check",
        "Trust the passing test-count summary",
        "Increase the cache duration further",
        "Rename the existing test functions",
      ],
      answer: 0,
      feedback:
        "Challenge the untested boundary with a meaningful regression check. A green suite only covers the behaviours its assertions actually exercise.",
    },
  },
};
