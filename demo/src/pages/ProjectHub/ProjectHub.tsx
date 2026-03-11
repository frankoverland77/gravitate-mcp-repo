import { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import { Texto, GraviButton } from '@gravitate-js/excalibrr';
import { SaveOutlined } from '@ant-design/icons';
import { message } from 'antd';
import {
  loadHubState,
  toggleSidebarLocal,
  saveHubState,
  archiveProject,
  restoreProject,
  addActivityLogEntry,
  updateProject,
  getRouteCount,
} from './ProjectHub.data';
import {
  filterByTab,
  filterBySearch,
  filterByStatus,
  sortProjects,
} from './ProjectHub.utils';
import { ProjectHubHeader } from './components/ProjectHubHeader';
import { ProjectHubListRow } from './components/ProjectHubListRow';
import { ProjectHubDetailDrawer } from './components/ProjectHubDetailDrawer';
import type { ProjectHubState, ProjectStatus } from './ProjectHub.types';
import { createPageConfig } from '../../pageConfig';

export function ProjectHub() {
  const [state, setState] = useState<ProjectHubState>(() => loadHubState());
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<ProjectStatus | 'all'>('all');
  const [activeTab, setActiveTab] = useState<'active-draft' | 'archived'>('active-draft');
  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const [isDirty, setIsDirty] = useState(false);
  const savedStateRef = useRef<ProjectHubState>(state);

  // Build a lookup for section titles and icons from pageConfig
  const pageConfig = useMemo(() => createPageConfig(), []);
  const sectionMeta = useMemo(() => {
    const meta: Record<string, { title: string; icon: React.ReactNode }> = {};
    for (const [key, section] of Object.entries(pageConfig)) {
      meta[key] = { title: section.title, icon: section.icon };
    }
    // ProjectHub itself
    if (!meta.ProjectHub) {
      meta.ProjectHub = { title: 'Project Hub', icon: null };
    }
    return meta;
  }, [pageConfig]);

  const getTitleForKey = useCallback(
    (key: string) => sectionMeta[key]?.title ?? key,
    [sectionMeta]
  );

  // Close drawer on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelectedKey(null);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Compute counts
  const allProjects = useMemo(() => Object.values(state.projects), [state]);
  const activeCount = useMemo(() => allProjects.filter(p => p.status === 'active').length, [allProjects]);
  const draftCount = useMemo(() => allProjects.filter(p => p.status === 'draft').length, [allProjects]);
  const archivedCount = useMemo(() => allProjects.filter(p => p.status === 'archived').length, [allProjects]);

  // Filtered + sorted list
  const displayedProjects = useMemo(() => {
    let list = filterByTab(allProjects, activeTab);
    list = filterBySearch(list, search, getTitleForKey);
    list = filterByStatus(list, statusFilter);
    list = sortProjects(list, getTitleForKey);
    return list;
  }, [allProjects, activeTab, search, statusFilter, getTitleForKey]);

  const selectedEntry = selectedKey ? state.projects[selectedKey] ?? null : null;

  // Handlers
  const handleToggleSidebar = (key: string) => {
    setState(prev => toggleSidebarLocal(prev, key));
    setIsDirty(true);
  };

  const handleSave = () => {
    saveHubState(state);
    savedStateRef.current = state;
    setIsDirty(false);
    message.success('Sidebar updated');
  };

  const handleArchive = (key: string) => {
    setState(prev => archiveProject(prev, key));
    savedStateRef.current = state;
    setIsDirty(false);
    setSelectedKey(null);
  };

  const handleRestore = (key: string) => {
    setState(prev => restoreProject(prev, key));
    savedStateRef.current = state;
    setIsDirty(false);
  };

  const handleStatusChange = (key: string, status: ProjectStatus) => {
    setState(prev => updateProject(prev, key, { status }));
  };

  const handleVersionChange = (key: string, versionLabel: string) => {
    setState(prev => updateProject(prev, key, { versionLabel }));
  };

  const handleDescriptionChange = (key: string, description: string) => {
    setState(prev => updateProject(prev, key, { description }));
  };

  const handleAddActivity = (key: string, message: string, author: string) => {
    setState(prev => addActivityLogEntry(prev, key, message, author));
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <ProjectHubHeader
        activeCount={activeCount}
        draftCount={draftCount}
        archivedCount={archivedCount}
        search={search}
        onSearchChange={setSearch}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
      />

      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        {/* Main list area */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 24px',
            borderBottom: '2px solid var(--gray-200)',
            flexShrink: 0,
          }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              {([
                { key: 'active-draft' as const, label: 'Active & Draft' },
                { key: 'archived' as const, label: `Archived (${archivedCount})` },
              ]).map(tab => (
                <span
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  style={{
                    padding: '10px 20px',
                    fontSize: '13px',
                    fontWeight: activeTab === tab.key ? 600 : 500,
                    color: activeTab === tab.key ? 'var(--theme-color-1)' : 'var(--gray-500)',
                    cursor: 'pointer',
                    borderBottom: activeTab === tab.key ? '2px solid var(--theme-color-1)' : '2px solid transparent',
                    marginBottom: '-2px',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <Texto>{tab.label}</Texto>
                </span>
              ))}
            </div>
            {isDirty && (
              <GraviButton size="small" success onClick={handleSave}>
                <SaveOutlined /> Save Changes
              </GraviButton>
            )}
          </div>

          <div style={{ flex: 1, overflowY: 'auto' }}>
            {displayedProjects.length === 0 ? (
              <div style={{ padding: '40px 24px', textAlign: 'center' }}>
                <Texto appearance="medium">
                  {search || statusFilter !== 'all'
                    ? 'No projects match your filters'
                    : activeTab === 'archived'
                    ? 'No archived projects'
                    : 'No projects found'}
                </Texto>
              </div>
            ) : (
              displayedProjects.map((entry) => (
                <ProjectHubListRow
                  key={entry.sectionKey}
                  entry={entry}
                  title={getTitleForKey(entry.sectionKey)}
                  icon={sectionMeta[entry.sectionKey]?.icon ?? null}
                  routeCount={getRouteCount(entry.sectionKey)}
                  isSelected={selectedKey === entry.sectionKey}
                  onSelect={() => setSelectedKey(
                    selectedKey === entry.sectionKey ? null : entry.sectionKey
                  )}
                  onToggleSidebar={() => handleToggleSidebar(entry.sectionKey)}
                />
              ))
            )}
          </div>
        </div>

        {/* Detail drawer */}
        <ProjectHubDetailDrawer
          entry={selectedEntry}
          title={selectedKey ? getTitleForKey(selectedKey) : ''}
          icon={selectedKey ? sectionMeta[selectedKey]?.icon ?? null : null}
          routeCount={selectedKey ? getRouteCount(selectedKey) : 0}
          isOpen={!!selectedEntry}
          onClose={() => setSelectedKey(null)}
          onStatusChange={(status) => selectedKey && handleStatusChange(selectedKey, status)}
          onVersionChange={(v) => selectedKey && handleVersionChange(selectedKey, v)}
          onDescriptionChange={(d) => selectedKey && handleDescriptionChange(selectedKey, d)}
          onArchive={() => selectedKey && handleArchive(selectedKey)}
          onRestore={() => selectedKey && handleRestore(selectedKey)}
          onAddActivity={(msg, author) => selectedKey && handleAddActivity(selectedKey, msg, author)}
        />
      </div>
    </div>
  );
}
