import { Texto, Horizontal, Vertical } from '@gravitate-js/excalibrr';
import { BarChartOutlined, LineChartOutlined, StockOutlined } from '@ant-design/icons';
import type { QuickBenchmarkType } from '../../types/scenario.types';
import styles from './BenchmarkSelector.module.css';

interface QuickSelectionConfig {
  type: QuickBenchmarkType;
  title: string;
  description: string;
  icon: React.ReactNode;
}

const QUICK_SELECTIONS: QuickSelectionConfig[] = [
  {
    type: 'rack-average',
    title: 'Rack Average',
    description: 'Compare to average terminal price across all suppliers',
    icon: <BarChartOutlined className={styles.optionIcon} />,
  },
  {
    type: 'rack-low',
    title: 'Rack Low',
    description: 'Compare to lowest terminal price available',
    icon: <LineChartOutlined className={styles.optionIcon} />,
  },
  {
    type: 'spot-price',
    title: 'Spot Price',
    description: 'Compare to current market spot price',
    icon: <StockOutlined className={styles.optionIcon} />,
  },
];

interface QuickSelectionCardsProps {
  selectedType: QuickBenchmarkType | undefined;
  onSelect: (type: QuickBenchmarkType) => void;
}

export function QuickSelectionCards({ selectedType, onSelect }: QuickSelectionCardsProps) {
  const getCardClassName = (type: QuickBenchmarkType) => {
    const base = styles.optionCard;
    return selectedType === type ? `${base} ${styles.optionCardSelected}` : base;
  };

  return (
    <div>
      <Texto category="p2" appearance="medium" weight="600" className={styles.sectionLabel}>
        QUICK SELECT
      </Texto>
      <Vertical gap="12px">
        {QUICK_SELECTIONS.map((option) => (
          <div
            key={option.type}
            className={getCardClassName(option.type)}
            onClick={() => onSelect(option.type)}
          >
            <Horizontal alignItems="flex-start" gap="12px">
              <div className={selectedType === option.type ? styles.optionIconSelected : ''}>
                {option.icon}
              </div>
              <Vertical gap="4px" flex={1}>
                <Texto weight="600">{option.title}</Texto>
                <Texto category="p2" appearance="medium" className={styles.optionDescription}>
                  {option.description}
                </Texto>
              </Vertical>
            </Horizontal>
          </div>
        ))}
      </Vertical>
    </div>
  );
}

export { QUICK_SELECTIONS };
