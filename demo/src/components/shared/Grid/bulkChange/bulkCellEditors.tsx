import { BulkCellEditorHandle } from '@gravitate-js/excalibrr/dist/components/GraviGrid/index.types'
import { toAntOption } from '@utils/index'
import { Select, SelectProps } from 'antd'
import React, { CSSProperties, forwardRef, useEffect, useImperativeHandle, useState } from 'react'

type CellEditorParams = {
  options: any
  propKey: string
  refreshBulkDrawerUI: () => void
  selectEditorProps: SelectProps<any>
  selectEditorStyle: CSSProperties
}

export const BulkSelectEditor = forwardRef<BulkCellEditorHandle<any>, CellEditorParams>((props, ref) => {
  const [state, setState] = useState<Record<string, string>>({})

  const setDynamicState = (key: string, value: string) => {
    setState((prevState) => ({
      ...prevState,
      [key]: value,
    }))
  }

  const dynamicValue = state[props.propKey]

  useImperativeHandle(ref, () => ({
    getChanges: () => ({ [props.propKey]: dynamicValue }),
    isChangeReady: () => !!dynamicValue,
  }))

  useEffect(props.refreshBulkDrawerUI, [dynamicValue])

  return (
    <Select
      placeholder='Select option'
      showSearch
      style={{ ...props.selectEditorStyle, minWidth: 260 }}
      value={dynamicValue}
      onChange={(value) => setDynamicState(props.propKey, value)}
      options={props?.options?.map(toAntOption) ?? []}
      filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
      {...props.selectEditorProps}
    />
  )
})
