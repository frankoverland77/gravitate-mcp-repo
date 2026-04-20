import type { MetricTileData } from '../../../CompetitorPriceProfiling.types';
import { MetricTile } from './MetricTile';

interface MetricTileRowProps {
    tiles: MetricTileData[];
}

export function MetricTileRow({ tiles }: MetricTileRowProps) {
    return (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
            {tiles.map((t, i) => (
                <MetricTile key={i} {...t} />
            ))}
        </div>
    );
}
