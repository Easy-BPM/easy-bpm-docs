---
title: Conditions
---

# Conditions

Conditions let a process choose a path using its current variables. They are normally attached to outgoing sequence flows after an exclusive gateway.

```text
Approved path: ${approved} == true
Rejected path: ${approved} == false
```

The `${...}` form reads a process variable. A condition evaluates to `true` when its flow is eligible.

## Common patterns

```text
${status} == "APPROVED"
${amount} > 1000
${country} != "BR"
${approved} == true && ${amount} <= 5000
```

Use quotes for text, but not for numbers or booleans. Variable names are case-sensitive.

Keep conditions short, make outgoing paths mutually exclusive, initialize variables before evaluating them, and test boundary and missing values. Move complex rules into a Code Task or service step and route on the resulting business value.

Conditions select a path; they should not perform the business operation. See [Variables](./variables.md) and [Connections and conditions](../platform/modeler.md#connections-and-conditions).
