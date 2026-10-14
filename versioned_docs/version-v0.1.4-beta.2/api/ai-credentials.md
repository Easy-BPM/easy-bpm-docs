---
title: AI Credentials API
---

# AI Credentials API

Use the AI Credentials API to store provider credentials server-side and reference masked credential IDs from AI tasks.

## Operations

| Method | Path | Summary |
| --- | --- | --- |
| `GET` | `/ai/credentials` | listCredentials |
| `POST` | `/ai/credentials` | createCredential |
| `DELETE` | `/ai/credentials/{id}` | deleteCredential |
| `GET` | `/ai/credentials/{id}` | getCredential |
| `GET` | `/ai/credentials/{id}/valid` | isCredentialValid |
| `GET` | `/ai/credentials/available` | listAvailableCredentials |

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
    "reference": "$CUSTOMER_SUPPORT_OPENAI",
    "description": "Used by the customer-support agent",
    "createdAt": "2026-06-17T10:00:00",
    "updatedAt": "2026-06-17T10:00:00",
    "lastUsedAt": null,
    "permissions": []
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
  "description": "Used by the customer-support agent",
  "permissions": [
    "agent:customer-support"
  ]
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
  "description": "Used by the customer-support agent",
  "permissions": [
    "agent:customer-support"
  ]
}'
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
  "name": "customer-support-openai",
  "providerId": "openai",
  "credentialType": "API_KEY",
  "maskedToken": "sk-***...mple",
  "reference": "$CUSTOMER_SUPPORT_OPENAI",
  "description": "Used by the customer-support agent",
  "createdAt": "2026-06-17T10:00:00",
  "updatedAt": "2026-06-17T10:00:00",
  "lastUsedAt": null,
  "permissions": []
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
  "lastUsedAt": null,
  "permissions": []
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
