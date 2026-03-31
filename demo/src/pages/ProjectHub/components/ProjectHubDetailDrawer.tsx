import { useState, createElement } from 'react';
import { Horizontal, Texto, GraviButton } from '@gravitate-js/excalibrr';
import { CloseOutlined, DeleteOutlined, UndoOutlined, EditOutlined, CheckOutlined } from '@ant-design/icons';
import { Input, Select, Popover, Tooltip } from 'antd';
import { ProjectHubStatusBadge } from './ProjectHubStatusBadge';
import { ProjectHubActivityLog } from './ProjectHubActivityLog';
import { isPinned } from '../ProjectHub.data';
import { searchIcons } from '../ProjectHub.icons';
import type { ProjectHubEntry, ProjectStatus } from '../ProjectHub.types';

interface ProjectHubDetailDrawerProps {
  entry: ProjectHubEntry | null;
  title: string;
  originalTitle: string;
  icon: React.ReactNode;
  routeCount: number;
  isOpen: boolean;
  onClose: () => void;
  onStatusChange: (status: ProjectStatus) => void;
  onVersionChange: (version: string) => void;
  onDescriptionChange: (desc: string) => void;
  onDisplayNameChange: (name: string) => void;
  onIconChange: (iconName: string) => void;
  onArchive: () => void;
  onRestore: () => void;
  onAddActivity: (message: string, author: string) => void;
}

