import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { GraviGrid, Vertical } from '@gravitate-js/excalibrr';
import { COMPETITOR_PROFILES, SUMMARY_TILES } from './CompetitorPriceProfiling.data';
import { getCompetitorPriceProfilingColumnDefs } from './CompetitorPriceProfiling.columnDefs';
import { SummaryTiles } from './components/SummaryTiles';

export function CompetitorPriceProfiling() {
  const navigate = useNavigate();
  const rowData = useMemo(() => COMPETITOR_PROFILES, []);
  const columnDefs = useMemo(() => getCompetitorPriceProfilingColumnDefs(navigate), [navigate]);

  return (
    <Vertical gap={16} style={{ height: '100%', padding: '16px 24px' }}>
      <SummaryTiles tiles={SUMMARY_TILES} />
      <div style={{ fontSize: 12, color: '#595959', padding: '0 4px' }}>
        Hover any <span style={{ color: '#8c8c8c' }}>ⓘ</span> icon or tag for more info.
      </div>
      <div style={{ flex: 1, minHeight: 0 }}>
        <GraviGrid
          rowData={rowData}
          columnDefs={columnDefs}
          agPropOverrides={{
            getRowId: (params: { data: { id: string } }) => params.data.id,
            domLayout: 'normal',
            suppressRowClickSelection: true,
            enableCellTextSelection: true,
            rowGroupPanelShow: 'always',
            defaultColDef: {
              resizable: true,
              suppressSizeToFit: true,
              sortable: true,
              filter: true,
              enableRowGroup: true,
              menuTabs: ['filterMenuTab', 'generalMenuTab', 'columnsMenuTab'],
            },
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
