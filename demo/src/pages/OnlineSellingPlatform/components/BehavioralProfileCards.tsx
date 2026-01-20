import React from 'react';
import { Horizontal, Vertical, Texto, BBDTag } from '@gravitate-js/excalibrr';
import { ArrowUpOutlined, ArrowDownOutlined, ClockCircleOutlined, AimOutlined } from '@ant-design/icons';
import { BehavioralMetrics } from '../SupplierAnalysis.data';

interface BehavioralProfileCardsProps {
    metrics: BehavioralMetrics;
}

export function BehavioralProfileCards({ metrics }: BehavioralProfileCardsProps) {
    const getStrategyTag = (strategy: string) => {
        if (strategy === 'Leader') {
            return <BBDTag success style={{ width: 'fit-content' }}>Leader</BBDTag>;
        }
        if (strategy === 'Follower') {
            return <BBDTag theme2 style={{ width: 'fit-content' }}>Follower</BBDTag>;
        }
        if (strategy === 'Position') {
            return <BBDTag theme4 style={{ width: 'fit-content' }}>Position</BBDTag>;
        }
        return <BBDTag style={{ width: 'fit-content' }}>{strategy}</BBDTag>;
    };

    return (
        <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '20px'
        }}>
            {/* Strategy Card */}
            <div style={{
                backgroundColor: '#ffffff',
                border: '1px solid #e8e8e8',
                borderRadius: '8px',
                padding: '24px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
            }}>
                <Vertical style={{ gap: '12px' }}>
                    <Horizontal style={{ alignItems: 'center', gap: '8px' }}>
                        <AimOutlined style={{ fontSize: '20px', color: '#722ed1' }} />
                        <Texto category="p2" appearance="medium" style={{ textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                            Strategy
                        </Texto>
                    </Horizontal>
                    <div>
                        {getStrategyTag(metrics.strategy)}
                    </div>
                    <Texto category="p1" appearance="medium">
                        Position: {metrics.position}
                    </Texto>
                    <Texto category="p2" appearance="medium">
                        Consistency: {metrics.consistency}
                    </Texto>
                </Vertical>
            </div>

            {/* Up Market Capture Card */}
            <div style={{
                backgroundColor: '#ffffff',
                border: '1px solid #e8e8e8',
                borderRadius: '8px',
                padding: '24px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
            }}>
                <Vertical style={{ gap: '12px' }}>
                    <Horizontal style={{ alignItems: 'center', gap: '8px' }}>
                        <ArrowUpOutlined style={{ fontSize: '20px', color: '#52c41a' }} />
                        <Texto category="p2" appearance="medium" style={{ textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                            Up Market Capture
                        </Texto>
                    </Horizontal>
                    <Texto category="h4" weight="600" style={{ color: '#52c41a' }}>
                        {metrics.upMarketCapture}%
                    </Texto>
                    <Texto category="p2" appearance="medium">
                        When spot increases
                    </Texto>
                </Vertical>
            </div>

            {/* Down Market Capture Card */}
            <div style={{
                backgroundColor: '#ffffff',
                border: '1px solid #e8e8e8',
                borderRadius: '8px',
                padding: '24px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
            }}>
                <Vertical style={{ gap: '12px' }}>
                    <Horizontal style={{ alignItems: 'center', gap: '8px' }}>
                        <ArrowDownOutlined style={{ fontSize: '20px', color: '#ff4d4f' }} />
                        <Texto category="p2" appearance="medium" style={{ textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                            Down Market Capture
                        </Texto>
                    </Horizontal>
                    <Texto category="h4" weight="600" style={{ color: '#ff4d4f' }}>
                        {metrics.downMarketCapture}%
                    </Texto>
                    <Texto category="p2" appearance="medium">
                        When spot decreases
                    </Texto>
                </Vertical>
            </div>

            {/* Intraday Changes Card */}
            <div style={{
                backgroundColor: '#ffffff',
                border: '1px solid #e8e8e8',
                borderRadius: '8px',
                padding: '24px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
            }}>
                <Vertical style={{ gap: '12px' }}>
                    <Horizontal style={{ alignItems: 'center', gap: '8px' }}>
                        <ClockCircleOutlined style={{ fontSize: '20px', color: '#1890ff' }} />
                        <Texto category="p2" appearance="medium" style={{ textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                            Intraday Changes
                        </Texto>
                    </Horizontal>
                    <Texto category="h4" weight="600">
                        {metrics.intradayChanges}
                    </Texto>
                    <Texto category="p2" appearance="medium">
                        Typically at {metrics.intradayTime}
                    </Texto>
                </Vertical>
            </div>
        </div>
    );
}
