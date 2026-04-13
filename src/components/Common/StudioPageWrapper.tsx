
import React from 'react';

interface StudioPageWrapperProps {
  children: React.ReactNode;
}

const StudioPageWrapper: React.FC<StudioPageWrapperProps> = ({ children }) => {
  return (
    <div className="flex-1 flex flex-col bg-mod-surface-bg backdrop-blur-3xl overflow-y-auto overflow-x-hidden custom-scrollbar relative">
      {/* Background Decorations for Glassmorphism */}
      <div className={`absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-mod-page-blur-1 blur-[120px] rounded-full -z-10 animate-pulse`} />
      <div className={`absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-mod-page-blur-2 blur-[120px] rounded-full -z-10 animate-pulse`} style={{ animationDelay: '2s' }} />
      <div className={`absolute top-[40%] right-[10%] w-[25%] h-[25%] bg-mod-page-blur-3 blur-[100px] rounded-full -z-10`} />

      {children}
    </div>
  );
};

export const StudioMain: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <main className="max-w-[1440px] mx-auto px-4 md:px-8 py-4 md:py-6 w-full relative z-10">
    {children}
  </main>
);

export default StudioPageWrapper;
