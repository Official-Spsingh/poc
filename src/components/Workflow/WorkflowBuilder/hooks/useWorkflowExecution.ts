import React, { useState, useCallback } from 'react';
import { NodeData } from '../../../../types';

interface ExecutionResult {
  tableData: { key: string; value: string; type: string }[];
  jsonData: object;
  logs: { timestamp: string; level: 'info' | 'success' | 'warn'; message: string }[];
}

export const useWorkflowExecution = (nodes: NodeData[], setNodes: React.Dispatch<React.SetStateAction<NodeData[]>>) => {
  const [isNodeRunPanelOpen, setIsNodeRunPanelOpen] = useState(false);
  const [nodeRunActiveTab, setNodeRunActiveTab] = useState<'table' | 'json' | 'logs'>('table');
  const [nodeRunNodeId, setNodeRunNodeId] = useState<string | null>(null);
  const [isNodeRunning, setIsNodeRunning] = useState(false);
  const [nodeRunResult, setNodeRunResult] = useState<ExecutionResult | null>(null);

  const handleRunNode = useCallback((nodeId: string) => {
    const targetNode = nodes.find(n => n.id === nodeId);
    if (!targetNode) return;

    setNodeRunNodeId(nodeId);
    setIsNodeRunPanelOpen(true);
    setIsNodeRunning(true);
    setNodeRunResult(null);
    setNodeRunActiveTab('table');

    setNodes(prev => prev.map(n => n.id === nodeId ? { ...n, error: undefined } : n));

    setTimeout(() => {
      const now = new Date();
      const ts = (offset: number) => {
        const d = new Date(now.getTime() + offset);
        return d.toLocaleTimeString('en-US', { hour12: false }) + '.' + String(d.getMilliseconds()).padStart(3, '0');
      };

      setNodeRunResult({
        tableData: [
          { key: 'status', value: 'success', type: 'string' },
          { key: 'executionTime', value: '1.2s', type: 'string' },
          { key: 'rowsProcessed', value: '148', type: 'number' },
          { key: 'outputSize', value: '3.4 KB', type: 'string' },
          { key: 'cacheHit', value: 'true', type: 'boolean' },
        ],
        jsonData: {
          status: 'success',
          nodeId,
          nodeType: targetNode.type,
          duration: '1.2s',
          output: {
            rowsProcessed: 148,
            outputSize: '3.4 KB',
            cacheHit: true,
            data: [{ id: 1, name: 'Record A' }, { id: 2, name: 'Record B' }, { id: 3, name: 'Record C' }]
          }
        },
        logs: [
          { timestamp: ts(0), level: 'info', message: `[Node:${nodeId}] Execution started` },
          { timestamp: ts(200), level: 'info', message: `[Node:${nodeId}] Initializing ${targetNode.type} handler...` },
          { timestamp: ts(500), level: 'info', message: `[Node:${nodeId}] Processing input payload (148 rows)` },
          { timestamp: ts(900), level: 'info', message: `[Node:${nodeId}] Applying transformation logic` },
          { timestamp: ts(1100), level: 'success', message: `[Node:${nodeId}] Execution completed successfully (1.2s)` },
        ]
      });
      setIsNodeRunning(false);
    }, 1200);
  }, [nodes, setNodes]);

  const runningNode = nodeRunNodeId ? nodes.find(n => n.id === nodeRunNodeId) : null;

  return {
    isNodeRunPanelOpen,
    setIsNodeRunPanelOpen,
    nodeRunActiveTab,
    setNodeRunActiveTab,
    nodeRunNodeId,
    setNodeRunNodeId,
    isNodeRunning,
    nodeRunResult,
    handleRunNode,
    runningNode
  };
};
