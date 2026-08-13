---
title: Schemas
---

# Schemas

These schemas come from the backend OpenAPI components and the Kotlin DTOs that back the public API examples.

## AICredentialCreateRequestDto

| Property | Type | Required | Description |
| --- | --- | --- | --- |
| `providerId` | string | No |  |
| `credentialType` | string | No |  |
| `token` | string | No |  |

Example:

```json
{
  "providerId": "openai",
  "credentialType": "API_KEY",
  "token": "sk-live-redacted-example"
}
```

## AICredentialResponseDto

| Property | Type | Required | Description |
| --- | --- | --- | --- |
| `id` | string | No |  |
| `providerId` | string | No |  |
| `credentialType` | string | No |  |
| `maskedToken` | string | No |  |
| `createdAt` | string | No |  |
| `updatedAt` | string | No |  |
| `lastUsedAt` | string | No |  |
| `permissions` | string[] | No |  |

Example:

```json
{
  "id": "3f3c7af7-34ae-4dd4-96e4-cbcba52c6b8f",
  "providerId": "openai",
  "credentialType": "API_KEY",
  "maskedToken": "sk-***...mple",
  "createdAt": "2026-06-17T10:00:00",
  "updatedAt": "2026-06-17T10:00:00",
  "lastUsedAt": null,
  "permissions": []
}
```

## AssignProcessVariablesRequest

| Property | Type | Required | Description |
| --- | --- | --- | --- |
| `variables` | object | No | Map of variable names to values. Supports primitive and nested JSON values. |

Example:

```json
{
  "variables": {
    "approved": true,
    "amount": 1250.75,
    "currency": "USD",
    "requester": {
      "id": 42,
      "name": "Alice"
    }
  }
}
```

## CallActivityMappingResponse

| Property | Type | Required | Description |
| --- | --- | --- | --- |
| `id` | integer(int64) | No |  |
| `parentInstanceId` | integer(int64) | No |  |
| `childInstanceId` | integer(int64) | No |  |
| `callActivityNodeId` | string | No |  |
| `inputMappings` | object | No |  |
| `outputMappings` | object | No |  |
| `propagateAllVariables` | boolean | No |  |

Example:

```json
{
  "id": 9,
  "parentInstanceId": 100,
  "childInstanceId": 101,
  "callActivityNodeId": "run-kyc",
  "inputMappings": {
    "customerId": "customerId"
  },
  "outputMappings": {
    "kycStatus": "kycStatus"
  },
  "propagateAllVariables": false
}
```

## ClassMetadataResponse

| Property | Type | Required | Description |
| --- | --- | --- | --- |
| `className` | string | No |  |
| `methods` | MethodMetadataResponse[] | No |  |

Example:

```json
{
  "className": "com.example.Rules",
  "methods": [
    {
      "methodName": "calculateRisk",
      "returnType": "java.lang.Integer",
      "signature": "calculateRisk(java.math.BigDecimal, java.lang.String)",
      "parameters": [
        "java.math.BigDecimal",
        "java.lang.String"
      ],
      "parameterNames": [
        "param0",
        "param1"
      ],
      "static": false
    }
  ]
}
```

## CodeTaskExecutionAuditResponse

| Property | Type | Required | Description |
| --- | --- | --- | --- |
| `executionId` | integer(int64) | No |  |
| `instanceId` | integer(int64) | No |  |
| `nodeId` | string | No |  |
| `jarId` | integer(int64) | No |  |
| `className` | string | No |  |
| `methodName` | string | No |  |
| `inputVariables` | string | No |  |
| `outputVariables` | string | No |  |
| `executionTimeMs` | integer(int32) | No |  |
| `status` | string | No |  |
| `errorMessage` | string | No |  |
| `executedAt` | string | No |  |

Example:

```json
{
  "executionId": 55,
  "instanceId": 456,
  "nodeId": "calculate-risk",
  "jarId": 1,
  "className": "com.example.Rules",
  "methodName": "calculateRisk",
  "inputVariables": "{\"amount\":1250.75,\"customerTier\":\"GOLD\"}",
  "outputVariables": "{\"riskScore\":12}",
  "executionTimeMs": 38,
  "status": "COMPLETED",
  "errorMessage": null,
  "executedAt": "2026-06-17T10:00:00"
}
```

## CodeTaskJarUploadResponse

