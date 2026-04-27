import React, { useState } from 'react';
import AIArchitectModal from '../components/Common/AIArchitectModal';
import VibeCoder, { generateProjectFiles } from '../components/VibeCoding/VibeCoder';
import { type Project } from '../components/VibeCoding/vibeCoderTypes';
import VibeHome from '../components/VibeCoding/VibeHome';
import { type ViewType } from '../types';
import { makeRequest } from '../utils/makeRequest';

interface VibeCoderContainerProps {
  view: ViewType;
  setView: (view: ViewType) => void;
}

const INITIAL_PROJECTS: Project[] = [
  {
    id: '1',
    name: 'Quantum Commerce Flow',
    lastEdited: '2m ago',
    files: generateProjectFiles('Quantum Commerce Flow'),
    history: [
      { id: 1, type: 'bot', text: "Welcome to Quantum Commerce Flow. I've initialized the core infrastructure for you.", time: "2m ago" }
    ],
    versions: [],
  }
];

const VibeCoderContainer: React.FC<VibeCoderContainerProps> = ({ view, setView }) => {
  const [vibeProjects, setVibeProjects] = useState<Project[]>(INITIAL_PROJECTS);
  const [activeVibeProjectId, setActiveVibeProjectId] = useState<string | null>(null);
  const [isVibeAiGenerating, setIsVibeAiGenerating] = useState(false);

  const handleStartVibeProject = async (prompt?: string) => {
    const name = prompt
      ? (prompt.length > 20 ? prompt.substring(0, 20) + '...' : prompt)
      : `New Experiment ${vibeProjects.length + 1}`;

    let files = generateProjectFiles(name);

    if (prompt) {
      setIsVibeAiGenerating(true);
      try {
        const response = await makeRequest.postAuth('/getVibeeCodingApp', { prompt });
        if (response?.files) files = response.files;
      } catch {
        // 404 or any error — fall back to dummy data already set above
      } finally {
        setIsVibeAiGenerating(false);
      }
    }

    const newProject: Project = {
      id: Date.now().toString(),
      name,
      lastEdited: 'Just now',
      files,
      history: [{ id: 1, type: 'bot', text: `Project "${name}" initialized. Syncing your vision...`, time: "Just now" }],
      versions: [],
    };

    setVibeProjects(prev => [newProject, ...prev]);
    setActiveVibeProjectId(newProject.id);
    setView('vibe-coder');
  };

  const handleOpenVibeProject = (id: string) => {
    setActiveVibeProjectId(id);
    setView('vibe-coder');
  };

  if (view === 'vibe-home') {
    return (
      <>
        <VibeHome
          projects={vibeProjects}
          onStartProject={handleStartVibeProject}
          onOpenProject={handleOpenVibeProject}
        />
        <AIArchitectModal
          isOpen={isVibeAiGenerating}
          title="Synthesizing"
          description="Generating your React application from your prompt. Hang tight..."
          statusText="Building Application..."
        />
      </>
    );
  }

  if (view === 'vibe-coder') {
    return (
      <VibeCoder
        onBack={() => setView('vibe-home')}
        projectId={activeVibeProjectId}
        projects={vibeProjects}
        onUpdateProjects={setVibeProjects}
      />
    );
  }

  return null;
};

export default VibeCoderContainer;
