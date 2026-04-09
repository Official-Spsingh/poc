import { AlertTriangle, Copy, Edit2, MoreVertical, Play, Plus, Settings2, Sparkles, Trash2 } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import { COMPONENT_METADATA } from './constants';
import { NodeData, Position } from '../../../../types';
import { CombinedTheme } from '../../../constants/themeColors';
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
  onFixManually?: (id: string) => void;
  onRunNode?: (id: string) => void;
  theme: CombinedTheme;
}

const WorkflowNode: React.FC<WorkflowNodeProps> = ({ 
  node, isSelected, onDrag, onSelect, onDelete, onEdit, onClone, onStartConnection, onEndConnection, onFixWithAI, onFixManually, onRunNode, theme
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
        isSelected ? `${theme.builder.nodes.selectedBorder} shadow-lg ring-4 ${theme.builder.nodes.selectedRing}` : node.error ? `${theme.builder.nodes.errorBorder} shadow-md ring-2 ${theme.builder.nodes.errorRing}` : `border-gray-200 ${theme.builder.nodes.hoverBorder}`
      }`}
    >
      <div className="absolute top-2 right-2 flex items-center z-20">
        <ActionDropdown
          theme={theme}
          itemHoverClass={theme.homepage.card.menuHover}
          trigger={(isOpen) => (
            <button 
              className={`p-1 rounded-lg transition-all flex items-center justify-center ${
                isOpen
                  ? `${theme.homepage.tipsSection.iconBg} ${theme.homepage.tipsSection.iconText} opacity-100` 
                  : 'text-gray-400 hover:bg-gray-100 hover:text-gray-600 group-hover:opacity-100 opacity-0'
              }`}
            >
              <MoreVertical size={16} />
            </button>
          )}
          items={[
            { 
              label: 'Run Node', 
              icon: <Play size={14} fill="currentColor" />, 
              onClick: () => onRunNode?.(node.id) 
            },
            { divider: true },
            { 
              label: 'Clone Node', 
              icon: <Copy size={14} />, 
              onClick: () => onClone(node.id) 
            },
            { 
              label: 'Add Step', 
              icon: <Plus size={14} />, 
              onClick: () => {} 
            },
            { 
              label: 'Edit Properties', 
              icon: <Edit2 size={14} />, 
              onClick: () => onEdit() 
            },
            { divider: true },
            { 
              label: 'Delete Node', 
              icon: <Trash2 size={14} />, 
              onClick: () => onDelete(node.id),
              variant: 'danger'
            }
          ]}
        />
      </div>

      <div className={`p-1.5 rounded-lg mr-3 pointer-events-none ${node.error ? 'bg-rose-50 text-rose-500' : 'bg-gray-50 ' + meta.color}`}>
        {node.error ? <AlertTriangle size={18} /> : meta.icon}
      </div>
      <div className="flex-1 overflow-hidden pointer-events-none">
        <p className="text-xs font-semibold text-gray-800 truncate">{node.label}</p>
        <p className="text-[10px] text-gray-400 font-mono tracking-tight">ID: {node.id.split('-')[0]}</p>
      </div>
      
      {/* Handles */}
      <div className={`absolute -left-1.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 bg-gray-200 border-2 border-white rounded shadow-sm ${theme.builder.nodes.hoverBorder.replace('hover:', 'group-hover:')} transition-colors z-20 ${node.error ? `${theme.builder.nodes.errorBorder} ${theme.builder.nodes.errorRing}` : ''}`} />
      <div 
        onMouseDown={(e) => { e.stopPropagation(); onStartConnection(node.id, e); }}
        className={`absolute -right-1.5 top-1/2 -translate-y-1/2 w-4 h-4 bg-gray-200 border-2 border-white rounded shadow-sm transition-all cursor-crosshair z-20 ${node.error ? 'hover:bg-rose-500 hover:border-rose-500 border-rose-300 bg-rose-100' : theme.builder.nodes.handleHover}`}
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
                className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 ${theme.homepage.tipsSection.iconBg} ${theme.homepage.tipsSection.iconText} hover:${theme.homepage.emptyState.button.split(' ')[0]} hover:text-white rounded-lg text-[11px] font-bold transition-all shadow-sm hover:shadow-sky-200/50 whitespace-nowrap`}
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
