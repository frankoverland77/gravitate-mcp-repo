import { HighlightOutlined, MinusOutlined, PlusOutlined } from '@ant-design/icons'
import { GraviButton, Horizontal } from '@gravitate-js/excalibrr'
import { InputNumber, Tooltip } from 'antd'
import { forwardRef, useMemo, useState } from 'react'

type ChangeFunction = (row: any) => any

type BulkTierDiffEditorParams = {
  propKey: string
  precision?: number
  step?: number
  refreshBulkDrawerUI: () => void
  executeChange: (change: ChangeFunction) => void
  isBulkChangeCompactMode?: boolean
}

export const BulkTierDiffEditor = forwardRef<any, BulkTierDiffEditorParams>((props, _) => {
  const { propKey, precision = 4, step = 0.0001 } = props
  const [value, setValue] = useState<number | undefined>()

  const add = (row: any) => ({
    ...row,
    [propKey]: Number(row[propKey] ?? 0) + Number(value ?? 0),
  })

  const subtract = (row: any) => ({
    ...row,
    [propKey]: Number(row[propKey] ?? 0) - Number(value ?? 0),
  })

  const replace = (row: any) => ({
    ...row,
    [propKey]: Number(value ?? 0),
  })

  const isEditable = useMemo(() => value != null, [value])

  return (
    <Horizontal flex={1} style={{ gap: '1rem' }} alignItems="center" justifyContent="flex-end">
      <InputNumber
        value={value}
        onChange={(val) => setValue(val!)}
        precision={precision}
        step={step}
        min={0}
        style={{ width: 180 }}
      />
      <Horizontal style={{ gap: 4 }}>
        <GraviButton
          size={props.isBulkChangeCompactMode ? 'small' : 'middle'}
          icon={<PlusOutlined />}
          onClick={() => props.executeChange(add)}
          disabled={!isEditable}
        />
        <GraviButton
          size={props.isBulkChangeCompactMode ? 'small' : 'middle'}
          icon={<MinusOutlined />}
          onClick={() => props.executeChange(subtract)}
          disabled={!isEditable}
        />
        <Tooltip title="Replace value" placement="bottomLeft">
          <GraviButton
            size={props.isBulkChangeCompactMode ? 'small' : 'middle'}
            icon={<HighlightOutlined />}
            onClick={() => props.executeChange(replace)}
            disabled={!isEditable}
          />
        </Tooltip>
      </Horizontal>
    </Horizontal>
  )
})
