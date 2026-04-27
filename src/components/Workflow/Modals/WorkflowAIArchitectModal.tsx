import React from 'react';
import AIArchitectModal from '../../Common/AIArchitectModal';

interface WorkflowAIArchitectModalProps {
  isAiPromptMode: boolean;
  isGenerating: boolean;
}

const WorkflowAIArchitectModal: React.FC<WorkflowAIArchitectModalProps> = ({
  isAiPromptMode,
  isGenerating,
}) => (
  <AIArchitectModal
    isOpen={isAiPromptMode && isGenerating}
    title="Architecting"
    description="Synthesizing node clusters and logic schemas for your workflow..."
    statusText="Optimizing Logic Path..."
  />
);

export default WorkflowAIArchitectModal;
