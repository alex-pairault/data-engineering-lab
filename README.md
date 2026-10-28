# Engineering Foundations Lab

A hands-on learning portfolio for understanding reliable software and data systems and reviewing agent-assisted engineering work.

The emphasis is on tracing how a product works, explaining decisions, testing failure cases, and producing reproducible examples. Web fundamentals, programming, databases, infrastructure, reliability, data processing, and product judgement share one learning plan.

## Current status

The initial diagnostic is complete. **Fieldnotes**, the learning product, now includes all 37 English visual lessons and interactive labs:

1. Trace a real request and distinguish its response from the page display.
2. Locate authentication and distinguish it from permission checks.
3. Inspect browser-held and server-held session state, expiry, and logout.
4. Reproduce and repair cross-user leakage in a cache model.
5. Reject an agent's incorrect change with behavioural regression checks.
6. Validate an API contract and catch a breaking response change.
7. Measure CPU time, elapsed time, and memory while comparing eager and streamed Python processing.
8. Preserve SQL outer-join groups and handle NULL aggregates.
9. Distinguish TTL lifetime from source freshness.
10. Reproduce an invalidation race and verify after-commit ordering.
11. Match a process to a listening endpoint and distinguish connection/HTTP failures.
12. Share business rules between HTTP and background-job entry points.
13. Resolve a real Git conflict by behaviour and explain dependency lockfiles.
14. Run a small Docker image and compare writable-layer and volume lifecycles.
15. Prevent SQL fanout totals and test keys, references, and constraints.
16. Understand the browser boundary.
17. Test behaviour at a boundary.
18. Two requests at once.
19. Retry without duplicating effects.
20. Follow a request into the server.
21. Define what better means.
22. Find the evidence of failure.
23. Follow the trust boundary.
24. Make a data assumption executable.
25. Handle the failure path.
26. Connect the local stack.
27. Give the agent the right context.
28. Let the checks travel with the change.
29. Dependencies, schedules, and events.
30. Measure before optimising.
31. Trace an unfamiliar failure.
32. One application, several instances.
33. A workflow fails halfway.
34. Make the way back explicit.
35. Review the actual change.
36. Explain a system out loud.
37. Show what you can verify.

[Open Fieldnotes](https://engineering-fieldnotes-alex.oakenwolf3.chatgpt.site) · [Start lesson one](https://engineering-fieldnotes-alex.oakenwolf3.chatgpt.site/lessons/0001-request-response.html) · [App design and verification](docs/APP.md)

The hosted workspace is private to its owner; this source repository is public. The course map contains **37 weekday sessions**, with all 37 authored and available for November 3–December 23, 2026. Practice and later review will guide adjustments to difficulty. The [roadmap](ROADMAP.md) and [skill map](SKILL-MAP.md) preserve the broader software, data, and product scope.

Personal assessment answers remain local. The application, lesson content, and QA were prepared with an agent; they are not learner-authored demonstrations of understanding. No public learner portfolio exercise has been completed yet.

## Run the product locally

Requires Node.js 22+ and Python 3.10+. The app has no runtime package dependencies.

```sh
npm test
python -m unittest discover -s tests -p "*_test.py"
npm run build
python tests/build_smoke.py
npm run dev
```

Open <http://127.0.0.1:8766>. Serve over HTTP so lesson one's real fixture request can run. The shared [reference sheets](reference/) provide compact terminology and investigation steps.

Progress, explanations, hints, and review dates save in this browser. Use **Backups → Export progress** before clearing browser data, switching devices, or moving between localhost and the hosted app. Restore explicitly merges the newest saved entry per lesson. There is no automatic cloud or GitHub progress synchronization. Use one active learning tab at a time. Personal notes and JSON backups should stay outside the public repository.

## What this repository will demonstrate

| Area | Planned evidence |
| --- | --- |
| Web fundamentals | Request traces, browser behaviour, API contracts, authentication, sessions, authorization, and caching |
| Programming and databases | Debugged Python, clear code boundaries, useful tests, SQL queries, modelling, transactions, concurrency, and query investigation |
| Infrastructure | Explanations of processes, ports, DNS, TLS, Nginx, containers, and load balancing; reproducible local execution |
| Reliability and security | Git and dependency management, meaningful checks, CI, error diagnosis, access checks, deployment and recovery reasoning |
| Data and asynchronous processing | Quality checks, dbt examples, background jobs, webhooks, retries, and safe reruns |
| Product and agent-assisted development | A user problem, acceptance criteria, relevant context, reviewed changes, and independent verification |

These are planned outcomes, not claims of completed work.

## How each exercise will be recorded

Each exercise will include:

1. The problem and expected behaviour.
2. Runnable code or SQL with synthetic or explicitly reusable public data.
3. Commands to reproduce the result, including relevant failure cases.
4. A short explanation in my own words, including a mistake or tradeoff.
5. A note describing agent assistance and what I verified myself.

Use the [exercise template](templates/exercise.md) for these write-ups. Completed exercises will be linked here as they are added.

## Learning routine

Lessons and feedback are in English. Use a diagram, timeline, or small interactive experiment when it helps explain the mechanism, accompanied by concise text. See the [lesson format](LESSON-FORMAT.md) for the authoring requirements.

The working target is 30 minutes per weekday, starting November 3 and finishing December 23, 2026, for all 37 sessions:

- 5 minutes recalling earlier material.
- 5 minutes studying one focused concept.
- 15 minutes applying or debugging it.
- 5 minutes explaining the result and recording feedback.

Progress will be supported by working examples and later revisits. Reading a lesson or accepting generated code does not establish mastery.

## Agent assistance

Agents may help prepare exercises, explain concepts, suggest implementations, and review changes. Their contributions will be described honestly. Personal explanations and demonstrations of understanding must come from the learner; generated summaries are not evidence that learning occurred.

## Workspace guide

- [Mission](MISSION.md): the purpose and observable outcomes.
- [Roadmap](ROADMAP.md): the provisional allocation of study sessions.
- [Skill map](SKILL-MAP.md): the core topics and the questions used to check understanding.
- [Lesson format](LESSON-FORMAT.md): English, graphics, practice, and accessible presentation requirements.
- [Resources](RESOURCES.md): annotated primary sources.
- [Exercise template](templates/exercise.md): the format for portfolio evidence.

Personal coaching notes and assessment answers are stored separately under the ignored `.local/` directory.


The browser experiments are explicitly labelled models. Downloadable standard-library exercises cover real Python/SQLite/Git mechanisms; separate prepared bundles cover dbt/DuckDB, Airflow, and a Docker/Nginx stack. Tool installation and image downloading are prerequisites, outside the 30-minute session. These examples use synthetic data and do not require an employer account. A lesson visit or guided quiz pass is not a claim of production experience.
