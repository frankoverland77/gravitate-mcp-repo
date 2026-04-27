import { ColDef, ColGroupDef, ICellRendererParams } from 'ag-grid-community';
import { RightOutlined } from '@ant-design/icons';
import { NavigateFunction } from 'react-router-dom';
import { CompetitorProfile, Confidence, InsightKey } from './CompetitorPriceProfiling.types';
import { FollowersCountCell, FollowersTopCell } from './components/cells/FollowersCell';
import { LeaderRoleCell, LeaderImpactCell, LeaderReachCell } from './components/cells/LeaderCell';
import {
  PricePositioningTagCell,
  PricePositioningSpreadCell,
  PricePositioningDirectionCell,
  deriveSpread,
} from './components/cells/StrategyTagCell';
import {
  PassThroughUpCell,
  PassThroughDownCell,
  PassThroughSymmetryCell,
} from './components/cells/PassThroughCell';
import { Rank90Cell, Rank30Cell, RankTrendCell as RankTrendTagCell } from './components/cells/RankTrendCell';
import { ConfidenceCell } from './components/cells/ConfidenceCell';
import { InsightColumnHeader } from './components/headers/InsightColumnHeader';
import { InsightGroupHeader } from './components/headers/InsightGroupHeader';

type CpParams = ICellRendererParams<CompetitorProfile>;

const rowCellId = (p: CompetitorProfile) =>
  `${p.competitor} · ${p.location} · ${p.product}`;

const withResizable = (col: ColDef<CompetitorProfile>): ColDef<CompetitorProfile> => ({
  ...col,
  minWidth: col.width,
  resizable: true,
  cellStyle: {
    display: 'flex',
    alignItems: 'center',
    padding: '0 17px',
    ...((col.cellStyle as object | undefined) ?? {}),
  },
});

const insightChild = (
  base: ColDef<CompetitorProfile>,
): ColDef<CompetitorProfile> => ({
  headerComponent: InsightColumnHeader,
  sortable: true,
  filter: true,
  enableRowGroup: true,
  ...base,
});

// Every insight group shares a single confidence value, read from
// `profile.confidences[key]`. Generates the trailing "Confidence" child column.
const confidenceChild = (
  key: InsightKey,
): ColDef<CompetitorProfile> =>
  insightChild({
    colId: `${key}-confidence`,
    headerName: 'Confidence',
    width: 120,
    sortable: true,
    filter: true,
    valueGetter: (p) => {
      const confMap: Record<InsightKey, keyof CompetitorProfile['confidences']> = {
        followers: 'followers',
        leader: 'leader',
        'price-positioning': 'pricePositioning',
        'pass-through': 'passThrough',
        rank: 'rank',
      };
      return p.data?.confidences[confMap[key]] as Confidence;
    },
    cellRenderer: (p: CpParams) => {
      if (!p.data) return null;
      const confMap: Record<InsightKey, keyof CompetitorProfile['confidences']> = {
        followers: 'followers',
        leader: 'leader',
        'price-positioning': 'pricePositioning',
        'pass-through': 'passThrough',
        rank: 'rank',
      };
      return (
        <ConfidenceCell
          confidence={p.data.confidences[confMap[key]]}
          cellId={rowCellId(p.data)}
          rowCell={key}
        />
      );
    },
  });

