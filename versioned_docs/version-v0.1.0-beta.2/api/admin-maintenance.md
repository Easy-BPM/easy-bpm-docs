---
title: Admin Maintenance API
---

# Admin Maintenance API

Use the Admin Maintenance API for customer retention operations. These endpoints perform hard deletes and require `ACCESS_BPM_ADMIN`.

Always run a dry run first.

## Operations

| Method | Path | Summary |
| --- | --- | --- |
| `GET` | `/admin/maintenance/retention` | Get saved data-retention settings. |
| `PUT` | `/admin/maintenance/retention` | Update data-retention settings used by scheduled cleanup. |
| `POST` | `/admin/maintenance/retention/preview` | Preview cleanup using the configured retention policy. |
| `POST` | `/admin/maintenance/retention/run` | Execute cleanup using the configured retention policy. |
| `POST` | `/admin/maintenance/purge-completed-instances` | Preview or execute purge of completed instances. |
| `POST` | `/admin/maintenance/purge-completed-tasks` | Preview or execute purge of completed tasks. |
| `DELETE` | `/admin/maintenance/process-definitions/{id}` | Preview or delete a process definition and related runtime data. |

## GET /admin/maintenance/retention

Returns the saved retention policy used by the Admin Console and the backend scheduler.

Example response:

```json
{
  "enabled": false,
  "completedProcessRetentionDays": 90,
  "completedTaskRetentionDays": 90,
  "batchSize": 500,
  "cron": "0 0 3 * * *"
}
```

## PUT /admin/maintenance/retention

Updates the saved retention policy. The backend validates retention days, batch size, and the Spring cron expression before saving.

Request:

```json
{
  "enabled": true,
  "completedProcessRetentionDays": 180,
  "completedTaskRetentionDays": 45,
  "batchSize": 500,
  "cron": "0 0 3 * * *"
}
```

Validation rules:

| Field | Rules |
| --- | --- |
| `completedProcessRetentionDays` | Required. Integer from `1` to `3650`. |
| `completedTaskRetentionDays` | Required. Integer from `1` to `3650`. |
| `batchSize` | Required. Integer from `1` to `10000`. |
| `cron` | Required. Valid Spring cron expression. |

If validation fails, the API returns `400 Bad Request`.

## POST /admin/maintenance/retention/preview

Builds a cleanup summary from the saved retention settings without deleting data. Preview combines:

- completed process instances older than the configured process retention window
- completed tasks older than the configured task retention window

Example preview:

```bash
curl -X POST "http://localhost:8080/admin/maintenance/retention/preview" \
  -H "Authorization: Bearer $TOKEN"
```

## POST /admin/maintenance/retention/run

Executes the saved retention policy immediately.

Example run:

```bash
curl -X POST "http://localhost:8080/admin/maintenance/retention/run" \
  -H "Authorization: Bearer $TOKEN"
```

If retention is disabled, the API returns `409 Conflict`.

## POST /admin/maintenance/purge-completed-instances

Deletes completed process instances older than a cutoff date. You can optionally filter by process definition id or process key.

This purge also removes the archived process-variable snapshots that are kept after a process instance completes or is cancelled.

Request:

```json
{
  "completedBefore": "2026-06-01T00:00:00",
  "processDefinitionId": 10,
  "processKey": null,
  "batchSize": 500,
  "dryRun": true
}
```

Fields:

| Field | Description |
| --- | --- |
| `completedBefore` | Required. Completed instances with `updatedAt` before this value are candidates. |
| `processDefinitionId` | Optional deployed process definition version id. |
| `processKey` | Optional process key filter. |
| `batchSize` | Optional max candidate count returned or deleted in one request. Valid range is `1` to `10000`; defaults to `500`. |
| `dryRun` | `true` previews the cleanup. `false` executes deletion. |

Example preview:

```bash
curl -X POST "http://localhost:8080/admin/maintenance/purge-completed-instances" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "completedBefore": "2026-06-01T00:00:00",
    "processDefinitionId": 10,
    "batchSize": 250,
    "dryRun": true
  }'
```

## POST /admin/maintenance/purge-completed-tasks

Deletes completed tasks older than a cutoff date. Use this when completed task records must be removed without deleting the parent process instance.

This purge also removes the archived task-variable snapshots that completed task responses use.

Request:

```json
{
  "completedBefore": "2026-06-01T00:00:00",
  "batchSize": 500,
  "dryRun": true
}
```

Fields:

| Field | Description |
| --- | --- |
| `completedBefore` | Required. Completed tasks with `completedAt` before this value are candidates. |
| `batchSize` | Optional max candidate count returned or deleted in one request. Valid range is `1` to `10000`; defaults to `500`. |
| `dryRun` | `true` previews the cleanup. `false` executes deletion. |

Example preview:

```bash
curl -X POST "http://localhost:8080/admin/maintenance/purge-completed-tasks" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "completedBefore": "2026-06-01T00:00:00",
    "batchSize": 250,
    "dryRun": true
  }'
```

## DELETE /admin/maintenance/process-definitions/\{id\}

Deletes a process definition and all related runtime data. Use `dryRun=true` to preview.

Preview:

```bash
curl -X DELETE "http://localhost:8080/admin/maintenance/process-definitions/10?dryRun=true" \
  -H "Authorization: Bearer $TOKEN"
```

Execute:

```bash
curl -X DELETE "http://localhost:8080/admin/maintenance/process-definitions/10?dryRun=false" \
  -H "Authorization: Bearer $TOKEN"
```

## Cleanup summary

Both maintenance operations return a cleanup summary.

```json
{
  "dryRun": true,
  "processDefinitionsDeleted": 0,
  "processInstancesDeleted": 12,
  "tasksDeleted": 31,
  "processVariablesDeleted": 48,
  "taskVariablesDeleted": 74,
  "documentsDeleted": 6,
  "messageSubscriptionsDeleted": 0,
  "workerRequestsDeleted": 5,
  "codeTaskExecutionsDeleted": 3,
  "incidentsDeleted": 2,
  "incidentEventsDeleted": 4,
  "timelineEventsDeleted": 102,
  "callActivityMappingsDeleted": 1,
  "candidateInstanceIds": [101, 102, 103],
  "candidateTaskIds": [9001, 9002]
}
```

## Data removed

Maintenance cleanup removes:

- process instances
- tasks
- task variables, including archived snapshots kept for completed tasks
- process variables, including archived snapshots kept for completed or cancelled instances
- documents
- message subscriptions
- worker requests
- code-task execution audits
- incidents
- incident events
- process timeline events
- call-activity mappings

When deleting a process definition, the selected definition record is also deleted.
