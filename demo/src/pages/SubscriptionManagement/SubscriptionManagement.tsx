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
      <Tabs defaultActiveKey="subscriptions" style={{ height: '100%' }} items={[
        {
          key: 'subscriptions',
          label: 'Subscription Management',
          children: <SubscriptionManagementTab />,
        },
        {
          key: 'content',
          label: <Tooltip title="Build default email templates for each quote configuration">Content Configuration (Email Template)</Tooltip>,
          children: <ContentConfigurationTab />,
        },
        {
          key: 'destinations',
          label: 'Notification Destinations',
          children: <NotificationDestinationsTab />,
        },
        {
          key: 'preview',
          label: 'Preview Notifications',
          children: <PreviewNotificationsTab />,
        },
      ]} />
    </Vertical>
  );
}
