# Engineering Foundations Lab

A hands-on learning portfolio for understanding reliable software and data systems and reviewing agent-assisted engineering work.

The emphasis is on tracing how a product works, explaining decisions, testing failure cases, and producing reproducible examples. Web fundamentals, programming, databases, infrastructure, reliability, data processing, and product judgement share one learning plan.

## Current status

The initial diagnostic is complete. **Fieldnotes**, the learning product, now includes five English visual lessons and interactive labs:

1. Trace a real request and distinguish its response from the page display.
2. Locate authentication and distinguish it from permission checks.
3. Inspect browser-held and server-held session state, expiry, and logout.
4. Reproduce and repair cross-user leakage in a cache model.
5. Reject an agent's incorrect change with behavioural regression checks.

[Open Fieldnotes](https://engineering-fieldnotes-alex.oakenwolf3.chatgpt.site) · [Start lesson one](https://engineering-fieldnotes-alex.oakenwolf3.chatgpt.site/lessons/0001-request-response.html) · [App design and verification](docs/APP.md)

The hosted workspace is private to its owner; this source repository is public. The course map contains **37 weekday sessions**, with five ready and 32 clearly marked planned. Later lessons will be authored as practice reveals what is needed. The [roadmap](ROADMAP.md) and [skill map](SKILL-MAP.md) preserve the broader software, data, and product scope.

Personal assessment answers remain local. The application, lesson content, and QA were prepared with an agent; they are not learner-authored demonstrations of understanding. No public learner portfolio exercise has been completed yet.

## Run the product locally

Requires Node.js 22+ and Python 3.10+. The app has no runtime package dependencies.

```sh
npm test
npm run build
python tests/build_smoke.py
npm run dev
```

Open <http://127.0.0.1:8766>. Serve over HTTP so lesson one's real fixture request can run. A shared [reference sheet](reference/0001-request-identity-state.html) provides printable terminology and investigation steps.

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

The working target is 30 minutes per weekday through mid-December 2026:

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
