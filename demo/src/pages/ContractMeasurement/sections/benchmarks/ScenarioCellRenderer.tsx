import { Texto, Horizontal, Vertical } from '@gravitate-js/excalibrr';
import { Checkbox, Tooltip } from 'antd';
import { StarFilled, ExclamationCircleOutlined } from '@ant-design/icons';
import type { ScenarioCellData } from '../../types/scenario.types';
import styles from './ScenarioComparisonSection.module.css';
import { useFeatureMode } from '../../../../contexts/FeatureModeContext';

interface ScenarioCellRendererProps {
  cellData: ScenarioCellData;
  isReferenceForRow: boolean;
  showRowStar: boolean;
  isReferenceMode: boolean;
  onSetReference: () => void;
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
  isReferenceMode,
  onSetReference,
}: ScenarioCellRendererProps) {
  const { isFutureMode } = useFeatureMode();
  const cellClassName = `${styles.scenarioCell} ${isReferenceForRow ? styles.scenarioCellReference : ''}`;

  return (
    <div className={cellClassName}>
      {isReferenceMode && (
        <div className={styles.cellCheckbox}>
          <Checkbox checked={isReferenceForRow} onChange={onSetReference} />
        </div>
      )}

      <Vertical gap="4px" alignItems="flex-start">
        <Horizontal alignItems="center" gap="8px" justifyContent="flex-start">
          <Texto weight="600">${cellData.price.toFixed(2)}/gal</Texto>
          {showRowStar && (
            <Tooltip title="Reference">
              <StarFilled className={styles.starIcon} />
            </Tooltip>
          )}
        </Horizontal>

        {cellData.delta !== undefined && (
          <Texto category="p2" className={getDeltaColorClass(cellData.delta)}>
            {`${cellData.delta >= 0 ? '+' : ''}${cellData.delta.toFixed(2)} (${cellData.deltaPercent?.toFixed(1)}%)`}
          </Texto>
        )}

        <Texto category="p2" appearance="medium" className={styles.formulaRef}>
          {cellData.formulaRef}
        </Texto>

        {cellData.missingPriceInfo && (
          <Tooltip title={`${cellData.missingPriceInfo.available} of ${cellData.missingPriceInfo.total} prices available — average calculated from available data`}>
            <div className={styles.missingPriceIndicator}>
              <ExclamationCircleOutlined />
              <span>Partial data ({cellData.missingPriceInfo.available}/{cellData.missingPriceInfo.total})</span>
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
