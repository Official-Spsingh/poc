import React from 'react';
import { Connection, ConnectionDrag, NodeData, NodeType, Position } from '../../../../types';
import { CombinedTheme } from '../../../constants/themeColors';
import ConnectionLine from './ConnectionLine';
import WorkflowNode from './WorkflowNode';

interface WorkflowBuilderCanvasProps {
  canvasRef: React.RefObject<HTMLDivElement>;
  connections: Connection[];
  draggedConnection: ConnectionDrag | null;
  nodes: NodeData[];
  selectedNodeId: string | null;
  isLocked: boolean;
  isDrawerOpen: boolean;
  setIsDrawerOpen: (isOpen: boolean) => void;
  setSelectedNodeId: (id: string | null) => void;
  setIsFlowsPopoverOpen: (isOpen: boolean) => void;
  setConnections: React.Dispatch<React.SetStateAction<Connection[]>>;
  getSourcePos: (id: string) => Position;
  getTargetPos: (id: string) => Position;
  updateNodePosition: (id: string, pos: Position) => void;
  deleteNode: (id: string) => void;
  cloneNode: (id: string) => void;
  handleStartConnection: (sourceId: string, e: React.MouseEvent) => void;
  handleEndConnection: (targetId: string) => void;
  handleRunNode: (nodeId: string) => void;
  setNodes: React.Dispatch<React.SetStateAction<NodeData[]>>;
  setIsGlobalAiOpen: (isOpen: boolean) => void;
  setGlobalAiChatMessage: (msg: string) => void;
  setGlobalAiChatHistory: React.Dispatch<React.SetStateAction<{ role: 'user' | 'assistant', content: string }[]>>;
  addNode: (type: NodeType, position?: Position) => void;
  isAiGenerated: boolean;
  setIsAiGenerated: (value: boolean) => void;
  theme: CombinedTheme;
  children?: React.ReactNode;
}

const WorkflowBuilderCanvas: React.FC<WorkflowBuilderCanvasProps> = ({
  canvasRef,
  connections,
  draggedConnection,
  nodes,
  selectedNodeId,
  isLocked,
  setIsDrawerOpen,
  setSelectedNodeId,
  setIsFlowsPopoverOpen,
  setConnections,
  getSourcePos,
  getTargetPos,
  updateNodePosition,
  deleteNode,
  cloneNode,
  handleStartConnection,
  handleEndConnection,
  handleRunNode,
  setNodes,
  setIsGlobalAiOpen,
  setGlobalAiChatMessage,
  setGlobalAiChatHistory,
  addNode,
  theme,
  children
}) => {
  return (
    <div
      ref={canvasRef}
      id="tour-canvas"
      className={`flex-1 relative min-w-0 overflow-hidden canvas-grid ${theme.builder.canvas.bg}`}
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
          addNode(type, { x: x - 90, y: y - 24 });
        }
      }}
      onMouseDown={() => {
        setSelectedNodeId(null);
        setIsDrawerOpen(false);
        setIsFlowsPopoverOpen(false);
      }}
      style={{
        backgroundImage: `radial-gradient(${theme.builder.canvas.grid} 1.5px, transparent 1.5px)`,
        backgroundSize: '30px 30px',
        backgroundColor: theme.builder.canvas.bg
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
            theme={theme}
          />
        ))}
      </div>
      {children}
    </div>
  );
};

export default WorkflowBuilderCanvas;
