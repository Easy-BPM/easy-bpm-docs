---
title: Configuration
---

# Configuration

Easy BPM is configured with environment variables. Backend and worker variables use the `EASY_BPM_<APP>_<SETTING>` format. Authentication/OIDC variables use the existing `EASYBPM_*` prefix. Third-party containers keep their native names, such as `POSTGRES_DB` and `RABBITMQ_DEFAULT_USER`.

This page covers the variables used by the Easy BPM application configuration, Docker Compose files, beta Docker deployment, and Helm chart.

## Docker Compose variables

The local `docker-compose.yml` includes development defaults directly in the file. The beta compose file reads the values from an environment file.

| Variable | Default or example | Used by | Description |
| --- | --- | --- | --- |
| `IMAGE_REGISTRY` | `ghcr.io/YOUR_GITHUB_ORG_OR_USER` | Beta Docker | Container registry that stores Easy BPM images. |
| `IMAGE_TAG` | `v0.1.0-beta.1` | Beta Docker | Image tag used for backend, worker, admin, modeler, and task portal. |
| `POSTGRES_DB` | `easybpm` | PostgreSQL | Database name created by the PostgreSQL container. |
| `POSTGRES_USER` | `easybpm` | PostgreSQL, beta backend/worker | Database user. |
| `POSTGRES_PASSWORD` | `change-me-postgres` | PostgreSQL, beta backend/worker | Database password. |
| `RABBITMQ_DEFAULT_USER` | `easybpm` | RabbitMQ, beta backend/worker | RabbitMQ user created by the RabbitMQ container. |
| `RABBITMQ_DEFAULT_PASS` | `change-me-rabbitmq` | RabbitMQ, beta backend/worker | RabbitMQ password. |

The development compose file also exposes these fixed local defaults:

| Service | Local value |
| --- | --- |
| PostgreSQL user | `meu_usuario` |
| PostgreSQL password | `minha_senha` |
| PostgreSQL database | `easybpm` |
| RabbitMQ user | `easybpm` |
| RabbitMQ password | `easybpm` |

## Backend server

| Variable | Default | Description |
| --- | --- | --- |
| `EASY_BPM_SERVER_PORT` | `8080` | Backend HTTP port. |
| `EASY_BPM_SERVER_DATASOURCE_URL` | `jdbc:postgresql://localhost:5432/easybpm` | PostgreSQL JDBC URL used by the backend. |
| `EASY_BPM_SERVER_DATASOURCE_USERNAME` | `meu_usuario` | PostgreSQL username used by the backend. |
| `EASY_BPM_SERVER_DATASOURCE_PASSWORD` | `minha_senha` | PostgreSQL password used by the backend. |
| `EASY_BPM_SERVER_RABBITMQ_HOST` | `localhost` | RabbitMQ host used by the backend. |
| `EASY_BPM_SERVER_RABBITMQ_PORT` | `5672` | RabbitMQ AMQP port used by the backend. |
| `EASY_BPM_SERVER_RABBITMQ_USERNAME` | `easybpm` | RabbitMQ username used by the backend. |
| `EASY_BPM_SERVER_RABBITMQ_PASSWORD` | `easybpm` | RabbitMQ password used by the backend. |

## Worker

| Variable | Default | Description |
| --- | --- | --- |
| `EASY_BPM_WORKER_PORT` | `0` | Worker HTTP port. `0` lets the runtime choose an available port because the worker usually runs as a background processor. |
| `EASY_BPM_WORKER_DATASOURCE_URL` | `jdbc:postgresql://localhost:5432/easybpm` | PostgreSQL JDBC URL used by the worker. |
| `EASY_BPM_WORKER_DATASOURCE_USERNAME` | `meu_usuario` | PostgreSQL username used by the worker. |
| `EASY_BPM_WORKER_DATASOURCE_PASSWORD` | `minha_senha` | PostgreSQL password used by the worker. |
| `EASY_BPM_WORKER_RABBITMQ_HOST` | `localhost` | RabbitMQ host used by the worker. |
| `EASY_BPM_WORKER_RABBITMQ_PORT` | `5672` | RabbitMQ AMQP port used by the worker. |
| `EASY_BPM_WORKER_RABBITMQ_USERNAME` | `easybpm` | RabbitMQ username used by the worker. |
| `EASY_BPM_WORKER_RABBITMQ_PASSWORD` | `easybpm` | RabbitMQ password used by the worker. |
| `EASY_BPM_WORKER_LOGGING_LEVEL_APP` | `INFO` | Log level for Easy BPM worker application packages. |

