import { BulkCellEditorHandle } from '@gravitate-js/excalibrr/dist/components/GraviGrid/index.types';
import { Horizontal } from '@gravitate-js/excalibrr';
import { toAntOption, SelectOption } from '@utils/index';
import { Select, SelectProps, InputNumber } from 'antd';
import React, { CSSProperties, forwardRef, useEffect, useImperativeHandle, useState } from 'react';

type CellEditorParams = {
  options: SelectOption[];
  propKey: string;
  refreshBulkDrawerUI: () => void;
  selectEditorProps?: SelectProps<string>;
  selectEditorStyle?: CSSProperties;
};

export const BulkSelectEditor = forwardRef<BulkCellEditorHandle<unknown>, CellEditorParams>(
  (props, ref) => {
    const { propKey, options, refreshBulkDrawerUI, selectEditorProps, selectEditorStyle } = props;
    const [state, setState] = useState<Record<string, string>>({});

    const setDynamicState = (key: string, value: string) => {
      setState((prevState) => ({
        ...prevState,
        [key]: value,
      }));
    };

    const dynamicValue = state[propKey];

    useImperativeHandle(ref, () => ({
      getChanges: () => ({ [propKey]: dynamicValue }),
      isChangeReady: () => !!dynamicValue,
    }));

    useEffect(() => {
      refreshBulkDrawerUI();
    }, [dynamicValue, refreshBulkDrawerUI]);

    return (
      <Select
        placeholder="Select option"
        showSearch
        style={{ ...selectEditorStyle, minWidth: 260 }}
        value={dynamicValue}
        onChange={(value) => setDynamicState(propKey, value)}
        options={options?.map(toAntOption) ?? []}
        filterOption={(input, option) =>
          (option?.label ?? '').toString().toLowerCase().includes(input.toLowerCase())
        }
        {...selectEditorProps}
      />
    );
  }
);

/**
 * BulkNumberEditor - Numeric input for bulk editing
 */
type NumberEditorParams = {
  propKey: string;
  min?: number;
  max?: number;
  precision?: number;
  step?: number;
  placeholder?: string;
  refreshBulkDrawerUI: () => void;
};

export const BulkNumberEditor = forwardRef<BulkCellEditorHandle<unknown>, NumberEditorParams>(
  (props, ref) => {
    const { propKey, min, max, precision, step, placeholder, refreshBulkDrawerUI } = props;
    const [value, setValue] = useState<number | null>(null);

    useImperativeHandle(ref, () => ({
      getChanges: () => {
        if (value === null) return {};
        return { [propKey]: value };
      },
      isChangeReady: () => value !== null,
    }));

    useEffect(() => {
      refreshBulkDrawerUI?.();
    }, [value, refreshBulkDrawerUI]);

    return (
      <Horizontal alignItems="center">
        <InputNumber
          placeholder={placeholder || 'Enter value'}
          value={value}
          onChange={(val) => setValue(val)}
          min={min}
          max={max}
          precision={precision}
          step={step}
          style={{ minWidth: 180 }}
        />
      </Horizontal>
    );
  }
);
