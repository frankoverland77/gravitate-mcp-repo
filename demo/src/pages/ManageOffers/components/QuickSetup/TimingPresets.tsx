import { GraviButton, Horizontal, Texto, Vertical } from '@gravitate-js/excalibrr'
import { DatePicker, Form, Select, TimePicker } from 'antd'
import type { FormInstance } from 'antd'

import { TIMING_PRESETS } from './QuickSetupConstants'

interface TimingPresetsProps {
  form: FormInstance
  selectedPreset: string
  onSelectPreset: (key: string) => void
}

const formatDate = (d: import('dayjs').Dayjs) => d.format('MMM D, h:mm A') + ' CT'

export function TimingPresets({ form, selectedPreset, onSelectPreset }: TimingPresetsProps) {
  const handlePresetSelect = (key: string) => {
    onSelectPreset(key)
    if (key === 'custom') return

    const preset = TIMING_PRESETS.find((p) => p.key === key)
    if (!preset) return

    form.setFieldsValue({
      InviteTriggerDate: preset.getInvitation(),
      InviteTriggerTime: preset.getInvitation(),
      VisibilityWindowStartDate: preset.getVisibilityStart(),
      VisibilityWindowStartTime: preset.getVisibilityStart(),
      VisibilityWindowEndDate: preset.getVisibilityEnd(),
      VisibilityWindowEndTime: preset.getVisibilityEnd(),
      PickupWindowStartDate: preset.getPickupStart(),
      PickupWindowStartTime: preset.getPickupStart(),
      PickupWindowEndDate: preset.getPickupEnd(),
      PickupWindowEndTime: preset.getPickupEnd(),
    })
  }

  const presetData = selectedPreset !== 'custom'
    ? TIMING_PRESETS.find((p) => p.key === selectedPreset)
    : null

  return (
    <Vertical>
      <Horizontal gap={8} style={{ flexWrap: 'wrap', marginBottom: 16 }}>
        {[...TIMING_PRESETS, { key: 'custom', label: 'Custom' }].map((p) => (
          <GraviButton
            key={p.key}
            className={selectedPreset === p.key ? '' : 'ghost-gravi-button'}
            theme1={selectedPreset === p.key}
            buttonText={p.label}
            onClick={() => handlePresetSelect(p.key)}
            size='small'
          />
        ))}
      </Horizontal>

      {selectedPreset !== 'custom' && presetData && (
        <div style={{ background: '#f0f9ff', border: '1px solid #bfdbfe', borderRadius: 8, padding: '12px 16px' }}>
          <Texto style={{ fontWeight: 600, marginBottom: 8 }}>Timing Summary</Texto>
          <Vertical gap={4}>
            <Horizontal justifyContent='space-between'>
              <Texto appearance='medium'>Invitation</Texto>
              <Texto>{formatDate(presetData.getInvitation())}</Texto>
            </Horizontal>
            <Horizontal justifyContent='space-between'>
              <Texto appearance='medium'>Visibility Window</Texto>
              <Texto>{formatDate(presetData.getVisibilityStart())} — {formatDate(presetData.getVisibilityEnd())}</Texto>
            </Horizontal>
            <Horizontal justifyContent='space-between'>
              <Texto appearance='medium'>Pickup Window</Texto>
              <Texto>{formatDate(presetData.getPickupStart())} — {formatDate(presetData.getPickupEnd())}</Texto>
            </Horizontal>
          </Vertical>
        </div>
      )}

      {selectedPreset === 'custom' && (
        <Vertical gap={12}>
          <Texto appearance='medium'>All times in selected timezone</Texto>
          <Form.Item label='Timezone' name='Timezone' initialValue='CT' style={{ marginBottom: 8 }}>
            <Select options={[
              { label: 'Central (CT)', value: 'CT' },
              { label: 'Eastern (ET)', value: 'ET' },
              { label: 'Mountain (MT)', value: 'MT' },
              { label: 'Pacific (PT)', value: 'PT' },
            ]} />
          </Form.Item>

          <Texto style={{ fontWeight: 600, fontSize: 13 }}>Invitation</Texto>
          <Horizontal gap={8}>
            <Form.Item name='InviteTriggerDate' rules={[{ required: true, message: 'Required' }]} style={{ flex: 1, marginBottom: 8 }}>
              <DatePicker style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item name='InviteTriggerTime' rules={[{ required: true, message: 'Required' }]} style={{ flex: 1, marginBottom: 8 }}>
              <TimePicker use12Hours format='h:mm A' style={{ width: '100%' }} />
            </Form.Item>
          </Horizontal>

          <Texto style={{ fontWeight: 600, fontSize: 13 }}>Visibility Window</Texto>
          <Horizontal gap={8}>
            <Form.Item name='VisibilityWindowStartDate' rules={[{ required: true, message: 'Required' }]} style={{ flex: 1, marginBottom: 8 }}>
              <DatePicker style={{ width: '100%' }} placeholder='Start date' />
            </Form.Item>
            <Form.Item name='VisibilityWindowStartTime' rules={[{ required: true, message: 'Required' }]} style={{ flex: 1, marginBottom: 8 }}>
              <TimePicker use12Hours format='h:mm A' style={{ width: '100%' }} />
            </Form.Item>
          </Horizontal>
          <Horizontal gap={8}>
            <Form.Item name='VisibilityWindowEndDate' rules={[{ required: true, message: 'Required' }]} style={{ flex: 1, marginBottom: 8 }}>
              <DatePicker style={{ width: '100%' }} placeholder='End date' />
            </Form.Item>
            <Form.Item name='VisibilityWindowEndTime' rules={[{ required: true, message: 'Required' }]} style={{ flex: 1, marginBottom: 8 }}>
              <TimePicker use12Hours format='h:mm A' style={{ width: '100%' }} />
            </Form.Item>
          </Horizontal>

          <Texto style={{ fontWeight: 600, fontSize: 13 }}>Pickup Window</Texto>
          <Horizontal gap={8}>
            <Form.Item name='PickupWindowStartDate' rules={[{ required: true, message: 'Required' }]} style={{ flex: 1, marginBottom: 8 }}>
              <DatePicker style={{ width: '100%' }} placeholder='Start date' />
            </Form.Item>
            <Form.Item name='PickupWindowStartTime' rules={[{ required: true, message: 'Required' }]} style={{ flex: 1, marginBottom: 8 }}>
              <TimePicker use12Hours format='h:mm A' style={{ width: '100%' }} />
            </Form.Item>
          </Horizontal>
          <Horizontal gap={8}>
            <Form.Item name='PickupWindowEndDate' rules={[{ required: true, message: 'Required' }]} style={{ flex: 1, marginBottom: 8 }}>
              <DatePicker style={{ width: '100%' }} placeholder='End date' />
            </Form.Item>
            <Form.Item name='PickupWindowEndTime' rules={[{ required: true, message: 'Required' }]} style={{ flex: 1, marginBottom: 8 }}>
              <TimePicker use12Hours format='h:mm A' style={{ width: '100%' }} />
            </Form.Item>
          </Horizontal>
        </Vertical>
      )}
    </Vertical>
  )
}
