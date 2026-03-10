import { Horizontal, Texto, BBDTag } from '@gravitate-js/excalibrr';
import { AppstoreOutlined, SearchOutlined } from '@ant-design/icons';
import { Input, Select } from 'antd';
import type { ProjectStatus } from '../ProjectHub.types';

interface ProjectHubHeaderProps {
  activeCount: number;
  draftCount: number;
  archivedCount: number;
  search: string;
  onSearchChange: (value: string) => void;
  statusFilter: ProjectStatus | 'all';
  onStatusFilterChange: (value: ProjectStatus | 'all') => void;
}

export function ProjectHubHeader({
  activeCount,
  draftCount,
  archivedCount,
  search,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
}: ProjectHubHeaderProps) {
  return (
    <div style={{
      padding: '20px 24px 16px',
      borderBottom: '1px solid var(--gray-200)',
    }}>
      <Horizontal justifyContent="space-between" alignItems="center" style={{ marginBottom: 12 }}>
        <Horizontal alignItems="center" style={{ gap: 10 }}>
          <AppstoreOutlined style={{ fontSize: 22, color: 'var(--primary)' }} />
          <Texto category="h3" weight="600">Project Hub</Texto>
        </Horizontal>
      </Horizontal>
      <Horizontal justifyContent="space-between" alignItems="center">
        <Horizontal alignItems="center" style={{ gap: 12 }}>
          <Horizontal alignItems="center" style={{ gap: 4 }}>
            <Texto appearance="medium" category="label">Active:</Texto>
            <BBDTag color="green">{activeCount}</BBDTag>
          </Horizontal>
          <Horizontal alignItems="center" style={{ gap: 4 }}>
            <Texto appearance="medium" category="label">Draft:</Texto>
            <BBDTag color="orange">{draftCount}</BBDTag>
          </Horizontal>
          <Horizontal alignItems="center" style={{ gap: 4 }}>
            <Texto appearance="medium" category="label">Archived:</Texto>
            <BBDTag color="default">{archivedCount}</BBDTag>
          </Horizontal>
        </Horizontal>
        <Horizontal alignItems="center" style={{ gap: 8 }}>
          <Input
            placeholder="Search projects..."
            prefix={<SearchOutlined style={{ color: 'var(--gray-400)' }} />}
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            style={{ width: 220 }}
            allowClear
          />
          <Select
            value={statusFilter}
            onChange={onStatusFilterChange}
            style={{ width: 130 }}
            options={[
              { value: 'all', label: 'All statuses' },
              { value: 'active', label: 'Active' },
              { value: 'draft', label: 'Draft' },
              { value: 'archived', label: 'Archived' },
            ]}
          />
        </Horizontal>
      </Horizontal>
    </div>
  );
}
