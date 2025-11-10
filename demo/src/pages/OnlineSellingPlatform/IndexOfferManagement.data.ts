// Market Context Data Types and Mock Data

export interface MarketContextData {
    // Offer identifiers
    offerId: number;
    terminal: string;
    product: string;

    // Opus Contract Data
    opusContractLow: number;      // Lowest Opus contract price
    opusContract2ndLow: number;   // Second lowest Opus contract price
    opusContractAvg: number;      // Average Opus contract price

    // Rack Pricing Comparison
    opusRackPrice: number;        // Opus rack price
    myRackPrice: number;          // My rack price
    rackPriceDelta: number;       // Difference (My - Opus)

    // Publisher Pricing
    argusPrice: number | null;    // Argus current price
    plattsPrice: number | null;   // Platts current price

    // Spot Market Alternatives
    spotContractPrice: number | null;  // Alternative spot contract price

    // Market Split Analysis
    brandedPercentage: number;    // % of branded vs unbranded
    unbrandedPercentage: number;

    // Volume Pacing
    volumeMTD: number;            // Month-to-date volume
    volumeGoal: number;           // Monthly volume goal
    volumePacingPercent: number;  // MTD % of goal

    // Competitive Rank
    marketRank: number;           // 1-10, where 1 is most competitive
    totalCompetitors: number;     // Total number of competitors
}

