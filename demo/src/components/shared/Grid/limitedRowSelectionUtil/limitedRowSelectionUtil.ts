import { SelectionChangedEvent } from 'ag-grid-community'
import { message } from 'antd'
import React from 'react'

export function checkRowSelectionLimit(
  e: SelectionChangedEvent,
  selectedRows: any[],
  setSelectedRows: React.Dispatch<React.SetStateAction<any[]>>,
  identifier: string,
  limit: number
) {
  const rows = e.api.getSelectedRows()
  if (rows.length > limit) {
    handleRowSelectionError(e, selectedRows, identifier, limit)
    return selectedRows
  }
  setSelectedRows(rows)
  return rows
}

export function handleRowSelectionError(
  e: SelectionChangedEvent,
  selectedRows: any[],
  identifier: string,
  limit: number
) {
  showRowSelectionError(limit)
  const nodes = e.api
    .getSelectedNodes()
    .filter((node) => !selectedRows.find((row) => row[identifier] === node.data[identifier]))
  e.api.setNodesSelected({ nodes, newValue: false })
}
export function showRowSelectionError(limit: number) {
  message.error(`You can only select up to ${limit} rows.`)
}
