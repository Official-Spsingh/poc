import { Check } from 'lucide-react';
import React from 'react';
import Modal from '../../Common/Modal';
import { FormLabel } from '../WorkflowBuilder/Helpers';

interface WorkflowCreateWorkspaceModalProps {
  isOpen: boolean;
  onClose: () => void;
  workspaceForm: { name: string; description: string };
  setWorkspaceForm: (form: { name: string; description: string }) => void;
  onAction: () => void;
}

const WorkflowCreateWorkspaceModal: React.FC<WorkflowCreateWorkspaceModalProps> = ({
  isOpen,
  onClose,
  workspaceForm,
  setWorkspaceForm,
  onAction,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create New Workspace"
    >
      <div className="space-y-6">
        <div>
          <FormLabel>Workspace Name</FormLabel>
          <input
            type="text"
            placeholder="e.g. Production Pipelines"
            value={workspaceForm.name}
            onChange={(e) => setWorkspaceForm({ ...workspaceForm, name: e.target.value })}
            className="w-full px-4 py-3 bg-mod-surface-input-bg border border-mod-surface-input-border rounded-xl text-sm text-mod-surface-text-primary outline-none transition-all focus:ring-2 focus:ring-mod-hero-icon-color/20 focus:border-mod-hero-icon-color"
            autoFocus
          />
        </div>
        <div>
          <FormLabel>Description (Optional)</FormLabel>
          <textarea
            placeholder="What is this workspace for?"
            value={workspaceForm.description}
            onChange={(e) => setWorkspaceForm({ ...workspaceForm, description: e.target.value })}
            className="w-full px-4 py-3 bg-mod-surface-input-bg border border-mod-surface-input-border rounded-xl text-sm text-mod-surface-text-primary outline-none transition-all focus:ring-2 focus:ring-mod-hero-icon-color/20 focus:border-mod-hero-icon-color min-h-[100px]"
          />
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
            <Check size={14} /> Create Workspace
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default WorkflowCreateWorkspaceModal;
