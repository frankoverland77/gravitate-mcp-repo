import { Texto } from '@gravitate-js/excalibrr'
import { Tooltip } from 'antd'
import React from 'react'

export function ColumnFilterWithTooltip(params: any) {
  if (!params?.value?.toString()?.toLowerCase().includes('select all')) {
    return (
      <Tooltip title={params?.value}>
        <div>{params?.value || '(Blanks)'}</div>
      </Tooltip>
    )
  }
  return <Texto>{params?.value || '(Blanks)'}</Texto>
}
