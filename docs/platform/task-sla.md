---
title: Task SLA
---

# Task SLA

A task SLA defines how long a person has to complete a Human Task, when it becomes at risk, and which assignment changes should happen after the deadline. Configure the policy in the Modeler, follow deadlines in the Task Portal, and investigate escalations and failures in Admin.

SLA measures continuous elapsed time. `P1D` means 24 hours, including weekends, holidays, and daylight-saving changes. SLA actions change ownership or candidate access; they do not complete the task or advance the process.

## Configure an SLA in the Modeler

1. Create or open a BPMN process and select a **Human Task**.
2. Configure its form, assignee or candidate groups as usual.
3. In the task properties, enable **Task SLA**. The initial duration is `PT4H`.
4. Enter **Duration** as a positive ISO duration, for example `PT4H`, or a single process variable reference such as `${slaDuration}`.
5. Optionally set **Timezone** to an IANA zone such as `America/Sao_Paulo`. An empty field uses the server default.
6. Select **Add alert**, give it a stable **Alert ID**, and set **Before deadline**, for example `PT30M`.
7. Select **Add escalation**, give it a stable **Action ID**, set **After deadline**, choose **Action**, and enter **Target**.
8. Resolve validation errors, export the BPMN if you need a local copy, and deploy the process.

SLA is supported only on Human Tasks (BPMN User Tasks). Importing and exporting BPMN preserves the policy and action IDs. Disabling **Task SLA** removes the policy from the edited definition; it does not alter policies already captured by running tasks.

### Example: four-hour manager review

| Setting | Value | Effect |
| --- | --- | --- |
| Duration | `PT4H` | Deadline is four hours after task creation. |
| Timezone | `America/Sao_Paulo` | Displays the deadline in the task's captured zone. |
| Alert ID / before deadline | `warn-30m` / `PT30M` | Task becomes at risk 30 minutes before its deadline. |
| Action ID / after deadline | `manager` / `PT0S` | Reassigns at the deadline. |
| Action / target | `Reassign to user` / `${supervisor}` | Resolves the supervisor username when the action executes. |
| Second action | `operations`, `PT1H`, `Add candidate group`, `operations` | Adds the operations group one hour after the deadline. |

If the task is created at 09:00, it is **ON_TRACK** until 12:30, **AT_RISK** from 12:30, and **OVERDUE** from 13:00. The manager action is scheduled for 13:00 and the operations action for 14:00. These are elapsed-time examples in a single display zone; execution of scheduled effects depends on the scheduler poll.

The target user and group must already exist. For the dynamic manager action, supply a string process variable such as `supervisor = manager1`. The `operations` target is a group code, not its display name or database ID.

## Understand task status and deadline behavior

| SLA status | Meaning |
| --- | --- |
| `ON_TRACK` | Pending SLA task before the earliest warning threshold, or before the deadline when no alerts exist. |
| `AT_RISK` | Pending task at or after its earliest configured alert threshold and before its deadline. |
| `OVERDUE` | Pending task at or after its deadline. |
| `COMPLETED` | SLA task completed, whether on time or late. Inspect `completedWithinSla` for the outcome. |
| No SLA status | Task has no SLA policy; nullable SLA fields remain null. |

Completion at or before the deadline counts as within SLA. An unfinished task at exactly the deadline is overdue. With no alerts, a task moves directly from ON_TRACK to OVERDUE.

The clock starts when the engine creates the Human Task, rather than when a user claims or opens it. Claim, unclaim, draft saves, reassignment, and candidate changes preserve the original deadline and policy. Changing a process duration variable later does not recalculate that deadline. Publishing an updated process definition does not rewrite existing task policies.

The task lifecycle field remains `PENDING` or `COMPLETED`; `slaStatus` is a separate classification. Status is computed from persisted instants and the task lifecycle at query time, so a delayed scheduler does not make an overdue task appear on track.

## Work with deadlines in the Task Portal

1. Open **My Inbox** and inspect the SLA status and countdown for visible tasks.
2. Use deadline and SLA status filters to focus on at-risk or overdue work. Counters reflect only tasks visible to your account under the applied filters.
3. Open or claim the task and work normally. **Save Draft** preserves work without stopping or restarting the clock.
4. Complete the task. Its SLA status becomes COMPLETED, and the stored on-time outcome distinguishes timely completion from late completion.

The portal refreshes authoritative SLA metadata every 15 seconds while preserving task selection, filters, edited forms, and drafts. Status is presented with text/icons as well as color. A failed refresh retains user input and allows retry. Reassignment may change which tasks your account can access; existing task visibility rules still apply.

## Alerts and escalation actions

An advance alert records a durable internal event and timeline/audit evidence. It does not automatically send email, SMS, or a worker notification. A notification integration must consume these records and deduplicate delivery by event UUID.