## Security

| Variable | Default | Description |
| --- | --- | --- |
| `EASY_BPM_SERVER_SECURITY_ENABLED` | `true` | Enables JWT/RBAC enforcement. Disable only for isolated local experiments. |
| `EASY_BPM_SERVER_SECURITY_JWT_SECRET` | Development-only default | Base64 JWT signing secret. Replace it in every shared or public environment. |
| `EASY_BPM_SERVER_SECURITY_JWT_EXPIRATION_MS` | `3600000` | JWT lifetime in milliseconds. The local compose file sets `86400000`. |
| `EASY_BPM_SERVER_SECURITY_BOOTSTRAP_ADMIN_USERNAME` | `admin` | Username for the first administrator account. |
| `EASY_BPM_SERVER_SECURITY_BOOTSTRAP_ADMIN_PASSWORD` | `admin` | Password for the first administrator account. |
| `EASY_BPM_SERVER_SECURITY_BOOTSTRAP_ADMIN_GROUP_CODE` | `ADMIN` | Code for the bootstrap administrator group. |
| `EASY_BPM_SERVER_SECURITY_BOOTSTRAP_ADMIN_GROUP_NAME` | `Administrators` | Display name for the bootstrap administrator group. |

The default administrator credentials are for local startup only. Override them before exposing Easy BPM to other users.

## Authentication and OIDC

| Variable | Default | Description |
| --- | --- | --- |
| `EASYBPM_AUTHENTICATION_PROVIDER` | `local` | Authentication mode. Use `local` for Easy BPM username/password auth or `keycloak` for Keycloak/OIDC. |
| `EASYBPM_AUTHENTICATION_USER_PROVISIONING_ENABLED` | `true` | Creates an Easy BPM user record for a valid OIDC user when one does not already exist. |
| `EASYBPM_AUTHENTICATION_USER_PROVISIONING_DEFAULT_PERMISSION_CODES` | `ACCESS_PROCESS_PORTAL` | Comma-separated permissions assigned to provisioned OIDC users by default. |
| `EASYBPM_OIDC_ISSUER_URI` | Empty | Public OIDC issuer URI. Required when OIDC authentication is enabled. |
| `EASYBPM_OIDC_JWK_SET_URI` | Empty | Optional internal JWK endpoint. Useful when the backend reaches Keycloak over a Docker or Kubernetes network. |
| `EASYBPM_OIDC_CLIENT_ID` | `easybpm` | OIDC client ID used by Easy BPM apps. |
| `EASYBPM_OIDC_AUDIENCE` | Empty | Expected token audience. The Keycloak compose override defaults this to `easybpm`. |
| `EASYBPM_OIDC_GROUP_CLAIM` | `groups` | Claim used to read external group names. |
| `EASYBPM_OIDC_USERNAME_CLAIM` | `preferred_username` | Claim used as the Easy BPM username. |

The backend maps these OIDC roles to Easy BPM permissions:

| OIDC role | Easy BPM permission |
| --- | --- |
| `easybpm-admin` | `ACCESS_BPM_ADMIN` |
| `easybpm-modeler` | `ACCESS_BPM_MODELER` |
| `easybpm-user` | `ACCESS_PROCESS_PORTAL` |
| `easybpm-admin-users-read` | `VIEW_USERS` |
| `easybpm-admin-users-manage` | `MANAGE_USERS` |
| `easybpm-admin-groups-read` | `VIEW_GROUPS` |
| `easybpm-admin-groups-manage` | `MANAGE_GROUPS` |
| `easybpm-admin-permissions-manage` | `MANAGE_PERMISSIONS` |
| `easybpm-admin-secrets-read` | `VIEW_SECRETS` |
| `easybpm-admin-secrets-manage` | `MANAGE_SECRETS` |

## Local Keycloak compose

Use these variables with `docker-compose.keycloak.yml`:

