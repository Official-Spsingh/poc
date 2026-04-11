import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import React from 'react';
import { createPortal } from 'react-dom';
import { useModuleTheme } from '../../../contexts/ModuleThemeContext';

interface WorkflowAIArchitectModalProps {
  isAiPromptMode: boolean;
  isGenerating: boolean;
}

const WorkflowAIArchitectModal: React.FC<WorkflowAIArchitectModalProps> = ({
  isAiPromptMode,
  isGenerating,
}) => {
  const moduleTheme = useModuleTheme();
  const resolvedTheme = moduleTheme ?? document.documentElement.getAttribute('data-theme') ?? undefined;

  if (!isAiPromptMode || !isGenerating) return null;

  return createPortal(
    <div data-theme={resolvedTheme} className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-6 selection:bg-transparent">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-md"
      />
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        className="relative w-full max-w-2xl bg-mod-surface-card rounded-3xl shadow-mod-modal border border-mod-surface-border overflow-hidden flex flex-col items-center justify-center p-12 lg:p-16"
      >
        {/* AI Grid/Pattern Overlay */}
        <div className="absolute inset-0 opacity-[0.05] pointer-events-none" style={{ backgroundImage: `radial-gradient(var(--mod-hero-icon-color) 1px, transparent 1px)`, backgroundSize: '24px 24px' }} />
        
        <div className="relative mb-10">
          <div className="absolute inset-0 bg-mod-hero-icon-color rounded-full blur-[60px] opacity-10 animate-pulse" />
          <div className="w-24 h-24 bg-mod-hero-badge-bg border border-mod-hero-badge-bg rounded-2xl flex items-center justify-center relative shadow-inner group">
            <Sparkles size={48} className="text-mod-hero-icon-color animate-pulse" />
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 border-2 border-dashed border-mod-hero-icon-color/30 rounded-2xl scale-125"
            />
          </div>
        </div>

        <div className="text-center space-y-6 max-w-sm relative z-10">
          <div className="space-y-2">
            <h3 className="text-2xl font-bold text-mod-surface-text-primary tracking-tight flex items-center justify-center gap-2">
              <span className="text-mod-hero-icon-color italic">AI</span> Architecting
            </h3>
            <p className="text-mod-surface-text-secondary text-sm font-medium leading-relaxed">
              Synthesizing node clusters and logic schemas for your workflow...
            </p>
          </div>

          <div className="pt-4 flex flex-col items-center gap-4">
            <div className="flex items-center gap-1.5 h-6">
              {[0, 1, 2].map((i) => (
                <motion.div 
                  key={i}
                  animate={{ 
                    scale: [1, 1.5, 1],
                    opacity: [0.3, 1, 0.3],
                    backgroundColor: ['#94a3b8', 'var(--mod-hero-btn-bg)', '#94a3b8']
                  }}
                  transition={{ 
                    duration: 1.5, 
                    repeat: Infinity, 
                    delay: i * 0.2,
                    ease: "easeInOut"
                  }}
                  className="w-2 h-2 rounded-full"
                />
              ))}
            </div>
            <div className="text-[10px] font-bold text-mod-hero-icon-color opacity-70 uppercase tracking-[0.2em] font-mono">
              Optimizing Logic Path...
            </div>
          </div>
        </div>

        {/* Bottom Accent */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-mod-hero-icon-color/20 to-transparent" />
      </motion.div>
    </div>,
    document.body
  );
};

export default WorkflowAIArchitectModal;
