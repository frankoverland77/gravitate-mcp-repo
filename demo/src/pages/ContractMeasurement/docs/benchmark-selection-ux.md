# Benchmark Selection UX Documentation

> **Source:** Extracted from PE Contract Measurement Lovable Prototype
> **Purpose:** Reference for implementing benchmark selection in Excalibrr
> **Last Updated:** 2026-01-08

---

## Executive Summary

The benchmark selection functionality allows users to compare contract performance against different pricing mechanisms (rack prices, market indices, or industry averages). This is **different from scenario adjustments**:

| Scenarios                   | Benchmarks                                |
| --------------------------- | ----------------------------------------- |
| Adjust volumes/prices       | Change pricing mechanism                  |
| "What if we sold 20% more?" | "What if we used Platts instead of OPIS?" |
| Create multiple versions    | Apply to existing scenarios               |
| Saved permanently           | Session-only                              |

---

## 1. Where It Happens

### Location

- **Page:** What-If Analysis / Scenario Comparison view
- **Section:** Horizontal tile selector at the top of the scenario comparison table
- **Context:** Used after creating scenarios to compare them under different benchmark pricing

### Entry Points

1. **"Current Contract" tile** - Always present, represents baseline (no benchmark)
2. **Custom benchmark tiles** - Each added benchmark appears as a selectable tile
3. **"+ Add Benchmark" button** - Opens the AddBenchmarkDialog modal

---

## 2. Complete UX Flow

### ASCII Wireframe - Main View

```
┌────────────────────────────────────────────────────────────────────────┐
│  SCENARIO COMPARISON VIEW                                               │
├────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  [Current Contract] [Rack Average] [OPIS Rack Low] [+ Add Benchmark]   │
│   ■ SELECTED        □ Inactive     □ Inactive       ⊞ Dashed border    │
│                                                                         │
│  ┌─────────────────────────────────────────────────────────────────┐  │
│  │ Scenario Comparison Table                                        │  │
│  │ - Shows all saved scenarios                                      │  │
│  │ - Metrics adjust based on selected benchmark                     │  │
│  │ - Revenue, Margin, Volume columns                                │  │
│  │ - Delta percentages with color indicators                        │  │
│  └─────────────────────────────────────────────────────────────────┘  │
│                                                                         │
│  [Build New Scenario]                                                   │
│                                                                         │
└────────────────────────────────────────────────────────────────────────┘
```

### Flow Stages

**Stage 1: Initial View**

- User sees "Current Contract" tile selected by default
- Comparison table shows scenarios under current contract pricing
- "+ Add Benchmark" button available

**Stage 2: Opening Benchmark Dialog**

- User clicks "+ Add Benchmark"
- Modal opens (720px wide)
- Shows two selection paths: Quick Selections OR Custom

**Stage 3: Quick Selection Path**

- 3 preset cards: Rack Average, Rack Low, Spot Price
- Clicking auto-fills the custom form below
- Immediate visual feedback

**Stage 4: Custom Benchmark Path**

- 3-step wizard form
- Publisher → Type → Matching configuration
- Live matching feedback

**Stage 5: Matching Feedback**

- Real-time calculation showing:
  - Products matched exactly (✓ green)
  - Products using rollup/fallback (⚠ yellow)

**Stage 6: Confirmation**

- User clicks "Add Benchmark"
- Toast notification confirms
- Modal closes
- New tile appears in selector

**Stage 7: Switching Benchmarks**

- User clicks any benchmark tile
- Tile highlights (blue border + background)
- **Table recalculates instantly** (client-side)
- No loading state needed

---

## 3. AddBenchmarkDialog Layout

### ASCII Wireframe

