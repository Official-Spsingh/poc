
import { strToU8, zip } from 'fflate';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ChevronDown,
  Clock,
  Download,
  Maximize2,
  Monitor,
  Rocket,
  RotateCw,
  Settings,
  Smartphone,
  Tablet,
  Terminal as ConsoleIcon,
  X,
} from 'lucide-react';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { type Attachment } from '../Common/AIDrawer';
import AIDrawer from '../Common/AIDrawer';
import CodePreview from './CodePreview';
import CodeStructure from './CodeStructure';
import { FileNode } from './fileTreeUtils';
import { generateSandboxBaseHTML } from './utils/vibeSandboxUtils';

interface VibeCoderProps {
  onBack: () => void;
  initialPrompt?: string;
  projectId?: string | null;
  projects: Project[];
  onUpdateProjects: (projects: Project[]) => void;
}

export type ProjectFile = {
  language: string;
  content: string;
};

export type ProjectVersion = {
  id: string;
  label: string;
  description: string;
  timestamp: string;
  files: { [key: string]: ProjectFile };
};

export type Project = {
  id: string;
  name: string;
  lastEdited: string;
  files: { [key: string]: ProjectFile };
  history: { id: number; type: 'user' | 'bot'; text: string; time: string; attachments?: Attachment[] }[];
  versions: ProjectVersion[];
};

