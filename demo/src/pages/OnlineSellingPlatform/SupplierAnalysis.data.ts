/**
 * Mock data generators for Market Movement Analysis visualizations
 */

export interface PriceChangeDataPoint {
    id: string;
    x: number; // Market change
    y: number; // Supplier change
}

export interface CaptureRateDataPoint {
    id: string;
    x: number; // Movement size (0-5)
    y: number; // Capture rate (%)
}

export interface ConsistencyDataPoint {
    x: string; // Date
    y: number; // Capture rate (%)
}

export interface ConsistencySeriesData {
    id: string;
    data: ConsistencyDataPoint[];
}

export interface BehavioralMetrics {
    strategy: string;
    position: string;
    consistency: string;
    upMarketCapture: number;
    downMarketCapture: number;
    intradayChanges: string;
    intradayTime: string;
}

/**
 * Generate price change correlation data showing how supplier responds to market movements
 */
export function generatePriceChangeCorrelationData(
    upCapture: number = 90.2,
    downCapture: number = 89.8,
    dataPoints: number = 60
): PriceChangeDataPoint[] {
    const data: PriceChangeDataPoint[] = [];

    for (let i = 0; i < dataPoints; i++) {
        // Generate random market change between -$0.25 and +$0.25
        const marketChange = (Math.random() - 0.5) * 0.5;

        // Determine if up or down market
        const captureRate = marketChange > 0 ? upCapture / 100 : downCapture / 100;

        // Calculate supplier response with some noise
        const noise = (Math.random() - 0.5) * 0.03; // ±3 cents noise
        const supplierChange = marketChange * captureRate + noise;

        data.push({
            id: `point-${i}`,
            x: parseFloat(marketChange.toFixed(4)),
            y: parseFloat(supplierChange.toFixed(4))
        });
    }

    return data;
}

/**
 * Calculate linear regression trend line
 */
export function calculateTrendLine(data: PriceChangeDataPoint[]): { slope: number; intercept: number } {
    const n = data.length;
    let sumX = 0, sumY = 0, sumXY = 0, sumX2 = 0;

    data.forEach(point => {
        sumX += point.x;
        sumY += point.y;
        sumXY += point.x * point.y;
        sumX2 += point.x * point.x;
    });

    const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;

    return { slope, intercept };
}

/**
 * Generate capture rate vs movement size data
 */
export function generateCaptureRateData(
    avgCapture: number = 90,
    dataPoints: number = 25
): CaptureRateDataPoint[] {
    const data: CaptureRateDataPoint[] = [];

    for (let i = 0; i < dataPoints; i++) {
        const movementSize = Math.random() * 5; // 0-5 scale

        // Add some variance around average capture rate
        const variance = (Math.random() - 0.5) * 20; // ±10% variance
        const captureRate = Math.max(0, Math.min(200, avgCapture + variance));

        data.push({
            id: `rate-${i}`,
            x: parseFloat(movementSize.toFixed(2)),
            y: parseFloat(captureRate.toFixed(1))
        });
    }

    return data;
}

/**
 * Generate consistency over time data with daily and 7-day moving average
 */
export function generateConsistencyData(
    days: number = 90,
    avgCapture: number = 90
): ConsistencySeriesData[] {
    const dailyData: ConsistencyDataPoint[] = [];
    const movingAvgData: ConsistencyDataPoint[] = [];

    // Generate daily capture rates
    const dailyRates: number[] = [];
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    for (let i = 0; i < days; i++) {
        const date = new Date(startDate);
        date.setDate(date.getDate() + i);
        const dateStr = date.toISOString().split('T')[0];

        // Random daily capture rate with some trending behavior
        const trend = Math.sin(i / 10) * 5; // Gentle wave pattern
        const noise = (Math.random() - 0.5) * 15; // Daily variance
        const dailyRate = Math.max(60, Math.min(120, avgCapture + trend + noise));

        dailyRates.push(dailyRate);
        dailyData.push({
            x: dateStr,
            y: parseFloat(dailyRate.toFixed(1))
        });
    }

    // Calculate 7-day moving average
    for (let i = 0; i < days; i++) {
        const date = new Date(startDate);
        date.setDate(date.getDate() + i);
        const dateStr = date.toISOString().split('T')[0];

        if (i >= 6) {
            const sum = dailyRates.slice(i - 6, i + 1).reduce((a, b) => a + b, 0);
            const avg = sum / 7;
            movingAvgData.push({
                x: dateStr,
                y: parseFloat(avg.toFixed(1))
            });
        }
    }

    return [
        {
            id: 'Daily Capture Rate',
            data: dailyData
        },
        {
            id: '7-Day Average',
            data: movingAvgData
        }
    ];
}

/**
 * Get behavioral metrics for a supplier
 */
