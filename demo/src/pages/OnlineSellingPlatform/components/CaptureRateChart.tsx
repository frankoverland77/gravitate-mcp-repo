import React, { useMemo } from 'react';
import { ResponsiveScatterPlot } from '@nivo/scatterplot';
import { Vertical, Texto } from '@gravitate-js/excalibrr';
import { CaptureRateDataPoint } from '../CompetitorAnalysis.data';

interface CaptureRateChartProps {
    data: CaptureRateDataPoint[];
}

export function CaptureRateChart({ data }: CaptureRateChartProps) {
    // Format data for Nivo
    const chartData = useMemo(() => [{
        id: 'Capture Rate',
        data: data
    }], [data]);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <Vertical style={{ gap: '4px' }}>
                <Texto category="h6" weight="600">
                    Capture Rate vs Movement Size
                </Texto>
                <Texto category="p2" appearance="medium">
                    Shows consistency of capture rate across different market movement magnitudes
                </Texto>
            </Vertical>

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
                    xScale={{ type: 'linear', min: 0, max: 5 }}
                    yScale={{ type: 'linear', min: 0, max: 200 }}
                    colors={['#52c41a']}
                    nodeSize={10}
                    axisBottom={{
                        tickSize: 5,
                        tickPadding: 5,
                        tickRotation: 0,
                        legend: 'Movement Size',
                        legendPosition: 'middle',
                        legendOffset: 46,
                        tickValues: [0, 1, 2, 3, 4, 5]
                    }}
                    axisLeft={{
                        tickSize: 5,
                        tickPadding: 5,
                        tickRotation: 0,
                        legend: 'Capture Rate (%)',
                        legendPosition: 'middle',
                        legendOffset: -50,
                        format: (value) => `${value}%`
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
                                Movement Size: {node.data.x.toFixed(1)}
                            </Texto>
                            <Texto category="p2">
                                Capture Rate: {node.data.y.toFixed(1)}%
                            </Texto>
                        </div>
                    )}
                />
                </div>
            </div>
        </div>
    );
}
