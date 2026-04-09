
import React from 'react';
import { PageWrapperColors } from '../../constants/themeColors';

interface StudioPageWrapperProps {
  colors: PageWrapperColors;
  children: React.ReactNode;
}

const StudioPageWrapper: React.FC<StudioPageWrapperProps> = ({ colors, children }) => {
  const styles = colors;

  return (
    <div className="flex-1 flex flex-col bg-white/40 backdrop-blur-3xl overflow-y-auto overflow-x-hidden custom-scrollbar relative">
      {/* Background Decorations for Glassmorphism */}
      <div className={`absolute top-[-10%] left-[-10%] w-[40%] h-[40%] ${styles.blurs[0]} blur-[120px] rounded-full -z-10 animate-pulse`} />
      <div className={`absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] ${styles.blurs[1]} blur-[120px] rounded-full -z-10 animate-pulse`} style={{ animationDelay: '2s' }} />
      <div className={`absolute top-[40%] right-[10%] w-[25%] h-[25%] ${styles.blurs[2]} blur-[100px] rounded-full -z-10`} />

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
