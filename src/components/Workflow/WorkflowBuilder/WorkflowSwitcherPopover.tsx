import { motion } from 'framer-motion';
import { Search } from 'lucide-react';
import React from 'react';
import { Workflow, Workspace } from '../../../../types';
import WorkflowSidebarItem from './WorkflowSidebarItem';
import { CombinedTheme } from '../../../constants/themeColors';

interface WorkflowSwitcherPopoverProps {
  workflows: Workflow[];
  workspaces: Workspace[];
  activeWorkflowId: string | null;
  setActiveWorkflowId: (id: string | null) => void;
  setIsFlowsPopoverOpen: (isOpen: boolean) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  deleteWorkflow: (id: string) => void;
  theme: CombinedTheme;
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
  theme
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
              className={`w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-xs outline-none focus:bg-white ${theme.builder.drawers.inputFocus} transition-all`}
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
                  theme={theme}
                />
              ))}
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default WorkflowSwitcherPopover;
