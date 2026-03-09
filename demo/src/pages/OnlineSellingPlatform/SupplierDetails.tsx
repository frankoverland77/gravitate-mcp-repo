import { useState } from 'react';
import { Vertical, Texto, Horizontal, GraviButton } from '@gravitate-js/excalibrr';
import { AimOutlined, ArrowUpOutlined, ArrowDownOutlined, ClockCircleOutlined, LeftOutlined } from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import { ResponsiveScatterPlot, ScatterPlotTooltipProps } from '@nivo/scatterplot';
import { ResponsiveLine, PointTooltipProps } from '@nivo/line';
import { getBehavioralMetrics, getSupplierChartDataByPeriod, TimePeriod } from './SupplierAnalysis.data';
import { getSuppliers, getTerminalLocations, getProductsByGroup } from '../../shared/data';

// ============================================
// CUSTOM TOOLTIPS
// ============================================
const tooltipStyle = {
    backgroundColor: '#ffffff',
    border: '1px solid #e8e8e8',
    borderRadius: '4px',
    padding: '12px 16px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
    fontSize: '12px',
    minWidth: '180px'
};

const PriceChangeTooltip = ({ node }: ScatterPlotTooltipProps<{ x: number; y: number }>) => (
    <div style={tooltipStyle}>
        <div style={{ fontWeight: 600, marginBottom: '4px' }}>
            {node.data.x >= 0 ? 'Up Market' : 'Down Market'}
        </div>
        <div>Market Change: <strong>${node.data.x.toFixed(3)}</strong></div>
        <div>Supplier Change: <strong>${node.data.y.toFixed(3)}</strong></div>
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

// Default fallback data when accessed directly (no state) - uses shared data
const getDefaultSupplier = () => {
    const suppliers = getSuppliers();
    const terminals = getTerminalLocations();
    const products = getProductsByGroup('diesel');
    return {
        id: 1,
        supplier: suppliers[0]?.Name || 'Marathon Petroleum',
        product: products[0]?.Name || 'ULSD 2',
        location: terminals[0]?.Name || 'Houston Terminal'
    };
};

// ============================================
// COMPONENT
// ============================================
export function SupplierDetails() {
    const navigate = useNavigate();
    const location = useLocation();
    const [period, setPeriod] = useState<TimePeriod>('365');

    // Get supplier from navigation state, or use default
    const supplierData = location.state?.supplier || getDefaultSupplier();
    const supplierId = supplierData.id || 1;

    // Get behavioral metrics and chart data based on supplier ID and period
    const metrics = getBehavioralMetrics(supplierId);
    const chartData = getSupplierChartDataByPeriod(supplierId, period);

    const handleBackClick = () => {
        navigate('/SupplierAnalysis/SupplierProfileAnalysis');
    };

    // Button style helper
    const getButtonStyle = (buttonPeriod: TimePeriod) => {
        if (period === buttonPeriod) {
            return { backgroundColor: '#51B073', borderColor: '#51B073', color: '#ffffff' };
        }
        return {};
    };

    return (
        <Vertical gap={24} style={{ padding: '32px', minHeight: '100%' }}>

            {/* Back Link */}
            <Horizontal
                gap={6} style={{ alignItems: 'center', cursor: 'pointer', color: '#1890ff', width: 'fit-content' }}
                onClick={handleBackClick}
            >
                <LeftOutlined style={{ fontSize: '12px' }} />
                <Texto category="p2" style={{ color: '#1890ff' }}>Back to Supplier Price Analysis</Texto>
            </Horizontal>

            {/* Title */}
            <Texto category="h3" weight="600">
                Market Movement Analysis - {supplierData.supplier} - {supplierData.product} - {supplierData.location}
            </Texto>

            {/* Section Label */}
            <Texto category="h5" weight="600">
                Behavioral Profile
            </Texto>

            {/* 4 Profile Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>

                {/* Card 1: Strategy */}
                <div style={cardStyle}>
                    <Vertical gap={8}>
                        <Horizontal gap={8} style={{ alignItems: 'center' }}>
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
                    <Vertical gap={8}>
                        <Horizontal gap={8} style={{ alignItems: 'center' }}>
                            <ArrowUpOutlined style={{ fontSize: '16px', color: '#51B073' }} />
                            <Texto category="p2" appearance="medium">Up Market Capture</Texto>
                        </Horizontal>
                        <Texto category="h4" weight="600" style={{ color: '#51B073' }}>{metrics.upMarketCapture}%</Texto>
                        <Texto category="p2" appearance="medium">When spot increases</Texto>
                    </Vertical>
                </div>

                {/* Card 3: Down Market Capture */}
                <div style={cardStyle}>
                    <Vertical gap={8}>
                        <Horizontal gap={8} style={{ alignItems: 'center' }}>
                            <ArrowDownOutlined style={{ fontSize: '16px', color: '#ff4d4f' }} />
                            <Texto category="p2" appearance="medium">Down Market Capture</Texto>
                        </Horizontal>
                        <Texto category="h4" weight="600">{metrics.downMarketCapture}%</Texto>
                        <Texto category="p2" appearance="medium">When spot decreases</Texto>
                    </Vertical>
                </div>

                {/* Card 4: Intraday Changes */}
                <div style={cardStyle}>
                    <Vertical gap={8}>
                        <Horizontal gap={8} style={{ alignItems: 'center' }}>
                            <ClockCircleOutlined style={{ fontSize: '16px', color: '#1890ff' }} />
                            <Texto category="p2" appearance="medium">Intraday Changes</Texto>
                        </Horizontal>
                        <Texto category="h4" weight="600">{metrics.intradayChanges}</Texto>
                        <Texto category="p2" appearance="medium">Typically at {metrics.intradayTime}</Texto>
                    </Vertical>
                </div>
            </div>

            {/* Time Period Toggle */}
            <Horizontal gap={8} style={{ overflow: 'visible' }}>
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
            <Horizontal gap={24} style={{ flexShrink: 0 }}>

                {/* Chart 1: Price Change vs Market - with red/green dots */}
                <div style={{ flex: 1, minHeight: '420px', ...cardStyle }}>
                    <Vertical gap={8}>
                        <Texto category="h5" weight="600">Price Change vs Market</Texto>
                        <Horizontal gap={24} style={{ justifyContent: 'center' }}>
                            <Horizontal gap={6} style={{ alignItems: 'center' }}>
                                <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#51B073' }} />
                                <Texto category="p2" appearance="medium">Up Market</Texto>
                            </Horizontal>
                            <Horizontal gap={6} style={{ alignItems: 'center' }}>
                                <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#ff4d4f' }} />
                                <Texto category="p2" appearance="medium">Down Market</Texto>
                            </Horizontal>
                        </Horizontal>
                        <div style={{ height: '350px', minHeight: '350px', width: '100%' }}>
                            <ResponsiveScatterPlot
                                data={[chartData.priceChange.upSeries, chartData.priceChange.downSeries]}
                                margin={{ top: 20, right: 20, bottom: 60, left: 70 }}
                                xScale={{ type: 'linear', min: -0.25, max: 0.25 }}
                                yScale={{ type: 'linear', min: -0.25, max: 0.25 }}
                                colors={['#51B073', '#ff4d4f']}
                                nodeSize={8}
                                tooltip={PriceChangeTooltip}
                                axisBottom={{
                                    tickSize: 5,
                                    tickPadding: 5,
                                    legend: 'Market Price Change ($/gal)',
                                    legendPosition: 'middle',
                                    legendOffset: 46,
                                    format: (v) => `$${v.toFixed(2)}`
                                }}
                                axisLeft={{
                                    tickSize: 5,
                                    tickPadding: 5,
                                    legend: 'Supplier Price Change ($/gal)',
                                    legendPosition: 'middle',
                                    legendOffset: -60,
                                    format: (v) => `$${v.toFixed(2)}`
                                }}
                            />
                        </div>
                    </Vertical>
                </div>

                {/* Chart 2: Capture Rate vs Size */}
                <div style={{ flex: 1, minHeight: '420px', ...cardStyle }}>
                    <Vertical gap={16}>
                        <Texto category="h5" weight="600">Capture Rate vs Size</Texto>
                        <div style={{ height: '350px', minHeight: '350px', width: '100%' }}>
                            <ResponsiveScatterPlot
                                data={chartData.captureRate}
                                margin={{ top: 20, right: 20, bottom: 60, left: 60 }}
                                xScale={{ type: 'linear', min: 0, max: 5 }}
                                yScale={{ type: 'linear', min: 0, max: 100 }}
                                colors={['#51B073']}
                                nodeSize={8}
                                tooltip={CaptureRateTooltip}
                                axisBottom={{
                                    tickSize: 5,
                                    tickPadding: 5,
                                    legend: 'Market Movement Size ($/gal)',
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
            <div style={{ minHeight: '420px', flexShrink: 0, ...cardStyle }}>
                <Vertical gap={8}>
                    <Texto category="h5" weight="600">Consistency Over Time</Texto>
                    <Horizontal gap={24} style={{ justifyContent: 'center' }}>
                        <Horizontal gap={6} style={{ alignItems: 'center' }}>
                            <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#51B073' }} />
                            <Texto category="p2" appearance="medium">7-Day Average</Texto>
                        </Horizontal>
                        <Horizontal gap={6} style={{ alignItems: 'center' }}>
                            <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#bfbfbf' }} />
                            <Texto category="p2" appearance="medium">Daily Capture Rate</Texto>
                        </Horizontal>
                    </Horizontal>
                    <div style={{ height: '350px', minHeight: '350px', width: '100%' }}>
                        <ResponsiveLine
                            data={chartData.consistency}
                            margin={{ top: 20, right: 20, bottom: 60, left: 60 }}
                            xScale={{ type: 'point' }}
                            yScale={{ type: 'linear', min: 0, max: 100 }}
                            colors={['#51B073', '#bfbfbf']}
                            pointSize={6}
                            pointColor={{ theme: 'background' }}
                            pointBorderWidth={2}
                            pointBorderColor={{ from: 'serieColor' }}
                            enableGridX={false}
                            tooltip={ConsistencyTooltip}
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
                        />
                    </div>
                </Vertical>
            </div>

        </Vertical>
    );
}
