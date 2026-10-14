---
title: Release Notes
---

# Release Notes

This page tracks customer-facing Easy BPM releases reflected in this docs site.

## August 13, 2026: v0.1.0-beta.2

This release line adds and documents:

- BPMN 2.0 XML import/export in the Modeler
- BPMN XML deployment to `POST /processes`
- retirement of legacy JSON process-definition import for new deployments
- Task Portal structured task filters backed by `POST /tasks/search`
- Azure OpenAI provider support for AI tasks and Agent Process execution
- explicit `credentialRef` handling for AI providers
- improved message and timer event rendering in the Admin workflow canvas

Docs updated for this release:

- [Modeler](../platform/modeler)
- [Processes API](../api/processes)
- [Create a Process](../guides/create-process)
- [Task Portal](../platform/task-portal)
- [Tasks API](../api/tasks)
- [Message Events](../guides/message-events)
- [Environment Variables](./environment-variables)

## August 7, 2026: v0.1.1-beta.1

This release line adds and documents:

- configurable retention cleanup in Admin Maintenance
- retention settings endpoints and scheduled cleanup controls
- completed-process and completed-task retention policy settings
- date-field validation and date/time improvements in forms

Docs updated for this release:

- [Admin Maintenance API](../api/admin-maintenance)
- [Admin Console](../platform/admin)
- [Operations](../platform/operations)
- [Environment Variables](./environment-variables)

## Versioning note

The docs site currently contains the frozen `v0.1.0-beta.1` snapshot plus the current docs set, which now tracks the newer release changes above.
