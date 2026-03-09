import { ColDef } from 'ag-grid-community';
import { GraviButton, Horizontal } from '@gravitate-js/excalibrr';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { DogGroomingData } from '../api/types.schema';

interface ColumnDefsProps {
  onDelete: (id: number) => void;
  onEdit?: (data: DogGroomingData) => void;
}

export function DogGroomingColumnDefs({ onDelete, onEdit }: ColumnDefsProps): ColDef[] {
  return [
    {
      headerName: 'name',
      field: 'name',
      sortable: true,
      filter: true,
      minWidth: 150,
    },
    {
      headerName: 'start Date',
      field: 'startDate',
      sortable: true,
      filter: 'agDateColumnFilter',
      minWidth: 150,
      valueFormatter: (params) => (params.value ? new Date(params.value).toLocaleDateString() : ''),
    },
    {
      headerName: 'end Date',
      field: 'endDate',
      sortable: true,
      filter: 'agDateColumnFilter',
      minWidth: 150,
      valueFormatter: (params) => (params.value ? new Date(params.value).toLocaleDateString() : ''),
    },
    {
      headerName: 'type',
      field: 'type',
      sortable: true,
      filter: true,
      minWidth: 150,
    },
    {
      headerName: 'Actions',
      field: 'actions',
      sortable: false,
      filter: false,
      minWidth: 100,
      maxWidth: 120,
      cellRenderer: (params: { data: DogGroomingData }) => (
        <Horizontal gap={8}>
          {onEdit && (
            <GraviButton
              type="text"
              size="small"
              icon={<EditOutlined />}
              onClick={() => onEdit(params.data)}
            />
          )}
          <GraviButton
            type="text"
            size="small"
            icon={<DeleteOutlined />}
            danger
            onClick={() => onDelete(params.data.Id)}
          />
        </Horizontal>
      ),
    },
  ];
}
