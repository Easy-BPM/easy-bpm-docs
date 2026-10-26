---
title: Schemas
---

# Schemas

These schemas are generated from the current backend OpenAPI components. Fields marked required come from the OpenAPI `required` array.

## AgentProcessDefinition

| Property | Type | Required | Description |
| --- | --- | --- | --- |
| `id` | `integer(int64)` | No |  |
| `description` | `string` | No |  |
| `definitionJson` | `string` | No |  |
| `version` | `integer(int32)` | No |  |
| `createdAt` | `string(date-time)` | No |  |
| `key` | `string` | No |  |
| `processName` | `string` | No |  |

## AgentProcessSimulationRequest

| Property | Type | Required | Description |
| --- | --- | --- | --- |
| `definition` | `object` | Yes |  |
| `inputs` | `object` | No |  |

## AgentProcessSimulationResponse

| Property | Type | Required | Description |
| --- | --- | --- | --- |
| `success` | `boolean` | No |  |
| `responseText` | `string` | No |  |
| `providerId` | `string` | No |  |
| `modelName` | `string` | No |  |
| `tokensUsed` | `integer(int32)` | No |  |
| `durationMs` | `integer(int64)` | No |  |
| `toolResults` | `AgentToolSimulationResult[]` | No |  |
| `errorCode` | `string` | No |  |
| `errorMessage` | `string` | No |  |

## AgentToolSimulationResult

| Property | Type | Required | Description |
| --- | --- | --- | --- |
| `id` | `string` | No |  |
| `name` | `string` | No |  |
| `type` | `string` | No |  |
| `status` | `string` | No |  |
| `durationMs` | `integer(int64)` | No |  |
| `response` | `object` | No |  |
| `error` | `string` | No |  |

## AICredentialCreateRequestDto

| Property | Type | Required | Description |
| --- | --- | --- | --- |
| `name` | `string` | No |  |
| `providerId` | `string` | No |  |
| `credentialType` | `string` | No |  |
| `token` | `string` | No |  |
| `description` | `string` | No |  |

## AICredentialResponseDto

| Property | Type | Required | Description |
| --- | --- | --- | --- |
| `id` | `string` | No |  |
| `name` | `string` | No |  |
| `providerId` | `string` | No |  |
| `credentialType` | `string` | No |  |
| `maskedToken` | `string` | No |  |
| `reference` | `string` | No |  |
| `description` | `string` | No |  |
| `createdAt` | `string` | No |  |
| `updatedAt` | `string` | No |  |
| `lastUsedAt` | `string` | No |  |

## AICredentialUpdateRequestDto

| Property | Type | Required | Description |
| --- | --- | --- | --- |
| `name` | `string` | No |  |
| `providerId` | `string` | No |  |
| `credentialType` | `string` | No |  |
| `token` | `string` | No |  |
| `description` | `string` | No |  |

## ApiClientAuditResponse

| Property | Type | Required | Description |
| --- | --- | --- | --- |
| `id` | `integer(int64)` | No |  |
| `category` | `string` | No |  |
| `action` | `string` | No |  |
| `outcome` | `string` | No |  |
| `actor` | `string` | No |  |
| `credentialGeneration` | `integer(int32)` | No |  |
| `remoteIp` | `string` | No |  |
| `httpMethod` | `string` | No |  |
| `requestPath` | `string` | No |  |
| `httpStatus` | `integer(int32)` | No |  |
| `requestId` | `string` | No |  |
| `durationMs` | `integer(int64)` | No |  |
| `changedFields` | `object` | No |  |
| `createdAt` | `string(date-time)` | No |  |

## ApiClientCredentialResponse

| Property | Type | Required | Description |
| --- | --- | --- | --- |
| `client` | `ApiClientResponse` | No |  |
| `credential` | `string` | No |  |

## ApiClientErrorResponse

| Property | Type | Required | Description |
| --- | --- | --- | --- |
| `timestamp` | `string(date-time)` | No |  |
| `status` | `integer(int32)` | No |  |
| `code` | `string` | No |  |
| `message` | `string` | No |  |
| `path` | `string` | No |  |
| `correlationId` | `string` | No |  |
| `fieldErrors` | `object` | No |  |

## ApiClientResponse

