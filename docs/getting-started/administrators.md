---
title: Helm setup
---

# Helm setup

This guide covers a local Windows/PowerShell lab using the chart and images from **v0.1.3-beta.2**. It was checked on Docker Desktop with Minikube, Helm 3.17.3, and Kubernetes 1.34.0. For developer setup, use [Docker start](./quick-start).

:::warning Release limitations
The unmodified installation does not work end to end. The published frontend images expect a service named `backend`, while this Helm release creates `easybpm-easybpm-backend`. This guide supplies a lab-only DNS alias.

After that workaround, the backend health check and Admin login passed. Modeler login passed, but Agents/AI requests returned HTML instead of JSON. Task Portal's published bundle uses `http://localhost:8080` and did not authenticate against the isolated backend on port 18080. Do not treat this release as a fully validated production deployment. See [Known failures](#known-failures).
:::

## Prerequisites

Install Docker Desktop (Linux containers), Minikube, kubectl, Helm 3, and Git. Start Docker Desktop. Use a kubectl version compatible with your cluster.

Run the following in PowerShell. Commands use a single line so that Bash line-continuation characters are not needed.

```powershell
docker version
minikube version
kubectl version --client
helm version
git --version
```

Docker must report both client and server information. Allow at least 2 CPUs and 4 GiB for this lab, in addition to resources used by your other applications.

## Pin the source and create an isolated cluster

Use a new checkout so that existing development files are not changed:

```powershell
git clone --branch v0.1.3-beta.2 --depth 1 https://github.com/Easy-BPM/easyBPM.git easybpm-helm-lab
cd easybpm-helm-lab
minikube start -p easybpm-helm-test --driver=docker --cpus=2 --memory=4096 --keep-context
kubectl --context=easybpm-helm-test cluster-info
kubectl --context=easybpm-helm-test create namespace easybpm
```

All subsequent commands explicitly select this lab context. If the namespace already exists from a previous attempt, reuse it. These instructions assume release `easybpm`, namespace `easybpm`, and the chart's default resource names.

## Download the lab files

Save these files in the checkout's root:

- [local-dependencies.yaml](/data/setup/local-dependencies.yaml)
- [backend-alias.yaml](/data/setup/backend-alias.yaml)
- [values.kind.yaml](/data/setup/values.kind.yaml) — the filename is retained for existing links; these values also work with Minikube.

The dependency manifest creates PostgreSQL and RabbitMQ Deployments and Services with disposable lab credentials. It does not configure persistent volumes: replacing a dependency pod can lose its data. Use managed services or production operators for shared environments.

```powershell
kubectl --context=easybpm-helm-test -n easybpm apply -f local-dependencies.yaml
kubectl --context=easybpm-helm-test -n easybpm rollout status deployment/postgres --timeout=180s
kubectl --context=easybpm-helm-test -n easybpm rollout status deployment/rabbitmq --timeout=180s
kubectl --context=easybpm-helm-test -n easybpm exec deployment/postgres -- pg_isready -U easybpm -d easybpm
kubectl --context=easybpm-helm-test -n easybpm exec deployment/rabbitmq -- rabbitmq-diagnostics -q ping
```

Continue only when the database accepts connections and RabbitMQ responds. If their initialization is still in progress, rerun the corresponding check. Do not use `kubectl create deployment --env-from`: that flag is unsupported.

## Prepare values and secrets

The supplied values select:

- Registry `ghcr.io/easy-bpm` and image tag `v0.1.3-beta.2` for all five applications.
- Database `postgres.easybpm.svc.cluster.local:5432/easybpm` and broker `rabbitmq.easybpm.svc.cluster.local:5672`.
- Lab database/broker user `easybpm` and password `change-me`; administrator `admin` / `change-me`.
- Disabled ingress and initially zero worker replicas, so the backend can migrate the database first.

Generate **two independent** secret values with PowerShell:

```powershell
$labRng = [System.Security.Cryptography.RandomNumberGenerator]::Create()
$labBytes = New-Object byte[] 32
$labRng.GetBytes($labBytes)
[Convert]::ToBase64String($labBytes)
$labRng.GetBytes($labBytes)
[Convert]::ToBase64String($labBytes)
$labRng.Dispose()
```

In your local `values.kind.yaml`, replace `secrets.security.jwtSecretBase64` with the first result and `secrets.ai.encryptionKey` with the second. Do not install with the placeholder strings. Keep this file private and out of Git. Keep the same keys on upgrades.

## Install the chart

Create the alias **before** installing the frontend pods:

```powershell
kubectl --context=easybpm-helm-test -n easybpm apply -f backend-alias.yaml
helm lint deploy/helm/easybpm --values values.kind.yaml
helm upgrade --install easybpm deploy/helm/easybpm --kube-context easybpm-helm-test --namespace easybpm --values values.kind.yaml --wait --timeout 10m
kubectl --context=easybpm-helm-test -n easybpm rollout status deployment/easybpm-easybpm-backend --timeout=300s
```

If a command fails, inspect the failure before continuing. The alias points `backend` to `easybpm-easybpm-backend.easybpm.svc.cluster.local`; update it if you change the release name, namespace, or naming overrides. It is a separate resource, not managed by this chart.

