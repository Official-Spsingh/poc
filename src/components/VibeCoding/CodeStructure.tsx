import { AnimatePresence, motion } from 'framer-motion';
import {
  ChevronDown,
  ChevronRight,
  ChevronsUpDown,
  FilePlus,
  Folder,
  FolderPlus,
  MoreHorizontal,
  Pencil,
  Plus,
  Search,
  Trash2,
  X,
} from 'lucide-react';
import React, { startTransition, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import Editor from '@monaco-editor/react';
import FileTreeItem from './FileTreeItem';
import InlineNewItem from './InlineNewItem';
import MonacoLoader from './MonacoLoader';
import { getFileIcon, getLanguageLabel, getMonacoLanguage } from './fileTreeUtils';
import { type CodeStructureProps, type FileNode } from './vibeCoderTypes';

// Static editor options — outside component to avoid recreation on every render
const EDITOR_OPTIONS = {
  minimap: { enabled: false },
  fontSize: 13,
  fontFamily: "'Fira Code', 'Cascadia Code', Consolas, monospace",
  fontLigatures: true,
  lineNumbers: 'on' as const,
  roundedSelection: true,
  scrollBeyondLastLine: false,
  readOnly: false,
  automaticLayout: true,
  padding: { top: 16, bottom: 16 },
  cursorSmoothCaretAnimation: 'off' as const,
  smoothScrolling: true,
  contextmenu: true,
  suggestOnTriggerCharacters: true,
  acceptSuggestionOnEnter: 'on' as const,
  tabSize: 2,
} as const;

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
  const [isEditorReady, setIsEditorReady] = useState(false);
  const [filterText, setFilterText]   = useState('');
  const [showNewMenu, setShowNewMenu] = useState(false);
  const [collapseKey, setCollapseKey] = useState(0);
  const [pendingCreate, setPendingCreate] = useState<{ parentPath: string; type: 'file' | 'folder' } | null>(null);
  const [renamingPath, setRenamingPath]   = useState<string | null>(null);
  const [contextMenu, setContextMenu]    = useState<{ path: string; type: 'file' | 'folder'; x: number; y: number } | null>(null);
  const newMenuRef     = useRef<HTMLDivElement>(null);
  const contextMenuRef = useRef<HTMLDivElement>(null);

  // Editor refs — used to drive Monaco without the controlled-component re-render loop
  const editorRef       = useRef<any>(null);
  const activeFileRef   = useRef(activeFile);
  const latestFilesRef  = useRef(activeProject.files);
  // When we call editor.setValue() programmatically (file switch / mount), Monaco fires
  // onChange synchronously. At that moment VibeCoder's latestActiveFile ref hasn't been
  // updated yet (parent effects run after children), so handleUpdateFile would write the
  // new content to the wrong file path. This flag suppresses those spurious saves.
  const suppressSaveRef = useRef(false);
  useEffect(() => { latestFilesRef.current = activeProject.files; }, [activeProject.files]);

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

  // Only sync editor on file switch — never on content changes while typing.
  // activeFileRef is always updated first so handleEditorMount can read the correct
  // file even if Monaco hadn't finished loading when the switch happened.
  useEffect(() => {
    const prevFile = activeFileRef.current;
    activeFileRef.current = activeFile; // always track latest, even before editor is ready
    if (!editorRef.current || activeFile === prevFile) return;
    suppressSaveRef.current = true;
    editorRef.current.setValue(latestFilesRef.current[activeFile]?.content ?? '');
    suppressSaveRef.current = false;
  }, [activeFile]); // eslint-disable-line react-hooks/exhaustive-deps

  // Stable callbacks to avoid re-renders in memoized children
  const handleRenameCancel = useCallback(() => setRenamingPath(null), []);

  const handleOpenContextMenu = useCallback((path: string, type: 'file' | 'folder', x: number, y: number) => {
    setContextMenu({ path, type, x, y });
  }, []);

  const onCommitCreate = useCallback((parentPath: string, type: 'file' | 'folder', name: string) => {
    handleCreateNewItem(parentPath, type, name);
  }, [handleCreateNewItem]);

  const handleEditorChange = useCallback((value: string | undefined) => {
    if (suppressSaveRef.current) return; // fired by setValue, not user input — skip
    startTransition(() => handleUpdateFile(value ?? ''));
  }, [handleUpdateFile]);

  const handleEditorMount = useCallback((editor: any, monaco: any) => {
    editorRef.current = editor;
    // If the user switched files while Monaco was loading, defaultValue would be stale —
    // force-sync the correct content now. Suppress onChange so it doesn't save to wrong file.
    suppressSaveRef.current = true;
    editor.setValue(latestFilesRef.current[activeFileRef.current]?.content ?? '');
    suppressSaveRef.current = false;
    setIsEditorReady(true);
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
      typeRoots: ['node_modules/@types'],
    });
    monaco.languages.typescript.typescriptDefaults.setDiagnosticsOptions({
      diagnosticCodesToIgnore: [2792],
      noSemanticValidation: false,
      noSyntaxValidation: false,
    });
  }, []);

  // Memoized derived values — only recomputed when dependencies change
  const flatFiles = useMemo(() => {
    const result: FileNode[] = [];
    const walk = (nodes: FileNode[]) => nodes.forEach(n => {
      if (n.type === 'file') result.push(n);
      if (n.children) walk(n.children);
    });
    walk(fileTree);
    return result;
  }, [fileTree]);

  const totalFolders = useMemo(() => {
    let c = 0;
    const walk = (nodes: FileNode[]) => nodes.forEach(n => {
      if (n.type === 'folder') { c++; if (n.children) walk(n.children); }
    });
    walk(fileTree);
    return c;
  }, [fileTree]);

  const filteredFiles = useMemo(() =>
    filterText.trim()
      ? flatFiles.filter(f => f.name.toLowerCase().includes(filterText.toLowerCase()))
      : null,
    [filterText, flatFiles]
  );

  const breadcrumbs = useMemo(() => activeFile.split('/'), [activeFile]);
  const langLabel   = useMemo(() => getLanguageLabel(activeFile), [activeFile]);
  const lineCount   = useMemo(
    () => (activeProject.files[activeFile]?.content ?? '').split('\n').length,
    [activeProject.files, activeFile]
  );

  // defaultValue for Monaco — only used at initial mount; file switches go through the useEffect
  const [defaultEditorContent] = useState(() => activeProject.files[activeFile]?.content ?? '');

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
                  onRenameCancel={handleRenameCancel}
                  onOpenContextMenu={handleOpenContextMenu}
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
            {flatFiles.length} file{flatFiles.length !== 1 ? 's' : ''} · {totalFolders} folder{totalFolders !== 1 ? 's' : ''}
          </span>
        </div>
      </aside>

      {/* ── Editor ── */}
      <div className="flex-1 flex flex-col overflow-hidden" style={{ backgroundColor: '#0f172a' }}>

        {/* Editor header with breadcrumb */}
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
              {lineCount} lines
            </span>
          </div>
        </div>

        {/* Code editor */}
        <div className="flex-1 overflow-auto scrollbar-custom relative">
          <Editor
            height="100%"
            language={getMonacoLanguage(activeFile)}
            defaultValue={defaultEditorContent}
            onChange={handleEditorChange}
            theme="vs-dark"
            onMount={handleEditorMount}
            loading={<MonacoLoader />}
            options={EDITOR_OPTIONS}
            style={{ opacity: isEditorReady ? 1 : 0, transition: 'opacity 0.2s ease' }}
          />
        </div>
      </div>

      {contextMenuPortal}
    </motion.div>
  );
};

export default CodeStructure;