export const generateProjectFiles = (name: string): { [key: string]: ProjectFile } => {
  const slug = name.toLowerCase().replace(/\s+/g, '-');
  return {
    'package.json': {
      language: 'json',
      content: `{\n  "name": "${slug}",\n  "version": "1.0.0",\n  "type": "module",\n  "scripts": {\n    "dev": "vite",\n    "build": "vite build"\n  }\n}`
    },
    'tailwind.config.js': {
      language: 'javascript',
      content: `/** @type {import('tailwindcss').Config} */\nexport default {\n  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"]\n}`
    },
    'src/main.tsx': {
      language: 'typescript',
      content: `import React from 'react';\nimport ReactDOM from 'react-dom/client';\nimport App from './App';\nimport './index.css';\n\nconst el = document.getElementById('root');\nif (el) {\n  const root = ReactDOM.createRoot(el);\n  root.render(<App />);\n}`
    },
    'src/index.css': {
      language: 'css',
      content: `@tailwind base;\n@tailwind components;\n@tailwind utilities;\n\nbody { background: #f8fafc; font-family: system-ui, sans-serif; margin: 0; padding: 0; }`
    },
    'src/App.tsx': {
      language: 'typescript',
      content: `import React from 'react';\nimport { Dashboard } from './Dashboard';\n\nexport default function App() {\n  return <Dashboard />;\n}`
    },
    'src/Dashboard.tsx': {
      language: 'typescript',
      content: `import React, { useState, useCallback } from 'react';\nimport { Rocket, Zap, Sparkles, Activity, RefreshCw, TrendingUp, TrendingDown, Users, ShoppingCart } from 'lucide-react';\n\nconst ACTIVITIES = [\n  'User Alice signed up',\n  'Order #2381 placed',\n  'Payment of $540 received',\n  'Server backup completed',\n  'New support ticket opened',\n  'Agent deployed successfully',\n  'User Bob updated profile',\n  'Weekly report generated',\n  'API rate limit warning',\n  'Workflow triggered: Onboarding',\n  'Database snapshot taken',\n  'New subscriber: newsletter',\n];\n\nfunction rInt(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }\nfunction rChange() { return (Math.random() > 0.35 ? '+' : '-') + (Math.random() * 18 + 1).toFixed(1) + '%'; }\nfunction genStats() {\n  return [\n    { label: 'Revenue',    value: '$' + rInt(10000, 99000).toLocaleString(), change: rChange(), icon: TrendingUp },\n    { label: 'Users',      value: rInt(500, 9999).toLocaleString(),           change: rChange(), icon: Users },\n    { label: 'Orders',     value: rInt(50, 999).toLocaleString(),             change: rChange(), icon: ShoppingCart },\n    { label: 'Conversion', value: (Math.random() * 8 + 1).toFixed(1) + '%',  change: rChange(), icon: Activity },\n  ];\n}\nfunction genActivities() { return [...ACTIVITIES].sort(() => Math.random() - 0.5).slice(0, 5); }\n\nexport const Dashboard = () => {\n  const [stats, setStats]            = useState(genStats);\n  const [activities, setActivities]  = useState(genActivities);\n  const [spinning, setSpinning]      = useState(false);\n\n  const refresh = useCallback(() => {\n    setSpinning(true);\n    setTimeout(() => {\n      setStats(genStats());\n      setActivities(genActivities());\n      setSpinning(false);\n    }, 400);\n  }, []);\n\n  return (\n    <div className=\"p-8 max-w-5xl mx-auto min-h-screen bg-white shadow-xl border border-slate-100 rounded-[40px] my-10\">\n      <header className=\"flex justify-between items-center mb-10\">\n        <div className=\"flex items-center gap-4\">\n          <div className=\"w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg\">\n            <Rocket size={24} />\n          </div>\n          <h1 className=\"text-3xl font-black text-slate-900 tracking-tighter\">${name}</h1>\n        </div>\n        <button\n          onClick={refresh}\n          className=\"flex items-center gap-2 px-5 py-2 bg-indigo-600 text-white font-bold rounded-full hover:bg-indigo-700 active:scale-95 transition-all shadow-md\"\n        >\n          <RefreshCw size={16} className={spinning ? 'animate-spin' : ''} />\n          Refresh\n        </button>\n      </header>\n\n      {/* Stats Grid */}\n      <div className=\"grid grid-cols-2 md:grid-cols-4 gap-4 mb-10\">\n        {stats.map((s, i) => {\n          const isPos = s.change.startsWith('+');\n          const Icon = s.icon;\n          return (\n            <div key={i} className=\"p-5 bg-slate-50 border border-slate-200 rounded-2xl hover:shadow-md transition-all\">\n              <div className=\"flex items-center justify-between mb-3\">\n                <span className=\"text-xs font-bold text-slate-400 uppercase tracking-widest\">{s.label}</span>\n                <Icon size={16} className=\"text-indigo-400\" />\n              </div>\n              <p className=\"text-2xl font-black text-slate-900 mb-1\">{s.value}</p>\n              <span className={\`text-xs font-bold flex items-center gap-1 \${isPos ? 'text-emerald-600' : 'text-red-500'}\`}>\n                {isPos ? <TrendingUp size={12}/> : <TrendingDown size={12}/>} {s.change}\n              </span>\n            </div>\n          );\n        })}\n      </div>\n\n      {/* Main Grid */}\n      <div className=\"grid grid-cols-1 md:grid-cols-3 gap-6 mb-8\">\n        {[\n          { title: 'Edge Node', icon: Activity,  text: 'text-indigo-600', bg: 'bg-indigo-50' },\n          { title: 'Fast Boot', icon: Zap,       text: 'text-emerald-600', bg: 'bg-emerald-50' },\n          { title: 'Vibe Sync', icon: Sparkles,  text: 'text-purple-600', bg: 'bg-purple-50' }\n        ].map((item, i) => (\n          <div key={i} className=\"p-7 bg-white border border-slate-200 rounded-[28px] hover:shadow-xl transition-all cursor-pointer\">\n            <div className={\`w-12 h-12 \${item.bg} \${item.text} rounded-xl mb-5 flex items-center justify-center\`}>\n              <item.icon size={24} />\n            </div>\n            <h3 className=\"text-lg font-bold text-slate-900 mb-1\">{item.title}</h3>\n            <p className=\"text-sm text-slate-500 font-medium\">Running instantly via the Vibe Transpiler.</p>\n          </div>\n        ))}\n      </div>\n\n      {/* Recent Activity */}\n      <div className=\"bg-slate-50 border border-slate-200 rounded-2xl p-6\">\n        <h2 className=\"text-sm font-black text-slate-400 uppercase tracking-widest mb-4\">Recent Activity</h2>\n        <ul className=\"space-y-2\">\n          {activities.map((a, i) => (\n            <li key={i} className=\"flex items-center gap-3 p-3 bg-white rounded-xl border border-slate-100 text-sm text-slate-700 font-medium\">\n              <span className=\"w-2 h-2 rounded-full bg-indigo-400 shrink-0\" />\n              {a}\n            </li>\n          ))}\n        </ul>\n      </div>\n    </div>\n  );\n};`
    }
  };
};

