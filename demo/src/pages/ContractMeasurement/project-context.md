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
│   └── RatabilitySettingsDrawer.tsx # Global ratability settings drawer
├── types/                           # TypeScript type definitions
│   ├── ratability.types.ts          # Ratability settings types & defaults
│   └── performanceDetails.types.ts  # Performance Details types
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
    │   └── HistoricalComparisonSection.tsx
    └── performance-details/         # Sections for Performance Details tab
        ├── index.ts                 # Performance Details barrel export
        ├── performanceDetails.data.ts  # Mock data and functions
        ├── PerformanceSummaryTiles.tsx
        ├── ProductPerformanceTable.tsx
        └── DetailedAnalysisModal.tsx
```

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
