import { Texto, Horizontal, Vertical } from '@gravitate-js/excalibrr';
import { Progress } from 'antd';
import { CheckCircleOutlined, WarningOutlined, CloseCircleOutlined } from '@ant-design/icons';
import styles from './BenchmarkPreview.module.css';

interface MatchingSummaryCardProps {
  matchedCount: number;
  rollupCount: number;
  noMatchCount?: number;
  totalProducts: number;
  matchPercentage: number;
}

export function MatchingSummaryCard({
  matchedCount,
  rollupCount,
  noMatchCount = 0,
  totalProducts,
  matchPercentage,
}: MatchingSummaryCardProps) {
  const coveredCount = matchedCount + rollupCount;

  return (
    <div className={styles.card}>
      <Texto category="h5" weight="600">
        Matching Summary
      </Texto>

      <Progress
        percent={matchPercentage}
        strokeColor="#52c41a"
        trailColor={noMatchCount > 0 ? '#ff4d4f' : '#faad14'}
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
          {noMatchCount > 0 && (
            <Horizontal alignItems="center" gap="6px">
              <CloseCircleOutlined className={`${styles.matchIcon} ${styles.matchIconError}`} />
              <Texto category="p2">
                <strong>{noMatchCount}</strong> no match
              </Texto>
            </Horizontal>
          )}
        </Vertical>
        <Vertical className={styles.rightAlign}>
          <Texto category="h4" weight="600">
            {coveredCount}/{totalProducts}
          </Texto>
          <Texto category="p2" appearance="medium">
            products matched
          </Texto>
        </Vertical>
      </Horizontal>
    </div>
  );
}
