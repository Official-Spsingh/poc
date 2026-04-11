import { AnimatePresence, motion } from 'framer-motion';
import {
  Activity,
  ArrowLeft,
  Calendar,
  ChevronDown,
  Copy,
  History,
  Info,
  Link2,
  MoreVertical,
  Play,
  Rocket,
  Settings2,
  Trash2,
  Workflow as WorkflowIcon
} from 'lucide-react';
import React from 'react';
import { Connection, NodeData, ViewType, Workflow, Workspace } from '../../../types';
import ActionDropdown from '../../Common/ActionDropdown';
import VersionHistoryPopover from './VersionHistoryPopover';
import WorkflowSwitcherPopover from './WorkflowSwitcherPopover';

interface WorkflowBuilderHeaderProps {
  workflows: Workflow[];
  activeWorkflowId: string | null;
  setActiveWorkflowId: (id: string | null) => void;
  workspaces: Workspace[];
  setView: (view: ViewType) => void;
  isFlowsPopoverOpen: boolean;
  setIsFlowsPopoverOpen: (isOpen: boolean) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  deleteWorkflow: (id: string) => void;
  selectedVersion: string;
  setSelectedVersion: (version: string) => void;
  revertToast: string;
  setRevertToast: (toast: string) => void;
  isVersionsPopoverOpen: boolean;
  setIsVersionsPopoverOpen: (isOpen: boolean) => void;
  isRunning: boolean;
  setIsRunning: (isRunning: boolean) => void;
  setIsDeployModalOpen: (isOpen: boolean) => void;
  setNodes: React.Dispatch<React.SetStateAction<NodeData[]>>;
  setConnections: React.Dispatch<React.SetStateAction<Connection[]>>;
}

