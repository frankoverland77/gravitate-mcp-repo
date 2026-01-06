// Column definitions for Subscription Management grids
// Following patterns from Gravitate ManagePriceNotifications module

import { Horizontal, GraviButton } from '@gravitate-js/excalibrr';
import { Switch, Checkbox } from 'antd';
import type { ColDef, ColGroupDef, ICellRendererParams } from 'ag-grid-community';
import {
  CONTENT_CONFIG_FIELDS,
  SubscriptionData,
  RecipientData,
  BulkEditProps,
} from '../SubscriptionManagement.types';
import { EmailInput } from './EmailInput';
import { SiteIdInput } from './SiteIdInput';

// ========================================
// HELPER FUNCTIONS
// ========================================

interface EditableCheckProps extends BulkEditProps {
  row: SubscriptionData;
}

function getIsRowEditable({
  row,
  isBulkEditMode,
  canWrite,
  bulkEditRows,
}: EditableCheckProps): boolean {
  if (!canWrite) return false;
  if (!isBulkEditMode) return true;
  return bulkEditRows.some((bulkRow) => bulkRow?.Id === row.Id);
}

function getCellStyle({
  row,
  isBulkEditMode,
  canWrite,
  bulkEditRows,
}: EditableCheckProps): React.CSSProperties {
  const hasDisabledStyles = isBulkEditMode
    ? !getIsRowEditable({ row, isBulkEditMode, canWrite, bulkEditRows })
    : false;
  return !hasDisabledStyles ? {} : { opacity: 0.6 };
}

// ========================================
// SUBSCRIPTION MANAGEMENT COLUMNS
// ========================================

function checkboxSelectionColumn(): ColDef {
  return {
    headerName: '',
    field: 'checkbox',
    maxWidth: 50,
    checkboxSelection: true,
    headerCheckboxSelection: true,
    headerCheckboxSelectionFilteredOnly: true,
    pinned: 'left',
    suppressMenu: true,
  };
}

interface StatusColumnProps extends BulkEditProps {
  onStatusChange?: (row: SubscriptionData, newStatus: boolean) => void;
}

function statusColumn({
  isBulkEditMode,
  canWrite,
  bulkEditRows,
  onStatusChange,
}: StatusColumnProps): ColDef {
  return {
    headerName: 'Status',
    field: 'IsActive',
    maxWidth: 100,
    cellStyle: (params) =>
      getCellStyle({ row: params.data, isBulkEditMode, canWrite, bulkEditRows }),
    cellRenderer: (params: ICellRendererParams<SubscriptionData>) => {
      const editable = getIsRowEditable({
        row: params.data!,
        isBulkEditMode,
        canWrite,
        bulkEditRows,
      });
      return (
        <Horizontal className="justify-center" alignItems="center" style={{ height: '100%' }}>
          <Switch
            className={!editable ? 'disabled-gravi-button-row' : ''}
            checked={params.value}
            onChange={(checked) => {
              if (editable && onStatusChange) {
                onStatusChange(params.data!, checked);
              }
            }}
            size="small"
          />
        </Horizontal>
      );
    },
  };
}

function counterpartyColumn(): ColDef {
  return {
    headerName: 'Counterparty',
    field: 'CounterPartyName',
    minWidth: 280,
    flex: 1,
  };
}

function quoteConfigColumn(): ColDef {
  return {
    headerName: 'Quote Configuration',
    field: 'QuoteConfigurationName',
    minWidth: 180,
  };
}

interface ProductsColumnProps extends BulkEditProps {
  onOpenProducts?: (row: SubscriptionData) => void;
}

