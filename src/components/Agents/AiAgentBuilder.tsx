import { Zap } from 'lucide-react';
import React from 'react';

interface AiAgentBuilderProps {
  onBack: () => void;
}

const AiAgentBuilder: React.FC<AiAgentBuilderProps> = ({ onBack }) => {
  return (
    <div className="flex-1 flex flex-col items-center justify-center bg-mod-surface-bg p-8">
      <div className="w-20 h-20 bg-mod-hero-btn-bg rounded-2xl flex items-center justify-center text-white mb-6 shadow-xl mod-hero-btn-shadow">
        <Zap size={40} />
      </div>
      <h2 className="text-3xl font-bold text-mod-surface-text-primary mb-4">AI Agent Builder</h2>
      <p className="text-mod-surface-text-secondary mb-8 max-w-md text-center">This module is currently under development. Soon you'll be able to build intelligent agents with ease.</p>
      <button onClick={onBack} className="px-8 py-3 bg-mod-hero-btn-bg text-white rounded-xl font-bold hover:bg-mod-hero-btn-hover transition-all">
        Back to AI Agent Home
      </button>
    </div>
  );
};

export default AiAgentBuilder;
