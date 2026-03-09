import React from 'react';
import { Texto, Vertical, Horizontal } from '@gravitate-js/excalibrr';
import { ArrowUpOutlined, ArrowDownOutlined, TrophyOutlined, LineChartOutlined, DollarOutlined, RiseOutlined } from '@ant-design/icons';
import { Progress } from 'antd';
import { MarketContextData } from '../IndexOfferManagement.data';
import { RankBadge } from './RankBadge';

interface MarketContextPanelProps {
    marketData: MarketContextData | null;
    onClose?: () => void;
}

export function MarketContextPanel({ marketData, onClose }: MarketContextPanelProps) {
    if (!marketData) {
        return (
            <div style={{
                padding: '32px',
                backgroundColor: '#fafafa',
                border: '1px solid #d9d9d9',
                borderRadius: '8px',
                textAlign: 'center',
                marginBottom: '16px'
            }}>
                <LineChartOutlined style={{ fontSize: '48px', color: '#d9d9d9', marginBottom: '16px' }} />
                <Texto style={{ fontSize: '14px', color: '#8c8c8c', display: 'block' }}>
                    Select a row to view market context and competitive analysis
                </Texto>
            </div>
        );
    }

    // Helper to format currency
    const formatCurrency = (value: number | null) => {
        if (value === null) return 'N/A';
        return `$${value.toFixed(4)}`;
    };

    // Helper to determine delta color
    const getDeltaColor = (delta: number) => {
        if (delta < 0) return '#52c41a'; // Green - we're cheaper
        if (delta > 0) return '#ff4d4f'; // Red - we're more expensive
        return '#1890ff'; // Blue - same price
    };

    // Calculate volume pacing color
    const getVolumeColor = (percent: number) => {
        if (percent >= 90) return '#52c41a';
        if (percent >= 70) return '#1890ff';
        if (percent >= 50) return '#fa8c16';
        return '#ff4d4f';
    };

    return (
        <div style={{
            backgroundColor: '#ffffff',
            border: '1px solid #d9d9d9',
            borderRadius: '8px',
            marginBottom: '16px',
            overflow: 'hidden'
        }}>
            {/* Header */}
            <div style={{
                padding: '16px 24px',
                backgroundColor: '#fafafa',
                borderBottom: '1px solid #d9d9d9',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
            }}>
                <Horizontal gap={12} style={{ alignItems: 'center' }}>
                    <LineChartOutlined style={{ fontSize: '20px', color: '#1890ff' }} />
                    <div>
                        <Texto style={{ fontSize: '16px', fontWeight: 600, color: '#333', display: 'block' }}>
                            Market Context: {marketData.terminal} - {marketData.product}
                        </Texto>
                        <Texto style={{ fontSize: '12px', color: '#8c8c8c' }}>
                            Competitive analysis and pricing intelligence
                        </Texto>
                    </div>
                </Horizontal>
                {onClose && (
                    <div
                        onClick={onClose}
                        style={{
                            cursor: 'pointer',
                            fontSize: '20px',
                            color: '#8c8c8c',
                            lineHeight: 1
                        }}
                    >
                        ×
                    </div>
                )}
            </div>

            {/* KPI Cards */}
            <div style={{
                padding: '24px',
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                gap: '16px'
            }}>
                {/* Market Rank */}
                <div style={{
                    padding: '16px',
                    backgroundColor: '#fafafa',
                    borderRadius: '8px',
                    border: '1px solid #e8e8e8'
                }}>
                    <Horizontal style={{ justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                        <TrophyOutlined style={{ fontSize: '20px', color: '#1890ff' }} />
                        <RankBadge rank={marketData.marketRank} totalCompetitors={marketData.totalCompetitors} size="small" />
                    </Horizontal>
                    <Texto style={{ fontSize: '11px', color: '#8c8c8c', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: '4px' }}>
                        Market Rank
                    </Texto>
                    <Texto style={{ fontSize: '24px', fontWeight: 'bold', color: '#333', display: 'block' }}>
                        #{marketData.marketRank}
                    </Texto>
                    <Texto style={{ fontSize: '11px', color: '#8c8c8c', display: 'block', marginTop: '4px' }}>
                        of {marketData.totalCompetitors} competitors
                    </Texto>
                </div>

                {/* Rack Price Delta */}
                <div style={{
                    padding: '16px',
                    backgroundColor: '#fafafa',
                    borderRadius: '8px',
                    border: '1px solid #e8e8e8'
                }}>
                    <Horizontal style={{ justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                        <DollarOutlined style={{ fontSize: '20px', color: getDeltaColor(marketData.rackPriceDelta) }} />
                        {marketData.rackPriceDelta < 0 ? (
                            <ArrowDownOutlined style={{ fontSize: '16px', color: '#52c41a' }} />
                        ) : marketData.rackPriceDelta > 0 ? (
                            <ArrowUpOutlined style={{ fontSize: '16px', color: '#ff4d4f' }} />
                        ) : null}
                    </Horizontal>
                    <Texto style={{ fontSize: '11px', color: '#8c8c8c', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: '4px' }}>
                        Rack Price Delta
                    </Texto>
                    <Texto style={{ fontSize: '24px', fontWeight: 'bold', color: getDeltaColor(marketData.rackPriceDelta), display: 'block' }}>
                        {marketData.rackPriceDelta > 0 ? '+' : ''}{formatCurrency(marketData.rackPriceDelta)}
                    </Texto>
                    <Texto style={{ fontSize: '11px', color: '#8c8c8c', display: 'block', marginTop: '4px' }}>
                        {marketData.rackPriceDelta < 0 ? 'Below' : marketData.rackPriceDelta > 0 ? 'Above' : 'Equal to'} Opus
                    </Texto>
                </div>

                {/* Opus Contract Low */}
                <div style={{
                    padding: '16px',
                    backgroundColor: '#fafafa',
                    borderRadius: '8px',
                    border: '1px solid #e8e8e8'
                }}>
                    <div style={{ fontSize: '20px', marginBottom: '12px' }}>🏆</div>
                    <Texto style={{ fontSize: '11px', color: '#8c8c8c', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: '4px' }}>
                        Opus Contract Low
                    </Texto>
                    <Texto style={{ fontSize: '24px', fontWeight: 'bold', color: '#52c41a', display: 'block' }}>
                        {formatCurrency(marketData.opusContractLow)}
                    </Texto>
                    <Texto style={{ fontSize: '11px', color: '#8c8c8c', display: 'block', marginTop: '4px' }}>
                        Lowest in market
                    </Texto>
                </div>

                {/* Opus Contract 2nd Low */}
                <div style={{
                    padding: '16px',
                    backgroundColor: '#fafafa',
                    borderRadius: '8px',
                    border: '1px solid #e8e8e8'
                }}>
                    <div style={{ fontSize: '20px', marginBottom: '12px' }}>🥈</div>
                    <Texto style={{ fontSize: '11px', color: '#8c8c8c', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: '4px' }}>
                        Opus 2nd Low
                    </Texto>
                    <Texto style={{ fontSize: '24px', fontWeight: 'bold', color: '#1890ff', display: 'block' }}>
                        {formatCurrency(marketData.opusContract2ndLow)}
                    </Texto>
                    <Texto style={{ fontSize: '11px', color: '#8c8c8c', display: 'block', marginTop: '4px' }}>
                        Second lowest
                    </Texto>
                </div>

                {/* Opus Contract Average */}
                <div style={{
                    padding: '16px',
                    backgroundColor: '#fafafa',
                    borderRadius: '8px',
                    border: '1px solid #e8e8e8'
                }}>
                    <div style={{ fontSize: '20px', marginBottom: '12px' }}>📊</div>
                    <Texto style={{ fontSize: '11px', color: '#8c8c8c', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: '4px' }}>
                        Opus Avg Price
                    </Texto>
                    <Texto style={{ fontSize: '24px', fontWeight: 'bold', color: '#8c8c8c', display: 'block' }}>
                        {formatCurrency(marketData.opusContractAvg)}
                    </Texto>
                    <Texto style={{ fontSize: '11px', color: '#8c8c8c', display: 'block', marginTop: '4px' }}>
                        Market average
                    </Texto>
                </div>

                {/* Argus Price */}
                <div style={{
                    padding: '16px',
                    backgroundColor: '#fafafa',
                    borderRadius: '8px',
                    border: '1px solid #e8e8e8'
                }}>
                    <div style={{ fontSize: '20px', marginBottom: '12px' }}>📰</div>
                    <Texto style={{ fontSize: '11px', color: '#8c8c8c', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: '4px' }}>
                        Argus Price
                    </Texto>
                    <Texto style={{ fontSize: '24px', fontWeight: 'bold', color: '#fa8c16', display: 'block' }}>
                        {formatCurrency(marketData.argusPrice)}
                    </Texto>
                    <Texto style={{ fontSize: '11px', color: '#8c8c8c', display: 'block', marginTop: '4px' }}>
                        Publisher index
                    </Texto>
                </div>

                {/* Platts Price */}
                <div style={{
                    padding: '16px',
                    backgroundColor: '#fafafa',
                    borderRadius: '8px',
                    border: '1px solid #e8e8e8'
                }}>
                    <div style={{ fontSize: '20px', marginBottom: '12px' }}>📈</div>
                    <Texto style={{ fontSize: '11px', color: '#8c8c8c', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: '4px' }}>
                        Platts Price
                    </Texto>
                    <Texto style={{ fontSize: '24px', fontWeight: 'bold', color: '#fa8c16', display: 'block' }}>
                        {formatCurrency(marketData.plattsPrice)}
                    </Texto>
                    <Texto style={{ fontSize: '11px', color: '#8c8c8c', display: 'block', marginTop: '4px' }}>
                        Publisher index
                    </Texto>
                </div>

                {/* Volume Pacing */}
                <div style={{
                    padding: '16px',
                    backgroundColor: '#fafafa',
                    borderRadius: '8px',
                    border: '1px solid #e8e8e8'
                }}>
                    <RiseOutlined style={{ fontSize: '20px', color: getVolumeColor(marketData.volumePacingPercent), marginBottom: '12px', display: 'block' }} />
                    <Texto style={{ fontSize: '11px', color: '#8c8c8c', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: '4px' }}>
                        Volume Pacing
                    </Texto>
                    <Texto style={{ fontSize: '24px', fontWeight: 'bold', color: getVolumeColor(marketData.volumePacingPercent), display: 'block', marginBottom: '8px' }}>
                        {marketData.volumePacingPercent}%
                    </Texto>
                    <Progress
                        percent={marketData.volumePacingPercent}
                        strokeColor={getVolumeColor(marketData.volumePacingPercent)}
                        showInfo={false}
                        size="small"
                    />
                    <Texto style={{ fontSize: '11px', color: '#8c8c8c', display: 'block', marginTop: '4px' }}>
                        {marketData.volumeMTD.toLocaleString()} / {marketData.volumeGoal.toLocaleString()} gal
                    </Texto>
                </div>
            </div>

            {/* Additional Details */}
            <div style={{
                padding: '16px 24px',
                backgroundColor: '#fafafa',
                borderTop: '1px solid #d9d9d9',
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '24px'
            }}>
                {/* Rack Price Comparison */}
                <div>
                    <Texto style={{ fontSize: '12px', fontWeight: 600, color: '#595959', display: 'block', marginBottom: '8px' }}>
                        Rack Price Comparison
                    </Texto>
                    <Horizontal style={{ justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                        <Texto style={{ fontSize: '11px', color: '#8c8c8c' }}>Opus Rack:</Texto>
                        <Texto style={{ fontSize: '14px', fontWeight: 600, color: '#333' }}>{formatCurrency(marketData.opusRackPrice)}</Texto>
                    </Horizontal>
                    <Horizontal style={{ justifyContent: 'space-between', alignItems: 'center' }}>
                        <Texto style={{ fontSize: '11px', color: '#8c8c8c' }}>My Rack:</Texto>
                        <Texto style={{ fontSize: '14px', fontWeight: 600, color: getDeltaColor(marketData.rackPriceDelta) }}>
                            {formatCurrency(marketData.myRackPrice)}
                        </Texto>
                    </Horizontal>
                </div>

                {/* Market Split */}
                <div>
                    <Texto style={{ fontSize: '12px', fontWeight: 600, color: '#595959', display: 'block', marginBottom: '8px' }}>
                        Market Split (Branded vs. Unbranded)
                    </Texto>
                    <Horizontal style={{ justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                        <Texto style={{ fontSize: '11px', color: '#8c8c8c' }}>Branded:</Texto>
                        <Texto style={{ fontSize: '14px', fontWeight: 600, color: '#1890ff' }}>{marketData.brandedPercentage}%</Texto>
                    </Horizontal>
                    <Horizontal style={{ justifyContent: 'space-between', alignItems: 'center' }}>
                        <Texto style={{ fontSize: '11px', color: '#8c8c8c' }}>Unbranded:</Texto>
                        <Texto style={{ fontSize: '14px', fontWeight: 600, color: '#8c8c8c' }}>{marketData.unbrandedPercentage}%</Texto>
                    </Horizontal>
                </div>
            </div>
        </div>
    );
}
