---
title: Keycloak and OIDC
---

# Keycloak and OIDC

Easy BPM uses local username/password authentication by default. Set up Keycloak when users should authenticate through an external identity provider and the backend should validate OIDC access tokens.

## Configure the backend

Configure the issuer URL and client ID in the backend environment:

```yaml
easybpm:
  authentication:
    provider: keycloak
    user-provisioning:
      enabled: true
      default-permission-codes: ACCESS_PROCESS_PORTAL
    oidc:
      issuer-uri: ${EASYBPM_OIDC_ISSUER_URI}
      client-id: ${EASYBPM_OIDC_CLIENT_ID}
      audience: ${EASYBPM_OIDC_AUDIENCE}
      group-claim: groups
      username-claim: preferred_username
```

Easy BPM validates token signatures, issuer, and expiry. It also validates the audience when `EASYBPM_OIDC_AUDIENCE` is set. Users are matched by the OIDC `sub` claim; their username, email, and display name are synchronized when available. Disable just-in-time provisioning if all users must be created locally before first sign-in.

The Modeler, Task Portal, and Admin Console read `/auth/config` and redirect users to the configured provider. Local username/password login is not the sign-in path when OIDC is enabled.

## Roles and groups

Token groups are available to task authorization, so a candidate group can match a Keycloak group such as `customer-support`.

Map Keycloak realm or client roles to Easy BPM permissions with `easybpm.authentication.oidc.role-mappings`. The built-in mappings are:

| Keycloak role | Easy BPM permission |
| --- | --- |
| `easybpm-user` | `ACCESS_PROCESS_PORTAL` |
| `easybpm-modeler` | `ACCESS_BPM_MODELER` |
| `easybpm-admin` | `ACCESS_BPM_ADMIN` |
| `easybpm-admin-users-read` / `easybpm-admin-users-manage` | `VIEW_USERS` / `MANAGE_USERS` |
| `easybpm-admin-groups-read` / `easybpm-admin-groups-manage` | `VIEW_GROUPS` / `MANAGE_GROUPS` |
| `easybpm-admin-permissions-manage` | `MANAGE_PERMISSIONS` |
| `easybpm-admin-secrets-read` / `easybpm-admin-secrets-manage` | `VIEW_SECRETS` / `MANAGE_SECRETS` |

`easybpm-admin` grants access to the Admin Console. Assign the fine-grained roles separately when a user must administer local users, groups, permissions, or workspace secrets.

## Local development

The repository includes a Keycloak compose override and a development realm. Keep the main compose command for local authentication. To run Keycloak locally instead:

```powershell
$env:EASYBPM_KEYCLOAK_ADMIN="local-admin"
$env:EASYBPM_KEYCLOAK_ADMIN_PASSWORD="choose-a-local-password"
docker compose -f docker-compose.yml -f docker-compose.keycloak.yml up -d
```

The default public issuer is `http://localhost:8081/realms/easybpm`. The backend uses an internal JWK address inside Docker to validate tokens. For a different hostname, set `EASYBPM_KEYCLOAK_PUBLIC_URL`, `EASYBPM_OIDC_ISSUER_URI`, and the client redirect URIs consistently.

Create development users in Keycloak, then assign the roles and groups required by their Easy BPM responsibilities.
