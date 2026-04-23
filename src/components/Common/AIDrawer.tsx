import { AnimatePresence, motion } from 'framer-motion';
import {
  AlignLeft,
  ArrowLeft,
  Bot,
  FileText,
  Image as ImageIcon,
  LayoutGrid,
  Link2,
  Move,
  Network,
  Paperclip,
  PanelLeft,
  PanelRight,
  Send,
  Sparkles,
  Table2,
  Upload,
  X,
} from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useModuleTheme } from '../../contexts/ModuleThemeContext';

export type AttachmentType = 'image' | 'pdf' | 'csv' | 'text' | 'url';

export interface Attachment {
  id: string;
  type: AttachmentType;
  name: string;
  preview?: string; // data URL for images
  size?: number;
}

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  attachments?: Attachment[];
}

interface QuickAction {
  label: string;
  icon: React.ReactNode;
  onClick: () => void;
  color?: 'sky' | 'teal' | 'violet' | 'emerald' | 'blue' | 'gray';
}

const FILE_TYPE_META: Record<Exclude<AttachmentType, 'url'>, { label: string; icon: React.ReactNode; accept: string }> = {
  image: { label: 'Image',     icon: <ImageIcon size={13} />, accept: 'image/*' },
  pdf:   { label: 'PDF',       icon: <FileText  size={13} />, accept: '.pdf,application/pdf' },
  csv:   { label: 'CSV',       icon: <Table2    size={13} />, accept: '.csv,text/csv' },
  text:  { label: 'Text file', icon: <AlignLeft size={13} />, accept: '.txt,text/plain' },
};

function detectType(file: File): AttachmentType {
  if (file.type.startsWith('image/')) return 'image';
  if (file.type === 'application/pdf' || file.name.endsWith('.pdf')) return 'pdf';
  if (file.type.includes('csv') || file.name.endsWith('.csv')) return 'csv';
  return 'text';
}

function formatSize(bytes?: number) {
  if (!bytes) return '';
  if (bytes < 1024) return `${bytes}B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)}KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)}MB`;
}

// ── AttachmentChip (input area) ───────────────────────────────────────────────
const AttachmentChip: React.FC<{ att: Attachment; onRemove: (id: string) => void }> = ({ att, onRemove }) => {
  const meta = att.type !== 'url' ? FILE_TYPE_META[att.type] : null;
  return (
    <div className="flex items-center gap-1.5 pl-1.5 pr-1 py-1 bg-mod-surface-hover border border-mod-surface-border rounded-lg text-[10px] font-medium text-mod-surface-text-secondary max-w-[150px] group shrink-0">
      {att.type === 'image' && att.preview
        ? <img src={att.preview} alt={att.name} className="w-5 h-5 rounded object-cover shrink-0" />
        : att.type === 'url'
          ? <Link2 size={12} className="text-mod-hero-icon-color shrink-0" />
          : <span className="text-mod-hero-icon-color shrink-0">{meta?.icon}</span>
      }
      <span className="truncate flex-1">{att.name}</span>
      <button
        onClick={() => onRemove(att.id)}
        className="shrink-0 p-0.5 rounded opacity-0 group-hover:opacity-100 hover:text-rose-500 transition-all"
      >
        <X size={10} />
      </button>
    </div>
  );
};

// ── ChatAttachment (chat history) ─────────────────────────────────────────────
const ChatAttachment: React.FC<{ att: Attachment }> = ({ att }) => {
  const meta = att.type !== 'url' ? FILE_TYPE_META[att.type] : null;

  if (att.type === 'image' && att.preview) {
    return (
      <img
        src={att.preview}
        alt={att.name}
        className="max-w-[200px] max-h-[140px] w-full object-cover rounded-xl border border-mod-surface-border shadow-sm"
      />
    );
  }

  return (
    <div className="flex items-center gap-2 px-2.5 py-2 bg-mod-hero-badge-bg/60 border border-mod-hero-icon-color/20 rounded-xl max-w-[200px]">
      <span className="text-mod-hero-icon-color shrink-0">
        {att.type === 'url' ? <Link2 size={13} /> : meta?.icon}
      </span>
      <div className="min-w-0">
        <p className="text-[10px] font-semibold text-mod-hero-badge-text truncate">{att.name}</p>
        {att.size && (
          <p className="text-[9px] text-mod-hero-icon-color/60">{formatSize(att.size)}</p>
        )}
      </div>
    </div>
  );
};

