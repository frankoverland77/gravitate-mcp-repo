import { useState, useMemo } from 'react'
import { Texto, Horizontal } from '@gravitate-js/excalibrr'
import { Input, Select, InputNumber } from 'antd'
import { SearchOutlined } from '@ant-design/icons'
import type {
  ManagedBenchmark,
  SelectedBenchmark,
  BenchmarkType,
} from '../../types/scenario.types'
import styles from './ExistingBenchmarkSelector.module.css'

const MANAGED_BENCHMARKS: ManagedBenchmark[] = [
  {
    id: 'mb-1',
    name: 'Houston Rack Low',
    publisher: 'opis',
    benchmarkType: 'rack-low',
    productHierarchy: 'target-index',
    locationHierarchy: 'city',
    description: 'OPIS rack low pricing at city level with target index matching',
  },
  {
    id: 'mb-2',
    name: 'Gulf Coast Rack Average',
    publisher: 'opis',
    benchmarkType: 'rack-average',
    productHierarchy: 'product-grade',
    locationHierarchy: 'state',
    description: 'OPIS rack average by product grade across state regions',
  },
  {
    id: 'mb-3',
    name: 'PADD 3 Spot Price',
    publisher: 'platts',
    benchmarkType: 'spot',
    productHierarchy: 'product-family',
    locationHierarchy: 'padd',
    description: 'Platts spot pricing at PADD district level',
  },
  {
    id: 'mb-4',
    name: 'National Rack Low',
    publisher: 'argus',
    benchmarkType: 'rack-low',
    productHierarchy: 'target-index',
    locationHierarchy: 'national',
    description: 'Argus national rack low with target index matching',
  },
  {
    id: 'mb-5',
    name: 'Southeast Contract Low',
    publisher: 'opis',
    benchmarkType: 'contract-low',
    productHierarchy: 'product-grade',
    locationHierarchy: 'state',
    description: 'OPIS contract low pricing for southeast state regions',
  },
  {
    id: 'mb-6',
    name: 'Midwest Rack Average',
    publisher: 'platts',
    benchmarkType: 'rack-average',
    productHierarchy: 'product-family',
    locationHierarchy: 'padd',
    description: 'Platts rack average at PADD district level for midwest',
  },
]

const PUBLISHER_BADGE_CLASS: Record<string, string> = {
  opis: styles.publisherOpis,
  platts: styles.publisherPlatts,
  argus: styles.publisherArgus,
}

const HIERARCHY_LABELS: Record<string, string> = {
  'target-index': 'Target Index',
  'product-grade': 'Product Grade',
  'product-family': 'Product Family',
  any: 'Any Match',
  city: 'OPIS City',
  state: 'State/Region',
  padd: 'PADD District',
  national: 'National',
}

const TYPE_LABELS: Record<string, string> = {
  'rack-low': 'Rack Low',
  'rack-average': 'Rack Average',
  'contract-low': 'Contract Low',
  spot: 'Spot Price',
}

interface ExistingBenchmarkSelectorProps {
  selectedBenchmark: SelectedBenchmark | undefined
  onBenchmarkChange: (benchmark: SelectedBenchmark | undefined) => void
  diffSign: '+' | '-'
  diffAmount: number | null
  onDiffSignChange: (sign: '+' | '-') => void
  onDiffAmountChange: (amount: number | null) => void
  onCardSelect?: (type: BenchmarkType, title: string) => void
}

