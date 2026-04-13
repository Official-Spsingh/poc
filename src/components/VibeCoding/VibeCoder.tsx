
import { AnimatePresence } from 'framer-motion';
import {
  Monitor,
  Rocket,
  Smartphone,
  Tablet
} from 'lucide-react';
import React, { useEffect, useMemo, useState } from 'react';
import AIDrawer from '../Common/AIDrawer';
import CodePreview from './CodePreview';
import CodeStructure, { FileNode } from './CodeStructure';
import { generateSandboxHTML } from './utils/vibeSandboxUtils';

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

export type Project = {
  id: string;
  name: string;
  lastEdited: string;
  files: { [key: string]: ProjectFile };
  history: { id: number, type: 'user' | 'bot', text: string, time: string }[];
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
      content: `import React, { useState } from 'react';\nimport { Rocket, Zap, Sparkles, Activity } from 'lucide-react';\n\nexport const Dashboard = () => {\n  const [count, setCount] = useState(0);\n  return (\n    <div className="p-12 max-w-5xl mx-auto min-h-screen bg-white shadow-xl border border-slate-100 rounded-[40px] my-10">\n      <header className="flex justify-between items-center mb-16">\n        <div className="flex items-center gap-4">\n          <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg">\n            <Rocket size={24} />\n          </div>\n          <h1 className="text-3xl font-black text-slate-900 tracking-tighter">${name}</h1>\n        </div>\n        <button onClick={() => setCount(c => c + 1)} className="px-6 py-2 bg-indigo-50 text-indigo-600 font-bold rounded-full hover:bg-indigo-100 transition-colors">\n          Clicks: {count}\n        </button>\n      </header>\n\n      <main>\n        <div className="mb-16">\n           <h2 className="text-5xl font-black text-slate-900 leading-[1.1] tracking-tight mb-6">Building the future of<br/><span className="text-indigo-600">Intelligence.</span></h2>\n           <p className="text-lg text-slate-500 font-medium max-w-2xl">This is a highly-optimized, 100% reliable transpilation engine running completely inside your browser.</p>\n        </div>\n\n        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">\n          {[ \n            { title: 'Edge Node', icon: Activity, text: 'text-indigo-600', bg: 'bg-indigo-50' },\n            { title: 'Fast Boot', icon: Zap, text: 'text-emerald-600', bg: 'bg-emerald-50' },\n            { title: 'Vibe Sync', icon: Sparkles, text: 'text-purple-600', bg: 'bg-purple-50' }\n          ].map((item, i) => (\n            <div key={i} className="p-8 bg-white border border-slate-200 rounded-[30px] hover:shadow-xl transition-all cursor-pointer">\n              <div className={\`w-12 h-12 \${item.bg} \${item.text} rounded-xl mb-6 flex items-center justify-center\`}>\n                <item.icon size={24} />\n              </div>\n              <h3 className="text-xl font-bold text-slate-900 mb-2">{item.title}</h3>\n              <p className="text-sm text-slate-500 font-medium">Running instantly via the Vibre Transpiler.</p>\n            </div>\n          ))}\n        </div>\n      </main>\n    </div>\n  );\n};` 
    }
  };
};

