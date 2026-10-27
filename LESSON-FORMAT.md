# Lesson format and visual requirements

## Language and scope

Write all lesson explanations, diagram labels, instructions, quiz questions, feedback, and reference summaries in English. Define new terms briefly and consistently. Use one concrete objective per lesson, tied to the mission and suitable for a 30-minute session.

## Session shape

| Time | Activity | Expected learner action |
| --- | --- | --- |
| 0–5 minutes | Recall an earlier concept | Explain or predict from memory before seeing feedback. |
| 5–10 minutes | One visual explanation with concise text | Trace the mechanism and identify the component or state that matters. |
| 10–25 minutes | A focused experiment, implementation, or debugging task | Predict, run the example, inspect the evidence, and explain any difference. |
| 25–30 minutes | Feedback and a short explanation | State what changed, why it works, what help was used, and what to revisit. |

This is a default pacing guide. Adapt to the learner's answer instead of forcing an unfinished exercise through a timer.

## Select graphics for the mechanism

Prefer a useful graphic when it clarifies relationships, sequence, state, timing, or a comparison. Keep the accompanying text short. A simple lookup or tiny syntax correction may only need an annotated code snippet.

| Concept | Useful graphic |
| --- | --- |
| HTTP, authentication, sessions | A sequence diagram with browser, application, and relevant stores; labelled requests and state changes. |
| Caching | A hit/miss flow and an expiry/invalidation timeline; vary one value or expiry time when an interaction helps. |
| Hardware and script efficiency | A storage/network ↔ RAM ↔ CPU diagram, paired with a before/after table of elapsed time, CPU time, and memory measurements at two bounded input sizes. Label traced allocations separately from process RAM. |
| Runtime, deployment, load balancing | A small architecture diagram showing processes, network boundaries, storage, and which state is shared. |
| Transactions and race conditions | Two operations on a shared timeline, with a before/after state table. |
| Queues, webhooks, retries | An event flow with producer, worker, acknowledgement, and a duplicate or failure path. |
| SQL and modelling | Tiny example tables, relationship arrows, and expected output rows. |
| Testing and agent review | An annotated diff, a behaviour table, or a failing/passing example linked to an acceptance criterion. |

Use one main diagram per tightly scoped explanation, with additional steps or states only when they clarify the task. Show a normal path before adding a failure. Label arrows and indicate where data or identity state lives. State when a graphic simplifies a real system.

## Make the visual part of the exercise

Ask the learner to trace a path, predict the next state, identify what changes, or locate a failure using the visual. If interaction materially helps, provide a small local control such as advancing a request, expiring a cache entry, or introducing a duplicate event. Explain the observed outcome immediately after an attempt.

During diagnostics, show only the facts supplied by the scenario. Do not reveal the mechanism or answer through labels, animation, hints, or an explanatory diagram before the learner attempts the question.

## Delivery and accessibility

- Author lessons as HTML under `lessons/` using the teach skill. Inspect existing `assets/` first and reuse shared components; create the shared stylesheet when the first HTML lesson is authored.
- Prefer inspectable diagrams made with SVG, HTML/CSS, or a suitable diagram renderer. Keep lesson assets in the repository and provide a static fallback for interactive examples when practical.
- Include a concise caption or text alternative. Explain meaning with labels as well as colour. Keep text legible, contrast sufficient, and layouts usable on a narrow screen and in print.
- Make controls keyboard accessible, visibly labelled, and usable without hover. Respect reduced-motion preferences; let the learner control sequences.
- Link one relevant primary source and any necessary supporting references. Link reusable reference sheets and related lessons when available.
- Include an invitation to ask the teaching agent follow-up questions.

## Before delivering a lesson

Render and inspect the actual lesson. Check that labels and arrows are readable, no content overlaps or clips, and the narrow and print layouts remain understandable. Exercise each interactive state and its keyboard controls. Verify the code or SQL task and distinguish actual results from expected results in the write-up.

Record learning only after the learner demonstrates it. A displayed diagram, finished animation, or generated explanation is not evidence of understanding.
