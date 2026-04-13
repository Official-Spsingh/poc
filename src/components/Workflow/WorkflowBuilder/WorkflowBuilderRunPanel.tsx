import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle2, FileJson, Loader2, Table as TableIcon, Terminal, X } from 'lucide-react';
import React from 'react';
import { NodeData } from '../../../types';

interface WorkflowBuilderRunPanelProps {
  isNodeRunPanelOpen: boolean;
  setIsNodeRunPanelOpen: (isOpen: boolean) => void;
  isNodeRunning: boolean;
  runningNode: NodeData | undefined;
  nodeRunNodeId: string | null;
  nodeRunActiveTab: 'table' | 'json' | 'logs';
  setNodeRunActiveTab: (tab: 'table' | 'json' | 'logs') => void;
  nodeRunResult: {
    tableData: { key: string; value: string; type: string }[];
    jsonData: object;
    logs: { timestamp: string; level: 'info' | 'success' | 'warn'; message: string }[];
  } | null;
}

const WorkflowBuilderRunPanel: React.FC<WorkflowBuilderRunPanelProps> = ({
  isNodeRunPanelOpen,
  setIsNodeRunPanelOpen,
  isNodeRunning,
  runningNode,
  nodeRunNodeId,
  nodeRunActiveTab,
  setNodeRunActiveTab,
  nodeRunResult,
}) => {
  return (
    <AnimatePresence>
      {isNodeRunPanelOpen && (
        <motion.div
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ type: 'spring', damping: 30, stiffness: 300 }}
          className="absolute bottom-0 left-0 right-0 z-50 bg-mod-surface-card border-t border-mod-surface-border shadow-[0_-12px_40px_rgba(0,0,0,0.15),0_-4px_12px_rgba(0,0,0,0.08)] rounded-t-2xl flex flex-col"
          style={{ height: '320px' }}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-3 border-b border-mod-surface-border shrink-0">
            <div className="flex items-center gap-3">
              <div className={`p-1.5 rounded-lg ${isNodeRunning ? 'bg-amber-50 text-amber-500' : 'bg-mod-hero-badge-bg text-mod-hero-icon-color'}`}>
                {isNodeRunning ? <Loader2 size={16} className="animate-spin" /> : <CheckCircle2 size={16} />}
              </div>
              <div>
                <h4 className="text-xs font-bold text-mod-surface-text-primary leading-none mb-0.5">
                  {runningNode?.label || 'Node'} — {isNodeRunning ? 'Running...' : 'Execution Complete'}
                </h4>
                <p className="text-[10px] text-mod-surface-text-muted font-mono">{nodeRunNodeId}</p>
              </div>
              {!isNodeRunning && (
                <span className="px-2 py-0.5 bg-mod-hero-badge-bg text-mod-hero-icon-color border border-mod-hero-icon-color/20 text-[9px] font-bold rounded-full uppercase tracking-wider">Success</span>
              )}
            </div>
            <div className="flex items-center gap-2">
              {/* Tabs */}
              <div className="flex items-center bg-mod-surface-skeleton/40 p-0.5 rounded-lg">
                {[
                  { key: 'table' as const, label: 'Table', icon: <TableIcon size={13} /> },
                  { key: 'json' as const, label: 'JSON', icon: <FileJson size={13} /> },
                  { key: 'logs' as const, label: 'Logs', icon: <Terminal size={13} /> },
                ].map(tab => (
                  <button
                    key={tab.key}
                    onClick={() => setNodeRunActiveTab(tab.key)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[11px] font-bold transition-all leading-none ${
                      nodeRunActiveTab === tab.key
                        ? 'bg-mod-surface-card text-mod-hero-icon-color shadow-sm'
                        : 'text-mod-surface-text-muted hover:text-mod-surface-text-secondary'
                    }`}
                  >
                    <span className="flex items-center shrink-0">{tab.icon}</span>
                    <span>{tab.label}</span>
                  </button>
                ))}
              </div>
              <button
                onClick={() => setIsNodeRunPanelOpen(false)}
                className="p-1.5 hover:bg-mod-surface-hover rounded-lg text-mod-surface-text-muted transition-colors"
              >
                <X size={16} />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-auto custom-scrollbar">
            {isNodeRunning ? (
              <div className="flex items-center justify-center h-full gap-3">
                <Loader2 size={20} className="animate-spin text-mod-hero-icon-color" />
                <span className="text-sm text-mod-surface-text-muted font-medium">Executing node logic...</span>
              </div>
            ) : nodeRunResult ? (
              <>
                {/* Table Tab */}
                {nodeRunActiveTab === 'table' && (
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-mod-surface-skeleton/20 border-b border-mod-surface-border sticky top-0">
                        <th className="px-6 py-2.5 text-[9px] font-bold text-mod-surface-text-muted uppercase tracking-widest w-[200px]">Property</th>
                        <th className="px-6 py-2.5 text-[9px] font-bold text-mod-surface-text-muted uppercase tracking-widest">Value</th>
                        <th className="px-6 py-2.5 text-[9px] font-bold text-mod-surface-text-muted uppercase tracking-widest w-[120px]">Type</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-mod-surface-border">
                      {nodeRunResult.tableData.map((row, i) => (
                        <tr key={i} className="hover:bg-mod-surface-hover transition-colors">
                          <td className="px-6 py-2.5 text-xs font-bold text-mod-surface-text-primary">{row.key}</td>
                          <td className="px-6 py-2.5 text-xs text-mod-surface-text-secondary font-mono">{row.value}</td>
                          <td className="px-6 py-2.5">
                            <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                              row.type === 'string' ? 'bg-blue-50 text-blue-600 border border-blue-100'
                              : row.type === 'number' ? 'bg-violet-50 text-violet-600 border border-violet-100'
                              : 'bg-amber-50 text-amber-600 border border-amber-100'
                            }`}>
                              {row.type}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}

                {/* JSON Tab */}
                {nodeRunActiveTab === 'json' && (
                  <div className="p-4">
                    <pre className="bg-[#0f172a] text-[#e2e8f0] text-xs font-mono p-5 rounded-xl leading-relaxed overflow-auto max-h-[200px] custom-scrollbar">
                      {JSON.stringify(nodeRunResult.jsonData, null, 2)}
                    </pre>
                  </div>
                )}

                {/* Logs Tab */}
                {nodeRunActiveTab === 'logs' && (
                  <div className="p-4 space-y-1">
                    {nodeRunResult.logs.map((log, i) => (
                      <div key={i} className="flex items-start gap-3 px-3 py-2 rounded-lg hover:bg-mod-surface-hover transition-colors font-mono">
                        <span className="text-[10px] text-mod-surface-text-muted shrink-0 pt-0.5 tabular-nums">{log.timestamp}</span>
                        <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded shrink-0 uppercase tracking-wider ${
                          log.level === 'success' ? 'bg-mod-hero-badge-bg text-mod-hero-icon-color border border-mod-hero-icon-color/20' : log.level === 'warn' ? 'bg-amber-50 text-amber-600' : 'bg-mod-surface-skeleton text-mod-surface-text-muted'
                        }`}>
                          {log.level}
                        </span>
                        <span className="text-xs text-mod-surface-text-secondary">{log.message}</span>
                      </div>
                    ))}
                  </div>
                )}
              </>
            ) : null}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default WorkflowBuilderRunPanel;
