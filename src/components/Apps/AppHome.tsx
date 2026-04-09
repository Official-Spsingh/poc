
import {
  Copy,
  Edit2,
  FileSpreadsheet,
  Image as ImageIcon,
  Layout,
  Plus,
  Rocket,
  Settings2,
  Sparkles,
  Trash2,
  Zap
} from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { studioThemeColors } from '../../constants/themeColors';
import { useRandomTitle, useTypewriter } from '../../hooks/useTypewriter';
import { makeRequest } from '../../utils/makeRequest';
import StudioCard, { StudioCardSkeleton } from '../Common/StudioCard';
import StudioEmptyState from '../Common/StudioEmptyState';
import StudioHeader from '../Common/StudioHeader';
import StudioHero from '../Common/StudioHero';
import StudioPageWrapper, { StudioMain } from '../Common/StudioPageWrapper';
import StudioTable from '../Common/StudioTable';
import StudioTipsSection from '../Common/StudioTipsSection';
import StudioToolbar from '../Common/StudioToolbar';
import AppModuleConfig from './AppModuleConfig';

interface AppItem {
  id: string;
  name: string;
  description: string;
  lastModified: string;
  status: 'draft' | 'published';
  tags: string[];
}

interface AppHomeProps {
  onSelectApp: (id: string) => void;
  onStartVibeCoding: () => void;
}

const APP_PLACEHOLDERS = [
  "e.g., Create a CRM app with lead management and email tracking...",
  "e.g., Build a project management tool with Kanban boards...",
  "e.g., Design a data visualization dashboard for sales metrics..."
];

const APP_HERO_TITLES = [
  "What application shall we build today?",
  "Ready to manifest your next big idea?",
  "Let's architect a stunning app together.",
  "What experience would you like to create?"
];

