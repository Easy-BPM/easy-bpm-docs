---
title: Automated Tasks
---

# Automated Tasks

Automated tasks perform work without waiting for a person. Easy BPM supports different task types so the process model can show what kind of automation is happening.

| Task type | Use |
| --- | --- |
| API Task | Call an external HTTP service through the asynchronous worker |
| Service Task | Apply internal mappings or service-style work |
| Code Task | Run deterministic Java or Kotlin business logic |
| AI Task | Send a prompt to a configured AI provider |
| Agent Process | Invoke a deployed agent workflow and map its result |

Choose the type that makes runtime behavior visible. An external HTTP call belongs in an API Task, not hidden inside custom code. A calculation belongs in a Code Task rather than an AI Task. Human judgment belongs in a Human Task.

Automated work should define clear inputs and outputs, protect credentials, handle timeouts, and be safe to retry. Failures may follow an attached error boundary or create an incident for operators.

See [API Tasks](../guides/api-tasks.md), [Code Tasks](../guides/code-tasks.md), and the [Modeler task components](../platform/modeler.md#task-components).
