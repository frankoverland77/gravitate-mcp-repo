import type { ProjectHubState, ProjectHubEntry, ProjectStatus } from './ProjectHub.types';
import { isPinned } from './ProjectHub.data';

/** Build scopes object from hub state for NavigationContextProvider */
export function getScopesFromHubState(): Record<string, boolean> {
  const raw = localStorage.getItem('project-hub-state');

  if (!raw) {
    // No hub state yet — show everything
    return {};
  }

  try {
    const state: ProjectHubState = JSON.parse(raw);
    const scopes: Record<string, boolean> = {};

    // Sort entries so scope key insertion order matches sidebar order
    const sortedEntries = Object.values(state.projects).sort((a, b) => {
      const aPinned = isPinned(a.sectionKey) ? 0 : 1;
      const bPinned = isPinned(b.sectionKey) ? 0 : 1;
      if (aPinned !== bPinned) return aPinned - bPinned;
      const aOrder = a.sortOrder ?? 999;
      const bOrder = b.sortOrder ?? 999;
      if (aOrder !== bOrder) return aOrder - bOrder;
      return a.sectionKey.localeCompare(b.sectionKey);
    });

    for (const entry of sortedEntries) {
      if (isPinned(entry.sectionKey) || (entry.showInSidebar && entry.status !== 'archived')) {
        scopes[entry.sectionKey] = true;
      }
    }

    return scopes;
  } catch {
    return {};
  }
}

/** Get display name + icon overrides from hub state for sidebar */
export function getDisplayOverrides(): Record<string, { displayName?: string; iconName?: string }> {
  const raw = localStorage.getItem('project-hub-state');
  if (!raw) return {};
  try {
    const state: ProjectHubState = JSON.parse(raw);
    const overrides: Record<string, { displayName?: string; iconName?: string }> = {};
    for (const [key, entry] of Object.entries(state.projects)) {
      if (entry.displayName || entry.iconName) {
        overrides[key] = {
          displayName: entry.displayName,
          iconName: entry.iconName,
        };
      }
    }
    return overrides;
  } catch {
    return {};
  }
}

/** Filter projects by status tab */
export function filterByTab(
  projects: ProjectHubEntry[],
  tab: 'active-draft' | 'archived'
): ProjectHubEntry[] {
  if (tab === 'archived') {
    return projects.filter(p => p.status === 'archived');
  }
  return projects.filter(p => p.status === 'active' || p.status === 'draft');
}

/** Filter projects by search term */
export function filterBySearch(
  projects: ProjectHubEntry[],
  search: string,
  getTitleForKey: (key: string) => string
): ProjectHubEntry[] {
  if (!search.trim()) return projects;
  const term = search.toLowerCase();
  return projects.filter(p => {
    const title = getTitleForKey(p.sectionKey).toLowerCase();
    return (
      title.includes(term) ||
      p.sectionKey.toLowerCase().includes(term) ||
      p.description.toLowerCase().includes(term) ||
      p.versionLabel.toLowerCase().includes(term)
    );
  });
}

/** Filter by status */
export function filterByStatus(
  projects: ProjectHubEntry[],
  status: ProjectStatus | 'all'
): ProjectHubEntry[] {
  if (status === 'all') return projects;
  return projects.filter(p => p.status === status);
}

/** Sort projects: pinned first, then by sortOrder, then alphabetical */
export function sortProjects(
  projects: ProjectHubEntry[],
  getTitleForKey: (key: string) => string
): ProjectHubEntry[] {
  return [...projects].sort((a, b) => {
    const aPinned = isPinned(a.sectionKey) ? 0 : 1;
    const bPinned = isPinned(b.sectionKey) ? 0 : 1;
    if (aPinned !== bPinned) return aPinned - bPinned;
    const aOrder = a.sortOrder ?? 999;
    const bOrder = b.sortOrder ?? 999;
    if (aOrder !== bOrder) return aOrder - bOrder;
    return getTitleForKey(a.sectionKey).localeCompare(getTitleForKey(b.sectionKey));
  });
}