const AppHome: React.FC<AppHomeProps> = ({ onSelectApp, onStartVibeCoding }) => {
  const [apps, setApps] = useState<AppItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [activeFilter, setActiveFilter] = useState('all');
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newAppName, setNewAppName] = useState('');
  const [newAppDesc, setNewAppDesc] = useState('');
  const heroTitle = useRandomTitle(APP_HERO_TITLES);
  const placeholderText = useTypewriter(APP_PLACEHOLDERS);

  const fetchApps = async () => {
    setIsLoading(true);
    setError(null);
    const token = sessionStorage.getItem('access_token');

    if (!token) {
      setError('Access token not found. Please log in again.');
      setIsLoading(false);
      return;
    }

    try {
      const json = await makeRequest.getAuth('/appbuilder/get-apps');

      if (json && json.data) {
        const mappedApps: AppItem[] = json.data.map((item: any) => ({
          id: item.app_id,
          name: item.name,
          description: item.description || 'No description provided.',
          lastModified: item.modified_on,
          status: item.is_active ? 'published' : 'draft',
          tags: []
        }));
        setApps(mappedApps);
      } else {
        setError(json.message || 'Failed to fetch applications.');
      }
    } catch (err) {
      setError('Network error. Please check your connection.');
      console.error('Fetch apps error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchApps();
  }, []);

  const generateWithAi = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      setShowCreateModal(true);
      setNewAppName(aiPrompt.substring(0, 20) + "...");
    }, 3000);
  };

  const handleCreateBlankApp = () => {
    setShowCreateModal(true);
  };

  const handleCreateApp = () => {
    const newApp: AppItem = {
      id: Date.now().toString(),
      name: newAppName || 'Untitled Application',
      description: newAppDesc || 'No description provided.',
      lastModified: new Date().toISOString(),
      status: 'draft',
      tags: ['NEW']
    };
    setApps([newApp, ...apps]);
    setShowCreateModal(false);
    setNewAppName('');
    setNewAppDesc('');
    onSelectApp(newApp.id);
  };

  const handleCreateModule = () => {
    handleCreateApp();
  };

  const filteredApps = apps.filter(app => {
    const matchesSearch = app.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          app.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = activeFilter === 'all' || app.status === activeFilter;
    return matchesSearch && matchesFilter;
  });

  const filterOptions = [
    { label: 'All Projects', value: 'all' },
    { label: 'Published', value: 'published' },
    { label: 'Drafts', value: 'draft' }
  ];

  const theme = studioThemeColors.apps.homepage;

  if (showCreateModal) {
    return (
      <AppModuleConfig
        onBack={() => setShowCreateModal(false)}
        onFinish={handleCreateApp}
      />
    );
  }

  return (
    <StudioPageWrapper colors={theme.pageWrapper}>
      <StudioHeader
        icon={Layout}
        title="App Studio"
        subtitle="Manage and design your Lumenore applications"
        colors={theme.header}
        buttons={[
          {
            label: "Vibe Coding",
            icon: Sparkles,
            onClick: onStartVibeCoding,
            variant: 'secondary',
            hiddenMobile: true
          },
          {
            label: "Build from Scratch",
            icon: Plus,
            onClick: handleCreateBlankApp,
            variant: 'primary'
          }
        ]}
      />

      <StudioMain>
        <StudioHero
          badgeText="Lumenore AI App Builder"
          title={heroTitle}
          description="Describe the application you want to build. Our generative AI will handle the layout, components, and initial logic for you automatically."
          promptValue={aiPrompt}
          onPromptChange={setAiPrompt}
          onPromptSubmit={() => {
            if(aiPrompt.trim()) generateWithAi();
          }}
          placeholder={placeholderText}
          isGenerating={isGenerating}
          primaryActionLabel="Generate Application"
          colors={theme.hero}
          secondaryActions={[
            { 
              label: 'Manual', 
              icon: Plus, 
              onClick: handleCreateBlankApp 
            },
            { 
              label: 'Excel', 
              icon: FileSpreadsheet, 
              onClick: () => { }, 
              hiddenMobile: true 
            },
            { 
              label: 'Image', 
              icon: ImageIcon, 
              onClick: () => { }, 
              hiddenMobile: true 
            }
          ]}
        />

        <StudioToolbar
          title="My Apps"
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          colors={theme.toolbar}
          filterOptions={filterOptions}
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
        />

        {/* App Grid/List */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map(i => (
              <StudioCardSkeleton key={i} />
            ))}
          </div>
        ) : error || filteredApps.length === 0 ? (
          <StudioEmptyState
            type={apps.length === 0 || error ? 'initial' : (searchQuery && activeFilter !== 'all' ? 'both' : (searchQuery ? 'search' : 'filter'))}
            colors={theme.emptyState}
            searchQuery={searchQuery}
            activeFilterLabel={filterOptions.find(o => o.value === activeFilter)?.label}
            onClear={() => {
              setSearchQuery('');
              setActiveFilter('all');
            }}
            actionLabel="Design Custom App"
            onAction={handleCreateBlankApp}
            secondaryActionLabel="Import Excel"
            onSecondaryAction={() => {}}
            secondaryIcon={FileSpreadsheet}
            customTitle={apps.length === 0 ? "Ready to build your first app?" : undefined}
            customDescription={apps.length === 0 ? "Start by designing your first application. Use our AI App Builder above for an instant setup or build manually." : undefined}
          />
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredApps.map((app) => (
              <StudioCard
                key={app.id}
                icon={Layout}
                title={app.name}
                description={app.description || 'No description provided.'}
                showDescription={true}
                lastUpdated={new Date(app.lastModified).toLocaleDateString()}
                onClick={() => onSelectApp(app.id)}
                colors={theme.card}
                status={app.status === 'published' ? 'Published' : 'Draft'}
                menuItems={[
                  { label: 'Edit Application', icon: Edit2, onClick: () => onSelectApp(app.id) },
                  { label: 'Settings', icon: Settings2, onClick: () => {} },
                  { label: 'Duplicate', icon: Copy, onClick: () => {} },
                  { label: 'Delete', icon: Trash2, onClick: () => {}, variant: 'danger' }
                ]}
              />
            ))}
          </div>
        ) : (
          <StudioTable<AppItem>
            data={filteredApps}
            colors={theme.table}
            onRowClick={(app) => onSelectApp(app.id)}
            columns={[
              {
                header: 'App Name',
                render: (app) => (
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-sm ${theme.card.iconBg} ${theme.card.iconText}`}>
                      <Layout size={20} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-900">{app.name}</p>
                      <p className="text-[10px] text-gray-500 truncate max-w-[300px]">{app.description}</p>
                    </div>
                  </div>
                )
              },
              {
                header: 'Status',
                render: (app) => (
                  <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                    app.status === 'published' 
                    ? theme.statusBadges.published 
                    : theme.statusBadges.draft
                  }`}>
                    {app.status}
                  </span>
                )
              },
              {
                header: 'Last Modified',
                render: (app) => <span className="text-xs text-gray-500 font-medium">{new Date(app.lastModified).toLocaleString()}</span>
              }
            ]}
            menuItems={(app) => [
              { label: 'Edit Application', icon: Edit2, onClick: () => onSelectApp(app.id) },
              { label: 'Settings', icon: Settings2, onClick: () => {} },
              { label: 'Duplicate', icon: Copy, onClick: () => {} },
              { label: 'Delete', icon: Trash2, onClick: () => {}, variant: 'danger' }
            ]}
          />
        )}
        <StudioTipsSection
          colors={theme.tipsSection}
          tips={[
            { icon: Zap, title: 'Quick Start', description: 'Use the "Build from Scratch" button to create a new application, or describe your idea above for AI generation.' },
            { icon: Sparkles, title: 'AI Builder', description: 'Describe the application you want to build in natural language, and our AI will generate the layout and logic for you.' },
            { icon: Rocket, title: 'Publish & Share', description: 'Once your app is ready, publish it for your team or make it publicly accessible via a shareable link.' }
          ]}
        />
      </StudioMain>
    </StudioPageWrapper>
  );
};

export default AppHome;
