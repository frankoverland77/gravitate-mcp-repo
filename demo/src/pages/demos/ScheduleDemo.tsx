import { useState, useMemo } from 'react';
import { Vertical, Horizontal, Texto, GraviButton, GraviGrid } from '@gravitate-js/excalibrr';
import { Drawer, Form, Input, DatePicker, Select } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { ColDef } from 'ag-grid-community';
import dayjs from 'dayjs';

// Types
interface ScheduleRecord {
  id: number;
  name: string;
  date: string;
  type: 'current_day' | 'next_day' | 'average';
  locations: string[];
}

// US States options
const US_STATES = [
  { value: 'AL', label: 'Alabama' },
  { value: 'AK', label: 'Alaska' },
  { value: 'AZ', label: 'Arizona' },
  { value: 'AR', label: 'Arkansas' },
  { value: 'CA', label: 'California' },
  { value: 'CO', label: 'Colorado' },
  { value: 'CT', label: 'Connecticut' },
  { value: 'DE', label: 'Delaware' },
  { value: 'FL', label: 'Florida' },
  { value: 'GA', label: 'Georgia' },
  { value: 'HI', label: 'Hawaii' },
  { value: 'ID', label: 'Idaho' },
  { value: 'IL', label: 'Illinois' },
  { value: 'IN', label: 'Indiana' },
  { value: 'IA', label: 'Iowa' },
  { value: 'KS', label: 'Kansas' },
  { value: 'KY', label: 'Kentucky' },
  { value: 'LA', label: 'Louisiana' },
  { value: 'ME', label: 'Maine' },
  { value: 'MD', label: 'Maryland' },
  { value: 'MA', label: 'Massachusetts' },
  { value: 'MI', label: 'Michigan' },
  { value: 'MN', label: 'Minnesota' },
  { value: 'MS', label: 'Mississippi' },
  { value: 'MO', label: 'Missouri' },
  { value: 'MT', label: 'Montana' },
  { value: 'NE', label: 'Nebraska' },
  { value: 'NV', label: 'Nevada' },
  { value: 'NH', label: 'New Hampshire' },
  { value: 'NJ', label: 'New Jersey' },
  { value: 'NM', label: 'New Mexico' },
  { value: 'NY', label: 'New York' },
  { value: 'NC', label: 'North Carolina' },
  { value: 'ND', label: 'North Dakota' },
  { value: 'OH', label: 'Ohio' },
  { value: 'OK', label: 'Oklahoma' },
  { value: 'OR', label: 'Oregon' },
  { value: 'PA', label: 'Pennsylvania' },
  { value: 'RI', label: 'Rhode Island' },
  { value: 'SC', label: 'South Carolina' },
  { value: 'SD', label: 'South Dakota' },
  { value: 'TN', label: 'Tennessee' },
  { value: 'TX', label: 'Texas' },
  { value: 'UT', label: 'Utah' },
  { value: 'VT', label: 'Vermont' },
  { value: 'VA', label: 'Virginia' },
  { value: 'WA', label: 'Washington' },
  { value: 'WV', label: 'West Virginia' },
  { value: 'WI', label: 'Wisconsin' },
  { value: 'WY', label: 'Wyoming' },
];

const TYPE_OPTIONS = [
  { value: 'current_day', label: 'Current Day' },
  { value: 'next_day', label: 'Next Day' },
  { value: 'average', label: 'Average' },
];

const INITIAL_DATA: ScheduleRecord[] = [
  {
    id: 1,
    name: 'East Coast Schedule',
    date: '2025-01-15',
    type: 'current_day',
    locations: ['NY', 'NJ', 'CT', 'MA'],
  },
  {
    id: 2,
    name: 'West Coast Schedule',
    date: '2025-01-16',
    type: 'next_day',
    locations: ['CA', 'OR', 'WA'],
  },
  {
    id: 3,
    name: 'Midwest Distribution',
    date: '2025-01-17',
    type: 'average',
    locations: ['IL', 'OH', 'MI', 'IN', 'WI'],
  },
  {
    id: 4,
    name: 'Southern Region',
    date: '2025-01-18',
    type: 'current_day',
    locations: ['TX', 'FL', 'GA', 'NC'],
  },
  {
    id: 5,
    name: 'Mountain States',
    date: '2025-01-19',
    type: 'next_day',
    locations: ['CO', 'UT', 'AZ', 'NM'],
  },
];

