import '../../styles.css'

import { ArrowLeftOutlined } from '@ant-design/icons'
import { GraviButton, Horizontal, Texto, Vertical } from '@gravitate-js/excalibrr'
import type { SpecialOffer } from '../../ManageOffers.types'
import { mockBreakdownData } from '../../ManageOffers.data'
import { EngagementView } from './Components/EngagementView/EngagementView'
import { OfferInfo } from './Components/OfferInfo/OfferInfo'
import { SendReminderModal } from './Components/SendReminder/SendReminderModal'
import { Drawer, Tabs } from 'antd'
import { type Dispatch, type SetStateAction, useState } from 'react'

type ViewTab = 'Engagement' | 'Timeline'

interface ManageSpecialOfferProps {
  isShowingManage: boolean
  setIsShowingManage: Dispatch<SetStateAction<boolean>>
  selectedSpecialOffer: SpecialOffer | null
  canWrite: boolean
}

export function ManageSpecialOffer({
  isShowingManage,
  setIsShowingManage,
  selectedSpecialOffer,
  canWrite,
}: ManageSpecialOfferProps) {
  // Use mock breakdown data directly instead of API call
  const specialOfferDetails = mockBreakdownData
  const isLoading = false

  const [activeView, setActiveView] = useState<ViewTab>('Engagement')
  const [sendReminderModalOpen, setSendReminderModalOpen] = useState(false)

  const handleClose = () => {
    setIsShowingManage(false)
  }

  if (!selectedSpecialOffer) {
    return (
      <Drawer
        width='100%'
        open={isShowingManage}
        onClose={handleClose}
        title='Manage Offer'
        styles={{ body: { backgroundColor: 'var(--bg-2)' } }}
        destroyOnHidden
      >
        <Vertical className='m-5'>
          <Vertical flex='1' style={{ maxHeight: '300px' }}>
            <div style={{ textAlign: 'center', padding: '60px 0', color: '#999' }}>
              <Texto category='h4'>No Data</Texto>
              <Texto>No data available for the selected offer</Texto>
            </div>
          </Vertical>
          <Horizontal flex='1' horizontalCenter style={{ marginTop: '20px' }}>
            <GraviButton
              onClick={handleClose}
              buttonText={
                <Horizontal verticalCenter className='gap-10 p-0'>
                  <ArrowLeftOutlined />
                  <Texto>Back to Offers</Texto>
                </Horizontal>
              }
            />
          </Horizontal>
        </Vertical>
      </Drawer>
    )
  }

  return (
    <Drawer
      width='100%'
      open={isShowingManage}
      onClose={handleClose}
      title='Manage Offer'
      styles={{ body: { backgroundColor: 'var(--bg-2)' } }}
      destroyOnHidden
    >
      <div>
        <Vertical className='gap-20' style={{ maxWidth: '1200px', margin: '0 auto', height: '100%' }}>
          <GraviButton
            className='ghost-gravi-button p-0'
            buttonText={
              <Horizontal verticalCenter className='gap-10 p-0'>
                <ArrowLeftOutlined />
                <Texto>Back to Offers</Texto>
              </Horizontal>
            }
            onClick={handleClose}
          />
          <OfferInfo
            selectedSpecialOffer={selectedSpecialOffer}
            data={specialOfferDetails}
            isLoading={isLoading}
            canWrite={canWrite}
            onSendReminder={() => {
              setSendReminderModalOpen(true)
            }}
            onCloseDeal={() => {
              /* placeholder */
            }}
          />
          <SendReminderModal
            data={specialOfferDetails}
            sendReminderModalOpen={sendReminderModalOpen}
            setSendReminderModalOpen={setSendReminderModalOpen}
          />
          <Tabs
            className='offer-view-tabs'
            activeKey={activeView}
            onChange={(k) => setActiveView(k as ViewTab)}
            tabBarGutter={8}
            size='large'
            items={[
              {
                key: 'Engagement',
                label: 'Engagement',
                children: <EngagementView data={specialOfferDetails} loading={isLoading} />,
              },
              {
                key: 'Timeline',
                label: 'Timeline',
                children: (
                  <div style={{ padding: 40, textAlign: 'center', color: '#999' }}>
                    <Texto>Timeline view coming soon</Texto>
                  </div>
                ),
              },
            ]}
          />
        </Vertical>
      </div>
    </Drawer>
  )
}
