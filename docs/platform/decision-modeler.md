---
title: DMN Decision Tables
---

# DMN Decision Tables

Use a decision table to keep business rules separate from the process flow. The table receives typed inputs, evaluates its rows, and returns named outputs. A BPMN **Business Rule Task** invokes a published decision and writes its result into process variables.

This page documents the DMN functionality introduced in [PR #64](https://github.com/Easy-BPM/easyBPM/pull/64) for **next**. Easy BPM supports a constrained DMN 1.3 decision-table language, rather than full DMN/FEEL or graphical decision requirement diagrams.

## Open the decision workspace

On the Modeler welcome screen, find **Business Rules** and select **Decision Tables**.

![Modeler welcome screen with the Business Rules card](/img/screenshots/next/dmn/modeler-welcome.jpg)

The screenshots on this page show the desktop Modeler in light mode, disconnected from a backend. Local editing and DMN import/export work offline. Select **Connect to backend** to validate, run the playground, or deploy. In the online Modeler, sign in to the configured backend. Authoring requires `ACCESS_BPM_MODELER` or `ACCESS_BPM_ADMIN`; viewing operational decision executions requires `ACCESS_BPM_ADMIN`.

A new decision starts with no key, name, columns, or rules, and sample inputs `{}`. Examples are optional: choose **Examples** or **Browse examples**, then load **Eligibility**, **Expense approval**, or **Discount collection**. Loading an example replaces the draft after confirmation when there are unsaved changes. **New decision** clears the workspace; export work you want to keep first.

## Create an expense approval decision

For a quick start, choose **Examples → Load Expense approval example**. To build the same decision yourself:

1. Set **Decision key** to `expenseApproval` and **Name** to `Expense approval`. The key is the stable reference used by processes.
2. Choose **UNIQUE** as the hit policy.
3. Select **Add input**. Set its ID to `amount`, name to `Amount`, expression to `amount`, and type to `number`.
4. Select **Add output** twice and configure the columns below. The output **name**, rather than its display position, is what process mappings read.
5. Select **Add rule** twice and enter the two rows below. Give each rule a distinct ID.

| Output ID | Output name | Type |
| --- | --- | --- |
| `approval` | `approval` | `string` |
| `review` | `requiresReview` | `boolean` |

| Rule ID | Input: amount | Output: approval | Output: requiresReview |
| --- | --- | --- | --- |
| `automaticApproval` | `< 1000` | `"APPROVED"` | `false` |
| `managerReview` | `>= 1000` | `"REVIEW"` | `true` |

![Expense approval decision with typed input, two outputs, two rules, and playground inputs](/img/screenshots/next/dmn/expense-decision.jpg)

Input expressions read a field from the supplied input object. For example, `customer.age` reads a nested field. Column types are `string`, `number`, `boolean`, `date`, and `json`. Numbers and booleans must be actual JSON values: `250` and `true`, rather than `"250"` and `"true"`. Dates use valid calendar dates in `yyyy-MM-dd` format. Missing inputs fail; explicit `null` is accepted only for a JSON column. Values are not automatically converted between types.

### Choose how matching rows behave

| Hit policy | Result | If no rule matches |
| --- | --- | --- |
| `UNIQUE` | One output object. Multiple matching rows fail. | `null` |
| `FIRST` | Output object from the first matching row. Use the move-up control to change row priority. | `null` |
| `COLLECT` | Array of every matching output object, in table order. | `[]` |

COLLECT does not sum, deduplicate, or otherwise aggregate results. FIRST and COLLECT may intentionally have overlapping rules. UNIQUE requires mutually exclusive rules, as in the expense example.

### Write conditions and outputs

| Input condition | Meaning |
| --- | --- |
| `-` | Accept any value valid for the column type. |
| `"gold"`, `42`, `true` | Match a typed literal. Quote string literals with JSON double quotes. |
| `= 42`, `!= 42` | Equality or inequality. |
| `< 1000`, `>= 1000` | Numeric comparison. |
| `[10..20]`, `(10..20]` | Numeric interval with inclusive or exclusive bounds. |
| `"gold", "silver"` | Match either alternative. |
| `not("blocked")` | Negate a supported condition. |
| `>= date("2026-01-01")` | Date comparison. |

An empty cell is incomplete; use `-` explicitly for an unrestricted input. Output cells contain a typed literal such as `"APPROVED"`, `false`, or `{"tier":1}`, a date constructor such as `date("2026-10-20")`, or an input path such as `customer.name`. They cannot contain wildcard conditions or comparisons. An output path must exist and match the output type.

This language does not support arithmetic, arbitrary scripts, general FEEL functions, or external calls. Ordering and intervals apply only to numbers and dates.

## Validate and test before publication

1. Connect to the backend and select **Validate**. Review reported errors and warnings, including rule/column context, and correct invalid types, expressions, or overlapping UNIQUE rules.
2. In **Playground and saved tests**, enter `{"amount":250}` in **Sample inputs** and select **Test decision**. This evaluates the current draft without publishing it.
3. Check the actual result and matched rule IDs. Expand a rule explanation to inspect which conditions matched.
4. Repeat with `{"amount":1000}` to test the boundary, then with a value above the threshold.

| Sample inputs | Expected outputs |
| --- | --- |
| `{"amount":250}` | `{"approval":"APPROVED","requiresReview":false}` |
| `{"amount":1000}` | `{"approval":"REVIEW","requiresReview":true}` |
| `{"amount":1500}` | `{"approval":"REVIEW","requiresReview":true}` |

**Expected outputs** is used when saving a regression test; entering it does not by itself assert that the playground result is correct. Test a missing `amount` or `{"amount":"250"}` as well: these inputs should fail rather than silently approve an expense.

Validation's overlap analysis is bounded and is not a complete proof for complex conditions. `OVERLAP_ANALYSIS_LIMITED` identifies this limitation. Runtime UNIQUE evaluation still rejects multiple matches.

## Publish, save tests, and reuse versions

1. Select **Export DMN** to keep a local XML copy. Use **Import DMN** to reopen supported decision-table XML.
2. Once validation and sample tests are satisfactory, select **Deploy new version**. Publication creates an immutable version under the decision key, even when the XML has not changed.
3. For the published, unchanged draft, enter **Sample inputs**, **Expected outputs**, and a **Test case name**, then select **Save test case**. Save both expense cases above.
4. Select **Run saved tests** and inspect PASS/FAIL and expected/actual differences. After editing the draft, publish it before saving or running versioned cases.
5. In the online Modeler, reopen a published decision from **Deployed resources → Business Rules** on the welcome screen. Search by name or key and open the resource. The editor loads its XML and version; use the version selection to inspect another version. Editing and deploying creates a new version.

Saved tests compare numbers by numeric value (`1` equals `1.0`), but preserve type distinctions (`"1"` differs from `1`) and array order. Use deliberate sample data: saved cases and rule literals remain visible to authorized authors.

Imports must use the supported DMN 1.3 subset with a single decision. Full vendor-specific DMN models, unsupported semantic elements, and COLLECT aggregation are rejected. Limits include 1,000,000 UTF-8 bytes of XML, 1–32 inputs, 1–32 outputs, 1–1,000 rules, and 4,096 characters per cell.

## Apply the decision to a BPMN process

Publish `expenseApproval` before running a process that references it. You can download and import the matching [DMN decision](/examples/next/dmn/expense-approval.dmn) and [BPMN process](/examples/next/dmn/expense-approval.bpmn).

1. Return to the workspace and select **Create Process**, or import the BPMN example.
2. Define process variables `amount` (`number`), `approval` (`string`), and `requiresReview` (`boolean`).
3. From **Activities**, drag **Business Rule Task** onto the canvas. Connect **Start Event → Business Rule Task → End Event**.
4. Select the task. Set its **Element ID** to `decideExpense`, label to `Decide expense approval`, and **Decision key** to `expenseApproval`.
5. Leave **Exact version (optional)** empty to select the latest published decision on the task's first execution, or enter a positive version number for a controlled rollout.
6. Select **Add decision input** and configure the input mapping. Select **Add decision output** for each output mapping below.

| Decision input | Source | Value / process path | Type |
| --- | --- | --- | --- |
| `amount` | `Process variable / path` | `amount` | `number` |

| Decision output name | Target process variable | Type |
| --- | --- | --- |
| `approval` | `approval` | `string` |
| `requiresReview` | `requiresReview` | `boolean` |

![Expense process with the Business Rule Task selected and decision mappings in the properties panel](/img/screenshots/next/dmn/business-rule-task.jpg)

Scroll the task properties panel to inspect both input and output mappings:

![Decision input and output mappings for amount, approval, and requiresReview](/img/screenshots/next/dmn/decision-mappings.jpg)

The task's decision key must match the published key exactly. For a fixed test value, choose **Static value** for an input instead of a process path. Match its type to the decision column. Nested paths such as `customer.age` can read process objects; an output target such as `customer.approved` updates that property while preserving siblings. Avoid duplicate targets or overlapping targets such as `customer` and `customer.approved`.

For COLLECT, mapping a named output returns an ordered array of that column's values; select the type of each element. To store the entire decision result, enter `$result` as the output name and choose `json`. An ordinary output named `result` is still a normal column. All output mappings are validated before any process variables are updated. Mapping a named output from a no-match UNIQUE/FIRST result creates an incident.

### Deploy and verify the process

1. Resolve Modeler validation errors, export the BPMN if desired, and select **Deploy** for the process.
2. Start an instance of `expenseDecisionProcess` from your configured process-start interface with numeric `amount` set to `250`.
3. In Admin, inspect the instance variables. Expect `approval = APPROVED` and `requiresReview = false`.
4. Start a second instance with `amount = 1000`. Expect `approval = REVIEW` and `requiresReview = true`.

The downloadable process only records the decision and ends. Returning `REVIEW` does not automatically create human work. To request review, add an **Exclusive Gateway** after the Business Rule Task. Connect one branch to a **Human Task** with condition `${requiresReview} == true`, and the other to an end or automatic approval step with `${requiresReview} == false`. Configure the human task's form, assignee or candidate groups, and completion outputs using the [Human Task reference](./modeler.md#human-task).

### Version selection during execution

If no exact version is configured, the engine selects the latest published version when that instance first reaches the task and persists the selection. Retries and later visits to the same task in that instance reuse the pinned version. A new instance, or a task that has not yet executed, can select a newer version. Publishing a new decision does not change an existing pin.

## Inspect executions and recover failures

In Admin, inspect decision version history and compare versions before rollout. Use decision execution history to filter by decision key, version, process instance, node, or status, and open an execution to inspect matched rows, condition outcomes, duration, and sanitized errors. Playground and saved-test runs do not create operational execution audits.

Missing decisions/versions, missing or incorrectly typed inputs, ambiguous UNIQUE matches, and invalid output mappings create a `DECISION_TASK` incident. Inspect the failed instance and decision execution, correct repairable input variables in Admin, and select the incident's **Retry** action. A successful retry resolves the incident and advances the process using the existing decision-version pin. A repeated failure keeps the incident open and records another failed execution.

Publishing a corrected version does not replace a bad version already pinned to an instance. When the rule definition or task configuration must change, deploy the correction and use a new process instance. Execution audits store redacted input/output summaries, so inspect authorized process variables when diagnosing actual values.
