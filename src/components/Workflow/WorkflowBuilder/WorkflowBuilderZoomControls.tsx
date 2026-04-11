import { motion } from 'framer-motion';
import { Minus, Plus } from 'lucide-react';
import React from 'react';

interface WorkflowBuilderZoomControlsProps {
  isNodeRunPanelOpen: boolean;
  zoom: number;
  setZoom: (zoom: number | ((prev: number) => number)) => void;
}

const WorkflowBuilderZoomControls: React.FC<WorkflowBuilderZoomControlsProps> = ({
  isNodeRunPanelOpen,
  zoom,
  setZoom
}) => {
  return (
    <motion.div
      initial={false}
      animate={{ bottom: isNodeRunPanelOpen ? 340 : 40 }}
      transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      className="absolute right-10 z-30 flex items-center gap-2"
      id="tour-zoom"
    >
      <div className="flex items-center bg-mod-surface-card/80 backdrop-blur-xl border border-mod-surface-border rounded-2xl shadow-lg p-1">
        <button
          onClick={() => setZoom(prev => Math.max(10, prev - 10))}
          className="p-2.5 hover:bg-mod-surface-hover text-mod-surface-text-muted rounded-xl transition-all active:scale-90"
          title="Zoom Out"
        >
          <Minus size={14} strokeWidth={3} />
        </button>

        <button
          onClick={() => setZoom(100)}
          className="px-4 py-1.5 hover:bg-mod-surface-hover text-mod-surface-text-secondary rounded-xl transition-all"
          title="Reset to 100%"
        >
          <span className="text-[10px] font-black uppercase tracking-widest leading-none">{zoom}%</span>
        </button>

        <button
          onClick={() => setZoom(prev => Math.min(200, prev + 10))}
          className="p-2.5 hover:bg-mod-surface-hover text-mod-surface-text-muted rounded-xl transition-all active:scale-90"
          title="Zoom In"
        >
          <Plus size={14} strokeWidth={3} />
        </button>
      </div>
    </motion.div>
  );
};

export default WorkflowBuilderZoomControls;
