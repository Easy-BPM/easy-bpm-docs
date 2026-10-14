---
title: Docker start
---

# Docker start

Use Docker Compose when you want the fastest local Easy BPM environment. The compose stack starts the platform services together so you can focus on modeling and running processes.

## Prerequisites

| Dependency | Version |
| --- | --- |
| Docker | Docker Desktop or Docker Engine with Compose support |
| Git | Any recent version |

You do not need to install Java, PostgreSQL, RabbitMQ, or Node.js locally when you run the platform through Docker.

## Start Easy BPM

Clone the main Easy BPM repository and start the compose stack:

```bash
git clone https://github.com/Easy-BPM/easyBPM.git
cd easyBPM
docker compose up -d
```

Docker starts the backend, worker, web apps, PostgreSQL, and RabbitMQ containers.

## Check the containers

```bash
docker compose ps
```

All core services should be running. If a service is still starting, wait a few seconds and check again.

To inspect logs:

```bash
docker compose logs -f
```

To inspect a single service:

```bash
docker compose logs -f backend
```

## Open the apps

| App | Local URL |
| --- | --- |
| Modeler | `http://localhost:3000` |
| Admin Console | `http://localhost:3001` |
| Task Portal | `http://localhost:3002` |
| Backend API | `http://localhost:8080` |
| RabbitMQ Management | `http://localhost:15672` |

Depending on the compose configuration or local port usage, Admin and Task Portal may also run on Vite ports such as `5173` and `5174`.

## Sign in

On first startup, Easy BPM bootstraps an administrator account unless you override it with environment variables.

| Username | Password |
| --- | --- |
| `admin` | `admin` |

Change this password before exposing any environment to external users.

## Verify the API

Create an API token:

```bash
TOKEN=$(curl -s http://localhost:8080/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin"}' \
  | jq -r ".token")
```

Check the authenticated user:

```bash
curl http://localhost:8080/auth/me \
  -H "Authorization: Bearer $TOKEN"
```

## Stop the stack

Stop containers without deleting stored data:

```bash
docker compose down
```

Stop containers and remove local volumes:

```bash
docker compose down -v
```

Use `down -v` only when you want to reset local process definitions, instances, tasks, forms, users, and audit records.

## Next steps

- Run a tutorial process with [Run your first BPMN process](./run-first-process).
- Connect an agent with [Build your first AI agent](./build-first-agent).
- Add people to the workflow with [Orchestrate human tasks](./build-human-tasks).
