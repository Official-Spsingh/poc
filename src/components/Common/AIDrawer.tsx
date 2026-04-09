import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeft, Bot, LayoutGrid, Move, Network, PanelLeft, PanelRight, Send, Sparkles, X } from 'lucide-react';
import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface QuickAction {
  label: string;
  icon: React.ReactNode;
  onClick: () => void;
  color?: 'sky' | 'teal' | 'violet' | 'emerald' | 'blue' | 'gray';
}

interface AIDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  history: ChatMessage[];
  message: string;
  setMessage: (val: string) => void;
  onSendMessage: (val: string) => void;
  mode?: 'dock-right' | 'dock-left' | 'floating';
  setMode?: (mode: 'dock-right' | 'dock-left' | 'floating') => void;
  title?: string;
  status?: string;
  statusIcon?: React.ReactNode;
  quickActions?: QuickAction[];
  constraintsRef?: React.RefObject<HTMLDivElement>;
  width?: number;
  height?: number | string;
  themeColor?: string;
  placeholder?: string;
  floatingPosition?: string;
  dragPosition?: { x: number | string; y: number | string };
  onDragEnd?: (position: { x: number; y: number }) => void;
  isCentered?: boolean;
  closeIcon?: 'close' | 'back';
}

const AIDrawer: React.FC<AIDrawerProps> = ({
  isOpen,
  onClose,
  history,
  message,
  setMessage,
  onSendMessage,
  mode = 'dock-right',
  setMode,
  title = 'Lumenore AI',
  status = 'Support active',
  statusIcon,
  quickActions = [],
  constraintsRef,
  width = 440,
  height = '100%',
  themeColor = 'teal',
  placeholder = 'Ask the assistant...',
  floatingPosition,
  dragPosition = { x: 0, y: 0 },
  onDragEnd,
  isCentered = false,
  closeIcon = 'close'
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  
  // Auto-focus when opened or message updated from parent
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
        if (message) {
          // Move cursor to end if there's a message (tag)
          inputRef.current?.setSelectionRange(message.length, message.length);
        }
      }, 100);
    }
  }, [isOpen, message]);

  const baseColor = themeColor || 'teal';

  /** 
   * Dynamic Theme Styles
   * Tailwind JIT scanner reference for all supported theme colors: 
   * bg-teal-50/50 bg-sky-50/50 bg-violet-50/50 bg-blue-50/50 bg-emerald-50/50 bg-purple-50/50 bg-indigo-50/50 bg-slate-50/50
   * bg-teal-100/80 bg-sky-100/80 bg-violet-100/80 bg-blue-100/80 bg-emerald-100/80 bg-purple-100/80 bg-indigo-100/80 bg-slate-100/80
   * border-teal-100/50 border-sky-100/50 border-violet-100/50 border-blue-100/50 border-emerald-100/50 border-purple-100/50 border-indigo-100/50 border-slate-100/50
   * border-teal-200/50 border-sky-200/50 border-violet-200/50 border-blue-200/50 border-emerald-200/50 border-purple-200/50 border-indigo-200/50 border-slate-200/50
   * bg-teal-600 bg-sky-600 bg-violet-600 bg-blue-600 bg-emerald-600 bg-purple-600 bg-indigo-600 bg-slate-600
   * text-teal-600 text-sky-600 text-violet-600 text-blue-600 text-emerald-600 text-purple-600 text-indigo-600 text-slate-600
   * bg-teal-50 bg-sky-50 bg-violet-50 bg-blue-50 bg-emerald-50 bg-purple-50 bg-indigo-50 bg-slate-50
   * bg-teal-500 bg-sky-500 bg-violet-500 bg-blue-500 bg-emerald-500 bg-purple-500 bg-indigo-500 bg-slate-500
   * text-teal-700 text-sky-700 text-violet-700 text-blue-700 text-emerald-700 text-purple-700 text-indigo-700 text-slate-700
   */
  const themeStyles = {
    headerBg: `bg-${baseColor}-50/50 backdrop-blur-xl`,
    headerBorder: `border-${baseColor}-100/50`,
    statusColor: `text-${baseColor}-600/60`,
    statusDot: `bg-${baseColor}-500`,
    bubbleBg: `bg-${baseColor}-50`,
    bubbleText: `text-${baseColor}-700`,
    sendBg: `bg-${baseColor}-600 hover:bg-${baseColor}-700 shadow-${baseColor}-200/50`,
    ring: `focus:ring-${baseColor}-100`,
    mutedBg: `bg-${baseColor}-50`,
    mutedText: `text-${baseColor}-600`
  };

  const getActionStyles = (actionColor?: string) => {
    switch (actionColor) {
      case 'sky': return 'bg-sky-50 text-sky-700 border-sky-100 hover:bg-sky-100';
      case 'teal': return 'bg-teal-50 text-teal-700 border-teal-100 hover:bg-teal-100';
      case 'violet': return 'bg-violet-50 text-violet-700 border-violet-100 hover:bg-violet-100';
      case 'blue': return 'bg-blue-50 text-blue-700 border-blue-100 hover:bg-blue-100';
      case 'emerald': return 'bg-emerald-50 text-emerald-700 border-emerald-100 hover:bg-emerald-100';
      case 'gray': return 'bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-200';
      default: return `${themeStyles.bubbleBg} ${themeStyles.bubbleText} border-gray-100/50 hover:bg-opacity-80`;
    }
  };

  const handleSend = () => {
    if (message.trim()) {
      onSendMessage(message);
    }
  };

  const drawerContent = (
    <motion.div
      key={mode}
      drag={mode === 'floating'}
      dragHandle=".ai-drag-handle"
      dragMomentum={false}
      dragConstraints={constraintsRef}
      onDragEnd={(_, info) => {
        onDragEnd?.({ x: Number(dragPosition.x) + info.offset.x, y: Number(dragPosition.y) + info.offset.y });
      }}
      initial={
        mode === 'dock-right' ? { x: 40, opacity: 0, width: 0 } :
        mode === 'dock-left' ? { x: -40, opacity: 0, width: 0 } :
        { opacity: 0, scale: 0.9, y: 20 }
      }
      animate={{ 
          opacity: 1, 
          scale: 1,
          x: mode === 'floating' ? dragPosition.x : 0,
          y: mode === 'floating' ? dragPosition.y : 0,
          width: mode === 'floating' ? undefined : width
      }}
      exit={
        mode === 'dock-right' ? { x: 40, opacity: 0, width: 0 } :
        mode === 'dock-left' ? { x: -40, opacity: 0, width: 0 } :
        { opacity: 0, scale: 0.9, y: 20 }
      }
      transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      className={
        mode === 'floating'
          ? `fixed ${floatingPosition || 'top-8 right-8 w-[310px] sm:w-[340px] md:w-[400px] max-w-[calc(100%-2.5rem)]'} ${!floatingPosition?.includes('w-') ? 'w-[310px] sm:w-[340px] md:w-[400px]' : ''} z-[99999] h-[65vh] md:h-[650px] max-h-[85vh] bg-white border border-gray-200 rounded-[24px] md:rounded-[28px] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.3)] flex flex-col overflow-hidden`
          : `bg-gray-50/50 border-gray-200 flex flex-col shrink-0 z-[60] relative transition-none ${
              mode === 'dock-left' ? 'order-first border-r' : 'order-last border-l'
            }`
      }
      style={{ width: mode === 'floating' ? undefined : width, height: mode === 'floating' ? undefined : height }}
    >
      <div className="flex flex-col h-full bg-white overflow-hidden text-gray-900">
        {/* Standard Header with Mode Controls - Refined with theme-aware light background */}
        <div className={`h-16 border-b ${themeStyles.headerBorder} ${themeStyles.headerBg} text-gray-900 flex items-center justify-between shrink-0 px-6 ai-drag-handle ${mode === 'floating' ? 'cursor-move' : ''}`}>
          <div className="flex items-center gap-3">
            {closeIcon === 'back' && (
              <button
                onClick={(e) => { e.stopPropagation(); onClose(); }}
                className="p-2 -ml-2 hover:bg-black/5 rounded-xl text-gray-500 hover:text-gray-900 transition-all active:scale-95"
              >
                <ArrowLeft size={18} />
              </button>
            )}
            <div className={`w-9 h-9 ${themeStyles.mutedBg} shadow-sm shadow-${baseColor}-100 rounded-xl flex items-center justify-center transition-all`}>
              <Bot size={18} className={themeStyles.mutedText} />
            </div>
            <div>
              <h3 className="font-extrabold text-sm tracking-tight text-gray-900 font-sans">{title}</h3>
              <p className={`text-[10px] ${themeStyles.statusColor} font-medium flex items-center gap-1.5`}>
                <span className={`w-1.5 h-1.5 rounded-full ${themeStyles.statusDot} animate-pulse`} />
                {status}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            {setMode && (
              <div className="flex items-center bg-gray-50 border border-gray-100 p-1 rounded-xl" onClick={(e) => e.stopPropagation()}>
                <button
                  onClick={() => setMode?.('dock-left')}
                  className={`p-1.5 rounded-lg transition-all ${mode === 'dock-left' ? `bg-white ${themeStyles.mutedText.replace('text-', 'text-')} shadow-sm` : 'text-gray-400 hover:text-gray-600'}`}
                >
                  <PanelLeft size={14} />
                </button>
                <button
                  onClick={() => setMode?.('floating')}
                  className={`p-1.5 rounded-md transition-all ${mode === 'floating' ? `bg-white ${themeStyles.mutedText.replace('text-', 'text-')} shadow-sm` : 'text-gray-400 hover:text-gray-600'}`}
                >
                  <Move size={14} />
                </button>
                <button
                  onClick={() => setMode?.('dock-right')}
                  className={`p-1.5 rounded-md transition-all ${mode === 'dock-right' ? `bg-white ${themeStyles.mutedText.replace('text-', 'text-')} shadow-sm` : 'text-gray-400 hover:text-gray-600'}`}
                >
                  <PanelRight size={14} />
                </button>
              </div>
            )}
            {closeIcon !== 'back' && (
              <button
                onClick={(e) => { e.stopPropagation(); onClose(); }}
                className="p-2 hover:bg-gray-100 rounded-xl text-gray-400 hover:text-gray-900 transition-all"
              >
                <X size={18} />
              </button>
            )}
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4 custom-scrollbar bg-gray-50/30">
          {history.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-8 space-y-5">
              <div className={`w-16 h-16 ${themeStyles.bubbleBg} rounded-3xl flex items-center justify-center shadow-inner`}>
                <Sparkles size={32} className={`${themeStyles.statusDot.replace('bg-', 'text-')} opacity-80`} />
              </div>
              <div className="max-w-[240px]">
                <p className="text-sm font-bold text-gray-800">Need help building your Workflow?</p>
                <p className="text-[11px] text-gray-500 mt-2 leading-relaxed">I can help you architect your pipeline, explain nodes, or optimize data flow.</p>
              </div>
              <div className="flex flex-col gap-2.5 w-full max-w-[280px]">
                {/* Default suggested prompts if history is empty */}
                {[
                  { text: "Analyze Flow", icon: <LayoutGrid size={12} /> },
                  { text: "Suggest Nodes", icon: <Sparkles size={12} /> },
                  { text: "Check Links", icon: <Network size={12} /> }
                ].map((item, i) => (
                  <button
                    key={i}
                    onClick={() => setMessage(item.text)}
                    className={`px-4 py-2.5 bg-white hover:${themeStyles.headerBg} border border-gray-100 text-[11px] font-bold text-gray-600 rounded-xl shadow-sm text-left transition-all flex items-center gap-2 group/btn`}
                  >
                    <span className={`p-1 rounded-lg ${themeStyles.mutedBg} ${themeStyles.mutedText} group-hover/btn:bg-white transition-colors`}>
                      {item.icon}
                    </span>
                    {item.text}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            history.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] px-4 py-3 rounded-2xl text-[12px] font-medium leading-relaxed ${
                  msg.role === 'user' 
                    ? `${themeStyles.bubbleBg} ${themeStyles.bubbleText} rounded-tr-none` 
                    : 'bg-white border border-gray-100 text-gray-700 shadow-sm rounded-tl-none'
                }`}>
                  {msg.content}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Pinned Quick Actions */}
        {quickActions.length > 0 && (
          <div className="px-4 py-2 border-t border-gray-50 bg-gray-50/50 flex items-center gap-2 overflow-x-auto scrollbar-none whitespace-nowrap">
            {quickActions.map((action, i) => (
              <button 
                key={i}
                onClick={action.onClick} 
                className={`flex-shrink-0 px-3 py-1.5 rounded-full ${getActionStyles(action.color)} text-[10px] font-bold transition-all border flex items-center gap-1`}
              >
                {action.icon}
                {action.label}
              </button>
            ))}
          </div>
        )}

        {/* Standard Input Area */}
        <div className="p-4 border-t border-gray-100 flex items-center gap-2 bg-white">
          <div className="flex-1 relative">
            <input 
              ref={inputRef}
              type="text" 
              placeholder={placeholder} 
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSend();
              }}
              className={`w-full bg-gray-50 border-none outline-none p-3 pr-10 rounded-xl text-[12px] font-medium focus:ring-2 ${themeStyles.ring} transition-all`}
            />
          </div>
          <button 
            onClick={handleSend}
            className={`p-3 text-white rounded-xl ${themeStyles.sendBg} transition-all shadow-lg drop-shadow-sm flex items-center justify-center`}
          >
            <Send size={16} />
          </button>
        </div>
      </div>
    </motion.div>
  );

  if (mode === 'floating') {
    return createPortal(
      <AnimatePresence>
        {isOpen && drawerContent}
      </AnimatePresence>,
      document.body
    );
  }

  return (
    <AnimatePresence mode="popLayout">
      {isOpen && drawerContent}
    </AnimatePresence>
  );
};

export default AIDrawer;
