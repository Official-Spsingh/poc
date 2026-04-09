
import { LucideIcon } from 'lucide-react';
import React from 'react';
import { HeaderColors } from '../../constants/themeColors';

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
  colors: HeaderColors;
  buttons?: HeaderButton[];
}

const StudioHeader: React.FC<StudioHeaderProps> = ({ 
  icon: Icon, 
  title, 
  subtitle, 
  colors, 
  buttons = [] 
}) => {
  const styles = colors;

  return (
    <header className="h-14 md:h-16 bg-white/80 backdrop-blur-md border-b border-gray-200 px-4 md:px-8 flex items-center justify-between shrink-0 sticky top-0 z-40 shadow-sm transition-all">
      <div className="flex items-center gap-3">
        <div className={`p-1.5 md:p-2 border rounded-lg transition-colors ${styles.iconBg}`}>
          <Icon size={18} className="md:w-5 md:h-5" />
        </div>
        <div>
          <h1 className="text-sm md:text-lg font-bold text-gray-900 leading-tight tracking-tight">{title}</h1>
          <p className="hidden sm:block text-[9px] md:text-xs text-gray-500 font-medium">{subtitle}</p>
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
                  ? `${styles.primaryBtn} shadow-lg` 
                  : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
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
