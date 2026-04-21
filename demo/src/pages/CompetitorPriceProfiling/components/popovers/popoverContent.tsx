import { ReactNode } from 'react';
import { Texto, Vertical } from '@gravitate-js/excalibrr';
import { InsightKey } from '../../CompetitorPriceProfiling.types';

const METHOD_NOTE = 'Backend-driven copy. Not LLM-generated in production.';

const PopoverShell = ({ title, children }: { title: string; children: ReactNode }) => (
  <Vertical gap={8} style={{ padding: 4, maxWidth: 340 }}>
    <Texto category="p1" weight="600">
      {title}
    </Texto>
    {children}
    <Texto category="p2" appearance="medium" style={{ fontStyle: 'italic' }}>
      {METHOD_NOTE}
    </Texto>
  </Vertical>
);

export const PopFollowers = () => (
  <PopoverShell title="Followers to Target">
    <Texto category="p2">
      Competitors whose price reliably moves in response to this competitor's price move.
      Identified via Granger causality regression over a rolling window.
    </Texto>
    <Texto category="p2">Threshold: p &lt; 0.05 with a detected lag of 1–3 prices published.</Texto>
  </PopoverShell>
);

export const PopLeader = () => (
  <PopoverShell title="Leader">
    <Texto category="p2">
      A competitor is flagged Leader at this terminal-product when their price moves reliably
      precede moves by other tracked competitors. Same Granger-causality engine as Followers,
      with the direction reversed.
    </Texto>
  </PopoverShell>
);

export const PopStrategy = () => (
  <PopoverShell title="Price Positioning">
    <Vertical gap={6}>
      <Texto category="p2">
        <b>Premium</b> — Priced ≥ +1.0¢/gal above market avg on 60%+ of prices published.
      </Texto>
      <Texto category="p2">
        <b>Discount</b> — Priced ≤ −1.0¢/gal below market avg on 60%+ of prices published.
      </Texto>
      <Texto category="p2">
        <b>Conformist</b> — Within ±0.5¢ of market avg on 70%+ of prices published.
      </Texto>
      <Texto category="p2">
        <b>Independent</b> — High price variance, no persistent side of the market.
      </Texto>
    </Vertical>
  </PopoverShell>
);

export const PopPassThrough = () => (
  <PopoverShell title="Spot Pass-through">
    <Texto category="p2">
      How much of a spot-market move this competitor passes through to their posted price.
    </Texto>
    <Texto category="p2">
      Measured via OLS regression of posted-price Δ on spot Δ, fitted separately for up-days
      and down-days. Reported as up-day β and down-day β.
    </Texto>
    <Texto category="p2">
      The ASYM flag appears when the gap between up-day β and down-day β is ≥ 10 percentage
      points.
    </Texto>
  </PopoverShell>
);

export const PopRank = () => (
  <PopoverShell title="Avg Rank & Trend">
    <Texto category="p2">1 = cheapest. 7 = priciest. Ranks are always whole integers — no decimals.</Texto>
    <Texto category="p2">
      The first number is the 90-day average rank. The arrow and second number show the 30-day
      average. The colored pill uses direction words (improve = cheaper, worsen = more
      expensive, flat = no change) plus the integer change.
    </Texto>
  </PopoverShell>
);

interface PassThroughCellProps {
  competitor: string;
  up: number;
  down: number;
}

export const PopPassThroughCell = ({ competitor, up, down }: PassThroughCellProps) => {
  const gap = Math.abs(up - down);
  return (
    <PopoverShell title={`${competitor} · Spot Pass-through`}>
      <Texto category="p2">
        {competitor} passes through {up}% of spot rises on the next posted price, and {down}% of
        spot falls.
      </Texto>
      {gap >= 10 && (
        <Texto category="p2">
          That's a {gap}-point gap — flagged ASYM (asymmetric pass-through).
        </Texto>
      )}
    </PopoverShell>
  );
};

interface Follower {
  name: string;
  pValue: number;
  lag: number;
}

