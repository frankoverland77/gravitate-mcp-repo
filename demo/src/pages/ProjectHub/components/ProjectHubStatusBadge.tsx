import { BBDTag } from '@gravitate-js/excalibrr';
import type { ProjectStatus } from '../ProjectHub.types';

const STATUS_CONFIG: Record<ProjectStatus, { label: string; color: string }> = {
  active: { label: 'Active', color: 'green' },
  draft: { label: 'Draft', color: 'orange' },
  archived: { label: 'Archived', color: 'default' },
};

interface ProjectHubStatusBadgeProps {
  status: ProjectStatus;
}

export function ProjectHubStatusBadge({ status }: ProjectHubStatusBadgeProps) {
  const config = STATUS_CONFIG[status];
  return <BBDTag color={config.color}>{config.label}</BBDTag>;
}
