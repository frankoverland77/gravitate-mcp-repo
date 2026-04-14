# Requirements: Global Tier Diff

## Navigation & Structure

- **NAV-01**: Convert GlobalTieredPricing from single-page section to section with sub-page routes (same pattern as QuotePricing)
- **NAV-02**: Cross-linking between Tier Management and Tier Diff Entry pages

## Tier Management

- **MGMT-01**: Tier Management sub-page with two tabs — Tier Groups and Tier Levels
- **MGMT-02**: Tier Groups GraviGrid — columns: Name, Description, Assigned Rows, Created, Actions
- **MGMT-03**: Tier Levels GraviGrid — columns: Level Name, Label, Sort Order, Actions
- **MGMT-04**: Drawer-based create/edit flow for Tier Groups (name required, description optional)
- **MGMT-05**: Drawer-based create/edit flow for Tier Levels (name required, label required, sort order required)
- **MGMT-06**: Delete with confirmation for both groups and levels

## Tier Diff Entry

- **ENTRY-01**: Adapt existing page with Tier Group tabs across the top (each tab = one group)
- **ENTRY-02**: Dynamic Tier Level columns driven by levels defined on Management page
- **ENTRY-03**: Product-location rows with editable diff values per Tier Level column
- **ENTRY-04**: Shared data layer — groups/levels from Management drive columns/tabs on Entry

## Conventions

- **CONV-01**: Follow existing demo patterns — GraviGrid with control bars, drawers for CRUD, Excalibrr components, no raw HTML

## Out of Scope

- Quote Rows tier assignment columns — future milestone
- Quote Book tier diff view columns — future milestone
- Scoped edit permissions (Layer 3) — PRD deferred
- Custom tier naming (Diamond/Gold/Silver) — PRD open question
- Wireframe files — early iteration, not to be used

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| NAV-01 | Phase 1 | Pending |
| NAV-02 | Phase 3 | Pending |
| MGMT-01 | Phase 2 | Pending |
| MGMT-02 | Phase 2 | Pending |
| MGMT-03 | Phase 2 | Pending |
| MGMT-04 | Phase 2 | Pending |
| MGMT-05 | Phase 2 | Pending |
| MGMT-06 | Phase 2 | Pending |
| ENTRY-01 | Phase 3 | Pending |
| ENTRY-02 | Phase 3 | Pending |
| ENTRY-03 | Phase 3 | Pending |
| ENTRY-04 | Phase 3 | Pending |
| CONV-01 | Phase 1 | Pending |

**Coverage:**
- v1 requirements: 13 total
- Mapped to phases: 13
- Unmapped: 0 ✓
