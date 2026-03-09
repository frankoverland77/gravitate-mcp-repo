/**
 * Copy Deal Modal
 *
 * Modal for copying contract details from an existing contract.
 */

import { useState, useCallback, useMemo } from 'react'
import { Vertical, Horizontal, Texto, GraviButton } from '@gravitate-js/excalibrr'
import { Modal, Input, Radio, Switch } from 'antd'
import { SearchOutlined, CopyOutlined } from '@ant-design/icons'

import { MOCK_CONTRACTS, MOCK_CONTRACT_DETAILS } from '../../data/contract.data'
import type { ContractDetail } from '../../types/contract.types'
import styles from './CopyDealModal.module.css'

interface CopyDealModalProps {
  open: boolean
  onClose: () => void
  onCopy: (details: ContractDetail[]) => void
}

// Format date for display
function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date)
}

export function CopyDealModal({ open, onClose, onCopy }: CopyDealModalProps) {
  const [searchText, setSearchText] = useState('')
  const [selectedContractId, setSelectedContractId] = useState<string | null>(null)
  const [includeFormulas, setIncludeFormulas] = useState(true)

  // Filter contracts based on search
  const filteredContracts = useMemo(() => {
    if (!searchText.trim()) return MOCK_CONTRACTS

    const search = searchText.toLowerCase()
    return MOCK_CONTRACTS.filter(
      (contract) =>
        contract.name.toLowerCase().includes(search) ||
        contract.externalParty.toLowerCase().includes(search)
    )
  }, [searchText])

  // Get selected contract
  const selectedContract = useMemo(
    () => MOCK_CONTRACTS.find((c) => c.id === selectedContractId),
    [selectedContractId]
  )

  // Reset state on close
  const handleClose = useCallback(() => {
    setSearchText('')
    setSelectedContractId(null)
    setIncludeFormulas(true)
    onClose()
  }, [onClose])

  // Handle copy
  const handleCopy = useCallback(() => {
    if (!selectedContractId) return

    // Get mock details (in real app, would fetch from API)
    const copiedDetails = MOCK_CONTRACT_DETAILS.map((detail) => ({
      ...detail,
      id: `copy-${Date.now()}-${detail.id}`,
      formula: includeFormulas ? detail.formula : undefined,
      status: includeFormulas && detail.formula ? detail.status : 'empty',
    })) as ContractDetail[]

    onCopy(copiedDetails)
  }, [selectedContractId, includeFormulas, onCopy])

  return (
    <Modal
      open={open}
      onCancel={handleClose}
      title='Copy from Existing Contract'
      footer={
        <Horizontal justifyContent='space-between' alignItems='center'>
          <Horizontal gap={8} alignItems='center'>
            <Switch checked={includeFormulas} onChange={setIncludeFormulas} size='small' />
            <Texto category='p2'>Include formulas</Texto>
          </Horizontal>
          <Horizontal gap={8}>
            <GraviButton buttonText='Cancel' onClick={handleClose} />
            <GraviButton
              buttonText='Copy Details'
              theme1
              icon={<CopyOutlined />}
              onClick={handleCopy}
              disabled={!selectedContractId}
            />
          </Horizontal>
        </Horizontal>
      }
      width={600}
    >
      <Vertical gap={16}>
        {/* Search */}
        <Input
          placeholder='Search contracts by name or counterparty...'
          prefix={<SearchOutlined style={{ color: 'var(--theme-color-3)' }} />}
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          allowClear
        />

        {/* Contract List */}
        <Radio.Group
          value={selectedContractId}
          onChange={(e) => setSelectedContractId(e.target.value)}
          style={{ width: '100%' }}
        >
          <Vertical className={styles.contractList}>
            {filteredContracts.map((contract) => (
              <Radio key={contract.id} value={contract.id} className={styles.contractItem}>
                <Vertical style={{ marginLeft: 8 }}>
                  <Texto category='p1' weight='500'>
                    {contract.name}
                  </Texto>
                  <Horizontal gap={16}>
                    <Texto category='p2' appearance='medium'>
                      {contract.externalParty}
                    </Texto>
                    <Texto category='p2' appearance='medium'>
                      {formatDate(contract.startDate)} - {formatDate(contract.endDate)}
                    </Texto>
                    <Texto category='p2' appearance='medium'>
                      {contract.detailCount} details
                    </Texto>
                  </Horizontal>
                </Vertical>
              </Radio>
            ))}

            {filteredContracts.length === 0 && (
              <Vertical alignItems='center' className={styles.emptyState}>
                <Texto category='p2' appearance='medium'>
                  No contracts found matching "{searchText}"
                </Texto>
              </Vertical>
            )}
          </Vertical>
        </Radio.Group>

        {/* Preview */}
        {selectedContract && (
          <Vertical className={styles.preview}>
            <Texto category='p2' appearance='medium' weight='500' className='mb-1'>
              Preview
            </Texto>
            <Texto category='p2' appearance='medium'>
              Copying {selectedContract.detailCount} detail rows from "{selectedContract.name}"
              {!includeFormulas && ' (formulas will be cleared)'}
            </Texto>
          </Vertical>
        )}
      </Vertical>
    </Modal>
  )
}