function productsColumn({
  isBulkEditMode,
  canWrite,
  bulkEditRows,
  onOpenProducts,
}: ProductsColumnProps): ColDef {
  return {
    headerName: 'Products',
    field: 'ProductIds',
    minWidth: 120,
    cellStyle: (params) =>
      getCellStyle({ row: params.data, isBulkEditMode, canWrite, bulkEditRows }),
    cellRenderer: (params: ICellRendererParams<SubscriptionData>) => {
      const productCount = Array.isArray(params.value) ? params.value.length : 0;
      const buttonText = productCount > 0 ? `${productCount} selected` : 'None';
      const editable = getIsRowEditable({
        row: params.data!,
        isBulkEditMode,
        canWrite,
        bulkEditRows,
      });
      return (
        <Horizontal className="justify-center" alignItems="center" style={{ height: '100%' }}>
          <GraviButton
            onClick={() => {
              if (editable && onOpenProducts) {
                onOpenProducts(params.data!);
              }
            }}
            buttonText={buttonText}
            className={`selection-pill ${productCount > 0 ? 'selection-pill-active' : 'selection-pill-inactive'} ${!editable ? 'disabled-gravi-button-row' : ''}`}
            size="small"
          />
        </Horizontal>
      );
    },
    filter: false,
    sortable: false,
  };
}

interface LocationsColumnProps extends BulkEditProps {
  onOpenLocations?: (row: SubscriptionData) => void;
}

function locationsColumn({
  isBulkEditMode,
  canWrite,
  bulkEditRows,
  onOpenLocations,
}: LocationsColumnProps): ColDef {
  return {
    headerName: 'Locations',
    field: 'LocationIds',
    minWidth: 120,
    cellStyle: (params) =>
      getCellStyle({ row: params.data, isBulkEditMode, canWrite, bulkEditRows }),
    cellRenderer: (params: ICellRendererParams<SubscriptionData>) => {
      const locationCount = Array.isArray(params.value) ? params.value.length : 0;
      const buttonText = locationCount > 0 ? `${locationCount} selected` : 'None';
      const editable = getIsRowEditable({
        row: params.data!,
        isBulkEditMode,
        canWrite,
        bulkEditRows,
      });
      return (
        <Horizontal className="justify-center" alignItems="center" style={{ height: '100%' }}>
          <GraviButton
            onClick={() => {
              if (editable && onOpenLocations) {
                onOpenLocations(params.data!);
              }
            }}
            buttonText={buttonText}
            className={`selection-pill ${locationCount > 0 ? 'selection-pill-active' : 'selection-pill-inactive'} ${!editable ? 'disabled-gravi-button-row' : ''}`}
            size="small"
          />
        </Horizontal>
      );
    },
    filter: false,
    sortable: false,
  };
}

// ========================================
// CONTENT CONFIGURATION COLUMNS
// ========================================

interface ContentCheckboxColumnProps extends BulkEditProps {
  field: string;
  headerName: string;
  isFirstColumn?: boolean;
  onCheckboxChange?: (row: SubscriptionData, field: string, newValue: boolean) => void;
}

function contentCheckboxColumn({
  field,
  headerName,
  isFirstColumn = false,
  isBulkEditMode,
  canWrite,
  bulkEditRows,
  onCheckboxChange,
}: ContentCheckboxColumnProps): ColDef {
  return {
    headerName,
    field,
    width: 90,
    headerClass: 'content-config-header',
    cellClass: isFirstColumn
      ? 'content-config-cell content-config-first-col'
      : 'content-config-cell',
    cellStyle: (params) => ({
      ...getCellStyle({ row: params.data, isBulkEditMode, canWrite, bulkEditRows }),
      textAlign: 'center',
      backgroundColor: 'rgba(100, 210, 141, 0.03)',
    }),
    cellRenderer: (params: ICellRendererParams<SubscriptionData>) => {
      const editable = getIsRowEditable({
        row: params.data!,
        isBulkEditMode,
        canWrite,
        bulkEditRows,
      });
      return (
        <Horizontal className="content-checkbox-cell" justifyContent="center" alignItems="center">
          <Checkbox
            checked={params.value}
            disabled={!editable}
            onChange={(e) => {
              if (editable && onCheckboxChange) {
                onCheckboxChange(params.data!, field, e.target.checked);
              }
            }}
          />
        </Horizontal>
      );
    },
    filter: false,
    sortable: false,
  };
}

interface ContentConfigGroupProps extends BulkEditProps {
  onCheckboxChange?: (row: SubscriptionData, field: string, newValue: boolean) => void;
}

