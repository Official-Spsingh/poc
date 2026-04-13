
import { AnimatePresence } from 'framer-motion';
import {
  Plus,
  Trash2
} from 'lucide-react';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import AgentHome from './components/Agents/AgentHome';
import AiAgentBuilder from './components/Agents/AiAgentBuilder';
import AppEditor from './components/Apps/AppEditor';
import AppHome from './components/Apps/AppHome';
import ForgotPassword from './components/Authentication/ForgotPassword';
import Login from './components/Authentication/Login';
import GlobalLoader from './components/Common/GlobalLoader';
import Sidebar from './components/Common/Sidebar';
import DataSection from './components/Data/DataSection';
import Dashboard from './components/HomePage/Dashboard';
import VibeCoder, { Project, generateProjectFiles } from './components/VibeCoding/VibeCoder';
import VibeHome from './components/VibeCoding/VibeHome';
import { COMPONENT_METADATA } from './components/Workflow/WorkflowBuilder/constants';
import WorkflowBuilder from './components/Workflow/WorkflowBuilder/index';
import WorkflowHome from './components/Workflow/WorkflowHome';
import { ModuleThemeContext } from './contexts/ModuleThemeContext';
import { Connection, ConnectionDrag, EventConfig, NodeData, NodeType, Position, ViewType, Workflow, Workspace } from './types';
// --- App Component ---

