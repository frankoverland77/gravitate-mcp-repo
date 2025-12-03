import { useState } from 'react';
import { Vertical, Texto, Horizontal, GraviButton } from '@gravitate-js/excalibrr';
import { AimOutlined, ArrowUpOutlined, ArrowDownOutlined, ClockCircleOutlined, LeftOutlined } from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import { ResponsiveScatterPlot, ScatterPlotTooltipProps } from '@nivo/scatterplot';
import { ResponsiveLine, PointTooltipProps } from '@nivo/line';
import { getBehavioralMetrics, getCompetitorChartDataByPeriod, TimePeriod } from './CompetitorAnalysis.data';

// ============================================
// CUSTOM TOOLTIPS
// ============================================
const tooltipStyle = {
    backgroundColor: '#ffffff',
    border: '1px solid #e8e8e8',
    borderRadius: '4px',
    padding: '8px 12px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
    fontSize: '12px'
};

const PriceChangeTooltip = ({ node }: ScatterPlotTooltipProps<{ x: number; y: number }>) => (
    <div style={tooltipStyle}>
        <div style={{ fontWeight: 600, marginBottom: '4px' }}>
            {node.data.x >= 0 ? 'Up Market' : 'Down Market'}
        </div>
        <div>Market Change: <strong>${node.data.x.toFixed(3)}</strong></div>
        <div>Competitor Change: <strong>${node.data.y.toFixed(3)}</strong></div>
    </div>
);

const CaptureRateTooltip = ({ node }: ScatterPlotTooltipProps<{ x: number; y: number }>) => (
    <div style={tooltipStyle}>
        <div>Capture Rate: <strong>{node.data.y.toFixed(1)}%</strong></div>
        <div>Size: <strong>{node.data.x.toFixed(2)}</strong></div>
    </div>
);

const ConsistencyTooltip = ({ point }: PointTooltipProps) => (
    <div style={tooltipStyle}>
        <div style={{ fontWeight: 600, marginBottom: '4px', color: point.serieColor }}>
            {point.serieId}
        </div>
        <div>Date: <strong>{point.data.xFormatted}</strong></div>
        <div>Capture Rate: <strong>{point.data.yFormatted}%</strong></div>
    </div>
);

// ============================================
// CARD STYLE
// ============================================
const cardStyle = {
    backgroundColor: '#ffffff',
    border: '1px solid #e8e8e8',
    borderRadius: '8px',
    padding: '16px'
};

// Default fallback data when accessed directly (no state)
const DEFAULT_COMPETITOR = {
    id: 1,
    competitor: 'ExxonMobil',
    product: '#2 ULSD',
    location: 'Houston TX'
};

