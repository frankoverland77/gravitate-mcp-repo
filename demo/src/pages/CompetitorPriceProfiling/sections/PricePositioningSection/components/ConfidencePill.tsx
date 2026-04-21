import { BBDTag } from '@gravitate-js/excalibrr';
import { Confidence, InsightKey } from '../../../CompetitorPriceProfiling.types';
import { HoverablePopover } from '../../../components/HoverablePopover';
import { ConfidencePopoverContent } from '../../../components/popovers/ConfidencePopoverContent';

interface ConfidencePillProps {
  confidence: Confidence;
  cellId?: string;
  rowCell?: InsightKey;
  observations?: number;
}

function ConfidencePill({
  confidence,
  cellId,
  rowCell,
  observations = 18,
}: ConfidencePillProps) {
  const common = {
    style: { width: 'fit-content' as const },
    'data-conf': confidence.toLowerCase(),
    'data-cell': cellId,
    'data-row-cell': rowCell,
  };

  let pill;
  if (confidence === 'HIGH') {
    pill = (
      <BBDTag success {...common}>
        HIGH
      </BBDTag>
    );
  } else if (confidence === 'MED') {
    pill = (
      <BBDTag warning {...common}>
        MED
      </BBDTag>
    );
  } else {
    pill = (
      <BBDTag error {...common}>
        LOW
      </BBDTag>
    );
  }

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
