# ManageOffers Full Build — Create New Wizard + Manage Drawer

## Overview

Clone the remaining ~60 components from Gravitate's `Dashboard/SpecialOffers` module into the Excalibrr demo's `ManageOffers` page. The grid and page shell are already built; the Create New wizard and Manage drawer are placeholder shells that need full implementations.

**Source**: `/Users/frankoverland/Documents/Gravitate Repo/Gravitate.Dotnet.Next/frontend/src/modules/Dashboard/SpecialOffers/`
**Target**: `demo/src/pages/ManageOffers/`

## Scope

### Already Done
- ManageOffersPage.tsx (orchestrator)
- SpecialOffersGrid.tsx + ColumnDefs.tsx (16 columns)
- ManageOffers.types.ts, ManageOffers.data.ts
- styles.css, utils/formatters.ts
- Registered in pageConfig.tsx + AuthenticatedRoute.jsx

### Wave 1 — Utils (8 files)
Constants and helpers with no UI dependencies. All API calls become mock returns.

| File | Purpose |
|------|---------|
| `utils/Constants/FormConstants.ts` | Step definitions, validation rules, volume config |
| `utils/Constants/TimingWindowConstants.ts` | Default times, calendar structure |
| `utils/Utils/FormHelpers.ts` | Form validation per step (payload creation becomes no-op) |
| `utils/Utils/TimingWindowHelpers.ts` | Date validation, calendar generation, click state machine |
| `utils/Utils/StatusColors.ts` | Color mappings for offer status badges |
| `utils/Utils/CustomerEngagementHelpers.ts` | Engagement funnel stage calculations |
| `utils/Utils/OfferInfoHelpers.tsx` | Status logic, remaining label, status styles |
| `utils/Utils/VolumeAnalysisChartLabel.tsx` | Custom Recharts label component |

**Adaptations**: `moment` → `dayjs`. API type imports → local types.

### Wave 2 — Create New Wizard (30 files)
Multi-step form wizard: Deal Type → Products/Pricing → Timing → Customers.

**Build order** (leaf → root):
1. `Components/SelectionGrid/` — Reusable AG Grid wrapper + column defs (shared with Manage)
2. `Components/DealSelectionButtons.tsx` — Button component for deal type
3. `Components/SelectDealType.tsx` — Step 0
4. `Components/ConfigureFixedPrice.tsx` — Simple price input
5. `Components/ConfigureVolume.tsx` — Volume constraints form
6. `Components/ConfigureIndexPrice/` — Nested drawer (10 files: drawer, formula builder, display, preview, template helpers, column defs, constants)
7. `Components/SelectProductAndLocation.tsx` — Step 1 (routes to fixed or index pricing)
8. `Components/SelectTimingWindows.tsx` — Step 2 (dual calendar picker, 461 lines)
9. `Components/SelectInvitationDate.tsx` — Invitation trigger picker
10. `Components/SelectCustomers.tsx` — Step 3 (multi-select grid)
11. `Components/StepIndicator.tsx`, `Footer.tsx`, `PreviewPanel.tsx` — Navigation/preview
12. `CreateNewSpecialOffer.tsx` — Main wizard orchestrator
13. `Util/indexConfigHelpers.ts` + `styles.css`

**Adaptations**:
- `moment` → `dayjs`
- API hooks → no-op functions / mock data
- FormulaTemplates module → mock template data inline
- Custom icons (`BoxTagFilled`, `GavelIconFilled`) → Ant Design icon substitutes
- `useSpecialOffers()` → mock submit handler with success notification

### Wave 3 — Manage Drawer (27 files)
Tabbed drawer: Offer Info + Engagement analytics.

**Build order** (leaf → root):
1. `Components/SendReminder/` — Modal + header/footer/error (4 files, reuses SelectionGrid)
2. `Components/OfferInfo/` — 7 files (Price, Volume, PickupWindow, VisibilityWindow, Responses, IndexOfferDisplay, OfferInfo)
3. `Components/InvitationManagement.tsx` — Date management card
4. `Components/EngagementView/CustomerEngagementFunnel/` — Funnel + StageStatCard + ViewCustomers modal (3 files)
5. `Components/EngagementView/PriceDiscovery/` — Chart + Legend (3 files)
6. `Components/EngagementView/VolumeAnalysis/` — Chart + Legend + StatusBanner (4 files)
7. `Components/EngagementView/BidResponses/` — Grid + ColumnDefs (3 files)
8. `Components/EngagementView/EngagementView.tsx` — Container
9. `ManageSpecialOffer.tsx` — Main drawer orchestrator

**Adaptations**:
- `moment` → `dayjs`
- `useSpecialOffers()` → mock data / no-op mutations
- `useGridViewManager` → skip (not needed for demo)
- Recharts charts → same Recharts with mock data arrays
- API response types → local mock types

### Mock Data Strategy
- Extend existing `ManageOffers.data.ts` with:
  - Offer breakdown data (for Manage drawer)
  - Engagement funnel data (stage counts)
  - Price discovery chart data (historical prices)
  - Volume analysis chart data (time series)
  - Bid response rows (grid data)
  - Formula template options (for index pricing)
  - Product/location/customer lists (for wizard grids)

## Non-Goals
- No actual form submission or API integration
- No grid view persistence (useGridViewManager)
- No formula template CRUD — just selection from mock list
- No real date validation against server time

## Dependencies
All available in demo: `recharts`, `dayjs`, `antd`, `ag-grid-community`, `@gravitate-js/excalibrr`
