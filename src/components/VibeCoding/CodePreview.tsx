import { AnimatePresence, motion } from 'framer-motion';
import { Terminal as ConsoleIcon, RotateCw } from 'lucide-react';
import React from 'react';

interface CodePreviewProps {
  device: 'desktop' | 'tablet' | 'mobile';
  previewData: string | null;
  reloadKey: number;
  setReloadKey: React.Dispatch<React.SetStateAction<number>>;
  showConsole: boolean;
  setShowConsole: React.Dispatch<React.SetStateAction<boolean>>;
  consoleLogs: { type: 'log' | 'error' | 'warn', message: string, time: string }[];
  setConsoleLogs: React.Dispatch<React.SetStateAction<any[]>>;
  projectId?: string;
}

const CodePreview: React.FC<CodePreviewProps> = ({
  device,
  previewData,
  reloadKey,
  setReloadKey,
  showConsole,
  setShowConsole,
  consoleLogs,
  setConsoleLogs,
  projectId
}) => {
  return (
    <motion.div
      key={`preview-${projectId}-${reloadKey}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex-1 overflow-hidden flex flex-col items-center justify-center relative"
    >
       <div className={`bg-mod-surface-card overflow-hidden flex flex-col relative transition-all duration-300 ease-in-out ${
           device === 'desktop' ? 'w-full h-full' :
           device === 'tablet' ? 'w-[768px] h-[1024px] max-h-full rounded-b-none md:rounded-[32px]' :
           'w-[375px] h-[812px] max-h-full rounded-b-none md:rounded-[40px]'
       }`}>
          <div className="h-10 bg-mod-surface-hover border-b border-mod-surface-border flex items-center justify-between px-4 shrink-0">
            <div className="flex gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-rose-400" />
              <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
            </div>
            <div className="px-3 py-1 bg-mod-surface-card border border-mod-surface-border rounded-md text-[9px] text-mod-surface-text-muted font-mono tracking-tight w-1/3 text-center truncate">
               vibe-coding-studio.local/preview
            </div>
            <div className="flex gap-3">
               <button
                 onClick={() => setReloadKey(k => k + 1)}
                 className="text-mod-surface-text-muted hover:text-mod-hero-icon-color transition-colors"
                 title="Reload Preview"
               >
                  <RotateCw size={12} />
               </button>
               <button
                 onClick={() => setShowConsole(!showConsole)}
                 className={`transition-colors ${showConsole ? 'text-mod-hero-icon-color' : 'text-mod-surface-text-muted hover:text-mod-hero-icon-color'}`}
                 title="Toggle Console"
               >
                  <ConsoleIcon size={12} />
               </button>
            </div>
          </div>

          <iframe 
            key={reloadKey}
            srcDoc={previewData || ''}
            className="flex-1 w-full h-full border-none"
            title="Live Visual Sandbox"
            sandbox="allow-scripts allow-modals allow-same-origin"
          />
          
          <AnimatePresence>
            {showConsole && (
              <motion.div 
                initial={{ y: "100%" }} 
                animate={{ y: 0 }} 
                exit={{ y: "100%" }}
                className="absolute bottom-0 left-0 right-0 h-1/3 bg-slate-900 border-t border-slate-800 z-30 flex flex-col"
              >
                 <div className="h-10 bg-slate-800 flex items-center justify-between px-6 shrink-0">
                    <div className="flex items-center gap-3">
                       <ConsoleIcon size={14} className="text-mod-hero-icon-color" />
                       <span className="text-[10px] font-black uppercase tracking-widest text-slate-300">Sandbox Console</span>
                       <span className="px-2 py-0.5 bg-slate-700 text-slate-400 rounded text-[9px]">{consoleLogs.length} events</span>
                    </div>
                    <button onClick={() => setConsoleLogs([])} className="text-[9px] font-bold text-slate-500 hover:text-white uppercase tracking-widest">Clear</button>
                 </div>
                 <div className="flex-1 overflow-y-auto p-4 font-mono text-[11px] space-y-1 custom-scrollbar bg-slate-950/50">
                    {consoleLogs.length === 0 ? (
                      <div className="h-full flex items-center justify-center text-slate-700 italic text-[11px] font-bold uppercase tracking-widest animate-pulse">Waiting for Studio initialization...</div>
                    ) : (
                      consoleLogs.map((log, i) => (
                        <div key={i} className={`flex gap-4 border-b border-slate-900 pb-1 ${log.type === 'error' ? 'text-rose-400 font-bold' : log.type === 'warn' ? 'text-amber-400' : 'text-slate-400'}`}>
                           <span className="opacity-30 shrink-0">[{log.time}]</span>
                           <span className={log.type === 'error' ? 'bg-rose-950/30 px-1' : ''}>{log.message}</span>
                        </div>
                      ))
                    )}
                 </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="absolute bottom-4 right-4 z-20">
             <div className="flex items-center gap-2 px-3 py-1.5 bg-mod-header-btn-bg text-mod-header-btn-text rounded-full text-[9px] font-bold shadow-xl border border-mod-hero-icon-color/20">
                <span className="w-1.5 h-1.5 rounded-full bg-mod-header-btn-text animate-pulse" />
                COMPILER SYNCED
             </div>
          </div>
       </div>
    </motion.div>
  );
};

export default CodePreview;
