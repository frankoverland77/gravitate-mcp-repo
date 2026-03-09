import React from 'react';
import { Texto, Vertical, Horizontal } from '@gravitate-js/excalibrr';
import { DollarOutlined, BarChartOutlined } from '@ant-design/icons';

const cardStyle = {
  backgroundColor: '#ffffff',
  border: '1px solid #e8e8e8',
  borderRadius: '8px',
  padding: '24px',
  boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
};

export function PerformanceSummarySection() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <Texto category="h4" weight="600">Performance Summary</Texto>
        <Texto category="p2" appearance="medium">Comparing against Rack Average</Texto>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
        {/* Tile 1: Total Contract Value vs Benchmark */}
        <div style={cardStyle}>
          <Vertical gap={12}>
            <Horizontal gap={8} style={{ alignItems: 'center' }}>
              <DollarOutlined style={{ fontSize: '16px', color: '#8c8c8c' }} />
              <Texto category="p2" appearance="medium" style={{ textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Total Contract Value vs Benchmark
              </Texto>
            </Horizontal>
            <Texto category="h3" weight="600" style={{ color: '#52c41a' }}>
              +$17,272
            </Texto>
            <Texto category="p2" appearance="medium">
              Additional revenue captured
            </Texto>
            <Texto category="p2" style={{ color: '#52c41a' }}>
              ↗ 0.0%
            </Texto>
          </Vertical>
        </div>

        {/* Tile 2: Average $/gallon difference */}
        <div style={cardStyle}>
          <Vertical gap={12}>
            <Horizontal gap={8} style={{ alignItems: 'center' }}>
              <BarChartOutlined style={{ fontSize: '16px', color: '#8c8c8c' }} />
              <Texto category="p2" appearance="medium" style={{ textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Average $/gallon difference
              </Texto>
            </Horizontal>
            <Texto category="h3" weight="600" style={{ color: '#52c41a' }}>
              +$0.0371
            </Texto>
            <Texto category="p2" appearance="medium">
              Historical average over 26 days
            </Texto>
            <Texto category="p2" style={{ color: '#52c41a' }}>
              ↗ 0.0%
            </Texto>
          </Vertical>
        </div>
      </div>
    </div>
  );
}
