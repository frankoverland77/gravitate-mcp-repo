import { Texto } from '@gravitate-js/excalibrr';
import { Follower } from '../../CompetitorPriceProfiling.types';
import { HoverablePopover } from '../HoverablePopover';
import { PopFollowersFull } from '../popovers/popoverContent';

interface FollowersChildProps {
  competitor: string;
  followers: Follower[];
  cellId: string;
}

export function FollowersCountCell({ followers }: FollowersChildProps) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', height: '100%' }}>
      <Texto>{followers.length}</Texto>
    </div>
  );
}

export function FollowersTopCell({ competitor, followers, cellId }: FollowersChildProps) {
  const sorted = [...followers].sort((a, b) => a.pValue - b.pValue);
  const top = sorted[0];
  const extra = followers.length - 1;

  if (!top) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', height: '100%' }}>
        <Texto appearance="medium">—</Texto>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6, height: '100%' }}>
      <Texto weight="600">{top.name}</Texto>
      {extra > 0 && (
        <HoverablePopover
          popoverId={`pop-followers-top-${cellId}`}
          content={<PopFollowersFull competitor={competitor} followers={sorted} />}
        >
          <span style={{ color: '#595959', cursor: 'pointer', textDecoration: 'underline', fontSize: 12 }}>
            +{extra} more
          </span>
        </HoverablePopover>
      )}
    </div>
  );
}
