---
title: Process Design
---

# Process Design

Good process design communicates business intent and remains safe to operate.

## Design principles

- Name the process after the outcome it produces.
- Use action-oriented task names and stable element IDs.
- Keep the happy path clear, then model rejection, timeout, cancellation, and failure paths.
- Use Human Tasks for judgment and automated tasks for reliable system work.
- Keep variables small, typed, business-oriented, and free of credentials.
- Use stable correlation and idempotency keys for messages and external operations.
- Add timeouts or escalation where waiting forever is unacceptable.
- Use subprocesses for reusable capabilities with meaningful ownership.
- Make conditions short and gateway outcomes complete.
- Design external operations so they are safe to retry.

## Validate real scenarios

Test approval, rejection, timeout, duplicate message, unavailable service, missing variable, invalid form data, unauthorized access, and retry behavior. Confirm that task assignments expose work only to intended users and groups.

After deployment, review instance timelines and incidents. Repeated manual recovery is feedback that the model, integration, or data contract should be improved.

Continue with [Create a Process](../guides/create-process.md) or the [Modeler](../platform/modeler.md) reference.
