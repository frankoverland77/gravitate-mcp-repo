# Contract Management Demo - Project Context
*Last Updated: 2026-02-16*

## Purpose
Demo/prototype of the Gravitate Contract Management module using Excalibrr components.

---

## Source of Truth - Gravitate Repo Locations

All contract creation components come from:
**`/Users/frankoverland/Documents/Gravitate Repo/Gravitate.Dotnet.Next/frontend/src/`**

### Main Entry Point
- **`/modules/ContractManagement/page.tsx`** - Main router (header vs details mode)

### Header Entry View (Contract Creation Form)
- **`/modules/ContractManagement/components/HeaderEntry/index.tsx`** - Main header form container

### Form Sections

| Section | Gravitate Component | Fields |
|---------|---------------------|--------|
| Contract Type | `/components/ContractTypeCheckboxGroup/index.tsx` | TradeInstrumentId (radio), Description, Comments |
| Counterparty Info | `/modules/ContractManagement/components/CounterpartyInfoForm/index.tsx` | Internal/External cascaders |
| Trade Info | `/modules/ContractManagement/components/TradeInfoForm/index.tsx` | Calendar, Dates, Quantities switch |
| Additional Info | `/modules/ContractManagement/components/AdditionalInfoForm/index.tsx` | Contract #s, Movement Type, Strategy |

### Shared Components
- **`/components/shared/Navigation/Footer/Footer.tsx`** - Footer bar with icon+title and action buttons

### API & Types
- **`/modules/ContractManagement/api/useContracts.ts`** - All API hooks
- **`/modules/ContractManagement/api/types.schema.ts`** - TypeScript types
- **Metadata endpoint:** `ContractManagement/MetaData`
- **Submit endpoint:** `ContractManagement/Upsert`

---

## Contract Creation Data Flow

```
1. User navigates to /Contracts/CreateContract
2. Load Metadata (dropdowns, options)
3. Render HeaderEntryView with 4 sections:
   - Contract Type & Description (sidebar)
   - Counterparty Info
   - Trade Info
   - Additional Info
4. Click "Manage Details" → validates & saves header
5. Switch to Details mode → add line items
6. Click "Save As..." or "Activate" → submit contract
```

---

## Required Fields (Header → Details)

**Must have:**
1. Trade Instrument (Contract Type)
2. Internal Counterparty & Contact
3. External Counterparty (contact optional)
4. Contract Calendar
5. Contract Date
6. Effective Dates (range)

**Optional:**
- Description, Comments
- Internal/External Contract Numbers
- Movement Type, Strategy

---

## Metadata Structure

```typescript
{
  InternalCounterPartyList: SelectOption[]
  InternalColleagueList: SelectOption[]  // filtered by GroupingValue
  ExternalCounterPartyList: SelectOption[]
  ExternalColleagueList: SelectOption[]  // filtered by GroupingValue
  TradeInstrumentList: SelectOption[]    // Contract types
  PricingCalendars: SelectOption[]
  MovementTypes: SelectOption[]
  Books: SelectOption[]                  // Strategies
}
```

---

## Layout Pattern (Gravitate Production)

```
┌────────────────────────────────────────────────────────────────┐
│ Page Header: Back button + "Create Contract" + Mode selector   │
├─────────────────┬──────────────────────────────────────────────┤
│ LEFT SIDEBAR    │ RIGHT MAIN PANEL                              │
│ flex='1 0 150px'│ flex={5}                                      │
│ bg-2 p-5 border │                                               │
│                 │ ┌──────────────────────────────────────────┐ │
│ Contract Type   │ │ Form Container: bg-2 bordered p-5        │ │
│ (Radio buttons) │ │                                          │ │
│                 │ │ "Contract Header" title                  │ │
│ Description     │ │                                          │ │
│ (Input)         │ │ CounterpartyInfoForm                     │ │
│                 │ │ TradeInfoForm                            │ │
│ Comments        │ │ AdditionalInfoForm                       │ │
│ (TextArea)      │ │                                          │ │
│                 │ └──────────────────────────────────────────┘ │
│                 │                                               │
│                 │ ┌──────────────────────────────────────────┐ │
│                 │ │ FOOTER BAR                               │ │
│                 │ │ [Icon] Header Entry    [Cancel] [Manage] │ │
│                 │ │ (blue underline)                         │ │
│                 │ └──────────────────────────────────────────┘ │
└─────────────────┴──────────────────────────────────────────────┘
```

