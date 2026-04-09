import { AnimatePresence, motion } from 'framer-motion';
import {
  ArrowLeft,
  ChevronDown,
  History,
  Search,
  Workflow as WorkflowIcon,
  CheckCircle2,
  Clock,
  Activity,
  Play,
  MoreVertical,
  Calendar,
  Copy,
  Link2,
  Settings2,
  Trash2,
  Info,
  Rocket,
  Check
} from 'lucide-react';
import React from 'react';
import WorkflowSwitcherPopover from './WorkflowSwitcherPopover';
import VersionHistoryPopover from './VersionHistoryPopover';
import { Workflow, Workspace, ViewType, NodeData, Connection } from '../../../../types';
import WorkflowSidebarItem from './WorkflowSidebarItem';

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
  setIsActionsMenuOpen: (isOpen: boolean) => void;
  isActionsMenuOpen: boolean;
  actionsMenuRef: React.RefObject<HTMLDivElement>;
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
  setIsActionsMenuOpen,
  isActionsMenuOpen,
  actionsMenuRef,
  setIsDeployModalOpen,
  setNodes,
  setConnections
}) => {
  const mockVersions = [
    { id: 'v1.0.0', label: 'v1.0.0 (Live)', date: 'Today, 10:45 AM' },
    { id: 'v0.9.5', label: 'v0.9.5', date: 'Yesterday, 2:30 PM' },
    { id: 'v0.9.0', label: 'v0.9.0', date: 'Oct 24, 11:15 AM' },
    { id: 'v0.8.0', label: 'v0.8.0', date: 'Oct 20, 09:00 AM' },
  ];

  return (
    <header className="h-16 bg-white border-b border-gray-100 pr-6 flex items-center justify-between z-[10000] shrink-0">
      <div className="flex items-center w-64 shrink-0 overflow-hidden pl-6 pr-4 border-r border-gray-100 h-full">
        <button
          onClick={() => setView('workflow-home')}
          className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 rounded-xl text-gray-500 transition-all group shrink-0"
          title="Back to Workflows"
        >
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-bold text-gray-800">Workflows</span>
        </button>
      </div>

      <div className="flex-1 flex items-center gap-2 pl-4">
        <div className="relative" id="tour-selector">
          <button
            onClick={() => setIsFlowsPopoverOpen(!isFlowsPopoverOpen)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all border ${isFlowsPopoverOpen
              ? 'bg-teal-50 border-teal-200 text-teal-700 shadow-sm'
              : 'bg-white border-transparent text-gray-600 hover:bg-gray-50'
              }`}
          >
            <div className={`p-1.5 rounded-md transition-all ${isFlowsPopoverOpen ? 'bg-teal-600 text-white' : 'bg-gray-50 text-gray-400'}`}>
              <WorkflowIcon size={14} />
            </div>
            <div className="text-left">
              <p className="text-[9px] font-bold text-gray-400 uppercase tracking-tighter leading-none mb-0.5">Workflow</p>
              <div className="flex items-center gap-1">
                <span className="text-xs font-bold text-gray-800 leading-none truncate max-w-[200px]">
                  {workflows.find(w => w.id === activeWorkflowId)?.name || 'Select Flow'}
                </span>
                <ChevronDown size={12} className={`text-gray-400 transition-transform duration-200 ${isFlowsPopoverOpen ? 'rotate-180' : ''}`} />
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
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all border ${isVersionsPopoverOpen
              ? 'bg-blue-50 border-blue-200 text-blue-700 shadow-sm'
              : 'bg-white border-transparent text-gray-600 hover:bg-gray-50'
              }`}
            title="Version History"
          >
            <div className={`p-1.5 rounded-md transition-all ${isVersionsPopoverOpen ? 'bg-blue-700 text-white' : 'bg-gray-50 text-gray-400'}`}>
              <History size={14} />
            </div>
            <div className="text-left">
              <p className="text-[9px] font-bold text-gray-400 uppercase tracking-tighter leading-none mb-0.5">Version</p>
              <div className="flex items-center gap-1">
                <span className="text-xs font-bold text-gray-800 leading-none truncate max-w-[120px]">
                  {selectedVersion}
                </span>
                <ChevronDown size={12} className={`text-gray-400 transition-transform duration-200 ${isVersionsPopoverOpen ? 'rotate-180' : ''}`} />
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

        <div className="flex items-center gap-1 bg-gray-50 p-1 rounded-lg border border-gray-100 mr-2" id="tour-run-reset">
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
            className={`p-2 rounded-lg transition-all ${isRunning ? 'text-teal-400 bg-teal-50 cursor-wait' : 'text-gray-600 hover:text-teal-600 hover:bg-white hover:shadow-sm'}`}
            title="Run Flow"
          >
            {isRunning ? <Activity size={16} className="animate-spin" /> : <Play size={16} />}
          </button>

          <button
            onClick={() => {
              if (confirm("Are you sure you want to reset the canvas?")) {
                setNodes([]);
                setConnections([]);
              }
            }}
            className="p-2 text-gray-600 hover:text-rose-600 hover:bg-white hover:shadow-sm rounded-lg transition-all"
            title="Reset Canvas"
          >
            <Activity size={16} />
          </button>
        </div>

        <div className="relative" ref={actionsMenuRef} id="tour-global-actions">
          <button
            onClick={() => setIsActionsMenuOpen(!isActionsMenuOpen)}
            className={`p-2 rounded-lg transition-all border ${isActionsMenuOpen ? 'bg-teal-50 border-teal-200 text-teal-700 shadow-sm' : 'bg-gray-50 border-gray-100 text-gray-600 hover:text-teal-600 hover:bg-white hover:border-teal-100 hover:shadow-sm'}`}
            title="Workflow Settings"
          >
            < MoreVertical size={16} />
          </button>

          <AnimatePresence>
            {isActionsMenuOpen && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                className="absolute top-full right-0 mt-2 w-56 bg-white border border-gray-100 rounded-2xl shadow-2xl z-[10001] py-2 overflow-hidden"
              >
                <div className="px-4 py-2 border-b border-gray-50 mb-1">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Global Actions</p>
                </div>

                <button onClick={() => setIsActionsMenuOpen(false)} className="w-full px-4 py-2.5 text-left text-xs font-bold text-gray-600 hover:bg-teal-50 hover:text-teal-700 flex items-center gap-3 transition-all">
                  <Calendar size={14} className="text-blue-700" /> Schedule
                </button>
                <button onClick={() => setIsActionsMenuOpen(false)} className="w-full px-4 py-2.5 text-left text-xs font-bold text-gray-600 hover:bg-teal-50 hover:text-teal-700 flex items-center gap-3 transition-all">
                  <Copy size={14} className="text-violet-700" /> Duplicate
                </button>
                <button onClick={() => setIsActionsMenuOpen(false)} className="w-full px-4 py-2.5 text-left text-xs font-bold text-gray-600 hover:bg-teal-50 hover:text-teal-700 flex items-center gap-3 transition-all">
                  <Link2 size={14} className="text-teal-500" /> View Lineage
                </button>
                <button onClick={() => setIsActionsMenuOpen(false)} className="w-full px-4 py-2.5 text-left text-xs font-bold text-gray-600 hover:bg-teal-50 hover:text-teal-700 flex items-center gap-3 transition-all">
                  <Settings2 size={14} className="text-amber-600" /> Settings
                </button>
                <button onClick={() => setIsActionsMenuOpen(false)} className="w-full px-4 py-2.5 text-left text-xs font-bold text-gray-600 hover:bg-teal-50 hover:text-teal-700 flex items-center gap-3 transition-all">
                  <Info size={14} className="text-violet-700" /> Workflow Info
                </button>

                <div className="h-px bg-gray-50 my-1 mx-2" />

                <button
                  onClick={() => {
                    if (activeWorkflowId) deleteWorkflow(activeWorkflowId);
                    setIsActionsMenuOpen(false);
                  }}
                  className="w-full px-4 py-2.5 text-left text-xs font-bold text-rose-500 hover:bg-rose-50 flex items-center gap-3 transition-all"
                >
                  <Trash2 size={14} /> Delete Pipeline
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <button
          onClick={() => setIsDeployModalOpen(true)}
          className="flex items-center gap-2 px-5 py-2 bg-teal-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-teal-100 hover:bg-teal-700 transition-all active:scale-95"
          id="tour-deploy"
        >
          < Rocket size={16} /> Deploy
        </button>
      </div>
    </header>
  );
};

export default WorkflowBuilderHeader;
