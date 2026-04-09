import { Check } from 'lucide-react';
import React from 'react';
import { CombinedTheme } from '../../../constants/themeColors';
import Modal from '../../Common/Modal';
import { FormLabel } from '../WorkflowBuilder/Helpers';

interface WorkflowCreateWorkspaceModalProps {
  isOpen: boolean;
  onClose: () => void;
  workspaceForm: { name: string; description: string };
  setWorkspaceForm: (form: { name: string; description: string }) => void;
  onAction: () => void;
  theme: CombinedTheme;
}

const WorkflowCreateWorkspaceModal: React.FC<WorkflowCreateWorkspaceModalProps> = ({
  isOpen,
  onClose,
  workspaceForm,
  setWorkspaceForm,
  onAction,
  theme
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
            className={`w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none transition-all focus:ring-2 ${theme.builder.header.focusRing}`}
            autoFocus
          />
        </div>
        <div>
          <FormLabel>Description (Optional)</FormLabel>
          <textarea
            placeholder="What is this workspace for?"
            value={workspaceForm.description}
            onChange={(e) => setWorkspaceForm({ ...workspaceForm, description: e.target.value })}
            className={`w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none transition-all focus:ring-2 min-h-[100px] ${theme.builder.header.focusRing}`}
          />
        </div>
        <div className="flex gap-2 justify-end pt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-500 text-xs font-bold hover:bg-gray-100 rounded-xl transition-all"
          >
            Cancel
          </button>
          <button
            onClick={onAction}
            className={`px-8 py-2.5 text-white text-xs font-bold rounded-xl transition-all shadow-lg flex items-center gap-2 ${theme.homepage.header.primaryBtn}`}
          >
            <Check size={14} /> Create Workspace
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default WorkflowCreateWorkspaceModal;
