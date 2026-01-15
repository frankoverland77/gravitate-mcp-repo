# Ralph Wiggum Context Guide - Excalibrr Demo

Quick reference for using the context management system in this project.

## The Three-Layer Context System

This project uses a three-layer context management approach:

### Layer 1: Project Context (You are here)
**File:** `/Users/frankoverland/Documents/repos/excalibrr-mcp-server/demo/PROJECT_CONTEXT.md`

Master context for the entire demo project. Contains:
- Overall project status and priorities
- Architecture and technical stack
- Development workflow and rules
- Navigation configuration (critical!)
- Session log consolidating all work

**When to update:** After major project-level work or when working on multiple features

### Layer 2: Feature Context - Contract Measurement (ACTIVE)
**File:** `/Users/frankoverland/Documents/repos/excalibrr-mcp-server/demo/src/pages/ContractMeasurement/project-context.md`

Detailed context for the Contract Measurement feature. Contains:
- Feature goals and current implementation status
- Component architecture within the feature
- Data models and state management
- Feature-specific decisions and learnings
- Feature-level session log

**When to update:** After working on Contract Measurement enhancements

### Layer 3: Feature Context - Subscription Management
**File:** `/Users/frankoverland/Documents/repos/excalibrr-mcp-server/demo/src/pages/SubscriptionManagement/PROJECT_CONTEXT.md`

Similar to Layer 2, but for the Subscription Management feature.

## Quick Start for a New Session

```
1. Open PROJECT_CONTEXT.md (this directory)
   └─ Read "Quick Orientation" and "Current Status"

2. Identify your task
   ├─ If working on Contract Measurement → Read its project-context.md
   ├─ If working on Subscription Management → Read its PROJECT_CONTEXT.md
   └─ If working on project infrastructure → Continue with PROJECT_CONTEXT.md

3. Start your work

4. Before ending session → Update relevant context file(s)
```

## What Changed and Why

### Old System (Fragmented)
- Bakery demo context in /docs/project-context.md
- Feature contexts scattered and inconsistent
- No unified project-level orientation
- Session history unclear

### New Ralph Wiggum System (This)
- Clear three-layer hierarchy
- PROJECT_CONTEXT.md at project root for orientation
- Feature contexts stay with their features
- Context/README.md explains the system
- Session entries consolidated in each context file
- Designed for AI assistants to quickly understand state

## Key Files to Know

| File | Purpose | Update Frequency |
|------|---------|------------------|
| `/PROJECT_CONTEXT.md` | Project master context | Major milestones, key decisions |
| `/context/README.md` | System documentation | Rarely (setup only) |
| `/src/pages/ContractMeasurement/project-context.md` | Contract feature context | After contract work |
| `/src/pages/SubscriptionManagement/PROJECT_CONTEXT.md` | Subscription feature context | After subscription work |
| `/docs/project-context.md` | **LEGACY** Bakery demo concept | *Keep for reference* |

## Critical Navigation Rules (from PROJECT_CONTEXT.md)

When adding new features or sections:

1. **Update pageConfig.tsx** - Define the route
2. **Update AuthenticatedRoute.jsx** - Add scope (MUST match pageConfig key exactly)
3. **Run quality check:** `yarn check:pages`
4. **Run pre-commit:** `git add . && git hook run pre-commit`

**IF YOU FORGET STEP 2, THE MENU ITEM WILL NOT APPEAR!**

## Excalibrr Conventions Quick Ref

Essential rules for code generation:

```tsx
// ✅ CORRECT - Use component props
<Horizontal justifyContent="space-between">
<Vertical flex="1" height="100%">
<Texto category="h1" appearance="primary">

// ❌ WRONG - Inline styles (breaks theming)
style={{ justifyContent: 'space-between' }}
style={{ gap: '12px' }}  // Use className="gap-12"

// ✅ CORRECT - Use theme variables
style={{ backgroundColor: 'var(--theme-bg-elevated)' }}

// ❌ WRONG - Hardcoded colors
style={{ backgroundColor: '#f5f5f5' }}
```

For full conventions, see `.claude/DESIGN_SYSTEM_RULES.md`

## Session Update Template

When ending a session with significant work:

```markdown
### Session N (YYYY-MM-DD)
**Completed:**
- [What was accomplished]
- [Features added/fixed]

**Key Learnings:**
- [Patterns that worked]
- [Gotchas discovered]

**Next Steps:**
- [Priority for next session]
```

## MCP Server Tools Available

When generating code, use these in sequence:

```
1. preflight({ task: "describe what to build" })
   └─ Returns conventions and component APIs

2. [Generate your code]

3. validate_code({ filePath: "path/to/code.tsx" })
   └─ Check for convention violations

4. git add . && git hook run pre-commit
   └─ Run linting and formatting

5. register_demo({ ... })  // if adding new demo
   └─ Register in navigation
```

**CRITICAL:** Never skip step 1 (preflight) - it prevents 90% of common mistakes.

## Project Status at a Glance

| Area | Status | Notes |
|------|--------|-------|
| **Contract Measurement** | In Progress | Primary development focus |
| **Subscription Management** | Stable | Completed implementation |
| **Navigation System** | Stable | Rule: keep pageConfig & AuthenticatedRoute in sync |
| **Demo Infrastructure** | Stable | MCP server integration working |
| **Code Quality** | Good | Pre-commit hooks active |

## Troubleshooting

### Menu item not showing
→ Check if scope is added to AuthenticatedRoute.jsx (must match pageConfig key)

### Code validation errors
→ Run preflight() before generating code to see conventions

### Style issues
→ Use `yarn cleanup_styles` to auto-fix inline styles

### Page not registered
→ Run `yarn check:pages` to validate registration

## Getting Help

1. Check `context/README.md` for system documentation
2. Check `.claude/DESIGN_SYSTEM_RULES.md` for component rules
3. Use MCP tool: `excalibrr:help --query "your question"`
4. Review relevant feature context file for that area

---

**Ralph Wiggum Context System**
*Initialized: 2026-01-15*
*Project: Excalibrr Demo*
*Location: /Users/frankoverland/Documents/repos/excalibrr-mcp-server/demo*
