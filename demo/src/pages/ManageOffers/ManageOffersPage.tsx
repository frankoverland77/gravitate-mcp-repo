import './styles.css'

import { useState } from 'react'

import { SpecialOffersGrid } from './components/Grid/SpecialOffersGrid'
import { CreateNewSpecialOffer } from './components/CreateNew/CreateNewSpecialOffer'
import { ManageSpecialOffer } from './components/Manage/ManageSpecialOffer'
import { QuickSetupPanel } from './components/QuickSetup/QuickSetupPanel'
import { mockSpecialOffers, mockMetadata } from './ManageOffers.data'
import type { SpecialOffer } from './ManageOffers.types'

export function ManageOffersPage() {
  const [isShowingCreateNew, setIsShowingCreateNew] = useState(false)
  const [isShowingManage, setIsShowingManage] = useState(false)
  const [isShowingQuickSetup, setIsShowingQuickSetup] = useState(false)
  const [selectedSpecialOffer, setSelectedSpecialOffer] = useState<SpecialOffer | null>(null)

  const rowData = mockSpecialOffers
  const isFetching = false
  const metadata = mockMetadata
  const canWrite = true

  const handleOpenFullWizard = () => {
    setIsShowingQuickSetup(false)
    setIsShowingCreateNew(true)
  }

  return (
    <div style={{ height: '99%', width: '100%' }}>
      <SpecialOffersGrid
        isFetching={isFetching}
        rowData={rowData}
        setIsShowingCreateNew={setIsShowingCreateNew}
        setIsShowingQuickSetup={setIsShowingQuickSetup}
        isShowingManage={isShowingManage}
        setIsShowingManage={setIsShowingManage}
        setSelectedSpecialOffer={setSelectedSpecialOffer}
        canWrite={canWrite}
        metadata={metadata}
      />
      <CreateNewSpecialOffer
        isShowingCreateNew={isShowingCreateNew}
        setIsShowingCreateNew={setIsShowingCreateNew}
        metadata={metadata}
      />
      <ManageSpecialOffer
        isShowingManage={isShowingManage}
        setIsShowingManage={setIsShowingManage}
        selectedSpecialOffer={selectedSpecialOffer}
        canWrite={canWrite}
      />
      <QuickSetupPanel
        open={isShowingQuickSetup}
        onClose={() => setIsShowingQuickSetup(false)}
        metadata={metadata}
        onOpenFullWizard={handleOpenFullWizard}
      />
    </div>
  )
}