---

## Gravitate File Structure Reference

```
/modules/ContractManagement/
├── page.tsx                          # Main router
├── api/
│   ├── useContracts.ts              # API hooks
│   └── types.schema.ts              # Types
├── components/
│   ├── HeaderEntry/index.tsx        # Header form container
│   ├── ContractTypeCheckboxGroup/   # Contract type radios
│   ├── CounterpartyInfoForm/        # Internal/External parties
│   ├── TradeInfoForm/               # Dates & quantities
│   ├── AdditionalInfoForm/          # Optional fields
│   ├── DetailsView/                 # Post-header details
│   ├── DetailManager/               # Detail line editor
│   └── SaveAsModal.tsx              # Save/activate modal
└── utils/
```

---

## Demo Progress

### Completed
- [x] CreateContractPage with mode selector (Quick/Full)
- [x] QuickEntryFlow - Simplified single-page flow
- [x] FullEntryFlow - Two-column layout matching Gravitate
- [x] Footer component with icon+title pattern
- [x] ContractTypeSidebar (Contract Type, Description, Comments)
- [x] CounterpartySection (Internal/External parties)
- [x] TradeInfoSection (Calendar, Dates, Quantities)
- [x] AdditionalInfoSection (Contract #s, Movement, Strategy)

### TODO
- [ ] Wire up actual Cascader components for counterparties (currently using Select — sufficient for demo)
- [ ] Add form validation matching Gravitate rules
- [x] Implement Details View mode — `CreateContractPage` supports create/edit/view via `derivePageMode()`
- [ ] Add Save/Activate modal flow
- [ ] Connect to mock API endpoints (mock data in `data/contract.data.ts` sufficient for demo)
- [x] Day Deal flat grid-first redesign — supplier per-row, no header/calendar, fill handle enabled
- [x] Volume Grouping in Quick Entry — panel, grid column, bulk bar, 4 assignment methods

---

## ContractManagementPage (List Page)

Master-detail contracts list built with GraviGrid:
- **5 mock contracts** in `data/contract.data.ts` with varied statuses (active, draft, pending, expired)
- **Status column** uses `BBDTag` with success/warning/error colors
- **Expandable rows** — `ContractDetailCellRenderer` shows nested detail grid with contract line items
- **Actions** — "Create Contract" button navigates to `/Contracts/CreateContract`; row click navigates to edit/view
- **PE_LIGHT theme** via `ThemeRouteWrapper`

---

## Routing Structure

| Route | Component | Description |
|-------|-----------|-------------|
| `/Contracts/ContractsList` | `ContractManagementPage` | All contracts list (master-detail grid) |
| `/Contracts/CreateContract` | `CreateContractPage` | New contract (Quick/Full entry toggle) |
| `/Contracts/EditContract?contractId=X` | `CreateContractPage` | Edit/view existing contract |

- All 3 routes configured in `pageConfig.tsx` under `getContractManagementRoutes()`
- Scope: `Contracts` in `AuthenticatedRoute.jsx`
- Theme: `PE_LIGHT` on all routes
- Navigation: sidebar item "Contracts" with sub-item "All Contracts"

---

## CreateContractPage Modes

`CreateContractPage.tsx` supports three modes derived from contract status:

| Mode | When | Behavior |
|------|------|----------|
| `create` | No `contractId` param | Empty form, all fields editable |
| `edit` | `contractId` with draft/pending/active status | Pre-populated, editable with status-based restrictions |
| `view` | `contractId` with expired status | Read-only, "Extend Contract" option via `ExtendContractModal` |

Mode is derived by `derivePageMode()` in `data/contract.data.ts`. The page uses `Segmented` control to toggle between Quick Entry and Full Entry tabs.

---

## Quick Entry Sidebar Layout

The Quick Entry flow uses a collapsible sidebar (`ContractHeaderSidebar.tsx`) instead of the original dark green inline bar:
- **Expanded**: 445px wide — shows contract title, status badge, type tag, description, counterparty, dates, quantities
- **Collapsed**: 44px wide — just a chevron button to re-expand
- **Toggle**: `useSidebarLayout = true` in `QuickEntryFlow.tsx` (line 47)
- The original `ContractHeaderSection` (dark green bar) still exists but is inactive

---

## Shared Data (`data/contract.data.ts`)

Centralized mock data and helper functions:
- `PRODUCT_OPTIONS` — 6 products (CBOB, RBOB, Premium, ULSD, Biodiesel B5/B20)
- `LOCATION_OPTIONS` — 6 terminals across regions
- `INTERNAL_PARTY_OPTIONS` — 3 internal entities
- `EXTERNAL_PARTY_OPTIONS` — 8 counterparties
- `MOCK_CONTRACTS` — 5 contracts with nested details, formulas, statuses
- `getContractById()` — lookup by ID
- `contractToHeader()` — convert list item to header form
- `derivePageMode()` — status → create/edit/view mode

---

## Session Log

### Session 1 (2026-02-04) - Layout Rebuild

**Completed:**
- Rebuilt FullEntryFlow to match Gravitate production layout
- Created Footer component matching Gravitate pattern
- Removed Steps wizard navigation
- Implemented two-column layout (sidebar + main panel)

**Key Decisions:**
- Footer uses `borderBottom: 3px solid var(--theme-color-2)` for blue underline
- Sidebar uses `flex: 1 0 150px`, main panel uses `flex: 5`
- No Steps navigation - direct form layout like production

**Verification:**
- Page loads with correct two-column layout
- Footer shows "Header Entry" with icon and action buttons
- No Steps navigation at top

### Session 2 (2026-02-05) - Formula Editor Variables Grid

**Completed:**
- Replaced custom VariablesTable with GraviGrid implementation
- Pattern based on ContractDetails demo grid (lines 840-1132)
- Simplified CSS from 68 lines to 10 lines (GraviGrid handles most styling)

**Key Changes:**
- Uses `agSelectCellEditor` for dropdown columns (Publisher, Instrument, Type, Date Rule)
- Configured `domLayout: 'autoHeight'` for proper sizing in drawer
- Cell value changes handled via `onCellValueChanged` in agPropOverrides
- Delete action via custom cellRenderer with DeleteOutlined icon
- Empty state via `overlayNoRowsTemplate`

**Reference Pattern:**
- `src/pages/demos/grids/ContractDetails.tsx` - Formula grid pattern
- `src/components/shared/Grid/FormulaComponentsGrid.tsx` - GraviGrid with hideControlBar

**Files Modified:**
- `quick-entry/components/formula/VariablesTable.tsx` - Full rewrite
- `quick-entry/components/formula/VariablesTable.module.css` - Simplified

### Session 3 (2026-02-10) - Full Integration: List Page, Routing, Sidebar, Templates

**Completed:**
- **ContractManagementPage** — Master-detail list page with GraviGrid, 5 mock contracts, BBDTag status rendering, expandable detail rows, navigation to create/edit
- **3-route structure** — ContractsList, CreateContract, EditContract all configured in pageConfig.tsx with PE_LIGHT theme
- **Create/Edit/View modes** — `CreateContractPage` derives mode from contract status via `derivePageMode()`. View mode (expired contracts) is read-only with ExtendContractModal option
- **ContractHeaderSidebar** — Collapsible left sidebar (445px/44px) replaces dark green inline bar for Quick Entry. Shows contract metadata cards
- **ExtendContractModal** — Modal for extending expired contracts with new date range
- **Template Chooser** — Integrated into FormulaEditorDrawer as inline TemplateChooser (not a separate modal)
- **FormulaEditorPanel layout fix** — Restored CSS flex layout that was broken in Session 3 of quick-entry context
- **formulaUtils.ts** — Extracted formula helper functions (buildExpression, etc.)
- **Formula mode support** — Standard, Lower of Two, Lower of Three modes with grouped variable sections
- **Shared data layer** — `data/contract.data.ts` with mock contracts, reference arrays, helper functions

**Key Decisions:**
- Sidebar layout over inline bar — more space for metadata display
- Template chooser inline in drawer — reduces modal nesting
- Mock data sufficient for demo — no API needed
- PE_LIGHT theme for all contract routes — matches Pricing Engine aesthetic

### Session 4 (2026-02-12) - Day Deal Screen Redesign — Flat Grid-First Entry

**Completed:**
- **Flat grid-first layout** — Removed header bar (`ContractHeaderSection`), inline calendar (`DayDealCalendar`), empty state screen, and edit header modal. Users land directly on an editable grid with 1 empty row ready to fill.
- **Supplier column** — Replaced Detail ID badge column with editable Supplier dropdown (`EXTERNAL_PARTY_OPTIONS` via `agSelectCellEditor`). Each row is now a fully independent deal.
- **Renamed Quantity → Volume** — Column header and bulk edit modal both say "Volume" now. Volume is **optional** (many day deals are "optional pickup").
- **Updated validation** — Required fields: supplier, product, location, price. Volume removed from required checks.
- **Fill handle + range selection** — Enabled `enableFillHandle` and `enableRangeSelection` in agPropOverrides for spreadsheet-like drag-down population.
- **Control bar updates** — Title: "Day Deals (N)" (was "Day Deal Details (N Results)"). New "Import" button with `UploadOutlined` icon. "Add Detail" renamed to "Add Day Deal". Removed `size='small'` from all buttons.
- **Bulk edit modal** — Added Supplier as first editable field with Select dropdown. Default selected field is now Supplier.
- **New rows default** — `startDate = today`, `endDate = today`, `supplier = ''`
- **Type update** — Added `supplier?: string` to `ContractDetail` interface (optional, no impact on Quick Entry or Full Entry)

**Files Modified:**
- `types/contract.types.ts` — Added `supplier?: string` to `ContractDetail`
- `day-deal/DayDealFlow.tsx` — Major rewrite (removed header/calendar/empty state, grid-first)
- `day-deal/DayDealFlow.module.css` — Simplified to just `.page-wrapper`
- `day-deal/sections/DayDealGridSection.tsx` — Supplier column, Volume rename, fill handle, Import button
- `day-deal/components/DayDealBulkEditModal.tsx` — Added Supplier field, Volume rename

**Files Deleted:**
- `day-deal/components/DayDealCalendar.tsx`
- `day-deal/components/DayDealCalendar.module.css`

**Key Decisions:**
- Flat grid over header-then-details — eliminates repeated header flow when entering deals from multiple suppliers on a fast-moving market day
- Supplier per-row instead of per-contract — each row is independent, grouped by supplier only at submission time
- Volume optional — real-world day deals often have no quantity commitment
- Dates default to today (not header dates) — day deals are same-day by nature
- No empty state screen — grid starts with 1 row, "Add Day Deal" / "Bulk Add" / "Import" all in the control bar

### Session 5 (2026-02-16) - Volume Grouping in Quick Entry

**Completed:**
- **Full volume grouping system** — 17 new files, 5 modified files implementing the complete volume group feature for Quick Entry flow
- **Grid column** — `VolumeGroupCellRenderer` shows colored pills for assigned groups or "None" empty state; `VolumeGroupCellEditor` provides inline multi-select dropdown with checkmarks and "Create New Group" option
- **Right-side panel** — `VolumeGroupPanel` (380px flex sibling, NOT a drawer) with 3 navigable views: list, edit, create
- **Panel list view** — `GroupPanelListView` shows group tiles with allocation bars, detail counts, and compliance badges
- **Panel edit view** — `GroupPanelEditView` shows group details with assigned detail chips (removable), toggle between edit and apply modes
- **Panel create view** — `GroupPanelCreateView` form for new groups with name, allocation, unit, frequency, min/max percent fields
- **Floating bulk bar** — `FloatingBulkBar` slides up when rows selected, column picker (Volume Group / Calendar) + value dropdown + Apply button
- **Utility functions** — `volumeGroup.utils.ts` with add/remove/toggle/clear/sync functions
- **4 assignment methods** — (1) Inline cell editor multi-select, (2) Panel edit/apply toggle, (3) Floating bulk bar, (4) Drag-and-drop to panel tiles

**Architecture Decisions:**
- `detail.volumeGroupIds: string[]` is the **single source of truth** — `group.detailIds` is always derived via `syncGroupDetailIds()` after every mutation
- Panel is a **flex sibling** (380px), not a Drawer — compresses the grid rather than overlaying it
- AG Grid `cellEditorPopup` for inline multi-select dropdown — avoids cell overflow issues
- `AllocationProgressBar` reusable component with compliance-aware coloring (green=ok, amber=warning)
- `GroupDetailChip` shows product/location summary with removable × button

**Types Added:**
- `VolumeGroup` — id, name, allocation, allocationUnit, minPercent, maxPercent, frequency, detailIds, compliance, liftedPercent
- `AllocationUnit` — 'gal/yr' | 'gal/mo' | 'gal/qtr' | 'bbl/yr' | 'bbl/mo'
- `GroupFrequency` — 'Monthly' | 'Quarterly' | 'Annually'
- `GroupCompliance` — 'ok' | 'warning'
- `VolumeGroupPanelView` — 'list' | 'edit' | 'create'
- `ExternalAllocation` — for future external system import
- `volumeGroupIds?: string[]` added to `ContractDetail`

**New Files (17):**
- `quick-entry/volumeGroup.utils.ts` — Utility functions
- `quick-entry/components/volume-group/index.ts` — Barrel exports
- `quick-entry/components/volume-group/VolumeGroupCellRenderer.tsx` + `.module.css`
- `quick-entry/components/volume-group/VolumeGroupCellEditor.tsx` + `.module.css`
- `quick-entry/components/volume-group/AllocationProgressBar.tsx` + `.module.css`
- `quick-entry/components/volume-group/GroupDetailChip.tsx`
- `quick-entry/components/volume-group/GroupPanelListView.tsx` + `.module.css`
- `quick-entry/components/volume-group/GroupPanelEditView.tsx` + `.module.css`
- `quick-entry/components/volume-group/GroupPanelCreateView.tsx` + `.module.css`
- `quick-entry/sections/VolumeGroupPanel.tsx` + `.module.css`
- `quick-entry/components/FloatingBulkBar.tsx` + `.module.css`

**Modified Files (5):**
- `types/contract.types.ts` — Added VolumeGroup, AllocationUnit, GroupFrequency, GroupCompliance, VolumeGroupPanelView, ExternalAllocation types; added `volumeGroupIds?: string[]` to ContractDetail
- `data/contract.data.ts` — Added MOCK_VOLUME_GROUPS (3 groups) and MOCK_EXTERNAL_ALLOCATIONS (2 entries); added volumeGroupIds to existing mock details
- `quick-entry/QuickEntryFlow.tsx` — Added volume group state, 8 handler functions, VolumeGroupPanel + FloatingBulkBar integration
- `quick-entry/sections/DetailsGridSection.tsx` — Added Volume Group column with custom cell renderer/editor, "Manage Groups" button in control bar
- `quick-entry/components/index.ts` — Added FloatingBulkBar export
- `quick-entry/sections/index.ts` — Added VolumeGroupPanel export
