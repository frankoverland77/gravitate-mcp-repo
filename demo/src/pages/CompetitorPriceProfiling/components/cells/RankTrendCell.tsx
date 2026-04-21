import { BBDTag, Texto } from '@gravitate-js/excalibrr';
import { Confidence } from '../../CompetitorPriceProfiling.types';
import ConfidencePill from '../../sections/PricePositioningSection/components/ConfidencePill';

interface RankTrendCellProps {
  rank: { avg90: number; avg30: number };
  cellId: string;
  confidence: Confidence;
}

export function RankTrendCell({ rank, cellId, confidence }: RankTrendCellProps) {
  const { avg90, avg30 } = rank;
  const delta = avg30 - avg90;

  const common = { style: { width: 'fit-content' as const } };
  let pill;
  if (delta > 0) {
    pill = (
      <BBDTag error {...common}>
        ▼ +{delta}
      </BBDTag>
    );
  } else if (delta < 0) {
    pill = (
      <BBDTag success {...common}>
        ▲ {delta}
      </BBDTag>
    );
  } else {
    pill = <BBDTag {...common}>• 0</BBDTag>;
  }

  return (
    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
      <Texto category="p2">
        {avg90} → 30d {avg30}
      </Texto>
      {pill}
      <ConfidencePill confidence={confidence} cellId={cellId} rowCell="rank" />
    </div>
  );
}
