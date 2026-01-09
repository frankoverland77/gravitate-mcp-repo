# Contract Measurement - Project Context

This file tracks the context, decisions, and implementation details for the Contract Measurement feature. Refer to this when making changes or extending the feature.

## Overview

Contract Measurement is a new menu section added after "Global Tiered Pricing" in the navigation. It provides:

- A main grid page with title, description, KPI tiles, and a data grid
- A detail page accessible by clicking a row in the grid

**Theme:** PE_LIGHT (purple/elegant theme)
**Icon:** DashboardOutlined

## File Structure

```
demo/src/pages/ContractMeasurement/
├── ContractMeasurement.data.ts      # Mock data and interfaces
├── ContractMeasurementGrid.tsx      # Main grid page
├── ContractMeasurementDetails.tsx   # Detail page (with tabs)
├── project-context.md               # This file
├── components/                      # Reusable components
│   ├── RatabilitySettingsDrawer.tsx # Global ratability settings drawer
│   ├── ScenarioDrawer.tsx           # Add/Edit scenario drawer (with template chooser)
│   └── benchmark/                   # Benchmark selection components
│       ├── index.ts                 # Barrel export
│       ├── benchmark.utils.ts       # Mock data and calculation functions
│       ├── BenchmarkSelector.tsx    # Two-column benchmark selector
│       └── BenchmarkPreview.tsx     # Real-time preview panel
├── docs/                            # Feature documentation
│   └── benchmark-selection-ux.md    # Benchmark selection UX reference (from prototype)
├── types/                           # TypeScript type definitions
│   ├── ratability.types.ts          # Ratability settings types & defaults
│   ├── performanceDetails.types.ts  # Performance Details types
│   └── scenario.types.ts            # Scenario types for What-If Analysis
├── tabs/                            # Tab components (thin composition layers)
│   ├── index.ts                     # Barrel export
│   ├── OverviewTab.tsx              # Overview tab (placeholder)
│   ├── ScenarioAnalysisTab.tsx      # Scenario Analysis tab (placeholder)
│   ├── PerformanceDetailsTab.tsx    # Performance Details tab (IMPLEMENTED)
│   └── BenchmarksTab.tsx            # Benchmarks tab (composes sections)
└── sections/                        # Section components (reusable across tabs)
    ├── index.ts                     # Main barrel export
    ├── benchmarks/                  # Sections for Benchmarks tab
    │   ├── index.ts                 # Benchmarks barrel export
    │   ├── PerformanceSummarySection.tsx
    │   ├── DetailedComparisonSection.tsx
    │   ├── HistoricalComparisonSection.tsx
    │   └── ScenarioComparisonSection.tsx  # Scenario comparison table
    └── performance-details/         # Sections for Performance Details tab
        ├── index.ts                 # Performance Details barrel export
        ├── performanceDetails.data.ts  # Mock data and functions
        ├── PerformanceSummaryTiles.tsx
        ├── ProductPerformanceTable.tsx
        └── DetailedAnalysisModal.tsx
```

## Reference Documentation

| Document                                                      | Description                                                                                                                                                                                          |
| ------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [benchmark-selection-ux.md](./docs/benchmark-selection-ux.md) | Detailed UX documentation for benchmark selection feature, extracted from Lovable prototype. Includes ASCII wireframes, data structures, state management patterns, and Excalibrr component mapping. |

## Critical Pattern: Detail Page Navigation

The navigation from grid to detail page requires synchronization across **4 places**:

### IMPORTANT: Path Naming Convention (Discovered Issue)

The Excalibrr NavigationContextProvider constructs URLs using the pattern:
`/{ParentKey}/{RouteKey}`

So if your config has:

- Parent key: `ContractMeasurement`
- Route key: `ContractMeasurementGrid`

The URL will be: `/ContractMeasurement/ContractMeasurementGrid`

**Always use the route key as the path suffix, not arbitrary path names like `/ContractMeasurement/Grid`**

### 1. Grid Page Navigation (ContractMeasurementGrid.tsx)

```typescript
navigate('/ContractMeasurement/ContractMeasurementDetails', {
  state: {
    id: params.data.id,
    // other fields...
  },
});
```

- Uses `navigate()` from `useNavigate()` hook
- Path does NOT include `:id` - it's passed via state
- State object contains all data needed by detail page

### 2. Route Definition (pageConfig.tsx - config section)

```typescript
{
  hasPermission: () => true,
  key: "ContractMeasurementDetails",
  title: "Measurement Details",
  element: <ThemeRouteWrapper theme="PE_LIGHT"><ContractMeasurementDetails /></ThemeRouteWrapper>,
  path: "/ContractMeasurement/ContractMeasurementDetails/:id",
  description: "Contract measurement details view",
  hidden: true,  // CRITICAL: hide from menu
}
```

- Path INCLUDES `:id` parameter for URL routing
- `hidden: true` prevents it from appearing in navigation menu

### 3. Demo Registry (pageConfig.tsx - demoRegistry array)

```typescript
{
  key: "ContractMeasurementDetails",
  title: "Measurement Details",
  element: <ThemeRouteWrapper theme="PE_LIGHT"><ContractMeasurementDetails /></ThemeRouteWrapper>,
  path: "/ContractMeasurement/ContractMeasurementDetails/:id",
  description: "Contract measurement details view",
  created: new Date().toISOString(),
  category: "grids",
}
```

- Same route also registered in demoRegistry for routing to work

### 4. Detail Page Component (ContractMeasurementDetails.tsx)

```typescript
const navigate = useNavigate();
const location = useLocation();
const params = useParams();

const data = location.state || {
  id: params.id || 1,
  // fallback defaults
};
```

- Uses BOTH `useLocation()` for state AND `useParams()` for URL
- Priority: state first, then URL params, then defaults
- Back button navigates to `/ContractMeasurement/ContractMeasurementGrid`

### 5. Scopes (AuthenticatedRoute.jsx)

```javascript
const scopes = {
  // ...
  ContractMeasurement: true,
  // ...
};
```

- Only parent section needs scope entry
- Child routes (including hidden ones) inherit from parent

## Design Patterns Used

### Page Layout Structure

1. Page Header (title + description)
2. KPI Tiles (4-column grid)
3. Data Grid

### KPI Tile Specifications

| Tile | Icon                  | Label            | Value            | Secondary Info                 | Description                 |
| ---- | --------------------- | ---------------- | ---------------- | ------------------------------ | --------------------------- |
| 1    | FileTextOutlined      | Total Contracts  | 5                | -                              | 2 active                    |
| 2    | WarningOutlined (red) | At Risk          | 2 (red)          | -                              | Require immediate attention |
| 3    | LineChartOutlined     | Total Volume     | 650,000          | ↗ 8.2% vs last month (green)  | Units across all contracts  |
| 4    | DollarOutlined        | Financial Impact | +$14,832 (green) | ↗ 12.5% vs last month (green) | Net impact this period      |

