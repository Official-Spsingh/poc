
import { ArrowRight, Bot, Clock, Database, ExternalLink, Layout, Plus, Sparkles, Workflow as WorkflowIcon, X, Zap } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { ViewType, Workflow } from '../../types';
import AIDrawer from '../Common/AIDrawer';

interface DashboardChatProps {
  onNavigate: (view: ViewType) => void;
  autoOpenDelay?: number;
}

const DashboardChat: React.FC<DashboardChatProps> = ({ onNavigate, autoOpenDelay = 5000 }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [history, setHistory] = useState<{role: 'assistant' | 'user', content: string}[]>([
    { role: 'assistant', content: "Hello! I'm your Lumenore Assistant. How can I help you build today?" }
  ]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsOpen(true);
    }, autoOpenDelay);
    return () => clearTimeout(timer);
  }, [autoOpenDelay]);

  const handleSendMessage = (val: string) => {
    setHistory(prev => [...prev, { role: 'user', content: val }]);
    setMessage('');
    
    // Simple mock responses
    setTimeout(() => {
      setHistory(prev => [...prev, { role: 'assistant', content: "That's a great request! I'm currently in a demo mode, but I can help you navigate to our main builders." }]);
    }, 1000);
  };

  return (
    <div className="fixed bottom-24 right-5 md:bottom-8 md:right-8 z-[10000]">
      <AIDrawer
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        history={history}
        message={message}
        setMessage={setMessage}
        onSendMessage={handleSendMessage}
        title="Lumenore AI"
        status="Assistant active"
        mode="floating"
        floatingPosition="bottom-[90px] md:bottom-[100px] left-[5%] right-[5%] w-[90%] md:left-auto md:right-8 md:w-[400px]"
        themeColor="blue"
        placeholder="Ask anything..."
        quickActions={[
          { label: 'Create App', icon: <Plus size={12} />, onClick: () => onNavigate('app-list'), color: 'sky' },
          { label: 'New Workflow', icon: <Plus size={12} />, onClick: () => onNavigate('workflow-home'), color: 'teal' },
          { label: 'Build Agent', icon: <Plus size={12} />, onClick: () => onNavigate('agent-home'), color: 'violet' },
        ]}
      />

      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`w-12 h-12 md:w-14 md:h-14 rounded-2xl flex items-center justify-center text-white shadow-2xl transition-all hover:scale-110 active:scale-95 group relative ${
          isOpen 
            ? 'bg-gray-900 rotate-90 z-[100]' 
            : 'dash-ai-btn dash-ai-btn-shadow z-[10001]'
        }`}
      >
        {isOpen ? (
          <X size={22} className="md:w-6 md:h-6" />
        ) : (
          <div className="relative">
            <Bot size={26} className="md:w-7 md:h-7 drop-shadow-sm text-dash-ai-icon" />
            <Sparkles size={12} className="absolute -top-1.5 -right-1.5 text-yellow-300 animate-pulse drop-shadow-[0_0_8px_rgba(253,224,71,0.8)]" />
          </div>
        )}
      </button>
    </div>
  );
};

interface DashboardProps {
  onNavigate: (view: ViewType) => void;
  workflows: Workflow[];
}

