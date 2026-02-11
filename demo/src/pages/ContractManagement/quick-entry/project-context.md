# Quick Entry Tab - Project Context
*Last Updated: 2026-02-10*

## Wireframe Reference
**Source File:** `/Users/frankoverland/Documents/RFP_Formula/wireframes/round-two/quick-deal-bottom-drawer-v4.html`

This is the definitive wireframe for the Quick Entry tab UI. All implementation must match this wireframe's structure and UX patterns exactly.

---

## Page Structure Overview

### 1. Top Header Bar
```
┌─────────────────────────────────────────────────────────────────┐
│ [Page Title: "Quick Deal Entry"] [Badge: "New Contract"]        │
│                                         [Cancel] [Save as Draft]│
└─────────────────────────────────────────────────────────────────┘
```
- Page title with deal type badge (teal background)
- Right-aligned action buttons: Cancel, Save as Draft

### 2. Contract Header Sidebar (Active Layout)
```
┌──────────────────┬──────────────────────────────────────────────┐
│ [<] SIDEBAR      │ Main Content Area                            │
│ 445px expanded   │                                              │
│ 44px collapsed   │                                              │
│                  │                                              │
│ Contract Title   │ Contract Details Grid                        │
│ Status Badge     │                                              │
│ Contract Type    │                                              │
│ Description Card │                                              │
│ Counterparty     │                                              │
│ Dates Card       │                                              │
│ Quantities Card  │                                              │
│                  │                                              │
│ [Edit Details]   │                                              │
└──────────────────┴──────────────────────────────────────────────┘
```
- `ContractHeaderSidebar.tsx` — collapsible left panel (445px expanded, 44px collapsed)
- Shows: contract title card with status badge, contract type tag, description, counterparty, dates, require quantities
- Collapse/expand via chevron button
- "Edit Details" button opens EditHeaderModal
- **Note:** `ContractHeaderSection.tsx` (dark green inline bar) still exists but is inactive — controlled by `useSidebarLayout = true` in `QuickEntryFlow.tsx` (line 47)

### 3. Main Content Area - Contract Details Grid
```
┌─────────────────────────────────────────────────────────────────┐
│ Contract Details                [Apply to Selected] [+ Bulk Add]│
│                                                    [+ Add Detail]│
├─────────────────────────────────────────────────────────────────┤
│ □ | Detail ID | Product | Location | Start | End | Formula |Qty │
├─────────────────────────────────────────────────────────────────┤
│ (Empty State with centered actions when no rows)                │
│    📋 No Contract Details                                       │
│    Get started by choosing an option:                           │
│    [Upload from File]                                          │
│    [Add Row Manually]                                          │
│    [Add Multiple Rows]                                         │
│    [Copy from Existing Deal]                                   │
└─────────────────────────────────────────────────────────────────┘
```

#### Grid Columns (in order):
1. **Checkbox** - for bulk selection
2. **Detail ID** - monospace, gray badge style
3. **Product** - Select dropdown
4. **Location** - Select dropdown
5. **Start Date** - Date picker
6. **End Date** - Date picker
7. **Formula** - Clickable cell that opens bottom drawer
8. **Quantity** - Number input
9. **Status** - Status pill (Empty/In Progress/Ready)
10. **Destination** - Hidden by default
11. **Calendar** - Hidden by default

#### Empty State Actions:
- Upload from File (opens upload modal)
- Add Row Manually
- Add Multiple Rows (opens bulk create drawer)
- Copy from Existing Deal (opens modal)

### 4. Footer Bar
```
┌─────────────────────────────────────────────────────────────────┐
│                              [Cancel] [Save Draft] [Create ▶]   │
└─────────────────────────────────────────────────────────────────┘
```

---

## Bottom Drawer - Formula Editor

### Drawer Header
```
┌─────────────────────────────────────────────────────────────────┐
│ [▼ collapse] Formula Editor  [ULSD - Houston badge]       [✕]  │
└─────────────────────────────────────────────────────────────────┘
```

### Drawer Body - Two Column Layout

#### Left Column - Product Summary (220px fixed width)
```
┌──────────────────────┐
│ DETAIL SUMMARY       │
│ Product: ULSD        │
│ Destination: Term A  │
│ Location: Houston    │
│ Calendar: Contract   │
└──────────────────────┘
```
- Gray background (`#f9fafb`)
- Displays context for the selected row