export const PopFollowersFull = ({
  competitor,
  followers,
}: {
  competitor: string;
  followers: Follower[];
}) => (
  <PopoverShell title={`${competitor} · All followers`}>
    <Vertical gap={4}>
      {followers
        .slice()
        .sort((a, b) => a.pValue - b.pValue)
        .map((f) => (
          <Texto key={f.name} category="p2">
            {f.name} · p={f.pValue.toFixed(3)} · lag {f.lag}
          </Texto>
        ))}
    </Vertical>
  </PopoverShell>
);

const GENERIC_REASON: Record<InsightKey, string> = {
  followers:
    'Based on N prices with strong Granger significance (p < 0.01). Follower relationships are stable.',
  leader: 'Based on N prices showing consistent lead position. Relationship is stable.',
  'price-positioning':
    'Based on N prices sampled over the window. Classification is clear of the threshold by a wide margin.',
  'pass-through':
    'Based on N paired observations split across up-days and down-days with strong regression fit.',
  rank: 'Based on N prices where this competitor posted. Stable across the window.',
};

export const PopConfGeneric = ({
  cellIdentity,
  confidence,
  insight,
}: {
  cellIdentity: string;
  confidence: 'HIGH' | 'MED';
  insight: InsightKey;
}) => (
  <PopoverShell title={`${cellIdentity}  ·  Confidence: ${confidence}`}>
    <Texto category="p2">{GENERIC_REASON[insight]}</Texto>
  </PopoverShell>
);

const LOW_REASON: Record<InsightKey, string> = {
  followers:
    'Only 18 prices in this window. Granger causality regression needs at least 30 paired observations to detect follower relationships reliably.',
  leader:
    "Leader classification depends on detecting follower relationships first. With only 18 days of data, we can't yet compute those reliably.",
  'price-positioning':
    'This is a short window at this terminal. We need 30 prices to classify price positioning reliably. Right now we have 18.',
  'pass-through':
    'Pass-through regression needs at least 30 paired up-day and down-day observations. We currently have 18 total, so neither direction has enough points for a reliable fit.',
  rank:
    'Rank is computed from every day this competitor posted a price. With 18 days we show a provisional rank, but confidence stays Low until we reach 30.',
};

const LOW_CHANGE_BULLETS: Record<InsightKey, string[]> = {
  followers: [
    '12 more prices published at this terminal-product, OR',
    'Broaden the analysis window to include adjacent terminals',
  ],
  leader: [
    '12 more prices published at this terminal-product so follower detection can run',
    'Broaden to adjacent terminals to bring observation count above 30',
  ],
  'price-positioning': [
    '12 more prices published at this terminal-product',
    'Narrow the threshold band to reduce the required observation floor',
  ],
  'pass-through': [
    '12 more paired up/down spot moves observed',
    'Broaden to a wider window where this competitor also publishes',
  ],
  rank: [
    '12 more daily prices posted by this competitor',
    'Drop the minimum observation requirement for provisional ranks only',
  ],
};

export const PopConfLow = ({
  cellIdentity,
  insight,
  observations,
}: {
  cellIdentity: string;
  insight: InsightKey;
  observations: number;
}) => (
  <PopoverShell title={`${cellIdentity}  ·  Confidence: LOW`}>
    <Texto category="p2">{LOW_REASON[insight]}</Texto>
    <div
      style={{
        backgroundColor: '#fafafa',
        border: '1px solid #e8e8e8',
        borderRadius: 6,
        padding: '8px 12px',
      }}
    >
      <Texto category="p2" weight="600">
        Observations: {observations} / 30 needed
      </Texto>
    </div>
    <Vertical gap={4}>
      <Texto category="p2" weight="600">
        What would change this:
      </Texto>
      {LOW_CHANGE_BULLETS[insight].map((b, i) => (
        <Texto key={i} category="p2">
          · {b}
        </Texto>
      ))}
    </Vertical>
  </PopoverShell>
);
