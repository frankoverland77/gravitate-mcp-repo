import '../../../../styles.css'

import { Horizontal, Texto } from '@gravitate-js/excalibrr'
import type {
  IndexOfferViewDisplayModel,
  IndexOfferViewFormulaVariableModel,
} from '../../../../ManageOffers.types'
import { fmt } from '../../../../utils/formatters'
import { Table } from 'antd'
import type { ColumnsType } from 'antd/es/table'

type IndexOfferDisplayProps = {
  indexDisplay: IndexOfferViewDisplayModel
}

const componentColumns: ColumnsType<IndexOfferViewFormulaVariableModel> = [
  {
    title: '%',
    dataIndex: 'Percentage',
    key: 'Percentage',
    width: 70,
    render: (value: number | null) => (value != null ? `${value}%` : '\u2014'),
  },
  {
    title: 'Publisher',
    dataIndex: 'PricePublisherName',
    key: 'PricePublisherName',
    render: (value: string | null) => value ?? '\u2014',
  },
  {
    title: 'Instrument',
    dataIndex: 'PriceInstrumentName',
    key: 'PriceInstrumentName',
    render: (value: string | null) => value ?? '\u2014',
  },
  {
    title: 'Type',
    dataIndex: 'PriceTypeName',
    key: 'PriceTypeName',
    render: (value: string | null) => value ?? '\u2014',
  },
  {
    title: 'Date Rule',
    dataIndex: 'PriceValuationRuleName',
    key: 'PriceValuationRuleName',
    render: (value: string | null) => value ?? '\u2014',
  },
  {
    title: 'Differential',
    dataIndex: 'Differential',
    key: 'Differential',
    render: (value: number | null) => (value != null ? fmt.decimal(value) : '\u2014'),
  },
  {
    title: 'Display',
    dataIndex: 'VariableDisplayName',
    key: 'VariableDisplayName',
  },
]

export function IndexOfferDisplay({ indexDisplay }: IndexOfferDisplayProps) {
  const contractDifferential = indexDisplay.FormulaVariables?.find((v) => v.ValueSourceType === 'ContractDifferential')
  const regularVariables =
    indexDisplay.FormulaVariables?.filter((v) => v.ValueSourceType !== 'ContractDifferential') ?? []
  const hasFormulaVariables = regularVariables.length > 0 || contractDifferential != null

  return (
    <>
      <Horizontal className='mt-4'>
        <Texto category='h5'>Formula Display Name</Texto>
      </Horizontal>

      <Horizontal className='created-by-container'>
        <Texto>{indexDisplay.FormulaDisplayName}</Texto>
      </Horizontal>

      {hasFormulaVariables && (
        <>
          <Horizontal className='mt-4'>
            <Texto className='index-formula-label-uppercase'>Components</Texto>
          </Horizontal>
          <Table
            columns={componentColumns}
            dataSource={regularVariables}
            rowKey='VariableName'
            pagination={false}
            size='small'
            className='index-formula-table'
            footer={
              contractDifferential
                ? () => (
                    <div style={{ display: 'flex' }}>
                      <Texto weight='bold' style={{ width: '70px', textAlign: 'center' }}>
                        {contractDifferential.Value != null ? `$${contractDifferential.Value.toFixed(4)}` : '\u2014'}
                      </Texto>
                      <Texto weight='bold'>Contract Differential</Texto>
                    </div>
                  )
                : undefined
            }
          />
        </>
      )}
    </>
  )
}