#### Right Column - Formula Editor Content
```
┌─────────────────────────────────────────────────────────────────┐
│ ┌─────────────────────────────────────────────────────────────┐ │
│ │ [Generated Formula]: OPIS_Rack + 0.05                       │ │
│ └─────────────────────────────────────────────────────────────┘ │
│ [ ] Advanced mode   [+] [-] [*] [/] [(] [)] [MIN] [MAX]         │
│                                                                 │
│ Formula Variables                    [+ Add Variable] [Template]│
│ ┌─────────────────────────────────────────────────────────────┐ │
│ │Variable│Publisher│Instrument│Type│Diff│Date Rule│Display│Act│ │
│ ├─────────────────────────────────────────────────────────────┤ │
│ │ A      │ OPIS    │ Rack ULSD│Low │0.05│Contract │       │ 🗑│ │
│ └─────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

### Drawer Footer
```
┌─────────────────────────────────────────────────────────────────┐
│ [📋 Copy] [📄 Paste]                              [Apply]       │
└─────────────────────────────────────────────────────────────────┘
```

---

## Bulk Create Drawer

### Layout - Four Columns
```
┌─────────────────────────────────────────────────────────────────┐
│ [▼] Add Multiple Details                     [Cancel] [Create]  │
├─────────────────────────────────────────────────────────────────┤
│ Select Products  │ Select Locations │ Formula Template│ Preview │
│ [Search...]      │ [Search...]      │ [No template]   │ 0 items │
│ □ ULSD          │ □ Houston, TX    │ [Choose...]     │         │
│ □ RBOB          │ □ Dallas, TX     │                 │         │
│ □ Premium       │ □ Austin, TX     │                 │         │
│ □ Ethanol       │                  │                 │         │
└─────────────────────────────────────────────────────────────────┘
```

---

## Modal Components

### 1. Edit Header Modal
- 2-column form grid
- Fields: Internal Party, External Party, Start Date, End Date, Currency, UoM

### 2. Template Selection Modal
- List of formula templates
- Each item: Name + Formula preview + Arrow

### 3. Copy from Existing Deal Modal
- Search input
- List of recent deals with radio selection
- Option: "Include formulas from source deal"

### 4. Bulk Edit Modal
- Field selector (radio buttons)
- Each field has corresponding input that enables when selected

### 5. Upload Modal
- Dropzone for file upload
- Template download link
- Progress states

---

## Key Styling Patterns

### CSS Variables
```css
--gravitate-dark-green: #1a472a
--gravitate-dark-green-light: #2d5a3d
--gravitate-teal: #006d75
--gravitate-teal-bg: #e6fffb
--gravitate-success: #52c41a
--gravitate-error: #ff4d4f
--gravitate-warning: #faad14
--drawer-height: 520px
```

### Formula Cell Styling
- Clickable container with hover state
- Monospace font for formula preview
- Teal highlight when active
- Edit icon appears on hover

### Status Pills
- Empty: gray background, gray dot
- In Progress: yellow background, amber dot
- Ready: green background, green dot

### Variable Badges
- Default: gray background with dark green text
- Custom: teal background with teal text

---

## Implementation Status

| Component | Status | Notes |
|-----------|--------|-------|
| Page Layout | ✅ Complete | `QuickEntryFlow.tsx` - full page structure with all sections |
| TopHeader | ✅ Complete | Title, "New Contract" badge, Cancel/Save Draft buttons |
| ContractHeaderSection | ✅ Complete | Dark green info bar with Edit Details link |
| PanelHeader | ✅ Complete | "Contract Details" header with action buttons |
| Contract Details Grid | ✅ Complete | `DetailsGridSection.tsx` - GraviGrid with all columns |
| Empty State | ✅ Complete | `EmptyStateSection.tsx` - 4 entry path buttons |
| FooterBar | ✅ Complete | Cancel, Save Draft, Create Contract buttons |
| Formula Drawer | ✅ Complete | `FormulaEditorDrawer.tsx` - bottom drawer with two-column layout |
| Formula Editor Panel | ✅ Complete | Formula display, operator toolbar, variables table |
| Bulk Create Drawer | ✅ Complete | `BulkCreateDrawer.tsx` - product/location multi-select |
| Edit Header Modal | ✅ Complete | `EditHeaderModal.tsx` - two-column form |
| Template Modal | ✅ Complete | Integrated into `FormulaEditorDrawer.tsx` as inline `TemplateChooser` triggered by "Use Template" button |
| Copy from Deal Modal | ✅ Complete | `CopyDealModal.tsx` - deal search and selection |
| Bulk Edit Modal | ✅ Complete | `BulkEditModal.tsx` - field selector with inputs |
| Upload Modal | ✅ Complete | `ImportFileModal.tsx` - file upload dropzone |

### Known Issues
- TypeScript error in `FormulaEditorPanel.tsx` - Segmented component missing pointer event props (cosmetic, does not affect runtime)
- TypeScript error in `CreateContractPage.tsx` - same Segmented issue (cosmetic)

---

## File Structure (Actual)

```
src/pages/ContractManagement/
├── ContractManagementPage.tsx      # Contracts list page (master-detail GraviGrid)
├── ContractManagementPage.module.css
├── CreateContractPage.tsx          # Create/Edit/View entry point with Quick/Full toggle
├── CreateContractPage.module.css
├── index.ts                        # Module exports
├── project-context.md              # Main feature context
├── data/
│   └── contract.data.ts            # Mock data, reference arrays, helper functions
├── components/
│   ├── index.ts
│   ├── ContractDetailPanel.tsx     # Expandable detail panel + cell renderer
│   └── Footer.tsx                  # Footer component
├── types/
│   └── contract.types.ts           # Shared type definitions
├── quick-entry/
│   ├── QuickEntryFlow.tsx          # Main page component
│   ├── QuickEntryFlow.module.css
│   ├── project-context.md          # This file
│   ├── components/
│   │   ├── index.ts                # Component exports
│   │   ├── TopHeader.tsx           # Title + badge + actions
│   │   ├── TopHeader.module.css
│   │   ├── FooterBar.tsx           # Bottom action bar
│   │   ├── FooterBar.module.css
│   │   ├── FormulaEditorDrawer.tsx # Bottom formula drawer (includes TemplateChooser)
│   │   ├── FormulaEditorDrawer.module.css
│   │   ├── BulkCreateDrawer.tsx    # Bulk add details
│   │   ├── BulkCreateDrawer.module.css
│   │   ├── BulkEditModal.tsx       # Bulk edit selected
│   │   ├── BulkEditModal.module.css
│   │   ├── EditHeaderModal.tsx     # Edit contract header
│   │   ├── EditHeaderModal.module.css
│   │   ├── ImportFileModal.tsx     # Upload from file
│   │   ├── ImportFileModal.module.css
│   │   ├── CopyDealModal.tsx       # Copy from existing
│   │   ├── CopyDealModal.module.css
│   │   ├── ExtendContractModal.tsx # Extend expired contract
│   │   └── formula/
│   │       ├── index.ts
│   │       ├── FormulaEditorPanel.tsx
│   │       ├── FormulaEditorPanel.module.css
│   │       ├── formulaUtils.ts     # buildExpression, formula helpers
│   │       ├── OperatorToolbar.tsx
│   │       ├── OperatorToolbar.module.css
│   │       ├── VariablesTable.tsx
│   │       ├── VariablesTable.module.css
│   │       ├── ContextSummaryPanel.tsx
│   │       └── ContextSummaryPanel.module.css
│   └── sections/
│       ├── index.ts
│       ├── EmptyStateSection.tsx
│       ├── EmptyStateSection.module.css
│       ├── ContractHeaderSection.tsx    # Inline green bar (inactive, useSidebarLayout=true)
│       ├── ContractHeaderSection.module.css
│       ├── ContractHeaderSidebar.tsx    # Collapsible left sidebar (active layout)
│       ├── ContractHeaderSidebar.module.css
│       ├── DetailsGridSection.tsx
│       └── DetailsGridSection.module.css
└── full-entry/
    ├── FullEntryFlow.tsx           # Two-column header form
    ├── FullEntryFlow.module.css
    ├── fullentry.types.ts
    ├── fullentry.defaults.ts
    └── sections/
        ├── index.ts
        ├── AdditionalInfoSection.tsx
        ├── ContractTypeSidebar.tsx
        ├── CounterpartySection.tsx
        └── TradeInfoSection.tsx
