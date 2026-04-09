
import {
  Bot,
  Brain,
  Copy,
  Cpu,
  Edit2,
  MessageSquare,
  Plus,
  Settings2,
  Shield,
  Trash2,
  Zap
} from 'lucide-react';
import React, { useState } from 'react';
import { Agent } from '../../../types';
import { studioThemeColors } from '../../constants/themeColors';
import { useRandomTitle, useTypewriter } from '../../hooks/useTypewriter';
import StudioCard, { StudioCardSkeleton } from '../Common/StudioCard';
import StudioEmptyState from '../Common/StudioEmptyState';
import StudioHeader from '../Common/StudioHeader';
import StudioHero from '../Common/StudioHero';
import StudioPageWrapper, { StudioMain } from '../Common/StudioPageWrapper';
import StudioTable from '../Common/StudioTable';
import StudioTipsSection from '../Common/StudioTipsSection';
import StudioToolbar from '../Common/StudioToolbar';

interface AgentHomeProps {
  onSelectAgent: (id: string) => void;
  onCreateAgent: () => void;
}

const AGENT_PLACEHOLDERS = [
  "e.g., Create a customer support agent trained on our helpdesk docs...",
  "e.g., Build a data analyst agent that can query our main SQL database...",
  "e.g., Setup an IT desk helper agent to reset passwords automatically..."
];

const AGENT_HERO_TITLES = [
  "What type of agent do you need?",
  "Ready to deploy some intelligence?",
  "Let's create a proactive AI assistant.",
  "What specialized agent shall we build today?"
];


