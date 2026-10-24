# Provisional roadmap

The initial diagnostic was completed on October 24, 2026. This sequence now starts with request/state mechanisms, user isolation, and practical verification, while retaining shared foundations across software, data, and product work. Personal assessment answers and ratings stay local; later lessons will probe areas not covered by the initial triage.

From October 26 through December 15, 2026, there are 37 Monday-to-Friday learning sessions, or 18.5 hours at 30 minutes each, before holidays or missed days. The diagnostic was completed before this window; its former slot is reassigned to practical agent review and verification.

| Focus | Sessions | Planned demonstration |
| --- | ---: | --- |
| Web fundamentals | 9 | Trace HTTP/API requests and browser behaviour; explicitly cover authentication, sessions, authorization, and caching |
| Programming and databases | 7 | Refresh Python; structure, test, and debug a small change; use SQL, constraints, transactions, concurrency, and indexes |
| Infrastructure | 5 | Explain processes, ports, DNS, TLS, reverse proxies, and load balancing; run a small Docker setup |
| Reliability, security, and delivery | 5 | Use Git, dependency management, tests, and CI; diagnose failures; reason about security, performance, deployment, and recovery |
| Data systems | 4 | Demonstrate data quality, a small dbt transformation, background work, dependencies, retries, and safe reruns |
| Product decisions and agent workflow | 4 | Frame a user problem, specify acceptance criteria, supply relevant context, and review and verify an agent change |
| Mixed interview practice and revisits | 3 | Explain unfamiliar scenarios and revisit earlier weak areas across domains |
| **Total** | **37** | **18.5 hours** |

## Breadth and depth

Use the English and visual presentation requirements in [LESSON-FORMAT.md](LESSON-FORMAT.md) for every authored lesson. The initial diagnostic is complete; continue with focused lessons and short embedded probes rather than restarting it.

Use [SKILL-MAP.md](SKILL-MAP.md) to keep the important topics visible. An explanation should connect the purpose, mechanism, and one failure mode. Selected topics also require a small implementation or debugging task. These are first-pass targets, not a promise of expertise after 18.5 hours.

Start with web fundamentals so authentication, sessions, and data isolation are addressed early. Pair explanations with small verification tasks, including cache-hit paths, negative cases, and more than one synthetic user. Mix in short recall questions from other domains. Each week, use part of the existing review time to check coverage; do not let a job-specific tool consume the shared-foundation budget.

Keep Python active through small exercises throughout the course. A focused interview can expose missing evidence and reprioritise practice, but job advertisements alone do not define the curriculum.

## First five weekday sessions

These are planned lessons, not completed portfolio exercises. Their allocation is included in the table above.

| Date | Allocation | Focus and planned evidence |
| --- | --- | --- |
| October 26 | Web 01 | Trace a browser request and inspect the response supplying a displayed value. |
| October 27 | Web 03 | Trace identity verification in a small login flow; explain where authentication occurs. |
| October 28 | Web 04 | Inspect browser-held and server-held session state; demonstrate expiry or logout. |
| October 29 | Web 05 | Check user isolation through database and cache paths in a changed example using two synthetic users. |
| October 30 | Product/agent verification 01 | Write and run behavioural checks for a small agent change, then record the evidence supporting acceptance. |

Continue with Web 02, caching/freshness/invalidation, and the remaining web topics. Interleave Python and SQL practice, including outer-join filters, nulls, and edge-case fixtures. Later deployment and retry exercises must collect executed evidence, in addition to verbal explanations.

## Web sequence and explicit authentication step

These nine focused sessions fit inside the existing web allocation. Their order may change with diagnostic evidence, but authentication, sessions, authorization, and caching remain visible.

| Session | Focus | Planned visual and practical check |
| --- | --- | --- |
| Web 01 | Browser, HTTP, server, and application roles | Request/response sequence; inspect a response in browser network tools. |
| Web 02 | APIs and contracts | Annotated request/response; investigate validation, status codes, and a contract change. |
| Web 03 | Authentication | Sign-in sequence; trace identity verification and password-hash checking using established library behaviour. Explain MFA's purpose. |
| Web 04 | Sessions and cookies | Browser/server state diagram; inspect a synthetic session, expiry, and logout. Briefly locate token-based approaches in the picture. |
| Web 05 | Authorization | User/resource permission matrix; check that two signed-in users cannot access each other's private resource. |
| Web 06 | Caching and freshness | Cache-hit/miss flow and TTL timeline; compare a first read and a repeated read. |
| Web 07 | Invalidation and private data | Before/after timeline; change a value, investigate a stale result, and reason about shared-cache boundaries. |
| Web 08 | Browser behaviour and cross-origin requests | Browser/application origin diagram; explain HTML/CSS/JavaScript roles and investigate a request in the browser. |
| Web 09 | Web security and a mixed failure case | Trust-boundary diagram; inspect one focused XSS, CSRF, or injection example chosen from the diagnostic. |

