import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeft, Bot, LayoutGrid, Move, Network, PanelLeft, PanelRight, Send, Sparkles, X } from 'lucide-react';
import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useModuleTheme } from '../../contexts/ModuleThemeContext';

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
  const moduleTheme = useModuleTheme();
  const resolvedTheme = moduleTheme ?? document.documentElement.getAttribute('data-theme') ?? undefined;

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

  const themeStyles = {
    headerBg: 'bg-mod-hero-badge-bg/60 backdrop-blur-xl',
    headerBorder: 'border-mod-hero-icon-color/20',
    statusColor: 'text-mod-hero-icon-color/70',
    statusDot: 'bg-mod-hero-icon-color',
    bubbleBg: 'bg-mod-hero-badge-bg',
    bubbleText: 'text-mod-hero-badge-text',
    sendBg: 'bg-mod-hero-btn-bg hover:bg-mod-hero-btn-hover shadow-mod-hero-btn-shadow/30',
    ring: 'focus:ring-mod-hero-badge-bg',
    mutedBg: 'bg-mod-hero-badge-bg',
    mutedText: 'text-mod-hero-icon-color'
  };

  const getActionStyles = (_actionColor?: string) => {
    return 'bg-mod-hero-badge-bg text-mod-hero-badge-text border-mod-hero-icon-color/20 hover:bg-mod-hero-badge-bg/80';
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
          ? `fixed ${floatingPosition || 'top-8 right-8 w-[310px] sm:w-[340px] md:w-[400px] max-w-[calc(100%-2.5rem)]'} ${!floatingPosition?.includes('w-') ? 'w-[310px] sm:w-[340px] md:w-[400px]' : ''} z-[99999] h-[65vh] md:h-[650px] max-h-[85vh] bg-mod-surface-card border border-mod-surface-border rounded-[24px] md:rounded-[28px] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.3)] flex flex-col overflow-hidden`
          : `bg-mod-surface-bg border-mod-surface-border flex flex-col shrink-0 z-[60] relative transition-none ${
              mode === 'dock-left' ? 'order-first border-r' : 'order-last border-l'
            }`
      }
      style={{ width: mode === 'floating' ? undefined : width, height: mode === 'floating' ? undefined : height }}
    >
      <div className="flex flex-col h-full bg-mod-surface-card overflow-hidden text-mod-surface-text-primary">
        {/* Header */}
        <div className={`h-16 border-b ${themeStyles.headerBorder} ${themeStyles.headerBg} flex items-center justify-between shrink-0 px-6 ai-drag-handle ${mode === 'floating' ? 'cursor-move' : ''}`}>
          <div className="flex items-center gap-3">
            {closeIcon === 'back' && (
              <button
                onClick={(e) => { e.stopPropagation(); onClose(); }}
                className="p-2 -ml-2 hover:bg-mod-surface-hover rounded-xl text-mod-surface-text-muted hover:text-mod-surface-text-primary transition-all active:scale-95"
              >
                <ArrowLeft size={18} />
              </button>
            )}
            <div className={`w-9 h-9 ${themeStyles.mutedBg} shadow-sm rounded-xl flex items-center justify-center transition-all`}>
              <Bot size={18} className={themeStyles.mutedText} />
            </div>
            <div>
              <h3 className="font-extrabold text-sm tracking-tight text-mod-surface-text-primary font-sans">{title}</h3>
              <p className={`text-[10px] ${themeStyles.statusColor} font-medium flex items-center gap-1.5`}>
                <span className={`w-1.5 h-1.5 rounded-full ${themeStyles.statusDot} animate-pulse`} />
                {status}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {setMode && (
              <div className="flex items-center bg-mod-surface-skeleton/40 border border-mod-surface-border p-1 rounded-xl" onClick={(e) => e.stopPropagation()}>
                <button
                  onClick={() => setMode?.('dock-left')}
                  className={`p-1.5 rounded-lg transition-all ${mode === 'dock-left' ? `bg-mod-surface-card ${themeStyles.mutedText} shadow-sm` : 'text-mod-surface-text-muted hover:text-mod-surface-text-secondary'}`}
                >
                  <PanelLeft size={14} />
                </button>
                <button
                  onClick={() => setMode?.('floating')}
                  className={`p-1.5 rounded-md transition-all ${mode === 'floating' ? `bg-mod-surface-card ${themeStyles.mutedText} shadow-sm` : 'text-mod-surface-text-muted hover:text-mod-surface-text-secondary'}`}
                >
                  <Move size={14} />
                </button>
                <button
                  onClick={() => setMode?.('dock-right')}
                  className={`p-1.5 rounded-md transition-all ${mode === 'dock-right' ? `bg-mod-surface-card ${themeStyles.mutedText} shadow-sm` : 'text-mod-surface-text-muted hover:text-mod-surface-text-secondary'}`}
                >
                  <PanelRight size={14} />
                </button>
              </div>
            )}
            {closeIcon !== 'back' && (
              <button
                onClick={(e) => { e.stopPropagation(); onClose(); }}
                className="p-2 hover:bg-mod-surface-hover rounded-xl text-mod-surface-text-muted hover:text-mod-surface-text-primary transition-all"
              >
                <X size={18} />
              </button>
            )}
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4 custom-scrollbar bg-mod-surface-bg">
          {history.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-8 space-y-5">
              <div className={`w-16 h-16 ${themeStyles.bubbleBg} rounded-3xl flex items-center justify-center shadow-inner`}>
                <Sparkles size={32} className={`${themeStyles.statusDot.replace('bg-', 'text-')} opacity-80`} />
              </div>
              <div className="max-w-[240px]">
                <p className="text-sm font-bold text-mod-surface-text-primary">Need help building your Workflow?</p>
                <p className="text-[11px] text-mod-surface-text-muted mt-2 leading-relaxed">I can help you architect your pipeline, explain nodes, or optimize data flow.</p>
              </div>
              <div className="flex flex-col gap-2.5 w-full max-w-[280px]">
                {[
                  { text: "Analyze Flow", icon: <LayoutGrid size={12} /> },
                  { text: "Suggest Nodes", icon: <Sparkles size={12} /> },
                  { text: "Check Links", icon: <Network size={12} /> }
                ].map((item, i) => (
                  <button
                    key={i}
                    onClick={() => setMessage(item.text)}
                    className={`px-4 py-2.5 bg-mod-surface-card hover:bg-mod-surface-hover border border-mod-surface-border text-[11px] font-bold text-mod-surface-text-secondary rounded-xl shadow-sm text-left transition-all flex items-center gap-2 group/btn`}
                  >
                    <span className={`p-1 rounded-lg ${themeStyles.mutedBg} ${themeStyles.mutedText} transition-colors`}>
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
                    : 'bg-mod-surface-skeleton/30 border border-mod-surface-border text-mod-surface-text-secondary shadow-sm rounded-tl-none'
                }`}>
                  {msg.content}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Pinned Quick Actions */}
        {quickActions.length > 0 && (
          <div className="px-4 py-2 border-t border-mod-surface-border bg-mod-surface-bg flex items-center gap-2 overflow-x-auto scrollbar-none whitespace-nowrap">
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

        {/* Input Area */}
        <div className="p-4 border-t border-mod-surface-border flex items-center gap-2 bg-mod-surface-card">
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
              className={`w-full bg-mod-surface-input-bg border border-mod-surface-input-border text-mod-surface-text-primary placeholder:text-mod-surface-text-muted outline-none p-3 pr-10 rounded-xl text-[12px] font-medium focus:ring-2 ${themeStyles.ring} transition-all`}
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
      <div data-theme={resolvedTheme}>
        <AnimatePresence>
          {isOpen && drawerContent}
        </AnimatePresence>
      </div>,
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
