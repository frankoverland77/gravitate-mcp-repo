import '../../../ManageOffers/styles.css'

import { EyeOutlined } from '@ant-design/icons'
import { BBDTag, GraviButton, Horizontal } from '@gravitate-js/excalibrr'
import type { ColDef } from 'ag-grid-community'
import classNames from 'classnames'
import dayjs from 'dayjs'
import type { Dispatch, SetStateAction } from 'react'

import type { SpecialOffer } from '../../ManageOffers.types'
import { addCommasToNumber, dateFormat, fmt } from '../../utils/formatters'

interface SpecialOfferColumnsProps {
  isShowingManage: boolean
  setIsShowingManage: Dispatch<SetStateAction<boolean>>
  setSelectedSpecialOffer: Dispatch<SetStateAction<SpecialOffer | null>>
}

export const SpecialOffersColumns = ({
  setIsShowingManage,
  setSelectedSpecialOffer,
}: SpecialOfferColumnsProps): ColDef[] => {
  return [
    OfferId(),
    Type(),
    Name(),
    Product(),
    Location(),
    Volume(),
    AcceptedVolume(),
    VolumePercent(),
    Status(),
    Response(),
    PendingSubmissions(),
    VisibilityWindow(),
    LiftingWindow(),
    Created(),
    CreatedBy(),
    Actions(setIsShowingManage, setSelectedSpecialOffer),
  ]
}

const isDefinedAndNotNull = (v: any) => v !== undefined && v !== null

const OfferId = (): ColDef => ({
  headerName: 'Offer ID',
  field: 'SpecialOfferId',
})

const Type = (): ColDef => ({
  headerName: 'Type',
  field: 'Type',
})

const Name = (): ColDef => ({
  headerName: 'Name',
  field: 'Name',
})

const Product = (): ColDef => ({
  headerName: 'Product',
  field: 'Product',
})

const Location = (): ColDef => ({
  headerName: 'Location',
  field: 'Location',
})

const Volume = (): ColDef => ({
  headerName: 'Volume',
  field: 'Volume',
  valueFormatter: ({ value }: any) => `${addCommasToNumber(value)} gal`,
})

const Status = (): ColDef => ({
  headerName: 'Status',
  field: 'Status',
  cellRenderer: ({ data, value }: any) => {
    const activeStatus = data?.Status === 'Active'
    const completedStatus = data?.Status === 'Completed'
    return (
      <Horizontal width='100%' height='100%' horizontalCenter verticalCenter>
        <BBDTag
          className={classNames('columns-bbd-tag', completedStatus ? 'columns-bbd-tag-completed' : '')}
          success={activeStatus}
        >
          {value}
        </BBDTag>
      </Horizontal>
    )
  },
})

const Response = (): ColDef => ({
  headerName: 'Response',
  field: 'Response',
  valueFormatter: ({ value }: any) => `${fmt.decimal(value, 2)}%`,
})

const Created = (): ColDef => ({
  headerName: 'Created',
  field: 'Created',
  filter: 'agDateColumnFilter',
  valueFormatter: ({ value }: any) => (value ? dayjs(value).format(dateFormat.MONTH_DATE_YEAR) : value),
  filterValueGetter: (params: any) => {
    return params.data?.Created ? dayjs(params.data?.Created).toDate() : null
  },
})

const LiftingWindow = (): ColDef => ({
  headerName: 'Lifting Window',
  field: 'LiftingStartDate',
  filter: 'agDateColumnFilter',
  filterParams: {
    inRangeInclusive: true,
    comparator: (filterLocalDateAtMidnight: Date, cellValue: any) => {
      if (cellValue == null) return 0
      const { startDate, endDate } = cellValue
      if (!startDate || !endDate) return 0
      if (filterLocalDateAtMidnight < startDate) return 1
      if (filterLocalDateAtMidnight > endDate) return -1
      return 0
    },
  },
  filterValueGetter: (params: any) => {
    const startDate = params.data?.LiftingStartDate ? dayjs(params.data.LiftingStartDate).startOf('day').toDate() : null
    const endDate = params.data?.LiftingEndDate ? dayjs(params.data.LiftingEndDate).startOf('day').toDate() : null
    if (!startDate || !endDate) return null
    return { startDate, endDate }
  },
  cellRenderer: ({ data }: any) => {
    const startDate = dayjs(data?.LiftingStartDate).format(dateFormat.MONTH_DATE_V2)
    const endDate = dayjs(data?.LiftingEndDate).format(dateFormat.MONTH_DATE_V2)
    return (
      <Horizontal width='100%'>
        {startDate} - {endDate}
      </Horizontal>
    )
  },
})

const VolumePercent = (): ColDef => ({
  headerName: 'Volume %',
  field: 'VolumePercent',
  filter: 'agNumberColumnFilter',
  valueGetter: ({ data }: any) => {
    if (!isDefinedAndNotNull(data?.Volume)) return null
    const accepted = data.AcceptedVolume ?? 0
    const total = data.Volume
    return total > 0 ? (accepted / total) * 100 : 0
  },
  valueFormatter: ({ value }: any) => (value != null ? `${fmt.decimal(value, 0)}%` : ''),
})

const AcceptedVolume = (): ColDef => ({
  headerName: 'Accepted Volume',
  field: 'AcceptedVolume',
  filter: 'agNumberColumnFilter',
  valueFormatter: ({ value }: any) => (value != null ? `${addCommasToNumber(value)} gal` : ''),
})

const VisibilityWindow = (): ColDef => ({
  headerName: 'Visibility Window',
  field: 'VisibilityStartDateTime',
  filter: 'agDateColumnFilter',
  hide: true,
  cellRenderer: ({ data }: any) => {
    const startDate = data?.VisibilityStartDateTime ? dayjs(data.VisibilityStartDateTime).format(dateFormat.MONTH_DATE_V2) : ''
    const endDate = data?.VisibilityEndDateTime ? dayjs(data.VisibilityEndDateTime).format(dateFormat.MONTH_DATE_V2) : ''
    if (!startDate && !endDate) return null
    return (
      <Horizontal width='100%'>
        {startDate} - {endDate}
      </Horizontal>
    )
  },
})

const CreatedBy = (): ColDef => ({
  headerName: 'Created By',
  field: 'CreatedByUserName',
})

const PendingSubmissions = (): ColDef => ({
  headerName: 'Pending Submissions',
  field: 'PendingSubmissionCount',
  filter: 'agNumberColumnFilter',
  valueFormatter: ({ value }: any) => (value != null ? fmt.integer(value) : ''),
})

const Actions = (setIsShowingManage: any, setSelectedSpecialOffer: any): ColDef => ({
  headerName: 'Actions',
  filter: false,
  sortable: false,
  suppressFiltersToolPanel: true,
  editable: false,
  cellRenderer: ({ data }: any) => {
    return (
      <Horizontal width='100%' height='100%' verticalCenter>
        <GraviButton
          className='ghost-gravi-button'
          icon={<EyeOutlined style={{ fontSize: '14px' }} />}
          buttonText='View'
          onClick={() => {
            setSelectedSpecialOffer(data)
            setIsShowingManage(true)
          }}
        />
      </Horizontal>
    )
  },
})
