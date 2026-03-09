import React from 'react'
import { Drawer, Radio, Switch } from 'antd'
import { Vertical, Horizontal, Texto } from '@gravitate-js/excalibrr'
import { useFeatureMode } from '../../../contexts/FeatureModeContext'

const COLORS = {
  DARK_TEXT: '#262626',
  LIGHT_TEXT: '#8c8c8c',
  BORDER_GRAY: '#d9d9d9',
  BACKGROUND_GRAY: '#fafafa',
  PRIMARY_BLUE: '#0958d9',
}

interface CMViewSettingsDrawerProps {
  open: boolean
  onClose: () => void
  isReadOnly: boolean
  onReadOnlyChange: (value: boolean) => void
}

export function CMViewSettingsDrawer({ open, onClose, isReadOnly, onReadOnlyChange }: CMViewSettingsDrawerProps) {
  const { featureMode, setFeatureMode } = useFeatureMode()

  const getOptionCardStyle = (isSelected: boolean): React.CSSProperties => ({
    padding: '16px',
    border: isSelected ? '2px solid #1890ff' : `1px solid ${COLORS.BORDER_GRAY}`,
    borderRadius: '8px',
    backgroundColor: isSelected ? '#f0f7ff' : COLORS.BACKGROUND_GRAY,
    cursor: 'pointer',
    transition: 'all 0.2s',
  })

  return (
    <Drawer
      title='View Settings'
      placement='right'
      width={400}
      onClose={onClose}
      open={open}
      zIndex={2000}
      maskClosable={true}
    >
      <Vertical gap={24}>
        {/* Feature Prioritization Section */}
        <div>
          <Texto category='p1' weight='600' style={{ marginBottom: '12px', display: 'block' }}>
            Feature Prioritization
          </Texto>
          <Texto
            category='p2'
            appearance='medium'
            style={{ marginBottom: '16px', display: 'block', color: COLORS.LIGHT_TEXT }}
          >
            Control which features are visible
          </Texto>

          <Radio.Group value={featureMode} onChange={(e) => setFeatureMode(e.target.value)} style={{ width: '100%' }}>
            <Vertical gap={12}>
              {/* MVP Mode */}
              <div style={getOptionCardStyle(featureMode === 'mvp')} onClick={() => setFeatureMode('mvp')}>
                <Radio value='mvp' style={{ marginBottom: '8px' }}>
                  <Texto style={{ fontSize: '14px', fontWeight: 600, color: COLORS.DARK_TEXT }}>MVP Mode</Texto>
                </Radio>
                <Texto
                  style={{ fontSize: '12px', color: COLORS.LIGHT_TEXT, display: 'block', marginLeft: '24px' }}
                >
                  Shows core features ready for production. Hides future-state features.
                </Texto>
              </div>

              {/* Future State Mode */}
              <div
                style={getOptionCardStyle(featureMode === 'future-state')}
                onClick={() => setFeatureMode('future-state')}
              >
                <Radio value='future-state' style={{ marginBottom: '8px' }}>
                  <Texto style={{ fontSize: '14px', fontWeight: 600, color: COLORS.DARK_TEXT }}>Future State</Texto>
                </Radio>
                <Texto
                  style={{ fontSize: '12px', color: COLORS.LIGHT_TEXT, display: 'block', marginLeft: '24px' }}
                >
                  Shows all features including upcoming analytics, benchmarks, and advanced measurement tools.
                </Texto>
              </div>
            </Vertical>
          </Radio.Group>

          <div
            style={{
              marginTop: '12px',
              padding: '12px',
              backgroundColor: '#e6f4ff',
              borderRadius: '4px',
              border: '1px solid #91caff',
            }}
          >
            <Texto style={{ fontSize: '12px', color: COLORS.PRIMARY_BLUE, fontWeight: 500 }}>
              This setting applies globally across all pages
            </Texto>
          </div>
        </div>

        {/* User Role Section */}
        <div>
          <Texto category='p1' weight='600' style={{ marginBottom: '12px', display: 'block' }}>
            User Role
          </Texto>
          <Texto
            category='p2'
            appearance='medium'
            style={{ marginBottom: '16px', display: 'block', color: COLORS.LIGHT_TEXT }}
          >
            Simulate different permission levels
          </Texto>

          <div
            style={{
              padding: '16px',
              border: `1px solid ${COLORS.BORDER_GRAY}`,
              borderRadius: '8px',
              backgroundColor: COLORS.BACKGROUND_GRAY,
            }}
          >
            <Horizontal justifyContent='space-between' alignItems='center'>
              <div>
                <Texto style={{ fontSize: '14px', fontWeight: 600, color: COLORS.DARK_TEXT, display: 'block' }}>
                  Read Only Mode
                </Texto>
                <Texto style={{ fontSize: '12px', color: COLORS.LIGHT_TEXT, display: 'block', marginTop: '4px' }}>
                  Hides Archive and Restore actions
                </Texto>
              </div>
              <Switch checked={isReadOnly} onChange={onReadOnlyChange} />
            </Horizontal>
          </div>
        </div>
      </Vertical>
    </Drawer>
  )
}
