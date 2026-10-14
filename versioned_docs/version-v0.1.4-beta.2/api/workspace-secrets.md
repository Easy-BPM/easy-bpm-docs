---
title: Workspace Secrets API
---

# Workspace Secrets API

Workspace secrets are encrypted credentials managed by Easy BPM administrators. They can be referenced by AI and Agent Process configuration without exposing the underlying token to modelers or portal users.

The API never returns a secret value. It returns a masked token and a stable reference instead.

## Access

| Permission | Access |
| --- | --- |
| `VIEW_SECRETS` | List workspace secret metadata. |
| `MANAGE_SECRETS` | Create, update, rotate, and delete workspace secrets. |

## Operations

| Method | Path | Summary |
| --- | --- | --- |
| `GET` | `/admin/secrets` | listSecrets |
| `POST` | `/admin/secrets` | createSecret |
| `DELETE` | `/admin/secrets/{id}` | deleteSecret |
| `PUT` | `/admin/secrets/{id}` | updateSecret |

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
    "description": "Rotated customer-support agent key",
    "permissions": ["agent:customer-support"]
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
