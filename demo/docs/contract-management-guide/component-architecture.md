# PE Contract Measurement - Component Architecture

## Component Hierarchy Overview

```
App.tsx
├── ThemeProvider
├── QueryClientProvider
├── BrowserRouter
├── TopNavigation
├── FloatingSidebar
└── Routes
    ├── DashboardPage
    │   └── ContractDashboard
    ├── ContractDetailPage
    │   └── ContractDetailView
    └── ContractComparison
```

## Core Layout Components

### App.tsx
**Purpose**: Root application component with providers
**Key Responsibilities**:
- Provider setup (Theme, Query, Router, Sidebar, Tooltip)
- Route configuration and navigation
- Global layout structure with sidebar and main content area
- Error boundary setup with Toaster components

**Important Patterns**:
- Uses padding-left for sidebar offset (`pl-[118px]`)
- Main content area uses flexbox with `flex-1` and scroll behavior
- Tabindex management for accessibility

### TopNavigation
**Purpose**: Fixed header navigation with tab switching
**Key Features**:
- Tab-based navigation (currently just "Contract Measurement")
- Extensible for additional top-level sections
- Fixed positioning with z-index management
- Responsive design considerations

### FloatingSidebar
**Purpose**: Collapsible left navigation
**Key Features**:
- Floating/overlay behavior when expanded
- Compact collapsed state
- Animation transitions
- Navigation menu items with icons

## Page-Level Components

### DashboardPage
**Purpose**: Container for main dashboard
**Structure**: Simple wrapper that renders `ContractDashboard`
**Pattern**: Page components are thin wrappers for main feature components

### ContractDetailPage
**Purpose**: Contract detail container with nested routing
**Key Features**:
- Parameter extraction from URL (`useParams`)
- Nested route handling for different tabs
- Tab state synchronization with URL
- Suspense boundary for lazy loading
- Scroll restoration hooks

**Nested Routes**:
- Index route: Overview tab
- `/benchmark`: Benchmarking tab
- `/intervals`: Interval tracking tab
- `/scenario`: Scenario analysis tab
- `/details`: Details performance tab

## Feature Components

### ContractDashboard (Dashboard Main Component)
**Purpose**: Main dashboard interface
**Architecture**:
```
ContractDashboard
├── NavigationBreadcrumb
├── SectionHeader (with primary action)
├── AnimatedMetric Cards (4-grid layout)
├── Main Content Area
│   ├── Control Bar (Search + Filter toggle)
│   ├── BulkActionsBar (conditional)
│   └── DataTable or EmptyState
└── FilterPanel (right drawer)
└── RatabilitySettings (modal)
```

**State Management**:
- `useState` for local UI state (filters, selections, modal states)
- `useEffect` for data loading and keyboard shortcuts
- `useMemo` for computed values (filtered/sorted data)
- Custom hooks: `useLoadingDelay`, `useActiveFilterCount`

**Key Patterns**:
- Error boundary wrapping
- Loading state with delay to prevent flashing
- Optimistic UI updates
- Keyboard navigation support
- Bulk operations with confirmation

### ContractDetailView (Detail Main Component)
**Purpose**: Individual contract analysis interface
**Architecture**:
```
ContractDetailView
├── NavigationBreadcrumb
├── BackNavigation
├── Contract Header (summary info)
└── Tabs Component
    ├── Overview Tab
    │   ├── Contract Summary
    │   ├── Metric Cards
    │   ├── Performance Charts
    │   └── Mini Widgets
    ├── Benchmarking Tab
    │   └── BenchmarkManager
    ├── Interval Tracking Tab
    │   ├── PrimaryIntervalTile
    │   ├── IntervalOverviewStrip
    │   ├── PacingCalendar
    │   └── ForecastProjection
    ├── Scenario Analysis Tab
    │   └── FreshScenarioAnalysis
    └── Details Performance Tab
        └── DetailsPerformance
```

**State Synchronization**:
- URL-based tab state management
- `useEffect` to sync tab state with route changes
- Lazy loading of tab content with Suspense
- Error boundaries per tab section

### ContractComparison (Comparison Main Component)
**Purpose**: Multi-contract comparison interface
**Architecture**:
```
ContractComparison
├── Header (with back navigation)
├── Contract Selection Summary
├── AnimatedMetric Cards (comparative)
├── ComparisonMetricsTable
└── Export Actions
```

**Data Flow**:
- URL search params for contract selection
- Parallel contract loading with Promise.all
- Comparison service for data analysis
- Error handling for invalid selections

## Reusable UI Components

### System Components (Design System)
Located in `/components/ui/system/`:

**MetricCard / AnimatedMetric**:
- Standardized metric display
- Animation support (count-up, fade-in)
- Interactive states (hover, click)
- Trend indicators and icons
- Multiple sizes and emphasis levels

