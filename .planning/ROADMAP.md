# Roadmap: Global Tier Diff

## Overview

Convert the existing GlobalTieredPricing single-page section into a two-page section: Tier Management (new CRUD page) and Tier Diff Entry (adapted existing page). Phase 1 sets up the navigation structure, Phase 2 builds the management page, Phase 3 adapts the pricing grid.

## Phases

- [ ] **Phase 1: Navigation Foundation** - Convert to section with sub-page routes
- [ ] **Phase 2: Tier Management** - GraviGrid CRUD for Tier Groups and Tier Levels
- [ ] **Phase 3: Tier Diff Entry** - Adapt existing grid with Group tabs and dynamic Level columns

## Phase Details

### Phase 1: Navigation Foundation
**Goal**: Convert GlobalTieredPricing from a single page into a section with two sub-page routes
**Depends on**: Nothing (first phase)
**Requirements**: NAV-01, CONV-01
**Research needed**: Unlikely — we know the pageConfig routes pattern from QuotePricing
**Success Criteria** (what must be TRUE):
  1. Nav sidebar shows "Global Tiered Diff" with two sub-page links (Tier Diff Entry, Tier Management)
  2. Clicking "Tier Diff Entry" loads the existing pricing grid unchanged
  3. Clicking "Tier Management" loads a placeholder page
  4. Both routes use PE_LIGHT theme wrapper
**Plans**: TBD

### Phase 2: Tier Management
**Goal**: Full Tier Management page with GraviGrid tabs, drawer CRUD, delete confirmation
**Depends on**: Phase 1
**Requirements**: MGMT-01, MGMT-02, MGMT-03, MGMT-04, MGMT-05, MGMT-06
**Research needed**: Unlikely — drawer CRUD and GraviGrid patterns already established in demo
**Success Criteria** (what must be TRUE):
  1. Tier Groups tab shows GraviGrid with Name, Description, Assigned Rows, Created, Actions columns
  2. Tier Levels tab shows GraviGrid with Level Name, Label, Sort Order, Actions columns
  3. Create drawer opens with form, saves new row, grid updates
  4. Edit drawer opens pre-populated, updates existing row
  5. Delete shows confirmation with impact warning, removes row from grid
**Plans**: TBD

### Phase 3: Tier Diff Entry
**Goal**: Adapt existing pricing page with Group tabs, dynamic Level columns, shared data, cross-links
**Depends on**: Phase 2
**Requirements**: ENTRY-01, ENTRY-02, ENTRY-03, ENTRY-04, NAV-02
**Research needed**: Unlikely — existing page already has GraviGrid with editable cells
**Success Criteria** (what must be TRUE):
  1. Tier Group tabs appear above the grid, switching tabs loads data for that group
  2. Tier Level columns are dynamically generated from Tier Levels defined on Management page
  3. Cells are editable diff values (4 decimal places, negative allowed)
  4. Cross-links work: Management links to Entry and vice versa
**Plans**: TBD

## Progress

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Navigation Foundation | 0/TBD | Not started | - |
| 2. Tier Management | 0/TBD | Not started | - |
| 3. Tier Diff Entry | 0/TBD | Not started | - |
