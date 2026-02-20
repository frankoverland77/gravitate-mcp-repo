# Delivered Pricing Page — Design Specification Prompt

Use this prompt to recreate the Delivered Pricing page in the Excalibur demo showcase from scratch.

---

## Overview

Build a **Delivered Pricing** page modeled after the Pricing Engine's End of Day (EOD) quote book mode. The page has two main sections:

1. **Analytics Panel** (top, 400px height) — A supply options grid with volume commitments that appears when a quote row is selected
2. **Quote Book Grid** (bottom, fills remaining space) — The main delivered pricing grid with grouped columns

The page lives at `/DeliveredPricing` in the Excalibur demo app (`demo/src/pages/DeliveredPricing/`).

---

## Technology Stack

- **React 18** with TypeScript
- **AG Grid Enterprise** via `GraviGrid` from `@gravitate-js/excalibrr`
- **antd 4.20** for `Popover` component
- **Excalibur layout components**: `Horizontal`, `Vertical`, `Texto` from `@gravitate-js/excalibrr`
- **Vite** bundler

---

## File Structure

```
demo/src/pages/DeliveredPricing/
├── DeliveredPricing.tsx              # Main page component (state, handlers, layout)
├── DeliveredPricing.columnDefs.tsx   # Quote book column definitions (NOTE: .tsx for JSX in cellRenderers)
├── DeliveredPricing.data.ts          # Simple data file that calls generator
├── supplyOptions.data.ts             # Supply option data, strategy resolution, exception computation
└── components/
    ├── Analytics.tsx                  # Analytics wrapper (header + SupplyOptionsView)
    └── SupplyOptionsView.tsx          # Unified supply options + volume commitments grid
```

Additionally, the data model and generator live in:
```
demo/src/shared/data/generators.data.ts  # DeliveredPricingQuoteRow interface + generateDeliveredPricingData()
```

---

## Data Model

### DeliveredPricingQuoteRow

```typescript
type DeliveredPricingStrategy =
  | 'Lowest Price'
  | 'Lowest Rack'
  | 'Lowest Contract'
  | 'Average Rack'
  | 'Allocation Maintenance'

interface DeliveredPricingQuoteRow {
  id: number
  QuoteConfigurationMappingId: number
  QuoteConfigurationName: string        // Always "Delivered"
  LocationName: string                   // Origin terminal name
  DestinationLocationName: string        // Retail store address (e.g. "123 Main St")
  CounterpartyName: string               // One of: Scharf Fuels, Johnson Oil, Hunt Petroleum, Davies Energy
  ProductName: string                    // One of: 87 E10, 93 E10, ULSD2
  ProductGroup: string                   // "gasoline" or "diesel"
  Strategy: DeliveredPricingStrategy
  PriorQuotePeriod: {
    Liftings: number
    LastPrice: number
  }
  Exception: string | null               // Computed at runtime
  IsStrategyOverridden: boolean          // Computed at runtime
  Cost: number | null
  Diff: number
  Freight: number
  Tax: number
  CarrierName: string                    // e.g. "TransAm Logistics", "Gulf Coast Carriers"
  FreightType: string                    // "Point-to-Point" or "Mileage"
  BaseFreight: number                    // Immutable reference freight (set at generation)
  BaseTax: number                        // Immutable reference tax (set at generation)
  ProposedPrice: number
  PriceDelta: number
  Margin: number
}
```

### SupplyOptionRow

```typescript
interface PeriodVolume {
  forecast: number | null
  liftings: number | null
  status: string | null           // "On Track", "Behind", "Ahead", "At Risk"
  toDateForecast: number | null
  toDatePctOfForecast: number | null
}

interface SupplyOptionRow {
  id: number
  originLocation: string          // Short name: "Houston", "Dallas", "Beaumont"
  supplier: string                // "Chevron", "Valero", "Marathon", "Motiva", "HF Sinclair"
  price: number
  priceRank: number               // 1 = lowest price across all options
  change: number                  // Change in points per gallon
  channel: string                 // "Day Deal", "Contract", or "Rack"
  month: PeriodVolume | null      // null for Rack options
  week: PeriodVolume | null
  day: PeriodVolume | null
}
```

---

## Data Generation Requirements

### Quote Row Data
- Generate 60 rows via `generateDeliveredPricingData(60)`
- **All costs must be in the range 2.01–2.75** (clamped)
- Products: `87 E10` (gasoline), `93 E10` (gasoline), `ULSD2` (diesel)
- Counterparties: Scharf Fuels, Johnson Oil, Hunt Petroleum, Davies Energy
- Destinations: Retail store addresses (e.g. "123 Main St", "456 Elm Ave", etc.)
- QuoteConfigurationName: Always "Delivered"
- Carriers: TransAm Logistics, Gulf Coast Carriers, Patriot Transport, Eagle Fleet Services, Lone Star Freight, Pinnacle Hauling
- Freight types: Point-to-Point, Mileage
- Price formula: `Price = Cost + Freight + Tax + Diff`
- Margin formula: `Price - Cost`

