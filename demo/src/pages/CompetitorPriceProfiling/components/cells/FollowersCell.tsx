import { BBDTag, Texto } from '@gravitate-js/excalibrr';
import { Confidence, Follower } from '../../CompetitorPriceProfiling.types';
import ConfidencePill from '../../sections/PricePositioningSection/components/ConfidencePill';
import { HoverablePopover } from '../HoverablePopover';
import { PopFollowersFull } from '../popovers/popoverContent';

interface FollowersCellProps {
  competitor: string;
  followers: Follower[];
  cellId: string;
  confidence: Confidence;
}

export function FollowersCell({ competitor, followers, cellId, confidence }: FollowersCellProps) {
  const visible = followers.slice(0, 3);
  const overflow = followers.length - visible.length;

  return (
    <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
      {followers.length === 0 ? (
        <Texto appearance="medium">—</Texto>
      ) : (
        <div style={{ display: 'flex', gap: 4, alignItems: 'center', flexWrap: 'wrap' }}>
          {visible.map((f) => (
            <BBDTag key={f.name} style={{ width: 'fit-content' }}>
              {f.name}
            </BBDTag>
          ))}
          {overflow > 0 && (
            <HoverablePopover
              popoverId="pop-followers-full"
              content={<PopFollowersFull competitor={competitor} followers={followers} />}
            >
              <Texto category="p2" style={{ color: '#1890ff', cursor: 'pointer' }}>
                +{overflow} more
              </Texto>
            </HoverablePopover>
          )}
        </div>
      )}
      <ConfidencePill confidence={confidence} cellId={cellId} rowCell="followers" />
    </div>
  );
}
