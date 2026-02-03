// Subscription Management - Main page with tabbed navigation
// Based on Gravitate ManagePriceNotifications module patterns and Reece's mockup designs

import { Vertical } from '@gravitate-js/excalibrr';
import { Tabs, Tooltip } from 'antd';
import { ContentConfigurationTab } from './tabs/ContentConfigurationTab';
import { SubscriptionManagementTab } from './tabs/SubscriptionManagementTab';
import { NotificationDestinationsTab } from './tabs/NotificationDestinationsTab';
import { PreviewNotificationsTab } from './tabs/PreviewNotificationsTab';
import './styles/SubscriptionManagement.css';

export function SubscriptionManagement() {
  return (
    <Vertical className="subscription-tabs-container" height="100%">
      <Tabs defaultActiveKey="subscriptions" style={{ height: '100%' }}>
        <Tabs.TabPane tab="Subscription Management" key="subscriptions">
          <SubscriptionManagementTab />
        </Tabs.TabPane>
        <Tabs.TabPane tab={<Tooltip title="Build default email templates for each quote configuration">Content Configuration (Email Template)</Tooltip>} key="content">
          <ContentConfigurationTab />
        </Tabs.TabPane>
        <Tabs.TabPane tab="Notification Destinations" key="destinations">
          <NotificationDestinationsTab />
        </Tabs.TabPane>
        <Tabs.TabPane tab="Preview Notifications" key="preview">
          <PreviewNotificationsTab />
        </Tabs.TabPane>
      </Tabs>
    </Vertical>
  );
}
