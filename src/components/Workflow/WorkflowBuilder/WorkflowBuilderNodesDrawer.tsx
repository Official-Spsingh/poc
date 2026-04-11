import { AnimatePresence, motion } from 'framer-motion';
import { Component, Search, X } from 'lucide-react';
import React from 'react';
import { COMPONENT_METADATA } from './constants';
import { NodeType, Position } from '../../../types';

interface WorkflowBuilderNodesDrawerProps {
  isComponentSidebarOpen: boolean;
  setIsComponentSidebarOpen: (isOpen: boolean) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  addNode: (type: NodeType, position?: Position) => void;
}

const WorkflowBuilderNodesDrawer: React.FC<WorkflowBuilderNodesDrawerProps> = ({
  isComponentSidebarOpen,
  setIsComponentSidebarOpen,
  searchQuery,
  setSearchQuery,
  addNode,
}) => {
  const filteredNodes = (Object.keys(COMPONENT_METADATA) as NodeType[])
    .filter(type => COMPONENT_METADATA[type].label.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <AnimatePresence>
      {isComponentSidebarOpen && (
        <motion.aside
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: 256, opacity: 1 }}
          exit={{ width: 0, opacity: 0 }}
          style={{ minWidth: 0 }}
        >
          <div className="w-[256px] flex flex-col h-full shrink-0 border-r border-mod-surface-border bg-mod-surface-card">
            {/* Header */}
            <div className="p-5 border-b border-mod-surface-border flex items-center justify-between h-16 shrink-0 bg-mod-surface-card">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-mod-hero-badge-bg">
                  <Component size={18} className="text-mod-hero-icon-color" />
                </div>
                <span className="font-bold text-sm text-mod-surface-text-primary">Nodes</span>
              </div>
              <button
                onClick={() => setIsComponentSidebarOpen(false)}
                className="p-2 hover:bg-mod-surface-hover rounded-lg text-mod-surface-text-muted transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Search */}
            <div className="p-5 pb-2 shrink-0 bg-mod-surface-card">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-mod-surface-text-muted" size={16} />
                <input
                  type="text"
                  placeholder="Search nodes..."
                  className="w-full pl-10 pr-4 py-2.5 bg-mod-surface-input-bg border border-mod-surface-input-border rounded-xl text-sm font-medium text-mod-surface-text-primary placeholder:text-mod-surface-text-muted outline-none focus:ring-2 focus:ring-mod-hero-badge-bg focus:border-mod-hero-icon-color transition-all"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar p-5 pt-4 bg-mod-surface-bg">
              {filteredNodes.length > 0 ? (
                <div className="grid grid-cols-2 gap-3 pb-10">
                  {filteredNodes.map(type => {
                    const meta = COMPONENT_METADATA[type];
                    return (
                      <button
                        key={type}
                        draggable
                        onDragStart={(e) => {
                          e.dataTransfer.setData('nodeType', type);
                        }}
                        onClick={() => addNode(type)}
                        className="flex flex-col items-center justify-center p-4 rounded-2xl bg-mod-surface-card border border-mod-surface-border hover:border-mod-hero-icon-color/50 hover:shadow-xl hover:-translate-y-1 transition-all group"
                      >
                        <div className={`p-3 rounded-xl ${meta.color} group-hover:scale-110 transition-transform mb-2 shadow-sm`}>
                          {React.cloneElement(meta.icon as React.ReactElement, { size: 18 })}
                        </div>
                        <span className="text-[10px] font-bold text-mod-surface-text-secondary hover:text-mod-hero-icon-color text-center leading-tight">
                          {meta.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 px-4 text-center animate-in fade-in zoom-in duration-300">
                  <div className="w-16 h-16 bg-mod-hero-badge-bg rounded-3xl flex items-center justify-center mb-6 shadow-sm">
                    <Search size={28} className="text-mod-hero-icon-color" />
                  </div>
                  <p className="text-sm font-bold text-mod-surface-text-primary mb-1">No nodes found</p>
                  <p className="text-[11px] text-mod-surface-text-muted mb-6 leading-relaxed">
                    We couldn't find any nodes matching your search.
                  </p>
                  <button
                    onClick={() => setSearchQuery('')}
                    className="px-4 py-2 rounded-xl text-xs font-bold bg-mod-hero-badge-bg text-mod-hero-icon-color hover:brightness-95 transition-all"
                  >
                    Clear Search
                  </button>
                </div>
              )}
            </div>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
};

export default WorkflowBuilderNodesDrawer;
