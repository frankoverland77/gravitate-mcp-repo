import { useState } from 'react';
import { Texto, Horizontal, Vertical } from '@gravitate-js/excalibrr';
import { DownOutlined } from '@ant-design/icons';
import styles from './BenchmarkPreview.module.css';

interface ProductDetail {
  productId: string;
  productName: string;
  location: string;
  matchType: 'direct' | 'rollup';
  delta: number;
}

interface ProductBreakdownPanelProps {
  productDetails: ProductDetail[];
}

export function ProductBreakdownPanel({ productDetails }: ProductBreakdownPanelProps) {
  const [showBreakdown, setShowBreakdown] = useState(false);

  return (
    <div className={styles.card}>
      <Horizontal
        justifyContent="space-between"
        alignItems="center"
        className={styles.breakdownHeader}
        onClick={() => setShowBreakdown(!showBreakdown)}
      >
        <Texto category="p2" appearance="medium" weight="600">
          PRODUCT BREAKDOWN
        </Texto>
        <DownOutlined
          className={`${styles.breakdownToggle} ${showBreakdown ? styles.breakdownToggleOpen : ''}`}
        />
      </Horizontal>

      {showBreakdown && (
        <div className={styles.breakdownContent}>
          {productDetails.map((product) => (
            <Horizontal
              key={product.productId}
              justifyContent="space-between"
              className={styles.breakdownRow}
            >
              <Vertical gap="2px">
                <Texto category="p2" weight="600">
                  {product.productName}
                </Texto>
                <Texto
                  category="p2"
                  appearance="medium"
                  className={styles.breakdownProductLocation}
                >
                  {product.location}
                </Texto>
              </Vertical>
              <Horizontal alignItems="center" gap="12px">
                <div
                  className={`${styles.matchBadge} ${product.matchType === 'direct' ? styles.matchBadgeDirect : styles.matchBadgeRollup}`}
                >
                  <Texto
                    category="p2"
                    className={
                      product.matchType === 'direct'
                        ? styles.matchBadgeTextDirect
                        : styles.matchBadgeTextRollup
                    }
                  >
                    {product.matchType === 'direct' ? 'Direct' : 'Rollup'}
                  </Texto>
                </div>
                <Texto
                  category="p2"
                  weight="600"
                  className={product.delta <= 0 ? styles.deltaPositive : styles.deltaNegative}
                >
                  {product.delta >= 0 ? '+' : ''}
                  {product.delta.toFixed(2)}
                </Texto>
              </Horizontal>
            </Horizontal>
          ))}
        </div>
      )}
    </div>
  );
}
