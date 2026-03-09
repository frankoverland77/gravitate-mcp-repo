/**
 * Edit Header Modal
 *
 * Modal for editing contract header values. Required fields (parties, dates,
 * currency, UOM) are always visible with red asterisk indicators. Optional
 * fields (contacts, contract settings, description) are in a single
 * collapsible "Optional Fields" panel with sub-section headers.
 */

import { useState, useEffect } from 'react';
import { Modal, Select, DatePicker, Input, Switch, Collapse, Divider } from 'antd';
import { Vertical, Horizontal, Texto } from '@gravitate-js/excalibrr';
import dayjs from 'dayjs';

import type { ContractHeader } from '../../types/contract.types';
import {
  INTERNAL_PARTY_OPTIONS,
  EXTERNAL_PARTY_OPTIONS,
  CURRENCY_OPTIONS,
  UOM_OPTIONS,
  EFFECTIVE_TIME_OPTIONS,
  CONTRACT_TYPE_OPTIONS,
} from '../../data/contract.data';
import { CONTACT_OPTIONS, CALENDAR_OPTIONS } from '../../full-entry/fullentry.defaults';
import styles from './EditHeaderModal.module.css';

const { TextArea } = Input;
const { Panel } = Collapse;

interface EditHeaderModalProps {
  open: boolean;
  header: ContractHeader;
  onClose: () => void;
  onSave: (header: ContractHeader) => void;
}

function FormLabel({ children, required }: { children: React.ReactNode; required?: boolean }) {
  return (
    <Texto
      category="p2"
      appearance="medium"
      weight="500"
      style={{ textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 4 }}
    >
      {children}
      {required && (
        <span style={{ color: 'var(--theme-color-error, #ff4d4f)', marginLeft: 2 }}>*</span>
      )}
    </Texto>
  );
}

function SectionHeader({ children }: { children: React.ReactNode }) {
  return (
    <Texto
      category="p2"
      appearance="medium"
      weight="600"
      className={styles.sectionHeader}
      style={{ textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 8 }}
    >
      {children}
    </Texto>
  );
}

