import { Texto, GraviButton, Horizontal, Vertical } from '@gravitate-js/excalibrr';
import { DatabaseOutlined, PercentageOutlined, DollarOutlined } from '@ant-design/icons';
import styles from './ScenarioDrawer.module.css';

interface VolumeTabContentProps {
  onAllocationConfig: () => void;
  onRateabilityConfig: () => void;
  onPenaltiesConfig: () => void;
}

export function VolumeTabContent({
  onAllocationConfig,
  onRateabilityConfig,
  onPenaltiesConfig,
}: VolumeTabContentProps) {
  return (
    <div className={styles.tabContent}>
      <Vertical gap="24px">
        {/* Allocation Data Card */}
        <div className={styles.configCard}>
          <Vertical gap="12px">
            <Horizontal alignItems="center" gap="8px">
              <DatabaseOutlined
                className={`${styles.configCardIcon} ${styles.configCardIconBlue}`}
              />
              <Texto weight="600">Allocation Data</Texto>
            </Horizontal>
            <Texto category="p2" appearance="medium">
              Configure volume allocations for each product/location. Define how total contract
              volumes are distributed across delivery points.
            </Texto>
            <div className={styles.buttonMarginTop}>
              <GraviButton
                buttonText="Configure Allocation (TBD)"
                appearance="outlined"
                onClick={onAllocationConfig}
              />
            </div>
          </Vertical>
        </div>

        {/* Rateability Requirements Card */}
        <div className={styles.configCard}>
          <Vertical gap="12px">
            <Horizontal alignItems="center" gap="8px">
              <PercentageOutlined
                className={`${styles.configCardIcon} ${styles.configCardIconGreen}`}
              />
              <Texto weight="600">Rateability Requirements</Texto>
            </Horizontal>
            <Texto category="p2" appearance="medium">
              Set minimum and maximum volume thresholds. Define acceptable ranges for delivery
              compliance.
            </Texto>
            <div className={styles.buttonMarginTop}>
              <GraviButton
                buttonText="Configure Rateability (TBD)"
                appearance="outlined"
                onClick={onRateabilityConfig}
              />
            </div>
          </Vertical>
        </div>

        {/* Penalties Card */}
        <div className={styles.configCard}>
          <Vertical gap="12px">
            <Horizontal alignItems="center" gap="8px">
              <DollarOutlined className={`${styles.configCardIcon} ${styles.configCardIconRed}`} />
              <Texto weight="600">Penalties</Texto>
            </Horizontal>
            <Texto category="p2" appearance="medium">
              Define penalty structures for volume shortfalls. Specify costs for under-delivery or
              non-compliance.
            </Texto>
            <div className={styles.buttonMarginTop}>
              <GraviButton
                buttonText="Configure Penalties (TBD)"
                appearance="outlined"
                onClick={onPenaltiesConfig}
              />
            </div>
          </Vertical>
        </div>
      </Vertical>
    </div>
  );
}
