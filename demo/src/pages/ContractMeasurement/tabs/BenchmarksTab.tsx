import React from 'react';
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
