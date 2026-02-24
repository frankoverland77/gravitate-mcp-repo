import { useState, useEffect } from 'react'
import { Texto, GraviButton, Horizontal, Vertical } from '@gravitate-js/excalibrr'
import { Select, InputNumber } from 'antd'
import type {
  BenchmarkType,
  BenchmarkPublisher,
  BenchmarkTypeOption,
  ProductHierarchy,
  LocationHierarchy,
  SelectedBenchmark,
} from '../../types/scenario.types'
import {
  PUBLISHER_OPTIONS,
  BENCHMARK_TYPE_OPTIONS,
  PRODUCT_HIERARCHY_OPTIONS,
  LOCATION_HIERARCHY_OPTIONS,
} from '../../types/scenario.types'
import { BenchmarkSelectionCards } from './QuickSelectionCards'
import styles from './BenchmarkSelector.module.css'

interface BenchmarkSelectorProps {
  selectedBenchmark: SelectedBenchmark | undefined
  onBenchmarkChange: (benchmark: SelectedBenchmark | undefined) => void
  diffSign: '+' | '-'
  diffAmount: number | null
  onDiffSignChange: (sign: '+' | '-') => void
  onDiffAmountChange: (amount: number | null) => void
  onCardSelect?: (type: BenchmarkType, title: string) => void
}

