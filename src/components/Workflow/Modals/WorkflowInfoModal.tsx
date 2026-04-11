import { Check, Copy, Globe, HardDrive } from 'lucide-react';
import React, { useState } from 'react';
import { Workflow } from '../../../../types';
import Modal from '../../Common/Modal';

interface WorkflowInfoModalProps {
  workflow: Workflow | null;
  onClose: () => void;
}

const WorkflowInfoModal: React.FC<WorkflowInfoModalProps> = ({ workflow, onClose }) => {
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
          <label className="text-[10px] font-bold text-mod-surface-text-muted uppercase tracking-widest block mb-1">Full Name</label>
          <p className="text-sm font-semibold text-mod-surface-text-primary">{workflow?.name}</p>
        </div>
        <div className="p-4 border border-mod-surface-border rounded-xl relative group bg-mod-surface-skeleton/30">
          <label className="text-[10px] font-bold text-mod-surface-text-muted uppercase tracking-widest block mb-1">Workflow Unique ID</label>
          <p className="text-xs font-mono break-all pr-8 text-mod-surface-text-secondary">{workflow?.id}</p>
          <button
            onClick={handleCopy}
            className={`absolute right-3 bottom-3 p-1.5 rounded-lg transition-all cursor-pointer ${copied ? 'bg-mod-hero-badge-bg text-mod-hero-badge-text' : 'bg-mod-surface-card text-mod-surface-text-muted hover:text-mod-surface-text-secondary border border-mod-surface-border'}`}
            title="Copy to clipboard"
          >
            {copied ? <Check size={14} /> : <Copy size={14} />}
          </button>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="p-3 border border-mod-surface-border rounded-xl bg-mod-tips-icon-bg">
            <label className="text-[9px] font-bold text-mod-surface-text-muted uppercase block mb-1">Visibility</label>
            <div className="flex items-center gap-2">
              <Globe size={12} className={workflow?.isPublic ? 'text-mod-hero-icon-color' : "text-mod-surface-text-muted/40"} />
              <span className="text-[11px] font-bold text-mod-surface-text-primary">{workflow?.isPublic ? "Public" : "Private"}</span>
            </div>
          </div>
          <div className="p-3 border border-mod-surface-border rounded-xl bg-mod-tips-icon-bg">
            <label className="text-[9px] font-bold text-mod-surface-text-muted uppercase block mb-1">Data Retention</label>
            <div className="flex items-center gap-2">
              <HardDrive size={12} className={workflow?.saveResponse ? 'text-mod-hero-icon-color' : "text-mod-surface-text-muted/40"} />
              <span className="text-[11px] font-bold text-mod-surface-text-primary">{workflow?.saveResponse ? "Saving" : "No Saving"}</span>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default WorkflowInfoModal;
