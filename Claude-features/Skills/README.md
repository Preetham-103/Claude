# 🧠 Skills

Custom skill definitions that extend Claude's behavior for specific workflows. Each `.skill` file contains a trigger description and detailed instructions that Claude follows when the skill activates.

---

## 📁 Skills in this folder

| Skill File | Purpose |
|---|---|
| `requirement-analyzar.skill` | Breaks down user stories and bugs into structured requirements |
| `bug-log-analyzer.skill` | Diagnoses root causes from logs, stack traces, and error references |
| `ExternalRequestValidator.skill` | Validates API payloads against the External API schema |
| `schema-validator.skill` | Validates JSON payloads — syntax + business logic |

---

## 📄 Skill Details

---

### `requirement-analyzar`
**Trigger:** When a user story, bug report, or requirement is shared.

Analyzes the input and extracts:
- **Business Goal** — what problem this solves (2–4 bullets)
- **Functional Requirements** — what the system must do
- **Acceptance Criteria** — conditions that define "done"
- **Edge Cases** — boundary scenarios and unusual inputs
- **Assumptions / Missing Info** — gaps that need clarification before development

> Focused on clarity and implementation relevance. No code generation. No fluff.

---

### `bug-log-analyzer`
**Trigger:** When logs, stack traces, API responses, configs, or error screenshots are shared.

For every issue, produces:
- **Issue Summary** — what failed and where
- **Root Cause** — the exact trigger with step-by-step explanation
- **Resolution Steps** — actionable fix instructions
- **Validation / Debugging Steps** — how to verify the fix worked
- **Additional Insights / Risks** — related areas that may be affected

> Beginner-friendly explanations with professional, structured output. Cross-references all provided context before concluding.

---

### `ExternalRequestValidator` 
**Trigger:** When a API JSON payload needs validation before being sent to the external API.

Validates in two phases:
1. **Syntax** — confirms valid JSON structure
2. **Schema + Business Rules** — checks all required fields across `basicDetails`, `planDetails`, and `riderDetails`

Key business rules enforced:
- `premiumPaymentTerm` ≤ `policyTerm`
- `sumAssured` within `minSumAssured`–`maxSumAssured` range
- Rider eligibility per product type
- Per-rider term and payment term rules

> Reports all errors in one pass. Priority fields are flagged prominently.

---

### `schema-validator`
**Trigger:** When a JSON payload needs validation.

Validates in two stages:
1. **Syntax** — confirms valid JSON, stops immediately on parse failure
2. **Schema** — checks required top-level fields and nested objects:
   - `productCode` (String)
   - `mobileNumber` → `number` (long), `countryCode`, `countryAbrv`
   - `fullNameGender` → `name`, `gender`
   - `dateOfBirth` (String)

> Extra/unknown fields are ignored. Null values are treated as missing. Float values for `number` are flagged as invalid.

---

## 💡 How to Add a New Skill

1. Create a new `.skill` file in this folder
2. Add the frontmatter:
   ```
   ---
   name: your-skill-name
   description: "Clear trigger description — when should Claude activate this skill?"
   ---
   ```
3. Write the skill instructions below the frontmatter
4. Add it to the table at the top of this README
