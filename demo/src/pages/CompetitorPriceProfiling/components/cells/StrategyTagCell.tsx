import { BBDTag, Texto } from '@gravitate-js/excalibrr';
import { Classification, Confidence } from '../../CompetitorPriceProfiling.types';
import { HoverablePopover } from '../HoverablePopover';
import { PricePositioningCellPopover } from '../popovers/PricePositioningCellPopover';

interface StrategyCellProps {
  classification: Classification;
  cellId: string;
  confidence: Confidence;
  competitor: string;
}

function hashToUnit(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i += 1) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return ((h >>> 0) % 1000) / 1000;
}

export function deriveSpread(classification: Classification, seed: string): number {
  const r = hashToUnit(seed);
  switch (classification) {
    case 'Premium':
      return 0.012 + r * 0.01;
    case 'Discount':
      return -(0.012 + r * 0.01);
    case 'Conformist':
      return -0.003 + r * 0.006;
    case 'Independent':
      return -0.005 + r * 0.01;
  }
}

export function PricePositioningTagCell({ classification, cellId, competitor }: StrategyCellProps) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', height: '100%' }}>
      <HoverablePopover
        popoverId={`pop-pp-why-${cellId}`}
        placement="right"
        content={
          <PricePositioningCellPopover
            competitor={competitor}
            classification={classification}
            seed={cellId}
          />
        }
      >
        <BBDTag style={{ width: 'fit-content', cursor: 'help' }}>
          {classification}
        </BBDTag>
      </HoverablePopover>
    </div>
  );
}

export function PricePositioningSpreadCell({ classification, cellId }: StrategyCellProps) {
  const spread = deriveSpread(classification, cellId);
  const sign = spread > 0 ? '+' : spread < 0 ? '−' : '±';
  const value = `${sign}$${Math.abs(spread).toFixed(4)}`;

  return (
    <div style={{ display: 'flex', alignItems: 'center', height: '100%' }}>
      <Texto weight="600">{value}</Texto>
    </div>
  );
}

export function PricePositioningDirectionCell({ classification, cellId }: StrategyCellProps) {
  const spread = deriveSpread(classification, cellId);
  const tag = (() => {
    if (classification === 'Conformist') {
      return <BBDTag style={{ width: 'fit-content' }}>Near market</BBDTag>;
    }
    if (classification === 'Independent') {
      return <BBDTag warning style={{ width: 'fit-content' }}>Variable</BBDTag>;
    }
    if (spread > 0) {
      return <BBDTag style={{ width: 'fit-content' }}>Above market</BBDTag>;
    }
    return <BBDTag style={{ width: 'fit-content' }}>Below market</BBDTag>;
  })();

  return (
    <div style={{ display: 'flex', alignItems: 'center', height: '100%' }}>
      {tag}
    </div>
  );
}
