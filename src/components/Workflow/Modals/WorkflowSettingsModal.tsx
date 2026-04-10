import { Check, ChevronDown, Globe, HardDrive } from 'lucide-react';
import React from 'react';
import { Workflow, Workspace } from '../../../../types';
import { CombinedTheme } from '../../../constants/themeColors';
import Modal from '../../Common/Modal';
import { FormLabel } from '../WorkflowBuilder/Helpers';

interface WorkflowSettingsModalProps {
  settingsWorkflow: Workflow | null;
  duplicateWorkflowSource: Workflow | null;
  onClose: () => void;
  flowSettingsForm: {
    name: string;
    isPublic: boolean;
    saveResponse: boolean;
    workspaceId: string;
  };
  setFlowSettingsForm: (form: any) => void;
  onAction: () => void;
  workspaces: Workspace[];
  theme: CombinedTheme;
}

const WorkflowSettingsModal: React.FC<WorkflowSettingsModalProps> = ({
  settingsWorkflow,
  duplicateWorkflowSource,
  onClose,
  flowSettingsForm,
  setFlowSettingsForm,
  onAction,
  workspaces,
  theme
}) => {
  return (
    <Modal
      isOpen={!!settingsWorkflow || !!duplicateWorkflowSource}
      onClose={onClose}
      title={duplicateWorkflowSource ? "Duplicate Workflow" : "Workflow Settings"}
    >
      <div className="space-y-6">
        <div>
          <FormLabel>Workflow Name</FormLabel>
          <input
            type="text"
            placeholder="e.g. Analytics Pipeline"
            value={flowSettingsForm.name}
            onChange={(e) => setFlowSettingsForm({ ...flowSettingsForm, name: e.target.value })}
            className="w-full px-4 py-3 bg-mod-surface-input-bg border border-mod-surface-input-border rounded-xl text-sm text-mod-surface-text-primary outline-none transition-all focus:ring-2 focus:ring-mod-hero-icon-color/20 focus:border-mod-hero-icon-color"
            autoFocus
          />
        </div>

        <div>
          <FormLabel>Assign to Workspace</FormLabel>
          <div className="relative">
            <select
              value={flowSettingsForm.workspaceId}
              onChange={(e) => setFlowSettingsForm({ ...flowSettingsForm, workspaceId: e.target.value })}
              className="w-full px-4 py-3 bg-mod-surface-input-bg border border-mod-surface-input-border rounded-xl text-sm text-mod-surface-text-primary outline-none transition-all appearance-none focus:ring-2 focus:ring-mod-hero-icon-color/20 focus:border-mod-hero-icon-color"
            >
              <option value="">None (Personal)</option>
              {workspaces.map(ws => (
                <option key={ws.id} value={ws.id}>{ws.name}</option>
              ))}
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-mod-surface-text-muted pointer-events-none">
              <ChevronDown size={16} />
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <FormLabel>Characteristics</FormLabel>
          <div className="space-y-3">
            <div 
              className="flex items-center gap-3 p-3 bg-mod-surface-skeleton/30 rounded-xl border border-mod-surface-border group transition-all cursor-pointer hover:border-mod-hero-icon-color/50"
              onClick={() => setFlowSettingsForm({ ...flowSettingsForm, isPublic: !flowSettingsForm.isPublic })}
            >
              <div className={`p-2 rounded-lg transition-all ${flowSettingsForm.isPublic ? 'bg-mod-hero-btn-bg text-white shadow-lg shadow-mod-hero-btn-shadow/30' : 'bg-mod-surface-card text-mod-surface-text-muted'}`}>
                <Globe size={16} />
              </div>
              <div className="flex-1">
                <p className="text-xs font-bold text-mod-surface-text-primary">Make Publicly Accessible</p>
                <p className="text-[10px] text-mod-surface-text-muted">Available via public API endpoint</p>
              </div>
              <div className={`w-10 h-5 rounded-full transition-all relative ${flowSettingsForm.isPublic ? 'bg-mod-hero-btn-bg' : 'bg-mod-surface-skeleton'}`}>
                <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${flowSettingsForm.isPublic ? 'right-1' : 'left-1'}`} />
              </div>
            </div>

            <div 
              className="flex items-center gap-3 p-3 bg-mod-surface-skeleton/30 rounded-xl border border-mod-surface-border group transition-all cursor-pointer hover:border-mod-hero-icon-color/50"
              onClick={() => setFlowSettingsForm({ ...flowSettingsForm, saveResponse: !flowSettingsForm.saveResponse })}
            >
              <div className={`p-2 rounded-lg transition-all ${flowSettingsForm.saveResponse ? 'bg-mod-hero-icon-color text-white shadow-lg shadow-mod-hero-btn-shadow/30' : 'bg-mod-surface-card text-mod-surface-text-muted'}`}>
                <HardDrive size={16} />
              </div>
              <div className="flex-1">
                <p className="text-xs font-bold text-mod-surface-text-primary">Save Workflow Response</p>
                <p className="text-[10px] text-mod-surface-text-muted">Log all execution results</p>
              </div>
              <div className={`w-10 h-5 rounded-full transition-all relative ${flowSettingsForm.saveResponse ? 'bg-mod-hero-icon-color' : 'bg-mod-surface-skeleton'}`}>
                <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${flowSettingsForm.saveResponse ? 'right-1' : 'left-1'}`} />
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-2 justify-end pt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 text-mod-surface-text-muted text-xs font-bold hover:bg-mod-surface-hover rounded-xl transition-all"
          >
            Cancel
          </button>
          <button
            onClick={onAction}
            className="px-8 py-2.5 bg-mod-hero-btn-bg hover:bg-mod-hero-btn-hover text-white text-xs font-bold rounded-xl transition-all shadow-lg shadow-mod-hero-btn-shadow/30 flex items-center gap-2"
          >
            <Check size={14} /> {duplicateWorkflowSource ? 'Create Copy' : 'Save Changes'}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default WorkflowSettingsModal;
