# Global Tier Diff — Group Differential Management

## What This Is

Two sub-pages under the existing Global Tiered Diff nav section in the excalibrr MCP server demo. Tier Management lets users create and manage Tier Groups and Tier Levels via GraviGrid + drawer CRUD. Tier Diff Entry adapts the existing pricing grid so columns are driven by Tier Levels and tabs switch between Tier Groups — collapsing per-row pricing decisions into per-tier decisions.

## Core Value

The two-dimensional grouping abstraction (Groups x Levels) must work end-to-end: define groups/levels on Management, see them drive columns and tabs on Diff Entry.

## Requirements

### Validated

- ✓ GraviGrid-based pricing grid with editable cells, bulk edit, undo/redo — existing GlobalTieredPricing page
- ✓ Navigation section registered in pageConfig + AuthenticatedRoute — existing GlobalTieredPricing entry
- ✓ PE_LIGHT theme applied via ThemeRouteWrapper — existing

### Active

- [ ] Convert GlobalTieredPricing from a single-page section to a section with sub-page routes (same pattern as QuotePricing with Quote Book / Manage Quote Rows / Quotebook Wholesale)
- [ ] **Tier Management sub-page:** GraviGrid with two tabs (Tier Groups / Tier Levels), drawer-based create/edit flow, delete with confirmation
- [ ] **Tier Groups grid:** Columns — Name, Description, Assigned Rows, Created, Actions. Drawer for create/edit with name (required) + description fields
- [ ] **Tier Levels grid:** Columns — Level Name, Label, Sort Order, Actions. Drawer for create/edit with name (required), label (required), sort order (required) fields
- [ ] **Tier Diff Entry sub-page:** Adapt existing page — Tier Group tabs across the top, dynamic Tier Level columns (driven by however many levels exist on the Management page), product-location rows, editable diff values
- [ ] Cross-linking between the two pages (Management can navigate to Entry and vice versa)
- [ ] Shared data layer — Tier Groups and Tier Levels defined on Management page drive the columns/tabs on Diff Entry
- [ ] Follow existing demo patterns: GraviGrid with control bars, drawers for CRUD, Excalibrr components (Vertical/Horizontal/Texto/GraviButton), no raw HTML

### Out of Scope

- Quote Rows tier assignment columns — future milestone, user will point to where they go
- Quote Book tier diff view columns — future milestone, same
- Scoped edit permissions (Layer 3 in PRD) — PRD flags as open/deferred
- Custom tier naming (Diamond/Gold/Silver vs Tier 1/2/3) — PRD open question, not resolved yet
- Wireframe files in `/Documents/DIff Tier and Groups/wireframes-r1/` — early iteration, not to be used

## Context

- **Codebase:** `/Users/frankoverland/Documents/repos/excalibrr-mcp-server/demo/src/pages/GlobalTieredPricing/`
- **Repo root:** `/Users/frankoverland/Documents/repos/excalibrr-mcp-server/`
- **PRD:** "Group Differential Management - PRD v2" — defines Tier Groups (like Publishers), Tier Levels (like Price Types), Tier Diffs (the differential value at a Group x Level intersection)
- **Kickoff call (Apr 13):** Agustin confirmed this is user-facing (not admin), one page for both concepts, Competitor Mappings is the closest existing reference for how management should feel
- **Navigation pattern reference:** QuotePricing section in pageConfig — has `routes` array with multiple sub-pages. GlobalTieredPricing currently uses a single `element` (no routes). Needs conversion to `routes` pattern.
- **Existing page files:** GlobalTieredPricing.tsx (main), .types.ts, .data.ts, .columnDefs.ts, .css, components/BulkEditModal.tsx, components/SpreadConfigPanel.tsx
- **Shared data:** Product/location data generated from `../../shared/data` — reuse for Tier Diff Entry rows

## Constraints

- **Tech stack**: Excalibrr components (GraviGrid, Vertical, Horizontal, Texto, GraviButton), antd (Tabs, Drawer, Modal, Form, Input, message), AG Grid via GraviGrid. No raw HTML.
- **Demo conventions**: Follow `demo/skills/solutions-demo-builder/SKILL.md` workflow. Read `component-api.md` before generating code. Run pre-commit hook before presenting.
- **Navigation**: Must update both `pageConfig.tsx` AND `AuthenticatedRoute.jsx` when changing nav structure.
- **Pattern fidelity**: Must match existing demo page patterns — GraviGrid with control bars, drawer CRUD flows. No antd Table, no custom HTML tables.

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Sub-page routes, not tabs | User explicit: "they're not tabs, they're sub pages that go in the top menu like normal" | — Pending |
| Drawer for CRUD, not modal | User chose drawer pattern. Matches Competitor Mappings reference. | — Pending |
| Dynamic Level columns on Diff Entry | Columns driven by Tier Levels from Management page. If 3 levels, 3 columns. | — Pending |
| Tier Group tabs on Diff Entry | Each tab loads different data for that group's product-location combinations | — Pending |
| PRD fields only for data model | Name, description, assignedRows, created for Groups. Name, label, sortOrder for Levels. | — Pending |
| Don't reference wireframe files | Early iteration wireframes are incorrect. Work from PRD + call notes only. | — Pending |

---
*Last updated: 2026-04-14 after initialization*
