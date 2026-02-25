import { Texto, Horizontal, Vertical } from '@gravitate-js/excalibrr'
import { Select, InputNumber } from 'antd'
import type {
  BenchmarkPublisher,
  ProductHierarchy,
  LocationHierarchy,
  SelectedBenchmark,
} from '../../types/scenario.types'
import { PUBLISHER_OPTIONS, PRODUCT_HIERARCHY_OPTIONS, LOCATION_HIERARCHY_OPTIONS } from '../../types/scenario.types'
import styles from './BenchmarkSelector.module.css'

interface BenchmarkSelectorProps {
  selectedBenchmark: SelectedBenchmark | undefined
  onBenchmarkChange: (benchmark: SelectedBenchmark | undefined) => void
  diffSign: '+' | '-'
  diffAmount: number | null
  onDiffSignChange: (sign: '+' | '-') => void
  onDiffAmountChange: (amount: number | null) => void
}

export function BenchmarkSelector({
  selectedBenchmark,
  onBenchmarkChange,
  diffSign,
  diffAmount,
  onDiffSignChange,
  onDiffAmountChange,
}: BenchmarkSelectorProps) {
  const handleFieldChange = (field: keyof SelectedBenchmark, value: BenchmarkPublisher | ProductHierarchy | LocationHierarchy) => {
    onBenchmarkChange({
      ...selectedBenchmark,
      [field]: value,
    })
  }

  return (
    <div className={styles.centerPanel}>
      <div className={styles.configForm}>
        <Texto
          style={{
            fontSize: '12px',
            fontWeight: 700,
            marginBottom: '16px',
            display: 'block',
            textTransform: 'uppercase',
            letterSpacing: '1px',
            color: '#595959',
          }}
        >
          Configuration
        </Texto>

        <Vertical style={{ gap: '12px' }}>
          {/* Publisher */}
          <div>
            <Texto category='p2' appearance='medium' style={{ marginBottom: '4px', display: 'block' }}>
              Publisher *
            </Texto>
            <Select
              placeholder='Select publisher...'
              value={selectedBenchmark?.publisher}
              onChange={(val) => handleFieldChange('publisher', val)}
              options={PUBLISHER_OPTIONS}
              style={{ width: '100%' }}
              getPopupContainer={(trigger) => trigger.parentElement || document.body}
            />
          </div>

          {/* Product Hierarchy */}
          <div>
            <Texto category='p2' appearance='medium' style={{ marginBottom: '4px', display: 'block' }}>
              Product Hierarchy *
            </Texto>
            <Select
              placeholder='Select product hierarchy...'
              value={selectedBenchmark?.productHierarchy}
              onChange={(val) => handleFieldChange('productHierarchy', val)}
              options={PRODUCT_HIERARCHY_OPTIONS}
              style={{ width: '100%' }}
              getPopupContainer={(trigger) => trigger.parentElement || document.body}
            />
          </div>

          {/* Location Hierarchy */}
          <div>
            <Texto category='p2' appearance='medium' style={{ marginBottom: '4px', display: 'block' }}>
              Location Hierarchy *
            </Texto>
            <Select
              placeholder='Select location hierarchy...'
              value={selectedBenchmark?.locationHierarchy}
              onChange={(val) => handleFieldChange('locationHierarchy', val)}
              options={LOCATION_HIERARCHY_OPTIONS}
              style={{ width: '100%' }}
              getPopupContainer={(trigger) => trigger.parentElement || document.body}
            />
          </div>

          {/* Differential (Optional) */}
          <div style={{ marginTop: '8px' }}>
            <Texto category='p2' appearance='medium' style={{ marginBottom: '4px', display: 'block' }}>
              Differential (Optional)
            </Texto>
            <Horizontal alignItems='center' style={{ gap: '8px' }}>
              <Select
                value={diffSign}
                onChange={(val) => onDiffSignChange(val as '+' | '-')}
                options={[
                  { value: '+', label: '+' },
                  { value: '-', label: '-' },
                ]}
                style={{ width: '60px' }}
                getPopupContainer={(trigger) => trigger.parentElement || document.body}
              />
              <InputNumber
                placeholder='0.00'
                value={diffAmount}
                onChange={(val) => onDiffAmountChange(val)}
                prefix='$'
                style={{ width: '100px' }}
                precision={2}
                min={0}
              />
              <Texto category='p2' appearance='medium'>
                /gal
              </Texto>
            </Horizontal>
          </div>
        </Vertical>
      </div>
    </div>
  )
}
