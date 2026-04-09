import { Check, Globe, HardDrive, Network } from 'lucide-react';
import React from 'react';
import { Workflow, Workspace } from '../../../../types';
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
}

const WorkflowBuilderDeployModal: React.FC<WorkflowBuilderDeployModalProps> = ({
  isOpen,
  onClose,
  activeWorkflow,
  workspaces,
  deployForm,
  setDeployForm,
  onPublish
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
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-teal-100 focus:border-teal-400 transition-all font-medium text-gray-700"
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
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-teal-100 focus:border-teal-400 transition-all font-medium text-gray-700 appearance-none cursor-pointer"
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
              className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100 group hover:border-teal-200 transition-all cursor-pointer"
              onClick={() => setDeployForm({ ...deployForm, isPublic: !deployForm.isPublic })}
            >
              <div className={`p-2 rounded-lg transition-all ${deployForm.isPublic ? 'bg-teal-600 text-white shadow-lg shadow-teal-100' : 'bg-white text-gray-400'}`}>
                <Globe size={16} />
              </div>
              <div className="flex-1">
                <p className="text-xs font-bold text-gray-800">Make Publicly Accessible</p>
                <p className="text-[10px] text-gray-400">Available via public API endpoint</p>
              </div>
              <div className={`w-10 h-5 rounded-full transition-all relative ${deployForm.isPublic ? 'bg-teal-500' : 'bg-gray-200'}`}>
                <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${deployForm.isPublic ? 'right-1' : 'left-1'}`} />
              </div>
            </div>

            <div
              className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100 group hover:border-blue-200 transition-all cursor-pointer"
              onClick={() => setDeployForm({ ...deployForm, saveResponse: !deployForm.saveResponse })}
            >
              <div className={`p-2 rounded-lg transition-all ${deployForm.saveResponse ? 'bg-blue-600 text-white shadow-lg shadow-blue-100' : 'bg-white text-gray-400'}`}>
                <HardDrive size={16} />
              </div>
              <div className="flex-1">
                <p className="text-xs font-bold text-gray-800">Save Workflow Response</p>
                <p className="text-[10px] text-gray-400">Log all execution results</p>
              </div>
              <div className={`w-10 h-5 rounded-full transition-all relative ${deployForm.saveResponse ? 'bg-blue-500' : 'bg-gray-200'}`}>
                <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${deployForm.saveResponse ? 'right-1' : 'left-1'}`} />
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-3 justify-end pt-4">
          <button
            onClick={onClose}
            className="px-6 py-2.5 text-gray-500 text-xs font-bold hover:bg-gray-100 rounded-xl transition-all"
          >
            Cancel
          </button>
          <button
            disabled={!deployForm.name.trim()}
            onClick={onPublish}
            className="px-8 py-2.5 bg-teal-600 text-white text-xs font-bold rounded-xl hover:bg-teal-700 transition-all shadow-lg shadow-teal-100 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Check size={14} /> Save & Deploy
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default WorkflowBuilderDeployModal;
