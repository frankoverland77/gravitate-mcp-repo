# RFP Management Feature - Project Context
*Last Updated: 2026-01-16 (Session 3)*

## Overview
RFP (Request for Proposal) Management is a new tab within Contract Measurement that enables users to manage supplier bidding rounds, compare proposals, and award contracts.

**Source Documents:**
- Spec: `/Users/frankoverland/Documents/PE_RFP/RFP_WIREFRAME_SPEC.md`
- Wireframe: `/Users/frankoverland/Documents/PE_RFP/wireframes/rfp-full-experience.html`

---

## Feature Flow

```
RFP List → Round 1 (8 suppliers) → Round 2 (3 finalists) → Round N... → Award → Success
```

### Screens
1. **RFP List** - Grid showing all RFPs with status, supplier count, target price
2. **Round N** - Compare suppliers, select 2-3 to advance to next round OR select 1+ to award
3. **Award** - Review winner details, preview contract
4. **Success** - Confirmation with next steps

### Multi-Round Support (Session 3)
- Any round can advance to the next (R1→R2→R3→R4...)
- All rounds use checkboxes for multi-select (no radio buttons)
- Eliminated suppliers from previous rounds shown in collapsible section
- Users can Award from any round (not just final round)

---

## File Structure

```
src/pages/RFP/
├── RFPTab.tsx                  # Main tab with screen routing
├── rfp.types.ts                # All RFP TypeScript types
├── rfp.data.ts                 # Mock data and helpers
├── sections/
│   ├── RFPListSection.tsx      # GraviGrid list of RFPs
│   ├── RoundStepper.tsx        # Progress stepper (R1 → R2 → ... → Award)
│   ├── AIRecommendationsPanel.tsx  # Gravitate Analysis panel
│   ├── ComparisonToolbar.tsx   # Sort, search, threshold pills, actions
│   ├── SupplierMatrixSection.tsx   # Comparison table (AntD Table)
│   ├── DetailGridSection.tsx   # Product/location breakdown
│   ├── EliminatedSuppliersSection.tsx  # Collapsible eliminated bids (Session 3)
│   ├── HistoricalRFPSection.tsx    # Historical bid comparison view
│   ├── AwardSection.tsx        # Winner card, contract preview
│   ├── SuccessSection.tsx      # Confirmation screen
│   └── index.ts
├── components/
│   ├── ThresholdsModal.tsx     # Threshold configuration (placeholder)
│   ├── AdvanceToR2Modal.tsx    # Confirm advancement
│   ├── AwardConfirmModal.tsx   # Confirm contract creation
│   └── index.ts
└── project-context.md          # This file
```

---

## Key Components

### RFPTab (tabs/RFPTab.tsx)
Main orchestrator with internal screen routing via state.

**State:**
- `currentScreen`: 'list' | `round${number}` | 'award' | 'success'
- `selectedRFP`: Current RFP being viewed
- `currentRound`: number (1, 2, 3, 4...)
- `selectedSuppliers`: Set of supplier IDs for current round
- `winnerId`: Selected winner (first selected supplier on Award)
- `hiddenSuppliers`, `pinnedSuppliers`: UI state
- `sortOrder`, `searchQuery`, `currentMetric`: Filter state
- `eliminatedSuppliers`: Map<number, EliminatedSupplierInfo[]> - round → eliminated suppliers
- `activeSupplierIds`: Set of suppliers still in the running

### SupplierMatrixSection (sections/rfp/SupplierMatrixSection.tsx)
AntD Table with suppliers as columns, metrics as rows.

**Key Features:**
- Checkboxes for all rounds (multi-select)
- Incumbent supplier always in first data column
- Pin/hide controls per supplier
- Search dimming for non-matching suppliers
- Metric highlighting on row click

**Props:**
```tsx
interface SupplierMatrixSectionProps {
  suppliers: Supplier[]
  round: number  // 1, 2, 3, 4...
  selectedSuppliers: Set<string>
  hiddenSuppliers: Set<string>
  pinnedSuppliers: Set<string>
  searchQuery: string
  currentMetric: DetailMetric
  isViewingHistory: boolean
  onToggleSelection: (id: string) => void
  onToggleHide: (id: string) => void
  onTogglePin: (id: string) => void
  onMetricClick: (metric: DetailMetric) => void
}
```

### ComparisonToolbar (sections/rfp/ComparisonToolbar.tsx)
Contains sort dropdown, manual mode toggle, search, action buttons, threshold pills.

**Dynamic behavior:**
- All rounds: "Advance to R{n+1} (count)" button when 2-3 suppliers selected
- All rounds: "Award" button when 1+ suppliers selected
- All rounds: "Edit Bids" button available

---

## Types (types/rfp.types.ts)

```typescript
type RFPStatus = 'draft' | 'round1' | 'round2' | 'awarded' | 'closed'
type RFPScreen = 'list' | `round${number}` | 'award' | 'success'
type RFPRound = number  // 1, 2, 3, 4... (any positive integer)
type SortOption = 'recommended' | 'price-asc' | 'price-desc' | 'volume-asc' | 'volume-desc'
type DetailMetric = 'price' | 'volume' | 'ratability' | 'allocation' | 'penalties'

interface EliminatedSupplierInfo {
  supplierId: string
  supplierName: string
  eliminatedInRound: number
  priceAtElimination: number
}

interface RFP {
  id: string
  name: string
  status: RFPStatus
  supplierCount: number
  targetPrice: number | null
  createdDate: string
  winner?: string
}

interface Supplier {
  id: string
  name: string
  isIncumbent: boolean
  overallRank: number
  metrics: SupplierMetrics
  tags: string[]
}

interface SupplierMetrics {
  avgPrice: number
  totalVolume: number
  ratability: number
  allocation: number
  penalties: number
  issues: number
}
```