| Modeler action | Stored action | Target | Effect |
| --- | --- | --- | --- |
| Reassign to user | `REASSIGN` | Existing enabled username | Replaces the assignee and preserves candidate sets. |
| Add candidate user | `ADD_CANDIDATE_USER` | Existing enabled username | Adds the user without removing the assignee or other candidates. |
| Add candidate group | `ADD_CANDIDATE_GROUP` | Existing group code | Adds the group without removing the assignee or other candidates. |

Candidate additions use set union, so adding an existing candidate does not create duplicates. A populated candidate-user list and populated candidate-group list retain their existing intersection eligibility rule; adding a candidate does not override that rule or an existing assignment. User targets use the configured local/OIDC identity model. Groups have no separate enabled flag.

Targets may be literal usernames/group codes or a single `${variableName}` reference. Dynamic targets resolve at action execution and again on retry, so correcting a process variable can repair a failed action. They are process variables, not task form draft values unless those values have been mapped into the process.

Actions execute only for PENDING tasks in ACTIVE or WAITING instances. FAILED instances defer processing without moving deadlines. Completed, cancelled, and otherwise inactive work is skipped. Missed escalations execute in scheduled order after restart; configured order breaks equal-time ties. A missed advance alert is skipped after the deadline rather than emitted as a late warning.

## Monitor and recover in Admin

Open **Task SLAs** in Admin. Use **Task SLA status** and deadline range filters, select **Group metrics by**, and inspect status counts and completion performance. Under **Tasks by earliest deadline**, select **Inspect** to open a task's SLA history, or select its instance ID to investigate the process. **Open instance timeline and variables** connects the history to the recovery workflow. Metrics and recovery require `ACCESS_BPM_ADMIN`.

| Grouping | Interpretation |
| --- | --- |
| `PROCESS` | Process definition key. |
| `TASK` | Process definition key plus task node ID. |
| `USER` | Current assignee, including an UNASSIGNED bucket. |
| `GROUP` | Current candidate-group membership, including NO_GROUP. A task in several groups contributes to several rows; these rows cannot be added into a unique task total. |

The within-SLA completion rate is a fraction from 0 to 1 and excludes tasks without SLA. A rate can be null when there are no samples. Alert-to-completion time uses the first successful alert and the task's SLA completion instant; the average is null without samples. Successful escalation counts represent logical actions, while failure counts include failed retry attempts. Deadline range filters are inclusive and apply to task deadlines.

### Recover a failed escalation

1. Open the incident and related task/process history. Identify the action ID, scheduled time, failure outcome, and current task assignment.
2. Correct the target or dynamic process variable using the normal identity or process-variable administration workflow. A target must resolve to a valid username or group code.
3. Select **Retry escalation** on the failed history event, or use the incident's **Retry** action.
4. Verify the new action outcome, task assignment/candidates, and incident state. Success resolves the incident; another failure leaves it unresolved and records additional evidence.

An invalid target causes no partial assignment change. A failed escalation does not complete the task, reset its deadline, or advance BPMN. Other configured actions may still execute.

Retry can return a conflict when the work has completed or become inactive, the action already succeeded, or a failed reassignment would overwrite an assignment changed since the failure. Independent failed candidate additions can remain retryable. Repeating a successful retry cannot duplicate its effect. If the process itself is FAILED, recover its failure before expecting deferred automatic SLA actions to run.

## Technical configuration

### Policy fields and validation

The SLA policy is `config.sla` on the `HumanTask` node. Omit it for normal tasks without SLA.

| Field | Contract |
| --- | --- |
| `duration` | Required positive ISO duration or a single process variable reference. Dynamic values resolve once at task creation and must be nonblank strings. |
| `timeZone` | Optional IANA zone; falls back to `easybpm.sla.time-zone`, whose default is `UTC`. Captured for the task's deadline presentation. |
| `alerts[]` | Optional list of advance alerts. |
| `alerts[].id` | Stable action identifier, unique across alerts and escalations. |
| `alerts[].beforeDue` | Positive duration strictly less than the resolved SLA duration. |
| `escalations[]` | Optional ordered list of overdue assignment actions. |
| `escalations[].id` | Stable action identifier, unique across both lists. |
| `escalations[].afterDue` | Nonnegative duration; `PT0S` runs at the deadline. |
| `escalations[].action` | `REASSIGN`, `ADD_CANDIDATE_USER`, or `ADD_CANDIDATE_GROUP`. |
| `escalations[].target` | Nonblank username/group code or single process variable reference, up to 255 characters. |

Durations accept days, hours, minutes, and seconds, including up to nine fractional-second digits. Examples: `P1D`, `PT4H`, `PT30M`, and `PT0.5S`. Months, years, negative values, zero task duration, zero alert offsets, and alerts at or after the deadline are invalid. Offsets are duration literals, not expressions.

Each list supports at most 100 actions. IDs are nonblank, at most 100 characters, and must not start with the reserved `__sla_` prefix. The serialized policy is limited to 32,768 JSON characters. Durations are bounded to 9,223,372,036 seconds and resulting instants must fit year 9999. Both Modeler and backend validate static policies; dynamic durations and their alert bounds are checked when task creation resolves them.

