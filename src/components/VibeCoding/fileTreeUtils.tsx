import { FileCode, FileJson, FileText, Globe, Hash } from 'lucide-react';
import React from 'react';

export type FileNode = { name: string; path: string; type: 'file' | 'folder'; children?: FileNode[] };

export const getMonacoLanguage = (filename: string) => {
  const ext = filename.split('.').pop() ?? '';
  if (ext === 'tsx' || ext === 'ts') return 'typescript';
  if (ext === 'jsx' || ext === 'js') return 'javascript';
  if (ext === 'css')  return 'css';
  if (ext === 'json') return 'json';
  if (ext === 'html') return 'html';
  return 'plaintext';
};

const LANG_LABEL: Record<string, string> = {
  tsx: 'TSX', ts: 'TypeScript', jsx: 'JSX', js: 'JavaScript',
  css: 'CSS', json: 'JSON', html: 'HTML', txt: 'Text',
};

export const getLanguageLabel = (filename: string) => {
  const ext = filename.split('.').pop() ?? '';
  return LANG_LABEL[ext] ?? ext.toUpperCase();
};

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
