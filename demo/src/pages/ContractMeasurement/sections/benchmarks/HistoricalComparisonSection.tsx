import { useState, useMemo } from 'react'
import { Texto, GraviButton, Horizontal, Vertical } from '@gravitate-js/excalibrr'
import {
  ComposedChart,
  Area,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  ResponsiveContainer,
  Label,
} from 'recharts'
import { Select, Button } from 'antd'
import {
  LineChartOutlined,
  BarChartOutlined,
  EyeOutlined,
  EyeInvisibleOutlined,
  CopyOutlined,
  DownloadOutlined,
} from '@ant-design/icons'
import moment from 'moment'
import type { Scenario } from '../../types/scenario.types'

// ============================================================================
// STATIC DATA - ~26 days from Nov 9 to Dec 4, 2024
// ============================================================================

const generateChartData = () => {
  const startDate = moment('2024-11-09');
  const data = [];

  // Volume data (gallons) - varies day to day, some days have no lifting
  const volumeData = [
    8500, 6200, 7800, 5500, 3200, 0, 9200,
    7100, 5800, 8900, 4200, 6800, 3500, 0,
    5200, 7400, 6100, 4800, 0, 5900, 7200,
    8100, 6500, 4900, 7800, 9100,
  ];

  // Contract price (~$2.10 range, relatively stable)
  const contractPriceData = [
    2.08, 2.09, 2.09, 2.07, 2.10, 2.12, 2.11,
    2.10, 2.08, 2.09, 2.15, 2.12, 2.11, 2.10,
    2.09, 2.13, 2.12, 2.11, 2.10, 2.09, 2.10,
    2.11, 2.10, 2.09, 2.12, 2.11,
  ];

  // Rack Average (PRIMARY benchmark) - slightly below contract price
  const rackAverageData = [
    2.05, 2.04, 2.05, 2.03, 2.06, 2.08, 2.07,
    2.06, 2.04, 2.05, 2.11, 2.08, 2.07, 2.06,
    2.05, 2.09, 2.08, 2.07, 2.06, 2.05, 2.06,
    2.07, 2.06, 2.05, 2.08, 2.07,
  ];

  // Spot Price - more volatile, generally higher
  const spotPriceData = [
    2.18, 2.20, 2.19, 2.17, 2.21, 2.23, 2.22,
    2.19, 2.16, 2.18, 2.24, 2.20, 2.18, 2.17,
    2.16, 2.21, 2.23, 2.25, 2.27, 2.26, 2.24,
    2.22, 2.21, 2.20, 2.23, 2.25,
  ];

  for (let i = 0; i < 26; i++) {
    const date = startDate.clone().add(i, 'days');
    data.push({
      date: date.toDate(),
      dateLabel: date.format('MMM D'),
      volume: volumeData[i],
      contractPrice: contractPriceData[i],
      rackAverage: rackAverageData[i],
      spotPrice: spotPriceData[i],
      // Pre-calculated differences
      rackAvgDiff: Number((contractPriceData[i] - rackAverageData[i]).toFixed(4)),
      spotDiff: Number((contractPriceData[i] - spotPriceData[i]).toFixed(4)),
    });
  }

  return data;
};

const chartData = generateChartData();

// ============================================================================
// STYLES
// ============================================================================

const cardStyle = {
  backgroundColor: '#ffffff',
  border: '1px solid #e8e8e8',
  borderRadius: '8px',
  padding: '16px 20px',
  boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
};

// Chart colors (Quote Book aligned)
const chartColors = {
  contractPrice: '#1890ff',
  rackAverage: '#51b073',
  spotPrice: '#ff4d4f',
  volume: '#1890ff',
  zeroLine: '#bfbfbf',
};

// ============================================================================
// TYPES
// ============================================================================

type ViewMode = 'prices' | 'difference';

interface VisibleSeries {
  contractPrice: boolean;
  rackAverage: boolean;
  spotPrice: boolean;
}

// ============================================================================
// CUSTOM TOOLTIP COMPONENT
// ============================================================================

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    dataKey: string;
    value: number;
    color: string;
    name: string;
  }>;
  label?: string;
  viewMode: ViewMode;
}

