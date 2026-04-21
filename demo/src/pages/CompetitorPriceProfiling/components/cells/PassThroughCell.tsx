import { BBDTag, Texto } from '@gravitate-js/excalibrr';
import { Confidence } from '../../CompetitorPriceProfiling.types';
import ConfidencePill from '../../sections/PricePositioningSection/components/ConfidencePill';
import { HoverablePopover } from '../HoverablePopover';
import { PopPassThroughCell } from '../popovers/popoverContent';

interface PassThroughCellProps {
  competitor: string;
  passThrough: { up: number; down: number };
  cellId: string;
  confidence: Confidence;
}

export function PassThroughCell({
  competitor,
  passThrough,
  cellId,
  confidence,
}: PassThroughCellProps) {
  const { up, down } = passThrough;
  const isAsymmetric = Math.abs(up - down) >= 10;

  const figures = (
    <HoverablePopover
      popoverId="pop-passthrough-cell"
      content={<PopPassThroughCell competitor={competitor} up={up} down={down} />}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Texto category="p2" weight="600" style={{ color: '#52c41a' }}>
          ▲ {up}%
        </Texto>
        <Texto category="p2" weight="600" style={{ color: '#f5222d' }}>
          ▼ {down}%
        </Texto>
      </div>
    </HoverablePopover>
  );

  return (
    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
      {figures}
      {isAsymmetric && (
        <BBDTag warning style={{ width: 'fit-content' }}>
          ASYM
        </BBDTag>
      )}
      <ConfidencePill confidence={confidence} cellId={cellId} rowCell="pass-through" />
    </div>
  );
}