export function EditHeaderModal({ open, header, onClose, onSave }: EditHeaderModalProps) {
  const [formData, setFormData] = useState<ContractHeader>(header);

  // Sync form data when header changes or modal opens
  useEffect(() => {
    if (open) {
      setFormData(header);
    }
  }, [open, header]);

  const handleFieldChange = (
    field: keyof ContractHeader,
    value: string | Date | boolean | null
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    onSave(formData);
    onClose();
  };

  return (
    <Modal
      open={open}
      title="Edit Contract Details"
      onCancel={onClose}
      onOk={handleSave}
      okText="Save Changes"
      width={680}
    >
      <Vertical gap={20} className={styles.formContainer}>
        {/* ── Required Legend ── */}
        <Texto category="p2" appearance="medium" style={{ fontStyle: 'italic' }}>
          <span style={{ color: 'var(--theme-color-error, #ff4d4f)' }}>*</span> Required
        </Texto>

        {/* ── Required Fields ── */}

        {/* Row 1: Parties */}
        <Horizontal gap={16}>
          <Vertical flex="1">
            <FormLabel required>Internal Party</FormLabel>
            <Select
              value={formData.internalParty || undefined}
              onChange={(value) => handleFieldChange('internalParty', value)}
              placeholder="Select internal party"
              style={{ width: '100%' }}
              options={INTERNAL_PARTY_OPTIONS.map((p) => ({ value: p, label: p }))}
            />
          </Vertical>

          <Vertical flex="1">
            <FormLabel required>External Party</FormLabel>
            <Select
              value={formData.externalParty || undefined}
              onChange={(value) => handleFieldChange('externalParty', value)}
              placeholder="Select counterparty"
              style={{ width: '100%' }}
              showSearch
              filterOption={(input, option) =>
                (option?.label as string)?.toLowerCase().includes(input.toLowerCase())
              }
              options={EXTERNAL_PARTY_OPTIONS.map((p) => ({ value: p, label: p }))}
            />
          </Vertical>
        </Horizontal>

        {/* Row 2: Dates */}
        <Horizontal gap={16}>
          <Vertical flex="1">
            <FormLabel required>Start Date</FormLabel>
            <DatePicker
              value={formData.startDate ? dayjs(formData.startDate) : null}
              onChange={(date) => handleFieldChange('startDate', date?.toDate() || new Date())}
              style={{ width: '100%' }}
              format="MMM D, YYYY"
            />
          </Vertical>

          <Vertical flex="1">
            <FormLabel required>End Date</FormLabel>
            <DatePicker
              value={formData.endDate ? dayjs(formData.endDate) : null}
              onChange={(date) => handleFieldChange('endDate', date?.toDate() || new Date())}
              style={{ width: '100%' }}
              format="MMM D, YYYY"
            />
          </Vertical>
        </Horizontal>

        {/* Row 3: Currency and UOM */}
        <Horizontal gap={16}>
          <Vertical flex="1">
            <FormLabel required>Currency</FormLabel>
            <Select
              value={formData.currency}
              onChange={(value) => handleFieldChange('currency', value)}
              style={{ width: '100%' }}
              options={CURRENCY_OPTIONS.map((c) => ({ value: c, label: c }))}
            />
          </Vertical>

          <Vertical flex="1">
            <FormLabel required>Unit of Measure</FormLabel>
            <Select
              value={formData.unitOfMeasure}
              onChange={(value) => handleFieldChange('unitOfMeasure', value)}
              style={{ width: '100%' }}
              options={UOM_OPTIONS.map((u) => ({ value: u, label: u }))}
            />
          </Vertical>
        </Horizontal>

        {/* ── Optional Fields (single collapsible) ── */}
        <Divider className={styles.sectionDivider} />

        <Collapse ghost defaultActiveKey={[]} className={styles.collapseSection}>
          <Panel
            header={
              <Texto category="h5" weight="600" style={{ color: 'rgba(0, 0, 0, 0.85)' }}>
                Optional Fields
              </Texto>
            }
            key="optional"
          >
            <Vertical gap={16}>
              {/* Sub-section: Contacts */}
              <SectionHeader>Contacts</SectionHeader>
              <Horizontal gap={16}>
                <Vertical flex="1">
                  <FormLabel>Internal Contact</FormLabel>
                  <Select
                    value={formData.internalContact || undefined}
                    onChange={(value) => handleFieldChange('internalContact', value)}
                    placeholder="Select contact"
                    style={{ width: '100%' }}
                    allowClear
                    options={CONTACT_OPTIONS}
                  />
                </Vertical>

                <Vertical flex="1">
                  <FormLabel>External Contact</FormLabel>
                  <Select
                    value={formData.externalContact || undefined}
                    onChange={(value) => handleFieldChange('externalContact', value)}
                    placeholder="Select contact"
                    style={{ width: '100%' }}
                    allowClear
                    options={CONTACT_OPTIONS}
                  />
                </Vertical>
              </Horizontal>

              {/* Sub-section: Contract Settings */}
              <SectionHeader>Contract Settings</SectionHeader>

              {/* Row 1: Contract Type + Effective Time */}
              <Horizontal gap={16}>
                <Vertical flex="1">
                  <FormLabel>Contract Type</FormLabel>
                  <Select
                    value={formData.contractType || undefined}
                    onChange={(value) => handleFieldChange('contractType', value)}
                    placeholder="Select contract type"
                    style={{ width: '100%' }}
                    options={CONTRACT_TYPE_OPTIONS.map((t) => ({ value: t, label: t }))}
                  />
                </Vertical>

                <Vertical flex="1">
                  <FormLabel>Effective Time</FormLabel>
                  <Select
                    value={formData.effectiveTime}
                    onChange={(value) => handleFieldChange('effectiveTime', value)}
                    style={{ width: '100%' }}
                    options={EFFECTIVE_TIME_OPTIONS.map((t) => ({ value: t, label: t }))}
                  />
                </Vertical>
              </Horizontal>

              {/* Row 2: Contract Date + Contract Calendar */}
              <Horizontal gap={16}>
                <Vertical flex="1">
                  <FormLabel>Contract Date</FormLabel>
                  <DatePicker
                    value={formData.contractDate ? dayjs(formData.contractDate) : null}
                    onChange={(date) => handleFieldChange('contractDate', date?.toDate() || null)}
                    style={{ width: '100%' }}
                    format="MMM D, YYYY"
                  />
                </Vertical>

                <Vertical flex="1">
                  <FormLabel>Contract Calendar</FormLabel>
                  <Select
                    value={formData.contractCalendar || undefined}
                    onChange={(value) => handleFieldChange('contractCalendar', value)}
                    placeholder="Select calendar"
                    style={{ width: '100%' }}
                    options={CALENDAR_OPTIONS}
                  />
                </Vertical>
              </Horizontal>

              {/* Require Quantities — content-hugging */}
              <Vertical alignItems="flex-start">
                <FormLabel>Require Quantities</FormLabel>
                <Switch
                  checked={formData.requireQuantities || false}
                  onChange={(checked) => handleFieldChange('requireQuantities', checked)}
                />
              </Vertical>

              {/* Sub-section: Description */}
              <SectionHeader>Description</SectionHeader>
              <TextArea
                value={formData.description || ''}
                onChange={(e) => handleFieldChange('description', e.target.value)}
                placeholder="e.g. (SW - 5)"
                rows={3}
              />
            </Vertical>
          </Panel>
        </Collapse>
      </Vertical>
    </Modal>
  );
}
