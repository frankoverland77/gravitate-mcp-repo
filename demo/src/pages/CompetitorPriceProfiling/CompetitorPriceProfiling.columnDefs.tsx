import { ColDef, ICellRendererParams } from 'ag-grid-community';
import { RightOutlined } from '@ant-design/icons';
import { NavigateFunction } from 'react-router-dom';
import { CompetitorProfile } from './CompetitorPriceProfiling.types';
import { FollowersCell } from './components/cells/FollowersCell';
import { LeaderCell } from './components/cells/LeaderCell';
import { StrategyTagCell } from './components/cells/StrategyTagCell';
import { PassThroughCell } from './components/cells/PassThroughCell';
import { RankTrendCell } from './components/cells/RankTrendCell';
import { InsightColumnHeader } from './components/headers/InsightColumnHeader';
import { HoverablePopover } from './components/HoverablePopover';
import { ConfidencePopoverContent } from './components/popovers/ConfidencePopoverContent';

type CpParams = ICellRendererParams<CompetitorProfile>;

const rowCellId = (p: CompetitorProfile) =>
  `${p.competitor} · ${p.location} · ${p.product}`;

const withPopover = (
  trigger: JSX.Element,
  data: CompetitorProfile,
  insight: 'followers' | 'leader' | 'price-positioning' | 'pass-through' | 'rank',
) => (
  <HoverablePopover
    popoverId={`pop-conf-${data.id}-${insight}`}
    placement="left"
    content={
      <ConfidencePopoverContent
        cellIdentity={`${rowCellId(data)} · ${insight}`}
        confidence={data.confidences[insightToKey(insight)]}
        insight={insight}
        observations={data.observations}
      />
    }
  >
    {trigger}
  </HoverablePopover>
);

const insightToKey = (
  insight: 'followers' | 'leader' | 'price-positioning' | 'pass-through' | 'rank',
): keyof CompetitorProfile['confidences'] => {
  switch (insight) {
    case 'followers':
      return 'followers';
    case 'leader':
      return 'leader';
    case 'price-positioning':
      return 'pricePositioning';
    case 'pass-through':
      return 'passThrough';
    case 'rank':
      return 'rank';
  }
};

export const getCompetitorPriceProfilingColumnDefs = (
  navigate: NavigateFunction,
): ColDef<CompetitorProfile>[] => [
  { field: 'publisher', headerName: 'PUBLISHER', width: 110, sortable: true, filter: true },
  { field: 'competitor', headerName: 'COMPETITOR', width: 130, sortable: true, filter: true },
  {
    field: 'counterpartyGroup',
    headerName: 'COUNTERPARTY GROUP',
    width: 160,
    sortable: true,
    filter: true,
  },
  { field: 'location', headerName: 'LOCATION', width: 150, sortable: true, filter: true },
  { field: 'region', headerName: 'REGION', width: 120, sortable: true, filter: true },
  { field: 'product', headerName: 'PRODUCT', width: 110, sortable: true, filter: true },
  { field: 'productGroup', headerName: 'PRODUCT GROUP', width: 140, sortable: true, filter: true },

  {
    colId: 'followers',
    headerName: 'Followers to Target',
    headerComponent: InsightColumnHeader,
    headerComponentParams: { popoverId: 'pop-followers' },
    width: 260,
    sortable: false,
    filter: false,
    autoHeight: true,
    cellRenderer: (p: CpParams) => {
      if (!p.data) return null;
      const cid = rowCellId(p.data);
      return (
        <FollowersCell
          competitor={p.data.competitor}
          followers={p.data.followers}
          cellId={cid}
          confidence={p.data.confidences.followers}
        />
      );
    },
  },
  {
    colId: 'leader',
    headerName: 'Leader',
    headerComponent: InsightColumnHeader,
    headerComponentParams: { popoverId: 'pop-leader' },
    width: 170,
    sortable: false,
    filter: false,
    cellRenderer: (p: CpParams) => {
      if (!p.data) return null;
      return (
        <LeaderCell
          isLeader={p.data.isLeader}
          cellId={rowCellId(p.data)}
          confidence={p.data.confidences.leader}
        />
      );
    },
  },
  {
    colId: 'price-positioning',
    headerName: 'Price Positioning',
    headerComponent: InsightColumnHeader,
    headerComponentParams: { popoverId: 'pop-strategy' },
    width: 190,
    sortable: false,
    filter: false,
    cellRenderer: (p: CpParams) => {
      if (!p.data) return null;
      return (
        <StrategyTagCell
          classification={p.data.classification}
          cellId={rowCellId(p.data)}
          confidence={p.data.confidences.pricePositioning}
        />
      );
    },
  },
  {
    colId: 'pass-through',
    headerName: 'Spot Pass-through',
    headerComponent: InsightColumnHeader,
    headerComponentParams: { popoverId: 'pop-passthrough' },
    width: 220,
    sortable: false,
    filter: false,
    autoHeight: true,
    cellRenderer: (p: CpParams) => {
      if (!p.data) return null;
      return (
        <PassThroughCell
          competitor={p.data.competitor}
          passThrough={p.data.passThrough}
          cellId={rowCellId(p.data)}
          confidence={p.data.confidences.passThrough}
        />
      );
    },
  },
  {
    colId: 'rank',
    headerName: 'Avg Rank & Trend',
    headerComponent: InsightColumnHeader,
    headerComponentParams: { popoverId: 'pop-rank' },
    width: 210,
    sortable: false,
    filter: false,
    cellRenderer: (p: CpParams) => {
      if (!p.data) return null;
      return (
        <RankTrendCell
          rank={p.data.rank}
          cellId={rowCellId(p.data)}
          confidence={p.data.confidences.rank}
        />
      );
    },
  },

  {
    colId: 'actions',
    headerName: 'ACTIONS',
    width: 110,
    pinned: 'right',
    sortable: false,
    filter: false,
    cellRenderer: (p: CpParams) => {
      if (!p.data) return null;
      const profile = p.data;
      return (
        <div
          style={{
            cursor: 'pointer',
            color: '#595959',
            textDecoration: 'underline',
            display: 'flex',
            alignItems: 'center',
            gap: 4,
          }}
          onClick={() =>
            navigate('/CompetitorPriceProfiling/CompetitorPriceProfilingDetails', {
              state: { profile },
            })
          }
        >
          <span>Analyze</span>
          <RightOutlined style={{ fontSize: 12 }} />
        </div>
      );
    },
  },
];

// unused helper kept to match earlier drafts — confidence popover is wired via ConfidencePill's
// own attributes; per-row mount happens in cell renderers directly if needed.
void withPopover;
