import { useMemo } from 'react'
import { Vertical, Horizontal, Texto, GraviButton, NotificationMessage } from '@gravitate-js/excalibrr'
import { FileExcelOutlined, FilePdfOutlined, CopyOutlined } from '@ant-design/icons'
import type { SellerRFP } from '../types/sellerRfp.types'
import {
  formatPrice,
  formatMarginCpg,
  formatFormulaDiff,
  formatVolume,
  getMarginColor,
  COST_TYPE_LABELS,
  COST_TYPE_COLORS,
  formatFormulaDisplay,
  PAYMENT_TERMS_OPTIONS,
} from '../types/sellerRfp.types'
import { ALLOCATION_PERIOD_OPTIONS } from '../../RFP/rfp.types'
import styles from './SummaryExportTab.module.css'

interface SummaryExportTabProps {
  rfp: SellerRFP
}

export function SummaryExportTab({ rfp }: SummaryExportTabProps) {
  const stats = useMemo(() => {
    const readyDetails = rfp.details.filter((d) => d.status === 'ready')
    const allDetails = rfp.details

    const totalVolume = allDetails.reduce((sum, d) => sum + (d.volume || 0), 0)
    const marginsWithVolume = readyDetails.filter((d) => d.margin !== null && d.volume)
    const weightedMargin = marginsWithVolume.length > 0
      ? marginsWithVolume.reduce((sum, d) => sum + (d.margin! * (d.volume || 0)), 0) /
        marginsWithVolume.reduce((sum, d) => sum + (d.volume || 0), 0)
      : 0

    const uniqueProducts = new Set(allDetails.map((d) => d.product))
    const uniqueTerminals = new Set(allDetails.map((d) => d.terminal))

    return {
      totalVolume,
      weightedMargin: Math.round(weightedMargin * 100) / 100,
      productCount: uniqueProducts.size,
      terminalCount: uniqueTerminals.size,
      readyCount: readyDetails.length,
      totalCount: allDetails.length,
    }
  }, [rfp.details])

  const handleExportExcel = () => {
    NotificationMessage('Export Started', `Exporting ${rfp.name} to Excel...`, false)
  }

  const handleExportPDF = () => {
    NotificationMessage('Export Started', `Exporting ${rfp.name} to PDF...`, false)
  }

  const handleCopy = () => {
    NotificationMessage('Copied', 'Summary copied to clipboard.', false)
  }

  const allocationLabel = rfp.terms.allocationPeriod
    ? ALLOCATION_PERIOD_OPTIONS.find((o) => o.value === rfp.terms.allocationPeriod)?.label || rfp.terms.allocationPeriod
    : '—'
  const paymentLabel = rfp.terms.paymentTerms
    ? PAYMENT_TERMS_OPTIONS.find((o) => o.value === rfp.terms.paymentTerms)?.label || rfp.terms.paymentTerms
    : '—'

  return (
    <Vertical style={{ gap: '32px' }}>
      {/* Summary Cards */}
      <div className={styles['stats-row']}>
        <div className={styles['stat-card']}>
          <Texto category="h2" weight="700">{formatVolume(stats.totalVolume)}</Texto>
          <Texto category="p2" appearance="medium">Total Volume</Texto>
        </div>
        <div className={styles['stat-card']}>
          <Texto category="h2" weight="700" style={{ color: getMarginColor(stats.weightedMargin) === 'green' ? '#52c41a' : getMarginColor(stats.weightedMargin) === 'yellow' ? '#faad14' : getMarginColor(stats.weightedMargin) === 'red' ? '#ff4d4f' : undefined }}>
            {formatMarginCpg(stats.weightedMargin)}
          </Texto>
          <Texto category="p2" appearance="medium">Weighted Avg Margin</Texto>
        </div>
        <div className={styles['stat-card']}>
          <Texto category="h2" weight="700">{stats.productCount}</Texto>
          <Texto category="p2" appearance="medium">Products</Texto>
        </div>
        <div className={styles['stat-card']}>
          <Texto category="h2" weight="700">{stats.terminalCount}</Texto>
          <Texto category="p2" appearance="medium">Terminals</Texto>
        </div>
        <div className={styles['stat-card']}>
          <Texto category="h2" weight="700">{stats.readyCount}/{stats.totalCount}</Texto>
          <Texto category="p2" appearance="medium">Details Ready</Texto>
        </div>
      </div>

      {/* Terms Summary */}
      <Vertical style={{ gap: '12px' }}>
        <Texto category="h6" weight="600" style={{ textTransform: 'uppercase', letterSpacing: '0.5px', fontSize: '11px' }}>
          Terms Summary
        </Texto>
        <div className={styles['terms-grid']}>
          <div className={styles['term-item']}>
            <Texto category="p2" appearance="medium">Volume Commitment</Texto>
            <Texto category="p1" weight="500">{rfp.terms.volumeCommitment ? `${rfp.terms.volumeCommitment.toLocaleString()} gal/mo` : '—'}</Texto>
          </div>
          <div className={styles['term-item']}>
            <Texto category="p2" appearance="medium">Contract Period</Texto>
            <Texto category="p1" weight="500">
              {rfp.terms.contractStart && rfp.terms.contractEnd
                ? `${new Date(rfp.terms.contractStart).toLocaleDateString()} – ${new Date(rfp.terms.contractEnd).toLocaleDateString()}`
                : '—'}
            </Texto>
          </div>
          <div className={styles['term-item']}>
            <Texto category="p2" appearance="medium">Allocation Period</Texto>
            <Texto category="p1" weight="500">{allocationLabel}</Texto>
          </div>
          <div className={styles['term-item']}>
            <Texto category="p2" appearance="medium">Payment Terms</Texto>
            <Texto category="p1" weight="500">{paymentLabel}</Texto>
          </div>
          <div className={styles['term-item']}>
            <Texto category="p2" appearance="medium">Ratability</Texto>
            <Texto category="p1" weight="500">
              {rfp.terms.ratabilityMin !== null && rfp.terms.ratabilityMax !== null
                ? `${rfp.terms.ratabilityMin}% – ${rfp.terms.ratabilityMax}%`
                : '—'}
            </Texto>
          </div>
          <div className={styles['term-item']}>
            <Texto category="p2" appearance="medium">Deficiency Penalty</Texto>
            <Texto category="p1" weight="500">{rfp.terms.penaltyCpg !== null ? `${rfp.terms.penaltyCpg}¢/gal` : '—'}</Texto>
          </div>
        </div>
      </Vertical>

      {/* Detail Summary Table */}
      <Vertical style={{ gap: '12px' }}>
        <Texto category="h6" weight="600" style={{ textTransform: 'uppercase', letterSpacing: '0.5px', fontSize: '11px' }}>
          Detail Summary
        </Texto>

        <div className={styles['summary-table']}>
          <table>
            <thead>
              <tr>
                <th>Product</th>
                <th>Terminal</th>
                <th>Cost Type</th>
                <th>Cost Price</th>
                <th>Sale Formula</th>
                <th>Formula Diff</th>
                <th>Sale Price</th>
                <th>Margin</th>
                <th>Volume</th>
              </tr>
            </thead>
            <tbody>
              {rfp.details.map((detail) => {
                const marginColor = getMarginColor(detail.margin)
                return (
                  <tr key={detail.id}>
                    <td><Texto category="p2">{detail.product}</Texto></td>
                    <td><Texto category="p2">{detail.terminal}</Texto></td>
                    <td>
                      {detail.costType ? (
                        <span
                          className={styles['cost-badge']}
                          style={{
                            color: COST_TYPE_COLORS[detail.costType].color,
                            backgroundColor: COST_TYPE_COLORS[detail.costType].background,
                          }}
                        >
                          {COST_TYPE_LABELS[detail.costType]}
                        </span>
                      ) : (
                        <Texto category="p2" appearance="medium">—</Texto>
                      )}
                    </td>
                    <td><Texto category="p2">{formatPrice(detail.costPrice)}</Texto></td>
                    <td><Texto category="p2" appearance="medium">{formatFormulaDisplay(detail.saleFormula) || '—'}</Texto></td>
                    <td><Texto category="p2" style={{ fontWeight: 500 }}>{formatFormulaDiff(detail.formulaDiff)}</Texto></td>
                    <td><Texto category="p2">{formatPrice(detail.salePrice)}</Texto></td>
                    <td>
                      <Texto
                        category="p2"
                        weight="600"
                        style={{
                          color: marginColor === 'green' ? '#52c41a' : marginColor === 'yellow' ? '#faad14' : marginColor === 'red' ? '#ff4d4f' : undefined,
                        }}
                      >
                        {formatMarginCpg(detail.margin)}
                      </Texto>
                    </td>
                    <td><Texto category="p2">{detail.volume ? `${detail.volume.toLocaleString()}` : '—'}</Texto></td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </Vertical>

      {/* Export Actions */}
      <Vertical style={{ gap: '12px' }}>
        <Texto category="h6" weight="600" style={{ textTransform: 'uppercase', letterSpacing: '0.5px', fontSize: '11px' }}>
          Export
        </Texto>
        <Horizontal style={{ gap: '12px' }}>
          <GraviButton
            buttonText="Export to Excel"
            icon={<FileExcelOutlined />}
            theme1
            onClick={handleExportExcel}
          />
          <GraviButton
            buttonText="Export to PDF"
            icon={<FilePdfOutlined />}
            onClick={handleExportPDF}
          />
          <GraviButton
            buttonText="Copy Summary"
            icon={<CopyOutlined />}
            onClick={handleCopy}
          />
        </Horizontal>
      </Vertical>
    </Vertical>
  )
}
