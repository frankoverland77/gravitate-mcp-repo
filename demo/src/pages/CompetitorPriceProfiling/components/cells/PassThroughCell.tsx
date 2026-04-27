import { BBDTag } from '@gravitate-js/excalibrr';
import { HoverablePopover } from '../HoverablePopover';
import { PopPassThroughCell } from '../popovers/popoverContent';

interface PassThroughChildProps {
  competitor: string;
  passThrough: { up: number; down: number };
  cellId: string;
}

const ASYM_THRESHOLD = 10;

function Figure({ value, direction }: { value: number; direction: 'up' | 'down' }) {
  const color = direction === 'up' ? '#52c41a' : '#f5222d';
  const glyph = direction === 'up' ? '▲' : '▼';
  return (
    <span style={{ color }}>
      <span style={{ fontSize: 10 }}>{glyph}</span> {value}%
    </span>
  );
}

export function PassThroughUpCell({ competitor, passThrough, cellId }: PassThroughChildProps) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', height: '100%' }}>
      <HoverablePopover
        popoverId={`pop-passthrough-cell-up-${cellId}`}
        content={<PopPassThroughCell competitor={competitor} up={passThrough.up} down={passThrough.down} />}
      >
        <Figure value={passThrough.up} direction="up" />
      </HoverablePopover>
    </div>
  );
}

export function PassThroughDownCell({ competitor, passThrough, cellId }: PassThroughChildProps) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', height: '100%' }}>
      <HoverablePopover
        popoverId={`pop-passthrough-cell-down-${cellId}`}
        content={<PopPassThroughCell competitor={competitor} up={passThrough.up} down={passThrough.down} />}
      >
        <Figure value={passThrough.down} direction="down" />
      </HoverablePopover>
    </div>
  );
}

export function PassThroughSymmetryCell({ passThrough }: PassThroughChildProps) {
  const asym = Math.abs(passThrough.up - passThrough.down) >= ASYM_THRESHOLD;
  const tag = asym ? (
    <BBDTag warning style={{ width: 'fit-content' }}>Asym</BBDTag>
  ) : (
    <BBDTag style={{ width: 'fit-content' }}>Sym</BBDTag>
  );
  return (
    <div style={{ display: 'flex', alignItems: 'center', height: '100%' }}>
      {tag}
    </div>
  );
}