// Column definitions factory
const createColumnDefs = (
  onEdit: (record: ScheduleRecord) => void,
  onDelete: (record: ScheduleRecord) => void
): ColDef<ScheduleRecord>[] => [
  { headerName: 'Name', field: 'name', flex: 1, filter: true },
  {
    headerName: 'Date',
    field: 'date',
    width: 150,
    valueFormatter: (params) => (params.value ? dayjs(params.value).format('MMM D, YYYY') : ''),
  },
  {
    headerName: 'Type',
    field: 'type',
    width: 150,
    valueFormatter: (params) =>
      TYPE_OPTIONS.find((opt) => opt.value === params.value)?.label || params.value,
  },
  {
    headerName: 'Locations',
    field: 'locations',
    flex: 1,
    valueFormatter: (params) => (Array.isArray(params.value) ? params.value.join(', ') : ''),
  },
  {
    headerName: 'Actions',
    field: 'id',
    width: 120,
    sortable: false,
    filter: false,
    cellRenderer: (params: { data: ScheduleRecord }) => {
      if (!params.data) return null;
      return (
        <Horizontal alignItems="center" className="gap-8">
          <GraviButton
            icon={<EditOutlined />}
            onClick={() => onEdit(params.data)}
            className="icon-button"
          />
          <GraviButton
            icon={<DeleteOutlined />}
            danger
            onClick={() => onDelete(params.data)}
            className="icon-button"
          />
        </Horizontal>
      );
    },
  },
];

export function ScheduleDemo() {
  const [form] = Form.useForm();
  const [data, setData] = useState<ScheduleRecord[]>(INITIAL_DATA);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [editingRecord, setEditingRecord] = useState<ScheduleRecord | null>(null);

  const handleAdd = () => {
    setEditingRecord(null);
    form.resetFields();
    setDrawerVisible(true);
  };

  const handleEdit = (record: ScheduleRecord) => {
    setEditingRecord(record);
    form.setFieldsValue({
      name: record.name,
      date: dayjs(record.date),
      type: record.type,
      locations: record.locations,
    });
    setDrawerVisible(true);
  };

  const handleDelete = (record: ScheduleRecord) =>
    setData(data.filter((item) => item.id !== record.id));

  const handleDrawerClose = () => {
    setDrawerVisible(false);
    setEditingRecord(null);
    form.resetFields();
  };

  const handleSave = () => {
    form.validateFields().then((values) => {
      const formattedValues = { ...values, date: values.date.format('YYYY-MM-DD') };
      if (editingRecord) {
        setData(
          data.map((item) =>
            item.id === editingRecord.id ? { ...item, ...formattedValues } : item
          )
        );
      } else {
        setData([...data, { id: Math.max(...data.map((d) => d.id)) + 1, ...formattedValues }]);
      }
      handleDrawerClose();
    });
  };

  const columnDefs = useMemo(() => createColumnDefs(handleEdit, handleDelete), [data]);

  return (
    <Vertical flex="1" className="p-3">
      <Horizontal justifyContent="space-between" alignItems="center" className="mb-2">
        <Texto category="h2">Schedule Management</Texto>
        <GraviButton buttonText="Add Schedule" theme1 icon={<PlusOutlined />} onClick={handleAdd} />
      </Horizontal>

      <Vertical flex="1">
        <GraviGrid
          rowData={data}
          columnDefs={columnDefs}
          storageKey="ScheduleDemoGrid"
          agPropOverrides={{}}
        />
      </Vertical>

      <Drawer
        title={editingRecord ? 'Edit Schedule' : 'Create Schedule'}
        visible={drawerVisible}
        onClose={handleDrawerClose}
        width={400}
        footer={
          <Horizontal justifyContent="flex-end" className="gap-12">
            <GraviButton buttonText="Cancel" onClick={handleDrawerClose} />
            <GraviButton buttonText="Save" success onClick={handleSave} />
          </Horizontal>
        }
      >
        <Form form={form} layout="vertical">
          <Vertical className="gap-16">
            <Form.Item
              name="name"
              label={
                <Texto category="p2" appearance="medium">
                  Name
                </Texto>
              }
              rules={[{ required: true, message: 'Please enter a name' }]}
            >
              <Input placeholder="Enter schedule name" />
            </Form.Item>
            <Form.Item
              name="date"
              label={
                <Texto category="p2" appearance="medium">
                  Date
                </Texto>
              }
              rules={[{ required: true, message: 'Please select a date' }]}
            >
              <DatePicker style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item
              name="type"
              label={
                <Texto category="p2" appearance="medium">
                  Type
                </Texto>
              }
              rules={[{ required: true, message: 'Please select a type' }]}
            >
              <Select options={TYPE_OPTIONS} placeholder="Select type" />
            </Form.Item>
            <Form.Item
              name="locations"
              label={
                <Texto category="p2" appearance="medium">
                  Locations
                </Texto>
              }
              rules={[{ required: true, message: 'Please select locations' }]}
            >
              <Select
                mode="multiple"
                options={US_STATES}
                placeholder="Select states"
                showSearch
                filterOption={(input, option) =>
                  (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                }
              />
            </Form.Item>
          </Vertical>
        </Form>
      </Drawer>
    </Vertical>
  );
}
