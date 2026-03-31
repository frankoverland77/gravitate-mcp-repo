import { SearchOutlined } from '@ant-design/icons'
import { Horizontal, Texto, Vertical } from '@gravitate-js/excalibrr'
import type { EngagementStage } from '../../../../../utils/Utils/CustomerEngagementHelpers'
import { getStageIcon } from '../../../../../utils/Utils/CustomerEngagementHelpers'
import { Input, Modal } from 'antd'
import { type Dispatch, type SetStateAction, useMemo, useState } from 'react'

type ViewCustomersProps = {
  viewCustomersModalOpen: boolean
  setViewCustomersModalOpen: Dispatch<SetStateAction<boolean>>
  stage: EngagementStage | null
}

export function ViewCustomers({ viewCustomersModalOpen, setViewCustomersModalOpen, stage }: ViewCustomersProps) {
  const [searchInput, setSearchInput] = useState<string>('')

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setSearchInput(event.currentTarget.value)
  }

  const filteredCustomers = useMemo(() => {
    const filtered = stage?.customers?.filter((customer) =>
      [customer].some((v) => v.toLowerCase().includes(searchInput?.toLowerCase()))
    )
    return searchInput ? filtered : stage?.customers
  }, [searchInput, stage?.customers])

  return (
    <Modal
      centered
      open={viewCustomersModalOpen}
      onCancel={() => setViewCustomersModalOpen(false)}
      footer={null}
      wrapClassName='customer-engagement-view-customers-modal'
      destroyOnHidden
    >
      <Vertical>
        <div>
          <Horizontal verticalCenter className='gap-10' style={{ marginBottom: '10px' }} justifyContent='flex-start'>
            <span style={{ fontSize: 20, color: 'var(--theme-color-1)' }}>
              {stage ? getStageIcon(stage.key) : null}
            </span>
            <Texto category='h3'>{stage?.title}</Texto>
          </Horizontal>
          <Texto category='p1' appearance='medium'>
            {stage?.count} customers
          </Texto>
        </div>
        <Horizontal className='mt-4'>
          <Input
            className='view-customer-search-input'
            placeholder='Search customers...'
            size='large'
            value={searchInput}
            allowClear
            prefix={<SearchOutlined className='mr-1' />}
            onChange={(e) => handleSearchChange(e)}
          />
        </Horizontal>
        <Vertical className='mt-4' style={{ height: '500px' }} scroll>
          {filteredCustomers?.map((customer) => (
            <Texto className='my-2' category='p1' key={customer}>
              {customer?.toUpperCase()}
            </Texto>
          ))}
        </Vertical>
        <Horizontal className='mt-4'>
          <Texto>
            Showing {filteredCustomers?.length} of {stage?.customers?.length} customers
          </Texto>
        </Horizontal>
      </Vertical>
    </Modal>
  )
}