const CustomTooltip = ({ active, payload, label, viewMode }: CustomTooltipProps) => {
  if (!active || !payload?.length) return null;

  const dataPoint = chartData.find(d => d.dateLabel === label);

  return (
    <Vertical
      style={{
        backgroundColor: '#ffffff',
        border: '1px solid #e8e8e8',
        borderRadius: '4px',
        padding: '12px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
        minWidth: 180,
      }}
    >
      <Texto category="p2" weight="600">
        {dataPoint ? moment(dataPoint.date).format('MMM. D, YYYY') : label}
      </Texto>

      {viewMode === 'prices' && dataPoint && (
        <Horizontal style={{ justifyContent: 'space-between', marginTop: '8px' }}>
          <Texto category="p2" appearance="medium">Lifting:</Texto>
          <Texto category="p2">
            {dataPoint.volume > 0 ? dataPoint.volume.toLocaleString() : 'No lifting'}
          </Texto>
        </Horizontal>
      )}

      <div style={{ marginTop: '8px' }}>
        {payload.map((item) => {
          if (item.dataKey === 'volume') return null;

          const value = item.value;
          const isDifference = viewMode === 'difference';
          let formattedValue: string;

          if (isDifference) {
            formattedValue = value >= 0
              ? `+$${value.toFixed(4)}`
              : `-$${Math.abs(value).toFixed(4)}`;
          } else {
            formattedValue = `$${value.toFixed(4)}`;
          }

          return (
            <Horizontal
              key={item.dataKey}
              style={{ justifyContent: 'space-between', marginTop: '4px' }}
            >
              <Texto style={{ color: item.color }}>{item.name}:</Texto>
              <Texto style={{ color: item.color, fontWeight: 500 }}>
                {formattedValue}
              </Texto>
            </Horizontal>
          );
        })}
      </div>
    </Vertical>
  );
};

// ============================================================================
// COMPONENT
// ============================================================================

interface HistoricalComparisonSectionProps {
  scenarios?: Scenario[]
}

