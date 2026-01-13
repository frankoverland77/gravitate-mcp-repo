import { useState, useEffect } from 'react'
import { Modal, Select } from 'antd'
import { Texto, Vertical, Horizontal, GraviButton } from '@gravitate-js/excalibrr'
import type { AnalysisParameters } from '../types/scenario.types'

interface ParametersModalProps {
  visible: boolean
  parameters: AnalysisParameters
  onClose: () => void
  onApply: (params: AnalysisParameters) => void
}

export function ParametersModal({ visible, parameters, onClose, onApply }: ParametersModalProps) {
  const [localParams, setLocalParams] = useState<AnalysisParameters>(parameters)

  // Reset local state when modal opens
  useEffect(() => {
    if (visible) {
      setLocalParams(parameters)
    }
  }, [visible, parameters])

  const handleApply = () => {
    onApply(localParams)
  }

  return (
    <Modal title="Parameters" visible={visible} onCancel={onClose} footer={null} width={400}>
      <Vertical style={{ gap: '24px' }}>
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
                value={localParams.price.lookback}
                onChange={(val) =>
                  setLocalParams({
                    ...localParams,
                    price: { ...localParams.price, lookback: val },
                  })
                }
                options={[
                  { value: '6mo', label: '6 months' },
                  { value: '12mo', label: '12 months' },
                  { value: '18mo', label: '18 months' },
                  { value: '24mo', label: '24 months' },
                ]}
                style={{ width: '140px' }}
              />
            </Horizontal>
            <Horizontal justifyContent="space-between" alignItems="center">
              <Texto category="p2" appearance="medium">
                Aggregation:
              </Texto>
              <Select
                value={localParams.price.aggregation}
                onChange={(val) =>
                  setLocalParams({
                    ...localParams,
                    price: { ...localParams.price, aggregation: val },
                  })
                }
                options={[
                  { value: 'daily', label: 'Daily' },
                  { value: 'weekly', label: 'Weekly' },
                  { value: 'monthly', label: 'Monthly' },
                  { value: 'quarterly', label: 'Quarterly' },
                ]}
                style={{ width: '140px' }}
              />
            </Horizontal>
            <Horizontal justifyContent="space-between" alignItems="center">
              <Texto category="p2" appearance="medium">
                Method:
              </Texto>
              <Select
                value={localParams.price.method}
                onChange={(val) =>
                  setLocalParams({
                    ...localParams,
                    price: { ...localParams.price, method: val },
                  })
                }
                options={[
                  { value: 'weighted', label: 'Weighted Average' },
                  { value: 'simple', label: 'Simple Average' },
                  { value: 'median', label: 'Median' },
                ]}
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
                value={localParams.volume.lookback}
                onChange={(val) =>
                  setLocalParams({
                    ...localParams,
                    volume: { ...localParams.volume, lookback: val },
                  })
                }
                options={[
                  { value: '6mo', label: '6 months' },
                  { value: '12mo', label: '12 months' },
                  { value: '18mo', label: '18 months' },
                  { value: '24mo', label: '24 months' },
                ]}
                style={{ width: '140px' }}
              />
            </Horizontal>
            <Horizontal justifyContent="space-between" alignItems="center">
              <Texto category="p2" appearance="medium">
                Granularity:
              </Texto>
              <Select
                value={localParams.volume.granularity}
                onChange={(val) =>
                  setLocalParams({
                    ...localParams,
                    volume: { ...localParams.volume, granularity: val },
                  })
                }
                options={[
                  { value: 'weekly', label: 'Weekly' },
                  { value: 'monthly', label: 'Monthly' },
                  { value: 'quarterly', label: 'Quarterly' },
                ]}
                style={{ width: '140px' }}
              />
            </Horizontal>
            <Horizontal justifyContent="space-between" alignItems="center">
              <Texto category="p2" appearance="medium">
                Calculation:
              </Texto>
              <Select
                value={localParams.volume.calculation}
                onChange={(val) =>
                  setLocalParams({
                    ...localParams,
                    volume: { ...localParams.volume, calculation: val },
                  })
                }
                options={[
                  { value: 'sum', label: 'Sum' },
                  { value: 'average', label: 'Average' },
                ]}
                style={{ width: '140px' }}
              />
            </Horizontal>
          </Vertical>
        </Vertical>

        {/* Footer buttons */}
        <Horizontal justifyContent="flex-end" style={{ gap: '12px', marginTop: '8px' }}>
          <GraviButton buttonText="Cancel" appearance="outlined" onClick={onClose} />
          <GraviButton buttonText="Apply" success onClick={handleApply} />
        </Horizontal>
      </Vertical>
    </Modal>
  )
}
