// Notification Destinations Tab - Grid with Site ID and Email tag input columns
// Following patterns from Gravitate ManagePriceNotifications module

import { useState, useMemo, useRef, useCallback } from 'react';
import {
  GraviGrid,
  Vertical,
  Horizontal,
  Texto,
  NotificationMessage,
} from '@gravitate-js/excalibrr';
import type { GridApi } from 'ag-grid-community';
import { getDestinationColumnDefs } from '../components/columnDefs';
import { sampleRecipientData } from '../SubscriptionManagement.data';
import type { RecipientData } from '../SubscriptionManagement.types';
import '../styles/SubscriptionManagement.css';

export function NotificationDestinationsTab() {
  const gridAPIRef = useRef<GridApi | null>(null);
  const [rowData, setRowData] = useState<RecipientData[]>(sampleRecipientData);
  const canWrite = true; // In real app, this would come from permissions

  // Handle Site IDs change
  const handleSiteIdsChange = useCallback((row: RecipientData, newSiteIds: string[]) => {
    setRowData((prev) =>
      prev.map((item) =>
        item.CounterPartyId === row.CounterPartyId ? { ...item, SiteIds: newSiteIds } : item
      )
    );
    NotificationMessage('Site IDs Updated', `Updated site IDs for ${row.CounterPartyName}`, false);
  }, []);

  // Handle Emails change
  const handleEmailsChange = useCallback((row: RecipientData, newEmails: string[]) => {
    setRowData((prev) =>
      prev.map((item) =>
        item.CounterPartyId === row.CounterPartyId ? { ...item, Emails: newEmails } : item
      )
    );
    NotificationMessage('Emails Updated', `Updated emails for ${row.CounterPartyName}`, false);
  }, []);

  // Column definitions
  const columnDefs = useMemo(
    () =>
      getDestinationColumnDefs({
        canWrite,
        onSiteIdsChange: handleSiteIdsChange,
        onEmailsChange: handleEmailsChange,
      }),
    [canWrite, handleSiteIdsChange, handleEmailsChange]
  );

  // Grid props
  const agPropOverrides = useMemo(
    () => ({
      getRowId: (params: { data: RecipientData }) => params.data.CounterPartyId,
      rowSelection: 'multiple' as const,
      suppressRowClickSelection: true,
      suppressClickEdit: true,
    }),
    []
  );

  // Control bar
  const controlBarProps = useMemo(
    () => ({
      title: 'Notification Destinations',
      hideActiveFilters: false,
    }),
    []
  );

  return (
    <Vertical className="notification-destinations-container" height="100%">
      <Horizontal className="notification-destinations-description py-2 ml-2">
        <Texto category="p2" appearance="medium">
          Configure notification types and destinations by counterparty.
        </Texto>
      </Horizontal>

      <Vertical className="notification-destinations-grid" flex="1" style={{ minHeight: 0 }}>
        <GraviGrid
          rowData={rowData}
          columnDefs={columnDefs}
          agPropOverrides={agPropOverrides}
          controlBarProps={controlBarProps}
          storageKey="SubscriptionManagement/NotificationDestinations"
          externalRef={gridAPIRef as React.MutableRefObject<GridApi>}
        />
      </Vertical>
    </Vertical>
  );
}