export function ExistingBenchmarkSelector({
  selectedBenchmark,
  onBenchmarkChange,
  diffSign,
  diffAmount,
  onDiffSignChange,
  onDiffAmountChange,
  onCardSelect,
}: ExistingBenchmarkSelectorProps) {
  const [searchText, setSearchText] = useState('')
  const [selectedManagedId, setSelectedManagedId] = useState<string | undefined>(undefined)

  const filteredBenchmarks = useMemo(() => {
    if (!searchText.trim()) return MANAGED_BENCHMARKS
    const q = searchText.toLowerCase()
    return MANAGED_BENCHMARKS.filter(
      (b) =>
        b.name.toLowerCase().includes(q) ||
        b.publisher.toLowerCase().includes(q) ||
        b.description.toLowerCase().includes(q),
    )
  }, [searchText])

  const selectedManaged = useMemo(
    () => MANAGED_BENCHMARKS.find((b) => b.id === selectedManagedId),
    [selectedManagedId],
  )

  const handleSelectManaged = (benchmark: ManagedBenchmark) => {
    setSelectedManagedId(benchmark.id)

    const constructed: SelectedBenchmark = {
      type: 'quick',
      quickType: benchmark.benchmarkType === 'rack-average'
        ? 'rack-average'
        : benchmark.benchmarkType === 'rack-low'
          ? 'rack-low'
          : benchmark.benchmarkType === 'spot'
            ? 'spot-price'
            : 'rack-low',
      publisher: benchmark.publisher,
      benchmarkType: benchmark.benchmarkType,
      productHierarchy: benchmark.productHierarchy,
      locationHierarchy: benchmark.locationHierarchy,
    }

    onBenchmarkChange(constructed)
    onCardSelect?.('rack-low', benchmark.name)
  }

  return (
    <div className={styles.container}>
      {/* Column 1 — Managed benchmark list */}
      <div className={styles.leftPanel}>
        <Input
          placeholder="Search benchmarks..."
          prefix={<SearchOutlined style={{ color: '#bfbfbf' }} />}
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          allowClear
          className={styles.searchInput}
        />
        <div className={styles.benchmarkList}>
          {filteredBenchmarks.map((b) => (
            <div
              key={b.id}
              className={`${styles.benchmarkCard} ${selectedManagedId === b.id ? styles.benchmarkCardSelected : ''}`}
              onClick={() => handleSelectManaged(b)}
            >
              <Horizontal alignItems="center" style={{ gap: '8px' }}>
                <span className={`${styles.publisherBadge} ${PUBLISHER_BADGE_CLASS[b.publisher] || ''}`}>
                  {b.publisher}
                </span>
                <Texto weight={selectedManagedId === b.id ? '600' : '400'} category="p2">
                  {b.name}
                </Texto>
              </Horizontal>
            </div>
          ))}
          {filteredBenchmarks.length === 0 && (
            <Texto appearance="medium" style={{ textAlign: 'center', padding: '24px 0' }}>
              No benchmarks match your search
            </Texto>
          )}
        </div>
      </div>

      {selectedManaged ? (
        <>
          {/* Column 2 — Read-only config + summary */}
          <div className={styles.centerPanel}>
            <div className={styles.configSummary}>
              <Texto category='h5' weight='600' style={{ marginBottom: '16px' }}>
                Benchmark Configuration
              </Texto>

              <div className={styles.configRow}>
                <Texto category="p2" appearance="medium">
                  Publisher
                </Texto>
                <Texto category="p1" weight="600">
                  {selectedManaged.publisher.toUpperCase()}
                </Texto>
              </div>
              <div className={styles.configRow}>
                <Texto category="p2" appearance="medium">
                  Benchmark Type
                </Texto>
                <Texto category="p1" weight="600">
                  {TYPE_LABELS[selectedManaged.benchmarkType] || selectedManaged.benchmarkType}
                </Texto>
              </div>
              <div className={styles.configRow}>
                <Texto category="p2" appearance="medium">
                  Product Hierarchy
                </Texto>
                <Texto category="p1" weight="600">
                  {HIERARCHY_LABELS[selectedManaged.productHierarchy] || selectedManaged.productHierarchy}
                </Texto>
              </div>
              {/* Differential — the only editable field */}
              <div style={{ marginTop: '16px', paddingTop: '12px' }}>
                <Texto category="p2" appearance="medium" style={{ marginBottom: '4px', display: 'block' }}>
                  Differential (Optional)
                </Texto>
                <Horizontal alignItems="center" style={{ gap: '8px' }}>
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
                    placeholder="0.00"
                    value={diffAmount}
                    onChange={(val) => onDiffAmountChange(val)}
                    prefix="$"
                    style={{ width: '100px' }}
                    precision={2}
                    min={0}
                  />
                  <Texto category="p2" appearance="medium">
                    /gal
                  </Texto>
                </Horizontal>
              </div>
            </div>

          </div>
        </>
      ) : (
        <div className={styles.emptyState}>
          <Texto appearance="medium" style={{ textAlign: 'center' }}>
            Select a managed benchmark
          </Texto>
          <Texto category="p2" appearance="medium" style={{ textAlign: 'center', marginTop: '8px' }}>
            Choose from the pre-configured benchmarks on the left
          </Texto>
        </div>
      )}
    </div>
  )
}
