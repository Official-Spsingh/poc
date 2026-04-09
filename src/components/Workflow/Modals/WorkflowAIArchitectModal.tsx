import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import React from 'react';
import { createPortal } from 'react-dom';
import { CombinedTheme } from '../../../constants/themeColors';

interface WorkflowAIArchitectModalProps {
  isAiPromptMode: boolean;
  isGenerating: boolean;
  theme: CombinedTheme;
}

const WorkflowAIArchitectModal: React.FC<WorkflowAIArchitectModalProps> = ({
  isAiPromptMode,
  isGenerating,
  theme
}) => {
  if (!isAiPromptMode || !isGenerating) return null;

  const colorKey = theme.homepage.tipsSection.iconText.split('-')[1];

  return createPortal(
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-6 selection:bg-transparent">
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
        className={`relative w-full max-w-2xl bg-white rounded-3xl shadow-[0_0_50px_${theme.homepage.hero.badge.includes('teal') ? 'rgba(20,184,166,0.15)' : 'rgba(14,165,233,0.15)'}] overflow-hidden flex flex-col items-center justify-center p-12 lg:p-16`}
      >
        {/* AI Grid/Pattern Overlay */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: `radial-gradient(${theme.homepage.hero.badge.includes('teal') ? '#14b8a6' : '#0ea5e9'} 1px, transparent 1px)`, backgroundSize: '24px 24px' }} />
        
        <div className="relative mb-10">
          <div className={`absolute inset-0 ${theme.homepage.hero.badge.includes('teal') ? 'bg-teal-500' : 'bg-sky-500'} rounded-full blur-[60px] opacity-10 animate-pulse`} />
          <div className={`w-24 h-24 ${theme.homepage.tipsSection.iconBg} border border-${colorKey}-100 rounded-2xl flex items-center justify-center relative shadow-inner group`}>
            <Sparkles size={48} className={`${theme.homepage.tipsSection.iconText} animate-pulse`} />
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              className={`absolute inset-0 border-2 border-dashed border-${colorKey}-200/50 rounded-2xl scale-125`}
            />
          </div>
        </div>

        <div className="text-center space-y-6 max-w-sm relative z-10">
          <div className="space-y-2">
            <h3 className="text-2xl font-bold text-gray-900 tracking-tight flex items-center justify-center gap-2">
              <span className={`${theme.homepage.tipsSection.iconText} italic`}>AI</span> Architecting
            </h3>
            <p className="text-gray-500 text-sm font-medium leading-relaxed">
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
                    backgroundColor: ['#94a3b8', theme.homepage.hero.gradient.split(' ')[1].replace('to-', '#'), '#94a3b8']
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
            <div className={`text-[10px] font-bold ${theme.homepage.tipsSection.iconText} opacity-60 uppercase tracking-[0.2em] font-mono`}>
              Optimizing Logic Path...
            </div>
          </div>
        </div>

        {/* Bottom Accent */}
        <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-${colorKey}-500/20 to-transparent`} />
      </motion.div>
    </div>,
    document.body
  );
};

export default WorkflowAIArchitectModal;
