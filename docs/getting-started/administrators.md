---
title: Helm setup
---

# Helm setup

This guide is for administrators who want to validate Easy BPM on Kubernetes before preparing a shared environment. It uses Kind for a local cluster and the Easy BPM Helm chart from the main repository.

For developer setup, use [Docker start](./quick-start).

## What you will deploy

The Helm chart at `deploy/helm/easybpm` deploys:

| Runtime | Kubernetes resource |
| --- | --- |
| Backend API | Deployment and ClusterIP service |
| Worker | Deployment |
| Modeler | Deployment and ClusterIP service |
| Admin Console | Deployment and ClusterIP service |
| Task Portal | Deployment and ClusterIP service |
| Secrets | Kubernetes Secret, unless `existingSecretName` is set |
| Ingress | Optional, disabled by default |

PostgreSQL and RabbitMQ are not bundled in the Easy BPM chart. For production, use managed services or platform-owned operators. For a local Kind validation, this guide creates simple in-cluster services.

## Prerequisites

| Tool | Purpose |
| --- | --- |
| Docker | Runs the Kind cluster nodes. |
| Kind | Creates the local Kubernetes cluster. |
| kubectl | Inspects and manages Kubernetes resources. |
| Helm | Installs the Easy BPM chart. |
| Git | Clones the main Easy BPM repository. |

## Create a Kind cluster

```bash
kind create cluster --name easybpm
kubectl cluster-info --context kind-easybpm
```

Create a namespace:

```bash
kubectl create namespace easybpm
```

## Add local dependencies

For a local administrator lab, create PostgreSQL and RabbitMQ inside the Kind cluster:

```bash
kubectl -n easybpm create secret generic easybpm-local-dependencies \
  --from-literal=POSTGRES_DB=easybpm \
  --from-literal=POSTGRES_USER=easybpm \
  --from-literal=POSTGRES_PASSWORD=change-me \
  --from-literal=RABBITMQ_DEFAULT_USER=easybpm \
  --from-literal=RABBITMQ_DEFAULT_PASS=change-me
```

```bash
kubectl -n easybpm create deployment postgres \
  --image=postgres:15-alpine \
  --env-from=secretRef=easybpm-local-dependencies

kubectl -n easybpm expose deployment postgres \
  --port=5432 \
  --target-port=5432
```

```bash
kubectl -n easybpm create deployment rabbitmq \
  --image=rabbitmq:3-management-alpine \
  --env-from=secretRef=easybpm-local-dependencies

kubectl -n easybpm expose deployment rabbitmq \
  --port=5672 \
  --target-port=5672
```

Wait until both pods are running:

```bash
kubectl -n easybpm get pods
```

## Prepare Helm values

Clone the main repository:

```bash
git clone https://github.com/Easy-BPM/easyBPM.git
cd easyBPM
```

Create `values.kind.yaml`:

You can also use the starter file [values.kind.yaml](/data/setup/values.kind.yaml).

```yaml
global:
  imageRegistry: "ghcr.io/<github-owner>"
  imageTag: v0.1.2-beta.2
  imagePullPolicy: IfNotPresent

backend:
  replicaCount: 1

worker:
  replicaCount: 1

web:
  admin:
    enabled: true
    host: admin.easybpm.local
  modeler:
    enabled: true
    host: modeler.easybpm.local
    apiBaseUrl: ""
    agenticOrchestration:
      enabled: true
  taskPortal:
    enabled: true
    host: portal.easybpm.local

ingress:
  enabled: false

secrets:
  create: true
  postgres:
    url: jdbc:postgresql://postgres.easybpm.svc.cluster.local:5432/easybpm
    username: easybpm
    password: change-me
  rabbitmq:
    host: rabbitmq.easybpm.svc.cluster.local
    port: "5672"
    username: easybpm
    password: change-me
  security:
    adminUsername: admin
    adminPassword: change-me
    jwtSecretBase64: replace-with-32-byte-minimum-base64-secret
  ai:
    encryptionKey: replace-with-strong-ai-credential-key
    openaiApiKey: ""
    geminiApiKey: ""
```

Replace `ghcr.io/<github-owner>` with the registry that contains your Easy BPM images, and replace all placeholder secrets before using this outside a local lab.

Generate local secret values:

```bash
openssl rand -base64 32
openssl rand -base64 32
```

Use one generated value for `secrets.security.jwtSecretBase64` and another for `secrets.ai.encryptionKey`.

## Install Easy BPM with Helm

```bash
helm upgrade --install easybpm deploy/helm/easybpm \
  --namespace easybpm \
  --values values.kind.yaml
```

Check the rollout:

```bash
kubectl -n easybpm get pods
kubectl -n easybpm get svc
```

If a pod is not ready, inspect it:

```bash
kubectl -n easybpm describe pod <pod-name>
kubectl -n easybpm logs <pod-name>
```

## Open the apps

For Kind validation without ingress, use port forwarding:

```bash
kubectl -n easybpm port-forward svc/easybpm-easybpm-backend 8080:8080
```

In separate terminals:

```bash
kubectl -n easybpm port-forward svc/easybpm-easybpm-modeler 3000:8080
kubectl -n easybpm port-forward svc/easybpm-easybpm-admin 3001:8080
kubectl -n easybpm port-forward svc/easybpm-easybpm-task-portal 3002:8080
```

Then open:

| App | Local URL |
| --- | --- |
| Modeler | `http://localhost:3000` |
| Admin Console | `http://localhost:3001` |
| Task Portal | `http://localhost:3002` |
| Backend API | `http://localhost:8080` |

## Sign in

Use the administrator account from `values.kind.yaml`:

| Username | Password |
| --- | --- |
| `admin` | `change-me` |

Change this password before running a shared environment.

## Upgrade

Edit `values.kind.yaml`, then apply the release again:

```bash
helm upgrade easybpm deploy/helm/easybpm \
  --namespace easybpm \
  --values values.kind.yaml
```

Use the same immutable image tag across backend, worker, modeler, admin, and task portal in one release.

## Uninstall

Remove Easy BPM from the cluster:

```bash
helm uninstall easybpm --namespace easybpm
```

Delete the Kind cluster:

```bash
kind delete cluster --name easybpm
```

## Production notes

- Use managed PostgreSQL and RabbitMQ where possible.
- Set `ingress.enabled=true` only after your ingress controller, DNS, and TLS plan are ready.
- Use `existingSecretName` when secrets are created by an external secret manager.
- Do not keep placeholder passwords or generated lab credentials in a public environment.
- Set resource requests and limits before using the chart for shared workloads.

For the broader production checklist, scaling model, worker guidance, and operational signals, see [Production readiness](../deployment/production-readiness).