| Property | Type | Required | Description |
| --- | --- | --- | --- |
| `id` | `string(uuid)` | No |  |
| `name` | `string` | No |  |
| `description` | `string` | No |  |
| `status` | `string` | No |  |
| `expiresAt` | `string(date-time)` | No |  |
| `scopes` | `string[]` | No |  |
| `credentialGeneration` | `integer(int32)` | No |  |
| `lastUsedAt` | `string(date-time)` | No |  |
| `lastUsedIp` | `string` | No |  |
| `revokedAt` | `string(date-time)` | No |  |
| `revokedBy` | `string` | No |  |
| `createdAt` | `string(date-time)` | No |  |
| `createdBy` | `string` | No |  |
| `updatedAt` | `string(date-time)` | No |  |
| `updatedBy` | `string` | No |  |
| `version` | `integer(int64)` | No |  |

## AssignableScopeList

| Type | Description |
| --- | --- |
| `AssignableScopeResponse[]` |  |

## AssignableScopeResponse

| Property | Type | Required | Description |
| --- | --- | --- | --- |
| `code` | `string` | No |  |
| `name` | `string` | No |  |

## AssignProcessVariablesRequest

| Property | Type | Required | Description |
| --- | --- | --- | --- |
| `variables` | `Map<String, object>` | No | Map of variable names to values. Supports primitive and nested JSON values. |

## AuthProviderConfigResponse

| Property | Type | Required | Description |
| --- | --- | --- | --- |
| `provider` | `string` | No |  |
| `oidc` | `OidcAuthConfigResponse` | No |  |

## CallActivityMappingResponse

| Property | Type | Required | Description |
| --- | --- | --- | --- |
| `id` | `integer(int64)` | No |  |
| `parentInstanceId` | `integer(int64)` | No |  |
| `childInstanceId` | `integer(int64)` | No |  |
| `callActivityNodeId` | `string` | No |  |
| `inputMappings` | `Map<String, string>` | No |  |
| `outputMappings` | `Map<String, string>` | No |  |
| `propagateAllVariables` | `boolean` | No |  |

## ClassMetadataResponse

| Property | Type | Required | Description |
| --- | --- | --- | --- |
| `className` | `string` | No |  |
| `methods` | `MethodMetadataResponse[]` | No |  |

## CodeTaskExecutionAuditResponse

| Property | Type | Required | Description |
| --- | --- | --- | --- |
| `executionId` | `integer(int64)` | No |  |
| `instanceId` | `integer(int64)` | No |  |
| `nodeId` | `string` | No |  |
| `jarId` | `integer(int64)` | No |  |
| `className` | `string` | No |  |
| `methodName` | `string` | No |  |
| `inputVariables` | `string` | No |  |
| `outputVariables` | `string` | No |  |
| `executionTimeMs` | `integer(int32)` | No |  |
| `status` | `string` | No |  |
| `errorMessage` | `string` | No |  |
| `executedAt` | `string` | No |  |

## CodeTaskJarUploadResponse

| Property | Type | Required | Description |
| --- | --- | --- | --- |
| `jarId` | `integer(int64)` | No |  |
| `fileName` | `string` | No |  |
| `fileHash` | `string` | No |  |
| `uploadedAt` | `string` | No |  |
| `classCount` | `integer(int32)` | No |  |
| `methodCount` | `integer(int32)` | No |  |
| `classes` | `string[]` | No |  |

## CreateApiClientRequest

| Property | Type | Required | Description |
| --- | --- | --- | --- |
| `name` | `string` | No |  |
| `description` | `string` | No |  |
| `scopes` | `string[]` | No |  |
| `expiresAt` | `string(date-time)` | No |  |

## CreateGroupRequest

| Property | Type | Required | Description |
| --- | --- | --- | --- |
| `code` | `string` | No |  |
| `name` | `string` | No |  |
| `permissionCodes` | `string[]` | No |  |

## CreateUserRequest

| Property | Type | Required | Description |
| --- | --- | --- | --- |
| `username` | `string` | No |  |
| `password` | `string` | No |  |
| `enabled` | `boolean` | No |  |
| `groupIds` | `integer(int64)[]` | No |  |
| `permissionCodes` | `string[]` | No |  |

## CurrentUserResponse

