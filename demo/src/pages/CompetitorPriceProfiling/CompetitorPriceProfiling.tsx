import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { GraviGrid, Vertical } from '@gravitate-js/excalibrr';
import { COMPETITOR_PROFILES } from './CompetitorPriceProfiling.data';
import { getCompetitorPriceProfilingColumnDefs } from './CompetitorPriceProfiling.columnDefs';

export function CompetitorPriceProfiling() {
  const navigate = useNavigate();
  const rowData = useMemo(() => COMPETITOR_PROFILES, []);
  const columnDefs = useMemo(() => getCompetitorPriceProfilingColumnDefs(navigate), [navigate]);

  return (
    <Vertical gap={0} style={{ height: '100%' }}>
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
        }}
        controlBarProps={{
          title: 'Competitor Price Profiling',
          subtitle: `${rowData.length} Profiles`,
          hideActiveFilters: true,
          hideFilterRow: true,
        }}
      />
    </Vertical>
  );
}
