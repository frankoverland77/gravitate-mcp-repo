import React, { useCallback, useMemo, useRef, useState } from 'react';
import { GridApi } from 'ag-grid-community';
import { Modal } from 'antd';
import { GraviButton, GraviGrid, Horizontal, Vertical } from '@gravitate-js/excalibrr';
import { PlusOutlined } from '@ant-design/icons';

import { useDogGrooming } from './api/useDogGrooming';
import { DogGroomingData, DogGroomingCreateRequest } from './api/types.schema';
import { DogGroomingColumnDefs } from './components/DogGroomingColumnDefs';
import { DogGroomingFormModal } from './components/DogGroomingFormModal';

export function DogGroomingPage() {
  const gridAPIRef = useRef() as React.MutableRefObject<GridApi>;
  const [filters] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<DogGroomingData | undefined>(undefined);

  const { useDogGroomingQuery, useDeleteMutation, useCreateMutation, useUpdateMutation } =
    useDogGrooming();
  const { data: dogGroomingData, isLoading } = useDogGroomingQuery(filters);
  const deleteMutation = useDeleteMutation();
  const createMutation = useCreateMutation();
  const updateMutation = useUpdateMutation();

  const data = dogGroomingData?.Data?.Data || [];

  const handleDelete = useCallback(
    (id: number) => {
      Modal.confirm({
        title: 'Delete Item',
        content: 'Are you sure you want to delete this item?',
        onOk: () => deleteMutation.mutate({ Id: id }),
      });
    },
    [deleteMutation]
  );

  const handleEdit = useCallback((item: DogGroomingData) => {
    setEditingItem(item);
    setIsModalOpen(true);
  }, []);

  const handleCreate = () => {
    setEditingItem(undefined);
    setIsModalOpen(true);
  };

  const handleSubmit = async (values: DogGroomingCreateRequest) => {
    if (editingItem) {
      await updateMutation.mutateAsync({ ...values, Id: editingItem.Id });
    } else {
      await createMutation.mutateAsync(values);
    }
    setIsModalOpen(false);
  };

  const columnDefs = useMemo(
    () =>
      DogGroomingColumnDefs({
        onDelete: handleDelete,
        onEdit: handleEdit,
      }),
    [handleDelete, handleEdit]
  );

  const controlBarProps = useMemo(
    () => ({
      title: 'Dog Grooming',
      actionButtons: (
        <Horizontal>
          <GraviButton
            buttonText="Create New"
            theme1
            icon={<PlusOutlined />}
            onClick={handleCreate}
          />
        </Horizontal>
      ),
    }),
    []
  );

  return (
    <Vertical flex="1">
      <GraviGrid
        externalRef={gridAPIRef}
        controlBarProps={controlBarProps}
        columnDefs={columnDefs}
        rowData={data}
        storageKey="DogGroomingGrid"
        loading={isLoading}
        agPropOverrides={{}}
        sideBar={false}
      />

      <DogGroomingFormModal
        visible={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
        initialValues={editingItem}
        isSubmitting={createMutation.isLoading || updateMutation.isLoading}
      />
    </Vertical>
  );
}
