import { InfoCircleOutlined } from '@ant-design/icons'
import { Horizontal, Texto } from '@gravitate-js/excalibrr'

export function SendReminderErrorBanner() {
  return (
    <Horizontal className='send-reminder-banner-container'>
      <Texto appearance='error'>
        <InfoCircleOutlined />
      </Texto>
      <Texto category='p1' appearance='error'>
        Please select at least one customer to send reminders to
      </Texto>
    </Horizontal>
  )
}
