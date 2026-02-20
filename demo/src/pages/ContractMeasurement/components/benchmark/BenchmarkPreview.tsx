import { Texto } from '@gravitate-js/excalibrr'
import type { SelectedBenchmark } from '../../types/scenario.types'
import { getBenchmarkDisplayName } from './benchmark.utils'
import styles from './BenchmarkPreview.module.css'

interface BenchmarkPreviewProps {
  selectedBenchmark: SelectedBenchmark | undefined
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
  )
}

export function BenchmarkPreview({ selectedBenchmark }: BenchmarkPreviewProps) {
  if (!selectedBenchmark) {
    return <EmptyState />
  }

  return (
    <div className={styles.selectedBenchmark}>
      <Texto weight="600" className={styles.selectedBenchmarkText}>
        {getBenchmarkDisplayName(selectedBenchmark)}
      </Texto>
    </div>
  )
}
