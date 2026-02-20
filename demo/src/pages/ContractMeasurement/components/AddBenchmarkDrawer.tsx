import { useState } from 'react';
import { Drawer, Select } from 'antd';
import { Vertical, Horizontal, Texto, GraviButton } from '@gravitate-js/excalibrr';
import { PlusOutlined } from '@ant-design/icons';
import { Benchmark } from '../types/benchmark.types';

interface AddBenchmarkDrawerProps {
  visible: boolean;
  onClose: () => void;
  onAddBenchmark: (benchmark: Benchmark) => void;
  currentCount: number;
}

// Options for each dropdown
const publisherOptions = [
  { value: 'opis', label: 'OPIS' },
  { value: 'platts', label: 'Platts' },
  { value: 'argus', label: 'Argus' },
];

const benchmarkTypeOptions = [
  { value: 'rack-low', label: 'Rack Low' },
  { value: 'rack-average', label: 'Rack Average' },
  { value: 'spot', label: 'Spot' },
  { value: 'opis-contract', label: 'OPIS Contract' },
];

const productHierarchyOptions = [
  { value: 'target-index', label: 'Target Index ~85%' },
  { value: 'product-grade', label: 'Product Grade ~75%' },
  { value: 'product-family', label: 'Product Family ~60%' },
  { value: 'any', label: 'Any 100%' },
];

const locationHierarchyOptions = [
  { value: 'city', label: 'OPIS City' },
  { value: 'state', label: 'State/Region' },
  { value: 'padd', label: 'PADD District' },
  { value: 'national', label: 'National' },
];

// Helper to get display name for benchmark type
const getBenchmarkDisplayName = (type: string): string => {
  const option = benchmarkTypeOptions.find((opt) => opt.value === type);
  return option?.label || 'Benchmark';
};

export function AddBenchmarkDrawer({
  visible,
  onClose,
  onAddBenchmark,
  currentCount,
}: AddBenchmarkDrawerProps) {
  // State for all configuration fields
  const [publisher, setPublisher] = useState<string>('opis');
  const [benchmarkType, setBenchmarkType] = useState<string>('rack-low');
  const [productHierarchy, setProductHierarchy] = useState<string>('target-index');
  const [locationHierarchy, setLocationHierarchy] = useState<string>('city');

  const handleAdd = () => {
    const newBenchmark: Benchmark = {
      id: `benchmark-${Date.now()}`,
      name: getBenchmarkDisplayName(benchmarkType),
      isReference: currentCount === 0,
      publisher: publisher,
      benchmarkType: benchmarkType,
      productHierarchy: productHierarchy,
      locationHierarchy: locationHierarchy,
    };
    onAddBenchmark(newBenchmark);
    onClose();
  };

  // Reset form when drawer closes
  const handleClose = () => {
    setPublisher('opis');
    setBenchmarkType('rack-low');
    setProductHierarchy('target-index');
    setLocationHierarchy('city');
    onClose();
  };

  return (
    <Drawer
      title={
        <Horizontal style={{ alignItems: 'center', gap: '8px' }}>
          <PlusOutlined style={{ fontSize: '18px' }} />
          <span>Add Benchmark</span>
        </Horizontal>
      }
      placement="right"
      width={500}
      onClose={handleClose}
      visible={visible}
      zIndex={2000}
      maskClosable={true}
      footer={
        <Horizontal style={{ justifyContent: 'flex-end', gap: '12px', padding: '12px 0' }}>
          <GraviButton buttonText="Cancel" appearance="outlined" onClick={handleClose} />
          <GraviButton buttonText="Add Benchmark" success onClick={handleAdd} />
        </Horizontal>
      }
    >
      <Vertical style={{ gap: '24px' }}>
        {/* Header Description */}
        <div>
          <Texto category="p2" appearance="medium" style={{ marginBottom: '12px', display: 'block' }}>
            Configure a benchmark to compare your contract pricing against industry standards.
          </Texto>
          <div
            style={{
              padding: '12px',
              backgroundColor: '#e6f4ff',
              borderRadius: '4px',
              border: '1px solid #91caff',
            }}
          >
            <Texto category="p2" style={{ color: '#1890ff', fontWeight: 500 }}>
              This benchmark will be added to the comparison table
            </Texto>
          </div>
        </div>

        {/* Divider */}
        <div style={{ borderTop: '1px solid #e8e8e8' }} />

        {/* Two-column form layout */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          {/* Publisher */}
          <div>
            <Texto
              category="p2"
              appearance="medium"
              style={{ marginBottom: '8px', display: 'block', textTransform: 'uppercase', letterSpacing: '0.5px' }}
            >
              Publisher
            </Texto>
            <Select
              value={publisher}
              onChange={(value) => setPublisher(value)}
              style={{ width: '100%' }}
              options={publisherOptions}
            />
          </div>

          {/* Benchmark Type */}
          <div>
            <Texto
              category="p2"
              appearance="medium"
              style={{ marginBottom: '8px', display: 'block', textTransform: 'uppercase', letterSpacing: '0.5px' }}
            >
              Benchmark Type
            </Texto>
            <Select
              value={benchmarkType}
              onChange={(value) => setBenchmarkType(value)}
              style={{ width: '100%' }}
              options={benchmarkTypeOptions}
            />
          </div>

          {/* Product Hierarchy */}
          <div>
            <Texto
              category="p2"
              appearance="medium"
              style={{ marginBottom: '8px', display: 'block', textTransform: 'uppercase', letterSpacing: '0.5px' }}
            >
              Product Hierarchy
            </Texto>
            <Select
              value={productHierarchy}
              onChange={(value) => setProductHierarchy(value)}
              style={{ width: '100%' }}
              options={productHierarchyOptions}
            />
          </div>

        </div>

        {/* Divider */}
        <div style={{ borderTop: '1px solid #e8e8e8' }} />

        {/* Matching Summary */}
        <div
          style={{
            padding: '16px',
            backgroundColor: '#fafafa',
            borderRadius: '8px',
            border: '1px solid #e8e8e8',
          }}
        >
          <Texto category="p2" weight="600" style={{ marginBottom: '8px', display: 'block' }}>
            Matching Summary
          </Texto>
          <Vertical style={{ gap: '4px' }}>
            <Texto category="p2" appearance="medium">
              Publisher: <strong>{publisherOptions.find((o) => o.value === publisher)?.label}</strong>
            </Texto>
            <Texto category="p2" appearance="medium">
              Type: <strong>{benchmarkTypeOptions.find((o) => o.value === benchmarkType)?.label}</strong>
            </Texto>
            <Texto category="p2" appearance="medium">
              Product: <strong>{productHierarchyOptions.find((o) => o.value === productHierarchy)?.label}</strong>
            </Texto>
          </Vertical>
        </div>
      </Vertical>
    </Drawer>
  );
}

export default AddBenchmarkDrawer;
