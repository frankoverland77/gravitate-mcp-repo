import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { GraviGrid, Vertical } from '@gravitate-js/excalibrr';
import { COMPETITOR_PROFILES, SUMMARY_TILES } from './CompetitorPriceProfiling.data';
import { getCompetitorPriceProfilingColumnDefs } from './CompetitorPriceProfiling.columnDefs';
import { GuidanceBanner } from './components/GuidanceBanner';
import { SummaryTiles } from './components/SummaryTiles';

export function CompetitorPriceProfiling() {
  const navigate = useNavigate();
  const rowData = useMemo(() => COMPETITOR_PROFILES, []);
  const columnDefs = useMemo(() => getCompetitorPriceProfilingColumnDefs(navigate), [navigate]);

  return (
    <Vertical gap={16} style={{ height: '100%', padding: '16px 24px' }}>
      <GuidanceBanner />
      <SummaryTiles tiles={SUMMARY_TILES} />
      <div style={{ flex: 1, minHeight: 0 }}>
        <GraviGrid
          storageKey="competitor-price-profiling-grid"
          rowData={rowData}
          columnDefs={columnDefs}
          agPropOverrides={{
            getRowId: (params: { data: { id: string } }) => params.data.id,
            domLayout: 'normal',
            suppressRowClickSelection: true,
            enableCellTextSelection: true,
            rowGroupPanelShow: 'never',
            rowHeight: 56,
          }}
          controlBarProps={{
            title: 'Competitor Price Profiling',
            subtitle: `${rowData.length} Profiles`,
            hideActiveFilters: true,
            hideFilterRow: true,
          }}
        />
      </div>
    </Vertical>
  );
}
