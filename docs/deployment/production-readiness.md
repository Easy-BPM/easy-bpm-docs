---
title: Production readiness
---

# Production readiness

Use this guide when you are preparing Easy BPM for a shared, customer-facing, or production-like environment. It turns the deployment guides into an operational checklist: what must be stateful, what can scale horizontally, what needs external infrastructure, and what signals administrators should monitor.

## Production architecture

Easy BPM is designed as a set of independently deployable runtimes around PostgreSQL and RabbitMQ.

![Easy BPM production architecture](/img/architecture/easybpm-production-architecture.svg)

| Component | Responsibility | Scaling model |
| --- | --- | --- |
| Backend API | Deploys process definitions, starts instances, advances runtime state, exposes REST APIs, handles Admin operations, and consumes completion/message events. | Scale replicas horizontally behind a load balancer. |
| Worker | Executes asynchronous API/service work from RabbitMQ and returns completion events. | Scale replicas horizontally to increase external task throughput. |
| Modeler | Browser app for modeling BPMN processes, forms, AI tasks, Agent Processes, and integrations. | Scale as stateless web replicas. |
| Admin Console | Browser app for operational inspection, users/groups, incidents, variables, and maintenance. | Scale as stateless web replicas. |
| Task Portal | Browser app for starting processes and completing human tasks. | Scale as stateless web replicas. |
| PostgreSQL | Source of truth for definitions, instances, variables, tasks, documents, worker requests, incidents, security, and audit records. | Use managed PostgreSQL or an operated HA database cluster. |
| RabbitMQ | Queueing layer for async service work, retries, DLQ, completions, and workflow events. | Use managed RabbitMQ or an operated HA broker. |

The application pods are replaceable. PostgreSQL and RabbitMQ are part of the production data plane and need their own backup, monitoring, patching, and scaling plan.

## Recommended baseline

| Area | Recommendation |
| --- | --- |
| Runtime | Kubernetes with the Helm chart at `deploy/helm/easybpm`. |
| Database | Managed PostgreSQL with automated backups, point-in-time recovery, monitoring, and tested restore procedures. |
| Broker | Managed RabbitMQ or a production-grade RabbitMQ operator with persistent storage and queue monitoring. |
| Secrets | External secret manager, sealed secrets, or an existing Kubernetes Secret referenced by `existingSecretName`. |
| Ingress | HTTPS ingress or load balancer with host-based routing for API and web apps. |
| Identity | OIDC/Keycloak for shared environments; avoid shared bootstrap admin accounts. |
| Observability | Prometheus scrape of backend actuator metrics, centralized logs, RabbitMQ queue metrics, and database health checks. |
| Releases | Immutable image tags, one tag across backend, worker, modeler, admin, and task portal. |

## Scale the backend

Increase backend replicas when you need more capacity for:

- API traffic from the Modeler, Admin Console, Task Portal, and integrations
- process instance starts
- task completion requests
- message correlation
- worker completion callbacks
- operational searches and admin actions

Process instance advancement uses database locking when a specific instance is updated. That means multiple backend replicas can process many instances concurrently, while a single instance is protected from conflicting updates.

Recommended starting point:

```yaml
backend:
  replicaCount: 2
```

Scale further based on CPU, memory, request latency, database write latency, and RabbitMQ completion backlog.

## Scale workers

Workers are the main scaling lever for asynchronous API and service work. Add worker replicas when RabbitMQ request queue depth grows or when external calls spend most of their time waiting on network responses.

![Easy BPM worker scaling flow](/img/architecture/easybpm-worker-scaling-flow.svg)

Recommended starting point:

```yaml
worker:
  replicaCount: 2
```

Throughput depends heavily on the average latency of the systems the worker calls:

```text
worker throughput ~= worker count / average external API latency
```

This is an estimate, not a limit. Validate it with the benchmark in [Capacity planning](./capacity-planning) using a workflow shape and external latency that match your environment.

Worker execution includes:

- idempotency tracking by process instance and node
- retry handling with exponential backoff
- DLQ routing after retry exhaustion
- completion events back to the backend

When scaling workers, monitor:

- RabbitMQ `service-task-requests` queue depth
- retry and DLQ counts
- external API latency and error rate
- worker CPU and memory
- PostgreSQL write latency for worker request updates

## Scale web apps

Modeler, Admin Console, and Task Portal are stateless web applications. Scale them when browser traffic increases or when you need rolling updates without interruption.

Keep frontend API URLs aligned with the public route users access:

| App | Configuration |
| --- | --- |
| Admin Console | `EASY_BPM_ADMIN_API_BASE_URL` |
| Modeler | `EASY_BPM_MODELER_API_BASE_URL` or Helm `web.modeler.apiBaseUrl` |
| Task Portal | `EASY_BPM_TASK_PORTAL_API_BASE_URL` |

When using ingress paths that route API traffic through the same host as each web app, make sure `/auth`, `/processes`, `/forms`, `/tasks`, `/code-tasks`, `/admin`, `/api`, and `/actuator` route to the backend.

## Stateful dependencies

PostgreSQL and RabbitMQ should be treated as external dependencies for production.

For PostgreSQL:

- enable automated backups and point-in-time recovery
- test restore procedures before launch
- monitor connection usage, write latency, query latency, locks, disk growth, and replication lag
- keep the database close to the Kubernetes cluster to reduce latency
- use persistent storage with enough IOPS for process state writes and task searches

For RabbitMQ:

- use persistent queues and durable storage
- monitor queue depth, publish rate, consume rate, acknowledgements, retries, and DLQ volume
- alert when queue depth grows faster than workers can drain it
- keep RabbitMQ close to backend and worker pods
- define an operational path for replaying or resolving DLQ work

## High availability

Easy BPM application runtimes can run as multiple replicas. Production availability still depends on the whole system:

| Layer | HA requirement |
| --- | --- |
| Kubernetes | Multiple nodes, pod disruption budgets, resource requests, and rolling update strategy. |
| Backend | At least two replicas for API availability and callback consumption. |
| Worker | At least two replicas for async work continuity. |
| Web apps | At least two replicas for user-facing availability. |
| PostgreSQL | HA database or managed service with tested failover and backups. |
| RabbitMQ | HA broker or managed service with persistent queues. |
| Ingress | Redundant ingress/load balancer with TLS certificates monitored for expiry. |

A single-node Kind or Docker setup is useful for validation, but it is not a production HA design.

## Security checklist

Before exposing Easy BPM outside a local machine:

- replace `EASY_BPM_SERVER_SECURITY_JWT_SECRET`
- replace `EASY_BPM_SERVER_AI_ENCRYPTION_KEY`
- change bootstrap admin credentials
- configure OIDC or Keycloak for named users
- assign least-privilege groups and permissions
- keep provider tokens on the backend only
- use Kubernetes secrets or an external secret manager
- expose only required actuator endpoints
- terminate TLS at ingress or load balancer
- restrict database and RabbitMQ network access to application runtimes

## Observability checklist

Monitor these signals before increasing production traffic:

| Signal | Why it matters |
| --- | --- |
| Backend health | Confirms API and dependency connectivity. |
| Backend request latency | Shows pressure from users, integrations, and callbacks. |
| Process start and completion counts | Confirms workflow throughput. |
| Node execution duration | Identifies slow process steps. |
| Human task age | Shows operational backlog in the Task Portal. |
| Worker request queue depth | Shows async backpressure. |
| Worker retry and DLQ counts | Shows external integration instability. |
| PostgreSQL write/query latency | Shows state persistence bottlenecks. |
| RabbitMQ publish/consume rate | Shows whether workers are keeping up. |
| Pod restarts | Indicates memory, health check, dependency, or configuration problems. |

See [Observability](./observability) for the backend actuator endpoints and runtime signals.

## Upgrade strategy

Use the same immutable image tag across all Easy BPM runtime images in one release:

```yaml
global:
  imageTag: v0.1.2-beta.2
```

Recommended upgrade flow:

1. Review release notes and configuration changes.
2. Back up PostgreSQL.
3. Confirm RabbitMQ is healthy and queues are draining normally.
4. Apply Helm changes in a staging environment.
5. Run smoke tests: login, deploy process, start process, complete task, execute worker path.
6. Upgrade production with Helm.
7. Watch pod rollout, backend health, queue depth, incidents, and process completion rate.

Rollback requires both application compatibility and database compatibility. Treat database migrations as part of the release plan.

## Production readiness checklist

Use this checklist before launch:

- Helm values are environment-specific and stored outside the application repo when needed.
- Placeholder secrets are removed.
- PostgreSQL backups and restore tests are complete.
- RabbitMQ persistence and DLQ handling are defined.
- Backend, worker, and web app replicas are set for expected traffic.
- Resource requests and limits are configured.
- Ingress, DNS, TLS, and API URLs are validated.
- OIDC/Keycloak access model is tested with real groups.
- Prometheus/logging dashboards and alerts are ready.
- Retention policy is decided and documented.
- Upgrade and rollback procedure is rehearsed in staging.
