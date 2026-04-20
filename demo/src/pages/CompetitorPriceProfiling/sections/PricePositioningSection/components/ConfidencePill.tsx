import { BBDTag } from '@gravitate-js/excalibrr';
import { Confidence } from '../../../CompetitorPriceProfiling.types';

interface ConfidencePillProps {
  confidence: Confidence;
}

function ConfidencePill({ confidence }: ConfidencePillProps) {
  if (confidence === 'HIGH') {
    return <BBDTag success style={{ width: 'fit-content' }}>HIGH</BBDTag>;
  }
  if (confidence === 'MED') {
    return <BBDTag warning style={{ width: 'fit-content' }}>MED</BBDTag>;
  }
  return <BBDTag error style={{ width: 'fit-content' }}>LOW</BBDTag>;
}

export default ConfidencePill;