export function getBehavioralMetrics(supplierId: number): BehavioralMetrics {
    // Sample data - in real app would come from API
    const metricsMap: Record<number, BehavioralMetrics> = {
        1: {
            strategy: 'Leader',
            position: '#1',
            consistency: 'High (89%)',
            upMarketCapture: 96.5,
            downMarketCapture: 94.2,
            intradayChanges: 'Rarely (15%)',
            intradayTime: '1:00 PM'
        },
        2: {
            strategy: 'Follower',
            position: '#2-3',
            consistency: 'High (85%)',
            upMarketCapture: 90.2,
            downMarketCapture: 89.8,
            intradayChanges: 'Rarely (18%)',
            intradayTime: '2:00 PM'
        },
        3: {
            strategy: 'Position',
            position: '#3-4',
            consistency: 'Medium (81%)',
            upMarketCapture: 82.3,
            downMarketCapture: 80.1,
            intradayChanges: 'Sometimes (35%)',
            intradayTime: '10:00 AM'
        },
        4: {
            strategy: 'Leader',
            position: '#1-2',
            consistency: 'High (88%)',
            upMarketCapture: 94.1,
            downMarketCapture: 92.8,
            intradayChanges: 'Rarely (12%)',
            intradayTime: '9:00 AM'
        },
        5: {
            strategy: 'Leader',
            position: '#1',
            consistency: 'Medium (74%)',
            upMarketCapture: 91.8,
            downMarketCapture: 89.5,
            intradayChanges: 'Sometimes (28%)',
            intradayTime: '3:00 PM'
        },
        6: {
            strategy: 'Follower',
            position: '#2-4',
            consistency: 'High (82%)',
            upMarketCapture: 85.4,
            downMarketCapture: 84.9,
            intradayChanges: 'Rarely (20%)',
            intradayTime: '11:00 AM'
        },
        7: {
            strategy: 'Position',
            position: '#3-5',
            consistency: 'Medium (76%)',
            upMarketCapture: 78.9,
            downMarketCapture: 77.2,
            intradayChanges: 'Often (42%)',
            intradayTime: '12:00 PM'
        },
        8: {
            strategy: 'Follower',
            position: '#2',
            consistency: 'High (85%)',
            upMarketCapture: 88.2,
            downMarketCapture: 87.6,
            intradayChanges: 'Rarely (16%)',
            intradayTime: '2:30 PM'
        },
        9: {
            strategy: 'Position',
            position: '#4-6',
            consistency: 'Low (23%)',
            upMarketCapture: 72.6,
            downMarketCapture: 68.9,
            intradayChanges: 'Very Often (65%)',
            intradayTime: 'Variable'
        },
        10: {
            strategy: 'Leader',
            position: '#1-2',
            consistency: 'High (87%)',
            upMarketCapture: 93.2,
            downMarketCapture: 91.5,
            intradayChanges: 'Rarely (14%)',
            intradayTime: '1:30 PM'
        }
    };

    return metricsMap[supplierId] || metricsMap[1];
}

/**
 * Chart data for each supplier - pre-generated scatter and line data
 */
export interface SupplierChartData {
    scatterData1: { id: string; data: { x: number; y: number }[] }[];
    scatterData2: { id: string; data: { x: number; y: number }[] }[];
    lineData: { id: string; color: string; data: { x: string; y: number }[] }[];
}

