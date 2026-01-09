import { useState } from 'react';
import { Texto, GraviButton, Horizontal, Vertical } from '@gravitate-js/excalibrr';
import { Select } from 'antd';
import { SettingOutlined, DownOutlined } from '@ant-design/icons';
import type {
  BenchmarkPublisher,
  BenchmarkTypeOption,
  ProductHierarchy,
  LocationHierarchy,
} from '../../types/scenario.types';
import {
  PUBLISHER_OPTIONS,
  BENCHMARK_TYPE_OPTIONS,
  PRODUCT_HIERARCHY_OPTIONS,
  LOCATION_HIERARCHY_OPTIONS,
} from '../../types/scenario.types';
import styles from './BenchmarkSelector.module.css';

interface CustomBenchmarkFormProps {
  isActive: boolean;
  onApply: (config: {
    publisher: BenchmarkPublisher;
    benchmarkType: BenchmarkTypeOption;
    productHierarchy: ProductHierarchy;
    locationHierarchy: LocationHierarchy;
  }) => void;
}

export function CustomBenchmarkForm({ isActive, onApply }: CustomBenchmarkFormProps) {
  const [showCustom, setShowCustom] = useState(false);
  const [customPublisher, setCustomPublisher] = useState<BenchmarkPublisher | undefined>();
  const [customBenchmarkType, setCustomBenchmarkType] = useState<BenchmarkTypeOption | undefined>();
  const [customProductHierarchy, setCustomProductHierarchy] =
    useState<ProductHierarchy>('target-index');
  const [customLocationHierarchy, setCustomLocationHierarchy] = useState<LocationHierarchy>('city');

  const handleApply = () => {
    if (customPublisher && customBenchmarkType) {
      onApply({
        publisher: customPublisher,
        benchmarkType: customBenchmarkType,
        productHierarchy: customProductHierarchy,
        locationHierarchy: customLocationHierarchy,
      });
    }
  };

  return (
    <div className={styles.customSection}>
      <Horizontal
        alignItems="center"
        justifyContent="space-between"
        className={styles.customHeader}
        onClick={() => setShowCustom(!showCustom)}
      >
        <Horizontal alignItems="center" gap="8px">
          <SettingOutlined className={styles.customHeaderIcon} />
          <Texto category="p2" appearance="medium" weight="600" className={styles.sectionLabel}>
            CUSTOM BENCHMARK
          </Texto>
          {isActive && <div className={styles.customActiveDot} />}
        </Horizontal>
        <DownOutlined
          className={`${styles.customToggle} ${showCustom ? styles.customToggleOpen : ''}`}
        />
      </Horizontal>

      {showCustom && (
        <Vertical gap="16px" className={styles.customContent}>
          <div>
            <Texto category="p2" appearance="medium" className={styles.fieldLabel}>
              Publisher
            </Texto>
            <Select
              value={customPublisher}
              onChange={setCustomPublisher}
              placeholder="Select publisher..."
              options={PUBLISHER_OPTIONS}
              className={styles.fullWidth}
            />
          </div>

          <div>
            <Texto category="p2" appearance="medium" className={styles.fieldLabel}>
              Benchmark Type
            </Texto>
            <Select
              value={customBenchmarkType}
              onChange={setCustomBenchmarkType}
              placeholder="Select type..."
              options={BENCHMARK_TYPE_OPTIONS}
              className={styles.fullWidth}
            />
          </div>

          <div>
            <Texto category="p2" appearance="medium" className={styles.fieldLabel}>
              Product Matching
            </Texto>
            <Select
              value={customProductHierarchy}
              onChange={setCustomProductHierarchy}
              options={PRODUCT_HIERARCHY_OPTIONS}
              className={styles.fullWidth}
            />
          </div>

          <div>
            <Texto category="p2" appearance="medium" className={styles.fieldLabel}>
              Location Fallback
            </Texto>
            <Select
              value={customLocationHierarchy}
              onChange={setCustomLocationHierarchy}
              options={LOCATION_HIERARCHY_OPTIONS}
              className={styles.fullWidth}
            />
          </div>

          <GraviButton
            buttonText="Apply Custom Benchmark"
            success
            onClick={handleApply}
            disabled={!customPublisher || !customBenchmarkType}
            className={styles.fullWidth}
          />
        </Vertical>
      )}
    </div>
  );
}
