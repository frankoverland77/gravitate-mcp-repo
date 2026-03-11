import type { ProjectHubState, ProjectHubEntry, ActivityLogEntry } from './ProjectHub.types';
import { createPageConfig } from '../../pageConfig';

const STORAGE_KEY = 'project-hub-state';

// Keys that cannot be toggled off from sidebar
const PINNED_KEYS = ['ProjectHub', 'Welcome'];

export function isPinned(sectionKey: string): boolean {
  return PINNED_KEYS.includes(sectionKey);
}

function createDefaultEntry(sectionKey: string): ProjectHubEntry {
  return {
    sectionKey,
    status: 'active',
    showInSidebar: true,
    versionLabel: '',
    description: '',
    activityLog: [],
    lastModified: new Date().toISOString(),
  };
}

/** Build default state from current pageConfig */
function buildDefaultState(): ProjectHubState {
  const pageConfig = createPageConfig();
  const projects: Record<string, ProjectHubEntry> = {};

  for (const key of Object.keys(pageConfig)) {
    projects[key] = createDefaultEntry(key);
  }

  // Ensure ProjectHub itself exists
  if (!projects.ProjectHub) {
    projects.ProjectHub = createDefaultEntry('ProjectHub');
  }

  return {
    projects,
    savedAt: new Date().toISOString(),
  };
}

/** Load state from localStorage, merging with current pageConfig */
export function loadHubState(): ProjectHubState {
  const raw = localStorage.getItem(STORAGE_KEY);
  const defaultState = buildDefaultState();

  if (!raw) {
    return defaultState;
  }

  try {
    const saved: ProjectHubState = JSON.parse(raw);

    // Merge: keep saved data for known projects, add new projects from pageConfig
    const merged: Record<string, ProjectHubEntry> = {};

    for (const [key, defaultEntry] of Object.entries(defaultState.projects)) {
      if (saved.projects[key]) {
        merged[key] = { ...defaultEntry, ...saved.projects[key] };
      } else {
        // New project detected in pageConfig — add with defaults
        merged[key] = defaultEntry;
      }
    }

    // Also preserve entries in saved that might not be in current pageConfig
    // (e.g., manually added projects)
    for (const [key, entry] of Object.entries(saved.projects)) {
      if (!merged[key]) {
        merged[key] = entry;
      }
    }

    return {
      projects: merged,
      savedAt: saved.savedAt,
    };
  } catch {
    return defaultState;
  }
}

/** Save state to localStorage and dispatch update event */
export function saveHubState(state: ProjectHubState): void {
  const updated: ProjectHubState = {
    ...state,
    savedAt: new Date().toISOString(),
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

  // Notify AuthenticatedRoute to refresh scopes
  window.dispatchEvent(new CustomEvent('project-hub-updated'));
}

/** Update a single project field and save */
export function updateProject(
  state: ProjectHubState,
  sectionKey: string,
  updates: Partial<ProjectHubEntry>
): ProjectHubState {
  const existing = state.projects[sectionKey];
  if (!existing) return state;

  const updated: ProjectHubState = {
    ...state,
    projects: {
      ...state.projects,
      [sectionKey]: {
        ...existing,
        ...updates,
        lastModified: new Date().toISOString(),
      },
    },
  };

  saveHubState(updated);
  return updated;
}

/** Toggle sidebar visibility for a project (local only — does NOT save) */
export function toggleSidebarLocal(
  state: ProjectHubState,
  sectionKey: string
): ProjectHubState {
  if (isPinned(sectionKey)) return state;
  const current = state.projects[sectionKey];
  if (!current) return state;

  return {
    ...state,
    projects: {
      ...state.projects,
      [sectionKey]: {
        ...current,
        showInSidebar: !current.showInSidebar,
        lastModified: new Date().toISOString(),
      },
    },
  };
}

/** Archive a project (auto-hides from sidebar) */
export function archiveProject(
  state: ProjectHubState,
  sectionKey: string
): ProjectHubState {
  if (isPinned(sectionKey)) return state;

  const entry = state.projects[sectionKey];
  if (!entry) return state;

  return updateProject(state, sectionKey, {
    status: 'archived',
    showInSidebar: false,
    activityLog: [
      {
        id: crypto.randomUUID(),
        timestamp: new Date().toISOString(),
        message: 'Project archived',
        author: 'System',
      },
      ...entry.activityLog,
    ],
  });
}

/** Restore an archived project (does NOT re-enable sidebar) */
export function restoreProject(
  state: ProjectHubState,
  sectionKey: string
): ProjectHubState {
  const entry = state.projects[sectionKey];
  if (!entry) return state;

  return updateProject(state, sectionKey, {
    status: 'active',
    activityLog: [
      {
        id: crypto.randomUUID(),
        timestamp: new Date().toISOString(),
        message: 'Project restored from archive',
        author: 'System',
      },
      ...entry.activityLog,
    ],
  });
}

/** Add an activity log entry */
export function addActivityLogEntry(
  state: ProjectHubState,
  sectionKey: string,
  message: string,
  author: string = 'Manual'
): ProjectHubState {
  const entry = state.projects[sectionKey];
  if (!entry) return state;

  const newEntry: ActivityLogEntry = {
    id: crypto.randomUUID(),
    timestamp: new Date().toISOString(),
    message,
    author,
  };

  return updateProject(state, sectionKey, {
    activityLog: [newEntry, ...entry.activityLog],
  });
}

/** Get route count for a section from pageConfig */
export function getRouteCount(sectionKey: string): number {
  const config = createPageConfig();
  const section = config[sectionKey];
  if (!section) return 0;
  if (section.routes) return section.routes.filter(r => !r.hidden).length;
  if (section.element) return 1;
  return 0;
}
