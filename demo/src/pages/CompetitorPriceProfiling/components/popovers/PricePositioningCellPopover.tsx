import { Texto, Vertical, BBDTag, Horizontal } from '@gravitate-js/excalibrr';
import { useNavigate } from 'react-router-dom';
import { Classification } from '../../CompetitorPriceProfiling.types';

const PP_MANAGER_PATH = '/CompetitorPriceProfiling/CompetitorPriceProfilingTagManager';

interface PricePositioningCellPopoverProps {
  competitor: string;
  classification: Classification;
  // Deterministic seed so numbers stay stable per row across re-renders.
  seed: string;
}

// Hash a string to a 0..1 float so we can vary the synthetic numbers per row
// without a proper data source. Swapped for real fields once Phase 7 lands.
function hashToUnit(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i += 1) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return ((h >>> 0) % 1000) / 1000;
}

interface DerivedDetail {
  baseline: string;
  magnitudeDollars: number;
  frequencyPct: number;
  frequencyThresholdPct: number;
  direction: 'above' | 'below' | 'within' | 'varied';
  presetName: string;
}

function derive(classification: Classification, seed: string): DerivedDetail {
  const r = hashToUnit(seed);
  switch (classification) {
    case 'Premium':
      return {
        baseline: 'market average',
        magnitudeDollars: 0.01,
        frequencyPct: 62 + Math.round(r * 20), // 62–82%
        frequencyThresholdPct: 60,
        direction: 'above',
        presetName: 'Standard',
      };
    case 'Discount':
      return {
        baseline: 'market average',
        magnitudeDollars: 0.01,
        frequencyPct: 62 + Math.round(r * 18),
        frequencyThresholdPct: 60,
        direction: 'below',
        presetName: 'Standard',
      };
    case 'Conformist':
      return {
        baseline: 'market average',
        magnitudeDollars: 0.005,
        frequencyPct: 72 + Math.round(r * 18),
        frequencyThresholdPct: 70,
        direction: 'within',
        presetName: 'Standard',
      };
    case 'Independent':
      return {
        baseline: 'market average',
        magnitudeDollars: 0.01,
        frequencyPct: 35 + Math.round(r * 15),
        frequencyThresholdPct: 60,
        direction: 'varied',
        presetName: 'Standard',
      };
  }
}

export function PricePositioningCellPopover({
  competitor,
  classification,
  seed,
}: PricePositioningCellPopoverProps) {
  const navigate = useNavigate();
  const d = derive(classification, seed);
  const magnitude = `$${d.magnitudeDollars.toFixed(4)}`;

  let reasoning: string;
  if (d.direction === 'above') {
    reasoning = `${competitor} priced more than +${magnitude}/gal above ${d.baseline} on ${d.frequencyPct}% of prices published over the last 90 days.`;
  } else if (d.direction === 'below') {
    reasoning = `${competitor} priced more than −${magnitude}/gal below ${d.baseline} on ${d.frequencyPct}% of prices published over the last 90 days.`;
  } else if (d.direction === 'within') {
    reasoning = `${competitor} priced within ±${magnitude}/gal of ${d.baseline} on ${d.frequencyPct}% of prices published over the last 90 days.`;
  } else {
    reasoning = `${competitor} showed high price variance with no persistent side of ${d.baseline} over the 90-day window.`;
  }

  return (
    <div style={{ maxWidth: 340, padding: 12 }}>
      <Vertical gap={10}>
        <Horizontal gap={8} alignItems="center">
          <Texto category="p1" weight="700">{classification}</Texto>
          <span
            role="button"
            onClick={() => navigate(PP_MANAGER_PATH)}
            style={{ cursor: 'pointer' }}
          >
            <BBDTag style={{ width: 'fit-content', textDecoration: 'underline' }}>
              Preset: {d.presetName}
            </BBDTag>
          </span>
        </Horizontal>

        <Texto category="p2">{reasoning}</Texto>

        <div
          style={{
            borderTop: '1px solid #e8e8e8',
            paddingTop: 10,
            display: 'flex',
            flexDirection: 'column',
            gap: 4,
          }}
        >
          <Texto category="p2" appearance="medium">
            <b>Threshold:</b> {d.frequencyThresholdPct}% of prices published
          </Texto>
          <Texto category="p2" appearance="medium">
            <b>Baseline:</b> {d.baseline}
          </Texto>
        </div>

        <span
          role="button"
          onClick={() => navigate(PP_MANAGER_PATH)}
          style={{ cursor: 'pointer', color: '#0c5a58', textDecoration: 'underline', fontSize: 12 }}
        >
          → Manage presets in PP Manager
        </span>
      </Vertical>
    </div>
  );
}
