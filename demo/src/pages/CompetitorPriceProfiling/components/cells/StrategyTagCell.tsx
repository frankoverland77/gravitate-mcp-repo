import { BBDTag } from '@gravitate-js/excalibrr';
import { Classification, Confidence } from '../../CompetitorPriceProfiling.types';
import ConfidencePill from '../../sections/PricePositioningSection/components/ConfidencePill';

interface StrategyTagCellProps {
  classification: Classification;
  cellId: string;
  confidence: Confidence;
}

function renderTag(classification: Classification) {
  const common = { style: { width: 'fit-content' as const } };
  switch (classification) {
    case 'Premium':
      return (
        <BBDTag theme1 {...common}>
          Premium
        </BBDTag>
      );
    case 'Discount':
      return (
        <BBDTag theme2 {...common}>
          Discount
        </BBDTag>
      );
    case 'Independent':
      return (
        <BBDTag warning {...common}>
          Independent
        </BBDTag>
      );
    case 'Conformist':
    default:
      return <BBDTag {...common}>Conformist</BBDTag>;
  }
}

export function StrategyTagCell({ classification, cellId, confidence }: StrategyTagCellProps) {
  return (
    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
      {renderTag(classification)}
      <ConfidencePill confidence={confidence} cellId={cellId} rowCell="price-positioning" />
    </div>
  );
}
