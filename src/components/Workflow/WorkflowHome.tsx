import { motion } from 'framer-motion';
import {
  Check,
  ChevronDown,
  ChevronRight,
  Copy,
  Edit2,
  FileJson,
  Globe,
  HardDrive,
  Info,
  Layers,
  Link2,
  Plus,
  Rocket,
  Settings,
  Settings2,
  Sparkles,
  Trash2,
  Workflow as WorkflowIcon,
  Zap
} from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { Connection, NodeData, ViewType, Workflow, Workspace } from '../../../types';
import { studioThemeColors } from '../../constants/themeColors';
import { useRandomTitle, useTypewriter } from '../../hooks/useTypewriter';
import { makeRequest } from '../../utils/makeRequest';
import Modal from '../Common/Modal';
import StudioCard, { StudioCardSkeleton } from '../Common/StudioCard';
import StudioEmptyState from '../Common/StudioEmptyState';
import StudioHeader from '../Common/StudioHeader';
import StudioHero from '../Common/StudioHero';
import StudioPageWrapper, { StudioMain } from '../Common/StudioPageWrapper';
import StudioTable from '../Common/StudioTable';
import StudioTipsSection from '../Common/StudioTipsSection';
import StudioToolbar from '../Common/StudioToolbar';

interface WorkflowHomeProps {
  workspaces: Workspace[];
  setWorkspaces: React.Dispatch<React.SetStateAction<Workspace[]>>;
  workflows: Workflow[];
  setWorkflows: React.Dispatch<React.SetStateAction<Workflow[]>>;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  viewMode: 'grid' | 'list';
  setViewMode: (mode: 'grid' | 'list') => void;
  setActiveWorkflowId: (id: string | null) => void;
  deleteWorkflow: (id: string) => void;
  setView: (view: ViewType) => void;
  setNodes: React.Dispatch<React.SetStateAction<NodeData[]>>;
  setConnections: React.Dispatch<React.SetStateAction<Connection[]>>;
  setIsAiGenerated: (value: boolean) => void;
}

const FormLabel: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1 mb-1.5 block">
    {children}
  </label>
);

const WORKFLOW_PLACEHOLDERS = [
  "Create a customer onboarding flow that sends a welcome email...",
  "Build a data sync pipeline between Salesforce and our internal database...",
  "Setup a weekly report generator that fetches metrics and posts to Slack..."
];

const WORKFLOW_HERO_TITLES = [
  "What pipeline would you like to build today?",
  "Ready to architect your next automation?",
  "Let's build a smarter workflow together.",
  "What business logic shall we automate today?"
];


