
import { LucideIcon } from 'lucide-react';
import React from 'react';

interface HeaderButton {
  label: string;
  icon?: LucideIcon;
  onClick: () => void;
  variant?: 'primary' | 'secondary';
  hiddenMobile?: boolean;
}

interface StudioHeaderProps {
  icon: LucideIcon;
  title: string;
  subtitle: string;
  buttons?: HeaderButton[];
}

const StudioHeader: React.FC<StudioHeaderProps> = ({ 
  icon: Icon, 
  title, 
  subtitle, 
  buttons = [] 
}) => {
  return (
    <header className="h-14 md:h-16 bg-mod-surface-card/80 backdrop-blur-md border-b border-mod-surface-border-strong px-4 md:px-8 flex items-center justify-between shrink-0 sticky top-0 z-40 transition-all">
      <div className="flex items-center gap-3">
        <div className={`p-1.5 md:p-2 border rounded-lg transition-colors bg-mod-header-icon-bg text-mod-header-icon-text border-mod-header-icon-border`}>
          <Icon size={18} className="md:w-5 md:h-5" />
        </div>
        <div>
          <h1 className="text-sm md:text-lg font-bold text-mod-surface-text-primary leading-tight tracking-tight">{title}</h1>
          <p className="hidden sm:block text-[9px] md:text-xs text-mod-surface-text-secondary font-medium">{subtitle}</p>
        </div>
      </div>
      
      <div className="flex items-center gap-2 md:gap-3">
        {buttons.map((btn, idx) => {
          const isPrimary = btn.variant === 'primary' || (!btn.variant && idx === buttons.length - 1);
          
          return (
            <button
              key={idx}
              onClick={btn.onClick}
              className={`
                flex items-center gap-2 px-4 md:px-5 py-1.5 md:py-2 rounded-xl text-[11px] md:text-sm font-bold transition-all active:scale-95
                ${btn.hiddenMobile ? 'hidden md:flex' : 'flex'}
                ${isPrimary 
                  ? `bg-mod-header-btn-bg text-mod-header-btn-text hover:bg-mod-header-btn-hover mod-header-btn-shadow` 
                  : 'bg-mod-surface-card border border-mod-surface-border-strong text-mod-surface-text-secondary hover:bg-mod-surface-hover'
                }
              `}
            >
              {btn.icon && <btn.icon size={16} className="shrink-0" />}
              <span className={btn.hiddenMobile ? 'inline' : 'hidden md:inline'}>{btn.label}</span>
              {!isPrimary && !btn.hiddenMobile && <span className="md:hidden">{btn.label.split(' ').pop()}</span>}
              {isPrimary && !btn.hiddenMobile && <span className="md:hidden">{btn.label.includes('Build') ? 'New' : btn.label.split(' ').pop()}</span>}
            </button>
          );
        })}
      </div>
    </header>
  );
};

export default StudioHeader;
