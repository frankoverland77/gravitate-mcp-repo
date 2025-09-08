import { CheckOutlined, CloseOutlined } from '@ant-design/icons'
import { DropdownOption } from '@components/shared/Grid/cellEditors/index'
import { Horizontal, Texto } from '@gravitate-js/excalibrr'
import { ICellEditorParams } from 'ag-grid-community'
import { Popconfirm, Select, SelectProps } from 'antd'
import { DefaultOptionType } from 'antd/lib/select'
import React, { forwardRef, useCallback, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react'

export type SelectEditorParams = ICellEditorParams &
  SelectProps & {
    width?: number
    setupFunc?: (setValue: any, linkedField: any) => void
    hideSearch?: boolean
    onChange?: (value: any, option: DefaultOptionType | DefaultOptionType[], data: any) => void
    showPopConfirmOnClear?: boolean
    enableSelectAllFromSearch?: boolean
  }

export const SearchableSelect: React.FC<SelectEditorParams> = forwardRef((props, ref) => {
  const refInput = useRef(null)
  const [changed, setChanged] = useState(false)
  const [selected, setSelected] = useState(props.value)
  const [searchQuery, setSearchQuery] = useState('')
  const [isPopConfirmVisible, setIsPopConfirmVisible] = useState(false)
  useEffect(() => {
    refInput.current?.focus()
  }, [])

  const handleSelectChange = (newSelection) => {
    if (Array.isArray(newSelection)) {
      if (newSelection.includes('__select_all__')) {
        const allFilteredValues = filteredOptions.map((option) => option.value)
        const existingValues = Array.isArray(selected) ? selected : []
        const mergedValues = Array.from(new Set([...existingValues, ...allFilteredValues]))

        setSelected(mergedValues)
        setChanged(true)

        if (props.onChange) {
          props.onChange(mergedValues, filteredOptions, props.data)
        }
        setSearchQuery('')
        return
      }

      if (newSelection.includes('__deselect_all__')) {
        const allFilteredValues = filteredOptions.map((option) => option.value)
        const existingValues = Array.isArray(selected) ? selected : []
        const filteredOut = existingValues.filter((val) => !allFilteredValues.includes(val))

        setSelected(filteredOut)
        setChanged(true)

        if (props.onChange) {
          props.onChange(filteredOut, filteredOptions, props.data)
        }

        setSearchQuery('')
        return
      }
    }

    setSelected(newSelection)
    setChanged(true)
  }

  // This is a bit of a hack, but since we're overriding the keyDown event to prevent 'Enter' from closing the editor,
  // we need to watch for changes to the input and close the editor reactively.
  useEffect(() => {
    if (changed) {
      if (!props.mode) {
        props?.api?.stopEditing()
        props?.api?.setFocusedCell(props?.rowIndex, props?.column?.colId)
      }
      // this is needed to make sure keyboard navigation still works after editing
      // props?.api?.setFocusedCell(props?.rowIndex, props?.column?.getColId())
    }
  }, [changed])

  /* Component Editor Lifecycle methods */
  useImperativeHandle(ref, () => {
    return {
      // the final value to send to the grid, on completion of editing
      getValue() {
        // this simple editor doubles any value entered into the input
        return selected
      },

      // Gets called once before editing starts, to give editor a chance to
      // cancel the editing before it even starts.
      isCancelBeforeStart() {
        return false
      },

      // Gets called once when editing is finished (eg if Enter is pressed).
      // If you return true, then the result of the edit will be ignored.
      isCancelAfterEnd() {
        return false
      },
    }
  })

  const optionFilter = useCallback(
    (option: DropdownOption) => {
      return option?.label?.toLowerCase().includes(searchQuery.toLowerCase())
    },
    [searchQuery]
  )

  const filteredOptions = useMemo(() => {
    return props?.options?.filter(optionFilter) || []
  }, [props?.options, optionFilter, searchQuery])

  return (
    <Select
      defaultOpen={props?.defaultOpen ?? true}
      onBlur={() => {
        if (props?.closeOnBlur) {
          props?.api?.stopEditing()
          props?.api?.setFocusedCell(props?.rowIndex, props?.column?.colId)
        }
      }}
      showSearch={props.showSearch}
      allowClear={props.allowClear}
      ref={refInput}
      style={{ minWidth: props.minWidth ?? 260, maxWidth: props.width ?? 260 }}
      placeholder={props.placeholder || 'Please select'}
      value={selected}
      onChange={handleSelectChange}
      mode={props.mode}
      maxTagCount={25}
      onSearch={setSearchQuery}
      filterOption={(params) => {
        return true
      }}
      clearIcon={
        <Popconfirm
          title='Are you sure you want to clear this field?'
          visible={isPopConfirmVisible}
          onConfirm={() => {
            setSelected([])
            setIsPopConfirmVisible(false)
          }}
          onCancel={() => {
            setIsPopConfirmVisible(false)
          }}
        >
          <CloseOutlined
            onClick={() => {
              if (props.showPopConfirmOnClear) {
                setIsPopConfirmVisible(true)
              } else {
                setSelected(null)
              }
            }}
          />
        </Popconfirm>
      }
      // filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
    >
      {props?.enableSelectAllFromSearch && filteredOptions.length > 0 && (
        <>
          <Select.Option key='__select_all__' value='__select_all__'>
            <div style={{ pointerEvents: 'none' }}>
              <strong>Select All ({filteredOptions.length})</strong>
            </div>
          </Select.Option>

          <Select.Option key='__deselect_all__' value='__deselect_all__'>
            <div style={{ pointerEvents: 'none' }}>
              <strong>Deselect All ({filteredOptions.length})</strong>
            </div>
          </Select.Option>
        </>
      )}
      {props?.options?.filter(optionFilter).map((option) => (
        <Select.Option key={option.value} value={option.value}>
          <Horizontal alignItems='center' style={{ gap: '0.5rem' }}>
            {props.showSelectedValue && props?.value === option.label && <CheckOutlined />}
            {option.icon}
            {option.label}
            {props?.matchOptionId && props?.matchOptionId === option.value && <Texto>(Default)</Texto>}
          </Horizontal>
        </Select.Option>
      ))}
    </Select>
  )
})