After the backend is ready, enable the worker:

```powershell
helm upgrade easybpm deploy/helm/easybpm --kube-context easybpm-helm-test --namespace easybpm --values values.kind.yaml --set worker.replicaCount=1 --wait --timeout 10m
kubectl --context=easybpm-helm-test -n easybpm get deployments
kubectl --context=easybpm-helm-test -n easybpm logs deployment/easybpm-easybpm-worker --tail=50
```

Change `worker.replicaCount` to `1` in your local values file for subsequent upgrades. Confirm all seven Deployments are available, and check that the worker has connected to RabbitMQ. Its chart has no readiness probe, so a Running pod alone does not prove the worker is operational.

## Open the applications

Run **each command in its own terminal** and leave it running. These ports avoid the usual local development ports:

```powershell
kubectl --context=easybpm-helm-test -n easybpm port-forward svc/easybpm-easybpm-backend 18080:8080
```

```powershell
kubectl --context=easybpm-helm-test -n easybpm port-forward svc/easybpm-easybpm-admin 13001:8080
```

```powershell
kubectl --context=easybpm-helm-test -n easybpm port-forward svc/easybpm-easybpm-modeler 13000:8080
```

```powershell
kubectl --context=easybpm-helm-test -n easybpm port-forward svc/easybpm-easybpm-task-portal 13002:8080
```

| Application | URL | Result observed with v0.1.3-beta.2 and the alias |
| --- | --- | --- |
| Backend | http://localhost:18080/actuator/health | Returned `UP`. |
| Admin | http://localhost:13001 | Login and empty dashboard passed. |
| Modeler | http://localhost:13000 | Login passed; Agents/AI resource loading failed. |
| Task Portal | http://localhost:13002 | Login page loaded; bundle targets localhost:8080 instead of the isolated backend. |

Sign in with `admin` / `change-me` unless you changed the lab values. Check backend health from a separate PowerShell terminal:

```powershell
Invoke-RestMethod http://localhost:18080/actuator/health
```

## Known failures

| Symptom | Cause and next step |
| --- | --- |
| `unknown flag: --env-from` | Use the supplied dependency manifest instead of the old tutorial commands. |
| `host not found in upstream "backend"` / frontend CrashLoopBackOff | Apply the alias and confirm its target. Failed pods retry automatically. The durable fix belongs in the chart/frontend upstream configuration. |
| Modeler `Unexpected token '<'` | The published Nginx configuration omits `/agent-processes` and `/ai`. Those requests return the SPA HTML; direct backend requests return JSON. Correct the proxy configuration and publish updated images or a tested chart override. The DNS alias alone does not fix these routes. |
| Task Portal login does not reach this backend | The compiled bundle contains `http://localhost:8080`. An empty build argument falls back to that address. A corrected frontend build must preserve an empty same-origin URL or provide runtime configuration. Setting a pod environment variable does not rewrite the compiled JavaScript. |
| Worker reports missing `data_retention_settings` | On a new database, it can start before backend migrations finish. Start it after backend readiness as shown above. |
| `ImagePullBackOff` | Inspect pod events for the exact image, registry access, tag, and network failure. The public tag used here is `v0.1.3-beta.2`. |
| Helm reports `deployed`, but the UI fails | Resource creation is not an end-to-end check. Verify readiness, logs, health, login, and data loading separately. |
| Connection refused from kubectl | Verify Docker and the named Minikube profile are running; use the explicit context in this guide. |

Do not point Task Portal at an unrelated local backend merely to bypass the login problem. Forwarding this backend to port 8080 may help a local-only setup if that port is free, but that workaround was not validated in this test and does not fix a remote deployment.

Useful diagnostics (replace `POD_NAME` with a name from the first command):

```powershell
kubectl --context=easybpm-helm-test -n easybpm get pods
kubectl --context=easybpm-helm-test -n easybpm get events --sort-by=.lastTimestamp
kubectl --context=easybpm-helm-test -n easybpm describe pod POD_NAME
kubectl --context=easybpm-helm-test -n easybpm logs POD_NAME --tail=100
kubectl --context=easybpm-helm-test -n easybpm logs POD_NAME --previous --tail=100
```

The test did not validate ingress/TLS, persistent storage, AI providers, or a complete process/task lifecycle.

## Upgrade and cleanup

For upgrades, retain your generated secrets, use matching chart/image versions, and keep `worker.replicaCount: 1` in your local values:

```powershell
helm upgrade easybpm deploy/helm/easybpm --kube-context easybpm-helm-test --namespace easybpm --values values.kind.yaml --wait --timeout 10m
```

Stop port forwarding with Ctrl+C. To pause the lab without deleting its cluster:

```powershell
minikube stop -p easybpm-helm-test
```

To remove only the Helm-managed application resources:

```powershell
helm uninstall easybpm --kube-context easybpm-helm-test --namespace easybpm
```

The dependency resources and backend alias remain after uninstall. To permanently remove the **entire disposable lab and its data**:

```powershell
minikube delete -p easybpm-helm-test
```

For shared environments, use persistent managed dependencies, private secret management, resource limits, and a tested ingress/TLS configuration. Resolve the release limitations above before production deployment. See [Production readiness](../deployment/production-readiness).
