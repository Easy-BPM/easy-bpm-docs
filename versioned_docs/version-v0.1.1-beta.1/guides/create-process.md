---
title: Create a Process
---

# Create a Process

An Easy BPM process is created visually in the Modeler and deployed as BPMN 2.0 XML. For automation or CI/CD, you can also send BPMN XML directly to `POST /processes`.

## Basic process shape

Every process definition needs:

| Field | Description |
| --- | --- |
| BPMN process `id` | Stable identifier used to start the latest version. |
| BPMN process `name` | Display name shown to users and operators. |
| Executable flow nodes | Start events, tasks, gateways, message events, timers, and end events. |
| Sequence flows | Connections between nodes. |

## Minimal approval process

```xml
<?xml version="1.0" encoding="UTF-8"?>
<bpmn:definitions xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL">
  <bpmn:process id="expense-approval" name="Expense Approval" isExecutable="true">
    <bpmn:startEvent id="start" />
    <bpmn:userTask id="manager-review" name="Manager Review" />
    <bpmn:endEvent id="end" />
    <bpmn:sequenceFlow id="flow_start_review" sourceRef="start" targetRef="manager-review" />
    <bpmn:sequenceFlow id="flow_review_end" sourceRef="manager-review" targetRef="end" />
  </bpmn:process>
</bpmn:definitions>
```

## Deploy and start

```bash
curl -X POST http://localhost:8080/processes \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/xml" \
  --data-binary @expense-approval.bpmn
```

Start the latest deployed version by process key:

```bash
curl -X POST http://localhost:8080/processes/expense-approval/start \
  -H "Authorization: Bearer $TOKEN"
```

## Supported node types

| Type | Use for |
| --- | --- |
| `StartEvent` | Entry point for a process. |
| `EndEvent` | Completion point. |
| `HumanTask` | User work shown in the Task Portal. |
| `APITask` | HTTP/API work published to the async worker. |
| `ServiceTask` | Service work. |
| `ScriptTask` | Inline script-style variable work. |
| `CodeTask` | JVM method execution from an uploaded JAR. |
| `AiTask` | AI provider execution using stored credentials or environment references. |
| `ExclusiveGateway` | Choose one path based on conditions. |
| `ParallelGateway` | Fork or synchronize parallel paths. |
| `TimerEvent` | Wait for a configured duration. |
| `MessageEvent` | Message start or message-style wait using properties. |
| `MessageIntermediateCatchEvent` | Wait for an external message correlation. |
| `MessageIntermediateThrowEvent` | Publish or emit a message payload. |
| `ErrorBoundaryEvent` | Catch failures from an attached task or call activity. |
| `CallActivity` | Start another deployed process as a subprocess. |

## Best practices

Use stable IDs such as `manager-review`, not generated labels, because IDs are referenced by flows, admin token movement, audits, and integrations.

Keep process variables small and business-oriented. Store files through document endpoints and keep only document IDs or metadata in variables.

Use the Modeler for day-to-day process creation. Use direct BPMN XML deployment for CI/CD, generated process definitions, or controlled migration workflows.
