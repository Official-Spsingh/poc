import { LayoutGrid, Network, Sparkles } from 'lucide-react';
import React, { useState } from 'react';
import {
  Connection,
  ConnectionDrag,
  EventConfig,
  NodeData,
  NodeType,
  Position,
  ViewType,
  Workflow,
  Workspace
} from '../../../../types';
import AIDrawer from '../../Common/AIDrawer';
import GuidedTour from '../../Common/GuidedTour';
import { useResizableDrawer } from './hooks/useResizableDrawer';
import { useWorkflowExecution } from './hooks/useWorkflowExecution';
import WorkflowBuilderCanvas from './WorkflowBuilderCanvas';
import WorkflowBuilderCommandCenter from './WorkflowBuilderCommandCenter';
import WorkflowBuilderDeployModal from './WorkflowBuilderDeployModal';
import WorkflowBuilderHeader from './WorkflowBuilderHeader';
import WorkflowBuilderNodePropertiesDrawer from './WorkflowBuilderNodePropertiesDrawer';
import WorkflowBuilderNodesDrawer from './WorkflowBuilderNodesDrawer';
import WorkflowBuilderRunPanel from './WorkflowBuilderRunPanel';
import WorkflowBuilderZoomControls from './WorkflowBuilderZoomControls';
import { tourSteps } from './WorkflowTourSteps';

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

  const [isVersionsPopoverOpen, setIsVersionsPopoverOpen] = React.useState(false);
  const [selectedVersion, setSelectedVersion] = React.useState('v1.0.0 (Live)');
  const [revertToast, setRevertToast] = React.useState('');

  React.useEffect(() => {
    // Version history click-outside logic is handled in the popover or header if needed, 
    // but the actions menu click-outside is now inside ActionDropdown.
  }, []);

  const [isGlobalAiOpen, setIsGlobalAiOpen] = React.useState(false);
  const [globalAiChatMessage, setGlobalAiChatMessage] = React.useState('');
  const [globalAiChatHistory, setGlobalAiChatHistory] = React.useState<{ role: 'user' | 'assistant', content: string }[]>([]);
  const [aiPanelMode, setAiPanelMode] = React.useState<'dock-right' | 'dock-left' | 'floating'>('dock-right');
  const [globalAiPosition, setGlobalAiPosition] = React.useState({ x: 0, y: 0 });

  // UI State
  const [isLocked, setIsLocked] = React.useState(false);
  const [zoom, setZoom] = React.useState(100);

  const {
    drawerWidth,
    isResizing,
    startResizing
  } = useResizableDrawer(440);

  const {
    isNodeRunPanelOpen,
    setIsNodeRunPanelOpen,
    nodeRunActiveTab,
    setNodeRunActiveTab,
    nodeRunNodeId,
    setNodeRunNodeId,
    isNodeRunning,
    nodeRunResult,
    handleRunNode,
    runningNode
  } = useWorkflowExecution(nodes, setNodes);

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
  }, [isAiGenerated, setIsAiGenerated]);

  // Guided Tour State
  const [isTourOpen, setIsTourOpen] = useState(false);

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
  };

  return (
    <div className="flex h-full w-full overflow-hidden bg-mod-surface-bg">
      <div className="flex-1 flex flex-col overflow-hidden">
        <WorkflowBuilderHeader
          workflows={workflows}
          activeWorkflowId={activeWorkflowId}
          setActiveWorkflowId={setActiveWorkflowId}
          workspaces={workspaces}
          setView={setView}
          isFlowsPopoverOpen={isFlowsPopoverOpen}
          setIsFlowsPopoverOpen={setIsFlowsPopoverOpen}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          deleteWorkflow={deleteWorkflow}
          selectedVersion={selectedVersion}
          setSelectedVersion={setSelectedVersion}
          revertToast={revertToast}
          setRevertToast={setRevertToast}
          isVersionsPopoverOpen={isVersionsPopoverOpen}
          setIsVersionsPopoverOpen={setIsVersionsPopoverOpen}
          isRunning={isRunning}
          setIsRunning={setIsRunning}
          setIsDeployModalOpen={setIsDeployModalOpen}
          setNodes={setNodes}
          setConnections={setConnections}
        />

        <div className="flex-1 flex overflow-hidden">
          <WorkflowBuilderNodesDrawer
            isComponentSidebarOpen={isComponentSidebarOpen}
            setIsComponentSidebarOpen={setIsComponentSidebarOpen}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            addNode={addNode}
          />

          <WorkflowBuilderCanvas
            canvasRef={canvasRef}
            connections={connections}
            draggedConnection={draggedConnection}
            nodes={nodes}
            selectedNodeId={selectedNodeId}
            isLocked={isLocked}
            setIsDrawerOpen={setIsDrawerOpen}
            setSelectedNodeId={setSelectedNodeId}
            setIsFlowsPopoverOpen={setIsFlowsPopoverOpen}
            setConnections={setConnections}
            getSourcePos={getSourcePos}
            getTargetPos={getTargetPos}
            updateNodePosition={updateNodePosition}
            deleteNode={deleteNode}
            cloneNode={cloneNode}
            handleStartConnection={handleStartConnection}
            handleEndConnection={handleEndConnection}
            handleRunNode={handleRunNode}
            setNodes={setNodes}
            setIsGlobalAiOpen={setIsGlobalAiOpen}
            setGlobalAiChatMessage={setGlobalAiChatMessage}
            setGlobalAiChatHistory={setGlobalAiChatHistory}
            addNode={addNode}
            isDrawerOpen={isDrawerOpen}
            isAiGenerated={isAiGenerated}
            setIsAiGenerated={setIsAiGenerated}
          >
            <WorkflowBuilderCommandCenter
              isNodeRunPanelOpen={isNodeRunPanelOpen}
              isLocked={isLocked}
              setIsLocked={setIsLocked}
              isComponentSidebarOpen={isComponentSidebarOpen}
              setIsComponentSidebarOpen={setIsComponentSidebarOpen}
              isGlobalAiOpen={isGlobalAiOpen}
              setIsGlobalAiOpen={setIsGlobalAiOpen}
              setIsDrawerOpen={setIsDrawerOpen}
              setIsTourOpen={setIsTourOpen}
            />

            <WorkflowBuilderZoomControls
              isNodeRunPanelOpen={isNodeRunPanelOpen}
              zoom={zoom}
              setZoom={setZoom}
            />

            <WorkflowBuilderRunPanel
              isNodeRunPanelOpen={isNodeRunPanelOpen}
              setIsNodeRunPanelOpen={setIsNodeRunPanelOpen}
              isNodeRunning={isNodeRunning}
              runningNode={runningNode || undefined}
              nodeRunNodeId={nodeRunNodeId}
              nodeRunActiveTab={nodeRunActiveTab}
              setNodeRunActiveTab={setNodeRunActiveTab}
              nodeRunResult={nodeRunResult}
            />
          </WorkflowBuilderCanvas>

          <WorkflowBuilderNodePropertiesDrawer
            isDrawerOpen={isDrawerOpen}
            setIsDrawerOpen={setIsDrawerOpen}
            selectedNode={selectedNode}
            drawerWidth={drawerWidth}
            isResizing={isResizing}
            startResizing={startResizing}
            updateNodeConfig={updateNodeConfig}
            setIsGlobalAiOpen={setIsGlobalAiOpen}
            setGlobalAiChatMessage={setGlobalAiChatMessage}
            addEvent={addEvent}
            updateEvent={updateEvent}
            removeEvent={removeEvent}
          />

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
            themeColor="violet"
            quickActions={[
              { label: 'Analyze Flow', icon: <LayoutGrid size={12} />, onClick: () => setGlobalAiChatMessage("Analyze this Flow"), color: 'sky' },
              { label: 'Suggest Nodes', icon: <Sparkles size={12} />, onClick: () => setGlobalAiChatMessage("Suggest Nodes"), color: 'violet' },
              { label: 'Check Links', icon: <Network size={12} />, onClick: () => setGlobalAiChatMessage("Check Connections"), color: 'emerald' },
            ]}
          />
        </div>
      </div>

      <WorkflowBuilderDeployModal
        isOpen={isDeployModalOpen}
        onClose={() => setIsDeployModalOpen(false)}
        activeWorkflow={activeWorkflow}
        workspaces={workspaces}
        deployForm={deployForm}
        setDeployForm={setDeployForm}
        onPublish={handlePublish}
      />
      <GuidedTour
        isOpen={isTourOpen}
        onClose={() => setIsTourOpen(false)}
        steps={tourSteps}
      />
    </div>
  );
};

export default WorkflowBuilder;