// ============================================
// COMPONENT
// ============================================
export function CompetitorDetails() {
    const navigate = useNavigate();
    const location = useLocation();
    const [period, setPeriod] = useState<TimePeriod>('365');

    // Get competitor from navigation state, or use default
    const competitorData = location.state?.competitor || DEFAULT_COMPETITOR;
    const competitorId = competitorData.id || 1;

    // Get behavioral metrics and chart data based on competitor ID and period
    const metrics = getBehavioralMetrics(competitorId);
    const chartData = getCompetitorChartDataByPeriod(competitorId, period);

    const handleBackClick = () => {
        navigate('/CompetitorAnalysis/CompetitorProfileAnalysis');
    };

    // Button style helper
    const getButtonStyle = (buttonPeriod: TimePeriod) => {
        if (period === buttonPeriod) {
            return { backgroundColor: '#51B073', borderColor: '#51B073', color: '#ffffff' };
        }
        return {};
    };

    return (
        <Vertical style={{ height: '100%', padding: '32px', gap: '24px', overflow: 'auto' }}>

            {/* Back Link */}
            <Horizontal
                style={{ alignItems: 'center', gap: '6px', cursor: 'pointer', color: '#1890ff', width: 'fit-content' }}
                onClick={handleBackClick}
            >
                <LeftOutlined style={{ fontSize: '12px' }} />
                <Texto category="p2" style={{ color: '#1890ff' }}>Back to Competitor Price Analysis</Texto>
            </Horizontal>

            {/* Title */}
            <Texto category="h3" weight="600">
                Market Movement Analysis - {competitorData.competitor} - {competitorData.product} - {competitorData.location}
            </Texto>

            {/* Section Label */}
            <Texto category="h6" weight="600">
                Behavioral Profile
            </Texto>

            {/* 4 Profile Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>

                {/* Card 1: Strategy */}
                <div style={cardStyle}>
                    <Vertical style={{ gap: '8px' }}>
                        <Horizontal style={{ alignItems: 'center', gap: '8px' }}>
                            <AimOutlined style={{ fontSize: '16px', color: '#722ed1' }} />
                            <Texto category="p2" appearance="medium">Strategy</Texto>
                        </Horizontal>
                        <Texto category="h4" weight="600">{metrics.strategy}</Texto>
                        <Texto category="p2" appearance="medium">Position: {metrics.position}</Texto>
                        <Texto category="p2" style={{ color: '#51B073' }}>Consistency: {metrics.consistency}</Texto>
                    </Vertical>
                </div>

                {/* Card 2: Up Market Capture */}
                <div style={cardStyle}>
                    <Vertical style={{ gap: '8px' }}>
                        <Horizontal style={{ alignItems: 'center', gap: '8px' }}>
                            <ArrowUpOutlined style={{ fontSize: '16px', color: '#51B073' }} />
                            <Texto category="p2" appearance="medium">Up Market Capture</Texto>
                        </Horizontal>
                        <Texto category="h4" weight="600" style={{ color: '#51B073' }}>{metrics.upMarketCapture}%</Texto>
                        <Texto category="p2" appearance="medium">When spot increases</Texto>
                    </Vertical>
                </div>

                {/* Card 3: Down Market Capture */}
                <div style={cardStyle}>
                    <Vertical style={{ gap: '8px' }}>
                        <Horizontal style={{ alignItems: 'center', gap: '8px' }}>
                            <ArrowDownOutlined style={{ fontSize: '16px', color: '#ff4d4f' }} />
                            <Texto category="p2" appearance="medium">Down Market Capture</Texto>
                        </Horizontal>
                        <Texto category="h4" weight="600">{metrics.downMarketCapture}%</Texto>
                        <Texto category="p2" appearance="medium">When spot decreases</Texto>
                    </Vertical>
                </div>

                {/* Card 4: Intraday Changes */}
                <div style={cardStyle}>
                    <Vertical style={{ gap: '8px' }}>
                        <Horizontal style={{ alignItems: 'center', gap: '8px' }}>
                            <ClockCircleOutlined style={{ fontSize: '16px', color: '#1890ff' }} />
                            <Texto category="p2" appearance="medium">Intraday Changes</Texto>
                        </Horizontal>
                        <Texto category="h4" weight="600">{metrics.intradayChanges}</Texto>
                        <Texto category="p2" appearance="medium">Typically at {metrics.intradayTime}</Texto>
                    </Vertical>
                </div>
            </div>

            {/* Time Period Toggle */}
            <Horizontal style={{ gap: '8px', overflow: 'visible' }}>
                <GraviButton
                    buttonText="30 Days"
                    appearance={period === '30' ? 'filled' : 'outlined'}
                    style={getButtonStyle('30')}
                    onClick={() => setPeriod('30')}
                />
                <GraviButton
                    buttonText="90 Days"
                    appearance={period === '90' ? 'filled' : 'outlined'}
                    style={getButtonStyle('90')}
                    onClick={() => setPeriod('90')}
                />
                <GraviButton
                    buttonText="1 Year"
                    appearance={period === '365' ? 'filled' : 'outlined'}
                    style={getButtonStyle('365')}
                    onClick={() => setPeriod('365')}
                />
            </Horizontal>

            {/* Two Charts Side by Side */}
            <Horizontal style={{ gap: '24px' }}>

                {/* Chart 1: Price Change vs Market - with red/green dots */}
                <div style={{ flex: 1, ...cardStyle }}>
                    <Vertical style={{ gap: '16px' }}>
                        <Texto category="h6" weight="600">Price Change vs Market</Texto>
                        <div style={{ height: '300px', width: '100%' }}>
                            <ResponsiveScatterPlot
                                data={[chartData.priceChange.upSeries, chartData.priceChange.downSeries]}
                                margin={{ top: 20, right: 20, bottom: 60, left: 60 }}
                                xScale={{ type: 'linear', min: -0.25, max: 0.25 }}
                                yScale={{ type: 'linear', min: -0.25, max: 0.25 }}
                                colors={['#51B073', '#ff4d4f']}
                                nodeSize={8}
                                tooltip={PriceChangeTooltip}
                                axisBottom={{
                                    tickSize: 5,
                                    tickPadding: 5,
                                    legend: 'Market Change ($)',
                                    legendPosition: 'middle',
                                    legendOffset: 46,
                                    format: (v) => `$${v.toFixed(2)}`
                                }}
                                axisLeft={{
                                    tickSize: 5,
                                    tickPadding: 5,
                                    legend: 'Competitor Change ($)',
                                    legendPosition: 'middle',
                                    legendOffset: -50,
                                    format: (v) => `$${v.toFixed(2)}`
                                }}
                            />
                        </div>
                        <Horizontal style={{ justifyContent: 'center', gap: '24px' }}>
                            <Texto category="p2">Up: <span style={{ color: '#51B073', fontWeight: 600 }}>{metrics.upMarketCapture}%</span></Texto>
                            <Texto category="p2">Down: <span style={{ color: '#ff4d4f', fontWeight: 600 }}>{metrics.downMarketCapture}%</span></Texto>
                        </Horizontal>
                    </Vertical>
                </div>

                {/* Chart 2: Capture Rate vs Size */}
                <div style={{ flex: 1, ...cardStyle }}>
                    <Vertical style={{ gap: '16px' }}>
                        <Texto category="h6" weight="600">Capture Rate vs Size</Texto>
                        <div style={{ height: '300px', width: '100%' }}>
                            <ResponsiveScatterPlot
                                data={chartData.captureRate}
                                margin={{ top: 20, right: 20, bottom: 60, left: 60 }}
                                xScale={{ type: 'linear', min: 0, max: 5 }}
                                yScale={{ type: 'linear', min: 0, max: 100 }}
                                colors={['#51B073']}
                                nodeSize={8}
                                axisBottom={{
                                    tickSize: 5,
                                    tickPadding: 5,
                                    legend: 'Movement Size',
                                    legendPosition: 'middle',
                                    legendOffset: 46
                                }}
                                axisLeft={{
                                    tickSize: 5,
                                    tickPadding: 5,
                                    legend: 'Capture Rate (%)',
                                    legendPosition: 'middle',
                                    legendOffset: -50,
                                    format: (v) => `${v}%`
                                }}
                            />
                        </div>
                    </Vertical>
                </div>
            </Horizontal>

            {/* Full Width Line Chart */}
            <div style={cardStyle}>
                <Vertical style={{ gap: '16px' }}>
                    <Texto category="h6" weight="600">Consistency Over Time</Texto>
                    <div style={{ height: '300px', width: '100%' }}>
                        <ResponsiveLine
                            data={chartData.consistency}
                            margin={{ top: 20, right: 120, bottom: 60, left: 60 }}
                            xScale={{ type: 'point' }}
                            yScale={{ type: 'linear', min: 0, max: 100 }}
                            colors={['#fa8c16', '#bfbfbf']}
                            pointSize={6}
                            pointColor={{ theme: 'background' }}
                            pointBorderWidth={2}
                            pointBorderColor={{ from: 'serieColor' }}
                            enableGridX={false}
                            axisBottom={{
                                tickSize: 5,
                                tickPadding: 5,
                                tickRotation: -45,
                                legend: 'Date',
                                legendPosition: 'middle',
                                legendOffset: 50
                            }}
                            axisLeft={{
                                tickSize: 5,
                                tickPadding: 5,
                                legend: 'Capture Rate (%)',
                                legendPosition: 'middle',
                                legendOffset: -50,
                                format: (v) => `${v}%`
                            }}
                            legends={[
                                {
                                    anchor: 'bottom-right',
                                    direction: 'column',
                                    translateX: 100,
                                    itemWidth: 80,
                                    itemHeight: 20,
                                    symbolSize: 12,
                                    symbolShape: 'circle'
                                }
                            ]}
                        />
                    </div>
                </Vertical>
            </div>

        </Vertical>
    );
}