| Property | Type | Required | Description |
| --- | --- | --- | --- |
| `id` | `integer(int64)` | No |  |
| `username` | `string` | No |  |
| `email` | `string` | No |  |
| `displayName` | `string` | No |  |
| `identityProvider` | `string` | No |  |
| `externalIdentityId` | `string` | No |  |
| `groups` | `string[]` | No |  |
| `permissions` | `string[]` | No |  |
| `identityType` | `string` | No | Identity type; HUMAN by default. |

## DataRetentionSettingsResponse

| Property | Type | Required | Description |
| --- | --- | --- | --- |
| `enabled` | `boolean` | No |  |
| `completedProcessRetentionDays` | `integer(int64)` | No |  |
| `completedTaskRetentionDays` | `integer(int64)` | No |  |
| `batchSize` | `integer(int32)` | No |  |
| `cron` | `string` | No |  |

## DeployFormRequest

| Property | Type | Required | Description |
| --- | --- | --- | --- |
| `formId` | `string` | No |  |
| `name` | `string` | No |  |
| `schema` | `JsonNode` | No |  |

## DocumentResponseDto

| Property | Type | Required | Description |
| --- | --- | --- | --- |
| `id` | `string(uuid)` | No |  |
| `fileName` | `string` | No |  |
| `contentType` | `string` | No |  |
| `fileSize` | `integer(int64)` | No |  |
| `taskId` | `integer(int64)` | No |  |
| `processInstanceId` | `integer(int64)` | No |  |
| `formFieldKey` | `string` | No |  |
| `uploadedBy` | `string` | No |  |
| `createdAt` | `string(date-time)` | No |  |

## ExecutionAuditPageResponse

| Property | Type | Required | Description |
| --- | --- | --- | --- |
| `content` | `CodeTaskExecutionAuditResponse[]` | No |  |
| `totalElements` | `integer(int64)` | No |  |
| `totalPages` | `integer(int32)` | No |  |
| `currentPage` | `integer(int32)` | No |  |

## Form

| Property | Type | Required | Description |
| --- | --- | --- | --- |
| `id` | `integer(int64)` | No |  |
| `formId` | `string` | No |  |
| `name` | `string` | No |  |
| `schema` | `JsonNode` | No |  |
| `version` | `integer(int32)` | No |  |
| `createdAt` | `string(date-time)` | No |  |

## GroupResponse

| Property | Type | Required | Description |
| --- | --- | --- | --- |
| `id` | `integer(int64)` | No |  |
| `code` | `string` | No |  |
| `name` | `string` | No |  |
| `permissions` | `string[]` | No |  |

## Incident

| Property | Type | Required | Description |
| --- | --- | --- | --- |
| `id` | `integer(int64)` | No |  |
| `processInstanceId` | `integer(int64)` | No |  |
| `nodeId` | `string` | No |  |
| `status` | `string` | No |  |
| `severity` | `string` | No |  |
| `source` | `string` | No |  |
| `message` | `string` | No |  |
| `technicalDetails` | `string` | No |  |
| `externalReferenceId` | `string` | No |  |
| `occurrenceCount` | `integer(int32)` | No |  |
| `lastOccurredAt` | `string(date-time)` | No |  |
| `createdAt` | `string(date-time)` | No |  |
| `updatedAt` | `string(date-time)` | No |  |
| `acknowledgedAt` | `string(date-time)` | No |  |
| `acknowledgedBy` | `string` | No |  |
| `resolvedAt` | `string(date-time)` | No |  |
| `resolvedBy` | `string` | No |  |
| `resolutionNote` | `string` | No |  |
| `resolutionAction` | `string` | No |  |

## IncidentAcknowledgementRequest

| Property | Type | Required | Description |
| --- | --- | --- | --- |
| `acknowledgedBy` | `string` | No |  |

## IncidentEvent

| Property | Type | Required | Description |
| --- | --- | --- | --- |
| `id` | `integer(int64)` | No |  |
| `incidentId` | `integer(int64)` | No |  |
| `eventType` | `string` | No |  |
| `message` | `string` | No |  |
| `actor` | `string` | No |  |
| `createdAt` | `string(date-time)` | No |  |

## IncidentResolutionRequest

