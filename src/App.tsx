import { AnimatePresence } from 'motion/react';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import ForgotPassword from './components/Authentication/ForgotPassword';
import Login from './components/Authentication/Login';
import GlobalLoader from './components/Common/GlobalLoader';
import Sidebar from './components/Common/Sidebar';
import Dashboard from './components/HomePage/Dashboard';
import Profile from './components/Profile/Profile';
import AgentContainer from './containers/AgentContainer';
import AppContainer from './containers/AppContainer';
import DataContainer from './containers/DataContainer';
import VibeCoderContainer from './containers/VibeCoderContainer';
import WorkflowContainer from './containers/WorkflowContainer';
import { ModuleThemeContext } from './contexts/ModuleThemeContext';
import { type ViewType } from './types';

const App: React.FC = () => {
  const [view, setView] = useState<ViewType>('login');
  const [lastAppView, setLastAppView] = useState<ViewType>('app-list');
  const [lastWorkflowView, setLastWorkflowView] = useState<ViewType>('workflow-home');
  const [lastAgentView, setLastAgentView] = useState<ViewType>('agent-home');
  const [isTransitioning, setIsTransitioning] = useState(false);

  /* ==========================================================================
     THEME MANAGEMENT
     Global theme: applied on <html> element — affects auth, sidebar, dashboard,
     AND provides default --mod-* vars for all modules.
     Module theme: applied on the module container div — overrides --mod-* vars
     for that specific module only.

     Available global themes:  'light-blue' | 'light-slate' | 'dark-blue'
     Available module themes:  'light-teal' | 'light-sky' | 'light-violet' |
                               'light-purple' | 'light-indigo' |
                               'light-blue' | 'light-slate'  (same as global)

     Each module supports themes (any global theme + listed accents):
       - Workflow:   global + light-teal, light-sky
       - Apps:       global + light-sky, light-blue
       - Agents:     global + light-violet, light-purple
       - VibeCoding: global + light-indigo, light-violet, light-teal, dark-blue
       - Data:       global + light-slate, light-sky
     ========================================================================== */

  const DEFAULT_MODULE_THEMES: Record<string, string> = {
    workflow: 'light-teal',
    apps: 'light-sky',
    agents: 'light-violet',
    vibe: 'light-indigo',
    data: 'light-slate',
  };

  const [globalTheme, setGlobalThemeState] = useState<string | null>(() =>
    localStorage.getItem('lum-global-theme')
  );
  const [moduleThemes, setModuleThemesState] = useState<Record<string, string>>(() => {
    try {
      const stored = localStorage.getItem('lum-module-themes');
      return stored ? JSON.parse(stored) : {};
    } catch { return {}; }
  });

  useEffect(() => {
    setGlobalTheme('light-blue')
    setModuleTheme('apps', 'light-sky')
    setModuleTheme('workflow', 'light-teal')
    setModuleTheme('agents', 'light-violet')
    setModuleTheme('vibe', 'light-indigo')
    setModuleTheme('data', 'light-slate')
    // setGlobalTheme('dark-blue')
    // setModuleTheme('apps', 'dark-blue')
    // setModuleTheme('workflow', 'dark-blue')
    // setModuleTheme('agents', 'dark-blue')
    // setModuleTheme('vibe', 'dark-blue')
    // setModuleTheme('data', 'dark-blue')
  }, [])

  useEffect(() => {
    if (globalTheme) {
      localStorage.setItem('lum-global-theme', globalTheme);
      document.documentElement.setAttribute('data-theme', globalTheme);
    } else {
      localStorage.removeItem('lum-global-theme');
      document.documentElement.removeAttribute('data-theme');
    }
    if (Object.keys(moduleThemes).length > 0) {
      localStorage.setItem('lum-module-themes', JSON.stringify(moduleThemes));
    } else {
      localStorage.removeItem('lum-module-themes');
    }
  }, [globalTheme, moduleThemes]);

  const setGlobalTheme = (theme: string | null) => setGlobalThemeState(theme);

  const setModuleTheme = (moduleId: string, theme: string | null) => {
    setModuleThemesState(prev => {
      const next = { ...prev };
      if (theme) next[moduleId] = theme;
      else delete next[moduleId];
      return next;
    });
  };

  const getModuleTheme = useCallback((moduleId: string): string =>
    moduleThemes[moduleId] || DEFAULT_MODULE_THEMES[moduleId] || globalTheme || 'light-blue'
  , [moduleThemes, globalTheme]);

  const activeModuleTheme = useMemo(() => {
    switch (view) {
      case 'app-list':
      case 'app-editor':
        return getModuleTheme('apps');
      case 'vibe-home':
      case 'vibe-coder':
        return getModuleTheme('vibe');
      case 'agent-home':
      case 'ai-agent-builder':
        return getModuleTheme('agents');
      case 'data':
        return getModuleTheme('data');
      case 'workflow-home':
      case 'workflow-builder':
        return getModuleTheme('workflow');
      default:
        return globalTheme || 'light-blue';
    }
  }, [view, globalTheme, moduleThemes, getModuleTheme]);

  const executeViewChange = useCallback((newView: ViewType) => {
    setView(newView);
    if (newView === 'app-list' || newView === 'app-editor') setLastAppView(newView);
    if (newView === 'workflow-home' || newView === 'workflow-builder') setLastWorkflowView(newView);
    if (newView === 'agent-home' || newView === 'ai-agent-builder') setLastAgentView(newView);
  }, []);

  const handleSetView = useCallback((newView: ViewType) => {
    if (newView === 'data' || (view === 'login' && newView === 'dashboard')) {
      setIsTransitioning(true);
      setTimeout(() => executeViewChange(newView), 1000);
      setTimeout(() => setIsTransitioning(false), 3000);
    } else {
      executeViewChange(newView);
    }
  }, [view, executeViewChange]);

  const handleNavigate = useCallback((newView: ViewType) => {
    let targetView = newView;
    if (newView === 'app-list') targetView = lastAppView;
    else if (newView === 'workflow-home') targetView = lastWorkflowView;
    else if (newView === 'agent-home') targetView = lastAgentView;

    if (targetView === 'data') {
      setIsTransitioning(true);
      setTimeout(() => {
        executeViewChange(targetView);
        setIsTransitioning(false);
      }, 3000);
    } else {
      executeViewChange(targetView);
    }
  }, [lastAppView, lastWorkflowView, lastAgentView, executeViewChange]);

  useEffect(() => {
    const token = sessionStorage.getItem('access_token');
    if (token && view === 'login') handleSetView('dashboard');
  }, [view, handleSetView]);

  return (
    <>
      <AnimatePresence>
        {isTransitioning && <GlobalLoader />}
      </AnimatePresence>

      {view === 'login' ? (
        <Login
          onLogin={() => handleSetView('dashboard')}
          onForgotPassword={() => setView('forgot-password')}
        />
      ) : view === 'forgot-password' ? (
        <ForgotPassword onBackToLogin={() => setView('login')} />
      ) : (
        <div className="flex h-screen w-full bg-shell-bg overflow-hidden text-shell-text">
          <Sidebar
            currentView={view}
            onNavigate={handleNavigate}
            onLogout={() => {
              sessionStorage.removeItem('access_token');
              handleSetView('login');
            }}
          />

          <div className="flex-1 flex flex-col overflow-hidden relative pb-[72px] md:pb-0">
            <ModuleThemeContext.Provider value={activeModuleTheme}>
              <div data-theme={activeModuleTheme} className="flex-1 flex flex-col overflow-hidden">

                {view === 'dashboard' && (
                  <Dashboard onNavigate={handleSetView} workflows={[]} />
                )}

                {(view === 'app-list' || view === 'app-editor') && (
                  <AppContainer view={view} setView={handleSetView} />
                )}

                {(view === 'vibe-home' || view === 'vibe-coder') && (
                  <VibeCoderContainer view={view} setView={handleSetView} />
                )}

                {(view === 'agent-home' || view === 'ai-agent-builder') && (
                  <AgentContainer view={view} setView={handleSetView} />
                )}

                {view === 'data' && <DataContainer />}

                {view === 'profile' && (
                  <Profile onBack={() => handleSetView('dashboard')} />
                )}

                {(view === 'workflow-home' || view === 'workflow-builder') && (
                  <WorkflowContainer view={view} setView={handleSetView} />
                )}

              </div>
            </ModuleThemeContext.Provider>
          </div>
        </div>
      )}
    </>
  );
};

export default App;
