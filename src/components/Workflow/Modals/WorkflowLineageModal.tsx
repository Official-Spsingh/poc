import { ChevronRight, Layers, Rocket, Settings, Workflow as WorkflowIcon, Zap } from 'lucide-react';
import React from 'react';
import { Workflow } from '../../../../types';
import { CombinedTheme } from '../../../constants/themeColors';
import Modal from '../../Common/Modal';

interface WorkflowLineageModalProps {
  workflow: Workflow | null;
  onClose: () => void;
  theme: CombinedTheme;
}

const WorkflowLineageModal: React.FC<WorkflowLineageModalProps> = ({ workflow, onClose, theme }) => {
  return (
    <Modal
      isOpen={!!workflow}
      onClose={onClose}
      title={`Lineage: ${workflow?.name}`}
      maxWidth="max-w-2xl"
    >
      <div className="space-y-8">
        <div className={`p-4 rounded-2xl flex items-center gap-4 border ${theme.homepage.lineage.badgeBg} ${theme.homepage.lineage.cardBorder}`}>
          <div className={`p-3 rounded-xl shadow-lg ${theme.homepage.lineage.mainIconBg} ${theme.homepage.lineage.mainIconText}`}>
            <WorkflowIcon size={24} />
          </div>
          <div>
            <h4 className={`text-sm font-bold ${theme.homepage.lineage.mainIconText === 'text-white' ? 'text-gray-900' : theme.homepage.lineage.mainIconText}`}>{workflow?.name}</h4>
            <p className={`text-[11px] font-mono mt-0.5 opacity-60`}>{workflow?.id}</p>
          </div>
        </div>

        <section className="space-y-4">
          <h5 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100 pb-2">Active Implementations</h5>
          <div className="grid gap-3">
            {[
              { title: 'Global Header Onboarding', element: 'Button Component', location: 'Dashboard / Home', type: 'trigger' },
              { title: 'CRM Contact Sync', element: 'Form Submitter', location: 'Settings / Integration', type: 'call' },
              { title: 'Data Retention Script', element: 'Cron Job', location: 'Background Tasks', type: 'system' },
            ].map((item, i) => (
              <div key={i} className={`flex items-center gap-4 p-4 rounded-xl border transition-all group ${theme.homepage.lineage.cardBorder} ${theme.homepage.lineage.cardHoverBg}`}>
                <div className={`p-2.5 rounded-lg transition-all ${theme.homepage.lineage.badgeBg} opacity-80 group-hover:opacity-100`}>
                  {item.type === 'trigger' ? <Zap size={16} /> : item.type === 'call' ? <Layers size={16} /> : <Settings size={16} />}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-gray-800">{item.title}</span>
                    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-tighter ${theme.homepage.lineage.badgeBg}`}>{item.type}</span>
                  </div>
                  <div className="flex items-center gap-2 mt-1 text-[10px] text-gray-400 font-medium">
                    <span>{item.location}</span>
                    <ChevronRight size={10} className="text-gray-300" />
                    <span className={theme.homepage.hero.iconColor}>{item.element}</span>
                  </div>
                </div>
                <button className="p-2 text-gray-300 hover:text-blue-600 hover:bg-white rounded-lg transition-all opacity-0 group-hover:opacity-100">
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
