import { Vertical, Horizontal, Texto } from '@gravitate-js/excalibrr';
import { Tag } from 'antd';
import {
  BarChartOutlined,
  LineChartOutlined,
  PieChartOutlined,
  WarningOutlined,
} from '@ant-design/icons';

// Static data for charts
const VOLUME_DATA = [
  { product: 'Regular', location: 'Houston', target: 250000, actual: 220000 },
  { product: 'Premium', location: 'Houston', target: 180000, actual: 195000 },
  { product: 'Diesel', location: 'Houston', target: 300000, actual: 280000 },
  { product: 'Regular', location: 'Dallas', target: 200000, actual: 185000 },
  { product: 'Premium', location: 'Dallas', target: 150000, actual: 160000 },
];

const PRODUCT_MIX = [
  { name: 'Regular', percentage: 35, color: '#51b073' },
  { name: 'Premium', percentage: 25, color: '#1890ff' },
  { name: 'Diesel', percentage: 28, color: '#faad14' },
  { name: 'Other', percentage: 12, color: '#8c8c8c' },
];

const RISK_FACTORS = [
  { name: 'Pace Factor', weight: 40, score: 72, status: 'medium' as const },
  { name: 'Pattern Factor', weight: 30, score: 85, status: 'good' as const },
  { name: 'Time Factor', weight: 30, score: 58, status: 'poor' as const },
];

const cardStyle = {
  backgroundColor: '#ffffff',
  border: '1px solid #e8e8e8',
  borderRadius: '8px',
  padding: '24px',
  boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
  minHeight: '380px',
};