const VibeCoder: React.FC<VibeCoderProps> = ({ onBack, initialPrompt, projectId, projects, onUpdateProjects }) => {
  const activeProject = useMemo(() => projects.find(p => p.id === projectId), [projects, projectId]);

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
          existingNode = {
            name: part,
            path: currentPath,
            type: isFile ? 'file' : 'folder',
            children: isFile ? undefined : []
          };
          currentLevel.push(existingNode);
        }
        
        if (!isFile) {
          currentLevel = existingNode.children!;
        }
      });
    });
    
    const sortNodes = (nodes: FileNode[]) => {
      nodes.sort((a, b) => {
        if (a.type !== b.type) return a.type === 'folder' ? -1 : 1;
        return a.name.localeCompare(b.name);
      });
      nodes.forEach(n => { if (n.children) sortNodes(n.children); });
    };
    sortNodes(root);
    
    return root;
  }, [activeProject?.files]);
  const [activeFile, setActiveFile] = useState('src/Dashboard.tsx');
  const [activeTab, setActiveTab] = useState<'preview' | 'code' | 'vitals'>('preview');
  const [device, setDevice] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [consoleLogs, setConsoleLogs] = useState<{ type: 'log' | 'error' | 'warn', message: string, time: string }[]>([]);
  const [showConsole, setShowConsole] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    if (initialPrompt && activeProject && activeProject.history.length === 1) {
       setTimeout(() => {
          setPrompt(initialPrompt);
          handleGenerate(initialPrompt);
       }, 500);
    }
  }, [initialPrompt, activeProject]);

  useEffect(() => {
    const handleMessage = (e: MessageEvent) => {
      if (e.data.type === 'SANDBOX_CONSOLE') {
        setConsoleLogs(prev => [...prev, { 
          type: e.data.level, 
          message: e.data.payload, 
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }) 
        }].slice(-50));
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  const previewData = useMemo(() => {
    if (!activeProject) return null;
    const vfsPayload = Object.keys(activeProject.files).reduce((acc, path) => {
      acc[path] = activeProject.files[path].content;
      return acc;
    }, {} as any);

    const indexCss = (activeProject.files['src/index.css']?.content || '').replace(/@tailwind.*;/g, ''); 
    const sanitizedSourceJSON = btoa(unescape(encodeURIComponent(JSON.stringify(vfsPayload))));
    
    return generateSandboxHTML(sanitizedSourceJSON, indexCss);

  }, [activeProject, activeProject?.files, reloadKey]);

  const handleUpdateFile = (content: string) => {
    if (!projectId) return;
    onUpdateProjects(projects.map(p => p.id === projectId ? {
      ...p,
      files: { ...p.files, [activeFile]: { ...p.files[activeFile], content } }
    } : p));
  };

  const handleCreateNewItem = (parentPath: string, type: 'file' | 'folder') => {
    const parentFolder = parentPath ? (parentPath.endsWith('/') ? parentPath : `${parentPath}/`) : 'src/';
    const defaultName = type === 'file' ? 'NewFile.tsx' : 'NewFolder';
    const name = window.prompt(`Enter name for new ${type} in ${parentFolder}:`, defaultName);
    if (!name || !projectId) return;
    
    let path = `${parentFolder}${name}`.replace(/\/\//g, '/');
    if (type === 'folder' && !name.includes('.')) {
      path = `${path.replace(/\/$/, '')}/.gitkeep`;
    }
    
    onUpdateProjects(projects.map(p => {
      if (p.id !== projectId) return p;
      if (p.files[path]) {
        alert(`${type} already exists!`);
        return p;
      }
      return {
        ...p,
        files: { ...p.files, [path]: { language: path.endsWith('.css') ? 'css' : path.endsWith('.json') ? 'json' : 'typescript', content: type === 'folder' ? '' : '// Start...\n' } }
      };
    }));
    setActiveFile(path);
  };

  const handleDeleteItem = (path: string, type: 'file' | 'folder') => {
    if (!projectId) return;
    if (!window.confirm(`Are you sure you want to delete this ${type}?`)) return;

    onUpdateProjects(projects.map(p => {
      if (p.id !== projectId) return p;
      const newFiles = { ...p.files };
      
      if (type === 'folder') {
        const folderPrefix = path.endsWith('/') ? path : `${path}/`;
        Object.keys(newFiles).forEach(f => {
          if (f.startsWith(folderPrefix)) delete newFiles[f];
        });
      } else {
        delete newFiles[path];
      }
      
      return { ...p, files: newFiles };
    }));
    
    if (activeFile.startsWith(path)) {
       setActiveFile('src/main.tsx');
    }
  };

  const handleRenameItem = (oldPath: string, newPath: string) => {
    if (!projectId || !newPath || oldPath === newPath) return;

    onUpdateProjects(projects.map(p => {
      if (p.id !== projectId) return p;
      const newFiles = { ...p.files };
      
      const isFolder = !oldPath.includes('.') || oldPath.endsWith('/');
      if (isFolder) {
        const folderPrefix = oldPath.endsWith('/') ? oldPath : `${oldPath}/`;
        const newPrefix = newPath.endsWith('/') ? newPath : `${newPath}/`;
        Object.keys(newFiles).forEach(f => {
          if (f.startsWith(folderPrefix)) {
            const nestedPath = f.replace(folderPrefix, newPrefix);
            newFiles[nestedPath] = newFiles[f];
            delete newFiles[f];
          }
        });
      } else {
        newFiles[newPath] = newFiles[oldPath];
        delete newFiles[oldPath];
      }
      
      return { ...p, files: newFiles };
    }));
    
    if (activeFile.startsWith(oldPath)) {
       setActiveFile(activeFile.replace(oldPath, newPath));
    }
  };

  const handleGenerate = (msg: string) => {
    if (!msg.trim() || !projectId) return;
    
    onUpdateProjects(projects.map(proj => proj.id === projectId ? {
      ...proj,
      history: [...proj.history, { id: Date.now(), type: 'user', text: msg, time: "Just now" }]
    } : proj));
    
    setIsGenerating(true);
    setTimeout(() => {
      onUpdateProjects(projects.map(proj => proj.id === projectId ? {
        ...proj,
        history: [...proj.history, { id: Date.now() + 1, type: 'bot', text: `Vibe confirmed. Synced adjustments for "${msg.substring(0, 20)}...".`, time: "Just now" }]
      } : proj));
      setIsGenerating(false);
    }, 1500);
  };

  const mappedHistory = useMemo(() => {
    if (!activeProject) return [];
    return activeProject.history.map(h => ({
      role: h.type === 'user' ? 'user' : 'assistant' as 'user' | 'assistant',
      content: h.text
    }));
  }, [activeProject?.history]);

  if (!activeProject) return null;

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
        status="Vibe Engine Online"
        themeColor="indigo"
        placeholder="Iterate on this vibe..."
      />

      <main className="flex-1 flex flex-col relative overflow-hidden h-full z-10 bg-mod-surface-bg border-l border-mod-surface-border-strong shadow-[-10px_0_30px_rgba(0,0,0,0.05)]">
        {/* Top Header - Spans full width */}
        <header className="h-16 bg-mod-surface-card border-b border-mod-surface-border flex items-center pr-6 pl-10 justify-between z-30 shadow-sm shrink-0">

           {/* Left Section - Mode Controls */}
           <div className="flex bg-mod-surface-border/80 p-1 rounded-xl border border-mod-surface-border shadow-inner">
             <button
               onClick={() => setActiveTab('preview')}
               className={`py-1.5 transition-all flex items-center justify-center rounded-lg ${activeTab === 'preview' ? 'bg-mod-surface-card text-mod-toolbar-active-text shadow-sm px-4' : 'text-mod-surface-text-muted hover:text-mod-surface-text-secondary px-4'}`}
             >
               <span className="text-xs font-bold">Live Visual</span>
             </button>
             <button
               onClick={() => setActiveTab('code')}
               className={`py-1.5 transition-all flex items-center justify-center rounded-lg ${activeTab === 'code' ? 'bg-mod-surface-card text-mod-toolbar-active-text shadow-sm px-4' : 'text-mod-surface-text-muted hover:text-mod-surface-text-secondary px-4'}`}
             >
               <span className="text-xs font-bold">Project Source</span>
             </button>
           </div>

           {/* Right Section - Viewport & Deploy */}
           <div className="flex items-center justify-end gap-3">
              <div className="flex bg-mod-surface-border/80 p-1 rounded-xl border border-mod-surface-border shadow-inner mr-2">
                <button
                  onClick={() => setDevice('desktop')}
                  className={`p-1.5 rounded-lg transition-all flex items-center justify-center ${device === 'desktop' ? 'bg-mod-surface-card text-mod-toolbar-active-text shadow-sm px-3' : 'text-mod-surface-text-muted hover:text-mod-surface-text-secondary px-2'}`}
                  title="Desktop View"
                >
                  <Monitor size={14} />
                </button>
                <button
                  onClick={() => setDevice('tablet')}
                  className={`p-1.5 rounded-lg transition-all flex items-center justify-center ${device === 'tablet' ? 'bg-mod-surface-card text-mod-toolbar-active-text shadow-sm px-3' : 'text-mod-surface-text-muted hover:text-mod-surface-text-secondary px-2'}`}
                  title="Tablet View"
                >
                  <Tablet size={14} />
                </button>
                <button
                  onClick={() => setDevice('mobile')}
                  className={`p-1.5 rounded-lg transition-all flex items-center justify-center ${device === 'mobile' ? 'bg-mod-surface-card text-mod-toolbar-active-text shadow-sm px-3' : 'text-mod-surface-text-muted hover:text-mod-surface-text-secondary px-2'}`}
                  title="Mobile View"
                >
                  <Smartphone size={14} />
                </button>
              </div>

              <button className="px-5 py-2 bg-mod-header-btn-bg text-mod-header-btn-text rounded-xl text-xs font-bold mod-header-btn-shadow hover:bg-mod-hero-btn-hover transition-all flex items-center gap-2 active:scale-95">
                <Rocket size={14} /> DEPLOY STUDIO
              </button>
           </div>
        </header>

        <div className="flex-1 overflow-hidden relative flex flex-col bg-mod-surface-border">
           <AnimatePresence mode="wait">
              {activeTab === 'preview' ? (
                <CodePreview
                  device={device}
                  previewData={previewData}
                  reloadKey={reloadKey}
                  setReloadKey={setReloadKey}
                  showConsole={showConsole}
                  setShowConsole={setShowConsole}
                  consoleLogs={consoleLogs}
                  setConsoleLogs={setConsoleLogs}
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
