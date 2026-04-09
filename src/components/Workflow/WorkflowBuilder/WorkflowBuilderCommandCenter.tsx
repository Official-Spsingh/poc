import { motion } from 'framer-motion';
import { Bot, Compass, LayoutGrid, Lock, Network, Sparkles, Unlock } from 'lucide-react';
import React from 'react';

interface WorkflowBuilderCommandCenterProps {
  isNodeRunPanelOpen: boolean;
  isLocked: boolean;
  setIsLocked: (isLocked: boolean) => void;
  isComponentSidebarOpen: boolean;
  setIsComponentSidebarOpen: (isOpen: boolean) => void;
  isGlobalAiOpen: boolean;
  setIsGlobalAiOpen: (isOpen: boolean) => void;
  setIsDrawerOpen: (isOpen: boolean) => void;
  setIsTourOpen: (isOpen: boolean) => void;
}

const WorkflowBuilderCommandCenter: React.FC<WorkflowBuilderCommandCenterProps> = ({
  isNodeRunPanelOpen,
  isLocked,
  setIsLocked,
  isComponentSidebarOpen,
  setIsComponentSidebarOpen,
  isGlobalAiOpen,
  setIsGlobalAiOpen,
  setIsDrawerOpen,
  setIsTourOpen
}) => {
  return (
    <motion.div
      initial={false}
      animate={{ y: isNodeRunPanelOpen ? '-80%' : '-50%' }}
      transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      className="absolute top-1/2 left-8 z-30 flex flex-col gap-3"
      id="tour-command-center"
    >
      <div className="flex flex-col bg-white/70 backdrop-blur-xl border border-white/40 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.08)] overflow-hidden">
        {/* 1. Primary Actions Group (Creative Tools) */}
        <div className="flex flex-col border-b border-gray-100/50">
          <button
            onClick={() => !isLocked && setIsComponentSidebarOpen(!isComponentSidebarOpen)}
            className={`p-4 transition-all active:scale-95 group relative ${isComponentSidebarOpen ? 'bg-teal-50 text-teal-600' : 'hover:bg-teal-50 text-gray-500 hover:text-teal-600'} ${isLocked ? 'cursor-not-allowed opacity-50' : ''}`}
            title={isLocked ? "Locked" : "Toggle Add Node Panel"}
          >
            <LayoutGrid size={20} className={isComponentSidebarOpen ? 'rotate-0' : 'group-hover:scale-110 transition-transform duration-300'} />
            <div className="absolute left-full ml-3 px-3 py-1.5 bg-gray-900 text-white text-[10px] font-bold rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none uppercase tracking-widest shadow-xl z-50">
              {isComponentSidebarOpen ? 'Close Panel' : 'Add Component'}
            </div>
          </button>

          <button
            onClick={() => {
              setIsGlobalAiOpen(!isGlobalAiOpen);
              if (!isGlobalAiOpen) setIsDrawerOpen(false);
            }}
            className={`p-4 transition-all active:scale-90 group relative ${isGlobalAiOpen ? 'bg-violet-50 text-violet-600' : 'hover:bg-violet-50 text-violet-500 hover:text-violet-600'}`}
            title="AI Workflow Support"
          >
            <div className="relative">
              <Sparkles size={18} className={isGlobalAiOpen ? 'animate-pulse text-violet-600' : 'group-hover:scale-110 transition-transform'} />
              {isGlobalAiOpen && (
                <motion.div
                  layoutId="ai-glow"
                  className="absolute inset-0 bg-violet-400 blur-lg opacity-30 -z-10 rounded-full"
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1.5, opacity: 0.3 }}
                  transition={{ repeat: Infinity, duration: 2, repeatType: 'reverse' }}
                />
              )}
            </div>
            <div className="absolute left-full ml-3 px-3 py-1.5 bg-violet-900 text-white text-[10px] font-bold rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none uppercase tracking-widest shadow-xl flex items-center gap-2 z-50">
              <Bot size={12} className="text-violet-300" />
              Lumenore AI Help
            </div>
          </button>
        </div>

        {/* 2. View & Layout Controls Group (Utilities) */}
        <div className="flex flex-col bg-gray-50/20">
          <button
            onClick={() => console.log("Rearranging...")}
            className="p-4 hover:bg-teal-50 text-gray-400 hover:text-teal-600 transition-all active:scale-90 group relative"
            title="Auto Rearrange"
          >
            <Network size={18} />
            <div className="absolute left-full ml-3 px-3 py-1.5 bg-gray-900 text-white text-[10px] font-bold rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none uppercase tracking-widest shadow-xl z-50">Auto Rearrange</div>
          </button>

          <div className="h-px bg-gray-100/50 mx-2" />

          <button
            onClick={() => setIsLocked(!isLocked)}
            className={`p-4 transition-all active:scale-90 group relative ${isLocked ? 'text-amber-600' : 'text-gray-400 hover:text-teal-600'}`}
            title={isLocked ? "Unlock Canvas" : "Lock Canvas"}
          >
            {isLocked ? <Lock size={18} /> : <Unlock size={18} />}
            <div className="absolute left-full ml-3 px-3 py-1.5 bg-gray-900 text-white text-[10px] font-bold rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none uppercase tracking-widest shadow-xl z-50">{isLocked ? 'Unlock Flow' : 'Lock Flow'}</div>
          </button>

          <div className="h-px bg-gray-100/50 mx-2" />

          <button
            onClick={() => setIsTourOpen(true)}
            className="p-4 text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-all active:scale-90 group relative"
            title="Quick Start Tour"
          >
            <Compass size={18} />
            <div className="absolute left-full ml-3 px-3 py-1.5 bg-blue-900 text-white text-[10px] font-bold rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none uppercase tracking-widest shadow-xl z-50">Launch Tour</div>
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default WorkflowBuilderCommandCenter;
