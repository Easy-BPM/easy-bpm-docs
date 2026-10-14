---
title: Build your first AI agent
---

# Build your first AI agent

This tutorial shows how Easy BPM connects a business process to an AI agent. You will deploy a reusable Agent Process, then call it from a BPM process when a decision needs AI assistance.

## What you will build

You will create a `support-triage-agent` that reads a customer message and returns a suggested priority.

| Part | Role |
| --- | --- |
| Agent Process | Defines the agent goal, model, and operating instructions. |
| BPM process | Decides where the agent fits in the business workflow. |
| Agent Process Call | Sends process variables to the agent and maps outputs back. |

## Before you start

Agent Process support is feature-flagged in the Modeler. Enable it before running the Modeler:

```bash
EASY_BPM_MODELER_AGENTIC_ORCHESTRATION=true npm run dev
```

For local experimentation, you can use `ollama` without storing a credential. For hosted providers, configure a backend environment variable or create a stored credential with the [AI Credentials API](../api/ai-credentials).

## Deploy an Agent Process

Create a reusable agent definition:

```bash
curl -X POST "http://localhost:8080/agent-processes" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "resourceType": "AgentProcess",
    "processKey": "support-triage-agent",
    "processName": "Support Triage Agent",
    "goal": "Classify a customer support request and recommend the next action.",
    "description": "First tutorial agent for support intake triage.",
    "instructions": "Review the customer message, identify urgency signals, classify the request priority, and recommend the next action for the support team.",
    "constraints": [
      "Priority must be one of: High, Medium, Low.",
      "Return a short reason for the classification."
    ],
    "availableTools": [],
    "provider": {
      "providerId": "ollama",
      "modelName": "llama3.2",
      "endpoint": "http://localhost:11434",
      "credentialRef": "",
      "systemPrompt": "You are a support triage agent. Classify the customer message as High, Medium, or Low priority and recommend the next action. Respond only with valid JSON.",
      "promptTemplate": "Goal: {{goal}}\nInstructions: {{instructions}}\nConstraints: {{constraints}}\nInputs: {{inputs}}\n\nUse inputs.customerMessage as the customer message. Return only this JSON shape: {\"priority\":\"High|Medium|Low\",\"reason\":\"short reason\",\"nextAction\":\"recommended support action\"}.",
      "tuningParams": {
        "temperature": 0.2,
        "topP": 1,
        "maxTokens": 1200,
        "retryCount": 0
      }
    },
    "audit": {
      "decisionTraceRequired": true,
      "createdFrom": "easy-bpm-modeler-agent-definition"
    }
  }'
```

The `processKey` is the stable name your BPM process will use when it calls the agent.

## Call the agent from a BPM process

In the Modeler, add an Agent Process node after your start event and set:

| Field | Value |
| --- | --- |
| Agent Process Key | `support-triage-agent` |
| Goal Override | `Classify the current support request.` |
| Wait for Completion | Enabled |
| Timeout Seconds | `120` |

Map the `customerMessage` process variable into the agent:

```json
{
  "targetName": "customerMessage",
  "type": "string",
  "source": "variable",
  "value": "customerMessage"
}
```

Map the agent result back to the process:

```json
{
  "source": "variable",
  "sourceValue": "priority",
  "type": "string",
  "targetVariable": "suggestedPriority"
}
```

## BPMN example

This BPMN process calls the deployed `support-triage-agent`, sends the `customerMessage` process variable, and stores the agent priority in `suggestedPriority`.
The complete process is available as [support-triage.bpmn](/data/getting-started/support-triage.bpmn).

