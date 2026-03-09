import { Vertical, Horizontal, Texto, BBDTag } from '@gravitate-js/excalibrr';
import {
  LineChartOutlined,
  ClockCircleOutlined,
  DollarOutlined,
  WarningOutlined,
  ArrowUpOutlined,
} from '@ant-design/icons';

// Static data for the performance overview
const METRICS = {
  volumeProgress: 68.5,
  currentVolume: 1370000,
  totalVolume: 2000000,
  volumeTrend: 8.2,
  daysRemaining: 245,
  endDate: 'Dec 31, 2024',
  financialImpact: 2450000,
  financialTrend: 12.5,
  riskScore: 7.2,
  riskLevel: 'HIGH',
};

const cardStyle = {
  backgroundColor: '#ffffff',
  border: '1px solid #e8e8e8',
  borderRadius: '8px',
  padding: '24px',
  boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
};

export function PerformanceOverviewSection() {
  return (
    <Vertical gap={16}>
      {/* Section Header */}
      <div>
        <Texto category="h4" weight="600">Performance Overview</Texto>
        <Texto category="p2" appearance="medium">Key metrics and current contract status</Texto>
      </div>

      {/* 4 Metric Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', alignItems: 'stretch' }}>
        {/* Card 1: Volume Progress */}
        <div style={{ ...cardStyle, display: 'flex', flexDirection: 'column' }}>
          <Vertical gap={12}>
            <Horizontal gap={8} style={{ alignItems: 'center' }}>
              <LineChartOutlined style={{ fontSize: '16px', color: '#8c8c8c' }} />
              <Texto category="p2" appearance="medium" style={{ textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Volume Progress
              </Texto>
            </Horizontal>
            <Horizontal gap={8} style={{ alignItems: 'baseline' }}>
              <Texto category="h3" weight="600">
                {METRICS.volumeProgress}%
              </Texto>
            </Horizontal>
            <Texto category="p2" appearance="medium">
              {METRICS.currentVolume.toLocaleString()} / {METRICS.totalVolume.toLocaleString()} units
            </Texto>
            <Horizontal gap={4} style={{ alignItems: 'center' }}>
              <ArrowUpOutlined style={{ fontSize: '12px', color: '#52c41a' }} />
              <Texto category="p2" style={{ color: '#52c41a' }}>
                +{METRICS.volumeTrend}% vs target pace
              </Texto>
            </Horizontal>
          </Vertical>
        </div>

        {/* Card 2: Days Remaining */}
        <div style={{ ...cardStyle, display: 'flex', flexDirection: 'column' }}>
          <Vertical gap={12}>
            <Horizontal gap={8} style={{ alignItems: 'center' }}>
              <ClockCircleOutlined style={{ fontSize: '16px', color: '#8c8c8c' }} />
              <Texto category="p2" appearance="medium" style={{ textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Days Remaining
              </Texto>
            </Horizontal>
            <Texto category="h3" weight="600" style={{ color: '#52c41a' }}>
              {METRICS.daysRemaining}
            </Texto>
            <Texto category="p2" appearance="medium">
              Until {METRICS.endDate}
            </Texto>
          </Vertical>
        </div>

        {/* Card 3: Financial Impact */}
        <div style={{ ...cardStyle, display: 'flex', flexDirection: 'column' }}>
          <Vertical gap={12}>
            <Horizontal gap={8} style={{ alignItems: 'center' }}>
              <DollarOutlined style={{ fontSize: '16px', color: '#8c8c8c' }} />
              <Texto category="p2" appearance="medium" style={{ textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Financial Impact
              </Texto>
            </Horizontal>
            <Texto category="h3" weight="600" style={{ color: '#52c41a' }}>
              +${METRICS.financialImpact.toLocaleString()}
            </Texto>
            <Texto category="p2" appearance="medium">
              Savings impact
            </Texto>
            <Horizontal gap={4} style={{ alignItems: 'center' }}>
              <ArrowUpOutlined style={{ fontSize: '12px', color: '#52c41a' }} />
              <Texto category="p2" style={{ color: '#52c41a' }}>
                +{METRICS.financialTrend}% vs last month
              </Texto>
            </Horizontal>
          </Vertical>
        </div>

        {/* Card 4: Risk Assessment */}
        <div style={{ ...cardStyle, display: 'flex', flexDirection: 'column' }}>
          <Vertical gap={12}>
            <Horizontal gap={8} style={{ alignItems: 'center' }}>
              <WarningOutlined style={{ fontSize: '16px', color: '#cf1322' }} />
              <Texto category="p2" appearance="medium" style={{ textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Risk Assessment
              </Texto>
            </Horizontal>
            <Horizontal gap={12} style={{ alignItems: 'center' }}>
              <Texto category="h3" weight="600">
                {METRICS.riskScore}
              </Texto>
              <BBDTag error style={{ fontSize: '12px', padding: '2px 8px' }}>{METRICS.riskLevel}</BBDTag>
            </Horizontal>
            <Texto category="p2" appearance="medium">
              High risk level
            </Texto>
          </Vertical>
        </div>
      </div>
    </Vertical>
  );
}

export default PerformanceOverviewSection;
