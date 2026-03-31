import { useState, useCallback } from 'react';
import { Vertical, Horizontal, Texto, GraviButton } from '@gravitate-js/excalibrr';
import { CheckCircleOutlined, CloseCircleOutlined, LoadingOutlined } from '@ant-design/icons';
import { Checkbox, Modal, Steps, Tag } from 'antd';
import { mockRevaluationRows } from './mockData';

const { Step } = Steps;

interface RevaluationWizardContext {
  instrumentId: number;
  instrumentName: string;
  effectiveFromDate: string;
  effectiveToDate?: string;
  publisher?: string;
}

interface RevaluationWizardModalProps {
  open: boolean;
  onClose: () => void;
  context: RevaluationWizardContext | null;
  /** When true, Step 1 (Date Range & Publisher) is skipped — pre-filled from context */
  skipStep1?: boolean;
}

type WizardStep = 'dateRange' | 'selectDetails' | 'confirm';

export function RevaluationWizardModal({ open, onClose, context, skipStep1 = true }: RevaluationWizardModalProps) {
  const [step, setStep] = useState<WizardStep>(skipStep1 ? 'selectDetails' : 'dateRange');
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [, setIsComplete] = useState(false);
  const [hasFailed, setHasFailed] = useState(false);

  const stepIndex: Record<WizardStep, number> = {
    dateRange: 0,
    selectDetails: 1,
    confirm: 2,
  };

  const allIds = mockRevaluationRows.map((r) => r.RevaluationId);
  const allSelected = selectedIds.length === mockRevaluationRows.length;

  const handleClose = useCallback(() => {
    setStep(skipStep1 ? 'selectDetails' : 'dateRange');
    setSelectedIds([]);
    setIsProcessing(false);
    setIsComplete(false);
    setHasFailed(false);
    onClose();
  }, [onClose, skipStep1]);

  const runRevaluation = useCallback(() => {
    setStep('confirm');
    setIsProcessing(true);
    setHasFailed(false);
    setTimeout(() => {
      setIsProcessing(false);
      setIsComplete(true);
    }, 2000);
  }, []);

  const handleRetry = useCallback(() => {
    setIsProcessing(true);
    setHasFailed(false);
    setTimeout(() => {
      setIsProcessing(false);
      setIsComplete(true);
    }, 2000);
  }, []);

  const handleNext = useCallback(() => {
    if (step === 'dateRange') setStep('selectDetails');
    else if (step === 'selectDetails') runRevaluation();
  }, [step, runRevaluation]);

  const handleBack = useCallback(() => {
    if (step === 'selectDetails' && !skipStep1) setStep('dateRange');
  }, [step, skipStep1]);

  const toggleContract = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  const toggleAll = () => {
    setSelectedIds(allSelected ? [] : allIds);
  };

  // ─── Step Content ───────────────────────────────────────────────────────

  const renderDateRange = () => (
    <Vertical gap={16}>
      <Texto appearance="medium" style={{ fontSize: 13 }}>
        Date range and publisher are pre-filled from your price upload.
      </Texto>
      <Vertical gap={8}>
        <Texto style={{ fontSize: 13, fontWeight: 600 }}>Date Range</Texto>
        <Texto style={{ fontSize: 13 }}>
          {context?.effectiveFromDate ?? '—'}{context?.effectiveToDate ? ` to ${context.effectiveToDate}` : ''}
        </Texto>
      </Vertical>
      <Vertical gap={8}>
        <Texto style={{ fontSize: 13, fontWeight: 600 }}>Publisher</Texto>
        <Texto style={{ fontSize: 13 }}>{context?.publisher ?? 'OPIS'}</Texto>
      </Vertical>
    </Vertical>
  );

  const renderSelectDetails = () => (
    <Vertical gap={12}>
      {context && (
        <Horizontal gap={8} verticalCenter style={{ flexWrap: 'wrap', marginBottom: 4 }}>
          <Tag color="blue">{context.instrumentName}</Tag>
          <Tag>{context.effectiveFromDate}{context.effectiveToDate ? ` — ${context.effectiveToDate}` : ''}</Tag>
          <Tag>{context.publisher ?? 'OPIS'}</Tag>
        </Horizontal>
      )}
      <Horizontal verticalCenter gap={8} style={{ padding: '8px 0', borderBottom: '1px solid var(--theme-border)' }}>
        <Checkbox checked={allSelected} onChange={toggleAll} />
        <Texto style={{ fontWeight: 600, fontSize: 13 }}>Select All</Texto>
        <Texto appearance="medium" style={{ fontSize: 12, marginLeft: 'auto' }}>
          {selectedIds.length} of {mockRevaluationRows.length} selected
        </Texto>
      </Horizontal>
      {mockRevaluationRows.map((row) => (
        <Horizontal key={row.RevaluationId} verticalCenter gap={8} style={{ padding: '8px 12px', border: '1px solid var(--theme-border)', borderRadius: 6 }}>
          <Checkbox
            checked={selectedIds.includes(row.RevaluationId)}
            onChange={() => toggleContract(row.RevaluationId)}
          />
          <Vertical flex="1">
            <Texto style={{ fontWeight: 600, fontSize: 13 }}>{row.ContractName}</Texto>
            <Texto appearance="medium" style={{ fontSize: 12 }}>
              {row.Counterparty} — {row.Product} — {row.Location}
            </Texto>
          </Vertical>
        </Horizontal>
      ))}
    </Vertical>
  );

  const renderConfirm = () => (
    <Vertical gap={16} style={{ textAlign: 'center', padding: '32px 0' }}>
      {isProcessing ? (
        <>
          <LoadingOutlined style={{ fontSize: 48, color: 'var(--theme-color-1)' }} />
          <Texto style={{ fontSize: 16, fontWeight: 600, marginTop: 16 }}>Processing Revaluation...</Texto>
          <Texto appearance="medium" style={{ fontSize: 13 }}>
            Revaluing {selectedIds.length} contract detail(s). This may take a moment.
          </Texto>
        </>
      ) : hasFailed ? (
        <>
          <CloseCircleOutlined style={{ fontSize: 48, color: 'var(--theme-error)' }} />
          <Texto style={{ fontSize: 16, fontWeight: 600, marginTop: 16 }}>Revaluation Failed</Texto>
          <Texto appearance="medium" style={{ fontSize: 13 }}>
            An error occurred during revaluation. Please try again or contact support.
          </Texto>
          <GraviButton type="primary" onClick={handleRetry} style={{ marginTop: 8 }}>
            Retry
          </GraviButton>
        </>
      ) : (
        <>
          <CheckCircleOutlined style={{ fontSize: 48, color: 'var(--theme-success)' }} />
          <Texto style={{ fontSize: 16, fontWeight: 600, marginTop: 16 }}>Revaluation Complete</Texto>
          <Texto appearance="medium" style={{ fontSize: 13 }}>
            {selectedIds.length} contract detail(s) revalued successfully.
          </Texto>
        </>
      )}
    </Vertical>
  );

  const stepContent: Record<WizardStep, JSX.Element> = {
    dateRange: renderDateRange(),
    selectDetails: renderSelectDetails(),
    confirm: renderConfirm(),
  };

  const footer = (
    <Horizontal justifyContent="space-between">
      <GraviButton onClick={handleClose}>Cancel</GraviButton>
      <Horizontal gap={8}>
        {step === 'selectDetails' && !skipStep1 && (
          <GraviButton onClick={handleBack}>Back</GraviButton>
        )}
        {step !== 'confirm' ? (
          <GraviButton
            type="primary"
            onClick={handleNext}
            disabled={step === 'selectDetails' && selectedIds.length === 0}
          >
            {step === 'selectDetails' ? `Revalue Selected (${selectedIds.length})` : 'Next'}
          </GraviButton>
        ) : hasFailed ? (
          <GraviButton onClick={handleClose}>Close</GraviButton>
        ) : (
          <GraviButton
            type="primary"
            onClick={handleClose}
            disabled={isProcessing}
          >
            Done
          </GraviButton>
        )}
      </Horizontal>
    </Horizontal>
  );

  return (
    <Modal
      title="Revaluation — Contract Details"
      open={open}
      onCancel={handleClose}
      footer={footer}
      width={720}
      destroyOnHidden
    >
      <Vertical gap={24}>
        <Steps current={stepIndex[step]} size="small">
          <Step title="Date Range & Publisher" disabled={skipStep1} description={skipStep1 ? 'Pre-filled' : undefined} />
          <Step title="Select Contract Details" />
          <Step title="Confirm & Run" />
        </Steps>
        <div style={{ minHeight: 280 }}>
          {stepContent[step]}
        </div>
      </Vertical>
    </Modal>
  );
}
