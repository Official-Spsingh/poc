import { motion, AnimatePresence } from 'framer-motion';
import { History, Clock, CheckCircle2 } from 'lucide-react';
import React from 'react';
import { CombinedTheme } from '../../../constants/themeColors';

interface Version {
  id: string;
  label: string;
  date: string;
}

interface VersionHistoryPopoverProps {
  isOpen: boolean;
  onClose: () => void;
  versions: Version[];
  selectedVersion: string;
  setSelectedVersion: (version: string) => void;
  setRevertToast: (msg: string) => void;
}

const VersionHistoryPopover: React.FC<VersionHistoryPopoverProps & { theme: CombinedTheme }> = ({
  isOpen,
  onClose,
  versions,
  selectedVersion,
  setSelectedVersion,
  setRevertToast,
  theme
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[10000]"
          />
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute top-full right-0 mt-2 w-72 bg-white border border-gray-200 rounded-2xl shadow-2xl z-[10001] overflow-hidden"
          >
            <div className="p-4 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
              <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1.5"><History size={12} /> Version History</h3>
            </div>
            <div className="p-2 space-y-1 max-h-[300px] overflow-y-auto custom-scrollbar">
              {versions.map((v) => (
                <button
                  key={v.id}
                  onClick={() => {
                    setSelectedVersion(v.label);
                    onClose();
                    setRevertToast(`Reverted workflow to ${v.label}`);
                    setTimeout(() => setRevertToast(''), 3000);
                  }}
                  className={`w-full flex flex-col items-start p-3 rounded-xl transition-all border ${selectedVersion === v.label ? `${theme.builder.runPanel.headerIconBg} ${theme.builder.runPanel.headerIconBg.replace('bg-', 'border-').replace('50', '200')}` : 'bg-white border-transparent hover:bg-gray-50 hover:border-gray-100'}`}
                >
                  <div className="flex items-center justify-between w-full mb-1">
                    <span className={`text-xs font-bold ${selectedVersion === v.label ? theme.builder.runPanel.tabActiveText : 'text-gray-800'}`}>
                      {v.label}
                    </span>
                    {selectedVersion === v.label && <CheckCircle2 size={14} className={theme.builder.runPanel.headerIconText} />}
                  </div>
                  <span className="text-[10px] text-gray-400 flex items-center gap-1"><Clock size={10} /> {v.date}</span>
                </button>
              ))}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default VersionHistoryPopover;
