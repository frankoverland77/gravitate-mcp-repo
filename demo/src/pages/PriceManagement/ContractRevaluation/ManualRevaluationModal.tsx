import { useState, useCallback } from 'react';
import { Vertical, Horizontal, Texto, GraviButton } from '@gravitate-js/excalibrr';
import { CheckCircleOutlined, CloseCircleOutlined, LoadingOutlined } from '@ant-design/icons';
import { Checkbox, DatePicker, Modal, Select, Steps } from 'antd';
import { mockRevaluationRows } from '../shared/mockData';

const { Step } = Steps;
const { RangePicker } = DatePicker;

type WizardStep = 'dateRange' | 'selectDetails' | 'confirm';

interface ManualRevaluationModalProps {
  open: boolean;
  onClose: () => void;
  onComplete: (revaluationIds: number[]) => void;
}

export function ManualRevaluationModal({ open, onClose, onComplete }: ManualRevaluationModalProps) {
  const [step, setStep] = useState<WizardStep>('dateRange');
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
    setStep('dateRange');
    setSelectedIds([]);
    setIsProcessing(false);
    setIsComplete(false);
    setHasFailed(false);
    onClose();
  }, [onClose]);

  const runRevaluation = useCallback(() => {
    setStep('confirm');
    setIsProcessing(true);
    setHasFailed(false);
    setTimeout(() => {
      if (Math.random() < 0.2) {
        setIsProcessing(false);
        setHasFailed(true);
      } else {
        setIsProcessing(false);
        setIsComplete(true);
      }
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
    if (step === 'selectDetails') setStep('dateRange');
  }, [step]);

  const handleFinish = useCallback(() => {
    onComplete(selectedIds);
    handleClose();
  }, [selectedIds, onComplete, handleClose]);

  const toggleContract = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  const toggleAll = () => {
    setSelectedIds(allSelected ? [] : allIds);
  };

  // ─── Step Content Renderers ─────────────────────────────────────────────

  const renderDateRange = () => (
    <Vertical gap={16}>
      <Texto appearance="medium" style={{ fontSize: 13 }}>
        Select the date range and publisher for this revaluation.
      </Texto>
      <Vertical gap={8}>
        <Texto style={{ fontSize: 13, fontWeight: 600 }}>Date Range</Texto>
        <RangePicker style={{ width: 320 }} />
      </Vertical>
      <Vertical gap={8}>
        <Texto style={{ fontSize: 13, fontWeight: 600 }}>Publisher</Texto>
        <Select
          defaultValue="OPIS"
          style={{ width: 200 }}
          options={[
            { value: 'OPIS', label: 'OPIS' },
            { value: 'Platts', label: 'Platts' },
            { value: 'CME', label: 'CME' },
            { value: 'Internal', label: 'Internal' },
          ]}
        />
      </Vertical>
    </Vertical>
  );

  const renderSelectDetails = () => (
    <Vertical gap={12}>
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

  // ─── Footer Buttons ────────────────────────────────────────────────────

  const footer = (
    <Horizontal justifyContent="space-between">
      <GraviButton onClick={handleClose}>Cancel</GraviButton>
      <Horizontal gap={8}>
        {step === 'selectDetails' && (
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
            onClick={handleFinish}
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
      title="Revaluation Wizard"
      open={open}
      onCancel={handleClose}
      footer={footer}
      width={720}
      destroyOnHidden
    >
      <Vertical gap={24}>
        <Steps current={stepIndex[step]} size="small">
          <Step title="Date Range & Publisher" />
          <Step title="Select Contract Details" />
          <Step title="Confirm & Run" />
        </Steps>
        <div style={{ minHeight: 300 }}>
          {stepContent[step]}
        </div>
      </Vertical>
    </Modal>
  );
}