export function HistoricalComparisonSection({ scenarios = [] }: HistoricalComparisonSectionProps) {
  const [activeView, setActiveView] = useState<ViewMode>('prices');
  const [visibleSeries, setVisibleSeries] = useState<VisibleSeries>({
    contractPrice: true,
    rackAverage: true,
    spotPrice: true,
  });
  const [selectedProduct, setSelectedProduct] = useState('all');

  const toggleSeries = (series: keyof VisibleSeries) => {
    setVisibleSeries(prev => ({
      ...prev,
      [series]: !prev[series],
    }));
  };

  // Calculate Y-axis domain for prices view
  const pricesDomain = useMemo(() => {
    const allPrices = chartData.flatMap(d => [d.contractPrice, d.rackAverage, d.spotPrice]);
    const min = Math.min(...allPrices);
    const max = Math.max(...allPrices);
    const padding = (max - min) * 0.1;
    return [min - padding, max + padding];
  }, []);

  // Calculate Y-axis domain for difference view
  const differenceDomain = useMemo(() => {
    const allDiffs = chartData.flatMap(d => [d.rackAvgDiff, d.spotDiff]);
    const absMax = Math.max(...allDiffs.map(Math.abs));
    const padding = absMax * 0.2;
    return [-(absMax + padding), absMax + padding];
  }, []);

  // Calculate volume domain
  const volumeDomain = useMemo(() => {
    const maxVolume = Math.max(...chartData.map(d => d.volume));
    return [0, maxVolume * 1.2];
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Header */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <Texto category="h4" weight="600">Historical Comparison</Texto>
        <Texto category="p2" appearance="medium">Track price trends over time against your benchmarks</Texto>
      </div>

      {/* Chart Card */}
      <div style={cardStyle}>
        {/* Controls Row */}
        <Horizontal style={{ justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
          {/* Left: View Toggle */}
          <Button.Group>
            <Button
              type={activeView === 'prices' ? 'primary' : 'default'}
              icon={<LineChartOutlined />}
              onClick={() => setActiveView('prices')}
              style={activeView === 'prices' ? { backgroundColor: '#51b073', borderColor: '#51b073' } : {}}
            >
              Prices & Volume
            </Button>
            <Button
              type={activeView === 'difference' ? 'primary' : 'default'}
              icon={<BarChartOutlined />}
              onClick={() => setActiveView('difference')}
              style={activeView === 'difference' ? { backgroundColor: '#51b073', borderColor: '#51b073' } : {}}
            >
              Difference
            </Button>
          </Button.Group>

          {/* Center: Product Filter */}
          <Horizontal style={{ alignItems: 'center', gap: '8px' }}>
            <Texto category="p2" appearance="medium">View:</Texto>
            <Select
              value={selectedProduct}
              onChange={setSelectedProduct}
              style={{ width: 220 }}
              options={[
                { value: 'all', label: 'Entire Contract (All Products)' },
                { value: '87-octane', label: '87 Octane - Houston' },
                { value: '89-octane', label: '89 Octane - Houston' },
                { value: 'diesel', label: 'Diesel - Dallas' },
              ]}
            />
          </Horizontal>

          {/* Right: Timestamp and Export */}
          <Horizontal style={{ alignItems: 'center', gap: '16px' }}>
            <Texto category="p2" appearance="medium">Updated 1m ago</Texto>
            <Horizontal style={{ gap: '8px' }}>
              <GraviButton icon={<CopyOutlined />}>Copy Data</GraviButton>
              <GraviButton icon={<DownloadOutlined />}>Export</GraviButton>
            </Horizontal>
          </Horizontal>
        </Horizontal>

        {/* Legend Controls */}
        <Horizontal style={{ gap: '24px', marginBottom: '16px', flexWrap: 'wrap' }}>
          {activeView === 'prices' && (
            <Horizontal
              style={{ alignItems: 'center', gap: '8px', cursor: 'pointer' }}
              onClick={() => toggleSeries('contractPrice')}
            >
              {visibleSeries.contractPrice ? (
                <EyeOutlined style={{ color: '#8c8c8c' }} />
              ) : (
                <EyeInvisibleOutlined style={{ color: '#bfbfbf' }} />
              )}
              <div style={{
                width: 12,
                height: 12,
                borderRadius: '50%',
                backgroundColor: visibleSeries.contractPrice ? chartColors.contractPrice : '#d9d9d9',
              }} />
              <Texto
                category="p2"
                style={{ color: visibleSeries.contractPrice ? '#262626' : '#bfbfbf' }}
              >
                Contract Price
              </Texto>
            </Horizontal>
          )}

          <Horizontal
            style={{ alignItems: 'center', gap: '8px', cursor: 'pointer' }}
            onClick={() => toggleSeries('rackAverage')}
          >
            {visibleSeries.rackAverage ? (
              <EyeOutlined style={{ color: '#8c8c8c' }} />
            ) : (
              <EyeInvisibleOutlined style={{ color: '#bfbfbf' }} />
            )}
            <div style={{
              width: 12,
              height: 12,
              borderRadius: '50%',
              backgroundColor: visibleSeries.rackAverage ? chartColors.rackAverage : '#d9d9d9',
            }} />
            <Texto
              category="p2"
              style={{ color: visibleSeries.rackAverage ? '#262626' : '#bfbfbf' }}
            >
              {activeView === 'prices' ? 'Rack Average' : 'Rack Average Difference'}
            </Texto>
            <div style={{
              backgroundColor: '#51b073',
              color: '#ffffff',
              fontSize: '10px',
              fontWeight: 600,
              padding: '2px 6px',
              borderRadius: '4px',
            }}>
              PRIMARY
            </div>
          </Horizontal>

          <Horizontal
            style={{ alignItems: 'center', gap: '8px', cursor: 'pointer' }}
            onClick={() => toggleSeries('spotPrice')}
          >
            {visibleSeries.spotPrice ? (
              <EyeOutlined style={{ color: '#8c8c8c' }} />
            ) : (
              <EyeInvisibleOutlined style={{ color: '#bfbfbf' }} />
            )}
            <div style={{
              width: 12,
              height: 12,
              borderRadius: '50%',
              backgroundColor: visibleSeries.spotPrice ? chartColors.spotPrice : '#d9d9d9',
            }} />
            <Texto
              category="p2"
              style={{ color: visibleSeries.spotPrice ? '#262626' : '#bfbfbf' }}
            >
              {activeView === 'prices' ? 'Spot Price' : 'Spot Price Difference'}
            </Texto>
          </Horizontal>
        </Horizontal>

        {/* Chart Container */}
        <div style={{ height: '400px' }}>
          <ResponsiveContainer width="100%" height="100%">
            {activeView === 'prices' ? (
              <ComposedChart data={chartData} margin={{ top: 20, right: 80, bottom: 20, left: 80 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />

                {/* X-Axis */}
                <XAxis
                  dataKey="dateLabel"
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 12 }}
                />

                {/* Left Y-Axis - Price */}
                <YAxis
                  yAxisId="price"
                  orientation="left"
                  domain={pricesDomain}
                  axisLine={false}
                  tickLine={false}
                  width={70}
                  tickFormatter={(value: number) => `$${value.toFixed(2)}`}
                  tick={{ fontSize: 12 }}
                >
                  <Label
                    value="PRICE"
                    angle={-90}
                    position="insideLeft"
                    fill="#8c8c8c"
                    style={{ textAnchor: 'middle', letterSpacing: '2px', fontSize: 11 }}
                  />
                </YAxis>

                {/* Right Y-Axis - Volume */}
                <YAxis
                  yAxisId="volume"
                  orientation="right"
                  domain={volumeDomain}
                  axisLine={false}
                  tickLine={false}
                  width={70}
                  tickFormatter={(value: number) => value > 0 ? `${(value / 1000).toFixed(0)}K` : '0'}
                  tick={{ fontSize: 12 }}
                >
                  <Label
                    value="VOLUME"
                    angle={90}
                    position="insideRight"
                    fill="#8c8c8c"
                    style={{ textAnchor: 'middle', letterSpacing: '2px', fontSize: 11 }}
                  />
                </YAxis>

                {/* Tooltip */}
                <Tooltip
                  content={<CustomTooltip viewMode="prices" />}
                  cursor={{ strokeDasharray: '3 3' }}
                />

                {/* Volume Bars - Behind lines */}
                <Bar
                  yAxisId="volume"
                  dataKey="volume"
                  fill={chartColors.volume}
                  fillOpacity={0.3}
                  barSize={10}
                  radius={[2, 2, 0, 0]}
                />

                {/* Contract Price - Area */}
                {visibleSeries.contractPrice && (
                  <Area
                    yAxisId="price"
                    type="monotone"
                    dataKey="contractPrice"
                    name="Contract Price"
                    stroke={chartColors.contractPrice}
                    fill={chartColors.contractPrice}
                    fillOpacity={0.15}
                    strokeWidth={2}
                    dot={{ r: 3, fill: chartColors.contractPrice }}
                    activeDot={{ r: 5 }}
                  />
                )}

                {/* Rack Average - Thick Line (PRIMARY) */}
                {visibleSeries.rackAverage && (
                  <Line
                    yAxisId="price"
                    type="monotone"
                    dataKey="rackAverage"
                    name="Rack Average"
                    stroke={chartColors.rackAverage}
                    strokeWidth={3}
                    dot={{ r: 3, fill: chartColors.rackAverage }}
                    activeDot={{ r: 5 }}
                  />
                )}

                {/* Spot Price - Dashed Line */}
                {visibleSeries.spotPrice && (
                  <Line
                    yAxisId="price"
                    type="monotone"
                    dataKey="spotPrice"
                    name="Spot Price"
                    stroke={chartColors.spotPrice}
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    dot={{ r: 3, fill: chartColors.spotPrice }}
                    activeDot={{ r: 5 }}
                  />
                )}
              </ComposedChart>
            ) : (
              <ComposedChart data={chartData} margin={{ top: 20, right: 40, bottom: 20, left: 80 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />

                {/* X-Axis */}
                <XAxis
                  dataKey="dateLabel"
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 12 }}
                />

                {/* Y-Axis - Difference */}
                <YAxis
                  domain={differenceDomain}
                  axisLine={false}
                  tickLine={false}
                  width={70}
                  tickFormatter={(value: number) =>
                    value >= 0 ? `+$${value.toFixed(2)}` : `-$${Math.abs(value).toFixed(2)}`
                  }
                  tick={{ fontSize: 12 }}
                >
                  <Label
                    value="DIFFERENCE"
                    angle={-90}
                    position="insideLeft"
                    fill="#8c8c8c"
                    style={{ textAnchor: 'middle', letterSpacing: '2px', fontSize: 11 }}
                  />
                </YAxis>

                {/* Zero Reference Line */}
                <ReferenceLine
                  y={0}
                  stroke={chartColors.zeroLine}
                  strokeDasharray="4 4"
                  strokeWidth={1}
                />

                {/* Tooltip */}
                <Tooltip
                  content={<CustomTooltip viewMode="difference" />}
                  cursor={{ strokeDasharray: '3 3' }}
                />

                {/* Rack Average Difference - Solid Line */}
                {visibleSeries.rackAverage && (
                  <Line
                    type="monotone"
                    dataKey="rackAvgDiff"
                    name="Rack Average Difference"
                    stroke={chartColors.rackAverage}
                    strokeWidth={2}
                    dot={{ r: 3, fill: chartColors.rackAverage }}
                    activeDot={{ r: 5 }}
                  />
                )}

                {/* Spot Price Difference - Dashed Line */}
                {visibleSeries.spotPrice && (
                  <Line
                    type="monotone"
                    dataKey="spotDiff"
                    name="Spot Price Difference"
                    stroke={chartColors.spotPrice}
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    dot={{ r: 3, fill: chartColors.spotPrice }}
                    activeDot={{ r: 5 }}
                  />
                )}
              </ComposedChart>
            )}
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