// Pre-generated scatter data for Price Change vs Market (unique per supplier)
const SCATTER_DATA_BY_ID: Record<number, { id: string; data: { x: number; y: number }[] }[]> = {
    1: [{ id: 'correlation', data: [
        { x: -0.20, y: -0.19 }, { x: -0.15, y: -0.14 }, { x: -0.10, y: -0.10 },
        { x: -0.05, y: -0.05 }, { x: 0.00, y: 0.01 }, { x: 0.05, y: 0.05 },
        { x: 0.10, y: 0.10 }, { x: 0.15, y: 0.14 }, { x: 0.20, y: 0.19 },
        { x: -0.18, y: -0.17 }, { x: -0.12, y: -0.11 }, { x: -0.08, y: -0.08 },
        { x: 0.08, y: 0.08 }, { x: 0.12, y: 0.12 }, { x: 0.18, y: 0.17 }
    ]}],
    2: [{ id: 'correlation', data: [
        { x: -0.20, y: -0.15 }, { x: -0.18, y: -0.12 }, { x: -0.15, y: -0.08 },
        { x: -0.12, y: -0.05 }, { x: -0.10, y: -0.03 }, { x: -0.08, y: -0.02 },
        { x: -0.05, y: 0.00 }, { x: -0.03, y: 0.02 }, { x: 0.00, y: 0.03 },
        { x: 0.02, y: 0.04 }, { x: 0.05, y: 0.06 }, { x: 0.08, y: 0.10 },
        { x: 0.10, y: 0.12 }, { x: 0.12, y: 0.14 }, { x: 0.15, y: 0.16 }
    ]}],
    3: [{ id: 'correlation', data: [
        { x: -0.22, y: -0.12 }, { x: -0.18, y: -0.08 }, { x: -0.14, y: -0.10 },
        { x: -0.10, y: -0.04 }, { x: -0.06, y: -0.08 }, { x: -0.02, y: 0.02 },
        { x: 0.02, y: 0.00 }, { x: 0.06, y: 0.08 }, { x: 0.10, y: 0.06 },
        { x: 0.14, y: 0.14 }, { x: 0.18, y: 0.10 }, { x: 0.22, y: 0.16 }
    ]}],
    4: [{ id: 'correlation', data: [
        { x: -0.20, y: -0.18 }, { x: -0.16, y: -0.15 }, { x: -0.12, y: -0.11 },
        { x: -0.08, y: -0.07 }, { x: -0.04, y: -0.04 }, { x: 0.00, y: 0.00 },
        { x: 0.04, y: 0.04 }, { x: 0.08, y: 0.08 }, { x: 0.12, y: 0.11 },
        { x: 0.16, y: 0.15 }, { x: 0.20, y: 0.19 }, { x: -0.14, y: -0.13 }
    ]}],
    5: [{ id: 'correlation', data: [
        { x: -0.20, y: -0.16 }, { x: -0.15, y: -0.14 }, { x: -0.10, y: -0.08 },
        { x: -0.05, y: -0.06 }, { x: 0.00, y: 0.02 }, { x: 0.05, y: 0.04 },
        { x: 0.10, y: 0.08 }, { x: 0.15, y: 0.12 }, { x: 0.20, y: 0.18 },
        { x: -0.08, y: -0.10 }, { x: 0.08, y: 0.06 }, { x: 0.12, y: 0.14 }
    ]}],
    6: [{ id: 'correlation', data: [
        { x: -0.18, y: -0.14 }, { x: -0.14, y: -0.10 }, { x: -0.10, y: -0.08 },
        { x: -0.06, y: -0.04 }, { x: -0.02, y: -0.02 }, { x: 0.02, y: 0.02 },
        { x: 0.06, y: 0.06 }, { x: 0.10, y: 0.08 }, { x: 0.14, y: 0.12 },
        { x: 0.18, y: 0.14 }, { x: -0.12, y: -0.09 }, { x: 0.12, y: 0.10 }
    ]}],
    7: [{ id: 'correlation', data: [
        { x: -0.20, y: -0.10 }, { x: -0.15, y: -0.14 }, { x: -0.10, y: -0.02 },
        { x: -0.05, y: -0.08 }, { x: 0.00, y: 0.04 }, { x: 0.05, y: -0.02 },
        { x: 0.10, y: 0.12 }, { x: 0.15, y: 0.08 }, { x: 0.20, y: 0.18 },
        { x: -0.08, y: -0.12 }, { x: 0.08, y: 0.02 }, { x: 0.18, y: 0.14 }
    ]}],
    8: [{ id: 'correlation', data: [
        { x: -0.18, y: -0.15 }, { x: -0.14, y: -0.12 }, { x: -0.10, y: -0.08 },
        { x: -0.06, y: -0.05 }, { x: -0.02, y: -0.02 }, { x: 0.02, y: 0.02 },
        { x: 0.06, y: 0.05 }, { x: 0.10, y: 0.09 }, { x: 0.14, y: 0.12 },
        { x: 0.18, y: 0.16 }, { x: -0.16, y: -0.14 }, { x: 0.16, y: 0.14 }
    ]}],
    9: [{ id: 'correlation', data: [
        { x: -0.22, y: -0.08 }, { x: -0.16, y: -0.18 }, { x: -0.10, y: 0.02 },
        { x: -0.04, y: -0.12 }, { x: 0.02, y: 0.08 }, { x: 0.08, y: -0.04 },
        { x: 0.14, y: 0.16 }, { x: 0.20, y: 0.06 }, { x: -0.08, y: -0.02 },
        { x: 0.06, y: 0.12 }, { x: -0.14, y: -0.06 }, { x: 0.18, y: 0.10 }
    ]}],
    10: [{ id: 'correlation', data: [
        { x: -0.20, y: -0.18 }, { x: -0.16, y: -0.14 }, { x: -0.12, y: -0.11 },
        { x: -0.08, y: -0.07 }, { x: -0.04, y: -0.03 }, { x: 0.00, y: 0.01 },
        { x: 0.04, y: 0.04 }, { x: 0.08, y: 0.07 }, { x: 0.12, y: 0.11 },
        { x: 0.16, y: 0.15 }, { x: 0.20, y: 0.18 }, { x: -0.18, y: -0.16 }
    ]}]
};

