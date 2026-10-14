---
title: Tasks API
---

# Tasks API

Use the Tasks API to list visible work, claim shared tasks, inspect task context, and complete user tasks.

## Operations

| Method | Path | Summary |
| --- | --- | --- |
| `GET` | `/tasks` | Get all tasks |
| `GET` | `/tasks/{id}` | Get task by ID |
| `PUT` | `/tasks/{id}/assignee` | Reassign a task |
| `POST` | `/tasks/{id}/claim` | Claim a task |
| `POST` | `/tasks/{id}/complete` | Complete a task |
| `POST` | `/tasks/{id}/draft` | Save a task draft |
| `POST` | `/tasks/{id}/unclaim` | Unclaim a task |
| `GET` | `/tasks/search` | Search tasks |
| `POST` | `/tasks/search` | Search tasks with structured filters |

## GET /tasks

**Get all tasks**

Retrieve all tasks with pagination

Completed task rows continue to return their last saved task variable snapshot until maintenance cleanup removes the task record.

| Property | Value |
| --- | --- |
| Operation ID | `getTasks` |
| Auth | Bearer token required unless security is disabled. |
| Response DTO | [PageTaskResponseDto](./schemas) |

Completed task entries keep their submitted `variables` in the response so historical task reviews can show the final task payload.

### Parameters

| Name | In | Required | Type | Description |
| --- | --- | --- | --- | --- |
| `pageable` | query | Yes | Pageable |  |

### Example request

```bash
curl -X GET "http://localhost:8080/tasks?page=0&size=20" \
  -H "Authorization: Bearer $TOKEN"
```

### Responses

| Status | Description | Schema |
| --- | --- | --- |
| `200` | OK | [PageTaskResponseDto](./schemas) |

### Example response

Status: `200 OK`

```json
{
  "content": [
    {
      "id": 123,
      "title": "Manager Review",
      "name": "Manager Review",
      "description": "Review the expense request.",
      "processInstanceId": 456,
      "nodeId": "manager-review",
      "assignee": "manager",
      "candidateUsers": [],
      "candidateGroups": [
        "FINANCE"
      ],
      "status": "PENDING",
      "createdAt": "2026-06-17T09:30:00",
      "completedAt": null,
      "formDbId": 12,
      "formId": "expenseReview",
      "variables": {
        "amount": 1250.75,
        "requester": "Alice"
      }
    }
  ],
  "totalElements": 1,
  "totalPages": 1,
  "first": true,
  "last": true,
  "size": 20,
  "number": 0,
  "numberOfElements": 1,
  "empty": false,
  "sort": {
    "empty": true,
    "sorted": false,
    "unsorted": true
  },
  "pageable": {
    "offset": 0,
    "pageNumber": 0,
    "pageSize": 20,
    "paged": true,
    "unpaged": false,
    "sort": {
      "empty": true,
      "sorted": false,
      "unsorted": true
    }
  }
}
```

<a id="get-tasks-id"></a>
## GET /tasks/\{id\}

**Get task by ID**

Retrieve a specific task by its ID

If the task is already `COMPLETED`, the response still includes the last saved task variables until the task is purged by retention cleanup or an explicit maintenance purge.

| Property | Value |
| --- | --- |
| Operation ID | `getTaskById` |
| Auth | Bearer token required unless security is disabled. |
| Response DTO | [TaskResponseDto](./schemas) |

Completed task responses continue to include the task's submitted variables after the task finishes. Use this endpoint when operators or client apps need to review the final task payload.

### Parameters

| Name | In | Required | Type | Description |
| --- | --- | --- | --- | --- |
| `id` | path | Yes | integer(int64) |  |

### Example request

```bash
curl -X GET "http://localhost:8080/tasks/123" \
  -H "Authorization: Bearer $TOKEN"
```

### Responses

| Status | Description | Schema |
| --- | --- | --- |
| `200` | OK | [TaskResponseDto](./schemas) |

### Example response

Status: `200 OK`

```json
{
  "id": 123,
  "title": "Manager Review",
  "name": "Manager Review",
  "description": "Review the expense request.",
  "processInstanceId": 456,
  "nodeId": "manager-review",
  "assignee": "manager",
  "candidateUsers": [],
  "candidateGroups": [
    "FINANCE"
  ],
  "status": "PENDING",
  "createdAt": "2026-06-17T09:30:00",
  "completedAt": null,
  "formDbId": 12,
  "formId": "expenseReview",
  "variables": {
    "amount": 1250.75,
    "requester": "Alice"
  }
}
```

