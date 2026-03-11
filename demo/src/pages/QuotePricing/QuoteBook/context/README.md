# Context Folder — QuoteBook Price Exceptions

This folder stores reference materials, architecture diagrams, and session notes that support the main project context.

## Contents

- **Session notes** — Per-session learnings and decisions not critical to the main project-context.md
- **Architecture sketches** — Visual diagrams or design specs relevant to phases
- **Implementation checklists** — Phase-specific task breakdowns for quick reference

## Usage

Each file in this folder should be named clearly and dated if it documents a specific session or decision. Cross-reference from the main project-context.md as needed.

Example structure:
```
context/
├── 2026-03-09-phase-1-learnings.md
├── 2026-03-10-phase-2-layout-plan.md
└── drawer-state-machine-diagram.txt
```

## Relationship to project-context.md

- **project-context.md** is the authoritative source of truth for project status, decisions, and next steps
- **context/** folder provides supporting detail without duplicating the main file
- Always update project-context.md first; create context files only for extended reference material

## See Also

- [Implementation Docs](../../../../../Documents/Exceptions/implementation-docs/) — Phase-by-phase requirements and acceptance criteria
- [main project-context.md](../project-context.md) — Current status, decisions, and session log