export function getContentConfigColumnGroup({
  isBulkEditMode,
  canWrite,
  bulkEditRows,
  onCheckboxChange,
}: ContentConfigGroupProps): ColGroupDef {
  return {
    headerName: 'Content Configuration',
    headerClass: 'content-config-header-group',
    marryChildren: true,
    children: CONTENT_CONFIG_FIELDS.map((fieldConfig, index) =>
      contentCheckboxColumn({
        field: fieldConfig.field,
        headerName: fieldConfig.headerName,
        isFirstColumn: index === 0,
        isBulkEditMode,
        canWrite,
        bulkEditRows,
        onCheckboxChange,
      })
    ),
  };
}

// ========================================
// SUBSCRIPTION MANAGEMENT COLUMN BUILDER
// ========================================

interface SubscriptionColumnDefsProps extends BulkEditProps {
  onStatusChange?: (row: SubscriptionData, newStatus: boolean) => void;
  onOpenProducts?: (row: SubscriptionData) => void;
  onOpenLocations?: (row: SubscriptionData) => void;
  onCheckboxChange?: (row: SubscriptionData, field: string, newValue: boolean) => void;
}

export function getSubscriptionColumnDefs({
  isBulkEditMode,
  canWrite,
  bulkEditRows,
  onStatusChange,
  onOpenProducts,
  onOpenLocations,
  onCheckboxChange,
}: SubscriptionColumnDefsProps): (ColDef | ColGroupDef)[] {
  const bulkProps = { isBulkEditMode, canWrite, bulkEditRows };

  return [
    checkboxSelectionColumn(),
    statusColumn({ ...bulkProps, onStatusChange }),
    counterpartyColumn(),
    quoteConfigColumn(),
    productsColumn({ ...bulkProps, onOpenProducts }),
    locationsColumn({ ...bulkProps, onOpenLocations }),
    getContentConfigColumnGroup({ ...bulkProps, onCheckboxChange }),
  ];
}

// ========================================
// NOTIFICATION DESTINATIONS COLUMNS
// ========================================

interface DestinationColumnDefsProps {
  canWrite: boolean;
  onSiteIdsChange?: (row: RecipientData, newSiteIds: string[]) => void;
  onEmailsChange?: (row: RecipientData, newEmails: string[]) => void;
}

function destinationCounterpartyColumn(): ColDef {
  return {
    headerName: 'Counterparty',
    field: 'CounterPartyName',
    minWidth: 220,
    flex: 1,
  };
}

function siteIdColumn({ canWrite, onSiteIdsChange }: DestinationColumnDefsProps): ColDef {
  return {
    headerName: 'Site ID',
    field: 'SiteIds',
    minWidth: 280,
    suppressKeyboardEvent: () => true,
    suppressClickEdit: true,
    autoHeight: true,
    cellRenderer: (params: ICellRendererParams<RecipientData>) => (
      <SiteIdInput
        siteIds={params.value || []}
        readOnly={!canWrite}
        onChange={(newSiteIds) => {
          if (onSiteIdsChange) {
            onSiteIdsChange(params.data!, newSiteIds);
          }
        }}
      />
    ),
  };
}

function emailColumn({ canWrite, onEmailsChange }: DestinationColumnDefsProps): ColDef {
  return {
    headerName: 'Email',
    field: 'Emails',
    minWidth: 380,
    suppressKeyboardEvent: () => true,
    suppressClickEdit: true,
    autoHeight: true,
    cellRenderer: (params: ICellRendererParams<RecipientData>) => (
      <EmailInput
        emails={params.value || []}
        optedOutEmails={params.data?.OptedOutEmails}
        readOnly={!canWrite}
        onChange={(newEmails) => {
          if (onEmailsChange) {
            onEmailsChange(params.data!, newEmails);
          }
        }}
      />
    ),
  };
}

export function getDestinationColumnDefs({
  canWrite,
  onSiteIdsChange,
  onEmailsChange,
}: DestinationColumnDefsProps): ColDef[] {
  return [
    destinationCounterpartyColumn(),
    siteIdColumn({ canWrite, onSiteIdsChange }),
    emailColumn({ canWrite, onEmailsChange }),
  ];
}
