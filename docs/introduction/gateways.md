---
title: Gateways
---

# Gateways

Gateways control how execution branches or joins. They do not perform business work; they decide which connected paths can continue.

| Gateway | Purpose |
| --- | --- |
| Exclusive | Select one path using conditions |
| Parallel | Start multiple paths or wait for parallel paths to join |
| Inclusive | Select one or more eligible paths when supported by the model |

Use an exclusive gateway for business decisions such as approved versus rejected. Use a parallel gateway when branches should run independently, not as a substitute for several conditional routes.

A gateway should have a clear question or synchronization purpose. Keep its outgoing paths understandable, make exclusive conditions mutually exclusive, and provide a fallback for unexpected data. See [Conditions](./conditions.md) and the [Modeler gateway components](../platform/modeler.md#gateway-components).
