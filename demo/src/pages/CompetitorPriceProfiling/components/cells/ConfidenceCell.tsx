import { Confidence, InsightKey } from '../../CompetitorPriceProfiling.types';
import ConfidencePill from '../../sections/PricePositioningSection/components/ConfidencePill';

interface ConfidenceCellProps {
  confidence: Confidence;
  cellId: string;
  rowCell: InsightKey;
}

export function ConfidenceCell({ confidence, cellId, rowCell }: ConfidenceCellProps) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', height: '100%' }}>
      <ConfidencePill alwaysShow confidence={confidence} cellId={cellId} rowCell={rowCell} />
    </div>
  );
}