// Pre-generated scatter data for Capture Rate vs Movement Size
const CAPTURE_RATE_DATA_BY_ID: Record<number, { id: string; data: { x: number; y: number }[] }[]> = {
    1: [{ id: 'capture', data: [
        { x: 0.5, y: 95 }, { x: 1.0, y: 97 }, { x: 1.5, y: 94 },
        { x: 2.0, y: 98 }, { x: 2.5, y: 96 }, { x: 3.0, y: 93 },
        { x: 3.5, y: 97 }, { x: 4.0, y: 95 }, { x: 4.5, y: 96 }
    ]}],
    2: [{ id: 'capture', data: [
        { x: 0.5, y: 85 }, { x: 1.0, y: 92 }, { x: 1.5, y: 88 },
        { x: 2.0, y: 95 }, { x: 2.5, y: 90 }, { x: 3.0, y: 87 },
        { x: 3.5, y: 93 }, { x: 4.0, y: 89 }, { x: 4.5, y: 91 }
    ]}],
    3: [{ id: 'capture', data: [
        { x: 0.5, y: 78 }, { x: 1.0, y: 85 }, { x: 1.5, y: 80 },
        { x: 2.0, y: 88 }, { x: 2.5, y: 82 }, { x: 3.0, y: 79 },
        { x: 3.5, y: 86 }, { x: 4.0, y: 81 }, { x: 4.5, y: 84 }
    ]}],
    4: [{ id: 'capture', data: [
        { x: 0.5, y: 92 }, { x: 1.0, y: 95 }, { x: 1.5, y: 93 },
        { x: 2.0, y: 96 }, { x: 2.5, y: 94 }, { x: 3.0, y: 91 },
        { x: 3.5, y: 95 }, { x: 4.0, y: 93 }, { x: 4.5, y: 94 }
    ]}],
    5: [{ id: 'capture', data: [
        { x: 0.5, y: 88 }, { x: 1.0, y: 94 }, { x: 1.5, y: 90 },
        { x: 2.0, y: 95 }, { x: 2.5, y: 91 }, { x: 3.0, y: 89 },
        { x: 3.5, y: 93 }, { x: 4.0, y: 90 }, { x: 4.5, y: 92 }
    ]}],
    6: [{ id: 'capture', data: [
        { x: 0.5, y: 82 }, { x: 1.0, y: 88 }, { x: 1.5, y: 84 },
        { x: 2.0, y: 90 }, { x: 2.5, y: 86 }, { x: 3.0, y: 83 },
        { x: 3.5, y: 89 }, { x: 4.0, y: 85 }, { x: 4.5, y: 87 }
    ]}],
    7: [{ id: 'capture', data: [
        { x: 0.5, y: 75 }, { x: 1.0, y: 82 }, { x: 1.5, y: 77 },
        { x: 2.0, y: 85 }, { x: 2.5, y: 79 }, { x: 3.0, y: 76 },
        { x: 3.5, y: 83 }, { x: 4.0, y: 78 }, { x: 4.5, y: 81 }
    ]}],
    8: [{ id: 'capture', data: [
        { x: 0.5, y: 84 }, { x: 1.0, y: 90 }, { x: 1.5, y: 86 },
        { x: 2.0, y: 92 }, { x: 2.5, y: 88 }, { x: 3.0, y: 85 },
        { x: 3.5, y: 91 }, { x: 4.0, y: 87 }, { x: 4.5, y: 89 }
    ]}],
    9: [{ id: 'capture', data: [
        { x: 0.5, y: 68 }, { x: 1.0, y: 78 }, { x: 1.5, y: 70 },
        { x: 2.0, y: 82 }, { x: 2.5, y: 72 }, { x: 3.0, y: 66 },
        { x: 3.5, y: 80 }, { x: 4.0, y: 71 }, { x: 4.5, y: 75 }
    ]}],
    10: [{ id: 'capture', data: [
        { x: 0.5, y: 90 }, { x: 1.0, y: 94 }, { x: 1.5, y: 92 },
        { x: 2.0, y: 96 }, { x: 2.5, y: 93 }, { x: 3.0, y: 91 },
        { x: 3.5, y: 95 }, { x: 4.0, y: 92 }, { x: 4.5, y: 94 }
    ]}]
};

