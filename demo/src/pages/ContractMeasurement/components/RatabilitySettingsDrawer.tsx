import { useState, useEffect } from 'react';
import { Drawer, Radio, Select, InputNumber, Switch } from 'antd';
import { Vertical, Horizontal, Texto, GraviButton } from '@gravitate-js/excalibrr';
import {
  CalendarOutlined,
  PercentageOutlined,
  CalculatorOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import {
  RatabilitySettings,
  DEFAULT_RATABILITY_SETTINGS,
  PERIOD_OPTIONS,
  VARIANCE_OPTIONS,
  CALCULATION_OPTIONS,
  VarianceThreshold,
  CalculationMethod,
  RatabilityPeriod,
} from '../types/ratability.types';

const STORAGE_KEY = 'contract-measurement-ratability-settings';

interface RatabilitySettingsDrawerProps {
  open: boolean;
  onClose: () => void;
  onSettingsChange?: (settings: RatabilitySettings) => void;
}

export function RatabilitySettingsDrawer({
  open,
  onClose,
  onSettingsChange,
}: RatabilitySettingsDrawerProps) {
  const [settings, setSettings] = useState<RatabilitySettings>(DEFAULT_RATABILITY_SETTINGS);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');

  // Load settings from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setSettings({
          ...parsed,
          lastUpdated: new Date(parsed.lastUpdated),
        });
      } catch (e) {
        console.error('Failed to parse stored ratability settings:', e);
      }
    }
  }, []);

  const getOptionCardStyle = (isSelected: boolean): React.CSSProperties => ({
    padding: '16px',
    border: isSelected ? '2px solid #52c41a' : '1px solid #d9d9d9',
    borderRadius: '8px',
    backgroundColor: isSelected ? 'rgba(81, 176, 115, 0.05)' : '#fafafa',
    cursor: 'pointer',
    transition: 'all 0.2s',
  });

  const handleSave = () => {
    setSaveStatus('saving');
    try {
      const updatedSettings = {
        ...settings,
        lastUpdated: new Date(),
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedSettings));
      setSettings(updatedSettings);
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 2000);
      onSettingsChange?.(updatedSettings);
    } catch (e) {
      console.error('Failed to save ratability settings:', e);
      setSaveStatus('error');
      setTimeout(() => setSaveStatus('idle'), 3000);
    }
  };

  const handleReset = () => {
    setSettings(DEFAULT_RATABILITY_SETTINGS);
    localStorage.removeItem(STORAGE_KEY);
    onSettingsChange?.(DEFAULT_RATABILITY_SETTINGS);
  };

  const updateSetting = <K extends keyof RatabilitySettings>(
    key: K,
    value: RatabilitySettings[K]
  ) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const getSaveButtonText = () => {
    switch (saveStatus) {
      case 'saving':
        return 'Saving...';
      case 'saved':
        return 'Saved ✓';
      case 'error':
        return 'Error - Retry';
      default:
        return 'Save Settings';
    }
  };

  return (
    <Drawer
      title={
        <Horizontal gap={8} style={{ alignItems: 'center' }}>
          <SettingOutlined style={{ fontSize: '18px' }} />
          <span>Ratability Settings</span>
        </Horizontal>
      }
      placement="right"
      width={500}
      onClose={onClose}
      open={open}
      zIndex={2000}
      maskClosable={true}
      styles={{ body: { overflowY: 'auto', height: 'calc(100vh - 110px)' } }}
      footer={
        <Horizontal style={{ justifyContent: 'space-between', padding: '12px 0' }}>
          <GraviButton
            buttonText="Reset to Defaults"
            appearance="outlined"
            onClick={handleReset}
          />
          <GraviButton
            buttonText={getSaveButtonText()}
            success
            onClick={handleSave}
            loading={saveStatus === 'saving'}
          />
        </Horizontal>
      }
    >
      <Vertical gap={24}>
        {/* Header Description */}
        <div>
          <Texto category="p2" appearance="medium" style={{ marginBottom: '12px', display: 'block' }}>
            Configure how ratability scores are calculated for contracts. Ratability measures
            how consistently customers lift fuel according to their contract targets.
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
              These settings apply globally to all contracts
            </Texto>
          </div>
        </div>

        {/* Divider */}
        <div style={{ borderTop: '1px solid #e8e8e8' }} />

        {/* Measurement Period Section */}
        <div>
          <Horizontal gap={8} style={{ alignItems: 'center', marginBottom: '8px' }}>
            <CalendarOutlined style={{ fontSize: '16px', color: '#8c8c8c' }} />
            <Texto category="p1" weight="600">
              Measurement Period
            </Texto>
          </Horizontal>
          <Texto
            category="p2"
            appearance="medium"
            style={{ marginBottom: '16px', display: 'block' }}
          >
            How frequently should ratability be analyzed?
          </Texto>

          <Vertical gap={16}>
            <div>
              <Texto
                category="p2"
                appearance="medium"
                style={{ marginBottom: '8px', display: 'block' }}
              >
                Primary Period
              </Texto>
              <Select
                value={settings.primaryPeriod}
                onChange={(value: RatabilityPeriod) => updateSetting('primaryPeriod', value)}
                style={{ width: '100%' }}
                options={PERIOD_OPTIONS.map((opt) => ({
                  value: opt.value,
                  label: (
                    <Horizontal style={{ justifyContent: 'space-between', width: '100%' }}>
                      <span>{opt.label}</span>
                      <span style={{ color: '#8c8c8c', fontSize: '12px' }}>{opt.description}</span>
                    </Horizontal>
                  ),
                }))}
              />
            </div>

            <div>
              <Texto
                category="p2"
                appearance="medium"
                style={{ marginBottom: '8px', display: 'block' }}
              >
                Minimum Periods Required
              </Texto>
              <InputNumber
                min={1}
                max={24}
                value={settings.minimumPeriods}
                onChange={(value) => updateSetting('minimumPeriods', value || 3)}
                style={{ width: '100%' }}
                addonAfter="periods"
              />
              <Texto
                category="p2"
                appearance="medium"
                style={{ marginTop: '4px', display: 'block', fontSize: '12px' }}
              >
                Minimum number of periods needed for a valid ratability score
              </Texto>
            </div>
          </Vertical>
        </div>

        {/* Divider */}
        <div style={{ borderTop: '1px solid #e8e8e8' }} />

        {/* Variance Threshold Section */}
        <div>
          <Horizontal gap={8} style={{ alignItems: 'center', marginBottom: '8px' }}>
            <PercentageOutlined style={{ fontSize: '16px', color: '#8c8c8c' }} />
            <Texto category="p1" weight="600">
              Variance Threshold
            </Texto>
          </Horizontal>
          <Texto
            category="p2"
            appearance="medium"
            style={{ marginBottom: '16px', display: 'block' }}
          >
            Maximum acceptable variance from target for good ratability
          </Texto>

          <Radio.Group
            value={settings.varianceThreshold}
            onChange={(e) => updateSetting('varianceThreshold', e.target.value as VarianceThreshold)}
            style={{ width: '100%' }}
          >
            <Vertical gap={12}>
              {VARIANCE_OPTIONS.map((option) => (
                <div
                  key={option.value}
                  style={getOptionCardStyle(settings.varianceThreshold === option.value)}
                  onClick={() => updateSetting('varianceThreshold', option.value as VarianceThreshold)}
                >
                  <Radio value={option.value} style={{ marginBottom: '4px' }}>
                    <Texto weight="600">{option.label}</Texto>
                    {option.value === '5%' && (
                      <span
                        style={{
                          marginLeft: '8px',
                          padding: '2px 8px',
                          backgroundColor: '#52c41a',
                          color: 'white',
                          borderRadius: '4px',
                          fontSize: '10px',
                          fontWeight: 600,
                        }}
                      >
                        RECOMMENDED
                      </span>
                    )}
                  </Radio>
                  <Texto
                    category="p2"
                    appearance="medium"
                    style={{ marginLeft: '24px', display: 'block' }}
                  >
                    {option.description}
                  </Texto>
                </div>
              ))}
            </Vertical>
          </Radio.Group>

          {/* Conditional: Custom Threshold Input */}
          {settings.varianceThreshold === 'custom' && (
            <div style={{ marginTop: '16px' }}>
              <Texto
                category="p2"
                appearance="medium"
                style={{ marginBottom: '8px', display: 'block' }}
              >
                Custom Threshold (%)
              </Texto>
              <InputNumber
                min={0.1}
                max={50}
                step={0.1}
                value={settings.customThresholdPercent}
                onChange={(value) => updateSetting('customThresholdPercent', value || 5)}
                style={{ width: '100%' }}
                addonAfter="%"
              />
            </div>
          )}
        </div>

        {/* Divider */}
        <div style={{ borderTop: '1px solid #e8e8e8' }} />

        {/* Calculation Method Section */}
        <div>
          <Horizontal gap={8} style={{ alignItems: 'center', marginBottom: '8px' }}>
            <CalculatorOutlined style={{ fontSize: '16px', color: '#8c8c8c' }} />
            <Texto category="p1" weight="600">
              Calculation Method
            </Texto>
          </Horizontal>
          <Texto
            category="p2"
            appearance="medium"
            style={{ marginBottom: '16px', display: 'block' }}
          >
            How should target volumes be calculated?
          </Texto>

          <Radio.Group
            value={settings.calculationMethod}
            onChange={(e) => updateSetting('calculationMethod', e.target.value as CalculationMethod)}
            style={{ width: '100%' }}
          >
            <Vertical gap={12}>
              {CALCULATION_OPTIONS.map((option) => (
                <div
                  key={option.value}
                  style={getOptionCardStyle(settings.calculationMethod === option.value)}
                  onClick={() => updateSetting('calculationMethod', option.value as CalculationMethod)}
                >
                  <Radio value={option.value} style={{ marginBottom: '4px' }}>
                    <Texto weight="600">{option.label}</Texto>
                    {option.value === 'simple-target' && (
                      <span
                        style={{
                          marginLeft: '8px',
                          padding: '2px 8px',
                          backgroundColor: '#52c41a',
                          color: 'white',
                          borderRadius: '4px',
                          fontSize: '10px',
                          fontWeight: 600,
                        }}
                      >
                        RECOMMENDED
                      </span>
                    )}
                  </Radio>
                  <Texto
                    category="p2"
                    appearance="medium"
                    style={{ marginLeft: '24px', display: 'block' }}
                  >
                    {option.description}
                  </Texto>
                </div>
              ))}
            </Vertical>
          </Radio.Group>

          {/* Conditional: Rolling Periods Input */}
          {settings.calculationMethod === 'rolling-average' && (
            <div style={{ marginTop: '16px' }}>
              <Texto
                category="p2"
                appearance="medium"
                style={{ marginBottom: '8px', display: 'block' }}
              >
                Rolling Periods
              </Texto>
              <InputNumber
                min={2}
                max={12}
                value={settings.rollingPeriods}
                onChange={(value) => updateSetting('rollingPeriods', value || 3)}
                style={{ width: '100%' }}
                addonAfter="periods"
              />
              <Texto
                category="p2"
                appearance="medium"
                style={{ marginTop: '4px', display: 'block', fontSize: '12px' }}
              >
                Number of recent periods to include in rolling average
              </Texto>
            </div>
          )}
        </div>

        {/* Divider */}
        <div style={{ borderTop: '1px solid #e8e8e8' }} />

        {/* Advanced Options Section */}
        <div>
          <Horizontal gap={8} style={{ alignItems: 'center', marginBottom: '16px' }}>
            <SettingOutlined style={{ fontSize: '16px', color: '#8c8c8c' }} />
            <Texto category="p1" weight="600">
              Advanced Options
            </Texto>
          </Horizontal>

          <div
            style={{
              padding: '16px',
              backgroundColor: '#fafafa',
              borderRadius: '8px',
              border: '1px solid #e8e8e8',
            }}
          >
            <Horizontal style={{ justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div style={{ flex: 1 }}>
                <Texto weight="600" style={{ marginBottom: '4px', display: 'block' }}>
                  Exclude Outliers
                </Texto>
                <Texto category="p2" appearance="medium">
                  Automatically exclude periods with extreme variances from ratability calculations
                </Texto>
              </div>
              <Switch
                checked={settings.excludeOutliers}
                onChange={(checked) => updateSetting('excludeOutliers', checked)}
              />
            </Horizontal>
          </div>
        </div>
      </Vertical>
    </Drawer>
  );
}

export default RatabilitySettingsDrawer;
