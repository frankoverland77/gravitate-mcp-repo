import './BulkChangeDrawer.css'

import {
  BBDTag,
  DataItem,
  ErrorNotification,
  GraviButton,
  GraviGrid,
  Horizontal,
  Texto,
  Vertical,
} from '@gravitate-js/excalibrr'
import { Col, Drawer, Form, Row, Select } from 'antd'
import React, { useMemo } from 'react'

// antd will supply value and onChange through Form.Item
interface SearchInputProps {
  value?: string
  onChange?: (value: string) => void
  options: { value: string; label: string }[]
}

function SearchInput({ value, onChange, options }: SearchInputProps) {
  return (
    <Select
      showSearch
      style={{ width: '100%' }}
      placeholder='Please select'
      value={value}
      onChange={onChange}
      options={options}
      filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
    />
  )
}

const editableFields = [
  { key: 'PricePeriodStartOffset', label: 'Price Effective', optionsKey: 'PricePeriodStartOffsets' },
  { key: 'TargetUnitOfMeasureId', label: 'Target UOM', optionsKey: 'UnitOfMeasures' },
  { key: 'AlternateValuationProductId', label: 'Product Override', optionsKey: 'Products' },
  { key: 'StatusCvId', label: 'Is Active', optionsKey: 'StatusCodeValues' },
] as const

export function BulkChangeDrawer({
  setIsBulkChangeVisible,
  isBulkChangeVisible,
  columnDefs,
  selectedRows,
  handleSubmit,
  metadata,
}) {
  const [form] = Form.useForm()
  const drawerColumnDefs = useMemo(() => {
    const columnCopy = [...columnDefs]
    columnCopy[0] = {
      ...columnCopy[0],
      checkboxSelection: false,
      headerCheckboxSelection: false,
      headerCheckboxSelectionFilteredOnly: false,
    }
    columnCopy[columnCopy.length - 1] = {
      field: 'StatusCvId',
      headerName: 'Is Active',
      cellRenderer: ({ data }) => (
        <div>{data?.StatusCvId == 100 ? <BBDTag theme2>Enabled</BBDTag> : <BBDTag>Disabled</BBDTag>}</div>
      ),
    }
    return columnCopy
  }, [columnDefs])

  return (
    <Drawer
      placement='bottom'
      onClose={() => setIsBulkChangeVisible(false)}
      open={isBulkChangeVisible}
      title='Bulk Strategy Change'
      height='80vh'
      styles={{ body: { padding: '0px' } }}
      destroyOnHidden
    >
      <Form
        form={form}
        style={{ height: '100%' }}
        onFinish={(formValues) => {
          form.resetFields()
          handleSubmit(formValues)
        }}
        onFinishFailed={ErrorNotification}
      >
        <Vertical flex='1'>
          <div className='p-3  bg-theme2 bg-3'>
            <Texto category='p2' appearance='white'>
              <b>Selected Rows - </b> You have selected the following rows to modify:
            </Texto>
          </div>
          <div className='p-3' style={{ flex: 1 }}>
            <GraviGrid
              controlBarProps={{
                title: 'Selected Rows',
              }}
              agPropOverrides={{
                columnDefs: drawerColumnDefs,
              }}
              rowGroupPanelShow='never'
              storageKey='tank-strategy-bulk-change'
              rowData={selectedRows}
            />
          </div>
          <div
            style={{ background: 'var(--theme-color-2-dim)', width: 1200, alignSelf: 'center' }}
            className=' bordered round-border p-3 m-3'
          >
            <Row
              align='center'
              style={{ alignItems: 'center', gap: '1em', padding: 20 }}
              className='quote-bulk-update-form'
            >
              <Col span={6}>
                <Texto category='heading' appearance='medium'>
                  Update Values
                </Texto>
              </Col>
              {editableFields.map((field) => (
                <Col className='title' span={3} align='left'>
                  <DataItem label={field.label}>
                    <Form.Item name={field.key}>
                      <SearchInput
                        options={metadata?.Data?.[field.optionsKey]?.map((o) => ({ value: o.Value, label: o.Text }))}
                      />
                    </Form.Item>
                  </DataItem>
                </Col>
              ))}
            </Row>
          </div>
          <Vertical flex='0' justifyContent='flex-end' style={{ minHeight: 70 }}>
            <Horizontal verticalCenter className='p-3 bg-3'>
              <Texto style={{ flex: 1 }} category='p2' weight='bold'>
                <b>Save Bulk Change - </b> Fields not entered will lock in existing values.
              </Texto>
              <GraviButton className='mr-3' buttonText='Cancel' onClick={() => setIsBulkChangeVisible(false)} />
              <GraviButton buttonText='Save Bulk Changes' success onClick={form.submit} />
            </Horizontal>
          </Vertical>
        </Vertical>
      </Form>
    </Drawer>
  )
}
