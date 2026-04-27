import { Texto } from '@gravitate-js/excalibrr';

interface UpDownSummaryBlocksProps {
  up: number;
  down: number;
}

// Styling values match MetricTile.tsx exactly — do not invent new tokens.
const blockStyle: React.CSSProperties = {
  backgroundColor: '#ffffff',
  border: '1px solid #e8e8e8',
  borderRadius: 8,
  padding: 16,
  flex: 1,
};

export function UpDownSummaryBlocks({ up, down }: UpDownSummaryBlocksProps) {
  // Plain flex div (not Horizontal) — Phase 1 gotcha.
  return (
    <div style={{ display: 'flex', gap: 16 }}>
      <div style={blockStyle}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <Texto category="h2" weight="700" style={{ color: '#52c41a' }}>
            ▲ {up}%
          </Texto>
          <Texto category="p2" appearance="medium">
            Up-day responsiveness
          </Texto>
        </div>
      </div>
      <div style={blockStyle}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <Texto category="h2" weight="700" style={{ color: '#f5222d' }}>
            ▼ {down}%
          </Texto>
          <Texto category="p2" appearance="medium">
            Down-day responsiveness
          </Texto>
        </div>
      </div>
    </div>
  );
}