**DataTable**:
- Generic table component with advanced features
- Sortable columns with sort indicators
- Row selection with bulk operations
- Row actions (dropdown menus)
- Keyboard navigation
- Custom cell renderers
- Pagination and virtualization ready

**SectionHeader**:
- Standardized page/section headers
- Breadcrumb integration
- Primary action button
- Description text support
- Multiple hierarchy levels

**StatusBadge**:
- Consistent status visualization
- Multiple variants (default, warning, destructive)
- Icon support
- Accessibility labels

**EnhancedLoadingState / EnhancedEmptyState**:
- Polished loading and empty states
- Multiple variants for different contexts
- Action button integration
- Animation support

**InteractiveButton**:
- Enhanced button with micro-interactions
- Ripple effects and scale animations
- Multiple variants and sizes
- Icon support

### Specialized Feature Components

**FilterPanel**:
- Complex filtering interface
- Accordion-style organization
- Real-time filter application
- Filter state management
- Clear all functionality

**BulkActionsBar**:
- Conditional display based on selection
- Action validation (e.g., compare requires 2-4 items)
- Progress indication for bulk operations
- Selection summary and clear options

**NavigationBreadcrumb**:
- Hierarchical navigation display
- Current page indication
- Click navigation to parent levels
- Accessibility support

**BackNavigation**:
- Context-aware back navigation
- State preservation when navigating back
- Keyboard shortcut support

## Chart and Analytics Components

### Performance Charts
Located in `/components/analytics/`:

**VolumePerformanceChart**:
- Time-series volume data visualization
- Planned vs actual volume comparison
- Interactive tooltips and legends
- Responsive design

**FinancialTrendChart**:
- Financial performance over time
- Profit/loss indicators
- Trend line overlays
- Export capabilities

**ProductMixChart**:
- Product distribution visualization
- Interactive pie/donut charts
- Drill-down capabilities
- Legend and tooltips

**RiskIndicator**:
- Risk score visualization
- Gauge/meter style display
- Color-coded risk levels
- Threshold indicators

**MiniSparkline**:
- Compact trend visualization
- Inline metric displays
- Minimal chart design
- Performance optimized

### Benchmark Components
Located in `/components/benchmarks/`:

**BenchmarkManager**:
- Main benchmarking interface
- Benchmark selection and configuration
- Comparison analysis and visualization
- Export and reporting tools

**BenchmarkSelector**:
- Contract/benchmark selection interface
- Search and filter capabilities
- Multi-selection support

**BenchmarkComparisonTable**:
- Side-by-side comparison display
- Variance calculations
- Performance highlighting

### Interval Components
Located in `/components/intervals/`:

**PrimaryIntervalTile**:
- Main interval display
- Progress visualization
- Target adjustment interface

**IntervalOverviewStrip**:
- Horizontal timeline display
- Multiple interval visualization
- Quick navigation between intervals

**PacingCalendar**:
- Calendar-based pacing display
- Delivery schedule visualization
- Interactive date selection

**ForecastProjection**:
- Predictive analytics display
- Forecast accuracy indicators
- Scenario-based projections

### Scenario Analysis Components
Located in `/components/whatif/`:

**FreshScenarioAnalysis**:
- Main scenario modeling interface
- Variable adjustment controls
- Impact visualization
- Scenario comparison

**ScenarioComparison**:
- Multi-scenario analysis
- Performance comparison charts
- Risk assessment changes

**SavedScenariosList**:
- Scenario management interface
- Load/save scenario functionality
- Sharing and collaboration tools

## Component Design Patterns

### Composition Patterns
- **Container/Presenter**: Page components are containers, feature components are presenters
- **Compound Components**: Complex components broken into smaller, focused pieces
- **Render Props**: Used for flexible data visualization components
- **Higher-Order Components**: Used for common patterns like error boundaries

### State Management Patterns
- **Local State**: UI-only state managed with useState
- **Derived State**: Computed values using useMemo and useCallback
- **Server State**: API data managed with React Query
- **Form State**: Managed with React Hook Form
- **Global State**: Minimal global state with Zustand

### Error Handling Patterns
- **Error Boundaries**: Wrap major feature sections
- **Loading States**: Consistent loading UI across components
- **Empty States**: Meaningful empty state designs
- **Retry Mechanisms**: User-initiated retry for failed operations

### Performance Patterns
- **Code Splitting**: Lazy loading of heavy components
- **Memoization**: Strategic use of React.memo and useMemo
- **Virtualization**: For large data sets (prepared but not fully implemented)
- **Debouncing**: For search and filter inputs

### Accessibility Patterns
- **Keyboard Navigation**: Full keyboard support for interactive elements
- **Screen Reader Support**: Proper ARIA labels and live regions
- **Focus Management**: Logical focus flow and focus trapping in modals
- **Color Contrast**: Sufficient contrast ratios throughout

This component architecture provides Claude Code with a clear understanding of how to structure the rebuilt application using your company's design system while maintaining the same functionality and patterns.