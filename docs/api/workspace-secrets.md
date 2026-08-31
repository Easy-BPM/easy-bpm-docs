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
| `GET` | `/admin/secrets` | List workspace secrets. |
| `POST` | `/admin/secrets` | Create a workspace secret. |
| `PUT` | `/admin/secrets/{id}` | Update metadata or rotate a secret. |
| `DELETE` | `/admin/secrets/{id}` | Delete a workspace secret. |

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

To rotate a secret, send `PUT /admin/secrets/{id}` with a replacement `token`. Deleting a secret does not remove the configurations that reference it; update those configurations before deletion.

See [Permissions](../reference/permissions) for role assignment and [Keycloak and OIDC](../deployment/keycloak) for Keycloak role mapping.
