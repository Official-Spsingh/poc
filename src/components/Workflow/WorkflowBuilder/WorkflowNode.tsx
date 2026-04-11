import { AlertTriangle, Copy, Edit2, MoreVertical, Play, Plus, Settings2, Sparkles, Trash2 } from 'lucide-react';
import React, { useRef, useState } from 'react';
import { COMPONENT_METADATA } from './constants';
import { NodeData, Position } from '../../../../types';
import ActionDropdown from '../../Common/ActionDropdown';

interface WorkflowNodeProps {
  node: NodeData;
  isSelected: boolean;
  onDrag: (id: string, pos: Position) => void;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: () => void;
  onClone: (id: string) => void;
  onStartConnection: (id: string, e: React.MouseEvent) => void;
  onEndConnection: (id: string) => void;
  onFixWithAI?: (id: string, error: string) => void;
  onFixManually?: (id: string) => void;
  onRunNode?: (id: string) => void;
}

const WorkflowNode: React.FC<WorkflowNodeProps> = ({
  node, isSelected, onDrag, onSelect, onDelete, onEdit, onClone, onStartConnection, onEndConnection, onFixWithAI, onFixManually, onRunNode
}) => {
  const meta = COMPONENT_METADATA[node.type];
  const [, setShowDropdown] = useState(false);
  const dragRef = useRef<{ startX: number; startY: number; nodeX: number; nodeY: number } | null>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSelect(node.id);
    dragRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      nodeX: node.position.x,
      nodeY: node.position.y
    };

    const handleMouseMove = (me: MouseEvent) => {
      if (!dragRef.current) return;
      const dx = me.clientX - dragRef.current.startX;
      const dy = me.clientY - dragRef.current.startY;
      onDrag(node.id, {
        x: dragRef.current.nodeX + dx,
        y: dragRef.current.nodeY + dy
      });
    };

    const handleMouseUp = (e: MouseEvent) => {
      const dx = Math.abs(e.clientX - dragRef.current!.startX);
      const dy = Math.abs(e.clientY - dragRef.current!.startY);

      if (dx < 5 && dy < 5) {
        setShowDropdown(true);
      }

      dragRef.current = null;
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };

  return (
    <div
      onMouseDown={handleMouseDown}
      onMouseUp={() => onEndConnection(node.id)}
      style={{ transform: `translate3d(${node.position.x}px, ${node.position.y}px, 0)` }}
      className={`absolute cursor-move select-none flex items-center bg-mod-surface-card rounded-xl border shadow-sm min-w-[180px] p-2 pr-3 group z-10 transition-all duration-75 ${
        isSelected
          ? 'border-mod-hero-icon-color shadow-lg ring-4 ring-mod-hero-badge-bg/50'
          : node.error
          ? 'border-rose-400 shadow-md ring-2 ring-rose-50'
          : 'border-mod-surface-border hover:border-mod-hero-icon-color/50'
      }`}
    >
      <div className="absolute top-2 right-2 flex items-center z-20">
        <ActionDropdown
          itemHoverClass="hover:bg-mod-hero-badge-bg hover:text-mod-hero-icon-color"
          trigger={(isOpen) => (
            <button
              className={`p-1 rounded-lg transition-all flex items-center justify-center ${
                isOpen
                  ? 'bg-mod-hero-badge-bg text-mod-hero-icon-color opacity-100'
                  : 'text-gray-400 hover:bg-gray-100 hover:text-gray-600 group-hover:opacity-100 opacity-0'
              }`}
            >
              <MoreVertical size={16} />
            </button>
          )}
          items={[
            { label: 'Run Node', icon: <Play size={14} fill="currentColor" />, onClick: () => onRunNode?.(node.id) },
            { divider: true, label: '', onClick: () => {} },
            { label: 'Clone Node', icon: <Copy size={14} />, onClick: () => onClone(node.id) },
            { label: 'Add Step', icon: <Plus size={14} />, onClick: () => {} },
            { label: 'Edit Properties', icon: <Edit2 size={14} />, onClick: () => onEdit() },
            { divider: true, label: '', onClick: () => {} },
            { label: 'Delete Node', icon: <Trash2 size={14} />, onClick: () => onDelete(node.id), variant: 'danger' }
          ]}
        />
      </div>

      <div className={`p-1.5 rounded-lg mr-3 pointer-events-none ${node.error ? 'bg-rose-50 text-rose-500' : 'bg-mod-surface-skeleton/50 ' + meta.color}`}>
        {node.error ? <AlertTriangle size={18} /> : meta.icon}
      </div>
      <div className="flex-1 overflow-hidden pointer-events-none">
        <p className="text-xs font-semibold text-mod-surface-text-primary truncate">{node.label}</p>
        <p className="text-[10px] text-mod-surface-text-muted font-mono tracking-tight">ID: {node.id.split('-')[0]}</p>
      </div>

      {/* Input handle */}
      <div className={`absolute -left-1.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 bg-mod-surface-skeleton border-2 border-mod-surface-card rounded shadow-sm group-hover:border-mod-hero-icon-color/50 transition-colors z-20 ${node.error ? 'border-rose-400' : ''}`} />
      {/* Output handle */}
      <div
        onMouseDown={(e) => { e.stopPropagation(); onStartConnection(node.id, e); }}
        className={`absolute -right-1.5 top-1/2 -translate-y-1/2 w-4 h-4 bg-mod-surface-skeleton border-2 border-mod-surface-card rounded shadow-sm transition-all cursor-crosshair z-20 ${node.error ? 'hover:bg-rose-500 hover:border-rose-500 border-rose-300 bg-rose-100' : 'hover:bg-mod-hero-icon-color hover:border-mod-hero-icon-color'}`}
      />

      {/* Error Overlay */}
      {node.error && (
        <div
          className="absolute top-full left-0 mt-3 w-72 bg-mod-surface-card border border-rose-200 rounded-xl shadow-xl z-50 p-3 flex flex-col gap-2.5 cursor-default"
          onMouseDown={(e) => e.stopPropagation()}
        >
          <div className="flex items-start gap-2">
            <AlertTriangle size={14} className="text-rose-500 shrink-0 mt-0.5" />
            <p className="text-xs text-rose-700 font-medium leading-relaxed tracking-wide">{node.error}</p>
          </div>
          <div className="flex gap-2 mt-1">
            {onFixWithAI && (
              <button
                onClick={(e) => { e.stopPropagation(); onFixWithAI(node.id, node.error!); }}
                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-mod-hero-badge-bg text-mod-hero-icon-color hover:bg-mod-hero-btn-bg hover:text-white rounded-lg text-[11px] font-bold transition-all shadow-sm whitespace-nowrap"
              >
                <Sparkles size={14} /> AI Fix
              </button>
            )}
            {onFixManually && (
              <button
                onClick={(e) => { e.stopPropagation(); onFixManually(node.id); }}
                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-gray-50 text-gray-700 hover:bg-gray-200 rounded-lg text-[11px] font-bold transition-all border border-gray-200 shadow-sm whitespace-nowrap"
              >
                <Settings2 size={14} /> Fix Manually
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkflowNode;
