import { useState, useEffect, useMemo } from 'react'
import { Texto, Horizontal, Vertical, GraviButton } from '@gravitate-js/excalibrr'
import { Drawer, Button, Input } from 'antd'
import type { SelectedBenchmark, Scenario } from '../types/scenario.types'
import { generateScenarioId } from '../types/scenario.types'
import { useFeatureMode } from '../../../contexts/FeatureModeContext'
import { BenchmarkSelector } from './benchmark'
import { ReferenceLegendCards } from './benchmark/QuickSelectionCards'
import { MatchingSummaryCard } from './benchmark/MatchingSummaryCard'
import { EstimatedImpactCard } from './benchmark/EstimatedImpactCard'
import { ProductBreakdownPanel } from './benchmark/ProductBreakdownPanel'
import { BenchmarkPreview } from './benchmark/BenchmarkPreview'
import {
  calculateMatchingInfo,
  calculateImpactEstimate,
  getProductMatchDetails,
} from './benchmark/benchmark.utils'

interface BenchmarkScenarioDrawerProps {
  visible: boolean
  onClose: () => void
  onSave?: (scenario: Scenario) => void
  editingScenario?: Scenario
}

export function BenchmarkScenarioDrawer({
  visible,
  onClose,
  onSave,
  editingScenario,
}: BenchmarkScenarioDrawerProps) {
  const { isFutureMode } = useFeatureMode()
  const [name, setName] = useState('')
  const [selectedBenchmark, setSelectedBenchmark] = useState<SelectedBenchmark | undefined>(undefined)
  const [diffSign, setDiffSign] = useState<'+' | '-'>('+')
  const [diffAmount, setDiffAmount] = useState<number>(0)

  const isEditMode = !!editingScenario

  // Reset form when drawer opens, or populate with editing data
  useEffect(() => {
    if (visible) {
      if (editingScenario) {
        // Edit mode - populate from priceConfig
        setName(editingScenario.name)
        setDiffSign(editingScenario.priceConfig?.diff?.sign || '+')
        setDiffAmount(editingScenario.priceConfig?.diff?.amount ?? 0)
        if (editingScenario.priceConfig?.publisher) {
          setSelectedBenchmark({
            publisher: editingScenario.priceConfig.publisher,
            productHierarchy: editingScenario.priceConfig.productHierarchy,
            locationHierarchy: editingScenario.priceConfig.locationHierarchy,
          })
        }
      } else {
        // Add mode - reset form
        setName('')
        setSelectedBenchmark(undefined)
        setDiffSign('+')
        setDiffAmount(0)
      }
    }
  }, [visible, editingScenario])

  // Compute preview data reactively from selected benchmark
  const hasFullBenchmark =
    selectedBenchmark !== undefined &&
    selectedBenchmark.publisher !== undefined &&
    selectedBenchmark.productHierarchy !== undefined &&
    selectedBenchmark.locationHierarchy !== undefined

  const matchingInfo = useMemo(
    () => (isFutureMode && hasFullBenchmark ? calculateMatchingInfo(selectedBenchmark) : null),
    [isFutureMode, hasFullBenchmark, selectedBenchmark],
  )

  const impactEstimate = useMemo(
    () => (isFutureMode && hasFullBenchmark ? calculateImpactEstimate(selectedBenchmark) : null),
    [isFutureMode, hasFullBenchmark, selectedBenchmark],
  )

  const productDetails = useMemo(
    () => (isFutureMode && hasFullBenchmark ? getProductMatchDetails(selectedBenchmark) : null),
    [isFutureMode, hasFullBenchmark, selectedBenchmark],
  )

  // Validation: need name and a fully configured benchmark
  const canSave =
    name.trim().length > 0 &&
    selectedBenchmark !== undefined &&
    selectedBenchmark.publisher !== undefined &&
    selectedBenchmark.productHierarchy !== undefined &&
    selectedBenchmark.locationHierarchy !== undefined

  const handleSave = () => {
    if (!canSave || !selectedBenchmark) return

    const now = new Date().toISOString()
    const priceConfig: Scenario['priceConfig'] = {
      source: 'adhoc',
      publisher: selectedBenchmark.publisher,
      productHierarchy: selectedBenchmark.productHierarchy,
      locationHierarchy: selectedBenchmark.locationHierarchy,
      diff: { sign: diffSign, amount: diffAmount },
    }

    if (isEditMode && editingScenario) {
      // Edit mode - update existing scenario
      const updatedScenario: Scenario = {
        ...editingScenario,
        name: name.trim(),
        updatedAt: now,
        priceConfig,
      }
      onSave?.(updatedScenario)
    } else {
      // Add mode - create new scenario
      const newScenario: Scenario = {
        id: generateScenarioId(),
        name: name.trim(),
        products: 'all',
        status: 'complete',
        entryMethod: 'benchmark',
        isReference: false,
        createdAt: now,
        updatedAt: now,
        priceConfig,
      }
      onSave?.(newScenario)
    }
    onClose()
  }

  return (
    <Drawer
      placement='bottom'
      height='70%'
      visible={visible}
      onClose={onClose}
      closable={false}
      title={null}
      headerStyle={{ display: 'none' }}
      bodyStyle={{
        backgroundColor: '#f5f5f5',
        padding: 0,
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
      }}
      zIndex={2000}
      destroyOnClose
    >
      {/* Header */}
      <div
        style={{
          backgroundColor: '#0c5a58',
          padding: '20px 24px',
          flexShrink: 0,
        }}
      >
        <Horizontal justifyContent='space-between' alignItems='flex-start'>
          <Vertical style={{ gap: '4px' }}>
            <Texto style={{ fontSize: '18px', fontWeight: 600, color: '#ffffff' }}>
              {isEditMode ? 'Edit Benchmark Scenario' : 'Add Benchmark Scenario'}
            </Texto>
            <Texto style={{ fontSize: '13px', color: 'rgba(255, 255, 255, 0.85)' }}>
              Configure a scenario based on market benchmarks
            </Texto>
          </Vertical>
          <Button
            type='link'
            onClick={onClose}
            style={{ color: '#ffffff', fontSize: '20px', padding: 0, height: 'auto', lineHeight: 1 }}
          >
            ×
          </Button>
        </Horizontal>
      </div>

      {/* Content - Scrollable area */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          minHeight: 0,
          padding: '24px',
        }}
      >
        <div style={{ display: 'flex', gap: '24px' }}>
          {/* Left column: Reference Legend */}
          <div style={{ width: '220px', flexShrink: 0 }}>
            <ReferenceLegendCards />
          </div>

          {/* Center column: Name + Form */}
          <div style={{ flex: 3, minWidth: 0 }}>
            {/* Scenario Name */}
            <div style={{ marginBottom: '24px', maxWidth: '50%' }}>
              <Texto
                style={{
                  fontSize: '12px',
                  fontWeight: 700,
                  marginBottom: '8px',
                  display: 'block',
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                  color: '#595959',
                }}
              >
                Scenario Name
              </Texto>
              <Input
                placeholder='Enter scenario name...'
                value={name}
                onChange={(e) => setName(e.target.value)}
                size='large'
                maxLength={100}
              />
            </div>

            {/* Benchmark Configuration */}
            <div>
              <Texto
                style={{
                  fontSize: '12px',
                  fontWeight: 700,
                  marginBottom: '8px',
                  display: 'block',
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                  color: '#595959',
                }}
              >
                Benchmark Configuration
              </Texto>
              <BenchmarkSelector
                selectedBenchmark={selectedBenchmark}
                onBenchmarkChange={setSelectedBenchmark}
                diffSign={diffSign}
                diffAmount={diffAmount}
                onDiffSignChange={setDiffSign}
                onDiffAmountChange={(val) => setDiffAmount(val ?? 0)}
              />
            </div>
          </div>

          {/* Right column: Preview Panel (Future mode only) */}
          {isFutureMode && (
            <div style={{ flex: 2, minWidth: '300px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {matchingInfo && impactEstimate && productDetails ? (
                <>
                  <MatchingSummaryCard
                    matchedCount={matchingInfo.matchedCount}
                    rollupCount={matchingInfo.rollupCount}
                    noMatchCount={matchingInfo.noMatchCount}
                    totalProducts={matchingInfo.totalProducts}
                    matchPercentage={matchingInfo.matchPercentage}
                  />
                  <EstimatedImpactCard impactEstimate={impactEstimate} />
                  <ProductBreakdownPanel productDetails={productDetails} />
                </>
              ) : (
                <BenchmarkPreview selectedBenchmark={undefined} />
              )}
            </div>
          )}
        </div>
      </div>

      {/* Fixed Footer */}
      <div
        style={{
          padding: '16px 24px',
          borderTop: '1px solid #d9d9d9',
          backgroundColor: '#ffffff',
          flexShrink: 0,
          zIndex: 100,
        }}
      >
        <Horizontal justifyContent='flex-end' alignItems='center' style={{ gap: '16px' }}>
          <GraviButton
            buttonText='Cancel'
            size='large'
            appearance='outlined'
            onClick={onClose}
            style={{ minWidth: '100px' }}
          />
          <GraviButton
            buttonText={isEditMode ? 'Save Changes' : 'Add Scenario'}
            size='large'
            theme1
            disabled={!canSave}
            onClick={handleSave}
            style={{ minWidth: '140px' }}
          />
        </Horizontal>
      </div>
    </Drawer>
  )
}