| Property | Type | Required | Description |
| --- | --- | --- | --- |
| `resolvedBy` | `string` | No |  |
| `resolutionNote` | `string` | No |  |
| `resolutionAction` | `string` | No |  |

## IncidentRetryRequest

| Property | Type | Required | Description |
| --- | --- | --- | --- |
| `requestedBy` | `string` | No |  |

## IncidentSummaryResponse

| Property | Type | Required | Description |
| --- | --- | --- | --- |
| `openIncidents` | `integer(int64)` | No |  |
| `criticalIncidents` | `integer(int64)` | No |  |
| `acknowledgedIncidents` | `integer(int64)` | No |  |
| `incidentsCreatedToday` | `integer(int64)` | No |  |

## JarClassesResponse

| Property | Type | Required | Description |
| --- | --- | --- | --- |
| `jarId` | `integer(int64)` | No |  |
| `fileName` | `string` | No |  |
| `classes` | `string[]` | No |  |

## JsonNode

| Type | Description |
| --- | --- |
| `object` |  |

## LoginRequest

| Property | Type | Required | Description |
| --- | --- | --- | --- |
| `username` | `string` | No |  |
| `password` | `string` | No |  |

## LoginResponse

| Property | Type | Required | Description |
| --- | --- | --- | --- |
| `token` | `string` | No |  |
| `tokenType` | `string` | No |  |
| `username` | `string` | No |  |
| `groups` | `string[]` | No |  |
| `permissions` | `string[]` | No |  |

## MaintenanceCleanupSummary

| Property | Type | Required | Description |
| --- | --- | --- | --- |
| `dryRun` | `boolean` | No |  |
| `processDefinitionsDeleted` | `integer(int32)` | No |  |
| `processInstancesDeleted` | `integer(int32)` | No |  |
| `tasksDeleted` | `integer(int32)` | No |  |
| `processVariablesDeleted` | `integer(int32)` | No |  |
| `taskVariablesDeleted` | `integer(int32)` | No |  |
| `documentsDeleted` | `integer(int32)` | No |  |
| `messageSubscriptionsDeleted` | `integer(int32)` | No |  |
| `workerRequestsDeleted` | `integer(int32)` | No |  |
| `codeTaskExecutionsDeleted` | `integer(int32)` | No |  |
| `incidentsDeleted` | `integer(int32)` | No |  |
| `incidentEventsDeleted` | `integer(int32)` | No |  |
| `timelineEventsDeleted` | `integer(int32)` | No |  |
| `callActivityMappingsDeleted` | `integer(int32)` | No |  |
| `candidateInstanceIds` | `integer(int64)[]` | No |  |
| `candidateTaskIds` | `integer(int64)[]` | No |  |

## MethodMetadataResponse

| Property | Type | Required | Description |
| --- | --- | --- | --- |
| `methodName` | `string` | No |  |
| `returnType` | `string` | No |  |
| `signature` | `string` | No |  |
| `parameters` | `string[]` | No |  |
| `parameterNames` | `string[]` | No |  |
| `static` | `boolean` | No |  |

## MoveNodeRequest

| Property | Type | Required | Description |
| --- | --- | --- | --- |
| `fromNode` | `string` | No | Current node id where the token is located |
| `toNode` | `string` | No | Target node id where the token should move |
| `reason` | `string` | No | Business reason for manual intervention |

## OidcAuthConfigResponse

| Property | Type | Required | Description |
| --- | --- | --- | --- |
| `issuerUri` | `string` | No |  |
| `clientId` | `string` | No |  |
| `authorizationEndpoint` | `string` | No |  |
| `tokenEndpoint` | `string` | No |  |
| `logoutEndpoint` | `string` | No |  |

## Pageable

| Property | Type | Required | Description |
| --- | --- | --- | --- |
| `page` | `integer(int32)` | No |  |
| `size` | `integer(int32)` | No |  |
| `sort` | `string[]` | No |  |

## PageableObject

| Property | Type | Required | Description |
| --- | --- | --- | --- |
| `offset` | `integer(int64)` | No |  |
| `sort` | `SortObject` | No |  |
| `paged` | `boolean` | No |  |
| `pageNumber` | `integer(int32)` | No |  |
| `pageSize` | `integer(int32)` | No |  |
| `unpaged` | `boolean` | No |  |

