import type { MetricTileData } from '../CompetitorPriceProfiling.types';
import { MetricTile } from '../sections/PricePositioningSection/components/MetricTile';

interface SummaryTilesProps {
    tiles: MetricTileData[];
}

export function SummaryTiles({ tiles }: SummaryTilesProps) {
    return (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 16 }}>
            {tiles.map((tile, index) => (
                <MetricTile
                    key={`${tile.label}-${index}`}
                    label={tile.label}
                    value={tile.value}
                    sub={tile.sub}
                />
            ))}
        </div>
    );
}