const WorkflowBuilderHeader: React.FC<WorkflowBuilderHeaderProps> = ({
  workflows,
  activeWorkflowId,
  setActiveWorkflowId,
  workspaces,
  setView,
  isFlowsPopoverOpen,
  setIsFlowsPopoverOpen,
  searchQuery,
  setSearchQuery,
  deleteWorkflow,
  selectedVersion,
  setSelectedVersion,
  revertToast,
  setRevertToast,
  isVersionsPopoverOpen,
  setIsVersionsPopoverOpen,
  isRunning,
  setIsRunning,
  setIsDeployModalOpen,
  setNodes,
  setConnections,
}) => {
  const mockVersions = [
    { id: 'v1.0.0', label: 'v1.0.0 (Live)', date: 'Today, 10:45 AM' },
    { id: 'v0.9.5', label: 'v0.9.5', date: 'Yesterday, 2:30 PM' },
    { id: 'v0.9.0', label: 'v0.9.0', date: 'Oct 24, 11:15 AM' },
    { id: 'v0.8.0', label: 'v0.8.0', date: 'Oct 20, 09:00 AM' },
  ];

  return (
    <header className="h-16 bg-mod-surface-card border-b border-mod-surface-border pr-6 flex items-center justify-between z-[10000] shrink-0">
      <div className="flex items-center w-64 shrink-0 overflow-hidden pl-6 pr-4 border-r border-mod-surface-border h-full">
        <button
          onClick={() => setView('workflow-home')}
          className="flex items-center gap-2 px-3 py-2 hover:bg-mod-surface-hover rounded-xl text-mod-surface-text-muted transition-all group shrink-0"
          title="Back to Workflows"
        >
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-bold text-mod-surface-text-primary">Workflows</span>
        </button>
      </div>

      <div className="flex-1 flex items-center gap-2 pl-4">
        <div className="relative" id="tour-selector">
          <button
            onClick={() => setIsFlowsPopoverOpen(!isFlowsPopoverOpen)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all border ${
              isFlowsPopoverOpen
                ? 'bg-mod-hero-badge-bg border-mod-hero-icon-color/20 text-mod-hero-badge-text shadow-sm'
                : 'bg-mod-surface-card border-transparent text-mod-surface-text-secondary hover:bg-mod-surface-hover'
            }`}
          >
            <div className={`p-1.5 rounded-md transition-all ${isFlowsPopoverOpen ? 'bg-mod-hero-btn-bg text-white' : 'bg-mod-surface-skeleton text-mod-surface-text-muted'}`}>
              <WorkflowIcon size={14} />
            </div>
            <div className="text-left">
              <p className="text-[9px] font-bold text-mod-surface-text-muted uppercase tracking-tighter leading-none mb-0.5">Workflow</p>
              <div className="flex items-center gap-1">
                <span className="text-xs font-bold text-mod-surface-text-primary leading-none truncate max-w-[200px]">
                  {workflows.find(w => w.id === activeWorkflowId)?.name || 'Select Flow'}
                </span>
                <ChevronDown size={12} className={`text-mod-surface-text-muted transition-transform duration-200 ${isFlowsPopoverOpen ? 'rotate-180' : ''}`} />
              </div>
            </div>
          </button>

          <AnimatePresence>
            {isFlowsPopoverOpen && (
              <WorkflowSwitcherPopover
                workflows={workflows}
                workspaces={workspaces}
                activeWorkflowId={activeWorkflowId}
                setActiveWorkflowId={setActiveWorkflowId}
                setIsFlowsPopoverOpen={setIsFlowsPopoverOpen}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                deleteWorkflow={deleteWorkflow}
              />
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

      <div className="flex items-center justify-end gap-3">
        <div className="relative" id="tour-versions">
          <button
            onClick={() => setIsVersionsPopoverOpen(!isVersionsPopoverOpen)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all border ${
              isVersionsPopoverOpen
                ? 'bg-mod-hero-badge-bg border-mod-hero-icon-color/20 text-mod-hero-badge-text shadow-sm'
                : 'bg-mod-surface-card border-transparent text-mod-surface-text-secondary hover:bg-mod-surface-hover'
            }`}
            title="Version History"
          >
            <div className={`p-1.5 rounded-md transition-all ${isVersionsPopoverOpen ? 'bg-mod-hero-btn-bg text-white' : 'bg-mod-surface-skeleton text-mod-surface-text-muted'}`}>
              <History size={14} />
            </div>
            <div className="text-left">
              <p className="text-[9px] font-bold text-mod-surface-text-muted uppercase tracking-tighter leading-none mb-0.5">Version</p>
              <div className="flex items-center gap-1">
                <span className="text-xs font-bold text-mod-surface-text-primary leading-none truncate max-w-[120px]">
                  {selectedVersion}
                </span>
                <ChevronDown size={12} className={`text-mod-surface-text-muted transition-transform duration-200 ${isVersionsPopoverOpen ? 'rotate-180' : ''}`} />
              </div>
            </div>
          </button>

          <VersionHistoryPopover
            isOpen={isVersionsPopoverOpen}
            onClose={() => setIsVersionsPopoverOpen(false)}
            versions={mockVersions}
            selectedVersion={selectedVersion}
            setSelectedVersion={setSelectedVersion}
            setRevertToast={setRevertToast}
          />
        </div>

        <div className="flex items-center gap-1 bg-mod-surface-skeleton/30 p-1 rounded-lg border border-mod-surface-border mr-2" id="tour-run-reset">
          <button
            onClick={() => {
              if (isRunning) return;
              setIsRunning(true);
              setNodes(prev => prev.map(n => ({ ...n, error: undefined })));
              setTimeout(() => {
                setNodes(prev => {
                  if (prev.length === 0) return prev;
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
            className={`p-2 rounded-lg transition-all ${isRunning ? 'text-teal-400 bg-teal-50 cursor-wait' : 'text-mod-surface-text-secondary hover:bg-mod-hero-badge-bg hover:text-mod-hero-icon-color'}`}
            title="Run Flow"
          >
            {isRunning ? <Activity size={16} className="animate-spin" /> : <Play size={16} />}
          </button>

          <button
            onClick={() => {
              if (confirm('Are you sure you want to reset the canvas?')) {
                setNodes([]);
                setConnections([]);
              }
            }}
            className="p-2 text-mod-surface-text-secondary hover:text-rose-500 hover:bg-mod-surface-hover hover:shadow-sm rounded-lg transition-all"
            title="Reset Canvas"
          >
            <Activity size={16} />
          </button>
        </div>

        <ActionDropdown
          header={{ title: 'Global Actions' }}
          itemHoverClass="hover:bg-mod-hero-badge-bg hover:text-mod-hero-icon-color"
          trigger={(isOpen) => (
            <button
              className={`p-2 rounded-lg transition-all border ${
                isOpen
                  ? 'bg-mod-hero-badge-bg border-mod-hero-icon-color/20 text-mod-hero-badge-text shadow-sm'
                  : 'bg-mod-surface-card border-mod-surface-border text-mod-surface-text-secondary hover:bg-mod-hero-badge-bg hover:text-mod-hero-icon-color'
              }`}
              title="Workflow Settings"
            >
              <MoreVertical size={16} />
            </button>
          )}
          items={[
            { label: 'Schedule', icon: <Calendar size={14} className="text-mod-surface-text-primary" />, onClick: () => {} },
            { label: 'Duplicate', icon: <Copy size={14} className="text-mod-surface-text-primary" />, onClick: () => {} },
            { label: 'View Lineage', icon: <Link2 size={14} className="text-mod-surface-text-primary" />, onClick: () => {} },
            { label: 'Settings', icon: <Settings2 size={14} className="text-mod-surface-text-primary" />, onClick: () => {} },
            { label: 'Workflow Info', icon: <Info size={14} className="text-mod-surface-text-primary" />, onClick: () => {} },
            { divider: true, label: '', onClick: () => {} },
            {
              label: 'Delete Pipeline',
              icon: <Trash2 size={14} />,
              onClick: () => { if (activeWorkflowId) deleteWorkflow(activeWorkflowId); },
              variant: 'danger'
            }
          ]}
        />

        <button
          onClick={() => setIsDeployModalOpen(true)}
          className="flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-bold transition-all active:scale-95 bg-mod-hero-btn-bg hover:bg-mod-hero-btn-hover text-white"
          id="tour-deploy"
        >
          <Rocket size={16} /> Deploy
        </button>
      </div>
    </header>
  );
};

export default WorkflowBuilderHeader;