| Property | Type | Required | Description |
| --- | --- | --- | --- |
| `jarId` | integer(int64) | No |  |
| `fileName` | string | No |  |
| `fileHash` | string | No |  |
| `uploadedAt` | string | No |  |
| `classCount` | integer(int32) | No |  |
| `methodCount` | integer(int32) | No |  |
| `classes` | string[] | No |  |

Example:

```json
{
  "jarId": 1,
  "fileName": "customer-rules.jar",
  "fileHash": "b6f2f2d0f1a5c3e4d7a8b9c0e1f23456789abcdef0123456789abcdef012345",
  "uploadedAt": "2026-06-17T10:00:00",
  "classCount": 1,
  "methodCount": 2,
  "classes": [
    "com.example.Rules"
  ]
}
```

## CreateGroupRequest

| Property | Type | Required | Description |
| --- | --- | --- | --- |
| `code` | string | No |  |
| `name` | string | No |  |
| `permissionCodes` | string[] | No |  |

Example:

```json
{
  "code": "PROCESS_OPERATORS",
  "name": "Process Operators",
  "permissionCodes": [
    "ACCESS_BPM_ADMIN",
    "ACCESS_PROCESS_PORTAL"
  ]
}
```

## CreateUserRequest

| Property | Type | Required | Description |
| --- | --- | --- | --- |
| `username` | string | No |  |
| `password` | string | No |  |
| `enabled` | boolean | No |  |
| `groupIds` | integer[] | No |  |
| `permissionCodes` | string[] | No |  |

Example:

```json
{
  "username": "modeler.user",
  "password": "change-me-now",
  "enabled": true,
  "groupIds": [
    2
  ],
  "permissionCodes": [
    "ACCESS_BPM_MODELER"
  ]
}
```

## CurrentUserResponse

| Property | Type | Required | Description |
| --- | --- | --- | --- |
| `username` | string | No |  |
| `groups` | string[] | No |  |
| `permissions` | string[] | No |  |

Example:

```json
{
  "username": "admin",
  "groups": [
    "ADMIN"
  ],
  "permissions": [
    "ACCESS_BPM_ADMIN",
    "ACCESS_BPM_MODELER",
    "ACCESS_PROCESS_PORTAL"
  ]
}
```

## DataRetentionSettingsResponse

| Property | Type | Required | Description |
| --- | --- | --- | --- |
| `enabled` | boolean | No | Whether scheduled retention is enabled. |
| `completedProcessRetentionDays` | integer(int64) | No | Number of days completed process instances are retained. |
| `completedTaskRetentionDays` | integer(int64) | No | Number of days completed tasks are retained. |
| `batchSize` | integer(int32) | No | Maximum number of candidates processed in one cleanup run. |
| `cron` | string | No | Spring cron expression used by the scheduler. |

Example:

```json
{
  "enabled": false,
  "completedProcessRetentionDays": 90,
  "completedTaskRetentionDays": 90,
  "batchSize": 500,
  "cron": "0 0 3 * * *"
}
```

## Incident

| Property | Type | Required | Description |
| --- | --- | --- | --- |
| `id` | integer(int64) | No | Incident id. |
| `processInstanceId` | integer(int64) | No | Related process instance. |
| `nodeId` | string | No | Related process node, when available. |
| `status` | string | No | `OPEN`, `ACKNOWLEDGED`, or `RESOLVED`. |
| `severity` | string | No | `LOW`, `MEDIUM`, `HIGH`, or `CRITICAL`. |
| `source` | string | No | `PROCESS_ENGINE`, `WORKER`, `CODE_TASK`, `AI_TASK`, or `MESSAGE`. |
| `message` | string | No | Operator-facing incident message. |
| `technicalDetails` | string | No | Additional technical context. |
| `externalReferenceId` | string | No | Related worker request, code task, or other reference. |
| `occurrenceCount` | integer(int32) | No | Number of repeated occurrences deduplicated into this incident. |
| `lastOccurredAt` | string(date-time) | No | Last time this incident occurred. |
| `createdAt` | string(date-time) | No | Creation time. |
| `updatedAt` | string(date-time) | No | Last update time. |
| `acknowledgedAt` | string(date-time) | No | Acknowledgement time. |
| `acknowledgedBy` | string | No | Operator that acknowledged the incident. |
| `resolvedAt` | string(date-time) | No | Resolution time. |
| `resolvedBy` | string | No | Operator that resolved the incident. |
| `resolutionNote` | string | No | Resolution notes. |
| `resolutionAction` | string | No | Structured resolution action. |

