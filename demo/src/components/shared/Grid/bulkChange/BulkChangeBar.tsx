import { BoxPlotFilled } from '@ant-design/icons'
import { GraviButton, Texto } from '@gravitate-js/excalibrr'
import { Col, Row } from 'antd'
import React, { useState } from 'react'

// import { handleRemove } from './helpers'

export function BulkChangeBar({ selectedRows, setIsBulkChangeVisible, refetch }) {
  const [loading, setLoading] = useState()
  if (selectedRows.length > 0) {
    return (
      <Row className='p-3 bg-theme2'>
        <Col className='title vertical-flex-center px-3' span={16} align='left'>
          <Texto appearance='white' className='tank-override-count-text'>
            <b>
              {selectedRows.length} quote{selectedRows.length > 1 ? 's' : ''} selected to override.
            </b>{' '}
            You can bulk change values here.
          </Texto>
        </Col>

        <Col span={8} className='flex items-center h-100 py-3 justify-end'>
          <div className='tank-override-button'>
            <GraviButton
              theme2
              style={{ background: 'var(--gray-200)' }}
              appearance='outlined'
              buttonText='Bulk Change Quotes'
              onClick={() => setIsBulkChangeVisible(true)}
              className='mr-3'
              icon={<BoxPlotFilled />}
            />
          </div>
        </Col>
      </Row>
    )
  }
  return (
    <div className='bg-3 p-4'>
      <Texto category='h5' weight='bold' appearance='medium'>
        Select quote(s) to override
      </Texto>
    </div>
  )
}
