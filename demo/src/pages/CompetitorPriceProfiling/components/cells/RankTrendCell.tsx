import { BBDTag, Texto } from '@gravitate-js/excalibrr';

interface RankChildProps {
  rank: { avg90: number; avg30: number };
}

export function Rank90Cell({ rank }: RankChildProps) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', height: '100%' }}>
      <Texto>{rank.avg90}</Texto>
    </div>
  );
}

export function Rank30Cell({ rank }: RankChildProps) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', height: '100%' }}>
      <Texto>{rank.avg30}</Texto>
    </div>
  );
}

export function RankTrendCell({ rank }: RankChildProps) {
  const delta = rank.avg30 - rank.avg90;
  const common = { style: { width: 'fit-content' as const } };

  const tag =
    delta > 0 ? (
      <BBDTag error {...common}>▼ +{delta}</BBDTag>
    ) : delta < 0 ? (
      <BBDTag success {...common}>▲ {delta}</BBDTag>
    ) : (
      <BBDTag {...common}>— flat</BBDTag>
    );

  return (
    <div style={{ display: 'flex', alignItems: 'center', height: '100%' }}>
      {tag}
    </div>
  );
}