```
┌───────────────────────────────────────────────────────────────────┐
│  Add Benchmark Comparison                                    [X]   │
│  Choose a quick selection or configure a custom benchmark          │
├───────────────────────────────────────────────────────────────────┤
│                                                                    │
│  Quick Selections                                                  │
│  ┌─────────────────┬─────────────────┬─────────────────┐         │
│  │      📊         │      📉         │      📈         │         │
│  │   Rack Avg      │   Rack Low      │  Spot Price     │         │
│  │                 │                 │                 │         │
│  │  Compare to     │  Compare to     │  Current        │         │
│  │  avg terminal   │  lowest         │  market         │         │
│  │  price          │  price          │  spot price     │         │
│  │                 │                 │                 │         │
│  │  [■ Selected]   │  [ ]            │  [ ]            │         │
│  └─────────────────┴─────────────────┴─────────────────┘         │
│                                                                    │
│  ─────────────────────── OR ───────────────────────               │
│                                                                    │
│  Custom Benchmark Selection                                        │
│                                                                    │
│  1. Select Publisher/Source                                        │
│     ┌─────────────────────────────────────────┐                   │
│     │ OPIS                                  ▼ │                   │
│     └─────────────────────────────────────────┘                   │
│                                                                    │
│  2. Select Benchmark Type                                          │
│     ┌─────────────────────────────────────────┐                   │
│     │ Rack low                              ▼ │                   │
│     └─────────────────────────────────────────┘                   │
│                                                                    │
│  3. Product & Location Matching                                    │
│     ┌─────────────────────────────────────────────────────┐      │
│     │ ⓘ This benchmark will match your contract products  │      │
│     │   using:                                             │      │
│     │                                                      │      │
│     │   Product Hierarchy      Location Hierarchy          │      │
│     │   ┌──────────────┐      ┌──────────────┐            │      │
│     │   │ Target Index▼│      │ OPIS City  ▼ │            │      │
│     │   └──────────────┘      └──────────────┘            │      │
│     │                                                      │      │
│     │   ✓ 12 products matched at terminal level           │      │
│     │   ⚠  3 products will use regional rollup            │      │
│     └─────────────────────────────────────────────────────┘      │
│                                                                    │
├───────────────────────────────────────────────────────────────────┤
│                                     [Cancel]  [Add Benchmark]      │
└───────────────────────────────────────────────────────────────────┘
```

---

## 4. Configuration Parameters

### CustomBenchmark Interface

```typescript
interface CustomBenchmark {
  id: string; // Generated: `benchmark-${Date.now()}`
  name: string; // Display name
  type: 'quick' | 'custom'; // Selection path used

  // Quick selection properties
  quickType?: 'rack-average' | 'rack-low' | 'spot-price';

  // Custom selection properties
  publisher?: string; // 'opis' | 'platts' | 'argus'
  benchmarkType?: string; // 'rack-low' | 'rack-average' | 'spot' etc.
  productHierarchy?: string; // Matching strictness
  locationHierarchy?: string; // Location fallback

  // Matching results
  matchingInfo?: {
    matchedCount: number; // Products matched at terminal level
    rollupCount: number; // Products using regional fallback
    totalProducts: number; // Total products in contract
  };
}
```

### Publisher Options

| Publisher | Description                   |
| --------- | ----------------------------- |
| OPIS      | Oil Price Information Service |
| Platts    | S&P Global Platts             |
| Argus     | Argus Media                   |

### Benchmark Types

| Type           | Description                  |
| -------------- | ---------------------------- |
| Rack low       | Lowest terminal price        |
| Rack average   | Average terminal price       |
| Off rack low   | Lowest off-rack price        |
| Contract low   | Lowest contract price        |
| Contract low 2 | Secondary contract benchmark |
| Spot           | Current market spot price    |

### Product Hierarchy (Matching Strictness)

| Hierarchy      | Match Rate | Description                        |
| -------------- | ---------- | ---------------------------------- |
| Target Index   | ~85%       | Exact index match                  |
| Product Grade  | ~75%       | Match by grade (87, 89, diesel)    |
| Product Family | ~60%       | Match by family (gasoline, diesel) |
| Any Match      | 100%       | Use any available benchmark        |

### Location Hierarchy

| Hierarchy     | Description                                   |
| ------------- | --------------------------------------------- |
| OPIS City     | Exact city terminal match                     |
| State/Region  | State or regional average                     |
| PADD District | Petroleum Administration for Defense District |
| National      | National average                              |

---

## 5. State Management

### Component State