const VibeCoder: React.FC<VibeCoderProps> = ({ onBack, initialPrompt, projectId, projects, onUpdateProjects }) => {
  const activeProject = useMemo(() => projects.find(p => p.id === projectId), [projects, projectId]);

  // Always-fresh refs so callbacks never close over stale values
  const latestProjects = useRef(projects);
  useEffect(() => { latestProjects.current = projects; }, [projects]);
  const onUpdateProjectsRef = useRef(onUpdateProjects);
  useEffect(() => { onUpdateProjectsRef.current = onUpdateProjects; }, [onUpdateProjects]);

  // Changes only when files are added/removed/renamed — not when content is edited
  const filePathsKey = useMemo(
    () => Object.keys(activeProject?.files ?? {}).sort().join('|'),
    [activeProject?.files]
  );

  const fileTree = useMemo(() => {
    if (!activeProject) return [];
    const root: FileNode[] = [];
    Object.keys(activeProject.files).forEach(filepath => {
      const parts = filepath.split('/');
      let currentLevel = root;
      parts.forEach((part, index) => {
        const isFile = index === parts.length - 1;
        const currentPath = parts.slice(0, index + 1).join('/');
        let existingNode = currentLevel.find(n => n.name === part);
        if (!existingNode) {
          existingNode = { name: part, path: currentPath, type: isFile ? 'file' : 'folder', children: isFile ? undefined : [] };
          currentLevel.push(existingNode);
        }
        if (!isFile) currentLevel = existingNode.children!;
      });
    });
    const sortNodes = (nodes: FileNode[]) => {
      nodes.sort((a, b) => a.type !== b.type ? (a.type === 'folder' ? -1 : 1) : a.name.localeCompare(b.name));
      nodes.forEach(n => { if (n.children) sortNodes(n.children); });
    };
    sortNodes(root);
    return root;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filePathsKey]);

  const [activeFile, setActiveFile] = useState('src/Dashboard.tsx');
  const latestActiveFile = useRef(activeFile);
  useEffect(() => { latestActiveFile.current = activeFile; }, [activeFile]);
  const [activeTab, setActiveTab] = useState<'preview' | 'code'>('preview');
  const [device, setDevice] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [consoleLogs, setConsoleLogs] = useState<{ type: 'log' | 'error' | 'warn'; message: string; time: string }[]>([]);
  const [showConsole, setShowConsole] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showVersionMenu, setShowVersionMenu] = useState(false);
  const versionMenuRef = useRef<HTMLDivElement>(null);

  // Auto-create initial version if project has none
  useEffect(() => {
    if (!activeProject || !projectId) return;
    if ((activeProject.versions ?? []).length > 0) return;
    onUpdateProjects(projects.map(p => p.id !== projectId ? p : {
      ...p,
      versions: [{
        id: crypto.randomUUID(),
        label: 'v1',
        description: 'Initial state',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        files: JSON.parse(JSON.stringify(p.files)),
      }],
    }));
  }, [activeProject?.id]);

  // Trigger initial prompt
  useEffect(() => {
    if (initialPrompt && activeProject && activeProject.history.length === 1) {
      setTimeout(() => { setPrompt(initialPrompt); handleGenerate(initialPrompt); }, 500);
    }
  }, [initialPrompt, activeProject]);

  // Console message listener
  useEffect(() => {
    const handler = (e: MessageEvent) => {
      if (e.data.type === 'SANDBOX_CONSOLE') {
        setConsoleLogs(prev => [...prev, {
          type: e.data.level,
          message: e.data.payload,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        }].slice(-50));
      }
    };
    window.addEventListener('message', handler);
    return () => window.removeEventListener('message', handler);
  }, []);

  // Close version menu on outside click
  useEffect(() => {
    if (!showVersionMenu) return;
    const handler = (e: MouseEvent) => {
      if (versionMenuRef.current && !versionMenuRef.current.contains(e.target as Node))
        setShowVersionMenu(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [showVersionMenu]);

  const baseHTML = useMemo(() => {
    if (!activeProject) return null;
    const indexCss = (activeProject.files['src/index.css']?.content || '').replace(/@tailwind.*;/g, '');
    return generateSandboxBaseHTML(indexCss);
  }, [activeProject?.files['src/index.css'], reloadKey]);

  // Skip the expensive JSON+base64 encode while the user is in the code editor
  const vfsPayload = useMemo(() => {
    if (activeTab !== 'preview' || !activeProject) return '';
    const payload = Object.keys(activeProject.files).reduce((acc, path) => {
      acc[path] = activeProject.files[path].content;
      return acc;
    }, {} as Record<string, string>);
    return btoa(unescape(encodeURIComponent(JSON.stringify(payload))));
  }, [activeTab, activeProject?.files]);

  // useCallback + ref pattern: stable references that never close over stale state.
  // This allows FileTreeItem (React.memo'd) to skip re-renders during typing.
  const handleUpdateFile = useCallback((content: string) => {
    if (!projectId) return;
    const af = latestActiveFile.current;
    onUpdateProjectsRef.current(latestProjects.current.map(p => p.id === projectId ? {
      ...p,
      files: { ...p.files, [af]: { ...p.files[af], content } },
    } : p));
  }, [projectId]);

  const handleCreateNewItem = useCallback((parentPath: string, type: 'file' | 'folder', name: string) => {
    if (!name || !projectId) return;
    const parentFolder = parentPath ? (parentPath.endsWith('/') ? parentPath : `${parentPath}/`) : 'src/';
    let path = `${parentFolder}${name}`.replace(/\/\//g, '/');
    if (type === 'folder' && !name.includes('.')) path = `${path.replace(/\/$/, '')}/.gitkeep`;
    onUpdateProjectsRef.current(latestProjects.current.map(p => {
      if (p.id !== projectId) return p;
      if (p.files[path]) return p;
      return { ...p, files: { ...p.files, [path]: { language: path.endsWith('.css') ? 'css' : path.endsWith('.json') ? 'json' : 'typescript', content: type === 'folder' ? '' : '// Start...\n' } } };
    }));
    setActiveFile(path);
  }, [projectId]);

  const handleDeleteItem = useCallback((path: string, type: 'file' | 'folder') => {
    if (!projectId) return;
    onUpdateProjectsRef.current(latestProjects.current.map(p => {
      if (p.id !== projectId) return p;
      const newFiles = { ...p.files };
      if (type === 'folder') {
        const prefix = path.endsWith('/') ? path : `${path}/`;
        Object.keys(newFiles).forEach(f => { if (f.startsWith(prefix)) delete newFiles[f]; });
      } else delete newFiles[path];
      return { ...p, files: newFiles };
    }));
    if (latestActiveFile.current.startsWith(path)) setActiveFile('src/main.tsx');
  }, [projectId]);

  const handleRenameItem = useCallback((oldPath: string, newPath: string) => {
    if (!projectId || !newPath || oldPath === newPath) return;
    onUpdateProjectsRef.current(latestProjects.current.map(p => {
      if (p.id !== projectId) return p;
      const newFiles = { ...p.files };
      const isFolder = !oldPath.includes('.') || oldPath.endsWith('/');
      if (isFolder) {
        const op = oldPath.endsWith('/') ? oldPath : `${oldPath}/`;
        const np = newPath.endsWith('/') ? newPath : `${newPath}/`;
        Object.keys(newFiles).forEach(f => {
          if (f.startsWith(op)) { newFiles[f.replace(op, np)] = newFiles[f]; delete newFiles[f]; }
        });
      } else { newFiles[newPath] = newFiles[oldPath]; delete newFiles[oldPath]; }
      return { ...p, files: newFiles };
    }));
    const af = latestActiveFile.current;
    if (af.startsWith(oldPath)) setActiveFile(af.replace(oldPath, newPath));
  }, [projectId]);

  const handleGenerate = (msg: string, atts?: Attachment[]) => {
    if ((!msg.trim() && !atts?.length) || !projectId) return;

    // Snapshot current files as the next version
    const currentVersions = activeProject?.versions ?? [];
    const newVersion: ProjectVersion = {
      id: crypto.randomUUID(),
      label: `v${currentVersions.length + 1}`,
      description: msg.trim() ? (msg.length > 48 ? msg.substring(0, 48) + '…' : msg) : 'Attachment',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      files: JSON.parse(JSON.stringify(activeProject?.files ?? {})),
    };

    onUpdateProjects(projects.map(proj => proj.id !== projectId ? proj : {
      ...proj,
      versions: [...currentVersions, newVersion],
      history: [...proj.history, { id: Date.now(), type: 'user', text: msg, time: 'Just now', attachments: atts }],
      lastEdited: 'Just now',
    }));

    setIsGenerating(true);
    setTimeout(() => {
      onUpdateProjects(latestProjects.current.map(proj => proj.id !== projectId ? proj : {
        ...proj,
        history: [...proj.history, { id: Date.now() + 1, type: 'bot', text: `Vibe confirmed. Synced adjustments for "${msg.substring(0, 20)}…".`, time: 'Just now' }],
      }));
      setIsGenerating(false);
    }, 1500);
  };

  const handleRestoreVersion = (ver: ProjectVersion) => {
    if (!projectId || !window.confirm(`Restore to ${ver.label}? Current unsaved work will be lost.`)) return;
    onUpdateProjects(projects.map(p => p.id !== projectId ? p : { ...p, files: JSON.parse(JSON.stringify(ver.files)) }));
    setShowVersionMenu(false);
  };

  const handleDownloadZip = () => {
    if (!activeProject) return;
    const files: Record<string, Uint8Array> = {};
    Object.entries<ProjectFile>(activeProject.files).forEach(([path, file]) => {
      files[path] = strToU8(file.content);
    });
    zip(files, (err, data) => {
      if (err) return;
      const url = URL.createObjectURL(new Blob([data.buffer as ArrayBuffer], { type: 'application/zip' }));
      const a = document.createElement('a');
      a.href = url;
      a.download = `${activeProject.name.toLowerCase().replace(/\s+/g, '-')}.zip`;
      a.click();
      URL.revokeObjectURL(url);
    });
  };

  const mappedHistory = useMemo(() => {
    if (!activeProject) return [];
    return activeProject.history.map(h => ({
      role: h.type === 'user' ? 'user' : 'assistant' as 'user' | 'assistant',
      content: h.text,
      attachments: h.attachments,
    }));
  }, [activeProject?.history]);

  if (!activeProject) return null;

  const versions = activeProject.versions ?? [];
  const currentVersionLabel = `v${versions.length + 1}`;

  return (
    <div className="flex h-screen w-full bg-mod-surface-bg text-mod-surface-text-primary overflow-hidden relative font-sans">
      <AIDrawer
        isOpen={true}
        onClose={onBack}
        closeIcon="back"
        history={mappedHistory}
        message={prompt}
        setMessage={setPrompt}
        onSendMessage={handleGenerate}
        mode="dock-left"
        width={450}
        title={activeProject.name}
        status={isGenerating ? 'Generating…' : 'Vibe Engine Online'}
        themeColor="indigo"
        placeholder="Iterate on this vibe..."
        allowedAttachments={['image', 'pdf', 'url']}
      />

      <main className="flex-1 flex flex-col relative overflow-hidden h-full z-10 bg-mod-surface-bg border-l border-mod-surface-border-strong shadow-[-10px_0_30px_rgba(0,0,0,0.05)]">

        {/* ── Row 1: Main header ── */}
        <div className="h-12 bg-mod-surface-card border-b border-mod-surface-border flex items-center justify-between px-5 shrink-0 z-30">
          <h2 className="text-sm font-bold text-mod-surface-text-primary truncate max-w-[200px]">
            {activeProject.name}
          </h2>

          <div className="flex items-center gap-1.5">
            {/* Version dropdown */}
            <div className="relative" ref={versionMenuRef}>
              <button
                onClick={() => setShowVersionMenu(v => !v)}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-[11px] font-semibold transition-all ${
                  showVersionMenu
                    ? 'border-mod-hero-icon-color/40 bg-mod-hero-badge-bg text-mod-hero-icon-color'
                    : 'border-mod-surface-border bg-mod-surface-hover hover:bg-mod-surface-card text-mod-surface-text-secondary'
                }`}
              >
                <Clock size={12} />
                <span>{currentVersionLabel}</span>
                <ChevronDown size={11} className={`transition-transform duration-200 ${showVersionMenu ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {showVersionMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: -6, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -6, scale: 0.97 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 top-full mt-2 w-72 bg-mod-surface-card border border-mod-surface-border rounded-xl shadow-2xl z-50 overflow-hidden"
                  >
                    <div className="flex items-center justify-between px-3 py-2 border-b border-mod-surface-border">
                      <span className="text-[10px] font-black uppercase tracking-widest text-mod-surface-text-muted">Version History</span>
                      <button onClick={() => setShowVersionMenu(false)} className="text-mod-surface-text-muted hover:text-mod-surface-text-primary transition-colors">
                        <X size={12} />
                      </button>
                    </div>

                    <div className="max-h-64 overflow-y-auto scrollbar-custom">
                      {/* Current (working) state */}
                      <div className="flex items-start gap-3 px-3 py-2.5 bg-mod-hero-badge-bg/10">
                        <div className="flex flex-col items-center gap-1 shrink-0 mt-1">
                          <div className="w-2 h-2 rounded-full bg-mod-hero-icon-color" />
                          {versions.length > 0 && <div className="w-px flex-1 bg-mod-surface-border min-h-[12px]" />}
                        </div>
                        <div className="flex-1 min-w-0 pb-1">
                          <div className="flex items-center gap-2">
                            <span className="text-[11px] font-bold text-mod-surface-text-primary">{currentVersionLabel}</span>
                            <span className="px-1.5 py-0.5 bg-mod-hero-badge-bg text-mod-hero-icon-color text-[8px] font-black rounded uppercase tracking-wider">Current</span>
                          </div>
                          <p className="text-[9px] text-mod-surface-text-muted mt-0.5">Working state</p>
                        </div>
                      </div>

                      {/* Saved versions (newest → oldest) */}
                      {[...versions].reverse().map((ver, idx, arr) => (
                        <div key={ver.id} className="flex items-start gap-3 px-3 py-2.5 hover:bg-mod-surface-hover transition-colors">
                          <div className="flex flex-col items-center gap-1 shrink-0 mt-1">
                            <div className="w-2 h-2 rounded-full bg-mod-surface-border" />
                            {idx < arr.length - 1 && <div className="w-px flex-1 bg-mod-surface-border min-h-[12px]" />}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-2">
                              <span className="text-[11px] font-semibold text-mod-surface-text-secondary">{ver.label}</span>
                              <span className="text-[9px] text-mod-surface-text-muted shrink-0">{ver.timestamp}</span>
                            </div>
                            <p className="text-[9px] text-mod-surface-text-muted mt-0.5 truncate">{ver.description}</p>
                          </div>
                          <button
                            onClick={() => handleRestoreVersion(ver)}
                            className="text-[9px] font-bold text-mod-hero-icon-color hover:underline transition-colors shrink-0 mt-0.5"
                          >
                            Restore
                          </button>
                        </div>
                      ))}

                      {versions.length === 0 && (
                        <p className="px-4 py-5 text-center text-[10px] text-mod-surface-text-muted italic">
                          Send a prompt to save your first version.
                        </p>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="w-px h-4 bg-mod-surface-border" />

            {/* Settings */}
            <button
              title="Settings"
              className="p-2 rounded-lg text-mod-surface-text-muted hover:text-mod-surface-text-primary hover:bg-mod-surface-hover transition-all"
            >
              <Settings size={14} />
            </button>

            <div className="w-px h-4 bg-mod-surface-border" />

            {/* Deploy */}
            <button className="px-4 py-1.5 bg-mod-header-btn-bg text-mod-header-btn-text rounded-xl text-xs font-bold mod-header-btn-shadow hover:bg-mod-hero-btn-hover transition-all flex items-center gap-1.5 active:scale-95">
              <Rocket size={13} /> Deploy
            </button>
          </div>
        </div>

        {/* ── Row 2: Tab bar with contextual controls ── */}
        <div className="h-10 bg-mod-surface-card border-b border-mod-surface-border flex items-stretch justify-between px-2 shrink-0 z-20">

          {/* Mode tabs — underline style */}
          <div className="flex items-stretch">
            {(['preview', 'code'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`relative px-4 flex items-center text-[11px] font-semibold transition-colors ${
                  activeTab === tab
                    ? 'text-mod-toolbar-active-text'
                    : 'text-mod-surface-text-muted hover:text-mod-surface-text-secondary'
                }`}
              >
                {tab === 'preview' ? 'Live Visual' : 'Project Source'}
                {activeTab === tab && (
                  <motion.span
                    layoutId="tab-underline"
                    className="absolute bottom-0 left-3 right-3 h-0.5 bg-mod-hero-icon-color rounded-t-full"
                  />
                )}
              </button>
            ))}
          </div>

          {/* Contextual controls */}
          <div className="flex items-center gap-0.5">
            {activeTab === 'preview' ? (
              <>
                {/* Device switcher */}
                <div className="flex items-center mr-1">
                  {([
                    { val: 'desktop', Icon: Monitor },
                    { val: 'tablet',  Icon: Tablet },
                    { val: 'mobile',  Icon: Smartphone },
                  ] as const).map(({ val, Icon }) => (
                    <button
                      key={val}
                      onClick={() => setDevice(val)}
                      title={val.charAt(0).toUpperCase() + val.slice(1)}
                      className={`p-1.5 rounded transition-all ${device === val ? 'text-mod-toolbar-active-text bg-mod-surface-hover' : 'text-mod-surface-text-muted hover:text-mod-surface-text-secondary'}`}
                    >
                      <Icon size={13} />
                    </button>
                  ))}
                </div>
                <div className="w-px h-4 bg-mod-surface-border mx-0.5" />
                <button onClick={() => setReloadKey(k => k + 1)} title="Reload" className="p-1.5 rounded text-mod-surface-text-muted hover:text-mod-surface-text-primary hover:bg-mod-surface-hover transition-all">
                  <RotateCw size={13} />
                </button>
                <button onClick={() => setShowConsole(v => !v)} title="Console" className={`p-1.5 rounded transition-all ${showConsole ? 'text-mod-hero-icon-color bg-mod-hero-badge-bg' : 'text-mod-surface-text-muted hover:text-mod-surface-text-primary hover:bg-mod-surface-hover'}`}>
                  <ConsoleIcon size={13} />
                </button>
                <button onClick={() => setIsFullscreen(true)} title="Fullscreen" className="p-1.5 rounded text-mod-surface-text-muted hover:text-mod-surface-text-primary hover:bg-mod-surface-hover transition-all mr-1">
                  <Maximize2 size={13} />
                </button>
              </>
            ) : (
              <button
                onClick={handleDownloadZip}
                className="flex items-center gap-1.5 px-3 py-1 rounded-lg border border-mod-surface-border bg-mod-surface-hover hover:bg-mod-surface-card text-mod-surface-text-secondary hover:text-mod-surface-text-primary transition-all text-[10px] font-bold mr-1"
              >
                <Download size={12} />
                Download ZIP
              </button>
            )}
          </div>
        </div>

        {/* ── Content ── */}
        <div className="flex-1 overflow-hidden relative flex flex-col bg-mod-surface-border">
          <AnimatePresence mode="wait">
            {activeTab === 'preview' ? (
              <CodePreview
                device={device}
                baseHTML={baseHTML}
                vfsPayload={vfsPayload}
                reloadKey={reloadKey}
                showConsole={showConsole}
                consoleLogs={consoleLogs}
                setConsoleLogs={setConsoleLogs}
                isFullscreen={isFullscreen}
                setIsFullscreen={setIsFullscreen}
                projectId={projectId || undefined}
              />
            ) : (
              <CodeStructure
                fileTree={fileTree}
                activeFile={activeFile}
                setActiveFile={setActiveFile}
                activeProject={activeProject}
                handleUpdateFile={handleUpdateFile}
                handleCreateNewItem={handleCreateNewItem}
                handleDeleteItem={handleDeleteItem}
                handleRenameItem={handleRenameItem}
              />
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
};

export default VibeCoder;
