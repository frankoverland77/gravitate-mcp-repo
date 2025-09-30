# PE Contract Measurement - Application Workflow Documentation

## Overview

The PE Contract Measurement application is a comprehensive petroleum contract monitoring and analysis platform built with React, TypeScript, and modern UI components. It provides real-time contract performance tracking, risk assessment, benchmarking, interval analysis, and scenario modeling capabilities.

## Technology Stack

- **Frontend**: React 18 with TypeScript
- **Build Tool**: Vite
- **Routing**: React Router DOM v6
- **UI Library**: Radix UI primitives with custom design system
- **Styling**: Tailwind CSS with custom animations
- **State Management**: React Query for server state, Zustand for client state
- **Charts**: Recharts
- **Form Handling**: React Hook Form with Zod validation
- **Date Handling**: date-fns

## Application Architecture

### Route Structure
```
/ (Dashboard)
├── /contracts/compare (Contract Comparison)
└── /contracts/:id/* (Contract Detail)
    ├── / (Overview - default)
    ├── /benchmark (Benchmarking)
    ├── /intervals (Interval Tracking)
    ├── /scenario (Scenario Analysis)
    └── /details (Details Performance)
```

### Core Components Hierarchy
```
App
├── TopNavigation (Fixed header with tabs)
├── FloatingSidebar (Collapsible navigation)
└── Main Content Area
    ├── DashboardPage → ContractDashboard
    ├── ContractDetailPage → ContractDetailView
    └── ContractComparison
```

## Page-by-Page Workflow

### 1. Dashboard Page (`/`)

**Purpose**: Main contract overview and management interface

**Key Features**:
- **Contract Metrics Cards**: Display total contracts, at-risk contracts, total volume, and financial impact with animated counters
- **Contract Data Table**: Sortable, filterable table showing all contracts with:
  - Contract ID, Customer, Type, Period
  - Days remaining with color-coded urgency
  - Volume progress bars with completion percentages
  - Risk levels and scores
  - Financial impact indicators
  - Ratability scores
  - Status badges
- **Search and Filtering**:
  - Real-time search across contract IDs and customer names
  - Right-slide filter panel with:
    - Status filters (active, at-risk, completed, cancelled)
    - Contract type filters (buy/sell)
    - Risk level filters
    - Date range selection
    - Customer search
    - Regional filters
    - Expiring contracts filter
- **Bulk Operations**:
  - Multi-select contracts with checkboxes
  - Bulk actions bar appears when items selected
  - Export, print, compare (2-4 contracts), delete actions
  - Keyboard shortcuts (Ctrl+A, Delete, Escape)
- **Quick Actions**:
  - Export data button
  - Ratability settings configuration
  - Filter management with active count badges

**Data Flow**:
- Loads contracts via contractService.getAllContracts()
- Calculates ratability scores using ratabilityService
- Calculates risk scores using riskScoringService
- Real-time filtering and sorting on client side
- Pagination handled by DataTable component

**User Interactions**:
- Click contract row → Navigate to contract detail
- Use search to filter contracts
- Open filter panel for advanced filtering
- Select multiple contracts for bulk operations
- Click metrics cards to apply quick filters
- Sort columns by clicking headers

### 2. Contract Detail Page (`/contracts/:id`)

**Purpose**: Comprehensive single contract analysis and management

**Navigation Structure**:
The detail page uses nested routing with 5 main tabs:

#### 2.1 Overview Tab (Default)
- **Contract Summary Card**: Basic contract information
- **Key Metrics**: Volume progress, financial performance, risk indicators
- **Performance Charts**: Volume trends, financial impact over time
- **Product Mix Visualization**: Breakdown by product and location
- **Recent Activity**: Contract events and alerts
- **Mini Widgets**: Preview of benchmarks and intervals

#### 2.2 Benchmarking Tab (`/contracts/:id/benchmark`)
- **Benchmark Manager**: Main benchmarking interface
- **Benchmark Selection**: Choose comparison contracts or market indices
- **Performance Comparison**: Side-by-side metrics comparison
- **Deviation Analysis**: Performance gaps and recommendations
- **Export Tools**: Generate benchmark reports

#### 2.3 Interval Tracking Tab (`/contracts/:id/intervals`)
- **Primary Interval Tile**: Main interval configuration (daily/weekly/monthly/quarterly/annual)
- **Interval Overview Strip**: Quick view of all active intervals
- **Pacing Calendar**: Visual timeline showing delivery schedules
- **Forecast Projection**: Predicted volume and financial outcomes
- **Target Adjustment Planner**: Modify delivery targets
- **Volume Planner**: Schedule future deliveries

#### 2.4 Scenario Analysis Tab (`/contracts/:id/scenario`)
- **Fresh Scenario Analysis**: What-if modeling interface
- **Scenario Templates**: Pre-built analysis templates
- **Variable Adjustment Controls**: Modify price, volume, timing parameters
- **Impact Visualization**: Charts showing projected outcomes
- **Scenario Comparison**: Compare multiple scenarios
- **Save/Load Scenarios**: Scenario management

