import { useState, useEffect, useCallback } from 'react'
import { Vertical, Horizontal, Texto, GraviButton } from '@gravitate-js/excalibrr'
import { Modal, Select, InputNumber, Tabs } from 'antd'
import { MenuOutlined } from '@ant-design/icons'
import type {
  ThresholdConfig,
  ParameterConfig,
  ImportanceRankingConfig,
  ImportanceFactor,
  HistoryLookback,
  AggregationMethod,
  PriceMethod,
  VolumeGranularity,
  VolumeCalculation,
} from '../rfp.types'
import {
  DEFAULT_THRESHOLDS,
  DEFAULT_PARAMETERS,
  DEFAULT_IMPORTANCE_RANKING,
  HISTORY_LOOKBACK_OPTIONS,
  AGGREGATION_METHOD_OPTIONS,
  PRICE_METHOD_OPTIONS,
  VOLUME_GRANULARITY_OPTIONS,
  VOLUME_CALCULATION_OPTIONS,
  ALLOCATION_PERIOD_OPTIONS,
  IMPORTANCE_FACTOR_LABELS,
} from '../rfp.types'

interface ThresholdsModalProps {
  visible: boolean
  thresholds: ThresholdConfig
  parameters: ParameterConfig
  importanceRanking: ImportanceRankingConfig
  onClose: () => void
  onSave: (
    thresholds: ThresholdConfig,
    parameters: ParameterConfig,
    importanceRanking: ImportanceRankingConfig
  ) => void
}

// Importance ranking item component
interface RankingItemProps {
  factor: ImportanceFactor
  rank: number
  totalRanks: number
  onMoveUp: () => void
  onMoveDown: () => void
}

function RankingItem({ factor, rank, totalRanks, onMoveUp, onMoveDown }: RankingItemProps) {
  const label = IMPORTANCE_FACTOR_LABELS[factor]
  // Calculate bar width based on inverse of rank (lower rank = more important = wider bar)
  const barWidth = ((totalRanks - rank + 1) / totalRanks) * 100

  return (
    <Horizontal
      alignItems="center"
      style={{
        padding: '8px 12px',
        backgroundColor: 'var(--theme-bg-elevated)',
        borderRadius: '4px',
        gap: '12px',
      }}
    >
      <MenuOutlined style={{ color: 'var(--theme-color-4)', cursor: 'grab' }} />
      <Texto category="p2" weight="500" style={{ minWidth: '24px' }}>
        {rank}.
      </Texto>
      <Texto category="p2" style={{ flex: 1 }}>
        {label}
      </Texto>
      <Horizontal
        style={{
          width: '80px',
          height: '8px',
          backgroundColor: 'var(--theme-bg-container)',
          borderRadius: '4px',
        }}
      >
        <div
          style={{
            width: `${barWidth}%`,
            height: '100%',
            backgroundColor: 'var(--theme-primary)',
            borderRadius: '4px',
            transition: 'width 0.2s ease',
          }}
        />
      </Horizontal>
      <Horizontal style={{ gap: '4px' }}>
        <GraviButton
          type="text"
          icon={<span style={{ fontSize: '10px' }}>▲</span>}
          onClick={onMoveUp}
          disabled={rank === 1}
          style={{ padding: '2px 6px', minWidth: 'auto' }}
        />
        <GraviButton
          type="text"
          icon={<span style={{ fontSize: '10px' }}>▼</span>}
          onClick={onMoveDown}
          disabled={rank === totalRanks}
          style={{ padding: '2px 6px', minWidth: 'auto' }}
        />
      </Horizontal>
    </Horizontal>
  )
}

