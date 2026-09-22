---
title: Access Management
---

# Access Management

Access management controls who can design, operate, administer, or participate in processes. Easy BPM assigns permission codes directly to users or through groups.

| Layer | Question | Example |
| --- | --- | --- |
| Authentication | Who is the user? | A local or OIDC identity signs in |
| Platform authorization | Which capabilities may they use? | Modeler or Admin access |
| Work assignment | Which business work may they perform? | A member of `FINANCE` claims a finance task |

Platform access and work assignment are different. Access to the Task Portal does not make every task available; assignees and candidate groups determine who may act on a specific Human Task.

Prefer group-based access for stable job responsibilities. Apply least privilege, separate process participation from administration, restrict secret-management permissions, and review memberships regularly.

See [Permissions](../reference/permissions.md) and [Keycloak and OIDC](../deployment/keycloak.md).
