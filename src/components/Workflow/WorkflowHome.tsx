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
import { Connection, NodeData, ViewType, Workflow, Workspace } from '../../types';
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
import WorkflowAIArchitectModal from './Modals/WorkflowAIArchitectModal';
import WorkflowCreateWorkspaceModal from './Modals/WorkflowCreateWorkspaceModal';
import WorkflowInfoModal from './Modals/WorkflowInfoModal';
import WorkflowLineageModal from './Modals/WorkflowLineageModal';
import WorkflowSettingsModal from './Modals/WorkflowSettingsModal';

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

  // Theme is now driven by CSS variables via data-theme on the container div

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
    <StudioPageWrapper>
      <StudioHeader
        icon={WorkflowIcon}
        title="Workflow Studio"
        subtitle="Design and automate your business logic"

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
                      <div className="flex items-center justify-between mb-6 border-b border-mod-surface-border pb-4">
                        <div className="flex items-center gap-4">
                          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center bg-mod-card-icon-bg text-mod-card-icon-text`}>
                            <Layers size={24} />
                          </div>
                          <div>
                            <h3 className="text-lg font-bold text-mod-surface-text-primary">{ws.name}</h3>
                            <p className="text-[10px] text-mod-surface-text-muted font-bold uppercase tracking-wider">{wsWorkflows.length} Pipelines • Created {new Date(ws.createdAt).toLocaleDateString()}</p>
                          </div>
                        </div>
                        <button
                          onClick={() => handleCreateBlank(ws.id)}
                          className={`hidden md:flex px-4 py-2 rounded-xl text-xs font-bold transition-all items-center gap-2 border bg-mod-status-active-bg text-mod-status-active-text border-mod-status-active-border`}
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

                                onRowClick={(wf) => {
                                  setActiveWorkflowId(wf.id);
                                  setView('workflow-builder');
                                }}
                                columns={[
                                  {
                                    header: 'Workflow Name',
                                    render: (wf) => (
                                      <div className="flex items-center gap-3">
                                        <div className={`w-9 h-9 rounded-lg flex items-center justify-center bg-mod-card-icon-bg text-mod-card-icon-text`}>
                                          <WorkflowIcon size={18} />
                                        </div>
                                        <span className="text-sm font-bold text-mod-surface-text-primary">{wf.name}</span>
                                      </div>
                                    )
                                  },
                                  {
                                    header: 'Status',
                                    render: (wf) => (
                                      <div className="flex items-center gap-2">
                                        {wf.isPublic ? (
                                          <span className={`px-2 py-0.5 text-[9px] font-bold rounded border uppercase tracking-tighter bg-mod-status-published-bg text-mod-status-published-text border-mod-status-published-border`}>PUBLIC</span>
                                        ) : (
                                          <span className={`px-2 py-0.5 text-[9px] font-bold rounded border uppercase tracking-tighter bg-mod-status-draft-bg text-mod-status-draft-text border-mod-status-draft-border`}>PRIVATE</span>
                                        )}
                                      </div>
                                    )
                                  },
                                  {
                                    header: "Nodes",
                                    align: "center",
                                    render: () => <span className="text-xs font-semibold text-mod-surface-text-secondary">{Math.floor(Math.random() * 10) + 3}</span>
                                  },
                                  {
                                    header: "Last Modified",
                                    render: (wf) => <span className="text-xs text-mod-surface-text-muted font-medium">{new Date(wf.lastModified).toLocaleDateString()}</span>
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
                    <div className="flex items-center justify-between mb-6 border-b border-mod-surface-border pb-4">
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center bg-mod-card-icon-bg text-mod-card-icon-text`}>
                          <Zap size={24} />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-mod-surface-text-primary">Personal Workflows</h3>
                          <p className="text-xs text-mod-surface-text-muted font-medium">Independent pipelines not assigned to any workspace</p>
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

                        onRowClick={(wf) => {
                          setActiveWorkflowId(wf.id);
                          setView('workflow-builder');
                        }}
                        columns={[
                          {
                            header: 'Workflow Name',
                            render: (wf) => (
                              <div className="flex items-center gap-3">
                                <div className={`w-9 h-9 rounded-lg flex items-center justify-center bg-mod-card-icon-bg text-mod-card-icon-text`}>
                                  <WorkflowIcon size={18} />
                                </div>
                                <span className="text-sm font-bold text-mod-surface-text-primary">{wf.name}</span>
                              </div>
                            )
                          },
                          {
                            header: 'Status',
                            render: (wf) => (
                              <div className="flex items-center gap-2">
                                {wf.isPublic ? (
                                  <span className={`px-2 py-0.5 text-[9px] font-bold rounded border uppercase tracking-tighter bg-mod-status-published-bg text-mod-status-published-text border-mod-status-published-border`}>PUBLIC</span>
                                ) : (
                                  <span className={`px-2 py-0.5 text-[9px] font-bold rounded border uppercase tracking-tighter bg-mod-status-draft-bg text-mod-status-draft-text border-mod-status-draft-border`}>PRIVATE</span>
                                )}
                              </div>
                            )
                          },
                          {
                            header: 'Nodes',
                            align: 'center',
                            render: () => <span className="text-xs font-semibold text-mod-surface-text-secondary">{Math.floor(Math.random() * 10) + 3}</span>
                          },
                          {
                            header: 'Last Modified',
                            render: (wf) => <span className="text-xs text-mod-surface-text-muted font-medium">{new Date(wf.lastModified).toLocaleDateString()}</span>
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

          tips={[
            { icon: Zap, title: 'Quick Start', description: 'Use the "Create Workflow" button to start a new project. You can choose to build manually or use our AI architect.' },
            { icon: Sparkles, title: 'AI Architect', description: 'Describe your business logic in natural language, and we\'ll generate the entire node structure for you automatically.' },
            { icon: Rocket, title: 'Deploy Anywhere', description: 'Once your workflow is ready, deploy it as a public API or integrate it directly into your Lumenore applications.' }
          ]}
        />


      {/* --- Workflow Home specific Modals --- */}
      <WorkflowLineageModal
        workflow={lineageWorkflow}
        onClose={() => setLineageWorkflow(null)}
      />

      <WorkflowInfoModal
        workflow={infoWorkflow}
        onClose={() => setInfoWorkflow(null)}
      />

      <WorkflowCreateWorkspaceModal
        isOpen={isCreatingWorkspace}
        onClose={() => setIsCreatingWorkspace(false)}
        workspaceForm={workspaceForm}
        setWorkspaceForm={setWorkspaceForm}
        onAction={handleCreateWorkspace}
      />

      <WorkflowSettingsModal
        settingsWorkflow={settingsWorkflow}
        duplicateWorkflowSource={duplicateWorkflowSource}
        onClose={() => {
          setSettingsWorkflow(null);
          setDuplicateWorkflowSource(null);
        }}
        flowSettingsForm={flowSettingsForm}
        setFlowSettingsForm={setFlowSettingsForm}
        onAction={handleSaveSettings}
        workspaces={workspaces}
      />

      <WorkflowAIArchitectModal
        isAiPromptMode={isAiPromptMode}
        isGenerating={isGenerating}
      />
    </StudioMain>
  </StudioPageWrapper>
);
};

export default WorkflowHome;
