import { AnimatePresence, motion } from 'framer-motion';
import { ChevronRight, Folder, FolderOpen, MoreHorizontal } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import InlineNewItem from './InlineNewItem';
import { FileNode, getFileIcon } from './fileTreeUtils';

export interface FileTreeItemProps {
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

const FileTreeItem = React.memo<FileTreeItemProps>(({
  node, depth = 0, activeFile, collapseKey, renamingPath,
  onSelectFile, onRenameItem, onRenameCancel, onOpenContextMenu,
  pendingCreate, setPendingCreate, onCommitCreate,
}) => {
  const [isOpen, setIsOpen]           = useState(depth < 2);
  const [renameValue, setRenameValue] = useState('');
  const renameInputRef = useRef<HTMLInputElement>(null);
  const isFile         = node.type === 'file';
  const isActive       = isFile && activeFile === node.path;
  const isRenaming     = renamingPath === node.path;
  const isCreatingHere = !isFile && pendingCreate?.parentPath === node.path;

  // Collapse all folders when collapseKey increments
  useEffect(() => { if (!isFile) setIsOpen(false); }, [collapseKey]);

  // Focus rename input when triggered from context menu
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
});

export default FileTreeItem;
