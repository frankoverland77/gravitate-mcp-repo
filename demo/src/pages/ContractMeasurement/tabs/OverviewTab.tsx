import {
  PerformanceOverviewSection,
  ContractDetailsSection,
  QuickInsightsSection,
  ContractAnalyticsSection,
} from '../sections';

export function OverviewTab() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <PerformanceOverviewSection />
      <ContractDetailsSection />
      <QuickInsightsSection />
      <ContractAnalyticsSection />
    </div>
  );
}
