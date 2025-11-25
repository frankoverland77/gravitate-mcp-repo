import React from 'react';
import { Drawer, Radio } from 'antd';
import { Vertical, Texto } from '@gravitate-js/excalibrr';
import { ViewSettingsDrawerProps, ViewMode } from '../IndexOfferManagement.types';
import { COLORS } from '../IndexOfferManagement.constants';

/**
 * ViewSettingsDrawer - Configuration drawer for view settings
 *
 * Allows users to:
 * - Toggle between MVP and Future State feature modes
 * - Select market context display mode (panel, columns, rank, analytics)
 * - View grid display options information
 */
export function ViewSettingsDrawer({
  visible,
  onClose,
  viewMode,
  setViewMode,
  isFutureMode,
  featureMode,
  setFeatureMode,
}: ViewSettingsDrawerProps) {

  /** Style for a selected radio option card */
  const getOptionCardStyle = (isSelected: boolean): React.CSSProperties => ({
    padding: '16px',
    border: isSelected ? '2px solid #1890ff' : `1px solid ${COLORS.BORDER_GRAY}`,
    borderRadius: '8px',
    backgroundColor: isSelected ? '#f0f7ff' : COLORS.BACKGROUND_GRAY,
    cursor: 'pointer',
    transition: 'all 0.2s',
  });

  return (
    <Drawer
      title="View Settings"
      placement="right"
      width={450}
      onClose={onClose}
      visible={visible}
      zIndex={2000}
      maskClosable={true}
    >
      <Vertical style={{ gap: '24px' }}>
        {/* Feature Prioritization Section */}
        <div>
          <Texto category="p1" weight="600" style={{ marginBottom: '12px', display: 'block' }}>
            Feature Prioritization
          </Texto>
          <Texto category="p2" appearance="medium" style={{ marginBottom: '16px', display: 'block', color: COLORS.LIGHT_TEXT }}>
            Control which features are visible
          </Texto>

          <Radio.Group
            value={featureMode}
            onChange={(e) => setFeatureMode(e.target.value)}
            style={{ width: '100%' }}
          >
            <Vertical style={{ gap: '12px' }}>
              {/* MVP Mode */}
              <div
                style={getOptionCardStyle(featureMode === 'mvp')}
                onClick={() => setFeatureMode('mvp')}
              >
                <Radio value="mvp" style={{ marginBottom: '8px' }}>
                  <Texto style={{ fontSize: '14px', fontWeight: 600, color: COLORS.DARK_TEXT }}>
                    MVP Mode
                  </Texto>
                </Radio>
                <Texto style={{ fontSize: '12px', color: COLORS.LIGHT_TEXT, display: 'block', marginLeft: '24px' }}>
                  Shows core features ready for production. Hides future-state features.
                </Texto>
              </div>

              {/* Future State Mode */}
              <div
                style={getOptionCardStyle(featureMode === 'future-state')}
                onClick={() => setFeatureMode('future-state')}
              >
                <Radio value="future-state" style={{ marginBottom: '8px' }}>
                  <Texto style={{ fontSize: '14px', fontWeight: 600, color: COLORS.DARK_TEXT }}>
                    Future State
                  </Texto>
                </Radio>
                <Texto style={{ fontSize: '12px', color: COLORS.LIGHT_TEXT, display: 'block', marginLeft: '24px' }}>
                  Shows all features including upcoming competitive analytics and market context.
                </Texto>
              </div>
            </Vertical>
          </Radio.Group>

          <div style={{
            marginTop: '12px',
            padding: '12px',
            backgroundColor: '#e6f4ff',
            borderRadius: '4px',
            border: '1px solid #91caff'
          }}>
            <Texto style={{ fontSize: '12px', color: COLORS.PRIMARY_BLUE, fontWeight: 500 }}>
              This setting applies globally across all pages
            </Texto>
          </div>
        </div>

        {/* Divider */}
        <div style={{ borderTop: `1px solid ${COLORS.BORDER_GRAY}` }} />

        {/* Market Context View Mode (only visible in Future State) */}
        {isFutureMode && (
          <div>
            <Texto category="p1" weight="600" style={{ marginBottom: '12px', display: 'block' }}>
              Market Context Display
            </Texto>
            <Texto category="p2" appearance="medium" style={{ marginBottom: '16px', display: 'block', color: COLORS.LIGHT_TEXT }}>
              Choose how competitive pricing context is displayed
            </Texto>

            <Radio.Group
              value={viewMode}
              onChange={(e) => setViewMode(e.target.value as ViewMode)}
              style={{ width: '100%' }}
            >
              <Vertical style={{ gap: '12px' }}>
                {/* Panel Mode */}
                <div
                  style={getOptionCardStyle(viewMode === 'panel')}
                  onClick={() => setViewMode('panel')}
                >
                  <Radio value="panel" style={{ marginBottom: '8px' }}>
                    <Texto style={{ fontSize: '14px', fontWeight: 600, color: COLORS.DARK_TEXT }}>
                      Analytics Panel View
                    </Texto>
                  </Radio>
                  <Texto style={{ fontSize: '12px', color: COLORS.LIGHT_TEXT, display: 'block', marginLeft: '24px' }}>
                    Click any row to see detailed market context in a panel above the grid. Shows Opus contracts, rack pricing, publisher data, volume pacing, and competitive rank.
                  </Texto>
                </div>

                {/* Columns Mode */}
                <div
                  style={getOptionCardStyle(viewMode === 'columns')}
                  onClick={() => setViewMode('columns')}
                >
                  <Radio value="columns" style={{ marginBottom: '8px' }}>
                    <Texto style={{ fontSize: '14px', fontWeight: 600, color: COLORS.DARK_TEXT }}>
                      Grid Columns View
                    </Texto>
                  </Radio>
                  <Texto style={{ fontSize: '12px', color: COLORS.LIGHT_TEXT, display: 'block', marginLeft: '24px' }}>
                    Add market data columns directly to the grid showing Opus low/avg prices, Argus pricing, rack delta, and competitive rank. Best for side-by-side comparison.
                  </Texto>
                </div>

                {/* Rank Mode */}
                <div
                  style={getOptionCardStyle(viewMode === 'rank')}
                  onClick={() => setViewMode('rank')}
                >
                  <Radio value="rank" style={{ marginBottom: '8px' }}>
                    <Texto style={{ fontSize: '14px', fontWeight: 600, color: COLORS.DARK_TEXT }}>
                      Rank Only View
                    </Texto>
                  </Radio>
                  <Texto style={{ fontSize: '12px', color: COLORS.LIGHT_TEXT, display: 'block', marginLeft: '24px' }}>
                    Show a single compact column with your competitive ranking (1-10). Minimal view for quick assessment of competitiveness.
                  </Texto>
                </div>

                {/* Analytics Grid Mode */}
                <div
                  style={getOptionCardStyle(viewMode === 'analytics')}
                  onClick={() => setViewMode('analytics')}
                >
                  <Radio value="analytics" style={{ marginBottom: '8px' }}>
                    <Texto style={{ fontSize: '14px', fontWeight: 600, color: COLORS.DARK_TEXT }}>
                      Analytics Grid View
                    </Texto>
                  </Radio>
                  <Texto style={{ fontSize: '12px', color: COLORS.LIGHT_TEXT, display: 'block', marginLeft: '24px' }}>
                    Click any row to see detailed competitive analysis in a grid format. Shows competitor prices, rankings, trends, and differences in a sortable table with visual indicators.
                  </Texto>
                </div>
              </Vertical>
            </Radio.Group>
          </div>
        )}

        {/* Divider */}
        {isFutureMode && <div style={{ borderTop: `1px solid ${COLORS.BORDER_GRAY}` }} />}

        {/* Grid Options */}
        <div>
          <Texto category="p1" weight="600" style={{ marginBottom: '12px', display: 'block' }}>
            Grid Display Options
          </Texto>
          <Texto category="p2" appearance="medium">
            Configure how index offers are displayed in the grid.
          </Texto>
        </div>

        <div>
          <Texto category="p2" weight="600" style={{ marginBottom: '8px', display: 'block' }}>
            Column Visibility
          </Texto>
          <Texto category="p2" appearance="medium" style={{ marginBottom: '12px', display: 'block' }}>
            Show/hide columns using the grid's column menu (click the hamburger icon in any column header).
          </Texto>
        </div>

        <div>
          <Texto category="p2" weight="600" style={{ marginBottom: '8px', display: 'block' }}>
            Grouping
          </Texto>
          <Texto category="p2" appearance="medium">
            Drag column headers to the grouping area at the top of the grid to group by that column.
          </Texto>
        </div>
      </Vertical>
    </Drawer>
  );
}

export default ViewSettingsDrawer;
