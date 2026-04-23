import React from 'react';
import { type Attachment } from '../Common/AIDrawer';

// ── Domain types ──────────────────────────────────────────────────────────────

export type FileNode = {
  name: string;
  path: string;
  type: 'file' | 'folder';
  children?: FileNode[];
};

export type ProjectFile = {
  language: string;
  content: string;
};

export type ProjectVersion = {
  id: string;
  label: string;
  description: string;
  timestamp: string;
  files: { [key: string]: ProjectFile };
};

export type Project = {
  id: string;
  name: string;
  lastEdited: string;
  files: { [key: string]: ProjectFile };
  history: { id: number; type: 'user' | 'bot'; text: string; time: string; attachments?: Attachment[] }[];
  versions: ProjectVersion[];
};

export type ConsoleLog = { type: 'log' | 'error' | 'warn'; message: string; time: string };

// ── Component prop types ──────────────────────────────────────────────────────

export interface VibeHomeProps {
  onStartProject: (initialPrompt?: string) => void;
  onOpenProject: (projectId: string) => void;
  projects: Project[];
}

export interface VibeCoderProps {
  onBack: () => void;
  initialPrompt?: string;
  projectId?: string | null;
  projects: Project[];
  onUpdateProjects: (projects: Project[]) => void;
}

export interface CodeStructureProps {
  fileTree: FileNode[];
  activeFile: string;
  setActiveFile: (file: string) => void;
  activeProject: Project;
  handleUpdateFile: (content: string) => void;
  handleCreateNewItem: (parentPath: string, type: 'file' | 'folder', name: string) => void;
  handleDeleteItem: (path: string, type: 'file' | 'folder') => void;
  handleRenameItem: (oldPath: string, newPath: string) => void;
}

export interface CodePreviewProps {
  device: 'desktop' | 'tablet' | 'mobile';
  baseHTML: string | null;
  vfsPayload: string;
  reloadKey: number;
  showConsole: boolean;
  consoleLogs: ConsoleLog[];
  setConsoleLogs: React.Dispatch<React.SetStateAction<ConsoleLog[]>>;
  isFullscreen: boolean;
  setIsFullscreen: React.Dispatch<React.SetStateAction<boolean>>;
  projectId?: string;
}

export interface FileTreeItemProps {
  node: FileNode;
  depth?: number;
  activeFile: string;
  collapseKey: number;
  renamingPath: string | null;
  onSelectFile: (path: string) => void;
  onRenameItem: (oldPath: string, newPath: string) => void;
  onRenameCancel: () => void;
  onOpenContextMenu: (path: string, type: 'file' | 'folder', x: number, y: number) => void;
  pendingCreate: { parentPath: string; type: 'file' | 'folder' } | null;
  setPendingCreate: React.Dispatch<React.SetStateAction<{ parentPath: string; type: 'file' | 'folder' } | null>>;
  onCommitCreate: (parentPath: string, type: 'file' | 'folder', name: string) => void;
}

export interface InlineNewItemProps {
  type: 'file' | 'folder';
  depth: number;
  onCommit: (name: string) => void;
  onCancel: () => void;
}

export interface LoadingOverlayProps {
  isVisible: boolean;
  size?: 'normal' | 'large';
}
