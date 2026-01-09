import { GraviButton, Horizontal, Vertical } from '@gravitate-js/excalibrr';
import { ClearOutlined } from '@ant-design/icons';
import type { SelectedBenchmark, QuickBenchmarkType } from '../../types/scenario.types';
import { BenchmarkPreview } from './BenchmarkPreview';
import { QuickSelectionCards } from './QuickSelectionCards';
import { CustomBenchmarkForm } from './CustomBenchmarkForm';
import styles from './BenchmarkSelector.module.css';

interface BenchmarkSelectorProps {
  selectedBenchmark: SelectedBenchmark | undefined;
  onBenchmarkChange: (benchmark: SelectedBenchmark | undefined) => void;
}

export function BenchmarkSelector({
  selectedBenchmark,
  onBenchmarkChange,
}: BenchmarkSelectorProps) {
  const handleQuickSelect = (quickType: QuickBenchmarkType) => {
    onBenchmarkChange({ type: 'quick', quickType });
  };

  const handleCustomApply = (config: {
    publisher: string;
    benchmarkType: string;
    productHierarchy: string;
    locationHierarchy: string;
  }) => {
    onBenchmarkChange({
      type: 'custom',
      publisher: config.publisher,
      benchmarkType: config.benchmarkType,
      productHierarchy: config.productHierarchy,
      locationHierarchy: config.locationHierarchy,
    } as SelectedBenchmark);
  };

  const handleClearSelection = () => {
    onBenchmarkChange(undefined);
  };

  const selectedQuickType =
    selectedBenchmark?.type === 'quick' ? selectedBenchmark.quickType : undefined;
  const isCustomActive = selectedBenchmark?.type === 'custom';

  return (
    <Horizontal alignItems="flex-start" className={styles.container}>
      <div className={styles.leftPanel}>
        <Vertical gap="20px">
          <QuickSelectionCards selectedType={selectedQuickType} onSelect={handleQuickSelect} />

          <CustomBenchmarkForm isActive={isCustomActive} onApply={handleCustomApply} />

          {selectedBenchmark && (
            <GraviButton
              buttonText="Clear Selection"
              icon={<ClearOutlined />}
              appearance="outlined"
              onClick={handleClearSelection}
              className={styles.fullWidth}
            />
          )}
        </Vertical>
      </div>

      <div className={styles.rightPanel}>
        <BenchmarkPreview selectedBenchmark={selectedBenchmark} />
      </div>
    </Horizontal>
  );
}
