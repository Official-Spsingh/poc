
import {
  ChevronLeft,
  ChevronRight,
  Database,
  Home,
  Layout,
  LogOut,
  Settings,
  Sparkles,
  Workflow,
  Zap
} from 'lucide-react';
import React from 'react';
import { ViewType } from '../../../types';
import Logo from './Logo';

interface SidebarProps {
  currentView: ViewType;
  onNavigate: (view: ViewType) => void;
  onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, onNavigate, onLogout }) => {
  const [isExpanded, setIsExpanded] = React.useState(false);

  const menuItems = [
    { id: 'dashboard', label: 'Home', icon: <Home size={22} /> },
    { id: 'app-list', label: 'Apps', icon: <Layout size={22} /> },
    { id: 'workflow-home', label: 'Workflows', icon: <Workflow size={22} /> },
    { id: 'agent-home', label: 'AI Agents', icon: <Zap size={22} /> },
    { id: 'vibe-home', label: 'Vibe Coding', icon: <Sparkles size={22} /> },
    { id: 'data', label: 'Data', icon: <Database size={22} /> },
  ];

  const isActive = (id: string) => {
    if (id === 'app-list') return currentView === 'app-list' || currentView === 'app-editor';
    if (id === 'workflow-home') return currentView === 'workflow-home' || currentView === 'workflow-builder';
    if (id === 'agent-home') return currentView === 'agent-home' || currentView === 'ai-agent-builder';
    if (id === 'vibe-home') return currentView === 'vibe-home' || currentView === 'vibe-coder';
    return currentView === id;
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <aside 
        onClick={() => {
          if (!isExpanded) setIsExpanded(true);
        }}
        className={`hidden md:flex ${isExpanded ? 'w-64' : 'w-20'} bg-sidebar-bg border-r border-sidebar-border flex-col shrink-0 z-[70] transition-all duration-300 relative group/sidebar ${!isExpanded ? 'cursor-pointer sidebar-hover-collapsed' : ''}`}
      >
        {/* Toggle Button */}
        <button 
          onClick={(e) => {
            e.stopPropagation();
            setIsExpanded(!isExpanded);
          }}
          className="absolute -right-3 top-24 w-6 h-6 bg-sidebar-bg border border-sidebar-border rounded-full flex items-center justify-center text-sidebar-text-default sidebar-toggle-btn shadow-sm z-[70] transition-all"
        >
          {isExpanded ? <ChevronLeft size={14} /> : <ChevronRight size={14} />}
        </button>

        {/* Logo */}
        <div className={`h-20 flex items-center border-b border-sidebar-border transition-all duration-300 ${isExpanded ? 'px-6' : 'justify-center'}`}>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-sidebar-logo-bg rounded-lg flex items-center justify-center text-sidebar-active-text shadow-lg sidebar-logo-shadow shrink-0">
              <Logo size={18} />
            </div>
            {isExpanded && (
              <div className="flex items-baseline gap-1">
                <span className="text-base font-black tracking-tighter text-sidebar-logo-text uppercase">LUMENORE</span>
                <span className="text-base font-semibold tracking-tighter text-sidebar-logo-secondary lowercase italic opacity-90">studio</span>
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-6 px-3 space-y-2 overflow-hidden">
          <p className={`px-4 text-[10px] font-bold text-sidebar-section-label uppercase tracking-widest mb-4 transition-opacity whitespace-nowrap ${isExpanded ? 'opacity-100' : 'opacity-0'}`}>Main Menu</p>
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={(e) => {
                e.stopPropagation();
                onNavigate(item.id as ViewType);
              }}
              className={`w-full flex items-center rounded-xl transition-all duration-300 group ${
                isExpanded ? 'px-4 py-3 gap-4 justify-start' : 'p-3 justify-center'
              } ${
                isActive(item.id) 
                  ? 'bg-sidebar-active-bg text-sidebar-active-text sidebar-active-shadow' 
                  : 'text-sidebar-text-default sidebar-hover-bg'
              } ${item.id === 'data' ? 'hidden md:flex' : ''}`}
              title={item.label}
            >
              <span className="shrink-0 flex items-center justify-center">
                {item.icon}
              </span>
              {isExpanded && (
                <span className="text-sm font-semibold flex-1 text-left whitespace-nowrap transition-all duration-300">
                  {item.label}
                </span>
              )}
              {isActive(item.id) && isExpanded && <ChevronRight size={14} className="opacity-50" />}
            </button>
          ))}
        </nav>

        {/* Profile Section */}
        <div 
          className="p-3 border-t border-sidebar-border auto-cols-auto"
          onClick={(e) => isExpanded && e.stopPropagation()}
        >
          <div className={`bg-sidebar-profile-bg rounded-2xl transition-all duration-300 overflow-hidden ${isExpanded ? 'p-4' : 'p-2 flex flex-col items-center'}`}>
            <div className={`flex items-center gap-3 transition-all ${isExpanded ? 'mb-4 w-full' : 'mb-0 justify-center'}`}>
              <div className="w-10 h-10 rounded-full sidebar-avatar-gradient flex items-center justify-center text-white font-bold border-2 shadow-md shrink-0" style={{ borderColor: 'var(--sidebar-avatar-border)' }}>
                SP
              </div>
              {isExpanded && (
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-sidebar-profile-name truncate">Shubham Pratap Singh</p>
                  <p className="text-[10px] text-sidebar-profile-sub font-medium truncate">Pro Plan</p>
                </div>
              )}
            </div>
            
            <div className={`space-y-1 transition-all duration-300 ${isExpanded ? 'mt-4' : 'mt-2 flex flex-col items-center w-full'}`}>
              <button 
                onClick={(e) => e.stopPropagation()}
                className={`flex items-center gap-2 text-xs font-medium text-sidebar-text-default sidebar-settings-hover rounded-lg transition-all ${isExpanded ? 'w-full px-3 py-2' : 'p-2 justify-center'}`}
                title="Settings"
              >
                <Settings size={14} /> {isExpanded && 'Settings'}
              </button>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  onLogout();
                }}
                className={`flex items-center gap-2 text-xs font-medium text-sidebar-logout-text hover:text-sidebar-logout-hover-text hover:bg-sidebar-logout-hover-bg rounded-lg transition-all ${isExpanded ? 'w-full px-3 py-2' : 'p-2 justify-center'}`}
                title="Log Out"
              >
                <LogOut size={14} /> {isExpanded && 'Log Out'}
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-sidebar-bg border-t border-sidebar-border flex items-center justify-around px-2 py-2 z-50 pb-safe shadow-[0_-4px_12px_-2px_rgba(0,0,0,0.05)]">
        {menuItems.filter(item => item.id !== 'data').map((item) => (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id as ViewType)}
            className={`flex flex-col items-center justify-center p-2 rounded-xl transition-all ${
              isActive(item.id) 
                ? 'sidebar-mobile-active' 
                : 'sidebar-mobile-inactive'
            }`}
          >
            {React.cloneElement(item.icon as React.ReactElement, { size: 20 })}
            <span className="text-[10px] font-bold mt-1">{item.label}</span>
          </button>
        ))}
        <button
          onClick={onLogout}
          className="flex flex-col items-center justify-center p-2 rounded-xl text-sidebar-mobile-text sidebar-mobile-logout transition-all"
        >
          <LogOut size={20} />
          <span className="text-[10px] font-bold mt-1">Logout</span>
        </button>
      </nav>
    </>
  );
};

export default Sidebar;