## PageApiClientAuditResponse

| Property | Type | Required | Description |
| --- | --- | --- | --- |
| `content` | `ApiClientAuditResponse[]` | No |  |
| `totalElements` | `integer(int64)` | No |  |
| `totalPages` | `integer` | No |  |
| `number` | `integer` | No |  |
| `size` | `integer` | No |  |
| `first` | `boolean` | No |  |
| `last` | `boolean` | No |  |
| `empty` | `boolean` | No |  |

## PageApiClientResponse

| Property | Type | Required | Description |
| --- | --- | --- | --- |
| `content` | `ApiClientResponse[]` | No |  |
| `totalElements` | `integer(int64)` | No |  |
| `totalPages` | `integer` | No |  |
| `number` | `integer` | No |  |
| `size` | `integer` | No |  |
| `first` | `boolean` | No |  |
| `last` | `boolean` | No |  |
| `empty` | `boolean` | No |  |

## PageIncident

| Property | Type | Required | Description |
| --- | --- | --- | --- |
| `totalElements` | `integer(int64)` | No |  |
| `totalPages` | `integer(int32)` | No |  |
| `first` | `boolean` | No |  |
| `last` | `boolean` | No |  |
| `size` | `integer(int32)` | No |  |
| `content` | `Incident[]` | No |  |
| `number` | `integer(int32)` | No |  |
| `sort` | `SortObject` | No |  |
| `numberOfElements` | `integer(int32)` | No |  |
| `pageable` | `PageableObject` | No |  |
| `empty` | `boolean` | No |  |

## PageProcessDefinition

| Property | Type | Required | Description |
| --- | --- | --- | --- |
| `totalElements` | `integer(int64)` | No |  |
| `totalPages` | `integer(int32)` | No |  |
| `first` | `boolean` | No |  |
| `last` | `boolean` | No |  |
| `size` | `integer(int32)` | No |  |
| `content` | `ProcessDefinition[]` | No |  |
| `number` | `integer(int32)` | No |  |
| `sort` | `SortObject` | No |  |
| `numberOfElements` | `integer(int32)` | No |  |
| `pageable` | `PageableObject` | No |  |
| `empty` | `boolean` | No |  |

## PageProcessInstance

| Property | Type | Required | Description |
| --- | --- | --- | --- |
| `totalElements` | `integer(int64)` | No |  |
| `totalPages` | `integer(int32)` | No |  |
| `first` | `boolean` | No |  |
| `last` | `boolean` | No |  |
| `size` | `integer(int32)` | No |  |
| `content` | `ProcessInstance[]` | No |  |
| `number` | `integer(int32)` | No |  |
| `sort` | `SortObject` | No |  |
| `numberOfElements` | `integer(int32)` | No |  |
| `pageable` | `PageableObject` | No |  |
| `empty` | `boolean` | No |  |

## PageSlaEventDto

| Property | Type | Required | Description |
| --- | --- | --- | --- |
| `content` | `SlaEventDto[]` | No |  |
| `totalElements` | `integer(int64)` | No |  |
| `totalPages` | `integer` | No |  |
| `number` | `integer` | No |  |
| `size` | `integer` | No |  |
| `first` | `boolean` | No |  |
| `last` | `boolean` | No |  |
| `empty` | `boolean` | No |  |

## PageSlaMetricRow

| Property | Type | Required | Description |
| --- | --- | --- | --- |
| `content` | `SlaMetricRow[]` | No |  |
| `totalElements` | `integer(int64)` | No |  |
| `totalPages` | `integer` | No |  |
| `number` | `integer` | No |  |
| `size` | `integer` | No |  |
| `first` | `boolean` | No |  |
| `last` | `boolean` | No |  |
| `empty` | `boolean` | No |  |

## PageTaskResponseDto

| Property | Type | Required | Description |
| --- | --- | --- | --- |
| `totalElements` | `integer(int64)` | No |  |
| `totalPages` | `integer(int32)` | No |  |
| `first` | `boolean` | No |  |
| `last` | `boolean` | No |  |
| `size` | `integer(int32)` | No |  |
| `content` | `TaskResponseDto[]` | No |  |
| `number` | `integer(int32)` | No |  |
| `sort` | `SortObject` | No |  |
| `numberOfElements` | `integer(int32)` | No |  |
| `pageable` | `PageableObject` | No |  |
| `empty` | `boolean` | No |  |

