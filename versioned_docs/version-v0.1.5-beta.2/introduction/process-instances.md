---
title: Instances
---

# Instances

A process instance is one execution of a deployed process definition. If an expense approval process is started for three expense reports, Easy BPM creates three independent instances. They share a definition but have different variables, tasks, history, status, and outcome.

An instance commonly moves through these states:

<img
  src="/img/diagrams/process-instance-lifecycle.png"
  alt="Process instance lifecycle showing Active, Waiting, Completed, Failed, and Cancelled states"
  className="easybpm-concept-diagram"
/>

Waiting is normal. An instance may wait for a human task, message, timer, child process, or external worker while Easy BPM preserves its context.

| Concept | Meaning | Example |
| --- | --- | --- |
| Process definition | Reusable blueprint | Expense approval |
| Definition version | Published revision | Version 3 |
| Process instance | One running business case | Expense `EXP-1042` |
| Process variable | Data owned by that instance | amount, requester, approval |
| Node history | Route taken through the process | start, review, finance, end |
| Timeline | Runtime and operational events | task created, incident retried |

Operators use the current node, status, variables, history, and timeline to understand what an instance is doing. See [Operations](../platform/operations.md) for investigation and recovery tools.
