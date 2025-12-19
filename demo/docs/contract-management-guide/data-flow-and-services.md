# PE Contract Measurement - Data Flow and Service Layer

## Service Architecture Overview

The application follows a layered architecture with distinct service modules handling different aspects of business logic. All services are located in `/src/services/` and follow consistent patterns for error handling and data transformation.

```
UI Components
     ↓
Service Layer
     ↓
Mock Data Layer (Production would connect to actual APIs)
```

## Core Services

### contractService.ts
**Purpose**: Contract data management and CRUD operations
**Key Methods**:
- `getAllContracts()`: Fetches all contracts with calculated metrics
- `getContractById(id: string)`: Retrieves single contract with full details
- `createContract(contract: Partial<Contract>)`: Creates new contract
- `updateContract(id: string, updates: Partial<Contract>)`: Updates existing contract
- `deleteContract(id: string)`: Removes contract

**Data Flow**:
1. UI components call service methods
2. Service fetches from mock data (getMockContractsWithMetrics)
3. Service calculates derived metrics (calculateContractMetrics)
4. Service applies business rules and validation
5. Returns normalized data to components

**Error Handling**: Uses `handleServiceError()` utility for consistent error processing

### ratabilityService.ts
**Purpose**: Ratability score calculation and management
**Key Features**:
- **Global Settings**: Default ratability calculation parameters
- **Contract-Specific Overrides**: Custom ratability settings per contract
- **Score Calculation**: Multi-factor ratability assessment
- **Settings Management**: CRUD operations for ratability configurations

**Calculation Factors**:
- Volume Performance Weight (default: 40%)
- Financial Performance Weight (default: 30%)
- Timeline Performance Weight (default: 20%)
- Risk Adjustment Weight (default: 10%)

**Key Methods**:
- `calculateRatabilityScore(contract: Contract): RatabilityScore`
- `getGlobalSettings(): RatabilitySettings`
- `updateGlobalSettings(settings: RatabilitySettings)`
- `getContractOverride(contractId: string): RatabilitySettings`
- `setContractOverride(contractId: string, settings: RatabilitySettings)`

### riskScoringService.ts
**Purpose**: Risk assessment and scoring algorithms
**Risk Calculation Framework**:
- **Volume Risk**: Based on fulfillment percentage and targets
- **Timeline Risk**: Days remaining vs. planned schedule
- **Financial Risk**: Market conditions and price volatility
- **Performance Risk**: Historical performance patterns

**Key Methods**:
- `calculateRiskScore(contract: Contract): RiskScore`
- `assessVolumeRisk(contract: Contract): number`
- `assessTimelineRisk(contract: Contract): number`
- `assessFinancialRisk(contract: Contract): number`
- `getAlertThresholds(): RiskAlertThresholds`

**Alert Thresholds**:
- At Risk: Score ≥ 70
- High Risk: Score ≥ 85
- Critical Risk: Score ≥ 95

### comparisonService.ts
**Purpose**: Contract comparison and analysis
**Comparison Types**:
- **Simple Comparison**: Basic metrics side-by-side
- **Advanced Comparison**: Detailed analysis with variance calculations
- **Benchmark Comparison**: Against industry standards or historical data
- **Performance Gap Analysis**: Identifies areas for improvement

**Key Methods**:
- `simpleCompareContracts(contracts: Contract[]): ComparisonData`
- `advancedCompareContracts(contracts: Contract[]): DetailedComparisonData`
- `generateComparisonReport(comparisonData: ComparisonData): ReportData`
- `identifyBestPractices(contracts: Contract[]): RecommendationData`

### scenarioModelingService.ts
**Purpose**: What-if analysis and scenario modeling
**Scenario Types**:
- **Price Adjustment Scenarios**: Impact of price changes
- **Volume Modification Scenarios**: Delivery schedule changes
- **Early Termination Scenarios**: Contract completion analysis
- **Market Condition Scenarios**: External factor impacts

**Key Methods**:
- `createScenario(baseContract: Contract, adjustments: ScenarioAdjustments): Scenario`
- `runScenarioAnalysis(scenario: Scenario): ScenarioResults`
- `compareScenarios(scenarios: Scenario[]): ScenarioComparison`
- `saveScenario(scenario: Scenario): void`
- `loadSavedScenarios(contractId: string): Scenario[]`

## Data Flow Patterns

### Dashboard Data Flow
```
1. DashboardPage loads
2. ContractDashboard component mounts
3. useEffect triggers data loading
4. contractService.getAllContracts() called
5. Service returns contracts with basic metrics
6. ratabilityService.calculateRatabilityScore() called for each contract
7. riskScoringService.calculateRiskScore() called for each contract
8. State updated with enhanced contract data
9. UI renders with complete data set
```

### Contract Detail Data Flow
```
1. ContractDetailPage loads with contract ID
2. contractService.getContractById(id) called
3. Service returns detailed contract data
4. Tab-specific data loading:
   - Benchmarking: Load comparison data
   - Intervals: Load interval history and projections
   - Scenarios: Load saved scenarios
   - Details: Load audit trail and historical data
5. Real-time calculations for current tab
6. UI updates with tab-specific content
```

### Filtering and Search Data Flow
```
1. User inputs search term or adjusts filters
2. Local state updated (no API call)
3. useMemo recalculates filtered results
4. DataTable re-renders with filtered data
5. Filter panel shows active filter count
6. URL parameters updated for deep linking
```

## State Management Patterns

