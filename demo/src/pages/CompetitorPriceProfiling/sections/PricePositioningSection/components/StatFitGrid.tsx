import { Texto, Vertical } from '@gravitate-js/excalibrr';
import type { StatFitRow } from '../../../CompetitorPriceProfiling.types';

interface StatFitGridProps {
    rows: StatFitRow[];
}

export function StatFitGrid({ rows }: StatFitGridProps) {
    return (
        <div
            style={{
                backgroundColor: '#ffffff',
                border: '1px solid #e8e8e8',
                borderRadius: 8,
                padding: 16,
            }}
        >
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
                {rows.map((row, i) => (
                    <Vertical key={i} gap={4}>
                        <Texto category="p2" appearance="medium">{row.label}</Texto>
                        <Texto category="p1" weight="600">{row.value}</Texto>
                        <Texto category="p2" appearance="medium">{row.sub}</Texto>
                    </Vertical>
                ))}
            </div>
        </div>
    );
}
