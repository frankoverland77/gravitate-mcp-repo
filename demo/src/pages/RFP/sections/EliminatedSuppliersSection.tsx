import { Vertical, Texto, GraviButton } from '@gravitate-js/excalibrr'
import { Collapse, Table } from 'antd'
import { RollbackOutlined } from '@ant-design/icons'
import type { Supplier, EliminatedSupplierInfo } from '../rfp.types'
import { formatPrice } from '../rfp.data'
import styles from './EliminatedSuppliersSection.module.css'

const { Panel } = Collapse

interface EliminatedSuppliersSectionProps {
  eliminatedSuppliers: Map<number, EliminatedSupplierInfo[]>
  allSuppliers: Supplier[] // For potential future use (e.g., cross-referencing)
  currentRound: number
  onRestoreSupplier?: (supplierId: string, fromRound: number) => void
}

export function EliminatedSuppliersSection({
  eliminatedSuppliers,
  allSuppliers: _allSuppliers, // Prefixed with _ to indicate intentionally unused
  currentRound,
  onRestoreSupplier,
}: EliminatedSuppliersSectionProps) {
  // Only show on Round 2+
  if (currentRound < 2) return null

  // Get previous rounds with eliminations
  const previousRounds = Array.from(eliminatedSuppliers.keys())
    .filter((r) => r < currentRound)
    .sort((a, b) => b - a) // Most recent first

  if (previousRounds.length === 0) return null

  // Calculate total eliminated count
  const totalEliminated = previousRounds.reduce((sum, round) => {
    return sum + (eliminatedSuppliers.get(round)?.length || 0)
  }, 0)

  // Build table columns
  const baseColumns = [
    {
      title: 'Supplier',
      dataIndex: 'supplierName',
      key: 'name',
      width: onRestoreSupplier ? '20%' : '25%',
    },
    {
      title: 'Elimination Price',
      dataIndex: 'priceAtElimination',
      key: 'price',
      width: onRestoreSupplier ? '12%' : '15%',
      render: (price: number) => formatPrice(price),
    },
    {
      title: 'Reason',
      dataIndex: 'reason',
      key: 'reason',
      width: onRestoreSupplier ? '30%' : '40%',
      render: (reason: string) => (
        <span style={{ color: 'var(--theme-color-2)' }}>{reason || '—'}</span>
      ),
    },
    {
      title: 'Status',
      key: 'status',
      width: onRestoreSupplier ? '15%' : '20%',
      render: (_: unknown, record: EliminatedSupplierInfo) => (
        <span className={styles.statusBadge}>Eliminated R{record.eliminatedInRound}</span>
      ),
    },
  ]

  // Add actions column if onRestoreSupplier is provided
  const columns = onRestoreSupplier
    ? [
        ...baseColumns,
        {
          title: 'Actions',
          key: 'actions',
          width: '23%',
          render: (_: unknown, record: EliminatedSupplierInfo) => (
            <GraviButton
              type="link"
              buttonText={`Send to Round ${currentRound}`}
              icon={<RollbackOutlined />}
              onClick={() => onRestoreSupplier(record.supplierId, record.eliminatedInRound)}
            />
          ),
        },
      ]
    : baseColumns

  return (
    <Vertical className={styles.eliminatedSection}>
      <Collapse defaultActiveKey={[]} className={styles.collapse}>
        {previousRounds.map((round) => {
          const eliminated = eliminatedSuppliers.get(round) || []
          const count = eliminated.length

          return (
            <Panel
              header={
                <Texto category="p2" weight="600">
                  Show {count} eliminated supplier{count !== 1 ? 's' : ''} from Round {round}
                </Texto>
              }
              key={`round-${round}`}
              className={styles.panel}
            >
              <Table
                columns={columns}
                dataSource={eliminated}
                rowKey="supplierId"
                pagination={false}
                size="small"
                className={styles.eliminatedTable}
              />
            </Panel>
          )
        })}
      </Collapse>

      <Texto category="p2" appearance="medium" className={styles.totalLabel}>
        Total eliminated: {totalEliminated} supplier{totalEliminated !== 1 ? 's' : ''}
      </Texto>
    </Vertical>
  )
}
