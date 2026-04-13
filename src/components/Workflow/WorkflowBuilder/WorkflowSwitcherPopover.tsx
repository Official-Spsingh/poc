import { motion } from 'framer-motion';
import { Search } from 'lucide-react';
import React from 'react';
import { Workflow, Workspace } from '../../../types';
import WorkflowSidebarItem from './WorkflowSidebarItem';

interface WorkflowSwitcherPopoverProps {
  workflows: Workflow[];
  workspaces: Workspace[];
  activeWorkflowId: string | null;
  setActiveWorkflowId: (id: string | null) => void;
  setIsFlowsPopoverOpen: (isOpen: boolean) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  deleteWorkflow: (id: string) => void;
}

const WorkflowSwitcherPopover: React.FC<WorkflowSwitcherPopoverProps> = ({
  workflows,
  workspaces,
  activeWorkflowId,
  setActiveWorkflowId,
  setIsFlowsPopoverOpen,
  searchQuery,
  setSearchQuery,
  deleteWorkflow,
}) => {
  return (
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
        className="absolute top-full left-0 mt-2 w-96 bg-mod-surface-card border border-mod-surface-border rounded-2xl shadow-2xl z-[10001] overflow-hidden"
      >
        <div className="p-4 border-b border-mod-surface-border bg-mod-surface-skeleton/20 flex items-center justify-between">
          <h3 className="text-[10px] font-bold text-mod-surface-text-muted uppercase tracking-widest">Switch Workflow</h3>
        </div>
        <div className="p-3">
          <div className="relative mb-3">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-mod-surface-text-muted" size={14} />
            <input
              type="text"
              placeholder="Search flows..."
              className="w-full pl-9 pr-4 py-2.5 bg-mod-surface-input-bg border border-mod-surface-input-border rounded-xl text-xs text-mod-surface-text-primary outline-none focus:ring-2 focus:ring-mod-hero-badge-bg focus:border-mod-hero-icon-color transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="space-y-1 max-h-[400px] overflow-y-auto scrollbar-custom pr-1">
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
  );
};

export default WorkflowSwitcherPopover;
