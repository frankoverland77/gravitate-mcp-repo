import React, { forwardRef, useMemo, useState } from 'react';
import { HighlightOutlined, MinusOutlined, PlusOutlined } from '@ant-design/icons';
import { GraviButton, Horizontal } from '@gravitate-js/excalibrr';
import { InputNumber, Tooltip } from 'antd';
import { ICellEditorParams } from 'ag-grid-community';

type PricingRow = {
  id: number;
  currentPrice?: number;
  currentDiff?: number;
  proposedDiff?: number;
  proposedPrice?: number;
  [key: string]: any;
};

type ChangeFunction = (row: PricingRow) => PricingRow;

export type BulkProposedDiffEditorParams = ICellEditorParams & {
  refreshBulkDrawerUI: () => void;
  executeChange: (change: ChangeFunction) => void;
  isBulkChangeCompactMode?: boolean;
};

export const BulkProposedDiffEditor = forwardRef<any, BulkProposedDiffEditorParams>(
  (props, _ref) => {
    const [value, setValue] = useState<number | null>(null);

    const add: ChangeFunction = (row) => {
      const newDiff = Number(row.proposedDiff ?? 0) + Number(value ?? 0);
      return {
        ...row,
        proposedDiff: newDiff,
        proposedPrice: Number(row.currentPrice ?? 0) + newDiff,
      };
    };

    const subtract: ChangeFunction = (row) => {
      const newDiff = Number(row.proposedDiff ?? 0) - Number(value ?? 0);
      return {
        ...row,
        proposedDiff: newDiff,
        proposedPrice: Number(row.currentPrice ?? 0) + newDiff,
      };
    };

    const replace: ChangeFunction = (row) => {
      const newDiff = Number(value ?? 0);
      return {
        ...row,
        proposedDiff: newDiff,
        proposedPrice: Number(row.currentPrice ?? 0) + newDiff,
      };
    };

    const isEditable = useMemo(() => value !== null && value !== undefined, [value]);
    const size = props.isBulkChangeCompactMode ? 'small' : 'middle';

    return (
      <Horizontal flex={1} gap="1rem" alignItems="center" justifyContent="flex-end">
        <InputNumber
          value={value}
          onChange={(v) => setValue(v ?? null)}
          step={0.0001}
          precision={4}
          style={{ width: 180 }}
          placeholder="0.0000"
        />
        <Horizontal gap={4}>
          <Tooltip title="Increment" placement="bottomLeft">
            <GraviButton
              size={size}
              icon={<PlusOutlined />}
              onClick={() => props.executeChange(add)}
              disabled={!isEditable}
            />
          </Tooltip>
          <Tooltip title="Decrement" placement="bottomLeft">
            <GraviButton
              size={size}
              icon={<MinusOutlined />}
              onClick={() => props.executeChange(subtract)}
              disabled={!isEditable}
            />
          </Tooltip>
          <Tooltip title="Replace value" placement="bottomLeft">
            <GraviButton
              size={size}
              icon={<HighlightOutlined />}
              onClick={() => props.executeChange(replace)}
              disabled={!isEditable}
            />
          </Tooltip>
        </Horizontal>
      </Horizontal>
    );
  }
);

BulkProposedDiffEditor.displayName = 'BulkProposedDiffEditor';

export default BulkProposedDiffEditor;
