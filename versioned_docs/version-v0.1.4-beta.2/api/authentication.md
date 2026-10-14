---
title: Authentication API
---

# Authentication API

Use the Authentication API to inspect the current user and discover the configured sign-in mode. Easy BPM supports local username/password authentication and OIDC authentication through Keycloak or another compatible provider.

## Token flow

For local authentication:

1. Call `POST /auth/login` with username and password.
2. Store the returned Easy BPM JWT in your client session.
3. Send `Authorization: Bearer <token>` on protected requests.

For OIDC authentication, the web applications obtain an access token from the configured provider using the authorization-code flow with PKCE, then send that token on protected requests. Call `GET /auth/config` to determine which flow is enabled, and `GET /auth/me` to inspect the mapped Easy BPM identity and permissions.

## Operations

| Method | Path | Summary |
| --- | --- | --- |
| `GET` | `/api/users/me` | me_1 |
| `GET` | `/auth/config` | config |
| `POST` | `/auth/login` | login |
| `GET` | `/auth/me` | me |

## POST /auth/login

| Property | Value |
| --- | --- |
| Operation ID | `login` |
| Auth | No token required. |
| Request DTO | [LoginRequest](./schemas) |
| Request content type | `application/json` |
| Response DTO | [LoginResponse](./schemas) |

### Request body

| Required | Content type | DTO/schema |
| --- | --- | --- |
| Yes | `application/json` | [LoginRequest](./schemas) |

Example request body:

```json
{
  "username": "admin",
  "password": "admin"
}
```

### Example request

```bash
curl -X POST "http://localhost:8080/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
  "username": "admin",
  "password": "admin"
}'
```

### Responses

| Status | Description | Schema |
| --- | --- | --- |
| `200` | OK | [LoginResponse](./schemas) |

### Example response

Status: `200 OK`

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

<a id="get-auth-me"></a>
## GET /auth/me

| Property | Value |
| --- | --- |
| Operation ID | `me` |
| Auth | Bearer token required unless security is disabled. |
| Response DTO | [CurrentUserResponse](./schemas) |

### Example request

```bash
curl -X GET "http://localhost:8080/auth/me" \
  -H "Authorization: Bearer $TOKEN"
```

### Responses

| Status | Description | Schema |
| --- | --- | --- |
| `200` | OK | [CurrentUserResponse](./schemas) |

### Example response

Status: `200 OK`

```json
{
  "id": 1,
  "username": "admin",
  "identityProvider": "LOCAL",
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

## GET /auth/config

This endpoint is public so clients can select the correct login flow. With local authentication it returns `{ "provider": "local" }`. With Keycloak/OIDC it also returns the issuer, client ID, and authorization, token, and logout endpoints used by the web applications.

Example local response:

```json
{
  "provider": "local",
  "oidc": null
}
```

Example OIDC response:

```json
{
  "provider": "oidc",
  "oidc": {
    "issuerUri": "https://keycloak.example.com/realms/easybpm",
    "clientId": "easybpm-web",
    "authorizationEndpoint": "https://keycloak.example.com/realms/easybpm/protocol/openid-connect/auth",
    "tokenEndpoint": "https://keycloak.example.com/realms/easybpm/protocol/openid-connect/token",
    "logoutEndpoint": "https://keycloak.example.com/realms/easybpm/protocol/openid-connect/logout"
  }
}
```

See [Keycloak and OIDC](../deployment/keycloak) for the server configuration and role mapping.

## GET /api/users/me

Returns the current authenticated user for API clients. It uses the same [CurrentUserResponse](./schemas) shape as `GET /auth/me`.

```bash
curl -X GET "http://localhost:8080/api/users/me" \
  -H "Authorization: Bearer $TOKEN"
```
