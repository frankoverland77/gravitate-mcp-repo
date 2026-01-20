import React from 'react';
import { ResponsiveLine } from '@nivo/line';
import { Vertical, Texto } from '@gravitate-js/excalibrr';
import { ConsistencySeriesData } from '../SupplierAnalysis.data';

interface ConsistencyTrendChartProps {
    data: ConsistencySeriesData[];
}

export function ConsistencyTrendChart({ data }: ConsistencyTrendChartProps) {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <Vertical style={{ gap: '4px' }}>
                <Texto category="h6" weight="600">
                    Consistency Over Time
                </Texto>
                <Texto category="p2" appearance="medium">
                    Daily capture rate and 7-day moving average trend
                </Texto>
            </Vertical>

            <div style={{
                height: '500px',
                backgroundColor: '#ffffff',
                border: '1px solid #e8e8e8',
                borderRadius: '8px',
                padding: '24px'
            }}>
                <div style={{ height: '452px', width: '100%' }}>
                <ResponsiveLine
                    data={data}
                    margin={{ top: 30, right: 160, bottom: 80, left: 80 }}
                    xScale={{
                        type: 'time',
                        format: '%Y-%m-%d',
                        precision: 'day'
                    }}
                    xFormat="time:%Y-%m-%d"
                    yScale={{
                        type: 'linear',
                        min: 0,
                        max: 200
                    }}
                    axisBottom={{
                        format: '%b %d',
                        tickSize: 5,
                        tickPadding: 5,
                        tickRotation: -45,
                        legend: 'Date',
                        legendPosition: 'middle',
                        legendOffset: 50,
                        tickValues: 'every 7 days'
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
                    colors={({ id }) => {
                        if (id === '7-Day Average') return '#13c2c2'; // Teal
                        return '#8c8c8c'; // Gray for daily
                    }}
                    lineWidth={({ id }) => {
                        if (id === '7-Day Average') return 3;
                        return 2;
                    }}
                    enablePoints={false}
                    enableArea={false}
                    enableGridX={false}
                    enableGridY={true}
                    useMesh={true}
                    curve="monotoneX"
                    legends={[
                        {
                            anchor: 'right',
                            direction: 'column',
                            justify: false,
                            translateX: 120,
                            translateY: 0,
                            itemsSpacing: 10,
                            itemDirection: 'left-to-right',
                            itemWidth: 100,
                            itemHeight: 20,
                            itemOpacity: 0.75,
                            symbolSize: 12,
                            symbolShape: ({ id }: any) => {
                                if (id === '7-Day Average') {
                                    // Solid line
                                    return (
                                        <rect
                                            x={-6}
                                            y={-1}
                                            width={12}
                                            height={2}
                                            fill="#13c2c2"
                                        />
                                    );
                                }
                                // Dashed line for daily
                                return (
                                    <g>
                                        <rect x={-6} y={-1} width={3} height={2} fill="#8c8c8c" />
                                        <rect x={-1} y={-1} width={3} height={2} fill="#8c8c8c" />
                                        <rect x={4} y={-1} width={3} height={2} fill="#8c8c8c" />
                                    </g>
                                );
                            },
                            effects: [
                                {
                                    on: 'hover',
                                    style: {
                                        itemOpacity: 1
                                    }
                                }
                            ]
                        }
                    ]}
                    tooltip={({ point }) => (
                        <div
                            style={{
                                background: 'white',
                                padding: '9px 12px',
                                border: '1px solid #ccc',
                                borderRadius: '4px',
                                boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
                            }}
                        >
                            <Texto category="p2" weight="600">
                                {point.serieId}
                            </Texto>
                            <Texto category="p2" appearance="medium">
                                {new Date(point.data.x).toLocaleDateString('en-US', {
                                    month: 'short',
                                    day: 'numeric',
                                    year: 'numeric'
                                })}
                            </Texto>
                            <Texto category="p2">
                                {point.data.y}%
                            </Texto>
                        </div>
                    )}
                    enableSlices="x"
                    sliceTooltip={({ slice }) => (
                        <div
                            style={{
                                background: 'white',
                                padding: '12px',
                                border: '1px solid #ccc',
                                borderRadius: '4px',
                                boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
                            }}
                        >
                            <Texto category="p2" weight="600" style={{ marginBottom: '8px' }}>
                                {new Date(slice.points[0].data.x).toLocaleDateString('en-US', {
                                    month: 'short',
                                    day: 'numeric',
                                    year: 'numeric'
                                })}
                            </Texto>
                            {slice.points.map(point => (
                                <div key={point.id} style={{ padding: '4px 0' }}>
                                    <Texto category="p2" appearance="medium">
                                        {point.serieId}:
                                    </Texto>
                                    <Texto category="p2" weight="600">
                                        {' '}{point.data.y}%
                                    </Texto>
                                </div>
                            ))}
                        </div>
                    )}
                />
                </div>
            </div>
        </div>
    );
}
