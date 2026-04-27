
import React from 'react';

interface StudioPageWrapperProps {
  children: React.ReactNode;
}

const StudioPageWrapper: React.FC<StudioPageWrapperProps> = ({ children }) => {
  return (
    <div className="flex-1 flex flex-col bg-mod-surface-bg backdrop-blur-3xl overflow-y-auto overflow-x-hidden scrollbar-custom relative">
      <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-mod-page-blur-1 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-mod-page-blur-2 blur-[120px] rounded-full animate-pulse" style={{ animationDelay: '2s' }} />
        <div className="absolute top-[40%] right-[10%] w-[25%] h-[25%] bg-mod-page-blur-3 blur-[100px] rounded-full" />
      </div>
      {children}
    </div>
  );
};

interface StudioMainProps {
  children: React.ReactNode;
  /** Max-width of the content container. Default: '2000px' — same across all pages */
  maxWidth?: string;
  /**
   * Skip the automatic side padding when a page manages its own per-section
   * padding (e.g. Dashboard with horizontal-scroll cards). Default: false
   */
  noPadding?: boolean;
  /** Vertical padding classes. Default: 'py-4 md:py-6' */
  pyClassName?: string;
  /** Extra classes appended to the main element */
  className?: string;
}

export const StudioMain: React.FC<StudioMainProps> = ({
  children,
  maxWidth = '2000px',
  noPadding = false,
  pyClassName = 'py-4 md:py-6',
  className = '',
}) => (
  <main
    className={`mx-auto w-full relative z-10 ${pyClassName} ${className}`.trim()}
    style={{
      maxWidth,
      ...(noPadding ? {} : {
        paddingLeft: 'clamp(16px, 10.5vw, 200px)',
        paddingRight: 'clamp(16px, 10.5vw, 200px)',
      }),
    }}
  >
    {children}
  </main>
);

export default StudioPageWrapper;
