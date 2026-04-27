import { Texto } from '@gravitate-js/excalibrr';
import { Collapse } from 'antd';
import type { StatFitRow } from '../../../CompetitorPriceProfiling.types';

const { Panel } = Collapse;

interface StatFitGridProps {
    rows: StatFitRow[];
}

// Methodology — collapsible to match the LearnMoreDisclosure pattern.
// Collapsed by default so the primary data (chart + metrics) reads first;
// click to reveal fit / methodology details.
export function StatFitGrid({ rows }: StatFitGridProps) {
    return (
        <Collapse ghost defaultActiveKey={[]}>
            <Panel
                key="fit-methodology"
                header={
                    <Texto category="p2" weight="700" style={{ color: '#1f2937' }}>
                        Fit &amp; methodology
                    </Texto>
                }
            >
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
                    {rows.map((row, i) => (
                        <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                            <Texto category="p2" appearance="medium">{row.label}</Texto>
                            <Texto category="p2" weight="600">{row.value}</Texto>
                            <Texto category="p2" appearance="medium">{row.sub}</Texto>
                        </div>
                    ))}
                </div>
            </Panel>
        </Collapse>
    );
}
