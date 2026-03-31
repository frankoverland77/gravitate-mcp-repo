import { DeleteOutlined } from '@ant-design/icons'
import { GraviButton } from '@gravitate-js/excalibrr'
import type { IndexOfferFormulaComponent, IndexOfferMetaData } from '../../../../../ManageOffers.types'
import type { ColDef } from 'ag-grid-community'

const isDefinedAndNotNull = (val: any): boolean => val !== null && val !== undefined

const placeholderText: Record<string, string> = {
  Percentage: '— %',
  PricePublisherId: '— Publisher',
  PriceInstrumentId: '— Instrument',
  PriceValuationRuleId: '— Date Rule',
  PriceTypeCvId: '— Type',
  Differential: '— Diff',
}

const placeholderCellStyle = (value: any) => (!isDefinedAndNotNull(value) ? 'text-muted' : '')

interface IndexOfferComponentsColumnDefsProps {
  handleDelete: (data: IndexOfferFormulaComponent) => void
  metadata?: IndexOfferMetaData
}

export function IndexOfferComponentsColumnDefs({
  handleDelete,
  metadata,
}: IndexOfferComponentsColumnDefsProps): ColDef[] {
  return [
    {
      rowDrag: true,
      width: 40,
      suppressMenu: true,
      lockPosition: true,
      pinned: 'left' as const,
    },
    {
      editable: true,
      field: 'Percentage',
      headerName: '%',
      valueFormatter: (props: any) => {
        if (!isDefinedAndNotNull(props.data.Percentage)) return placeholderText['Percentage']
        return `${props.data.Percentage}%`
      },
      cellClass: (params: any) => placeholderCellStyle(params.data.Percentage),
    },
    {
      editable: true,
      field: 'PricePublisherId',
      headerName: 'Publisher',
      valueGetter: (props: any) => {
        if (!isDefinedAndNotNull(props.data.PricePublisherId)) return placeholderText['PricePublisherId']
        return metadata?.PricePublishers?.find((o) => o.Value == props.data.PricePublisherId)?.Text
      },
      cellClass: (params: any) => placeholderCellStyle(params.data.PricePublisherId),
    },
    {
      editable: true,
      field: 'PriceInstrumentId',
      headerName: 'Instrument',
      valueGetter: (props: any) => {
        if (!isDefinedAndNotNull(props.data.PriceInstrumentId)) return placeholderText['PriceInstrumentId']
        return metadata?.PriceInstruments?.find((o) => o.Value == props.data.PriceInstrumentId)?.Text
      },
      cellClass: (params: any) => placeholderCellStyle(params.data.PriceInstrumentId),
    },
    {
      editable: true,
      field: 'PriceValuationRuleId',
      headerName: 'Date Rule',
      valueGetter: (props: any) => {
        if (!isDefinedAndNotNull(props.data.PriceValuationRuleId)) return placeholderText['PriceValuationRuleId']
        return metadata?.TradePriceValuationRules?.find((o) => o.Value == props.data.PriceValuationRuleId)?.Text
      },
      cellClass: (params: any) => placeholderCellStyle(params.data.PriceValuationRuleId),
    },
    {
      editable: true,
      field: 'PriceTypeCvId',
      headerName: 'Type',
      valueGetter: (props: any) => {
        if (!isDefinedAndNotNull(props.data.PriceTypeCvId)) return placeholderText['PriceTypeCvId']
        const allPriceTypes = Object.values(metadata?.PublisherPriceTypes || {}).flat()
        return allPriceTypes.find((opt) => opt.Value == props.data.PriceTypeCvId?.toString())?.Text || placeholderText['PriceTypeCvId']
      },
      cellClass: (params: any) => placeholderCellStyle(params.data.PriceTypeCvId),
    },
    {
      editable: true,
      field: 'Differential',
      headerName: 'Differential',
      valueFormatter: (props: any) => {
        if (!isDefinedAndNotNull(props.data.Differential)) return placeholderText['Differential']
        return props.data.Differential.toFixed(2)
      },
      cellClass: (params: any) => placeholderCellStyle(params.data.Differential),
    },
    {
      field: 'DisplayName',
      headerName: 'Display',
      editable: true,
      cellStyle: (params: any) => (params.data.isDisplayNameCustomized ? null : { backgroundColor: 'var(--bg-2)' }),
      valueGetter: (params: any) => {
        if (params.data.isDisplayNameCustomized && isDefinedAndNotNull(params.data.DisplayName)) {
          return params.data.DisplayName
        }
        return generateIndexOfferDisplayName(params.data, metadata)
      },
      valueSetter: (params: any) => {
        params.data.DisplayName = params.newValue
        params.data.isDisplayNameCustomized = !!isDefinedAndNotNull(params.newValue)
        return true
      },
    },
    {
      filter: false,
      sortable: false,
      field: 'Actions',
      headerName: 'Actions',
      maxWidth: 100,
      cellRenderer: ({ data }: { data: IndexOfferFormulaComponent }) => {
        return <GraviButton className={'ghost-gravi-button'} icon={<DeleteOutlined />} onClick={() => handleDelete(data)} />
      },
    },
  ]
}

export function generateIndexOfferDisplayName(
  component: IndexOfferFormulaComponent,
  metadata?: IndexOfferMetaData
): string {
  const percent = isDefinedAndNotNull(component.Percentage) ? `${component.Percentage}%` : placeholderText['Percentage']
  const publisher = isDefinedAndNotNull(component.PricePublisherId)
    ? metadata?.PricePublishers?.find((item) => item.Value == component.PricePublisherId?.toString())?.Text
    : placeholderText['PricePublisherId']
  const instrument = isDefinedAndNotNull(component.PriceInstrumentId)
    ? metadata?.PriceInstruments?.find((item) => item.Value == component.PriceInstrumentId?.toString())?.Text
    : placeholderText['PriceInstrumentId']
  const allPriceTypes = Object.values(metadata?.PublisherPriceTypes || {}).flat()
  const type = isDefinedAndNotNull(component.PriceTypeCvId)
    ? allPriceTypes.find((item) => item.Value == component.PriceTypeCvId?.toString())?.Text || placeholderText['PriceTypeCvId']
    : placeholderText['PriceTypeCvId']
  const dateRule = isDefinedAndNotNull(component.PriceValuationRuleId)
    ? metadata?.TradePriceValuationRules?.find((item) => item.Value == component.PriceValuationRuleId?.toString())?.Text
    : placeholderText['PriceValuationRuleId']
  return `${percent} ${publisher} ${instrument} ${dateRule} ${type}`
}
