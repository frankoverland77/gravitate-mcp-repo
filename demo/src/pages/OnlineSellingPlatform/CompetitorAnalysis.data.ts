/**
 * Mock data generators for Market Movement Analysis visualizations
 */

export interface PriceChangeDataPoint {
    id: string;
    x: number; // Market change
    y: number; // Competitor change
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
 * Generate price change correlation data showing how competitor responds to market movements
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

        // Calculate competitor response with some noise
        const noise = (Math.random() - 0.5) * 0.03; // ±3 cents noise
        const competitorChange = marketChange * captureRate + noise;

        data.push({
            id: `point-${i}`,
            x: parseFloat(marketChange.toFixed(4)),
            y: parseFloat(competitorChange.toFixed(4))
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
 * Get behavioral metrics for a competitor
 */
export function getBehavioralMetrics(competitorId: number): BehavioralMetrics {
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

    return metricsMap[competitorId] || metricsMap[1];
}
