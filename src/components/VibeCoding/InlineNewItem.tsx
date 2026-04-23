import { Folder } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import { getFileIcon } from './fileTreeUtils';
import { type InlineNewItemProps } from './vibeCoderTypes';

const InlineNewItem: React.FC<InlineNewItemProps> = ({ type, depth, onCommit, onCancel }) => {
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

export default InlineNewItem;
