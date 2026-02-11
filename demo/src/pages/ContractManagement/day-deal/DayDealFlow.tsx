/**
 * Day Deal Flow
 *
 * Main orchestrator for the Day Deal tab.
 * Simpler than Quick Entry: flat price instead of formulas,
 * always-visible inline calendar for date selection.
 *
 * Layout:
 * - ContractHeaderSection (reused, hideEffectiveTime)
 * - DayDealCalendar (inline calendar)
 * - EmptyStateSection or DayDealGridSection
 * - FooterBar (reused, createButtonText='Create Day Deal')
 */

import { useState, useCallback } from 'react';
import { Vertical } from '@gravitate-js/excalibrr';
import { NotificationMessage } from '@gravitate-js/excalibrr';

import { FooterBar } from '../quick-entry/components/FooterBar';
import { EditHeaderModal } from '../quick-entry/components/EditHeaderModal';
import { EmptyStateSection } from '../quick-entry/sections/EmptyStateSection';
import { ContractHeaderSection } from '../quick-entry/sections/ContractHeaderSection';
import { BulkCreateDrawer } from '../quick-entry/components/BulkCreateDrawer';
import { ImportFileModal } from '../quick-entry/components/ImportFileModal';
import { CopyDealModal } from '../quick-entry/components/CopyDealModal';
import { DayDealCalendar } from './components/DayDealCalendar';
import { DayDealGridSection } from './sections/DayDealGridSection';
import { DayDealBulkEditModal } from './components/DayDealBulkEditModal';
import type {
  QuickEntryScreen,
  ContractDetail,
  ContractHeader,
  PageMode,
} from '../types/contract.types';
import styles from './DayDealFlow.module.css';

interface DayDealFlowProps {
  details: ContractDetail[];
  onDetailAdd: (detail: ContractDetail) => void;
  onDetailUpdate: (detail: ContractDetail) => void;
  onDetailDelete: (id: string) => void;
  onBulkAddDetails: (details: ContractDetail[]) => void;
  mode?: PageMode;
  initialHeader?: ContractHeader;
}

const DEFAULT_HEADER: ContractHeader = {
  internalParty: '',
  externalParty: '',
  startDate: new Date(),
  endDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
  effectiveTime: '6:00 PM',
  currency: 'US Dollars',
  unitOfMeasure: 'GAL',
};

