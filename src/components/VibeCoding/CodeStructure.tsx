import { motion } from 'framer-motion';
import { ChevronRight, Edit2, FileCode, FileJson, FilePlus, FolderOpen, FolderPlus, Globe, Hash, Trash2 } from 'lucide-react';
import Prism from 'prismjs';
import 'prismjs/components/prism-css';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-json';
import 'prismjs/components/prism-jsx';
import 'prismjs/components/prism-tsx';
import 'prismjs/components/prism-typescript';
import 'prismjs/themes/prism-tomorrow.css';
import React, { useState } from 'react';
import Editor from 'react-simple-code-editor';
import { Project } from './VibeCoder';

export type FileNode = { name: string; path: string; type: 'file' | 'folder'; children?: FileNode[] };

const highlightWithPrism = (code: string, filename: string) => {
  let lang = 'typescript';
  if (filename.endsWith('.css')) lang = 'css';
  else if (filename.endsWith('.json')) lang = 'json';
  else if (filename.endsWith('.jsx')) lang = 'jsx';
  else if (filename.endsWith('.js')) lang = 'javascript';
  else if (filename.endsWith('.tsx')) lang = 'tsx';
  else if (filename.endsWith('.html')) lang = 'markup';
  
  const grammar = Prism.languages[lang] || Prism.languages.typescript || Prism.languages.javascript;
  if (!grammar) return code;
  return Prism.highlight(code, grammar, lang);
};

export const getFileIcon = (filename: string) => {
    if (filename.endsWith('.tsx') || filename.endsWith('.ts')) return <FileCode size={14} className="text-blue-400" />;
    if (filename.endsWith('.css')) return <Hash size={14} className="text-pink-400" />;
    if (filename.endsWith('.json')) return <FileJson size={14} className="text-amber-400" />;
    return <Globe size={14} className="text-orange-400" />;
};

interface FileTreeItemProps {
  node: FileNode;
  depth?: number;
  activeFile: string;
  onSelectFile: (path: string) => void;
  onCreateItem: (parentPath: string, type: 'file' | 'folder') => void;
  onDeleteItem: (path: string, type: 'file' | 'folder') => void;
  onRenameItem: (oldPath: string, newPath: string) => void;
}

const FileTreeItem: React.FC<FileTreeItemProps> = ({
  node, depth = 0, activeFile, onSelectFile, onCreateItem, onDeleteItem, onRenameItem
}) => {
  const [isOpen, setIsOpen] = useState(depth < 2);
  const isFile = node.type === 'file';
  
  const handleRename = (e: React.MouseEvent) => {
    e.stopPropagation();
    const newName = window.prompt(`Rename ${node.name} to:`, node.name);
    if (!newName || newName === node.name) return;
    
    const oldPath = node.path;
    const lastSlashIdx = oldPath.lastIndexOf('/');
    const newPath = lastSlashIdx >= 0 ? `${oldPath.substring(0, lastSlashIdx)}/${newName}` : newName;
    onRenameItem(oldPath, newPath);
  };

  return (
    <div className="w-full">
      <button 
        onClick={() => isFile ? onSelectFile(node.path) : setIsOpen(!isOpen)}
        style={{ paddingLeft: `${(depth * 14) + 16}px` }}
        className={`w-full flex items-center justify-between py-1.5 pr-2 text-[11px] transition-all group ${
          activeFile === node.path
            ? 'bg-mod-hero-badge-bg text-mod-hero-badge-text font-bold'
            : 'text-mod-surface-text-secondary hover:bg-mod-surface-hover hover:text-mod-surface-text-primary font-medium'
        }`}
      >
        <div className="flex items-center gap-2 truncate">
            <span className="shrink-0 flex items-center justify-center w-4 h-4 text-mod-surface-text-muted group-hover:text-mod-surface-text-secondary">
              {!isFile ? (
                <ChevronRight size={14} className={`transition-transform duration-200 ${isOpen ? 'rotate-90' : ''}`} />
              ) : (
                <span className="opacity-90">{getFileIcon(node.name)}</span>
              )}
            </span>
            <span className="truncate">{node.name}</span>
        </div>

        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
           {!isFile && (
              <>
                 <span onClick={(e) => { e.stopPropagation(); onCreateItem(node.path, 'file'); setIsOpen(true); }} className="p-0.5 text-mod-surface-text-muted hover:text-mod-hero-icon-color" title="New File in Folder"><FilePlus size={12} /></span>
                 <span onClick={(e) => { e.stopPropagation(); onCreateItem(node.path, 'folder'); setIsOpen(true); }} className="p-0.5 text-mod-surface-text-muted hover:text-mod-hero-icon-color" title="New Nested Folder"><FolderPlus size={12} /></span>
              </>
           )}
           <span onClick={handleRename} className="p-0.5 text-mod-surface-text-muted hover:text-mod-hero-icon-color" title="Rename"><Edit2 size={12} /></span>
           <span onClick={(e) => { e.stopPropagation(); onDeleteItem(node.path, node.type); }} className="p-0.5 text-mod-surface-text-muted hover:text-rose-500" title="Delete"><Trash2 size={12} /></span>
        </div>
      </button>
      
      {!isFile && isOpen && node.children && (
        <div className="flex flex-col">
          {node.children.map((child: any) => (
            <FileTreeItem 
              key={child.path} 
              node={child} 
              depth={depth + 1} 
              activeFile={activeFile} 
              onSelectFile={onSelectFile} 
              onCreateItem={onCreateItem}
              onDeleteItem={onDeleteItem}
              onRenameItem={onRenameItem}
            />
          ))}
        </div>
      )}
    </div>
  );
};

