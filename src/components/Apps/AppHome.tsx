
import {
  ArrowLeft,
  CheckCircle2,
  Copy,
  Edit2,
  FileSpreadsheet,
  FileText,
  Globe,
  Grid,
  Image as ImageIcon,
  Layout,
  LayoutTemplate,
  LogIn,
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
import StudioCard, { StudioCardSkeleton } from '../Common/StudioCard';
import StudioEmptyState from '../Common/StudioEmptyState';
import StudioHeader from '../Common/StudioHeader';
import StudioHero from '../Common/StudioHero';
import StudioPageWrapper, { StudioMain } from '../Common/StudioPageWrapper';
import StudioTable from '../Common/StudioTable';
import StudioTipsSection from '../Common/StudioTipsSection';
import StudioToolbar from '../Common/StudioToolbar';
import { makeRequest } from '../../utils/makeRequest';

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
  const [newModuleName, setNewModuleName] = useState('');
  const [modulePrompt, setModulePrompt] = useState('');
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
      <div className="flex-1 flex flex-col bg-white overflow-y-auto custom-scrollbar">
        <header className="h-16 border-b border-gray-100 px-8 flex items-center justify-between shrink-0 sticky top-0 z-40 bg-white/80 backdrop-blur-md">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setShowCreateModal(false)}
              className="p-2 hover:bg-gray-100 rounded-xl text-gray-500 transition-all"
            >
              <ArrowLeft size={20} />
            </button>
            <h2 className="text-lg font-bold text-gray-900">Configure Application</h2>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex -space-x-2 mr-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-sky-100 flex items-center justify-center text-[10px] font-bold text-sky-800">
                  {i}
                </div>
              ))}
            </div>
            <button 
              onClick={handleCreateApp}
              className="px-6 py-2 bg-gray-900 text-white text-xs font-bold rounded-xl hover:bg-gray-800 transition-all shadow-md"
            >
              Finish Setup
            </button>
          </div>
        </header>

        <div className="flex-1 flex flex-col lg:flex-row">
          <aside className="w-full lg:w-80 border-r border-gray-100 p-8 space-y-8 bg-gray-50/50">
            <div>
              <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-6">Setup Progress</h3>
              <div className="space-y-6">
                {[
                  { label: 'Basic Configuration', desc: 'Name and visibility', status: 'completed' },
                  { label: 'Initial Module', desc: 'Database & logic handlers', status: 'current' },
                  { label: 'Live Deployment', desc: 'URL and API endpoints', status: 'pending' }
                ].map((step, i) => (
                  <div key={i} className="flex gap-4 group cursor-pointer">
                    <div className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 mt-0.5 text-[10px] font-bold transition-all ${
                      step.status === 'completed' ? 'bg-teal-500 text-white shadow-lg shadow-teal-100' :
                      step.status === 'current' ? 'bg-sky-800 text-white shadow-lg shadow-sky-100' :
                      'bg-white border border-gray-200 text-gray-400'
                    }`}>
                      {step.status === 'completed' ? <CheckCircle2 size={14} /> : i + 1}
                    </div>
                    <div>
                      <h4 className={`text-xs font-bold transition-colors ${step.status === 'pending' ? 'text-gray-400' : 'text-gray-900'}`}>{step.label}</h4>
                      <p className="text-[10px] text-gray-400 mt-0.5 font-medium">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-8 border-t border-gray-100">
              <div className="p-4 bg-sky-50 rounded-2xl border border-sky-100">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 bg-sky-800 text-white rounded-lg flex items-center justify-center">
                    <Zap size={16} />
                  </div>
                  <h4 className="text-[11px] font-black text-sky-900 uppercase">Pro Tip</h4>
                </div>
                <p className="text-[10px] text-sky-700 leading-relaxed font-medium">You can add multiple modules to a single application. Each module can have its own data source and logic handlers.</p>
              </div>
            </div>
          </aside>

          <main className="flex-1 p-8 lg:p-12 overflow-y-auto">
            <div className="max-w-3xl mx-auto space-y-12">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-sky-50 text-sky-800 rounded-full text-[9px] font-black uppercase tracking-wider mb-2">
                  <Rocket size={12} /> App Blueprint
                </div>
                <h1 className="text-3xl font-black text-gray-900 tracking-tight">Main Application Module</h1>
                <p className="text-sm text-gray-500 max-w-xl leading-relaxed">Let's configure the first module for your application. This will serve as the core engine powering your user interface and business logic.</p>
              </div>

              <div className="grid lg:grid-cols-2 gap-8 items-start">
                <div className="space-y-6">
                  <div>
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1 mb-1.5 block">Application Name</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Sales Optimizer"
                      className="w-full px-5 py-3 bg-white border border-gray-200 rounded-xl outline-none focus:ring-4 focus:ring-sky-50 focus:border-sky-800 transition-all text-sm font-medium"
                      value={newAppName}
                      onChange={(e) => setNewAppName(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1 mb-1.5 block">Description</label>
                    <textarea 
                      placeholder="Briefly describe what this app does..."
                      className="w-full px-5 py-3 bg-white border border-gray-200 rounded-xl outline-none focus:ring-4 focus:ring-sky-50 focus:border-sky-800 transition-all text-sm h-32 resize-none"
                      value={newAppDesc}
                      onChange={(e) => setNewAppDesc(e.target.value)}
                    />
                  </div>
                </div>

                <div className="p-1 bg-gray-50 border border-gray-100 rounded-3xl relative group overflow-hidden">
                   <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                     <LayoutTemplate size={80} />
                   </div>
                   <div className="p-6 space-y-4 relative z-10 text-center sm:text-left">
                     <h3 className="text-sm font-bold text-gray-900">Module Preview</h3>
                     <div className="aspect-video bg-white rounded-2xl border border-gray-200 shadow-inner flex flex-col items-center justify-center p-6 border-dashed">
                        <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center text-gray-300 mb-3">
                          <ImageIcon size={24} />
                        </div>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">UI Layout Preview</p>
                     </div>
                     <button className="p-2.5 text-gray-400 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all">
                       <Trash2 size={20} />
                     </button>
                   </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="bg-gray-50 p-6 rounded-[24px] border border-gray-100 shadow-sm">
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1 mb-1.5 block">
                          <span className="text-rose-500 mr-1">*</span> Module Name
                        </label>
                        <input 
                          type="text" 
                          placeholder="Enter module name"
                          className="w-full px-5 py-3 bg-white border border-gray-200 rounded-xl outline-none focus:ring-4 focus:ring-sky-50 focus:border-sky-700 transition-all text-sm font-medium"
                          value={newModuleName}
                          onChange={(e) => setNewModuleName(e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1 mb-1.5 block">Module Icon</label>
                        <div className="flex gap-2">
                          {[LogIn, LayoutTemplate, Grid, FileText, Globe].map((Icon, i) => (
                            <button key={i} className="w-11 h-11 bg-white border border-gray-200 rounded-xl flex items-center justify-center text-gray-400 hover:border-sky-800 hover:text-sky-800 transition-all">
                              <Icon size={18} />
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1 block">AI Generation Prompt</label>
                      <textarea 
                        placeholder="Describe what this module should do..."
                        className="w-full px-5 py-3 bg-white border border-gray-200 rounded-xl outline-none focus:ring-4 focus:ring-sky-50 focus:border-sky-800/20 transition-all text-sm h-28 resize-none"
                        value={modulePrompt}
                        onChange={(e) => setModulePrompt(e.target.value)}
                      />
                    </div>

                    <div className="py-8 border-2 border-dashed border-gray-200 rounded-[24px] flex flex-col items-center justify-center bg-white/50 group hover:border-sky-800 transition-all cursor-pointer">
                      <div className="w-16 h-16 bg-sky-50 text-sky-800 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-sm">
                        <FileSpreadsheet size={32} />
                      </div>
                      <h4 className="text-base font-bold text-gray-900 mb-1">Import Module Data</h4>
                      <p className="text-xs text-gray-400 mb-6 text-center max-w-sm px-4">Upload an Excel or CSV file to automatically generate fields and data for this module.</p>
                      <button className="px-6 py-2.5 bg-white border border-gray-200 rounded-xl text-xs font-bold text-gray-700 hover:bg-gray-50 transition-all shadow-md">
                        Choose File
                      </button>
                      <p className="mt-4 text-[9px] text-gray-300 font-medium">Max file size: 25MB • Supported formats: .xlsx, .csv</p>
                    </div>

                    <div className="flex justify-center pt-2">
                      <button 
                        onClick={handleCreateModule}
                        className="px-12 py-3 bg-sky-800 text-white rounded-xl font-bold shadow-lg shadow-sky-100 hover:bg-sky-800 active:scale-95 transition-all flex items-center gap-2.5 text-sm"
                      >
                        Save Module <CheckCircle2 size={18} />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-5 bg-sky-50/30 border border-sky-100 rounded-[24px] group hover:bg-sky-50 transition-all text-center sm:text-left">
                    <div className="w-10 h-10 bg-sky-800 text-white rounded-xl flex items-center justify-center mb-3 shadow-lg shadow-sky-100 mx-auto sm:mx-0">
                      <Sparkles size={20} />
                    </div>
                    <h4 className="text-sm font-bold text-gray-900 mb-1">Smart Components</h4>
                    <p className="text-[11px] text-gray-500 leading-relaxed">Automatically add pre-configured components like charts, tables, and forms based on your data.</p>
                  </div>
                  <div className="p-5 bg-teal-50/30 border border-teal-100 rounded-[24px] group hover:bg-teal-50 transition-all text-center sm:text-left">
                    <div className="w-10 h-10 bg-teal-600 text-white rounded-xl flex items-center justify-center mb-3 shadow-lg shadow-teal-100 mx-auto sm:mx-0">
                      <Zap size={20} />
                    </div>
                    <h4 className="text-sm font-bold text-gray-900 mb-1">Quick Actions</h4>
                    <p className="text-[11px] text-gray-500 leading-relaxed">Connect this module to existing workflows or external APIs with just a few clicks.</p>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
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
                    <div className="w-10 h-10 bg-sky-100 rounded-xl flex items-center justify-center text-sky-800">
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
                    ? 'bg-teal-50 text-teal-600 border-teal-100' 
                    : 'bg-sky-50 text-sky-800 border-sky-100'
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
