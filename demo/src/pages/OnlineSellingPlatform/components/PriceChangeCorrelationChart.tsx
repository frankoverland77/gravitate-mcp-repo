import React, { useMemo } from 'react';
import { ResponsiveScatterPlot } from '@nivo/scatterplot';
import { Vertical, Texto, Horizontal, BBDTag } from '@gravitate-js/excalibrr';
import { PriceChangeDataPoint, calculateTrendLine } from '../CompetitorAnalysis.data';

interface PriceChangeCorrelationChartProps {
    data: PriceChangeDataPoint[];
    upCapture: number;
    downCapture: number;
}

export function PriceChangeCorrelationChart({ data, upCapture, downCapture }: PriceChangeCorrelationChartProps) {
    const { slope, intercept } = useMemo(() => calculateTrendLine(data), [data]);

    // Format data for Nivo
    const chartData = useMemo(() => [{
        id: 'Correlation',
        data: data
    }], [data]);

    // Generate trend line points
    const trendLineData = useMemo(() => {
        const minX = -0.25;
        const maxX = 0.25;
        return [{
            id: 'Trend Line',
            data: [
                { x: minX, y: slope * minX + intercept },
                { x: maxX, y: slope * maxX + intercept }
            ]
        }];
    }, [slope, intercept]);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <Horizontal style={{ justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Vertical style={{ gap: '4px' }}>
                    <Texto category="h6" weight="600">
                        Price Change vs Market
                    </Texto>
                    <Texto category="p2" appearance="medium">
                        Shows correlation between market movement and competitor response
                    </Texto>
                </Vertical>
                <Horizontal style={{ gap: '12px' }}>
                    <BBDTag success style={{ width: 'fit-content' }}>
                        Up: {upCapture}%
                    </BBDTag>
                    <BBDTag error style={{ width: 'fit-content' }}>
                        Down: {downCapture}%
                    </BBDTag>
                </Horizontal>
            </Horizontal>

            <div style={{
                height: '500px',
                backgroundColor: '#ffffff',
                border: '1px solid #e8e8e8',
                borderRadius: '8px',
                padding: '24px'
            }}>
                <div style={{ height: '452px' }}>
                <ResponsiveScatterPlot
                    data={chartData}
                    margin={{ top: 30, right: 80, bottom: 70, left: 80 }}
                    xScale={{ type: 'linear', min: -0.25, max: 0.25 }}
                    yScale={{ type: 'linear', min: -0.25, max: 0.25 }}
                    colors={['#52c41a']}
                    nodeSize={8}
                    axisBottom={{
                        tickSize: 5,
                        tickPadding: 5,
                        tickRotation: 0,
                        legend: 'Market Change ($)',
                        legendPosition: 'middle',
                        legendOffset: 46,
                        format: (value) => `$${value.toFixed(2)}`
                    }}
                    axisLeft={{
                        tickSize: 5,
                        tickPadding: 5,
                        tickRotation: 0,
                        legend: 'Competitor Change ($)',
                        legendPosition: 'middle',
                        legendOffset: -50,
                        format: (value) => `$${value.toFixed(2)}`
                    }}
                    useMesh={true}
                    tooltip={({ node }) => (
                        <div
                            style={{
                                background: 'white',
                                padding: '9px 12px',
                                border: '1px solid #ccc',
                                borderRadius: '4px',
                                boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
                            }}
                        >
                            <Texto category="p2">
                                Market: ${node.data.x.toFixed(4)}
                            </Texto>
                            <Texto category="p2">
                                Competitor: ${node.data.y.toFixed(4)}
                            </Texto>
                            <Texto category="p2" appearance="medium">
                                Capture: {((node.data.y / node.data.x) * 100).toFixed(1)}%
                            </Texto>
                        </div>
                    )}
                    layers={[
                        'grid',
                        'axes',
                        // Custom layer for trend line
                        (props: any) => {
                            const { xScale, yScale } = props;
                            const x1 = xScale(-0.25);
                            const y1 = yScale(slope * -0.25 + intercept);
                            const x2 = xScale(0.25);
                            const y2 = yScale(slope * 0.25 + intercept);
                            return (
                                <line
                                    x1={x1}
                                    y1={y1}
                                    x2={x2}
                                    y2={y2}
                                    stroke="#1890ff"
                                    strokeWidth={2}
                                    strokeDasharray="5,5"
                                    opacity={0.6}
                                />
                            );
                        },
                        'nodes',
                        'mesh'
                    ]}
                />
                </div>
            </div>
        </div>
    );
}