---

## Mock Data (data/rfp.data.ts)

- **4 RFPs:** Dallas (R1), Houston (R2), Phoenix (Draft), Atlanta (Awarded)
- **8 Suppliers:** Marathon (incumbent), P66, Shell, Valero, FHR, HF Sinclair, BP, Cenex
- **9 Detail Rows:** 3 products (87 Octane, 93 Octane, Diesel) × 3 locations (Dallas, Houston, Beaumont)

**Helpers:**
- `formatPrice(price)` - Format as currency
- `formatVolume(volume)` - Format with M/K suffix
- `sortSuppliers(suppliers, order)` - Sort with incumbent first
- `getSuppliersForRound(round)` - Get suppliers for round (all for R1, first 3 for R2)

---

## Integration

**ContractMeasurementDetails.tsx (line ~58):**
```tsx
<TabPane tab="RFP" key="rfp">
  <RFPTab />
</TabPane>
```

---

## Key Design Decisions

1. **Internal Routing via State** - No React Router, screens managed by `currentScreen` state
2. **AntD Table for Matrix** - Better fit for supplier-as-columns than AG Grid
3. **Incumbent Always First** - Marathon (incumbent) pinned to first data column
4. **Checkboxes for All Rounds** - Multi-select in all rounds (Session 3 change)
5. **Threshold Pills** - Visual indicators but configuration is placeholder
6. **Sample Data** - Static mock data, no API integration yet
7. **Eliminated Suppliers Tracking** - Map structure tracks eliminated suppliers per round
8. **Dynamic Round Progression** - Any round can advance to next (R1→R2→R3...)

---

## Placeholders / Future Work

- **New RFP Button** - Shows notification only
- **Edit Bids Modal** - Not implemented
- **Threshold Modal** - UI exists but doesn't persist
- **Historical View** - Banner shows but data isn't actually historical
- **API Integration** - All data is mock

---

## Session Log

### Session 1 (2026-01-16) - Full Implementation

**Completed:**
- All 10 phases of implementation plan
- Types and mock data
- All section components (List, Round Stepper, AI Panel, Toolbar, Matrix, Detail Grid, Award, Success)
- All modals (Thresholds, Advance to R2, Award Confirm)
- Tab integration and routing
- E2E testing verified

**Key Learnings:**
- AntD Table works well for supplier matrix with dynamic columns
- Internal state routing simpler than React Router for tab-internal navigation
- CSS modules keep styles scoped and maintainable
- Incumbent supplier handling needs special consideration in sorting/display

**Verified Flow:**
List → R1 (select 3) → R2 (select winner) → Award → Success → List

### Session 2 (2026-01-16) - Layout Fix

**Completed:**
- Fixed Round screen layout to match wireframe
- AI Panel and Tabs now stack vertically (full width) instead of side-by-side
- Updated file paths in project-context.md (was pointing to ContractMeasurement folder)

**Issue Fixed:**
The Round 1/2 screen had AI Panel (320px) and Tabs side-by-side in a Horizontal wrapper. Per the wireframe, these should be full-width and stacked vertically:

```
Before (wrong):  [AI Panel 320px] | [Tabs flex-1]
After (correct): [AI Panel full-width]
                 [Tabs full-width]
```

**File Changed:** `RFPTab.tsx` lines 317-328

### Session 3 (2026-01-16) - Multi-Round Support & Eliminated Suppliers

**Completed:**
- Extended `RFPRound` type from `1 | 2` to `number` for unlimited rounds
- Changed `RFPScreen` to support dynamic round screens (`round${number}`)
- Added `EliminatedSupplierInfo` interface for tracking eliminated suppliers
- Updated `RFPTab.tsx` with new state: `eliminatedSuppliers`, `activeSupplierIds`
- Created generic `handleAdvanceToNextRound` handler (replaced `handleAdvanceToRound2`)
- Removed radio button logic from `SupplierMatrixSection` - all rounds use checkboxes
- Updated `ComparisonToolbar` with dynamic "Advance to R{n+1}" button
- Updated `RoundStepper` to support N rounds dynamically with supplier counts
- Created `EliminatedSuppliersSection.tsx` - collapsible section showing eliminated bids
- Fixed CSS overflow issue preventing collapsible section from displaying

**Key Learnings:**
- Vertical component from Excalibrr applies `overflow: hidden` by default - need explicit override
- Map data structure works well for tracking round-based eliminations
- Template literal types (`round${number}`) provide type safety for dynamic screens

**Files Changed:**
- `rfp.types.ts` - Type extensions
- `RFPTab.tsx` - State management and handlers
- `SupplierMatrixSection.tsx` - Removed radio logic
- `ComparisonToolbar.tsx` - Dynamic button text
- `RoundStepper.tsx` - Dynamic rounds
- `EliminatedSuppliersSection.tsx` (NEW)
- `EliminatedSuppliersSection.module.css` (NEW)
- `HistoricalRFPSection.tsx` - Updated round type
- `sections/index.ts` - New export

**Verified Flow:**
List → R1 (select 3) → R2 (see 5 eliminated, select 2) → R3 (see R1+R2 eliminated) → Award

---

## Next Steps

1. API integration for real RFP data
2. Edit Bids modal implementation
3. Threshold configuration persistence
4. Historical round viewing with actual historical data
5. Create New RFP flow