```typescript
// In parent component (ScenarioAnalysisTab or equivalent)
const [selectedBenchmarkId, setSelectedBenchmarkId] = useState<string>('current-contract');
const [customBenchmarks, setCustomBenchmarks] = useState<CustomBenchmark[]>([]);
const [showBenchmarkModal, setShowBenchmarkModal] = useState(false);
```

### State Flow

```
User clicks tile
    ↓
Parent updates selectedBenchmarkId
    ↓
ScenarioComparison receives new prop
    ↓
useMemo recalculates comparison data
    ↓
Table re-renders with adjusted values
```

### Event Handlers

```typescript
// Add new benchmark
const handleAddBenchmark = useCallback((benchmark: CustomBenchmark) => {
  setCustomBenchmarks((prev) => [...prev, benchmark]);
  setSelectedBenchmarkId(benchmark.id); // Auto-select new benchmark
}, []);

// Switch benchmark
const handleSelectBenchmark = (benchmarkId: string) => {
  setSelectedBenchmarkId(benchmarkId);
};
```

---

## 6. Visual Effects on Selection

### Tile Styling

| State    | Border         | Background      | Font   |
| -------- | -------------- | --------------- | ------ |
| Selected | Blue (primary) | Light blue tint | Bold   |
| Inactive | Gray (border)  | Transparent     | Medium |
| Hover    | Blue at 50%    | Light gray      | Medium |

### Table Recalculation

When benchmark changes:

- Revenue values adjust based on benchmark pricing
- Margin values adjust
- Delta percentages recalculate
- Colors may flip (positive ↔ negative)
- **No loading state** - instant client-side calculation

---

## 7. Benchmark Tile Selector Pattern

### ASCII Wireframe - Tile Details

```
┌─────────────────────────────────────────────────────────────────────┐
│  Horizontal Scrollable Container (overflow-x: auto)                  │
│                                                                      │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐│
│  │ Current      │ │ Rack Average │ │ OPIS - Rack  │ │ + Add        ││
│  │ Contract     │ │              │ │ Low          │ │ Benchmark    ││
│  │              │ │              │ │              │ │              ││
│  │ ■ SELECTED   │ │ □ Inactive   │ │ □ Inactive   │ │ ⊞ Dashed     ││
│  │ (blue border)│ │ (gray border)│ │ (gray border)│ │ (add icon)   ││
│  │              │ │              │ │              │ │              ││
│  │ Baseline     │ │ Compare to   │ │ opis -       │ │ Compare with ││
│  │ scenario     │ │ avg terminal │ │ rack-low     │ │ industry     ││
│  │ no benchmark │ │ price        │ │              │ │ data         ││
│  │              │ │              │ │              │ │              ││
│  │ min-w: 200px │ │ min-w: 200px │ │ min-w: 200px │ │ min-w: 200px ││
│  └──────────────┘ └──────────────┘ └──────────────┘ └──────────────┘│
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

### Implementation Pattern

- Tiles rendered **inline** in parent component (not extracted)
- Uses `array.map()` for dynamic benchmarks
- Horizontal scroll with `overflow-x: auto`
- Fixed minimum width (200px) per tile
- Allows unlimited benchmarks

---

## 8. Comparison Table with Benchmark

### ASCII Wireframe

```
┌────────────────────────────────────────────────────────────────────────┐
│  Scenario          Revenue          Margin           Volume    Actions │
├────────────────────────────────────────────────────────────────────────┤
│  Current           $2,450,000       $245,000         1,000,000         │
│  (Baseline)                                          gal       (no del)│
├────────────────────────────────────────────────────────────────────────┤
│  High Volume       $2,695,000       $269,500         1,100,000  [✏][🗑]│
│  Scenario          +10.0% ↗         +10.0% ↗         +10.0% ↗          │
│                    (green)          (green)          (green)           │
├────────────────────────────────────────────────────────────────────────┤
│  Low Price         $2,205,000       $220,500         1,000,000  [✏][🗑]│
│  Scenario          -10.0% ↘         -10.0% ↘         0.0%              │
│                    (red)            (red)                              │
└────────────────────────────────────────────────────────────────────────┘

