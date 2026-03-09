import { Horizontal, Texto } from '@gravitate-js/excalibrr';
import { Switch } from 'antd';
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
}

export function ProjectHubListRow({
  entry,
  title,
  icon,
  routeCount,
  isSelected,
  onSelect,
  onToggleSidebar,
}: ProjectHubListRowProps) {
  const pinned = isPinned(entry.sectionKey);

  return (
    <div
      onClick={onSelect}
      style={{
        padding: '12px 24px',
        borderBottom: '1px solid var(--gray-100)',
        cursor: 'pointer',
        background: isSelected ? 'var(--gray-50)' : 'transparent',
        transition: 'background 0.15s',
      }}
      onMouseEnter={(e) => {
        if (!isSelected) e.currentTarget.style.background = 'var(--gray-25, #fafafa)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = isSelected ? 'var(--gray-50)' : 'transparent';
      }}
    >
      <Horizontal justifyContent="space-between" alignItems="center">
        <Horizontal alignItems="center" gap={12} style={{ flex: 1, minWidth: 0 }}>
          <span style={{ fontSize: 18, color: 'var(--gray-500)', flexShrink: 0 }}>{icon}</span>
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
        <div
          onClick={(e) => e.stopPropagation()}
          style={{ flexShrink: 0, marginLeft: 12 }}
        >
          <Switch
            checked={entry.showInSidebar}
            onChange={onToggleSidebar}
            disabled={pinned}
            size="small"
          />
        </div>
      </Horizontal>
    </div>
  );
}
