# Provisional roadmap

The initial diagnostic was completed on October 24, 2026. This sequence now starts with request/state mechanisms, user isolation, and practical verification, while retaining shared foundations across software, data, and product work. Personal assessment answers and ratings stay local; later lessons will probe areas not covered by the initial triage.

The learner starts on **November 3, 2026** and chose to keep all **37 Monday-to-Friday sessions**, finishing on **December 23, 2026**. This replaces the original mid-December target and remains 18.5 hours at 30 minutes per session, before holidays or missed days. Dates skip weekends; public holidays are not automatically excluded. The diagnostic was completed before this window; its former slot is reassigned to practical agent review and verification.

| Focus | Sessions | Planned demonstration |
| --- | ---: | --- |
| Web fundamentals | 9 | Trace HTTP/API requests and browser behaviour; explicitly cover authentication, sessions, authorization, and caching |
| Programming and databases | 7 | Refresh Python while profiling CPU, RAM, and I/O; structure, test, and debug a small change; use SQL, constraints, transactions, concurrency, and indexes |
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

These authored lessons are available, not completed portfolio exercises. Their allocation is included in the table above.

| Date | Allocation | Focus and planned evidence |
| --- | --- | --- |
| November 3 | Web 01 | Trace a browser request and inspect the response supplying a displayed value. |
| November 4 | Web 03 | Trace identity verification in a small login flow; explain where authentication occurs. |
| November 5 | Web 04 | Inspect browser-held and server-held session state; demonstrate expiry or logout. |
| November 6 | Web 05 | Check user isolation through database and cache paths in a changed example using two synthetic users. |
| November 9 | Product/agent verification 01 | Write and run behavioural checks for a small agent change, then record the evidence supporting acceptance. |

Continue with Web 02, caching/freshness/invalidation, and the remaining web topics. Interleave Python and SQL practice, including outer-join filters, nulls, and edge-case fixtures. Later deployment and retry exercises must collect executed evidence, in addition to verbal explanations.

## Next five weekday sessions

These authored lessons are available in Fieldnotes. Availability is not a claim that the learner completed them.

| Date | Session | Focus and guided evidence |
| --- | --- | --- |
| November 10 | 06 | API validation, pagination, and a response-shape compatibility failure. |
| November 11 | 07 | CPU/RAM/I/O model; a locally executed Python comparison with equal-output and resource measurements. |
| November 12 | 08 | LEFT JOIN filtering, missing groups, NULL sums, and executed SQLite examples using a shared fixture. |
| November 13 | 09 | A live but stale entry, fixed TTL expiry, and a later miss/reload. |
| November 16 | 10 | Controlled invalidation/commit interleavings, rollback, and remaining failure limits. |

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
- **Hardware and resource use:** explicitly connect CPU cores and caches, RAM, storage, and network I/O to a running script. Use the dedicated Python profiling session below, then revisit bounded batches, worker limits, and resource budgets in data, Docker, and performance exercises.
- **Concurrency and correctness:** explain a race condition, use a database transaction or constraint where appropriate, and distinguish asynchronous execution from parallel work. Use programming/database exercises.
- **Background jobs and webhooks:** trace a queued job or incoming event, reason about acknowledgement, duplicate delivery, retries, and idempotency. Contrast this with a scheduled workflow in the data allocation; RabbitMQ is a reference example, not a required new stack component.
- **Browser and API boundaries:** distinguish browser state from server state, inspect network activity, explain same-origin/CORS concepts, and recognise accessible form feedback. Use the web and product exercises.
- **Performance and safe evolution:** find evidence before optimising; recognise N+1 queries, pagination, and blocking work; consider API compatibility, migrations, and rollback. Use database, API, and delivery exercises.

These are a coverage checklist with selected practical examples. The 37-session budget is unchanged; record gaps for later practice rather than compressing multiple deep lessons into a single session.

## Dedicated hardware and script-efficiency lesson

**Session 07 — November 11: Hardware for scripts: CPU, RAM, and I/O.** This refocuses the existing Python refresh/debugging slot, keeping the course at 37 sessions. Its objective is to justify one script change using resource measurements. The runnable lesson is available at [session 07](lessons/0007-hardware-resources.html), with a downloadable standard-library Python exercise and local measurement-report inspection.

- **Recall, 5 minutes:** predict what happens when the input doubles and distinguish RAM from persistent storage.
- **Visual explanation, 5 minutes:** trace storage/network → live objects in RAM → CPU cores and caches. Locate CPU work, I/O waits, the working set, and memory pressure. Introduce paging/swap and out-of-memory failures without deliberately exhausting the learner's machine.
- **Experiment, 15 minutes:** run a prepared Python script over bounded synthetic data. Compare loading a file into a list with streaming it, verify identical counts/checksums, and repeat at twice the input size. Record elapsed time (`perf_counter`), current-process CPU time (`process_time`), and peak traced Python allocations (`tracemalloc`). Inspect process RAM separately in a system monitor; traced allocations are not total process memory. Treat timing differences as observations, accounting for profiler overhead and file caching.
- **Explain, 5 minutes:** keep a before/after table, justify streaming or a bounded batch size, and state a tradeoff and a follow-up check. Explain why extra threads, processes, or CPU cores do not guarantee a speedup, and how extra workers can increase memory use. Detailed parallelism practice remains in later runtime/background-work exercises.

Revisit the same reasoning when processing data batches, setting container memory/CPU budgets, and investigating a slow request. The first pass needs a useful mental model and one measured change; advanced processor architecture is a later depth option. Sources are listed in [RESOURCES.md](RESOURCES.md).

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

Fieldnotes now shows this course map, practice evidence, and next-review dates. Ten lessons are ready; the remaining 27 sessions are outlines. Completing the data exercises must not imply that sessions, caching, or deployment have been demonstrated.
