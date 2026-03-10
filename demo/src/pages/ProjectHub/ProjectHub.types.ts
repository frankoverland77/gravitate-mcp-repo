export type ProjectStatus = 'active' | 'draft' | 'archived';

export interface ActivityLogEntry {
  id: string;
  timestamp: string; // ISO 8601
  message: string;
  author?: string; // "Claude", "Manual", etc.
}

export interface ProjectHubEntry {
  sectionKey: string; // Matches pageConfig key
  status: ProjectStatus;
  showInSidebar: boolean;
  versionLabel: string; // "" if unused
  description: string;
  activityLog: ActivityLogEntry[];
  lastModified: string; // ISO 8601
}

export interface ProjectHubState {
  projects: Record<string, ProjectHubEntry>;
  savedAt: string;
}
