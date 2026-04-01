/**
 * Contract Management Page
 *
 * Main contracts list page with GraviGrid showing all contracts in master-detail pattern.
 * Expanding a row shows nested detail grid with contract line items.
 * "Create Contract" button navigates to the create page with Quick/Full entry options.
 */

import { useState, useMemo, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { Vertical, GraviButton, GraviGrid, BBDTag, Texto } from '@gravitate-js/excalibrr'
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons'
import { Popover, Space } from 'antd'
import type { ColDef, ICellRendererParams } from 'ag-grid-community'

import { MOCK_CONTRACTS } from './data/contract.data'
import { ContractDetailCellRenderer } from './components'
import type { ContractListItem, ContractStatus } from './types/contract.types'
import styles from './ContractManagementPage.module.css'

/**
 * Status tag renderer for the grid
 */
function StatusRenderer({ value }: { value: ContractStatus }) {
  const statusConfig: Record<ContractStatus, { success?: boolean; warning?: boolean; error?: boolean; label: string }> = {
    active: { success: true, label: 'Active' },
    draft: { warning: true, label: 'Draft' },
    pending: { warning: true, label: 'Pending' },
    expired: { error: true, label: 'Expired' },
  }

  const config = statusConfig[value] || { label: value }

  return (
    <BBDTag success={config.success} warning={config.warning} error={config.error}>
      {config.label}
    </BBDTag>
  )
}

/**
 * Format date for display
 */
function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date)
}

/**
 * Format number with commas
 */
function formatNumber(value: number): string {
  return new Intl.NumberFormat('en-US').format(value)
}

/**
 * Locations renderer - shows single location or popover for multiple
 */
function LocationsRenderer({ value }: { value: string[] }) {
  if (!value || value.length === 0) return <Texto category='p2'>-</Texto>

  if (value.length === 1) {
    return <Texto category='p2'>{value[0]}</Texto>
  }

  const content = (
    <Vertical gap={4}>
      {value.map((loc, idx) => (
        <Texto key={idx} category='p2'>
          {loc}
        </Texto>
      ))}
    </Vertical>
  )

  return (
    <Popover content={content} title='Locations' trigger='hover'>
      <Texto category='p2' className={styles.popoverLink}>
        {value[0]} (+{value.length - 1})
      </Texto>
    </Popover>
  )
}

/**
 * Products renderer - shows single product or popover for multiple
 */
function ProductsRenderer({ value }: { value: string[] }) {
  if (!value || value.length === 0) return <Texto category='p2'>-</Texto>

  if (value.length === 1) {
    return <Texto category='p2'>{value[0]}</Texto>
  }

  const content = (
    <Vertical gap={4}>
      {value.map((prod, idx) => (
        <Texto key={idx} category='p2'>
          {prod}
        </Texto>
      ))}
    </Vertical>
  )

  return (
    <Popover content={content} title='Products' trigger='hover'>
      <Texto category='p2' className={styles.popoverLink}>
        {value[0]} (+{value.length - 1})
      </Texto>
    </Popover>
  )
}

/**
 * Actions cell renderer
 */
function ActionsRenderer({ data }: ICellRendererParams<ContractListItem>) {
  const navigate = useNavigate()

  const handleEdit = useCallback(() => {
    if (data?.id) {
      navigate(`/Contracts/EditContract?contractId=${data.id}`)
    }
  }, [data?.id, navigate])

  const handleDelete = useCallback(() => {
    // Delete contract action placeholder
  }, [data?.id])

  return (
    <Space size='small'>
      <GraviButton icon={<EditOutlined />} size='small' onClick={handleEdit} />
      <GraviButton icon={<DeleteOutlined />} size='small' onClick={handleDelete} />
    </Space>
  )
}

export function ContractManagementPage() {
  const navigate = useNavigate()
  const [contracts] = useState<ContractListItem[]>(MOCK_CONTRACTS)

  // Column definitions matching production
  const columnDefs = useMemo<ColDef<ContractListItem>[]>(
    () => [
      // Expand/collapse control
      {
        cellRenderer: 'agGroupCellRenderer',
        headerName: '',
        maxWidth: 50,
        suppressMenu: true,
        sortable: false,
        filter: false,
      },
      // Contract ID
      {
        field: 'id',
        headerName: 'ID',
        maxWidth: 110,
        valueFormatter: ({ value }) => value?.replace('contract-', 'C-') || value,
      },
      // Status with BBDTag
      {
        field: 'status',
        headerName: 'Status',
        maxWidth: 110,
        cellRenderer: StatusRenderer,
      },
      // Contract Name (clickable link)
      {
        field: 'name',
        headerName: 'Contract Name',
        minWidth: 200,
        flex: 1,
        cellRenderer: ({ value, data }: { value: string; data: ContractListItem }) => (
          <Texto
            category='p2'
            className={styles.contractLink}
            onClick={() => handleContractClick(data)}
          >
            {value}
          </Texto>
        ),
      },
      // Counterparty
      {
        field: 'externalParty',
        headerName: 'Counterparty',
        minWidth: 160,
      },
      // Type
      {
        field: 'type',
        headerName: 'Type',
        minWidth: 120,
      },
      // Contract From
      {
        field: 'startDate',
        headerName: 'Contract From',
        minWidth: 120,
        valueFormatter: ({ value }) => formatDate(value),
      },
      // Contract To
      {
        field: 'endDate',
        headerName: 'Contract To',
        minWidth: 120,
        valueFormatter: ({ value }) => formatDate(value),
      },
      // Locations (with Popover if multiple)
      {
        field: 'locations',
        headerName: 'Locations',
        minWidth: 150,
        cellRenderer: LocationsRenderer,
        sortable: false,
        filter: false,
      },
      // Products
      {
        field: 'products',
        headerName: 'Products',
        minWidth: 150,
        cellRenderer: ProductsRenderer,
        sortable: false,
        filter: false,
      },
      // Total Volume
      {
        field: 'totalQuantity',
        headerName: 'Volume (GAL)',
        minWidth: 130,
        type: 'numericColumn',
        valueFormatter: ({ value }) => formatNumber(value),
      },
      // Details count
      {
        field: 'detailCount',
        headerName: 'Details',
        maxWidth: 90,
        type: 'numericColumn',
      },
      // Actions (pinned right)
      {
        headerName: 'Actions',
        maxWidth: 100,
        pinned: 'right',
        cellRenderer: ActionsRenderer,
        sortable: false,
        filter: false,
        suppressMenu: true,
      },
    ],
    []
  )

  const handleContractClick = useCallback((contract: ContractListItem) => {
    navigate(`/Contracts/EditContract?contractId=${contract.id}`)
  }, [navigate])

  const handleCreateContract = useCallback(() => {
    navigate('/Contracts/CreateContract')
  }, [navigate])

  return (
    <Vertical className={styles.page}>
      <Vertical flex='1' className={styles.gridContainer}>
        <GraviGrid
          agPropOverrides={{
            masterDetail: true,
            detailRowAutoHeight: true,
            detailCellRenderer: ContractDetailCellRenderer,
            getRowId: (params) => params.data.id,
            rowSelection: 'single' as const,
          }}
          columnDefs={columnDefs}
          rowData={contracts}
          storageKey='ContractManagementGrid'
          controlBarProps={{
            title: `Contracts (${contracts.length} Results)`,
            hideActiveFilters: true,
            actionButtons: (
              <GraviButton
                buttonText='Create Contract'
                success
                icon={<PlusOutlined />}
                onClick={handleCreateContract}
              />
            ),
          }}
        />
      </Vertical>
    </Vertical>
  )
}