const WorkflowHome: React.FC<WorkflowHomeProps> = ({
  workspaces,
  setWorkspaces,
  workflows,
  setWorkflows,
  searchQuery,
  setSearchQuery,
  viewMode,
  setViewMode,
  setActiveWorkflowId,
  deleteWorkflow,
  setView,
  setNodes,
  setConnections,
  setIsAiGenerated
}) => {
  const [infoWorkflow, setInfoWorkflow] = React.useState<Workflow | null>(null);
  const [lineageWorkflow, setLineageWorkflow] = React.useState<Workflow | null>(null);
  const [isCreatingWorkspace, setIsCreatingWorkspace] = React.useState(false);
  const [workspaceForm, setWorkspaceForm] = React.useState({ name: '', description: '' });
  const [isAiPromptMode, setIsAiPromptMode] = React.useState(false);
  const [aiPrompt, setAiPrompt] = React.useState('');
  const [isGenerating, setIsGenerating] = React.useState(false);
  const heroTitle = useRandomTitle(WORKFLOW_HERO_TITLES);
  const placeholderText = useTypewriter(WORKFLOW_PLACEHOLDERS);

  const [settingsWorkflow, setSettingsWorkflow] = React.useState<Workflow | null>(null);
  const [duplicateWorkflowSource, setDuplicateWorkflowSource] = React.useState<Workflow | null>(null);
  const [flowSettingsForm, setFlowSettingsForm] = React.useState({
    name: '',
    isPublic: false,
    saveResponse: false,
    workspaceId: ''
  });

  const [activeFilter, setActiveFilter] = React.useState('all');

  const filterOptions = [
    { label: 'All Workflows', value: 'all' },
    { label: 'Public', value: 'public' },
    { label: 'Private', value: 'private' }
  ];

  const theme = studioThemeColors.workflow.homepage;

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchWorkflows();
  }, []);

  const fetchWorkflows = async () => {
    setIsLoading(true);
    setError(null);
    const token = sessionStorage.getItem('access_token');
    const appId = "d676d785-1dd8-11f1-a18c-81cc8e90e428"; // Hardcoded as requested

    if (!token) {
      setError('Access token not found. Please log in again.');
      setIsLoading(false);
      return;
    }

    try {
      const json = await makeRequest.postAuth('/appbuilder/get-workflow', { data: { appId } }, {
        headers: {
          'application-id': appId
        }
      });

      if (json && json.data) {
        // Map object-based response to Workflow array
        const mappedWorkflows: Workflow[] = Object.entries(json.data).map(([id, details]: [string, any]) => ({
          id,
          name: details.name || 'Untitled Workflow',
          isPublic: details.is_public,
          saveResponse: details.saveResponse,
          lastModified: new Date().toISOString()
        }));
        setWorkflows(mappedWorkflows);
      } else {
        setError(json.message || 'Failed to fetch workflows.');
      }
    } catch (err) {
      setError('Network error. Please check your connection.');
      console.error('Fetch workflows error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateWorkspace = () => {
    if (workspaceForm.name.trim()) {
      const newWs: Workspace = {
        id: `ws-${Math.floor(Math.random() * 10000)}`,
        name: workspaceForm.name,
        description: workspaceForm.description,
        createdAt: new Date().toISOString()
      };
      setWorkspaces([...workspaces, newWs]);
      setIsCreatingWorkspace(false);
      setWorkspaceForm({ name: '', description: '' });
    }
  };

  const handleSaveSettings = () => {
    if (settingsWorkflow) {
      setWorkflows(prev => prev.map(w => w.id === settingsWorkflow.id ? {
        ...w,
        name: flowSettingsForm.name,
        isPublic: flowSettingsForm.isPublic,
        saveResponse: flowSettingsForm.saveResponse,
        workspaceId: flowSettingsForm.workspaceId
      } : w));
      setSettingsWorkflow(null);
    } else if (duplicateWorkflowSource) {
      const newWf: Workflow = {
        id: `wf-${Math.floor(Math.random() * 10000)}`,
        name: flowSettingsForm.name || `${duplicateWorkflowSource.name} (Copy)`,
        isPublic: flowSettingsForm.isPublic,
        saveResponse: flowSettingsForm.saveResponse,
        workspaceId: flowSettingsForm.workspaceId,
        lastModified: new Date().toISOString()
      };
      setWorkflows([newWf, ...workflows]);
      setActiveWorkflowId(newWf.id);
      setDuplicateWorkflowSource(null);
      setDuplicateWorkflowSource(null);
    }
    setFlowSettingsForm({ name: '', isPublic: false, saveResponse: false, workspaceId: '' });
  };

  const generateWithAi = async () => {
    if (!aiPrompt.trim()) return;
    setIsGenerating(true);

    // Simulate AI Generation Delay
    setTimeout(() => {
      try {
        // Mock AI Generated Nodes based on prompt
        const mockNodes: NodeData[] = [
          { id: 'start-1', type: 'start', label: 'Start Flow', position: { x: 100, y: 150 }, config: { variables: [], data: [], inputMode: 'table' } },
          { id: 'js-1', type: 'js-expression', label: 'AI Generated Logic', position: { x: 400, y: 150 }, events: [], config: { expression: "// AI interpreted logic\nconsole.log('Processing incoming data based on: " + aiPrompt.replace(/'/g, "\\'") + "');\nreturn true;" } },
          { id: 'stop-1', type: 'stop', label: 'Finish', position: { x: 700, y: 150 }, config: {} },
        ];

        const mockConnections: Connection[] = [
          { id: 'c1', sourceId: 'start-1', targetId: 'js-1' },
          { id: 'c2', sourceId: 'js-1', targetId: 'stop-1' },
        ];

        setNodes(mockNodes);
        setConnections(mockConnections);

        const newWf: Workflow = {
          id: `wf-ai-${Date.now()}`,
          name: 'Untitled AI Workflow',
          isPublic: false,
          saveResponse: false,
          workspaceId: workspaces.length > 0 ? workspaces[0].id : '',
          lastModified: new Date().toISOString()
        };

        setWorkflows(prev => [newWf, ...prev]);
        setActiveWorkflowId(newWf.id);
        setIsAiPromptMode(false);
        setAiPrompt('');
        setIsAiGenerated(true);
        setView('workflow-builder');
      } catch (error) {
        console.error("AI Generation Error:", error);
        alert("Failed to generate workflow. Using fallback manual mode.");
      } finally {
        setIsGenerating(false);
      }
    }, 5000); // 2.5 second delay to show the loader
  };

  const handleCreateBlank = (workspaceId?: string) => {
    const newWf: Workflow = {
      id: `wf-${Math.floor(Math.random() * 10000)}`,
      name: 'Untitled Workflow',
      isPublic: false,
      saveResponse: false,
      workspaceId: workspaceId || (workspaces.length > 0 ? workspaces[0].id : ''),
      lastModified: new Date().toISOString()
    };

    const initialNodes: NodeData[] = [
      { id: 'start-1', type: 'start', label: 'Start Flow', position: { x: 100, y: 150 }, config: { variables: [], data: [], inputMode: 'table' } },
      { id: 'stop-1', type: 'stop', label: 'Finish', position: { x: 400, y: 150 }, config: {} }
    ];
    const initialConnections: Connection[] = [
      { id: 'c1', sourceId: 'start-1', targetId: 'stop-1' }
    ];

    setNodes(initialNodes);
    setConnections(initialConnections);

    setWorkflows([newWf, ...workflows]);
    setActiveWorkflowId(newWf.id);
    setView('workflow-builder');
  };

  const filteredWorkflows = workflows.filter(w => {
    const matchesSearch = w.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (w.description && w.description.toLowerCase().includes(searchQuery.toLowerCase()));
    
    if (activeFilter === 'all') return matchesSearch;
    if (activeFilter === 'public') return matchesSearch && w.isPublic;
    if (activeFilter === 'private') return matchesSearch && !w.isPublic;
    
    return matchesSearch;
  });



  return (
    <StudioPageWrapper colors={theme.pageWrapper}>
      <StudioHeader
        icon={WorkflowIcon}
        title="Workflow Studio"
        subtitle="Design and automate your business logic"
        colors={theme.header}
        buttons={[
          {
            label: "New Workspace",
            icon: Layers,
            onClick: () => setIsCreatingWorkspace(true),
            variant: 'secondary',
            hiddenMobile: true
          },
          {
            label: "Build from Scratch",
            icon: Plus,
            onClick: () => handleCreateBlank(),
            variant: 'primary'
          }
        ]}
      />

      <StudioMain>
        <StudioHero
          badgeText="Lumenore AI Architect"
          title={heroTitle}
          description="Describe your business logic in natural language. Our AI will generate the entire node structure, connections, and logic handlers for you automatically."
          promptValue={aiPrompt}
          onPromptChange={setAiPrompt}
          onPromptSubmit={() => {
            setIsAiPromptMode(true);
            generateWithAi();
          }}
          placeholder={placeholderText}
          isGenerating={isGenerating}
          primaryActionLabel="Generate Workflow"
          colors={theme.hero}
          secondaryActions={[
            { 
              label: 'Manual', 
              icon: Plus, 
              onClick: () => handleCreateBlank() 
            },
            { 
              label: 'Import JSON', 
              icon: FileJson, 
              onClick: () => { }, 
              hiddenMobile: true,
              iconColor: 'text-amber-500'
            }
          ]}
        />

        <StudioToolbar
          title="Workflows"
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          colors={theme.toolbar}
          filterOptions={filterOptions}
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
        />

        {/* Content Section */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <StudioCardSkeleton key={i} />
            ))}
          </div>
        ) : error || filteredWorkflows.length === 0 ? (
          <StudioEmptyState
            type={workflows.length === 0 || error ? 'initial' : (searchQuery && activeFilter !== 'all' ? 'both' : (searchQuery ? 'search' : 'filter'))}
            colors={theme.emptyState}
            searchQuery={searchQuery}
            activeFilterLabel={filterOptions.find(o => o.value === activeFilter)?.label}
            onClear={() => {
              setSearchQuery('');
              setActiveFilter('all');
            }}
            actionLabel="Design First Pipeline"
            onAction={() => handleCreateBlank()}
            secondaryActionLabel="Import JSON"
            onSecondaryAction={() => {}}
            secondaryIcon={FileJson}
            customTitle={workflows.length === 0 ? "Ready to automate your world?" : undefined}
            customDescription={workflows.length === 0 ? "Start by creating your first automation pipeline. Use our AI architect above for an instant setup or build manually." : undefined}
          />
        ) : (
          <div className="space-y-10">
            {/* Workspaces */}
                {workspaces.map(ws => {
                  const wsWorkflows = filteredWorkflows.filter(w => w.workspaceId === ws.id);
                  if (wsWorkflows.length === 0) return null;
                  return (
                    <section key={ws.id} className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                      <div className="flex items-center justify-between mb-6 border-b border-gray-100 pb-4">
                        <div className="flex items-center gap-4">
                          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm ${theme.card.iconBg} ${theme.card.iconText}`}>
                            <Layers size={24} />
                          </div>
                          <div>
                            <h3 className="text-lg font-bold text-gray-900">{ws.name}</h3>
                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{wsWorkflows.length} Pipelines • Created {new Date(ws.createdAt).toLocaleDateString()}</p>
                          </div>
                        </div>
                        <button
                          onClick={() => handleCreateBlank(ws.id)}
                          className={`hidden md:flex px-4 py-2 rounded-xl text-xs font-bold transition-all items-center gap-2 border ${theme.statusBadges.active}`}
                        >
                          <Plus size={14} /> Add to Workspace
                        </button>
                      </div>
                      <div className={viewMode === 'grid' ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" : "space-y-4"}>
                        {viewMode === 'grid' ? (
                          wsWorkflows.map(wf => (
                            <StudioCard
                              key={wf.id}
                              icon={WorkflowIcon}
                              title={wf.name}
                              description={wf.description || "A custom automation flow for your business logic."}
                              showDescription={false}
                              tags={['AUTOMATION', 'WORKFLOW']}
                              lastUpdated={new Date(wf.lastModified).toLocaleDateString()}
                              onClick={() => {
                                setActiveWorkflowId(wf.id);
                                setView('workflow-builder');
                              }}
                              colors={theme.card}
                              status={wf.isPublic ? 'Live' : 'Draft'}
                              extraProps={{ isPublic: wf.isPublic, saveResponse: wf.saveResponse }}
                              menuItems={[
                                { label: 'Edit Workflow', icon: Edit2, onClick: () => { setActiveWorkflowId(wf.id); setView('workflow-builder'); } },
                                { label: 'Duplicate', icon: Copy, onClick: () => { setDuplicateWorkflowSource(wf); setFlowSettingsForm({ name: `${wf.name} (Copy)`, isPublic: wf.isPublic || false, saveResponse: wf.saveResponse || false, workspaceId: wf.workspaceId || (typeof ws !== 'undefined' ? ws.id : '') }); } },
                                { label: 'View Lineage', icon: Link2, onClick: () => setLineageWorkflow(wf) },
                                { label: 'Settings', icon: Settings2, onClick: () => { setSettingsWorkflow(wf); setFlowSettingsForm({ name: wf.name, isPublic: wf.isPublic || false, saveResponse: wf.saveResponse || false, workspaceId: wf.workspaceId || (typeof ws !== 'undefined' ? ws.id : '') }); } },
                                { label: 'Workflow Info', icon: Info, onClick: () => setInfoWorkflow(wf) },
                                { label: 'Delete', icon: Trash2, onClick: () => deleteWorkflow(wf.id), variant: 'danger' }
                              ]}
                            />
                          ))
                        ) : (
                            wsWorkflows.length > 0 && (
                              <StudioTable<Workflow>
                                data={wsWorkflows}
                                colors={theme.table}
                                onRowClick={(wf) => {
                                  setActiveWorkflowId(wf.id);
                                  setView('workflow-builder');
                                }}
                                columns={[
                                  {
                                    header: 'Workflow Name',
                                    render: (wf) => (
                                      <div className="flex items-center gap-3">
                                        <div className={`w-9 h-9 rounded-lg flex items-center justify-center shadow-sm ${theme.card.iconBg} ${theme.card.iconText}`}>
                                          <WorkflowIcon size={18} />
                                        </div>
                                        <span className="text-sm font-bold text-gray-900">{wf.name}</span>
                                      </div>
                                    )
                                  },
                                  {
                                    header: 'Status',
                                    render: (wf) => (
                                      <div className="flex items-center gap-2">
                                        {wf.isPublic ? (
                                          <span className={`px-2 py-0.5 text-[9px] font-bold rounded border uppercase tracking-tighter ${theme.statusBadges.published}`}>PUBLIC</span>
                                        ) : (
                                          <span className={`px-2 py-0.5 text-[9px] font-bold rounded border uppercase tracking-tighter ${theme.statusBadges.draft}`}>PRIVATE</span>
                                        )}
                                      </div>
                                    )
                                  },
                                  {
                                    header: "Nodes",
                                    align: "center",
                                    render: () => <span className="text-xs font-semibold text-gray-600">{Math.floor(Math.random() * 10) + 3}</span>
                                  },
                                  {
                                    header: "Last Modified",
                                    render: (wf) => <span className="text-xs text-gray-400 font-medium">{new Date(wf.lastModified).toLocaleDateString()}</span>
                                  }
                                ]}
                                menuItems={(wf) => [
                                  { label: 'Edit Workflow', icon: Edit2, onClick: () => { setActiveWorkflowId(wf.id); setView('workflow-builder'); } },
                                  { label: 'Duplicate', icon: Copy, onClick: () => { setDuplicateWorkflowSource(wf); setFlowSettingsForm({ name: `${wf.name} (Copy)`, isPublic: wf.isPublic || false, saveResponse: wf.saveResponse || false, workspaceId: wf.workspaceId || ws.id }); } },
                                  { label: 'View Lineage', icon: Link2, onClick: () => setLineageWorkflow(wf) },
                                  { label: 'Settings', icon: Settings2, onClick: () => { setSettingsWorkflow(wf); setFlowSettingsForm({ name: wf.name, isPublic: wf.isPublic || false, saveResponse: wf.saveResponse || false, workspaceId: wf.workspaceId || ws.id }); } },
                                  { label: 'Workflow Info', icon: Info, onClick: () => setInfoWorkflow(wf) },
                                  { label: 'Delete', icon: Trash2, onClick: () => deleteWorkflow(wf.id), variant: 'danger' }
                                ]}
                              />
                            )
                          )}
                      </div>
                    </section>
                  );
                })}

                {/* Independent Workflows */}
                {filteredWorkflows.some(w => !w.workspaceId) && (
                  <section className="animate-in fade-in slide-in-from-bottom-4 duration-500 delay-150">
                    <div className="flex items-center justify-between mb-6 border-b border-gray-100 pb-4">
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm ${theme.card.iconBg} ${theme.card.iconText}`}>
                          <Zap size={24} />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-gray-900">Personal Workflows</h3>
                          <p className="text-xs text-gray-400 font-medium">Independent pipelines not assigned to any workspace</p>
                        </div>
                      </div>
                    </div>
                    {viewMode === 'grid' ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {filteredWorkflows
                          .filter(w => !w.workspaceId)
                          .map(wf => (
                            <StudioCard
                              key={wf.id}
                              icon={WorkflowIcon}
                              title={wf.name}
                              description={wf.description || "A custom automation flow for your business logic."}
                              showDescription={false}
                              tags={['AUTOMATION', 'WORKFLOW']}
                              lastUpdated={new Date(wf.lastModified).toLocaleDateString()}
                              onClick={() => {
                                setActiveWorkflowId(wf.id);
                                setView('workflow-builder');
                              }}
                              colors={theme.card}
                              status={wf.isPublic ? 'Live' : 'Draft'}
                              extraProps={{ isPublic: wf.isPublic, saveResponse: wf.saveResponse }}
                              menuItems={[
                                { label: 'Edit Workflow', icon: Edit2, onClick: () => { setActiveWorkflowId(wf.id); setView('workflow-builder'); } },
                                { label: 'Duplicate', icon: Copy, onClick: () => { setDuplicateWorkflowSource(wf); setFlowSettingsForm({ name: `${wf.name} (Copy)`, isPublic: wf.isPublic || false, saveResponse: wf.saveResponse || false, workspaceId: wf.workspaceId || '' }); } },
                                { label: 'View Lineage', icon: Link2, onClick: () => setLineageWorkflow(wf) },
                                { label: 'Settings', icon: Settings2, onClick: () => { setSettingsWorkflow(wf); setFlowSettingsForm({ name: wf.name, isPublic: wf.isPublic || false, saveResponse: wf.saveResponse || false, workspaceId: wf.workspaceId || '' }); } },
                                { label: 'Workflow Info', icon: Info, onClick: () => setInfoWorkflow(wf) },
                                { label: 'Delete', icon: Trash2, onClick: () => deleteWorkflow(wf.id), variant: 'danger' }
                              ]}
                            />
                          ))}
                      </div>
                    ) : (
                      <StudioTable<Workflow>
                        data={filteredWorkflows.filter(w => !w.workspaceId)}
                        colors={theme.table}
                        onRowClick={(wf) => {
                          setActiveWorkflowId(wf.id);
                          setView('workflow-builder');
                        }}
                        columns={[
                          {
                            header: 'Workflow Name',
                            render: (wf) => (
                              <div className="flex items-center gap-3">
                                <div className={`w-9 h-9 rounded-lg flex items-center justify-center shadow-sm ${theme.card.iconBg} ${theme.card.iconText}`}>
                                  <WorkflowIcon size={18} />
                                </div>
                                <span className="text-sm font-bold text-gray-900">{wf.name}</span>
                              </div>
                            )
                          },
                          {
                            header: 'Status',
                            render: (wf) => (
                              <div className="flex items-center gap-2">
                                {wf.isPublic ? (
                                  <span className={`px-2 py-0.5 text-[9px] font-bold rounded border uppercase tracking-tighter ${theme.statusBadges.published}`}>PUBLIC</span>
                                ) : (
                                  <span className={`px-2 py-0.5 text-[9px] font-bold rounded border uppercase tracking-tighter ${theme.statusBadges.draft}`}>PRIVATE</span>
                                )}
                              </div>
                            )
                          },
                          {
                            header: 'Nodes',
                            align: 'center',
                            render: () => <span className="text-xs font-semibold text-gray-600">{Math.floor(Math.random() * 10) + 3}</span>
                          },
                          {
                            header: 'Last Modified',
                            render: (wf) => <span className="text-xs text-gray-400 font-medium">{new Date(wf.lastModified).toLocaleDateString()}</span>
                          }
                        ]}
                        menuItems={(wf) => [
                          { label: 'Edit Workflow', icon: Edit2, onClick: () => { setActiveWorkflowId(wf.id); setView('workflow-builder'); } },
                          { label: 'Duplicate', icon: Copy, onClick: () => { setDuplicateWorkflowSource(wf); setFlowSettingsForm({ name: `${wf.name} (Copy)`, isPublic: wf.isPublic || false, saveResponse: wf.saveResponse || false, workspaceId: wf.workspaceId || '' }); } },
                          { label: 'View Lineage', icon: Link2, onClick: () => setLineageWorkflow(wf) },
                          { label: 'Settings', icon: Settings2, onClick: () => { setSettingsWorkflow(wf); setFlowSettingsForm({ name: wf.name, isPublic: wf.isPublic || false, saveResponse: wf.saveResponse || false, workspaceId: wf.workspaceId || '' }); } },
                          { label: 'Workflow Info', icon: Info, onClick: () => setInfoWorkflow(wf) },
                          { label: 'Delete', icon: Trash2, onClick: () => deleteWorkflow(wf.id), variant: 'danger' }
                        ]}
                      />
                    )}
                  </section>
                )}
          </div>
        )}


        <StudioTipsSection
          colors={theme.tipsSection}
          tips={[
            { icon: Zap, title: 'Quick Start', description: 'Use the "Create Workflow" button to start a new project. You can choose to build manually or use our AI architect.' },
            { icon: Sparkles, title: 'AI Architect', description: 'Describe your business logic in natural language, and we\'ll generate the entire node structure for you automatically.' },
            { icon: Rocket, title: 'Deploy Anywhere', description: 'Once your workflow is ready, deploy it as a public API or integrate it directly into your Lumenore applications.' }
          ]}
        />

      {/* --- Workflow Home specific Modals --- */}

      {/* Lineage Modal */}
      <Modal
        isOpen={!!lineageWorkflow}
        onClose={() => setLineageWorkflow(null)}
        title={`Lineage: ${lineageWorkflow?.name}`}
        maxWidth="max-w-2xl"
      >
        <div className="space-y-8">
          <div className={`p-4 rounded-2xl flex items-center gap-4 border ${theme.lineage.badgeBg} ${theme.lineage.cardBorder}`}>
            <div className={`p-3 rounded-xl shadow-lg ${theme.lineage.mainIconBg} ${theme.lineage.mainIconText}`}>
              <WorkflowIcon size={24} />
            </div>
            <div>
              <h4 className={`text-sm font-bold ${theme.lineage.mainIconText === 'text-white' ? 'text-gray-900' : theme.lineage.mainIconText}`}>{lineageWorkflow?.name}</h4>
              <p className={`text-[11px] font-mono mt-0.5 opacity-60`}>{lineageWorkflow?.id}</p>
            </div>
          </div>

          <section className="space-y-4">
            <h5 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100 pb-2">Active Implementations</h5>
            <div className="grid gap-3">
              {[
                { title: 'Global Header Onboarding', element: 'Button Component', location: 'Dashboard / Home', type: 'trigger' },
                { title: 'CRM Contact Sync', element: 'Form Submitter', location: 'Settings / Integration', type: 'call' },
                { title: 'Data Retention Script', element: 'Cron Job', location: 'Background Tasks', type: 'system' },
              ].map((item, i) => (
                <div key={i} className={`flex items-center gap-4 p-4 rounded-xl border transition-all group ${theme.lineage.cardBorder} ${theme.lineage.cardHoverBg}`}>
                  <div className={`p-2.5 rounded-lg transition-all ${theme.lineage.badgeBg} opacity-80 group-hover:opacity-100`}>
                    {item.type === 'trigger' ? <Zap size={16} /> : item.type === 'call' ? <Layers size={16} /> : <Settings size={16} />}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-gray-800">{item.title}</span>
                      <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-tighter ${theme.lineage.badgeBg}`}>{item.type}</span>
                    </div>
                    <div className="flex items-center gap-2 mt-1 text-[10px] text-gray-400 font-medium">
                      <span>{item.location}</span>
                      <ChevronRight size={10} className="text-gray-300" />
                      <span className={theme.hero.iconColor}>{item.element}</span>
                    </div>
                  </div>
                  <button className="p-2 text-gray-300 hover:text-blue-600 hover:bg-white rounded-lg transition-all opacity-0 group-hover:opacity-100">
                    <Rocket size={14} />
                  </button>
                </div>
              ))}
            </div>
          </section>

          <div className="flex justify-end pt-2 border-t border-gray-100">
            <button onClick={() => setLineageWorkflow(null)} className="px-5 py-2.5 bg-gray-900 text-white text-xs font-bold rounded-xl hover:bg-gray-800 transition-all">Close Viewer</button>
          </div>
        </div>
      </Modal>

      {/* Info Modal */}
      <Modal
        isOpen={!!infoWorkflow}
        onClose={() => setInfoWorkflow(null)}
        title="Workflow Information"
      >
        <div className="space-y-4">
          <div>
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">Full Name</label>
            <p className="text-sm font-semibold text-gray-800">{infoWorkflow?.name}</p>
          </div>
          <div className={`p-4 border rounded-xl ${theme.emptyState.secondaryBg} ${theme.card.border}`}>
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">Workflow Unique ID</label>
            <p className={`text-xs font-mono break-all ${theme.emptyState.secondaryText}`}>{infoWorkflow?.id}</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className={`p-3 border rounded-xl ${theme.tipsSection.iconBg} ${theme.card.border}`}>
              <label className="text-[9px] font-bold text-gray-400 uppercase block mb-1">Visibility</label>
              <div className="flex items-center gap-2">
                <Globe size={12} className={infoWorkflow?.isPublic ? theme.hero.iconColor : "text-gray-300"} />
                <span className="text-[11px] font-bold">{infoWorkflow?.isPublic ? "Public" : "Private"}</span>
              </div>
            </div>
            <div className={`p-3 border rounded-xl ${theme.tipsSection.iconBg}`}>
              <label className="text-[9px] font-bold text-gray-400 uppercase block mb-1">Data Retention</label>
              <div className="flex items-center gap-2">
                <HardDrive size={12} className={infoWorkflow?.saveResponse ? theme.hero.iconColor : "text-gray-300"} />
                <span className="text-[11px] font-bold">{infoWorkflow?.saveResponse ? "Saving" : "No Saving"}</span>
              </div>
            </div>
          </div>
          <div className="flex justify-end pt-2">
            <button onClick={() => setInfoWorkflow(null)} className="px-5 py-2.5 bg-gray-900 text-white text-xs font-bold rounded-xl hover:bg-gray-800 transition-all">Close</button>
          </div>
        </div>
      </Modal>

      {/* Create Workspace Modal */}
      <Modal
        isOpen={isCreatingWorkspace}
        onClose={() => setIsCreatingWorkspace(false)}
        title="Create New Workspace"
      >
        <div className="space-y-6">
          <div>
            <FormLabel>Workspace Name</FormLabel>
            <input
              type="text"
              placeholder="e.g. Production Pipelines"
              value={workspaceForm.name}
              onChange={(e) => setWorkspaceForm({ ...workspaceForm, name: e.target.value })}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all"
              autoFocus
            />
          </div>
          <div>
            <FormLabel>Description (Optional)</FormLabel>
            <textarea
              placeholder="What is this workspace for?"
              value={workspaceForm.description}
              onChange={(e) => setWorkspaceForm({ ...workspaceForm, description: e.target.value })}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all min-h-[100px]"
            />
          </div>
          <div className="flex gap-2 justify-end pt-4">
            <button
              onClick={() => setIsCreatingWorkspace(false)}
              className="px-4 py-2 text-gray-500 text-xs font-bold hover:bg-gray-100 rounded-xl transition-all"
            >
              Cancel
            </button>
            <button
              onClick={handleCreateWorkspace}
              className={`px-8 py-2.5 text-white text-xs font-bold rounded-xl transition-all shadow-lg flex items-center gap-2 ${theme.header.primaryBtn}`}
            >
              <Check size={14} /> Create Workspace
            </button>
          </div>
        </div>
      </Modal>

      {/* Workflow Settings / Creation / Duplicate Modal */}
      <Modal
        isOpen={!!settingsWorkflow || !!duplicateWorkflowSource}
        onClose={() => {
          setSettingsWorkflow(null);
          setDuplicateWorkflowSource(null);
        }}
        title={duplicateWorkflowSource ? "Duplicate Workflow" : "Workflow Settings"}
      >
        <div className="space-y-6">
          <div>
            <FormLabel>Workflow Name</FormLabel>
            <input
              type="text"
              placeholder="e.g. Analytics Pipeline"
              value={flowSettingsForm.name}
              onChange={(e) => setFlowSettingsForm({ ...flowSettingsForm, name: e.target.value })}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all"
              autoFocus
            />
          </div>

          <div>
            <FormLabel>Assign to Workspace</FormLabel>
            <div className="relative">
              <select
                value={flowSettingsForm.workspaceId}
                onChange={(e) => setFlowSettingsForm({ ...flowSettingsForm, workspaceId: e.target.value })}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all appearance-none"
              >
                <option value="">None (Personal)</option>
                {workspaces.map(ws => (
                  <option key={ws.id} value={ws.id}>{ws.name}</option>
                ))}
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                <ChevronDown size={16} />
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <FormLabel>Characteristics</FormLabel>
            <div onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100 group hover:border-blue-200 transition-all cursor-pointer" onClick={() => setFlowSettingsForm({ ...flowSettingsForm, isPublic: !flowSettingsForm.isPublic })}>
                <div className={`p-2 rounded-lg transition-all ${flowSettingsForm.isPublic ? 'bg-teal-600 text-white shadow-lg shadow-teal-100' : 'bg-white text-gray-400'}`}>
                  <Globe size={16} />
                </div>
                <div className="flex-1">
                  <p className="text-xs font-bold text-gray-800">Make Publicly Accessible</p>
                  <p className="text-[10px] text-gray-400">Available via public API endpoint</p>
                </div>
                <div className={`w-10 h-5 rounded-full transition-all relative ${flowSettingsForm.isPublic ? 'bg-teal-500' : 'bg-gray-200'}`}>
                  <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${flowSettingsForm.isPublic ? 'right-1' : 'left-1'}`} />
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100 group hover:border-blue-200 transition-all mt-3 cursor-pointer" onClick={() => setFlowSettingsForm({ ...flowSettingsForm, saveResponse: !flowSettingsForm.saveResponse })}>
                <div className={`p-2 rounded-lg transition-all ${flowSettingsForm.saveResponse ? 'bg-blue-600 text-white shadow-lg shadow-blue-100' : 'bg-white text-gray-400'}`}>
                  <HardDrive size={16} />
                </div>
                <div className="flex-1">
                  <p className="text-xs font-bold text-gray-800">Save Workflow Response</p>
                  <p className="text-[10px] text-gray-400">Log all execution results</p>
                </div>
                <div className={`w-10 h-5 rounded-full transition-all relative ${flowSettingsForm.saveResponse ? 'bg-blue-500' : 'bg-gray-200'}`}>
                  <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${flowSettingsForm.saveResponse ? 'right-1' : 'left-1'}`} />
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-2 justify-end pt-4">
            <button
              onClick={() => {
                setSettingsWorkflow(null);
                setDuplicateWorkflowSource(null);
              }}
              className="px-4 py-2 text-gray-500 text-xs font-bold hover:bg-gray-100 rounded-xl transition-all"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveSettings}
              className="px-8 py-2.5 bg-blue-600 text-white text-xs font-bold rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 flex items-center gap-2"
            >
              <Check size={14} /> {duplicateWorkflowSource ? 'Create Copy' : 'Save Changes'}
            </button>
          </div>
        </div>
      </Modal>

      {/* Creation Mode Selection Modal (Removed for Chat-First logic) */}

      {/* Redesigned AI Architecting Modal - Classic yet Standard AI Aesthetic */}
      {isAiPromptMode && isGenerating && createPortal(
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-6 selection:bg-transparent">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-md"
          />
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className={`relative w-full max-w-2xl bg-white rounded-3xl shadow-[0_0_50px_${theme.hero.badge.includes('teal') ? 'rgba(20,184,166,0.15)' : 'rgba(14,165,233,0.15)'}] overflow-hidden flex flex-col items-center justify-center p-12 lg:p-16`}
          >
            {/* AI Grid/Pattern Overlay */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: `radial-gradient(${theme.hero.badge.includes('teal') ? '#14b8a6' : '#0ea5e9'} 1px, transparent 1px)`, backgroundSize: '24px 24px' }} />
            
            <div className="relative mb-10">
              <div className={`absolute inset-0 ${theme.hero.badge.includes('teal') ? 'bg-teal-500' : 'bg-sky-500'} rounded-full blur-[60px] opacity-10 animate-pulse`} />
              <div className={`w-24 h-24 ${theme.tipsSection.iconBg} border border-${theme.tipsSection.iconText.split('-')[1]}-100 rounded-2xl flex items-center justify-center relative shadow-inner group`}>
                <Sparkles size={48} className={`${theme.tipsSection.iconText} animate-pulse`} />
                <motion.div 
                  animate={{ rotate: 360 }}
                  transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                  className={`absolute inset-0 border-2 border-dashed border-${theme.tipsSection.iconText.split('-')[1]}-200/50 rounded-2xl scale-125`}
                />
              </div>
            </div>

            <div className="text-center space-y-6 max-w-sm relative z-10">
              <div className="space-y-2">
                <h3 className="text-2xl font-bold text-gray-900 tracking-tight flex items-center justify-center gap-2">
                  <span className={`${theme.tipsSection.iconText} italic`}>AI</span> Architecting
                </h3>
                <p className="text-gray-500 text-sm font-medium leading-relaxed">
                  Synthesizing node clusters and logic schemas for your workflow...
                </p>
              </div>

              <div className="pt-4 flex flex-col items-center gap-4">
                <div className="flex items-center gap-1.5 h-6">
                  {[0, 1, 2].map((i) => (
                    <motion.div 
                      key={i}
                      animate={{ 
                        scale: [1, 1.5, 1],
                        opacity: [0.3, 1, 0.3],
                        backgroundColor: ['#94a3b8', theme.hero.gradient.split(' ')[1].replace('to-', '#'), '#94a3b8']
                      }}
                      transition={{ 
                        duration: 1.5, 
                        repeat: Infinity, 
                        delay: i * 0.2,
                        ease: "easeInOut"
                      }}
                      className="w-2 h-2 rounded-full"
                    />
                  ))}
                </div>
                <div className={`text-[10px] font-bold ${theme.tipsSection.iconText} opacity-60 uppercase tracking-[0.2em] font-mono`}>
                  Optimizing Logic Path...
                </div>
              </div>
            </div>

            {/* Bottom Accent */}
            <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-${theme.tipsSection.iconText.split('-')[1]}-500/20 to-transparent`} />
          </motion.div>
        </div>,
        document.body
      )}
    </StudioMain>
  </StudioPageWrapper>
);
};

export default WorkflowHome;
