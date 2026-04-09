import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle2, FileJson, Loader2, Table as TableIcon, Terminal, X } from 'lucide-react';
import React from 'react';
import { NodeData } from '../../../../types';

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
  nodeRunResult
}) => {
  return (
    <AnimatePresence>
      {isNodeRunPanelOpen && (
        <motion.div
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ type: 'spring', damping: 30, stiffness: 300 }}
          className="absolute bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-[0_-12px_40px_rgba(0,0,0,0.15),0_-4px_12px_rgba(0,0,0,0.08)] rounded-t-2xl flex flex-col"
          style={{ height: '320px' }}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-3 border-b border-gray-100 shrink-0">
            <div className="flex items-center gap-3">
              <div className={`p-1.5 rounded-lg ${isNodeRunning ? 'bg-amber-50 text-amber-500' : 'bg-teal-50 text-teal-600'}`}>
                {isNodeRunning ? <Loader2 size={16} className="animate-spin" /> : <CheckCircle2 size={16} />}
              </div>
              <div>
                <h4 className="text-xs font-bold text-gray-900 leading-none mb-0.5">
                  {runningNode?.label || 'Node'} — {isNodeRunning ? 'Running...' : 'Execution Complete'}
                </h4>
                <p className="text-[10px] text-gray-400 font-mono">{nodeRunNodeId}</p>
              </div>
              {!isNodeRunning && (
                <span className="px-2 py-0.5 bg-teal-50 text-teal-600 text-[9px] font-bold rounded-full border border-teal-100 uppercase tracking-wider">Success</span>
              )}
            </div>
            <div className="flex items-center gap-2">
              {/* Tabs */}
              <div className="flex items-center bg-gray-100 p-0.5 rounded-lg">
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
                        ? 'bg-white text-teal-700 shadow-sm'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    <span className="flex items-center shrink-0">{tab.icon}</span>
                    <span>{tab.label}</span>
                  </button>
                ))}
              </div>
              <button
                onClick={() => setIsNodeRunPanelOpen(false)}
                className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-400 transition-colors"
              >
                <X size={16} />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-auto custom-scrollbar">
            {isNodeRunning ? (
              <div className="flex items-center justify-center h-full gap-3">
                <Loader2 size={20} className="animate-spin text-teal-500" />
                <span className="text-sm text-gray-500 font-medium">Executing node logic...</span>
              </div>
            ) : nodeRunResult ? (
              <>
                {/* Table Tab */}
                {nodeRunActiveTab === 'table' && (
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-100 sticky top-0">
                        <th className="px-6 py-2.5 text-[9px] font-bold text-gray-400 uppercase tracking-widest w-[200px]">Property</th>
                        <th className="px-6 py-2.5 text-[9px] font-bold text-gray-400 uppercase tracking-widest">Value</th>
                        <th className="px-6 py-2.5 text-[9px] font-bold text-gray-400 uppercase tracking-widest w-[120px]">Type</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {nodeRunResult.tableData.map((row, i) => (
                        <tr key={i} className="hover:bg-teal-50/30 transition-colors">
                          <td className="px-6 py-2.5 text-xs font-bold text-gray-800">{row.key}</td>
                          <td className="px-6 py-2.5 text-xs text-gray-600 font-mono">{row.value}</td>
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
                      <div key={i} className="flex items-start gap-3 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors font-mono">
                        <span className="text-[10px] text-gray-400 shrink-0 pt-0.5 tabular-nums">{log.timestamp}</span>
                        <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded shrink-0 uppercase tracking-wider ${
                          log.level === 'success' ? 'bg-teal-50 text-teal-600' : log.level === 'warn' ? 'bg-amber-50 text-amber-600' : 'bg-gray-100 text-gray-500'
                        }`}>
                          {log.level}
                        </span>
                        <span className="text-xs text-gray-700">{log.message}</span>
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