Authentication coverage starts with identity, sign-in, password hashing versus encryption, MFA, and recovery considerations. Session handling and authorization receive their own sessions. OAuth 2.0, OpenID Connect, and JWT receive introductory recognition and correct role distinctions when relevant; complete provider integration and protocol implementation are later depth options, not extra promises within one 30-minute lesson.

## Supporting software fundamentals

Integrate these into existing exercises rather than adding separate installations or a larger schedule:

- **Git and dependencies:** read diffs, use branches and pull requests, handle a small conflict, understand pinned versions, lockfiles, and isolated environments. Use the delivery allocation and normal portfolio work.
- **Code structure and everyday complexity:** separate request handling, business rules, and storage; use clear functions and interfaces; compare ordinary list/dictionary/set operations and avoid unnecessary abstractions. Use programming exercises.
- **Concurrency and correctness:** explain a race condition, use a database transaction or constraint where appropriate, and distinguish asynchronous execution from parallel work. Use programming/database exercises.
- **Background jobs and webhooks:** trace a queued job or incoming event, reason about acknowledgement, duplicate delivery, retries, and idempotency. Contrast this with a scheduled workflow in the data allocation; RabbitMQ is a reference example, not a required new stack component.
- **Browser and API boundaries:** distinguish browser state from server state, inspect network activity, explain same-origin/CORS concepts, and recognise accessible form feedback. Use the web and product exercises.
- **Performance and safe evolution:** find evidence before optimising; recognise N+1 queries, pagination, and blocking work; consider API compatibility, migrations, and rollback. Use database, API, and delivery exercises.

These are a coverage checklist with selected practical examples. The 37-session budget is unchanged; record gaps for later practice rather than compressing multiple deep lessons into a single session.

## Project thread

Use a tiny order dashboard with synthetic data as the shared reference project. Introduce a browser request, a small API, login/session behaviour, a database-backed operation, a cache, and a background data task in separate exercises. Investigate controlled failures and explain the user impact. Start from prepared scaffolding where setup would otherwise consume the session.

Select the runtime and framework after the diagnostic. Python exercises provide the language refresh; safe, read-only walkthroughs of existing PHP work can connect concepts to current experience. Public examples must be original and must not copy employer code or data.

Introduce Docker, a small dbt example, and an Airflow example only when they support the concepts being practised. Explain Kubernetes's role and its relationship to containers at a high level; cluster administration remains a later specialisation.

## Initial diagnostic

Completed October 24, 2026. It sampled session state, resource permissions, caching, Python reading, SQL aggregation, retry safety, deployment reasoning, and agent review/product freshness concerns. This was a reasoning triage, not a complete competency or seniority assessment.

Keep answers and coaching notes local. An unasked question remains unassessed; do not infer competence across an entire domain from one answer. Short probes within future lessons will establish the starting depth for topics such as Docker, Git/CI, transactions, and orchestration. The existing lesson budgets include those probes.

## Evidence and progress

Distinguish the following states for each skill:

- **Unassessed:** no evidence collected.
- **Needs practice:** an attempt revealed a specific gap.
- **Demonstrated with help:** the task was completed with hints or substantive assistance.
- **Demonstrated independently:** the learner completed the task and explained the result.
- **Retained:** demonstrated again on a changed task in a later session.

Record the exercise, date, assistance used, and verification behind a state change. A completed lesson, passing test, or high confidence rating alone does not justify a mastery claim.

Personal diagnostic results stay local. Public progress is expressed through completed exercises and their evidence.

Fieldnotes now shows this course map, practice evidence, and next-review dates. Five lessons are ready; the remaining sessions are outlines. Completing the data exercises must not imply that sessions, caching, or deployment have been demonstrated.
