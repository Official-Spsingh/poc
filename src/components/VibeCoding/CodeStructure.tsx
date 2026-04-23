import { AnimatePresence, motion } from 'framer-motion';
import {
  ChevronDown,
  ChevronRight,
  ChevronsUpDown,
  FileCode,
  FileJson,
  FilePlus,
  FileText,
  Folder,
  FolderOpen,
  FolderPlus,
  Globe,
  Hash,
  MoreHorizontal,
  Pencil,
  Plus,
  Search,
  Trash2,
  X,
} from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import Editor from '@monaco-editor/react';
import { Project } from './VibeCoder';

export type FileNode = { name: string; path: string; type: 'file' | 'folder'; children?: FileNode[] };

// ── Syntax highlight ───────────────────────────────────────────────────────────
const getMonacoLanguage = (filename: string) => {
  const ext = filename.split('.').pop() ?? '';
  if (ext === 'tsx' || ext === 'ts') return 'typescript';
  if (ext === 'jsx' || ext === 'js') return 'javascript';
  if (ext === 'css')  return 'css';
  if (ext === 'json') return 'json';
  if (ext === 'html') return 'html';
  return 'plaintext';
};

// ── File icons ─────────────────────────────────────────────────────────────────
export const getFileIcon = (filename: string, size = 13) => {
  if (filename.endsWith('.tsx') || filename.endsWith('.ts'))
    return <FileCode size={size} className="text-blue-400" />;
  if (filename.endsWith('.jsx') || filename.endsWith('.js'))
    return <FileCode size={size} className="text-yellow-400" />;
  if (filename.endsWith('.css'))
    return <Hash size={size} className="text-pink-400" />;
  if (filename.endsWith('.json'))
    return <FileJson size={size} className="text-amber-400" />;
  if (filename.endsWith('.html'))
    return <Globe size={size} className="text-orange-400" />;
  return <FileText size={size} className="text-slate-400" />;
};

const LANG_LABEL: Record<string, string> = {
  tsx: 'TSX', ts: 'TypeScript', jsx: 'JSX', js: 'JavaScript',
  css: 'CSS', json: 'JSON', html: 'HTML', txt: 'Text',
};
const getLanguageLabel = (filename: string) => {
  const ext = filename.split('.').pop() ?? '';
  return LANG_LABEL[ext] ?? ext.toUpperCase();
};

// ── Inline new-item input ──────────────────────────────────────────────────────
const InlineNewItem: React.FC<{
  type: 'file' | 'folder';
  depth: number;
  onCommit: (name: string) => void;
  onCancel: () => void;
}> = ({ type, depth, onCommit, onCancel }) => {
  const [name, setName] = useState(type === 'file' ? 'NewFile.tsx' : 'NewFolder');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setTimeout(() => { inputRef.current?.focus(); inputRef.current?.select(); }, 30);
  }, []);

  return (
    <div
      style={{ paddingLeft: `${depth * 12 + 6}px` }}
      className="flex items-center gap-1 pr-2 h-7 mx-1"
    >
      <span className="w-3.5 shrink-0" />
      <span className="shrink-0 flex items-center justify-center">
        {type === 'file' ? getFileIcon(name || 'file.tsx') : <Folder size={13} className="text-amber-400" />}
      </span>
      <input
        ref={inputRef}
        value={name}
        onChange={e => setName(e.target.value)}
        onKeyDown={e => {
          if (e.key === 'Enter')  { e.stopPropagation(); name.trim() ? onCommit(name.trim()) : onCancel(); }
          if (e.key === 'Escape') { e.stopPropagation(); onCancel(); }
        }}
        onBlur={() => { name.trim() ? onCommit(name.trim()) : onCancel(); }}
        className="flex-1 bg-mod-surface-bg border border-mod-hero-icon-color/60 rounded px-1.5 py-0.5 text-[11px] text-mod-surface-text-primary outline-none min-w-0 ml-1"
      />
    </div>
  );
};

