/**
 * Contract Header Sidebar
 *
 * Left-side vertical panel showing contract header info matching the
 * Figma design: contract title card with status badge, contract type tag,
 * description card, counterparty card, dates card, and require quantities card.
 *
 * 445px expanded, 44px collapsed.
 */

import { useState } from 'react'
import { Horizontal, Texto, Vertical } from '@gravitate-js/excalibrr'
import { CheckCircleFilled, EditOutlined, LeftOutlined, RightOutlined } from '@ant-design/icons'
import { Button, Tag, Collapse, Divider } from 'antd'
import dayjs from 'dayjs'

import type { ContractHeader, ContractStatus } from '../../types/contract.types'
import styles from './ContractHeaderSidebar.module.css'

interface ContractHeaderSidebarProps {
  header: ContractHeader
  contractName?: string
  contractStatus?: ContractStatus
  createdAt?: Date
  onEditClick: () => void
}

const STATUS_CONFIG: Record<ContractStatus, { label: string; color: string; icon: boolean }> = {
  active: { label: 'Accepted', color: 'success', icon: true },
  draft: { label: 'Draft', color: 'default', icon: false },
  pending: { label: 'Pending', color: 'warning', icon: false },
  expired: { label: 'Expired', color: 'error', icon: false },
}

function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Vertical
      flex="0 0 auto"
      height="auto"
      className={styles.sectionCard}
      style={{ border: '1px solid var(--gray-200)', borderRadius: 8, backgroundColor: 'white' }}
    >
      <Horizontal className={styles.sectionCardHeader}>
        <Texto category='h5' weight='600'>
          {title}
        </Texto>
      </Horizontal>
      <div className={styles.sectionCardBody}>{children}</div>
    </Vertical>
  )
}

function FieldRow({ label, value, primary }: { label: string; value: string; primary?: boolean }) {
  return (
    <Horizontal justifyContent='space-between' alignItems='baseline'>
      <Texto category='p2' appearance='medium'>
        {label}
      </Texto>
      <Texto
        appearance='primary'
        category={primary ? 'h5' : 'p2'}
        weight={primary ? '600' : undefined}
        style={{ textAlign: 'right' }}
      >
        {value || 'N/A'}
      </Texto>
    </Horizontal>
  )
}

export function ContractHeaderSidebar({
  header,
  contractName,
  contractStatus,
  createdAt,
  onEditClick,
}: ContractHeaderSidebarProps) {
  const [collapsed, setCollapsed] = useState(false)

  const statusInfo = contractStatus ? STATUS_CONFIG[contractStatus] : null

  if (collapsed) {
    return (
      <div className={styles.collapsedContainer}>
        <span className={styles.expandToggle} onClick={() => setCollapsed(false)} title='Expand sidebar'>
          <RightOutlined />
        </span>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      {/* Collapse toggle */}
      <Horizontal justifyContent='flex-end'>
        <span className={styles.collapseToggle} onClick={() => setCollapsed(true)} title='Collapse sidebar'>
          <LeftOutlined />
        </span>
      </Horizontal>

      {/* Contract Title Card */}
      <div className={styles.titleCard}>
        <Horizontal justifyContent='space-between' alignItems='flex-start'>
          <Vertical>
            <Texto category='h4' weight='600'>
              {contractName || 'New Contract'}
            </Texto>
            <Texto category='p2' appearance='medium'>
              {createdAt ? `Created: ${dayjs(createdAt).format('MM-DD-YYYY h:mm A')}` : 'New'}
            </Texto>
          </Vertical>
          {statusInfo && (
            <Vertical gap={4} alignItems='flex-end'>
              <Texto
                category='h5'
                appearance={
                  statusInfo.color === 'success'
                    ? 'success'
                    : statusInfo.color === 'error'
                      ? 'error'
                      : statusInfo.color === 'warning'
                        ? 'warning'
                        : 'primary'
                }
              >
                {statusInfo.label}
              </Texto>
              {statusInfo.icon && (
                <CheckCircleFilled style={{ fontSize: 36, color: 'var(--theme-color-success, #52c41a)' }} />
              )}
            </Vertical>
          )}
        </Horizontal>
      </div>

      {/* Edit Header Info button */}
      <div style={{ marginTop: 12 }}>
        <Button icon={<EditOutlined />} onClick={onEditClick} block>
          Edit Header Info
        </Button>
      </div>

      {/* CONTRACT TYPE row */}
      <Horizontal justifyContent='space-between' alignItems='center' style={{ marginTop: 12 }}>
        <Texto
          category='p2'
          appearance='medium'
          weight='600'
          style={{ textTransform: 'uppercase', letterSpacing: '3px' }}
        >
          Contract Type
        </Texto>
        <Tag color='green'>{header.contractType || 'N/A'}</Tag>
      </Horizontal>

      {/* Scrollable content */}
      <div className={styles.scrollContent}>
        <Collapse
          ghost
          defaultActiveKey={[]}
          className={styles.collapseSection}
        >
          <Collapse.Panel
            header={
              <Texto category='h5' weight='600' style={{ color: 'rgba(0, 0, 0, 0.85)' }}>
                Optional Fields
              </Texto>
            }
            key='optional'
          >
            {/* Description */}
            <SectionCard title='Description'>
              <Texto category='p1'>{header.description || 'N/A'}</Texto>
            </SectionCard>

            {/* Counterparty Info */}
            <SectionCard title='Counterparty Info'>
              <FieldRow label='Internal Company' value={header.internalParty} primary />
              <FieldRow label='Internal Contact' value={header.internalContact || ''} />
              <Divider style={{ margin: '12px 0' }} />
              <FieldRow label='External Company' value={header.externalParty} primary />
              <FieldRow label='External Contact' value={header.externalContact || ''} />
            </SectionCard>

            {/* Contract Dates */}
            <SectionCard title='Contract Dates'>
              <FieldRow
                label='Effective Dates'
                value={`${dayjs(header.startDate).format('MM/DD/YYYY')} - ${dayjs(header.endDate).format('MM/DD/YYYY')}`}
                primary
              />
              <FieldRow
                label='Contract Date'
                value={header.contractDate ? dayjs(header.contractDate).format('MM/DD/YYYY') : ''}
              />
              <FieldRow label='Contract Calendar' value={header.contractCalendar || ''} />
            </SectionCard>

            {/* Require Quantities */}
            <SectionCard title='Require Quantities'>
              <Texto category='p1' appearance={header.requireQuantities ? 'success' : 'primary'}>
                {header.requireQuantities ? 'Yes' : 'No'}
              </Texto>
            </SectionCard>
          </Collapse.Panel>
        </Collapse>
      </div>
    </div>
  )
}
