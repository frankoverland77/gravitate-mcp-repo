# Start Feature

Switch context to a new or existing feature, archiving the outgoing one.

## Instructions

You are managing feature context for this project. Follow these steps precisely.

**Feature name from user:** $ARGUMENTS (if empty, ask the user for a feature name, brief description, and type: grid/form/dashboard/multi-tab/mixed)

---

### Step 1: Read current MEMORY.md

Read `/Users/frankoverland/.claude/projects/-Users-frankoverland-Documents-repos-excalibrr-mcp-server/memory/MEMORY.md`.

Look for a `## Current Work` section. If it exists, extract the feature name from the heading (e.g., `## Current Work: SupplyOptimization` means feature name is "SupplyOptimization").

---

### Step 2: Handle outgoing feature (if any)

If there IS a `## Current Work` section:

1. **Check if same feature.** If the feature name in `## Current Work` matches what the user wants to start, say "Already working on {Feature}" and stop.

2. **Update outgoing topic file.** Read the topic file referenced in `## Current Work`. Change `Current State:` to `Paused` and add a line: `**Paused:** {today's date}`.

3. **Ask for final notes.** Ask the user: "Any final notes for {OutgoingFeature}? (press Enter to skip)". If they provide notes, append them to the topic file under a `### Pause Notes` heading.

4. **Remove `## Current Work` block from MEMORY.md.** Remove from `## Current Work` up to (but not including) the next `##` heading. This is typically 4-5 lines.

If there is NO `## Current Work` section, skip to Step 3.

---

### Step 3: Determine new feature details

From `$ARGUMENTS` or by asking the user, determine:
- **Name**: PascalCase folder name (e.g., `SupplyOptimization`)
- **kebab-name**: kebab-case for file names (e.g., `supply-optimization`)
- **Display name**: Human-readable (e.g., `Supply Optimization`)
- **Description**: One sentence
- **Type**: grid / form / dashboard / multi-tab / mixed

---

### Step 4: Check if feature already exists

Check if `demo/src/pages/{Name}/` exists.

**If folder exists (resume mode):**
- Check if `demo/src/pages/{Name}/project-context.md` exists
  - If yes: read it, say "Resuming {Feature} - found existing project-context.md"
  - If no: create one using the template in Step 5 (scan existing files for the file structure section)
- Check if `memory/{kebab-name}-status.md` exists
  - If yes: update its `Current State` to `Active` and add `**Resumed:** {date}`
  - If no: create one using the template in Step 5
- Skip to Step 6

**If folder does NOT exist (new feature):** Continue to Step 5.

---

### Step 5: Create tracking files (new features only)

#### 5a. Create project-context.md

Create `demo/src/pages/{Name}/project-context.md`:

```markdown
# {Display Name} - Project Context
*Created: {YYYY-MM-DD}*

## Overview
{description}

**Type:** {type}  |  **Theme:** PE_LIGHT

## File Structure
demo/src/pages/{Name}/
├── project-context.md
└── (grows as feature develops)

## Key Decisions
| Decision | Rationale | Date |
|----------|-----------|------|

## Session Log

### Session 1 ({YYYY-MM-DD})
- Feature initialized, context tracking set up
```

#### 5b. Create topic file

Create `memory/{kebab-name}-status.md` (in the memory directory at `/Users/frankoverland/.claude/projects/-Users-frankoverland-Documents-repos-excalibrr-mcp-server/memory/`):

```markdown
# {Display Name} — Status

## Current State: Just Started
**Created:** {YYYY-MM-DD}
**Type:** {type}  |  **Description:** {description}

### What Exists
- project-context.md created

### Next Steps
- (defined during first work session)
```

---

### Step 6: Update MEMORY.md

Edit `/Users/frankoverland/.claude/projects/-Users-frankoverland-Documents-repos-excalibrr-mcp-server/memory/MEMORY.md`:

1. **Add `## Current Work` block** as the FIRST section after `# Memory` (before `## Topic Files`):

```
## Current Work: {Name}
**Status:** Active
**Context:** `demo/src/pages/{Name}/project-context.md`
**Topic file:** `memory/{kebab-name}-status.md`
```

2. **Add topic file to `## Topic Files`** (only if this is a new feature — check if the line already exists):

```
- {Display Name} status: `memory/{kebab-name}-status.md`
```

**CRITICAL:** Do NOT modify any `## Key Learnings` or `## Key Patterns` sections. Only touch `## Current Work` and `## Topic Files`.

---

### Step 7: Print summary

Print a brief summary:

```
Feature context switched to {Display Name}

Files:
  Context:    demo/src/pages/{Name}/project-context.md {created/existing}
  Status:     memory/{kebab-name}-status.md {created/existing}
  MEMORY.md:  Updated with Current Work pointer

{if outgoing feature: "Archived: {OutgoingFeature} → Paused"}
```
