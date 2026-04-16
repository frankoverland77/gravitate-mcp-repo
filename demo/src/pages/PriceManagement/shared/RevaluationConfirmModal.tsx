import { GraviButton, Horizontal, Texto } from '@gravitate-js/excalibrr';
import { Modal } from 'antd';
import { CheckCircleOutlined } from '@ant-design/icons';

interface RevaluationConfirmModalProps {
  open: boolean;
  onDismiss: () => void;
  onCheckImpacted: () => void;
}

export function RevaluationConfirmModal({ open, onDismiss, onCheckImpacted }: RevaluationConfirmModalProps) {
  return (
    <Modal
      open={open}
      onCancel={onDismiss}
      title={null}
      footer={null}
      width={480}
      centered
    >
      <div style={{ textAlign: 'center', padding: '16px 0' }}>
        <CheckCircleOutlined style={{ fontSize: 48, color: 'var(--theme-success)', marginBottom: 16 }} />
        <Texto category="h4" style={{ marginBottom: 8 }}>Price Saved Successfully</Texto>
        <Texto appearance="medium" style={{ fontSize: 13, marginBottom: 24 }}>
          We received your new price, but because the effective date falls before the prior period, would you like to historically revalue impacted contracts?
        </Texto>
        <Horizontal gap={8} horizontalCenter>
          <GraviButton onClick={onDismiss}>No Thanks</GraviButton>
          <GraviButton theme1 onClick={onCheckImpacted}>Revalue</GraviButton>
        </Horizontal>
      </div>
    </Modal>
  );
}
