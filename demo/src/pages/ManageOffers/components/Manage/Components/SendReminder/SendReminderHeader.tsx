import { SendOutlined } from '@ant-design/icons'
import { Horizontal, Texto } from '@gravitate-js/excalibrr'

export function SendReminderHeader() {
  return (
    <>
      <Horizontal verticalCenter className='gap-10' style={{ marginBottom: '10px' }} justifyContent='flex-start'>
        <SendOutlined
          className='send-reminder-icon ml-1'
          style={{ fontSize: '20px', color: 'var(--theme-color-1)' }}
        />
        <Texto style={{ fontSize: '20px' }}>Send reminders to customers</Texto>
      </Horizontal>
      <Texto weight='normal'>Select the customers you want to send reminders to</Texto>
    </>
  )
}
