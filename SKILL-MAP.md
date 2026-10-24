# Shared engineering skill map

All topics are currently **unassessed**. The initial programme provides a first pass through these topics; record remaining gaps honestly and adjust the depth to the evidence collected.

## What counts as understanding

- **Explain:** describe the purpose, trace the mechanism, and give one relevant failure or tradeoff in your own words.
- **Apply:** complete a small task and verify the observed result. Record any substantive help.
- **Debug:** investigate a changed or broken example, justify the cause, and verify a correction.

These are different kinds of evidence, not interchangeable completion badges. Aim for explanations across the map, then prioritise application and debugging of the core topics according to the diagnostic.

| Domain | Core concepts | Example check |
| --- | --- | --- |
| Browser and HTTP | Request/response, methods, status codes, headers, JSON, browser rendering and network tools | Trace a page load and identify which component produced an error response. |
| APIs | Input validation, contracts, authentication, pagination, timeouts, retry safety | Explain what a client should do after a request times out without knowing whether an operation succeeded. |
| Sessions and cookies | Session identity and storage, cookie scope and flags, expiry, logout, difference from browser sessionStorage | Trace login and a subsequent authenticated request; investigate a login that fails only on one server. |
| Access and web security | Authentication versus authorisation, ownership checks, injection, XSS and CSRF concepts, secret handling | Explain how to prevent one authenticated user from reading another user's order. |
| Caching | Browser/CDN/application caches, keys, hits and misses, TTL, invalidation, personalised content | Explain why an updated price remains stale and what would make a shared cache expose another user's data. |
| Programming | Python functions and data structures, exceptions, modules, dependencies, reading unfamiliar code | Debug a small program and explain the cause rather than only replacing the failing line. |
| Databases | SQL joins and windows, grain, keys, constraints, transactions, indexes, query plans, migrations | Prevent a duplicate write or explain why an aggregation returns an incorrect total. |
| Runtime and networking | Process, port, environment, DNS, TLS, web server, reverse proxy, PHP application runtime | Trace browser to Nginx to application to database; suggest an evidence-based first check for a gateway failure. |
| Deployment and scaling | Images versus containers, volumes and networks, configuration, multiple servers, shared state, load balancing | Run a small local setup and explain which state must survive a restart or be shared between replicas. |
| Reliability and delivery | Unit/integration tests, Git and CI, logs/metrics/traces, Sentry's role, rollback, backups and restore | Find a controlled failure from available evidence and explain how to detect recurrence. |
| Data systems | OLTP/analytics distinction, ingestion, modelling, dbt checks, orchestration, retries, backfills, idempotency | Rerun a partially completed job and show that the resulting data remains correct. |
| Product reasoning | User problem, constraints, smallest useful scope, acceptance criteria, success metrics and tradeoffs | Define what success means for a change and decide what evidence would show it helped the user. |
| Agent workflow | Relevant context and constraints, task decomposition, acceptance criteria, diff review, independent verification | Catch a plausible but incorrect generated change and demonstrate why a check accepts or rejects it. |

## Depth choices

Sessions, caching, APIs, Python, SQL, tests, and basic local deployment are priorities for hands-on exercises. Product reasoning and agent review run through those exercises as well as receiving focused practice.

DNS/TLS, load balancing, web-server architecture, and Kubernetes's role initially need a clear explanation and a failure scenario, not specialist administration. Practise configuration where a focused exercise makes it useful.

## Progress evidence

For an assessed topic, retain the date, concrete answer or exercise, explanation/application/debugging evidence, substantive hints, and a later revisit. Confidence is useful context but is recorded separately from the evidence.

Personal answers stay local. Public exercise write-ups may link here and describe only what the exercise actually demonstrates.
