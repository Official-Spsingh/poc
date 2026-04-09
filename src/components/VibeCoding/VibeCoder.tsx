
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
    
    // EXTREMELY ROBUST VIBE ENGINE 2.0
    // No Blobs, No Import Maps. Just pure inline transpilation and module scoping.
    return `
      <!DOCTYPE html><html><head><meta charset="utf-8">
      <title>Sandbox</title>
      <script>
        // Extremely early console bridge to catch Babel load errors
        window.onerror = function(msg, url, line) { 
          window.parent.postMessage({ type: "SANDBOX_CONSOLE", level: "error", payload: "Global Run Error: " + msg + " at line " + line }, "*"); 
          return false; 
        };
        const cBridge = (lvl) => (...args) => {
          window.parent.postMessage({ type: "SANDBOX_CONSOLE", level: lvl, payload: args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' ') }, "*");
        };
        window.console.log = cBridge("log");
        window.console.warn = cBridge("warn");
        window.console.error = cBridge("error");
        console.log("Sandbox VM Booting...");
      </script>
      <script src="https://unpkg.com/react@18/umd/react.development.js" crossorigin></script>
      <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js" crossorigin></script>
      <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
      <script src="https://cdn.tailwindcss.com"></script>
      <style>${indexCss}
      body { background: transparent; }
      .err-box { background: #fee2e2; border: 1px solid #fecaca; color: #991b1b; padding: 2rem; margin: 2rem; border-radius: 1rem; font-family: monospace; white-space: pre-wrap; }
      </style>
      </head><body><div id="root"></div>
      <script>
        document.addEventListener("DOMContentLoaded", () => {
          console.log("DOM Ready. Starting VFS Compiler...");
          try {
            if (!window.Babel) throw new Error("Babel.js failed to load from network.");
            if (!window.React) throw new Error("React.js failed to load from network.");
            
            const vfs = JSON.parse(decodeURIComponent(escape(window.atob("${sanitizedSourceJSON}"))));
            const modules = {};
            
            function simulateRequire(id) {
              if (id === 'react') return window.React;
              if (id === 'react-dom') return window.ReactDOM;
              if (id === 'react-dom/client') return window.ReactDOM;
              
              // Minimal Lucide-React Mock for Icons
              if (id === 'lucide-react') {
                return new Proxy({}, { get: (target, prop) => (props) => 
                  window.React.createElement("svg", { width: props.size||24, height: props.size||24, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", ...props }, 
                    window.React.createElement("circle", { cx: 12, cy: 12, r: 10 }), 
                    window.React.createElement("text", { x: "50%", y: "50%", textAnchor: "middle", dy: ".3em", fontSize: "10", stroke: "none", fill: "currentColor" }, prop.charAt(0))
                  )
                });
              }

              let path = id.replace(/^\\.\\//, '').replace(/^\\//, '');
              if (!path.startsWith('src/')) path = 'src/' + path;
              // If missing extension, try resolving to tsx or ts first
              if (!path.endsWith('.tsx') && !path.endsWith('.ts') && !path.endsWith('.css') && !path.endsWith('.json')) {
                if (vfs[path + '.tsx']) path += '.tsx';
                else if (vfs[path + '.ts']) path += '.ts';
              }

              if (modules[path]) return modules[path].exports;
              if (!vfs[path]) throw new Error("Cannot find module: " + id + " (resolved to " + path + ")");

              console.log("Compiling: " + path);
              const module = { exports: {} };
              modules[path] = module;

              // Bypass Babel for CSS since we already injected it in the head <style> tag
              if (path.endsWith('.css')) return module.exports;

              // Force Babel to output ES5 with CommonJS modules
              const compiled = Babel.transform(vfs[path], {
                filename: path,
                presets: [
                  ['env', { modules: 'commonjs' }],
                  'react',
                  'typescript'
                ]
              }).code;

              // Execute in isolated scope
              const factory = new Function('require', 'module', 'exports', 'React', compiled);
              factory(simulateRequire, module, module.exports, window.React);

              return module.exports;
            }

            // Begin execution at main.tsx
            simulateRequire('src/main.tsx');
            console.log("Application mounted successfully.");

          } catch(err) {
            console.error(err.message);
            document.body.innerHTML = "<div class='err-box'><b>Compilation Error:</b><br/>" + err.message + "<br/><br/><small>" + err.stack + "</small></div>";
          }
        });
      </script>
      </body></html>
    `;

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
    <div className="flex h-screen w-full bg-slate-50 text-slate-900 overflow-hidden relative font-sans">
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
        themeColor="violet"
        placeholder="Iterate on this vibe..."
      />

      <main className="flex-1 flex flex-col relative overflow-hidden h-full z-10 bg-slate-50 border-l border-slate-300 shadow-[-10px_0_30px_rgba(0,0,0,0.05)]">
        {/* Top Header - Spans full width / Matches AppEditor styling */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center pr-6 pl-10 justify-between z-30 shadow-sm shrink-0">
           
           {/* Left Section - Mode Controls */}
           <div className="flex bg-gray-100/80 p-1 rounded-xl border border-gray-100 shadow-inner">
             <button
               onClick={() => setActiveTab('preview')}
               className={`py-1.5 transition-all flex items-center justify-center rounded-lg ${activeTab === 'preview' ? 'bg-white text-indigo-600 shadow-sm px-4' : 'text-gray-400 hover:text-gray-600 px-4'}`}
             >
               <span className="text-xs font-bold">Live Visual</span>
             </button>
             <button
               onClick={() => setActiveTab('code')}
               className={`py-1.5 transition-all flex items-center justify-center rounded-lg ${activeTab === 'code' ? 'bg-white text-indigo-600 shadow-sm px-4' : 'text-gray-400 hover:text-gray-600 px-4'}`}
             >
               <span className="text-xs font-bold">Project Source</span>
             </button>
           </div>
           
           {/* Right Section - Viewport & Deploy */}
           <div className="flex items-center justify-end gap-3">
              <div className="flex bg-gray-100/80 p-1 rounded-xl border border-gray-100 shadow-inner mr-2">
                <button 
                  onClick={() => setDevice('desktop')} 
                  className={`p-1.5 rounded-lg transition-all flex items-center justify-center ${device === 'desktop' ? 'bg-white text-indigo-600 shadow-sm px-3' : 'text-gray-400 hover:text-gray-600 px-2'}`}
                  title="Desktop View"
                >
                  <Monitor size={14} />
                </button>
                <button 
                  onClick={() => setDevice('tablet')} 
                  className={`p-1.5 rounded-lg transition-all flex items-center justify-center ${device === 'tablet' ? 'bg-white text-indigo-600 shadow-sm px-3' : 'text-gray-400 hover:text-gray-600 px-2'}`}
                  title="Tablet View"
                >
                  <Tablet size={14} />
                </button>
                <button 
                  onClick={() => setDevice('mobile')} 
                  className={`p-1.5 rounded-lg transition-all flex items-center justify-center ${device === 'mobile' ? 'bg-white text-indigo-600 shadow-sm px-3' : 'text-gray-400 hover:text-gray-600 px-2'}`}
                  title="Mobile View"
                >
                  <Smartphone size={14} />
                </button>
              </div>

              <button className="px-5 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold shadow-[0_2px_10px_rgba(79,70,229,0.2)] hover:bg-indigo-700 transition-all flex items-center gap-2 active:scale-95">
                <Rocket size={14} /> DEPLOY STUDIO
              </button>
           </div>
        </header>

        <div className="flex-1 overflow-hidden relative flex flex-col bg-slate-100">
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
