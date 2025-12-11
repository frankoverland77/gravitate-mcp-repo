import { useState } from 'react';
import { Vertical, Horizontal, Texto, GraviButton, GraviGrid } from '@gravitate-js/excalibrr';
import { ReloadOutlined } from '@ant-design/icons';
import { ColDef } from 'ag-grid-community';

// Types
interface InventoryItem {
  id: number;
  sku: string;
  productName: string;
  quantity: number;
  location: string;
  lastUpdated: string;
}

// Dummy data
const INVENTORY_DATA: InventoryItem[] = [
  {
    id: 1,
    sku: 'SKU-001',
    productName: 'Sourdough Loaf',
    quantity: 45,
    location: 'Warehouse A',
    lastUpdated: '2025-01-15 08:30',
  },
  {
    id: 2,
    sku: 'SKU-002',
    productName: 'Croissant',
    quantity: 120,
    location: 'Warehouse A',
    lastUpdated: '2025-01-15 09:15',
  },
  {
    id: 3,
    sku: 'SKU-003',
    productName: 'Baguette',
    quantity: 78,
    location: 'Warehouse B',
    lastUpdated: '2025-01-15 07:45',
  },
  {
    id: 4,
    sku: 'SKU-004',
    productName: 'Cinnamon Roll',
    quantity: 34,
    location: 'Warehouse A',
    lastUpdated: '2025-01-15 10:00',
  },
  {
    id: 5,
    sku: 'SKU-005',
    productName: 'Rye Bread',
    quantity: 22,
    location: 'Warehouse C',
    lastUpdated: '2025-01-14 16:30',
  },
  {
    id: 6,
    sku: 'SKU-006',
    productName: 'Chocolate Muffin',
    quantity: 89,
    location: 'Warehouse B',
    lastUpdated: '2025-01-15 11:20',
  },
  {
    id: 7,
    sku: 'SKU-007',
    productName: 'Bagel Plain',
    quantity: 156,
    location: 'Warehouse A',
    lastUpdated: '2025-01-15 06:00',
  },
  {
    id: 8,
    sku: 'SKU-008',
    productName: 'Danish Pastry',
    quantity: 0,
    location: 'Warehouse C',
    lastUpdated: '2025-01-13 14:00',
  },
];

export function InventoryGrid() {
  const [data] = useState<InventoryItem[]>(INVENTORY_DATA);

  // Column definitions
  const columnDefs: ColDef<InventoryItem>[] = [
    { headerName: 'SKU', field: 'sku', width: 120, filter: true },
    { headerName: 'Product Name', field: 'productName', flex: 1, filter: true },
    {
      headerName: 'Quantity',
      field: 'quantity',
      width: 120,
      type: 'numericColumn',
      cellStyle: (params) => {
        if (params.value === 0) return { color: 'var(--theme-color-error)', fontWeight: 600 };
        if (params.value < 30) return { color: 'var(--theme-color-warning)' };
        return null;
      },
    },
    { headerName: 'Location', field: 'location', width: 140, filter: true },
    { headerName: 'Last Updated', field: 'lastUpdated', width: 160 },
  ];

  const handleRefresh = () => {
    // In real app, would fetch fresh data from API
  };

  return (
    <Vertical flex="1" className="p-3">
      <Horizontal justifyContent="space-between" alignItems="center" className="mb-2">
        <Texto category="h2">Inventory</Texto>
        <GraviButton buttonText="Refresh" icon={<ReloadOutlined />} onClick={handleRefresh} />
      </Horizontal>

      <Vertical flex="1">
        <GraviGrid
          rowData={data}
          columnDefs={columnDefs}
          storageKey="InventoryGrid"
          agPropOverrides={{}}
        />
      </Vertical>
    </Vertical>
  );
}
