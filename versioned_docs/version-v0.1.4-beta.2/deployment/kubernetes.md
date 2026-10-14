---
title: Kubernetes Deployment
---

# Kubernetes Deployment

Easy BPM includes a Helm chart at `deploy/helm/easybpm` for Kubernetes deployments.

## Install with Helm

For the tested Windows/Minikube lab, use [Helm setup](../getting-started/administrators). It pins the chart and images to `v0.1.3-beta.2`, provides dependency manifests, and documents the required backend service alias.

:::warning v0.1.3-beta.2
This release is not validated end to end on Kubernetes. Frontend images expect `backend:8080`, while the default release creates `easybpm-easybpm-backend`. The published proxy also omits Agents/AI routes, and Task Portal's compiled bundle targets `localhost:8080`. A successful Helm install does not resolve these issues. Review the [known failures](../getting-started/administrators#known-failures) before deployment.
:::

The command below assumes you are in the matching platform source checkout, have a configured cluster context, and have prepared `values.customer.yaml` with reachable PostgreSQL/RabbitMQ services, valid secrets, and published image names/tags. On a fresh database, initially set `worker.replicaCount: 0`, wait for backend readiness and migrations, then upgrade with `worker.replicaCount: 1`.

```bash
helm upgrade --install easybpm deploy/helm/easybpm \
  --namespace easybpm \
  --create-namespace \
  -f values.customer.yaml \
  --wait --timeout 10m
```

## Recommended architecture

Use managed services where available:

| Dependency | Recommendation |
| --- | --- |
| PostgreSQL | Managed database with backups and point-in-time recovery. |
| RabbitMQ | Managed broker or a production-grade RabbitMQ operator. |
| Secrets | Cloud secret manager or sealed/encrypted Kubernetes secrets. |
| Ingress | HTTPS ingress with host-based routing for API and web apps. |
| Metrics | Prometheus scrape for backend actuator endpoints. |

## Images

Deploy one image per runtime:

| Runtime | Image |
| --- | --- |
| Backend | `easybpm-backend` |
| Worker | `easybpm-worker` |
| Modeler | `easybpm-modeler` |
| Admin | `easybpm-admin` |
| Task Portal | `easybpm-task-portal` |

Use the same immutable tag across all Easy BPM images in one release.

For `v0.1.3-beta.2`, use registry `ghcr.io/easy-bpm` and match the chart checkout to that tag. Verify application login and data loading after readiness checks; pod readiness alone does not validate frontend API routing.

## Agentic orchestration values

Enable the Agent Process resource and Agent Process BPM node in the Modeler with Helm values:

```yaml
web:
  modeler:
    apiBaseUrl: "https://api.easybpm.example.com"
    agenticOrchestration:
      enabled: true
```

The chart renders those values into `easybpm-config.js` and mounts it into the Modeler container, so the feature flag can be changed per deployment without rebuilding the frontend image.

To run provider-backed Agent Processes, provide the backend provider token as a Kubernetes secret value:

```yaml
secrets:
  ai:
    encryptionKey: "replace-with-strong-ai-credential-key"
    openaiApiKey: "sk-..."
    geminiApiKey: "AIza..."
```

Use only the keys you need. Agent Process definitions that use `"credentialRef": "$OPENAI_API_KEY"` or `"credentialRef": "$GEMINI_API_KEY"` resolve those values from the backend pod environment. For production, prefer a sealed secret, external secret operator, or `existingSecretName`.