### Tile Component Pattern

```tsx
<div
  style={{
    backgroundColor: '#ffffff',
    border: '1px solid #e8e8e8',
    borderRadius: '8px',
    padding: '24px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
  }}
>
  <Vertical style={{ gap: '12px' }}>
    {/* Header row: icon + label */}
    <Horizontal style={{ alignItems: 'center', gap: '8px' }}>
      <IconComponent style={{ fontSize: '16px', color: '#8c8c8c' }} />
      <Texto
        category="p2"
        appearance="medium"
        style={{ textTransform: 'uppercase', letterSpacing: '0.5px' }}
      >
        LABEL
      </Texto>
    </Horizontal>

    {/* Value row (some tiles include percentage badge) */}
    <Horizontal style={{ alignItems: 'baseline', gap: '12px' }}>
      <Texto category="h3" weight="600">
        Value
      </Texto>
      {/* Optional: percentage badge */}
      <Texto category="p2" style={{ color: '#52c41a' }}>
        ↗ 8.2% vs last month
      </Texto>
    </Horizontal>

    {/* Description */}
    <Texto category="p2" appearance="medium">
      Description text
    </Texto>
  </Vertical>
</div>
```

### Typography Rules

- Section headers: `appearance="medium"` with uppercase
- Field labels: `category="p2" appearance="medium"`
- Values: `category="h4" weight="600"`
- Helper text: `category="p2" appearance="medium"`
- NEVER use `appearance="secondary"` for gray text (it's blue!)

## Current Status

### Implemented

- [x] Basic grid page with KPI tiles
- [x] Detail page with back navigation and 4 tabs (Overview, Scenario Analysis, Performance Details, Benchmarks)
- [x] Navigation routing (grid → detail)
- [x] Menu item appears after Global Tiered Pricing
- [x] Full grid columns matching screenshot specs
- [x] Custom cell renderers (progress bar, colored text, date ranges)
- [x] KPI tiles matching design specs (Total Contracts, At Risk, Total Volume, Financial Impact)
- [x] Action menu (Popover with Menu - Edit, Download, Delete)

### Grid Columns (as of Session 2)

| Column           | Features                                                        |
| ---------------- | --------------------------------------------------------------- |
| CONTRACT ID      | Green clickable link, navigates to details                      |
| CUSTOMER         | Plain text                                                      |
| TYPE             | Sale/Purchase                                                   |
| CONTRACT PERIOD  | Date range formatted                                            |
| DAYS LEFT        | Green colored text                                              |
| VOLUME PROGRESS  | Percentage with progress bar                                    |
| RISK LEVEL       | High/Medium/Low                                                 |
| RISK SCORE       | Numeric                                                         |
| FINANCIAL IMPACT | Colored currency (+green/-red)                                  |
| RATABILITY       | Percentage with warning icon                                    |
| STATUS           | Active/Inactive/Pending                                         |
| Actions          | Popover menu (Edit, Download, Delete) + Right arrow to navigate |

### Detail Page Tabs

| Tab                 | Key                 | Component File                 | Content                          |
| ------------------- | ------------------- | ------------------------------ | -------------------------------- |
| Overview            | overview            | tabs/OverviewTab.tsx           | Placeholder                      |
| Scenario Analysis   | scenario-analysis   | tabs/ScenarioAnalysisTab.tsx   | Placeholder                      |
| Performance Details | performance-details | tabs/PerformanceDetailsTab.tsx | IMPLEMENTED (3 sections + modal) |
| Benchmarks          | benchmarks          | tabs/BenchmarksTab.tsx         | Implemented (3 sections)         |

### Benchmarks Tab Structure

The Benchmarks tab contains 3 sections (each in its own component file under `sections/benchmarks/`):

| Section               | Component File                    | Description                                               |
| --------------------- | --------------------------------- | --------------------------------------------------------- |
| Performance Summary   | `PerformanceSummarySection.tsx`   | Two KPI tiles side-by-side (placeholder content)          |
| Detailed Comparison   | `DetailedComparisonSection.tsx`   | Complex table with grouped headers, product/location data |
| Historical Comparison | `HistoricalComparisonSection.tsx` | Nivo ResponsiveLine chart tracking price trends           |

**Detailed Comparison Table Structure:**

- Two-level header: PRODUCT, LOCATION, VOLUME, % TOTAL, then benchmark groups
- Benchmark columns (RACK AVERAGE, RACK LOW) each have: Delta ($/gal) + Financial impact
- "PRIMARY" badge on primary benchmark
- Delta cells: Arrow + value + "avg historical" label
- Financial impact cells: Colored value (green/red)
- Summary row with totals

### Placeholders (TBD)

- [ ] Overview tab content
- [ ] Scenario Analysis tab content
- [x] Performance Details tab content (COMPLETED - 3 sections + modal)
- [x] Benchmarks tab content (basic structure implemented)
- [ ] Real data integration
- [ ] Make KPI tiles dynamic (currently static values)

## User Requirements (from initial conversation)

1. Add menu section after "Global Tiered Pricing"
2. Use DashboardOutlined icon
3. Use PE_LIGHT theme
4. Grid page with page title, description, 4 tiles above grid
5. Row click navigates to detail page
6. Follow Contract Management design patterns
7. Build statically first, make dynamic later
8. Keep content generic/placeholder for now

## Test URLs

- **Grid page:** http://localhost:3000/ContractMeasurement/ContractMeasurementGrid
- **Details page:** http://localhost:3000/ContractMeasurement/ContractMeasurementDetails

## Related Files

- `/demo/src/pageConfig.tsx` - Route configuration
- `/demo/src/_Main/AuthenticatedRoute.jsx` - Navigation scopes
- `/demo/src/pages/demos/grids/PromptsGrid.tsx` - Reference for grid patterns
- `/demo/src/pages/demos/grids/ContractDetails.tsx` - Reference for detail page patterns
- `/demo/src/pages/OnlineSellingPlatform/components/BehavioralProfileCards.tsx` - Reference for tile patterns

## Notes for Future Development

When adding real content:

1. Update `ContractMeasurement.data.ts` with real interfaces and mock data
2. Update tile content in `ContractMeasurementGrid.tsx`
3. Update column definitions in `ContractMeasurementGrid.tsx`
4. Expand `ContractMeasurementDetails.tsx` with real detail layout
5. Consider adding CSS file if styles become complex (follow kebab-case naming)

## Session Log

### Session 1 (2025-12-05)

**Completed:**

- Created initial file structure (data, grid, details, project-context.md)
- Configured navigation in pageConfig.tsx and AuthenticatedRoute.jsx
- Fixed routing issue: discovered NavigationContextProvider URL pattern `/{ParentKey}/{RouteKey}`
- Fixed layout issue: extra whitespace between title and tiles (removed `height: '100%'` from container)
- Fixed grid issue: rows not rendering (AG Grid needs explicit height, set to `500px`)

**Key Learnings:**

- Route paths MUST match the key names (e.g., `/ContractMeasurement/ContractMeasurementGrid`)
- AG Grid requires explicit height on container - flex/minHeight doesn't work
- Use `appearance="medium"` for gray text, NOT `appearance="secondary"` (which is blue)

### Session 2 (2025-12-05)

**Completed:**

- Updated grid columns to match screenshot specifications
- Implemented custom cell renderers:
  - CONTRACT ID: Green clickable link
  - CONTRACT PERIOD: Date range formatter
  - DAYS LEFT: Green colored text
  - VOLUME PROGRESS: Percentage with progress bar
  - FINANCIAL IMPACT: Colored currency (+green/-red)
  - RATABILITY: Percentage with warning icon (WarningOutlined)
- Updated mock data with realistic contract records (6 rows)
- Updated KPI tiles to show dynamic aggregated values
- Changed row height to 50px to accommodate progress bar

**Key Learnings:**

- Ant Design `Dropdown` component has issues in AG Grid cell renderers (error: "React.Children.only expected to receive a single React element child")
- **Solution:** Use `Popover` with `Menu` instead - works perfectly in cell renderers
- Progress bar renderer needs adequate row height (50px works well)
- Use `valueGetter` when you need to return a computed value for sorting/filtering

**Action Menu Pattern (working solution):**

```tsx
const menuContent = (
  <Menu style={{ border: 'none', boxShadow: 'none' }}>
    <Menu.Item key="edit" onClick={() => console.log('Edit', params.data)}>
      Edit Contract
    </Menu.Item>
    <Menu.Item key="download">Download Report</Menu.Item>
    <Menu.Divider />
    <Menu.Item key="delete" danger>
      Delete
    </Menu.Item>
  </Menu>
);

return (
  <Popover content={menuContent} trigger="click" placement="bottomRight">
    <MoreOutlined style={{ cursor: 'pointer' }} />
  </Popover>
);
```

### Session 3 (2025-12-08)

**Completed:**

- Added 4 tabs to detail page: Overview, Scenario Analysis, Performance Details, Benchmarks
- Implemented Benchmarks tab with 3 sections:
  - Performance Summary: 2 placeholder KPI tiles
  - Detailed Comparison: Ant Design Table with benchmark comparison data
  - Historical Comparison: Nivo ResponsiveLine chart
- Refactored tabs into separate component files under `tabs/` folder
- Created barrel export (`tabs/index.ts`) for clean imports
- Updated KPI tiles on grid page with icons and proper structure

**Key Learnings:**

- Vertical component: Use `style={{ gap: 'Xpx' }}` (NOT a direct `gap` prop)
- Vertical defaults: `height: 100%`, `overflow: hidden`, `flex: '1 1 auto'` - can hide content
- For tab containers, use plain div or explicit overflow settings
- Nivo charts require explicit container height (e.g., `height: '350px'`)

**Tab Component Pattern:**

```tsx
// tabs/index.ts - barrel export
export { OverviewTab } from './OverviewTab';
export { ScenarioAnalysisTab } from './ScenarioAnalysisTab';
// ...

// ContractMeasurementDetails.tsx - import and use
import { OverviewTab, ScenarioAnalysisTab, ... } from './tabs';

<Tabs defaultActiveKey="overview">
  <TabPane tab="Overview" key="overview">
    <OverviewTab />
  </TabPane>
  // ...
</Tabs>
```

**Section Component Pattern:**

```tsx
// sections/benchmarks/index.ts - barrel export
export { PerformanceSummarySection } from './PerformanceSummarySection';
export { DetailedComparisonSection } from './DetailedComparisonSection';
export { HistoricalComparisonSection } from './HistoricalComparisonSection';

// tabs/BenchmarksTab.tsx - thin composition layer
import {
  PerformanceSummarySection,
  DetailedComparisonSection,
  HistoricalComparisonSection,
} from '../sections/benchmarks';

export function BenchmarksTab() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      <PerformanceSummarySection />
      <DetailedComparisonSection />
      <HistoricalComparisonSection />
    </div>
  );
}
```

**Naming Convention for Future Sections:**

- Pattern: `{DescriptiveName}Section.tsx`
- Grouped by tab name (folder): `sections/overview/`, `sections/scenario-analysis/`, etc.
- Examples:
  - `sections/overview/ContractOverviewSection.tsx`
  - `sections/scenario-analysis/WhatIfAnalysisSection.tsx`
  - `sections/performance-details/MetricsSummarySection.tsx`

### Session 3 (continued) - Section Refactoring

**Completed:**

- Refactored Benchmarks tab sections into separate component files
- Created `sections/` folder structure for scalable section organization
- Sections grouped by tab: `sections/benchmarks/`, with future folders for other tabs
- BenchmarksTab.tsx is now a thin composition layer (~16 lines)
- Updated Detailed Comparison table with:
  - Two-level grouped headers (PRODUCT, LOCATION, VOLUME, % TOTAL, benchmark groups)
  - Custom renderers: Delta cells (arrow + value + "avg historical"), Financial impact (colored)
  - PRIMARY badge and ellipsis menu on benchmark headers
  - Summary row with totals

**Key Learnings:**

- Use plain `div` with flexbox for section headers to avoid Vertical's flex expansion
- Ant Design Table `children` prop enables grouped column headers
- `Tag` component works well for badges in table headers

### Session 4 (2025-12-10)

**Completed:**

- Added Ratability Settings feature (drawer component with global configuration)
- Created new folder structure: `components/` for reusable components, `types/` for TypeScript types
- Added "Ratability Settings" button in page header (ContractMeasurementGrid.tsx)
- Implemented RatabilitySettingsDrawer with full configuration options
- Settings persist to localStorage with save/reset functionality

**Ratability Settings Feature:**

The Ratability Settings drawer allows users to configure how ratability scores are calculated across all contracts. Ratability measures how consistently customers lift fuel according to their contract targets.

**Why it was built:**

- Ratability is a key metric displayed in the grid (RATABILITY column with warning icons)
- Different businesses may need different calculation parameters
- Provides flexibility for strict vs. flexible tolerance levels
- Enables comparison against static targets or rolling averages

**File Structure Added:**

```
demo/src/pages/ContractMeasurement/
├── components/                        # NEW: Reusable components
│   └── RatabilitySettingsDrawer.tsx   # Settings drawer component
└── types/                             # NEW: TypeScript types
    └── ratability.types.ts            # Settings types and defaults
```

**Settings Configuration Options:**

| Section            | Setting          | Options                                      | Default       |
| ------------------ | ---------------- | -------------------------------------------- | ------------- |
| Measurement Period | Primary Period   | Weekly, Monthly, Quarterly, Annual           | Monthly       |
| Measurement Period | Minimum Periods  | 1-24 periods                                 | 3             |
| Variance Threshold | Threshold        | ±1%, ±5% (recommended), ±10%, Custom         | ±5%           |
| Variance Threshold | Custom %         | 0.1-50% (when Custom selected)               | 5%            |
| Calculation Method | Method           | Simple Target (recommended), Rolling Average | Simple Target |
| Calculation Method | Rolling Periods  | 2-12 (when Rolling Average selected)         | 3             |
| Advanced Options   | Exclude Outliers | On/Off toggle                                | Off           |

**Type Definitions (ratability.types.ts):**

```typescript
export type RatabilityPeriod = 'weekly' | 'monthly' | 'quarterly' | 'annual';
export type VarianceThreshold = '1%' | '5%' | '10%' | 'custom';
export type CalculationMethod = 'simple-target' | 'rolling-average';

export interface RatabilitySettings {
  primaryPeriod: RatabilityPeriod;
  varianceThreshold: VarianceThreshold;
  customThresholdPercent?: number;
  calculationMethod: CalculationMethod;
  rollingPeriods: number;
  excludeOutliers: boolean;
  minimumPeriods: number;
  lastUpdated: Date;
}
```

**Drawer Component Pattern:**

```tsx
// Integration in ContractMeasurementGrid.tsx
const [isRatabilitySettingsOpen, setIsRatabilitySettingsOpen] = useState(false);

// Header button
<GraviButton
  icon={<SettingOutlined />}
  buttonText="Ratability Settings"
  appearance="outlined"
  onClick={() => setIsRatabilitySettingsOpen(true)}
/>

// Drawer component
<RatabilitySettingsDrawer
  visible={isRatabilitySettingsOpen}
  onClose={() => setIsRatabilitySettingsOpen(false)}
  onSettingsChange={(settings) => console.log('Settings updated:', settings)}
/>
```

**UI Patterns Used:**

- **Option Cards:** Radio buttons with card-style containers, highlighted border when selected
- **Conditional Fields:** Custom threshold input appears only when "Custom" is selected; Rolling periods input appears only when "Rolling Average" is selected
- **RECOMMENDED badges:** Green badges on default/suggested options (±5%, Simple Target)
- **Info Banner:** Blue info box explaining global scope of settings
- **Footer Actions:** Reset to Defaults (outlined) + Save Settings (success/green)
- **Save Status Feedback:** Button text changes: "Saving..." → "Saved ✓" → back to "Save Settings"

**Storage Pattern:**

```typescript
const STORAGE_KEY = 'contract-measurement-ratability-settings';

// Load on mount
useEffect(() => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    const parsed = JSON.parse(stored);
    setSettings({ ...parsed, lastUpdated: new Date(parsed.lastUpdated) });
  }
}, []);

// Save
localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedSettings));

// Reset
localStorage.removeItem(STORAGE_KEY);
```

**Key Learnings:**

- Ant Design `Drawer` component: use `visible` prop (not `open`), `zIndex={2000}` to appear above other overlays
- Option card selection pattern: combine Radio.Group with clickable div containers for larger click targets
- Conditional form fields work well for reducing UI complexity when options have sub-settings

### Session 5 (2025-12-11)

**Completed:**

- Implemented Performance Details tab with full functionality
- Created comprehensive section architecture following established patterns
- Added detailed analysis modal with charts and metrics
- All components follow Excalibrr conventions

**Performance Details Tab Structure:**

The Performance Details tab provides granular product-level performance tracking with:

1. Summary tiles showing aggregate metrics
2. Searchable/filterable product performance table
3. Detailed analysis modal for individual products

**File Structure Added:**

```
demo/src/pages/ContractMeasurement/
├── types/
│   └── performanceDetails.types.ts    # NEW: Type definitions
└── sections/
    ├── index.ts                        # Updated: exports performance-details
    └── performance-details/            # NEW: Performance Details sections
        ├── index.ts                    # Barrel export
        ├── performanceDetails.data.ts  # Mock data and calculation functions
        ├── PerformanceSummaryTiles.tsx # 7 summary metric tiles
        ├── ProductPerformanceTable.tsx # Ant Design Table with search
        └── DetailedAnalysisModal.tsx   # Modal with charts and metrics
```

**Type Definitions (performanceDetails.types.ts):**

```typescript
export interface ProductPerformanceRecord {
  id: number;
  productName: string;
  location: string;
  targetVolume: number;
  actualVolume: number;
  fulfillmentPercentage: number;
  benchmarkPrice: number;
  varianceVsBenchmark: number; // cents difference
  dailyAverageLifting: number;
  requiredDailyPace: number;
  paceVariance: number; // percentage above/below required
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  riskScore: number;
  trend: 'improving' | 'stable' | 'declining';
  trendData: number[]; // Last 10 daily values for sparkline
  performanceStatus: 'ahead' | 'on-track' | 'behind' | 'critical';
}

export interface PerformanceSummary {
  totalDetails: number;
  aboveBenchmark: number;
  atBenchmark: number;
  belowBenchmark: number;
  averagePerformance: number;
  underPerforming: number;
  atRisk: number;
}

export interface DetailedAnalysisData {
  product: ProductPerformanceRecord;
  dailyLiftingData: Array<{ date: string; actual: number; target: number }>;
  dayOfWeekPattern: Array<{ day: string; avgVolume: number }>;
  projectedCompletion: string;
  projectedShortfall: number;
  daysToTarget: number;
  recommendations: string[];
}
```

**Summary Tiles (PerformanceSummaryTiles.tsx):**
7 metric tiles displayed in responsive grid:

| Tile             | Icon                      | Label           | Color            |
| ---------------- | ------------------------- | --------------- | ---------------- |
| Total Details    | AppstoreOutlined          | Total products  | Default          |
| Above Benchmark  | CheckCircleOutlined       | Above benchmark | Green (#52c41a)  |
| At Benchmark     | MinusCircleOutlined       | At benchmark    | Gray             |
| Below Benchmark  | CloseCircleOutlined       | Below benchmark | Red (#cf1322)    |
| Avg Performance  | PercentageOutlined        | Average %       | Default          |
| Under-Performing | ExclamationCircleOutlined | Below 90%       | Orange (#faad14) |
| At Risk          | WarningOutlined           | High risk       | Red (#cf1322)    |

**Product Performance Table (ProductPerformanceTable.tsx):**
Ant Design Table with 8 columns and features:

| Column             | Features                                                   |
| ------------------ | ---------------------------------------------------------- |
| PRODUCT & LOCATION | Two-line cell (product name + location with icons)         |
| PERFORMANCE        | Percentage + status badge + progress bar + volume fraction |
| DAILY AVERAGE      | Current pace + target + variance percentage                |
| BENCHMARK $/GAL    | Price display                                              |
| Δ VS BENCHMARK     | Arrow icon + cents value + "Above/Below Benchmark" label   |
| RISK               | Risk score in Tag + risk level label                       |
| TREND              | Trend icon + label + mini sparkline chart                  |
| Actions            | "View Details" button                                      |

**Table Features:**

- Search input for filtering by product or location
- Product count display
- Export button (placeholder)
- Row click opens detailed analysis modal
- Sortable columns
- Mini sparkline component for trend visualization

**Detailed Analysis Modal (DetailedAnalysisModal.tsx):**
Wide modal (1000px) with comprehensive product analysis:

**Layout:**

1. **4 Metric Cards** (grid layout):
   - Performance: fulfillment % with progress bar
   - Daily Pace: current rate vs required
   - Risk Level: score with tag
   - Timeline: days remaining + projected completion

2. **2 Chart Cards** (side by side):
   - Daily Lifting (30 Days): Bar chart with target line
   - Day of Week Pattern: Bar chart showing weekday patterns

3. **Pace Analysis Section**:
   - Current Pace, Required Pace, Variance, Trend

4. **Recommendations Section**:
   - Green banner with actionable suggestions

**Key Patterns Used:**

- Conditional rendering inside Modal: `{product ? (...content...) : null}`
- Custom bar chart visualizations using div elements
- Mini sparkline using flex container with bars
- Progress bar with conditional coloring

**Data Functions (performanceDetails.data.ts):**

```typescript
// Calculate summary metrics from product data
export function calculatePerformanceSummary(data: ProductPerformanceRecord[]): PerformanceSummary;

// Generate detailed analysis data for a product
export function getDetailedAnalysisData(record: ProductPerformanceRecord): DetailedAnalysisData;
```

**Key Learnings:**

- Ant Design v4 Modal uses `visible` prop, NOT `open` (v5 uses `open`)
- Modal needs to be in DOM even when not shown (don't early return null)
- Use `destroyOnClose` to reset modal state between opens
- Mini sparkline pattern: flex container with absolute-positioned bars
- Progress bar conditional coloring based on status thresholds
- Custom chart visualizations work well for simple displays (no need for chart library)

**Component Composition Pattern:**

```tsx
// tabs/PerformanceDetailsTab.tsx - thin composition layer
import {
  PerformanceSummaryTiles,
  ProductPerformanceTable,
  DetailedAnalysisModal,
  PRODUCT_PERFORMANCE_DATA,
  calculatePerformanceSummary,
  getDetailedAnalysisData,
} from '../sections';

export function PerformanceDetailsTab() {
  const [modalVisible, setModalVisible] = useState(false);
  const [analysisData, setAnalysisData] = useState<DetailedAnalysisData | null>(null);

  const summary = useMemo(() => calculatePerformanceSummary(PRODUCT_PERFORMANCE_DATA), []);

  const handleRowClick = (record: ProductPerformanceRecord) => {
    const data = getDetailedAnalysisData(record);
    setAnalysisData(data);
    setModalVisible(true);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <PerformanceSummaryTiles summary={summary} />
      <ProductPerformanceTable data={PRODUCT_PERFORMANCE_DATA} onRowClick={handleRowClick} />
      <DetailedAnalysisModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        data={analysisData}
      />
    </div>
  );
}
```

### Session 6 (2026-01-06) - Wireframe Review & Design Updates

**Reviewed:**

- Static wireframe prototype at `/Users/frankoverland/Documents/contract-measurement-wireframe/`
- PROJECT_CONTEXT.md (v2.0, January 2025) from wireframe project

**Major Design Changes Identified:**

The wireframe has been significantly updated with a new UX approach. Key changes documented below:

#### 1. Scenario Analysis Tab - Complete Redesign Required

**Current State:** Placeholder tab with "To be determined" text

**Wireframe Design:** Single-page layout with:

- **Left sidebar (300px, sticky)** - Configuration panel
  - Parameters section (collapsible): Price/Volume history settings
  - Scenarios section (collapsible): List of scenarios with expand/collapse details
  - "+ Add Scenario" button navigates to dedicated page
- **Right results area (flex: 1)** - Always visible with sidebar
  - Scenario Comparison Results table (Combined View)
  - Historical Comparison chart

**Layout Pattern:**

```css
.results-layout {
  display: flex;
  flex-direction: row-reverse; /* Puts sidebar on LEFT */
  gap: 24px;
}
```

#### 2. DEPRECATED Concepts (DO NOT Implement)

The following concepts were explored but removed from the design:

| Deprecated Concept                              | Replacement                                                  |
| ----------------------------------------------- | ------------------------------------------------------------ |
| Configure/Results tab toggle                    | Sidebar + Results always visible together                    |
| Separate Price Scenarios and Volume Scenarios   | Unified Scenarios (price + volume together)                  |
| Price View / Volume View / Combined View toggle | Single Combined View only                                    |
| "Select Baseline" configuration section         | Baseline defaults to incumbent; use "Set Primary" in results |
| Separate "Add Volume Scenario" drawer           | Single scenario page with both Price and Volume config       |

#### 3. Unified Scenario Model

Each scenario now contains BOTH price AND volume configuration:

```typescript
interface UnifiedScenario {
  id: string;
  name: string;
  counterparty: string;
  status: 'complete' | 'incomplete';

  // Price Configuration
  entryMethod: 'benchmark' | 'formula' | 'template';
  formulas: Array<{
    detailId: string;
    formula: {
      publisher: string;
      instrument: string;
      priceType: string;
      dateRule: string;
      differential: number;
    };
  }>;

  // Volume Configuration
  allocation: {
    method: string;
    data: Record<string, number>;
  };
  rateability: {
    minimum: number; // percentage (e.g., 90)
    maximum: number; // percentage (e.g., 110)
  };
  penalties: {
    enabled: boolean;
    structure: object;
  };
}
```

#### 4. Combined View Table Structure

The results table shows all data in one view:

| Column          | Content                                                                                |
| --------------- | -------------------------------------------------------------------------------------- |
| Detail (sticky) | Product name + location + monthly volume                                               |
| Baseline        | Price, Formula, Allocated volume, Rateability status                                   |
| Scenario A      | Price, Delta (vs baseline), Formula, Allocated volume, Rateability %, Financial Impact |
| Scenario B      | Same as Scenario A                                                                     |
| ...             | Additional scenarios                                                                   |

**Cell Content Pattern:**

```html
<div class="combined-cell">
  <div class="combined-price">$2.45/gal</div>
  <div class="combined-delta positive">-$0.07 (-2.9%)</div>
  <div class="combined-formula">OPIS Contract Low Houston</div>
  <div class="combined-volume">
    <span class="vol-label">Allocated:</span> 120,000 gal
    <span class="rateable-tag on-track">98%</span>
  </div>
  <div class="impact">Impact: -$8,400</div>
</div>
```

**Rateability Status Tags:**

- `on-track` - Green, within acceptable range
- `at-risk` - Orange/yellow, approaching limits
- `below-min` - Red, below minimum threshold

#### 5. Scenario Creation - Dedicated Page

Adding/editing scenarios uses `scenario-detail.html` (full page), NOT a drawer:

**Page Sections:**

1. **Scenario Settings**: Name, Counterparty, Products/Locations, Entry Method
2. **Price Configuration**: Formula Builder (TBD placeholder)
   - Entry methods: Benchmark-based, Custom Formula, From Template
   - Summary stats: Complete, Incomplete, Remaining counts
3. **Volume Configuration**: 3 config cards
   - Allocation Data (TBD)
   - Rateability Requirements (TBD)
   - Penalties (TBD)

**Navigation:**

- "← Back to Analysis" returns to contract-detail.html
- "Add Scenario" / "Cancel" buttons in header and footer

#### 6. Sidebar Configuration Panel

**Parameters Section (expandable):**

- Summary view: "Price: 12mo, Monthly, Weighted" / "Volume: 12mo, Monthly, Sum"
- Edit mode: Lookback (6/12/18/24mo), Aggregation (Daily/Weekly/Monthly/Quarterly), Method (Weighted/Simple/Median)

**Scenarios Section (expandable):**

- List of scenario cards with:
  - Scenario name
  - Status dot (green=complete, gray=incomplete)
  - Expandable details: Products, Formula, Allocation, Rateability, Penalties
  - Action buttons: Edit, Duplicate, Delete

#### 7. Historical Comparison Chart

Same as current implementation but integrated into the single-page layout:

- Toggle: "Prices & Volume" / "Difference"
- Product filter dropdown
- Legend with Contract Price, Rack Average (PRIMARY), Spot Price
- SVG-based chart visualization

#### 8. Grid Page (index.html) - Minor Updates

Columns match current prototype with some formatting differences:

- Checkbox column added for bulk selection
- Volume Progress shows "95,250 / 100,000" format (actual/total)
- Days Left has visual urgency states (urgent=red, warning=orange, completed=gray)
- Actions menu uses vertical ellipsis (⋮) button pattern

---

## Implementation Gap Analysis

### Must Implement (High Priority)

| Feature                  | Current State                        | Required State                                 |
| ------------------------ | ------------------------------------ | ---------------------------------------------- |
| Scenario Analysis Tab    | Placeholder                          | Full single-page layout with sidebar + results |
| Unified Scenario Model   | Separate price/volume                | Combined price + volume in one scenario        |
| Combined View Table      | Partial (existing in Benchmarks tab) | Full implementation with all cell data         |
| Scenario List in Sidebar | Not implemented                      | Collapsible list with expand/collapse          |
| Scenario Detail Page     | ScenarioDrawer (drawer)              | Full page component                            |

### Refactor Required

| Component            | Change Needed                                         |
| -------------------- | ----------------------------------------------------- |
| `BenchmarksTab.tsx`  | Move scenario comparison logic to ScenarioAnalysisTab |
| `ScenarioDrawer.tsx` | Convert to full page component or deprecate           |
| Sidebar layout       | Create new `ConfigurationSidebar` component           |

### Can Reuse

| Component                   | Notes                                   |
| --------------------------- | --------------------------------------- |
| Historical Comparison chart | Already implemented in BenchmarksTab    |
| Scenario state management   | Existing scenario types and state logic |
| Cell renderers              | Adapt from existing comparison table    |

### TBD (Lower Priority - Marked in Wireframe)

- Formula Builder UI
- Benchmark selector
- Allocation configuration
- Rateability configuration
- Penalties configuration
- Template integration
- Bulk operations

---

## Wireframe Reference Files

Located at: `/Users/frankoverland/Documents/contract-measurement-wireframe/`

| File                   | Purpose                                                   |
| ---------------------- | --------------------------------------------------------- |
| `index.html`           | Contracts grid (entry point)                              |
| `contract-detail.html` | Analysis page - single-page layout with sidebar + results |
| `scenario-detail.html` | Add/Edit scenario page (full page, not drawer)            |
| `styles.css`           | All styling                                               |
| `script.js`            | Interactions                                              |
| `PROJECT_CONTEXT.md`   | Comprehensive design documentation (v2.0)                 |
| `README.md`            | User documentation                                        |

---

### Session 7 (2026-01-08) - ScenarioDrawer Layout Fix & Comparison Table Improvements

**Problem Statement:**
User reported multiple layout issues with the ScenarioDrawer component:

1. Formula builder table was cut off (not fully visible)
2. Header scrolled with content (should be fixed)
3. Tab bar scrolled with content (should be fixed)
4. Content below tabs needed to scroll properly

**Completed:**

1. **ScenarioDrawer Layout Refactored** - Fixed all scrolling and layout issues:
   - Header now stays FIXED at top (never scrolls)
   - Tab bar stays FIXED below header (never scrolls)
   - Content below tabs scrolls properly
   - Formula builder grid (300px) fully visible when scrolled
   - Footer stays FIXED at bottom using `position: fixed`

2. **ScenarioComparisonSection Improvements:**
   - Fixed price alignment (changed from centered to left-aligned)
   - Fixed gaps caused by empty elements (conditional rendering for delta/impact)

**Files Modified:**

| File                                                                                   | Changes                                               |
| -------------------------------------------------------------------------------------- | ----------------------------------------------------- |
| `demo/src/pages/ContractMeasurement/components/ScenarioDrawer.tsx`                     | Complete layout refactor                              |
| `demo/src/styles.css`                                                                  | Added CSS for `.scenario-drawer-tabs` scroll behavior |
| `demo/src/pages/ContractMeasurement/sections/benchmarks/ScenarioComparisonSection.tsx` | Left alignment + conditional rendering                |

**Key Layout Pattern (ScenarioDrawer):**

The correct pattern for a drawer with fixed header/tabs and scrolling content:

```tsx
<Drawer
  placement="bottom"
  height="70%"
  visible={visible}
  onClose={onClose}
  closable={false}
  title={null}
  headerStyle={{ display: 'none' }}
  bodyStyle={{
    backgroundColor: '#f5f5f5',
    padding: 0,
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
  }}
  zIndex={2000}
  destroyOnClose
>
  {/* HEADER - Fixed at top */}
  <div
    style={{
      backgroundColor: '#0C5A58',
      padding: '16px 24px',
      flexShrink: 0, // Critical: prevents shrinking
    }}
  >
    ...header content...
  </div>

  {/* TABS - Tab bar fixed, content scrolls */}
  <Tabs
    className="scenario-drawer-tabs"
    tabBarStyle={{
      margin: 0,
      padding: '0 24px',
      backgroundColor: '#ffffff',
      borderBottom: '1px solid #e8e8e8',
      flexShrink: 0, // Tab bar doesn't shrink
    }}
  >
    <TabPane key="price">
      {/* Content - NO height: 100%, NO overflowY on this div */}
      <div
        style={{
          padding: '24px 24px 100px 24px', // Extra bottom padding for fixed footer
          backgroundColor: '#f5f5f5',
        }}
      >
        ...content...
      </div>
    </TabPane>
  </Tabs>

  {/* FOOTER - Fixed at bottom */}
  <div
    style={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      padding: '16px 24px',
      borderTop: '1px solid #d9d9d9',
      backgroundColor: '#ffffff',
      zIndex: 10,
    }}
  >
    ...footer buttons...
  </div>
</Drawer>
```

**Critical CSS (styles.css):**

```css
/* ScenarioDrawer - Tab content fills available space and scrolls */
.scenario-drawer-tabs {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0; /* CRITICAL: allows flex children to shrink below content size */
}

.scenario-drawer-tabs .ant-tabs-content-holder {
  flex: 1;
  min-height: 0;
  overflow: hidden; /* Prevent double scrollbars */
}

.scenario-drawer-tabs .ant-tabs-content {
  height: 100%;
}

.scenario-drawer-tabs .ant-tabs-tabpane {
  height: 100%;
  overflow-y: auto; /* TABPANE itself scrolls, not the content div inside */
}
```

**Key Learnings:**

1. **`min-height: 0` is CRITICAL** for flex containers that need to allow children to shrink and scroll
2. **Don't put `height: 100%` and `overflowY: auto` on content divs inside flex layouts** - let the CSS handle scroll at the tabpane level
3. **Reference pattern:** `FormulaEditorDrawer.tsx` in demos/grids/components
4. **Footer pattern:** Use `position: fixed` inside the drawer (like FormulaEditorDrawer), NOT the Drawer's `footer` prop

**Comparison Table Fixes:**

```tsx
// LEFT ALIGNMENT - Add textAlign and justifyContent
<div style={{
  textAlign: 'left',  // Text alignment
  ...
}}>
  <Horizontal style={{ justifyContent: 'flex-start' }}>  // Flex alignment
    ...
  </Horizontal>
</div>

// CONDITIONAL RENDERING - Remove gaps from empty elements
// WRONG: Always render with transparent color when undefined
{cellData.delta !== undefined ? <Texto>...</Texto> : <Texto style={{ color: 'transparent' }}>-</Texto>}

// RIGHT: Only render when value exists
{cellData.delta !== undefined && (
  <Texto>...</Texto>
)}
```

**Verification Checklist (all passed):**

- [x] Header stays fixed when scrolling content
- [x] Tab bar stays fixed when scrolling content
- [x] Content below tabs scrolls smoothly
- [x] Formula builder grid is NOT cut off (full 300px visible)
- [x] Footer stays fixed at bottom
- [x] Both Price and Volume tabs work correctly
- [x] Switch to Formula entry method and verify grid displays fully
- [x] Prices in comparison table left-aligned
- [x] No gaps from undefined delta/impact values

---

### Session 8 (2026-01-08) - Add Template Button Functionality

**Problem Statement:**
The "Add Template" button in the ScenarioDrawer's formula components table was not functional - it only logged to console.

**Completed:**

1. **Implemented Template Chooser Integration** - Replicated the exact pattern from Create Index Offer drawer in Index Offer Management
   - When user clicks "Add Template", the entire Price tab content is replaced with the TemplateChooser component
   - User can browse templates in card or list view
   - User can search, filter, and select which components to include
   - Clicking "Select Template" converts and appends components to the formula
   - "Exit Templates" link returns to the form

**Files Modified:**

| File                                                               | Changes                            |
| ------------------------------------------------------------------ | ---------------------------------- |
| `demo/src/pages/ContractMeasurement/components/ScenarioDrawer.tsx` | Added template chooser integration |

**Key Implementation Details:**

1. **New Imports:**

   ```tsx
   import { useNavigate } from 'react-router-dom';
   import { TemplateChooser } from '../../../components/shared/TemplateChooser';
   import { useFormulaTemplateContext } from '../../../contexts/FormulaTemplateContext';
   import {
     FormulaTemplate,
     TemplateComponent,
     buildFormulaPreview,
   } from '../../demos/grids/FormulaTemplates.data';
   import type { FormulaComponent } from '../../OnlineSellingPlatform/IndexOfferManagement.types';
   ```

2. **New State:**

   ```tsx
   const [showTemplateChooser, setShowTemplateChooser] = useState(false);
   const { templates } = useFormulaTemplateContext();
   ```

3. **Handler Pattern:**

   ```tsx
   const handleTemplateSelect = (template: FormulaTemplate) => {
     const maxId = Math.max(0, ...formulaComponents.map((c) => c.id));
     const newComponents = template.components.map((comp, index) => ({
       id: maxId + index + 1,
       percentage: comp.percentage,
       source: comp.source,
       instrument: comp.instrument,
       type: comp.type,
       dateRule: comp.dateRule,
       required: false,
     }));
     setFormulaComponents([...formulaComponents, ...newComponents]);
     setShowTemplateChooser(false);
   };
   ```

4. **Conditional Rendering Pattern:**
   ```tsx
   {showTemplateChooser ? (
     <TemplateChooser
       templates={templates}
       onTemplateSelect={handleTemplateSelect}
       buildFormulaPreview={buildFormulaPreview}
       showManageButton={true}
       onManageTemplates={() => navigate('/ContractFormulas/FormulaTemplates')}
       onClose={() => setShowTemplateChooser(false)}
       showExternalName={false}
     />
   ) : (
     /* Main Price Tab Content */
   )}
   ```

**Key Learnings:**

1. **Reuse existing shared components** - The `TemplateChooser` component is already built and handles all the complexity (search, filters, component selection, card/list views)
2. **Use FormulaTemplateContext** - Templates are managed globally via context, no need to fetch or manage locally
3. **Type casting for mismatched types** - `FormulaComponentsGridProps` type is outdated; use `as unknown as` pattern with eslint-disable comment
4. **Pattern source:** `FormulaEditorDrawer.tsx` in `demo/src/pages/demos/grids/components/`

**Verification:**

- [x] Add Template button opens TemplateChooser
- [x] Templates display in card and list views
- [x] Search and filter work correctly
- [x] Component checkboxes allow partial selection
- [x] Select Template adds components to formula grid
- [x] Exit Templates returns to form
- [x] Manage Formula Templates navigates to templates page
- [x] No TypeScript errors in ScenarioDrawer

---

### Session 9 (2026-01-08) - Implement Benchmark Selection in ScenarioDrawer

**Problem Statement:**
The ScenarioDrawer's "Benchmark" entry method had a TBD placeholder instead of functional benchmark selection. Users needed to select benchmarks (quick select or custom) with real-time preview of matching and impact.

**Completed:**

1. **Added Benchmark Types** - Extended `scenario.types.ts` with comprehensive type definitions
   - `QuickBenchmarkType`, `BenchmarkPublisher`, `BenchmarkTypeOption`, `ProductHierarchy`, `LocationHierarchy`
   - `SelectedBenchmark`, `BenchmarkMatchingInfo`, `BenchmarkImpactEstimate`, `ProductMatchDetail` interfaces
   - Dropdown option constants: `PUBLISHER_OPTIONS`, `BENCHMARK_TYPE_OPTIONS`, `PRODUCT_HIERARCHY_OPTIONS`, `LOCATION_HIERARCHY_OPTIONS`

2. **Created Benchmark Component Suite** - New folder `components/benchmark/`
   - `benchmark.utils.ts` - Mock data and calculation functions for matching/impact
   - `BenchmarkPreview.tsx` - Right panel showing preview, matching summary, estimated impact
   - `BenchmarkSelector.tsx` - Two-column layout with quick select cards and custom benchmark configuration
   - `index.ts` - Barrel export

3. **Integrated into ScenarioDrawer** - Replaced TBD placeholder with functional BenchmarkSelector

**Files Created:**

| File                                         | Description                        |
| -------------------------------------------- | ---------------------------------- |
| `components/benchmark/index.ts`              | Barrel export                      |
| `components/benchmark/benchmark.utils.ts`    | Utility functions and mock data    |
| `components/benchmark/BenchmarkSelector.tsx` | Main two-column selector component |
| `components/benchmark/BenchmarkPreview.tsx`  | Real-time preview panel            |

**Files Modified:**

| File                            | Changes                                               |
| ------------------------------- | ----------------------------------------------------- |
| `types/scenario.types.ts`       | Added benchmark selection types and dropdown options  |
| `components/ScenarioDrawer.tsx` | Added state, import, and integrated BenchmarkSelector |

**Key Implementation Details:**

1. **Two-Column Layout Pattern (from Index Offer Management):**

   ```tsx
   <Horizontal alignItems="flex-start" style={{ gap: '24px' }}>
     <div style={{ width: '300px', flexShrink: 0 }}>{/* Left Panel */}</div>
     <div style={{ flex: 1, minWidth: 0 }}>{/* Right Panel - Preview */}</div>
   </Horizontal>
   ```

2. **Option Card Styling (from RatabilitySettingsDrawer):**

   ```tsx
   const getOptionCardStyle = (isSelected: boolean): React.CSSProperties => ({
     padding: '16px',
     border: isSelected ? '2px solid #51b073' : '1px solid #d9d9d9',
     borderRadius: '8px',
     backgroundColor: isSelected ? 'rgba(81, 176, 115, 0.05)' : '#fafafa',
     cursor: 'pointer',
     transition: 'all 0.2s',
   });
   ```

3. **Collapsible Section Pattern (custom div-based, not AntD Collapse):**

   ```tsx
   const [showCustom, setShowCustom] = useState(false)
   // Header with click handler and rotating chevron
   <DownOutlined style={{ transform: showCustom ? 'rotate(180deg)' : 'rotate(0deg)' }} />
   {showCustom && <div>/* Content */</div>}
   ```

4. **Reactive Calculations with useMemo:**
   ```tsx
   const matchingInfo = useMemo(
     () => calculateMatchingInfo(selectedBenchmark),
     [selectedBenchmark]
   );
   const impactEstimate = useMemo(
     () => calculateImpactEstimate(selectedBenchmark),
     [selectedBenchmark]
   );
   ```

**Key Design Decisions:**

1. **Quick Select First (80% Use Case)** - 3 quick options at top: Rack Average, Rack Low, Spot Price
2. **Custom as Collapsible** - Advanced options hidden by default to reduce cognitive load
3. **Real-time Preview** - Right panel updates immediately on any selection change
4. **Impact Color Coding** - Revenue negative = green (lower cost is good), Margin positive = green (higher margin is good)
5. **Product Breakdown Collapsible** - Per-product details available but hidden by default

**Key Learnings:**

1. **Avoid AntD Collapse `items` prop** - The newer API pattern caused TypeScript errors; use simple div-based collapsibles instead
2. **Two-column patterns are powerful** - Configuration on left, preview on right provides immediate feedback
3. **Mock data enables prototyping** - `benchmark.utils.ts` simulates API responses for rapid iteration

**Verification:**

- [x] Quick select cards respond to clicks with green border
- [x] Only one quick option selected at a time
- [x] Right panel updates immediately on selection
- [x] Custom section expands/collapses
- [x] Custom dropdowns work correctly
- [x] Apply Custom button disabled until Publisher + Type selected
- [x] Clear Selection resets both panels
- [x] Benchmark name displayed in preview
- [x] Matching summary shows progress bar and counts
- [x] Estimated impact shows revenue/margin with correct colors

**Note:** ESLint errors exist for inline styles on divs and function length - these are consistent with other prototype files in this feature area and don't affect functionality.

---

## Next Steps

1. **Create ScenarioAnalysisTab layout** - Sidebar + Results container
2. **Build ConfigurationSidebar component** - Parameters + Scenarios sections
3. **Implement Combined View table** - Reuse patterns from BenchmarksTab
4. **Create ScenarioDetailPage component** - Replace ScenarioDrawer
5. **Update type definitions** - Add UnifiedScenario interface
6. **Migrate historical chart** - Move from BenchmarksTab if needed
