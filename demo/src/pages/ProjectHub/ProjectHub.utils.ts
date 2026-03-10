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

    for (const [key, entry] of Object.entries(state.projects)) {
      if (isPinned(key)) {
        scopes[key] = true;
      } else {
        scopes[key] = entry.showInSidebar && entry.status !== 'archived';
      }
    }

    return scopes;
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

/** Sort projects: pinned first, then alphabetical by title */
export function sortProjects(
  projects: ProjectHubEntry[],
  getTitleForKey: (key: string) => string
): ProjectHubEntry[] {
  return [...projects].sort((a, b) => {
    const aPinned = isPinned(a.sectionKey) ? 0 : 1;
    const bPinned = isPinned(b.sectionKey) ? 0 : 1;
    if (aPinned !== bPinned) return aPinned - bPinned;
    return getTitleForKey(a.sectionKey).localeCompare(getTitleForKey(b.sectionKey));
  });
}