// Generate market context data for each offer
export function generateMarketContextData(): MarketContextData[] {
    return [
        {
            // Offer 1: Houston 87 Gas
            offerId: 1,
            terminal: 'Houston',
            product: '87 Gas',
            opusContractLow: 2.48,
            opusContract2ndLow: 2.52,
            opusContractAvg: 2.58,
            opusRackPrice: 2.55,
            myRackPrice: 2.50,  // Our differential is 0.02, so competitive
            rackPriceDelta: -0.05,
            argusPrice: 2.54,
            plattsPrice: 2.56,
            spotContractPrice: 2.60,
            brandedPercentage: 65,
            unbrandedPercentage: 35,
            volumeMTD: 85000,
            volumeGoal: 120000,
            volumePacingPercent: 71,
            marketRank: 2,  // 2nd most competitive
            totalCompetitors: 10
        },
        {
            // Offer 2: Houston ULSD 2
            offerId: 2,
            terminal: 'Houston',
            product: 'ULSD 2',
            opusContractLow: 2.62,
            opusContract2ndLow: 2.65,
            opusContractAvg: 2.72,
            opusRackPrice: 2.68,
            myRackPrice: 2.65,
            rackPriceDelta: -0.03,
            argusPrice: 2.70,
            plattsPrice: 2.71,
            spotContractPrice: 2.75,
            brandedPercentage: 70,
            unbrandedPercentage: 30,
            volumeMTD: 95000,
            volumeGoal: 100000,
            volumePacingPercent: 95,
            marketRank: 1,  // Most competitive
            totalCompetitors: 10
        },
        {
            // Offer 3: Nashville Terminal 87 Gas
            offerId: 3,
            terminal: 'Nashville Terminal',
            product: '87 Gas',
            opusContractLow: 2.51,
            opusContract2ndLow: 2.55,
            opusContractAvg: 2.61,
            opusRackPrice: 2.58,
            myRackPrice: 2.58,  // Our differential is 0.03
            rackPriceDelta: 0.00,
            argusPrice: 2.60,
            plattsPrice: 2.59,
            spotContractPrice: 2.63,
            brandedPercentage: 60,
            unbrandedPercentage: 40,
            volumeMTD: 42000,
            volumeGoal: 80000,
            volumePacingPercent: 53,
            marketRank: 5,  // Mid-tier competitive
            totalCompetitors: 10
        },
        {
            // Offer 4: Nashville Terminal ULSD 2
            offerId: 4,
            terminal: 'Nashville Terminal',
            product: 'ULSD 2',
            opusContractLow: 2.64,
            opusContract2ndLow: 2.67,
            opusContractAvg: 2.74,
            opusRackPrice: 2.70,
            myRackPrice: 2.71,  // Our differential is 0.01, but inactive
            rackPriceDelta: 0.01,
            argusPrice: 2.72,
            plattsPrice: null,
            spotContractPrice: 2.76,
            brandedPercentage: 55,
            unbrandedPercentage: 45,
            volumeMTD: 18000,
            volumeGoal: 60000,
            volumePacingPercent: 30,
            marketRank: 7,  // Less competitive (inactive)
            totalCompetitors: 10
        },
        {
            // Offer 5: Detroit Terminal 87 Gas
            offerId: 5,
            terminal: 'Detroit Terminal',
            product: '87 Gas',
            opusContractLow: 2.54,
            opusContract2ndLow: 2.58,
            opusContractAvg: 2.64,
            opusRackPrice: 2.61,
            myRackPrice: 2.59,
            rackPriceDelta: -0.02,
            argusPrice: 2.63,
            plattsPrice: 2.62,
            spotContractPrice: 2.66,
            brandedPercentage: 68,
            unbrandedPercentage: 32,
            volumeMTD: 72000,
            volumeGoal: 90000,
            volumePacingPercent: 80,
            marketRank: 3,  // Very competitive
            totalCompetitors: 10
        },
        {
            // Offer 6: Detroit Terminal ULSD 2
            offerId: 6,
            terminal: 'Detroit Terminal',
            product: 'ULSD 2',
            opusContractLow: 2.66,
            opusContract2ndLow: 2.69,
            opusContractAvg: 2.76,
            opusRackPrice: 2.72,
            myRackPrice: 2.72,
            rackPriceDelta: 0.00,
            argusPrice: 2.74,
            plattsPrice: 2.75,
            spotContractPrice: null,
            brandedPercentage: 72,
            unbrandedPercentage: 28,
            volumeMTD: 88000,
            volumeGoal: 95000,
            volumePacingPercent: 93,
            marketRank: 4,  // Competitive
            totalCompetitors: 10
        },
        {
            // Offer 7: Columbia Terminal 93 Premium
            offerId: 7,
            terminal: 'Columbia Terminal',
            product: '93 Premium',
            opusContractLow: 2.82,
            opusContract2ndLow: 2.88,
            opusContractAvg: 2.96,
            opusRackPrice: 2.92,
            myRackPrice: 2.92,  // Our differential is 0.05
            rackPriceDelta: 0.00,
            argusPrice: 2.94,
            plattsPrice: 2.95,
            spotContractPrice: 2.98,
            brandedPercentage: 80,
            unbrandedPercentage: 20,
            volumeMTD: 35000,
            volumeGoal: 50000,
            volumePacingPercent: 70,
            marketRank: 6,  // Average competitive
            totalCompetitors: 10
        },
        {
            // Offer 8: Columbia Terminal 87 Gas (Inactive)
            offerId: 8,
            terminal: 'Columbia Terminal',
            product: '87 Gas',
            opusContractLow: 2.49,
            opusContract2ndLow: 2.53,
            opusContractAvg: 2.59,
            opusRackPrice: 2.56,
            myRackPrice: 2.57,
            rackPriceDelta: 0.01,
            argusPrice: 2.58,
            plattsPrice: null,
            spotContractPrice: 2.61,
            brandedPercentage: 58,
            unbrandedPercentage: 42,
            volumeMTD: 12000,
            volumeGoal: 70000,
            volumePacingPercent: 17,
            marketRank: 8,  // Not competitive (inactive)
            totalCompetitors: 10
        },
        {
            // Offer 9: Columbia Terminal B7 GHL
            offerId: 9,
            terminal: 'Columbia Terminal',
            product: 'B7 GHL',
            opusContractLow: 2.68,
            opusContract2ndLow: 2.71,
            opusContractAvg: 2.78,
            opusRackPrice: 2.74,
            myRackPrice: 2.74,
            rackPriceDelta: 0.00,
            argusPrice: 2.76,
            plattsPrice: 2.77,
            spotContractPrice: 2.80,
            brandedPercentage: 45,
            unbrandedPercentage: 55,
            volumeMTD: 28000,
            volumeGoal: 40000,
            volumePacingPercent: 70,
            marketRank: 4,  // Competitive
            totalCompetitors: 10
        },
        {
            // Offer 10: Columbia Terminal Mid-Grade 88
            offerId: 10,
            terminal: 'Columbia Terminal',
            product: 'Mid-Grade 88',
            opusContractLow: 2.72,
            opusContract2ndLow: 2.76,
            opusContractAvg: 2.83,
            opusRackPrice: 2.79,
            myRackPrice: 2.79,
            rackPriceDelta: 0.00,
            argusPrice: 2.81,
            plattsPrice: 2.82,
            spotContractPrice: 2.85,
            brandedPercentage: 62,
            unbrandedPercentage: 38,
            volumeMTD: 31000,
            volumeGoal: 45000,
            volumePacingPercent: 69,
            marketRank: 5,  // Mid-tier competitive
            totalCompetitors: 10
        }
    ];
}

// Helper function to get market context for a specific offer
export function getMarketContextForOffer(offerId: number): MarketContextData | undefined {
    const allMarketData = generateMarketContextData();
    return allMarketData.find(data => data.offerId === offerId);
}

// Helper function to determine rank color
export function getRankColor(rank: number): string {
    if (rank <= 3) return '#52c41a';  // Green - top tier
    if (rank <= 7) return '#1890ff';  // Blue - mid tier
    return '#fa8c16';  // Orange - needs improvement
}

// Helper function to determine rank description
export function getRankDescription(rank: number, total: number): string {
    if (rank === 1) return 'Most Competitive';
    if (rank === total) return 'Least Competitive';
    if (rank <= 3) return 'Highly Competitive';
    if (rank <= 7) return 'Moderately Competitive';
    return 'Below Average';
}
