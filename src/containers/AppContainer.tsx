import React from 'react';
import AppEditor from '../components/Apps/AppEditor';
import AppHome from '../components/Apps/AppHome';
import { type ViewType } from '../types';

interface AppContainerProps {
  view: ViewType;
  setView: (view: ViewType) => void;
}

const AppContainer: React.FC<AppContainerProps> = ({ view, setView }) => {
  if (view === 'app-list') {
    return (
      <AppHome
        onSelectApp={() => setView('app-editor')}
        onStartVibeCoding={() => setView('vibe-home')}
      />
    );
  }

  if (view === 'app-editor') {
    return <AppEditor onBack={() => setView('app-list')} />;
  }

  return null;
};

export default AppContainer;
