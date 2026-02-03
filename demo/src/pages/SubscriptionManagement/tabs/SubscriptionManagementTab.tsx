// Subscription Management Tab - Grid with Content Configuration columns and bulk edit support
// Following patterns from Gravitate ManagePriceNotifications module

import { useState, useMemo, useCallback, useRef } from 'react';
import {
  GraviGrid,
  Vertical,
  Horizontal,
  GraviButton,
  NotificationMessage,
} from '@gravitate-js/excalibrr';
import { PlusCircleOutlined, EditOutlined } from '@ant-design/icons';
import type { GridApi } from 'ag-grid-community';
import { getSubscriptionColumnDefs } from '../components/columnDefs';
import { BulkChangeDrawer } from '../components/BulkChangeDrawer';
import { sampleSubscriptionData } from '../SubscriptionManagement.data';
import type { SubscriptionData } from '../SubscriptionManagement.types';
import '../styles/SubscriptionManagement.css';

export function SubscriptionManagementTab() {
  const gridAPIRef = useRef<GridApi | null>(null);
  const [rowData, setRowData] = useState<SubscriptionData[]>(sampleSubscriptionData);
  const [isBulkEditMode, setIsBulkEditMode] = useState(false);
  const [bulkEditRows, setBulkEditRows] = useState<SubscriptionData[]>([]);
  const [isBulkChangeDrawerOpen, setIsBulkChangeDrawerOpen] = useState(false);
  const canWrite = true; // In real app, this would come from permissions

  // Handle row selection for bulk edit mode
  const onRowSelected = useCallback(() => {
    if (gridAPIRef.current) {
      const currentSelection = gridAPIRef.current.getSelectedRows();
      setIsBulkEditMode(currentSelection.length > 0);
      setBulkEditRows(currentSelection);
    }
  }, []);

  // Handle status change
  const handleStatusChange = useCallback((row: SubscriptionData, newStatus: boolean) => {
    setRowData((prev) =>
      prev.map((item) => (item.Id === row.Id ? { ...item, IsActive: newStatus } : item))
    );
    NotificationMessage(
      'Status Updated',
      `${row.CounterPartyName} status changed to ${newStatus ? 'Active' : 'Inactive'}`,
      false
    );
  }, []);

  // Handle checkbox change for content configuration
  const handleCheckboxChange = useCallback(
    (row: SubscriptionData, field: string, newValue: boolean) => {
      setRowData((prev) =>
        prev.map((item) => (item.Id === row.Id ? { ...item, [field]: newValue } : item))
      );
    },
    []
  );

  // Handle open products drawer (placeholder)
  const handleOpenProducts = useCallback((row: SubscriptionData) => {
    NotificationMessage('Products', `Opening products for ${row.CounterPartyName}`, false);
  }, []);

  // Handle open locations drawer (placeholder)
  const handleOpenLocations = useCallback((row: SubscriptionData) => {
    NotificationMessage('Locations', `Opening locations for ${row.CounterPartyName}`, false);
  }, []);

  // Helper to check if an item is in bulk selection
  const isItemSelected = useCallback(
    (item: SubscriptionData) => bulkEditRows.some((bulkRow) => bulkRow.Id === item.Id),
    [bulkEditRows]
  );

  // Bulk actions
  const handleActivateAll = useCallback(() => {
    if (bulkEditRows.length === 0) {
      NotificationMessage('No Selection', 'Please select at least one row to activate', true);
      return;
    }
    setRowData((prev) =>
      prev.map((item) => (isItemSelected(item) ? { ...item, IsActive: true } : item))
    );
    NotificationMessage('Bulk Activate', `Activated ${bulkEditRows.length} subscription(s)`, false);
  }, [bulkEditRows, isItemSelected]);

  const handleDeactivateAll = useCallback(() => {
    if (bulkEditRows.length === 0) {
      NotificationMessage('No Selection', 'Please select at least one row to deactivate', true);
      return;
    }
    setRowData((prev) =>
      prev.map((item) => (isItemSelected(item) ? { ...item, IsActive: false } : item))
    );
    NotificationMessage(
      'Bulk Deactivate',
      `Deactivated ${bulkEditRows.length} subscription(s)`,
      false
    );
  }, [bulkEditRows, isItemSelected]);

  const handleCancel = useCallback(() => {
    if (gridAPIRef.current) {
      gridAPIRef.current.deselectAll();
    }
    setIsBulkEditMode(false);
    setBulkEditRows([]);
  }, []);

  const handleOpenBulkChange = useCallback(() => {
    if (bulkEditRows.length === 0) {
      NotificationMessage('No Selection', 'Please select at least one row to bulk change', true);
      return;
    }
    setIsBulkChangeDrawerOpen(true);
  }, [bulkEditRows]);

  const handleApplyBulkChanges = useCallback(
    (changes: Record<string, boolean>) => {
      if (Object.keys(changes).length === 0) return;

      const selectedIds = new Set(bulkEditRows.map((row) => row.Id));
      setRowData((prev) =>
        prev.map((item) => {
          if (selectedIds.has(item.Id)) {
            return { ...item, ...changes };
          }
          return item;
        })
      );

      const fieldCount = Object.keys(changes).length;
      NotificationMessage(
        'Bulk Change Applied',
        `Updated ${fieldCount} field${fieldCount !== 1 ? 's' : ''} for ${bulkEditRows.length} subscription${bulkEditRows.length !== 1 ? 's' : ''}`,
        false
      );

      // Deselect all after applying changes
      if (gridAPIRef.current) {
        gridAPIRef.current.deselectAll();
      }
      setIsBulkEditMode(false);
      setBulkEditRows([]);
    },
    [bulkEditRows]
  );

  const handleCreate = useCallback(() => {
    NotificationMessage('Create', 'Opening create subscription modal', false);
  }, []);

  // Column definitions
  const columnDefs = useMemo(
    () =>
      getSubscriptionColumnDefs({
        isBulkEditMode,
        canWrite,
        bulkEditRows,
        onStatusChange: handleStatusChange,
        onOpenProducts: handleOpenProducts,
        onOpenLocations: handleOpenLocations,
        onCheckboxChange: handleCheckboxChange,
      }),
    [
      isBulkEditMode,
      canWrite,
      bulkEditRows,
      handleStatusChange,
      handleOpenProducts,
      handleOpenLocations,
      handleCheckboxChange,
    ]
  );

  // Grid props
  const agPropOverrides = useMemo(
    () => ({
      getRowId: (params: { data: SubscriptionData }) => String(params.data.Id),
      rowSelection: 'multiple' as const,
      suppressRowClickSelection: true,
      onRowSelected,
      suppressDragLeaveHidesColumns: true,
    }),
    [onRowSelected]
  );

  // Control bar with action buttons
  const controlBarProps = useMemo(
    () => ({
      title: 'Subscription Management',
      showSelectedCount: true,
      hideActiveFilters: false,
      actionButtons: isBulkEditMode ? (
        <Horizontal alignItems="center" style={{ gap: '8px' }}>
          <GraviButton
            buttonText="Bulk Change"
            theme1
            size="small"
            icon={<EditOutlined />}
            onClick={handleOpenBulkChange}
          />
          <GraviButton buttonText="Activate All" success size="small" onClick={handleActivateAll} />
          <GraviButton buttonText="Deactivate All" size="small" onClick={handleDeactivateAll} />
          <GraviButton buttonText="Cancel" size="small" onClick={handleCancel} />
        </Horizontal>
      ) : (
        <GraviButton
          buttonText="Create"
          success
          icon={<PlusCircleOutlined />}
          onClick={handleCreate}
        />
      ),
    }),
    [isBulkEditMode, handleActivateAll, handleDeactivateAll, handleCancel, handleCreate, handleOpenBulkChange]
  );

  return (
    <Vertical className="subscription-management-container" height="100%">
      <Vertical className="subscription-management-grid" flex="1" style={{ minHeight: 0 }}>
        <GraviGrid
          rowData={rowData}
          columnDefs={columnDefs}
          agPropOverrides={agPropOverrides}
          controlBarProps={controlBarProps}
          storageKey="SubscriptionManagement/SubscriptionsGrid"
          externalRef={gridAPIRef as React.MutableRefObject<GridApi>}
        />
      </Vertical>
      <BulkChangeDrawer
        visible={isBulkChangeDrawerOpen}
        selectedRows={bulkEditRows}
        onClose={() => setIsBulkChangeDrawerOpen(false)}
        onApply={handleApplyBulkChanges}
      />
    </Vertical>
  );
}
