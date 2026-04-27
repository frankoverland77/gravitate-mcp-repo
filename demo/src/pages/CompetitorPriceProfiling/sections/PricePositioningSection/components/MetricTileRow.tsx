import { Texto } from '@gravitate-js/excalibrr';
import type { MetricTileData } from '../../../CompetitorPriceProfiling.types';

interface MetricTileRowProps {
    tiles: MetricTileData[];
}

// Chromeless inline metrics — label · value · sub stacked per column, thin
// vertical rules between columns. Replaces the 4-card grid that created the
// "hot dog pack" on every section.
export function MetricTileRow({ tiles }: MetricTileRowProps) {
    return (
        <div
            style={{
                display: 'grid',
                gridTemplateColumns: `repeat(${tiles.length}, 1fr)`,
            }}
        >
            {tiles.map((t, i) => (
                <div
                    key={i}
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 4,
                        padding: '14px 20px',
                        borderLeft: i === 0 ? 'none' : '1px solid #e8e8e8',
                    }}
                >
                    <Texto category="p2" appearance="medium">{t.label}</Texto>
                    <Texto category="h4" weight="700">{t.value}</Texto>
                    <Texto category="p2" appearance="medium">{t.sub}</Texto>
                </div>
            ))}
        </div>
    );
}
