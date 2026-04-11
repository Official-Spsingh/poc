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
  setIsTourOpen,
}) => {
  return (
    <motion.div
      initial={false}
      animate={{ y: isNodeRunPanelOpen ? '-80%' : '-50%' }}
      transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      className="absolute top-1/2 left-8 z-30 flex flex-col gap-3"
      id="tour-command-center"
    >
      <div className="flex flex-col bg-mod-surface-card/80 backdrop-blur-xl border border-mod-surface-border rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.12)] overflow-hidden">
        {/* Primary Actions Group */}
        <div className="flex flex-col border-b border-mod-surface-border">
          <button
            onClick={() => !isLocked && setIsComponentSidebarOpen(!isComponentSidebarOpen)}
            className={`p-4 transition-all active:scale-95 group relative ${isComponentSidebarOpen ? 'bg-mod-hero-badge-bg border-mod-hero-icon-color/20 text-mod-hero-icon-color shadow-sm' : 'text-mod-surface-text-muted hover:bg-mod-hero-badge-bg hover:text-mod-hero-icon-color'} ${isLocked ? 'cursor-not-allowed opacity-50' : ''}`}
            title={isLocked ? 'Locked' : 'Toggle Add Node Panel'}
          >
            <LayoutGrid size={20} className={isComponentSidebarOpen ? 'rotate-0' : 'group-hover:scale-110 transition-transform duration-300'} />
            <div className="absolute left-full ml-3 px-3 py-1.5 bg-mod-hero-btn-bg text-white text-[10px] font-bold rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none uppercase tracking-widest shadow-xl z-50">
              {isComponentSidebarOpen ? 'Close Panel' : 'Add Component'}
            </div>
          </button>

          <button
            onClick={() => {
              setIsGlobalAiOpen(!isGlobalAiOpen);
              if (!isGlobalAiOpen) setIsDrawerOpen(false);
            }}
            className={`p-4 transition-all active:scale-90 group relative ${isGlobalAiOpen ? 'bg-mod-hero-badge-bg text-mod-hero-icon-color' : 'text-mod-surface-text-muted hover:bg-mod-hero-badge-bg hover:text-mod-hero-icon-color'}`}
            title="AI Workflow Support"
          >
            <div className="relative">
              <Sparkles size={18} className={isGlobalAiOpen ? 'animate-pulse text-mod-hero-icon-color' : 'group-hover:scale-110 transition-transform'} />
              {isGlobalAiOpen && (
                <motion.div
                  layoutId="ai-glow"
                  className="absolute inset-0 bg-mod-hero-icon-color blur-lg opacity-30 -z-10 rounded-full"
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1.5, opacity: 0.3 }}
                  transition={{ repeat: Infinity, duration: 2, repeatType: 'reverse' }}
                />
              )}
            </div>
            <div className="absolute left-full ml-3 px-3 py-1.5 bg-mod-hero-btn-bg text-white text-[10px] font-bold rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none uppercase tracking-widest shadow-xl flex items-center gap-2 z-50">
              <Bot size={12} className="text-mod-hero-badge-bg" />
              Lumenore AI Help
            </div>
          </button>
        </div>

        {/* View & Layout Controls Group */}
        <div className="flex flex-col">
          <button
            onClick={() => console.log('Rearranging...')}
            className="p-4 text-mod-surface-text-muted hover:bg-mod-hero-badge-bg hover:text-mod-hero-icon-color transition-all active:scale-90 group relative"
            title="Auto Rearrange"
          >
            <Network size={18} />
            <div className="absolute left-full ml-3 px-3 py-1.5 bg-mod-hero-btn-bg text-white text-[10px] font-bold rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none uppercase tracking-widest shadow-xl z-50">Auto Rearrange</div>
          </button>

          <div className="h-px bg-mod-surface-border mx-2" />

          <button
            onClick={() => setIsLocked(!isLocked)}
            className={`p-4 transition-all active:scale-90 group relative ${isLocked ? 'text-amber-500' : 'text-mod-surface-text-muted hover:text-mod-hero-icon-color hover:bg-mod-hero-badge-bg'}`}
            title={isLocked ? 'Unlock Canvas' : 'Lock Canvas'}
          >
            {isLocked ? <Lock size={18} /> : <Unlock size={18} />}
            <div className="absolute left-full ml-3 px-3 py-1.5 bg-mod-hero-btn-bg text-white text-[10px] font-bold rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none uppercase tracking-widest shadow-xl z-50">{isLocked ? 'Unlock Flow' : 'Lock Flow'}</div>
          </button>

          <div className="h-px bg-mod-surface-border mx-2" />

          <button
            onClick={() => setIsTourOpen(true)}
            className="p-4 text-mod-surface-text-muted hover:text-mod-hero-icon-color hover:bg-mod-hero-badge-bg transition-all active:scale-90 group relative"
            title="Quick Start Tour"
          >
            <Compass size={18} />
            <div className="absolute left-full ml-3 px-3 py-1.5 bg-mod-hero-btn-bg text-white text-[10px] font-bold rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none uppercase tracking-widest shadow-xl z-50">Launch Tour</div>
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default WorkflowBuilderCommandCenter;
