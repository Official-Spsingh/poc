import { ChevronRight, Layers, Rocket, Settings, Workflow as WorkflowIcon, Zap } from 'lucide-react';
import React from 'react';
import { Workflow } from '../../../types';
import Modal from '../../Common/Modal';

interface WorkflowLineageModalProps {
  workflow: Workflow | null;
  onClose: () => void;
}

const WorkflowLineageModal: React.FC<WorkflowLineageModalProps> = ({ workflow, onClose }) => {
  return (
    <Modal
      isOpen={!!workflow}
      onClose={onClose}
      title={`Lineage: ${workflow?.name}`}
      maxWidth="max-w-2xl"
    >
      <div className="space-y-8">
        <div className="p-4 rounded-2xl flex items-center gap-4 border border-mod-lineage-card-border bg-mod-lineage-badge-bg/50">
          <div className="p-3 rounded-xl shadow-lg bg-mod-lineage-icon-bg text-mod-lineage-icon-text">
            <WorkflowIcon size={24} />
          </div>
          <div>
            <h4 className="text-sm font-bold text-mod-surface-text-primary">{workflow?.name}</h4>
            <p className="text-[11px] font-mono mt-0.5 text-mod-surface-text-muted opacity-80">{workflow?.id}</p>
          </div>
        </div>

        <section className="space-y-4">
          <h5 className="text-[10px] font-bold text-mod-surface-text-muted uppercase tracking-widest border-b border-mod-surface-border pb-2">Active Implementations</h5>
          <div className="grid gap-3">
            {[
              { title: 'Global Header Onboarding', element: 'Button Component', location: 'Dashboard / Home', type: 'trigger' },
              { title: 'CRM Contact Sync', element: 'Form Submitter', location: 'Settings / Integration', type: 'call' },
              { title: 'Data Retention Script', element: 'Cron Job', location: 'Background Tasks', type: 'system' },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-4 p-4 rounded-xl border border-mod-lineage-card-border bg-mod-lineage-card-hover-bg/30 transition-all group hover:border-mod-lineage-card-hover-border">
                <div className="p-2.5 rounded-lg transition-all bg-mod-lineage-badge-bg text-mod-lineage-badge-text opacity-80 group-hover:opacity-100">
                  {item.type === 'trigger' ? <Zap size={16} /> : item.type === 'call' ? <Layers size={16} /> : <Settings size={16} />}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-mod-surface-text-primary">{item.title}</span>
                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-tighter bg-mod-lineage-badge-bg text-mod-lineage-badge-text">{item.type}</span>
                  </div>
                  <div className="flex items-center gap-2 mt-1 text-[10px] text-mod-surface-text-muted font-medium">
                    <span>{item.location}</span>
                    <ChevronRight size={10} className="text-mod-surface-text-muted/40" />
                    <span className="text-mod-hero-icon-color">{item.element}</span>
                  </div>
                </div>
                <button className="p-2 text-mod-surface-text-muted/40 hover:text-mod-hero-icon-color hover:bg-mod-hero-badge-bg rounded-lg transition-all opacity-0 group-hover:opacity-100">
                  <Rocket size={14} />
                </button>
              </div>
            ))}
          </div>
        </section>
      </div>
    </Modal>
  );
};

export default WorkflowLineageModal;
