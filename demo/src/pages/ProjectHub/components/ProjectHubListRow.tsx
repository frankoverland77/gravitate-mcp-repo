import { Horizontal, Texto } from '@gravitate-js/excalibrr';
import { Switch } from 'antd';
import { HolderOutlined } from '@ant-design/icons';
import { ProjectHubStatusBadge } from './ProjectHubStatusBadge';
import { isPinned } from '../ProjectHub.data';
import type { ProjectHubEntry } from '../ProjectHub.types';

interface ProjectHubListRowProps {
  entry: ProjectHubEntry;
  title: string;
  icon: React.ReactNode;
  routeCount: number;
  isSelected: boolean;
  onSelect: () => void;
  onToggleSidebar: () => void;
  isDragOver?: boolean;
  onDragStart?: (e: React.DragEvent) => void;
  onDragOver?: (e: React.DragEvent) => void;
  onDragLeave?: (e: React.DragEvent) => void;
  onDrop?: (e: React.DragEvent) => void;
  onDragEnd?: (e: React.DragEvent) => void;
}

export function ProjectHubListRow({
  entry,
  title,
  icon,
  routeCount,
  isSelected,
  onSelect,
  onToggleSidebar,
  isDragOver,
  onDragStart,
  onDragOver,
  onDragLeave,
  onDrop,
  onDragEnd,
}: ProjectHubListRowProps) {
  const pinned = isPinned(entry.sectionKey);
  const draggable = !pinned && !!onDragStart;

  return (
    <div
      onClick={onSelect}
      draggable={draggable}
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      onDragEnd={onDragEnd}
      style={{
        padding: '12px 24px',
        borderBottom: '1px solid var(--gray-100)',
        cursor: 'pointer',
        background: isSelected ? 'var(--gray-50)' : 'transparent',
        transition: 'background 0.15s',
        borderTop: isDragOver ? '2px solid var(--theme-color-1)' : '2px solid transparent',
      }}
      onMouseEnter={(e) => {
        if (!isSelected) e.currentTarget.style.background = 'var(--gray-25, #fafafa)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = isSelected ? 'var(--gray-50)' : 'transparent';
      }}
    >
      <Horizontal alignItems="center" gap={8}>
        {/* Drag handle */}
        {draggable && (
          <span
            style={{ color: 'var(--gray-300)', cursor: 'grab', flexShrink: 0, fontSize: 14 }}
            onMouseDown={(e) => e.stopPropagation()}
          >
            <HolderOutlined />
          </span>
        )}
        {!draggable && <span style={{ width: 14, flexShrink: 0 }} />}

        {/* Toggle — left of icon */}
        <div
          onClick={(e) => e.stopPropagation()}
          style={{ flexShrink: 0 }}
        >
          <Switch
            checked={entry.showInSidebar}
            onChange={onToggleSidebar}
            disabled={pinned}
            size="small"
          />
        </div>

        {/* Icon */}
        <span style={{ fontSize: 18, color: 'var(--gray-500)', flexShrink: 0 }}>{icon}</span>

        {/* Content */}
        <div style={{ minWidth: 0, flex: 1 }}>
          <Horizontal alignItems="center" gap={8}>
            <Texto weight="500" style={{
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}>
              {title}
            </Texto>
            <ProjectHubStatusBadge status={entry.status} />
            {entry.versionLabel && (
              <Texto appearance="medium" category="label" style={{
                background: 'var(--gray-100)',
                padding: '1px 6px',
                borderRadius: 4,
                fontSize: 11,
              }}>
                {entry.versionLabel}
              </Texto>
            )}
          </Horizontal>
          <Texto appearance="medium" category="label" style={{ marginTop: 2 }}>
            {routeCount} {routeCount === 1 ? 'route' : 'routes'}
            {entry.description && ` · ${entry.description}`}
          </Texto>
        </div>
      </Horizontal>
    </div>
  );
}