| Variable | Default | Description |
| --- | --- | --- |
| `EASYBPM_KEYCLOAK_ADMIN` | Required | Keycloak administrator username for the local Keycloak container. |
| `EASYBPM_KEYCLOAK_ADMIN_PASSWORD` | Required | Keycloak administrator password for the local Keycloak container. |
| `EASYBPM_KEYCLOAK_PUBLIC_URL` | `http://localhost:8081` | Public Keycloak URL used by browser redirects. |
| `EASYBPM_OIDC_ISSUER_URI` | `http://localhost:8081/realms/easybpm` | OIDC issuer used by Easy BPM when Keycloak compose is enabled. |
| `EASYBPM_OIDC_JWK_SET_URI` | `http://keycloak:8080/realms/easybpm/protocol/openid-connect/certs` | Internal JWK URL used by the backend container. |
| `EASYBPM_OIDC_CLIENT_ID` | `easybpm` | OIDC client ID. |
| `EASYBPM_OIDC_AUDIENCE` | `easybpm` | Expected token audience. |

The Keycloak container itself receives `KEYCLOAK_ADMIN`, `KEYCLOAK_ADMIN_PASSWORD`, `KC_HOSTNAME`, `KC_HOSTNAME_STRICT=false`, and `KC_HTTP_ENABLED=true` from the compose override.

## Web applications

| Variable | Default | Description |
| --- | --- | --- |
| `EASY_BPM_ADMIN_API_BASE_URL` | `http://localhost:8080` | Backend URL used by the Admin Console. |
| `EASY_BPM_TASK_PORTAL_API_BASE_URL` | `http://localhost:8080` | Backend URL used by the Task Portal. |
| `EASY_BPM_MODELER_API_BASE_URL` | `http://localhost:8080` | Backend URL used by the Modeler. |
| `EASY_BPM_MODELER_AGENTIC_ORCHESTRATION` | Disabled in Helm, enabled in the local modeler config | Enables the Agent Process resource and Agent Process BPM node in the Modeler. Truthy values include `true`, `1`, `yes`, `on`, and `enabled`. |
| `EASY_BPM_MODELER_DEFAULT_AI_PROVIDER` | Empty | Default provider selected in the Agent Process editor, such as `ollama`, `openai`, `gemini`, or `azure-openai`. |
| `EASY_BPM_MODELER_DEFAULT_AI_MODEL` | Empty | Default model selected in the Agent Process editor. |
| `EASY_BPM_MODELER_DEFAULT_AI_CREDENTIAL_REF` | Empty | Default credential reference selected in the Agent Process editor. Use an environment reference like `$OPENAI_API_KEY`, a stored credential ID, or a workspace secret reference. |
| `EASY_BPM_MODELER_RUNTIME_MODE` | Empty | Runtime mode consumed by the Modeler. The desktop preload sets this to `desktop`. |
| `EASY_BPM_DESKTOP_DEV` | Empty | Electron desktop development flag. Set to `true` to load the dev URL. |
| `EASY_BPM_DESKTOP_DEV_URL` | `http://127.0.0.1:3000` | Modeler desktop dev URL used when `EASY_BPM_DESKTOP_DEV=true`. |

The frontend Dockerfile also accepts these build arguments with the same names:

- `APP_DIR`
- `EASY_BPM_ADMIN_API_BASE_URL`
- `EASY_BPM_MODELER_API_BASE_URL`
- `EASY_BPM_MODELER_AGENTIC_ORCHESTRATION`
- `EASY_BPM_MODELER_DEFAULT_AI_PROVIDER`
- `EASY_BPM_MODELER_DEFAULT_AI_MODEL`
- `EASY_BPM_MODELER_DEFAULT_AI_CREDENTIAL_REF`
- `EASY_BPM_TASK_PORTAL_API_BASE_URL`

`APP_DIR` selects which frontend folder is built, such as `easy-bpm-admin`, `easy-bpm-modeler`, or `easy-bpm-task-portal`.

## AI credentials and providers

| Variable | Default | Description |
| --- | --- | --- |
| `EASY_BPM_SERVER_AI_ENCRYPTION_KEY` | Development-only default | Encryption key used by the backend credential vault. Replace it in every shared or public environment. |
| `OPENAI_API_KEY` | Empty | OpenAI API key used when an AI task or Agent Process references `$OPENAI_API_KEY`. |
| `GEMINI_API_KEY` | Empty | Google Gemini API key used when an AI task or Agent Process references `$GEMINI_API_KEY`. |
| `AZURE_OPENAI_API_KEY` | Empty | Azure OpenAI API key used when an AI task or Agent Process references `$AZURE_OPENAI_API_KEY`. |

