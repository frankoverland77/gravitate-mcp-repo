import { Texto, Horizontal, Vertical } from '@gravitate-js/excalibrr';
import { Progress } from 'antd';
import { CheckCircleOutlined, WarningOutlined } from '@ant-design/icons';
import styles from './BenchmarkPreview.module.css';

interface MatchingSummaryCardProps {
  matchedCount: number;
  rollupCount: number;
  totalProducts: number;
  matchPercentage: number;
}

export function MatchingSummaryCard({
  matchedCount,
  rollupCount,
  totalProducts,
  matchPercentage,
}: MatchingSummaryCardProps) {
  return (
    <div className={styles.card}>
      <Texto category="p2" appearance="medium" weight="600" className={styles.cardTitle}>
        MATCHING SUMMARY
      </Texto>

      <Progress
        percent={matchPercentage}
        strokeColor="#51b073"
        trailColor="#faad14"
        showInfo={false}
        className={styles.progressBar}
      />

      <Horizontal justifyContent="space-between">
        <Vertical gap="4px">
          <Horizontal alignItems="center" gap="6px">
            <CheckCircleOutlined className={`${styles.matchIcon} ${styles.matchIconSuccess}`} />
            <Texto category="p2">
              <strong>{matchedCount}</strong> direct matches
            </Texto>
          </Horizontal>
          <Horizontal alignItems="center" gap="6px">
            <WarningOutlined className={`${styles.matchIcon} ${styles.matchIconWarning}`} />
            <Texto category="p2">
              <strong>{rollupCount}</strong> using rollup
            </Texto>
          </Horizontal>
        </Vertical>
        <Vertical className={styles.rightAlign}>
          <Texto category="h4" weight="600">
            {matchedCount}/{totalProducts}
          </Texto>
          <Texto category="p2" appearance="medium">
            products matched
          </Texto>
        </Vertical>
      </Horizontal>
    </div>
  );
}
