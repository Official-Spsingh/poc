import { Zap } from 'lucide-react';
import React from 'react';

interface AiAgentBuilderProps {
  onBack: () => void;
}

const AiAgentBuilder: React.FC<AiAgentBuilderProps> = ({ onBack }) => {
  return (
    <div className="h-full flex flex-col items-center justify-center bg-gray-50 p-8">
      <div className="w-20 h-20 bg-violet-600 rounded-2xl flex items-center justify-center text-white mb-6 shadow-xl shadow-violet-200">
        <Zap size={40} />
      </div>
      <h2 className="text-3xl font-bold text-gray-900 mb-4">AI Agent Builder</h2>
      <p className="text-gray-500 mb-8 max-w-md text-center">This module is currently under development. Soon you'll be able to build intelligent agents with ease.</p>
      <button onClick={onBack} className="px-8 py-3 bg-gray-900 text-white rounded-xl font-bold hover:bg-gray-800 transition-all">
        Back to AI Agent Home
      </button>
    </div>
  );
};

export default AiAgentBuilder;
