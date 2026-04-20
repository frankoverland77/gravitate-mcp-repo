import { Texto, Vertical } from '@gravitate-js/excalibrr';
import type { MetricTileData } from '../../../CompetitorPriceProfiling.types';

export function MetricTile({ label, value, sub }: MetricTileData) {
    return (
        <div
            style={{
                backgroundColor: '#ffffff',
                border: '1px solid #e8e8e8',
                borderRadius: 8,
                padding: 16,
            }}
        >
            <Vertical gap={8}>
                <Texto category="p2" appearance="medium">{label}</Texto>
                <Texto category="h2" weight="700">{value}</Texto>
                <Texto category="p2" appearance="medium">{sub}</Texto>
            </Vertical>
        </div>
    );
}