```xml
<?xml version="1.0" encoding="UTF-8"?>
<bpmn:definitions xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" xmlns:dc="http://www.omg.org/spec/DD/20100524/DC" xmlns:easy="https://easybpm.local/bpmn/extensions" id="Definitions_support-triage" targetNamespace="https://easybpm.local/process/support-triage">
  <bpmn:process id="support-triage" name="Support Triage" isExecutable="true">
    <bpmn:extensionElements>
      <easy:metadata><![CDATA[{"version":"1.0"}]]></easy:metadata>
    </bpmn:extensionElements>
    <bpmn:startEvent id="start" name="start">
      <bpmn:extensionElements>
        <easy:node><![CDATA[{"id":"start","name":"start","type":"StartEvent","position":{"x":170,"y":130},"width":40,"height":40,"next":["triage-with-agent"]}]]></easy:node>
      </bpmn:extensionElements>
    </bpmn:startEvent>
    <bpmn:serviceTask id="triage-with-agent" name="Triage with agent">
      <bpmn:extensionElements>
        <easy:node><![CDATA[{"id":"triage-with-agent","name":"Triage with agent","type":"AgentProcessCall","position":{"x":370,"y":120},"width":150,"height":70,"next":["end"],"config":{"agentProcessKey":"support-triage-agent","goal":"Classify the current support request.","waitForCompletion":true,"timeoutSeconds":120,"inputs":[{"targetName":"customerMessage","type":"string","source":"variable","value":"customerMessage"}],"outputs":[{"source":"variable","sourceValue":"priority","type":"string","targetVariable":"suggestedPriority"}]}}]]></easy:node>
      </bpmn:extensionElements>
    </bpmn:serviceTask>
    <bpmn:endEvent id="end" name="end">
      <bpmn:extensionElements>
        <easy:node><![CDATA[{"id":"end","name":"end","type":"EndEvent","position":{"x":700,"y":130},"width":40,"height":40,"next":[]}]]></easy:node>
      </bpmn:extensionElements>
    </bpmn:endEvent>
    <bpmn:sequenceFlow id="Flow_1_start_triage-with-agent" sourceRef="start" targetRef="triage-with-agent"/>
    <bpmn:sequenceFlow id="Flow_2_triage-with-agent_end" sourceRef="triage-with-agent" targetRef="end"/>
  </bpmn:process>
  <bpmndi:BPMNDiagram id="BPMNDiagram_1">
    <bpmndi:BPMNPlane id="BPMNPlane_1">
      <bpmndi:BPMNShape id="start_di" bpmnElement="start">
        <dc:Bounds x="170" y="130" width="40" height="40"/>
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="triage-with-agent_di" bpmnElement="triage-with-agent">
        <dc:Bounds x="370" y="120" width="150" height="70"/>
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="end_di" bpmnElement="end">
        <dc:Bounds x="700" y="130" width="40" height="40"/>
      </bpmndi:BPMNShape>
      <bpmndi:BPMNEdge id="Flow_1_start_triage-with-agent_di" bpmnElement="Flow_1_start_triage-with-agent"/>
      <bpmndi:BPMNEdge id="Flow_2_triage-with-agent_end_di" bpmnElement="Flow_2_triage-with-agent_end"/>
    </bpmndi:BPMNPlane>
  </bpmndi:BPMNDiagram>
</bpmn:definitions>
```

Deploy it after the Agent Process exists:

```bash
curl -X POST http://localhost:8080/processes \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/xml" \
  --data-binary @static/data/getting-started/support-triage.bpmn
```

## Start the process

Start the BPM process after deploying the Agent Process and the BPMN process. Send the `customerMessage` variable in the start request so the agent receives real input when the process reaches the Agent Process node:

```bash
curl -X POST http://localhost:8080/processes/support-triage/start \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "variables": {
      "customerMessage": "My payment went through but my subscription is still locked."
    }
  }'
```

When the process reaches the Agent Process node, Easy BPM sends the mapped `customerMessage` variable to the agent and stores the mapped result on the process instance.

## Next steps

- Review the full [Agent Processes API](../api/agent-processes).
- Add provider credentials through [AI Credentials](../api/ai-credentials).
- Combine an agent decision with a manager review in [Orchestrate human tasks](./build-human-tasks).