Example:

```json
{
  "id": 25,
  "processInstanceId": 456,
  "nodeId": "sync-crm",
  "status": "OPEN",
  "severity": "HIGH",
  "source": "WORKER",
  "message": "API task timed out",
  "technicalDetails": "Process instance 456 failed at node 'sync-crm'",
  "externalReferenceId": "worker_request:91",
  "occurrenceCount": 1,
  "lastOccurredAt": "2026-06-23T10:15:00",
  "createdAt": "2026-06-23T10:15:00",
  "updatedAt": "2026-06-23T10:15:00",
  "acknowledgedAt": null,
  "acknowledgedBy": null,
  "resolvedAt": null,
  "resolvedBy": null,
  "resolutionNote": null,
  "resolutionAction": null
}
```

## IncidentAcknowledgementRequest

| Property | Type | Required | Description |
| --- | --- | --- | --- |
| `acknowledgedBy` | string | No | Operator name. |

## IncidentResolutionRequest

| Property | Type | Required | Description |
| --- | --- | --- | --- |
| `resolvedBy` | string | No | Operator name. |
| `resolutionNote` | string | No | Resolution note. |
| `resolutionAction` | string | No | `RESOLVED_MANUALLY`, `VARIABLE_FIXED`, `RETRIED_SUCCESSFULLY`, `IGNORED_KNOWN_ISSUE`, or `INSTANCE_CANCELLED`. |

## IncidentRetryRequest

| Property | Type | Required | Description |
| --- | --- | --- | --- |
| `requestedBy` | string | No | Operator requesting retry. |

## IncidentEvent

| Property | Type | Required | Description |
| --- | --- | --- | --- |
| `id` | integer(int64) | No | Event id. |
| `incidentId` | integer(int64) | No | Related incident id. |
| `eventType` | string | No | `CREATED`, `OCCURRED_AGAIN`, `ACKNOWLEDGED`, `RESOLVED`, `REOPENED`, or `RETRY_REQUESTED`. |
| `message` | string | No | Event message. |
| `actor` | string | No | Operator actor, when available. |
| `createdAt` | string(date-time) | No | Event time. |

## IncidentSummaryResponse

| Property | Type | Required | Description |
| --- | --- | --- | --- |
| `openIncidents` | integer(int64) | No | Open incident count. |
| `criticalIncidents` | integer(int64) | No | Unresolved critical incident count. |
| `acknowledgedIncidents` | integer(int64) | No | Acknowledged incident count. |
| `incidentsCreatedToday` | integer(int64) | No | Incidents created since local start of day. |

## MaintenanceCleanupSummary

| Property | Type | Required | Description |
| --- | --- | --- | --- |
| `dryRun` | boolean | No | Whether the operation was a preview. |
| `processDefinitionsDeleted` | integer(int32) | No | Process definitions affected. |
| `processInstancesDeleted` | integer(int32) | No | Process instances affected. |
| `tasksDeleted` | integer(int32) | No | Tasks affected. |
| `processVariablesDeleted` | integer(int32) | No | Process variables affected, including archived snapshots kept after completion or cancellation. |
| `taskVariablesDeleted` | integer(int32) | No | Task variables affected, including archived snapshots kept for completed tasks. |
| `documentsDeleted` | integer(int32) | No | Documents affected. |
| `messageSubscriptionsDeleted` | integer(int32) | No | Message subscriptions affected. |
| `workerRequestsDeleted` | integer(int32) | No | Worker requests affected. |
| `codeTaskExecutionsDeleted` | integer(int32) | No | Code task execution audits affected. |
| `incidentsDeleted` | integer(int32) | No | Incidents affected. |
| `incidentEventsDeleted` | integer(int32) | No | Incident timeline events affected. |
| `timelineEventsDeleted` | integer(int32) | No | Process timeline events affected. |
| `callActivityMappingsDeleted` | integer(int32) | No | Call activity mappings affected. |
| `candidateInstanceIds` | integer[] | No | Candidate process instance ids. |
| `candidateTaskIds` | integer[] | No | Candidate completed task ids. |

## PurgeCompletedInstancesRequest

