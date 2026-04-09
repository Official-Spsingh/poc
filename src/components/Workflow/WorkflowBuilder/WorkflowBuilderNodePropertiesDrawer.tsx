import { AnimatePresence, motion } from 'framer-motion';
import {
  ArrowRightLeft,
  Code2,
  Database,
  Layers,
  Lock,
  Plus,
  Settings2,
  Sparkles,
  Trash2,
  X
} from 'lucide-react';
import React from 'react';
import { COMPONENT_METADATA, EVENT_TYPES } from '../../../../constants';
import { EventConfig, EventType, NodeData } from '../../../../types';
import { FormLabel, PayloadTable } from './Helpers';

interface WorkflowBuilderNodePropertiesDrawerProps {
  isDrawerOpen: boolean;
  setIsDrawerOpen: (isOpen: boolean) => void;
  selectedNode: NodeData | undefined;
  drawerWidth: number;
  isResizing: boolean;
  startResizing: () => void;
  updateNodeConfig: (id: string, updates: Record<string, any>) => void;
  setIsGlobalAiOpen: (isOpen: boolean) => void;
  setGlobalAiChatMessage: (msg: string) => void;
  addEvent: (nodeId: string) => void;
  updateEvent: (nodeId: string, eventId: string, updates: Partial<EventConfig>) => void;
  removeEvent: (nodeId: string, eventId: string) => void;
}

