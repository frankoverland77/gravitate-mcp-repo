import { Texto, Horizontal } from '@gravitate-js/excalibrr';
import {
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  ClockCircleOutlined,
} from '@ant-design/icons';
import styles from './ScenarioDrawer.module.css';

interface ConfigurationStatusProps {
  completeCount: number;
  incompleteCount: number;
  remainingCount: number;
}

export function ConfigurationStatus({
  completeCount,
  incompleteCount,
  remainingCount,
}: ConfigurationStatusProps) {
  return (
    <Horizontal gap="16px">
      <div className={`${styles.statusCard} ${styles.statusCardComplete}`}>
        <Horizontal alignItems="center" gap="8px">
          <CheckCircleOutlined className={styles.statusIcon} />
          <Texto category="p2">
            <strong>{completeCount}</strong> Complete
          </Texto>
        </Horizontal>
      </div>
      <div className={`${styles.statusCard} ${styles.statusCardIncomplete}`}>
        <Horizontal alignItems="center" gap="8px">
          <ExclamationCircleOutlined className={styles.statusIconWarning} />
          <Texto category="p2">
            <strong>{incompleteCount}</strong> Incomplete
          </Texto>
        </Horizontal>
      </div>
      <div className={`${styles.statusCard} ${styles.statusCardRemaining}`}>
        <Horizontal alignItems="center" gap="8px">
          <ClockCircleOutlined className={styles.statusIconNeutral} />
          <Texto category="p2">
            <strong>{remainingCount}</strong> Remaining
          </Texto>
        </Horizontal>
      </div>
    </Horizontal>
  );
}