| Property | Type | Required | Description |
| --- | --- | --- | --- |
| `completedBefore` | string(date-time) | Yes | Completed instances updated before this timestamp are candidates. |
| `processDefinitionId` | integer(int64) | No | Optional process definition id filter. |
| `processKey` | string | No | Optional process key filter. |
| `batchSize` | integer(int32) | No | Optional candidate limit for the request. |
| `dryRun` | boolean | No | `true` previews, `false` executes deletion. |

## PurgeCompletedTasksRequest

| Property | Type | Required | Description |
| --- | --- | --- | --- |
| `completedBefore` | string(date-time) | Yes | Completed tasks finished before this timestamp are candidates. |
| `batchSize` | integer(int32) | No | Optional candidate limit for the request. |
| `dryRun` | boolean | No | `true` previews, `false` executes deletion. |

## DeployFormRequest

| Property | Type | Required | Description |
| --- | --- | --- | --- |
| `formId` | string | No |  |
| `name` | string | No |  |
| `schema` | JsonNode | No |  |

Example:

```json
{
  "formId": "expenseReview",
  "name": "Expense Review",
  "schema": {
    "type": "object",
    "title": "Expense Review",
    "required": [
      "approved"
    ],
    "properties": {
      "approved": {
        "type": "boolean",
        "title": "Approve request"
      },
      "comment": {
        "type": "string",
        "title": "Manager comment"
      }
    }
  }
}
```

## DocumentResponseDto

| Property | Type | Required | Description |
| --- | --- | --- | --- |
| `id` | string(uuid) | No |  |
| `fileName` | string | No |  |
| `contentType` | string | No |  |
| `fileSize` | integer(int64) | No |  |
| `taskId` | integer(int64) | No |  |
| `processInstanceId` | integer(int64) | No |  |
| `formFieldKey` | string | No |  |
| `uploadedBy` | string | No |  |
| `createdAt` | string(date-time) | No |  |

Example:

```json
{
  "id": "3f3c7af7-34ae-4dd4-96e4-cbcba52c6b8f",
  "fileName": "contract.pdf",
  "contentType": "application/pdf",
  "fileSize": 245760,
  "taskId": 123,
  "processInstanceId": 456,
  "formFieldKey": "signedContract",
  "uploadedBy": "admin",
  "createdAt": "2026-06-17T10:00:00"
}
```

## ExecutionAuditPageResponse

| Property | Type | Required | Description |
| --- | --- | --- | --- |
| `content` | CodeTaskExecutionAuditResponse[] | No |  |
| `totalElements` | integer(int64) | No |  |
| `totalPages` | integer(int32) | No |  |
| `currentPage` | integer(int32) | No |  |

Example:

```json
{
  "content": [
    {
      "executionId": 55,
      "instanceId": 456,
      "nodeId": "calculate-risk",
      "jarId": 1,
      "className": "com.example.Rules",
      "methodName": "calculateRisk",
      "inputVariables": "{\"amount\":1250.75,\"customerTier\":\"GOLD\"}",
      "outputVariables": "{\"riskScore\":12}",
      "executionTimeMs": 38,
      "status": "COMPLETED",
      "errorMessage": null,
      "executedAt": "2026-06-17T10:00:00"
    }
  ],
  "totalElements": 1,
  "totalPages": 1,
  "currentPage": 0
}
```

## Form

| Property | Type | Required | Description |
| --- | --- | --- | --- |
| `id` | integer(int64) | No |  |
| `formId` | string | No |  |
| `name` | string | No |  |
| `schema` | JsonNode | No |  |
| `version` | integer(int32) | No |  |
| `createdAt` | string(date-time) | No |  |

Example:

```json
{
  "id": 12,
  "formId": "expenseReview",
  "name": "Expense Review",
  "version": 1,
  "createdAt": "2026-06-17T10:00:00",
  "schema": {
    "type": "object",
    "title": "Expense Review",
    "properties": {
      "approved": {
        "type": "boolean"
      },
      "comment": {
        "type": "string"
      }
    }
  }
}
```

## GroupResponse

| Property | Type | Required | Description |
| --- | --- | --- | --- |
| `id` | integer(int64) | No |  |
| `code` | string | No |  |
| `name` | string | No |  |
| `permissions` | string[] | No |  |

Example:

```json
{
  "id": 3,
  "code": "PROCESS_OPERATORS",
  "name": "Process Operators",
  "permissions": [
    "ACCESS_BPM_ADMIN",
    "ACCESS_PROCESS_PORTAL"
  ]
}
```

