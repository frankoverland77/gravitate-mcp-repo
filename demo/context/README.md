# Context Management System - Ralph Wiggum

This folder supports the Ralph Wiggum context management system for the Excalibrr Demo project.

## Files in This Folder

### Master Context
- **../PROJECT_CONTEXT.md** - Master project context file (root level)
  - Overall project status and decisions
  - Architecture overview
  - Development workflow
  - Critical rules and patterns
  - Session log with all sessions consolidated

### Feature Contexts
Each major feature has its own context file:

1. **../src/pages/ContractMeasurement/project-context.md** - Contract Measurement feature
   - Feature-specific goals and status
   - Component architecture
   - Data model and state management
   - Feature-level decisions
   - Feature-level session log

2. **../src/pages/SubscriptionManagement/PROJECT_CONTEXT.md** - Subscription Management feature
   - Feature-specific context (pattern follows above)

## How to Use This System

### At the Start of a Session
1. Read **PROJECT_CONTEXT.md** for quick orientation
2. Identify what you're working on (project-level or specific feature)
3. Read the relevant feature context file if working on a specific feature

### During a Session
- Keep notes on what you're completing
- Jot down key learnings and decisions
- Track any blockers or dependencies

### At the End of a Session
1. Update the relevant context file(s):
   - **PROJECT_CONTEXT.md** for project-level changes
   - Feature's **project-context.md** or **PROJECT_CONTEXT.md** for feature-specific work

2. Add a new session entry to the Session Log with:
   ```markdown
   ### Session N (YYYY-MM-DD)
   **Completed:**
   - What was accomplished
   - Features added or fixed
   - Documentation updated

   **Key Learnings:**
   - Patterns that worked well
   - Gotchas discovered
   - Important decisions made

   **Blockers/Next Steps:**
   - Any unresolved issues
   - Priority for next session
   ```

3. Update status tables if applicable
4. Update "Next Actions" section

## Context File Standards

### What Goes in PROJECT_CONTEXT.md
- Project-level decisions and architecture
- Multi-feature coordination
- Development workflow and setup
- Critical rules that apply across the entire project
- Session log entries for major work

### What Goes in Feature project-context.md
- Feature-specific requirements and goals
- Component structure within the feature
- Feature-specific state management
- Design decisions for that feature
- Feature-level implementation notes

### Session Entry Guidelines
- Keep each session entry concise (3-5 bullets max per section)
- Focus on what helps future sessions understand context
- Include links to relevant code/files if helpful
- Highlight key learnings and gotchas
- Note any unresolved issues or blockers

## Quick Reference: File Locations

```
demo/
├── PROJECT_CONTEXT.md                              ← Project-level context
├── context/
│   └── README.md                                  ← You are here
├── src/pages/
│   ├── ContractMeasurement/
│   │   └── project-context.md                    ← Feature context
│   └── SubscriptionManagement/
│       └── PROJECT_CONTEXT.md                    ← Feature context
```

## Why This System?

Ralph Wiggum context management ensures:
- **Continuity** across sessions with different Claude instances
- **Focus** on what matters (decisions, patterns, learnings)
- **Efficiency** through quick orientation for future work
- **Knowledge preservation** of important decisions and workarounds
- **Coordination** between project-level and feature-level concerns

## Tips for Success

1. **Update at checkpoints** - Update context when completing significant work, not at end of every conversation
2. **Keep it scannable** - Use bullet points, tables, clear sections
3. **Link context** - Reference specific files, components, or commits when relevant
4. **Be specific** - "Implemented drag-drop in formula library" not "made improvements"
5. **Document the why** - Record decisions and rationale, not just what was built

---

*Context system initialized: 2026-01-15*
