import { useState } from 'react';
import { Vertical, Horizontal, Texto, GraviButton, GraviGrid } from '@gravitate-js/excalibrr';
import { Modal, Form, Input, Select, Tag } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { ColDef, ICellRendererParams } from 'ag-grid-community';

// Types
interface Customer {
  id: number;
  name: string;
  email: string;
  phone: string;
  status: 'active' | 'inactive' | 'pending';
}

// Status options
const STATUS_OPTIONS = [
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
  { value: 'pending', label: 'Pending' },
];

// Dummy data
const INITIAL_DATA: Customer[] = [
  {
    id: 1,
    name: 'John Smith',
    email: 'john.smith@example.com',
    phone: '(555) 123-4567',
    status: 'active',
  },
  {
    id: 2,
    name: 'Sarah Johnson',
    email: 'sarah.j@example.com',
    phone: '(555) 234-5678',
    status: 'active',
  },
  {
    id: 3,
    name: 'Michael Brown',
    email: 'mbrown@example.com',
    phone: '(555) 345-6789',
    status: 'pending',
  },
  {
    id: 4,
    name: 'Emily Davis',
    email: 'emily.davis@example.com',
    phone: '(555) 456-7890',
    status: 'inactive',
  },
  {
    id: 5,
    name: 'Robert Wilson',
    email: 'rwilson@example.com',
    phone: '(555) 567-8901',
    status: 'active',
  },
];

export function CustomerList() {
  const [form] = Form.useForm();
  const [data, setData] = useState<Customer[]>(INITIAL_DATA);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingRecord, setEditingRecord] = useState<Customer | null>(null);

  const handleAdd = () => {
    setEditingRecord(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEdit = (record: Customer) => {
    setEditingRecord(record);
    form.setFieldsValue(record);
    setModalVisible(true);
  };

  const handleDelete = (record: Customer) => {
    setData(data.filter((item) => item.id !== record.id));
  };

  const handleModalClose = () => {
    setModalVisible(false);
    setEditingRecord(null);
    form.resetFields();
  };

  const handleSave = () => {
    form.validateFields().then((values) => {
      if (editingRecord) {
        setData(data.map((item) => (item.id === editingRecord.id ? { ...item, ...values } : item)));
      } else {
        const newRecord: Customer = {
          id: Math.max(...data.map((d) => d.id)) + 1,
          ...values,
        };
        setData([...data, newRecord]);
      }
      handleModalClose();
    });
  };

  // Status cell renderer
  const StatusCellRenderer = (params: ICellRendererParams<Customer>) => {
    if (!params.value) return null;
    const colorMap: Record<string, string> = {
      active: 'green',
      inactive: 'red',
      pending: 'orange',
    };
    return <Tag color={colorMap[params.value]}>{params.value.toUpperCase()}</Tag>;
  };

  // Actions cell renderer
  const ActionsCellRenderer = (params: ICellRendererParams<Customer>) => {
    if (!params.data) return null;
    return (
      <Horizontal alignItems="center" gap={8}>
        <GraviButton icon={<EditOutlined />} onClick={() => handleEdit(params.data!)} />
        <GraviButton icon={<DeleteOutlined />} danger onClick={() => handleDelete(params.data!)} />
      </Horizontal>
    );
  };

  // Column definitions
  const columnDefs: ColDef<Customer>[] = [
    { headerName: 'Name', field: 'name', flex: 1, filter: true },
    { headerName: 'Email', field: 'email', flex: 1, filter: true },
    { headerName: 'Phone', field: 'phone', width: 150 },
    { headerName: 'Status', field: 'status', width: 120, cellRenderer: StatusCellRenderer },
    {
      headerName: 'Actions',
      field: 'id',
      width: 120,
      cellRenderer: ActionsCellRenderer,
      sortable: false,
      filter: false,
    },
  ];

  return (
    <Vertical flex="1" className="p-3">
      <Horizontal justifyContent="space-between" alignItems="center" className="mb-2">
        <Texto category="h2">Customers</Texto>
        <GraviButton buttonText="Add Customer" theme1 icon={<PlusOutlined />} onClick={handleAdd} />
      </Horizontal>

      <Vertical flex="1">
        <GraviGrid
          rowData={data}
          columnDefs={columnDefs}
          storageKey="CustomerListGrid"
          agPropOverrides={{}}
        />
      </Vertical>

      <Modal
        title={editingRecord ? 'Edit Customer' : 'Add Customer'}
        open={modalVisible}
        onCancel={handleModalClose}
        footer={
          <Horizontal justifyContent="flex-end" gap={12}>
            <GraviButton buttonText="Cancel" onClick={handleModalClose} />
            <GraviButton buttonText="Save" success onClick={handleSave} />
          </Horizontal>
        }
      >
        <Form form={form} layout="vertical">
          <Vertical gap={16}>
            <Form.Item
              name="name"
              label={
                <Texto category="p2" appearance="medium">
                  Name
                </Texto>
              }
              rules={[{ required: true, message: 'Please enter a name' }]}
            >
              <Input placeholder="Enter customer name" />
            </Form.Item>

            <Form.Item
              name="email"
              label={
                <Texto category="p2" appearance="medium">
                  Email
                </Texto>
              }
              rules={[
                { required: true, message: 'Please enter an email' },
                { type: 'email', message: 'Please enter a valid email' },
              ]}
            >
              <Input placeholder="Enter email address" />
            </Form.Item>

            <Form.Item
              name="phone"
              label={
                <Texto category="p2" appearance="medium">
                  Phone
                </Texto>
              }
              rules={[{ required: true, message: 'Please enter a phone number' }]}
            >
              <Input placeholder="Enter phone number" />
            </Form.Item>

            <Form.Item
              name="status"
              label={
                <Texto category="p2" appearance="medium">
                  Status
                </Texto>
              }
              rules={[{ required: true, message: 'Please select a status' }]}
            >
              <Select options={STATUS_OPTIONS} placeholder="Select status" />
            </Form.Item>
          </Vertical>
        </Form>
      </Modal>
    </Vertical>
  );
}