export function ThresholdsModal({
  visible,
  thresholds,
  parameters,
  importanceRanking,
  onClose,
  onSave,
}: ThresholdsModalProps) {
  const [localThresholds, setLocalThresholds] = useState<ThresholdConfig>(thresholds)
  const [localParameters, setLocalParameters] = useState<ParameterConfig>(parameters)
  const [localImportance, setLocalImportance] = useState<ImportanceRankingConfig>(importanceRanking)

  // Reset local state when modal opens
  useEffect(() => {
    if (visible) {
      setLocalThresholds(thresholds)
      setLocalParameters(parameters)
      setLocalImportance(importanceRanking)
    }
  }, [visible, thresholds, parameters, importanceRanking])

  const handleSave = () => {
    onSave(localThresholds, localParameters, localImportance)
  }

  const handleReset = () => {
    setLocalThresholds(DEFAULT_THRESHOLDS)
    setLocalParameters(DEFAULT_PARAMETERS)
    setLocalImportance(DEFAULT_IMPORTANCE_RANKING)
  }

  // Get sorted factors by rank for display
  const getSortedFactors = useCallback((): ImportanceFactor[] => {
    const factors: ImportanceFactor[] = ['price', 'volume', 'ratability', 'allocation', 'penalties']
    return factors.sort((a, b) => localImportance[a] - localImportance[b])
  }, [localImportance])

  // Move a factor up in ranking (decrease rank number)
  const handleMoveUp = useCallback(
    (factor: ImportanceFactor) => {
      const currentRank = localImportance[factor]
      if (currentRank <= 1) return

      // Find the factor currently at rank-1
      const factors: ImportanceFactor[] = ['price', 'volume', 'ratability', 'allocation', 'penalties']
      const otherFactor = factors.find((f) => localImportance[f] === currentRank - 1)
      if (!otherFactor) return

      setLocalImportance((prev) => ({
        ...prev,
        [factor]: currentRank - 1,
        [otherFactor]: currentRank,
      }))
    },
    [localImportance]
  )

  // Move a factor down in ranking (increase rank number)
  const handleMoveDown = useCallback(
    (factor: ImportanceFactor) => {
      const currentRank = localImportance[factor]
      if (currentRank >= 5) return

      // Find the factor currently at rank+1
      const factors: ImportanceFactor[] = ['price', 'volume', 'ratability', 'allocation', 'penalties']
      const otherFactor = factors.find((f) => localImportance[f] === currentRank + 1)
      if (!otherFactor) return

      setLocalImportance((prev) => ({
        ...prev,
        [factor]: currentRank + 1,
        [otherFactor]: currentRank,
      }))
    },
    [localImportance]
  )

  return (
    <Modal
      visible={visible}
      title="Parameters"
      onCancel={onClose}
      width={480}
      footer={
        <Horizontal justifyContent="space-between">
          <GraviButton type="link" buttonText="Reset to Defaults" onClick={handleReset} />
          <Horizontal style={{ gap: '8px' }}>
            <GraviButton buttonText="Cancel" onClick={onClose} />
            <GraviButton buttonText="Save" success onClick={handleSave} />
          </Horizontal>
        </Horizontal>
      }
    >
      <Tabs defaultActiveKey="parameters">
        <Tabs.TabPane tab="Parameters" key="parameters">
          <Vertical style={{ gap: '24px', paddingTop: '16px' }}>
            {/* Price History Section */}
            <Vertical style={{ gap: '12px' }}>
              <Texto category="p2" weight="600">
                Price History
              </Texto>
              <Vertical style={{ gap: '8px' }}>
                <Horizontal justifyContent="space-between" alignItems="center">
                  <Texto category="p2" appearance="medium">
                    Lookback:
                  </Texto>
                  <Select
                    value={localParameters.priceHistoryLookback}
                    onChange={(value: HistoryLookback) =>
                      setLocalParameters((prev) => ({ ...prev, priceHistoryLookback: value }))
                    }
                    options={HISTORY_LOOKBACK_OPTIONS}
                    style={{ width: '140px' }}
                  />
                </Horizontal>
                <Horizontal justifyContent="space-between" alignItems="center">
                  <Texto category="p2" appearance="medium">
                    Aggregation:
                  </Texto>
                  <Select
                    value={localParameters.priceAggregation}
                    onChange={(value: AggregationMethod) =>
                      setLocalParameters((prev) => ({ ...prev, priceAggregation: value }))
                    }
                    options={AGGREGATION_METHOD_OPTIONS}
                    style={{ width: '140px' }}
                  />
                </Horizontal>
                <Horizontal justifyContent="space-between" alignItems="center">
                  <Texto category="p2" appearance="medium">
                    Method:
                  </Texto>
                  <Select
                    value={localParameters.priceMethod}
                    onChange={(value: PriceMethod) =>
                      setLocalParameters((prev) => ({ ...prev, priceMethod: value }))
                    }
                    options={PRICE_METHOD_OPTIONS}
                    style={{ width: '140px' }}
                  />
                </Horizontal>
              </Vertical>
            </Vertical>

            {/* Volume History Section */}
            <Vertical style={{ gap: '12px' }}>
              <Texto category="p2" weight="600">
                Volume History
              </Texto>
              <Vertical style={{ gap: '8px' }}>
                <Horizontal justifyContent="space-between" alignItems="center">
                  <Texto category="p2" appearance="medium">
                    Lookback:
                  </Texto>
                  <Select
                    value={localParameters.volumeHistoryLookback}
                    onChange={(value: HistoryLookback) =>
                      setLocalParameters((prev) => ({ ...prev, volumeHistoryLookback: value }))
                    }
                    options={HISTORY_LOOKBACK_OPTIONS}
                    style={{ width: '140px' }}
                  />
                </Horizontal>
                <Horizontal justifyContent="space-between" alignItems="center">
                  <Texto category="p2" appearance="medium">
                    Granularity:
                  </Texto>
                  <Select
                    value={localParameters.volumeGranularity}
                    onChange={(value: VolumeGranularity) =>
                      setLocalParameters((prev) => ({ ...prev, volumeGranularity: value }))
                    }
                    options={VOLUME_GRANULARITY_OPTIONS}
                    style={{ width: '140px' }}
                  />
                </Horizontal>
                <Horizontal justifyContent="space-between" alignItems="center">
                  <Texto category="p2" appearance="medium">
                    Calculation:
                  </Texto>
                  <Select
                    value={localParameters.volumeCalculation}
                    onChange={(value: VolumeCalculation) =>
                      setLocalParameters((prev) => ({ ...prev, volumeCalculation: value }))
                    }
                    options={VOLUME_CALCULATION_OPTIONS}
                    style={{ width: '140px' }}
                  />
                </Horizontal>
              </Vertical>
            </Vertical>

            {/* Threshold Rules Section */}
            <Vertical style={{ gap: '12px' }}>
              <Texto category="p2" weight="600">
                Threshold Rules
              </Texto>
              <Vertical style={{ gap: '8px' }}>
                <Horizontal justifyContent="space-between" alignItems="center">
                  <Texto category="p2" appearance="medium">
                    Ratability Min:
                  </Texto>
                  <Horizontal alignItems="center" style={{ gap: '4px', overflow: 'visible' }}>
                    <InputNumber
                      value={localThresholds.ratabilityMin}
                      onChange={(value) => setLocalThresholds((prev) => ({ ...prev, ratabilityMin: value || 0 }))}
                      min={0}
                      max={100}
                      style={{ width: '70px' }}
                    />
                    <Texto category="p2" appearance="medium">
                      %
                    </Texto>
                  </Horizontal>
                </Horizontal>
                <Horizontal justifyContent="space-between" alignItems="center">
                  <Texto category="p2" appearance="medium">
                    Ratability Max:
                  </Texto>
                  <Horizontal alignItems="center" style={{ gap: '4px', overflow: 'visible' }}>
                    <InputNumber
                      value={localThresholds.ratabilityMax}
                      onChange={(value) => setLocalThresholds((prev) => ({ ...prev, ratabilityMax: value || 100 }))}
                      min={0}
                      max={200}
                      style={{ width: '70px' }}
                    />
                    <Texto category="p2" appearance="medium">
                      %
                    </Texto>
                  </Horizontal>
                </Horizontal>
                <Horizontal justifyContent="space-between" alignItems="center">
                  <Texto category="p2" appearance="medium">
                    Allocation:
                  </Texto>
                  <Select
                    value={localThresholds.allocationMin}
                    onChange={(value) => setLocalThresholds((prev) => ({ ...prev, allocationMin: value }))}
                    options={ALLOCATION_PERIOD_OPTIONS}
                    style={{ width: '140px' }}
                  />
                </Horizontal>
                <Horizontal justifyContent="space-between" alignItems="center">
                  <Texto category="p2" appearance="medium">
                    Max Penalties:
                  </Texto>
                  <Horizontal alignItems="center" style={{ gap: '4px', overflow: 'visible' }}>
                    <InputNumber
                      value={localThresholds.penaltyMax}
                      onChange={(value) => setLocalThresholds((prev) => ({ ...prev, penaltyMax: value || 0 }))}
                      min={0}
                      max={10}
                      style={{ width: '70px' }}
                    />
                    <Texto category="p2" appearance="medium">
                      cents/gal
                    </Texto>
                  </Horizontal>
                </Horizontal>
              </Vertical>
            </Vertical>
          </Vertical>
        </Tabs.TabPane>

        <Tabs.TabPane tab="Issue Importance" key="importance">
          <Vertical style={{ gap: '12px', paddingTop: '16px' }}>
            <Texto category="p2" weight="600">
              Issue Importance
            </Texto>
            <Texto category="p2" appearance="medium">
              Reorder by importance for AI recommendations
            </Texto>

            {/* Ranking list */}
            <Vertical style={{ gap: '8px' }}>
              {getSortedFactors().map((factor) => (
                <RankingItem
                  key={factor}
                  factor={factor}
                  rank={localImportance[factor]}
                  totalRanks={5}
                  onMoveUp={() => handleMoveUp(factor)}
                  onMoveDown={() => handleMoveDown(factor)}
                />
              ))}
            </Vertical>
          </Vertical>
        </Tabs.TabPane>
      </Tabs>
    </Modal>
  )
}