// ── FileTreeItem ───────────────────────────────────────────────────────────────
interface FileTreeItemProps {
  node: FileNode;
  depth?: number;
  activeFile: string;
  collapseKey: number;
  renamingPath: string | null;
  onSelectFile: (path: string) => void;
  onRenameItem: (oldPath: string, newPath: string) => void;
  onRenameCancel: () => void;
  onOpenContextMenu: (path: string, type: 'file' | 'folder', x: number, y: number) => void;
  pendingCreate: { parentPath: string; type: 'file' | 'folder' } | null;
  setPendingCreate: React.Dispatch<React.SetStateAction<{ parentPath: string; type: 'file' | 'folder' } | null>>;
  onCommitCreate: (parentPath: string, type: 'file' | 'folder', name: string) => void;
}

const FileTreeItem: React.FC<FileTreeItemProps> = ({
  node, depth = 0, activeFile, collapseKey, renamingPath,
  onSelectFile, onRenameItem, onRenameCancel, onOpenContextMenu,
  pendingCreate, setPendingCreate, onCommitCreate,
}) => {
  const [isOpen, setIsOpen]         = useState(depth < 2);
  const [renameValue, setRenameValue] = useState('');
  const renameInputRef = useRef<HTMLInputElement>(null);
  const isFile      = node.type === 'file';
  const isActive    = isFile && activeFile === node.path;
  const isRenaming  = renamingPath === node.path;
  const isCreatingHere = !isFile && pendingCreate?.parentPath === node.path;

  // Collapse all
  useEffect(() => { if (!isFile) setIsOpen(false); }, [collapseKey]);

  // Start rename when triggered from context menu
  useEffect(() => {
    if (isRenaming) {
      setRenameValue(node.name);
      setTimeout(() => { renameInputRef.current?.focus(); renameInputRef.current?.select(); }, 30);
    }
  }, [isRenaming]);

  // Auto-open folder when a create is requested inside it
  useEffect(() => {
    if (isCreatingHere) setIsOpen(true);
  }, [pendingCreate]);

  const commitRename = () => {
    const trimmed = renameValue.trim();
    if (trimmed && trimmed !== node.name) {
      const lastSlash = node.path.lastIndexOf('/');
      const newPath = lastSlash >= 0 ? `${node.path.substring(0, lastSlash)}/${trimmed}` : trimmed;
      onRenameItem(node.path, newPath);
    }
    onRenameCancel();
  };

  const handleClick = () => {
    if (isRenaming) return;
    if (isFile) onSelectFile(node.path);
    else setIsOpen(v => !v);
  };

  const handleMenuBtn = (e: React.MouseEvent) => {
    e.stopPropagation();
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    onOpenContextMenu(node.path, node.type, rect.left, rect.bottom);
  };

  return (
    <div className="w-full">
      <div
        onClick={handleClick}
        style={{ paddingLeft: `${depth * 12 + 6}px` }}
        className={`group relative flex items-center gap-1 pr-1 h-7 mx-1 rounded-md cursor-pointer transition-colors ${
          isActive
            ? 'bg-mod-hero-badge-bg/50 text-mod-surface-text-primary'
            : 'text-mod-surface-text-secondary hover:bg-mod-surface-hover hover:text-mod-surface-text-primary'
        }`}
      >
        {isActive && (
          <span className="absolute left-0 top-1 bottom-1 w-0.5 bg-mod-hero-icon-color rounded-r-full" />
        )}

        <span className="w-3.5 shrink-0 flex items-center justify-center">
          {!isFile && (
            <ChevronRight
              size={11}
              className={`text-mod-surface-text-muted transition-transform duration-150 ${isOpen ? 'rotate-90' : ''}`}
            />
          )}
        </span>

        <span className="shrink-0 flex items-center justify-center">
          {isFile
            ? getFileIcon(node.name)
            : isOpen
              ? <FolderOpen size={13} className="text-mod-hero-icon-color" />
              : <Folder     size={13} className="text-amber-400" />
          }
        </span>

        {isRenaming ? (
          <input
            ref={renameInputRef}
            value={renameValue}
            onChange={e => setRenameValue(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter')  { e.stopPropagation(); commitRename(); }
              if (e.key === 'Escape') { e.stopPropagation(); onRenameCancel(); }
            }}
            onBlur={commitRename}
            onClick={e => e.stopPropagation()}
            className="flex-1 bg-mod-surface-bg border border-mod-hero-icon-color/60 rounded px-1.5 py-0.5 text-[11px] text-mod-surface-text-primary outline-none min-w-0 ml-1"
          />
        ) : (
          <span className="flex-1 truncate text-[11px] font-medium ml-1 leading-none select-none">
            {node.name}
          </span>
        )}

        {!isRenaming && (
          <button
            onClick={handleMenuBtn}
            className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-mod-surface-hover text-mod-surface-text-muted hover:text-mod-surface-text-primary transition-all shrink-0"
            title="More actions"
          >
            <MoreHorizontal size={12} />
          </button>
        )}
      </div>

      <AnimatePresence initial={false}>
        {!isFile && isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.15, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            {isCreatingHere && (
              <InlineNewItem
                type={pendingCreate!.type}
                depth={depth + 1}
                onCommit={name => { onCommitCreate(node.path, pendingCreate!.type, name); setPendingCreate(null); }}
                onCancel={() => setPendingCreate(null)}
              />
            )}
            {node.children?.map(child => (
              <FileTreeItem
                key={child.path}
                node={child}
                depth={depth + 1}
                activeFile={activeFile}
                collapseKey={collapseKey}
                renamingPath={renamingPath}
                onSelectFile={onSelectFile}
                onRenameItem={onRenameItem}
                onRenameCancel={onRenameCancel}
                onOpenContextMenu={onOpenContextMenu}
                pendingCreate={pendingCreate}
                setPendingCreate={setPendingCreate}
                onCommitCreate={onCommitCreate}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// ── CodeStructure ──────────────────────────────────────────────────────────────
interface CodeStructureProps {
  fileTree: FileNode[];
  activeFile: string;
  setActiveFile: (file: string) => void;
  activeProject: Project;
  handleUpdateFile: (content: string) => void;
  handleCreateNewItem: (parentPath: string, type: 'file' | 'folder', name: string) => void;
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
  handleRenameItem,
}) => {
  const [filterText, setFilterText]   = useState('');
  const [showNewMenu, setShowNewMenu] = useState(false);
  const [collapseKey, setCollapseKey] = useState(0);
  const [pendingCreate, setPendingCreate] = useState<{ parentPath: string; type: 'file' | 'folder' } | null>(null);
  const [renamingPath, setRenamingPath]   = useState<string | null>(null);
  const [contextMenu, setContextMenu]    = useState<{ path: string; type: 'file' | 'folder'; x: number; y: number } | null>(null);
  const newMenuRef     = useRef<HTMLDivElement>(null);
  const contextMenuRef = useRef<HTMLDivElement>(null);

  // Close new-menu on outside click
  useEffect(() => {
    if (!showNewMenu) return;
    const handler = (e: MouseEvent) => {
      if (newMenuRef.current && !newMenuRef.current.contains(e.target as Node))
        setShowNewMenu(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [showNewMenu]);

  // Close context menu on outside click
  useEffect(() => {
    if (!contextMenu) return;
    const handler = (e: MouseEvent) => {
      if (contextMenuRef.current && !contextMenuRef.current.contains(e.target as Node))
        setContextMenu(null);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [contextMenu]);

  const onCommitCreate = (parentPath: string, type: 'file' | 'folder', name: string) => {
    handleCreateNewItem(parentPath, type, name);
  };

  // Flat file list for filter mode
  const flatFiles = (() => {
    const result: FileNode[] = [];
    const walk = (nodes: FileNode[]) => nodes.forEach(n => {
      if (n.type === 'file') result.push(n);
      if (n.children) walk(n.children);
    });
    walk(fileTree);
    return result;
  })();

  const filteredFiles = filterText.trim()
    ? flatFiles.filter(f => f.name.toLowerCase().includes(filterText.toLowerCase()))
    : null;

  const totalFiles   = flatFiles.length;
  const totalFolders = (() => {
    let c = 0;
    const walk = (nodes: FileNode[]) => nodes.forEach(n => { if (n.type === 'folder') { c++; if (n.children) walk(n.children); } });
    walk(fileTree);
    return c;
  })();

  const breadcrumbs = activeFile.split('/');
  const langLabel   = getLanguageLabel(activeFile);
  const currentFileContent = activeProject.files[activeFile]?.content ?? '';

  // ── Context menu portal ─────────────────────────────────────────────────────
  const contextMenuPortal = contextMenu ? ReactDOM.createPortal(
    <div
      ref={contextMenuRef}
      style={{
        position: 'fixed',
        top: contextMenu.y + 4,
        left: Math.min(contextMenu.x, window.innerWidth - 192),
        zIndex: 9999,
      }}
      className="w-44 bg-mod-surface-card border border-mod-surface-border rounded-xl shadow-2xl overflow-hidden py-1"
    >
      {contextMenu.type === 'folder' && (
        <>
          <button
            onClick={() => { setPendingCreate({ parentPath: contextMenu.path, type: 'file' }); setContextMenu(null); }}
            className="w-full flex items-center gap-2.5 px-3 py-2 text-[11px] text-mod-surface-text-secondary hover:bg-mod-surface-hover transition-colors"
          >
            <FilePlus size={12} className="text-mod-hero-icon-color" />
            New file
          </button>
          <button
            onClick={() => { setPendingCreate({ parentPath: contextMenu.path, type: 'folder' }); setContextMenu(null); }}
            className="w-full flex items-center gap-2.5 px-3 py-2 text-[11px] text-mod-surface-text-secondary hover:bg-mod-surface-hover transition-colors"
          >
            <FolderPlus size={12} className="text-amber-400" />
            New folder
          </button>
          <div className="border-t border-mod-surface-border my-1 mx-2" />
        </>
      )}
      <button
        onClick={() => { setRenamingPath(contextMenu.path); setContextMenu(null); }}
        className="w-full flex items-center gap-2.5 px-3 py-2 text-[11px] text-mod-surface-text-secondary hover:bg-mod-surface-hover transition-colors"
      >
        <Pencil size={12} className="text-mod-surface-text-muted" />
        Rename
      </button>
      <div className="border-t border-mod-surface-border my-1 mx-2" />
      <button
        onClick={() => { handleDeleteItem(contextMenu.path, contextMenu.type); setContextMenu(null); }}
        className="w-full flex items-center gap-2.5 px-3 py-2 text-[11px] text-rose-400 hover:bg-rose-500/10 transition-colors"
      >
        <Trash2 size={12} />
        Delete
      </button>
    </div>,
    document.body
  ) : null;

  return (
    <motion.div
      key="code"
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0 }}
      className="w-full h-full overflow-hidden flex"
      style={{ backgroundColor: '#0f172a' }}
    >
      {/* ── Sidebar ── */}
      <aside className="w-60 bg-mod-surface-card border-r border-mod-surface-border flex flex-col shrink-0 overflow-hidden">

        {/* Header */}
        <div className="h-10 flex items-center justify-between px-3 border-b border-mod-surface-border shrink-0">
          <span className="text-[10px] font-bold uppercase tracking-widest text-mod-surface-text-muted">Explorer</span>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setCollapseKey(k => k + 1)}
              title="Collapse all"
              className="p-1 rounded hover:bg-mod-surface-hover text-mod-surface-text-muted hover:text-mod-surface-text-primary transition-colors"
            >
              <ChevronsUpDown size={13} />
            </button>

            <div className="relative" ref={newMenuRef}>
              <button
                onClick={() => setShowNewMenu(v => !v)}
                title="New file or folder"
                className={`p-1 rounded transition-colors flex items-center gap-0.5 ${showNewMenu ? 'bg-mod-surface-hover text-mod-surface-text-primary' : 'hover:bg-mod-surface-hover text-mod-surface-text-muted hover:text-mod-surface-text-primary'}`}
              >
                <Plus size={13} />
                <ChevronDown size={9} className={`transition-transform duration-150 ${showNewMenu ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {showNewMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: -4, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -4, scale: 0.96 }}
                    transition={{ duration: 0.1 }}
                    className="absolute right-0 top-full mt-1.5 w-40 bg-mod-surface-card border border-mod-surface-border rounded-xl shadow-2xl overflow-hidden z-50 py-1"
                  >
                    <button
                      onClick={() => { setPendingCreate({ parentPath: '', type: 'file' }); setShowNewMenu(false); }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-[11px] text-mod-surface-text-secondary hover:bg-mod-surface-hover transition-colors"
                    >
                      <FilePlus size={12} className="text-mod-hero-icon-color" />
                      New file
                    </button>
                    <button
                      onClick={() => { setPendingCreate({ parentPath: '', type: 'folder' }); setShowNewMenu(false); }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-[11px] text-mod-surface-text-secondary hover:bg-mod-surface-hover transition-colors"
                    >
                      <FolderPlus size={12} className="text-amber-400" />
                      New folder
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Search / filter */}
        <div className="px-2 py-2 border-b border-mod-surface-border shrink-0">
          <div className="flex items-center gap-2 px-2 py-1.5 bg-mod-surface-hover border border-mod-surface-border rounded-lg">
            <Search size={11} className="text-mod-surface-text-muted shrink-0" />
            <input
              type="text"
              value={filterText}
              onChange={e => setFilterText(e.target.value)}
              placeholder="Filter files…"
              className="flex-1 bg-transparent text-[11px] text-mod-surface-text-primary placeholder:text-mod-surface-text-muted outline-none min-w-0"
            />
            {filterText && (
              <button onClick={() => setFilterText('')} className="text-mod-surface-text-muted hover:text-mod-surface-text-primary transition-colors shrink-0">
                <X size={10} />
              </button>
            )}
          </div>
        </div>

        {/* Tree or filtered flat list */}
        <div className="flex-1 overflow-y-auto scrollbar-custom py-1">
          {filteredFiles ? (
            filteredFiles.length > 0 ? (
              <div className="flex flex-col gap-0.5 px-1">
                {filteredFiles.map(file => (
                  <button
                    key={file.path}
                    onClick={() => setActiveFile(file.path)}
                    className={`w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-left transition-colors ${
                      activeFile === file.path
                        ? 'bg-mod-hero-badge-bg/50 text-mod-surface-text-primary'
                        : 'text-mod-surface-text-secondary hover:bg-mod-surface-hover hover:text-mod-surface-text-primary'
                    }`}
                  >
                    {getFileIcon(file.name)}
                    <span className="text-[11px] truncate">{file.name}</span>
                    <span className="text-[9px] text-mod-surface-text-muted truncate ml-auto shrink-0 max-w-[80px]">
                      {file.path.split('/').slice(0, -1).join('/')}
                    </span>
                  </button>
                ))}
              </div>
            ) : (
              <p className="text-[10px] text-mod-surface-text-muted text-center py-8 italic">No files match "{filterText}"</p>
            )
          ) : (
            <div className="flex flex-col gap-0.5">
              {/* Root-level inline new item */}
              {pendingCreate?.parentPath === '' && (
                <InlineNewItem
                  type={pendingCreate.type}
                  depth={0}
                  onCommit={name => { onCommitCreate('', pendingCreate.type, name); setPendingCreate(null); }}
                  onCancel={() => setPendingCreate(null)}
                />
              )}
              {fileTree.map(node => (
                <FileTreeItem
                  key={node.path}
                  node={node}
                  activeFile={activeFile}
                  collapseKey={collapseKey}
                  renamingPath={renamingPath}
                  onSelectFile={setActiveFile}
                  onRenameItem={handleRenameItem}
                  onRenameCancel={() => setRenamingPath(null)}
                  onOpenContextMenu={(path, type, x, y) => setContextMenu({ path, type, x, y })}
                  pendingCreate={pendingCreate}
                  setPendingCreate={setPendingCreate}
                  onCommitCreate={onCommitCreate}
                />
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-3 py-2 border-t border-mod-surface-border shrink-0 flex items-center gap-2">
          <span className="text-[9px] text-mod-surface-text-muted font-mono">
            {totalFiles} file{totalFiles !== 1 ? 's' : ''} · {totalFolders} folder{totalFolders !== 1 ? 's' : ''}
          </span>
        </div>
      </aside>

      {/* ── Editor ── */}
      <div className="flex-1 flex flex-col overflow-hidden" style={{ backgroundColor: '#0f172a' }}>

        {/* Editor header with breadcrumb — dark regardless of theme */}
        <div className="h-10 border-b px-4 flex items-center justify-between shrink-0"
          style={{ backgroundColor: '#0d1117', borderColor: 'rgba(255,255,255,0.06)' }}
        >
          <div className="flex items-center gap-1.5 min-w-0">
            {breadcrumbs.map((crumb, idx) => (
              <React.Fragment key={idx}>
                {idx > 0 && <ChevronRight size={10} className="text-slate-600 shrink-0" />}
                <span className={`text-[11px] truncate ${
                  idx === breadcrumbs.length - 1
                    ? 'text-slate-200 font-medium flex items-center gap-1.5'
                    : 'text-slate-500'
                }`}>
                  {idx === breadcrumbs.length - 1 && (
                    <span className="shrink-0">{getFileIcon(crumb, 12)}</span>
                  )}
                  {crumb}
                </span>
              </React.Fragment>
            ))}
          </div>

          <div className="flex items-center gap-2 shrink-0 ml-4">
            <span className="px-1.5 py-0.5 rounded text-[9px] font-mono uppercase"
              style={{ backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', color: '#64748b' }}
            >
              {langLabel}
            </span>
            <span className="text-[9px] font-mono" style={{ color: '#475569' }}>
              {currentFileContent.split('\n').length} lines
            </span>
          </div>
        </div>

        {/* Code editor */}
        <div className="flex-1 overflow-auto scrollbar-custom relative">
          <Editor
            height="100%"
            language={getMonacoLanguage(activeFile)}
            value={currentFileContent}
            onChange={value => handleUpdateFile(value ?? '')}
            theme="vs-dark"
            onMount={(editor, monaco) => {
              monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
                target: monaco.languages.typescript.ScriptTarget.ESNext,
                allowNonTsExtensions: true,
                moduleResolution: monaco.languages.typescript.ModuleResolutionKind.NodeJs,
                module: monaco.languages.typescript.ModuleKind.ESNext,
                noEmit: true,
                esModuleInterop: true,
                jsx: monaco.languages.typescript.JsxEmit.React,
                reactNamespace: 'React',
                allowJs: true,
                typeRoots: ['node_modules/@types']
              });

              // Suppress "Cannot find module" errors (2792) since we use CDN imports in the sandbox
              monaco.languages.typescript.typescriptDefaults.setDiagnosticsOptions({
                diagnosticCodesToIgnore: [2792],
                noSemanticValidation: false,
                noSyntaxValidation: false,
              });
            }}
            options={{
              minimap: { enabled: false },
              fontSize: 13,
              fontFamily: "'Fira Code', 'Cascadia Code', Consolas, monospace",
              fontLigatures: true,
              lineNumbers: 'on',
              roundedSelection: true,
              scrollBeyondLastLine: false,
              readOnly: false,
              automaticLayout: true,
              padding: { top: 16, bottom: 16 },
              cursorSmoothCaretAnimation: 'on',
              smoothScrolling: true,
              contextmenu: true,
              suggestOnTriggerCharacters: true,
              acceptSuggestionOnEnter: 'on',
              tabSize: 2,
            }}
          />
        </div>
      </div>

      {contextMenuPortal}
    </motion.div>
  );
};

export default CodeStructure;
