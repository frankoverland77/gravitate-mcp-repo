import { NotificationMessage } from '@gravitate-js/excalibrr'

export interface UpdateNotificationMessageProps {
  response: any
  numberOfRecords?: number
  title?: string
}
export function UpdateNotificationMessage({ response, numberOfRecords, title }: UpdateNotificationMessageProps) {
  if (response?.Validations?.length > 0) {
    response.Validations.forEach((validation) => {
      NotificationMessage('Error Saving', validation.Message, true)
    })
  } else {
    NotificationMessage(title ?? 'Save Successful', `${numberOfRecords} record(s) saved successfully`, false)
  }
}
