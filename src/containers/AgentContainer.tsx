import React from 'react';
import AgentHome from '../components/Agents/AgentHome';
import AiAgentBuilder from '../components/Agents/AiAgentBuilder';
import { type ViewType } from '../types';

interface AgentContainerProps {
  view: ViewType;
  setView: (view: ViewType) => void;
}

const AgentContainer: React.FC<AgentContainerProps> = ({ view, setView }) => {
  if (view === 'agent-home') {
    return (
      <AgentHome
        onSelectAgent={() => setView('ai-agent-builder')}
        onCreateAgent={() => setView('ai-agent-builder')}
      />
    );
  }

  if (view === 'ai-agent-builder') {
    return <AiAgentBuilder onBack={() => setView('agent-home')} />;
  }

  return null;
};

export default AgentContainer;
