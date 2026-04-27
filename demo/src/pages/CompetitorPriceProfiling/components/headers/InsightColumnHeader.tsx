import { ReactElement, useEffect, useRef, useState } from 'react';
import { MenuOutlined, QuestionCircleOutlined, ThunderboltFilled } from '@ant-design/icons';
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

const AI_COLOR = '#722ed1';

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
  const menuRef = useRef<HTMLSpanElement | null>(null);
  const [sortState, setSortState] = useState<'asc' | 'desc' | null>(
    () => (props.column?.getSort() as 'asc' | 'desc' | null) ?? null,
  );

  useEffect(() => {
    if (!props.column) return;
    const onSortChanged = () => {
      setSortState((props.column?.getSort() as 'asc' | 'desc' | null) ?? null);
    };
    props.column.addEventListener('sortChanged', onSortChanged);
    return () => {
      props.column?.removeEventListener('sortChanged', onSortChanged);
    };
  }, [props.column]);

  const handleLabelClick = (e: React.MouseEvent) => {
    if (props.progressSort) {
      props.progressSort(e.shiftKey);
    }
  };

  const handleMenuClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (props.showColumnMenu && menuRef.current) {
      props.showColumnMenu(menuRef.current);
    }
  };

  const sortGlyph = sortState === 'asc' ? ' ↑' : sortState === 'desc' ? ' ↓' : '';

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        width: '100%',
        height: '100%',
      }}
    >
      <ThunderboltFilled style={{ color: AI_COLOR, fontSize: 11, flexShrink: 0 }} />
      <span
        onClick={handleLabelClick}
        style={{
          color: AI_COLOR,
          fontSize: 11,
          fontWeight: 700,
          textTransform: 'uppercase',
          lineHeight: 1,
          cursor: props.progressSort ? 'pointer' : 'default',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        }}
      >
        {label}
        {sortGlyph}
      </span>
      {popoverId && (
        <HoverablePopover popoverId={popoverId} content={<ContentForId id={popoverId} />}>
          <QuestionCircleOutlined style={{ color: '#8c8c8c', cursor: 'help', fontSize: 11, flexShrink: 0 }} />
        </HoverablePopover>
      )}
      <span style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center' }}>
        <span
          ref={menuRef}
          role="button"
          aria-label="Column menu"
          onClick={handleMenuClick}
          style={{
            color: '#595959',
            cursor: 'pointer',
            fontSize: 12,
            padding: '4px 6px',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 4,
          }}
        >
          <MenuOutlined />
        </span>
      </span>
    </div>
  );
}

export default InsightColumnHeader;
