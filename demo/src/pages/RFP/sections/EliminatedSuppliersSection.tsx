import { Vertical, Texto } from '@gravitate-js/excalibrr'
import { Collapse, Table } from 'antd'
import type { Supplier, EliminatedSupplierInfo } from '../rfp.types'
import { formatPrice } from '../rfp.data'
import styles from './EliminatedSuppliersSection.module.css'

const { Panel } = Collapse

interface EliminatedSuppliersSectionProps {
  eliminatedSuppliers: Map<number, EliminatedSupplierInfo[]>
  allSuppliers: Supplier[] // For potential future use (e.g., cross-referencing)
  currentRound: number
}

export function EliminatedSuppliersSection({
  eliminatedSuppliers,
  allSuppliers: _allSuppliers, // Prefixed with _ to indicate intentionally unused
  currentRound,
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
  const columns = [
    {
      title: 'Supplier',
      dataIndex: 'supplierName',
      key: 'name',
      width: '40%',
    },
    {
      title: 'Elimination Price',
      dataIndex: 'priceAtElimination',
      key: 'price',
      width: '30%',
      render: (price: number) => formatPrice(price),
    },
    {
      title: 'Status',
      key: 'status',
      width: '30%',
      render: (_: unknown, record: EliminatedSupplierInfo) => (
        <span className={styles.statusBadge}>Eliminated R{record.eliminatedInRound}</span>
      ),
    },
  ]

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