A variable reference must be the entire value, for example `${slaDuration}`; arbitrary expressions and string interpolation are unsupported. Missing, null, numeric, or object duration values fail task creation through the engine incident path. The invalid task is removed instead of leaving pending work without a deadline.

### BPMN XML contract

Declare the standard `bpmn` namespace and `xmlns:easy="https://easybpm.local/bpmn/extensions"` on `bpmn:definitions`. The task configuration is carried in `easy:node` JSON:

```xml
<bpmn:userTask id="review" name="Review">
  <bpmn:extensionElements>
    <easy:node><![CDATA[{
      "id": "review",
      "name": "Review",
      "type": "HumanTask",
      "config": {
        "sla": {
          "duration": "PT4H",
          "timeZone": "America/Sao_Paulo",
          "alerts": [{"id":"warn-30m","beforeDue":"PT30M"}],
          "escalations": [
            {"id":"manager","afterDue":"PT0S","action":"REASSIGN","target":"${supervisor}"},
            {"id":"operations","afterDue":"PT1H","action":"ADD_CANDIDATE_GROUP","target":"operations"}
          ]
        }
      }
    }]]></easy:node>
  </bpmn:extensionElements>
</bpmn:userTask>
```

This fragment belongs inside a complete executable process. Add form and assignment configuration to the same `config` object as needed. For a dynamic deadline, replace `"duration":"PT4H"` with `"duration":"${slaDuration}"` and supply the string process variable before reaching the task.

### Time, persistence, and concurrency

The deadline equals the explicitly captured task creation instant plus the resolved duration. Alerts schedule at `dueDate - beforeDue`; escalations schedule at `dueDate + afterDue`. Arithmetic uses instants; the captured timezone affects display, not duration. New deadline, schedule, event, and completion instants persist as PostgreSQL `timestamptz` and serialize with offsets, normally UTC `Z`. Legacy task creation/completion timestamps are not reinterpreted.

The database stores the captured policy, schedules, outcomes, and event history. Task-row and process locks serialize completion against escalations. A durable action ledger allows only one successful effect per task/action ID across replicas and restarts. Assignment effects, action outcome, internal publication, and incident/timeline evidence commit together. Logs and metric increments happen after commit.

### Task data and API navigation

| Task response field | Meaning |
| --- | --- |
| `dueDate` | Offset-qualified deadline, or null without SLA. |
| `slaStatus` | ON_TRACK, AT_RISK, OVERDUE, COMPLETED, or null without SLA. |
| `slaTimeZone` | Captured display timezone, or null without SLA. |
| `completedWithinSla` | On-time completion flag; null for unfinished tasks or tasks without SLA. |

Task search supports deadline comparisons with offset-qualified timestamps and SLA status filters. Filters combine with AND. Deadline sorting puts tasks without deadlines last in either direction and uses task ID to break ties. Task summaries and event history preserve normal task visibility; Admin metrics use administrator access. See the [SLA API reference](../api/sla.md) for request examples, history pagination, metrics, and incident retry.

### Server operation and observability

| Property | Default | Purpose |
| --- | --- | --- |
| `easybpm.sla.time-zone` | `UTC` | Default display zone for newly created SLA tasks without an override. |
| `easybpm.sla.poll-ms` | `10000` | Scheduler interval in milliseconds. Configure no more than `30000` to meet the refresh contract. |

Scheduler batches contain at most 100 task IDs and prioritize the oldest eligible schedule. Keep backend replica clocks synchronized. Monitoring exposes `task_sla_overdue`, `task_sla_alerts_total{outcome="success"}`, and `task_sla_escalations_total{outcome="success|failure"}`. Labels avoid task IDs and usernames. Correlated logs contain task, instance, action, incident, scheduled/executed time, and outcome identifiers without copying process variable payloads.

Deploy the backend and affected frontends together, applying Flyway migration V47 through the normal upgrade procedure. Existing tasks remain without SLA; there is no retroactive policy assignment. Worker protocols are unchanged. History follows the existing retention policy, and deleting a task removes its SLA schedules/history.

Business-day calendars, holiday rules, manual deadline resets, email/SMS delivery, and SLA-driven process advancement are outside the supported policy behavior. Use a separate BPMN timer/boundary design when the requirement is to interrupt or reroute process execution.

## Verify a new policy

1. Deploy a test process with an SLA short enough to observe, using a positive alert offset shorter than the task duration.
2. Start an instance and verify the persisted deadline and timezone. Confirm that claim, draft save, and reassignment preserve the deadline.
3. Observe ON_TRACK, AT_RISK, and OVERDUE boundaries, then confirm scheduled assignment changes and event history.
4. Complete one task before its deadline and another after it; inspect `completedWithinSla` and Admin metrics.
5. Test a missing duration variable and an invalid escalation target. Verify incident evidence and recovery without a fabricated deadline or partial assignment mutation.
6. Confirm that no-SLA tasks retain their normal workflow and that a completed task cannot be changed by a later scheduled escalation.
