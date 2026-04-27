import React, { useCallback, useRef, useState } from 'react';
import { COMPONENT_METADATA } from '../components/Workflow/WorkflowBuilder/constants';
import WorkflowBuilder from '../components/Workflow/WorkflowBuilder/index';
import WorkflowHome from '../components/Workflow/WorkflowHome';
import {
  type Connection,
  type ConnectionDrag,
  type EventConfig,
  type NodeData,
  type NodeType,
  type Position,
  type ViewType,
  type Workflow,
  type Workspace,
} from '../types';

interface WorkflowContainerProps {
  view: ViewType;
  setView: (view: ViewType) => void;
}

const INITIAL_NODES: NodeData[] = [
  { id: 'start-1', type: 'start', label: 'Start Flow', position: { x: 100, y: 150 }, config: { variables: [], data: [], inputMode: 'table' } },
  { id: 'js-1', type: 'js-expression', label: 'Logic Gate', position: { x: 400, y: 150 }, events: [], config: { expression: "// Example: return { status: 'success' };\nreturn true;" } },
  { id: 'stop-1', type: 'stop', label: 'Finish', position: { x: 700, y: 150 }, config: {} },
];

const INITIAL_CONNECTIONS: Connection[] = [
  { id: 'c1', sourceId: 'start-1', targetId: 'js-1' },
  { id: 'c2', sourceId: 'js-1', targetId: 'stop-1' },
];

const WorkflowContainer: React.FC<WorkflowContainerProps> = ({ view, setView }) => {
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [activeWorkflowId, setActiveWorkflowId] = useState<string | null>(null);
  const [nodes, setNodes] = useState<NodeData[]>(INITIAL_NODES);
  const [connections, setConnections] = useState<Connection[]>(INITIAL_CONNECTIONS);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [draggedConnection, setDraggedConnection] = useState<ConnectionDrag | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isFlowsPopoverOpen, setIsFlowsPopoverOpen] = useState(false);
  const [isComponentSidebarOpen, setIsComponentSidebarOpen] = useState(false);
  const [isAiGenerated, setIsAiGenerated] = useState(false);

  const canvasRef = useRef<HTMLDivElement>(null);

  const addNode = (type: NodeType, position?: Position) => {
    const newNode: NodeData = {
      id: `${type}-${Date.now()}`,
      type,
      label: COMPONENT_METADATA[type].label,
      position: position || { x: 150, y: 150 },
      events: type === 'js-expression' ? [] : undefined,
      config: type === 'start'
        ? { variables: [], data: [], inputMode: 'table' }
        : (type === 'js-expression' ? { expression: "// Logic goes here\nreturn true;" } : {}),
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
      position: { x: original.position.x + 40, y: original.position.y + 40 },
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

  const handleStartConnection = (sourceId: string, _e: React.MouseEvent) => {
    const startPos = getSourcePos(sourceId);
    setDraggedConnection({ sourceId, startX: startPos.x, startY: startPos.y, currentX: startPos.x, currentY: startPos.y });

    const handleMouseMove = (me: MouseEvent) => {
      if (!canvasRef.current) return;
      const rect = canvasRef.current.getBoundingClientRect();
      setDraggedConnection(prev => prev ? { ...prev, currentX: me.clientX - rect.left, currentY: me.clientY - rect.top } : null);
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
        setConnections(prev => [...prev, { id: `c-${Date.now()}`, sourceId: draggedConnection.sourceId, targetId }]);
      }
    }
    setDraggedConnection(null);
  };

  const addEvent = (nodeId: string) => {
    setNodes(prev => prev.map(node => {
      if (node.id !== nodeId) return node;
      const newEvent: EventConfig = { id: `event-${Date.now()}`, type: 'call', value: '', params: '' };
      return { ...node, events: [...(node.events || []), newEvent] };
    }));
  };

  const updateEvent = (nodeId: string, eventId: string, updates: Partial<EventConfig>) => {
    setNodes(prev => prev.map(node => {
      if (node.id !== nodeId) return node;
      return { ...node, events: node.events?.map(e => e.id === eventId ? { ...e, ...updates } : e) };
    }));
  };

  const removeEvent = (nodeId: string, eventId: string) => {
    setNodes(prev => prev.map(node => {
      if (node.id !== nodeId) return node;
      return { ...node, events: node.events?.filter(e => e.id !== eventId) };
    }));
  };

  if (view === 'workflow-home') {
    return (
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
        setView={setView}
        setNodes={setNodes}
        setConnections={setConnections}
        setIsAiGenerated={setIsAiGenerated}
      />
    );
  }

  if (view === 'workflow-builder') {
    return (
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
        setView={setView}
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
    );
  }

  return null;
};

export default WorkflowContainer;
