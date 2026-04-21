import { BBDTag, Texto } from '@gravitate-js/excalibrr';
import { Confidence } from '../../CompetitorPriceProfiling.types';
import ConfidencePill from '../../sections/PricePositioningSection/components/ConfidencePill';

interface LeaderCellProps {
  isLeader: boolean;
  cellId: string;
  confidence: Confidence;
}

export function LeaderCell({ isLeader, cellId, confidence }: LeaderCellProps) {
  return (
    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
      {isLeader ? (
        <BBDTag theme1 style={{ width: 'fit-content' }}>
          ★ LEADER
        </BBDTag>
      ) : (
        <Texto appearance="medium">—</Texto>
      )}
      <ConfidencePill confidence={confidence} cellId={cellId} rowCell="leader" />
    </div>
  );
}
