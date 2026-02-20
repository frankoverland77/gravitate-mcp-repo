import { Texto, BBDTag } from '@gravitate-js/excalibrr'
import { Tooltip } from 'antd'
import { ExclamationCircleOutlined } from '@ant-design/icons'
import styles from './BenchmarkPreview.module.css'

interface ProductDetail {
  productId: string
  productName: string
  location: string
  matchType: 'direct' | 'rollup' | 'none'
  delta: number
  hasMissingPrices?: boolean
  availablePriceCount?: number
  totalPriceCount?: number
}

interface ProductBreakdownPanelProps {
  productDetails: ProductDetail[]
}

export function ProductBreakdownPanel({ productDetails }: ProductBreakdownPanelProps) {
  return (
    <div className={styles.card}>
      <Texto category='h5' weight='600' style={{ marginBottom: '16px' }}>
        Product Breakdown
      </Texto>

      <div className={styles.breakdownTable}>
        <div className={styles.breakdownHeaderRow}>
          <Texto category='p2' appearance='medium' className={styles.breakdownHeaderCell}>
            Product
          </Texto>
          <Texto category='p2' appearance='medium' className={styles.breakdownHeaderCell}>
            Location
          </Texto>
          <Texto category='p2' appearance='medium' className={`${styles.breakdownHeaderCell} ${styles.breakdownCellCenter}`}>
            Match
          </Texto>
          <Texto category='p2' appearance='medium' className={`${styles.breakdownHeaderCell} ${styles.breakdownCellRight}`}>
            Differential
          </Texto>
        </div>

        {productDetails.map((product) => (
          <div key={product.productId} className={styles.breakdownRow}>
            <Texto category='p2' weight='600'>
              {product.productName}
            </Texto>
            <Texto category='p2' appearance='medium'>
              {product.location}
            </Texto>
            <div className={styles.breakdownCellCenter}>
              {product.matchType === 'none' ? (
                <BBDTag danger>No Match</BBDTag>
              ) : (
                <Tooltip
                  title={
                    product.hasMissingPrices
                      ? `${product.availablePriceCount} of ${product.totalPriceCount} prices available`
                      : undefined
                  }
                >
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                    <BBDTag success={product.matchType === 'direct'} warning={product.matchType !== 'direct'}>
                      {product.matchType === 'direct' ? 'Direct' : 'Rollup'}
                    </BBDTag>
                    {product.hasMissingPrices && (
                      <ExclamationCircleOutlined style={{ color: '#faad14', fontSize: '14px' }} />
                    )}
                  </span>
                </Tooltip>
              )}
            </div>
            {product.matchType === 'none' ? (
              <Texto category='p2' appearance='medium' className={styles.breakdownCellRight}>
                —
              </Texto>
            ) : product.hasMissingPrices ? (
              <Tooltip
                title={`${product.availablePriceCount} of ${product.totalPriceCount} prices available — average calculated from available data`}
              >
                <span>
                  <Texto
                    category='p2'
                    weight='600'
                    className={`${styles.breakdownCellRight} ${product.delta <= 0 ? styles.deltaPositive : styles.deltaNegative}`}
                  >
                    {product.delta >= 0 ? '+' : ''}
                    {product.delta.toFixed(2)}*
                  </Texto>
                </span>
              </Tooltip>
            ) : (
              <Texto
                category='p2'
                weight='600'
                className={`${styles.breakdownCellRight} ${product.delta <= 0 ? styles.deltaPositive : styles.deltaNegative}`}
              >
                {product.delta >= 0 ? '+' : ''}
                {product.delta.toFixed(2)}
              </Texto>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
