import {
  NotificationMessage,
  NothingMessage,
  Horizontal,
  Vertical,
  Texto,
  GraviButton,
} from "@gravitate-js/excalibrr";
import {
  BellOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  WarningOutlined,
  InfoCircleOutlined,
  DatabaseOutlined,
  SearchOutlined,
  PlusOutlined,
  UploadOutlined,
  FileTextOutlined,
  TeamOutlined,
  ShoppingCartOutlined,
  MailOutlined,
  StarOutlined,
  CloudUploadOutlined,
} from "@ant-design/icons";
import { Button, Card, Input, Switch, Spin, Space, Divider } from "antd";
import { useState } from "react";

export function NotificationNothingExample() {
  // NotificationMessage demo state
  const [notificationCount, setNotificationCount] = useState(0);
  const [customTitle, setCustomTitle] = useState("Custom Title");
  const [customMessage, setCustomMessage] = useState("Custom notification message");
  const [isError, setIsError] = useState(false);

  // NothingMessage demo state
  const [isLoading, setIsLoading] = useState(false);
  const [hasData, setHasData] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Notification triggers
  const triggerSuccess = () => {
    const count = notificationCount + 1;
    setNotificationCount(count);
    NotificationMessage('Success', `Operation ${count} completed successfully!`, false);
  };

  const triggerError = () => {
    const count = notificationCount + 1;
    setNotificationCount(count);
    NotificationMessage('Error', `Operation ${count} failed. Please try again.`, true);
  };

  const triggerWarning = () => {
    const count = notificationCount + 1;
    setNotificationCount(count);
    NotificationMessage('Warning', `Operation ${count} completed with warnings.`, true);
  };

  const triggerInfo = () => {
    const count = notificationCount + 1;
    setNotificationCount(count);
    NotificationMessage('Information', `Operation ${count} - additional information available.`, false);
  };

  const triggerCustom = () => {
    NotificationMessage(customTitle, customMessage, isError);
  };

  const triggerFormSubmission = () => {
    NotificationMessage('Form Submitted', 'Your form has been submitted successfully and is being processed.', false);
  };

  const triggerValidationError = () => {
    NotificationMessage('Validation Error', 'Please check the required fields and try again.', true);
  };

  const triggerBulkOperation = () => {
    const itemCount = Math.floor(Math.random() * 10) + 1;
    NotificationMessage('Bulk Update Complete', `${itemCount} item(s) updated successfully`, false);
  };

  const triggerAPIError = () => {
    const errorMessage = "Network timeout occurred";
    NotificationMessage('Error', errorMessage || 'An unexpected error occurred', true);
  };

  const simulateLoading = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setHasData(Math.random() > 0.3); // 70% chance of having data
    }, 2000);
  };

  return (
    <Vertical style={{ maxWidth: "900px", margin: "0 auto" }}>
      <Texto className="mb-3" category="h3">
        Notification & Empty State Components
      </Texto>

      {/* NotificationMessage Section */}
      <Texto category="h4" style={{ color: "var(--theme-color-2)", marginBottom: "16px" }}>
        <BellOutlined className="mr-2" />
        NotificationMessage Component
      </Texto>

      {/* Basic Notification Types */}
      <Card title="Basic Notification Types" className="mb-4">
        <Texto category="p2" className="mb-3">
          Test different notification types with live examples:
        </Texto>
        <Horizontal style={{ gap: "12px", flexWrap: "wrap" }}>
          <Button
            type="primary"
            icon={<CheckCircleOutlined />}
            onClick={triggerSuccess}
          >
            Success
          </Button>
          <Button
            danger
            icon={<ExclamationCircleOutlined />}
            onClick={triggerError}
          >
            Error
          </Button>
          <Button
            style={{ backgroundColor: "#faad14", borderColor: "#faad14", color: "white" }}
            icon={<WarningOutlined />}
            onClick={triggerWarning}
          >
            Warning
          </Button>
          <Button
            icon={<InfoCircleOutlined />}
            onClick={triggerInfo}
          >
            Info
          </Button>
        </Horizontal>
        <Texto category="p2" className="mt-2" style={{ color: "var(--theme-color-3)" }}>
          Total notifications triggered: {notificationCount}
        </Texto>
      </Card>

      {/* Custom Notification Builder */}
      <Card title="Custom Notification Builder" className="mb-4">
        <Vertical style={{ gap: "12px" }}>
          <Horizontal style={{ gap: "12px", alignItems: "center", flexWrap: "wrap" }}>
            <div style={{ flex: "1", minWidth: "200px" }}>
              <Texto category="p2" className="mb-1">Title:</Texto>
              <Input
                value={customTitle}
                onChange={(e) => setCustomTitle(e.target.value)}
                placeholder="Notification title"
              />
            </div>
            <div style={{ flex: "2", minWidth: "300px" }}>
              <Texto category="p2" className="mb-1">Message:</Texto>
              <Input
                value={customMessage}
                onChange={(e) => setCustomMessage(e.target.value)}
                placeholder="Notification message"
              />
            </div>
          </Horizontal>
          <Horizontal style={{ gap: "12px", alignItems: "center" }}>
            <Texto category="p2">Error state:</Texto>
            <Switch checked={isError} onChange={setIsError} />
            <Button type="primary" onClick={triggerCustom}>
              Trigger Custom Notification
            </Button>
          </Horizontal>
        </Vertical>
      </Card>

      {/* Real-world Examples */}
      <Card title="Real-world Use Cases" className="mb-4">
        <Texto category="p2" className="mb-3">
          Common notification patterns used throughout applications:
        </Texto>
        <Space wrap>
          <Button onClick={triggerFormSubmission}>
            Form Submission
          </Button>
          <Button onClick={triggerValidationError} type="primary" danger>
            Validation Error
          </Button>
          <Button onClick={triggerBulkOperation}>
            Bulk Operation
          </Button>
          <Button onClick={triggerAPIError} danger>
            API Error
          </Button>
        </Space>
      </Card>

      <Divider style={{ margin: "32px 0" }} />

      {/* NothingMessage Section */}
      <Texto category="h4" style={{ color: "var(--theme-color-2)", marginBottom: "16px" }}>
        <FileTextOutlined className="mr-2" />
        NothingMessage Component
      </Texto>

      {/* Basic Empty States */}
      <Card title="Basic Empty States" className="mb-4">
        <Horizontal style={{ gap: "20px", flexWrap: "wrap" }}>
          <Card size="small" title="No Data" style={{ width: 280 }}>
            <NothingMessage
              title="No Items"
              message="No items are available to display."
            />
          </Card>

          <Card size="small" title="No Search Results" style={{ width: 280 }}>
            <NothingMessage
              title="No Results Found"
              message="Try adjusting your search criteria or filters."
            />
          </Card>

          <Card size="small" title="Empty Collection" style={{ width: 280 }}>
            <NothingMessage
              title="No Projects Yet"
              message="Get started by creating your first project."
            />
          </Card>
        </Horizontal>
      </Card>

      {/* Enhanced Empty States with Icons */}
      <Card title="Enhanced Empty States with Icons" className="mb-4">
        <Horizontal style={{ gap: "20px", flexWrap: "wrap" }}>
          <Card size="small" title="Database Empty" style={{ width: 280 }}>
            <NothingMessage
              title="No Data Available"
              message="Data will appear here when it's available."
              icon={<DatabaseOutlined style={{ fontSize: '48px', color: 'var(--theme-color-3)' }} />}
            />
          </Card>

          <Card size="small" title="No Search Results" style={{ width: 280 }}>
            <NothingMessage
              title="No Matches Found"
              message="Try different keywords or filters."
              icon={<SearchOutlined style={{ fontSize: '48px', color: 'var(--theme-color-3)' }} />}
            />
          </Card>

          <Card size="small" title="Empty Inbox" style={{ width: 280 }}>
            <NothingMessage
              title="No Messages"
              message="You're all caught up!"
              icon={<MailOutlined style={{ fontSize: '48px', color: 'var(--theme-success)' }} />}
            />
          </Card>
        </Horizontal>
      </Card>

      {/* Interactive Empty States */}
      <Card title="Interactive Empty States with Actions" className="mb-4">
        <Horizontal style={{ gap: "20px", flexWrap: "wrap" }}>
          <Card size="small" title="No Projects" style={{ width: 320 }}>
            <NothingMessage
              title="No Projects Yet"
              message="Create your first project to get started with managing your work."
              actions={[
                <GraviButton
                  key="create"
                  theme1
                  buttonText="Create Project"
                  icon={<PlusOutlined />}
                  onClick={() => NotificationMessage('Action', 'Create project clicked!', false)}
                />,
                <GraviButton
                  key="import"
                  appearance="outline"
                  buttonText="Import"
                  icon={<UploadOutlined />}
                  onClick={() => NotificationMessage('Action', 'Import project clicked!', false)}
                />
              ]}
            />
          </Card>

          <Card size="small" title="No Team Members" style={{ width: 320 }}>
            <NothingMessage
              title="No Team Members"
              message="Invite colleagues to collaborate on your projects."
              icon={<TeamOutlined style={{ fontSize: '48px', color: 'var(--theme-color-3)' }} />}
              actions={[
                <GraviButton
                  key="invite"
                  theme2
                  buttonText="Invite Members"
                  onClick={() => NotificationMessage('Action', 'Invite members clicked!', false)}
                />
              ]}
            />
          </Card>
        </Horizontal>
      </Card>

      {/* Loading and Dynamic States */}
      <Card title="Loading and Dynamic States" className="mb-4">
        <Vertical style={{ gap: "16px" }}>
          <Horizontal style={{ gap: "12px", alignItems: "center" }}>
            <Button onClick={simulateLoading} disabled={isLoading}>
              {isLoading ? 'Loading...' : 'Simulate Data Loading'}
            </Button>
            <Button onClick={() => setHasData(!hasData)} disabled={isLoading}>
              Toggle Data State
            </Button>
          </Horizontal>

          <Card size="small" style={{ minHeight: "200px" }}>
            {isLoading ? (
              <NothingMessage
                title="Loading..."
                message="Please wait while we fetch your data."
                icon={<Spin size="large" />}
              />
            ) : hasData ? (
              <div style={{ padding: "20px", textAlign: "center" }}>
                <Texto category="h5" style={{ color: "var(--theme-success)" }}>
                  <CheckCircleOutlined className="mr-2" />
                  Data Loaded Successfully
                </Texto>
                <Texto category="p2" className="mt-1">
                  Your data would be displayed here in a real application.
                </Texto>
              </div>
            ) : (
              <NothingMessage
                title="No Data Found"
                message="No records match your current criteria."
                icon={<DatabaseOutlined style={{ fontSize: '48px', color: 'var(--theme-color-3)' }} />}
                actions={[
                  <GraviButton
                    key="refresh"
                    buttonText="Refresh"
                    onClick={() => simulateLoading()}
                  />
                ]}
              />
            )}
          </Card>
        </Vertical>
      </Card>

      {/* Contextual Empty States */}
      <Card title="Contextual Empty States" className="mb-4">
        <Horizontal style={{ gap: "20px", flexWrap: "wrap" }}>
          <Card size="small" title="E-commerce" style={{ width: 280 }}>
            <NothingMessage
              title="Empty Cart"
              message="Add some items to your cart to get started."
              icon={<ShoppingCartOutlined style={{ fontSize: '48px', color: 'var(--theme-color-3)' }} />}
            />
          </Card>

          <Card size="small" title="Favorites" style={{ width: 280 }}>
            <NothingMessage
              title="No Favorites Yet"
              message="Mark items as favorites to see them here."
              icon={<StarOutlined style={{ fontSize: '48px', color: 'var(--theme-warning)' }} />}
            />
          </Card>

          <Card size="small" title="File Upload" style={{ width: 280 }}>
            <NothingMessage
              title="No Files Uploaded"
              message="Drag and drop files here or click to upload."
              icon={<CloudUploadOutlined style={{ fontSize: '48px', color: 'var(--theme-primary)' }} />}
            />
          </Card>
        </Horizontal>
      </Card>

      {/* Search-based Empty State */}
      <Card title="Search-based Empty State" className="mb-4">
        <Vertical style={{ gap: "12px" }}>
          <Horizontal style={{ gap: "12px" }}>
            <Input
              placeholder="Search for items..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              prefix={<SearchOutlined />}
              style={{ flex: 1 }}
            />
            <Button onClick={() => setSearchQuery("")}>Clear</Button>
          </Horizontal>

          <Card size="small" style={{ minHeight: "150px" }}>
            {searchQuery ? (
              <NothingMessage
                title="No Search Results"
                message={`No results found for "${searchQuery}". Try different keywords.`}
                icon={<SearchOutlined style={{ fontSize: '40px', color: 'var(--theme-color-3)' }} />}
              />
            ) : (
              <div style={{ padding: "20px", textAlign: "center" }}>
                <Texto category="p1">Enter a search term to see results</Texto>
              </div>
            )}
          </Card>
        </Vertical>
      </Card>

      {/* Best Practices Summary */}
      <Card title="Usage Guidelines" className="mb-4" style={{ backgroundColor: "var(--theme-bg-elevated)" }}>
        <Vertical style={{ gap: "12px" }}>
          <div>
            <Texto category="p1" style={{ fontWeight: "bold", marginBottom: "8px" }}>
              NotificationMessage Best Practices:
            </Texto>
            <ul className="ml-2">
              <li><Texto category="p2">Use descriptive titles and helpful messages</Texto></li>
              <li><Texto category="p2">Set isError=false for success, isError=true for errors/warnings</Texto></li>
              <li><Texto category="p2">Provide specific error information when possible</Texto></li>
              <li><Texto category="p2">Use consistent language for similar actions</Texto></li>
            </ul>
          </div>

          <div>
            <Texto category="p1" style={{ fontWeight: "bold", marginBottom: "8px" }}>
              NothingMessage Best Practices:
            </Texto>
            <ul className="ml-2">
              <li><Texto category="p2">Explain why the state is empty and what users can do</Texto></li>
              <li><Texto category="p2">Use appropriate icons to reinforce the message</Texto></li>
              <li><Texto category="p2">Provide actionable next steps when possible</Texto></li>
              <li><Texto category="p2">Distinguish between loading and truly empty states</Texto></li>
            </ul>
          </div>
        </Vertical>
      </Card>
    </Vertical>
  );
}