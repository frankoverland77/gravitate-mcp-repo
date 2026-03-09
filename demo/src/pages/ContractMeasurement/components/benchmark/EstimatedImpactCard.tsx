import { Texto, Horizontal, Vertical } from '@gravitate-js/excalibrr';
import { ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';
import styles from './BenchmarkPreview.module.css';

interface ImpactEstimate {
  revenueDelta: number;
  revenuePercentage: number;
  marginDelta: number;
  marginPercentage: number;
}

interface EstimatedImpactCardProps {
  impactEstimate: ImpactEstimate;
}

function ImpactColumn({
  label,
  delta,
  percentage,
  isRevenue,
}: {
  label: string;
  delta: number;
  percentage: number;
  isRevenue: boolean;
}) {
  // For revenue: negative is good (lower cost), positive is bad
  // For margin: positive is good (higher margin), negative is bad
  const isPositive = isRevenue ? delta <= 0 : delta >= 0;
  const colorClass = isPositive ? styles.deltaPositive : styles.deltaNegative;

  return (
    <Vertical gap={4} flex={1}>
      <Texto category="p2" appearance="medium">
        {label}
      </Texto>
      <Horizontal gap={4} alignItems="center">
        {delta !== 0 &&
          (isRevenue ? (
            delta < 0 ? (
              <ArrowDownOutlined className={`${styles.impactArrow} ${styles.deltaPositive}`} />
            ) : (
              <ArrowUpOutlined className={`${styles.impactArrow} ${styles.deltaNegative}`} />
            )
          ) : delta < 0 ? (
            <ArrowDownOutlined className={`${styles.impactArrow} ${styles.deltaNegative}`} />
          ) : (
            <ArrowUpOutlined className={`${styles.impactArrow} ${styles.deltaPositive}`} />
          ))}
        <Texto weight="600" className={colorClass}>
          {delta >= 0 ? '+' : ''}${Math.abs(delta).toLocaleString()}
        </Texto>
      </Horizontal>
      <Texto category="p2" className={colorClass}>
        ({percentage >= 0 ? '+' : ''}
        {percentage}%)
      </Texto>
    </Vertical>
  );
}

export function EstimatedImpactCard({ impactEstimate }: EstimatedImpactCardProps) {
  return (
    <div className={styles.card}>
      <Texto category="h5" weight="600">
        Estimated Impact
      </Texto>

      <Horizontal gap={24}>
        <ImpactColumn
          label="Revenue"
          delta={impactEstimate.revenueDelta}
          percentage={impactEstimate.revenuePercentage}
          isRevenue
        />
        <ImpactColumn
          label="Margin"
          delta={impactEstimate.marginDelta}
          percentage={impactEstimate.marginPercentage}
          isRevenue={false}
        />
      </Horizontal>
    </div>
  );
}