### Server State (React Query)
**Query Keys**: Hierarchical structure for cache management
```typescript
['contracts'] // All contracts
['contracts', contractId] // Specific contract
['contracts', contractId, 'benchmarks'] // Contract benchmarks
['scenarios', contractId] // Contract scenarios
```

**Cache Strategies**:
- **Contracts List**: Cache for 5 minutes, background refresh
- **Contract Details**: Cache for 2 minutes, stale-while-revalidate
- **Scenarios**: Cache indefinitely, manual invalidation
- **Settings**: Cache for 30 minutes, optimistic updates

**Mutation Patterns**:
- **Optimistic Updates**: UI updates immediately, rollback on error
- **Background Refetch**: Related queries refresh after mutations
- **Error Boundaries**: Graceful handling of failed mutations

### Client State Management
**Local Component State** (useState):
- UI-only state (modal open/closed, selected items)
- Form state before submission
- Temporary calculations and previews

**Global Client State** (Zustand):
- User preferences and settings
- Application theme and layout preferences
- Cached calculations for expensive operations

## Business Logic Implementation

### Risk Assessment Algorithm
```typescript
calculateRiskScore(contract: Contract): RiskScore {
  const volumeRisk = assessVolumeRisk(contract);
  const timelineRisk = assessTimelineRisk(contract);
  const financialRisk = assessFinancialRisk(contract);
  const performanceRisk = assessPerformanceRisk(contract);

  const totalScore = (
    volumeRisk * VOLUME_WEIGHT +
    timelineRisk * TIMELINE_WEIGHT +
    financialRisk * FINANCIAL_WEIGHT +
    performanceRisk * PERFORMANCE_WEIGHT
  );

  return {
    totalScore,
    components: { volumeRisk, timelineRisk, financialRisk, performanceRisk },
    alertLevel: determineAlertLevel(totalScore),
    recommendations: generateRecommendations(contract, totalScore)
  };
}
```

### Ratability Calculation
```typescript
calculateRatabilityScore(contract: Contract): RatabilityScore {
  const settings = getEffectiveSettings(contract);

  const volumeScore = (contract.currentVolume / contract.totalVolume) * 100;
  const timelineScore = calculateTimelinePerformance(contract);
  const financialScore = calculateFinancialPerformance(contract);
  const riskAdjustment = calculateRiskAdjustment(contract);

  const weightedScore = (
    volumeScore * settings.volumeWeight +
    timelineScore * settings.timelineWeight +
    financialScore * settings.financialWeight -
    riskAdjustment * settings.riskAdjustmentWeight
  );

  return {
    score: Math.max(0, Math.min(100, weightedScore)),
    components: { volumeScore, timelineScore, financialScore, riskAdjustment },
    settings: settings
  };
}
```

### Interval Management Logic
```typescript
calculateIntervalMetrics(contract: Contract, intervalType: IntervalType) {
  const intervals = generateIntervals(contract.startDate, contract.endDate, intervalType);
  const currentInterval = getCurrentInterval(intervals);
  const completedIntervals = getCompletedIntervals(intervals);

  return {
    totalIntervals: intervals.length,
    completedIntervals: completedIntervals.length,
    currentInterval: currentInterval,
    paceStatus: calculatePaceStatus(contract, currentInterval),
    forecastCompletion: predictCompletion(contract, intervals)
  };
}
```

## Data Transformation Patterns

### Contract Enhancement Pipeline
```typescript
// Raw contract from data source
const rawContract = await fetchContract(id);

// Add calculated metrics
const withMetrics = calculateContractMetrics(rawContract);

// Add ratability score
const withRatability = {
  ...withMetrics,
  ratabilityScore: ratabilityService.calculateRatabilityScore(withMetrics)
};

// Add risk score
const fullyEnhanced = {
  ...withRatability,
  riskScore: riskScoringService.calculateRiskScore(withRatability)
};

return fullyEnhanced;
```

### Data Normalization
**Date Handling**: All dates normalized to UTC, formatted consistently
**Number Formatting**: Consistent decimal places, currency formatting
**Status Normalization**: Standardized status values across all entities
**Unit Conversion**: Automatic unit conversion for display purposes

## Error Handling Strategies

### Service Layer Error Handling
```typescript
export const handleServiceError = (error: unknown) => {
  if (error instanceof NetworkError) {
    return { type: 'network', message: 'Connection failed', statusCode: 0 };
  }
  if (error instanceof TimeoutError) {
    return { type: 'timeout', message: 'Request timed out', statusCode: 408 };
  }
  if (error instanceof ValidationError) {
    return { type: 'validation', message: error.message, statusCode: 400 };
  }
  return { type: 'generic', message: 'An unexpected error occurred', statusCode: 500 };
};
```

### Component Error Recovery
- **Retry Mechanisms**: Automatic retry with exponential backoff
- **Fallback Data**: Default values when primary data fails
- **Error Boundaries**: Prevent full application crashes
- **User Feedback**: Clear error messages with actionable steps

## Performance Optimization

### Data Loading Strategies
**Critical Path Loading**: Essential data loads first
**Lazy Loading**: Secondary data loads on demand
**Prefetching**: Predict and load likely needed data
**Background Refresh**: Update cached data without blocking UI

### Calculation Optimization
**Memoization**: Cache expensive calculations
**Debouncing**: Limit frequency of real-time calculations
**Web Workers**: Offload heavy computations (prepared for future use)
**Incremental Updates**: Update only changed portions of large datasets

This comprehensive service layer documentation ensures Claude Code understands the business logic, data flows, and calculation patterns needed to rebuild the application functionality accurately.