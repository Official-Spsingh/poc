import { Check, Globe, HardDrive } from 'lucide-react';
import React from 'react';
import { Workflow, Workspace } from '../../../../types';
import { CombinedTheme } from '../../../constants/themeColors';
import Modal from '../../Common/Modal';
import { FormLabel } from './Helpers';

interface WorkflowBuilderDeployModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeWorkflow: Workflow | undefined;
  workspaces: Workspace[];
  deployForm: {
    name: string;
    isPublic: boolean;
    saveResponse: boolean;
    workspaceId: string;
  };
  setDeployForm: React.Dispatch<React.SetStateAction<{
    name: string;
    isPublic: boolean;
    saveResponse: boolean;
    workspaceId: string;
  }>>;
  onPublish: () => void;
  theme: CombinedTheme;
}

const WorkflowBuilderDeployModal: React.FC<WorkflowBuilderDeployModalProps> = ({
  isOpen,
  onClose,
  activeWorkflow,
  workspaces,
  deployForm,
  setDeployForm,
  onPublish,
  theme
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Deploy Workflow"
    >
      <div className="space-y-6">
        <div className="space-y-2">
          <FormLabel>Workflow Name</FormLabel>
          <input
            type="text"
            placeholder="e.g. Sales Onboarding"
            value={deployForm.name}
            onChange={(e) => setDeployForm({ ...deployForm, name: e.target.value })}
            className="w-full px-4 py-3 bg-mod-surface-input-bg border border-mod-surface-input-border rounded-xl text-sm text-mod-surface-text-primary outline-none focus:ring-2 focus:ring-mod-hero-icon-color/20 focus:border-mod-hero-icon-color transition-all font-medium"
            autoFocus
          />
          {deployForm.name.trim() === '' && (
            <p className="text-[10px] text-amber-500 font-bold px-1 italic text-right">Providing a name is required before deployment</p>
          )}
        </div>

        <div className="space-y-2">
          <FormLabel>Workspace</FormLabel>
          <select
            value={deployForm.workspaceId}
            onChange={(e) => setDeployForm({ ...deployForm, workspaceId: e.target.value })}
            className="w-full px-4 py-3 bg-mod-surface-input-bg border border-mod-surface-input-border rounded-xl text-sm text-mod-surface-text-primary outline-none focus:ring-2 focus:ring-mod-hero-icon-color/20 focus:border-mod-hero-icon-color transition-all font-medium appearance-none cursor-pointer"
          >
            <option value="" disabled>Select a Workspace</option>
            {workspaces.map(ws => (
              <option key={ws.id} value={ws.id}>{ws.name}</option>
            ))}
          </select>
        </div>

        <div className="space-y-3">
          <FormLabel>Settings</FormLabel>
          <div className="space-y-3">
            <div
              className="flex items-center gap-3 p-3 bg-mod-surface-skeleton/30 rounded-xl border border-mod-surface-border group hover:border-mod-hero-icon-color/50 transition-all cursor-pointer"
              onClick={() => setDeployForm({ ...deployForm, isPublic: !deployForm.isPublic })}
            >
              <div className={`p-2 rounded-lg transition-all ${deployForm.isPublic ? 'bg-mod-hero-btn-bg text-white shadow-lg shadow-mod-hero-btn-shadow/30' : 'bg-mod-surface-card text-mod-surface-text-muted'}`}>
                <Globe size={16} />
              </div>
              <div className="flex-1">
                <p className="text-xs font-bold text-mod-surface-text-primary">Make Publicly Accessible</p>
                <p className="text-[10px] text-mod-surface-text-muted">Available via public API endpoint</p>
              </div>
              <div className={`w-10 h-5 rounded-full transition-all relative ${deployForm.isPublic ? 'bg-mod-hero-btn-bg' : 'bg-mod-surface-skeleton'}`}>
                <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${deployForm.isPublic ? 'right-1' : 'left-1'}`} />
              </div>
            </div>

            <div
              className="flex items-center gap-3 p-3 bg-mod-surface-skeleton/30 rounded-xl border border-mod-surface-border group hover:border-mod-hero-icon-color/50 transition-all cursor-pointer"
              onClick={() => setDeployForm({ ...deployForm, saveResponse: !deployForm.saveResponse })}
            >
              <div className={`p-2 rounded-lg transition-all ${deployForm.saveResponse ? 'bg-mod-hero-icon-color text-white shadow-lg shadow-mod-hero-btn-shadow/30' : 'bg-mod-surface-card text-mod-surface-text-muted'}`}>
                <HardDrive size={16} />
              </div>
              <div className="flex-1">
                <p className="text-xs font-bold text-mod-surface-text-primary">Save Workflow Response</p>
                <p className="text-[10px] text-mod-surface-text-muted">Log all execution results</p>
              </div>
              <div className={`w-10 h-5 rounded-full transition-all relative ${deployForm.saveResponse ? 'bg-mod-hero-icon-color' : 'bg-mod-surface-skeleton'}`}>
                <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${deployForm.saveResponse ? 'right-1' : 'left-1'}`} />
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-3 justify-end pt-4">
          <button
            onClick={onClose}
            className="px-6 py-2.5 text-mod-surface-text-muted text-xs font-bold hover:bg-mod-surface-hover rounded-xl transition-all"
          >
            Cancel
          </button>
          <button
            disabled={!deployForm.name.trim()}
            onClick={onPublish}
            className="px-8 py-2.5 bg-mod-hero-btn-bg hover:bg-mod-hero-btn-hover text-white text-xs font-bold rounded-xl transition-all shadow-lg shadow-mod-hero-btn-shadow/30 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Check size={14} /> Save & Deploy
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default WorkflowBuilderDeployModal;
