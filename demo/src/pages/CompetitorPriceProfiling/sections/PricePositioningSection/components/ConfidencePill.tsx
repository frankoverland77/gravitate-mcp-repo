import { BBDTag } from '@gravitate-js/excalibrr';
import { Confidence, InsightKey } from '../../../CompetitorPriceProfiling.types';
import { HoverablePopover } from '../../../components/HoverablePopover';
import { ConfidencePopoverContent } from '../../../components/popovers/ConfidencePopoverContent';

interface ConfidencePillProps {
  confidence: Confidence;
  cellId?: string;
  rowCell?: InsightKey;
  observations?: number;
  // When true, HIGH renders as a neutral tag instead of null. Used in columns
  // where a tag slot must always be occupied (pass-through, 30-day rank) so
  // the absence of a pill doesn't read as missing data.
  alwaysShow?: boolean;
}

function ConfidencePill({
  confidence,
  cellId,
  rowCell,
  observations = 18,
  alwaysShow = false,
}: ConfidencePillProps) {
  const common = {
    style: { width: 'fit-content' as const },
    'data-conf': confidence.toLowerCase(),
    'data-cell': cellId,
    'data-row-cell': rowCell,
  };

  if (confidence === 'HIGH' && !alwaysShow) {
    return null;
  }

  const pill =
    confidence === 'HIGH' ? (
      <BBDTag {...common}>HIGH</BBDTag>
    ) : confidence === 'MED' ? (
      <BBDTag warning {...common}>
        MED
      </BBDTag>
    ) : (
      <BBDTag error {...common}>
        LOW
      </BBDTag>
    );

  if (!cellId || !rowCell) {
    return pill;
  }

  return (
    <HoverablePopover
      popoverId={`pop-conf-${cellId}-${rowCell}`}
      placement="left"
      content={
        <ConfidencePopoverContent
          cellIdentity={`${cellId} · ${rowCell}`}
          confidence={confidence}
          insight={rowCell}
          observations={observations}
        />
      }
    >
      {pill}
    </HoverablePopover>
  );
}

export default ConfidencePill;
