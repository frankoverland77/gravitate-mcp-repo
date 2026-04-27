import { BBDTag, Texto } from '@gravitate-js/excalibrr';
import { Follower } from '../../CompetitorPriceProfiling.types';

interface LeaderChildProps {
  isLeader: boolean;
  followers: Follower[];
}

export function LeaderRoleCell({ isLeader, followers }: LeaderChildProps) {
  const role = isLeader ? 'Leader' : followers.length > 0 ? 'Follower' : 'Independent';
  const tag =
    role === 'Leader' ? (
      <BBDTag theme1 style={{ width: 'fit-content' }}>★ Leader</BBDTag>
    ) : role === 'Follower' ? (
      <BBDTag style={{ width: 'fit-content' }}>Follower</BBDTag>
    ) : (
      <BBDTag style={{ width: 'fit-content' }}>Independent</BBDTag>
    );

  return (
    <div style={{ display: 'flex', alignItems: 'center', height: '100%' }}>
      {tag}
    </div>
  );
}

export function LeaderImpactCell({ isLeader, followers }: LeaderChildProps) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', height: '100%' }}>
      <Texto>{isLeader ? followers.length : '—'}</Texto>
    </div>
  );
}

export function LeaderReachCell({ isLeader, followers }: LeaderChildProps) {
  const n = isLeader ? followers.length : 0;
  const tag = isLeader ? (
    n >= 4 ? (
      <BBDTag success style={{ width: 'fit-content' }}>Broad</BBDTag>
    ) : n >= 2 ? (
      <BBDTag warning style={{ width: 'fit-content' }}>Narrow</BBDTag>
    ) : (
      <BBDTag style={{ width: 'fit-content' }}>Solo</BBDTag>
    )
  ) : (
    <BBDTag style={{ width: 'fit-content' }}>N/A</BBDTag>
  );

  return (
    <div style={{ display: 'flex', alignItems: 'center', height: '100%' }}>
      {tag}
    </div>
  );
}