### Supply Option Data
- 16 fixed entries across 3 origins (Houston, Dallas, Beaumont):
  - 1 Day Deal (Houston/Chevron)
  - 7 Contracts (Houston×3, Beaumont×1, Dallas×3)
  - 8 Rack (Houston×4, Dallas×4)
- **All supply option prices must be in the range 2.01–2.75** (clamped)
- **Prices must be stable** — do NOT seed from mutable fields like `Cost`. Use stable fields: `id`, `QuoteConfigurationMappingId`, `BaseFreight`
- Volume commitment data (Forecast, Liftings, Status, TD Forecast, TD % Fcst) only for non-Rack entries
- Price rank assigned after generation (1 = lowest)

---

## Quote Book Grid — Column Structure

### Column Groups

**1. Quote Configuration** (hidden, used for row grouping at index 0)

**2. Price Info Group** (`marryChildren: true`)
- **Origin Location** — `LocationName`, also row-grouped at index 1
- **Destination Location** — `DestinationLocationName`
- **Counterparty** — `CounterpartyName`
- **Product** — `ProductName`
- **Strategy** — Editable dropdown (`agSelectCellEditor`) with 5 strategy values
  - Visual indicator: blue italic = default, amber italic with ✎ prefix = overridden
- **Supply Exceptions** — Read-only, red text with ⚠ prefix when present, em dash when null

**3. Current Period Group** (`marryChildren: true`)
- **Sold Vol** — `PriorQuotePeriod.Liftings`, integer format
- **Price** — `PriorQuotePeriod.LastPrice`, currency format ($X.XXXX)

**4. Proposed Group** (`marryChildren: true`)
- **Cost** — Currency format
- **Diff** — Editable, red if negative, green if positive
- **Freight** — **Has Popover on hover** showing: Carrier, Origin, Destination, Product, Freight Type, Freight Rate. Dotted underline to hint at hover. Uses antd `Popover` + Excalibur `Horizontal`/`Vertical`/`Texto`
- **Tax** — **Has Popover on hover** showing: Federal Tax, State Tax, Local Tax (deterministic split summing to total), separator line, Total Tax. Same Popover pattern as Freight
- **Price** — `valueGetter`: `Cost + Freight + Tax + Diff`, bold
- **Price Delta** — Difference from prior period price, red/green coloring
- **Margin** — `valueGetter`: `Price - Cost`, green/red background styling

---

## Supply Options Analytics Grid — Column Structure

### Column Groups

**1. Supply Option** (pinned left)
- Origin, Supplier, Channel

**2. Pricing**
- Price ($X.XXXX format)
- Rank (green bold for rank 1)
- Change (±X.XXXX format, red/green)

**3. Month / Week / Day** (volume period groups, each with 5 sub-columns)
- Forecast, Liftings, Status (colored by value), TD Forecast, TD % Fcst