<a id="post-tasks-id-claim"></a>
## POST /tasks/\{id\}/claim

**Claim a task**

Claim a shared/group task for the current authenticated user

| Property | Value |
| --- | --- |
| Operation ID | `claimTask` |
| Auth | Bearer token required unless security is disabled. |
| Response DTO | [TaskResponseDto](./schemas) |

### Parameters

| Name | In | Required | Type | Description |
| --- | --- | --- | --- | --- |
| `id` | path | Yes | integer(int64) |  |

### Example request

```bash
curl -X POST "http://localhost:8080/tasks/123/claim" \
  -H "Authorization: Bearer $TOKEN"
```

### Responses

| Status | Description | Schema |
| --- | --- | --- |
| `200` | OK | [TaskResponseDto](./schemas) |

### Example response

Status: `200 OK`

```json
{
  "id": 123,
  "title": "Manager Review",
  "name": "Manager Review",
  "description": "Review the expense request.",
  "processInstanceId": 456,
  "nodeId": "manager-review",
  "assignee": "admin",
  "candidateUsers": [],
  "candidateGroups": [
    "FINANCE"
  ],
  "status": "PENDING",
  "createdAt": "2026-06-17T09:30:00",
  "completedAt": null,
  "formDbId": 12,
  "formId": "expenseReview",
  "variables": {
    "amount": 1250.75,
    "requester": "Alice"
  }
}
```

<a id="post-tasks-id-complete"></a>
## POST /tasks/\{id\}/complete

**Complete a task**

Mark a task as completed and provide task variables

| Property | Value |
| --- | --- |
| Operation ID | `completeTask` |
| Auth | Bearer token required unless security is disabled. |
| Request DTO | `Task completion payload` |
| Request content type | `application/json` |
| Response DTO | `string` |

### Parameters

| Name | In | Required | Type | Description |
| --- | --- | --- | --- | --- |
| `id` | path | Yes | integer(int64) |  |

### Request body

| Required | Content type | DTO/schema |
| --- | --- | --- |
| Yes | `application/json` | `Task completion payload` |

Example request body:

```json
{
  "variables": {
    "approved": true,
    "comment": "Approved for payment",
    "reviewedAt": "2026-06-17T10:00:00Z"
  }
}
```

### Example request

```bash
curl -X POST "http://localhost:8080/tasks/123/complete" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
  "variables": {
    "approved": true,
    "comment": "Approved for payment",
    "reviewedAt": "2026-06-17T10:00:00Z"
  }
}'
```

### Responses

| Status | Description | Schema |
| --- | --- | --- |
| `200` | OK | `string` |

### Example response

Status: `200 OK`

```text
Task completed successfully
```

<a id="post-tasks-id-unclaim"></a>
## POST /tasks/\{id\}/unclaim

Removes the current assignee and returns the task to the available pool.

```bash
curl -X POST "http://localhost:8080/tasks/123/unclaim" \
  -H "Authorization: Bearer $TOKEN"
```

The response is the updated [TaskResponseDto](./schemas).

<a id="post-tasks-id-draft"></a>
## POST /tasks/\{id\}/draft

Persists task variables without completing the task. Use this when a user saves progress in the Task Portal and needs to continue later.

```bash
curl -X POST "http://localhost:8080/tasks/123/draft" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "variables": {
      "amount": 1250.75,
      "comment": "Waiting for receipt",
      "approved": false
    }
  }'
```

The response is the updated [TaskResponseDto](./schemas).

<a id="put-tasks-id-assignee"></a>
## PUT /tasks/\{id\}/assignee

Reassigns an existing task. This is an administrative operation for changing the assignee explicitly.

```bash
curl -X PUT "http://localhost:8080/tasks/123/assignee" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "assignee": "manager"
  }'
```

The response is the updated [TaskResponseDto](./schemas).

<a id="get-tasks-search"></a>
## GET /tasks/search

Searches tasks with query parameters. Use this for simple filters from browser clients or quick operational checks.