#### 2.5 Details Performance Tab (`/contracts/:id/details`)
- **Detailed Performance Metrics**: Granular contract performance data
- **Historical Data Tables**: Time-series performance data
- **Performance Alerts**: Risk indicators and notifications
- **Audit Trail**: Contract modification history
- **Ratability Override**: Custom ratability settings for this contract

**Data Flow**:
- Loads individual contract via contractService.getContractById()
- Calculates comprehensive metrics and scores
- Lazy loads tab content using React.Suspense
- Real-time updates for performance data

**User Interactions**:
- Navigate between tabs using URL routing
- Modify contract parameters in various tabs
- Run scenario analyses with different variables
- Configure interval tracking parameters
- Override ratability settings
- Export reports and data

### 3. Contract Comparison Page (`/contracts/compare`)

**Purpose**: Side-by-side comparison of 2-4 contracts

**Key Features**:
- **Contract Selection**: URL-based contract selection via query params
- **Comparison Metrics Table**: Side-by-side metrics comparison
- **Performance Visualization**: Charts comparing key metrics
- **Gap Analysis**: Identifies performance differences
- **Export Capabilities**: Generate comparison reports

**Data Flow**:
- Receives contract IDs via URL search params (?contracts=id1,id2,id3)
- Loads contracts in parallel
- Uses comparisonService to generate comparison data
- Validates 2-4 contract limit

**User Interactions**:
- Accessed via bulk selection from dashboard
- View side-by-side contract performance
- Export comparison reports
- Navigate back to dashboard or individual contracts

## Core Data Models

### Contract Entity
```typescript
interface Contract {
  id: string
  customerId: string
  customerName: string
  contractType: 'buy' | 'sell'
  startDate: Date
  endDate: Date
  totalVolume: number
  currentVolume: number
  products: ContractProduct[]
  riskScore: number
  financialImpact: number
  status: 'active' | 'completed' | 'cancelled' | 'at-risk'
  primaryInterval: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'annual'
  useCustomRatability: boolean
  customRatabilitySettings?: RatabilitySettings
}
```

### Contract Metrics
```typescript
interface ContractMetrics {
  volumeFulfillmentPercentage: number
  daysRemaining: number
  financialPerformance: number
  riskLevel: 'low' | 'medium' | 'high' | 'critical'
}
```

## State Management Patterns

### Server State (React Query)
- Contract data fetching and caching
- Automatic background refetching
- Optimistic updates for mutations
- Error boundary integration

### Client State (React useState/Zustand)
- UI state (filters, selections, modal states)
- Form state (React Hook Form)
- Local preferences and settings

### Data Services Layer
- **contractService**: Contract CRUD operations
- **ratabilityService**: Ratability score calculations
- **riskScoringService**: Risk assessment logic
- **comparisonService**: Contract comparison utilities
- **scenarioModelingService**: What-if analysis engine

## Key User Workflows

### Primary Workflow: Contract Monitoring
1. User lands on dashboard
2. Reviews metric cards for quick overview
3. Uses search/filters to find specific contracts
4. Clicks on contract of interest
5. Reviews overview tab for general health
6. Navigates to specific tabs based on needs:
   - Benchmarking for performance comparison
   - Intervals for delivery tracking
   - Scenarios for risk modeling
   - Details for comprehensive analysis

### Secondary Workflow: Bulk Operations
1. User selects multiple contracts on dashboard
2. Bulk actions bar appears
3. User chooses action (export, compare, delete)
4. For comparison: navigates to comparison page
5. Reviews side-by-side analysis
6. Exports reports as needed

### Tertiary Workflow: Risk Management
1. System calculates risk scores automatically
2. High-risk contracts prioritized in dashboard
3. User clicks on at-risk contracts
4. Reviews risk indicators in detail view
5. Uses scenario analysis to model risk mitigation
6. Adjusts targets in interval tracking

## Business Logic & Calculations

### Risk Scoring
- Multi-factor risk assessment algorithm
- Considers volume fulfillment, time remaining, market conditions
- Automated alerts for high-risk contracts
- Configurable risk thresholds

### Ratability Scoring
- Proprietary scoring system for contract performance
- Customizable per contract or globally
- Factors in volume, price, timing performance

### Performance Metrics
- Real-time volume fulfillment calculations
- Financial impact tracking with P&L
- Automated progress monitoring
- Predictive analytics for contract completion

### Interval Management
- Flexible interval configurations
- Target adjustment capabilities
- Pacing analysis and recommendations
- Forecast modeling

This documentation provides Claude Code with the essential workflow understanding needed to rebuild the application with your company's design system while preserving all core functionality and user experience patterns.