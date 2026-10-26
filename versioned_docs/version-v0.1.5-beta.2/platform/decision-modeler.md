---
title: Business Rules Tables
---

# Business Rules Tables

Use a decision table to keep business rules separate from the process flow. The table receives typed inputs, evaluates its rows, and returns named outputs. A BPMN **Business Rule Task** invokes a published decision and writes its result into process variables.

Easy BPM uses DMN 1.3 XML to store and exchange typed business rules tables. Each published decision has a stable key and immutable versions. The supported expression language, XML structure, and BPMN configuration are described in the [technical reference](#technical-reference).

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

## Technical reference

### Decision identity and table structure

| Field | Contract |
| --- | --- |
| Decision key | Required identifier matching `[A-Za-z_][A-Za-z0-9_.-]{0,127}`. Used as the DMN decision `id` and BPMN `decisionKey`. |
| Decision name | Required, nonblank, up to 255 characters. Describes the decision to authors and operators. |
| Hit policy | `UNIQUE`, `FIRST`, or `COLLECT`; omitted XML hit policy defaults to `UNIQUE`. |
| Input column ID | Stable identifier used in validation and condition explanations. |
| Input column label | Human-readable label; does not select the value to evaluate. |
| Input expression | Identifier or dotted object path evaluated against the supplied decision input object. |
| Output column ID | Stable identifier for the XML column and validation context. |
| Output name | Unique simple identifier used as the property name in the result and as the mapping's `sourceName`. Dots are not allowed. |
| Rule ID | Stable identifier returned in matched-rule results and explanations. |
| Rule description | Optional explanation of the business intent. |
| Rule cells | One condition per input column and one output expression per output column, in column order. |

Column and rule IDs must match `[A-Za-z_][A-Za-z0-9_.-]{0,199}` and be unique across those elements. All supplied XML IDs must be nonempty and unique in the document. Keep IDs stable when changing business logic so execution explanations and version comparisons remain understandable.

Input expressions and process variable paths use `[A-Za-z_][A-Za-z0-9_]*(\.[A-Za-z_][A-Za-z0-9_]*)*`. For example, `customer.age` is valid; `customer[0].age`, function calls, and arithmetic are not. Paths traverse objects, not array indexes. Decision output expressions read from the decision input object, so any referenced data must be supplied to that object by the caller or task mapping.

### Type system and literal syntax

| Editor type | DMN XML `typeRef` | Accepted runtime value | Literal cell example |
| --- | --- | --- | --- |
| `string` | `string` | JSON string | `"gold"` |
| `number` | `number` | JSON number | `1250.50` |
| `boolean` | `boolean` | JSON boolean | `true` |
| `date` | `date` | Valid calendar date string in `yyyy-MM-dd` format | `date("2026-10-20")` |
| `json` | `Any` (`json` is also accepted on import) | JSON object, array, primitive, or explicit null | `{"tier":1,"active":true}` |

The backend preserves decimal values for numeric comparison; numeric equality ignores scale, including numbers nested in JSON objects or arrays. Objects compare by their keys and values, and arrays compare by length, order, and element values. No string-to-number, string-to-boolean, or implicit date conversion occurs. A wildcard still requires the input to exist and satisfy its declared type.

Literal strings use JSON escaping, for example `"He said \"yes\""`. Commas inside a quoted string, JSON object, or JSON array stay within that literal; top-level commas separate alternative input tests. Numeric and date comparisons support `=`, `!=`, `<`, `<=`, `>`, and `>=`. Interval bounds use `[` and `]` for inclusive bounds, or `(` and `)` for exclusive bounds; reversed endpoints fail validation. Date intervals can use date literals, such as `[date("2026-01-01")..date("2026-12-31")]`.

Bare `true`, `false`, and `null` are literals, never variable references. `null` requires a JSON column. Output cells accept literals or paths, and are evaluated only for the selected rows. Validation can check an output path's syntax, but its existence and runtime type are checked during evaluation.

The supported language is bounded and deterministic. It does not implement full FEEL, graphical decision requirement diagrams, arithmetic, arbitrary scripts, class/method access, external functions, network/filesystem access, clock functions, or random values.

### Evaluation and result structure

Evaluation follows these steps:

1. Resolve every input expression and check its declared type. A missing or invalid input fails evaluation before rule selection.
2. Evaluate each rule's input conditions. Conditions across columns combine with **AND**; comma-separated alternatives within a cell combine with **OR**.
3. Apply the hit policy to matching rows. FIRST selects the first matching row; COLLECT preserves the order of all matching rows; UNIQUE rejects more than one match.
4. Evaluate the selected rows' output expressions and check output types. Assemble result objects using output names.
5. For a BPMN task, validate and prepare every output mapping, then persist the process variable updates together.

Successful evaluation results contain:

| Field | Meaning |
| --- | --- |
| `decisionKey` | Evaluated decision's stable key. |
| `version` | Resolved published version; absent or null for an unpublished draft. |
| `hitPolicy` | Policy used for this evaluation. |
| `matchedRuleIds` | Selected rule IDs. For FIRST, only the first matching row is selected. |
| `outputs` | One object or null for UNIQUE/FIRST; an ordered array of objects for COLLECT. |
| `explanations` | Per-rule `ruleId`, `matched`, and condition results containing `inputId`, `expression`, and `matched`. Includes unselected rules. |
| `durationMs` | Evaluation duration in milliseconds. |

For example, two COLLECT matches can produce `[{"benefit":"FREE_SHIPPING"},{"benefit":"MEMBER_DISCOUNT"}]`. A mapping from `benefit` receives `["FREE_SHIPPING","MEMBER_DISCOUNT"]`; a mapping from `$result` receives the entire array of objects. An empty COLLECT result maps to an empty array. For a no-match UNIQUE/FIRST result, `$result` with `json` can preserve null, while a named-column mapping fails because there is no output object.

### DMN XML contract

The namespace must be exactly `https://www.omg.org/spec/DMN/20191111/MODEL/`. A document contains one `definitions` root, one `decision`, and one `decisionTable`. The following minimal table demonstrates the artifact structure; use the downloadable expense decision for a complete two-rule example.

```xml
<?xml version="1.0" encoding="UTF-8"?>
<definitions xmlns="https://www.omg.org/spec/DMN/20191111/MODEL/"
             id="eligibilityDefinitions" namespace="https://example.com/rules">
  <decision id="eligibility" name="Eligibility">
    <decisionTable id="eligibilityTable" hitPolicy="UNIQUE">
      <input id="age" label="Age">
        <inputExpression typeRef="number"><text>age</text></inputExpression>
      </input>
      <output id="eligibleOutput" name="eligible" typeRef="boolean" />
      <rule id="adult">
        <inputEntry><text>&gt;= 18</text></inputEntry>
        <outputEntry><text>true</text></outputEntry>
      </rule>
    </decisionTable>
  </decision>
</definitions>
```

Each `inputExpression`, `inputEntry`, and `outputEntry` contains exactly one `text` element. Input and output entries align with their column order. XML metacharacters must be escaped, such as `&lt;` in a less-than condition. Descriptions are supported on decisions, input/output columns, and rules.

Import accepts only the supported elements, attributes, and nesting. Additional decisions, unsupported semantic elements or attributes, aggregation settings, DTDs, entities, and external XML resources are rejected. Export/import preserves supported table semantics; an arbitrary DMN file from another tool may require adaptation.

### BPMN configuration contract

The executable BPMN element is `bpmn:businessRuleTask`. Easy BPM stores its configuration in `easy:node` within `bpmn:extensionElements`, with the Easy BPM namespace `https://easybpm.local/bpmn/extensions`.

```xml
<bpmn:businessRuleTask id="checkEligibility" name="Check eligibility">
  <bpmn:extensionElements>
    <easy:node><![CDATA[{
      "id": "checkEligibility",
      "name": "Check eligibility",
      "type": "BusinessRuleTask",
      "config": {
        "decisionKey": "eligibility",
        "decisionVersion": 1,
        "inputs": [
          {"targetName":"age","source":"variable","value":"customer.age","type":"number"}
        ],
        "outputs": [
          {"sourceName":"eligible","target":"variable","value":"customer.eligible","type":"boolean"}
        ]
      }
    }]]></easy:node>
  </bpmn:extensionElements>
</bpmn:businessRuleTask>
```

This fragment belongs inside a BPMN document declaring the `bpmn` and `easy` namespaces. The outer task ID and the extension node ID identify the same executable step.

| Configuration field | Meaning |
| --- | --- |
| `decisionKey` | Required published decision key. |
| `decisionVersion` | Optional positive integer. Omit it to select the latest version at the first execution. |
| `inputs[].targetName` | Property name supplied in the decision input object; unique among input mappings. |
| `inputs[].source` | `variable` to read a process path, or `static` to supply a literal. |
| `inputs[].value` | Process path for a variable mapping, or an actual typed JSON value for a static mapping. |
| `inputs[].type` | Declared mapping type, checked before decision evaluation. |
| `outputs[].sourceName` | Decision output name or reserved selector `$result`. |
| `outputs[].target` | `variable` for process variable output mappings. |
| `outputs[].value` | Destination process variable path. |
| `outputs[].type` | Output mapping type; for a named COLLECT output, the type of each array element. Use `json` for `$result`. |

A static numeric input is `{"targetName":"age","source":"static","value":21,"type":"number"}`. The value must be the number `21`, rather than the string `"21"`. The Modeler converts static editing fields into typed values and rejects numeric literals that cannot round-trip exactly through its number representation; use a process variable for higher precision.

Output paths create missing or null intermediate objects and preserve existing sibling properties. Scalar or array intermediate values fail. Duplicate targets and parent/child target overlaps fail regardless of mapping order, leaving all output variables unchanged.

The backend executes the decision within process transaction and locking behavior; no worker request or RabbitMQ round trip is needed. The immutable binding is stored per process instance and node, survives restarts, and is reused across retry and re-entry. Retry locks and rechecks the failed instance and incident; a stale or competing retry cannot advance the process twice.

### Validation limits and diagnostics

| Constraint | Limit |
| --- | --- |
| DMN XML size | 1,000,000 UTF-8 bytes. |
| Input columns / output columns | 1–32 each. |
| Rule rows | 1–1,000. |
| Cell text | 4,096 characters. |
| Expression / JSON nesting | Depth 16. |
| Supplied inputs / saved expected outputs | 1,000,000 serialized UTF-8 bytes each. |
| Saved test name | Nonblank, up to 255 characters. |
| Authoring overlap analysis | Bounded witness checks for tables with at most 100 rules; runtime UNIQUE enforcement always applies. |

Validation returns `valid`, `issues`, and the parsed `table` when available. Each issue includes `severity`, `code`, `message`, and optional `ruleId` and `columnId`. Errors prevent publication; warnings require review of the stated limitation.

| Diagnostic | Meaning and correction |
| --- | --- |
| `INVALID_DMN` / `UNSUPPORTED_TYPE` | Repair the XML structure, namespace, attributes, or column type. |
| `INVALID_KEY` / `INVALID_IDS` / `INVALID_OUTPUTS` | Correct decision, column, rule, or output identifiers and remove duplicates. |
| `INCOMPLETE_RULE` | Supply a cell for every column; use `-` for an unrestricted input. |
| `INVALID_LITERAL` / `INVALID_EXPRESSION` | Correct typed literals, quoting, paths, operators, or interval bounds. |
| `RULE_OVERLAP` | Proven overlap: an error for UNIQUE, a warning for FIRST/COLLECT. |
| `OVERLAP_ANALYSIS_LIMITED` | Validation cannot prove all overlaps or their absence; test representative inputs and boundaries. |
| `MISSING_INPUT` / `TYPE_MISMATCH` | Supply all required decision inputs with their declared types. |
| `UNIQUE_VIOLATION` | More than one rule matched during execution. Make UNIQUE conditions mutually exclusive. |
| `MISSING_PROCESS_VARIABLE` / `MAPPING_TYPE_MISMATCH` | Correct the process input source or mapping type. |
| `MISSING_DECISION_OUTPUT` / `OUTPUT_RESULT_REQUIRES_OBJECT` | Correct the output name or handle the no-match result explicitly. |
| `INVALID_VARIABLE_PATH` / `INVALID_OUTPUT_MAPPING` | Correct output paths, intermediate object types, duplicates, or overlapping targets. |
| `LIMIT` | Reduce the artifact, payload, cell size, or nesting to the supported limits. |

Runtime evaluation or mapping failures are recorded in decision history and create a `DECISION_TASK` incident for BPMN execution. Diagnose the recorded code together with the pinned decision version and node configuration; changing an unrelated latest version does not change the failed task's binding.
