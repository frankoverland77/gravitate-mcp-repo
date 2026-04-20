import { ColDef } from 'ag-grid-community';
import { BBDTag } from '@gravitate-js/excalibrr';
import { RightOutlined } from '@ant-design/icons';
import { NavigateFunction } from 'react-router-dom';
import { CompetitorProfile } from './CompetitorPriceProfiling.types';

export const getCompetitorPriceProfilingColumnDefs = (
  navigate: NavigateFunction,
): ColDef<CompetitorProfile>[] => [
  { field: 'publisher', headerName: 'PUBLISHER', width: 120, sortable: true, filter: true },
  { field: 'competitor', headerName: 'COMPETITOR', width: 140, sortable: true, filter: true },
  {
    field: 'counterpartyGroup',
    headerName: 'COUNTERPARTY GROUP',
    width: 170,
    sortable: true,
    filter: true,
  },
  { field: 'location', headerName: 'LOCATION', width: 150, sortable: true, filter: true },
  { field: 'region', headerName: 'REGION', width: 130, sortable: true, filter: true },
  { field: 'product', headerName: 'PRODUCT', width: 120, sortable: true, filter: true },
  {
    field: 'productGroup',
    headerName: 'PRODUCT GROUP',
    width: 150,
    sortable: true,
    filter: true,
  },
  {
    field: 'classification',
    headerName: 'CLASSIFICATION',
    width: 150,
    sortable: true,
    filter: true,
    cellRenderer: (params: { value: string }) => (
      <BBDTag style={{ width: 'fit-content' }}>{params.value}</BBDTag>
    ),
  },
  {
    field: 'isLeader',
    headerName: 'LEADER',
    width: 110,
    sortable: true,
    filter: true,
    cellRenderer: (params: { value: boolean }) =>
      params.value ? (
        <BBDTag success style={{ width: 'fit-content' }}>
          Leader
        </BBDTag>
      ) : null,
  },
  {
    colId: 'actions',
    headerName: 'ACTIONS',
    width: 130,
    pinned: 'right',
    sortable: false,
    filter: false,
    cellRenderer: (params: { data?: CompetitorProfile }) =>
      params.data ? (
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
              state: { profile: params.data },
            })
          }
        >
          <span>Analyze</span>
          <RightOutlined style={{ fontSize: 12 }} />
        </div>
      ) : null,
  },
];
