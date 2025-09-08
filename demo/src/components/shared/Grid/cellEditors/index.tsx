import { GridApi, ICellEditorParams } from 'ag-grid-community'
import { DatePicker } from 'antd'
import moment from 'moment'
import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react'

export type DropdownOption = {
  value: string | number
  label: string
}

export type IProps = ICellEditorParams & {
  defaultOpen?: boolean
  api: GridApi
  value: any
  options: DropdownOption[]
  showSearch?: boolean
  allowClear?: boolean
  picker?: any
  mode?: 'multiple' | 'tags'
  closeOnBlur?: boolean
  defaultValue?: any
  showSelectedValue?: boolean
  matchOptionId?: string
}

export const DateEditor: React.FC<IProps> = forwardRef((props, ref) => {
  const refInput = useRef(null)
  const [selectedDate, setSelectedDate] = useState(moment(props?.defaultValue))
  useEffect(() => {
    // focus on the input
    refInput.current.focus()
  }, [])

  const [date, setDate] = useState(moment(props.value))
  const [editing, setEditing] = useState(true)

  useEffect(() => {
    if (!editing) {
      props.api.stopEditing()
    }
  }, [editing])

  /* Component Editor Lifecycle methods */
  useImperativeHandle(ref, () => {
    return {
      // the final value to send to the grid, on completion of editing
      getValue() {
        // this simple editor doubles any value entered into the input
        return selectedDate.startOf('day')
      },

      // Gets called once before editing starts, to give editor a chance to
      // cancel the editing before it even starts.
      isCancelBeforeStart() {
        return false
      },

      // Gets called once when editing is finished (eg if Enter is pressed).
      // If you return true, then the result of the edit will be ignored.
      isCancelAfterEnd() {
        return (
          typeof selectedDate === 'undefined' ||
          selectedDate === null ||
          selectedDate?.isSame(moment(props?.data?.effective_from))
        )
      },
    }
  })

  const onChange = (selectedDate) => {
    setDate(selectedDate)
    setSelectedDate(selectedDate)
    setEditing(false)
  }

  return <DatePicker ref={refInput} onChange={onChange} value={date} picker={props?.picker} />
})

// When using a select component for a cell editor, we need to prevent the editor from closing when the user presses Enter.
// Because we're overridingh the entire keyDown event, we need to re-implement the tabToNextCell functionality.
export const stopCloseOnEnter = (params) => (e) => {
  switch (e.code) {
    case 'Enter':
      e.stopPropagation()
      break
    case 'Tab':
      params?.api?.tabToNextCell()
    default:
      break
  }
}

export const suppressKeyboardEvent = (params) => {
  const { key } = params.event
  const { editing } = params // true if the editor is open

  if (key === 'Enter') {
    if (editing) {
      // suppress ag grid enter behavior when editor is open
      return true
    }
    // allow enter to open the editor if not already editing
    return false
  }
  return false // allow other keys
}
