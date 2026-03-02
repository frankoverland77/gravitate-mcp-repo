/**
 * Entry Path Modal
 *
 * Presents 4 card-style buttons for choosing how to create RFP detail rows:
 * - Build from Matrix (opens IntakeDrawer)
 * - Upload Buyer's RFP (opens UploadRFPModal)
 * - Copy Previous Response (opens CopyResponseModal)
 * - Add Rows Manually (opens ManualEntryDrawer)
 */

import { Modal } from 'antd'
import { Vertical, Texto } from '@gravitate-js/excalibrr'
import {
  AppstoreOutlined,
  UploadOutlined,
  CopyOutlined,
  PlusOutlined,
} from '@ant-design/icons'
import type { EntryPath } from '../types/sellerRfp.types'
import styles from './EntryPathModal.module.css'

interface EntryPathModalProps {
  visible: boolean
  onClose: () => void
  onSelect: (path: EntryPath) => void
}

interface PathCardProps {
  icon: React.ReactNode
  label: string
  subtitle: string
  onClick: () => void
}

function PathCard({ icon, label, subtitle, onClick }: PathCardProps) {
  return (
    <button className={styles['path-card']} onClick={onClick}>
      <span className={styles['path-icon']}>{icon}</span>
      <Vertical style={{ gap: '2px', flex: 1, textAlign: 'left' }}>
        <Texto category="p1" weight="600">{label}</Texto>
        <Texto category="p3" appearance="medium">{subtitle}</Texto>
      </Vertical>
    </button>
  )
}

export function EntryPathModal({ visible, onClose, onSelect }: EntryPathModalProps) {
  return (
    <Modal
      visible={visible}
      onCancel={onClose}
      footer={null}
      width={480}
      centered
      title={null}
      closable
    >
      <Vertical style={{ gap: '20px', padding: '8px 0' }}>
        <Vertical style={{ gap: '4px' }}>
          <Texto category="h4" weight="600">New RFP Response</Texto>
          <Texto category="p2" appearance="medium">
            Choose how to build your detail rows
          </Texto>
        </Vertical>

        <Vertical style={{ gap: '10px' }}>
          <PathCard
            icon={<AppstoreOutlined />}
            label="Build from Matrix"
            subtitle="Select products and terminals to generate a cartesian grid of detail rows"
            onClick={() => onSelect('matrix')}
          />
          <PathCard
            icon={<UploadOutlined />}
            label="Upload Buyer's RFP"
            subtitle="Import a spreadsheet or PDF from the buyer to pre-populate detail rows"
            onClick={() => onSelect('upload')}
          />
          <PathCard
            icon={<CopyOutlined />}
            label="Copy Previous Response"
            subtitle="Start from an existing RFP response and adjust pricing or terms"
            onClick={() => onSelect('copy')}
          />
          <PathCard
            icon={<PlusOutlined />}
            label="Add Rows Manually"
            subtitle="Add individual product × terminal rows one at a time"
            onClick={() => onSelect('manual')}
          />
        </Vertical>
      </Vertical>
    </Modal>
  )
}