// Pre-generated line data for Consistency Over Time
const LINE_DATA_BY_ID: Record<number, { id: string; color: string; data: { x: string; y: number }[] }[]> = {
    1: [
        { id: '7-Day Average', color: '#51B073', data: [
            { x: 'Sep 4', y: 98 }, { x: 'Sep 10', y: 97 }, { x: 'Sep 16', y: 96 },
            { x: 'Sep 22', y: 97 }, { x: 'Sep 28', y: 98 }, { x: 'Oct 4', y: 97 },
            { x: 'Oct 10', y: 96 }, { x: 'Oct 16', y: 97 }, { x: 'Oct 22', y: 96 },
            { x: 'Oct 28', y: 97 }, { x: 'Nov 3', y: 96 }, { x: 'Nov 9', y: 97 }
        ]},
        { id: 'Daily Capture Rate', color: '#bfbfbf', data: [
            { x: 'Sep 4', y: 99 }, { x: 'Sep 10', y: 95 }, { x: 'Sep 16', y: 98 },
            { x: 'Sep 22', y: 94 }, { x: 'Sep 28', y: 99 }, { x: 'Oct 4', y: 96 },
            { x: 'Oct 10', y: 97 }, { x: 'Oct 16', y: 95 }, { x: 'Oct 22', y: 98 },
            { x: 'Oct 28', y: 94 }, { x: 'Nov 3', y: 97 }, { x: 'Nov 9', y: 96 }
        ]}
    ],
    2: [
        { id: '7-Day Average', color: '#51B073', data: [
            { x: 'Sep 4', y: 95 }, { x: 'Sep 10', y: 92 }, { x: 'Sep 16', y: 94 },
            { x: 'Sep 22', y: 91 }, { x: 'Sep 28', y: 93 }, { x: 'Oct 4', y: 90 },
            { x: 'Oct 10', y: 88 }, { x: 'Oct 16', y: 92 }, { x: 'Oct 22', y: 89 },
            { x: 'Oct 28', y: 87 }, { x: 'Nov 3', y: 85 }, { x: 'Nov 9', y: 88 }
        ]},
        { id: 'Daily Capture Rate', color: '#bfbfbf', data: [
            { x: 'Sep 4', y: 98 }, { x: 'Sep 10', y: 88 }, { x: 'Sep 16', y: 96 },
            { x: 'Sep 22', y: 85 }, { x: 'Sep 28', y: 95 }, { x: 'Oct 4', y: 82 },
            { x: 'Oct 10', y: 92 }, { x: 'Oct 16', y: 88 }, { x: 'Oct 22', y: 94 },
            { x: 'Oct 28', y: 80 }, { x: 'Nov 3', y: 90 }, { x: 'Nov 9', y: 85 }
        ]}
    ],
    3: [
        { id: '7-Day Average', color: '#51B073', data: [
            { x: 'Sep 4', y: 85 }, { x: 'Sep 10', y: 82 }, { x: 'Sep 16', y: 84 },
            { x: 'Sep 22', y: 80 }, { x: 'Sep 28', y: 83 }, { x: 'Oct 4', y: 79 },
            { x: 'Oct 10', y: 81 }, { x: 'Oct 16', y: 78 }, { x: 'Oct 22', y: 82 },
            { x: 'Oct 28', y: 77 }, { x: 'Nov 3', y: 80 }, { x: 'Nov 9', y: 81 }
        ]},
        { id: 'Daily Capture Rate', color: '#bfbfbf', data: [
            { x: 'Sep 4', y: 90 }, { x: 'Sep 10', y: 75 }, { x: 'Sep 16', y: 88 },
            { x: 'Sep 22', y: 72 }, { x: 'Sep 28', y: 86 }, { x: 'Oct 4', y: 70 },
            { x: 'Oct 10', y: 85 }, { x: 'Oct 16', y: 74 }, { x: 'Oct 22', y: 87 },
            { x: 'Oct 28', y: 68 }, { x: 'Nov 3', y: 84 }, { x: 'Nov 9', y: 78 }
        ]}
    ],
    4: [
        { id: '7-Day Average', color: '#51B073', data: [
            { x: 'Sep 4', y: 96 }, { x: 'Sep 10', y: 95 }, { x: 'Sep 16', y: 94 },
            { x: 'Sep 22', y: 95 }, { x: 'Sep 28', y: 96 }, { x: 'Oct 4', y: 94 },
            { x: 'Oct 10', y: 93 }, { x: 'Oct 16', y: 95 }, { x: 'Oct 22', y: 94 },
            { x: 'Oct 28', y: 93 }, { x: 'Nov 3', y: 94 }, { x: 'Nov 9', y: 95 }
        ]},
        { id: 'Daily Capture Rate', color: '#bfbfbf', data: [
            { x: 'Sep 4', y: 98 }, { x: 'Sep 10', y: 92 }, { x: 'Sep 16', y: 96 },
            { x: 'Sep 22', y: 93 }, { x: 'Sep 28', y: 98 }, { x: 'Oct 4', y: 91 },
            { x: 'Oct 10', y: 95 }, { x: 'Oct 16', y: 93 }, { x: 'Oct 22', y: 96 },
            { x: 'Oct 28', y: 90 }, { x: 'Nov 3', y: 96 }, { x: 'Nov 9', y: 94 }
        ]}
    ],
    5: [
        { id: '7-Day Average', color: '#51B073', data: [
            { x: 'Sep 4', y: 92 }, { x: 'Sep 10', y: 88 }, { x: 'Sep 16', y: 90 },
            { x: 'Sep 22', y: 85 }, { x: 'Sep 28', y: 88 }, { x: 'Oct 4', y: 82 },
            { x: 'Oct 10', y: 86 }, { x: 'Oct 16', y: 80 }, { x: 'Oct 22', y: 84 },
            { x: 'Oct 28', y: 78 }, { x: 'Nov 3', y: 82 }, { x: 'Nov 9', y: 80 }
        ]},
        { id: 'Daily Capture Rate', color: '#bfbfbf', data: [
            { x: 'Sep 4', y: 96 }, { x: 'Sep 10', y: 82 }, { x: 'Sep 16', y: 94 },
            { x: 'Sep 22', y: 78 }, { x: 'Sep 28', y: 92 }, { x: 'Oct 4', y: 74 },
            { x: 'Oct 10', y: 90 }, { x: 'Oct 16', y: 72 }, { x: 'Oct 22', y: 88 },
            { x: 'Oct 28', y: 70 }, { x: 'Nov 3', y: 86 }, { x: 'Nov 9', y: 74 }
        ]}
    ],
    6: [
        { id: '7-Day Average', color: '#51B073', data: [
            { x: 'Sep 4', y: 88 }, { x: 'Sep 10', y: 86 }, { x: 'Sep 16', y: 87 },
            { x: 'Sep 22', y: 85 }, { x: 'Sep 28', y: 86 }, { x: 'Oct 4', y: 84 },
            { x: 'Oct 10', y: 85 }, { x: 'Oct 16', y: 83 }, { x: 'Oct 22', y: 84 },
            { x: 'Oct 28', y: 82 }, { x: 'Nov 3', y: 83 }, { x: 'Nov 9', y: 84 }
        ]},
        { id: 'Daily Capture Rate', color: '#bfbfbf', data: [
            { x: 'Sep 4', y: 92 }, { x: 'Sep 10', y: 82 }, { x: 'Sep 16', y: 90 },
            { x: 'Sep 22', y: 80 }, { x: 'Sep 28', y: 88 }, { x: 'Oct 4', y: 78 },
            { x: 'Oct 10', y: 88 }, { x: 'Oct 16', y: 79 }, { x: 'Oct 22', y: 87 },
            { x: 'Oct 28', y: 76 }, { x: 'Nov 3', y: 86 }, { x: 'Nov 9', y: 82 }
        ]}
    ],
    7: [
        { id: '7-Day Average', color: '#51B073', data: [
            { x: 'Sep 4', y: 82 }, { x: 'Sep 10', y: 78 }, { x: 'Sep 16', y: 80 },
            { x: 'Sep 22', y: 75 }, { x: 'Sep 28', y: 78 }, { x: 'Oct 4', y: 72 },
            { x: 'Oct 10', y: 76 }, { x: 'Oct 16', y: 70 }, { x: 'Oct 22', y: 74 },
            { x: 'Oct 28', y: 68 }, { x: 'Nov 3', y: 72 }, { x: 'Nov 9', y: 74 }
        ]},
        { id: 'Daily Capture Rate', color: '#bfbfbf', data: [
            { x: 'Sep 4', y: 88 }, { x: 'Sep 10', y: 68 }, { x: 'Sep 16', y: 85 },
            { x: 'Sep 22', y: 65 }, { x: 'Sep 28', y: 82 }, { x: 'Oct 4', y: 62 },
            { x: 'Oct 10', y: 80 }, { x: 'Oct 16', y: 60 }, { x: 'Oct 22', y: 78 },
            { x: 'Oct 28', y: 58 }, { x: 'Nov 3', y: 76 }, { x: 'Nov 9', y: 68 }
        ]}
    ],
    8: [
        { id: '7-Day Average', color: '#51B073', data: [
            { x: 'Sep 4', y: 90 }, { x: 'Sep 10', y: 88 }, { x: 'Sep 16', y: 89 },
            { x: 'Sep 22', y: 87 }, { x: 'Sep 28', y: 88 }, { x: 'Oct 4', y: 86 },
            { x: 'Oct 10', y: 87 }, { x: 'Oct 16', y: 85 }, { x: 'Oct 22', y: 86 },
            { x: 'Oct 28', y: 84 }, { x: 'Nov 3', y: 85 }, { x: 'Nov 9', y: 86 }
        ]},
        { id: 'Daily Capture Rate', color: '#bfbfbf', data: [
            { x: 'Sep 4', y: 94 }, { x: 'Sep 10', y: 84 }, { x: 'Sep 16', y: 92 },
            { x: 'Sep 22', y: 82 }, { x: 'Sep 28', y: 90 }, { x: 'Oct 4', y: 80 },
            { x: 'Oct 10', y: 90 }, { x: 'Oct 16', y: 81 }, { x: 'Oct 22', y: 89 },
            { x: 'Oct 28', y: 78 }, { x: 'Nov 3', y: 88 }, { x: 'Nov 9', y: 84 }
        ]}
    ],
    9: [
        { id: '7-Day Average', color: '#51B073', data: [
            { x: 'Sep 4', y: 75 }, { x: 'Sep 10', y: 68 }, { x: 'Sep 16', y: 72 },
            { x: 'Sep 22', y: 62 }, { x: 'Sep 28', y: 70 }, { x: 'Oct 4', y: 58 },
            { x: 'Oct 10', y: 66 }, { x: 'Oct 16', y: 55 }, { x: 'Oct 22', y: 64 },
            { x: 'Oct 28', y: 52 }, { x: 'Nov 3', y: 60 }, { x: 'Nov 9', y: 58 }
        ]},
        { id: 'Daily Capture Rate', color: '#bfbfbf', data: [
            { x: 'Sep 4', y: 85 }, { x: 'Sep 10', y: 55 }, { x: 'Sep 16', y: 80 },
            { x: 'Sep 22', y: 45 }, { x: 'Sep 28', y: 78 }, { x: 'Oct 4', y: 40 },
            { x: 'Oct 10', y: 75 }, { x: 'Oct 16', y: 38 }, { x: 'Oct 22', y: 72 },
            { x: 'Oct 28', y: 35 }, { x: 'Nov 3', y: 70 }, { x: 'Nov 9', y: 48 }
        ]}
    ],
    10: [
        { id: '7-Day Average', color: '#51B073', data: [
            { x: 'Sep 4', y: 94 }, { x: 'Sep 10', y: 93 }, { x: 'Sep 16', y: 94 },
            { x: 'Sep 22', y: 92 }, { x: 'Sep 28', y: 93 }, { x: 'Oct 4', y: 91 },
            { x: 'Oct 10', y: 92 }, { x: 'Oct 16', y: 90 }, { x: 'Oct 22', y: 91 },
            { x: 'Oct 28', y: 89 }, { x: 'Nov 3', y: 90 }, { x: 'Nov 9', y: 92 }
        ]},
        { id: 'Daily Capture Rate', color: '#bfbfbf', data: [
            { x: 'Sep 4', y: 97 }, { x: 'Sep 10', y: 89 }, { x: 'Sep 16', y: 96 },
            { x: 'Sep 22', y: 88 }, { x: 'Sep 28', y: 95 }, { x: 'Oct 4', y: 86 },
            { x: 'Oct 10', y: 94 }, { x: 'Oct 16', y: 87 }, { x: 'Oct 22', y: 93 },
            { x: 'Oct 28', y: 84 }, { x: 'Nov 3', y: 92 }, { x: 'Nov 9', y: 90 }
        ]}
    ]
};

