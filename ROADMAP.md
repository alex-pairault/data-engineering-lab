# Provisional roadmap

This plan will be adjusted after a broad 30-minute diagnostic. All topics are currently unassessed. The aim is shared engineering judgement across software, data, and product work, with selected practical depth.

From October 26 through December 15, 2026, there are 37 Monday-to-Friday sessions, or 18.5 hours at 30 minutes each, before holidays or missed days.

| Focus | Sessions | Planned demonstration |
| --- | ---: | --- |
| Broad diagnostic | 1 | Sample web, programming, data, deployment, and agent-review reasoning; identify follow-up probes |
| Web fundamentals | 9 | Trace HTTP/API requests; demonstrate sessions, cookies, permissions, caching, and invalidation |
| Programming and databases | 7 | Refresh Python; test and debug a small change; use SQL, constraints, transactions, and indexes |
| Infrastructure | 5 | Explain processes, ports, DNS, TLS, reverse proxies, and load balancing; run a small Docker setup |
| Reliability, security, and delivery | 5 | Use tests and CI; diagnose a failure with logs and error reporting; reason about access, deployment, and recovery |
| Data systems | 4 | Demonstrate data quality, a small dbt transformation, dependencies, retries, and safe reruns |
| Product decisions and agent workflow | 3 | Frame a user problem, specify acceptance criteria, supply relevant context, and review an agent change |
| Mixed interview practice and revisits | 3 | Explain unfamiliar scenarios and revisit earlier weak areas across domains |
| **Total** | **37** | **18.5 hours** |

## Breadth and depth

Use [SKILL-MAP.md](SKILL-MAP.md) to keep the important topics visible. An explanation should connect the purpose, mechanism, and one failure mode. Selected topics also require a small implementation or debugging task. These are first-pass targets, not a promise of expertise after 18.5 hours.

Start with web fundamentals after the diagnostic so sessions and caching are addressed early. Mix in short recall questions from other domains. Each week, use part of the existing review time to check coverage; do not let a job-specific tool consume the shared-foundation budget.

Keep Python active through small exercises throughout the course. A focused interview can expose missing evidence and reprioritise practice, but job advertisements alone do not define the curriculum.

## Project thread

Use a tiny order dashboard with synthetic data as the shared reference project. Introduce a browser request, a small API, login/session behaviour, a database-backed operation, a cache, and a background data task in separate exercises. Investigate controlled failures and explain the user impact. Start from prepared scaffolding where setup would otherwise consume the session.

Select the runtime and framework after the diagnostic. Python exercises provide the language refresh; safe, read-only walkthroughs of existing PHP work can connect concepts to current experience. Public examples must be original and must not copy employer code or data.

Introduce Docker, a small dbt example, and an Airflow example only when they support the concepts being practised. Explain Kubernetes's role and its relationship to containers at a high level; cluster administration remains a later specialisation.

## Initial diagnostic

The first session is a triage, not a complete competency assessment:

- 7 minutes: a browser request, login/session state, and caching.
- 7 minutes: a short Python debugging or SQL reasoning task, followed by a brief probe of the other language.
- 5 minutes: a failure involving a deployment, database, or background job.
- 6 minutes: turn a user need into acceptance criteria and review a small agent-produced change.
- 5 minutes: feedback and selection of follow-up exercises.

Keep answers and coaching notes local. An unasked question remains unassessed; do not infer competence across an entire domain from one answer.

## Evidence and progress

Distinguish the following states for each skill:

- **Unassessed:** no evidence collected.
- **Needs practice:** an attempt revealed a specific gap.
- **Demonstrated with help:** the task was completed with hints or substantive assistance.
- **Demonstrated independently:** the learner completed the task and explained the result.
- **Retained:** demonstrated again on a changed task in a later session.

Record the exercise, date, assistance used, and verification behind a state change. A completed lesson, passing test, or high confidence rating alone does not justify a mastery claim.

Personal diagnostic results stay local. Public progress is expressed through completed exercises and their evidence.

The future learning app should show this same skill map, with evidence and next-review dates for individual topics. Completing the data exercises must not imply that sessions, caching, or deployment have been demonstrated.