```

---

## Next Steps

1. ~~Create folder structure and base files~~ ✅
2. ~~Implement page layout with header, info bar, content area~~ ✅
3. ~~Build ContractDetailsGrid with proper columns~~ ✅
4. ~~Create empty state component~~ ✅
5. ~~Build FormulaDrawer with two-column layout~~ ✅
6. ~~Add remaining modals and drawers~~ ✅

### Remaining Work
1. ~~**FIX FormulaEditorPanel layout**~~ ✅ DONE — CSS flex layout restored (`.formulaSection { flex: 0 0 auto }`, `.variablesSection { flex: 1; overflow-y: auto; min-height: 0 }`)
2. **Fix TypeScript errors** - Segmented component type issues (cosmetic, does not affect runtime)
3. ~~**Template Modal**~~ ✅ DONE — Integrated into FormulaEditorDrawer as inline TemplateChooser
4. **Visual QA** - Compare implementation against wireframe
5. **Integration testing** - Test all entry paths and workflows
6. **Edge cases** - Error handling, validation, loading states

---

## Session Log

### Session 1 (2026-02-04) - Initial Implementation
- Created complete folder structure
- Built all core components: TopHeader, FooterBar, PanelHeader, ContractHeaderSection
- Implemented DetailsGridSection with GraviGrid
- Built EmptyStateSection with 4 entry paths
- Created FormulaEditorDrawer with two-column layout
- Implemented formula editor sub-components (OperatorToolbar, VariablesTable, etc.)
- Built all modals: EditHeaderModal, BulkCreateDrawer, BulkEditModal, ImportFileModal, CopyDealModal
- Integrated all components into QuickEntryFlow.tsx
- Wired up state management and handlers

### Session 2 (2026-02-05) - Status Review
- Updated project-context.md to reflect actual implementation status
- Identified TypeScript errors with Segmented component
- Template Modal identified as remaining unimplemented feature

### Session 3 (2026-02-05) - Formula Editor Visual Layout Fix Attempt

**Goal:** Fix visual issues in FormulaEditorPanel — label cutoff, spacing, variables table not filling space.

**Changes Made:**
- Replaced floating label with stacked Texto pattern
- Replaced CSS class-based layout with Excalibrr component props
- Simplified CSS by removing layout classes

**Outcome:** Label cutoff fixed but layout was broken (gaps too large, variables section pushed off-screen). Required follow-up fix in Session 4.

### Session 4 (2026-02-10) - Layout Fix, Template Chooser, Sidebar, and New Components

**Completed:**
1. **FormulaEditorPanel layout FIXED** — Restored CSS flex layout in `FormulaEditorPanel.module.css`:
   - `.formulaSection { flex: 0 0 auto }` — takes only natural size
   - `.variablesSection { flex: 1; overflow-y: auto; min-height: 0 }` — fills remaining space and scrolls
   - This resolved the Session 3 layout issues (big gaps, missing variables section)

2. **Template Chooser integrated** — `FormulaEditorDrawer.tsx` now embeds `TemplateChooser` component inline. "Use Template" button toggles the chooser panel. Templates apply via `FormulaTemplateContext`.

3. **ContractHeaderSidebar** — New collapsible sidebar layout (445px expanded, 44px collapsed) replaces the dark green inline bar. Shows contract title, status badge, type, description, counterparty, dates. Controlled by `useSidebarLayout = true` in `QuickEntryFlow.tsx`.

4. **ExtendContractModal** — New modal for extending expired contracts with new date range. Used in view mode.

5. **formulaUtils.ts** — Extracted `buildExpression()` and formula helper functions into dedicated utility file.

6. **Formula mode support** — FormulaEditorPanel supports multiple formula modes (Standard, Lower of Two, Lower of Three) via dropdown selector, with grouped variable sections for compound formulas.

**Key Decisions:**
- Sidebar layout preferred over inline green bar — provides more space for contract metadata
- Template chooser is inline within the drawer (not a separate modal) — reduces modal nesting
- CSS flex classes restored for formula panel — Excalibrr component props alone didn't provide sufficient flex control for the complex drawer layout
