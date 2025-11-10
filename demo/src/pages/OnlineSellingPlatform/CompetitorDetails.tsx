import React, { useState, useMemo } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { Vertical, Texto, Horizontal, GraviButton } from '@gravitate-js/excalibrr';
import { LeftOutlined } from '@ant-design/icons';
import { BehavioralProfileCards } from './components/BehavioralProfileCards';
import { PriceChangeCorrelationChart } from './components/PriceChangeCorrelationChart';
import { CaptureRateChart } from './components/CaptureRateChart';
import { ConsistencyTrendChart } from './components/ConsistencyTrendChart';
import {
    getBehavioralMetrics,
    generatePriceChangeCorrelationData,
    generateCaptureRateData,
    generateConsistencyData
} from './CompetitorAnalysis.data';

type TimePeriod = 30 | 90 | 365;

export function CompetitorDetails() {
    const navigate = useNavigate();
    const { id } = useParams();
    const location = useLocation();
    const competitor = location.state?.competitor;

    const [timePeriod, setTimePeriod] = useState<TimePeriod>(90);

    // Get behavioral metrics for this competitor
    const metrics = useMemo(() => {
        if (!id) return getBehavioralMetrics(1);
        return getBehavioralMetrics(parseInt(id));
    }, [id]);

    // Generate chart data based on metrics and time period
    const priceChangeData = useMemo(() => {
        return generatePriceChangeCorrelationData(
            metrics.upMarketCapture,
            metrics.downMarketCapture,
            timePeriod === 30 ? 30 : timePeriod === 90 ? 60 : 120
        );
    }, [metrics, timePeriod]);

    const captureRateData = useMemo(() => {
        const avgCapture = (metrics.upMarketCapture + metrics.downMarketCapture) / 2;
        return generateCaptureRateData(avgCapture, 25);
    }, [metrics]);

    const consistencyData = useMemo(() => {
        const avgCapture = (metrics.upMarketCapture + metrics.downMarketCapture) / 2;
        return generateConsistencyData(timePeriod, avgCapture);
    }, [metrics, timePeriod]);

    if (!competitor) {
        return (
            <Vertical style={{ height: '100%', padding: '24px', gap: '24px' }}>
                <div
                    style={{
                        cursor: 'pointer',
                        color: '#1890ff',
                        fontSize: '14px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        width: 'fit-content'
                    }}
                    onClick={() => navigate('/CompetitorAnalysis/CompetitorAnalysis')}
                >
                    <LeftOutlined style={{ fontSize: '12px' }} />
                    <span>Back to Analysis</span>
                </div>
                <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Vertical style={{ textAlign: 'center', gap: '16px' }}>
                        <Texto category="h2" appearance="medium">No Competitor Data</Texto>
                        <Texto category="p1" appearance="medium">
                            Please navigate from the Competitor Analysis grid to view details.
                        </Texto>
                    </Vertical>
                </div>
            </Vertical>
        );
    }

    return (
        <Vertical style={{ height: '100%', padding: '32px', gap: '32px', overflow: 'auto' }}>
            {/* Breadcrumb Navigation */}
            <div
                style={{
                    cursor: 'pointer',
                    color: '#1890ff',
                    fontSize: '14px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    width: 'fit-content'
                }}
                onClick={() => navigate('/CompetitorAnalysis/CompetitorAnalysis')}
            >
                <LeftOutlined style={{ fontSize: '12px' }} />
                <span>Back to Competitor Analysis</span>
            </div>

            {/* Header */}
            <Vertical style={{ gap: '8px' }}>
                <Texto category="h3" weight="600">
                    Market Movement Analysis - {competitor.competitor}
                </Texto>
                <Texto category="p1" appearance="medium">
                    {competitor.product} • {competitor.location}
                </Texto>
            </Vertical>

            {/* Behavioral Profile Cards */}
            <BehavioralProfileCards metrics={metrics} />

            {/* Time Period Toggle */}
            <Horizontal style={{ gap: '8px', marginBottom: '16px' }}>
                <Texto category="p2" appearance="medium" style={{ textTransform: 'uppercase', letterSpacing: '0.5px', marginRight: '8px' }}>
                    Time Period:
                </Texto>
                <GraviButton
                    buttonText="30 Days"
                    appearance={timePeriod === 30 ? 'filled' : 'outlined'}
                    onClick={() => setTimePeriod(30)}
                    style={{
                        ...(timePeriod === 30 && {
                            backgroundColor: '#52c41a',
                            borderColor: '#52c41a',
                            color: '#ffffff'
                        })
                    }}
                />
                <GraviButton
                    buttonText="90 Days"
                    appearance={timePeriod === 90 ? 'filled' : 'outlined'}
                    onClick={() => setTimePeriod(90)}
                    style={{
                        ...(timePeriod === 90 && {
                            backgroundColor: '#52c41a',
                            borderColor: '#52c41a',
                            color: '#ffffff'
                        })
                    }}
                />
                <GraviButton
                    buttonText="1 Year"
                    appearance={timePeriod === 365 ? 'filled' : 'outlined'}
                    onClick={() => setTimePeriod(365)}
                    style={{
                        ...(timePeriod === 365 && {
                            backgroundColor: '#52c41a',
                            borderColor: '#52c41a',
                            color: '#ffffff'
                        })
                    }}
                />
            </Horizontal>

            {/* Visualizations */}
            <Vertical style={{ gap: '32px' }}>
                {/* Chart 1: Price Change Correlation */}
                <PriceChangeCorrelationChart
                    data={priceChangeData}
                    upCapture={metrics.upMarketCapture}
                    downCapture={metrics.downMarketCapture}
                />

                {/* Chart 2: Capture Rate Distribution */}
                <CaptureRateChart data={captureRateData} />

                {/* Chart 3: Consistency Trend */}
                <ConsistencyTrendChart data={consistencyData} />
            </Vertical>
        </Vertical>
    );
}