const App: React.FC = () => {
  const [view, setView] = useState<ViewType>('login');
  const [lastAppView, setLastAppView] = useState<ViewType>('app-list');
  const [lastWorkflowView, setLastWorkflowView] = useState<ViewType>('workflow-home');
  const [lastAgentView, setLastAgentView] = useState<ViewType>('agent-home');
  const [isAiGenerated, setIsAiGenerated] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  /* ==========================================================================
     THEME MANAGEMENT
     Global theme: applied on <html> element — affects auth, sidebar, dashboard,
     AND provides default --mod-* vars for all modules.
     Module theme: applied on the module container div — overrides --mod-* vars
     for that specific module only.

     Available global themes:  'light-blue' | 'light-slate' | 'dark-blue'
     Available module themes:  'light-teal' | 'light-sky' | 'light-violet' |
                               'light-purple' | 'light-indigo' |
                               'light-blue' | 'light-slate'  (same as global)

     Each module supports themes (any global theme + listed accents):
       - Workflow:   global + light-teal, light-sky
       - Apps:       global + light-sky, light-blue
       - Agents:     global + light-violet, light-purple
       - VibeCoding: global + light-indigo, light-violet, light-teal, dark-blue
       - Data:       global + light-slate, light-sky
     ========================================================================== */

  // Default accent themes per module (used when no explicit moduleTheme is set)
  const DEFAULT_MODULE_THEMES: Record<string, string> = {
    workflow: 'light-teal',
    apps: 'light-sky',
    agents: 'light-violet',
    vibe: 'light-indigo',
    data: 'light-slate',
  };

  // Read persisted themes from localStorage (or use defaults)
  // When globalTheme is null, CSS :root defaults (light-blue) apply
  const [globalTheme, setGlobalThemeState] = useState<string | null>(() => {
    return localStorage.getItem('lum-global-theme');
  });
  const [moduleThemes, setModuleThemesState] = useState<Record<string, string>>(() => {
    try {
      const stored = localStorage.getItem('lum-module-themes');
      return stored ? JSON.parse(stored) : {};
    } catch { return {}; }
  });

  useEffect(() => {
    setGlobalTheme('light-blue')
    setModuleTheme('apps', 'light-sky')
    setModuleTheme('workflow', 'light-teal')
    setModuleTheme('agents', 'light-violet')
    setModuleTheme('vibe', 'light-indigo')
    setModuleTheme('data', 'light-slate')
    // setGlobalTheme('dark-blue')
    // setModuleTheme('apps', 'dark-blue')
    // setModuleTheme('workflow', 'dark-blue')
    // setModuleTheme('agents', 'dark-blue')
    // setModuleTheme('vibe', 'dark-blue')
    // setModuleTheme('data', 'dark-blue')
  }, [])

  // Apply global theme on <html> element on mount and whenever it changes
  // When null, remove data-theme so CSS :root defaults (light-blue) apply
  useEffect(() => {
    if (globalTheme) {
      document.documentElement.setAttribute('data-theme', globalTheme);
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
  }, [globalTheme]);

  /**
   * Set the global theme for the entire platform.
   * This changes auth, sidebar, dashboard, AND default module accent.
   * @param theme - 'light-blue' | 'light-slate' | 'dark-blue' | null (reset to CSS default)
   *
   * Usage: setGlobalTheme('dark-blue')
   *        setGlobalTheme(null)  // reset to CSS :root default (light-blue)
   */
  const setGlobalTheme = (theme: string | null) => {
    setGlobalThemeState(theme);
    if (theme) {
      localStorage.setItem('lum-global-theme', theme);
      document.documentElement.setAttribute('data-theme', theme);
    } else {
      localStorage.removeItem('lum-global-theme');
      document.documentElement.removeAttribute('data-theme');
    }
  };

  /**
   * Set a module-specific theme override.
   * This ONLY changes --mod-* vars for the given module.
   * Pass null/undefined to reset to module default.
   * @param moduleId - 'workflow' | 'apps' | 'agents' | 'vibe' | 'data'
   * @param theme    - e.g. 'light-teal', 'light-indigo', or null to reset
   *
   * Usage: setModuleTheme('workflow', 'light-sky')
   *        setModuleTheme('agents', null)  // reset to default (light-violet)
   *
   * Default module themes (when no override is set):
   *   workflow → light-teal
   *   apps     → light-sky
   *   agents   → light-violet
   *   vibe     → light-indigo
   *   data     → light-slate
   */
  const setModuleTheme = (moduleId: string, theme: string | null) => {
    setModuleThemesState(prev => {
      const next = { ...prev };
      if (theme) {
        next[moduleId] = theme;
      } else {
        delete next[moduleId];
      }
      localStorage.setItem('lum-module-themes', JSON.stringify(next));
      return next;
    });
  };

  /** Get the effective theme for a module (explicit override > module default > global) */
  const getModuleTheme = (moduleId: string): string => {
    return moduleThemes[moduleId] || DEFAULT_MODULE_THEMES[moduleId] || globalTheme || 'light-blue';
  };

  // Vibe Projects State
  const [vibeProjects, setVibeProjects] = useState<Project[]>([
    {
      id: '1',
      name: 'Quantum Commerce Flow',
      lastEdited: '2m ago',
      files: generateProjectFiles('Quantum Commerce Flow'),
      history: [
        { id: 1, type: 'bot', text: "Welcome to Quantum Commerce Flow. I've initialized the core infrastructure for you.", time: "2m ago" }
      ]
    }
  ]);
  const [activeVibeProjectId, setActiveVibeProjectId] = useState<string | null>(null);
  const [vibeInitialPrompt, setVibeInitialPrompt] = useState<string | undefined>(undefined);

  const executeViewChange = useCallback((newView: ViewType) => {
    setView(newView);
    if (newView === 'app-list' || newView === 'app-editor') setLastAppView(newView);
    if (newView === 'workflow-home' || newView === 'workflow-builder') setLastWorkflowView(newView);
    if (newView === 'agent-home' || newView === 'ai-agent-builder') setLastAgentView(newView);
  }, []);

  const handleSetView = useCallback((newView: ViewType) => {
    if (newView === 'data' || (view === 'login' && newView === 'dashboard')) {
      setIsTransitioning(true);
      setTimeout(() => {
        executeViewChange(newView);
      }, 1000);
      setTimeout(() => {
        setIsTransitioning(false);
      }, 3000);
    } else {
      executeViewChange(newView);
    }
  }, [view, executeViewChange]);

  const handleNavigate = useCallback((newView: ViewType) => {
    let targetView = newView;
    if (newView === 'app-list') targetView = lastAppView;
    else if (newView === 'workflow-home') targetView = lastWorkflowView;
    else if (newView === 'agent-home') targetView = lastAgentView;

    if (targetView === 'data') {
      setIsTransitioning(true);
      setTimeout(() => {
        executeViewChange(targetView);
        setIsTransitioning(false);
      }, 3000);
    } else {
      executeViewChange(targetView);
    }
  }, [lastAppView, lastWorkflowView, lastAgentView, executeViewChange]);

  const handleStartVibeProject = (prompt?: string) => {
    const name = prompt ? (prompt.length > 20 ? prompt.substring(0, 20) + '...' : prompt) : `New Experiment ${vibeProjects.length + 1}`;
    const newProject: Project = {
      id: Date.now().toString(),
      name,
      lastEdited: 'Just now',
      files: generateProjectFiles(name),
      history: [{ id: 1, type: 'bot', text: `Project "${name}" initialized. Syncing your vision...`, time: "Just now" }]
    };
    setVibeProjects([newProject, ...vibeProjects]);
    setActiveVibeProjectId(newProject.id);
    setVibeInitialPrompt(prompt);
    executeViewChange('vibe-coder');
  };

  const handleOpenVibeProject = (id: string) => {
    setActiveVibeProjectId(id);
    setVibeInitialPrompt(undefined);
    executeViewChange('vibe-coder');
  };

  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [workflows, setWorkflows] = useState<Workflow[]>([]);

  useEffect(() => {
    const token = sessionStorage.getItem('access_token');
    if (token && view === 'login') {
      handleSetView('dashboard');
    }
  }, [view, handleSetView]);
  const [activeWorkflowId, setActiveWorkflowId] = useState<string | null>(workflows[0]?.id || null);
  const [nodes, setNodes] = useState<NodeData[]>([
    { id: 'start-1', type: 'start', label: 'Start Flow', position: { x: 100, y: 150 }, config: { variables: [], data: [], inputMode: 'table' } },
    { id: 'js-1', type: 'js-expression', label: 'Logic Gate', position: { x: 400, y: 150 }, events: [], config: { expression: "// Example: return { status: 'success' };\nreturn true;" } },
    { id: 'stop-1', type: 'stop', label: 'Finish', position: { x: 700, y: 150 }, config: {} },
  ]);
  const [connections, setConnections] = useState<Connection[]>([
    { id: 'c1', sourceId: 'start-1', targetId: 'js-1' },
    { id: 'c2', sourceId: 'js-1', targetId: 'stop-1' },
  ]);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [draggedConnection, setDraggedConnection] = useState<ConnectionDrag | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const [isActionCenterOpen, setIsActionCenterOpen] = useState(false);
  const [isFlowsPopoverOpen, setIsFlowsPopoverOpen] = useState(false);
  const [isComponentSidebarOpen, setIsComponentSidebarOpen] = useState(false);

  const canvasRef = useRef<HTMLDivElement>(null);

  const addNode = (type: NodeType, position?: Position) => {
    const newNode: NodeData = {
      id: `${type}-${Date.now()}`,
      type,
      label: COMPONENT_METADATA[type].label,
      position: position || { x: 150, y: 150 },
      events: type === 'js-expression' ? [] : undefined,
      config: type === 'start' ? { variables: [], data: [], inputMode: 'table' } : (type === 'js-expression' ? { expression: "// Logic goes here\nreturn true;" } : {})
    };
    setNodes(prev => [...prev, newNode]);
    setSelectedNodeId(newNode.id);
  };

  const cloneNode = (id: string) => {
    const original = nodes.find(n => n.id === id);
    if (!original) return;
    const newNode: NodeData = {
      ...original,
      id: `${original.type}-${Date.now()}`,
      position: { x: original.position.x + 40, y: original.position.y + 40 }
    };
    setNodes(prev => [...prev, newNode]);
    setSelectedNodeId(newNode.id);
  };

  const updateNodePosition = useCallback((id: string, position: Position) => {
    setNodes(prev => prev.map(n => n.id === id ? { ...n, position } : n));
  }, []);

  const deleteNode = (id: string) => {
    setNodes(prev => prev.filter(n => n.id !== id));
    setConnections(prev => prev.filter(c => c.sourceId !== id && c.targetId !== id));
    if (selectedNodeId === id) {
      setSelectedNodeId(null);
      setIsDrawerOpen(false);
    }
  };

  const updateNodeConfig = (id: string, updates: Record<string, any>) => {
    setNodes(prev => prev.map(n => n.id === id ? { ...n, config: { ...(n.config || {}), ...updates } } : n));
  };

  const deleteWorkflow = (id: string) => {
    setWorkflows(prev => prev.filter(w => w.id !== id));
    if (activeWorkflowId === id) setActiveWorkflowId(null);
  };


  const getSourcePos = (id: string): Position => {
    const node = nodes.find(n => n.id === id);
    if (!node) return { x: 0, y: 0 };
    return { x: node.position.x + 180, y: node.position.y + 24 };
  };

  const getTargetPos = (id: string): Position => {
    const node = nodes.find(n => n.id === id);
    if (!node) return { x: 0, y: 0 };
    return { x: node.position.x, y: node.position.y + 24 };
  };

  const handleStartConnection = (sourceId: string, e: React.MouseEvent) => {
    const startPos = getSourcePos(sourceId);
    setDraggedConnection({
      sourceId,
      startX: startPos.x,
      startY: startPos.y,
      currentX: startPos.x,
      currentY: startPos.y
    });

    const handleMouseMove = (me: MouseEvent) => {
      if (!canvasRef.current) return;
      const rect = canvasRef.current.getBoundingClientRect();
      setDraggedConnection(prev => prev ? {
        ...prev,
        currentX: me.clientX - rect.left,
        currentY: me.clientY - rect.top
      } : null);
    };

    const handleMouseUp = () => {
      setDraggedConnection(null);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };

  const handleEndConnection = (targetId: string) => {
    if (draggedConnection && draggedConnection.sourceId !== targetId) {
      const exists = connections.some(c => c.sourceId === draggedConnection.sourceId && c.targetId === targetId);
      if (!exists) {
        setConnections(prev => [...prev, {
          id: `c-${Date.now()}`,
          sourceId: draggedConnection.sourceId,
          targetId: targetId
        }]);
      }
    }
    setDraggedConnection(null);
  };

  const addEvent = (nodeId: string) => {
    setNodes(nodes.map(node => {
      if (node.id === nodeId) {
        const newEvent: EventConfig = { id: `event-${Date.now()}`, type: 'call', value: '', params: '' };
        return { ...node, events: [...(node.events || []), newEvent] };
      }
      return node;
    }));
  };

  const updateEvent = (nodeId: string, eventId: string, updates: Partial<EventConfig>) => {
    setNodes(nodes.map(node => {
      if (node.id === nodeId) {
        return { ...node, events: node.events?.map(e => e.id === eventId ? { ...e, ...updates } : e) };
      }
      return node;
    }));
  };

  const removeEvent = (nodeId: string, eventId: string) => {
    setNodes(nodes.map(node => {
      if (node.id === nodeId) {
        return { ...node, events: node.events?.filter(e => e.id !== eventId) };
      }
      return node;
    }));
  };

  return (
    <>
      <AnimatePresence>
        {isTransitioning && <GlobalLoader />}
      </AnimatePresence>

      {view === 'login' ? (
        <Login
          onLogin={() => handleSetView('dashboard')}
          onForgotPassword={() => setView('forgot-password')}
        />
      ) : view === 'forgot-password' ? (
        <ForgotPassword onBackToLogin={() => setView('login')} />
      ) : (
        <div className="flex h-screen w-full bg-shell-bg overflow-hidden text-shell-text">
          <Sidebar
            currentView={view}
            onNavigate={handleNavigate}
            onLogout={() => {
              sessionStorage.removeItem('access_token');
              handleSetView('login');
            }}
          />

          <div className="flex-1 flex flex-col overflow-hidden relative pb-[72px] md:pb-0">
            {
              view === 'dashboard' &&
              (<ModuleThemeContext.Provider value={globalTheme}>
                <div data-theme={globalTheme} className="flex-1 flex flex-col overflow-hidden">
                  <Dashboard onNavigate={handleSetView} workflows={workflows} />
                </div>
              </ModuleThemeContext.Provider>)
            }
            {
              view === 'app-list' &&
              (<ModuleThemeContext.Provider value={getModuleTheme('apps')}>
                <div data-theme={getModuleTheme('apps')} className="flex-1 flex flex-col overflow-hidden">
                  <AppHome onSelectApp={() => handleSetView('app-editor')} onStartVibeCoding={() => handleSetView('vibe-home')} />
                </div>
              </ModuleThemeContext.Provider>)
            }
            {
              view === 'vibe-home' &&
              (<ModuleThemeContext.Provider value={getModuleTheme('vibe')}>
                <div data-theme={getModuleTheme('vibe')} className="flex-1 flex flex-col overflow-hidden">
                  <VibeHome projects={vibeProjects} onStartProject={handleStartVibeProject} onOpenProject={handleOpenVibeProject} />
                </div>
              </ModuleThemeContext.Provider>)
            }
            {
              view === 'vibe-coder' &&
              (<ModuleThemeContext.Provider value={getModuleTheme('vibe')}>
                <div data-theme={getModuleTheme('vibe')} className="flex-1 flex flex-col overflow-hidden">
                  <VibeCoder
                    onBack={() => handleSetView('vibe-home')}
                    projectId={activeVibeProjectId}
                    projects={vibeProjects}
                    initialPrompt={vibeInitialPrompt}
                    onUpdateProjects={setVibeProjects}
                  />
                </div>
              </ModuleThemeContext.Provider>)
            }
            {
              view === 'agent-home' &&
              (<ModuleThemeContext.Provider value={getModuleTheme('agents')}>
                <div data-theme={getModuleTheme('agents')} className="flex-1 flex flex-col overflow-hidden">
                  <AgentHome onSelectAgent={() => handleSetView('ai-agent-builder')} onCreateAgent={() => handleSetView('ai-agent-builder')} />
                </div>
              </ModuleThemeContext.Provider>)
            }
            {
              view === 'app-editor' &&
              (<ModuleThemeContext.Provider value={getModuleTheme('apps')}>
                <div data-theme={getModuleTheme('apps')} className="flex-1 flex flex-col overflow-hidden">
                  <AppEditor onBack={() => handleSetView('app-list')} />
                </div>
              </ModuleThemeContext.Provider>)
            }
            {
              view === 'data' &&
              (<ModuleThemeContext.Provider value={getModuleTheme('data')}>
                <div data-theme={getModuleTheme('data')} className="flex-1 flex flex-col overflow-hidden">
                  <DataSection />
                </div>
              </ModuleThemeContext.Provider>)
            }

            {
              view === 'ai-agent-builder' &&
              (<ModuleThemeContext.Provider value={getModuleTheme('agents')}>
                <div data-theme={getModuleTheme('agents')} className="flex-1 flex flex-col overflow-hidden">
                  <AiAgentBuilder onBack={() => handleSetView('agent-home')} />
                </div>
              </ModuleThemeContext.Provider>
              )
            }

            {
              view === 'workflow-home' &&
              (<ModuleThemeContext.Provider value={getModuleTheme('workflow')}>
                <div data-theme={getModuleTheme('workflow')} className="flex-1 flex flex-col overflow-hidden">
                  <WorkflowHome
                    workspaces={workspaces}
                    setWorkspaces={setWorkspaces}
                    workflows={workflows}
                    setWorkflows={setWorkflows}
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                    viewMode={viewMode}
                    setViewMode={setViewMode}
                    setActiveWorkflowId={setActiveWorkflowId}
                    deleteWorkflow={deleteWorkflow}
                    setView={handleSetView}
                    setNodes={setNodes}
                    setConnections={setConnections}
                    setIsAiGenerated={setIsAiGenerated}
                  />
                </div>
              </ModuleThemeContext.Provider>)
            }
            {
              view === 'workflow-builder' &&
              (<ModuleThemeContext.Provider value={getModuleTheme('workflow')}>
                <div data-theme={getModuleTheme('workflow')} className="flex-1 flex flex-col overflow-hidden">
                  <WorkflowBuilder
                    workflows={workflows}
                    setWorkflows={setWorkflows}
                    activeWorkflowId={activeWorkflowId}
                    setActiveWorkflowId={setActiveWorkflowId}
                    workspaces={workspaces}
                    nodes={nodes}
                    setNodes={setNodes}
                    updateNodePosition={updateNodePosition}
                    deleteNode={deleteNode}
                    cloneNode={cloneNode}
                    updateNodeConfig={updateNodeConfig}
                    connections={connections}
                    setConnections={setConnections}
                    selectedNodeId={selectedNodeId}
                    setSelectedNodeId={setSelectedNodeId}
                    isDrawerOpen={isDrawerOpen}
                    setIsDrawerOpen={setIsDrawerOpen}
                    draggedConnection={draggedConnection}
                    setDraggedConnection={setDraggedConnection}
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                    isFlowsPopoverOpen={isFlowsPopoverOpen}
                    setIsFlowsPopoverOpen={setIsFlowsPopoverOpen}
                    isComponentSidebarOpen={isComponentSidebarOpen}
                    setIsComponentSidebarOpen={setIsComponentSidebarOpen}
                    setView={handleSetView}
                    deleteWorkflow={deleteWorkflow}
                    addNode={addNode}
                    handleStartConnection={handleStartConnection}
                    handleEndConnection={handleEndConnection}
                    getSourcePos={getSourcePos}
                    getTargetPos={getTargetPos}
                    addEvent={addEvent}
                    updateEvent={updateEvent}
                    removeEvent={removeEvent}
                    canvasRef={canvasRef}
                    isAiGenerated={isAiGenerated}
                    setIsAiGenerated={setIsAiGenerated}
                  />
                </div>
              </ModuleThemeContext.Provider>)
            }
          </div>
        </div>
      )}
    </>
  );
};

export default App;
