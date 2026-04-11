import { Copy, Edit2, Globe, HardDrive, Info, Link2, MoreVertical, Settings2, Trash2, Workflow as WorkflowIcon } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import { Workflow } from '../../../../types';

interface WorkflowSidebarItemProps {
  workflow: Workflow;
  isActive: boolean;
  onEdit: (w: Workflow) => void;
  onSettings: (w: Workflow) => void;
  onDelete: (id: string) => void;
  onViewInfo: (w: Workflow) => void;
  onDuplicate: (w: Workflow) => void;
  onViewLineage: (w: Workflow) => void;
  hideActions?: boolean;
  workspaceName?: string;
}

const WorkflowSidebarItem: React.FC<WorkflowSidebarItemProps> = ({
  workflow, isActive, onEdit, onSettings, onDelete, onViewInfo, onDuplicate, onViewLineage, hideActions, workspaceName
}) => {
  const [showActions, setShowActions] = useState(false);
  const actionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (actionRef.current && !actionRef.current.contains(event.target as Node)) {
        setShowActions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={`group relative flex items-center p-3 rounded-xl border transition-all cursor-pointer ${isActive ? 'bg-mod-hero-badge-bg border-mod-hero-icon-color/20 shadow-sm' : 'bg-mod-surface-card border-mod-surface-border hover:border-mod-surface-border-strong hover:shadow-sm'}`} onClick={() => onEdit(workflow)}>
      <div className={`p-2 rounded-lg mr-3 ${isActive ? 'bg-mod-hero-btn-bg text-white' : 'bg-mod-surface-skeleton text-mod-surface-text-muted group-hover:bg-mod-surface-skeleton group-hover:text-mod-surface-text-secondary'}`}>
        <WorkflowIcon size={16} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <p className="text-xs font-bold text-mod-surface-text-primary truncate">{workflow.name}</p>
          {workspaceName && (
            <span className="text-[9px] px-1.5 py-0.5 bg-mod-surface-skeleton text-mod-surface-text-muted rounded-md font-bold uppercase tracking-tighter">
              {workspaceName}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <p className="text-[10px] text-mod-surface-text-muted font-mono truncate">{workflow.id}</p>
          <div className="flex gap-1.5 ml-auto opacity-60">
            {workflow.isPublic && (
              <span title="Public Flow">
                <Globe size={11} className="text-teal-500" />
              </span>
            )}
            {workflow.saveResponse && (
              <span title="Saves Response">
                <HardDrive size={11} className="text-blue-500" />
              </span>
            )}
          </div>
        </div>
      </div>

      {!hideActions && (
        <div className="relative" ref={actionRef} onClick={(e) => e.stopPropagation()}>
          <button
            onClick={() => setShowActions(!showActions)}
            className={`p-1.5 rounded-lg transition-all ${showActions ? 'bg-gray-100 text-gray-600 opacity-100' : 'opacity-0 group-hover:opacity-100 text-gray-400 hover:bg-gray-100'}`}
          >
            <MoreVertical size={14} />
          </button>

          {showActions && (
            <div className="absolute top-full right-0 mt-1 w-44 bg-mod-surface-card border border-mod-surface-border rounded-xl shadow-xl z-50 py-1 overflow-hidden animate-in fade-in slide-in-from-top-1 duration-200">
              <button onClick={() => { onEdit(workflow); setShowActions(false); }} className="w-full px-3 py-2 text-left text-[11px] font-medium text-mod-surface-text-secondary hover:bg-mod-surface-hover flex items-center gap-2">
                <Edit2 size={12} /> Edit Nodes
              </button>
              <button onClick={() => { onDuplicate(workflow); setShowActions(false); }} className="w-full px-3 py-2 text-left text-[11px] font-medium text-mod-surface-text-secondary hover:bg-mod-surface-hover flex items-center gap-2">
                <Copy size={12} /> Duplicate
              </button>
              <button onClick={() => { onViewLineage(workflow); setShowActions(false); }} className="w-full px-3 py-2 text-left text-[11px] font-medium text-mod-surface-text-secondary hover:bg-mod-surface-hover flex items-center gap-2">
                <Link2 size={12} /> Show Lineage
              </button>
              <button onClick={() => { onSettings(workflow); setShowActions(false); }} className="w-full px-3 py-2 text-left text-[11px] font-medium text-mod-surface-text-secondary hover:bg-mod-surface-hover flex items-center gap-2">
                <Settings2 size={12} /> Settings
              </button>
              <button onClick={() => { onViewInfo(workflow); setShowActions(false); }} className="w-full px-3 py-2 text-left text-[11px] font-medium text-mod-surface-text-secondary hover:bg-mod-surface-hover flex items-center gap-2">
                <Info size={12} /> View Info
              </button>
              <div className="h-px bg-mod-surface-border my-1" />
              <button onClick={() => { onDelete(workflow.id); setShowActions(false); }} className="w-full px-3 py-2 text-left text-[11px] font-bold text-rose-500 hover:bg-rose-500/10 flex items-center gap-2">
                <Trash2 size={12} /> Delete
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default WorkflowSidebarItem;
