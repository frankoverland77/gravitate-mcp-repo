import { Confidence, InsightKey } from '../../CompetitorPriceProfiling.types';
import { PopConfGeneric, PopConfLow } from './popoverContent';

interface ConfidencePopoverContentProps {
  cellIdentity: string;
  confidence: Confidence;
  insight: InsightKey;
  observations: number;
}

export function ConfidencePopoverContent({
  cellIdentity,
  confidence,
  insight,
  observations,
}: ConfidencePopoverContentProps) {
  if (confidence === 'LOW') {
    return (
      <PopConfLow
        cellIdentity={cellIdentity}
        insight={insight}
        observations={observations}
      />
    );
  }
  return (
    <PopConfGeneric
      cellIdentity={cellIdentity}
      confidence={confidence}
      insight={insight}
    />
  );
}

export default ConfidencePopoverContent;
