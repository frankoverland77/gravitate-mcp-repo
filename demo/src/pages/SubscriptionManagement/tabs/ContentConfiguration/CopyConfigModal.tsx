// Copy Config Modal - Modal for copying configuration from another quote config

import { GraviButton, Horizontal, Texto, Vertical } from '@gravitate-js/excalibrr'
import { Modal, Select } from 'antd'
import { useState } from 'react'

import { ContentConfiguration } from './types'

interface CopyConfigModalProps {
  visible: boolean
  targetConfig: ContentConfiguration | null
  allConfigs: ContentConfiguration[]
  onClose: () => void
  onCopy: (sourceId: number, targetId: number) => void
}

export function CopyConfigModal({ visible, targetConfig, allConfigs, onClose, onCopy }: CopyConfigModalProps) {
  const [selectedSourceId, setSelectedSourceId] = useState<number | null>(null)

  if (!targetConfig) return null

  const availableSources = allConfigs.filter((c) => c.QuoteConfigId !== targetConfig.QuoteConfigId)

  const handleCopy = () => {
    if (selectedSourceId !== null) {
      onCopy(selectedSourceId, targetConfig.QuoteConfigId)
      setSelectedSourceId(null)
      onClose()
    }
  }

  const handleClose = () => {
    setSelectedSourceId(null)
    onClose()
  }

  return (
    <Modal
      title='Copy Configuration'
      open={visible}
      onCancel={handleClose}
      width={500}
      footer={
        <Horizontal gap={8} justifyContent='flex-end'>
          <GraviButton buttonText='Cancel' onClick={handleClose} />
          <GraviButton
            buttonText='Copy'
            theme1
            disabled={selectedSourceId === null}
            onClick={handleCopy}
          />
        </Horizontal>
      }
    >
      <Vertical gap={16}>
        <Texto>
          Copy content configuration to <strong>{targetConfig.QuoteConfigName}</strong> from another quote configuration.
        </Texto>

        <Vertical gap={4}>
          <Texto category='p2' appearance='medium' style={{ textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Copy From
          </Texto>
          <Select
            placeholder='Select a quote configuration'
            style={{ width: '100%' }}
            value={selectedSourceId}
            onChange={(value) => setSelectedSourceId(value)}
            options={availableSources.map((c) => ({
              value: c.QuoteConfigId,
              label: c.QuoteConfigName,
            }))}
          />
        </Vertical>

        {selectedSourceId !== null && (
          <Vertical
            gap={4} style={{ backgroundColor: 'var(--theme-bg-elevated)',
              padding: '12px',
              borderRadius: '4px' }}
          >
            <Texto category='p2' appearance='medium'>
              This will overwrite the current configuration for {targetConfig.QuoteConfigName}.
            </Texto>
          </Vertical>
        )}
      </Vertical>
    </Modal>
  )
}
