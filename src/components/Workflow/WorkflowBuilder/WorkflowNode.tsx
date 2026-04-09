import { AlertTriangle, Copy, Edit2, MoreVertical, Play, Plus, Settings2, Sparkles, Trash2 } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import { COMPONENT_METADATA } from '../../../../constants';
import { NodeData, Position } from '../../../../types';

interface NodeActionsDropdownProps {
  onEdit: () => void;
  onDelete: () => void;
  onClone: () => void;
  onRun: () => void;
  onClose: () => void;
}

const NodeActionsDropdown: React.FC<NodeActionsDropdownProps> = ({ 
  onEdit, onDelete, onClone, onRun, onClose 
}) => {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  return (
    <div 
      ref={menuRef}
      className="absolute top-0 right-0 mt-10 w-48 bg-white rounded-xl shadow-2xl border border-gray-100 py-2 z-[100] overflow-hidden animate-in fade-in slide-in-from-top-2"
      onMouseDown={(e) => e.stopPropagation()}
    >
      <button 
        onClick={() => { onRun(); onClose(); }} 
        className="w-full px-4 py-2.5 text-left text-xs text-teal-600 hover:bg-teal-50 flex items-center gap-3 transition-colors font-bold"
      >
        <Play size={14} fill="currentColor" /> Run Node
      </button>
      <div className="h-px bg-gray-100 my-1" />
      <button 
        onClick={() => { onClone(); onClose(); }} 
        className="w-full px-4 py-2.5 text-left text-xs text-gray-600 hover:bg-gray-50 flex items-center gap-3 transition-colors"
      >
        <Copy size={14} className="text-gray-400" /> Clone Node
      </button>
      <button 
        onClick={() => { onClose(); }} 
        className="w-full px-4 py-2.5 text-left text-xs text-gray-600 hover:bg-gray-50 flex items-center gap-3 transition-colors"
      >
        <Plus size={14} className="text-gray-400" /> Add Step
      </button>
      <button 
        onClick={() => { onEdit(); onClose(); }} 
        className="w-full px-4 py-2.5 text-left text-xs text-gray-700 hover:bg-gray-50 flex items-center gap-3 transition-colors font-medium"
      >
        <Edit2 size={14} className="text-gray-400" /> Edit Properties
      </button>
      <div className="h-px bg-gray-100 my-1" />
      <button 
        onClick={() => { onDelete(); onClose(); }} 
        className="w-full px-4 py-2.5 text-left text-xs text-rose-500 hover:bg-rose-50 font-semibold flex items-center gap-3 transition-colors"
      >
        <Trash2 size={14} /> Delete Node
      </button>
    </div>
  );
};

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
  const [showDropdown, setShowDropdown] = useState(false);
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
      
      // If it was just a click (no significant drag), show the dropdown
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
      className={`absolute cursor-move select-none flex items-center bg-white rounded-xl border shadow-sm min-w-[180px] p-2 pr-3 group z-10 transition-all duration-75 ${
        isSelected ? 'border-teal-500 shadow-lg ring-4 ring-teal-50/50' : node.error ? 'border-rose-400 shadow-md ring-2 ring-rose-50' : 'border-gray-200 hover:border-teal-300'
      }`}
    >
      <div className="absolute top-2 right-2 flex items-center z-20">
        <button 
          onClick={(e) => { 
            e.stopPropagation(); 
            setShowDropdown(!showDropdown); 
          }}
          className={`p-1 rounded-lg transition-all opacity-0 group-hover:opacity-100 ${showDropdown ? 'bg-teal-100 text-teal-600 opacity-100' : 'text-gray-400 hover:bg-gray-100 hover:text-gray-600'}`}
        >
          <MoreVertical size={16} />
        </button>
        
        {showDropdown && (
          <NodeActionsDropdown 
            onEdit={onEdit}
            onDelete={() => onDelete(node.id)}
            onClone={() => onClone(node.id)}
            onRun={() => onRunNode?.(node.id)}
            onClose={() => setShowDropdown(false)}
          />
        )}
      </div>

      <div className={`p-1.5 rounded-lg mr-3 pointer-events-none ${node.error ? 'bg-rose-50 text-rose-500' : 'bg-gray-50 ' + meta.color}`}>
        {node.error ? <AlertTriangle size={18} /> : meta.icon}
      </div>
      <div className="flex-1 overflow-hidden pointer-events-none">
        <p className="text-xs font-semibold text-gray-800 truncate">{node.label}</p>
        <p className="text-[10px] text-gray-400 font-mono tracking-tight">ID: {node.id.split('-')[0]}</p>
      </div>
      
      {/* Handles */}
      <div className={`absolute -left-1.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 bg-gray-200 border-2 border-white rounded shadow-sm group-hover:border-teal-400 transition-colors z-20 ${node.error ? 'border-rose-300 bg-rose-100' : ''}`} />
      <div 
        onMouseDown={(e) => { e.stopPropagation(); onStartConnection(node.id, e); }}
        className={`absolute -right-1.5 top-1/2 -translate-y-1/2 w-4 h-4 bg-gray-200 border-2 border-white rounded shadow-sm transition-all cursor-crosshair z-20 ${node.error ? 'hover:bg-rose-500 hover:border-rose-500 border-rose-300 bg-rose-100' : 'hover:bg-teal-500 hover:border-teal-500'}`}
      />

      {/* Error Overlay */}
      {node.error && (
        <div 
          className="absolute top-full left-0 mt-3 w-72 bg-white border border-rose-200 rounded-xl shadow-xl z-50 p-3 flex flex-col gap-2.5 cursor-default"
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
                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-violet-50 text-violet-700 hover:bg-violet-600 hover:text-white rounded-lg text-[11px] font-bold transition-all shadow-sm hover:shadow-violet-200/50 whitespace-nowrap"
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
