import { AnimatePresence, motion } from 'framer-motion';
import {
  Activity,
  ArrowLeft,
  ArrowRightLeft,
  Bot,
  Calendar,
  Check,
  CheckCircle2,
  ChevronDown,
  Clock,
  Code2,
  Compass,
  Component,
  Copy,
  Database,
  FileJson,
  Globe,
  HardDrive,
  History,
  Info,
  Layers,
  LayoutGrid,
  Link2,
  Loader2,
  Lock,
  Minus,
  MoreVertical,
  Network,
  Play,
  Plus,
  Rocket,
  Search,
  Settings2,
  Sparkles,
  Table as TableIcon,
  Terminal,
  Trash2,
  Unlock,
  Workflow as WorkflowIcon,
  X
} from 'lucide-react';
import React, { useState } from 'react';
import { COMPONENT_METADATA, EVENT_TYPES } from '../../../../constants';
import {
  Connection,
  ConnectionDrag,
  EventConfig,
  EventType,
  NodeData,
  NodeType,
  Position,
  ViewType,
  Workflow,
  Workspace
} from '../../../../types';
import AIDrawer from '../../Common/AIDrawer';
import GuidedTour, { TourStep } from '../../Common/GuidedTour';
import Modal from '../../Common/Modal';
import ConnectionLine from './ConnectionLine';
import WorkflowNode from './WorkflowNode';
import WorkflowSidebarItem from './WorkflowSidebarItem';

interface WorkflowBuilderProps {
  workflows: Workflow[];
  activeWorkflowId: string | null;
  setActiveWorkflowId: (id: string | null) => void;
  workspaces: Workspace[];
  nodes: NodeData[];
  setNodes: React.Dispatch<React.SetStateAction<NodeData[]>>;
  updateNodePosition: (id: string, pos: Position) => void;
  deleteNode: (id: string) => void;
  cloneNode: (id: string) => void;
  updateNodeConfig: (id: string, updates: Record<string, any>) => void;
  connections: Connection[];
  setConnections: React.Dispatch<React.SetStateAction<Connection[]>>;
  selectedNodeId: string | null;
  setSelectedNodeId: (id: string | null) => void;
  isDrawerOpen: boolean;
  setIsDrawerOpen: (isOpen: boolean) => void;
  draggedConnection: ConnectionDrag | null;
  setDraggedConnection: React.Dispatch<React.SetStateAction<ConnectionDrag | null>>;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  isFlowsPopoverOpen: boolean;
  setIsFlowsPopoverOpen: (isOpen: boolean) => void;
  isComponentSidebarOpen: boolean;
  setIsComponentSidebarOpen: (isOpen: boolean) => void;
  setIsChoosingCreationMode: (isChoosing: boolean) => void;
  setView: (view: ViewType) => void;
  deleteWorkflow: (id: string) => void;
  addNode: (type: NodeType, position?: Position) => void;
  handleStartConnection: (sourceId: string, e: React.MouseEvent) => void;
  handleEndConnection: (targetId: string) => void;
  getSourcePos: (id: string) => Position;
  getTargetPos: (id: string) => Position;
  addEvent: (nodeId: string) => void;
  updateEvent: (nodeId: string, eventId: string, updates: Partial<EventConfig>) => void;
  removeEvent: (nodeId: string, eventId: string) => void;
  canvasRef: React.RefObject<HTMLDivElement>;
  setWorkflows: React.Dispatch<React.SetStateAction<Workflow[]>>;
  isAiGenerated: boolean;
  setIsAiGenerated: (value: boolean) => void;
}

const FormLabel: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1 mb-1.5 block">
    {children}
  </label>
);

const PayloadTable: React.FC<{
  items: { key: string; value: string }[];
  onUpdate: (newItems: { key: string; value: string }[]) => void;
  placeholderKey?: string;
  placeholderValue?: string;
}> = ({ items, onUpdate, placeholderKey = "Key", placeholderValue = "Value" }) => {
  const addItem = () => onUpdate([...items, { key: '', value: '' }]);
  const removeItem = (idx: number) => onUpdate(items.filter((_, i) => i !== idx));
  const updateItem = (idx: number, updates: Partial<{ key: string; value: string }>) => {
    onUpdate(items.map((item, i) => i === idx ? { ...item, ...updates } : item));
  };

  return (
    <div className="space-y-2">
      {items.map((item, idx) => (
        <div key={idx} className="flex gap-2 group/row">
          <input
            type="text"
            placeholder={placeholderKey}
            value={item.key}
            onChange={(e) => updateItem(idx, { key: e.target.value })}
            className="flex-1 px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs outline-none focus:border-blue-400 transition-colors"
          />
          <input
            type="text"
            placeholder={placeholderValue}
            value={item.value}
            onChange={(e) => updateItem(idx, { value: e.target.value })}
            className="flex-1 px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs outline-none focus:border-blue-400 transition-colors"
          />
          <button
            onClick={() => removeItem(idx)}
            className="p-1.5 text-gray-300 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors group-hover/row:text-gray-400"
          >
            <Trash2 size={14} />
          </button>
        </div>
      ))}
      <button
        onClick={addItem}
        className="flex items-center gap-1.5 text-[10px] font-bold text-blue-700 hover:text-blue-800 p-1.5 hover:bg-slate-50 rounded-lg transition-all"
      >
        <Plus size={12} /> Add Property
      </button>
    </div>
  );
};

