import { useMemo, useState } from 'react';
import { GraviGrid, GraviButton, Vertical } from '@gravitate-js/excalibrr';
import { PlusCircleOutlined } from '@ant-design/icons';
import type React from 'react';
import { PricePositioningPreset } from './PPTagManager.types';
import { SEED_PRESETS } from './PPTagManager.data';
import { createColumnDefs } from './PPTagManager.columnDefs';
import { CreateModal } from './components/CreateModal';

function todayISO(): string {
  return new Date().toISOString().slice(0, 10);
}

export function PPTagManager() {
  const [presets, setPresets] = useState<PricePositioningPreset[]>(SEED_PRESETS);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleDelete = (id: string) => {
    setPresets((prev) => prev.filter((p) => p.id !== id));
  };

  const handleCreate = (preset: PricePositioningPreset) => {
    setPresets((prev) => [...prev, preset]);
    setIsModalOpen(false);
  };

  const handleInlineUpdate = async (updated: PricePositioningPreset[]) => {
    setPresets((prev) => {
      const byId = new Map(updated.map((p) => [p.id, p]));
      return prev.map((p) => {
        const next = byId.get(p.id);
        if (!next) return p;
        return { ...p, ...next, updatedAt: todayISO() };
      });
    });
  };

  const columnDefs = useMemo(() => createColumnDefs(handleDelete), []);

  const controlBarProps = useMemo(
    () => ({
      title: 'Price Positioning Tag Manager',
      hideActiveFilters: true,
      hideFilterRow: true,
      actionButtons: (
        <GraviButton
          icon={<PlusCircleOutlined />}
          success
          onClick={() => setIsModalOpen(true)}
          style={{ backgroundColor: '#237804', borderColor: '#237804', color: '#ffffff' }}
        >
          Create
        </GraviButton>
      ),
    }),
    [],
  );

  const agPropOverrides = useMemo(
    () => ({
      getRowId: (params: { data: { id: string } }) => params.data.id,
      domLayout: 'normal' as const,
      suppressRowClickSelection: true,
      enableCellTextSelection: true,
      rowHeight: 52,
      singleClickEdit: true,
      stopEditingWhenCellsLoseFocus: true,
      defaultColDef: { resizable: true, sortable: true, filter: true },
    }),
    [],
  );

  return (
    <Vertical gap={16} style={{ padding: '24px 28px', height: '100%' } as React.CSSProperties}>
      <div style={{ flex: 1, minHeight: 0 }}>
        <GraviGrid
          rowData={presets}
          columnDefs={columnDefs}
          controlBarProps={controlBarProps}
          agPropOverrides={agPropOverrides}
          updateEP={handleInlineUpdate as never}
        />
      </div>

      <CreateModal
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onCreate={handleCreate}
      />
    </Vertical>
  );
}