## JarClassesResponse

| Property | Type | Required | Description |
| --- | --- | --- | --- |
| `jarId` | integer(int64) | No |  |
| `fileName` | string | No |  |
| `classes` | string[] | No |  |

Example:

```json
{
  "jarId": 1,
  "fileName": "customer-rules.jar",
  "classes": [
    "com.example.Rules"
  ]
}
```

## JsonNode

Type: `object`


## LoginRequest

| Property | Type | Required | Description |
| --- | --- | --- | --- |
| `username` | string | No |  |
| `password` | string | No |  |

Example:

```json
{
  "username": "admin",
  "password": "admin"
}
```

## LoginResponse

| Property | Type | Required | Description |
| --- | --- | --- | --- |
| `token` | string | No |  |
| `tokenType` | string | No |  |
| `username` | string | No |  |
| `groups` | string[] | No |  |
| `permissions` | string[] | No |  |

Example:

```json
{
  "token": "eyJhbGciOiJIUzI1NiJ9.example-token",
  "tokenType": "Bearer",
  "username": "admin",
  "groups": [
    "ADMIN"
  ],
  "permissions": [
    "ACCESS_BPM_ADMIN",
    "ACCESS_BPM_MODELER",
    "ACCESS_PROCESS_PORTAL",
    "MANAGE_USERS",
    "MANAGE_GROUPS"
  ]
}
```

## MethodMetadataResponse

| Property | Type | Required | Description |
| --- | --- | --- | --- |
| `methodName` | string | No |  |
| `returnType` | string | No |  |
| `signature` | string | No |  |
| `parameters` | string[] | No |  |
| `parameterNames` | string[] | No |  |
| `static` | boolean | No |  |

Example:

```json
{
  "methodName": "calculateRisk",
  "returnType": "java.lang.Integer",
  "signature": "calculateRisk(java.math.BigDecimal, java.lang.String)",
  "parameters": [
    "java.math.BigDecimal",
    "java.lang.String"
  ],
  "parameterNames": [
    "param0",
    "param1"
  ],
  "static": false
}
```

## MoveNodeRequest

| Property | Type | Required | Description |
| --- | --- | --- | --- |
| `fromNode` | string | No | Current node id where the token is located |
| `toNode` | string | No | Target node id where the token should move |
| `reason` | string | No | Business reason for manual intervention |

Example:

```json
{
  "fromNode": "manual-review",
  "toNode": "approve-request",
  "reason": "SLA escalation approved by supervisor"
}
```

## Pageable

| Property | Type | Required | Description |
| --- | --- | --- | --- |
| `page` | integer(int32) | No |  |
| `size` | integer(int32) | No |  |
| `sort` | string[] | No |  |

Example:

```json
{
  "page": 1,
  "size": 1,
  "sort": [
    "string"
  ]
}
```

## PageableObject

| Property | Type | Required | Description |
| --- | --- | --- | --- |
| `offset` | integer(int64) | No |  |
| `sort` | SortObject | No |  |
| `unpaged` | boolean | No |  |
| `paged` | boolean | No |  |
| `pageNumber` | integer(int32) | No |  |
| `pageSize` | integer(int32) | No |  |

Example:

```json
{
  "offset": 123,
  "sort": {
    "empty": true,
    "unsorted": true,
    "sorted": true
  },
  "unpaged": true,
  "paged": true,
  "pageNumber": 1,
  "pageSize": 1
}
```

## PageProcessDefinition

| Property | Type | Required | Description |
| --- | --- | --- | --- |
| `totalElements` | integer(int64) | No |  |
| `totalPages` | integer(int32) | No |  |
| `first` | boolean | No |  |
| `last` | boolean | No |  |
| `size` | integer(int32) | No |  |
| `content` | ProcessDefinition[] | No |  |
| `number` | integer(int32) | No |  |
| `sort` | SortObject | No |  |
| `numberOfElements` | integer(int32) | No |  |
| `pageable` | PageableObject | No |  |
| `empty` | boolean | No |  |

Example:

