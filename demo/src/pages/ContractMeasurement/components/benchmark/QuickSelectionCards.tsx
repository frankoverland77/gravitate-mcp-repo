import { Texto, Horizontal, Vertical } from '@gravitate-js/excalibrr'
import {
  BarChartOutlined,
  LineChartOutlined,
  StockOutlined,
  FileTextOutlined,
  SettingOutlined,
} from '@ant-design/icons'
import type { BenchmarkType } from '../../types/scenario.types'
import styles from './BenchmarkSelector.module.css'

interface BenchmarkOptionConfig {
  type: BenchmarkType
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
  {
    type: 'custom',
    title: 'Custom',
    description: 'Configure a custom benchmark with specific publisher and type',
    icon: <SettingOutlined className={styles.optionIcon} />,
  },
]

interface BenchmarkSelectionCardsProps {
  selectedType: BenchmarkType | undefined
  onSelect: (type: BenchmarkType, title: string) => void
}

export function BenchmarkSelectionCards({ selectedType, onSelect }: BenchmarkSelectionCardsProps) {
  const getCardClassName = (type: BenchmarkType) => {
    const base = styles.optionCard
    const isSelected = selectedType === type
    if (isSelected) return `${base} ${styles.optionCardSelected}`
    return base
  }

  return (
    <Vertical style={{ gap: '12px' }}>
      {BENCHMARK_OPTIONS.map((option) => (
        <div
          key={option.type}
          className={getCardClassName(option.type)}
          onClick={() => onSelect(option.type, option.title)}
          style={{ cursor: 'pointer' }}
        >
          <Horizontal alignItems="flex-start" style={{ gap: '12px' }}>
            <div className={selectedType === option.type ? styles.optionIconSelected : ''}>
              {option.icon}
            </div>
            <Vertical style={{ gap: '4px', flex: 1 }}>
              <Texto weight="600">{option.title}</Texto>
              <Texto category="p2" appearance="medium" className={styles.optionDescription}>
                {option.description}
              </Texto>
            </Vertical>
          </Horizontal>
        </div>
      ))}
    </Vertical>
  )
}
