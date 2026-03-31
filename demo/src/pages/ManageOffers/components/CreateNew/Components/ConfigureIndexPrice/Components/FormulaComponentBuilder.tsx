import { PlusOutlined } from '@ant-design/icons'
import { GraviButton, GraviGrid, Horizontal, Texto, Vertical } from '@gravitate-js/excalibrr'
import type { IndexOfferFormulaComponent, SpecialOfferMetadataResponseData } from '../../../../../ManageOffers.types'
import { IndexOfferComponentsColumnDefs } from './IndexOfferComponentsColumnDefs'
import { blankFormulaComponentRow } from '../Utils/Constants'
import { Form } from 'antd'
import type { FormInstance } from 'antd'
import type { Dispatch, MutableRefObject, SetStateAction } from 'react'
import { useCallback, useMemo } from 'react'

export interface FormulaComponentBuilderProps {
  metadata?: SpecialOfferMetadataResponseData
  formulaComponents: IndexOfferFormulaComponent[]
  setFormulaComponents: Dispatch<SetStateAction<IndexOfferFormulaComponent[]>>
  form: FormInstance
  idRef: MutableRefObject<number>
}

export function FormulaComponentBuilder({
  metadata,
  formulaComponents,
  setFormulaComponents,
  form,
  idRef,
}: FormulaComponentBuilderProps) {
  const addRow = () => {
    const newComponents = [...formulaComponents, blankFormulaComponentRow(idRef.current++)]
    setFormulaComponents(newComponents)
    form.setFieldsValue({ FormulaTemplateVariables: newComponents })
  }

  const handleDelete = useCallback(
    (data: IndexOfferFormulaComponent) => {
      const newComponents = formulaComponents.filter((row) => row.IdForGrid !== data.IdForGrid)
      setFormulaComponents(newComponents)
      form.setFieldsValue({ FormulaTemplateVariables: newComponents })
    },
    [formulaComponents, setFormulaComponents, form]
  )

  const columnDefs = useMemo(
    () => IndexOfferComponentsColumnDefs({ metadata: metadata?.IndexOfferMetaData, handleDelete }),
    [metadata?.IndexOfferMetaData, handleDelete]
  )

  const agPropOverrides = useMemo(() => ({
    getRowId: (params: any) => String(params.data.IdForGrid),
    rowHeight: 35,
    headerHeight: 35,
    rowDragManaged: true,
    animateRows: true,
  }), [])

  return (
    <Vertical flex="2" className={'gap-0'}>
      <Horizontal className={'mb-2'} verticalCenter justifyContent={'space-between'} style={{ width: '100%' }}>
        <Texto weight={'bold'} textTransform={'uppercase'}>COMPONENTS</Texto>
        <Horizontal verticalCenter className={'gap-10 mt-2'}>
          <GraviButton appearance={'outlined'} buttonText={'Add Row'} icon={<PlusOutlined />} onClick={addRow} />
        </Horizontal>
      </Horizontal>
      <Vertical style={{ width: '100%', height: '350px' }}>
        <GraviGrid
          columnDefs={columnDefs}
          agPropOverrides={agPropOverrides}
          rowData={formulaComponents}
        />
      </Vertical>
      <div style={{ minHeight: '75px', overflowY: 'auto' }}>
        <Form.Item
          name={'FormulaTemplateVariables'}
          rules={[{
            validator: (_: any, value: IndexOfferFormulaComponent[]) => {
              if (!value || value.length === 0) return Promise.reject('At least 1 component is required')
              return Promise.resolve()
            }
          }]}
          style={{ marginTop: '-25px' }}
        >
          <div />
        </Form.Item>
      </div>
    </Vertical>
  )
}
