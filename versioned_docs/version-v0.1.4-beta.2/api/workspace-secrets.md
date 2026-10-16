---
title: Workspace Secrets API
---

# Workspace Secrets API

Workspace secrets are encrypted credentials managed by Easy BPM administrators. API Tasks, AI Tasks, and Agent Processes share this catalog and can use stable `@secret:name` references without exposing the underlying token to modelers or portal users.

The API never returns a secret value. It returns a masked token and a stable reference instead.

## Access

| Permission | Access |
| --- | --- |
| `VIEW_SECRETS` or `MANAGE_SECRETS` | List metadata through `/admin/secrets`. |
| `ACCESS_BPM_ADMIN` or `ACCESS_BPM_MODELER` | Read the shared `/secrets/available` catalog. |
| `MANAGE_SECRETS` | Create, update, rotate, and delete workspace secrets. |

## Operations

| Method | Path | Summary |
| --- | --- | --- |
| `GET` | `/admin/secrets` | listSecrets |
| `POST` | `/admin/secrets` | createSecret |
| `DELETE` | `/admin/secrets/{id}` | deleteSecret |
| `PUT` | `/admin/secrets/{id}` | updateSecret |
| `GET` | `/ai/credentials` | listCredentials |
| `POST` | `/ai/credentials` | createCredential |
| `DELETE` | `/ai/credentials/{id}` | deleteCredential |
| `GET` | `/ai/credentials/{id}` | getCredential |
| `GET` | `/ai/credentials/{id}/valid` | isCredentialValid |
| `GET` | `/ai/credentials/available` | listAvailableCredentials |
| `GET` | `/secrets/available` | listAvailableSecrets |

## Shared runtime catalog

Use `GET /secrets/available` to select workspace secrets for API Tasks, AI Tasks, and Agent Processes. Requires `ACCESS_BPM_ADMIN` or `ACCESS_BPM_MODELER`. There is no request body; secret values are never returned.

```bash
curl -X GET "http://localhost:8080/secrets/available" \
  -H "Authorization: Bearer $TOKEN"
```

Example response (`200 OK`):

```json
[
  {
    "id": "3f3c7af7-34ae-4dd4-96e4-cbcba52c6b8f",
    "name": "customer-support-openai",
    "providerId": "openai",
    "credentialType": "API_KEY",
    "maskedToken": "sk-l***...mple",
    "reference": "@secret:customer-support-openai",
    "description": "Used by the customer-support agent",
    "createdAt": "2026-06-17T10:00:00",
    "updatedAt": "2026-06-17T10:00:00",
    "lastUsedAt": null
  }
]
```

## List secrets

```bash
curl -X GET "http://localhost:8080/admin/secrets" \
  -H "Authorization: Bearer $TOKEN"
```

The response is an array of [AICredentialResponseDto](./schemas) records.

## Create a secret

```bash
curl -X POST "http://localhost:8080/admin/secrets" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "customer-support-openai",
    "providerId": "openai",
    "credentialType": "API_KEY",
    "token": "sk-live-redacted-example",
    "description": "Used by the customer-support agent"
  }'
```

The response includes an `id`, `reference`, and `maskedToken`, but never the submitted `token`. Use the returned reference in an AI or Agent Process provider configuration.

## Update or rotate a secret

```bash
curl -X PUT "http://localhost:8080/admin/secrets/3f3c7af7-34ae-4dd4-96e4-cbcba52c6b8f" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "customer-support-openai",
    "providerId": "openai",
    "credentialType": "API_KEY",
    "token": "sk-live-new-redacted-example",
    "description": "Rotated customer-support agent key"
  }'
```

Send `token` only when rotating the secret value.

## Delete a secret

```bash
curl -X DELETE "http://localhost:8080/admin/secrets/3f3c7af7-34ae-4dd4-96e4-cbcba52c6b8f" \
  -H "Authorization: Bearer $TOKEN"
```

Deleting a secret does not remove the configurations that reference it; update those configurations before deletion.

See [Permissions](../reference/permissions) for role assignment and [Keycloak and OIDC](../deployment/keycloak) for Keycloak role mapping.

## User credential routes

All `/ai/credentials` routes require `ACCESS_BPM_ADMIN` or `ACCESS_BPM_MODELER`, in addition to their ownership checks.

The existing `/ai/credentials` routes use the same vault and DTOs. Create, list, and delete operate on the authenticated user's credentials. `/ai/credentials/available` lists active user and workspace credentials; get and validity checks accept owned or workspace IDs. Use `/admin/secrets` to manage shared secrets and `/secrets/available` for the shared modeler catalog.

## GET /ai/credentials

| Property | Value |
| --- | --- |
| Operation ID | `listCredentials` |
| Auth | Bearer token required unless security is disabled. |
| Response DTO | [AICredentialResponseDto](./schemas)[] |

### Example request

```bash
curl -X GET "http://localhost:8080/ai/credentials" \
  -H "Authorization: Bearer $TOKEN"
```

### Responses

| Status | Description | Schema |
| --- | --- | --- |
| `200` | OK | [AICredentialResponseDto](./schemas)[] |

### Example response

Status: `200 OK`

