---
title: API Clients API
---

# API Clients API

API clients authenticate integrations calling Easy BPM. Their bearer credentials are separate from workspace secrets used by tasks to call external services.

## Operations

| Method | Path | Summary |
| --- | --- | --- |
| `GET` | `/admin/api-clients` | listApiClients |
| `POST` | `/admin/api-clients` | createApiClient |
| `GET` | `/admin/api-clients/{id}` | getApiClient |
| `PATCH` | `/admin/api-clients/{id}` | updateApiClient |
| `GET` | `/admin/api-clients/{id}/audit` | auditApiClient |
| `POST` | `/admin/api-clients/{id}/revoke` | revokeApiClient |
| `POST` | `/admin/api-clients/{id}/rotate` | rotateApiClient |
| `GET` | `/admin/api-clients/assignable-scopes` | assignableScopes |

## Permissions and lifecycle

Listing clients, reading a client, and reading audit history require `VIEW_API_CLIENTS` or `MANAGE_API_CLIENTS`. Creating, updating, rotating, revoking, and listing assignable scopes require `MANAGE_API_CLIENTS`.

Create returns `201 Created`, a `Location` header, an `ETag`, and an [ApiClientCredentialResponse](./schemas). The full `credential` is returned only by create and rotate. Store it securely; list and get return metadata. Send it as `Authorization: Bearer <credential>` when calling permitted product APIs.

```bash
curl -X POST "http://localhost:8080/admin/api-clients" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"task-reader","description":"Task integration","scopes":["tasks:read"]}'
```

The request accepts `name`, `description`, `scopes`, and `expiresAt`. Omitted expiry defaults to 90 days. The response contains `client` metadata and `credential`; for example, its shape is:

```text
{ "client": <ApiClientResponse>, "credential": "<new bearer credential>" }
```

List supports `q`, `status` (`ACTIVE`, `EXPIRED`, or `REVOKED`), `page` (default `0`), and `size` (default `50`, bounded to `1`–`100`). Audit supports `category`, `page`, and `size`. Both return Spring pages with `content` and pagination metadata. `GET /admin/api-clients/assignable-scopes` returns an array of `{ "code": "tasks:read", "name": "Read and search tasks" }` records.

## Update, rotate, and revoke

Read the current `ETag` from get, create, update, or rotate. Send that quoted numeric version as `If-Match` for every mutation of an existing client.

```bash
curl -X PATCH "http://localhost:8080/admin/api-clients/$CLIENT_ID" \
  -H "Authorization: Bearer $TOKEN" \
  -H 'If-Match: "0"' \
  -H "Content-Type: application/json" \
  -d '{"description":"Updated task integration","scopes":["tasks:read"]}'
```

Patch accepts optional `name`, `description`, `scopes`, and `expiresAt` and returns client metadata with a new `ETag`. Rotate uses `POST /admin/api-clients/{id}/rotate`, accepts an optional body with `expiresAt`, and returns a new credential and client metadata. Revoke uses `POST /admin/api-clients/{id}/revoke`, has no request body, and returns `204 No Content`.

Missing `If-Match` returns `428`; malformed values return `400`. Use the latest version after a concurrent update. Errors use [ApiClientErrorResponse](./schemas), including a machine-readable `code`, `correlationId`, and optional `fieldErrors`.
