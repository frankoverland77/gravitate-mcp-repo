import { Vertical, Horizontal, Texto, BBDTag } from '@gravitate-js/excalibrr';
import { CalendarOutlined, BarChartOutlined, ArrowUpOutlined } from '@ant-design/icons';

// Static data for quick insights
const INTERVAL_DATA = {
  type: 'Monthly',
  actual: 85000,
  target: 100000,
  daysLeft: 12,
  status: 'onTrack' as const,
  percentComplete: 85,
};

const BENCHMARK_DATA = {
  name: 'Rack Average',
  spread: 0.0125,
  isOutperforming: true,
  winRate: 65,
  sparklineData: [0.012, 0.011, 0.013, 0.0125, 0.014, 0.0125, 0.0125],
};

const cardStyle = {
  backgroundColor: '#ffffff',
  border: '1px solid #e8e8e8',
  borderRadius: '8px',
  padding: '24px',
  boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
};

export function QuickInsightsSection() {
  const statusColor = INTERVAL_DATA.status === 'onTrack' ? '#52c41a' : '#cf1322';
  const statusText = INTERVAL_DATA.status === 'onTrack' ? 'On Track' : 'Behind';

  return (
    <Vertical gap={16}>
      {/* Section Header */}
      <div>
        <Texto category="h4" weight="600">Quick Insights</Texto>
        <Texto category="p2" appearance="medium">Interval tracking and benchmark comparison widgets</Texto>
      </div>

      {/* Two-column layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', alignItems: 'stretch' }}>
        {/* Widget 1: Interval Progress */}
        <div style={{ ...cardStyle, display: 'flex', flexDirection: 'column' }}>
          <Horizontal gap={8} style={{ alignItems: 'center', marginBottom: '20px' }}>
            <CalendarOutlined style={{ fontSize: '18px', color: '#8c8c8c' }} />
            <Texto category="h5" weight="600">{INTERVAL_DATA.type} Progress</Texto>
          </Horizontal>

          <Vertical gap={16}>
            {/* Progress Bar */}
            <div>
              <Horizontal style={{ justifyContent: 'space-between', marginBottom: '8px' }}>
                <Texto category="p2" appearance="medium">Current Progress</Texto>
                <Texto category="p2" weight="600">{INTERVAL_DATA.percentComplete}%</Texto>
              </Horizontal>
              <div style={{ width: '100%', height: '10px', backgroundColor: '#e8e8e8', borderRadius: '5px' }}>
                <div
                  style={{
                    width: `${INTERVAL_DATA.percentComplete}%`,
                    height: '100%',
                    backgroundColor: statusColor,
                    borderRadius: '5px',
                  }}
                />
              </div>
            </div>

            {/* Details */}
            <Texto category="p2" appearance="medium">
              {INTERVAL_DATA.actual.toLocaleString()} / {INTERVAL_DATA.target.toLocaleString()} units
              <span style={{ margin: '0 8px' }}>•</span>
              {INTERVAL_DATA.daysLeft} days left
            </Texto>

            {/* Status Badge */}
            <div>
              <BBDTag
                success={INTERVAL_DATA.status === 'onTrack'}
                error={INTERVAL_DATA.status !== 'onTrack'}
                style={{ fontSize: '12px', padding: '2px 8px' }}
              >
                {statusText}
              </BBDTag>
            </div>
          </Vertical>
        </div>

        {/* Widget 2: Benchmark Performance */}
        <div style={{ ...cardStyle, display: 'flex', flexDirection: 'column' }}>
          <Horizontal gap={8} style={{ alignItems: 'center', marginBottom: '20px' }}>
            <BarChartOutlined style={{ fontSize: '18px', color: '#8c8c8c' }} />
            <Texto category="h5" weight="600">Benchmark Performance</Texto>
          </Horizontal>

          <Vertical gap={16}>
            {/* Current Spread */}
            <div>
              <Texto
                category="h2"
                weight="600"
                style={{ color: BENCHMARK_DATA.isOutperforming ? '#52c41a' : '#cf1322' }}
              >
                {BENCHMARK_DATA.isOutperforming ? '+' : '-'}${BENCHMARK_DATA.spread.toFixed(4)}
              </Texto>
              <Texto category="p2" appearance="medium">vs {BENCHMARK_DATA.name}</Texto>
            </div>

            {/* Performance Badge */}
            <Horizontal gap={8} style={{ alignItems: 'center' }}>
              <BBDTag
                success={BENCHMARK_DATA.isOutperforming}
                error={!BENCHMARK_DATA.isOutperforming}
                style={{ fontSize: '12px', padding: '2px 8px' }}
              >
                <Horizontal gap={4} style={{ alignItems: 'center' }}>
                  <ArrowUpOutlined style={{ fontSize: '12px' }} />
                  {BENCHMARK_DATA.isOutperforming ? 'Outperforming' : 'Underperforming'}
                </Horizontal>
              </BBDTag>
            </Horizontal>

            {/* Simple Sparkline (static bars) */}
            <div>
              <Texto category="p2" appearance="medium" style={{ marginBottom: '8px', display: 'block' }}>
                7-Day Trend
              </Texto>
              <Horizontal gap={4} style={{ alignItems: 'flex-end', height: '40px' }}>
                {BENCHMARK_DATA.sparklineData.map((value, index) => {
                  const height = (value / 0.02) * 100; // Normalize to max of 0.02
                  return (
                    <div
                      key={index}
                      style={{
                        width: '24px',
                        height: `${height}%`,
                        backgroundColor: BENCHMARK_DATA.isOutperforming ? '#52c41a' : '#cf1322',
                        borderRadius: '2px',
                        opacity: 0.6 + (index * 0.05),
                      }}
                    />
                  );
                })}
              </Horizontal>
            </div>

            {/* Win Rate */}
            <Horizontal style={{ justifyContent: 'space-between' }}>
              <Texto category="p2" appearance="medium">Win Rate</Texto>
              <Texto category="p2" weight="600" style={{ color: '#52c41a' }}>
                {BENCHMARK_DATA.winRate}%
              </Texto>
            </Horizontal>
          </Vertical>
        </div>
      </div>
    </Vertical>
  );
}

export default QuickInsightsSection;