const WorkflowBuilderNodePropertiesDrawer: React.FC<WorkflowBuilderNodePropertiesDrawerProps> = ({
  isDrawerOpen,
  setIsDrawerOpen,
  selectedNode,
  drawerWidth,
  isResizing,
  startResizing,
  updateNodeConfig,
  setIsGlobalAiOpen,
  setGlobalAiChatMessage,
  addEvent,
  updateEvent,
  removeEvent
}) => {
  if (!selectedNode) return null;

  return (
    <AnimatePresence>
      {isDrawerOpen && (
        <motion.aside
          initial={{ x: drawerWidth, opacity: 0, width: 0 }}
          animate={{ x: 0, opacity: 1, width: drawerWidth }}
          exit={{ x: drawerWidth, opacity: 0, width: 0 }}
          transition={isResizing ? { duration: 0 } : { type: 'spring', damping: 25, stiffness: 200 }}
          className="bg-white border-l border-gray-200 flex flex-col overflow-visible shrink-0 relative"
          style={{ minWidth: 0 }}
        >
          {/* Resize Handle - Left Side */}
          <div
            onMouseDown={startResizing}
            className={`absolute top-0 left-0 w-1 h-full cursor-col-resize z-50 transition-colors group ${isResizing ? 'bg-blue-500/20' : 'hover:bg-blue-500/10 hover:w-1.5'}`}
          >
            <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1.5px] h-8 bg-gray-200 rounded-full transition-opacity ${isResizing ? 'opacity-100 bg-blue-500' : 'opacity-0 group-hover:opacity-100'}`} />
          </div>

          <div className="flex flex-col h-full bg-white relative overflow-hidden" style={{ width: drawerWidth }}>
            <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-white sticky top-0 z-10 h-16">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg bg-gray-50 border border-gray-200 ${COMPONENT_METADATA[selectedNode.type].color}`}>
                  {COMPONENT_METADATA[selectedNode.type].icon}
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 leading-none mb-1">Node Properties</h3>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{selectedNode.type}</p>
                </div>
              </div>
              <button onClick={() => setIsDrawerOpen(false)} className="p-2 hover:bg-gray-100 rounded-lg text-gray-500 transition-colors">
                <X size={18} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-10 custom-scrollbar bg-[#fcfdfe]">
              <section className="space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
                  <Settings2 size={14} className="text-gray-400" />
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Identification</span>
                </div>
                <div className="space-y-1.5">
                  <FormLabel>Display Name</FormLabel>
                  <input
                    type="text"
                    value={selectedNode.label}
                    onChange={(e) => updateNodeConfig(selectedNode.id, { label: e.target.value })}
                    className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-teal-100 focus:border-teal-400 transition-all"
                  />
                </div>
              </section>

              {selectedNode.type === 'start' && (
                <section className="space-y-6">
                  <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
                    <Layers size={14} className="text-gray-400" />
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Entry Context</span>
                  </div>
                  <div className="flex items-center justify-between p-1 bg-gray-100 rounded-xl mb-4">
                    <button onClick={() => updateNodeConfig(selectedNode.id, { inputMode: 'table' })} className={`flex-1 flex items-center justify-center gap-2 py-2 text-[10px] font-bold rounded-lg transition-all ${selectedNode.config?.inputMode === 'table' ? 'bg-white text-teal-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>Table Editor</button>
                    <button onClick={() => updateNodeConfig(selectedNode.id, { inputMode: 'json' })} className={`flex-1 flex items-center justify-center gap-2 py-2 text-[10px] font-bold rounded-lg transition-all ${selectedNode.config?.inputMode === 'json' ? 'bg-white text-teal-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>JSON Editor</button>
                  </div>
                  {selectedNode.config?.inputMode === 'json' ? (
                    <textarea rows={10} value={selectedNode.config?.rawJson || ''} onChange={(e) => updateNodeConfig(selectedNode.id, { rawJson: e.target.value })} className="w-full px-3 py-3 bg-[#1e293b] text-blue-300 border-none text-xs outline-none font-mono leading-relaxed rounded-xl"
                      placeholder={`{
  "data": {
    "key": "value"
  },
  "variables": {
    "key": "value"
  }
}`} />
                  ) : (
                    <div className="space-y-8">
                      <div><FormLabel>Variable Payload</FormLabel><PayloadTable items={selectedNode.config?.variables || []} onUpdate={(variables) => updateNodeConfig(selectedNode.id, { variables })} /></div>
                      <div><FormLabel>Data Payload</FormLabel><PayloadTable items={selectedNode.config?.data || []} onUpdate={(data) => updateNodeConfig(selectedNode.id, { data })} /></div>
                    </div>
                  )}
                </section>
              )}

              {['sql', 'sql-query', 'dynamic-sql-query'].includes(selectedNode.type) && (
                <section className="space-y-8 animate-in fade-in duration-300">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                      <div className="flex items-center gap-2">
                        <Database size={14} className="text-violet-500" />
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest text-violet-400">SQL Assistant</span>
                      </div>
                      <button
                        onClick={() => {
                          setIsGlobalAiOpen(true);
                          setGlobalAiChatMessage(`@${selectedNode.label} `);
                        }}
                        className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold transition-all border bg-teal-50 text-teal-600 border-teal-100 hover:bg-teal-100`}
                      >
                        <Sparkles size={10} />
                        Get Help with AI
                      </button>
                    </div>

                    <div className="relative group/editor rounded-xl overflow-hidden border border-gray-200 shadow-inner">
                      <div className="flex items-center justify-between px-3 py-2 bg-[#1e293b] border-b border-[#0f172a]/50">
                        <div className="flex gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-rose-400/30" /><div className="w-2.5 h-2.5 rounded-full bg-amber-400/30" /><div className="w-2.5 h-2.5 rounded-full bg-teal-400/30" /></div>
                        <span className="text-[9px] font-mono text-gray-500 uppercase tracking-widest font-bold">SQL Editor</span>
                      </div>
                      <textarea
                        rows={12}
                        value={selectedNode.config?.sqlQuery || ''}
                        onChange={(e) => updateNodeConfig(selectedNode.id, { sqlQuery: e.target.value })}
                        className="w-full px-4 py-4 bg-[#0f172a] text-[#ffd8a8] border-none text-[13px] outline-none font-mono leading-relaxed placeholder:text-gray-700"
                        placeholder="-- Write your SQL query here..."
                        spellCheck={false}
                      />
                      <div className="absolute bottom-3 right-3 opacity-30 pointer-events-none">
                        <Database size={40} className="text-gray-800" />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6 pt-6 border-t border-gray-100">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2"><ArrowRightLeft size={14} className="text-violet-500" /><span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Query Execution</span></div>
                      <button onClick={() => addEvent(selectedNode.id)} className="flex items-center gap-1.5 px-3 py-1.5 bg-violet-50 text-violet-600 rounded-lg text-[10px] font-bold hover:bg-violet-100 transition-all border border-violet-100"><Plus size={12} /> Add Trigger</button>
                    </div>
                  </div>
                </section>
              )}

              {selectedNode.type === 'js-expression' && (
                <section className="space-y-8 animate-in fade-in duration-300">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                      <div className="flex items-center gap-2"><Code2 size={14} className="text-gray-400" /><span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Logic Expression</span></div>
                      <button
                        onClick={() => {
                          setIsGlobalAiOpen(true);
                          setGlobalAiChatMessage(`@${selectedNode.label} `);
                        }}
                        className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold transition-all border bg-teal-50 text-teal-600 border-teal-100 hover:bg-teal-100`}
                      >
                        <Sparkles size={10} />
                        Get Help with AI
                      </button>
                    </div>
                    <div className="relative group/editor rounded-xl overflow-hidden border border-gray-200 shadow-inner">
                      <div className="flex items-center justify-between px-3 py-2 bg-gray-50 border-b border-gray-100">
                        <div className="flex gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-rose-400/30" /><div className="w-2.5 h-2.5 rounded-full bg-amber-400/30" /><div className="w-2.5 h-2.5 rounded-full bg-teal-400/30" /></div>
                        <span className="text-[9px] font-mono text-gray-400">main.js</span>
                      </div>
                      <textarea rows={10} value={selectedNode.config?.expression || ''} onChange={(e) => updateNodeConfig(selectedNode.id, { expression: e.target.value })} className="w-full px-4 py-4 bg-[#0f172a] text-[#e2e8f0] border-none text-[13px] outline-none font-mono leading-relaxed" spellCheck={false} />
                    </div>
                  </div>

                  <div className="space-y-6 pt-6 border-t border-gray-100">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2"><ArrowRightLeft size={14} className="text-amber-500" /><span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Return Handlers</span></div>
                      <button onClick={() => addEvent(selectedNode.id)} className="flex items-center gap-1.5 px-3 py-1.5 bg-teal-50 text-teal-600 rounded-lg text-[10px] font-bold hover:bg-teal-100 transition-all border border-teal-100"><Plus size={12} /> Add Trigger</button>
                    </div>
                    <div className="space-y-4">
                      {selectedNode.events?.map((event, idx) => (
                        <div key={event.id} className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden group/card hover:border-blue-300 transition-all">
                          <div className="px-4 py-2.5 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
                            <span className="text-[10px] font-bold text-gray-500 flex items-center gap-2 uppercase tracking-tighter"><div className="w-2 h-2 rounded-full bg-teal-400" /> Handler #{idx + 1}</span>
                            <button onClick={() => removeEvent(selectedNode.id, event.id)} className="text-gray-300 hover:text-rose-500 transition-colors"><Trash2 size={14} /></button>
                          </div>
                          <div className="p-4 space-y-4">
                            <div><FormLabel>Action Type</FormLabel><select value={event.type} onChange={(e) => updateEvent(selectedNode.id, event.id, { type: e.target.value as EventType })} className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-xs outline-none focus:border-teal-400 cursor-pointer">{EVENT_TYPES.map(et => <option key={et.value} value={et.value}>{et.label}</option>)}</select></div>
                            <div className="grid grid-cols-2 gap-3">
                              <div><FormLabel>Value / WID</FormLabel><input type="text" placeholder="Value" value={event.value} onChange={(e) => updateEvent(selectedNode.id, event.id, { value: e.target.value })} className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-xs outline-none focus:border-teal-400" /></div>
                              <div><FormLabel>Parameters</FormLabel><input type="text" placeholder="Params" value={event.params} onChange={(e) => updateEvent(selectedNode.id, event.id, { params: e.target.value })} className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-xs outline-none focus:border-teal-400" /></div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </section>
              )}
            </div>

            <div className="p-6 border-t border-gray-100 bg-white shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.03)] z-10 sticky bottom-0">
              <button onClick={() => setIsDrawerOpen(false)} className="w-full py-3.5 bg-gray-900 text-white rounded-xl text-xs font-bold hover:bg-gray-800 active:scale-[0.98] transition-all flex items-center justify-center gap-2">
                <Lock size={14} className="opacity-40" /> Apply Properties
              </button>
            </div>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
};

export default WorkflowBuilderNodePropertiesDrawer;
