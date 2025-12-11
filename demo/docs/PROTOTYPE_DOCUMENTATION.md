# PE Contract Measurement - Prototype Documentation

> **Purpose**: Reference documentation for rebuilding features using Gravitate Repo and Design System MCP.
> **Note**: This documents functionality, UX, and product outcomes only—not implementation code.

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Core Features & Capabilities](#2-core-features--capabilities)
3. [User Experience & Flows](#3-user-experience--flows)
4. [Data Objects & Types](#4-data-objects--types)
5. [Feature-to-File Mapping](#5-feature-to-file-mapping)

---

## 1. Project Overview

### Domain
Petroleum industry contract measurement and analysis system for tracking contract performance, pricing, risk, and compliance.

### Core Purpose
- Track contract fulfillment (volume delivery vs. targets)
- Analyze pricing against market benchmarks
- Model what-if scenarios for contract optimization
- Monitor risk and ratability/consistency metrics
- Provide actionable insights and notifications

### Technology Stack (Reference Only)
- React 18 + TypeScript
- Vite build tool
- Tailwind CSS with shadcn/ui components
- Zustand for state management
- React Query for server state
- Recharts for visualizations
- React Hook Form + Zod for forms

### Project Location
```
/Users/frankoverland/Documents/PE Contract Measurement/pe-contract-measurement/
```

---

## 2. Core Features & Capabilities

### 2.1 Contract Dashboard (Main Hub)

**Purpose**: Central view for managing all contracts

**Capabilities**:
- View all contracts in a data table
- Search by contract name, customer, ID
- Multi-dimensional filtering:
  - Status: active, completed, cancelled, at-risk
  - Contract type: buy, sell
  - Risk level: low, medium, high, critical
  - Date range: start/end date filtering
  - Expiring within: X days
  - Customer/region filtering
- Sorting by any column (asc/desc)
- Bulk selection for multi-contract operations
- Bulk actions: compare, export, delete
- Summary metrics displayed as cards

**UX Outcomes**:
- Users can quickly find contracts of interest
- At-risk contracts are visually highlighted
- One-click navigation to detailed analysis

**File Location**: `/src/components/ContractDashboard.tsx`

---

### 2.2 Contract Detail View

**Purpose**: Deep-dive into individual contract performance

**Capabilities**:
- Tab-based interface with 5 sections:
  1. **Overview**: Summary metrics, key performance indicators
  2. **Benchmark Analysis**: Price comparison vs. market benchmarks
  3. **Interval Tracking**: Volume pacing against targets
  4. **Details Performance**: Product-level analysis
  5. **Scenario Analysis**: What-if modeling

**UX Outcomes**:
- Users get comprehensive view without information overload
- Logical grouping of related information
- Easy navigation between analysis types

**File Location**: `/src/components/contracts/ContractDetailView.tsx`

---

### 2.3 Benchmark Analysis Suite

**Purpose**: Compare contract pricing against market benchmarks

**Capabilities**:
- Multiple benchmark types supported:
  - Rack prices (terminal-specific)
  - Market indices (CBOB, ULSD, Ethanol, RIN)
  - Contract benchmarks (custom)
- Price vs. benchmark comparison charts
- Per-product benchmark analysis
- Performance metrics:
  - Days above/below benchmark
  - Average difference (absolute and percentage)
  - Total financial impact
  - Outperformance ratio
- Statistical analysis:
  - Standard deviation
  - Correlation analysis
  - Volatility metrics
- Recommendations based on performance
- What-if analysis with benchmark adjustments

**UX Outcomes**:
- Users understand pricing performance at a glance
- Actionable recommendations highlight opportunities
- Visual charts make trends clear

**File Locations**:
- `/src/components/benchmarks/BenchmarkManager.tsx`
- `/src/components/benchmarks/BenchmarkManagerV2.tsx`
- `/src/components/benchmarks/BenchmarkAnalysis.tsx`
- `/src/components/benchmarks/DynamicBenchmarkComparison.tsx`

---

### 2.4 Interval Tracking System

**Purpose**: Monitor contract fulfillment pace across time intervals

**Capabilities**:
- Configurable intervals: daily, weekly, monthly, quarterly, annual
- Pacing calendar visualization (heat map style)
- Volume performance charts with targets
- Forecast projections:
  - Projected final volume
  - Probability of success
  - Required daily rate to meet target
- Milestone tracking (25%, 50%, 75%, 100%)
- **Target Adjustment Planner**:
  - Create adjusted targets when behind
  - View original vs. revised targets
  - Impact analysis on ratability
- Pattern analysis (seasonality, trends)
- Interval alerts for pace variance

**UX Outcomes**:
- Users know immediately if contracts are on track
- Calendar view shows lifting patterns
- Proactive alerts prevent last-minute scrambles

**File Locations**:
- `/src/components/intervals/IntervalDashboard.tsx`
- `/src/components/intervals/PacingCalendar.tsx`
- `/src/components/intervals/TargetAdjustmentPlanner.tsx`
- `/src/components/intervals/ForecastProjection.tsx`

---

### 2.5 Scenario Modeling (What-If Analysis)

**Purpose**: Model different contract scenarios to optimize decisions

**Capabilities**:
- Adjustment parameters:
  - Volume change: -50% to +50%
  - Price change: -30% to +30% (per instrument)
  - Duration change: -365 to +365 days
- Per-product/location adjustments
- Impact calculations:
  - Financial impact (revenue/cost change)
  - Volume impact
  - Risk score change
  - Timeline impact
- Baseline scenario generation
- Save scenarios with names and descriptions
- Compare up to 4 scenarios side-by-side
- Scenario sharing/collaboration
- Quick templates for common adjustments

**UX Outcomes**:
- Users can model "what if we extend by 30 days?"
- Comparison view shows best option clearly
- Saved scenarios enable team collaboration

**File Locations**:
- `/src/components/whatif/FreshScenarioAnalysis.tsx`
- `/src/components/whatif/ScenarioComparison.tsx`
- `/src/services/scenarioModelingService.ts`

---

### 2.6 Contract Comparison

**Purpose**: Compare multiple contracts side-by-side

**Capabilities**:
- Compare 2-4 contracts simultaneously
- Metrics compared:
  - Total volume
  - Average price per gallon
  - Contract duration
  - Risk score
  - Ratability score
  - Current progress
  - Projected revenue
- Scenario analysis with assumptions:
  - Volume adjustment
  - Market condition adjustment
  - Price volatility
- Recommendations:
  - Best overall contract
  - Best financial performance
  - Least risky option
- Significance indicators (high/medium/low)

**UX Outcomes**:
- Users can evaluate contract alternatives
- Clear recommendations guide decisions
- Scenario modeling shows sensitivity

**File Locations**:
- `/src/components/comparison/ContractComparison.tsx`
- `/src/components/comparison/ComparisonMetricsTable.tsx`

---

### 2.7 Risk Scoring System

**Purpose**: Quantify and track contract risk

**Capabilities**:
- Risk score: 0-100 (higher = more risky)
- Risk categories: low (0-30), medium (31-70), high (71-90), critical (90-100)
- Multi-factor analysis:
  - **Pace Factor** (40% weight): Current vs. required delivery pace
  - **Pattern Factor** (30% weight): Historical consistency
  - **Time Factor** (30% weight): Days remaining urgency
- 7-day trend analysis (up/down/stable)
- Projections:
  - Shortfall amount and percentage
  - Recommended daily volume
  - Probability of success
  - Days to failure estimate
- Detailed breakdown for tooltips

**UX Outcomes**:
- At-a-glance risk understanding
- Trend shows if things are improving
- Projections enable proactive action

**File Location**: `/src/services/riskScoringService.ts`

---

### 2.8 Ratability/Consistency Scoring

**Purpose**: Measure contract compliance consistency

**Capabilities**:
- Score: 0-100 based on variance from targets
- Categories: excellent (90-100), good (75-89), fair (60-74), poor (0-59)
- Configurable settings:
  - Period: weekly, monthly, quarterly, annual
  - Variance threshold: 1%, 5%, 10%, custom
  - Calculation method: simple-target, rolling-average
  - Outlier exclusion option
- Period breakdown analysis
- Trend analysis (improving, declining, stable)
- Per-contract custom overrides

**UX Outcomes**:
- Users can monitor compliance requirements
- Custom thresholds match contract terms
- Historical view shows improvement over time

**File Locations**:
- `/src/services/ratabilityService.ts`
- `/src/components/settings/RatabilitySettings.tsx`

---

### 2.9 Product Analytics (Details Performance)

**Purpose**: Product-level performance analysis

**Capabilities**:
- Per-product metrics:
  - Target vs. actual volume
  - Fulfillment percentage
  - Daily average lifting
  - Price per unit with margin
- Price component breakdown:
  - Base index
  - Ethanol component
  - RIN component
  - Customer differential
- Market indices tracking:
  - CBOB (Gulf Coast, Chicago, LA, NY Harbor)
  - ULSD (Gulf Coast, Chicago, LA, NY Harbor)
  - Ethanol Chicago
  - RIN
- Filtering and grouping:
  - Group by product or location
  - Filter by performance status
  - Filter by risk level
- Detailed analysis modal for deep dive

**UX Outcomes**:
- Users identify underperforming products
- Pricing transparency builds trust
- Actionable recommendations per product

**File Locations**:
- `/src/components/details/DetailsPerformance.tsx`
- `/src/services/productAnalyticsService.ts`

---

### 2.10 Notification System

**Purpose**: Proactive alerts and smart recommendations

**Capabilities**:
- Notification types:
  - Pace variance alerts
  - Contract expiration warnings (30/60/90 days)
  - Lifting pattern changes
  - Risk score changes
  - Volume milestones
  - Price alerts
- Notification features:
  - Severity levels: low, medium, high, critical
  - Status tracking: unread, read, snoozed, dismissed
  - Smart suggestions with actionable recommendations
  - Quick actions directly from notification
- User preferences:
  - Enable/disable by type
  - Delivery method: in-app, email, both
  - Frequency: immediate, hourly, daily, weekly
  - Quiet hours configuration
- Notification history

**UX Outcomes**:
- Users never miss critical events
- Smart suggestions reduce analysis time
- Configurable to prevent notification fatigue

**File Locations**:
- `/src/components/notifications/NotificationBell.tsx`
- `/src/components/notifications/NotificationCenter.tsx`
- `/src/services/notificationService.ts`

---

### 2.11 Portfolio Analytics

**Purpose**: Aggregate view across all contracts

**Capabilities**:
- Portfolio summary metrics:
  - Total contracts
  - Active vs. at-risk
  - Overall volume fulfillment
  - Total financial impact
  - Average risk score
- Volume trends over time
- Contract performance ranking
- Portfolio-level filtering

**UX Outcomes**:
- Executive summary view
- Identify portfolio-wide issues
- Track overall business health

**File Location**: `/src/pages/PortfolioAnalyticsPage.tsx`

---

### 2.12 Export & Reporting

**Purpose**: Export data for external use

**Capabilities**:
- Excel export via xlsx library
- Bulk export of selected contracts
- Print functionality

**UX Outcomes**:
- Integration with external reporting tools
- Data portability for stakeholders

---

## 3. User Experience & Flows

### 3.1 Navigation Structure

#### Primary Navigation (Top Bar)
- **Contracts**: Main dashboard
- **Volume Assessment**: Volume analysis
- **Contract Measurement**: Measurement tools
- **Portfolio Analytics**: Aggregate view

#### Secondary Navigation (Floating Sidebar)
- Collapsible icon-based navigation
- Expands on hover to show labels
- Groups: Pricing Engine, Contract Management, Admin

#### Detail Navigation (Tabs)
- Overview | Benchmarks | Intervals | Details | Scenarios

### 3.2 Core User Flows

#### Flow 1: Contract Exploration
```
Dashboard → Search/Filter → Select Contract → Detail View
                                               ├─ Overview (metrics)
                                               ├─ Benchmarks (pricing)
                                               ├─ Intervals (pacing)
                                               ├─ Details (products)
                                               └─ Scenarios (what-if)
```

#### Flow 2: Contract Comparison
```
Dashboard → Select 2-4 Contracts (checkbox) → Click "Compare"
└─ Comparison Page
   ├─ Side-by-side metrics
   ├─ Scenario adjustments
   └─ Recommendations
```

#### Flow 3: Risk Monitoring
```
Dashboard → View risk badges → Click high-risk contract
└─ Detail View → Overview tab
   ├─ Risk score card
   ├─ Risk factors breakdown
   ├─ Trend indicator
   └─ Projections (shortfall, required pace)
```

#### Flow 4: What-If Analysis
```
Detail View → Scenarios tab
└─ What-If Analysis
   ├─ View baseline metrics
   ├─ Adjust parameters (sliders)
   ├─ View impact (real-time)
   ├─ Save scenario (dialog)
   └─ Compare scenarios (2-4)
```

#### Flow 5: Target Adjustment
```
Detail View → Intervals tab
└─ Interval Dashboard
   ├─ View pacing calendar
   ├─ See shortfall warning
   ├─ Open Target Adjustment Planner
   │   ├─ Create adjustment
   │   ├─ Distribute across periods
   │   └─ View ratability impact
   └─ Save and track
```

#### Flow 6: Bulk Operations
```
Dashboard → Select multiple contracts (checkbox)
└─ Bulk Actions Bar appears
   ├─ Compare (if 2-4 selected)
   ├─ Export (Excel)
   └─ Delete (with confirmation)
```

### 3.3 UI Patterns

#### Data Display
- **Metric Cards**: KPI values with trends
- **Data Tables**: Sortable, selectable rows
- **Charts**: Bar, line, pie (Recharts)
- **Calendar**: Heat-map style pacing view
- **Sparklines**: Inline trend indicators

#### Interactions
- **Search**: Real-time text filtering
- **Filters**: Panel-based with clear all
- **Bulk Select**: Checkbox + select all
- **Sort**: Click column headers
- **Dialogs**: Confirmation for destructive actions
- **Sheets**: Slide-in panels for forms

#### States
- **Loading**: Skeleton loaders
- **Empty**: Contextual empty states with actions
- **Error**: Error boundaries with recovery
- **Success**: Toast notifications

---

## 4. Data Objects & Types

### 4.1 Contract (Core Entity)

```typescript
interface Contract {
  id: string;
  customerId: string;
  customerName: string;
  contractType: 'buy' | 'sell';
  startDate: Date;
  endDate: Date;
  totalVolume: number;
  currentVolume: number;
  products: ContractProduct[];
  riskScore: number;
  financialImpact: number;
  status: 'active' | 'completed' | 'cancelled' | 'at-risk';
  primaryInterval: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'annual';
  useCustomRatability: boolean;
  customRatabilitySettings?: Partial<RatabilitySettings>;
  createdAt: Date;
  updatedAt: Date;
  historicalData?: ContractHistoricalData[];
  dailyPricing?: ContractDailyPricing[];
}
```

**File**: `/src/types/contract.types.ts`

### 4.2 Contract Product

```typescript
interface ContractProduct {
  id: string;
  productName: string;
  location: string;
  plannedVolume: number;
  actualVolume: number;
  pricePerUnit: number;
  unit: string;
  utilization: number;
  margin: number;
  status: 'good' | 'warning' | 'critical';
}
```

### 4.3 Benchmark

```typescript
interface Benchmark {
  id: string;
  name: string;
  description: string;
  type: 'rack_price' | 'market_index' | 'contract_benchmark';
  unit: string;
  currency: 'USD' | 'EUR' | 'GBP';
  location?: string;
  productType?: string;
  data: BenchmarkDataPoint[];
  metadata?: {
    source?: string;
    updateFrequency?: string;
    lastUpdated?: Date;
  };
}
```

**File**: `/src/types/benchmark.types.ts`

### 4.4 Interval Target & Performance

```typescript
interface IntervalTarget {
  id: string;
  contractId: string;
  intervalType: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'annual';
  targetVolume: number;
  targetRevenue?: number;
  startDate: Date;
  endDate: Date;
  description: string;
}

interface IntervalPerformance {
  id: string;
  intervalTargetId: string;
  date: Date;
  actualVolume: number;
  cumulativeVolume: number;
}
```

**File**: `/src/types/interval.types.ts`

### 4.5 Target Adjustment

```typescript
interface TargetAdjustment {
  id: string;
  contractId: string;
  adjustmentPeriod: AdjustmentPeriod;
  originalTargets: OriginalTarget[];
  revisedTargets: RevisedTarget[];
  totalAdjustment: number;
  ratabilityImpact: number;
  requiredDailyRate: number;
  adjustmentMode: 'weekly' | 'monthly';
  isActive: boolean;
  createdAt: Date;
  createdBy: string;
  notes?: string;
}
```

### 4.6 Risk Score

```typescript
interface RiskScore {
  totalScore: number; // 0-100
  category: 'low' | 'medium' | 'high' | 'critical';
  factors: {
    paceScore: number;      // 40% weight
    patternScore: number;   // 30% weight
    timeScore: number;      // 30% weight
  };
  trend: {
    direction: 'up' | 'down' | 'stable';
    change: number;
  };
  projections?: {
    projectedShortfall: number;
    recommendedDailyVolume: number;
    probabilityOfSuccess: number;
  };
}
```

**File**: `/src/types/riskScoring.types.ts`

### 4.7 Ratability Settings & Score

```typescript
interface RatabilitySettings {
  primaryPeriod: 'weekly' | 'monthly' | 'quarterly' | 'annual';
  varianceThreshold: '1%' | '5%' | '10%' | 'custom';
  customThresholdPercent?: number;
  calculationMethod: 'simple-target' | 'rolling-average';
  rollingPeriods: number;
  excludeOutliers: boolean;
  minimumPeriods: number;
}

interface RatabilityScore {
  score: number; // 0-100
  category: 'excellent' | 'good' | 'fair' | 'poor' | 'insufficient-data';
  variancePercent: number;
  periodsAnalyzed: number;
  meetsThreshold: boolean;
  periodBreakdown: RatabilityPeriodData[];
}
```

**File**: `/src/types/ratability.types.ts`

### 4.8 Scenario Analysis

```typescript
interface ScenarioAnalysis {
  id: string;
  name: string;
  description: string;
  contractId: string;
  baselineContract: Contract;
  adjustments: ScenarioAdjustments;
  impact: ScenarioImpact;
  isBaseline: boolean;
  isSaved: boolean;
  createdAt: Date;
}

interface ScenarioAdjustments {
  volumeChangePercentage: number;    // -50 to +50
  globalPriceChangePercentage: number; // -30 to +30
  instrumentPriceChanges: Record<string, number>;
  contractExtensionDays: number;     // -365 to +365
  detailVolumeChanges: Record<string, number>;
}

interface ScenarioImpact {
  totalFinancialImpact: number;
  volumeChange: number;
  riskScore: RiskScore;
  projectedCompletionDate: Date;
  averagePricePerUnit: number;
  totalMargin: number;
}
```

**File**: `/src/types/whatIfScenario.types.ts`

### 4.9 Notification

```typescript
interface Notification {
  id: string;
  type: 'pace_variance' | 'contract_expiration' | 'lifting_pattern_change'
        | 'risk_score_change' | 'volume_milestone' | 'price_alert';
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'unread' | 'read' | 'snoozed' | 'dismissed';
  title: string;
  message: string;
  contractId?: string;
  contractName?: string;
  suggestions?: NotificationSuggestion[];
  createdAt: Date;
  primaryAction?: NotificationAction;
  quickActions?: NotificationAction[];
}
```

**File**: `/src/types/notification.types.ts`

### 4.10 Price Instrument

```typescript
interface PriceInstrument {
  id: string;
  name: string;
  type: 'index' | 'component' | 'differential';
  unit: string;
  baseValue: number;
  locations: string[];
  products: string[];
  detailIds: string[];
}
```

**File**: `/src/services/priceInstrumentService.ts`

---

## 5. Feature-to-File Mapping

### Dashboard & Navigation
| Feature | File Path |
|---------|-----------|
| Main Dashboard | `/src/components/ContractDashboard.tsx` |
| Dashboard Page | `/src/pages/DashboardPage.tsx` |
| Top Navigation | `/src/components/TopNavigation.tsx` |
| Floating Sidebar | `/src/components/FloatingSidebar.tsx` |
| Filter Panel | `/src/components/FilterPanel.tsx` |
| Bulk Actions | `/src/components/BulkActionsBar.tsx` |

### Contract Detail
| Feature | File Path |
|---------|-----------|
| Detail View Container | `/src/components/contracts/ContractDetailView.tsx` |
| Detail Page | `/src/pages/ContractDetailPage.tsx` |
| Contract Form | `/src/components/forms/ContractForm.tsx` |

### Benchmark Analysis
| Feature | File Path |
|---------|-----------|
| Benchmark Manager | `/src/components/benchmarks/BenchmarkManager.tsx` |
| Benchmark Manager V2 | `/src/components/benchmarks/BenchmarkManagerV2.tsx` |
| Benchmark Analysis | `/src/components/benchmarks/BenchmarkAnalysis.tsx` |
| Benchmark Comparison | `/src/components/benchmarks/DynamicBenchmarkComparison.tsx` |
| Benchmark Selector | `/src/components/benchmarks/BenchmarkSelector.tsx` |

### Interval Tracking
| Feature | File Path |
|---------|-----------|
| Interval Dashboard | `/src/components/intervals/IntervalDashboard.tsx` |
| Pacing Calendar | `/src/components/intervals/PacingCalendar.tsx` |
| Target Adjustment | `/src/components/intervals/TargetAdjustmentPlanner.tsx` |
| Forecast Projection | `/src/components/intervals/ForecastProjection.tsx` |
| Volume Planner | `/src/components/intervals/VolumePlanner.tsx` |
| Pattern Analysis | `/src/components/intervals/PatternAnalysis.tsx` |

### What-If / Scenarios
| Feature | File Path |
|---------|-----------|
| Scenario Analysis | `/src/components/whatif/FreshScenarioAnalysis.tsx` |
| Scenario Comparison | `/src/components/whatif/ScenarioComparison.tsx` |
| Save Scenario Dialog | `/src/components/whatif/SaveScenarioDialog.tsx` |
| Scenario Service | `/src/services/scenarioModelingService.ts` |

### Comparison
| Feature | File Path |
|---------|-----------|
| Contract Comparison | `/src/components/comparison/ContractComparison.tsx` |
| Metrics Table | `/src/components/comparison/ComparisonMetricsTable.tsx` |
| Comparison Service | `/src/services/comparisonService.ts` |

### Analytics & Charts
| Feature | File Path |
|---------|-----------|
| Contract Analytics | `/src/components/analytics/ContractAnalytics.tsx` |
| Volume Chart | `/src/components/analytics/VolumePerformanceChart.tsx` |
| Financial Trend | `/src/components/analytics/FinancialTrendChart.tsx` |
| Product Mix | `/src/components/analytics/ProductMixChart.tsx` |
| Portfolio Analytics | `/src/pages/PortfolioAnalyticsPage.tsx` |

### Details Performance
| Feature | File Path |
|---------|-----------|
| Details Performance | `/src/components/details/DetailsPerformance.tsx` |
| Details Filters | `/src/components/details/DetailsPerformanceFilters.tsx` |
| Analysis Modal | `/src/components/details/DetailedAnalysisModal.tsx` |

### Settings
| Feature | File Path |
|---------|-----------|
| Ratability Settings | `/src/components/settings/RatabilitySettings.tsx` |
| Contract Override | `/src/components/settings/ContractRatabilityOverride.tsx` |

### Notifications
| Feature | File Path |
|---------|-----------|
| Notification Bell | `/src/components/notifications/NotificationBell.tsx` |
| Notification Center | `/src/components/notifications/NotificationCenter.tsx` |
| Notification Service | `/src/services/notificationService.ts` |

### Risk & Ratability Services
| Feature | File Path |
|---------|-----------|
| Risk Scoring | `/src/services/riskScoringService.ts` |
| Ratability Service | `/src/services/ratabilityService.ts` |
| Product Analytics | `/src/services/productAnalyticsService.ts` |
| Price Instruments | `/src/services/priceInstrumentService.ts` |
| Contract Service | `/src/services/contractService.ts` |

### Type Definitions
| Types | File Path |
|-------|-----------|
| Contract Types | `/src/types/contract.types.ts` |
| Benchmark Types | `/src/types/benchmark.types.ts` |
| Interval Types | `/src/types/interval.types.ts` |
| Risk Types | `/src/types/riskScoring.types.ts` |
| Ratability Types | `/src/types/ratability.types.ts` |
| Scenario Types | `/src/types/whatIfScenario.types.ts` |
| Comparison Types | `/src/types/comparison.types.ts` |
| Analytics Types | `/src/types/analytics.types.ts` |
| Notification Types | `/src/types/notification.types.ts` |
| Product Analytics | `/src/types/productAnalytics.types.ts` |

### UI Components
| Component | File Path |
|-----------|-----------|
| Metric Card | `/src/components/ui/system/MetricCard.tsx` |
| Data Table | `/src/components/ui/system/DataTable.tsx` |
| Empty State | `/src/components/ui/system/EmptyState.tsx` |
| Loading State | `/src/components/ui/system/LoadingState.tsx` |
| Status Badge | `/src/components/ui/system/StatusBadge.tsx` |
| Section Header | `/src/components/ui/system/SectionHeader.tsx` |
| Progress Bar | `/src/components/ui/system/StandardizedProgressBar.tsx` |
| Form Components | `/src/components/ui/system/Form*.tsx` |

---

## Appendix: Key Constants & Thresholds

### Risk Thresholds
- **Low**: 0-30
- **Medium**: 31-70
- **High**: 71-90
- **Critical**: 90-100

### Ratability Thresholds
- **Excellent**: 90-100
- **Good**: 75-89
- **Fair**: 60-74
- **Poor**: 0-59

### Scenario Constraints
- Volume change: -50% to +50% (step: 5%)
- Price change: -30% to +30% (step: 1%)
- Duration change: -365 to +365 days (step: 7 days)
- Max comparison scenarios: 4

### Risk Factor Weights
- Pace Factor: 40%
- Pattern Factor: 30%
- Time Factor: 30%

---

*Document generated for prototype reference. Use alongside Gravitate Design System for rebuilding.*
