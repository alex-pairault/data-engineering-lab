# Data Engineering Lab

A hands-on learning portfolio for building reliable data pipelines and reviewing agent-assisted engineering work.

The emphasis is on explaining decisions, testing failure cases, and producing reproducible examples in Python, SQL, dbt, orchestration, and Docker.

## Current status

Learning workspace initialized on October 24, 2026. The initial diagnostic is pending; no exercises have been completed or skills assessed yet. The [roadmap](ROADMAP.md) is provisional.

## What this repository will demonstrate

| Area | Planned evidence |
| --- | --- |
| SQL and modelling | Queries with expected results, explicit table grain, and explanations of joins and metrics |
| dbt | Documented models and checks that expose incorrect or missing data |
| Python and APIs | Small ingestion examples with validation, error handling, and meaningful tests |
| Orchestration | Dependencies, retries, safe reruns, and a small Airflow workflow |
| Deployment and observability | Reproducible local execution, Docker configuration, and useful failure diagnostics |
| Agent-assisted development | Clear acceptance criteria, reviewed changes, and evidence of independent verification |

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
- [Resources](RESOURCES.md): annotated primary sources.
- [Exercise template](templates/exercise.md): the format for portfolio evidence.

Personal coaching notes and assessment answers are stored separately under the ignored `.local/` directory.
