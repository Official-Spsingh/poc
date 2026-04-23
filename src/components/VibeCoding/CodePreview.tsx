import { AnimatePresence, motion } from 'framer-motion';
import { Minimize2, Terminal as ConsoleIcon, Zap } from 'lucide-react';
import React from 'react';
import ReactDOM from 'react-dom';

interface CodePreviewProps {
  device: 'desktop' | 'tablet' | 'mobile';
  baseHTML: string | null;
  vfsPayload: string;
  reloadKey: number;
  showConsole: boolean;
  consoleLogs: { type: 'log' | 'error' | 'warn', message: string, time: string }[];
  setConsoleLogs: React.Dispatch<React.SetStateAction<any[]>>;
  isFullscreen: boolean;
  setIsFullscreen: React.Dispatch<React.SetStateAction<boolean>>;
  projectId?: string;
}

const DEVICE_PRESETS = {
  desktop: { width: '100%', height: '100%', radius: '0px' },
  tablet: { width: '768px', height: '1024px', radius: '32px' },
  mobile: { width: '375px', height: '812px', radius: '40px' }
};

interface LoadingOverlayProps {
  isVisible: boolean;
  size?: 'normal' | 'large';
}

const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ isVisible, size = 'normal' }) => {
  const isLarge = size === 'large';
  
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 top-10 flex flex-col items-center justify-center bg-mod-surface-card z-10"
        >
          <div className={`relative flex items-center justify-center ${isLarge ? 'w-16 h-16 mb-6' : 'w-12 h-12 mb-5'}`}>
            <div className={`absolute inset-0 rounded-full ${isLarge ? 'border-4' : 'border-[3px]'} border-mod-surface-border`} />
            <div className={`absolute inset-0 rounded-full ${isLarge ? 'border-4' : 'border-[3px]'} border-mod-hero-icon-color border-t-transparent animate-spin`} />
            <Zap size={isLarge ? 20 : 16} className="text-mod-hero-icon-color animate-pulse" />
          </div>
          <div className={`${isLarge ? 'text-xs' : 'text-[11px]'} font-black uppercase tracking-[0.2em] text-mod-surface-text-primary mb-2`}>
            Building Visual
          </div>
          <div className={`${isLarge ? 'text-[11px]' : 'text-[10px]'} font-semibold text-mod-surface-text-muted`}>
            Transpiling and rendering{isLarge ? ' components...' : '...'}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const CodePreview: React.FC<CodePreviewProps> = ({
  device,
  baseHTML,
  vfsPayload,
  reloadKey,
  showConsole,
  consoleLogs,
  setConsoleLogs,
  isFullscreen,
  setIsFullscreen,
  projectId
}) => {
  const iframeRef = React.useRef<HTMLIFrameElement>(null);
  const fsIframeRef = React.useRef<HTMLIFrameElement>(null);
  const preset = DEVICE_PRESETS[device];

  const [loadedKey, setLoadedKey] = React.useState(-1);
  const [loadedHtml, setLoadedHtml] = React.useState<string | null>(null);
  const [fsLoadedKey, setFsLoadedKey] = React.useState(-1);
  const [fsLoadedHtml, setFsLoadedHtml] = React.useState<string | null>(null);

  const isLoading = loadedKey !== reloadKey || loadedHtml !== baseHTML;
  const fsIsLoading = fsLoadedKey !== reloadKey || fsLoadedHtml !== baseHTML;

  React.useEffect(() => {
    if (!isFullscreen) {
      setFsLoadedKey(-1);
      setFsLoadedHtml(null);
    }
  }, [isFullscreen]);

  React.useEffect(() => {
    if (!vfsPayload) return;
    iframeRef.current?.contentWindow?.postMessage({ type: 'STUDIO_VFS_UPDATE', payload: vfsPayload }, '*');
    fsIframeRef.current?.contentWindow?.postMessage({ type: 'STUDIO_VFS_UPDATE', payload: vfsPayload }, '*');
  }, [vfsPayload, baseHTML, reloadKey]);

  const fullscreenPortal = ReactDOM.createPortal(
    <AnimatePresence>
      {isFullscreen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="bg-mod-surface-card"
          style={{ position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', flexDirection: 'column' }}
        >
          <div className="h-10 bg-mod-surface-hover border-b border-mod-surface-border flex items-center justify-between px-4 shrink-0">
            <div className="flex gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-rose-400" />
              <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
            </div>
            <div className="px-3 py-1 bg-mod-surface-card border border-mod-surface-border rounded-md text-[9px] text-mod-surface-text-muted font-mono tracking-tight text-center">
              vibe-coding-studio.local/preview
            </div>
            <button
              onClick={() => setIsFullscreen(false)}
              className="flex items-center gap-1.5 text-mod-surface-text-muted hover:text-mod-surface-text-primary transition-colors text-[10px] font-bold uppercase tracking-widest"
            >
              <Minimize2 size={12} />
              <span>Exit</span>
            </button>
          </div>
          <iframe
            ref={fsIframeRef}
            key={`fs-${reloadKey}`}
            srcDoc={baseHTML || ''}
            style={{ flex: 1, width: '100%', border: 'none', opacity: fsIsLoading ? 0 : 1, transition: 'opacity 0.3s' }}
            title="Live Visual Fullscreen"
            sandbox="allow-scripts allow-modals allow-same-origin"
            onLoad={() => {
              setFsLoadedKey(reloadKey);
              setFsLoadedHtml(baseHTML);
              if (fsIframeRef.current?.contentWindow && vfsPayload) {
                fsIframeRef.current.contentWindow.postMessage({ type: 'STUDIO_VFS_UPDATE', payload: vfsPayload }, '*');
              }
            }}
          />
          <LoadingOverlay isVisible={fsIsLoading} size="large" />
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );

  return (
    <motion.div
      key={`preview-${projectId}-${reloadKey}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex-1 overflow-hidden flex flex-col items-center justify-center relative"
    >
      <div
        className="bg-mod-surface-card overflow-hidden flex flex-col relative transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-mod-surface-border"
        style={{
          width: preset.width,
          height: preset.height,
          borderRadius: preset.radius,
          maxWidth: '100%',
          maxHeight: '100%'
        }}
      >
        {/* Browser chrome */}
        <div className="h-10 bg-mod-surface-hover border-b border-mod-surface-border flex items-center justify-between px-4 shrink-0">
          <div className="flex gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-rose-400" />
            <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
          </div>
          <div className="px-3 py-1 bg-mod-surface-card border border-mod-surface-border rounded-md text-[9px] text-mod-surface-text-muted font-mono tracking-tight w-1/3 text-center truncate">
            vibe-coding-studio.local/preview
          </div>
          <div className="w-14" />
        </div>

        <iframe
          ref={iframeRef}
          key={reloadKey}
          srcDoc={baseHTML || ''}
          className={`flex-1 w-full h-full border-none transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
          title="Live Visual Sandbox"
          sandbox="allow-scripts allow-modals allow-same-origin"
          onLoad={() => {
            setLoadedKey(reloadKey);
            setLoadedHtml(baseHTML);
            if (iframeRef.current?.contentWindow && vfsPayload) {
              iframeRef.current.contentWindow.postMessage({ type: 'STUDIO_VFS_UPDATE', payload: vfsPayload }, '*');
            }
          }}
        />

        <LoadingOverlay isVisible={isLoading} size="normal" />

        <AnimatePresence>
          {showConsole && (
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
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
              <div className="flex-1 overflow-y-auto p-4 font-mono text-[11px] space-y-1 scrollbar-custom bg-slate-950/50">
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

      {fullscreenPortal}
    </motion.div>
  );
};

export default CodePreview;
