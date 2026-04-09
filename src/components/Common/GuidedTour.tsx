import { AnimatePresence, motion } from 'framer-motion';
import { ChevronRight, Layout, Sparkles, X } from 'lucide-react';
import React, { useCallback, useLayoutEffect, useRef, useState } from 'react';

export type TourPosition = 
  | 'top' | 'bottom' | 'left' | 'right' | 'center'
  | 'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight'
  | 'leftTop' | 'leftBottom' | 'rightTop' | 'rightBottom';

export interface TourStep {
  targetId: string;
  title: string;
  content: string;
  position: TourPosition;
}

interface GuidedTourProps {
  isOpen: boolean;
  onClose: () => void;
  steps: TourStep[];
}

const GuidedTour: React.FC<GuidedTourProps> = ({ isOpen, onClose, steps }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  const updateRect = useCallback(() => {
    const step = steps[currentStep];
    if (!step) return;

    if (step.targetId) {
      const element = document.getElementById(step.targetId);
      if (element) {
        setTargetRect(element.getBoundingClientRect());
        return;
      }
    }
    setTargetRect(null);
  }, [currentStep, steps]);

  useLayoutEffect(() => {
    if (!isOpen) {
      setCurrentStep(0);
      return;
    }

    updateRect();
    const timer = setTimeout(updateRect, 100);
    window.addEventListener('resize', updateRect);
    window.addEventListener('scroll', updateRect, true);
    
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', updateRect);
      window.removeEventListener('scroll', updateRect, true);
    };
  }, [isOpen, updateRect]);

  if (!isOpen) return null;

  const step = steps[currentStep];

  const getTooltipStyle = () => {
    if (step.position === 'center' || !targetRect) {
      return { 
        top: '50%', 
        left: '50%', 
        transform: 'translate(-50%, -50%)', 
        width: '360px',
        position: 'fixed' as const
      };
    }

    const margin = 16;
    const tooltipWidth = 360;
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    let style: React.CSSProperties = {
      position: 'fixed',
      width: `${tooltipWidth}px`
    };

    const tMidX = targetRect.left + targetRect.width / 2;
    const tMidY = targetRect.top + targetRect.height / 2;

    switch (step.position) {
      case 'top':
      case 'topLeft':
      case 'topRight':
        style.bottom = `${viewportHeight - targetRect.top + margin}px`;
        break;
      case 'bottom':
      case 'bottomLeft':
      case 'bottomRight':
        style.top = `${targetRect.bottom + margin}px`;
        break;
      case 'left':
      case 'leftTop':
      case 'leftBottom':
        style.right = `${viewportWidth - targetRect.left + margin}px`;
        break;
      case 'right':
      case 'rightTop':
      case 'rightBottom':
        style.left = `${targetRect.right + margin}px`;
        break;
    }

    const hPadding = 20;
    const vPadding = 20;

    if (['top', 'bottom'].includes(step.position)) {
      let left = tMidX - tooltipWidth / 2;
      left = Math.max(hPadding, Math.min(left, viewportWidth - tooltipWidth - hPadding));
      style.left = `${left}px`;
    } else if (['topLeft', 'bottomLeft'].includes(step.position)) {
      let left = targetRect.left;
      left = Math.max(hPadding, Math.min(left, viewportWidth - tooltipWidth - hPadding));
      style.left = `${left}px`;
    } else if (['topRight', 'bottomRight'].includes(step.position)) {
      let left = targetRect.right - tooltipWidth;
      left = Math.max(hPadding, Math.min(left, viewportWidth - tooltipWidth - hPadding));
      style.left = `${left}px`;
    } else if (['left', 'right'].includes(step.position)) {
      style.top = `${tMidY - 120}px`;
    } else if (['leftTop', 'rightTop'].includes(step.position)) {
      style.top = `${targetRect.top}px`;
    } else if (['leftBottom', 'rightBottom'].includes(step.position)) {
      style.top = `${targetRect.bottom - 240}px`; 
    }

    if (style.top) {
      const topVal = parseInt(style.top as string);
      if (topVal < vPadding) style.top = `${vPadding}px`;
    }
    if (style.bottom) {
      const bottomVal = parseInt(style.bottom as string);
      if (bottomVal < vPadding) style.bottom = `${vPadding}px`;
    }

    return style;
  };

  const currentStyle = getTooltipStyle();

  return (
    <div className="fixed inset-0 z-[99999] pointer-events-none">
      <AnimatePresence>
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-slate-900/30 backdrop-blur-[1px] pointer-events-auto"
          style={{
            clipPath: targetRect ? `polygon(
              0% 0%, 0% 100%, ${targetRect.left - 4}px 100%, 
              ${targetRect.left - 4}px ${targetRect.top - 4}px, 
              ${targetRect.right + 4}px ${targetRect.top - 4}px, 
              ${targetRect.right + 4}px ${targetRect.bottom + 4}px, 
              ${targetRect.left - 4}px ${targetRect.bottom + 4}px, 
              ${targetRect.left - 4}px 100%, 100% 100%, 100% 0%
            )` : 'none'
          }}
          onClick={onClose}
        />
      </AnimatePresence>

      <div className="absolute inset-0 overflow-hidden">
        <AnimatePresence mode="wait">
          {(targetRect || step.position === 'center') && (
            <motion.div
              key={currentStep}
              ref={tooltipRef}
              initial={{ opacity: 0, scale: 0.98, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98, y: -10 }}
              className="pointer-events-auto"
              style={currentStyle}
            >
              <div className="relative overflow-hidden bg-white border border-gray-100 rounded-[24px] shadow-[0_20px_40px_-12px_rgba(0,0,0,0.1)] flex flex-col">
                {/* Header Section */}
                <div className="px-6 py-3 flex justify-between items-center border-b border-gray-50 bg-gray-50/10">
                   <div className="flex items-center gap-2">
                     <Layout size={12} className="text-gray-400" />
                     <span className="text-[9px] font-bold uppercase tracking-widest text-gray-400">
                       Platform Tour
                     </span>
                   </div>
                   
                   <div className="flex items-center gap-3">
                     <button 
                      onClick={onClose} 
                      className="text-[9px] font-bold uppercase tracking-widest text-blue-500 hover:text-blue-600 transition-all"
                     >
                      Skip Tour
                     </button>
                     <div className="w-px h-3 bg-gray-200" />
                     <button 
                      onClick={onClose} 
                      className="p-1 hover:bg-rose-50 rounded-lg text-gray-300 hover:text-rose-400 transition-all active:scale-90"
                     >
                      <X size={16} />
                     </button>
                   </div>
                </div>
                
                <div className="p-6">
                  {/* Content Header */}
                  <div className="flex items-start justify-between gap-4 mb-5">
                    <div className="min-w-0">
                      <h3 className="text-lg font-bold text-gray-800 leading-tight mb-1.5 tracking-tight">
                        {step.title}
                      </h3>
                      <div className="flex items-center gap-1.5">
                        <div className="flex gap-0.5">
                          {steps.map((_, i) => (
                            <div 
                              key={i} 
                              className={`h-1 rounded-full transition-all duration-300 ${i === currentStep ? 'w-4 bg-blue-500' : 'w-1 bg-gray-200'}`} 
                            />
                          ))}
                        </div>
                        <span className="text-[8px] font-bold text-gray-300 uppercase tracking-widest ml-0.5">
                          Step {currentStep + 1}
                        </span>
                      </div>
                    </div>
                    <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center text-blue-500 shrink-0 shadow-sm border border-blue-100/30">
                       <span className="text-sm font-bold">{currentStep + 1}</span>
                    </div>
                  </div>
                  
                  {/* Main Copy */}
                  <p className="text-gray-500 leading-relaxed font-medium text-sm mb-8">
                    {step.content}
                  </p>

                  {/* Actions Footer */}
                  <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-50">
                    {currentStep > 0 && (
                      <button 
                        onClick={() => setCurrentStep(prev => prev - 1)}
                        className="px-4 py-2 text-gray-400 hover:text-gray-600 font-bold text-[11px] uppercase tracking-widest hover:bg-gray-50 rounded-lg transition-all"
                      >
                        Back
                      </button>
                    )}
                    
                    <button 
                      onClick={() => {
                        if (currentStep < steps.length - 1) {
                          setCurrentStep(prev => prev + 1);
                        } else {
                          onClose();
                        }
                      }}
                      className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-md shadow-blue-100 transition-all active:scale-95 group"
                    >
                      <span className="font-bold uppercase tracking-widest text-[11px]">
                        {currentStep === steps.length - 1 ? 'Finish' : 'Next'}
                      </span>
                      {currentStep < steps.length - 1 ? (
                        <ChevronRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
                      ) : (
                        <Sparkles size={14} />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default GuidedTour;