export const getCompetitorPriceProfilingColumnDefs = (
  navigate: NavigateFunction,
): (ColDef<CompetitorProfile> | ColGroupDef<CompetitorProfile>)[] => {
  const identityLeaves: ColDef<CompetitorProfile>[] = [
    { field: 'publisher', headerName: 'PUBLISHER', width: 90, sortable: true, filter: true, hide: true },
    { field: 'competitor', headerName: 'COMPETITOR', width: 110, sortable: true, filter: true },
    { field: 'counterpartyGroup', headerName: 'COUNTERPARTY', width: 130, sortable: true, filter: true },
    { field: 'location', headerName: 'LOCATION', width: 130, sortable: true, filter: true },
    { field: 'region', headerName: 'REGION', width: 100, sortable: true, filter: true },
    { field: 'product', headerName: 'PRODUCT', width: 90, sortable: true, filter: true },
    { field: 'productGroup', headerName: 'PROD. GROUP', width: 110, sortable: true, filter: true },
  ];

  const actionsLeaf: ColDef<CompetitorProfile> = {
    colId: 'actions',
    headerName: 'ACTIONS',
    width: 110,
    pinned: 'right',
    lockPinned: true,
    sortable: false,
    filter: false,
    enableRowGroup: false,
    suppressMenu: true,
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
  };

  // ---- Followers to Target ---------------------------------------------
  const followersChildren: ColDef<CompetitorProfile>[] = [
    insightChild({
      colId: 'followers-count',
      headerName: 'Count',
      width: 110,
      sortable: true,
      filter: 'agNumberColumnFilter',
      valueGetter: (p) => p.data?.followers.length ?? 0,
      cellRenderer: (p: CpParams) => {
        if (!p.data) return null;
        return (
          <FollowersCountCell
            competitor={p.data.competitor}
            followers={p.data.followers}
            cellId={rowCellId(p.data)}
          />
        );
      },
    }),
    insightChild({
      colId: 'followers-top',
      headerName: 'Strongest',
      width: 180,
      sortable: true,
      filter: true,
      valueGetter: (p) => {
        const sorted = [...(p.data?.followers ?? [])].sort((a, b) => a.pValue - b.pValue);
        return sorted[0]?.name ?? '';
      },
      cellRenderer: (p: CpParams) => {
        if (!p.data) return null;
        return (
          <FollowersTopCell
            competitor={p.data.competitor}
            followers={p.data.followers}
            cellId={rowCellId(p.data)}
          />
        );
      },
    }),
    confidenceChild('followers'),
  ];

  // ---- Leader ----------------------------------------------------------
  const leaderChildren: ColDef<CompetitorProfile>[] = [
    insightChild({
      colId: 'leader-role',
      headerName: 'Role',
      width: 130,
      sortable: true,
      filter: true,
      valueGetter: (p) => {
        if (!p.data) return '';
        return p.data.isLeader ? 'Leader' : p.data.followers.length > 0 ? 'Follower' : 'Independent';
      },
      cellRenderer: (p: CpParams) => {
        if (!p.data) return null;
        return <LeaderRoleCell isLeader={p.data.isLeader} followers={p.data.followers} />;
      },
    }),
    insightChild({
      colId: 'leader-impact',
      headerName: 'Impact',
      width: 100,
      sortable: true,
      filter: 'agNumberColumnFilter',
      valueGetter: (p) => (p.data?.isLeader ? p.data.followers.length : 0),
      cellRenderer: (p: CpParams) => {
        if (!p.data) return null;
        return <LeaderImpactCell isLeader={p.data.isLeader} followers={p.data.followers} />;
      },
    }),
    insightChild({
      colId: 'leader-reach',
      headerName: 'Reach',
      width: 110,
      sortable: true,
      filter: true,
      valueGetter: (p) => {
        if (!p.data) return '';
        if (!p.data.isLeader) return 'N/A';
        const n = p.data.followers.length;
        return n >= 4 ? 'Broad' : n >= 2 ? 'Narrow' : 'Solo';
      },
      cellRenderer: (p: CpParams) => {
        if (!p.data) return null;
        return <LeaderReachCell isLeader={p.data.isLeader} followers={p.data.followers} />;
      },
    }),
    confidenceChild('leader'),
  ];

  // ---- Price Positioning -----------------------------------------------
  const pricePositioningChildren: ColDef<CompetitorProfile>[] = [
    insightChild({
      colId: 'price-positioning-tag',
      headerName: 'Classification',
      width: 160,
      sortable: true,
      filter: true,
      valueGetter: (p) => p.data?.classification ?? '',
      cellRenderer: (p: CpParams) => {
        if (!p.data) return null;
        return (
          <PricePositioningTagCell
            classification={p.data.classification}
            cellId={rowCellId(p.data)}
            confidence={p.data.confidences.pricePositioning}
            competitor={p.data.competitor}
          />
        );
      },
    }),
    insightChild({
      colId: 'price-positioning-spread',
      headerName: 'Avg Spread',
      width: 130,
      sortable: true,
      filter: 'agNumberColumnFilter',
      valueGetter: (p) => {
        if (!p.data) return 0;
        return deriveSpread(p.data.classification, rowCellId(p.data));
      },
      cellRenderer: (p: CpParams) => {
        if (!p.data) return null;
        return (
          <PricePositioningSpreadCell
            classification={p.data.classification}
            cellId={rowCellId(p.data)}
            confidence={p.data.confidences.pricePositioning}
            competitor={p.data.competitor}
          />
        );
      },
    }),
    insightChild({
      colId: 'price-positioning-direction',
      headerName: 'vs Market',
      width: 140,
      sortable: true,
      filter: true,
      valueGetter: (p) => {
        if (!p.data) return '';
        if (p.data.classification === 'Conformist') return 'Near market';
        if (p.data.classification === 'Independent') return 'Variable';
        const s = deriveSpread(p.data.classification, rowCellId(p.data));
        return s > 0 ? 'Above market' : 'Below market';
      },
      cellRenderer: (p: CpParams) => {
        if (!p.data) return null;
        return (
          <PricePositioningDirectionCell
            classification={p.data.classification}
            cellId={rowCellId(p.data)}
            confidence={p.data.confidences.pricePositioning}
            competitor={p.data.competitor}
          />
        );
      },
    }),
    confidenceChild('price-positioning'),
  ];

  // ---- Spot Pass-through -----------------------------------------------
  const passThroughChildren: ColDef<CompetitorProfile>[] = [
    insightChild({
      colId: 'passthrough-up',
      headerName: 'Up',
      width: 120,
      sortable: true,
      filter: 'agNumberColumnFilter',
      valueGetter: (p) => p.data?.passThrough.up,
      cellRenderer: (p: CpParams) => {
        if (!p.data) return null;
        return (
          <PassThroughUpCell
            competitor={p.data.competitor}
            passThrough={p.data.passThrough}
            cellId={rowCellId(p.data)}
          />
        );
      },
    }),
    insightChild({
      colId: 'passthrough-down',
      headerName: 'Down',
      width: 120,
      sortable: true,
      filter: 'agNumberColumnFilter',
      valueGetter: (p) => p.data?.passThrough.down,
      cellRenderer: (p: CpParams) => {
        if (!p.data) return null;
        return (
          <PassThroughDownCell
            competitor={p.data.competitor}
            passThrough={p.data.passThrough}
            cellId={rowCellId(p.data)}
          />
        );
      },
    }),
    insightChild({
      colId: 'passthrough-symmetry',
      headerName: 'Symmetry',
      width: 120,
      sortable: true,
      filter: true,
      valueGetter: (p) => {
        if (!p.data) return '';
        return Math.abs(p.data.passThrough.up - p.data.passThrough.down) >= 10 ? 'Asym' : 'Sym';
      },
      cellRenderer: (p: CpParams) => {
        if (!p.data) return null;
        return (
          <PassThroughSymmetryCell
            competitor={p.data.competitor}
            passThrough={p.data.passThrough}
            cellId={rowCellId(p.data)}
          />
        );
      },
    }),
    confidenceChild('pass-through'),
  ];

  // ---- Avg Rank --------------------------------------------------------
  const rankChildren: ColDef<CompetitorProfile>[] = [
    insightChild({
      colId: 'rank-90',
      headerName: '90-Day',
      width: 110,
      sortable: true,
      filter: 'agNumberColumnFilter',
      valueGetter: (p) => p.data?.rank.avg90,
      cellRenderer: (p: CpParams) => {
        if (!p.data) return null;
        return <Rank90Cell rank={p.data.rank} />;
      },
    }),
    insightChild({
      colId: 'rank-30',
      headerName: '30-Day',
      width: 110,
      sortable: true,
      filter: 'agNumberColumnFilter',
      valueGetter: (p) => p.data?.rank.avg30,
      cellRenderer: (p: CpParams) => {
        if (!p.data) return null;
        return <Rank30Cell rank={p.data.rank} />;
      },
    }),
    insightChild({
      colId: 'rank-trend',
      headerName: 'Trend',
      width: 120,
      sortable: true,
      filter: 'agNumberColumnFilter',
      valueGetter: (p) => (p.data ? p.data.rank.avg30 - p.data.rank.avg90 : 0),
      cellRenderer: (p: CpParams) => {
        if (!p.data) return null;
        return <RankTrendTagCell rank={p.data.rank} />;
      },
    }),
    confidenceChild('rank'),
  ];

  const group = (
    headerName: string,
    popoverId: string,
    children: ColDef<CompetitorProfile>[],
  ): ColGroupDef<CompetitorProfile> => ({
    headerName,
    headerGroupComponent: InsightGroupHeader,
    headerGroupComponentParams: { label: headerName, popoverId },
    marryChildren: true,
    children: children.map(withResizable),
  });

  return [
    ...identityLeaves.map(withResizable),
    group('Followers to Target', 'pop-followers', followersChildren),
    group('Leader', 'pop-leader', leaderChildren),
    group('Price Positioning', 'pop-strategy', pricePositioningChildren),
    group('Spot Pass-through', 'pop-passthrough', passThroughChildren),
    group('Avg Rank', 'pop-rank', rankChildren),
    withResizable(actionsLeaf),
  ];
};
