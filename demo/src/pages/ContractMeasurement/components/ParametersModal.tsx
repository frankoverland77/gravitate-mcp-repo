import { useState, useEffect } from 'react'
import { Modal, Select } from 'antd'
import { Texto, Vertical, Horizontal, GraviButton } from '@gravitate-js/excalibrr'
import type { AnalysisParameters } from '../types/scenario.types'

interface ParametersModalProps {
  open: boolean
  parameters: AnalysisParameters
  onClose: () => void
  onApply: (params: AnalysisParameters) => void
}

export function ParametersModal({ open, parameters, onClose, onApply }: ParametersModalProps) {
  const [localParams, setLocalParams] = useState<AnalysisParameters>(parameters)

  // Reset local state when modal opens
  useEffect(() => {
    if (open) {
      setLocalParams(parameters)
    }
  }, [open, parameters])

  const handleApply = () => {
    onApply(localParams)
  }

  return (
    <Modal title="Parameters" open={open} onCancel={onClose} footer={null} width={400}>
      <Vertical gap={24}>
        {/* Price History Section */}
        <Vertical gap={8}>
          <Horizontal justifyContent="space-between" alignItems="center">
            <Texto category="p2" appearance="medium">
              Lookback Period:
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
                { value: '30d', label: 'Last 30 Days' },
                { value: '3mo', label: 'Last 3 Months' },
                { value: '6mo', label: 'Last 6 Months' },
                { value: '12mo', label: 'Last 12 Months' },
                { value: 'full', label: 'Entire Contract Duration' },
              ]}
              style={{ width: '220px' }}
            />
          </Horizontal>
          <Horizontal justifyContent="space-between" alignItems="center">
            <Texto category="p2" appearance="medium">
              Averaging Method:
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
                { value: 'simple', label: 'Simple Average' },
                { value: 'weekly-median', label: 'Avg of Weekly Medians' },
                { value: 'monthly-median', label: 'Avg of Monthly Medians' },
              ]}
              style={{ width: '220px' }}
            />
          </Horizontal>
        </Vertical>

        {/* Footer buttons */}
        <Horizontal justifyContent="flex-end" gap={12} style={{ marginTop: '8px' }}>
          <GraviButton buttonText="Cancel" appearance="outlined" onClick={onClose} />
          <GraviButton buttonText="Apply" success onClick={handleApply} />
        </Horizontal>
      </Vertical>
    </Modal>
  )
}
