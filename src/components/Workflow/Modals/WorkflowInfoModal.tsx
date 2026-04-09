import { Check, Copy, Globe, HardDrive } from 'lucide-react';
import React, { useState } from 'react';
import { Workflow } from '../../../../types';
import { CombinedTheme } from '../../../constants/themeColors';
import Modal from '../../Common/Modal';

interface WorkflowInfoModalProps {
  workflow: Workflow | null;
  onClose: () => void;
  theme: CombinedTheme;
}

const WorkflowInfoModal: React.FC<WorkflowInfoModalProps> = ({ workflow, onClose, theme }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (workflow?.id) {
      navigator.clipboard.writeText(workflow.id);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <Modal
      isOpen={!!workflow}
      onClose={onClose}
      title="Workflow Information"
    >
      <div className="space-y-4">
        <div>
          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">Full Name</label>
          <p className="text-sm font-semibold text-gray-800">{workflow?.name}</p>
        </div>
        <div className={`p-4 border rounded-xl relative group ${theme.homepage.emptyState.secondaryBg} ${theme.homepage.card.border}`}>
          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">Workflow Unique ID</label>
          <p className={`text-xs font-mono break-all pr-8 ${theme.homepage.emptyState.secondaryText}`}>{workflow?.id}</p>
          <button
            onClick={handleCopy}
            className={`absolute right-3 bottom-3 p-1.5 rounded-lg transition-all cursor-pointer ${copied ? 'bg-teal-50 text-teal-600' : 'bg-gray-50 text-gray-400 hover:text-gray-600 border border-gray-100'}`}
            title="Copy to clipboard"
          >
            {copied ? <Check size={14} /> : <Copy size={14} />}
          </button>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className={`p-3 border rounded-xl ${theme.homepage.tipsSection.iconBg} ${theme.homepage.card.border}`}>
            <label className="text-[9px] font-bold text-gray-400 uppercase block mb-1">Visibility</label>
            <div className="flex items-center gap-2">
              <Globe size={12} className={workflow?.isPublic ? theme.homepage.hero.iconColor : "text-gray-300"} />
              <span className="text-[11px] font-bold">{workflow?.isPublic ? "Public" : "Private"}</span>
            </div>
          </div>
          <div className={`p-3 border rounded-xl ${theme.homepage.tipsSection.iconBg} ${theme.homepage.card.border}`}>
            <label className="text-[9px] font-bold text-gray-400 uppercase block mb-1">Data Retention</label>
            <div className="flex items-center gap-2">
              <HardDrive size={12} className={workflow?.saveResponse ? theme.homepage.hero.iconColor : "text-gray-300"} />
              <span className="text-[11px] font-bold">{workflow?.saveResponse ? "Saving" : "No Saving"}</span>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default WorkflowInfoModal;