### Selection Behavior
- `rowSelection: 'multiple'` — shift/ctrl/cmd multi-select supported
- Uses `onRowSelected` event (NOT `onSelectionChanged` — GraviGrid doesn't forward it) with `event.api.getSelectedRows()` for multi-select
- Active selections highlighted with blue background + left border

---

## Core Business Logic

### Strategy Resolution
Each quote row has a strategy that determines which supply option is auto-selected:
- **Lowest Price**: Lowest price across ALL supply options
- **Lowest Rack**: Lowest price among Rack-only options
- **Lowest Contract**: Lowest price among Contract-only options
- **Average Rack**: Rack option closest to the average Rack price
- **Allocation Maintenance**: Non-Rack option with lowest monthly TD % of Forecast (most behind on commitments)

### Strategy Override Indicator
When a user manually selects supply option(s) that differ from the strategy default:
- `IsStrategyOverridden` = true
- Strategy column displays in amber italic with ✎ prefix
- When using strategy default: blue italic, no prefix

### Supply Exceptions
Computed per-row based on the active supply option selection:
1. **"Lower price available"** — A viable Rack or Contract (with MTD% < 100%) has a lower price than active selection
2. **"Over lifting contract"** — Active selection is a Contract with MTD% > 100%
3. **"Under lifting contract"** — Active selection is a Contract with MTD% < 75%
4. **"Day Deal volume requirement"** — A Day Deal has a lower price than active selection

Exception rules:
- Over/under lifting only fires when `activeOption.channel === 'Contract'`
- "Lower price available" only considers viable alternatives: Rack (always viable) or Contract with MTD% < 100%

### Freight & Tax Adjustment on Origin Change
When a supply option's origin differs from the quote row's origin:
- `BaseFreight` and `BaseTax` preserve original values (never mutated)
- Deterministic ±20% adjustment using hash of origin pair string
- `isSameOrigin()` uses case-insensitive `startsWith` check (e.g. "Houston Terminal" matches "Houston")
- When origins match: use `BaseFreight`/`BaseTax` unchanged

### Multi-Select Price Averaging
When multiple supply options are selected:
- Cost = average of selected option prices
- Freight = average of per-option freight adjustments
- Tax = average of per-option tax adjustments
- Price = averaged Cost + averaged Freight + averaged Tax + Diff

### Single-Origin Validation
**A product can only be sourced from a single origin location.** When the user multi-selects supply options from different origins (e.g. Houston + Dallas):
- Selection is **rejected** — override is NOT applied, proposed costs unchanged
- Red error banner appears above analytics panel: "Cannot split pricing across origins (Houston, Dallas). A product must be sourced from a single origin."
- Banner auto-dismisses after 4 seconds

---

## State Management

```typescript
// Main state
const [rowData, setRowData] = useState<DeliveredPricingQuoteRow[]>(...)   // All quote rows
const [selectedRow, setSelectedRow] = useState<DeliveredPricingQuoteRow | null>(null)
const [overrides, setOverrides] = useState<Record<number, number[]>>({})  // quoteRowId → [supplyOptionIds]
const [originValidationError, setOriginValidationError] = useState<string | null>(null)

// Derived
const supplyOptions = useMemo(...)          // Generated from selectedRow (stable seeding)
const liftingPctMap = useMemo(...)           // Monthly TD% by supply option ID
const strategyDefault = useMemo(...)         // Auto-resolved supply option for current strategy
const activeSupplyOptionIds = useMemo(...)   // overrides[selectedRow.id] ?? [strategyDefault.id]
```

### Three Mutation Paths
All three paths must update: proposed fields (Cost/Freight/Tax/Price/PriceDelta/Margin), exceptions, and override tracking.

1. **`handleSupplyOptionsSelected`** — User selects supply option(s) in analytics grid
   - Validates single-origin constraint
   - Stores override IDs
   - Computes averaged proposed fields via `computeProposedFieldsFromMultiple()`

2. **`handleQuoteRowSelected`** — User clicks a quote row
   - If no override exists, applies strategy default via `computeProposedFields()`

3. **`onCellValueChanged` (Strategy)** — User changes strategy dropdown
   - Clears override for that row
   - Re-resolves strategy default
   - Applies new proposed fields

---

## Popover Pattern (Reference: NetOrGrossDisplay)

Follow the antd `Popover` + Excalibur layout pattern from the real Quotebook's `PriceInfoColumns.tsx` (NetOrGrossDisplay column, lines 82–168):

```tsx
<Popover placement="top" content={popoverContent}>
  <span style={{ cursor: 'pointer', textDecoration: 'underline dotted', textUnderlineOffset: '3px' }}>
    {displayValue}
  </span>
</Popover>
```

Popover content uses:
```tsx
<Vertical style={{ width: 240, gap: 4 }}>
  <Horizontal justifyContent="space-between">
    <Texto>Label</Texto>
    <Texto weight={600}>Value</Texto>
  </Horizontal>
  ...
</Vertical>
```

### Freight Popover Fields
1. Carrier — `data.CarrierName`
2. Origin — `data.LocationName`
3. Destination — `data.DestinationLocationName`
4. Product — `data.ProductName`
5. Freight Type — `data.FreightType` (Point-to-Point or Mileage)
6. Freight Rate — formatted freight value

### Tax Popover Fields
1. Federal Tax — ~38-44% of total (deterministic split seeded by row id)
2. State Tax — ~33-38% of total
3. Local Tax — remainder (ensures exact sum)
4. Total Tax — shown below a divider line

**Important**: The three tax components must sum exactly to the displayed total tax value. Compute federal and state first, then local = total - federal - state.

---

## Critical Implementation Notes

1. **Column defs file must be `.tsx`** (not `.ts`) because cellRenderers return JSX for the Freight and Tax Popovers
2. **Use `onRowSelected` NOT `onSelectionChanged`** in SupplyOptionsView — GraviGrid doesn't forward `onSelectionChanged` through `agPropOverrides`
3. **Supply option prices must use stable seeds** — Never use mutable fields like `Cost` in seed calculations. Use `id`, `QuoteConfigurationMappingId`, `BaseFreight` instead
4. **`BaseFreight`/`BaseTax` fallback** — Always use `row.BaseFreight ?? row.Freight` to handle HMR state preservation where old state lacks new fields
5. **Group row handling** — cellRenderers must return `null` (not `''`) when `params.data` is null/undefined (group rows)
6. **Popover `content` prop** — Pass JSX directly as a variable, not as a function (avoid `content={() => (...)}` for compatibility)
7. **AG Grid `agPropOverrides`** — Pass grid event handlers here, not as direct GraviGrid props