## ProcessDefinition

| Property | Type | Required | Description |
| --- | --- | --- | --- |
| `id` | `integer(int64)` | No |  |
| `description` | `string` | No |  |
| `version` | `integer(int32)` | No |  |
| `definitionJson` | `string` | No |  |
| `key` | `string` | No |  |
| `processName` | `string` | No |  |
| `definitionXml` | `string` | No |  |

## ProcessInstance

| Property | Type | Required | Description |
| --- | --- | --- | --- |
| `id` | `integer(int64)` | No |  |
| `processDefinition` | `ProcessDefinition` | No |  |
| `status` | `string` | No |  |
| `currentNode` | `string[]` | No |  |
| `nodeHistory` | `string[]` | No |  |
| `errorMessage` | `string` | No |  |
| `errorNodeId` | `string` | No |  |
| `createdAt` | `string(date-time)` | No |  |
| `updatedAt` | `string(date-time)` | No |  |
| `parentInstanceId` | `integer(int64)` | No |  |
| `callActivityNodeId` | `string` | No |  |
| `nestingLevel` | `integer(int32)` | No |  |
| `completionNodeId` | `string` | No |  |

## ProcessInstanceEvent

| Property | Type | Required | Description |
| --- | --- | --- | --- |
| `id` | `integer(int64)` | No |  |
| `processInstanceId` | `integer(int64)` | No |  |
| `nodeId` | `string` | No |  |
| `eventType` | `string` | No |  |
| `message` | `string` | No |  |
| `actor` | `string` | No |  |
| `details` | `string` | No |  |
| `createdAt` | `string(date-time)` | No |  |

## ProcessVariable

| Property | Type | Required | Description |
| --- | --- | --- | --- |
| `id` | `integer(int64)` | No |  |
| `processInstanceId` | `integer(int64)` | No |  |
| `name` | `string` | No |  |
| `value` | `JsonNode` | No |  |
| `createdAt` | `string(date-time)` | No |  |
| `updatedAt` | `string(date-time)` | No |  |

## PurgeCompletedInstancesRequest

| Property | Type | Required | Description |
| --- | --- | --- | --- |
| `completedBefore` | `string(date-time)` | No |  |
| `processDefinitionId` | `integer(int64)` | No |  |
| `processKey` | `string` | No |  |
| `batchSize` | `integer(int32)` | No |  |
| `dryRun` | `boolean` | No |  |

## PurgeCompletedTasksRequest

| Property | Type | Required | Description |
| --- | --- | --- | --- |
| `completedBefore` | `string(date-time)` | No |  |
| `batchSize` | `integer(int32)` | No |  |
| `dryRun` | `boolean` | No |  |

## ResetPasswordRequest

| Property | Type | Required | Description |
| --- | --- | --- | --- |
| `password` | `string` | No |  |

## RotateApiClientRequest

| Property | Type | Required | Description |
| --- | --- | --- | --- |
| `expiresAt` | `string(date-time)` | No |  |

## SlaEventDto

| Property | Type | Required | Description |
| --- | --- | --- | --- |
| `id` | `string(uuid)` | No |  |
| `taskId` | `integer(int64)` | No |  |
| `processInstanceId` | `integer(int64)` | No |  |
| `actionId` | `string` | No |  |
| `eventType` | `string` | No |  |
| `scheduledAt` | `string(date-time)` | No |  |
| `occurredAt` | `string(date-time)` | No |  |
| `dueDate` | `string(date-time)` | No |  |
| `outcome` | `string` | No |  |
| `message` | `string` | No |  |
| `incidentId` | `integer(int64)` | No |  |

## SlaMetricRow

