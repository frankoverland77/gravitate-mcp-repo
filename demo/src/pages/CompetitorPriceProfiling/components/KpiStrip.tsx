import { ReactNode } from 'react';
import { BBDTag, Horizontal, Texto } from '@gravitate-js/excalibrr';
import { InfoCircleOutlined } from '@ant-design/icons';
import { CompetitorProfile, InsightKey } from '../CompetitorPriceProfiling.types';
import ConfidencePill from '../sections/PricePositioningSection/components/ConfidencePill';
import { HoverablePopover } from './HoverablePopover';
import {
  PopFollowers,
  PopLeader,
  PopPassThrough,
  PopRank,
  PopStrategy,
} from './popovers/popoverContent';

interface KpiTileProps {
  title: string;
  infoContent: ReactNode;
  popoverId: string;
  figure: ReactNode;
  sub: string;
  cellId: string;
  rowCell: InsightKey;
  confidence: CompetitorProfile['confidences'][keyof CompetitorProfile['confidences']];
  observations: number;
}

function KpiTile({
  title,
  infoContent,
  popoverId,
  figure,
  sub,
  cellId,
  rowCell,
  confidence,
  observations,
}: KpiTileProps) {
  return (
    <div
      style={{
        backgroundColor: '#ffffff',
        border: '1px solid #e8e8e8',
        borderRadius: 6,
        padding: 12,
        flex: 1,
        minWidth: 200,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div style={{ display: 'flex', gap: 6, justifyContent: 'space-between', alignItems: 'center' }}>
          <Texto category="p2" appearance="medium" weight="600">
            {title}
          </Texto>
          <HoverablePopover popoverId={popoverId} placement="bottom" content={infoContent}>
            <InfoCircleOutlined style={{ color: '#8c8c8c', fontSize: 12 }} />
          </HoverablePopover>
        </div>

        <div style={{ minHeight: 28, display: 'flex', alignItems: 'center' }}>{figure}</div>

        <Texto category="p2" appearance="medium">
          {sub}
        </Texto>

        <div style={{ marginTop: 'auto', paddingTop: 4 }}>
          <ConfidencePill
            confidence={confidence}
            cellId={cellId}
            rowCell={rowCell}
            observations={observations}
          />
        </div>
      </div>
    </div>
  );
}

interface KpiStripProps {
  profile: CompetitorProfile;
}

export function KpiStrip({ profile }: KpiStripProps) {
  const baseCellId = `${profile.competitor} · ${profile.location} · ${profile.product}`;
  const { followers, passThrough, rank, confidences, observations } = profile;
  const visibleFollowers = followers.slice(0, 3);
  const overflow = followers.length - visibleFollowers.length;
  const passGap = Math.abs(passThrough.up - passThrough.down);
  const isAsym = passGap >= 10;
  const rankDelta = rank.avg30 - rank.avg90;

  const followersFigure = (
    <Horizontal gap={4} style={{ flexWrap: 'wrap', alignItems: 'center' }}>
      {visibleFollowers.map((f) => (
        <BBDTag key={f.name} style={{ width: 'fit-content' }}>
          {f.name}
        </BBDTag>
      ))}
      {overflow > 0 && (
        <Texto category="p2" style={{ color: '#595959', textDecoration: 'underline', cursor: 'pointer' }}>
          +{overflow} more
        </Texto>
      )}
    </Horizontal>
  );

  const leaderFigure = profile.isLeader ? (
    <BBDTag theme1 style={{ width: 'fit-content' }}>
      ★ LEADER
    </BBDTag>
  ) : (
    <Texto appearance="medium">—</Texto>
  );

  const positioningFigure = (
    <BBDTag theme1 style={{ width: 'fit-content' }}>
      {profile.classification}
    </BBDTag>
  );

  const passThroughFigure = (
    <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
      <span style={{ color: '#389e0d', fontSize: 14, fontWeight: 600 }}>
        <span style={{ fontSize: 10 }}>▲</span> {passThrough.up}%
      </span>
      <span style={{ color: '#8c8c8c' }}>·</span>
      <span style={{ color: '#cf1322', fontSize: 14, fontWeight: 600 }}>
        <span style={{ fontSize: 10 }}>▼</span> {passThrough.down}%
      </span>
      {isAsym && (
        <BBDTag warning style={{ width: 'fit-content' }}>
          ASYM
        </BBDTag>
      )}
    </div>
  );

  let rankDeltaPill;
  if (rankDelta > 0) {
    rankDeltaPill = (
      <BBDTag error style={{ width: 'fit-content' }}>
        ▼ +{rankDelta}
      </BBDTag>
    );
  } else if (rankDelta < 0) {
    rankDeltaPill = (
      <BBDTag success style={{ width: 'fit-content' }}>
        ▲ {rankDelta}
      </BBDTag>
    );
  } else {
    rankDeltaPill = <BBDTag style={{ width: 'fit-content' }}>• 0</BBDTag>;
  }

  const rankFigure = (
    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
      <span style={{ fontSize: 14, fontWeight: 600 }}>
        {rank.avg90} → 30d {rank.avg30}
      </span>
      {rankDeltaPill}
    </div>
  );

  return (
    <Horizontal gap={12} style={{ alignItems: 'stretch', flexWrap: 'wrap' }}>
      <KpiTile
        title="Followers"
        infoContent={<PopFollowers />}
        popoverId="kpi-info-followers"
        figure={followersFigure}
        sub={`${followers.length} competitors respond within 1–3 prices published.`}
        cellId={`${baseCellId} · Followers`}
        rowCell="followers"
        confidence={confidences.followers}
        observations={observations}
      />
      <KpiTile
        title="Leader status"
        infoContent={<PopLeader />}
        popoverId="kpi-info-leader"
        figure={leaderFigure}
        sub="No competitor reliably moves before Motiva."
        cellId={`${baseCellId} · Leader`}
        rowCell="leader"
        confidence={confidences.leader}
        observations={observations}
      />
      <KpiTile
        title="Price Positioning"
        infoContent={<PopStrategy />}
        popoverId="kpi-info-positioning"
        figure={positioningFigure}
        sub="+$0.0140/gal above market avg · 72% of prices published."
        cellId={`${baseCellId} · Price Positioning`}
        rowCell="price-positioning"
        confidence={confidences.pricePositioning}
        observations={observations}
      />
      <KpiTile
        title="Spot Pass-through"
        infoContent={<PopPassThrough />}
        popoverId="kpi-info-passthrough"
        figure={passThroughFigure}
        sub={`Faster to raise than lower (${passGap}-pt gap).`}
        cellId={`${baseCellId} · Spot Pass-through`}
        rowCell="pass-through"
        confidence={confidences.passThrough}
        observations={observations}
      />
      <KpiTile
        title="Avg Rank & Trend"
        infoContent={<PopRank />}
        popoverId="kpi-info-rank"
        figure={rankFigure}
        sub="2nd most expensive across 7 refiners. Drifting up 1 rank vs. 30d."
        cellId={`${baseCellId} · Rank`}
        rowCell="rank"
        confidence={confidences.rank}
        observations={observations}
      />
    </Horizontal>
  );
}