export function BenchmarkSelector({
  selectedBenchmark,
  onBenchmarkChange,
  diffSign,
  diffAmount,
  onDiffSignChange,
  onDiffAmountChange,
  onCardSelect,
}: BenchmarkSelectorProps) {
  // Track which benchmark type card is selected
  const [selectedType, setSelectedType] = useState<BenchmarkType | undefined>(undefined)

  // Configuration form state
  const [publisher, setPublisher] = useState<BenchmarkPublisher | undefined>(undefined)
  const [benchmarkTypeOption, setBenchmarkTypeOption] = useState<BenchmarkTypeOption | undefined>(undefined)
  const [productHierarchy, setProductHierarchy] = useState<ProductHierarchy | undefined>(undefined)
  const [locationHierarchy, setLocationHierarchy] = useState<LocationHierarchy | undefined>(undefined)

  // Sync state from selectedBenchmark prop (for edit mode)
  useEffect(() => {
    if (selectedBenchmark) {
      // Determine the type from the selected benchmark
      if (selectedBenchmark.type === 'custom') {
        setSelectedType('custom')
      } else if (selectedBenchmark.quickType) {
        setSelectedType(selectedBenchmark.quickType)
      }
      setPublisher(selectedBenchmark.publisher)
      setBenchmarkTypeOption(selectedBenchmark.benchmarkType)
      setProductHierarchy(selectedBenchmark.productHierarchy)
      setLocationHierarchy(selectedBenchmark.locationHierarchy)
    } else {
      setSelectedType(undefined)
      setPublisher(undefined)
      setBenchmarkTypeOption(undefined)
      setProductHierarchy(undefined)
      setLocationHierarchy(undefined)
    }
  }, [selectedBenchmark])

  // Handle card selection
  const handleCardSelect = (type: BenchmarkType, title: string) => {
    setSelectedType(type)
    // Reset configuration when switching cards
    setPublisher(undefined)
    setBenchmarkTypeOption(undefined)
    setProductHierarchy(undefined)
    setLocationHierarchy(undefined)
    // Clear the parent's selected benchmark
    onBenchmarkChange(undefined)
    // Notify parent of card selection (for name pre-population)
    onCardSelect?.(type, title)
  }

  // Handle applying the configuration
  const handleApply = () => {
    if (!selectedType) return

    const isCustom = selectedType === 'custom'

    // For quick selections, the benchmark type is implicit from the card
    const implicitBenchmarkType: Record<string, BenchmarkTypeOption> = {
      'rack-average': 'rack-average',
      'rack-low': 'rack-low',
      'spot-price': 'spot',
      'opis-contract': 'contract-low',
    }

    const benchmark: SelectedBenchmark = {
      type: isCustom ? 'custom' : 'quick',
      quickType: isCustom ? undefined : (selectedType as 'rack-average' | 'rack-low' | 'spot-price' | 'opis-contract'),
      publisher,
      benchmarkType: isCustom ? benchmarkTypeOption : implicitBenchmarkType[selectedType],
      productHierarchy,
      locationHierarchy,
    }

    onBenchmarkChange(benchmark)
  }

  // Check if we can apply
  const isCustom = selectedType === 'custom'
  const canApply =
    selectedType &&
    publisher &&
    productHierarchy &&
    locationHierarchy &&
    (!isCustom || benchmarkTypeOption)

  return (
    <div className={styles.container}>
      {/* Column 1 - Benchmark Cards */}
      <div className={styles.leftPanel}>
        <BenchmarkSelectionCards selectedType={selectedType} onSelect={handleCardSelect} />
      </div>

      {selectedType ? (
        <>
          {/* Column 2 - Configuration + Summary/Impact */}
          <div className={styles.centerPanel}>
            {/* Configuration Form */}
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
                {/* Benchmark Type - Only for Custom */}
                {isCustom && (
                  <div>
                    <Texto category="p2" appearance="medium" style={{ marginBottom: '4px', display: 'block' }}>
                      Benchmark Type *
                    </Texto>
                    <Select
                      placeholder="Select benchmark type..."
                      value={benchmarkTypeOption}
                      onChange={setBenchmarkTypeOption}
                      options={BENCHMARK_TYPE_OPTIONS}
                      style={{ width: '100%' }}
                      getPopupContainer={(trigger) => trigger.parentElement || document.body}
                    />
                  </div>
                )}

                {/* Publisher */}
                <div>
                  <Texto category="p2" appearance="medium" style={{ marginBottom: '4px', display: 'block' }}>
                    Publisher *
                  </Texto>
                  <Select
                    placeholder="Select publisher..."
                    value={publisher}
                    onChange={setPublisher}
                    options={PUBLISHER_OPTIONS}
                    style={{ width: '100%' }}
                    getPopupContainer={(trigger) => trigger.parentElement || document.body}
                  />
                </div>

                {/* Product Hierarchy */}
                <div>
                  <Texto category="p2" appearance="medium" style={{ marginBottom: '4px', display: 'block' }}>
                    Product Hierarchy *
                  </Texto>
                  <Select
                    placeholder="Select product hierarchy..."
                    value={productHierarchy}
                    onChange={setProductHierarchy}
                    options={PRODUCT_HIERARCHY_OPTIONS}
                    style={{ width: '100%' }}
                    getPopupContainer={(trigger) => trigger.parentElement || document.body}
                  />
                </div>

                {/* Location Hierarchy */}
                <div>
                  <Texto category="p2" appearance="medium" style={{ marginBottom: '4px', display: 'block' }}>
                    Location Hierarchy *
                  </Texto>
                  <Select
                    placeholder="Select location hierarchy..."
                    value={locationHierarchy}
                    onChange={setLocationHierarchy}
                    options={LOCATION_HIERARCHY_OPTIONS}
                    style={{ width: '100%' }}
                    getPopupContainer={(trigger) => trigger.parentElement || document.body}
                  />
                </div>

                {/* Differential (Optional) */}
                <div style={{ marginTop: '8px' }}>
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

                {/* Apply Button */}
                <GraviButton
                  buttonText={selectedBenchmark ? 'Update Selection' : 'Apply Selection'}
                  success
                  disabled={!canApply}
                  onClick={handleApply}
                  style={{ marginTop: '8px', alignSelf: 'flex-start' }}
                />
              </Vertical>
            </div>

          </div>
        </>
      ) : (
        <div className={styles.emptyState}>
          <Texto appearance="medium" style={{ textAlign: 'center' }}>
            Select a benchmark type to configure
          </Texto>
          <Texto category="p2" appearance="medium" style={{ textAlign: 'center', marginTop: '8px' }}>
            Choose from the options on the left to get started
          </Texto>
        </div>
      )}
    </div>
  )
}
