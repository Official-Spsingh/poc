import { AnimatePresence, motion } from 'framer-motion';
import { Component, Search, X } from 'lucide-react';
import React from 'react';
import { COMPONENT_METADATA } from './constants';
import { NodeType, Position } from '../../../../types';
import { CombinedTheme } from '../../../constants/themeColors';

interface WorkflowBuilderNodesDrawerProps {
  isComponentSidebarOpen: boolean;
  setIsComponentSidebarOpen: (isOpen: boolean) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  addNode: (type: NodeType, position?: Position) => void;
  theme: CombinedTheme;
}

const WorkflowBuilderNodesDrawer: React.FC<WorkflowBuilderNodesDrawerProps> = ({
  isComponentSidebarOpen,
  setIsComponentSidebarOpen,
  searchQuery,
  setSearchQuery,
  addNode,
  theme
}) => {
  return (
    <AnimatePresence>
      {isComponentSidebarOpen && (
        <motion.aside
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: 256, opacity: 1 }}
          exit={{ width: 0, opacity: 0 }}
          style={{ minWidth: 0 }}
        >
          <div className="w-[256px] flex flex-col h-full shrink-0 border-r border-gray-200">
            <div className="p-5 border-b border-gray-100 flex items-center justify-between h-16 bg-white sticky top-0">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${theme.builder.runPanel.headerIconBg}`}>
                  <Component size={18} className={theme.builder.runPanel.headerIconText} />
                </div>
                <span className="font-bold text-sm text-gray-900">Nodes</span>
              </div>
              <button
                onClick={() => setIsComponentSidebarOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-lg text-gray-400 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar p-5">
              <div className="relative mb-6">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                <input
                  type="text"
                  placeholder="Search nodes..."
                  className={`w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-xs outline-none focus:bg-white ${theme.builder.drawers.inputFocus} transition-all`}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-3 pb-10">
                {(Object.keys(COMPONENT_METADATA) as NodeType[])
                  .filter(type => COMPONENT_METADATA[type].label.toLowerCase().includes(searchQuery.toLowerCase()))
                  .map(type => {
                    const meta = COMPONENT_METADATA[type];
                    return (
                      <button
                        key={type}
                        draggable
                        onDragStart={(e) => {
                          e.dataTransfer.setData('nodeType', type);
                        }}
                        onClick={() => {
                          addNode(type);
                        }}
                        className={`flex flex-col items-center justify-center p-4 rounded-2xl bg-white border border-gray-100 ${theme.builder.drawers.itemHoverBorder} hover:shadow-xl hover:-translate-y-1 transition-all group`}
                      >
                        <div className={`p-3 rounded-xl ${meta.color} group-hover:scale-110 transition-transform mb-2 shadow-sm`}>
                          {React.cloneElement(meta.icon as React.ReactElement, { size: 18 })}
                        </div>
                        <span className={`text-[10px] font-bold text-gray-600 ${theme.builder.drawers.itemHoverText} text-center leading-tight`}>
                          {meta.label}
                        </span>
                      </button>
                    );
                  })}
              </div>
            </div>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
};

export default WorkflowBuilderNodesDrawer;