| Property | Type | Required | Description |
| --- | --- | --- | --- |
| `key` | `string` | No |  |
| `label` | `string` | No |  |
| `onTrack` | `integer(int64)` | No |  |
| `atRisk` | `integer(int64)` | No |  |
| `overdue` | `integer(int64)` | No |  |
| `completed` | `integer(int64)` | No |  |
| `withoutSla` | `integer(int64)` | No |  |
| `totalSlaCompleted` | `integer(int64)` | No |  |
| `completedWithinSlaCount` | `integer(int64)` | No |  |
| `completedWithinSlaRate` | `number(double)` | No |  |
| `successfulEscalations` | `integer(int64)` | No |  |
| `failedEscalations` | `integer(int64)` | No |  |
| `alertToCompletionSampleCount` | `integer(int64)` | No |  |
| `alertToCompletionAverageSeconds` | `number(double)` | No |  |

## SlaSummary

| Property | Type | Required | Description |
| --- | --- | --- | --- |
| `onTrack` | `integer(int64)` | No |  |
| `atRisk` | `integer(int64)` | No |  |
| `overdue` | `integer(int64)` | No |  |
| `completed` | `integer(int64)` | No |  |
| `withoutSla` | `integer(int64)` | No |  |
| `asOf` | `string(date-time)` | No |  |
| `timeZone` | `string` | No |  |

## SortObject

| Property | Type | Required | Description |
| --- | --- | --- | --- |
| `empty` | `boolean` | No |  |
| `sorted` | `boolean` | No |  |
| `unsorted` | `boolean` | No |  |

## TaskResponseDto

| Property | Type | Required | Description |
| --- | --- | --- | --- |
| `id` | `integer(int64)` | No |  |
| `title` | `string` | No |  |
| `name` | `string` | No |  |
| `description` | `string` | No |  |
| `processInstanceId` | `integer(int64)` | No |  |
| `nodeId` | `string` | No |  |
| `assignee` | `string` | No |  |
| `candidateUsers` | `string[]` | No |  |
| `candidateGroups` | `string[]` | No |  |
| `status` | `string` | No |  |
| `createdAt` | `string(date-time)` | No |  |
| `completedAt` | `string(date-time)` | No |  |
| `formDbId` | `integer(int64)` | No |  |
| `formId` | `string` | No |  |
| `variables` | `Map<String, object>` | No |  |
| `dueDate` | `string(date-time)` | No |  |
| `slaStatus` | `string` | No |  |
| `slaTimeZone` | `string` | No |  |
| `completedWithinSla` | `boolean` | No |  |

## TaskSearchFilterDto

| Property | Type | Required | Description |
| --- | --- | --- | --- |
| `field` | `string` | No |  |
| `operator` | `string` | No |  |
| `value` | `object` | No |  |
| `values` | `object[]` | No |  |
| `scope` | `string` | No |  |
| `name` | `string` | No |  |

## TaskSearchRequestDto

| Property | Type | Required | Description |
| --- | --- | --- | --- |
| `filters` | `TaskSearchFilterDto[]` | No |  |

## UpdateApiClientRequest

| Property | Type | Required | Description |
| --- | --- | --- | --- |
| `name` | `string` | No |  |
| `description` | `string` | No |  |
| `scopes` | `string[]` | No |  |
| `expiresAt` | `string(date-time)` | No |  |

## UpdateDataRetentionSettingsRequest

| Property | Type | Required | Description |
| --- | --- | --- | --- |
| `enabled` | `boolean` | No |  |
| `completedProcessRetentionDays` | `integer(int64)` | No |  |
| `completedTaskRetentionDays` | `integer(int64)` | No |  |
| `batchSize` | `integer(int32)` | No |  |
| `cron` | `string` | No |  |

## UpdateGroupRequest

| Property | Type | Required | Description |
| --- | --- | --- | --- |
| `name` | `string` | No |  |
| `permissionCodes` | `string[]` | No |  |

## UpdateGroupUsersRequest

| Property | Type | Required | Description |
| --- | --- | --- | --- |
| `userIds` | `integer(int64)[]` | No |  |

## UpdateUserRequest

| Property | Type | Required | Description |
| --- | --- | --- | --- |
| `enabled` | `boolean` | No |  |
| `groupIds` | `integer(int64)[]` | No |  |
| `permissionCodes` | `string[]` | No |  |

## UserResponse

| Property | Type | Required | Description |
| --- | --- | --- | --- |
| `id` | `integer(int64)` | No |  |
| `username` | `string` | No |  |
| `enabled` | `boolean` | No |  |
| `groups` | `string[]` | No |  |
| `permissions` | `string[]` | No |  |
