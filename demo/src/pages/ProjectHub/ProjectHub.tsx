import { useState, useMemo, useEffect, useCallback, useRef, createElement } from 'react';
import { Texto, GraviButton, Vertical, Horizontal } from '@gravitate-js/excalibrr';
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
  reorderProjects,
} from './ProjectHub.data';
import {
  filterByTab,
  filterBySearch,
  filterByStatus,
  sortProjects,
} from './ProjectHub.utils';
import { getIconComponent } from './ProjectHub.icons';
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

  // Drag state
  const [dragKey, setDragKey] = useState<string | null>(null);
  const [dragOverKey, setDragOverKey] = useState<string | null>(null);

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

  // Title resolution: prefer displayName, fall back to pageConfig title
  const getTitleForKey = useCallback(
    (key: string) => state.projects[key]?.displayName || (sectionMeta[key]?.title ?? key),
    [sectionMeta, state]
  );

  // Original title from pageConfig (for drawer helper text)
  const getOriginalTitle = useCallback(
    (key: string) => sectionMeta[key]?.title ?? key,
    [sectionMeta]
  );

  // Icon resolution: prefer entry.iconName from registry, fall back to pageConfig icon
  const getIconForKey = useCallback(
    (key: string): React.ReactNode => {
      const entry = state.projects[key];
      if (entry?.iconName) {
        const Comp = getIconComponent(entry.iconName);
        if (Comp) return createElement(Comp);
      }
      return sectionMeta[key]?.icon ?? null;
    },
    [sectionMeta, state]
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

  const handleDisplayNameChange = (key: string, displayName: string) => {
    setState(prev => updateProject(prev, key, { displayName: displayName || undefined }));
  };

  const handleIconChange = (key: string, iconName: string) => {
    setState(prev => updateProject(prev, key, { iconName: iconName || undefined }));
  };

  const handleAddActivity = (key: string, msg: string, author: string) => {
    setState(prev => addActivityLogEntry(prev, key, msg, author));
  };

  // Drag handlers
  const handleDragStart = (key: string, e: React.DragEvent) => {
    setDragKey(key);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', key);
  };

  const handleDragOver = (key: string, e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (key !== dragKey) {
      setDragOverKey(key);
    }
  };

  const handleDragLeave = () => {
    setDragOverKey(null);
  };

  const handleDrop = (toKey: string, e: React.DragEvent) => {
    e.preventDefault();
    setDragOverKey(null);
    if (dragKey && dragKey !== toKey) {
      setState(prev => reorderProjects(prev, dragKey, toKey));
    }
    setDragKey(null);
  };

  const handleDragEnd = () => {
    setDragKey(null);
    setDragOverKey(null);
  };

  return (
    <Vertical height="100%">
      <ProjectHubHeader
        activeCount={activeCount}
        draftCount={draftCount}
        archivedCount={archivedCount}
        search={search}
        onSearchChange={setSearch}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
      />

      <Horizontal flex="1" style={{ overflow: 'hidden' }}>
        {/* Main list area */}
        <Vertical flex="1" style={{ overflow: 'hidden' }}>
          <Horizontal
            verticalCenter
            justifyContent="space-between"
            style={{
              padding: '0 24px',
              borderBottom: '2px solid var(--gray-200)',
              flexShrink: 0,
            }}
          >
            <Horizontal verticalCenter>
              {([
                { key: 'active-draft' as const, label: 'Active & Draft' },
                { key: 'archived' as const, label: `Archived (${archivedCount})` },
              ]).map(tab => (
                <Texto
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
                  {tab.label}
                </Texto>
              ))}
            </Horizontal>
            {isDirty && (
              <GraviButton size="small" success onClick={handleSave}>
                <SaveOutlined /> Save Changes
              </GraviButton>
            )}
          </Horizontal>

          <Vertical flex="1" style={{ overflowY: 'auto' }}>
            {displayedProjects.length === 0 ? (
              <Vertical style={{ padding: '40px 24px', textAlign: 'center' }}>
                <Texto appearance="medium">
                  {search || statusFilter !== 'all'
                    ? 'No projects match your filters'
                    : activeTab === 'archived'
                    ? 'No archived projects'
                    : 'No projects found'}
                </Texto>
              </Vertical>
            ) : (
              displayedProjects.map((entry) => (
                <ProjectHubListRow
                  key={entry.sectionKey}
                  entry={entry}
                  title={getTitleForKey(entry.sectionKey)}
                  icon={getIconForKey(entry.sectionKey)}
                  routeCount={getRouteCount(entry.sectionKey)}
                  isSelected={selectedKey === entry.sectionKey}
                  onSelect={() => setSelectedKey(
                    selectedKey === entry.sectionKey ? null : entry.sectionKey
                  )}
                  onToggleSidebar={() => handleToggleSidebar(entry.sectionKey)}
                  isDragOver={dragOverKey === entry.sectionKey}
                  onDragStart={(e) => handleDragStart(entry.sectionKey, e)}
                  onDragOver={(e) => handleDragOver(entry.sectionKey, e)}
                  onDragLeave={handleDragLeave}
                  onDrop={(e) => handleDrop(entry.sectionKey, e)}
                  onDragEnd={handleDragEnd}
                />
              ))
            )}
          </Vertical>
        </Vertical>

        {/* Detail drawer */}
        <ProjectHubDetailDrawer
          entry={selectedEntry}
          title={selectedKey ? getTitleForKey(selectedKey) : ''}
          originalTitle={selectedKey ? getOriginalTitle(selectedKey) : ''}
          icon={selectedKey ? getIconForKey(selectedKey) : null}
          routeCount={selectedKey ? getRouteCount(selectedKey) : 0}
          isOpen={!!selectedEntry}
          onClose={() => setSelectedKey(null)}
          onStatusChange={(status) => selectedKey && handleStatusChange(selectedKey, status)}
          onVersionChange={(v) => selectedKey && handleVersionChange(selectedKey, v)}
          onDescriptionChange={(d) => selectedKey && handleDescriptionChange(selectedKey, d)}
          onDisplayNameChange={(name) => selectedKey && handleDisplayNameChange(selectedKey, name)}
          onIconChange={(iconName) => selectedKey && handleIconChange(selectedKey, iconName)}
          onArchive={() => selectedKey && handleArchive(selectedKey)}
          onRestore={() => selectedKey && handleRestore(selectedKey)}
          onAddActivity={(msg, author) => selectedKey && handleAddActivity(selectedKey, msg, author)}
        />
      </Horizontal>
    </Vertical>
  );
}