export function DayDealFlow({
  details,
  onDetailAdd,
  onDetailUpdate,
  onDetailDelete,
  onBulkAddDetails,
  mode = 'create',
  initialHeader,
}: DayDealFlowProps) {
  // Derive screen from details
  const screen: QuickEntryScreen = details.length > 0 ? 'grid' : 'empty';

  // Contract header
  const [header, setHeader] = useState<ContractHeader>(initialHeader || DEFAULT_HEADER);

  // Calendar state
  const [calendarStartDate, setCalendarStartDate] = useState<Date | null>(null);
  const [calendarEndDate, setCalendarEndDate] = useState<Date | null>(null);
  const [activeTarget, setActiveTarget] = useState<'start' | 'end'>('start');

  // Selection state
  const [selectedDetailIds, setSelectedDetailIds] = useState<string[]>([]);

  // Modal/drawer states
  const [editHeaderModalOpen, setEditHeaderModalOpen] = useState(false);
  const [bulkCreateDrawerOpen, setBulkCreateDrawerOpen] = useState(false);
  const [bulkEditModalOpen, setBulkEditModalOpen] = useState(false);
  const [importFileModalOpen, setImportFileModalOpen] = useState(false);
  const [copyDealModalOpen, setCopyDealModalOpen] = useState(false);

  // Calendar date handlers
  const handleStartDateChange = useCallback(
    (date: Date) => {
      setCalendarStartDate(date);
      // If new start is after end, clear end
      if (calendarEndDate && date > calendarEndDate) {
        setCalendarEndDate(null);
      }
    },
    [calendarEndDate]
  );

  const handleEndDateChange = useCallback((date: Date) => {
    setCalendarEndDate(date);
  }, []);

  // Action handlers
  const handleCancel = useCallback(() => {
    console.log('Cancel clicked');
  }, []);

  const handleSaveDraft = useCallback(() => {
    NotificationMessage('Draft Saved', 'Day deal saved as draft', false);
  }, []);

  const handleCreateContract = useCallback(() => {
    NotificationMessage('Day Deal Created', 'Day deal has been created successfully', false);
  }, []);

  // Entry path handlers
  const handleUploadFile = useCallback(() => {
    setImportFileModalOpen(true);
  }, []);

  const handleAddRowManually = useCallback(() => {
    const newDetail: ContractDetail = {
      id: `detail-${Date.now()}`,
      product: '',
      location: '',
      calendar: 'Contract Calendar',
      startDate: calendarStartDate || header.startDate,
      endDate: calendarEndDate || header.endDate,
      effectiveTime: header.effectiveTime,
      provisionType: 'Fixed',
      quantity: 0,
      status: 'empty',
    };
    onDetailAdd(newDetail);
  }, [calendarStartDate, calendarEndDate, header, onDetailAdd]);

  const handleAddMultipleRows = useCallback(() => {
    setBulkCreateDrawerOpen(true);
  }, []);

  const handleCopyFromExisting = useCallback(() => {
    setCopyDealModalOpen(true);
  }, []);

  // Grid action handlers
  const handleAddDetail = useCallback(() => {
    const newDetail: ContractDetail = {
      id: `detail-${Date.now()}`,
      product: '',
      location: '',
      calendar: 'Contract Calendar',
      startDate: calendarStartDate || header.startDate,
      endDate: calendarEndDate || header.endDate,
      effectiveTime: header.effectiveTime,
      provisionType: 'Fixed',
      quantity: 0,
      status: 'empty',
    };
    onDetailAdd(newDetail);
  }, [calendarStartDate, calendarEndDate, header, onDetailAdd]);

  const handleDetailUpdate = useCallback(
    (updatedDetail: ContractDetail) => {
      onDetailUpdate(updatedDetail);
    },
    [onDetailUpdate]
  );

  const handleDetailDelete = useCallback(
    (detailId: string) => {
      onDetailDelete(detailId);
    },
    [onDetailDelete]
  );

  const handleSelectionChange = useCallback((selectedIds: string[]) => {
    setSelectedDetailIds(selectedIds);
  }, []);

  const handleBulkEdit = useCallback(() => {
    if (selectedDetailIds.length > 0) {
      setBulkEditModalOpen(true);
    }
  }, [selectedDetailIds]);

  // Bulk create handler
  const handleBulkCreate = useCallback(
    (products: string[], locations: string[]) => {
      const newDetails: ContractDetail[] = [];
      let counter = Date.now();

      for (const product of products) {
        for (const location of locations) {
          newDetails.push({
            id: `detail-${counter++}`,
            product,
            location,
            calendar: 'Contract Calendar',
            startDate: calendarStartDate || header.startDate,
            endDate: calendarEndDate || header.endDate,
            effectiveTime: header.effectiveTime,
            provisionType: 'Fixed',
            quantity: 0,
            status: 'empty',
          });
        }
      }

      onBulkAddDetails(newDetails);
      setBulkCreateDrawerOpen(false);
    },
    [calendarStartDate, calendarEndDate, header, onBulkAddDetails]
  );

  // Import file handler
  const handleImportComplete = useCallback(
    (importedDetails: ContractDetail[]) => {
      onBulkAddDetails(importedDetails);
      setImportFileModalOpen(false);
    },
    [onBulkAddDetails]
  );

  // Copy deal handler
  const handleCopyDeal = useCallback(
    (copiedDetails: ContractDetail[]) => {
      onBulkAddDetails(copiedDetails);
      setCopyDealModalOpen(false);
    },
    [onBulkAddDetails]
  );

  // Bulk edit apply handler
  const handleBulkEditApply = useCallback(
    (field: keyof ContractDetail, value: unknown) => {
      details
        .filter((d) => selectedDetailIds.includes(d.id))
        .forEach((d) => {
          onDetailUpdate({ ...d, [field]: value });
        });
      setBulkEditModalOpen(false);
    },
    [details, selectedDetailIds, onDetailUpdate]
  );

  // Day deal completeness check: product, location, fixedValue, quantity
  const isDetailComplete = (d: ContractDetail) =>
    d.product !== '' && d.location !== '' && d.fixedValue != null && d.quantity > 0;

  const hasIncompleteDetails = details.length === 0 || details.some((d) => !isDetailComplete(d));
  const isCreateDisabled = hasIncompleteDetails;

  return (
    <Vertical height="100%" className={styles['page-wrapper']}>
      {/* Info Bar */}
      <ContractHeaderSection
        header={header}
        onEditClick={() => setEditHeaderModalOpen(true)}
        hideEffectiveTime
      />

      {/* Inline Calendar */}
      <DayDealCalendar
        startDate={calendarStartDate}
        endDate={calendarEndDate}
        activeTarget={activeTarget}
        onStartDateChange={handleStartDateChange}
        onEndDateChange={handleEndDateChange}
        onActiveTargetChange={setActiveTarget}
      />

      {/* Main content area */}
      <Vertical flex="1" className={styles['main-content']}>
        <div className={styles['grid-panel']}>
          <div className={styles['panel-body']}>
            {screen === 'empty' && mode === 'create' ? (
              <EmptyStateSection
                onUploadFile={handleUploadFile}
                onAddRowManually={handleAddRowManually}
                onAddMultipleRows={handleAddMultipleRows}
                onCopyFromExisting={handleCopyFromExisting}
              />
            ) : (
              <DayDealGridSection
                details={details}
                selectedIds={selectedDetailIds}
                onDetailUpdate={handleDetailUpdate}
                onDetailDelete={handleDetailDelete}
                onSelectionChange={handleSelectionChange}
                onAddDetail={handleAddDetail}
                onBulkEdit={handleBulkEdit}
                onBulkCreate={() => setBulkCreateDrawerOpen(true)}
              />
            )}
          </div>
        </div>
      </Vertical>

      {/* Footer Bar */}
      <FooterBar
        onCancel={handleCancel}
        onSaveDraft={handleSaveDraft}
        onCreateContract={handleCreateContract}
        isCreateDisabled={isCreateDisabled}
        validationMessage={
          hasIncompleteDetails && details.length > 0
            ? 'Please complete all fields (product, location, price, quantity) before creating.'
            : undefined
        }
        mode={mode}
        createButtonText="Create Day Deal"
      />

      {/* Edit Header Modal */}
      <EditHeaderModal
        visible={editHeaderModalOpen}
        header={header}
        onClose={() => setEditHeaderModalOpen(false)}
        onSave={setHeader}
      />

      {/* Bulk Create Drawer */}
      <BulkCreateDrawer
        visible={bulkCreateDrawerOpen}
        onClose={() => setBulkCreateDrawerOpen(false)}
        onCreate={handleBulkCreate}
      />

      {/* Day Deal Bulk Edit Modal */}
      <DayDealBulkEditModal
        visible={bulkEditModalOpen}
        selectedCount={selectedDetailIds.length}
        onClose={() => setBulkEditModalOpen(false)}
        onApply={handleBulkEditApply}
      />

      {/* Import File Modal */}
      <ImportFileModal
        visible={importFileModalOpen}
        onClose={() => setImportFileModalOpen(false)}
        onImport={handleImportComplete}
        headerDates={{ startDate: header.startDate, endDate: header.endDate }}
      />

      {/* Copy Deal Modal */}
      <CopyDealModal
        visible={copyDealModalOpen}
        onClose={() => setCopyDealModalOpen(false)}
        onCopy={handleCopyDeal}
      />
    </Vertical>
  );
}