export function ContractAnalyticsSection() {
  const maxVolume = Math.max(...VOLUME_DATA.map((d) => Math.max(d.target, d.actual)));

  return (
    <Vertical style={{ gap: '16px' }}>
      {/* Section Header */}
      <div>
        <Texto category="h4" weight="600">Contract Analytics</Texto>
        <Texto category="p2" appearance="medium">Comprehensive performance analysis and trend visualization</Texto>
      </div>

      {/* 2x2 Grid of Charts */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', alignItems: 'stretch' }}>
        {/* Chart 1: Volume Performance */}
        <div style={{ ...cardStyle, display: 'flex', flexDirection: 'column' }}>
          <Horizontal style={{ alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
            <BarChartOutlined style={{ fontSize: '18px', color: '#8c8c8c' }} />
            <Texto category="h5" weight="600">Volume Performance</Texto>
          </Horizontal>

          <Vertical style={{ gap: '12px' }}>
            {VOLUME_DATA.map((item, index) => {
              const targetWidth = (item.target / maxVolume) * 100;
              const actualWidth = (item.actual / maxVolume) * 100;
              const isAboveTarget = item.actual >= item.target;

              return (
                <div key={index}>
                  <Horizontal style={{ justifyContent: 'space-between', marginBottom: '4px' }}>
                    <Texto category="p2" appearance="medium" style={{ fontSize: '11px' }}>
                      {item.product} - {item.location}
                    </Texto>
                    <Texto category="p2" style={{ fontSize: '11px', color: isAboveTarget ? '#52c41a' : '#cf1322' }}>
                      {isAboveTarget ? '+' : ''}{((item.actual - item.target) / item.target * 100).toFixed(1)}%
                    </Texto>
                  </Horizontal>
                  <div style={{ position: 'relative', height: '16px' }}>
                    {/* Target bar (background) */}
                    <div
                      style={{
                        position: 'absolute',
                        width: `${targetWidth}%`,
                        height: '100%',
                        backgroundColor: '#e8e8e8',
                        borderRadius: '3px',
                      }}
                    />
                    {/* Actual bar (foreground) */}
                    <div
                      style={{
                        position: 'absolute',
                        width: `${actualWidth}%`,
                        height: '100%',
                        backgroundColor: isAboveTarget ? '#52c41a' : '#faad14',
                        borderRadius: '3px',
                        opacity: 0.8,
                      }}
                    />
                  </div>
                </div>
              );
            })}

            {/* Legend */}
            <Horizontal style={{ gap: '16px', marginTop: '8px' }}>
              <Horizontal style={{ alignItems: 'center', gap: '6px' }}>
                <div style={{ width: '12px', height: '12px', backgroundColor: '#e8e8e8', borderRadius: '2px' }} />
                <Texto category="p2" appearance="medium" style={{ fontSize: '11px' }}>Target</Texto>
              </Horizontal>
              <Horizontal style={{ alignItems: 'center', gap: '6px' }}>
                <div style={{ width: '12px', height: '12px', backgroundColor: '#52c41a', borderRadius: '2px' }} />
                <Texto category="p2" appearance="medium" style={{ fontSize: '11px' }}>Actual</Texto>
              </Horizontal>
            </Horizontal>
          </Vertical>
        </div>

        {/* Chart 2: Financial Performance Trend */}
        <div style={{ ...cardStyle, display: 'flex', flexDirection: 'column' }}>
          <Horizontal style={{ alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
            <LineChartOutlined style={{ fontSize: '18px', color: '#8c8c8c' }} />
            <Texto category="h5" weight="600">Financial Performance Trend</Texto>
          </Horizontal>

          {/* Simple SVG Area Chart */}
          <div style={{ height: '200px', position: 'relative' }}>
            <svg width="100%" height="100%" viewBox="0 0 300 150" preserveAspectRatio="none">
              {/* Grid lines */}
              {[0, 1, 2, 3, 4].map((i) => (
                <line
                  key={i}
                  x1="0"
                  y1={i * 37.5}
                  x2="300"
                  y2={i * 37.5}
                  stroke="#e8e8e8"
                  strokeWidth="1"
                />
              ))}

              {/* Area fill */}
              <path
                d="M0,120 L50,100 L100,90 L150,70 L200,50 L250,40 L300,30 L300,150 L0,150 Z"
                fill="url(#greenGradient)"
              />

              {/* Line */}
              <path
                d="M0,120 L50,100 L100,90 L150,70 L200,50 L250,40 L300,30"
                stroke="#52c41a"
                strokeWidth="2"
                fill="none"
              />

              {/* Gradient definition */}
              <defs>
                <linearGradient id="greenGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#52c41a" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#52c41a" stopOpacity="0.05" />
                </linearGradient>
              </defs>
            </svg>

            {/* Y-axis labels */}
            <div style={{ position: 'absolute', left: '0', top: '0', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <Texto category="p2" appearance="medium" style={{ fontSize: '10px' }}>$3M</Texto>
              <Texto category="p2" appearance="medium" style={{ fontSize: '10px' }}>$0</Texto>
            </div>
          </div>

          {/* X-axis labels */}
          <Horizontal style={{ justifyContent: 'space-between', marginTop: '8px' }}>
            <Texto category="p2" appearance="medium" style={{ fontSize: '10px' }}>Jan</Texto>
            <Texto category="p2" appearance="medium" style={{ fontSize: '10px' }}>Mar</Texto>
            <Texto category="p2" appearance="medium" style={{ fontSize: '10px' }}>May</Texto>
            <Texto category="p2" appearance="medium" style={{ fontSize: '10px' }}>Jul</Texto>
            <Texto category="p2" appearance="medium" style={{ fontSize: '10px' }}>Sep</Texto>
            <Texto category="p2" appearance="medium" style={{ fontSize: '10px' }}>Nov</Texto>
          </Horizontal>

          {/* Summary */}
          <Horizontal style={{ justifyContent: 'space-between', marginTop: '16px' }}>
            <Texto category="p2" appearance="medium">Cumulative Savings</Texto>
            <Texto category="p2" weight="600" style={{ color: '#52c41a' }}>+$2.45M</Texto>
          </Horizontal>
        </div>

        {/* Chart 3: Product Mix */}
        <div style={{ ...cardStyle, display: 'flex', flexDirection: 'column' }}>
          <Horizontal style={{ alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
            <PieChartOutlined style={{ fontSize: '18px', color: '#8c8c8c' }} />
            <Texto category="h5" weight="600">Product Mix</Texto>
          </Horizontal>

          <Horizontal style={{ gap: '24px', alignItems: 'center' }}>
            {/* Simple Donut Chart using CSS */}
            <div
              style={{
                width: '160px',
                height: '160px',
                borderRadius: '50%',
                background: `conic-gradient(
                  ${PRODUCT_MIX[0].color} 0deg ${PRODUCT_MIX[0].percentage * 3.6}deg,
                  ${PRODUCT_MIX[1].color} ${PRODUCT_MIX[0].percentage * 3.6}deg ${(PRODUCT_MIX[0].percentage + PRODUCT_MIX[1].percentage) * 3.6}deg,
                  ${PRODUCT_MIX[2].color} ${(PRODUCT_MIX[0].percentage + PRODUCT_MIX[1].percentage) * 3.6}deg ${(PRODUCT_MIX[0].percentage + PRODUCT_MIX[1].percentage + PRODUCT_MIX[2].percentage) * 3.6}deg,
                  ${PRODUCT_MIX[3].color} ${(PRODUCT_MIX[0].percentage + PRODUCT_MIX[1].percentage + PRODUCT_MIX[2].percentage) * 3.6}deg 360deg
                )`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <div
                style={{
                  width: '80px',
                  height: '80px',
                  borderRadius: '50%',
                  backgroundColor: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Texto category="p1" weight="600">100%</Texto>
              </div>
            </div>

            {/* Legend */}
            <Vertical style={{ gap: '12px', flex: 1 }}>
              {PRODUCT_MIX.map((item, index) => (
                <Horizontal key={index} style={{ alignItems: 'center', justifyContent: 'space-between' }}>
                  <Horizontal style={{ alignItems: 'center', gap: '8px' }}>
                    <div
                      style={{
                        width: '12px',
                        height: '12px',
                        backgroundColor: item.color,
                        borderRadius: '2px',
                      }}
                    />
                    <Texto category="p2">{item.name}</Texto>
                  </Horizontal>
                  <Texto category="p2" weight="600">{item.percentage}%</Texto>
                </Horizontal>
              ))}
            </Vertical>
          </Horizontal>
        </div>

        {/* Chart 4: Risk Assessment */}
        <div style={{ ...cardStyle, display: 'flex', flexDirection: 'column' }}>
          <Horizontal style={{ alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
            <WarningOutlined style={{ fontSize: '18px', color: '#cf1322' }} />
            <Texto category="h5" weight="600">Risk Assessment</Texto>
          </Horizontal>

          <Vertical style={{ gap: '20px' }}>
            {/* Overall Score */}
            <Horizontal style={{ alignItems: 'center', gap: '16px' }}>
              <div
                style={{
                  width: '80px',
                  height: '80px',
                  borderRadius: '50%',
                  border: '6px solid #cf1322',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Texto category="h3" weight="600">7.2</Texto>
              </div>
              <Vertical style={{ gap: '4px' }}>
                <Tag color="error" style={{ fontSize: '14px', padding: '4px 12px' }}>HIGH RISK</Tag>
                <Texto category="p2" appearance="medium">Overall Risk Score</Texto>
              </Vertical>
            </Horizontal>

            {/* Risk Factors */}
            <Vertical style={{ gap: '12px' }}>
              <Texto category="p2" appearance="medium" style={{ textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Risk Factors
              </Texto>
              {RISK_FACTORS.map((factor, index) => {
                const statusColor =
                  factor.status === 'good' ? '#52c41a' : factor.status === 'medium' ? '#faad14' : '#cf1322';

                return (
                  <div key={index}>
                    <Horizontal style={{ justifyContent: 'space-between', marginBottom: '4px' }}>
                      <Texto category="p2">{factor.name}</Texto>
                      <Horizontal style={{ gap: '8px', alignItems: 'center' }}>
                        <Texto category="p2" appearance="medium">{factor.weight}% weight</Texto>
                        <Texto category="p2" weight="600" style={{ color: statusColor }}>
                          {factor.score}
                        </Texto>
                      </Horizontal>
                    </Horizontal>
                    <div style={{ width: '100%', height: '6px', backgroundColor: '#e8e8e8', borderRadius: '3px' }}>
                      <div
                        style={{
                          width: `${factor.score}%`,
                          height: '100%',
                          backgroundColor: statusColor,
                          borderRadius: '3px',
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </Vertical>
          </Vertical>
        </div>
      </div>
    </Vertical>
  );
}

export default ContractAnalyticsSection;
