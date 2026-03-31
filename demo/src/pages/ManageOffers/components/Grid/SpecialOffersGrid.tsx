import { PlusOutlined, ThunderboltOutlined } from '@ant-design/icons'
import { GraviButton, GraviGrid, Horizontal } from '@gravitate-js/excalibrr'
import type { GridApi } from 'ag-grid-community'
import type { Dispatch, SetStateAction } from 'react'
import { useMemo, useRef } from 'react'

import type { SpecialOffer, SpecialOfferMetadataResponseData } from '../../ManageOffers.types'
import { SpecialOffersColumns } from './ColumnDefs'

interface SpecialOffersGridProps {
  isFetching: boolean
  rowData?: SpecialOffer[]
  setIsShowingCreateNew: Dispatch<SetStateAction<boolean>>
  setIsShowingQuickSetup: Dispatch<SetStateAction<boolean>>
  isShowingManage: boolean
  setIsShowingManage: Dispatch<SetStateAction<boolean>>
  setSelectedSpecialOffer: Dispatch<SetStateAction<SpecialOffer | null>>
  canWrite: boolean
  metadata?: SpecialOfferMetadataResponseData
}

export const SpecialOffersGrid: React.FC<SpecialOffersGridProps> = ({
  isFetching,
  rowData,
  setIsShowingCreateNew,
  setIsShowingQuickSetup,
  isShowingManage,
  setIsShowingManage,
  setSelectedSpecialOffer,
  canWrite,
  metadata,
}) => {
  const gridRef = useRef<GridApi>() as React.MutableRefObject<GridApi>

  const columnDefs = useMemo(
    () => SpecialOffersColumns({ isShowingManage, setIsShowingManage, setSelectedSpecialOffer }),
    [rowData, isFetching, isShowingManage]
  )

  const controlBarProps = useMemo(() => ({
    title: 'Offers',
    hideActiveFilters: false,
    actionButtons: canWrite && (
      <Horizontal gap={8}>
        <GraviButton
          icon={<ThunderboltOutlined />}
          buttonText='Quick Setup'
          onClick={() => setIsShowingQuickSetup(true)}
          disabled={!metadata}
        />
        <GraviButton
          theme1
          icon={<PlusOutlined />}
          buttonText='Create New'
          onClick={() => setIsShowingCreateNew(true)}
          disabled={!metadata}
        />
      </Horizontal>
    ),
  }), [canWrite, metadata])

  const agPropOverrides = useMemo(() => ({
    getRowId: (row: any) => row?.data?.SpecialOfferId?.toString(),
  }), [])

  return (
    <GraviGrid
      storageKey='ManageOffersGrid'
      externalRef={gridRef}
      controlBarProps={controlBarProps}
      agPropOverrides={agPropOverrides}
      columnDefs={columnDefs}
      rowData={rowData}
      loading={isFetching}
    />
  )
}
