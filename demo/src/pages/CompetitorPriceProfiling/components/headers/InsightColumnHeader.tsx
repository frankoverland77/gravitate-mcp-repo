import { ReactElement } from 'react';
import { Horizontal, Texto } from '@gravitate-js/excalibrr';
import { QuestionCircleOutlined } from '@ant-design/icons';
import type { IHeaderParams } from 'ag-grid-community';
import { PopoverId } from '../../CompetitorPriceProfiling.types';
import { HoverablePopover } from '../HoverablePopover';
import {
  PopFollowers,
  PopLeader,
  PopStrategy,
  PopPassThrough,
  PopRank,
} from '../popovers/popoverContent';

type Props = { label?: string; popoverId?: PopoverId } & Partial<IHeaderParams>;

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

export function InsightColumnHeader(props: Props) {
  const label = props.label ?? props.displayName ?? '';
  const popoverId =
    props.popoverId ?? ((props as { popoverId?: PopoverId }).popoverId as PopoverId | undefined);

  return (
    <Horizontal gap={6} alignItems="center">
      <Texto category="p2" weight="600">
        {label.toUpperCase()}
      </Texto>
      {popoverId && (
        <HoverablePopover
          popoverId={popoverId}
          content={<ContentForId id={popoverId} />}
        >
          <QuestionCircleOutlined
            style={{ color: '#8c8c8c', cursor: 'help', fontSize: 14 }}
          />
        </HoverablePopover>
      )}
    </Horizontal>
  );
}

export default InsightColumnHeader;