```json
{
  "content": [
    {
      "id": 10,
      "key": "expense-approval",
      "processName": "Expense Approval",
      "description": "Review and approve expense requests.",
      "version": 3,
      "definitionJson": "{\"processId\":\"expense-approval\",\"nodes\":[{\"id\":\"start\",\"type\":\"StartEvent\"},{\"id\":\"manager-review\",\"type\":\"HumanTask\"},{\"id\":\"end\",\"type\":\"EndEvent\"}],\"flows\":[{\"source\":\"start\",\"target\":\"manager-review\"},{\"source\":\"manager-review\",\"target\":\"end\"}]}"
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

## PageProcessInstance

| Property | Type | Required | Description |
| --- | --- | --- | --- |
| `totalElements` | integer(int64) | No |  |
| `totalPages` | integer(int32) | No |  |
| `first` | boolean | No |  |
| `last` | boolean | No |  |
| `size` | integer(int32) | No |  |
| `content` | ProcessInstance[] | No |  |
| `number` | integer(int32) | No |  |
| `sort` | SortObject | No |  |
| `numberOfElements` | integer(int32) | No |  |
| `pageable` | PageableObject | No |  |
| `empty` | boolean | No |  |

Example:

```json
{
  "content": [
    {
      "id": 456,
      "processDefinition": {
        "id": 10,
        "key": "expense-approval",
        "processName": "Expense Approval",
        "description": "Review and approve expense requests.",
        "version": 3,
        "definitionJson": "{\"processId\":\"expense-approval\",\"nodes\":[{\"id\":\"start\",\"type\":\"StartEvent\"},{\"id\":\"manager-review\",\"type\":\"HumanTask\"},{\"id\":\"end\",\"type\":\"EndEvent\"}],\"flows\":[{\"source\":\"start\",\"target\":\"manager-review\"},{\"source\":\"manager-review\",\"target\":\"end\"}]}"
      },
      "status": "ACTIVE",
      "currentNode": [
        "manager-review"
      ],
      "nodeHistory": [
        "start",
        "manager-review"
      ],
      "createdAt": "2026-06-17T10:00:00",
      "updatedAt": "2026-06-17T10:00:01",
      "parentInstanceId": null,
      "callActivityNodeId": null,
      "nestingLevel": 0,
      "completionNodeId": null
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

## PageTaskResponseDto

| Property | Type | Required | Description |
| --- | --- | --- | --- |
| `totalElements` | integer(int64) | No |  |
| `totalPages` | integer(int32) | No |  |
| `first` | boolean | No |  |
| `last` | boolean | No |  |
| `size` | integer(int32) | No |  |
| `content` | TaskResponseDto[] | No |  |
| `number` | integer(int32) | No |  |
| `sort` | SortObject | No |  |
| `numberOfElements` | integer(int32) | No |  |
| `pageable` | PageableObject | No |  |
| `empty` | boolean | No |  |

Example:

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

## ProcessDefinition

| Property | Type | Required | Description |
| --- | --- | --- | --- |
| `id` | integer(int64) | No |  |
| `description` | string | No |  |
| `version` | integer(int32) | No |  |
| `definitionJson` | string | No |  |
| `key` | string | No |  |
| `processName` | string | No |  |

Example:

```json
{
  "id": 10,
  "key": "expense-approval",
  "processName": "Expense Approval",
  "description": "Review and approve expense requests.",
  "version": 3,
  "definitionJson": "{\"processId\":\"expense-approval\",\"nodes\":[{\"id\":\"start\",\"type\":\"StartEvent\"},{\"id\":\"manager-review\",\"type\":\"HumanTask\"},{\"id\":\"end\",\"type\":\"EndEvent\"}],\"flows\":[{\"source\":\"start\",\"target\":\"manager-review\"},{\"source\":\"manager-review\",\"target\":\"end\"}]}"
}
```

## ProcessInstance

| Property | Type | Required | Description |
| --- | --- | --- | --- |
| `id` | integer(int64) | No |  |
| `processDefinition` | ProcessDefinition | No |  |
| `status` | string | No |  |
| `currentNode` | string[] | No |  |
| `nodeHistory` | string[] | No |  |
| `createdAt` | string(date-time) | No |  |
| `updatedAt` | string(date-time) | No |  |
| `parentInstanceId` | integer(int64) | No |  |
| `callActivityNodeId` | string | No |  |
| `nestingLevel` | integer(int32) | No |  |
| `completionNodeId` | string | No |  |
| `errorMessage` | string | No | Failure reason recorded when the instance ends in `FAILED`. |
| `errorNodeId` | string | No | Node id that caused the recorded failure. |

Example:

```json
{
  "id": 456,
  "processDefinition": {
    "id": 10,
    "key": "expense-approval",
    "processName": "Expense Approval",
    "description": "Review and approve expense requests.",
    "version": 3,
    "definitionJson": "{\"processId\":\"expense-approval\",\"nodes\":[{\"id\":\"start\",\"type\":\"StartEvent\"},{\"id\":\"manager-review\",\"type\":\"HumanTask\"},{\"id\":\"end\",\"type\":\"EndEvent\"}],\"flows\":[{\"source\":\"start\",\"target\":\"manager-review\"},{\"source\":\"manager-review\",\"target\":\"end\"}]}"
  },
  "status": "FAILED",
  "currentNode": [],
  "nodeHistory": [
    "start",
    "manager-review",
    "create-ticket"
  ],
  "createdAt": "2026-06-17T10:00:00",
  "updatedAt": "2026-06-17T10:02:31",
  "parentInstanceId": null,
  "callActivityNodeId": null,
  "nestingLevel": 0,
  "completionNodeId": null,
  "errorMessage": "API task 'create-ticket' timed out after 2 minutes without completion",
  "errorNodeId": "create-ticket"
}
```

## ProcessInstanceEvent

| Property | Type | Required | Description |
| --- | --- | --- | --- |
| `id` | integer(int64) | No | Timeline event id. |
| `processInstanceId` | integer(int64) | No | Related process instance. |
| `nodeId` | string | No | Related node, when available. |
| `eventType` | string | No | Runtime event type. |
| `message` | string | No | Operator-facing event message. |
| `actor` | string | No | User or operator actor, when available. |
| `details` | string | No | Additional event details. |
| `createdAt` | string(date-time) | No | Event time. |

Example:

```json
{
  "id": 1,
  "processInstanceId": 456,
  "nodeId": "manager-review",
  "eventType": "TASK_CREATED",
  "message": "Task 'Manager Review' created.",
  "actor": null,
  "details": "taskId=123",
  "createdAt": "2026-06-23T10:00:01"
}
```

## ProcessVariable

| Property | Type | Required | Description |
| --- | --- | --- | --- |
| `id` | integer(int64) | No |  |
| `processInstanceId` | integer(int64) | No |  |
| `name` | string | No |  |
| `value` | JsonNode | No |  |
| `createdAt` | string(date-time) | No |  |
| `updatedAt` | string(date-time) | No |  |

Example:

```json
{
  "id": 88,
  "processInstanceId": 456,
  "name": "approved",
  "value": true,
  "createdAt": "2026-06-17T10:00:00",
  "updatedAt": "2026-06-17T10:00:00"
}
```

## ResetPasswordRequest

| Property | Type | Required | Description |
| --- | --- | --- | --- |
| `password` | string | No |  |

Example:

```json
{
  "password": "new-temporary-password"
}
```

## SortObject

| Property | Type | Required | Description |
| --- | --- | --- | --- |
| `empty` | boolean | No |  |
| `unsorted` | boolean | No |  |
| `sorted` | boolean | No |  |

Example:

```json
{
  "empty": true,
  "unsorted": true,
  "sorted": true
  }
  ```

## TaskFilterOperator

| Value | Description |
| --- | --- |
| `EQUALS` | Exact match. |
| `NOT_EQUALS` | Exact mismatch. |
| `IN` | Match any of the provided values. |
| `NOT_IN` | Exclude any of the provided values. |
| `GREATER_THAN` | Greater than the provided value. |
| `GREATER_THAN_OR_EQUAL` | Greater than or equal to the provided value. |
| `LESS_THAN` | Less than the provided value. |
| `LESS_THAN_OR_EQUAL` | Less than or equal to the provided value. |
| `CONTAINS` | Case-insensitive substring match. |
| `STARTS_WITH` | Case-insensitive prefix match. |
| `ENDS_WITH` | Case-insensitive suffix match. |

## TaskVariableScope

| Value | Description |
| --- | --- |
| `TASK` | Match a task variable. |
| `PROCESS` | Match a process variable for the same process instance. |

## TaskSearchFilterDto

| Property | Type | Required | Description |
| --- | --- | --- | --- |
| `field` | string | Yes | Filter target such as `status`, `assignee`, `taskName`, `createdAt`, `processDefinition`, or `variable`. |
| `operator` | TaskFilterOperator | No | Defaults to `EQUALS`. |
| `value` | any | No | Single value for the filter. Use this for equality, string, date, or numeric comparisons. |
| `values` | any[] | No | Multi-value filter input used by `IN` and `NOT_IN`. |
| `scope` | TaskVariableScope | No | Required when `field` is `variable`. |
| `name` | string | No | Required when `field` is `variable`. The variable name to match. |

Example:

```json
{
  "field": "taskName",
  "operator": "CONTAINS",
  "value": "review"
}
```

## TaskSearchRequestDto

| Property | Type | Required | Description |
| --- | --- | --- | --- |
| `filters` | TaskSearchFilterDto[] | No | Filters combined with `AND`. Omit the array or send an empty array to list visible tasks without extra search constraints. |

Example:

```json
{
  "filters": [
    {
      "field": "status",
      "operator": "EQUALS",
      "value": "PENDING"
    },
    {
      "field": "variable",
      "operator": "EQUALS",
      "scope": "TASK",
      "name": "approved",
      "value": true
    }
  ]
}
```

## TaskResponseDto

| Property | Type | Required | Description |
| --- | --- | --- | --- |
| `id` | integer(int64) | No |  |
| `title` | string | No |  |
| `name` | string | No |  |
| `description` | string | No |  |
| `processInstanceId` | integer(int64) | No |  |
| `nodeId` | string | No |  |
| `assignee` | string | No |  |
| `candidateUsers` | string[] | No |  |
| `candidateGroups` | string[] | No |  |
| `status` | string | No |  |
| `createdAt` | string(date-time) | No |  |
| `completedAt` | string(date-time) | No |  |
| `formDbId` | integer(int64) | No |  |
| `formId` | string | No |  |
| `variables` | object | No | Task variable snapshot returned with the task. Completed tasks continue to return their last saved variables until maintenance cleanup removes the task. |

Example:

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

## UpdateGroupRequest

| Property | Type | Required | Description |
| --- | --- | --- | --- |
| `name` | string | No |  |
| `permissionCodes` | string[] | No |  |

Example:

```json
{
  "name": "Process Operators",
  "permissionCodes": [
    "ACCESS_BPM_ADMIN",
    "ACCESS_PROCESS_PORTAL"
  ]
}
```

## UpdateDataRetentionSettingsRequest

| Property | Type | Required | Description |
| --- | --- | --- | --- |
| `enabled` | boolean | Yes | Enables or disables scheduled retention. |
| `completedProcessRetentionDays` | integer(int64) | Yes | Number of days completed process instances are retained. |
| `completedTaskRetentionDays` | integer(int64) | Yes | Number of days completed tasks are retained. |
| `batchSize` | integer(int32) | Yes | Maximum number of candidates processed in one cleanup run. |
| `cron` | string | Yes | Spring cron expression used by the scheduler. |

Example:

```json
{
  "enabled": true,
  "completedProcessRetentionDays": 180,
  "completedTaskRetentionDays": 45,
  "batchSize": 500,
  "cron": "0 0 3 * * *"
}
```

## UpdateGroupUsersRequest

| Property | Type | Required | Description |
| --- | --- | --- | --- |
| `userIds` | integer[] | No |  |

Example:

```json
{
  "userIds": [
    7,
    8
  ]
}
```

## UpdateUserRequest

| Property | Type | Required | Description |
| --- | --- | --- | --- |
| `enabled` | boolean | No |  |
| `groupIds` | integer[] | No |  |
| `permissionCodes` | string[] | No |  |

Example:

```json
{
  "enabled": true,
  "groupIds": [
    2,
    3
  ],
  "permissionCodes": [
    "ACCESS_BPM_MODELER",
    "ACCESS_PROCESS_PORTAL"
  ]
}
```

## UserResponse

| Property | Type | Required | Description |
| --- | --- | --- | --- |
| `id` | integer(int64) | No |  |
| `username` | string | No |  |
| `enabled` | boolean | No |  |
| `groups` | string[] | No |  |
| `permissions` | string[] | No |  |

Example:

```json
{
  "id": 7,
  "username": "modeler.user",
  "enabled": true,
  "groups": [
    "MODELERS"
  ],
  "permissions": [
    "ACCESS_BPM_MODELER"
  ]
}
```