Do not pass provider tokens to frontend containers. Provider credentials must be available to the backend through environment variables, stored credentials, or workspace secrets.

## Test data

| Variable | Default | Description |
| --- | --- | --- |
| `EASY_BPM_TEST_DATA` | Falls back to `EASY_BPM_SERVER_TEST_DATA_ENABLED`, then `false` | Enables seeded test data on backend startup. |
| `EASY_BPM_SERVER_TEST_DATA_ENABLED` | `false` | Backend-specific test data flag. |
| `EASY_BPM_TEST_DATA_QA_RESOURCE_PATH` | `modeler-qa/qa-processes` | Classpath resource path used for QA process seed data. |

Keep test data disabled in customer environments unless you intentionally need seeded demo content.

## Retention

| Variable | Default | Description |
| --- | --- | --- |
| `EASY_BPM_SERVER_RETENTION_ENABLED` | `false` | Enables scheduled cleanup of completed process and task data. |
| `EASY_BPM_SERVER_RETENTION_COMPLETED_PROCESS_RETENTION_DAYS` | `90` | Number of days to keep completed process data. |
| `EASY_BPM_SERVER_RETENTION_COMPLETED_TASK_RETENTION_DAYS` | `90` | Number of days to keep completed task data. |
| `EASY_BPM_SERVER_RETENTION_BATCH_SIZE` | `500` | Maximum records processed per cleanup batch. |
| `EASY_BPM_SERVER_RETENTION_CRON` | `0 0 3 * * *` | Cleanup schedule in Spring cron format. |

Retention day values must be between 1 and 3650.

## Logging and actuator

| Variable | Default | Description |
| --- | --- | --- |
| `EASY_BPM_SERVER_LOGGING_LEVEL_ROOT` | `INFO` | Root backend log level. |
| `EASY_BPM_SERVER_LOGGING_LEVEL_APP` | `DEBUG` | Backend log level for Easy BPM application packages. The beta Docker and Helm defaults use `INFO`. |
| `EASY_BPM_SERVER_LOGGING_LEVEL_HIBERNATE` | `WARN` | Backend Hibernate log level. |
| `EASY_BPM_WORKER_LOGGING_LEVEL_APP` | `INFO` | Worker log level for Easy BPM packages. |
| `EASY_BPM_SERVER_MANAGEMENT_ENDPOINTS_WEB_EXPOSURE_INCLUDE` | `health,metrics,prometheus` | Comma-separated actuator endpoints exposed over HTTP. |
| `EASY_BPM_SERVER_MANAGEMENT_HEALTH_SHOW_DETAILS` | `always` | Actuator health detail visibility. Helm uses `when_authorized` by default. |

The backend exposes:

| Endpoint | Purpose |
| --- | --- |
| `/actuator/health` | Application and dependency health. |
| `/actuator/metrics` | Runtime metrics index. |
| `/actuator/prometheus` | Prometheus scrape endpoint. |

## Helm values

The chart at `deploy/helm/easybpm` converts Helm values into Kubernetes deployments, config maps, and secrets.