```bash
curl -X GET "http://localhost:8080/tasks/search?status=PENDING&assignee=manager&page=0&size=20" \
  -H "Authorization: Bearer $TOKEN"
```

The response is a paged [PageTaskResponseDto](./schemas).

<a id="post-tasks-search"></a>
## POST /tasks/search

**Search tasks**

Search tasks with structured filters and pagination.

Filters are combined with `AND`. The endpoint respects the caller's visibility rules, so non-admin users only see tasks assigned to them or available to their groups.

Supported filter fields:

| Field | Notes |
| --- | --- |
| `status` / `state` | Task status such as `PENDING` or `COMPLETED`. |
| `assignee` | Task assignee. Use `UNASSIGNED` to match empty assignees. |
| `candidateUser` / `candidate_user` | Candidate user membership. |
| `candidateGroup` / `candidate_group` | Candidate group membership. |
| `processInstance` / `processInstanceId` / `process_instance_id` | Process instance id. |
| `processDefinition` / `processDefinitionId` / `process_definition_id` / `processDefinitionKey` / `process_definition_key` | Process definition id, key, or name. |
| `taskName` / `task_name` / `title` / `name` | Task title. |
| `createdAt` / `created_at` / `createdDate` / `created_date` | Task creation timestamp or date. |
| `variable` | Task or process variable, addressed by `name` and `scope`. |

Supported operators:

| Operator | Notes |
| --- | --- |
| `EQUALS`, `NOT_EQUALS` | Exact match. |
| `IN`, `NOT_IN` | Match against multiple values. |
| `GREATER_THAN`, `GREATER_THAN_OR_EQUAL`, `LESS_THAN`, `LESS_THAN_OR_EQUAL` | Numeric or date comparisons. |
| `CONTAINS`, `STARTS_WITH`, `ENDS_WITH` | Case-insensitive string matching. |

Completed task responses continue to include the last saved task variable snapshot until maintenance cleanup removes the task record.

| Property | Value |
| --- | --- |
| Operation ID | `searchTasks` |
| Auth | Bearer token required unless security is disabled. |
| Response DTO | [PageTaskResponseDto](./schemas) |

### Request body

| Required | Content type | DTO/schema |
| --- | --- | --- |
| Yes | `application/json` | [TaskSearchRequestDto](./schemas) |

Example request body:

```json
{
  "filters": [
    {
      "field": "status",
      "operator": "EQUALS",
      "value": "PENDING"
    },
    {
      "field": "taskName",
      "operator": "CONTAINS",
      "value": "review"
    }
  ]
}
```

### Parameters

| Name | In | Required | Type | Description |
| --- | --- | --- | --- | --- |
| `pageable` | query | Yes | Pageable |  |

### Example request

```bash
curl -X POST "http://localhost:8080/tasks/search?page=0&size=20" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "filters": [
      { "field": "status", "operator": "EQUALS", "value": "PENDING" },
      { "field": "assignee", "operator": "EQUALS", "value": "manager" }
    ]
  }'
```

### Responses

| Status | Description | Schema |
| --- | --- | --- |
| `200` | OK | [PageTaskResponseDto](./schemas) |

### Example response

Status: `200 OK`

```json
{
  "content": [
    {
      "id": 123,
      "title": "Manager Review",
      "name": "Manager Review",
      "description": "Review the expense request.",
      "processInstanceId": 456,
      "nodeId": "manager-review",
      "assignee": "manager",
      "candidateUsers": [],
      "candidateGroups": [
        "FINANCE"
      ],
      "status": "PENDING",
      "createdAt": "2026-06-17T09:30:00",
      "completedAt": null,
      "formDbId": 12,
      "formId": "expenseReview",
      "variables": {
        "amount": 1250.75,
        "requester": "Alice"
      }
    }
  ],
  "totalElements": 1,
  "totalPages": 1,
  "first": true,
  "last": true,
  "size": 20,
  "number": 0,
  "numberOfElements": 1,
  "empty": false,
  "sort": {
    "empty": true,
    "sorted": false,
    "unsorted": true
  },
  "pageable": {
    "offset": 0,
    "pageNumber": 0,
    "pageSize": 20,
    "paged": true,
    "unpaged": false,
    "sort": {
      "empty": true,
      "sorted": false,
      "unsorted": true
    }
  }
}
```
