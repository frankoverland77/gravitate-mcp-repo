import React from 'react';
import { TrophyOutlined } from '@ant-design/icons';
import { Tooltip } from 'antd';
import { getRankColor, getRankDescription } from '../IndexOfferManagement.data';

interface RankBadgeProps {
    rank: number;
    totalCompetitors?: number;
    showTrophy?: boolean;
    size?: 'small' | 'medium' | 'large';
}

export function RankBadge({ rank, totalCompetitors = 10, showTrophy = true, size = 'medium' }: RankBadgeProps) {
    const color = getRankColor(rank);
    const description = getRankDescription(rank, totalCompetitors);
    const isTopThree = rank <= 3;

    // Size configurations
    const sizeConfig = {
        small: {
            fontSize: '11px',
            padding: '2px 8px',
            iconSize: '12px',
            minWidth: '45px'
        },
        medium: {
            fontSize: '13px',
            padding: '4px 12px',
            iconSize: '14px',
            minWidth: '55px'
        },
        large: {
            fontSize: '15px',
            padding: '6px 16px',
            iconSize: '16px',
            minWidth: '65px'
        }
    };

    const config = sizeConfig[size];

    // Trophy color based on rank
    const getTrophyColor = (rank: number) => {
        if (rank === 1) return '#ffd700'; // Gold
        if (rank === 2) return '#c0c0c0'; // Silver
        if (rank === 3) return '#cd7f32'; // Bronze
        return color;
    };

    return (
        <Tooltip title={`${description} - Rank ${rank} of ${totalCompetitors}`}>
            <div
                style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: config.padding,
                    borderRadius: '12px',
                    backgroundColor: `${color}15`,
                    border: `1px solid ${color}40`,
                    minWidth: config.minWidth,
                    justifyContent: 'center'
                }}
            >
                {showTrophy && isTopThree && (
                    <TrophyOutlined
                        style={{
                            color: getTrophyColor(rank),
                            fontSize: config.iconSize
                        }}
                    />
                )}
                <span
                    style={{
                        fontSize: config.fontSize,
                        fontWeight: 600,
                        color: color
                    }}
                >
                    #{rank}
                </span>
            </div>
        </Tooltip>
    );
}
