// Preview Notifications Tab - Placeholder for future implementation
// Will show preview of notifications to be sent

import { Vertical, Texto } from '@gravitate-js/excalibrr';
import { MailOutlined } from '@ant-design/icons';
import '../styles/SubscriptionManagement.css';

export function PreviewNotificationsTab() {
  return (
    <Vertical
      className="preview-placeholder"
      height="100%"
      justifyContent="center"
      alignItems="center"
    >
      <MailOutlined className="preview-placeholder-icon" />
      <Texto category="h3" appearance="medium">
        Preview Notifications
      </Texto>
      <Texto category="p2" appearance="medium">
        Coming soon - Preview and send price notifications to counterparties
      </Texto>
    </Vertical>
  );
}