interface CodeStructureProps {
    fileTree: FileNode[];
    activeFile: string;
    setActiveFile: (file: string) => void;
    activeProject: Project;
    handleUpdateFile: (content: string) => void;
    handleCreateNewItem: (parentPath: string, type: 'file' | 'folder') => void;
    handleDeleteItem: (path: string, type: 'file' | 'folder') => void;
    handleRenameItem: (oldPath: string, newPath: string) => void;
}

const CodeStructure: React.FC<CodeStructureProps> = ({
    fileTree,
    activeFile,
    setActiveFile,
    activeProject,
    handleUpdateFile,
    handleCreateNewItem,
    handleDeleteItem,
    handleRenameItem
}) => {
    return (
        <motion.div key="code" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="w-full h-full bg-[#0f172a] overflow-hidden flex">
            <aside className="w-64 bg-mod-surface-bg border-r border-mod-surface-border flex flex-col pt-4 overflow-y-auto custom-scrollbar shrink-0" style={{ minWidth: '16rem' }}>
               <div className="flex items-center justify-between px-4 mb-4">
                 <div className="flex items-center gap-2">
                    <FolderOpen size={14} className="text-mod-hero-icon-color" />
                    <span className="text-[10px] font-black uppercase text-mod-surface-text-secondary tracking-widest">Project Graph</span>
                 </div>
                 <div className="flex gap-2 text-mod-surface-text-muted">
                    <button onClick={() => handleCreateNewItem('', 'file')} className="hover:text-mod-hero-icon-color transition-colors" title="New File"><FilePlus size={14} /></button>
                    <button onClick={() => handleCreateNewItem('', 'folder')} className="hover:text-mod-hero-icon-color transition-colors" title="New Folder"><FolderPlus size={14} /></button>
                 </div>
               </div>
               <div className="flex flex-col gap-0.5 pb-6">
                 {fileTree.map((node) => (
                   <FileTreeItem 
                     key={node.path} 
                     node={node} 
                     activeFile={activeFile} 
                     onSelectFile={setActiveFile} 
                     onCreateItem={handleCreateNewItem}
                     onDeleteItem={handleDeleteItem}
                     onRenameItem={handleRenameItem}
                   />
                 ))}
               </div>
            </aside>
            <div className="flex-1 flex flex-col relative overflow-hidden bg-[#0f172a]">
               <div className="h-10 bg-[#0f172a] border-b border-white/5 px-6 flex items-center justify-between font-mono text-[11px] text-slate-400 shrink-0">
                  <div className="flex items-center gap-3">
                     {getFileIcon(activeFile)}
                     <span>{activeFile}</span>
                  </div>
                  <div className="px-2 py-0.5 bg-mod-hero-badge-bg/10 text-mod-hero-icon-color/70 rounded text-[9px] font-black uppercase tracking-tighter">Read/Write Sync</div>
               </div>
               <div className="flex-1 overflow-auto custom-scrollbar relative">
                 <Editor
                   value={activeProject.files[activeFile].content}
                   onValueChange={handleUpdateFile}
                   highlight={(code) => highlightWithPrism(code, activeFile)}
                   padding={24}
                   className="min-h-full font-mono text-[13px] leading-snug text-[#94a3b8] selection:bg-mod-hero-btn-bg/30"
                   style={{ fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace' }}
                   textareaClassName="outline-none"
                 />
               </div>
            </div>
        </motion.div>
    );
};

export default CodeStructure;
