import { BulkCellEditorHandle } from '@gravitate-js/excalibrr/dist/components/GraviGrid/index.types'
import { Horizontal } from '@gravitate-js/excalibrr'
import { DatePicker } from 'antd'
import { Dayjs } from 'dayjs'
import { forwardRef, useEffect, useImperativeHandle, useState } from 'react'

type DateEditorParams = {
  propKey: string
  placeholder?: string
  format?: string
  refreshBulkDrawerUI: () => void
}

export const BulkDateEditor = forwardRef<BulkCellEditorHandle<unknown>, DateEditorParams>(
  (props, ref) => {
    const { propKey, placeholder, format, refreshBulkDrawerUI } = props
    const [value, setValue] = useState<Dayjs | null>(null)

    useImperativeHandle(ref, () => ({
      getChanges: () => {
        if (!value) return {}
        return { [propKey]: value.toDate() }
      },
      isChangeReady: () => value !== null,
    }))

    useEffect(() => {
      refreshBulkDrawerUI?.()
    }, [value, refreshBulkDrawerUI])

    return (
      <Horizontal alignItems='center'>
        <DatePicker
          placeholder={placeholder || 'Select date'}
          value={value}
          onChange={(date) => setValue(date)}
          format={format || 'MMM D, YYYY'}
          style={{ minWidth: 200 }}
        />
      </Horizontal>
    )
  },
)