| Value | Default | Description |
| --- | --- | --- |
| `nameOverride` | Empty | Optional Helm release name override for the chart name portion. |
| `fullnameOverride` | Empty | Optional full Kubernetes resource name override. |
| `global.imageRegistry` | `ghcr.io/YOUR_GITHUB_ORG_OR_USER` | Registry used for all Easy BPM images. |
| `global.imageTag` | `v0.1.2-beta.2` | Image tag used for all Easy BPM images. |
| `global.imagePullPolicy` | `IfNotPresent` | Kubernetes image pull policy. |
| `backend.replicaCount` | `1` | Number of backend replicas. |
| `backend.image` | `easybpm-backend` | Backend image name under `global.imageRegistry`. |
| `backend.service.port` | `8080` | Backend service port. |
| `backend.resources` | `{}` | Backend Kubernetes resource requests and limits. |
| `worker.replicaCount` | `1` | Number of worker replicas. |
| `worker.image` | `easybpm-worker` | Worker image name under `global.imageRegistry`. |
| `worker.resources` | `{}` | Worker Kubernetes resource requests and limits. |
| `web.admin.enabled` | `true` | Deploys the Admin Console. |
| `web.admin.image` | `easybpm-admin` | Admin image name under `global.imageRegistry`. |
| `web.admin.host` | `admin.easybpm.local` | Admin ingress host when ingress is enabled. |
| `web.modeler.enabled` | `true` | Deploys the Modeler. |
| `web.modeler.image` | `easybpm-modeler` | Modeler image name under `global.imageRegistry`. |
| `web.modeler.host` | `modeler.easybpm.local` | Modeler ingress host when ingress is enabled. |
| `web.modeler.apiBaseUrl` | Empty | Runtime backend URL written into `easybpm-config.js` for the Modeler. |
| `web.modeler.agenticOrchestration.enabled` | `false` | Enables Agent Process features in the Modeler runtime config. |
| `web.taskPortal.enabled` | `true` | Deploys the Task Portal. |
| `web.taskPortal.image` | `easybpm-task-portal` | Task Portal image name under `global.imageRegistry`. |
| `web.taskPortal.host` | `portal.easybpm.local` | Task Portal ingress host when ingress is enabled. |
| `web.service.port` | `8080` | Web app service port. |
| `web.resources` | `{}` | Web app Kubernetes resource requests and limits. |
| `ingress.enabled` | `false` | Creates ingress resources when enabled. |
| `ingress.className` | `nginx` | Ingress class name. |
| `ingress.tls` | `[]` | TLS entries for ingress. |
| `ingress.apiHost` | `api.easybpm.local` | Backend API ingress host. |
| `config.loggingLevelComEasyBpm` | `INFO` | Sets `EASY_BPM_SERVER_LOGGING_LEVEL_APP`. |
| `config.managementHealthShowDetails` | `when_authorized` | Sets `EASY_BPM_SERVER_MANAGEMENT_HEALTH_SHOW_DETAILS`. |
| `config.testDataEnabled` | `false` | Sets `EASY_BPM_TEST_DATA` and `EASY_BPM_SERVER_TEST_DATA_ENABLED`. |
| `config.retention.enabled` | `false` | Sets `EASY_BPM_SERVER_RETENTION_ENABLED`. |
| `config.retention.completedProcessRetentionDays` | `90` | Sets completed process retention days. |
| `config.retention.completedTaskRetentionDays` | `90` | Sets completed task retention days. |
| `config.retention.batchSize` | `500` | Sets retention batch size. |
| `config.retention.cron` | `0 0 3 * * *` | Sets retention cron. |
| `secrets.create` | `true` | Creates a Kubernetes Secret from chart values when `existingSecretName` is empty. |
| `secrets.postgres.url` | `jdbc:postgresql://postgres.example:5432/easybpm` | Backend and worker PostgreSQL JDBC URL. |
| `secrets.postgres.username` | `easybpm` | Backend and worker PostgreSQL username. |
| `secrets.postgres.password` | `change-me` | Backend and worker PostgreSQL password. |
| `secrets.rabbitmq.host` | `rabbitmq.example` | Backend and worker RabbitMQ host. |
| `secrets.rabbitmq.port` | `5672` | Backend and worker RabbitMQ port. |
| `secrets.rabbitmq.username` | `easybpm` | Backend and worker RabbitMQ username. |
| `secrets.rabbitmq.password` | `change-me` | Backend and worker RabbitMQ password. |
| `secrets.security.adminUsername` | `admin` | Bootstrap administrator username. |
| `secrets.security.adminPassword` | `change-me` | Bootstrap administrator password. |
| `secrets.security.jwtSecretBase64` | `replace-with-32-byte-minimum-base64-secret` | JWT signing secret. |
| `secrets.ai.encryptionKey` | `replace-with-strong-ai-credential-key` | Backend AI credential encryption key. |
| `secrets.ai.openaiApiKey` | Empty | Optional `OPENAI_API_KEY` added to the backend secret. |
| `secrets.ai.geminiApiKey` | Empty | Optional `GEMINI_API_KEY` added to the backend secret. |
| `existingSecretName` | Empty | Uses an existing Kubernetes Secret instead of creating one from `secrets.*`. |

When you use `existingSecretName`, the secret must provide the same environment variable names generated by the chart secret template, including backend and worker datasource/RabbitMQ values.

## CORS and origins

By default, the backend allows local browser origins such as `http://localhost:*` and `http://127.0.0.1:*`. For production, configure routing so the web apps and backend share approved origins, or update the backend security configuration if your deployment needs a different CORS policy.
