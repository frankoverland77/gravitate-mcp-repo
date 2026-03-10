import { EyeOutlined } from '@ant-design/icons';
import { GraviButton, GraviGrid, Horizontal, Vertical } from '@gravitate-js/excalibrr';
import { ColDef } from 'ag-grid-community';
import moment from 'moment';
import React, { useCallback, useEffect, useMemo, useState } from 'react';

import { ValuationDrawer } from './components/ValuationDrawer';
import { ContractValuesRow, mockContractValuesRows } from './data/mockData';

// ─── Grid Column Definitions ────────────────────────────────────────────────

function getColumnDefs(onViewBuildup: (id: number) => void): ColDef[] {
  return [
    {
      headerName: 'Contract ID',
      field: 'TradeEntryId',
      width: 120,
    },
    {
      headerName: 'Detail ID',
      field: 'TradeEntryDetailId',
      width: 100,
    },
    {
      headerName: 'Counterparty',
      field: 'CounterPartyName',
      flex: 1,
    },
    {
      headerName: 'Location',
      field: 'LocationName',
      flex: 1,
    },
    {
      headerName: 'Product',
      field: 'ProductName',
      width: 160,
    },
    {
      headerName: 'From Date',
      field: 'EffectiveFromDateTime',
      width: 140,
      valueFormatter: ({ value }: { value: string }) =>
        value ? moment(value).format('MM/DD/YYYY') : '',
    },
    {
      headerName: 'To Date',
      field: 'EffectiveToDateTime',
      width: 140,
      valueFormatter: ({ value }: { value: string }) =>
        value ? moment(value).format('MM/DD/YYYY') : '',
    },
    {
      headerName: 'Price',
      field: 'Price',
      width: 120,
      cellStyle: { textAlign: 'right' },
      valueFormatter: ({ value }: { value: number | null }) =>
        value != null
          ? value.toLocaleString('en-US', { minimumFractionDigits: 4, maximumFractionDigits: 4 })
          : '—',
    },
    {
      headerName: 'Status',
      field: 'ValuationStatusDisplay',
      width: 130,
    },
    {
      headerName: 'Updated',
      field: 'UpdatedDateTime',
      width: 170,
      valueFormatter: ({ value }: { value: string }) =>
        value ? moment(value).format('MM/DD/YYYY hh:mm A') : '',
    },
    {
      headerName: 'Actions',
      field: 'actions',
      maxWidth: 160,
      sortable: false,
      filter: false,
      cellRenderer: ({ data }: { data: ContractValuesRow }) => {
        if (!data) return null;
        return (
          <Horizontal horizontalCenter>
            <GraviButton
              icon={<EyeOutlined />}
              buttonText="View Buildup"
              size="small"
              onClick={() => onViewBuildup(data.CurvePointPriceId)}
            />
          </Horizontal>
        );
      },
    },
  ];
}

// ─── Main Page Component ────────────────────────────────────────────────────

export function QuotebookQoLPage() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedValuationId, setSelectedValuationId] = useState<number | null>(null);

  /* MCP Theme Script */
  useEffect(() => {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('TYPE_OF_THEME', 'PE_LIGHT');
    }
  }, []);
  /* End MCP Theme Script */

  const handleViewBuildup = useCallback((curvePointPriceId: number) => {
    setSelectedValuationId(curvePointPriceId);
    setIsDrawerOpen(true);
  }, []);

  const handleCloseDrawer = useCallback(() => {
    setIsDrawerOpen(false);
    setSelectedValuationId(null);
  }, []);

  const columnDefs = useMemo(() => getColumnDefs(handleViewBuildup), [handleViewBuildup]);

  const agPropOverrides = useMemo(
    () => ({
      getRowId: (params: { data: ContractValuesRow }) => params.data.CurvePointPriceId.toString(),
    }),
    []
  );

  const controlBarProps = useMemo(
    () => ({
      title: 'Contract Value Results',
      hideActiveFilters: false,
    }),
    []
  );

  return (
    <Vertical height="100%">
      <GraviGrid
        storageKey="QuotebookQoL"
        controlBarProps={controlBarProps}
        agPropOverrides={agPropOverrides}
        columnDefs={columnDefs}
        rowData={mockContractValuesRows}
      />
      <ValuationDrawer
        visible={isDrawerOpen}
        onClose={handleCloseDrawer}
        selectedValuationId={selectedValuationId}
      />
    </Vertical>
  );
}
