/**
 * Empty State Section
 *
 * Initial screen showing 4 entry paths for creating contract details.
 * Vertical stacked button layout matching wireframe.
 */

import { Vertical, Texto } from '@gravitate-js/excalibrr'
import { FileTextOutlined, PlusOutlined, AppstoreAddOutlined, CopyOutlined } from '@ant-design/icons'

import styles from './EmptyStateSection.module.css'

interface EmptyStateSectionProps {
  onUploadFile: () => void
  onAddRowManually: () => void
  onAddMultipleRows: () => void
  onCopyFromExisting: () => void
}

interface EntryPathButtonProps {
  icon: React.ReactNode
  label: string
  onClick: () => void
}

function EntryPathButton({ icon, label, onClick }: EntryPathButtonProps) {
  return (
    <button className={styles.entryButton} onClick={onClick}>
      <span className={styles.buttonIcon}>{icon}</span>
      {label}
    </button>
  )
}

export function EmptyStateSection({
  onUploadFile,
  onAddRowManually,
  onAddMultipleRows,
  onCopyFromExisting,
}: EmptyStateSectionProps) {
  return (
    <Vertical className={styles.container} alignItems='center' justifyContent='center'>
      <div className={styles.emptyIcon}>
        <FileTextOutlined />
      </div>

      <Texto category='h4' weight='600' className='mb-1'>
        No Contract Details
      </Texto>
      <Texto category='p1' appearance='medium' className='mb-3'>
        Get started by choosing an option:
      </Texto>

      <Vertical className={styles.actionsContainer}>
        <EntryPathButton icon={<FileTextOutlined />} label='Upload from File' onClick={onUploadFile} />
        <EntryPathButton icon={<PlusOutlined />} label='Add Row Manually' onClick={onAddRowManually} />
        <EntryPathButton icon={<AppstoreAddOutlined />} label='Add Multiple Rows' onClick={onAddMultipleRows} />
        <EntryPathButton icon={<CopyOutlined />} label='Copy from Existing Deal' onClick={onCopyFromExisting} />
      </Vertical>
    </Vertical>
  )
}
