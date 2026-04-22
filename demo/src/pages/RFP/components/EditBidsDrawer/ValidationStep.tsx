/**
 * Validation Step
 *
 * Step 3 of the Edit Bids wizard
 * Reviews validation errors and warnings, shows change summary
 */

import { Vertical, Horizontal, Texto, GraviButton } from '@gravitate-js/excalibrr'
import {
  CheckCircleOutlined,
  WarningOutlined,
  CloseCircleOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
} from '@ant-design/icons'
import { Alert, Table, Tag } from 'antd'
import type { BidValidationResult, BidChange } from '../../rfp.types'
import { calculateChangeSummary } from '../../utils/bidValidation'
import styles from './EditBidsDrawer.module.css'

interface ValidationStepProps {
  validationResult: BidValidationResult
  onConfirm: () => void
  onBack: () => void
}

export function ValidationStep({ validationResult, onConfirm, onBack }: ValidationStepProps) {
  const summary = calculateChangeSummary(validationResult.changes)

  // Table columns for changes
  const columns = [
    {
      title: 'Supplier',
      dataIndex: 'supplierName',
      key: 'supplier',
      width: 120,
    },
    {
      title: 'Product',
      dataIndex: 'product',
      key: 'product',
      width: 100,
    },
    {
      title: 'Location',
      dataIndex: 'location',
      key: 'location',
      width: 100,
    },
    {
      title: 'Field',
      dataIndex: 'field',
      key: 'field',
      width: 120,
    },
    {
      title: 'Old Value',
      dataIndex: 'oldValue',
      key: 'oldValue',
      width: 100,
      render: (value: string | number) =>
        typeof value === 'number' ? `$${value.toFixed(2)}` : value,
    },
    {
      title: 'New Value',
      dataIndex: 'newValue',
      key: 'newValue',
      width: 100,
      render: (value: string | number, record: BidChange) => {
        const formatted = typeof value === 'number' ? `$${value.toFixed(2)}` : value
        if (record.changeType === 'price' && typeof record.oldValue === 'number') {
          const diff = (value as number) - (record.oldValue as number)
          const icon =
            diff < 0 ? (
              <ArrowDownOutlined style={{ color: 'var(--theme-success-color)' }} />
            ) : (
              <ArrowUpOutlined style={{ color: 'var(--theme-error-color)' }} />
            )
          return (
            <Horizontal gap={4} alignItems='center'>
              {formatted} {icon}
            </Horizontal>
          )
        }
        return formatted
      },
    },
    {
      title: 'Type',
      dataIndex: 'changeType',
      key: 'type',
      width: 100,
      render: (type: string) => {
        const colorMap: Record<string, string> = {
          price: 'blue',
          formula: 'purple',
          provision_type: 'orange',
        }
        return <Tag color={colorMap[type] || 'default'}>{type.replace('_', ' ')}</Tag>
      },
    },
  ]

  return (
    <Vertical className={styles.stepContent} height="auto">
      <Texto category='h4' weight='600' className='mb-2'>
        Step 3: Review Changes
      </Texto>

      <Texto category='p1' appearance='medium' className='mb-4'>
        Review the detected changes and any validation issues before applying them.
      </Texto>

      {/* Validation Status */}
      {validationResult.isValid ? (
        <Alert
          type='success'
          showIcon
          icon={<CheckCircleOutlined />}
          message='Validation Passed'
          description={`All changes are valid. ${summary.totalChanges} change(s) ready to apply.`}
          className='mb-3'
        />
      ) : (
        <Alert
          type='error'
          showIcon
          icon={<CloseCircleOutlined />}
          message='Validation Failed'
          description={
            <Vertical gap={4}>
              {validationResult.errors.slice(0, 5).map((err, idx) => (
                <Texto key={idx} category='p2'>
                  {err.field}: {err.message}
                </Texto>
              ))}
              {validationResult.errors.length > 5 && (
                <Texto category='p2' appearance='medium'>
                  ...and {validationResult.errors.length - 5} more errors
                </Texto>
              )}
            </Vertical>
          }
          className='mb-3'
        />
      )}

      {/* Warnings */}
      {validationResult.warnings.length > 0 && (
        <Alert
          type='warning'
          showIcon
          icon={<WarningOutlined />}
          message={`${validationResult.warnings.length} Warning(s)`}
          description={
            <Vertical gap={4}>
              {validationResult.warnings.slice(0, 5).map((warn, idx) => (
                <Texto key={idx} category='p2'>
                  {warn.message}
                </Texto>
              ))}
              {validationResult.warnings.length > 5 && (
                <Texto category='p2' appearance='medium'>
                  ...and {validationResult.warnings.length - 5} more warnings
                </Texto>
              )}
            </Vertical>
          }
          className='mb-3'
        />
      )}

      {/* Summary Stats */}
      <Horizontal gap={16} className='mb-4'>
        <div className={styles.statCard}>
          <Texto category='h3' weight='600'>
            {summary.totalChanges}
          </Texto>
          <Texto category='p2' appearance='medium'>
            Total Changes
          </Texto>
        </div>
        <div className={styles.statCard}>
          <Texto category='h3' weight='600'>
            {summary.priceChanges}
          </Texto>
          <Texto category='p2' appearance='medium'>
            Price Changes
          </Texto>
        </div>
        <div className={styles.statCard}>
          <Texto category='h3' weight='600'>
            {summary.suppliersAffected}
          </Texto>
          <Texto category='p2' appearance='medium'>
            Suppliers Affected
          </Texto>
        </div>
        <div className={styles.statCard}>
          <Texto category='h3' weight='600'>
            {summary.avgPriceChange >= 0 ? '+' : ''}
            {(summary.avgPriceChange * 100).toFixed(1)}¢
          </Texto>
          <Texto category='p2' appearance='medium'>
            Avg Price Change
          </Texto>
        </div>
      </Horizontal>

      {/* Changes Table */}
      {validationResult.changes.length > 0 && (
        <Vertical className='mb-4'>
          <Texto category='p1' weight='600' className='mb-2'>
            Detailed Changes
          </Texto>
          <Table
            dataSource={validationResult.changes.map((c, idx) => ({ ...c, key: idx }))}
            columns={columns}
            size='small'
            pagination={validationResult.changes.length > 10 ? { pageSize: 10 } : false}
            scroll={{ x: 'max-content' }}
          />
        </Vertical>
      )}

      {/* Actions */}
      <Horizontal justifyContent='space-between' className='mt-4'>
        <GraviButton buttonText='Back to Upload' type='text' onClick={onBack} />
        <GraviButton
          buttonText='Confirm Changes'
          success
          onClick={onConfirm}
          disabled={!validationResult.isValid && validationResult.errors.length > 0}
        />
      </Horizontal>
    </Vertical>
  )
}