/**
 * Get all chart data for a supplier (legacy - use getSupplierChartDataByPeriod for new implementations)
 */
export function getSupplierChartData(supplierId: number): SupplierChartData {
    return {
        scatterData1: SCATTER_DATA_BY_ID[supplierId] || SCATTER_DATA_BY_ID[1],
        scatterData2: CAPTURE_RATE_DATA_BY_ID[supplierId] || CAPTURE_RATE_DATA_BY_ID[1],
        lineData: LINE_DATA_BY_ID[supplierId] || LINE_DATA_BY_ID[1]
    };
}

// ============================================
// TIME PERIOD BASED DATA GENERATION
// ============================================

export type TimePeriod = '30' | '90' | '365';

export interface PriceChangeSeriesData {
    upSeries: { id: string; data: { x: number; y: number }[] };
    downSeries: { id: string; data: { x: number; y: number }[] };
}

export interface ChartDataByPeriod {
    priceChange: PriceChangeSeriesData;
    captureRate: { id: string; data: { x: number; y: number }[] }[];
    consistency: { id: string; color: string; data: { x: string; y: number }[] }[];
}

/**
 * Generate price change data with separate up (green) and down (red) series
 * More data points for longer time periods
 */
function generatePriceChangeByPeriod(
    supplierId: number,
    period: TimePeriod,
    upCapture: number,
    downCapture: number
): PriceChangeSeriesData {
    // More data points for longer periods
    const pointCounts: Record<TimePeriod, number> = { '30': 30, '90': 60, '365': 120 };
    const numPoints = pointCounts[period];

    // Use supplierId as seed for consistent random-looking data
    const seed = supplierId * 1000 + parseInt(period);
    const seededRandom = (i: number) => {
        const x = Math.sin(seed + i * 9999) * 10000;
        return x - Math.floor(x);
    };

    const upData: { x: number; y: number }[] = [];
    const downData: { x: number; y: number }[] = [];

    for (let i = 0; i < numPoints; i++) {
        const marketChange = (seededRandom(i) - 0.5) * 0.5; // -0.25 to +0.25
        const captureRate = marketChange > 0 ? upCapture / 100 : downCapture / 100;
        const noise = (seededRandom(i + 1000) - 0.5) * 0.04;
        const supplierChange = marketChange * captureRate + noise;

        const point = {
            x: parseFloat(marketChange.toFixed(3)),
            y: parseFloat(supplierChange.toFixed(3))
        };

        if (marketChange >= 0) {
            upData.push(point);
        } else {
            downData.push(point);
        }
    }

    return {
        upSeries: { id: 'Up Market', data: upData },
        downSeries: { id: 'Down Market', data: downData }
    };
}