```json
[
  {
    "id": "3f3c7af7-34ae-4dd4-96e4-cbcba52c6b8f",
    "name": "customer-support-openai",
    "providerId": "openai",
    "credentialType": "API_KEY",
    "maskedToken": "sk-***...mple",
    "reference": "@secret:customer-support-openai",
    "description": "Used by the customer-support agent",
    "createdAt": "2026-06-17T10:00:00",
    "updatedAt": "2026-06-17T10:00:00",
    "lastUsedAt": null
  }
]
```

<a id="post-ai-credentials"></a>
## POST /ai/credentials

| Property | Value |
| --- | --- |
| Operation ID | `createCredential` |
| Auth | Bearer token required unless security is disabled. |
| Request DTO | [AICredentialCreateRequestDto](./schemas) |
| Request content type | `application/json` |
| Response DTO | [AICredentialResponseDto](./schemas) |

### Request body

| Required | Content type | DTO/schema |
| --- | --- | --- |
| Yes | `application/json` | [AICredentialCreateRequestDto](./schemas) |

Example request body:

```json
{
  "name": "customer-support-openai",
  "providerId": "openai",
  "credentialType": "API_KEY",
  "token": "sk-live-redacted-example",
  "description": "Used by the customer-support agent"
}
```

### Example request

```bash
curl -X POST "http://localhost:8080/ai/credentials" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
  "name": "customer-support-openai",
  "providerId": "openai",
  "credentialType": "API_KEY",
  "token": "sk-live-redacted-example",
  "description": "Used by the customer-support agent"
}'
```

### Responses

| Status | Description | Schema |
| --- | --- | --- |
| `201` | Created | [AICredentialResponseDto](./schemas) |

### Example response

Status: `201 Created`

```json
{
  "id": "3f3c7af7-34ae-4dd4-96e4-cbcba52c6b8f",
  "name": "customer-support-openai",
  "providerId": "openai",
  "credentialType": "API_KEY",
  "maskedToken": "sk-***...mple",
  "reference": "@secret:customer-support-openai",
  "description": "Used by the customer-support agent",
  "createdAt": "2026-06-17T10:00:00",
  "updatedAt": "2026-06-17T10:00:00",
  "lastUsedAt": null
}
```

<a id="get-ai-credentials-available"></a>
## GET /ai/credentials/available

Lists credentials available for selection by AI and Agent Process configuration. The token is never returned; clients receive metadata, a masked token, and the stable `reference`.

```bash
curl -X GET "http://localhost:8080/ai/credentials/available" \
  -H "Authorization: Bearer $TOKEN"
```

The response is an array of [AICredentialResponseDto](./schemas).

<a id="get-ai-credentials-id"></a>
## GET /ai/credentials/\{id\}

| Property | Value |
| --- | --- |
| Operation ID | `getCredential` |
| Auth | Bearer token required unless security is disabled. |
| Response DTO | [AICredentialResponseDto](./schemas) |

### Parameters

| Name | In | Required | Type | Description |
| --- | --- | --- | --- | --- |
| `id` | path | Yes | string |  |

### Example request

```bash
curl -X GET "http://localhost:8080/ai/credentials/123" \
  -H "Authorization: Bearer $TOKEN"
```

### Responses

| Status | Description | Schema |
| --- | --- | --- |
| `200` | OK | [AICredentialResponseDto](./schemas) |

### Example response

Status: `200 OK`

```json
{
  "id": "3f3c7af7-34ae-4dd4-96e4-cbcba52c6b8f",
  "providerId": "openai",
  "credentialType": "API_KEY",
  "maskedToken": "sk-***...mple",
  "createdAt": "2026-06-17T10:00:00",
  "updatedAt": "2026-06-17T10:00:00",
  "lastUsedAt": null
}
```

<a id="delete-ai-credentials-id"></a>
## DELETE /ai/credentials/\{id\}

| Property | Value |
| --- | --- |
| Operation ID | `deleteCredential` |
| Auth | Bearer token required unless security is disabled. |
| Response DTO | `No body` |

### Parameters

| Name | In | Required | Type | Description |
| --- | --- | --- | --- | --- |
| `id` | path | Yes | string |  |

### Example request

```bash
curl -X DELETE "http://localhost:8080/ai/credentials/123" \
  -H "Authorization: Bearer $TOKEN"
```

### Responses

| Status | Description | Schema |
| --- | --- | --- |
| `200` | OK | - |

### Example response

Status: `204 No Content`

_No response body._

<a id="get-ai-credentials-id-valid"></a>
## GET /ai/credentials/\{id\}/valid

| Property | Value |
| --- | --- |
| Operation ID | `isCredentialValid` |
| Auth | Bearer token required unless security is disabled. |
| Response DTO | `Map<String, Boolean>` |

### Parameters

| Name | In | Required | Type | Description |
| --- | --- | --- | --- | --- |
| `id` | path | Yes | string |  |

### Example request

```bash
curl -X GET "http://localhost:8080/ai/credentials/123/valid" \
  -H "Authorization: Bearer $TOKEN"
```

### Responses

| Status | Description | Schema |
| --- | --- | --- |
| `200` | OK | `object` |

### Example response

Status: `200 OK`

```json
{
  "valid": true
}
```
