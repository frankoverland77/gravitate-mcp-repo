import { suppressKeyboardEvent } from '@components/shared/Grid/cellEditors'
import { getYesNoFromBoolean } from '@components/shared/Grid/defaultColumnDefs/util'
import { BBDTag } from '@gravitate-js/excalibrr'
import React from 'react'

export const TrueFalseEditableColumn = (field: string, headerName: string, allowClear?: boolean) => ({
  field,
  headerName,
  cellEditor: 'SearchableSelect',
  suppressKeyboardEvent,
  cellEditorParams: {
    options: [
      {
        value: true,
        label: 'Yes',
      },
      {
        value: false,
        label: 'No',
      },
    ],
    allowClear,
    minWidth: 90,
  },
  cellRenderer: (params) => {
    const value = getYesNoFromBoolean(params.data?.[field])
    if (!value) return ''
    return (
      <BBDTag success={value === 'Yes'} error={value === 'No'} style={{ textAlign: 'center' }}>
        {value}
      </BBDTag>
    )
  },
  filter: 'agSetColumnFilter',
  valueGetter: (params) => params.data?.[field],
  filterValueGetter: (params) => getYesNoFromBoolean(params.data?.[field]),
})