/**
 * Generate capture rate data with more points for longer periods
 */
function generateCaptureRateByPeriod(
    supplierId: number,
    period: TimePeriod,
    avgCapture: number
): { id: string; data: { x: number; y: number }[] }[] {
    const pointCounts: Record<TimePeriod, number> = { '30': 15, '90': 25, '365': 40 };
    const numPoints = pointCounts[period];

    const seed = supplierId * 2000 + parseInt(period);
    const seededRandom = (i: number) => {
        const x = Math.sin(seed + i * 9999) * 10000;
        return x - Math.floor(x);
    };

    const data: { x: number; y: number }[] = [];

    for (let i = 0; i < numPoints; i++) {
        const movementSize = seededRandom(i) * 5; // 0-5 scale
        const variance = (seededRandom(i + 500) - 0.5) * 20;
        const captureRate = Math.max(50, Math.min(100, avgCapture + variance));

        data.push({
            x: parseFloat(movementSize.toFixed(2)),
            y: parseFloat(captureRate.toFixed(1))
        });
    }

    return [{ id: 'capture', data }];
}

/**
 * Generate consistency over time data based on period
 * Samples data points to keep charts readable
 */
function generateConsistencyByPeriod(
    supplierId: number,
    period: TimePeriod,
    avgCapture: number
): { id: string; color: string; data: { x: string; y: number }[] }[] {
    const days = parseInt(period);

    const seed = supplierId * 3000 + days;
    const seededRandom = (i: number) => {
        const x = Math.sin(seed + i * 9999) * 10000;
        return x - Math.floor(x);
    };

    // Sample rate: show fewer points for longer periods
    const sampleRate: Record<TimePeriod, number> = { '30': 1, '90': 3, '365': 7 };
    const skipDays = sampleRate[period];

    const dailyData: { x: string; y: number }[] = [];
    const movingAvgData: { x: string; y: number }[] = [];
    const allDailyRates: number[] = [];

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    // Format date based on period (shorter format for longer periods)
    const formatDate = (date: Date): string => {
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        return `${months[date.getMonth()]} ${date.getDate()}`;
    };

    // Generate all daily rates first
    for (let i = 0; i < days; i++) {
        const trend = Math.sin(i / 15) * 5;
        const noise = (seededRandom(i) - 0.5) * 15;
        const dailyRate = Math.max(40, Math.min(100, avgCapture + trend + noise));
        allDailyRates.push(dailyRate);
    }

    // Sample points for display (starting after 7-day average is available)
    for (let i = 6; i < days; i += skipDays) {
        const date = new Date(startDate);
        date.setDate(date.getDate() + i);
        const dateStr = formatDate(date);

        // Daily capture rate at this point
        dailyData.push({
            x: dateStr,
            y: parseFloat(allDailyRates[i].toFixed(1))
        });

        // 7-day moving average at this point
        const sum = allDailyRates.slice(i - 6, i + 1).reduce((a, b) => a + b, 0);
        const avg = sum / 7;
        movingAvgData.push({
            x: dateStr,
            y: parseFloat(avg.toFixed(1))
        });
    }

    return [
        { id: '7-Day Average', color: '#51B073', data: movingAvgData },
        { id: 'Daily Capture Rate', color: '#bfbfbf', data: dailyData }
    ];
}

/**
 * Get chart data for a supplier by time period
 * This is the main function to use for time-period aware charts
 */
export function getSupplierChartDataByPeriod(
    supplierId: number,
    period: TimePeriod
): ChartDataByPeriod {
    const metrics = getBehavioralMetrics(supplierId);
    const avgCapture = (metrics.upMarketCapture + metrics.downMarketCapture) / 2;

    return {
        priceChange: generatePriceChangeByPeriod(
            supplierId,
            period,
            metrics.upMarketCapture,
            metrics.downMarketCapture
        ),
        captureRate: generateCaptureRateByPeriod(supplierId, period, avgCapture),
        consistency: generateConsistencyByPeriod(supplierId, period, avgCapture)
    };
}
