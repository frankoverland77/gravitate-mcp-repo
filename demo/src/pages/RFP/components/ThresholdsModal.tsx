import { useState, useEffect } from 'react'
import { Vertical, Horizontal, Texto, GraviButton } from '@gravitate-js/excalibrr'
import { Modal, Select, InputNumber, Divider } from 'antd'
import type { ThresholdConfig, ParameterConfig } from '../rfp.types'
import {
  DEFAULT_THRESHOLDS,
  DEFAULT_PARAMETERS,
  MARKET_INDEX_OPTIONS,
  PRICE_ASSUMPTION_OPTIONS,
  COMPARISON_PERIOD_OPTIONS,
  ALLOCATION_OPTIONS,
} from '../rfp.types'

interface ThresholdsModalProps {
  visible: boolean
  thresholds: ThresholdConfig
  parameters?: ParameterConfig
  onClose: () => void
  onSave: (thresholds: ThresholdConfig, parameters: ParameterConfig) => void
}

export function ThresholdsModal({
  visible,
  thresholds,
  parameters = DEFAULT_PARAMETERS,
  onClose,
  onSave,
}: ThresholdsModalProps) {
  const [localThresholds, setLocalThresholds] = useState<ThresholdConfig>(thresholds)
  const [localParameters, setLocalParameters] = useState<ParameterConfig>(parameters)

  // Reset local state when modal opens
  useEffect(() => {
    if (visible) {
      setLocalThresholds(thresholds)
      setLocalParameters(parameters)
    }
  }, [visible, thresholds, parameters])

  const handleSave = () => {
    onSave(localThresholds, localParameters)
    onClose()
  }

  const handleReset = () => {
    setLocalThresholds(DEFAULT_THRESHOLDS)
    setLocalParameters(DEFAULT_PARAMETERS)
  }

  return (
    <Modal
      visible={visible}
      title="Parameters & Thresholds"
      onCancel={onClose}
      width={600}
      footer={
        <Horizontal justifyContent="space-between">
          <GraviButton type="link" buttonText="Reset to Defaults" onClick={handleReset} />
          <Horizontal style={{ gap: '8px' }}>
            <GraviButton buttonText="Cancel" onClick={onClose} />
            <GraviButton buttonText="Save Settings" success onClick={handleSave} />
          </Horizontal>
        </Horizontal>
      }
    >
      <Vertical style={{ gap: '24px' }}>
        {/* Parameters Section */}
        <Vertical style={{ gap: '16px' }}>
          <Texto category="h5" weight="600">
            Pricing Parameters
          </Texto>

          <Horizontal style={{ gap: '16px' }}>
            <Vertical flex="1" style={{ gap: '8px' }}>
              <Texto category="p2" appearance="medium">
                Market Index
              </Texto>
              <Select
                value={localParameters.marketIndex}
                onChange={(value) => setLocalParameters((prev) => ({ ...prev, marketIndex: value }))}
                options={MARKET_INDEX_OPTIONS}
                style={{ width: '100%' }}
              />
            </Vertical>
            <Vertical flex="1" style={{ gap: '8px' }}>
              <Texto category="p2" appearance="medium">
                Price Assumption
              </Texto>
              <Select
                value={localParameters.priceAssumption}
                onChange={(value) => setLocalParameters((prev) => ({ ...prev, priceAssumption: value }))}
                options={PRICE_ASSUMPTION_OPTIONS}
                style={{ width: '100%' }}
              />
            </Vertical>
          </Horizontal>

          <Vertical style={{ gap: '8px' }}>
            <Texto category="p2" appearance="medium">
              Global Price Adjustment (%)
            </Texto>
            <InputNumber
              value={localParameters.globalPriceAdjustment}
              onChange={(value) => setLocalParameters((prev) => ({ ...prev, globalPriceAdjustment: value || 0 }))}
              min={-50}
              max={50}
              style={{ width: 150 }}
              addonAfter="%"
            />
          </Vertical>
        </Vertical>

        <Divider />

        {/* Volume Parameters Section */}
        <Vertical style={{ gap: '16px' }}>
          <Texto category="h5" weight="600">
            Volume Parameters
          </Texto>

          <Horizontal style={{ gap: '16px' }}>
            <Vertical flex="1" style={{ gap: '8px' }}>
              <Texto category="p2" appearance="medium">
                Target Volume (gal/mo)
              </Texto>
              <InputNumber
                value={localParameters.targetVolume}
                onChange={(value) => setLocalParameters((prev) => ({ ...prev, targetVolume: value || 0 }))}
                min={0}
                formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                parser={(value) => Number(value?.replace(/,/g, '') || 0)}
                style={{ width: '100%' }}
              />
            </Vertical>
            <Vertical flex="1" style={{ gap: '8px' }}>
              <Texto category="p2" appearance="medium">
                Comparison Period
              </Texto>
              <Select
                value={localParameters.comparisonPeriod}
                onChange={(value) => setLocalParameters((prev) => ({ ...prev, comparisonPeriod: value }))}
                options={COMPARISON_PERIOD_OPTIONS}
                style={{ width: '100%' }}
              />
            </Vertical>
          </Horizontal>
        </Vertical>

        <Divider />

        {/* Thresholds Section */}
        <Vertical style={{ gap: '16px' }}>
          <Texto category="h5" weight="600">
            Threshold Rules
          </Texto>
          <Texto category="p2" appearance="medium">
            Values outside these thresholds will be flagged as issues.
          </Texto>

          <Horizontal style={{ gap: '16px' }}>
            <Vertical flex="1" style={{ gap: '8px' }}>
              <Texto category="p2" appearance="medium">
                Max Penalties (¢/gal)
              </Texto>
              <InputNumber
                value={localThresholds.penaltyMax}
                onChange={(value) => setLocalThresholds((prev) => ({ ...prev, penaltyMax: value || 0 }))}
                min={0}
                max={10}
                style={{ width: '100%' }}
              />
            </Vertical>
            <Vertical flex="1" style={{ gap: '8px' }}>
              <Texto category="p2" appearance="medium">
                Ratability Range (%)
              </Texto>
              <Horizontal style={{ gap: '8px' }}>
                <InputNumber
                  value={localThresholds.ratabilityMin}
                  onChange={(value) => setLocalThresholds((prev) => ({ ...prev, ratabilityMin: value || 0 }))}
                  min={0}
                  max={100}
                  style={{ width: '50%' }}
                  placeholder="Min"
                />
                <InputNumber
                  value={localThresholds.ratabilityMax}
                  onChange={(value) => setLocalThresholds((prev) => ({ ...prev, ratabilityMax: value || 100 }))}
                  min={0}
                  max={200}
                  style={{ width: '50%' }}
                  placeholder="Max"
                />
              </Horizontal>
            </Vertical>
          </Horizontal>

          <Vertical style={{ gap: '8px' }}>
            <Texto category="p2" appearance="medium">
              Minimum Allocation Level
            </Texto>
            <Select
              value={localThresholds.allocationMin}
              onChange={(value) => setLocalThresholds((prev) => ({ ...prev, allocationMin: value }))}
              options={ALLOCATION_OPTIONS}
              style={{ width: 200 }}
            />
          </Vertical>
        </Vertical>
      </Vertical>
    </Modal>
  )
}
