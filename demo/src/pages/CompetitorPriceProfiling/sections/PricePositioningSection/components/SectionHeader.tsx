import { Vertical, Texto } from '@gravitate-js/excalibrr';
import { Tooltip } from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';
import { Confidence } from '../../../CompetitorPriceProfiling.types';
import ConfidencePill from './ConfidencePill';

interface SectionHeaderProps {
  title: string;
  description: string;
  confidence: Confidence;
  cellId: string;
  infoTooltip?: string;
}

function SectionHeader({ title, description, confidence, cellId, infoTooltip }: SectionHeaderProps) {
  return (
    <div
      data-cell-id={cellId}
      style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', width: '100%' }}
    >
      <Vertical gap={4}>
        <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
          <Texto category="h4" weight="600">{title}</Texto>
          <Tooltip title={infoTooltip ?? ''}>
            <QuestionCircleOutlined style={{ color: '#8c8c8c', cursor: 'help', fontSize: 14 }} />
          </Tooltip>
        </div>
        <Texto category="p2" appearance="medium">{description}</Texto>
      </Vertical>
      <ConfidencePill confidence={confidence} />
    </div>
  );
}

export default SectionHeader;
