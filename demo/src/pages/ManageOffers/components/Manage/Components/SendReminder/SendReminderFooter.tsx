import { GraviButton, Horizontal } from '@gravitate-js/excalibrr'
import type { FormInstance } from 'antd'

type SendReminderFooterProps = {
  onClose: () => void
  currentValue: any[]
  form: FormInstance
  isLoading: boolean
}

export function SendReminderFooter({ isLoading, onClose, form, currentValue }: SendReminderFooterProps) {
  return (
    <Horizontal className='send-reminder-footer-container'>
      <GraviButton buttonText='Cancel' onClick={onClose} disabled={isLoading} />
      <GraviButton
        buttonText={`Send Reminders (${currentValue?.length ?? 0})`}
        disabled={!currentValue || currentValue.length < 1}
        onClick={() => form.submit()}
        loading={isLoading}
      />
    </Horizontal>
  )
}
