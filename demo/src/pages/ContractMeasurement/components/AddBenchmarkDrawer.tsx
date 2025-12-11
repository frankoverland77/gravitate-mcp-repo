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

export function AddBenchmarkDrawer({
  visible,
  onClose,
  onAddBenchmark,
  currentCount,
}: AddBenchmarkDrawerProps) {
  const handleAdd = () => {
    const newBenchmark: Benchmark = {
      id: `benchmark-${Date.now()}`,
      name: 'Example',
      isPrimary: currentCount === 0,
      publisher: 'TBD',
      benchmarkType: 'TBD',
      productHierarchy: 'TBD',
      locationHierarchy: 'TBD',
    };
    onAddBenchmark(newBenchmark);
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
      onClose={onClose}
      visible={visible}
      zIndex={2000}
      maskClosable={true}
      footer={
        <Horizontal style={{ justifyContent: 'flex-end', gap: '12px', padding: '12px 0' }}>
          <GraviButton
            buttonText="Cancel"
            appearance="outlined"
            onClick={onClose}
          />
          <GraviButton
            buttonText="Add Benchmark"
            appearance="success"
            onClick={handleAdd}
          />
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
              value="TBD"
              disabled
              style={{ width: '100%' }}
              options={[{ value: 'TBD', label: 'TBD' }]}
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
              value="TBD"
              disabled
              style={{ width: '100%' }}
              options={[{ value: 'TBD', label: 'TBD' }]}
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
              value="TBD"
              disabled
              style={{ width: '100%' }}
              options={[{ value: 'TBD', label: 'TBD' }]}
            />
          </div>

          {/* Location Hierarchy */}
          <div>
            <Texto
              category="p2"
              appearance="medium"
              style={{ marginBottom: '8px', display: 'block', textTransform: 'uppercase', letterSpacing: '0.5px' }}
            >
              Location Hierarchy
            </Texto>
            <Select
              value="TBD"
              disabled
              style={{ width: '100%' }}
              options={[{ value: 'TBD', label: 'TBD' }]}
            />
          </div>
        </div>

        {/* Divider */}
        <div style={{ borderTop: '1px solid #e8e8e8' }} />

        {/* Matching Info Placeholder */}
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
          <Texto category="p2" appearance="medium">
            Product and location matching information will be displayed here once configured.
          </Texto>
        </div>
      </Vertical>
    </Drawer>
  );
}

export default AddBenchmarkDrawer;
