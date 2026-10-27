# Shared engineering skill map

The initial diagnostic is complete. This public map lists learning targets; personal assessment ratings and answers stay local. Public demonstration links will be added as original exercises are completed. Adjust depth to observed evidence and keep unprobed areas explicitly unassessed.

## What counts as understanding

- **Explain:** describe the purpose, trace the mechanism, and give one relevant failure or tradeoff in your own words.
- **Apply:** complete a small task and verify the observed result. Record any substantive help.
- **Debug:** investigate a changed or broken example, justify the cause, and verify a correction.

These are different kinds of evidence, not interchangeable completion badges. Aim for explanations across the map, then prioritise application and debugging of the core topics according to the diagnostic.

| Domain | Core concepts | Example check |
| --- | --- | --- |
| Browser and HTTP | HTML/CSS/JavaScript roles, request/response, methods, status codes, headers, JSON, DOM, browser state, network tools, same-origin and CORS, accessible form feedback | Trace a page load and identify which component produced an error response; distinguish a browser restriction from server authentication. |
| APIs | Input validation, contracts and compatibility, authentication, pagination, timeouts, retry safety | Explain what a client should do after a request times out without knowing whether an operation succeeded. |
| Authentication | Identity verification, password hashing versus encryption, sign-in, MFA and recovery; introductory roles of OAuth 2.0, OpenID Connect, and JWT | Trace a sign-in and explain which evidence establishes identity, how a password is checked, and which step still needs permission checks. |
| Sessions and cookies | Session identity and storage, cookie scope and flags, expiry, logout, difference from browser sessionStorage | Trace login and a subsequent authenticated request; investigate a login that fails only on one server. |
| Access and web security | Authentication versus authorisation, ownership checks, injection, XSS and CSRF concepts, secret handling | Explain how to prevent one authenticated user from reading another user's order. |
| Caching | Browser/CDN/application caches, keys, hits and misses, TTL, invalidation, personalised content | Explain why an updated price remains stale and what would make a shared cache expose another user's data. |
| Programming and code structure | Python functions and data structures, exceptions, modules, separation of concerns, interfaces, reading unfamiliar code, everyday complexity | Debug a small program, explain the cause, and identify which rule belongs in business logic rather than request handling. |
| Databases and concurrency | SQL joins and windows, grain, keys, constraints, transactions, isolation and races, indexes, query plans, migrations | Prevent a duplicate write or lost update; explain why an aggregation returns an incorrect total. |
| Git and dependencies | Diffs, branches, pull requests, conflict resolution, version pinning, lockfiles, isolated environments | Explain a small diff, resolve a focused conflict, and reproduce the chosen dependency versions. |
| Hardware and resource efficiency | CPU cores and caches, RAM and working sets, storage and network I/O, latency versus throughput, CPU time versus elapsed time, traced allocations versus process memory, paging/swap and out-of-memory failures; streaming, bounded batches, and worker limits | Compare eager and streamed Python processing on bounded synthetic data, verify the same output, measure at two input sizes, and justify one change from CPU/time/memory evidence. |
| Runtime and networking | Process, port, environment, DNS, TLS, web server, reverse proxy, PHP application runtime | Trace browser to Nginx to application to database; suggest an evidence-based first check for a gateway failure. |
| Deployment and scaling | Images versus containers, volumes and networks, configuration, multiple servers, shared state, load balancing | Run a small local setup and explain which state must survive a restart or be shared between replicas. |
| Reliability and delivery | Unit/integration tests, Git and CI, logs/metrics/traces, Sentry's role, rollback, backups and restore | Find a controlled failure from available evidence and explain how to detect recurrence. |
| Data systems | OLTP/analytics distinction, ingestion, modelling, dbt checks, orchestration, retries, backfills, idempotency | Rerun a partially completed job and show that the resulting data remains correct. |
| Background work and events | Synchronous versus asynchronous work, queues and workers, webhooks, acknowledgements, duplicate delivery, retries, idempotency; distinction from parallel execution | Trace an event delivered twice and explain how to avoid applying its business effect twice. |
| Performance and evolution | N+1 queries, pagination, CPU versus I/O work, measurement, compatibility, schema migration and rollback | Investigate a slow request from evidence and explain how a proposed change can be rolled out safely. |
| Product reasoning | User problem, constraints, smallest useful scope, acceptance criteria, success metrics and tradeoffs | Define what success means for a change and decide what evidence would show it helped the user. |
| Agent workflow | Relevant context and constraints, task decomposition, acceptance criteria, diff review, independent verification | Catch a plausible but incorrect generated change and demonstrate why a check accepts or rejects it. |

## Depth choices

Authentication, sessions, authorization, caching, APIs, Python, SQL, tests, and basic local deployment are priorities for hands-on exercises. Product reasoning and agent review run through those exercises as well as receiving focused practice.

Hardware awareness is an explicit early Python lesson, followed by application in data batching and container resource budgets. Start with one measured memory-scaling comparison; revisit CPU-bound versus I/O-bound work and concurrency tradeoffs across later exercises. Reading hardware specifications alone does not demonstrate efficient scripts.

For each access-controlled feature, trace every return path, including caches. Verification should include distinct users, a negative case, and relevant warm/cold, retry, empty-data, or expiry states. Select the cases that test the intended behaviour, rather than treating this as a fixed test-count requirement.

OAuth 2.0, OpenID Connect, and JWT initially need correct recognition and role distinctions. The first pass does not require implementing protocols or a complete identity provider. Likewise, background-work concepts do not require installing every example broker.

DNS/TLS, load balancing, web-server architecture, and Kubernetes's role initially need a clear explanation and a failure scenario, not specialist administration. Practise configuration where a focused exercise makes it useful.

## Progress evidence

For an assessed topic, retain the date, concrete answer or exercise, explanation/application/debugging evidence, substantive hints, and a later revisit. Confidence is useful context but is recorded separately from the evidence.

Personal answers stay local. Public exercise write-ups may link here and describe only what the exercise actually demonstrates.
