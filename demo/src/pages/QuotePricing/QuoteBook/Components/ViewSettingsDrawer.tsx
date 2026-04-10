import React from 'react'
import { Drawer, Radio } from 'antd'
import { Vertical, Texto } from '@gravitate-js/excalibrr'
import { useFeatureMode } from '../../../../contexts/FeatureModeContext'
import type { PeriodDisplay } from '../Api/types.schema'

const COLORS = {
  DARK_TEXT: '#262626',
  LIGHT_TEXT: '#8c8c8c',
  BORDER_GRAY: '#d9d9d9',
  BACKGROUND_GRAY: '#fafafa',
  PRIMARY_BLUE: '#0958d9',
}

interface ViewSettingsDrawerProps {
  open: boolean
  onClose: () => void
  periodDisplay?: PeriodDisplay
  onPeriodDisplayChange?: (v: PeriodDisplay) => void
}

export function ViewSettingsDrawer({ open, onClose, periodDisplay, onPeriodDisplayChange }: ViewSettingsDrawerProps) {
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
      title="View Settings"
      placement="right"
      width={400}
      onClose={onClose}
      open={open}
      zIndex={2000}
      maskClosable={true}
    >
      <Vertical gap={24}>
        <div>
          <Texto category="p1" weight="600" style={{ marginBottom: '12px', display: 'block' }}>
            Feature Prioritization
          </Texto>
          <Texto
            category="p2"
            appearance="medium"
            style={{ marginBottom: '16px', display: 'block', color: COLORS.LIGHT_TEXT }}
          >
            Control which features are visible
          </Texto>

          <Radio.Group value={featureMode} onChange={(e) => setFeatureMode(e.target.value)} style={{ width: '100%' }}>
            <Vertical gap={12}>
              <div style={getOptionCardStyle(featureMode === 'mvp')} onClick={() => setFeatureMode('mvp')}>
                <Radio value="mvp" style={{ marginBottom: '8px' }}>
                  <Texto style={{ fontSize: '14px', fontWeight: 600, color: COLORS.DARK_TEXT }}>MVP Mode</Texto>
                </Radio>
                <Texto style={{ fontSize: '12px', color: COLORS.LIGHT_TEXT, display: 'block', marginLeft: '24px' }}>
                  Shows core pricing features. Hides price exceptions and threshold management.
                </Texto>
              </div>

              <div
                style={getOptionCardStyle(featureMode === 'future-state')}
                onClick={() => setFeatureMode('future-state')}
              >
                <Radio value="future-state" style={{ marginBottom: '8px' }}>
                  <Texto style={{ fontSize: '14px', fontWeight: 600, color: COLORS.DARK_TEXT }}>Future State</Texto>
                </Radio>
                <Texto style={{ fontSize: '12px', color: COLORS.LIGHT_TEXT, display: 'block', marginLeft: '24px' }}>
                  Shows all features including price exceptions, threshold profiles, and publish workflow.
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

        {featureMode === 'future-state' && onPeriodDisplayChange && (
          <div>
            <Texto category="p1" weight="600" style={{ marginBottom: '12px', display: 'block' }}>
              Exception Period Display
            </Texto>
            <Texto
              category="p2"
              appearance="medium"
              style={{ marginBottom: '16px', display: 'block', color: COLORS.LIGHT_TEXT }}
            >
              How exception columns are organized by time period
            </Texto>

            <Radio.Group
              value={periodDisplay || 'neither'}
              onChange={(e) => onPeriodDisplayChange(e.target.value)}
              style={{ width: '100%' }}
            >
              <Vertical style={{ gap: '12px' }}>
                <div
                  style={getOptionCardStyle(periodDisplay === 'neither' || !periodDisplay)}
                  onClick={() => onPeriodDisplayChange('neither')}
                >
                  <Radio value="neither" style={{ marginBottom: '8px' }}>
                    <Texto style={{ fontSize: '14px', fontWeight: 600, color: COLORS.DARK_TEXT }}>Neither</Texto>
                  </Radio>
                  <Texto style={{ fontSize: '12px', color: COLORS.LIGHT_TEXT, display: 'block', marginLeft: '24px' }}>
                    Single "Exceptions" group (current behavior)
                  </Texto>
                </div>

                <div
                  style={getOptionCardStyle(periodDisplay === 'column-families')}
                  onClick={() => onPeriodDisplayChange('column-families')}
                >
                  <Radio value="column-families" style={{ marginBottom: '8px' }}>
                    <Texto style={{ fontSize: '14px', fontWeight: 600, color: COLORS.DARK_TEXT }}>Column Families</Texto>
                  </Radio>
                  <Texto style={{ fontSize: '12px', color: COLORS.LIGHT_TEXT, display: 'block', marginLeft: '24px' }}>
                    Split into "Proposed" and "Current" groups
                  </Texto>
                </div>

                <div
                  style={getOptionCardStyle(periodDisplay === 'toggle')}
                  onClick={() => onPeriodDisplayChange('toggle')}
                >
                  <Radio value="toggle" style={{ marginBottom: '8px' }}>
                    <Texto style={{ fontSize: '14px', fontWeight: 600, color: COLORS.DARK_TEXT }}>Toggle</Texto>
                  </Radio>
                  <Texto style={{ fontSize: '12px', color: COLORS.LIGHT_TEXT, display: 'block', marginLeft: '24px' }}>
                    Switch between periods with a pill control
                  </Texto>
                </div>
              </Vertical>
            </Radio.Group>
          </div>
        )}
      </Vertical>
    </Drawer>
  )
}
