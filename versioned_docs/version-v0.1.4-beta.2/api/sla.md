---
title: SLA API
---

# SLA API

SLA endpoints report task deadlines, escalation events, and administrative metrics. Task responses include nullable `dueDate`, `slaStatus`, `slaTimeZone`, and `completedWithinSla`. Tasks with no deadline have no SLA status. Status values are `ON_TRACK`, `AT_RISK`, `OVERDUE`, and `COMPLETED`.

## Operations

| Method | Path | Summary |
| --- | --- | --- |
| `GET` | `/admin/sla/metrics` | getSlaMetrics |

## Summarize visible tasks

`POST /tasks/sla/summary` accepts the same [TaskSearchRequestDto](./schemas) filters as task search. Requires `ACCESS_BPM_ADMIN`, `ACCESS_PROCESS_PORTAL`, or `SCOPE_tasks:read`. Administrators see all matching tasks; other callers are limited to visible tasks.

```bash
curl -X POST "http://localhost:8080/tasks/sla/summary" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"filters":[]}'
```

Example `200 OK` response:

```json
{"onTrack":3,"atRisk":1,"overdue":2,"completed":4,"withoutSla":5,"asOf":"2026-10-16T12:00:00Z","timeZone":"UTC"}
```

Task search also accepts `dueDate` comparisons with offset-qualified timestamps and `slaStatus` filters. Use the configured SLA time zone when presenting deadlines.

## Read task SLA events

`GET /tasks/{id}/sla/events?page=0&size=20` requires task read access and checks task visibility. An unavailable or invisible task returns `404`. It returns a page of [SlaEventDto](./schemas), ordered by occurrence time descending, with event outcome, scheduled and actual times, deadline, and optional incident ID. Page size is capped at `100`.

```bash
curl "http://localhost:8080/tasks/123/sla/events?page=0&size=20" \
  -H "Authorization: Bearer $TOKEN"
```

## Administrative metrics

`GET /admin/sla/metrics` requires `ACCESS_BPM_ADMIN`. `groupBy` accepts `PROCESS` (default), `TASK`, `USER`, or `GROUP`. Optional `dueDateFrom` and `dueDateTo` must contain timestamp offsets and form an ordered range. Supports `page` and `size`, capped at `100`.

```bash
curl "http://localhost:8080/admin/sla/metrics?groupBy=PROCESS&page=0&size=20" \
  -H "Authorization: Bearer $TOKEN"
```

The response is a page of [SlaMetricRow](./schemas) records: status counts, completion rate within SLA, successful and failed escalations, and alert-to-completion sample count and average seconds. Rates and averages may be null when no samples exist.

Failed SLA actions can be retried through `POST /incidents/{id}/retry` by an administrator. Retry eligibility depends on the current task, process, and action state.
