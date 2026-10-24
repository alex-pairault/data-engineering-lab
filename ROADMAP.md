# Provisional roadmap

This plan will be adjusted after the initial 30-minute diagnostic. All topics are currently unassessed.

From October 26 through December 15, 2026, there are 37 Monday-to-Friday sessions, or 18.5 hours at 30 minutes each, before holidays or missed days.

| Focus | Sessions | Planned demonstration |
| --- | ---: | --- |
| Initial diagnostic | 1 | Establish strengths and gaps through explanations and practical tasks |
| SQL, modelling, and dbt | 8 | Explain table grain; write analytical queries; identify and test data quality assumptions |
| Python and APIs | 8 | Debug a small ingestion program and test its expected and failure behaviour |
| Orchestration and recovery | 7 | Demonstrate dependencies, retries, backfills, and reruns that preserve correct results |
| Docker, deployment, and observability | 6 | Reproduce the project locally and diagnose a controlled failure |
| Interview practice and revisits | 7 | Explain design choices, solve short tasks, and revisit earlier weak areas |
| **Total** | **37** | **18.5 hours** |

## Project thread

Use a small shared project as topics are introduced: ingest synthetic API records, store and model them, test the outputs, then add orchestration and reproducible execution. Keep each exercise small enough to complete within a study session; split setup across sessions when needed.

Airflow is the provisional orchestrator. Select versions and pin dependencies when implementation begins. Kubernetes administration and deep web-server configuration are deferred unless the assessment or target roles justify them.

## Evidence and progress

Distinguish the following states for each skill:

- **Unassessed:** no evidence collected.
- **Needs practice:** an attempt revealed a specific gap.
- **Demonstrated with help:** the task was completed with hints or substantive assistance.
- **Demonstrated independently:** the learner completed the task and explained the result.
- **Retained:** demonstrated again on a changed task in a later session.

Record the exercise, date, assistance used, and verification behind a state change. A completed lesson, passing test, or high confidence rating alone does not justify a mastery claim.

Personal diagnostic results stay local. Public progress is expressed through completed exercises and their evidence.