Note: Values shown are ADJUSTED for selected benchmark.
      Switching benchmarks will recalculate all values instantly.
```

---

## 9. Revenue Adjustment Algorithm

The prototype uses algorithmic adjustments (not actual historical data):

```typescript
// Quick benchmark adjustments
switch (benchmark.quickType) {
  case 'rack-average':
    revenueAdjustment = 0.98; // 2% lower
    marginAdjustment = 0.96; // 4% lower
    break;
  case 'rack-low':
    revenueAdjustment = 0.96; // 4% lower
    marginAdjustment = 0.94; // 6% lower
    break;
  case 'spot-price':
    revenueAdjustment = 1.02; // 2% higher
    marginAdjustment = 1.0; // No change
    break;
}

// Custom benchmark adjustments
const sourceAdj =
  benchmark.publisher === 'platts'
    ? 1.02
    : benchmark.publisher === 'argus'
      ? 1.01
      : benchmark.publisher === 'opis'
        ? 0.99
        : 0.98;

revenue *= sourceAdj;
margin *= sourceAdj * 0.95;
```

**Production Note:** Real implementation would fetch actual benchmark prices from API and calculate exact financial impact per product/location.

---

## 10. Matching Info Calculation

```typescript
// Simulate matching based on hierarchy settings
const matchingInfo = useMemo(() => {
  const totalProducts = contractProducts.length;
  let matchedCount = 0;

  if (productHierarchy === 'target-index') {
    matchedCount = Math.floor(totalProducts * 0.85); // 85%
  } else if (productHierarchy === 'product-grade') {
    matchedCount = Math.floor(totalProducts * 0.75); // 75%
  } else if (productHierarchy === 'product-family') {
    matchedCount = Math.floor(totalProducts * 0.6); // 60%
  } else {
    matchedCount = totalProducts; // 100% with fallback
  }

  const rollupCount = totalProducts - matchedCount;

  return { matchedCount, rollupCount, totalProducts };
}, [contractProducts, productHierarchy]);
```

---

## 11. Key Implementation Patterns

### Pattern 1: Inline Tile Selector

- Tiles rendered inline in parent (not separate component)
- Simplifies state management
- Easy to maintain

### Pattern 2: Modal-Based Configuration

- 720px wide modal
- Two-path selection (Quick vs Custom)
- Live feedback during configuration
- Auto-close on success

### Pattern 3: Client-Side Calculation

- No API calls when switching benchmarks
- `useMemo` for performance
- Instant feedback
- Deterministic adjustments

### Pattern 4: Auto-Selection on Add

- New benchmarks automatically selected
- User sees immediate impact
- Encourages exploration

### Pattern 5: Horizontal Scrolling

- Tiles in horizontal row with scroll
- Fixed minimum width (200px)
- Allows unlimited benchmarks

---

## 12. Excalibrr Component Mapping

| Prototype        | Excalibrr                                                       |
| ---------------- | --------------------------------------------------------------- |
| `<button>` tiles | `<Horizontal>` container with styled `<div>` or `<GraviButton>` |
| Dialog           | `<Modal visible={...}>`                                         |
| Select dropdowns | `<Select>` from AntD                                            |
| Text             | `<Texto>` with appropriate `category` and `appearance`          |
| Icons            | Ant Design icons                                                |
| Cards            | `<div>` with utility classes or AntD `<Card>`                   |

---

## 13. Validation Requirements

Before adding a benchmark:

- Ensure at least one product matches
- Warn if >50% products use rollup
- Validate date range coverage
- Check benchmark data availability

---

## Summary

The benchmark selection functionality provides a sophisticated way to compare scenarios under different pricing mechanisms. The UX is intuitive with:

1. **Clear separation** between scenario creation and benchmark comparison
2. **Immediate visual feedback** through tile highlighting
3. **Live matching calculations** showing product coverage
4. **Instant table updates** when switching benchmarks
5. **Two-path selection** (quick presets vs custom configuration)

The key insight is that benchmarks answer "What if we used different pricing?" while scenarios answer "What if we changed volumes/prices?" - they work together to provide comprehensive contract analysis.
