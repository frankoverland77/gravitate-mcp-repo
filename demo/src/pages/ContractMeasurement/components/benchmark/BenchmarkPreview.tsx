import { useMemo } from 'react';
import { Texto, Vertical } from '@gravitate-js/excalibrr';
import type { SelectedBenchmark } from '../../types/scenario.types';
import {
  getBenchmarkDisplayName,
  calculateMatchingInfo,
  calculateImpactEstimate,
  getProductMatchDetails,
} from './benchmark.utils';
import { MatchingSummaryCard } from './MatchingSummaryCard';
import { EstimatedImpactCard } from './EstimatedImpactCard';
import { ProductBreakdownPanel } from './ProductBreakdownPanel';
import styles from './BenchmarkPreview.module.css';

interface BenchmarkPreviewProps {
  selectedBenchmark: SelectedBenchmark | undefined;
}

function EmptyState() {
  return (
    <div className={styles.emptyState}>
      <Texto appearance="medium" className={styles.emptyStateTitle}>
        Select a benchmark to see preview
      </Texto>
      <Texto category="p2" appearance="medium">
        Choose from quick selections or configure a custom benchmark
      </Texto>
    </div>
  );
}

export function BenchmarkPreview({ selectedBenchmark }: BenchmarkPreviewProps) {
  const displayName = useMemo(
    () => getBenchmarkDisplayName(selectedBenchmark),
    [selectedBenchmark]
  );
  const matchingInfo = useMemo(() => calculateMatchingInfo(selectedBenchmark), [selectedBenchmark]);
  const impactEstimate = useMemo(
    () => calculateImpactEstimate(selectedBenchmark),
    [selectedBenchmark]
  );
  const productDetails = useMemo(
    () => getProductMatchDetails(selectedBenchmark),
    [selectedBenchmark]
  );

  if (!selectedBenchmark) {
    return <EmptyState />;
  }

  return (
    <Vertical gap="16px">
      <Texto category="p2" appearance="medium" weight="600" className={styles.sectionLabel}>
        BENCHMARK PREVIEW
      </Texto>

      <div className={styles.selectedBenchmark}>
        <Texto weight="600" className={styles.selectedBenchmarkText}>
          {displayName}
        </Texto>
      </div>

      <MatchingSummaryCard
        matchedCount={matchingInfo.matchedCount}
        rollupCount={matchingInfo.rollupCount}
        totalProducts={matchingInfo.totalProducts}
        matchPercentage={matchingInfo.matchPercentage}
      />

      <EstimatedImpactCard impactEstimate={impactEstimate} />

      <ProductBreakdownPanel productDetails={productDetails} />
    </Vertical>
  );
}