export function ProjectHubDetailDrawer({
  entry,
  title,
  originalTitle,
  icon,
  routeCount,
  isOpen,
  onClose,
  onStatusChange,
  onVersionChange,
  onDescriptionChange,
  onDisplayNameChange,
  onIconChange,
  onArchive,
  onRestore,
  onAddActivity,
}: ProjectHubDetailDrawerProps) {
  const [editingVersion, setEditingVersion] = useState(false);
  const [versionDraft, setVersionDraft] = useState('');
  const [editingDesc, setEditingDesc] = useState(false);
  const [descDraft, setDescDraft] = useState('');
  const [editingDisplayName, setEditingDisplayName] = useState(false);
  const [displayNameDraft, setDisplayNameDraft] = useState('');
  const [iconPickerOpen, setIconPickerOpen] = useState(false);
  const [iconSearch, setIconSearch] = useState('');

  const pinned = entry ? isPinned(entry.sectionKey) : false;

  const startEditVersion = () => {
    setVersionDraft(entry?.versionLabel ?? '');
    setEditingVersion(true);
  };

  const saveVersion = () => {
    onVersionChange(versionDraft);
    setEditingVersion(false);
  };

  const startEditDesc = () => {
    setDescDraft(entry?.description ?? '');
    setEditingDesc(true);
  };

  const saveDesc = () => {
    onDescriptionChange(descDraft);
    setEditingDesc(false);
  };

  const startEditDisplayName = () => {
    setDisplayNameDraft(entry?.displayName ?? '');
    setEditingDisplayName(true);
  };

  const saveDisplayName = () => {
    onDisplayNameChange(displayNameDraft);
    setEditingDisplayName(false);
  };

  const filteredIcons = searchIcons(iconSearch);

  const iconPickerContent = (
    <div style={{ width: 280 }}>
      <Input
        placeholder="Search icons..."
        value={iconSearch}
        onChange={(e) => setIconSearch(e.target.value)}
        size="small"
        style={{ marginBottom: 8 }}
        autoFocus
      />
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(6, 1fr)',
        gap: 4,
        maxHeight: 256,
        overflowY: 'auto',
      }}>
        {filteredIcons.map(({ name, component }) => (
          <Tooltip key={name} title={name.replace('Outlined', '').replace('Filled', '')} mouseEnterDelay={0.4}>
            <div
              onClick={() => {
                onIconChange(name);
                setIconPickerOpen(false);
                setIconSearch('');
              }}
              style={{
                width: 40,
                height: 40,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 4,
                cursor: 'pointer',
                fontSize: 18,
                color: entry?.iconName === name ? 'var(--theme-color-1)' : 'var(--gray-600)',
                background: entry?.iconName === name ? 'var(--theme-color-1-bg, rgba(24,144,255,0.08))' : 'transparent',
                transition: 'background 0.15s',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = 'var(--gray-100)'; }}
              onMouseLeave={e => {
                e.currentTarget.style.background = entry?.iconName === name
                  ? 'var(--theme-color-1-bg, rgba(24,144,255,0.08))'
                  : 'transparent';
              }}
            >
              {createElement(component)}
            </div>
          </Tooltip>
        ))}
      </div>
      {entry?.iconName && (
        <div
          onClick={() => {
            onIconChange('');
            setIconPickerOpen(false);
            setIconSearch('');
          }}
          style={{
            marginTop: 8,
            paddingTop: 8,
            borderTop: '1px solid var(--gray-100)',
            textAlign: 'center',
            cursor: 'pointer',
            color: 'var(--gray-400)',
            fontSize: 12,
          }}
        >
          Reset to default
        </div>
      )}
    </div>
  );

  return (
    <div style={{
      width: isOpen ? '460px' : '0px',
      minWidth: isOpen ? '460px' : '0px',
      overflow: 'hidden',
      transition: 'width 300ms ease, min-width 300ms ease',
      borderLeft: isOpen ? '1px solid var(--gray-200)' : 'none',
      display: 'flex',
      flexDirection: 'column',
      background: 'var(--bg-1)',
      flexShrink: 0,
    }}>
      {entry && (
        <>
          {/* Header */}
          <Horizontal
            justifyContent="space-between"
            alignItems="center"
            style={{
              padding: '12px 16px',
              borderBottom: '1px solid var(--gray-200)',
              flexShrink: 0,
            }}
          >
            <Horizontal alignItems="center" gap={8}>
              {!pinned ? (
                <Popover
                  content={iconPickerContent}
                  trigger="click"
                  open={iconPickerOpen}
                  onOpenChange={setIconPickerOpen}
                  placement="bottomLeft"
                >
                  <span
                    style={{
                      fontSize: 18,
                      color: 'var(--gray-500)',
                      cursor: 'pointer',
                      padding: 4,
                      borderRadius: 4,
                      transition: 'background 0.15s',
                    }}
                    onMouseEnter={e => (e.currentTarget.style.background = 'var(--gray-100)')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                  >
                    {icon}
                  </span>
                </Popover>
              ) : (
                <span style={{ fontSize: 18, color: 'var(--gray-500)' }}>{icon}</span>
              )}
              <Texto category="h5" weight="600">{title}</Texto>
            </Horizontal>
            <span
              onClick={onClose}
              style={{
                cursor: 'pointer',
                width: 28,
                height: 28,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 4,
                transition: 'background 0.15s',
              }}
              onMouseEnter={e => (e.currentTarget.style.background = 'var(--gray-100)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
            >
              <CloseOutlined style={{ fontSize: 14 }} />
            </span>
          </Horizontal>

          {/* Body */}
          <div style={{ flex: 1, overflowY: 'auto', padding: 16 }}>
            {/* Display Name */}
            {!pinned && (
              <div style={{ marginBottom: 16 }}>
                <Horizontal alignItems="center" gap={8} style={{ marginBottom: 8 }}>
                  <Texto appearance="medium" category="label" style={{ width: 80 }}>Display Name</Texto>
                  {editingDisplayName ? (
                    <Horizontal alignItems="center" gap={4}>
                      <Input
                        value={displayNameDraft}
                        onChange={(e) => setDisplayNameDraft(e.target.value)}
                        onPressEnter={saveDisplayName}
                        size="small"
                        style={{ width: 180 }}
                        placeholder={originalTitle}
                        autoFocus
                      />
                      <span onClick={saveDisplayName} style={{ cursor: 'pointer' }}>
                        <CheckOutlined style={{ fontSize: 14, color: 'var(--success)' }} />
                      </span>
                    </Horizontal>
                  ) : (
                    <Horizontal alignItems="center" gap={4}>
                      <Texto category="label">
                        {entry.displayName || originalTitle}
                      </Texto>
                      <span onClick={startEditDisplayName} style={{ cursor: 'pointer' }}>
                        <EditOutlined style={{ fontSize: 12, color: 'var(--gray-400)' }} />
                      </span>
                    </Horizontal>
                  )}
                </Horizontal>
                {entry.displayName && (
                  <Texto appearance="medium" category="label" style={{ fontSize: 11, marginLeft: 88 }}>
                    Original: {originalTitle}
                  </Texto>
                )}
              </div>
            )}

            {/* Status & Version */}
            <div style={{ marginBottom: 16 }}>
              <Horizontal alignItems="center" gap={8} style={{ marginBottom: 8 }}>
                <Texto appearance="medium" category="label" style={{ width: 80 }}>Status</Texto>
                {!pinned ? (
                  <Select
                    value={entry.status}
                    onChange={onStatusChange}
                    size="small"
                    style={{ width: 120 }}
                    options={[
                      { value: 'active', label: 'Active' },
                      { value: 'draft', label: 'Draft' },
                    ]}
                  />
                ) : (
                  <ProjectHubStatusBadge status={entry.status} />
                )}
              </Horizontal>
              <Horizontal alignItems="center" gap={8} style={{ marginBottom: 8 }}>
                <Texto appearance="medium" category="label" style={{ width: 80 }}>Version</Texto>
                {editingVersion ? (
                  <Horizontal alignItems="center" gap={4}>
                    <Input
                      value={versionDraft}
                      onChange={(e) => setVersionDraft(e.target.value)}
                      onPressEnter={saveVersion}
                      size="small"
                      style={{ width: 100 }}
                      placeholder="e.g., MVP, R1"
                      autoFocus
                    />
                    <span onClick={saveVersion} style={{ cursor: 'pointer' }}>
                      <CheckOutlined style={{ fontSize: 14, color: 'var(--success)' }} />
                    </span>
                  </Horizontal>
                ) : (
                  <Horizontal alignItems="center" gap={4}>
                    <Texto category="label">
                      {entry.versionLabel || '—'}
                    </Texto>
                    <span onClick={startEditVersion} style={{ cursor: 'pointer' }}>
                      <EditOutlined style={{ fontSize: 12, color: 'var(--gray-400)' }} />
                    </span>
                  </Horizontal>
                )}
              </Horizontal>
              <Horizontal alignItems="center" gap={8}>
                <Texto appearance="medium" category="label" style={{ width: 80 }}>Routes</Texto>
                <Texto category="label">{routeCount}</Texto>
              </Horizontal>
            </div>

            {/* Description */}
            <div style={{ marginBottom: 16 }}>
              <Horizontal alignItems="center" gap={4} style={{ marginBottom: 4 }}>
                <Texto weight="600" category="label">Description</Texto>
                {!editingDesc && (
                  <span onClick={startEditDesc} style={{ cursor: 'pointer' }}>
                    <EditOutlined style={{ fontSize: 12, color: 'var(--gray-400)' }} />
                  </span>
                )}
              </Horizontal>
              {editingDesc ? (
                <div>
                  <Input.TextArea
                    value={descDraft}
                    onChange={(e) => setDescDraft(e.target.value)}
                    rows={3}
                    placeholder="Describe this project..."
                    autoFocus
                  />
                  <div style={{ marginTop: 4, display: 'flex', gap: 4, justifyContent: 'flex-end' }}>
                    <GraviButton size="small" onClick={() => setEditingDesc(false)}>Cancel</GraviButton>
                    <GraviButton size="small" success onClick={saveDesc}>Save</GraviButton>
                  </div>
                </div>
              ) : (
                <Texto appearance="medium" category="label" style={{ fontStyle: entry.description ? 'normal' : 'italic' }}>
                  {entry.description || 'No description'}
                </Texto>
              )}
            </div>

            {/* Divider */}
            <div style={{ borderTop: '1px solid var(--gray-200)', margin: '16px 0' }} />

            {/* Activity Log */}
            <ProjectHubActivityLog
              entries={entry.activityLog}
              onAddEntry={onAddActivity}
            />

            {/* Divider */}
            <div style={{ borderTop: '1px solid var(--gray-200)', margin: '16px 0' }} />

            {/* Actions */}
            {!pinned && (
              <div>
                {entry.status !== 'archived' ? (
                  <GraviButton
                    size="small"
                    danger
                    onClick={onArchive}
                  >
                    <DeleteOutlined /> Archive Project
                  </GraviButton>
                ) : (
                  <GraviButton
                    size="small"
                    onClick={onRestore}
                  >
                    <UndoOutlined /> Restore Project
                  </GraviButton>
                )}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
