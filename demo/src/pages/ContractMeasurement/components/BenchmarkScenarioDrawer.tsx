import { useState, useEffect } from 'react'
import { Texto, Horizontal, Vertical, GraviButton } from '@gravitate-js/excalibrr'
import { Drawer, Button, Input } from 'antd'
import type { SelectedBenchmark, Scenario, BenchmarkTypeOption, BenchmarkType } from '../types/scenario.types'
import { generateScenarioId } from '../types/scenario.types'
import { BenchmarkSelector } from './benchmark'

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
  const [name, setName] = useState('')
  const [selectedBenchmark, setSelectedBenchmark] = useState<SelectedBenchmark | undefined>(undefined)
  const [diffSign, setDiffSign] = useState<'+' | '-'>('+')
  const [diffAmount, setDiffAmount] = useState<number>(0)

  const isEditMode = !!editingScenario

  // Reset form when drawer opens, or populate with editing data
  useEffect(() => {
    if (visible) {
      if (editingScenario) {
        // Edit mode - populate with existing data
        setName(editingScenario.name)
        setDiffSign(editingScenario.priceConfig?.diff?.sign || '+')
        setDiffAmount(editingScenario.priceConfig?.diff?.amount ?? 0)
        // Reconstruct the selected benchmark from existing config
        if (editingScenario.priceConfig?.benchmarkId) {
          setSelectedBenchmark({
            type: editingScenario.priceConfig.benchmarkId.startsWith('custom') ? 'custom' : 'quick',
            quickType: editingScenario.priceConfig.benchmarkId as 'rack-average' | 'rack-low' | 'spot-price' | 'opis-contract',
            publisher: editingScenario.priceConfig.publisher,
            benchmarkType: editingScenario.priceConfig.benchmarkId as BenchmarkTypeOption,
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

  // Handle card selection - pre-populate name for quick selects
  const handleCardSelect = (type: BenchmarkType, title: string) => {
    // Only pre-populate name for quick selects (not custom), and only if name is empty
    if (type !== 'custom' && name.trim() === '') {
      setName(title)
    } else if (type === 'custom') {
      // Clear name when switching to custom if it was auto-generated
      // (Check if the current name matches one of the quick select titles)
      const quickSelectTitles = ['Rack Low', 'Rack Average', 'Spot', 'OPIS Contract']
      if (quickSelectTitles.includes(name)) {
        setName('')
      }
    }
  }

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
    const benchmarkId =
      selectedBenchmark.type === 'quick'
        ? selectedBenchmark.quickType
        : selectedBenchmark.benchmarkType

    if (isEditMode && editingScenario) {
      // Edit mode - update existing scenario
      const updatedScenario: Scenario = {
        ...editingScenario,
        name: name.trim(),
        updatedAt: now,
        priceConfig: {
          benchmarkId,
          publisher: selectedBenchmark.publisher,
          productHierarchy: selectedBenchmark.productHierarchy,
          locationHierarchy: selectedBenchmark.locationHierarchy,
          diff: { sign: diffSign, amount: diffAmount },
        },
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
        isPrimary: false,
        createdAt: now,
        updatedAt: now,
        priceConfig: {
          benchmarkId,
          publisher: selectedBenchmark.publisher,
          productHierarchy: selectedBenchmark.productHierarchy,
          locationHierarchy: selectedBenchmark.locationHierarchy,
          diff: { sign: diffSign, amount: diffAmount },
        },
      }
      onSave?.(newScenario)
    }
    onClose()
  }

  return (
    <Drawer
      placement="bottom"
      height="70%"
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
        <Horizontal justifyContent="space-between" alignItems="flex-start">
          <Vertical style={{ gap: '4px' }}>
            <Texto style={{ fontSize: '18px', fontWeight: 600, color: '#ffffff' }}>
              {isEditMode ? 'Edit Benchmark Scenario' : 'Add Benchmark Scenario'}
            </Texto>
            <Texto style={{ fontSize: '13px', color: 'rgba(255, 255, 255, 0.85)' }}>
              Configure a scenario based on market benchmarks
            </Texto>
          </Vertical>
          <Button
            type="link"
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
        {/* SECTION 1: Scenario Name */}
        <div style={{ marginBottom: '24px' }}>
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
            placeholder="Enter scenario name..."
            value={name}
            onChange={(e) => setName(e.target.value)}
            size="large"
            maxLength={100}
          />
        </div>

        {/* SECTION 2: Benchmark Selection */}
        <div style={{ marginBottom: '24px' }}>
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
            Benchmark Selection
          </Texto>
          <BenchmarkSelector
            selectedBenchmark={selectedBenchmark}
            onBenchmarkChange={setSelectedBenchmark}
            diffSign={diffSign}
            diffAmount={diffAmount}
            onDiffSignChange={setDiffSign}
            onDiffAmountChange={(val) => setDiffAmount(val ?? 0)}
            onCardSelect={handleCardSelect}
          />
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
        <Horizontal justifyContent="flex-end" alignItems="center" style={{ gap: '16px' }}>
          <GraviButton
            buttonText="Cancel"
            size="large"
            appearance="outlined"
            onClick={onClose}
            style={{ minWidth: '100px' }}
          />
          <GraviButton
            buttonText={isEditMode ? 'Save Changes' : 'Add Scenario'}
            size="large"
            success
            disabled={!canSave}
            onClick={handleSave}
            style={{ minWidth: '140px' }}
          />
        </Horizontal>
      </div>
    </Drawer>
  )
}
