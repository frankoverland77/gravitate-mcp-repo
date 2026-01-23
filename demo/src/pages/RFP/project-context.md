# RFP Management Feature - Project Context
*Last Updated: 2026-01-22 (Session 6)*

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
│   ├── EliminationModal.tsx    # Elimination with reason
│   ├── EditBidsDrawer.tsx      # Edit bids workflow
│   ├── BidLogDrawer/           # Edit history panel (Session 6)
│   │   ├── BidLogDrawer.tsx
│   │   ├── HistoryEntry.tsx
│   │   ├── BidLogDrawer.module.css
│   │   └── index.ts
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

### Session 4 (2026-01-19) - Product Review & UX Refinements

**Meeting:** Product-Design Daily Sync (Reece Johnson, Agustin Reichhardt, Frank Overland)

**Completed:**
- Prototype review of RFP list, round screens, supplier matrix, and detail grid
- Full conversation transcript archived in `conversation-archive.md`

**Key Decisions:**
- Round progression is NOT one-way - users can navigate back to view previous round decisions
- Before advancing rounds, ALL suppliers must have explicit disposition (advance/eliminate/pending)
- Round advancement blocked with validation message until all suppliers processed
- Elimination requires explicit action with required note/reason (not passive)
- "Send Back" action removed - replaced with "Edit Bid" for inline modifications
- Parameters split into two concepts: (1) Price/Volume history (aligned with Contract Measurement), (2) Thresholds (ratability/allocation/penalties)
- Allocation changes from Flexible/Moderate/Strict → Daily/Weekly/Tri-Weekly/Monthly/Quarterly
- Average price row should expand to show product group breakdowns (gasoline, diesel separately)
- Support multiple bids from same supplier: "Supplier Name - Bid Description" pattern
- RFP responses treated as "price scenarios" - same editing workflow as Contract Measurement
- Bid edits require version tracking (version number, editor, timestamp) for audit trail
- Scenarios have "working" and "ready to compare" states

**UX Changes Needed:**
- Add issues detail popup/tooltip explaining threshold violations
- Remove incumbent pin/unpin (incumbent locked to first position)
- Add explicit "Eliminate" action with required note modal
- Show "Reason" column in eliminated suppliers table
- Add validation blocking round advancement until all suppliers dispositioned
- Separate parameters modal into history lookback vs thresholds
- Implement collapsible product group rows for price/volume
- Responsive filtering: bottom grid filters update top summary calculations
- Support supplier subtitle for multiple bids from same company

**Technical Implications:**
- Backend needs version tracking on every bid field edit
- Need scenario status field ("working" | "ready_to_compare")
- Round advancement API should validate all suppliers have disposition
- Elimination API requires note/reason field (required)

**Files to Update:**
- `RFPTab.tsx` - Round navigation, elimination flow, validation
- `ComparisonToolbar.tsx` - Remove "Send Back", add parameter importance
- `SupplierMatrixSection.tsx` - Multiple bids per supplier, issues popup
- `rfp.types.ts` - Add scenario status, bid version types
- Parameters modal (placeholder) - Split into two modals or tabbed sections

**Next Actions:**
See detailed action items in `conversation-archive.md` (2026-01-19 entry)

### Session 5 (2026-01-21) - Bid Editing Complexity & UX Refinements

**Meeting:** Product-Design Daily Sync (Agustin Reichhardt, Frank Overland)

**Critical Insight - Bids are Formula-Based:**
- Bids are NOT simple price numbers - they are collections of contract details with pricing formulas
- Each cell in product/location grid represents a full pricing formula with variables
- Formula variables include: percentage, publisher, instrument, price type, differential, date rule
- When editing bids, users edit the formula (e.g., change Platts to Argus), not just a number
- This is the same data model as Contract Measurement price scenarios

**Key Decisions:**
- Issue importance ranking: Use drag-and-drop (not arrows), must support ties
- Elimination reason: Optional (not required) - can be null
- Product click filtering: Clicking product in summary filters detail grid to that product
- Eliminated suppliers: Stay visible with red highlight until round advancement (not immediate removal)
- Bulk selection: Add "Select remaining"/"Select undesignated" button
- Bid editing timing: Happens BETWEEN rounds (after R1 complete, before R2 starts)
- Bid editing method: Consider Excel upload given formula complexity
- Version history: Git-style commit history for bid changes (version, editor, timestamp, description)
- Multi-bid descriptions: Same pattern as contract description/comments field