const AgentHome: React.FC<AgentHomeProps> = ({ onSelectAgent, onCreateAgent }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [aiPrompt, setAiPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const heroTitle = useRandomTitle(AGENT_HERO_TITLES);
  const placeholderText = useTypewriter(AGENT_PLACEHOLDERS);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState('all');

  const filterOptions = [
    { label: 'All Agents', value: 'all' },
    { label: 'Active', value: 'active' },
    { label: 'Training', value: 'training' },
    { label: 'Idle', value: 'idle' }
  ];

  const generateWithAi = () => {
    if (!aiPrompt.trim()) return;
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      onCreateAgent();
      setAiPrompt('');
    }, 3000);
  };

  const theme = studioThemeColors.agents.homepage;

  const [agents] = useState<Agent[]>([
    { id: 'agent-1', name: 'Customer Support AI', description: 'Handles tier 1 support queries and ticket routing.', lastModified: new Date().toISOString(), status: 'active', type: 'support' },
    { id: 'agent-2', name: 'Sales Prospector', description: 'Identifies and qualifies leads from social media and web data.', lastModified: new Date().toISOString(), status: 'training', type: 'sales' },
    { id: 'agent-3', name: 'Market Research Bot', description: 'Analyzes competitor pricing and market trends daily.', lastModified: new Date().toISOString(), status: 'active', type: 'research' },
    { id: 'agent-4', name: 'Security Auditor', description: 'Monitors system logs for unusual patterns and potential threats.', lastModified: new Date().toISOString(), status: 'idle', type: 'custom' },
  ]);

  const filteredAgents = agents.filter(agent => {
    const matchesSearch = agent.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      agent.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (activeFilter === 'all') return matchesSearch;
    return matchesSearch && agent.status === activeFilter;
  });

  const getTypeIcon = (type: Agent['type']) => {
    switch (type) {
      case 'support': return MessageSquare;
      case 'sales': return Zap;
      case 'research': return Brain;
      default: return Cpu;
    }
  };

  const getStatusColor = (status: Agent['status']) => {
    switch (status) {
      case 'active': return 'bg-teal-50 text-teal-600 border-teal-100';
      case 'training': return 'bg-blue-50 text-blue-600 border-blue-100';
      case 'idle': return 'bg-gray-50 text-gray-400 border-gray-100';
    }
  };

  return (
    <StudioPageWrapper colors={theme.pageWrapper}>
      <StudioHeader
        icon={Bot}
        title="AI Agent Studio"
        subtitle="Deploy and manage intelligent autonomous agents"
        colors={theme.header}
        buttons={[
          {
            label: "Configure from Scratch",
            icon: Plus,
            onClick: onCreateAgent,
            variant: 'primary'
          }
        ]}
      />

      <StudioMain>
        <StudioHero
          badgeText="Lumenore Agent Brain"
          title={heroTitle}
          description="Define your agent's personality, goals, and constraints. Our AI will automatically configure the underlying model, tools, and reasoning patterns."
          promptValue={aiPrompt}
          onPromptChange={setAiPrompt}
          onPromptSubmit={() => {
            if(aiPrompt.trim()) generateWithAi();
          }}
          placeholder={placeholderText}
          isGenerating={isGenerating}
          primaryActionLabel="Generate Intelligence"
          colors={theme.hero}
          secondaryActions={[
            { 
              label: 'Manual', 
              icon: Plus, 
              onClick: onCreateAgent 
            }
          ]}
        />

        <StudioToolbar
          title="AI Agents"
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          colors={theme.toolbar}
          filterOptions={filterOptions}
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
        />

        {/* Agent Grid/List */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map(i => (
              <StudioCardSkeleton key={i} />
            ))}
          </div>
        ) : error || filteredAgents.length === 0 ? (
          <StudioEmptyState
            type={agents.length === 0 || error ? 'initial' : (searchQuery && activeFilter !== 'all' ? 'both' : (searchQuery ? 'search' : 'filter'))}
            colors={theme.emptyState}
            searchQuery={searchQuery}
            activeFilterLabel={filterOptions.find(o => o.value === activeFilter)?.label}
            onClear={() => {
              setSearchQuery('');
              setActiveFilter('all');
            }}
            actionLabel="Configure New Agent"
            onAction={onCreateAgent}
            customTitle={agents.length === 0 ? "Unlock the power of AI Agents" : undefined}
            customDescription={agents.length === 0 ? "Deploy autonomous agents to handle complex tasks, research, and customer interactions. Start with a prompt above." : undefined}
          />
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredAgents.map((agent) => (
              <StudioCard
                key={agent.id}
                icon={getTypeIcon(agent.type)}
                title={agent.name}
                description={agent.description || 'No description provided.'}
                showDescription={true}
                lastUpdated={new Date(agent.lastModified).toLocaleDateString()}
                onClick={() => onSelectAgent(agent.id)}
                colors={theme.card}
                status={agent.status === 'active' ? 'PUBLISHED' : (agent.status === 'training' ? 'TRAINING' : 'IDLE')}
                menuItems={[
                  { label: 'Edit Agent', icon: Edit2, onClick: () => onSelectAgent(agent.id) },
                  { label: 'Settings', icon: Settings2, onClick: () => {} },
                  { label: 'Duplicate', icon: Copy, onClick: () => {} },
                  { label: 'Delete', icon: Trash2, onClick: () => {}, variant: 'danger' }
                ]}
              />
            ))}
          </div>
        ) : (
          <StudioTable<Agent>
            data={filteredAgents}
            colors={theme.table}
            onRowClick={(agent) => onSelectAgent(agent.id)}
            columns={[
              {
                header: 'Agent Identity',
                render: (agent) => (
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-violet-700 border border-slate-100 shadow-sm">
                      <Bot size={20} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-900">{agent.name}</p>
                      <p className="text-[10px] text-gray-500 truncate max-w-[300px]">{agent.description}</p>
                    </div>
                  </div>
                )
              },
              {
                header: 'Type',
                render: (agent) => <span className="text-xs font-medium text-gray-600 capitalize">{agent.type}</span>
              },
              {
                header: 'Status',
                render: (agent) => (
                  <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${getStatusColor(agent.status)}`}>
                    {agent.status}
                  </span>
                )
              },
              {
                header: 'Last Activity',
                render: (agent) => <span className="text-xs text-gray-500 font-medium">{new Date(agent.lastModified).toLocaleString()}</span>
              }
            ]}
            menuItems={(agent) => [
              { label: 'Edit Agent', icon: Edit2, onClick: () => onSelectAgent(agent.id) },
              { label: 'Settings', icon: Settings2, onClick: () => {} },
              { label: 'Duplicate', icon: Copy, onClick: () => {} },
              { label: 'Delete', icon: Trash2, onClick: () => {}, variant: 'danger' }
            ]}
          />
        )}
        <StudioTipsSection
          colors={theme.tipsSection}
          tips={[
            { icon: Bot, title: 'Quick Setup', description: 'Use the "Configure from Scratch" button to create a new agent, or describe your needs above for AI generation.' },
            { icon: Brain, title: 'Smart Training', description: 'Upload documents, connect APIs, or define rules to train your agent on your specific domain knowledge.' },
            { icon: Shield, title: 'Secure Deployment', description: 'Deploy agents with role-based access controls and audit logging for enterprise-grade security.' }
          ]}
        />
      </StudioMain>
    </StudioPageWrapper>
  );
};

export default AgentHome;