const WorkflowBuilder: React.FC<WorkflowBuilderProps> = ({
  workflows,
  activeWorkflowId,
  setActiveWorkflowId,
  workspaces,
  nodes,
  setNodes,
  updateNodePosition,
  deleteNode,
  cloneNode,
  updateNodeConfig,
  connections,
  setConnections,
  selectedNodeId,
  setSelectedNodeId,
  isDrawerOpen,
  setIsDrawerOpen,
  draggedConnection,
  setDraggedConnection,
  searchQuery,
  setSearchQuery,
  isFlowsPopoverOpen,
  setIsFlowsPopoverOpen,
  isComponentSidebarOpen,
  setIsComponentSidebarOpen,
  setIsChoosingCreationMode,
  setView,
  deleteWorkflow,
  addNode,
  handleStartConnection,
  handleEndConnection,
  getSourcePos,
  getTargetPos,
  addEvent,
  updateEvent,
  removeEvent,
  canvasRef,
  setWorkflows,
  isAiGenerated,
  setIsAiGenerated
}) => {
  const [isRunning, setIsRunning] = React.useState(false);
  const [isActionsMenuOpen, setIsActionsMenuOpen] = React.useState(false);
  const actionsMenuRef = React.useRef<HTMLDivElement>(null);

  const [isVersionsPopoverOpen, setIsVersionsPopoverOpen] = React.useState(false);
  const [selectedVersion, setSelectedVersion] = React.useState('v1.0.0 (Live)');
  const [revertToast, setRevertToast] = React.useState('');

  const mockVersions = [
    { id: 'v1.0.0', label: 'v1.0.0 (Live)', date: 'Today, 10:45 AM' },
    { id: 'v0.9.5', label: 'v0.9.5', date: 'Yesterday, 2:30 PM' },
    { id: 'v0.9.0', label: 'v0.9.0', date: 'Oct 24, 11:15 AM' },
    { id: 'v0.8.0', label: 'v0.8.0', date: 'Oct 20, 09:00 AM' },
  ];

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (actionsMenuRef.current && !actionsMenuRef.current.contains(event.target as Node)) {
        setIsActionsMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const [isGlobalAiOpen, setIsGlobalAiOpen] = React.useState(false);
  const [globalAiChatMessage, setGlobalAiChatMessage] = React.useState('');
  const [globalAiChatHistory, setGlobalAiChatHistory] = React.useState<{ role: 'user' | 'assistant', content: string }[]>([]);
  const [aiPanelMode, setAiPanelMode] = React.useState<'dock-right' | 'dock-left' | 'floating'>('dock-right');
  const [globalAiPosition, setGlobalAiPosition] = React.useState({ x: 0, y: 0 });

  // UI State
  const [isLocked, setIsLocked] = React.useState(false);
  const [zoom, setZoom] = React.useState(100);
  const [isSnapToGrid, setIsSnapToGrid] = React.useState(true);

  // Guided Tour State
  const [isTourOpen, setIsTourOpen] = useState(false);

  // Node Run Result Panel State
  const [isNodeRunPanelOpen, setIsNodeRunPanelOpen] = React.useState(false);
  const [nodeRunActiveTab, setNodeRunActiveTab] = React.useState<'table' | 'json' | 'logs'>('table');
  const [nodeRunNodeId, setNodeRunNodeId] = React.useState<string | null>(null);
  const [isNodeRunning, setIsNodeRunning] = React.useState(false);
  const [nodeRunResult, setNodeRunResult] = React.useState<{
    tableData: { key: string; value: string; type: string }[];
    jsonData: object;
    logs: { timestamp: string; level: 'info' | 'success' | 'warn'; message: string }[];
  } | null>(null);

  // Resizable Properties Drawer State
  const [drawerWidth, setDrawerWidth] = React.useState(440);
  const [isResizing, setIsResizing] = React.useState(false);

  const startResizing = React.useCallback(() => {
    setIsResizing(true);
  }, []);

  const stopResizing = React.useCallback(() => {
    setIsResizing(false);
  }, []);

  const resize = React.useCallback(
    (mouseMoveEvent: MouseEvent) => {
      if (isResizing) {
        const newWidth = window.innerWidth - mouseMoveEvent.clientX;
        if (newWidth >= 320 && newWidth <= 800) {
          setDrawerWidth(newWidth);
        }
      }
    },
    [isResizing]
  );

  React.useEffect(() => {
    if (isResizing) {
      window.addEventListener("mousemove", resize);
      window.addEventListener("mouseup", stopResizing);
      document.body.style.cursor = 'col-resize';
      document.body.style.userSelect = 'none';
    } else {
      window.removeEventListener("mousemove", resize);
      window.removeEventListener("mouseup", stopResizing);
      document.body.style.cursor = 'default';
      document.body.style.userSelect = 'auto';
    }
    return () => {
      window.removeEventListener("mousemove", resize);
      window.removeEventListener("mouseup", stopResizing);
      document.body.style.cursor = 'default';
      document.body.style.userSelect = 'auto';
    };
  }, [isResizing, resize, stopResizing]);

  const handleRunNode = (nodeId: string) => {
    const targetNode = nodes.find(n => n.id === nodeId);
    if (!targetNode) return;

    setNodeRunNodeId(nodeId);
    setIsNodeRunPanelOpen(true);
    setIsNodeRunning(true);
    setNodeRunResult(null);
    setNodeRunActiveTab('table');

    // Clear any previous error on this node
    setNodes(prev => prev.map(n => n.id === nodeId ? { ...n, error: undefined } : n));

    setTimeout(() => {
      const now = new Date();
      const ts = (offset: number) => {
        const d = new Date(now.getTime() + offset);
        return d.toLocaleTimeString('en-US', { hour12: false }) + '.' + String(d.getMilliseconds()).padStart(3, '0');
      };

      setNodeRunResult({
        tableData: [
          { key: 'status', value: 'success', type: 'string' },
          { key: 'executionTime', value: '1.2s', type: 'string' },
          { key: 'rowsProcessed', value: '148', type: 'number' },
          { key: 'outputSize', value: '3.4 KB', type: 'string' },
          { key: 'cacheHit', value: 'true', type: 'boolean' },
        ],
        jsonData: {
          status: 'success',
          nodeId,
          nodeType: targetNode.type,
          duration: '1.2s',
          output: {
            rowsProcessed: 148,
            outputSize: '3.4 KB',
            cacheHit: true,
            data: [{ id: 1, name: 'Record A' }, { id: 2, name: 'Record B' }, { id: 3, name: 'Record C' }]
          }
        },
        logs: [
          { timestamp: ts(0), level: 'info', message: `[Node:${nodeId}] Execution started` },
          { timestamp: ts(200), level: 'info', message: `[Node:${nodeId}] Initializing ${targetNode.type} handler...` },
          { timestamp: ts(500), level: 'info', message: `[Node:${nodeId}] Processing input payload (148 rows)` },
          { timestamp: ts(900), level: 'info', message: `[Node:${nodeId}] Applying transformation logic` },
          { timestamp: ts(1100), level: 'success', message: `[Node:${nodeId}] Execution completed successfully (1.2s)` },
        ]
      });
      setIsNodeRunning(false);
    }, 1200);
  };

  const runningNode = nodeRunNodeId ? nodes.find(n => n.id === nodeRunNodeId) : null;

  // Auto-open Global AI sidebar when workflow was AI-generated
  React.useEffect(() => {
    if (isAiGenerated) {
      setIsGlobalAiOpen(true);
      setGlobalAiChatHistory([
        {
          role: 'assistant',
          content: `I've generated a workflow based on your prompt. Feel free to ask me to make changes, add nodes, or explain any part of the flow.`
        }
      ]);
      setIsAiGenerated(false);
    }
  }, [isAiGenerated]);

  const selectedNode = nodes.find(n => n.id === selectedNodeId);
  const activeWorkflow = workflows.find(w => w.id === activeWorkflowId);

  // Deploy Modal State
  const [isDeployModalOpen, setIsDeployModalOpen] = React.useState(false);
  const [deployForm, setDeployForm] = React.useState({
    name: '',
    isPublic: false,
    saveResponse: false,
    workspaceId: ''
  });

  // Effect to sync deploy form with active workflow when modal opens
  React.useEffect(() => {
    if (isDeployModalOpen && activeWorkflow) {
      setDeployForm({
        name: activeWorkflow.name === 'Untitled Workflow' || activeWorkflow.name === 'Untitled AI Workflow' ? '' : activeWorkflow.name,
        isPublic: activeWorkflow.isPublic || false,
        saveResponse: activeWorkflow.saveResponse || false,
        workspaceId: activeWorkflow.workspaceId || ''
      });
    }
  }, [isDeployModalOpen, activeWorkflow]);

  const handlePublish = () => {
    if (!activeWorkflowId || !deployForm.name.trim()) return;

    setWorkflows(prev => prev.map(w => w.id === activeWorkflowId ? {
      ...w,
      name: deployForm.name,
      isPublic: deployForm.isPublic,
      saveResponse: deployForm.saveResponse,
      workspaceId: deployForm.workspaceId,
      lastModified: new Date().toISOString()
    } : w));

    setIsDeployModalOpen(false);
    // You could add a success toast here if needed
  };

  const tourSteps: TourStep[] = [
    {
      targetId: '',
      title: "Welcome to Studio",
      content: "Let's take a quick tour of the building blocks of your workflow automation.",
      position: 'center'
    },
    {
      targetId: 'tour-selector',
      title: "Flow Navigator",
      content: "Switch between different workflows or create a new one instantly from here.",
      position: 'bottomLeft'
    },
    {
      targetId: 'tour-versions',
      title: "Safe Harbor",
      content: "Keep track of changes and revert to previous versions with ease. Never lose a work-in-progress.",
      position: 'bottomRight'
    },
    {
      targetId: 'tour-command-center',
      title: "Design Hub",
      content: "Access your component palette, AI assistant, and layout utilities. Everything you need to build is right here.",
      position: 'rightTop'
    },
    {
      targetId: 'tour-canvas',
      title: "The Playground",
      content: "Drag and drop components here to build your logic. Use the right-click menu for quick actions on nodes.",
      position: 'center'
    },
    {
      targetId: 'tour-zoom',
      title: "Bird's Eye View",
      content: "Navigate complex flows easily with these zoom and focus controls.",
      position: 'top'
    },
    {
      targetId: 'tour-run-reset',
      title: "Execution Control",
      content: "Instantly run your flow to test logic and catch errors in real-time.",
      position: 'bottomRight'
    },
    {
      targetId: 'tour-deploy',
      title: "Go Live",
      content: "When you're ready, deploy your workflow as a production-ready application.",
      position: 'bottomRight'
    }
  ];

  return (
    <div className="flex h-full w-full overflow-hidden bg-white">
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 bg-white border-b border-gray-100 pr-6 flex items-center justify-between z-[10000] shrink-0">
          {/* Left Section - Navigation (Aligned with Sidebar) */}
          <div className="flex items-center w-64 shrink-0 overflow-hidden pl-6 pr-4 border-r border-gray-100 h-full">
            <button
              onClick={() => setView('workflow-home')}
              className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 rounded-xl text-gray-500 transition-all group shrink-0"
              title="Back to Workflows"
            >
              <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
              <span className="text-sm font-bold text-gray-800">Workflows</span>
            </button>
          </div>

          {/* Center-Left Section - Selectors starting after sidebar width */}
          <div className="flex-1 flex items-center gap-2 pl-4">

            <div className="relative" id="tour-selector">
              <button
                onClick={() => setIsFlowsPopoverOpen(!isFlowsPopoverOpen)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all border ${isFlowsPopoverOpen
                    ? 'bg-teal-50 border-teal-200 text-teal-700 shadow-sm'
                    : 'bg-white border-transparent text-gray-600 hover:bg-gray-50'
                  }`}
              >
                <div className={`p-1.5 rounded-md transition-all ${isFlowsPopoverOpen ? 'bg-teal-600 text-white' : 'bg-gray-50 text-gray-400'}`}>
                  <WorkflowIcon size={14} />
                </div>
                <div className="text-left">
                  <p className="text-[9px] font-bold text-gray-400 uppercase tracking-tighter leading-none mb-0.5">Workflow</p>
                  <div className="flex items-center gap-1">
                    <span className="text-xs font-bold text-gray-800 leading-none truncate max-w-[200px]">
                      {workflows.find(w => w.id === activeWorkflowId)?.name || 'Select Flow'}
                    </span>
                    <ChevronDown size={12} className={`text-gray-400 transition-transform duration-200 ${isFlowsPopoverOpen ? 'rotate-180' : ''}`} />
                  </div>
                </div>
              </button>

              <AnimatePresence>
                {isFlowsPopoverOpen && (
                  <>
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      onClick={() => setIsFlowsPopoverOpen(false)}
                      className="fixed inset-0 z-[10000]"
                    />
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute top-full left-0 mt-2 w-96 bg-white border border-gray-200 rounded-2xl shadow-2xl z-[10001] overflow-hidden"
                    >
                      <div className="p-4 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
                        <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Switch Workflow</h3>
                      </div>
                      <div className="p-3">
                        <div className="relative mb-3">
                          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                          <input
                            type="text"
                            placeholder="Search flows..."
                            className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-100 rounded-xl text-xs outline-none focus:bg-white focus:border-teal-400 transition-all"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                          />
                        </div>
                        <div className="space-y-1 max-h-[400px] overflow-y-auto custom-scrollbar pr-1">
                          {workflows
                            .filter(w => w.name.toLowerCase().includes(searchQuery.toLowerCase()))
                            .map(wf => (
                              <WorkflowSidebarItem
                                key={wf.id}
                                workflow={wf}
                                isActive={activeWorkflowId === wf.id}
                                hideActions={true}
                                workspaceName={workspaces.find(ws => ws.id === wf.workspaceId)?.name}
                                onEdit={(w) => {
                                  setActiveWorkflowId(w.id);
                                  setIsFlowsPopoverOpen(false);
                                }}
                                onDelete={deleteWorkflow}
                                onSettings={() => { }}
                                onViewInfo={() => { }}
                                onDuplicate={() => { }}
                                onViewLineage={() => { }}
                              />
                            ))}
                        </div>
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>


          </div>

          <AnimatePresence>
            {revertToast && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="fixed top-20 left-1/2 -translate-x-1/2 z-[100] px-4 py-2 bg-gray-900 border border-gray-700 text-white rounded-xl shadow-2xl text-xs font-bold flex items-center gap-2"
              >
                <History size={14} className="text-blue-400" />
                {revertToast}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Right Section - Master Actions */}
          <div className="flex items-center justify-end gap-3">
            {/* Version History Selector */}
            <div className="relative" id="tour-versions">
              <button
                onClick={() => setIsVersionsPopoverOpen(!isVersionsPopoverOpen)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all border ${isVersionsPopoverOpen
                    ? 'bg-blue-50 border-blue-200 text-blue-700 shadow-sm'
                    : 'bg-white border-transparent text-gray-600 hover:bg-gray-50'
                  }`}
                title="Version History"
              >
                <div className={`p-1.5 rounded-md transition-all ${isVersionsPopoverOpen ? 'bg-blue-700 text-white' : 'bg-gray-50 text-gray-400'}`}>
                  <History size={14} />
                </div>
                <div className="text-left">
                  <p className="text-[9px] font-bold text-gray-400 uppercase tracking-tighter leading-none mb-0.5">Version</p>
                  <div className="flex items-center gap-1">
                    <span className="text-xs font-bold text-gray-800 leading-none truncate max-w-[120px]">
                      {selectedVersion}
                    </span>
                    <ChevronDown size={12} className={`text-gray-400 transition-transform duration-200 ${isVersionsPopoverOpen ? 'rotate-180' : ''}`} />
                  </div>
                </div>
              </button>

              <AnimatePresence>
                {isVersionsPopoverOpen && (
                  <>
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      onClick={() => setIsVersionsPopoverOpen(false)}
                      className="fixed inset-0 z-[10000]"
                    />
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute top-full right-0 mt-2 w-72 bg-white border border-gray-200 rounded-2xl shadow-2xl z-[10001] overflow-hidden"
                    >
                      <div className="p-4 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
                        <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1.5"><History size={12} /> Version History</h3>
                      </div>
                      <div className="p-2 space-y-1 max-h-[300px] overflow-y-auto custom-scrollbar">
                        {mockVersions.map((v) => (
                          <button
                            key={v.id}
                            onClick={() => {
                              setSelectedVersion(v.label);
                              setIsVersionsPopoverOpen(false);
                              setRevertToast(`Reverted workflow to ${v.label}`);
                              setTimeout(() => setRevertToast(''), 3000);
                            }}
                            className={`w-full flex flex-col items-start p-3 rounded-xl transition-all border ${selectedVersion === v.label ? 'bg-blue-50/50 border-blue-200' : 'bg-white border-transparent hover:bg-gray-50 hover:border-gray-100'}`}
                          >
                            <div className="flex items-center justify-between w-full mb-1">
                              <span className={`text-xs font-bold ${selectedVersion === v.label ? 'text-blue-800' : 'text-gray-800'}`}>
                                {v.label}
                              </span>
                              {selectedVersion === v.label && <CheckCircle2 size={14} className="text-blue-700" />}
                            </div>
                            <span className="text-[10px] text-gray-400 flex items-center gap-1"><Clock size={10} /> {v.date}</span>
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>

            <div className="flex items-center gap-1 bg-gray-50 p-1 rounded-lg border border-gray-100 mr-2" id="tour-run-reset">
              <button
                onClick={() => {
                  if (isRunning) return;
                  setIsRunning(true);
                  // Clear previous errors
                  setNodes(prev => prev.map(n => ({ ...n, error: undefined })));

                  // Simulate run and error injection
                  setTimeout(() => {
                    setNodes(prev => {
                      if (prev.length === 0) return prev;
                      // Target first js-expression or just the very first node
                      const targetIdx = prev.findIndex(n => n.type === 'js-expression');
                      const idx = targetIdx !== -1 ? targetIdx : 0;

                      const copy = [...prev];
                      copy[idx] = {
                        ...copy[idx],
                        error: "TypeError: Cannot read properties of undefined (reading 'map'). Ensure the incoming data payload is formatted correctly before processing."
                      };
                      return copy;
                    });
                    setIsRunning(false);
                  }, 1200);
                }}
                disabled={isRunning}
                className={`p-2 rounded-lg transition-all ${isRunning ? 'text-teal-400 bg-teal-50 cursor-wait' : 'text-gray-600 hover:text-teal-600 hover:bg-white hover:shadow-sm'}`}
                title="Run Flow"
              >
                {isRunning ? <Activity size={16} className="animate-spin" /> : <Play size={16} />}
              </button>

              <button
                onClick={() => {
                  if (confirm("Are you sure you want to reset the canvas?")) {
                    setNodes([]);
                    setConnections([]);
                  }
                }}
                className="p-2 text-gray-600 hover:text-rose-600 hover:bg-white hover:shadow-sm rounded-lg transition-all"
                title="Reset Canvas"
              >
                <Activity size={16} />
              </button>
            </div>

            <div className="relative" ref={actionsMenuRef} id="tour-global-actions">
              <button
                onClick={() => setIsActionsMenuOpen(!isActionsMenuOpen)}
                className={`p-2 rounded-lg transition-all border ${isActionsMenuOpen ? 'bg-teal-50 border-teal-200 text-teal-700 shadow-sm' : 'bg-gray-50 border-gray-100 text-gray-600 hover:text-teal-600 hover:bg-white hover:border-teal-100 hover:shadow-sm'}`}
                title="Workflow Settings"
              >
                <MoreVertical size={16} />
              </button>

              <AnimatePresence>
                {isActionsMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 10 }}
                    className="absolute top-full right-0 mt-2 w-56 bg-white border border-gray-100 rounded-2xl shadow-2xl z-[10001] py-2 overflow-hidden"
                  >
                    <div className="px-4 py-2 border-b border-gray-50 mb-1">
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Global Actions</p>
                    </div>

                    <button onClick={() => setIsActionsMenuOpen(false)} className="w-full px-4 py-2.5 text-left text-xs font-bold text-gray-600 hover:bg-teal-50 hover:text-teal-700 flex items-center gap-3 transition-all">
                      <Calendar size={14} className="text-blue-700" /> Schedule
                    </button>
                    <button onClick={() => setIsActionsMenuOpen(false)} className="w-full px-4 py-2.5 text-left text-xs font-bold text-gray-600 hover:bg-teal-50 hover:text-teal-700 flex items-center gap-3 transition-all">
                      <Copy size={14} className="text-violet-700" /> Duplicate
                    </button>
                    <button onClick={() => setIsActionsMenuOpen(false)} className="w-full px-4 py-2.5 text-left text-xs font-bold text-gray-600 hover:bg-teal-50 hover:text-teal-700 flex items-center gap-3 transition-all">
                      <Link2 size={14} className="text-teal-500" /> View Lineage
                    </button>
                    <button onClick={() => setIsActionsMenuOpen(false)} className="w-full px-4 py-2.5 text-left text-xs font-bold text-gray-600 hover:bg-teal-50 hover:text-teal-700 flex items-center gap-3 transition-all">
                      <Settings2 size={14} className="text-amber-600" /> Settings
                    </button>
                    <button onClick={() => setIsActionsMenuOpen(false)} className="w-full px-4 py-2.5 text-left text-xs font-bold text-gray-600 hover:bg-teal-50 hover:text-teal-700 flex items-center gap-3 transition-all">
                      <Info size={14} className="text-violet-700" /> Workflow Info
                    </button>

                    <div className="h-px bg-gray-50 my-1 mx-2" />

                    <button
                      onClick={() => {
                        if (activeWorkflowId) deleteWorkflow(activeWorkflowId);
                        setIsActionsMenuOpen(false);
                      }}
                      className="w-full px-4 py-2.5 text-left text-xs font-bold text-rose-500 hover:bg-rose-50 flex items-center gap-3 transition-all"
                    >
                      <Trash2 size={14} /> Delete Pipeline
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <button
              onClick={() => setIsDeployModalOpen(true)}
              className="flex items-center gap-2 px-5 py-2 bg-teal-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-teal-100 hover:bg-teal-700 transition-all active:scale-95"
              id="tour-deploy"
            >
              <Rocket size={16} /> Deploy
            </button>
          </div>
        </header>

        <div className="flex-1 flex overflow-hidden">
          <AnimatePresence>
            {isComponentSidebarOpen && (
              <motion.aside
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: 256, opacity: 1 }}
                exit={{ width: 0, opacity: 0 }}
                style={{ minWidth: 0 }}
              >
                <div className="w-[256px] flex flex-col h-full shrink-0 border-r border-gray-200">
                  <div className="p-5 border-b border-gray-100 flex items-center justify-between h-16 bg-white sticky top-0">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-teal-50 rounded-lg">
                        <Component size={18} className="text-teal-600" />
                      </div>
                      <span className="font-bold text-sm text-gray-900">Nodes</span>
                    </div>
                    <button
                      onClick={() => setIsComponentSidebarOpen(false)}
                      className="p-2 hover:bg-gray-100 rounded-lg text-gray-400 transition-colors"
                    >
                      <X size={18} />
                    </button>
                  </div>

                  <div className="flex-1 overflow-y-auto custom-scrollbar p-5">
                    <div className="relative mb-6">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                      <input
                        type="text"
                        placeholder="Search nodes..."
                        className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-xs outline-none focus:bg-white focus:border-teal-400 transition-all"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3 pb-10">
                      {(Object.keys(COMPONENT_METADATA) as NodeType[])
                        .filter(type => COMPONENT_METADATA[type].label.toLowerCase().includes(searchQuery.toLowerCase()))
                        .map(type => {
                          const meta = COMPONENT_METADATA[type];
                          return (
                            <button
                              key={type}
                              draggable
                              onDragStart={(e) => {
                                e.dataTransfer.setData('nodeType', type);
                              }}
                              onClick={() => {
                                addNode(type);
                              }}
                              className="flex flex-col items-center justify-center p-4 rounded-2xl bg-white border border-gray-100 hover:border-blue-400 hover:shadow-xl hover:-translate-y-1 transition-all group"
                            >
                              <div className={`p-3 rounded-xl ${meta.color} group-hover:scale-110 transition-transform mb-2 shadow-sm`}>
                                {React.cloneElement(meta.icon as React.ReactElement, { size: 18 })}
                              </div>
                              <span className="text-[10px] font-bold text-gray-600 group-hover:text-blue-600 text-center leading-tight">
                                {meta.label}
                              </span>
                            </button>
                          );
                        })}
                    </div>
                  </div>
                </div>
              </motion.aside>
            )}
          </AnimatePresence>

          <div
            ref={canvasRef}
            id="tour-canvas"
            className="flex-1 relative min-w-0 overflow-hidden canvas-grid bg-[#fcfdfe]"
            onDragOver={(e) => {
              e.preventDefault();
              e.dataTransfer.dropEffect = 'move';
            }}
            onDrop={(e) => {
              e.preventDefault();
              const type = e.dataTransfer.getData('nodeType') as NodeType;
              if (type && canvasRef.current) {
                const rect = canvasRef.current.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                addNode(type, { x: x - 90, y: y - 24 }); // Adjusting for node dimensions (approx 180x48)
              }
            }}
            onMouseDown={() => {
              setSelectedNodeId(null);
              setIsDrawerOpen(false);
              setIsFlowsPopoverOpen(false);
            }}
            style={{
              backgroundImage: 'radial-gradient(#e2e8f0 1.5px, transparent 1.5px)',
              backgroundSize: '30px 30px',
              backgroundColor: '#f8fafc'
            }}
          >
            <svg className="absolute inset-0 pointer-events-none w-full h-full">
              {connections.map(c => (
                <ConnectionLine
                  key={c.id}
                  start={getSourcePos(c.sourceId)}
                  end={getTargetPos(c.targetId)}
                  onRemove={() => setConnections(prev => prev.filter(conn => conn.id !== c.id))}
                />
              ))}
              {draggedConnection && (
                <ConnectionLine
                  start={{ x: draggedConnection.startX, y: draggedConnection.startY }}
                  end={{ x: draggedConnection.currentX, y: draggedConnection.currentY }}
                  isDragging
                />
              )}
            </svg>

            <div className="relative w-full h-full">
              {nodes.map(node => (
                <WorkflowNode
                  key={node.id}
                  node={node}
                  isSelected={selectedNodeId === node.id}
                  onDrag={(id, pos) => !isLocked && updateNodePosition(id, pos)}
                  onSelect={setSelectedNodeId}
                  onDelete={(id) => !isLocked && deleteNode(id)}
                  onEdit={() => {
                    setSelectedNodeId(node.id);
                    setIsDrawerOpen(true);
                  }}
                  onClone={(id) => !isLocked && cloneNode(id)}
                  onStartConnection={(id, e) => !isLocked && handleStartConnection(id, e)}
                  onEndConnection={(id) => !isLocked && handleEndConnection(id)}
                  onFixWithAI={(nodeId, errorMsg) => {
                    const node = nodes.find(n => n.id === nodeId);
                    setIsGlobalAiOpen(true);
                    setGlobalAiChatMessage(`@${node?.label || nodeId} `);
                    setGlobalAiChatHistory(prev => [
                      ...prev,
                      {
                        role: 'assistant',
                        content: `I noticed an error in node **${node?.label || nodeId}**. Here's the message:\n\n\`\`\`text\n${errorMsg}\n\`\`\`\n\nHow can I help you fix this?`
                      }
                    ]);
                  }}
                  onFixManually={(nodeId) => {
                    setSelectedNodeId(nodeId);
                    setIsDrawerOpen(true);
                    setNodes(prev => prev.map(n => n.id === nodeId ? { ...n, error: undefined } : n));
                  }}
                  onRunNode={handleRunNode}
                />
              ))}
            </div>

            {/* Premium "Command Center" Unified Toolbar - Vertically Centered */}
            <motion.div 
              initial={false}
              animate={{ y: isNodeRunPanelOpen ? '-80%' : '-50%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="absolute top-1/2 left-8 z-30 flex flex-col gap-3" 
              id="tour-command-center"
            >
              <div className="flex flex-col bg-white/70 backdrop-blur-xl border border-white/40 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.08)] overflow-hidden">
                {/* 1. Primary Actions Group (Creative Tools) */}
                <div className="flex flex-col border-b border-gray-100/50">
                  <button
                    onClick={() => !isLocked && setIsComponentSidebarOpen(!isComponentSidebarOpen)}
                    className={`p-4 transition-all active:scale-95 group relative ${isComponentSidebarOpen ? 'bg-teal-50 text-teal-600' : 'hover:bg-teal-50 text-gray-500 hover:text-teal-600'} ${isLocked ? 'cursor-not-allowed opacity-50' : ''}`}
                    title={isLocked ? "Locked" : "Toggle Add Node Panel"}
                  >
                    <LayoutGrid size={20} className={isComponentSidebarOpen ? 'rotate-0' : 'group-hover:scale-110 transition-transform duration-300'} />
                    <div className="absolute left-full ml-3 px-3 py-1.5 bg-gray-900 text-white text-[10px] font-bold rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none uppercase tracking-widest shadow-xl z-50">
                      {isComponentSidebarOpen ? 'Close Panel' : 'Add Component'}
                    </div>
                  </button>

                  <button
                    onClick={() => {
                      setIsGlobalAiOpen(!isGlobalAiOpen);
                      if (!isGlobalAiOpen) setIsDrawerOpen(false);
                    }}
                    className={`p-4 transition-all active:scale-90 group relative ${isGlobalAiOpen ? 'bg-violet-50 text-violet-600' : 'hover:bg-violet-50 text-violet-500 hover:text-violet-600'}`}
                    title="AI Workflow Support"
                  >
                    <div className="relative">
                      <Sparkles size={18} className={isGlobalAiOpen ? 'animate-pulse text-violet-600' : 'group-hover:scale-110 transition-transform'} />
                      {isGlobalAiOpen && (
                        <motion.div
                          layoutId="ai-glow"
                          className="absolute inset-0 bg-violet-400 blur-lg opacity-30 -z-10 rounded-full"
                          initial={{ scale: 0.5, opacity: 0 }}
                          animate={{ scale: 1.5, opacity: 0.3 }}
                          transition={{ repeat: Infinity, duration: 2, repeatType: 'reverse' }}
                        />
                      )}
                    </div>
                    <div className="absolute left-full ml-3 px-3 py-1.5 bg-violet-900 text-white text-[10px] font-bold rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none uppercase tracking-widest shadow-xl flex items-center gap-2 z-50">
                      <Bot size={12} className="text-violet-300" />
                      Lumenore AI Help
                    </div>
                  </button>
                </div>

                {/* 2. View & Layout Controls Group (Utilities) */}
                <div className="flex flex-col bg-gray-50/20">
                  <button
                    onClick={() => console.log("Rearranging...")}
                    className="p-4 hover:bg-teal-50 text-gray-400 hover:text-teal-600 transition-all active:scale-90 group relative"
                    title="Auto Rearrange"
                  >
                    <Network size={18} />
                    <div className="absolute left-full ml-3 px-3 py-1.5 bg-gray-900 text-white text-[10px] font-bold rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none uppercase tracking-widest shadow-xl z-50">Auto Rearrange</div>
                  </button>

                  <div className="h-px bg-gray-100/50 mx-2" />

                  <button
                    onClick={() => setIsLocked(!isLocked)}
                    className={`p-4 transition-all active:scale-90 group relative ${isLocked ? 'text-amber-600' : 'text-gray-400 hover:text-teal-600'}`}
                    title={isLocked ? "Unlock Canvas" : "Lock Canvas"}
                  >
                    {isLocked ? <Lock size={18} /> : <Unlock size={18} />}
                    <div className="absolute left-full ml-3 px-3 py-1.5 bg-gray-900 text-white text-[10px] font-bold rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none uppercase tracking-widest shadow-xl z-50">{isLocked ? 'Unlock Flow' : 'Lock Flow'}</div>
                  </button>

                  <div className="h-px bg-gray-100/50 mx-2" />

                  <button
                    onClick={() => setIsTourOpen(true)}
                    className="p-4 text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-all active:scale-90 group relative"
                    title="Quick Start Tour"
                  >
                    <Compass size={18} />
                    <div className="absolute left-full ml-3 px-3 py-1.5 bg-blue-900 text-white text-[10px] font-bold rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none uppercase tracking-widest shadow-xl z-50">Launch Tour</div>
                  </button>
                </div>
              </div>


            </motion.div>

            {/* Premium Mini Zoom Controls - Bottom Right Horizontal Bar */}
            <motion.div 
              initial={false}
              animate={{ bottom: isNodeRunPanelOpen ? 340 : 40 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="absolute right-10 z-30 flex items-center gap-2" 
              id="tour-zoom"
            >
              <div className="flex items-center bg-white/70 backdrop-blur-xl border border-white/40 rounded-2xl shadow-lg p-1">
                <button
                  onClick={() => setZoom(prev => Math.max(10, prev - 10))}
                  className="p-2.5 hover:bg-gray-100 text-gray-500 rounded-xl transition-all active:scale-90"
                  title="Zoom Out"
                >
                  <Minus size={14} strokeWidth={3} />
                </button>

                <button
                  onClick={() => setZoom(100)}
                  className="px-4 py-1.5 hover:bg-gray-100 text-gray-700 rounded-xl transition-all"
                  title="Reset to 100%"
                >
                  <span className="text-[10px] font-black uppercase tracking-widest leading-none">{zoom}%</span>
                </button>

                <button
                  onClick={() => setZoom(prev => Math.min(200, prev + 10))}
                  className="p-2.5 hover:bg-gray-100 text-gray-500 rounded-xl transition-all active:scale-90"
                  title="Zoom In"
                >
                  <Plus size={14} strokeWidth={3} />
                </button>
              </div>
            </motion.div>

            {/* Node Run Result Bottom Panel */}
            <AnimatePresence>
              {isNodeRunPanelOpen && (
                <motion.div
                  initial={{ y: '100%' }}
                  animate={{ y: 0 }}
                  exit={{ y: '100%' }}
                  transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                  className="absolute bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-[0_-12px_40px_rgba(0,0,0,0.15),0_-4px_12px_rgba(0,0,0,0.08)] rounded-t-2xl flex flex-col"
                  style={{ height: '320px' }}
                >
                  {/* Header */}
                  <div className="flex items-center justify-between px-6 py-3 border-b border-gray-100 shrink-0">
                    <div className="flex items-center gap-3">
                      <div className={`p-1.5 rounded-lg ${isNodeRunning ? 'bg-amber-50 text-amber-500' : 'bg-teal-50 text-teal-600'}`}>
                        {isNodeRunning ? <Loader2 size={16} className="animate-spin" /> : <CheckCircle2 size={16} />}
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-gray-900 leading-none mb-0.5">
                          {runningNode?.label || 'Node'} — {isNodeRunning ? 'Running...' : 'Execution Complete'}
                        </h4>
                        <p className="text-[10px] text-gray-400 font-mono">{nodeRunNodeId}</p>
                      </div>
                      {!isNodeRunning && (
                        <span className="px-2 py-0.5 bg-teal-50 text-teal-600 text-[9px] font-bold rounded-full border border-teal-100 uppercase tracking-wider">Success</span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      {/* Tabs */}
                      <div className="flex items-center bg-gray-100 p-0.5 rounded-lg">
                        {[
                          { key: 'table' as const, label: 'Table', icon: <TableIcon size={13} /> },
                          { key: 'json' as const, label: 'JSON', icon: <FileJson size={13} /> },
                          { key: 'logs' as const, label: 'Logs', icon: <Terminal size={13} /> },
                        ].map(tab => (
                          <button
                            key={tab.key}
                            onClick={() => setNodeRunActiveTab(tab.key)}
                            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[11px] font-bold transition-all leading-none ${
                              nodeRunActiveTab === tab.key
                                ? 'bg-white text-teal-700 shadow-sm'
                                : 'text-gray-500 hover:text-gray-700'
                            }`}
                          >
                            <span className="flex items-center shrink-0">{tab.icon}</span>
                            <span>{tab.label}</span>
                          </button>
                        ))}
                      </div>
                      <button
                        onClick={() => setIsNodeRunPanelOpen(false)}
                        className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-400 transition-colors"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 overflow-auto custom-scrollbar">
                    {isNodeRunning ? (
                      <div className="flex items-center justify-center h-full gap-3">
                        <Loader2 size={20} className="animate-spin text-teal-500" />
                        <span className="text-sm text-gray-500 font-medium">Executing node logic...</span>
                      </div>
                    ) : nodeRunResult ? (
                      <>
                        {/* Table Tab */}
                        {nodeRunActiveTab === 'table' && (
                          <table className="w-full text-left border-collapse">
                            <thead>
                              <tr className="bg-gray-50 border-b border-gray-100 sticky top-0">
                                <th className="px-6 py-2.5 text-[9px] font-bold text-gray-400 uppercase tracking-widest w-[200px]">Property</th>
                                <th className="px-6 py-2.5 text-[9px] font-bold text-gray-400 uppercase tracking-widest">Value</th>
                                <th className="px-6 py-2.5 text-[9px] font-bold text-gray-400 uppercase tracking-widest w-[120px]">Type</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                              {nodeRunResult.tableData.map((row, i) => (
                                <tr key={i} className="hover:bg-teal-50/30 transition-colors">
                                  <td className="px-6 py-2.5 text-xs font-bold text-gray-800">{row.key}</td>
                                  <td className="px-6 py-2.5 text-xs text-gray-600 font-mono">{row.value}</td>
                                  <td className="px-6 py-2.5">
                                    <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                                      row.type === 'string' ? 'bg-blue-50 text-blue-600 border border-blue-100'
                                      : row.type === 'number' ? 'bg-violet-50 text-violet-600 border border-violet-100'
                                      : 'bg-amber-50 text-amber-600 border border-amber-100'
                                    }`}>
                                      {row.type}
                                    </span>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        )}

                        {/* JSON Tab */}
                        {nodeRunActiveTab === 'json' && (
                          <div className="p-4">
                            <pre className="bg-[#0f172a] text-[#e2e8f0] text-xs font-mono p-5 rounded-xl leading-relaxed overflow-auto max-h-[200px] custom-scrollbar">
                              {JSON.stringify(nodeRunResult.jsonData, null, 2)}
                            </pre>
                          </div>
                        )}

                        {/* Logs Tab */}
                        {nodeRunActiveTab === 'logs' && (
                          <div className="p-4 space-y-1">
                            {nodeRunResult.logs.map((log, i) => (
                              <div key={i} className="flex items-start gap-3 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors font-mono">
                                <span className="text-[10px] text-gray-400 shrink-0 pt-0.5 tabular-nums">{log.timestamp}</span>
                                <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded shrink-0 uppercase tracking-wider ${
                                  log.level === 'success' ? 'bg-teal-50 text-teal-600' : log.level === 'warn' ? 'bg-amber-50 text-amber-600' : 'bg-gray-100 text-gray-500'
                                }`}>
                                  {log.level}
                                </span>
                                <span className="text-xs text-gray-700">{log.message}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </>
                    ) : null}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <AnimatePresence>
            {isDrawerOpen && selectedNode && (
              <motion.aside
                initial={{ x: drawerWidth, opacity: 0, width: 0 }}
                animate={{ x: 0, opacity: 1, width: drawerWidth }}
                exit={{ x: drawerWidth, opacity: 0, width: 0 }}
                transition={isResizing ? { duration: 0 } : { type: 'spring', damping: 25, stiffness: 200 }}
                className="bg-white border-l border-gray-200 flex flex-col overflow-visible shrink-0 relative"
                style={{ minWidth: 0 }}
              >
                {/* Resize Handle - Left Side */}
                <div 
                  onMouseDown={startResizing}
                  className={`absolute top-0 left-0 w-1 h-full cursor-col-resize z-50 transition-colors group ${isResizing ? 'bg-blue-500/20' : 'hover:bg-blue-500/10 hover:w-1.5'}`}
                >
                  <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1.5px] h-8 bg-gray-200 rounded-full transition-opacity ${isResizing ? 'opacity-100 bg-blue-500' : 'opacity-0 group-hover:opacity-100'}`} />
                </div>

                <div className="flex flex-col h-full bg-white relative overflow-hidden" style={{ width: drawerWidth }}>
                    <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-white sticky top-0 z-10 h-16">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg bg-gray-50 border border-gray-200 ${COMPONENT_METADATA[selectedNode.type].color}`}>
                          {COMPONENT_METADATA[selectedNode.type].icon}
                        </div>
                        <div>
                          <h3 className="font-bold text-gray-900 leading-none mb-1">Node Properties</h3>
                          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{selectedNode.type}</p>
                        </div>
                      </div>
                      <button onClick={() => setIsDrawerOpen(false)} className="p-2 hover:bg-gray-100 rounded-lg text-gray-500 transition-colors">
                        <X size={18} />
                      </button>
                    </div>

                    <div className="flex-1 overflow-y-auto p-6 space-y-10 custom-scrollbar bg-[#fcfdfe]">
                      <section className="space-y-4">
                        <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
                          <Settings2 size={14} className="text-gray-400" />
                          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Identification</span>
                        </div>
                        <div className="space-y-1.5">
                          <FormLabel>Display Name</FormLabel>
                          <input
                            type="text"
                            value={selectedNode.label}
                            onChange={(e) => updateNodeConfig(selectedNode.id, { label: e.target.value })}
                            className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-teal-100 focus:border-teal-400 transition-all"
                          />
                        </div>
                      </section>

                      {selectedNode.type === 'start' && (
                        <section className="space-y-6">
                          <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
                            <Layers size={14} className="text-gray-400" />
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Entry Context</span>
                          </div>
                          <div className="flex items-center justify-between p-1 bg-gray-100 rounded-xl mb-4">
                            <button onClick={() => updateNodeConfig(selectedNode.id, { inputMode: 'table' })} className={`flex-1 flex items-center justify-center gap-2 py-2 text-[10px] font-bold rounded-lg transition-all ${selectedNode.config?.inputMode === 'table' ? 'bg-white text-teal-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>Table Editor</button>
                            <button onClick={() => updateNodeConfig(selectedNode.id, { inputMode: 'json' })} className={`flex-1 flex items-center justify-center gap-2 py-2 text-[10px] font-bold rounded-lg transition-all ${selectedNode.config?.inputMode === 'json' ? 'bg-white text-teal-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>JSON Editor</button>
                          </div>
                          {selectedNode.config?.inputMode === 'json' ? (
                            <textarea rows={10} value={selectedNode.config?.rawJson || ''} onChange={(e) => updateNodeConfig(selectedNode.id, { rawJson: e.target.value })} className="w-full px-3 py-3 bg-[#1e293b] text-blue-300 border-none text-xs outline-none font-mono leading-relaxed rounded-xl"
                              placeholder={`{
  "data": {
    "key": "value"
  },
  "variables": {
    "key": "value"
  }
}`} />
                          ) : (
                            <div className="space-y-8">
                              <div><FormLabel>Variable Payload</FormLabel><PayloadTable items={selectedNode.config?.variables || []} onUpdate={(variables) => updateNodeConfig(selectedNode.id, { variables })} /></div>
                              <div><FormLabel>Data Payload</FormLabel><PayloadTable items={selectedNode.config?.data || []} onUpdate={(data) => updateNodeConfig(selectedNode.id, { data })} /></div>
                            </div>
                          )}
                        </section>
                      )}

                      {['sql', 'sql-query', 'dynamic-sql-query'].includes(selectedNode.type) && (
                        <section className="space-y-8 animate-in fade-in duration-300">
                          <div className="space-y-4">
                            <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                              <div className="flex items-center gap-2">
                                <Database size={14} className="text-violet-500" />
                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest text-violet-400">SQL Assistant</span>
                              </div>
                              <button
                                onClick={() => {
                                  setIsGlobalAiOpen(true);
                                  setGlobalAiChatMessage(`@${selectedNode.label} `);
                                }}
                                className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold transition-all border bg-teal-50 text-teal-600 border-teal-100 hover:bg-teal-100`}
                              >
                                <Sparkles size={10} />
                                Get Help with AI
                              </button>
                            </div>

                            <div className="relative group/editor rounded-xl overflow-hidden border border-gray-200 shadow-inner">
                              <div className="flex items-center justify-between px-3 py-2 bg-[#1e293b] border-b border-[#0f172a]/50">
                                <div className="flex gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-rose-400/30" /><div className="w-2.5 h-2.5 rounded-full bg-amber-400/30" /><div className="w-2.5 h-2.5 rounded-full bg-teal-400/30" /></div>
                                <span className="text-[9px] font-mono text-gray-500 uppercase tracking-widest font-bold">SQL Editor</span>
                              </div>
                              <textarea
                                rows={12}
                                value={selectedNode.config?.sqlQuery || ''}
                                onChange={(e) => updateNodeConfig(selectedNode.id, { sqlQuery: e.target.value })}
                                className="w-full px-4 py-4 bg-[#0f172a] text-[#ffd8a8] border-none text-[13px] outline-none font-mono leading-relaxed placeholder:text-gray-700"
                                placeholder="-- Write your SQL query here..."
                                spellCheck={false}
                              />
                              <div className="absolute bottom-3 right-3 opacity-30 pointer-events-none">
                                <Database size={40} className="text-gray-800" />
                              </div>
                            </div>
                          </div>

                          <div className="space-y-6 pt-6 border-t border-gray-100">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2"><ArrowRightLeft size={14} className="text-violet-500" /><span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Query Execution</span></div>
                              <button onClick={() => addEvent(selectedNode.id)} className="flex items-center gap-1.5 px-3 py-1.5 bg-violet-50 text-violet-600 rounded-lg text-[10px] font-bold hover:bg-violet-100 transition-all border border-violet-100"><Plus size={12} /> Add Trigger</button>
                            </div>
                          </div>
                        </section>
                      )}

                      {selectedNode.type === 'js-expression' && (
                        <section className="space-y-8 animate-in fade-in duration-300">
                          <div className="space-y-4">
                            <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                              <div className="flex items-center gap-2"><Code2 size={14} className="text-gray-400" /><span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Logic Expression</span></div>
                              <button
                                onClick={() => {
                                  setIsGlobalAiOpen(true);
                                  setGlobalAiChatMessage(`@${selectedNode.label} `);
                                }}
                                className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold transition-all border bg-teal-50 text-teal-600 border-teal-100 hover:bg-teal-100`}
                              >
                                <Sparkles size={10} />
                                Get Help with AI
                              </button>
                            </div>
                            <div className="relative group/editor rounded-xl overflow-hidden border border-gray-200 shadow-inner">
                              <div className="flex items-center justify-between px-3 py-2 bg-gray-50 border-b border-gray-100">
                                <div className="flex gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-rose-400/30" /><div className="w-2.5 h-2.5 rounded-full bg-amber-400/30" /><div className="w-2.5 h-2.5 rounded-full bg-teal-400/30" /></div>
                                <span className="text-[9px] font-mono text-gray-400">main.js</span>
                              </div>
                              <textarea rows={10} value={selectedNode.config?.expression || ''} onChange={(e) => updateNodeConfig(selectedNode.id, { expression: e.target.value })} className="w-full px-4 py-4 bg-[#0f172a] text-[#e2e8f0] border-none text-[13px] outline-none font-mono leading-relaxed" spellCheck={false} />
                            </div>
                          </div>

                          <div className="space-y-6 pt-6 border-t border-gray-100">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2"><ArrowRightLeft size={14} className="text-amber-500" /><span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Return Handlers</span></div>
                              <button onClick={() => addEvent(selectedNode.id)} className="flex items-center gap-1.5 px-3 py-1.5 bg-teal-50 text-teal-600 rounded-lg text-[10px] font-bold hover:bg-teal-100 transition-all border border-teal-100"><Plus size={12} /> Add Trigger</button>
                            </div>
                            <div className="space-y-4">
                              {selectedNode.events?.map((event, idx) => (
                                <div key={event.id} className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden group/card hover:border-blue-300 transition-all">
                                  <div className="px-4 py-2.5 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
                                    <span className="text-[10px] font-bold text-gray-500 flex items-center gap-2 uppercase tracking-tighter"><div className="w-2 h-2 rounded-full bg-teal-400" /> Handler #{idx + 1}</span>
                                    <button onClick={() => removeEvent(selectedNode.id, event.id)} className="text-gray-300 hover:text-rose-500 transition-colors"><Trash2 size={14} /></button>
                                  </div>
                                  <div className="p-4 space-y-4">
                                    <div><FormLabel>Action Type</FormLabel><select value={event.type} onChange={(e) => updateEvent(selectedNode.id, event.id, { type: e.target.value as EventType })} className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-xs outline-none focus:border-teal-400 cursor-pointer">{EVENT_TYPES.map(et => <option key={et.value} value={et.value}>{et.label}</option>)}</select></div>
                                    <div className="grid grid-cols-2 gap-3">
                                      <div><FormLabel>Value / WID</FormLabel><input type="text" placeholder="Value" value={event.value} onChange={(e) => updateEvent(selectedNode.id, event.id, { value: e.target.value })} className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-xs outline-none focus:border-teal-400" /></div>
                                      <div><FormLabel>Parameters</FormLabel><input type="text" placeholder="Params" value={event.params} onChange={(e) => updateEvent(selectedNode.id, event.id, { params: e.target.value })} className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-xs outline-none focus:border-teal-400" /></div>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </section>
                      )}
                    </div>

                    <div className="p-6 border-t border-gray-100 bg-white shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.03)] z-10 sticky bottom-0">
                      <button onClick={() => setIsDrawerOpen(false)} className="w-full py-3.5 bg-gray-900 text-white rounded-xl text-xs font-bold hover:bg-gray-800 active:scale-[0.98] transition-all flex items-center justify-center gap-2">
                        <Lock size={14} className="opacity-40" /> Apply Properties
                      </button>
                    </div>
                  </div>
              </motion.aside>
            )}
          </AnimatePresence>

          {/* Global AI Workflow Assistant */}
          <AIDrawer
            isOpen={isGlobalAiOpen}
            onClose={() => setIsGlobalAiOpen(false)}
            history={globalAiChatHistory}
            message={globalAiChatMessage}
            setMessage={setGlobalAiChatMessage}
            onSendMessage={(val) => {
              setGlobalAiChatHistory(prev => [...prev, { role: 'user', content: val }]);
              setGlobalAiChatMessage('');
              setTimeout(() => setGlobalAiChatHistory(prev => [...prev, { role: 'assistant', content: "I've analyzed your workflow request. To optimize performance, I suggest using the SQL node for large data joins." }]), 1000);
            }}
            mode={aiPanelMode}
            setMode={setAiPanelMode}
            dragPosition={aiPanelMode === 'floating' ? globalAiPosition : { x: 0, y: 0 }}
            onDragEnd={setGlobalAiPosition}
            floatingPosition={aiPanelMode === 'floating' ? "left-1/2 ml-[-155px] sm:ml-[-170px] md:ml-[-200px] top-1/2 mt-[-30vh] md:mt-[-325px] w-[310px] sm:w-[340px] md:w-[400px]" : undefined}
            title="Lumenore AI"
            status="Workflow Support active"
            constraintsRef={canvasRef}
            themeColor="teal"
            quickActions={[
              { label: 'Analyze Flow', icon: <LayoutGrid size={12} />, onClick: () => setGlobalAiChatMessage("Analyze this Flow"), color: 'sky' },
              { label: 'Suggest Nodes', icon: <Sparkles size={12} />, onClick: () => setGlobalAiChatMessage("Suggest Nodes"), color: 'violet' },
              { label: 'Check Links', icon: <Network size={12} />, onClick: () => setGlobalAiChatMessage("Check Connections"), color: 'emerald' },
            ]}
          />


        </div>

      </div>

      <Modal
        isOpen={isDeployModalOpen}
        onClose={() => setIsDeployModalOpen(false)}
        title="Deploy Workflow"
      >
        <div className="space-y-6">
          <div className="space-y-2">
            <FormLabel>Workflow Name</FormLabel>
            <input
              type="text"
              placeholder="e.g. Sales Onboarding"
              value={deployForm.name}
              onChange={(e) => setDeployForm({ ...deployForm, name: e.target.value })}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-teal-100 focus:border-teal-400 transition-all font-medium text-gray-700"
              autoFocus
            />
            {deployForm.name.trim() === '' && (
              <p className="text-[10px] text-amber-500 font-bold px-1 italic text-right">Providing a name is required before deployment</p>
            )}
          </div>

          <div className="space-y-2">
            <FormLabel>Workspace</FormLabel>
            <select
              value={deployForm.workspaceId}
              onChange={(e) => setDeployForm({ ...deployForm, workspaceId: e.target.value })}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-teal-100 focus:border-teal-400 transition-all font-medium text-gray-700 appearance-none cursor-pointer"
            >
              <option value="" disabled>Select a Workspace</option>
              {workspaces.map(ws => (
                <option key={ws.id} value={ws.id}>{ws.name}</option>
              ))}
            </select>
          </div>

          <div className="space-y-3">
            <FormLabel>Settings</FormLabel>
            <div className="space-y-3">
              <div
                className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100 group hover:border-teal-200 transition-all cursor-pointer"
                onClick={() => setDeployForm({ ...deployForm, isPublic: !deployForm.isPublic })}
              >
                <div className={`p-2 rounded-lg transition-all ${deployForm.isPublic ? 'bg-teal-600 text-white shadow-lg shadow-teal-100' : 'bg-white text-gray-400'}`}>
                  <Globe size={16} />
                </div>
                <div className="flex-1">
                  <p className="text-xs font-bold text-gray-800">Make Publicly Accessible</p>
                  <p className="text-[10px] text-gray-400">Available via public API endpoint</p>
                </div>
                <div className={`w-10 h-5 rounded-full transition-all relative ${deployForm.isPublic ? 'bg-teal-500' : 'bg-gray-200'}`}>
                  <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${deployForm.isPublic ? 'right-1' : 'left-1'}`} />
                </div>
              </div>

              <div
                className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100 group hover:border-blue-200 transition-all cursor-pointer"
                onClick={() => setDeployForm({ ...deployForm, saveResponse: !deployForm.saveResponse })}
              >
                <div className={`p-2 rounded-lg transition-all ${deployForm.saveResponse ? 'bg-blue-600 text-white shadow-lg shadow-blue-100' : 'bg-white text-gray-400'}`}>
                  <HardDrive size={16} />
                </div>
                <div className="flex-1">
                  <p className="text-xs font-bold text-gray-800">Save Workflow Response</p>
                  <p className="text-[10px] text-gray-400">Log all execution results</p>
                </div>
                <div className={`w-10 h-5 rounded-full transition-all relative ${deployForm.saveResponse ? 'bg-blue-500' : 'bg-gray-200'}`}>
                  <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${deployForm.saveResponse ? 'right-1' : 'left-1'}`} />
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-3 justify-end pt-4">
            <button
              onClick={() => setIsDeployModalOpen(false)}
              className="px-6 py-2.5 text-gray-500 text-xs font-bold hover:bg-gray-100 rounded-xl transition-all"
            >
              Cancel
            </button>
            <button
              disabled={!deployForm.name.trim()}
              onClick={handlePublish}
              className="px-8 py-2.5 bg-teal-600 text-white text-xs font-bold rounded-xl hover:bg-teal-700 transition-all shadow-lg shadow-teal-100 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Check size={14} /> Save & Deploy
            </button>
          </div>
        </div>
      </Modal>
      <GuidedTour
        isOpen={isTourOpen}
        onClose={() => setIsTourOpen(false)}
        steps={tourSteps}
      />
    </div>
  );
};

export default WorkflowBuilder;
