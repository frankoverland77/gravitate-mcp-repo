import { Texto, Horizontal, Vertical } from '@gravitate-js/excalibrr';
import { Tooltip } from 'antd';
import { StarFilled, ExclamationCircleOutlined } from '@ant-design/icons';
import type { ScenarioCellData } from '../../types/scenario.types';
import styles from './ScenarioComparisonSection.module.css';
import { useFeatureMode } from '../../../../contexts/FeatureModeContext';

interface ScenarioCellRendererProps {
  cellData: ScenarioCellData;
  isReferenceForRow: boolean;
  showRowStar: boolean;
}

function getDeltaColorClass(delta: number | undefined): string {
  if (delta === undefined) return styles.deltaNeutral;
  if (delta < 0) return styles.deltaPositive;
  if (delta > 0) return styles.deltaNegative;
  return styles.deltaNeutral;
}

export function ScenarioCellRenderer({
  cellData,
  isReferenceForRow,
  showRowStar,
}: ScenarioCellRendererProps) {
  const { isFutureMode } = useFeatureMode();
  const hasPartialData = !!cellData.missingPriceInfo;

  const cellClassName = hasPartialData
    ? `${styles.partialMatchCell} ${isReferenceForRow ? styles.scenarioCellReference : ''}`
    : `${styles.scenarioCell} ${isReferenceForRow ? styles.scenarioCellReference : ''}`;

  return (
    <div className={cellClassName}>
      <Vertical gap="4px" alignItems="flex-start">
        <Horizontal alignItems="center" style={{ gap: '14px' }} justifyContent="flex-start">
          <Texto weight="600">${cellData.price.toFixed(4)}/gal</Texto>
          {showRowStar && (
            <Tooltip title="Reference">
              <StarFilled className={styles.starIcon} />
            </Tooltip>
          )}
        </Horizontal>

        {cellData.delta !== undefined && (
          hasPartialData ? (
            <Texto category="p2" className={styles.deltaPartial}>
              {`${cellData.delta >= 0 ? '+' : ''}${cellData.delta.toFixed(2)} (${cellData.deltaPercent?.toFixed(1)}%)*`}
            </Texto>
          ) : (
            <Texto category="p2" className={getDeltaColorClass(cellData.delta)}>
              {`${cellData.delta >= 0 ? '+' : ''}${cellData.delta.toFixed(2)} (${cellData.deltaPercent?.toFixed(1)}%)`}
            </Texto>
          )
        )}

        <Texto category="p2" appearance="medium" className={styles.formulaRef}>
          {cellData.formulaRef}
        </Texto>

        {cellData.missingPriceInfo && (
          <Tooltip
            title={
              <div>
                <div style={{ fontWeight: 600, marginBottom: '4px' }}>Incomplete Price Data</div>
                <div>
                  {cellData.missingPriceInfo.available} of {cellData.missingPriceInfo.total} prices available
                </div>
                <div style={{ marginTop: '2px', opacity: 0.8 }}>
                  {cellData.missingPriceInfo.total - cellData.missingPriceInfo.available} missing — average calculated from available data
                </div>
              </div>
            }
          >
            <div className={styles.partialDataBadge}>
              <ExclamationCircleOutlined />
              <span>
                {cellData.missingPriceInfo.available}/{cellData.missingPriceInfo.total} prices
              </span>
            </div>
          </Tooltip>
        )}

        {isFutureMode && (
          <Texto category="p2" appearance="medium" className={styles.volumeText}>
            {(cellData.allocation / 1000).toFixed(0)}K gal
          </Texto>
        )}

        {isFutureMode && cellData.impact !== undefined && (
          <Texto category="p2" weight="600" className={getDeltaColorClass(cellData.impact)}>
            {`Impact: ${cellData.impact >= 0 ? '+' : ''}$${(cellData.impact / 1000).toFixed(1)}K`}
          </Texto>
        )}
      </Vertical>
    </div>
  );
}

export { getDeltaColorClass };
