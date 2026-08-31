---
title: Permissions
---

# Permissions

Easy BPM uses permission codes assigned directly to users or through groups.

| Permission | Purpose |
| --- | --- |
| `ACCESS_BPM_ADMIN` | Access administrative process operations and admin-facing APIs. |
| `ACCESS_PROCESS_PORTAL` | Access task portal workflows, tasks, forms, processes, and documents. |
| `ACCESS_BPM_MODELER` | Access process and form modeling/deployment APIs. |
| `VIEW_USERS` | View local users. |
| `MANAGE_USERS` | Create, update, delete, and reset users. |
| `VIEW_GROUPS` | View local groups and memberships. |
| `MANAGE_GROUPS` | Create, update, delete, and manage groups. |
| `MANAGE_PERMISSIONS` | Permission administration where enabled. |
| `VIEW_SECRETS` | View workspace secret metadata; secret values remain masked. |
| `MANAGE_SECRETS` | Create, rotate, and remove workspace secrets. |

## Suggested customer roles

| Role | Permissions |
| --- | --- |
| Modeler | `ACCESS_BPM_MODELER` |
| Portal user | `ACCESS_PROCESS_PORTAL` |
| Operator | `ACCESS_BPM_ADMIN`, `ACCESS_PROCESS_PORTAL` |
| Security admin | `VIEW_USERS`, `MANAGE_USERS`, `VIEW_GROUPS`, `MANAGE_GROUPS`, `MANAGE_PERMISSIONS` |
| Secret manager | `VIEW_SECRETS`, `MANAGE_SECRETS` |
| Platform admin | All permissions |

When Keycloak/OIDC is enabled, map these permissions from Keycloak roles instead of assigning them manually. See [Keycloak and OIDC](../deployment/keycloak).
