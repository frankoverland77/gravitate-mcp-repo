import { useState } from 'react';
import { Modal, Input, InputNumber, Select, Radio, Form, message } from 'antd';
import { Texto, GraviButton, Vertical } from '@gravitate-js/excalibrr';
import {
  PricePositioningPreset,
  BaselineMetric,
  ScopeType,
  BASELINE_LABELS,
  SCOPE_TYPE_LABELS,
  TERMINAL_OPTIONS,
  REGION_OPTIONS,
  PRODUCT_GROUP_OPTIONS,
} from '../PPTagManager.types';

interface CreateModalProps {
  open: boolean;
  onCancel: () => void;
  onCreate: (preset: PricePositioningPreset) => void;
}

function scopeOptions(type: ScopeType): string[] {
  switch (type) {
    case 'terminal': return TERMINAL_OPTIONS;
    case 'region': return REGION_OPTIONS;
    case 'product-group': return PRODUCT_GROUP_OPTIONS;
    default: return [];
  }
}

export function CreateModal({ open, onCancel, onCreate }: CreateModalProps) {
  const [form] = Form.useForm();
  const [scopeType, setScopeType] = useState<ScopeType>('terminal');

  const handleSubmit = (values: {
    name: string;
    scopeType: ScopeType;
    scopeValue?: string;
    baseline: BaselineMetric;
    magnitudeThresholdDollars: number;
    frequencyThresholdPct: number;
  }) => {
    const preset: PricePositioningPreset = {
      id: `preset-${Date.now()}`,
      name: values.name,
      isDefault: false,
      scope: {
        type: values.scopeType,
        value: values.scopeType === 'all' ? undefined : values.scopeValue,
      },
      baseline: values.baseline,
      magnitudeThresholdDollars: values.magnitudeThresholdDollars,
      frequencyThresholdPct: values.frequencyThresholdPct,
      updatedAt: new Date().toISOString().slice(0, 10),
    };
    onCreate(preset);
    message.success('Preset created');
    form.resetFields();
    setScopeType('terminal');
  };

  return (
    <Modal
      title="Create New Preset"
      open={open}
      destroyOnHidden
      onCancel={() => {
        form.resetFields();
        setScopeType('terminal');
        onCancel();
      }}
      width={520}
      footer={
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
          <GraviButton onClick={onCancel}>Cancel</GraviButton>
          <GraviButton theme1 onClick={() => form.submit()}>Create preset</GraviButton>
        </div>
      }
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={{
          scopeType: 'terminal',
          scopeValue: TERMINAL_OPTIONS[0],
          baseline: 'market-avg',
          magnitudeThresholdDollars: 0.01,
          frequencyThresholdPct: 60,
        }}
        onValuesChange={(changed) => {
          if (changed.scopeType) {
            setScopeType(changed.scopeType);
            const opts = scopeOptions(changed.scopeType);
            form.setFieldValue('scopeValue', opts[0]);
          }
        }}
      >
        <Vertical gap={4}>
          <Form.Item
            name="name"
            label={<Texto weight="600">Name</Texto>}
            rules={[{ required: true, message: 'Name is required' }]}
          >
            <Input placeholder="e.g. Gulf Coast CBOB — tighter" />
          </Form.Item>

          <Form.Item name="scopeType" label={<Texto weight="600">Scope</Texto>}>
            <Radio.Group>
              {(Object.keys(SCOPE_TYPE_LABELS) as ScopeType[]).map((t) => (
                <Radio key={t} value={t} disabled={t === 'all'} style={{ display: 'block', marginBottom: 4 }}>
                  {SCOPE_TYPE_LABELS[t]}
                </Radio>
              ))}
            </Radio.Group>
          </Form.Item>

          {scopeType !== 'all' && (
            <Form.Item name="scopeValue" rules={[{ required: true, message: 'Pick a scope value' }]}>
              <Select
                options={scopeOptions(scopeType).map((v) => ({ value: v, label: v }))}
              />
            </Form.Item>
          )}

          <Form.Item name="baseline" label={<Texto weight="600">Baseline metric</Texto>}>
            <Select
              options={(Object.keys(BASELINE_LABELS) as BaselineMetric[]).map((k) => ({
                value: k,
                label: BASELINE_LABELS[k],
              }))}
            />
          </Form.Item>

          <Form.Item
            name="magnitudeThresholdDollars"
            label={<Texto weight="600">Magnitude threshold</Texto>}
          >
            <InputNumber step={0.0001} min={0.0001} max={0.05} precision={4} addonAfter="$/gal" style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            name="frequencyThresholdPct"
            label={<Texto weight="600">Frequency threshold</Texto>}
          >
            <InputNumber step={1} min={10} max={95} addonAfter="% of days" style={{ width: '100%' }} />
          </Form.Item>
        </Vertical>
      </Form>
    </Modal>
  );
}