**UX Changes Needed:**
- Parameter importance: Drag-and-drop with tie support (replace up/down arrows)
- Elimination flow: Make reason optional, keep eliminated visible with red highlight until advancement
- Supplier matrix: Product click filters detail grid
- Bulk advancement: "Select remaining" button
- Bid editing: Move to between-round step, add Excel upload + version history panel

**Research Needed:**
- Ratability: How do buyers receive ratability offers from sellers? (volume/month? percentage? other?)
- Bid objects: Should bids require draft contracts or be simpler objects?

**Technical Implications:**
- Need to document Contract Measurement data model (details, formulas, variables) for bid editing
- Bid versioning follows round boundaries
- Excel upload/download for formula editing
- Future: LLM prompting for bulk formula changes (not MVP)

**Files to Consider:**
- Contract Measurement details/formulas as reference for bid structure
- Excel template design for bid import/export

**Next Actions:**
See detailed action items in `conversation-archive.md` (2026-01-21 entry)

### Session 6 (2026-01-22) - Inline Editable Bid Table with Edit History Panel

**Completed:**
- Implemented inline editing for product/location details table
- Created BidLogDrawer component showing chronological edit history
- Added visual indicators for edited cells (amber left border + subtle background tint)
- Added "Bid Log" button with edit count badge to toolbar
- Implemented revert functionality with cascade warning for multi-edit cells

**New Types (rfp.types.ts):**
```typescript
interface BidEdit {
  id: string
  cellKey: string  // "product-location-supplierId"
  productName: string
  locationName: string
  supplierName: string
  supplierId: string
  previousValue: number
  newValue: number
  timestamp: Date
  userId: string
  userName: string
  source: 'inline' | 'bulk-upload'
  bulkUploadId?: string
  bulkUploadFilename?: string
  isReverted: boolean
  revertedAt?: Date
  revertedBy?: string
}
type BidEditFilter = 'all' | 'inline' | 'bulk-upload'
```

**New Files Created:**
- `components/BidLogDrawer/BidLogDrawer.tsx` - Drawer with filter tabs, entry list, cascade revert modal
- `components/BidLogDrawer/HistoryEntry.tsx` - Individual edit entry component
- `components/BidLogDrawer/BidLogDrawer.module.css` - Drawer and entry styling
- `components/BidLogDrawer/index.ts` - Exports

**Files Modified:**
- `rfp.types.ts` - Added BidEdit interface and BidEditFilter type
- `sections/DetailGridSection.tsx` - Added EditableCell component and inline editing
- `sections/DetailGridSection.module.css` - Added .editedCell styling
- `sections/ComparisonToolbar.tsx` - Added Bid Log button with edit count
- `RFPTab.tsx` - State management (bidEdits, isBidLogOpen), handlers, drawer integration
- `components/index.ts` - Added BidLogDrawer export

**Key UX Decisions:**
- Button label: "Bid Log" (concise, domain-specific)
- Edited cells: Left amber border + subtle background tint
- History grouping: Chronological (bulk uploads as collapsible groups)
- Revert behavior: Point-in-time with cascade warning for multi-edit cells

**Key Learnings:**
- Click-to-edit with Enter/Escape for commit/cancel provides good UX
- Derived state (editedCellKeys) efficiently tracks visual indicators
- Cascade revert handling requires tracking edit sequence per cell

**Verified Flow:**
Click cell → Edit value → Press Enter → Cell shows amber indicator → Bid Log button shows "(1)" → Open Bid Log → See edit entry → Revert → Cell returns to original

---

## Next Steps

1. **High Priority:**
   - Implement round completion validation before advancement
   - Add "Select remaining"/"Select undesignated" button for bulk advancement
   - Keep eliminated suppliers visible with red highlight until round advancement
   - Make elimination reason optional (not required)
   - Product click filtering (summary -> detail grid)
   - Restructure parameters into history + thresholds
   - Parameter importance: drag-and-drop with tie support

2. **Medium Priority:**
   - Bid editing workflow between rounds (not during)
   - Document Contract Measurement data model for bid editing reference
   - Design bid version history panel (git-style commits)
   - Excel upload/download for formula-based bid editing
   - Product group breakdown for price/volume rows
   - Multiple bids per supplier support with description field
   - Issues detail popup

3. **Research Required:**
   - Ratability representation: How do sellers offer ratability to buyers?
   - Should bids require draft contracts or be simpler bid-specific objects?

4. **Future Work:**
   - API integration for real RFP data
   - Create New RFP flow
   - Historical round comparison with data diffs
   - Parameter importance weighting for AI recommendations
   - LLM prompting for bulk bid formula changes (demo/selling concept)
