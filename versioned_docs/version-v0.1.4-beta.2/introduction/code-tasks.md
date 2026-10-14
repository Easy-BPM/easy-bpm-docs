---
title: Code Tasks
---

# Code Tasks

A Code Task runs customer-provided Java or Kotlin logic packaged as a JVM JAR. It gives a process access to deterministic business logic that is easier to express and test in code than in a visual model.

Good Code Task use cases include:

- calculating a score, fee, date, or eligibility result
- validating a complex business rule
- normalizing or enriching structured data
- applying an existing internal rules library

The process maps variables into the selected method and maps the result back into process variables. Easy BPM records execution information so operators can trace success or failure.

## Code Task versus other components

| Requirement | Prefer |
| --- | --- |
| Deterministic in-process calculation | Code Task |
| HTTP call to another application | API Task |
| Human judgment or manual input | Human Task |
| Generative or probabilistic reasoning | AI Task or Agent Process |
| Simple variable assignment | Service Task |

## Design boundaries

Keep Code Tasks focused, deterministic, and side-effect free when possible. A method that produces the same result for the same inputs is easier to test, retry, and audit.

Avoid embedding credentials in a JAR. Avoid using a Code Task to hide an external integration: API Tasks make timeouts, retries, authentication, and operational failures more visible. Keep long-running work outside the synchronous calculation boundary.

Treat uploaded JARs as production software. Version them, test them independently, keep their dependencies controlled, and define clear input and output contracts. A Code Task failure can create an incident, so error messages should help an operator understand which business input or rule caused the problem.

For configuration, packaging, discovery, and audit examples, see [Code Tasks](../guides/code-tasks.md) and the [Modeler Code Task reference](../platform/modeler.md#code-task).
