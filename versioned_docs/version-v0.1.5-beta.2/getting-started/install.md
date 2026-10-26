---
title: Installation
---

# Installation

Easy BPM can run as individual local processes during development or as Kubernetes workloads for shared environments.

## Local development layout

| Runtime | Command |
| --- | --- |
| PostgreSQL and RabbitMQ | Start local services or connect to managed development instances |
| Backend API | `./gradlew bootRun` |
| Worker | `./gradlew :worker:bootRun` |
| Modeler | `cd easy-bpm-modeler && npm run dev` |
| Admin Console | `cd easy-bpm-admin && npm run dev` |
| Task Portal | `cd easy-bpm-task-portal && npm run dev` |

Install web dependencies before first run:

```bash
npm install
```

## Shared environments

For shared environments, use the Kubernetes manifests or Helm chart maintained with the platform repository.
Set `IMAGE_REGISTRY=ghcr.io/<org-or-user>` and `IMAGE_TAG=<release-tag>` in your environment values.

## Backend database setup

The backend uses Flyway migrations from `src/main/resources/db/migration`. Migrations run automatically when the backend starts with `spring.flyway.enabled=true`.

Use a persistent PostgreSQL volume in all non-temporary environments. Do not use a throwaway database for customer workflows because process state, documents, users, and audit records are stored there.

## Build artifacts

Build the backend:

```bash
./gradlew clean build
```

Build web apps:

```bash
cd easy-bpm-modeler && npm run build
cd ../easy-bpm-admin && npm run build
cd ../easy-bpm-task-portal && npm run build
```

## Production guidance

For production, run each runtime as an immutable image:

| Image | Runtime |
| --- | --- |
| `ghcr.io/<org-or-user>/easybpm-backend:<tag>` | Backend API |
| `ghcr.io/<org-or-user>/easybpm-worker:<tag>` | Async worker |
| `ghcr.io/<org-or-user>/easybpm-modeler:<tag>` | Modeler UI |
| `ghcr.io/<org-or-user>/easybpm-admin:<tag>` | Admin UI |
| `ghcr.io/<org-or-user>/easybpm-task-portal:<tag>` | Task Portal UI |

Use managed PostgreSQL and RabbitMQ where possible. Put HTTPS, host-based routing, request limits, and access logs in front of the web apps and backend API.