// ── Props ─────────────────────────────────────────────────────────────────────
interface AIDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  history: ChatMessage[];
  message: string;
  setMessage: (val: string) => void;
  onSendMessage: (val: string, attachments?: Attachment[]) => void;
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
  /** Which attachment types this instance allows. Omit / [] = no attach button. */
  allowedAttachments?: AttachmentType[];
}

// ── Component ─────────────────────────────────────────────────────────────────
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
  quickActions = [],
  constraintsRef,
  width = 440,
  height = '100%',
  themeColor = 'teal',
  placeholder = 'Ask the assistant...',
  floatingPosition,
  dragPosition = { x: 0, y: 0 },
  onDragEnd,
  closeIcon = 'close',
  allowedAttachments = [],
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const attachMenuRef = useRef<HTMLDivElement>(null);
  const historyEndRef = useRef<HTMLDivElement>(null);
  const moduleTheme = useModuleTheme();
  const resolvedTheme = moduleTheme ?? document.documentElement.getAttribute('data-theme') ?? undefined;

  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [showAttachMenu, setShowAttachMenu] = useState(false);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [urlValue, setUrlValue] = useState('');

  // Use ref to avoid stale-closure race condition in the file input onChange
  const pendingAcceptRef = useRef<string>('');

  const fileTypes = allowedAttachments.filter((t): t is Exclude<AttachmentType, 'url'> => t !== 'url');
  const hasFileUpload = fileTypes.length > 0;
  const hasUrl = allowedAttachments.includes('url');
  const hasAttachBtn = hasFileUpload || hasUrl;

  // Combined accept string for the file picker
  const combinedAccept = fileTypes.map(t => FILE_TYPE_META[t].accept).join(',');

  // Auto-focus
  useEffect(() => {
    if (isOpen) setTimeout(() => textareaRef.current?.focus(), 100);
  }, [isOpen]);

  // Scroll to bottom on new messages
  useEffect(() => {
    historyEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  // Auto-resize textarea
  const syncHeight = () => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${Math.min(el.scrollHeight, 120)}px`;
  };

  useEffect(() => { syncHeight(); }, [message]);

  // Close dropdown on outside click
  useEffect(() => {
    if (!showAttachMenu) return;
    const handler = (e: MouseEvent) => {
      if (attachMenuRef.current && !attachMenuRef.current.contains(e.target as Node))
        setShowAttachMenu(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [showAttachMenu]);

  // ── Theme tokens ────────────────────────────────────────────────────────────
  const themeStyles = {
    headerBg: 'bg-mod-hero-badge-bg/60 backdrop-blur-xl',
    headerBorder: 'border-mod-hero-icon-color/20',
    statusColor: 'text-mod-hero-icon-color/70',
    statusDot: 'bg-mod-hero-icon-color',
    bubbleBg: 'bg-mod-hero-badge-bg',
    bubbleText: 'text-mod-hero-badge-text',
    sendBg: 'bg-mod-hero-btn-bg hover:bg-mod-hero-btn-hover',
    ring: 'focus-within:ring-mod-hero-badge-bg',
    mutedBg: 'bg-mod-hero-badge-bg',
    mutedText: 'text-mod-hero-icon-color',
  };

  // ── Attachment handlers ─────────────────────────────────────────────────────
  const addFileAttachment = (file: File) => {
    const type = detectType(file);
    if (!fileTypes.includes(type as Exclude<AttachmentType, 'url'>)) return;
    if (type === 'image') {
      const reader = new FileReader();
      reader.onload = (ev) =>
        setAttachments(prev => [...prev, {
          id: crypto.randomUUID(), type, name: file.name, size: file.size,
          preview: ev.target?.result as string,
        }]);
      reader.readAsDataURL(file);
    } else {
      setAttachments(prev => [...prev, { id: crypto.randomUUID(), type, name: file.name, size: file.size }]);
    }
  };

  const handleOpenFilePicker = () => {
    setShowAttachMenu(false);
    if (!fileInputRef.current) return;
    pendingAcceptRef.current = combinedAccept;
    fileInputRef.current.accept = combinedAccept;
    fileInputRef.current.value = '';
    fileInputRef.current.click();
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) addFileAttachment(file);
  };

  const handleOpenUrlInput = () => {
    setShowAttachMenu(false);
    setShowUrlInput(true);
  };

  const handleAddUrl = () => {
    const trimmed = urlValue.trim();
    if (!trimmed) return;
    setAttachments(prev => [...prev, { id: crypto.randomUUID(), type: 'url', name: trimmed }]);
    setUrlValue('');
    setShowUrlInput(false);
    textareaRef.current?.focus();
  };

  const removeAttachment = (id: string) =>
    setAttachments(prev => prev.filter(a => a.id !== id));

  const handlePaste = (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
    if (!hasFileUpload || !fileTypes.includes('image')) return;
    const items = Array.from(e.clipboardData.items) as DataTransferItem[];
    const img = items.find(i => i.type.startsWith('image/'));
    if (img) {
      const file = img.getAsFile();
      if (file) { e.preventDefault(); addFileAttachment(file); }
    }
  };

  // ── Send ────────────────────────────────────────────────────────────────────
  const handleSend = () => {
    if (!message.trim() && attachments.length === 0) return;
    onSendMessage(message, attachments.length > 0 ? attachments : undefined);
    setMessage('');
    setAttachments([]);
    setShowUrlInput(false);
    setUrlValue('');
  };

  // ── File types label for the upload button ──────────────────────────────────
  const fileTypeLabels = fileTypes.map(t => FILE_TYPE_META[t].label).join(', ');

  // ── Drawer JSX ──────────────────────────────────────────────────────────────
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
        mode === 'dock-left'  ? { x: -40, opacity: 0, width: 0 } :
        { opacity: 0, scale: 0.9, y: 20 }
      }
      animate={{
        opacity: 1, scale: 1,
        x: mode === 'floating' ? dragPosition.x : 0,
        y: mode === 'floating' ? dragPosition.y : 0,
        width: mode === 'floating' ? undefined : width,
      }}
      exit={
        mode === 'dock-right' ? { x: 40, opacity: 0, width: 0 } :
        mode === 'dock-left'  ? { x: -40, opacity: 0, width: 0 } :
        { opacity: 0, scale: 0.9, y: 20 }
      }
      transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      className={
        mode === 'floating'
          ? `fixed ${floatingPosition || 'top-8 right-8'} ${!floatingPosition?.includes('w-') ? 'w-[310px] sm:w-[340px] md:w-[400px]' : ''} max-w-[calc(100%-2.5rem)] z-[99999] h-[65vh] md:h-[650px] max-h-[85vh] bg-mod-surface-card border border-mod-surface-border rounded-[24px] md:rounded-[28px] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.3)] flex flex-col overflow-hidden`
          : `bg-mod-surface-bg border-mod-surface-border flex flex-col shrink-0 z-[60] relative transition-none ${
              mode === 'dock-left' ? 'order-first border-r' : 'order-last border-l'
            }`
      }
      style={{ width: mode === 'floating' ? undefined : width, height: mode === 'floating' ? undefined : height }}
    >
      <div className="flex flex-col h-full bg-mod-surface-card overflow-hidden text-mod-surface-text-primary">

        {/* ── Header ── */}
        <div className={`h-16 border-b ${themeStyles.headerBorder} ${themeStyles.headerBg} flex items-center justify-between shrink-0 px-6 ai-drag-handle ${mode === 'floating' ? 'cursor-move' : ''}`}>
          <div className="flex items-center gap-3">
            {closeIcon === 'back' && (
              <button onClick={(e) => { e.stopPropagation(); onClose(); }}
                className="p-2 -ml-2 hover:bg-mod-surface-hover rounded-xl text-mod-surface-text-muted hover:text-mod-surface-text-primary transition-all active:scale-95">
                <ArrowLeft size={18} />
              </button>
            )}
            <div className={`w-9 h-9 ${themeStyles.mutedBg} shadow-sm rounded-xl flex items-center justify-center`}>
              <Bot size={18} className={themeStyles.mutedText} />
            </div>
            <div>
              <h3 className="font-extrabold text-sm tracking-tight text-mod-surface-text-primary">{title}</h3>
              <p className={`text-[10px] ${themeStyles.statusColor} font-medium flex items-center gap-1.5`}>
                <span className={`w-1.5 h-1.5 rounded-full ${themeStyles.statusDot} animate-pulse`} />
                {status}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {setMode && (
              <div className="flex items-center bg-mod-surface-skeleton/40 border border-mod-surface-border p-1 rounded-xl" onClick={e => e.stopPropagation()}>
                {(['dock-left', 'floating', 'dock-right'] as const).map((m, idx) => (
                  <button key={m} onClick={() => setMode?.(m)}
                    className={`p-1.5 rounded-lg transition-all ${mode === m ? `bg-mod-surface-card ${themeStyles.mutedText} shadow-sm` : 'text-mod-surface-text-muted hover:text-mod-surface-text-secondary'}`}>
                    {idx === 0 ? <PanelLeft size={14} /> : idx === 1 ? <Move size={14} /> : <PanelRight size={14} />}
                  </button>
                ))}
              </div>
            )}
            {closeIcon !== 'back' && (
              <button onClick={(e) => { e.stopPropagation(); onClose(); }}
                className="p-2 hover:bg-mod-surface-hover rounded-xl text-mod-surface-text-muted hover:text-mod-surface-text-primary transition-all">
                <X size={18} />
              </button>
            )}
          </div>
        </div>

        {/* ── Chat history ── */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4 scrollbar-custom bg-mod-surface-bg">
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
                  { text: 'Analyze Flow',  icon: <LayoutGrid size={12} /> },
                  { text: 'Suggest Nodes', icon: <Sparkles  size={12} /> },
                  { text: 'Check Links',   icon: <Network   size={12} /> },
                ].map((item, i) => (
                  <button key={i} onClick={() => setMessage(item.text)}
                    className="px-4 py-2.5 bg-mod-surface-card hover:bg-mod-surface-hover border border-mod-surface-border text-[11px] font-bold text-mod-surface-text-secondary rounded-xl shadow-sm text-left transition-all flex items-center gap-2">
                    <span className={`p-1 rounded-lg ${themeStyles.mutedBg} ${themeStyles.mutedText}`}>{item.icon}</span>
                    {item.text}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            history.map((msg, i) => (
              <div key={i} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'} gap-1.5`}>

                {/* Attachments (user messages only) */}
                {msg.role === 'user' && msg.attachments && msg.attachments.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 justify-end max-w-[85%]">
                    {msg.attachments.map(att => (
                      <ChatAttachment key={att.id} att={att} />
                    ))}
                  </div>
                )}

                {/* Text bubble — skip if empty */}
                {msg.content.trim() && (
                  <div className={`max-w-[85%] px-4 py-3 rounded-2xl text-[12px] font-medium leading-relaxed ${
                    msg.role === 'user'
                      ? `${themeStyles.bubbleBg} ${themeStyles.bubbleText} rounded-tr-none`
                      : 'bg-mod-surface-skeleton/30 border border-mod-surface-border text-mod-surface-text-secondary shadow-sm rounded-tl-none'
                  }`}>
                    {msg.content}
                  </div>
                )}
              </div>
            ))
          )}
          <div ref={historyEndRef} />
        </div>

        {/* ── Quick actions ── */}
        {quickActions.length > 0 && (
          <div className="px-4 py-2 border-t border-mod-surface-border bg-mod-surface-bg flex items-center gap-2 overflow-x-auto scrollbar-hidden whitespace-nowrap">
            {quickActions.map((action, i) => (
              <button key={i} onClick={action.onClick}
                className="flex-shrink-0 px-3 py-1.5 rounded-full bg-mod-hero-badge-bg text-mod-hero-badge-text border border-mod-hero-icon-color/20 hover:bg-mod-hero-badge-bg/80 text-[10px] font-bold transition-all flex items-center gap-1">
                {action.icon}{action.label}
              </button>
            ))}
          </div>
        )}

        {/* ── Input card ── */}
        <div className="p-3 border-t border-mod-surface-border bg-mod-surface-card">
          <div className={`rounded-2xl border border-mod-surface-border bg-mod-surface-input-bg focus-within:ring-2 ${themeStyles.ring} transition-all`}>

            {/* Attachment chips */}
            <AnimatePresence>
              {attachments.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="flex flex-wrap gap-1.5 px-3 pt-2.5"
                >
                  {attachments.map(att => (
                    <AttachmentChip key={att.id} att={att} onRemove={removeAttachment} />
                  ))}
                </motion.div>
              )}
            </AnimatePresence>

            {/* URL inline input */}
            <AnimatePresence>
              {showUrlInput && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="flex items-center gap-2 px-3 pt-2.5"
                >
                  <Link2 size={13} className="text-mod-hero-icon-color shrink-0" />
                  <input
                    autoFocus
                    type="url"
                    value={urlValue}
                    onChange={e => setUrlValue(e.target.value)}
                    onKeyDown={e => {
                      if (e.key === 'Enter') { e.preventDefault(); handleAddUrl(); }
                      if (e.key === 'Escape') { setShowUrlInput(false); setUrlValue(''); }
                    }}
                    placeholder="Paste a URL and press Enter…"
                    className="flex-1 bg-transparent text-[11px] text-mod-surface-text-primary placeholder:text-mod-surface-text-muted outline-none min-w-0"
                  />
                  <button onClick={() => { setShowUrlInput(false); setUrlValue(''); }}
                    className="text-mod-surface-text-muted hover:text-rose-500 transition-colors shrink-0">
                    <X size={12} />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Textarea */}
            <textarea
              ref={textareaRef}
              value={message}
              onChange={e => { setMessage(e.target.value); syncHeight(); }}
              onPaste={handlePaste}
              onKeyDown={e => {
                if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }
              }}
              placeholder={placeholder}
              rows={1}
              className="w-full bg-transparent px-3 pt-2.5 pb-1 text-[12px] font-medium text-mod-surface-text-primary placeholder:text-mod-surface-text-muted outline-none resize-none"
              style={{ minHeight: '36px', maxHeight: '120px' }}
            />

            {/* Bottom bar: attach button + send */}
            <div className="flex items-center justify-between px-2 py-1.5">

              {/* Attach button + dropdown */}
              <div className="flex items-center gap-0.5">
                {hasAttachBtn && (
                  <div className="relative" ref={attachMenuRef}>
                    <button
                      onClick={() => setShowAttachMenu(v => !v)}
                      title="Attach"
                      className={`p-1.5 rounded-lg transition-all ${showAttachMenu
                        ? `${themeStyles.mutedBg} ${themeStyles.mutedText}`
                        : 'text-mod-surface-text-muted hover:text-mod-surface-text-primary hover:bg-mod-surface-hover'}`}
                    >
                      <Paperclip size={14} />
                    </button>

                    <AnimatePresence>
                      {showAttachMenu && (
                        <motion.div
                          initial={{ opacity: 0, y: 6, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 6, scale: 0.95 }}
                          transition={{ duration: 0.12 }}
                          className="absolute bottom-full left-0 mb-2 bg-mod-surface-card border border-mod-surface-border rounded-xl shadow-xl overflow-hidden z-50 w-52"
                        >
                          {hasFileUpload && (
                            <button
                              onClick={handleOpenFilePicker}
                              className="w-full flex items-start gap-3 px-3 py-2.5 hover:bg-mod-surface-hover transition-colors text-left group"
                            >
                              <span className="mt-0.5 p-1.5 rounded-lg bg-mod-hero-badge-bg text-mod-hero-icon-color shrink-0 group-hover:bg-mod-hero-badge-bg/80">
                                <Upload size={13} />
                              </span>
                              <div>
                                <p className="text-[11px] font-semibold text-mod-surface-text-primary">Upload file</p>
                                <p className="text-[9px] text-mod-surface-text-muted mt-0.5">{fileTypeLabels}</p>
                              </div>
                            </button>
                          )}

                          {hasFileUpload && hasUrl && (
                            <div className="mx-3 border-t border-mod-surface-border" />
                          )}

                          {hasUrl && (
                            <button
                              onClick={handleOpenUrlInput}
                              className="w-full flex items-start gap-3 px-3 py-2.5 hover:bg-mod-surface-hover transition-colors text-left group"
                            >
                              <span className="mt-0.5 p-1.5 rounded-lg bg-mod-hero-badge-bg text-mod-hero-icon-color shrink-0 group-hover:bg-mod-hero-badge-bg/80">
                                <Link2 size={13} />
                              </span>
                              <div>
                                <p className="text-[11px] font-semibold text-mod-surface-text-primary">Add URL</p>
                                <p className="text-[9px] text-mod-surface-text-muted mt-0.5">Paste any web address</p>
                              </div>
                            </button>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )}
              </div>

              <button
                onClick={handleSend}
                disabled={!message.trim() && attachments.length === 0}
                className={`p-2 rounded-xl text-white ${themeStyles.sendBg} transition-all shadow-sm flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed active:scale-95`}
              >
                <Send size={14} />
              </button>
            </div>
          </div>
        </div>
      </div>

      <input ref={fileInputRef} type="file" className="hidden" onChange={handleFileInputChange} />
    </motion.div>
  );

  if (mode === 'floating') {
    return createPortal(
      <div data-theme={resolvedTheme}>
        <AnimatePresence>{isOpen && drawerContent}</AnimatePresence>
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
