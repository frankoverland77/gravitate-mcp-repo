import { PlusOutlined } from '@ant-design/icons';
import { GraviButton, GraviGrid } from '@gravitate-js/excalibrr';
import { ColDef } from 'ag-grid-community';
import { Tag } from 'antd';
import { useMemo } from 'react';

import type { OfferGridRow } from '../ManageOffers.types';

interface OffersGridProps {
  rowData: OfferGridRow[];
  onCreateNew: () => void;
}

function getStatusColor(status: string) {
  switch (status) {
    case 'Active':
      return 'green';
    case 'Draft':
      return 'blue';
    case 'Expired':
      return 'default';
    default:
      return 'default';
  }
}

const columnDefs: ColDef<OfferGridRow>[] = [
  { field: 'SpecialOfferId', headerName: 'ID', width: 80 },
  { field: 'OfferName', headerName: 'Offer Name', flex: 2 },
  { field: 'OfferType', headerName: 'Type', flex: 1 },
  {
    field: 'PricingMechanism',
    headerName: 'Pricing',
    width: 100,
    cellRenderer: (params: any) => {
      const color = params.value === 'Index' ? 'purple' : 'blue';
      return <Tag color={color}>{params.value}</Tag>;
    },
  },
  { field: 'ProductName', headerName: 'Product', flex: 1 },
  { field: 'LocationName', headerName: 'Location', flex: 1 },
  {
    field: 'TotalVolume',
    headerName: 'Volume',
    width: 120,
    valueFormatter: (params) => (params.value ? params.value.toLocaleString() + ' gal' : ''),
  },
  {
    field: 'FixedPrice',
    headerName: 'Price',
    width: 100,
    valueFormatter: (params) => (params.value != null ? '$' + params.value.toFixed(4) : 'Index'),
  },
  {
    field: 'Status',
    headerName: 'Status',
    width: 100,
    cellRenderer: (params: any) => <Tag color={getStatusColor(params.value)}>{params.value}</Tag>,
  },
  { field: 'CustomerCount', headerName: 'Customers', width: 110 },
  { field: 'CreatedDate', headerName: 'Created', width: 120 },
];

export function OffersGrid({ rowData, onCreateNew }: OffersGridProps) {
  const controlBarProps = useMemo(
    () => ({
      title: 'Offers',
      hideActiveFilters: false,
      actionButtons: (
        <GraviButton
          className="gravi-button-success"
          icon={<PlusOutlined />}
          buttonText="Create New"
          onClick={onCreateNew}
        />
      ),
    }),
    [onCreateNew],
  );

  const agPropOverrides = useMemo(
    () => ({
      getRowId: (params: any) => params.data.SpecialOfferId.toString(),
    }),
    [],
  );

  return (
    <GraviGrid
      storageKey="ManageOffersGrid"
      controlBarProps={controlBarProps}
      agPropOverrides={agPropOverrides}
      columnDefs={columnDefs}
      rowData={rowData}
    />
  );
}
