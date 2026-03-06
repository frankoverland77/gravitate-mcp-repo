import { Texto, Horizontal, Vertical } from '@gravitate-js/excalibrr'
import { BarChartOutlined, LineChartOutlined, StockOutlined, FileTextOutlined } from '@ant-design/icons'
import type { QuickBenchmarkType } from '../../types/scenario.types'
import styles from './BenchmarkSelector.module.css'

interface BenchmarkOptionConfig {
  type: QuickBenchmarkType
  title: string
  description: string
  icon: React.ReactNode
}

export const BENCHMARK_OPTIONS: BenchmarkOptionConfig[] = [
  {
    type: 'rack-low',
    title: 'Rack Low',
    description: 'Compare to lowest terminal price available',
    icon: <LineChartOutlined className={styles.optionIcon} />,
  },
  {
    type: 'rack-average',
    title: 'Rack Average',
    description: 'Compare to average terminal price across all suppliers',
    icon: <BarChartOutlined className={styles.optionIcon} />,
  },
  {
    type: 'spot-price',
    title: 'Spot',
    description: 'Compare to current market spot price',
    icon: <StockOutlined className={styles.optionIcon} />,
  },
  {
    type: 'opis-contract',
    title: 'OPIS Contract',
    description: 'Compare to OPIS contract pricing',
    icon: <FileTextOutlined className={styles.optionIcon} />,
  },
]

interface ReferenceLegendCardsProps {
  selectedType?: QuickBenchmarkType
  onTypeSelect?: (type: QuickBenchmarkType, title: string) => void
}

export function ReferenceLegendCards({ selectedType, onTypeSelect }: ReferenceLegendCardsProps) {
  return (
    <div>
      <Texto
        category='p2'
        appearance='medium'
        weight='600'
        style={{ textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '12px', display: 'block' }}
      >
        Common Benchmarks
      </Texto>
      <Vertical style={{ gap: '10px' }}>
        {BENCHMARK_OPTIONS.map((option) => (
          <div
            key={option.type}
            className={[
              styles.optionCard,
              onTypeSelect ? styles.optionCardClickable : '',
              selectedType === option.type ? styles.optionCardSelected : '',
            ]
              .filter(Boolean)
              .join(' ')}
            onClick={() => onTypeSelect?.(option.type, option.title)}
          >
            <Horizontal alignItems='flex-start' style={{ gap: '12px' }}>
              {option.icon}
              <Vertical style={{ gap: '4px', flex: 1 }}>
                <Texto weight='600'>{option.title}</Texto>
                <Texto category='p2' appearance='medium' className={styles.optionDescription}>
                  {option.description}
                </Texto>
              </Vertical>
            </Horizontal>
          </div>
        ))}
      </Vertical>
    </div>
  )
}
