import { BulkCellEditorHandle } from '@gravitate-js/excalibrr/dist/components/GraviGrid/index.types';
import { Horizontal, Vertical, Texto } from '@gravitate-js/excalibrr';
import { Select, Segmented } from 'antd';
import { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import { BulkChangeMode, SelectOption } from './BulkChangeTest.data';

type BulkMultiSelectEditorParams = {
  options: SelectOption[];
  propKey: string;
  refreshBulkDrawerUI: () => void;
};

export const BulkMultiSelectEditor = forwardRef<
  BulkCellEditorHandle<unknown>,
  BulkMultiSelectEditorParams
>((props, ref) => {
  const { propKey, options, refreshBulkDrawerUI } = props;

  const [mode, setMode] = useState<BulkChangeMode>('replace');
  const [selectedValues, setSelectedValues] = useState<string[]>([]);

  useImperativeHandle(ref, () => ({
    getChanges: (row: unknown) => {
      const rowData = row as Record<string, unknown>;
      const existingValues: string[] = Array.isArray(rowData[propKey])
        ? (rowData[propKey] as string[])
        : [];

      let newValue: string[];

      switch (mode) {
        case 'increment':
          newValue = Array.from(new Set([...existingValues, ...selectedValues]));
          break;

        case 'decrement':
          newValue = existingValues.filter((val) => !selectedValues.includes(val));
          break;

        case 'replace':
        default:
          newValue = [...selectedValues];
          break;
      }

      return { [propKey]: newValue };
    },
    isChangeReady: () => selectedValues.length > 0,
  }));

  useEffect(() => {
    refreshBulkDrawerUI();
  }, [selectedValues, mode, refreshBulkDrawerUI]);

  const getModeDescription = () => {
    switch (mode) {
      case 'replace':
        return 'Selected values will replace existing values';
      case 'increment':
        return 'Selected values will be added to existing values';
      case 'decrement':
        return 'Selected values will be removed from existing values';
      default:
        return '';
    }
  };

  return (
    <Vertical gap={12} style={{ minWidth: 300 }}>
      <Horizontal gap={8} alignItems="center">
        <Texto category="p2" appearance="medium" weight="600">
          Mode:
        </Texto>
        <Segmented
          options={[
            { label: 'Replace', value: 'replace' },
            { label: 'Add To', value: 'increment' },
            { label: 'Remove From', value: 'decrement' },
          ]}
          value={mode}
          onChange={(value) => setMode(value as BulkChangeMode)}
          onPointerEnterCapture={undefined}
          onPointerLeaveCapture={undefined}
        />
      </Horizontal>

      <Texto category="p2" appearance="medium">
        {getModeDescription()}
      </Texto>

      <Select
        mode="multiple"
        placeholder={`Select values to ${mode === 'replace' ? 'set' : mode === 'increment' ? 'add' : 'remove'}`}
        style={{ minWidth: 260 }}
        value={selectedValues}
        onChange={(values) => setSelectedValues(values)}
        options={options?.map((opt) => ({ value: opt.Value, label: opt.Text })) ?? []}
        filterOption={(input, option) =>
          (option?.label ?? '').toString().toLowerCase().includes(input.toLowerCase())
        }
        showSearch
        allowClear
      />
    </Vertical>
  );
});
