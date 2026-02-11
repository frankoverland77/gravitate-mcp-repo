/**
 * Footer Bar Component
 *
 * Bottom action bar with Cancel / Save Draft / Create Contract buttons
 * Fixed at bottom, right-aligned buttons
 * Supports create/edit/view modes
 */

import { Horizontal, GraviButton, Texto } from '@gravitate-js/excalibrr';
import { CaretRightOutlined } from '@ant-design/icons';
import type { PageMode, ContractStatus } from '../../types/contract.types';
import styles from './FooterBar.module.css';

interface FooterBarProps {
  onCancel: () => void;
  onSaveDraft: () => void;
  onCreateContract: () => void;
  isCreateDisabled?: boolean;
  validationMessage?: string;
  mode?: PageMode;
  contractStatus?: ContractStatus;
  onExtendContract?: () => void;
  createButtonText?: string;
}

export function FooterBar({
  onCancel,
  onSaveDraft,
  onCreateContract,
  isCreateDisabled,
  validationMessage,
  mode = 'create',
  contractStatus,
  onExtendContract,
  createButtonText,
}: FooterBarProps) {
  if (mode === 'view') {
    if (contractStatus === 'expired' && onExtendContract) {
      return (
        <Horizontal className={styles.container} justifyContent="flex-end" alignItems="center">
          <GraviButton buttonText="Extend Contract" theme1 onClick={onExtendContract} />
        </Horizontal>
      );
    }
    return null;
  }

  const buttonText = createButtonText || (mode === 'edit' ? 'Update Contract' : 'Create Contract');

  return (
    <Horizontal
      className={styles.container}
      justifyContent="flex-end"
      alignItems="center"
      style={{ gap: '12px' }}
    >
      {validationMessage && (
        <Texto category="p2" appearance="warning" style={{ marginRight: 'auto' }}>
          {validationMessage}
        </Texto>
      )}
      <GraviButton buttonText="Cancel" onClick={onCancel} />
      <GraviButton buttonText="Save Draft" onClick={onSaveDraft} />
      <GraviButton
        buttonText={buttonText}
        success
        icon={<CaretRightOutlined />}
        onClick={onCreateContract}
        disabled={isCreateDisabled}
      />
    </Horizontal>
  );
}
