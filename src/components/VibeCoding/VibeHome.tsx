
import {
  Copy,
  Edit2,
  FileSpreadsheet,
  Info,
  Plus,
  Rocket,
  Sparkles,
  Trash2
} from 'lucide-react';
import React, { useState } from 'react';

import { useRandomTitle, useTypewriter } from '../../hooks/useTypewriter';
import StudioCard from '../Common/StudioCard';
import StudioEmptyState from '../Common/StudioEmptyState';
import StudioHeader from '../Common/StudioHeader';
import StudioHero from '../Common/StudioHero';
import StudioPageWrapper, { StudioMain } from '../Common/StudioPageWrapper';
import StudioTable from '../Common/StudioTable';
import StudioTipsSection from '../Common/StudioTipsSection';
import StudioToolbar from '../Common/StudioToolbar';

import { type Project, type VibeHomeProps } from "./vibeCoderTypes";

const VIBE_HERO_TITLES = [
  "What application shall we vibe today?",
  "Ready to manifest your next React prototype?",
  "Let's synthesize a stunning experience.",
  "What digital vibe are we building today?"
];

const VIBE_PLACEHOLDERS = [
  "e.g., Build a dark-themed crypto dashboard with real-time charts...",
  "e.g., Create a premium portfolio site with glassmorphism effects...",
  "e.g., Design a social media landing page with vibrant gradients..."
];

const VibeHome: React.FC<VibeHomeProps> = ({ onStartProject, onOpenProject, projects }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [aiPrompt, setAiPrompt] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');

  const filterOptions = [
    { label: 'All Projects', value: 'all' },
    { label: 'Recent', value: 'recent' }
  ];
  
  // Theme is now driven by CSS variables via data-theme on the container div
  const heroTitle = useRandomTitle(VIBE_HERO_TITLES);
  const placeholderText = useTypewriter(VIBE_PLACEHOLDERS);

  const filteredProjects = projects.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (activeFilter === 'all') return matchesSearch;
    if (activeFilter === 'recent') {
      const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
      return matchesSearch && new Date(p.lastEdited) > oneDayAgo;
    }
    return matchesSearch;
  });

  return (
    <StudioPageWrapper>
      <StudioHeader
        icon={Sparkles}
        title="Vibe Studio"
        subtitle="Real-time AI application synthesis"

        buttons={[
          {
            label: "Build Experiment",
            icon: Plus,
            onClick: () => onStartProject(),
            variant: 'primary'
          }
        ]}
      />

      <StudioMain>
        <StudioHero
          badgeText="Synthesis Engine Active"
          title={heroTitle}
          description="Synthesize production-grade prototypes instantly. Describe your vision, and our studio will generate the codebase and live visuals for you automatically."
          promptValue={aiPrompt}
          onPromptChange={setAiPrompt}
          onPromptSubmit={() => {
            if(aiPrompt.trim()) onStartProject(aiPrompt);
          }}
          placeholder={placeholderText}
          primaryActionLabel="Synthesize Vibe"
          primaryActionIcon={Rocket}

          secondaryActions={[
            { 
              label: 'Manual', 
              icon: Plus, 
              onClick: () => onStartProject() 
            },
            { 
              label: 'Excel', 
              icon: FileSpreadsheet, 
              onClick: () => { }, 
              hiddenMobile: true 
            }
          ]}
        />

        <StudioToolbar
          title="Vibe Portfolio"
          searchPlaceholder="Search projects..."
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          viewMode={viewMode}
          onViewModeChange={setViewMode}

          filterOptions={filterOptions}
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
        />

        {projects.length === 0 ? (
          <StudioEmptyState
            type="initial"

            actionLabel="Build Experiment"
            onAction={() => onStartProject()}
            customTitle="Manifest your vision in Vibe"
            customDescription="Synthesize production-grade prototypes instantly. Describe your vision above to get started."
          />
        ) : filteredProjects.length === 0 ? (
          <StudioEmptyState
            type={searchQuery && activeFilter !== 'all' ? 'both' : (searchQuery ? 'search' : 'filter')}

            searchQuery={searchQuery}
            activeFilterLabel={filterOptions.find(o => o.value === activeFilter)?.label}
            onClear={() => {
              setSearchQuery('');
              setActiveFilter('all');
            }}
          />
        ) : (
          viewMode === 'grid' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
               {filteredProjects.map((project) => (
                  <StudioCard
                    key={project.id}
                    icon={Rocket}
                    title={project.name}
                    tags={['REACT', 'TAILWIND', 'VITE']}
                    showDescription={false}
                    lastUpdated={project.lastEdited}
                    onClick={() => onOpenProject(project.id)}

                    status="Live"
                    menuItems={[
                      { label: 'Edit Project', icon: Edit2, onClick: () => onOpenProject(project.id) },
                      { label: 'Duplicate', icon: Copy, onClick: () => {} },
                      { label: 'Project Info', icon: Info, onClick: () => {} },
                      { label: 'Delete', icon: Trash2, onClick: () => {}, variant: 'danger' }
                    ]}
                  />
               ))}
            </div>
          ) : (
            <StudioTable<Project>
              data={filteredProjects}

              onRowClick={(project) => onOpenProject(project.id)}
              columns={[
                {
                  header: 'Project Name',
                  render: (project) => (
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center bg-mod-card-icon-bg text-mod-card-icon-text`}>
                        <Rocket size={20} />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-mod-surface-text-primary">{project.name}</p>
                        <p className="text-[10px] text-mod-surface-text-secondary font-medium">React Prototype • Tailwind CSS</p>
                      </div>
                    </div>
                  )
                },
                {
                  header: 'Status',
                  render: () => (
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border bg-mod-status-published-bg text-mod-status-published-text border-mod-status-published-border`}>
                      Live
                    </span>
                  )
                },
                {
                  header: 'Last Edited',
                  render: (project) => <span className="text-xs text-mod-surface-text-secondary font-medium">{project.lastEdited}</span>
                }
              ]}
              menuItems={(project) => [
                { label: 'Edit Project', icon: Edit2, onClick: () => onOpenProject(project.id) },
                { label: 'Duplicate', icon: Copy, onClick: () => {} },
                { label: 'Project Info', icon: Info, onClick: () => {} },
                { label: 'Delete', icon: Trash2, onClick: () => {}, variant: 'danger' }
              ]}
            />
          )
        )}
        <StudioTipsSection

          tips={[
            { icon: Sparkles, title: 'Instant Prototyping', description: 'Describe your vision in natural language and get a production-grade React prototype generated instantly.' },
            { icon: Rocket, title: 'Live Preview', description: 'See your application come to life in real-time with hot-reloading and interactive previews as you iterate.' },
            { icon: FileSpreadsheet, title: 'Export & Deploy', description: 'Export your generated code as a standalone project or deploy it directly to your preferred hosting platform.' }
          ]}
        />
      </StudioMain>
    </StudioPageWrapper>
  );
};

export default VibeHome;
