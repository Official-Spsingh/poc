
export type NodeType = 
  | 'start' 
  | 'stop' 
  | 'file-upload' 
  | 'remove-duplicate'
  | 'json-mapper'
  | 'js-expression'
  | 'delay'
  | 'sql'
  | 'excel-upload'
  | 'procedure'
  | 'step-validator'
  | 'conditional'
  | 'sql-query'
  | 'dynamic-sql-query'
  | 'email'
  | 'phone-call'
  | 'socket'
  | 'text-message'
  | 'download-file'
  | 'set-cookie'
  | 'save-file'
  | 'html-to-pdf'
  | 'api-call'
  | 'prediction-api-call'
  | 'ai-vector'
  | 'ai-template'
  | 'google-ads'
  | 'login'
  | 'workflow-caller';

export type ViewType = 'login' | 'forgot-password' | 'dashboard' | 'app-list' | 'app-editor' | 'workflow-builder' | 'workflow-home' | 'agent-home' | 'ai-agent-builder' | 'data' | 'vibe-coder' | 'vibe-home';

export type EventType = 
  | 'call' 
  | 'audit' 
  | 'goto' 
  | 'save' 
  | 'open' 
  | 'close' 
  | 'gotoUrl' 
  | 'setSessionStorage' 
  | 'removeSessionStorage' 
  | 'copyToClipboard' 
  | 'socketLogout' 
  | 'removeUrlParams';

export interface EventConfig {
  id: string;
  type: EventType;
  value: string; // Acts as eventValue / workflowId
  params: string; // Acts as eventParams
  responseVariable?: string;
  filter?: string;
  sendToken?: boolean;
  redirectUrlTarget?: string;
  redirectTimeout?: number;
}

export interface Position {
  x: number;
  y: number;
}

export interface NodeData {
  id: string;
  type: NodeType;
  label: string;
  position: Position;
  config?: Record<string, any>;
  events?: EventConfig[];
  error?: string;
}

export interface Connection {
  id: string;
  sourceId: string;
  targetId: string;
}

export interface ConnectionDrag {
  sourceId: string;
  startX: number;
  startY: number;
  currentX: number;
  currentY: number;
}

export interface Workspace {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
}

export interface Workflow {
  id: string;
  name: string;
  lastModified: string;
  isPublic?: boolean;
  saveResponse?: boolean;
  workspaceId?: string;
}

export interface Agent {
  id: string;
  name: string;
  description: string;
  lastModified: string;
  status: 'active' | 'training' | 'idle';
  type: 'support' | 'sales' | 'research' | 'custom';
  workspaceId?: string;
}
