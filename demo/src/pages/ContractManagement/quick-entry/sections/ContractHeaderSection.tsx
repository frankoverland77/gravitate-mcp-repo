/**
 * Contract Header Section (InfoBar)
 *
 * Dark green compact bar showing contract header values inline.
 * "Edit Details" link opens modal for editing.
 */

import { Horizontal } from '@gravitate-js/excalibrr';
import dayjs from 'dayjs';

import type { ContractHeader } from '../../types/contract.types';
import styles from './ContractHeaderSection.module.css';

interface ContractHeaderSectionProps {
  header: ContractHeader;
  onEditClick: () => void;
  hideEffectiveTime?: boolean;
}

function formatDateRange(start: Date, end: Date): string {
  const startStr = dayjs(start).format('MMM D, YYYY');
  const endStr = dayjs(end).format('MMM D, YYYY');
  return `${startStr} - ${endStr}`;
}

export function ContractHeaderSection({
  header,
  onEditClick,
  hideEffectiveTime,
}: ContractHeaderSectionProps) {
  const hasInternalParty = !!header.internalParty;
  const hasExternalParty = !!header.externalParty;

  return (
    <Horizontal gap={24} className={styles.container} alignItems="center">
      {/* Internal Party */}
      <div className={styles.infoItem}>
        <span className={styles.infoLabel}>Internal:</span>
        <span className={styles.infoValue}>
          {hasInternalParty ? header.internalParty : 'Not set'}
        </span>
      </div>

      <div className={styles.separator} />

      {/* External Party */}
      <div className={styles.infoItem}>
        <span className={styles.infoLabel}>External:</span>
        <span className={styles.infoValue}>
          {hasExternalParty ? header.externalParty : 'Not set'}
        </span>
      </div>

      <div className={styles.separator} />

      {/* Contract Period */}
      <div className={styles.infoItem}>
        <span className={styles.infoLabel}>Contract Period:</span>
        <span className={styles.infoValue}>
          {formatDateRange(header.startDate, header.endDate)}
        </span>
      </div>

      {!hideEffectiveTime && (
        <>
          <div className={styles.separator} />

          {/* Effective Time */}
          <div className={styles.infoItem}>
            <span className={styles.infoLabel}>Effective Time:</span>
            <span className={styles.infoValue}>{header.effectiveTime}</span>
          </div>
        </>
      )}

      {/* Edit Link */}
      <span className={styles.editLink} onClick={onEditClick}>
        Edit Details
      </span>
    </Horizontal>
  );
}
