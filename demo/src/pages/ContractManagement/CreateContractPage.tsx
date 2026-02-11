/**
 * Create / Edit / View Contract Page
 *
 * Page with segmented control to toggle between Quick Entry and Full Entry modes.
 * Supports three modes:
 * - create: new contract (default, no URL param)
 * - edit: draft/pending/active contract (editable with status-based restrictions)
 * - view: expired contract (read-only, extend via modal)
 */

import { useState, useCallback, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Vertical, Horizontal, Texto, GraviButton } from '@gravitate-js/excalibrr';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { Segmented } from 'antd';

import { QuickEntryFlow } from './quick-entry/QuickEntryFlow';
import { FullEntryFlow } from './full-entry/FullEntryFlow';
import { DayDealFlow } from './day-deal/DayDealFlow';
import { getContractById, contractToHeader, derivePageMode } from './data/contract.data';
import type { CreateMode, ContractDetail, PageMode } from './types/contract.types';
import type { FullEntryHeader } from './full-entry/fullentry.types';
import styles from './CreateContractPage.module.css';

export function CreateContractPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const contractId = searchParams.get('contractId') ?? undefined;

  // Look up contract if editing/viewing
  const contract = useMemo(
    () => (contractId ? getContractById(contractId) : undefined),
    [contractId]
  );

  // Derive mode from contract status
  const mode: PageMode = useMemo(() => {
    if (!contract) return 'create';
    return derivePageMode(contract.status);
  }, [contract]);

  const [createMode, setCreateMode] = useState<CreateMode>('quick');
  const [details, setDetails] = useState<ContractDetail[]>(contract?.details ?? []);

  // Pre-compute initial headers for Quick Entry and Full Entry
  const initialQuickEntryHeader = useMemo(() => {
    if (!contract) return undefined;
    return contractToHeader(contract);
  }, [contract]);

  const initialFullEntryHeader = useMemo<FullEntryHeader | undefined>(() => {
    if (!contract) return undefined;
    return {
      contractType: 'Term - Formula',
      description: '',
      comments: '',
      internalCounterparty: contract.internalParty,
      internalContact: '',
      externalCounterparty: contract.externalParty,
      externalContact: '',
      contractCalendar: 'Contract Calendar',
      contractDate: contract.startDate,
      effectiveDates: [contract.startDate, contract.endDate],
      requireQuantities: false,
      internalContractNumber: '',
      externalContractNumber: '',
      movementType: '',
      strategy: '',
    };
  }, [contract]);

  // Page header text based on mode
  const pageTitle =
    mode === 'create'
      ? 'Create Contract'
      : contract?.status === 'expired'
        ? 'View Contract'
        : 'Edit Contract';
  const pageSubtitle =
    mode === 'create' ? 'Create a new supply or purchase contract' : (contract?.name ?? '');

  const handleBack = useCallback(() => {
    navigate('/Contracts');
  }, [navigate]);

  const handleModeChange = useCallback((value: string | number) => {
    setCreateMode(value as CreateMode);
  }, []);

  const handleDetailAdd = useCallback((detail: ContractDetail) => {
    setDetails((prev) => [...prev, detail]);
  }, []);

  const handleDetailUpdate = useCallback((updated: ContractDetail) => {
    setDetails((prev) => prev.map((d) => (d.id === updated.id ? updated : d)));
  }, []);

  const handleDetailDelete = useCallback((id: string) => {
    setDetails((prev) => prev.filter((d) => d.id !== id));
  }, []);

  const handleBulkAddDetails = useCallback((newDetails: ContractDetail[]) => {
    setDetails((prev) => [...prev, ...newDetails]);
  }, []);

  return (
    <Vertical className={styles.page}>
      {/* Header */}
      <Vertical className={styles.header} flex="0 0 auto" height="auto" alignItems="flex-start">
        <Horizontal alignItems="center" style={{ gap: '16px' }}>
          <GraviButton
            icon={<ArrowLeftOutlined />}
            onClick={handleBack}
            className={styles.backButton}
          />
          <Vertical>
            <Texto category="h3" weight="600">
              {pageTitle}
            </Texto>
            <Texto category="p2" appearance="medium">
              {pageSubtitle}
            </Texto>
          </Vertical>
        </Horizontal>

        {/* Mode Selector */}
        <Segmented
          value={createMode}
          onChange={handleModeChange as (value: string | number) => void}
          options={[
            { value: 'quick', label: 'Quick Entry' },
            { value: 'full', label: 'Full Entry' },
            { value: 'day-deal', label: 'Day Deal' },
          ]}
          className={styles.segmented}
        />
      </Vertical>

      {/* Content based on mode */}
      <Vertical flex="1" className={styles.content}>
        {createMode === 'quick' ? (
          <QuickEntryFlow
            details={details}
            onDetailAdd={handleDetailAdd}
            onDetailUpdate={handleDetailUpdate}
            onDetailDelete={handleDetailDelete}
            onBulkAddDetails={handleBulkAddDetails}
            mode={mode}
            initialHeader={initialQuickEntryHeader}
            contractName={contract?.name}
            contractStatus={contract?.status}
            createdAt={contract?.createdAt}
          />
        ) : createMode === 'day-deal' ? (
          <DayDealFlow
            details={details}
            onDetailAdd={handleDetailAdd}
            onDetailUpdate={handleDetailUpdate}
            onDetailDelete={handleDetailDelete}
            onBulkAddDetails={handleBulkAddDetails}
            mode={mode}
            initialHeader={initialQuickEntryHeader}
          />
        ) : (
          <FullEntryFlow
            details={details}
            onDetailAdd={handleDetailAdd}
            onDetailUpdate={handleDetailUpdate}
            onDetailDelete={handleDetailDelete}
            onBulkAddDetails={handleBulkAddDetails}
            mode={mode}
            initialHeader={initialFullEntryHeader}
            contractStatus={contract?.status}
          />
        )}
      </Vertical>
    </Vertical>
  );
}