const Dashboard: React.FC<DashboardProps> = ({ onNavigate, workflows }) => {
  const options = [
    {
      id: 'app-list' as ViewType,
      title: 'Apps',
      description: 'Create and manage your web applications with a visual drag-and-drop editor.',
      icon: <Layout size={32} />,
      moduleTheme: 'light-sky',
      tag: 'Popular'
    },
    {
      id: 'workflow-home' as ViewType,
      title: 'Workflows',
      description: 'Design complex automation pipelines and logic flows with our node-based builder.',
      icon: <WorkflowIcon size={32} />,
      moduleTheme: 'light-teal',
      tag: 'New'
    },
    {
      id: 'agent-home' as ViewType,
      title: 'AI Agents',
      description: 'Build and deploy intelligent AI agents powered by state-of-the-art LLMs.',
      icon: <Zap size={32} />,
      moduleTheme: 'light-violet',
      tag: 'Beta'
    },
    {
      id: 'data' as ViewType,
      title: 'Data',
      description: 'Manage your database connections, tables, and datasets in a unified interface.',
      icon: <Database size={32} />,
      moduleTheme: 'light-slate',
      tag: 'Essential'
    }
  ];

  const recentProjects = [
    ...workflows.slice(0, 2).map(wf => ({ id: wf.id, name: wf.name, type: 'workflow', lastModified: 'Recently', status: wf.isPublic ? 'Public' : 'Private' })),
    { id: 'app-1', name: 'Customer Portal', type: 'app', lastModified: '5 hours ago', status: 'Published' },
    { id: 'agent-1', name: 'Support Bot Alpha', type: 'agent', lastModified: '1 day ago', status: 'Draft' },
  ];

  return (
    <>
      <div className="flex-1 dash-page-bg backdrop-blur-3xl overflow-y-auto overflow-x-hidden custom-scrollbar relative">
        {/* Background Decorations for Glassmorphism */}
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] dash-blur-1 blur-[120px] rounded-full -z-10 animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] dash-blur-2 blur-[120px] rounded-full -z-10 animate-pulse" style={{ animationDelay: '2s' }} />
        <div className="absolute top-[40%] right-[10%] w-[25%] h-[25%] dash-blur-3 blur-[100px] rounded-full -z-10" />

        <main className="max-w-[1440px] mx-auto px-4 md:px-8 py-6 md:py-12 relative z-10">
          <div className="mb-8 md:mb-12 flex flex-col md:flex-row items-start md:items-end justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-dash-title mb-2 md:mb-4 tracking-tight">Welcome back, Shubham</h1>
              <p className="text-dash-subtext text-base md:text-lg">Choose a tool to start building your next big idea.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
            {options.map((option) => (
              <div
                key={option.id}
                data-theme={option.moduleTheme}
                onClick={() => onNavigate(option.id)}
                className={`group relative bg-dash-card-bg p-6 md:p-8 rounded-2xl md:rounded-3xl border border-dash-card-border dash-card-shadow-hover hover:border-mod-hero-icon-color/50 transition-all text-left overflow-hidden cursor-pointer flex flex-col h-full ${option.id === 'data' ? 'hidden md:block' : ''}`}
              >
                <div className="absolute top-4 right-4 md:top-6 md:right-6 px-2 py-1 rounded-md text-[9px] font-bold uppercase tracking-wider text-dash-tag-text bg-dash-card-border/50 transition-all">
                  {option.tag}
                </div>
                <div className="w-12 h-12 md:w-16 md:h-16 bg-mod-hero-btn-bg rounded-xl md:rounded-2xl flex items-center justify-center text-white mb-6 md:mb-8 shadow-lg group-hover:scale-110 transition-transform">
                  {React.cloneElement(option.icon as React.ReactElement, { className: 'w-6 h-6 md:w-8 md:h-8' })}
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-dash-title mb-2 md:mb-3">{option.title}</h3>
                <p className="text-dash-subtext leading-relaxed mb-6 md:mb-8 text-xs md:text-sm">
                  {option.description}
                </p>
                <div className="flex items-center justify-between mt-auto">
                  <div className="flex items-center gap-2 text-mod-hero-icon-color font-bold text-xs md:text-sm group-hover:gap-4 transition-all">
                    Get Started <ArrowRight size={16} />
                  </div>
                  <a
                    href="https://help.lumenore.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="flex items-center gap-1.5 text-[10px] font-bold text-dash-link-text hover:text-mod-hero-icon-color transition-all py-1 group/link cursor-pointer relative z-20"
                  >
                    <span className="leading-none">Know More</span>
                    <ExternalLink size={10} className="transition-transform group-hover/link:-translate-y-0.5 group-hover/link:translate-x-0.5 shrink-0" />
                  </a>
                </div>

                <div className="absolute -right-8 -bottom-8 w-24 h-24 md:w-32 md:h-32 bg-mod-hero-btn-bg opacity-[0.03] rounded-full group-hover:scale-150 transition-transform" />
              </div>
            ))}
          </div>

          {/* Recent Activity Section */}
          <div className="mt-12 md:mt-20">
            <div className="flex items-center justify-between mb-6 md:mb-8">
              <h2 className="text-lg md:text-xl font-bold text-dash-recent-title flex items-center gap-2">
                <Clock size={20} className="text-dash-recent-icon" /> Recent Projects
              </h2>
              <button className="text-xs md:text-sm font-bold text-dash-recent-viewall hover:underline">View All Projects</button>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              {recentProjects.map((project) => (
                <div 
                  key={project.id} 
                  className="bg-dash-recent-card-bg p-5 rounded-2xl border border-dash-recent-card-border dash-recent-shadow transition-all cursor-pointer group flex flex-col"
                  onClick={() => {
                    if (project.type === 'workflow') onNavigate('workflow-builder');
                    else if (project.type === 'app') onNavigate('app-editor');
                    else if (project.type === 'agent') onNavigate('ai-agent-builder');
                  }}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-2 rounded-lg bg-dash-card-border/40 text-dash-recent-icon">
                      {project.type === 'workflow' ? <WorkflowIcon size={18} /> : 
                       project.type === 'app' ? <Layout size={18} /> : 
                       <Zap size={18} />}
                    </div>
                    <span className="text-[9px] font-bold text-dash-tag-text uppercase tracking-widest">{project.status}</span>
                  </div>
                  <h4 className="font-bold text-dash-title text-sm mb-1 transition-colors group-hover:text-dash-recent-viewall">{project.name}</h4>
                  <div className="mt-auto pt-4 flex items-center justify-between">
                    <span className="text-[10px] text-dash-subtext font-medium">{project.lastModified}</span>
                    <ArrowRight size={14} className="text-dash-link-text transition-all group-hover:translate-x-1 group-hover:text-dash-recent-icon" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Tips / Stats */}
          <div className="mt-12 md:mt-20 grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
            <div className="dash-promo-bg rounded-2xl md:rounded-3xl p-6 md:p-8 text-dash-promo-title relative overflow-hidden group">
              <div className="relative z-10">
                <div className="w-10 h-10 md:w-12 md:h-12 dash-promo-glow rounded-xl flex items-center justify-center mb-4 md:mb-6 shadow-lg dash-promo-icon-shadow">
                  <Sparkles size={20} className="md:w-6 md:h-6" />
                </div>
                <h3 className="text-xl md:text-2xl font-bold mb-2 md:mb-3">New: AI Agents</h3>
                <p className="text-dash-promo-subtext text-sm md:text-base mb-6 max-w-sm">Build agents that can think, reason, and act on your behalf.</p>
                <button className="inline-block px-5 md:px-6 py-2 md:py-2.5 dash-promo-btn rounded-xl font-bold text-xs md:text-sm transition-all font-sans" onClick={() => onNavigate('agent-home')}>Try AI Agents</button>
              </div>
              <div className="absolute -right-10 -bottom-10 w-48 h-48 md:w-64 md:h-64 dash-promo-glow opacity-20 rounded-full blur-3xl group-hover:scale-110 transition-transform" />
            </div>

            <div className="bg-dash-card-bg rounded-2xl md:rounded-3xl p-6 md:p-8 border border-dash-card-border dash-recent-shadow">
              <h3 className="text-lg md:text-xl font-bold text-dash-usage-title mb-4 md:mb-6">Studio Usage</h3>
              <div className="space-y-4 md:space-y-6">
                {[
                  { label: 'Active Workflows', value: 12, total: 20, color: 'bg-teal-600' },
                  { label: 'Deployed Apps', value: 4, total: 10, color: 'bg-sky-600' },
                  { label: 'AI Agents', value: 850, total: 1000, color: 'bg-violet-600' },
                ].map((stat, i) => (
                  <div key={i}>
                    <div className="flex justify-between text-xs font-bold mb-2">
                      <span className="text-dash-usage-label uppercase tracking-widest">{stat.label}</span>
                      <span className="text-dash-usage-value">{stat.value} / {stat.total}</span>
                    </div>
                    <div className="h-2 bg-dash-usage-bar-bg rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${stat.color} transition-all duration-1000`} 
                        style={{ width: `${(stat.value / stat.total) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
      <DashboardChat onNavigate={onNavigate} />
    </>
  );
};

export default Dashboard;
