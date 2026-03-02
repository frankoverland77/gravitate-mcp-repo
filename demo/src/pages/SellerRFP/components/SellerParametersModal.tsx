/**
 * Seller Parameters Modal
 *
 * Configures price history and volume history lookback inputs for the
 * Seller RFP Response workspace. Mirrors the buyer-side ThresholdsModal
 * pattern but only includes Price History and Volume History sections
 * (no Threshold Rules or Issue Importance).
 */

import { useState, useEffect, useCallback } from 'react'
import { Vertical, Horizontal, Texto, GraviButton } from '@gravitate-js/excalibrr'
import { Modal, Select } from 'antd'
import type {
  ParameterConfig,
  HistoryLookback,
  AggregationMethod,
  PriceMethod,
  VolumeGranularity,
  VolumeCalculation,
} from '../../RFP/rfp.types'
import {
  DEFAULT_PARAMETERS,
  HISTORY_LOOKBACK_OPTIONS,
  AGGREGATION_METHOD_OPTIONS,
  PRICE_METHOD_OPTIONS,
  VOLUME_GRANULARITY_OPTIONS,
  VOLUME_CALCULATION_OPTIONS,
} from '../../RFP/rfp.types'

interface SellerParametersModalProps {
  visible: boolean
  parameters: ParameterConfig
  onClose: () => void
  onSave: (parameters: ParameterConfig) => void
}

export function SellerParametersModal({
  visible,
  parameters,
  onClose,
  onSave,
}: SellerParametersModalProps) {
  const [local, setLocal] = useState<ParameterConfig>(parameters)

  // Sync local state when modal opens
  useEffect(() => {
    if (visible) {
      setLocal(parameters)
    }
  }, [visible, parameters])

  const handleSave = useCallback(() => {
    onSave(local)
  }, [local, onSave])

  const handleReset = useCallback(() => {
    setLocal(DEFAULT_PARAMETERS)
  }, [])

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
      <Vertical style={{ gap: '24px', paddingTop: '8px' }}>
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
                value={local.priceHistoryLookback}
                onChange={(value: HistoryLookback) =>
                  setLocal((prev) => ({ ...prev, priceHistoryLookback: value }))
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
                value={local.priceAggregation}
                onChange={(value: AggregationMethod) =>
                  setLocal((prev) => ({ ...prev, priceAggregation: value }))
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
                value={local.priceMethod}
                onChange={(value: PriceMethod) =>
                  setLocal((prev) => ({ ...prev, priceMethod: value }))
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
                value={local.volumeHistoryLookback}
                onChange={(value: HistoryLookback) =>
                  setLocal((prev) => ({ ...prev, volumeHistoryLookback: value }))
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
                value={local.volumeGranularity}
                onChange={(value: VolumeGranularity) =>
                  setLocal((prev) => ({ ...prev, volumeGranularity: value }))
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
                value={local.volumeCalculation}
                onChange={(value: VolumeCalculation) =>
                  setLocal((prev) => ({ ...prev, volumeCalculation: value }))
                }
                options={VOLUME_CALCULATION_OPTIONS}
                style={{ width: '140px' }}
              />
            </Horizontal>
          </Vertical>
        </Vertical>
      </Vertical>
    </Modal>
  )
}
