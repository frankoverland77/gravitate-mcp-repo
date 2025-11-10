import {
  Horizontal,
  Vertical,
  Texto,
  GraviButton,
} from "@gravitate-js/excalibrr";
import {
  MoreOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  CopyOutlined,
  QuestionCircleOutlined,
  InfoCircleOutlined,
  ExclamationCircleOutlined,
  SettingOutlined,
  UserOutlined,
  BellOutlined,
  ShareAltOutlined,
  DownloadOutlined,
  WarningOutlined,
  CheckCircleOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import {
  Button,
  Card,
  Modal,
  Popover,
  Popconfirm,
  Tooltip,
  Input,
  Form,
  Select,
  Menu,
  Switch,
  Divider,
  Space,
  Radio,
  Badge,
  Tag
} from "antd";
import { useState } from "react";

const { TextArea } = Input;
const { Option } = Select;

export function OverlayComponentsExample() {
  // Modal states
  const [basicModalVisible, setBasicModalVisible] = useState(false);
  const [confirmModalVisible, setConfirmModalVisible] = useState(false);
  const [formModalVisible, setFormModalVisible] = useState(false);
  const [complexModalVisible, setComplexModalVisible] = useState(false);

  // Popover states
  const [menuPopoverVisible, setMenuPopoverVisible] = useState(false);
  const [richPopoverVisible, setRichPopoverVisible] = useState(false);

  // Tooltip states
  const [tooltipPosition, setTooltipPosition] = useState('top');

  // Form state
  const [form] = Form.useForm();

  // Demo data
  const sampleUser = {
    name: "John Doe",
    email: "john.doe@example.com",
    role: "Administrator",
    status: "Active",
    lastLogin: "2024-01-15 10:30 AM"
  };

  const handleFormSubmit = (values: any) => {
    console.log('Form submitted:', values);
    setFormModalVisible(false);
    form.resetFields();
  };

  const handleDelete = (item: string) => {
    console.log('Deleting:', item);
  };

  const menuItems = (
    <Menu>
      <Menu.Item key="edit" icon={<EditOutlined />}>
        Edit Item
      </Menu.Item>
      <Menu.Item key="copy" icon={<CopyOutlined />}>
        Duplicate
      </Menu.Item>
      <Menu.Item key="share" icon={<ShareAltOutlined />}>
        Share
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key="delete" danger icon={<DeleteOutlined />}>
        Delete
      </Menu.Item>
    </Menu>
  );

  const richPopoverContent = (
    <div style={{ width: '300px' }}>
      <Texto category="p1" style={{ fontWeight: 'bold', marginBottom: '12px' }}>
        User Details
      </Texto>
      <div style={{ display: 'grid', gridTemplateColumns: '80px 1fr', gap: '8px', marginBottom: '16px' }}>
        <Texto category="p2" style={{ color: 'var(--theme-color-3)' }}>Name:</Texto>
        <Texto category="p2">{sampleUser.name}</Texto>
        <Texto category="p2" style={{ color: 'var(--theme-color-3)' }}>Email:</Texto>
        <Texto category="p2">{sampleUser.email}</Texto>
        <Texto category="p2" style={{ color: 'var(--theme-color-3)' }}>Role:</Texto>
        <Texto category="p2">{sampleUser.role}</Texto>
        <Texto category="p2" style={{ color: 'var(--theme-color-3)' }}>Status:</Texto>
        <Badge status="success" text={sampleUser.status} />
        <Texto category="p2" style={{ color: 'var(--theme-color-3)' }}>Last Login:</Texto>
        <Texto category="p2">{sampleUser.lastLogin}</Texto>
      </div>
      <Space>
        <Button size="small" type="primary" icon={<EditOutlined />}>
          Edit
        </Button>
        <Button size="small" icon={<EyeOutlined />}>
          View Profile
        </Button>
      </Space>
    </div>
  );

  return (
    <Vertical style={{ maxWidth: "1000px", margin: "0 auto" }}>
      <Texto className="mb-3" category="h3">
        Overlay Components Showcase
      </Texto>

      {/* Modal Section */}
      <Texto category="h4" style={{ color: "var(--theme-color-2)", marginBottom: "16px" }}>
        Modal Components
      </Texto>

      <Card title="Modal Variations" className="mb-4">
        <Space wrap>
          <Button type="primary" onClick={() => setBasicModalVisible(true)}>
            Basic Modal
          </Button>
          <Button onClick={() => setConfirmModalVisible(true)}>
            Confirmation Modal
          </Button>
          <Button onClick={() => setFormModalVisible(true)}>
            Form Modal
          </Button>
          <Button onClick={() => setComplexModalVisible(true)}>
            Complex Modal
          </Button>
        </Space>
      </Card>

      {/* Basic Modal */}
      <Modal
        title="Basic Modal"
        open={basicModalVisible}
        onCancel={() => setBasicModalVisible(false)}
        footer={[
          <Button key="cancel" onClick={() => setBasicModalVisible(false)}>
            Cancel
          </Button>,
          <Button key="ok" type="primary" onClick={() => setBasicModalVisible(false)}>
            OK
          </Button>
        ]}
      >
        <Vertical style={{ gap: '12px' }}>
          <Texto category="p1">
            This is a basic modal with standard styling and layout.
          </Texto>
          <Texto category="p2" style={{ color: 'var(--theme-color-3)' }}>
            Modals are used for content that requires immediate user attention or action.
            They overlay the main content and typically include a backdrop that prevents
            interaction with the underlying page.
          </Texto>
        </Vertical>
      </Modal>

      {/* Confirmation Modal */}
      <Modal
        title={
          <Horizontal alignItems="center">
            <ExclamationCircleOutlined
              className="mr-2"
              style={{ color: 'var(--theme-warning)' }}
            />
            <Texto category="h6">Confirm Action</Texto>
          </Horizontal>
        }
        open={confirmModalVisible}
        onCancel={() => setConfirmModalVisible(false)}
        footer={
          <Horizontal justifyContent="flex-end" style={{ gap: '10px' }}>
            <GraviButton
              buttonText="Cancel"
              onClick={() => setConfirmModalVisible(false)}
            />
            <GraviButton
              buttonText="Confirm"
              theme1
              onClick={() => setConfirmModalVisible(false)}
            />
          </Horizontal>
        }
      >
        <Vertical style={{ gap: '8px' }}>
          <Texto category="p1">
            Are you sure you want to proceed with this action?
          </Texto>
          <Texto category="p2" style={{ color: 'var(--theme-warning)' }}>
            This action cannot be undone.
          </Texto>
        </Vertical>
      </Modal>

      {/* Form Modal */}
      <Modal
        title="Create New Item"
        open={formModalVisible}
        onCancel={() => setFormModalVisible(false)}
        footer={[
          <Button key="cancel" onClick={() => setFormModalVisible(false)}>
            Cancel
          </Button>,
          <Button key="submit" type="primary" onClick={() => form.submit()}>
            Create Item
          </Button>
        ]}
        destroyOnClose
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleFormSubmit}
        >
          <Form.Item
            name="name"
            label="Item Name"
            rules={[{ required: true, message: 'Please enter a name' }]}
          >
            <Input placeholder="Enter item name" />
          </Form.Item>
          <Form.Item
            name="category"
            label="Category"
            rules={[{ required: true, message: 'Please select a category' }]}
          >
            <Select placeholder="Select category">
              <Option value="type1">Category 1</Option>
              <Option value="type2">Category 2</Option>
              <Option value="type3">Category 3</Option>
            </Select>
          </Form.Item>
          <Form.Item name="description" label="Description">
            <TextArea placeholder="Enter description" rows={3} />
          </Form.Item>
        </Form>
      </Modal>

      {/* Complex Modal */}
      <Modal
        title="Advanced Configuration"
        open={complexModalVisible}
        onCancel={() => setComplexModalVisible(false)}
        width={600}
        footer={null}
      >
        <Vertical style={{ gap: '20px' }}>
          <Card size="small" title="User Information">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <Texto category="p2" className="mb-1">Full Name</Texto>
                <Input value={sampleUser.name} />
              </div>
              <div>
                <Texto category="p2" className="mb-1">Email</Texto>
                <Input value={sampleUser.email} />
              </div>
            </div>
          </Card>

          <Card size="small" title="Permissions">
            <Vertical style={{ gap: '12px' }}>
              <Horizontal justifyContent="space-between" alignItems="center">
                <Texto category="p2">Can Edit Content</Texto>
                <Switch defaultChecked />
              </Horizontal>
              <Horizontal justifyContent="space-between" alignItems="center">
                <Texto category="p2">Can Delete Items</Texto>
                <Switch />
              </Horizontal>
              <Horizontal justifyContent="space-between" alignItems="center">
                <Texto category="p2">Admin Access</Texto>
                <Switch />
              </Horizontal>
            </Vertical>
          </Card>

          <Horizontal justifyContent="flex-end" style={{ gap: '10px' }}>
            <Button onClick={() => setComplexModalVisible(false)}>
              Cancel
            </Button>
            <Button type="primary" onClick={() => setComplexModalVisible(false)}>
              Save Changes
            </Button>
          </Horizontal>
        </Vertical>
      </Modal>

      <Divider />

      {/* Popover Section */}
      <Texto category="h4" style={{ color: "var(--theme-color-2)", marginBottom: "16px" }}>
        Popover Components
      </Texto>

      <Card title="Popover Variations" className="mb-4">
        <Horizontal style={{ gap: "20px", flexWrap: "wrap" }}>
          {/* Basic Popover */}
          <div>
            <Texto category="p2" className="mb-2">Basic Content:</Texto>
            <Popover content="This is basic popover content" title="Basic Popover">
              <Button>Hover for Popover</Button>
            </Popover>
          </div>

          {/* Menu Popover */}
          <div>
            <Texto category="p2" className="mb-2">Action Menu:</Texto>
            <Popover
              content={menuItems}
              title="Actions"
              trigger="click"
              open={menuPopoverVisible}
              onOpenChange={setMenuPopoverVisible}
              placement="bottomRight"
            >
              <Button icon={<MoreOutlined />}>Actions</Button>
            </Popover>
          </div>

          {/* Rich Content Popover */}
          <div>
            <Texto category="p2" className="mb-2">Rich Content:</Texto>
            <Popover
              content={richPopoverContent}
              title="User Profile"
              trigger="click"
              open={richPopoverVisible}
              onOpenChange={setRichPopoverVisible}
              placement="bottom"
            >
              <Button icon={<UserOutlined />}>User Info</Button>
            </Popover>
          </div>

          {/* Positioned Popover */}
          <div>
            <Texto category="p2" className="mb-2">Positioned:</Texto>
            <Popover
              content="Popover content positioned on the left"
              placement="left"
            >
              <Button>Left Popover</Button>
            </Popover>
          </div>
        </Horizontal>
      </Card>

      <Divider />

      {/* Popconfirm Section */}
      <Texto category="h4" style={{ color: "var(--theme-color-2)", marginBottom: "16px" }}>
        Popconfirm Components
      </Texto>

      <Card title="Popconfirm Variations" className="mb-4">
        <Horizontal style={{ gap: "20px", flexWrap: "wrap" }}>
          {/* Basic Delete Confirmation */}
          <div>
            <Texto category="p2" className="mb-2">Delete Action:</Texto>
            <Popconfirm
              title="Are you sure you want to delete this item?"
              onConfirm={() => handleDelete('item')}
              okText="Yes, Delete"
              cancelText="Cancel"
              okButtonProps={{ danger: true }}
            >
              <Button danger icon={<DeleteOutlined />}>
                Delete Item
              </Button>
            </Popconfirm>
          </div>

          {/* Status Change Confirmation */}
          <div>
            <Texto category="p2" className="mb-2">Status Change:</Texto>
            <Popconfirm
              title="Change status to active?"
              description="This will enable all features for this user."
              onConfirm={() => console.log('Status changed')}
              okText="Activate"
              cancelText="Keep Current"
              placement="top"
            >
              <Button type="primary" icon={<CheckCircleOutlined />}>
                Activate User
              </Button>
            </Popconfirm>
          </div>

          {/* Bulk Operation Confirmation */}
          <div>
            <Texto category="p2" className="mb-2">Bulk Operation:</Texto>
            <Popconfirm
              title="Delete 5 selected items?"
              description="This action cannot be undone."
              onConfirm={() => console.log('Bulk delete confirmed')}
              okText="Delete All"
              cancelText="Cancel"
              okButtonProps={{ danger: true }}
            >
              <Button icon={<DeleteOutlined />}>
                Delete Selected (5)
              </Button>
            </Popconfirm>
          </div>

          {/* Custom Confirmation */}
          <div>
            <Texto category="p2" className="mb-2">Custom Content:</Texto>
            <Popconfirm
              title={
                <div>
                  <Texto category="p1" style={{ fontWeight: 'bold' }}>
                    Permanent Action
                  </Texto>
                  <Texto category="p2" style={{ color: 'var(--theme-error)', marginTop: '4px' }}>
                    This will permanently remove all data.
                  </Texto>
                </div>
              }
              onConfirm={() => console.log('Permanent delete confirmed')}
              okText="I Understand, Delete"
              cancelText="Keep Data"
              okButtonProps={{ danger: true }}
              placement="topRight"
            >
              <Button danger>
                <WarningOutlined />
                Permanent Delete
              </Button>
            </Popconfirm>
          </div>
        </Horizontal>
      </Card>

      <Divider />

      {/* Tooltip Section */}
      <Texto category="h4" style={{ color: "var(--theme-color-2)", marginBottom: "16px" }}>
        Tooltip Components
      </Texto>

      <Card title="Tooltip Variations" className="mb-4">
        <Vertical style={{ gap: "20px" }}>
          {/* Basic Tooltips */}
          <div>
            <Texto category="p2" className="mb-3">Basic Tooltips:</Texto>
            <Horizontal style={{ gap: "16px", flexWrap: "wrap" }}>
              <Tooltip title="This is a simple tooltip">
                <Button>Simple Tooltip</Button>
              </Tooltip>

              <Tooltip title="Click to edit this field">
                <Button icon={<EditOutlined />} />
              </Tooltip>

              <Tooltip title="Download file">
                <Button type="primary" icon={<DownloadOutlined />} />
              </Tooltip>

              <Tooltip title="Settings and configuration options">
                <Button icon={<SettingOutlined />} />
              </Tooltip>
            </Horizontal>
          </div>

          {/* Positioning Examples */}
          <div>
            <Texto category="p2" className="mb-3">Positioning Options:</Texto>
            <div className="mb-2">
              <Radio.Group
                value={tooltipPosition}
                onChange={(e) => setTooltipPosition(e.target.value)}
                size="small"
              >
                <Radio.Button value="top">Top</Radio.Button>
                <Radio.Button value="bottom">Bottom</Radio.Button>
                <Radio.Button value="left">Left</Radio.Button>
                <Radio.Button value="right">Right</Radio.Button>
                <Radio.Button value="topLeft">Top Left</Radio.Button>
                <Radio.Button value="bottomRight">Bottom Right</Radio.Button>
              </Radio.Group>
            </div>
            <Tooltip title={`Tooltip positioned: ${tooltipPosition}`} placement={tooltipPosition as any}>
              <Button>Positioned Tooltip</Button>
            </Tooltip>
          </div>

          {/* Rich Content Tooltips */}
          <div>
            <Texto category="p2" className="mb-3">Rich Content Tooltips:</Texto>
            <Horizontal style={{ gap: "16px", flexWrap: "wrap" }}>
              <Tooltip
                title={
                  <div>
                    <Texto category="p2" style={{ color: 'white', fontWeight: 'bold' }}>
                      System Status
                    </Texto>
                    <div style={{ marginTop: '8px', display: 'grid', gridTemplateColumns: '80px 1fr', gap: '4px' }}>
                      <span style={{ color: '#91d5ff' }}>CPU:</span>
                      <span style={{ color: '#fff' }}>45%</span>
                      <span style={{ color: '#91d5ff' }}>Memory:</span>
                      <span style={{ color: '#fff' }}>2.1GB</span>
                      <span style={{ color: '#91d5ff' }}>Status:</span>
                      <span style={{ color: '#52c41a' }}>Healthy</span>
                    </div>
                  </div>
                }
                overlayStyle={{ maxWidth: '250px' }}
              >
                <Badge status="processing" text="System Info" />
              </Tooltip>

              <Tooltip
                title={
                  <div>
                    <Texto category="p2" style={{ color: 'white', fontWeight: 'bold', marginBottom: '6px' }}>
                      Truncated Content
                    </Texto>
                    <Texto category="p2" style={{ color: 'white' }}>
                      This is the full content that was truncated in the display.
                      It contains much more information than can be shown in the limited space.
                    </Texto>
                  </div>
                }
                overlayStyle={{ maxWidth: '300px' }}
              >
                <Tag className="text-ellipsis" style={{ maxWidth: "100px" }}>
                  Very Long Content That Gets Cut Off...
                </Tag>
              </Tooltip>

              <Tooltip
                title={
                  <div>
                    <Texto category="p2" style={{ color: 'white', fontWeight: 'bold' }}>
                      Interactive Help
                    </Texto>
                    <div className="mt-1">
                      <Texto category="p2" style={{ color: 'white' }}>
                        • Click to open editor
                      </Texto>
                      <Texto category="p2" style={{ color: 'white' }}>
                        • Double-click for quick edit
                      </Texto>
                      <Texto category="p2" style={{ color: 'white' }}>
                        • Right-click for context menu
                      </Texto>
                    </div>
                  </div>
                }
                placement="topLeft"
              >
                <Button icon={<QuestionCircleOutlined />} shape="circle" />
              </Tooltip>
            </Horizontal>
          </div>

          {/* Conditional Tooltips */}
          <div>
            <Texto category="p2" className="mb-3">Conditional Tooltips:</Texto>
            <Horizontal style={{ gap: "16px" }}>
              <Tooltip title="This field has an error" open={true}>
                <Input status="error" placeholder="Error field" style={{ width: '150px' }} />
              </Tooltip>

              <Tooltip title={undefined}>
                <Input placeholder="No tooltip when no error" style={{ width: '150px' }} />
              </Tooltip>

              <Tooltip title="Success: Validation passed">
                <Input
                  placeholder="Valid field"
                  suffix={<CheckCircleOutlined style={{ color: 'var(--theme-success)' }} />}
                  style={{ width: '150px' }}
                />
              </Tooltip>
            </Horizontal>
          </div>
        </Vertical>
      </Card>

      {/* Integration Examples */}
      <Card title="Integration Examples" className="mb-4" style={{ backgroundColor: "var(--theme-bg-elevated)" }}>
        <Vertical style={{ gap: "16px" }}>
          <div>
            <Texto category="p2" className="mb-3">Data Table Actions:</Texto>
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr auto',
              gap: '12px',
              padding: '12px',
              border: '1px solid var(--theme-color-3)',
              borderRadius: '6px'
            }}>
              <div>
                <Texto category="p1" style={{ fontWeight: 'bold' }}>
                  Sample Data Item
                </Texto>
                <Texto category="p2" style={{ color: 'var(--theme-color-3)' }}>
                  Description of the data item with some details
                </Texto>
              </div>
              <Horizontal style={{ gap: '8px' }}>
                <Tooltip title="View details">
                  <Button size="small" icon={<EyeOutlined />} />
                </Tooltip>
                <Tooltip title="Edit item">
                  <Button size="small" icon={<EditOutlined />} />
                </Tooltip>
                <Popover content={menuItems} trigger="click" placement="bottomRight">
                  <Button size="small" icon={<MoreOutlined />} />
                </Popover>
                <Popconfirm
                  title="Delete this item?"
                  onConfirm={() => console.log('Item deleted')}
                  placement="topRight"
                >
                  <Button size="small" icon={<DeleteOutlined />} danger />
                </Popconfirm>
              </Horizontal>
            </div>
          </div>

          <div>
            <Texto category="p2" className="mb-3">Form Field Helpers:</Texto>
            <Horizontal style={{ gap: "16px", alignItems: "end" }}>
              <div>
                <Texto category="p2" className="mb-1">
                  Username
                  <Tooltip title="Username must be 3-20 characters, alphanumeric only">
                    <QuestionCircleOutlined style={{ marginLeft: '6px', color: 'var(--theme-color-3)' }} />
                  </Tooltip>
                </Texto>
                <Input placeholder="Enter username" />
              </div>

              <div>
                <Texto category="p2" className="mb-1">Email</Texto>
                <Tooltip title="We'll never share your email address">
                  <Input placeholder="Enter email" suffix={<InfoCircleOutlined />} />
                </Tooltip>
              </div>

              <Popconfirm
                title="Clear all form fields?"
                description="This will reset the entire form."
                onConfirm={() => console.log('Form cleared')}
              >
                <Button icon={<CloseOutlined />}>Clear Form</Button>
              </Popconfirm>
            </Horizontal>
          </div>
        </Vertical>
      </Card>

      {/* Best Practices */}
      <Card title="Best Practices" className="mb-4">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
          <div>
            <Texto category="p1" style={{ fontWeight: 'bold', marginBottom: '12px' }}>
              Modal Guidelines:
            </Texto>
            <ul style={{ marginLeft: '16px', lineHeight: '1.6' }}>
              <li><Texto category="p2">Use for content requiring full attention</Texto></li>
              <li><Texto category="p2">Always provide clear close options</Texto></li>
              <li><Texto category="p2">Use destroyOnClose for forms</Texto></li>
              <li><Texto category="p2">Consider mobile responsiveness</Texto></li>
            </ul>
          </div>

          <div>
            <Texto category="p1" style={{ fontWeight: 'bold', marginBottom: '12px' }}>
              Overlay Guidelines:
            </Texto>
            <ul style={{ marginLeft: '16px', lineHeight: '1.6' }}>
              <li><Texto category="p2">Keep popover content concise</Texto></li>
              <li><Texto category="p2">Use appropriate trigger methods</Texto></li>
              <li><Texto category="p2">Position to avoid viewport issues</Texto></li>
              <li><Texto category="p2">Provide clear confirmation for destructive actions</Texto></li>
            </ul>
          </div>
        </div>
      </Card>
    </Vertical>
  );
}