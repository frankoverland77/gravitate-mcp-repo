import { ReactElement } from 'react';
import { QuestionCircleOutlined, ThunderboltFilled } from '@ant-design/icons';
import { PopoverId } from '../../CompetitorPriceProfiling.types';
import { HoverablePopover } from '../HoverablePopover';
import {
  PopFollowers,
  PopLeader,
  PopStrategy,
  PopPassThrough,
  PopRank,
} from '../popovers/popoverContent';

const AI_COLOR = '#722ed1';

type Props = {
  label?: string;
  popoverId?: PopoverId;
  displayName?: string;
};

const ContentForId = ({ id }: { id: PopoverId }): ReactElement | null => {
  switch (id) {
    case 'pop-followers':
      return <PopFollowers />;
    case 'pop-leader':
      return <PopLeader />;
    case 'pop-strategy':
      return <PopStrategy />;
    case 'pop-passthrough':
      return <PopPassThrough />;
    case 'pop-rank':
      return <PopRank />;
    default:
      return null;
  }
};

export function InsightGroupHeader(props: Props) {
  const label = props.label ?? props.displayName ?? '';
  const { popoverId } = props;

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '0 8px' }}>
      <ThunderboltFilled style={{ color: AI_COLOR, fontSize: 12 }} />
      <span
        style={{
          color: AI_COLOR,
          fontSize: 12,
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '0.04em',
          lineHeight: 1,
        }}
      >
        {label}
      </span>
      {popoverId && (
        <HoverablePopover popoverId={popoverId} content={<ContentForId id={popoverId} />}>
          <QuestionCircleOutlined style={{ color: '#8c8c8c', cursor: 'help', fontSize: 11 }} />
        </HoverablePopover>
      )}
    </div>
  );
}

export default InsightGroupHeader;
