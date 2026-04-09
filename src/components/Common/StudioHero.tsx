
import { LucideIcon, Sparkles } from 'lucide-react';
import React from 'react';
import { HeroColors } from '../../constants/themeColors';

export interface HeroAction {
  label: string;
  icon: LucideIcon;
  onClick: () => void;
  variant?: 'default' | 'violet' | 'teal' | 'rose' | 'indigo' | 'sky';
  hiddenMobile?: boolean;
  iconColor?: string;
}

interface StudioHeroProps {
  badgeIcon?: LucideIcon;
  badgeText: string;
  title: string;
  description: string;
  promptValue: string;
  onPromptChange: (value: string) => void;
  onPromptSubmit?: () => void;
  placeholder: string;
  isGenerating?: boolean;
  primaryActionIcon?: LucideIcon;
  primaryActionLabel: string;
  secondaryActions?: HeroAction[];
  colors: HeroColors;
}

const StudioHero: React.FC<StudioHeroProps> = ({
  badgeIcon: BadgeIcon = Sparkles,
  badgeText,
  title,
  description,
  promptValue,
  onPromptChange,
  onPromptSubmit,
  placeholder,
  isGenerating,
  primaryActionIcon: PrimaryActionIcon = Sparkles,
  primaryActionLabel,
  secondaryActions = [],
  colors
}) => {
  const styles = colors;

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (promptValue.trim() && onPromptSubmit) {
        onPromptSubmit();
      }
    }
  };

  return (
    <div className="mb-4 md:mb-8 pt-1">
      <div className="flex flex-col items-center text-center mx-auto mb-4 md:mb-6">
        <div className={`inline-flex items-center gap-2 px-3 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-widest mb-2 md:mb-3 ${styles.badge}`}>
          <BadgeIcon size={10} /> {badgeText}
        </div>
        <h1 className="text-xl md:text-4xl font-black text-gray-900 mb-2 md:mb-3 tracking-tight leading-tight">
          {title}
        </h1>
        <p className="text-gray-500 max-w-2xl text-[12px] md:text-sm leading-relaxed">
          {description}
        </p>
      </div>

      <div className="max-w-4xl mx-auto relative group">
        <div className={`absolute -inset-0.5 bg-gradient-to-r ${styles.gradient} rounded-[32px] blur-[6px] opacity-12 group-hover:opacity-16 transition duration-1000 group-hover:duration-300`}></div>
        <div className={`relative bg-white border border-gray-100 shadow-sm ${styles.shadow} rounded-[32px] p-2 flex flex-col transition-all`}>
          <textarea
            placeholder={placeholder + '|'}
            value={promptValue}
            onChange={(e) => onPromptChange(e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full min-h-[80px] md:min-h-[120px] max-h-[350px] p-4 md:p-5 bg-transparent outline-none text-gray-800 resize-none text-sm md:text-lg placeholder:text-gray-400 disabled:opacity-50"
            disabled={isGenerating}
          />
          <div className="flex items-center justify-between p-2.5 gap-2 mt-0.5 border-t border-gray-50 overflow-x-auto scrollbar-none">
            <div className="flex items-center gap-1.5 shrink-0">
              {secondaryActions.map((action, idx) => {
                // First action uses theme color, others use their own or a default palette
                const defaultOtherColors = ['text-emerald-500', 'text-amber-500', 'text-rose-500', 'text-cyan-500'];
                const iconClr = action.iconColor 
                  ? action.iconColor 
                  : (idx === 0 ? styles.iconColor : defaultOtherColors[(idx - 1) % defaultOtherColors.length]);

                return (
                <React.Fragment key={idx}>
                  <button
                    onClick={action.onClick}
                    className={`flex items-center gap-1.5 px-3 py-2 text-[11px] md:text-[13px] font-bold text-gray-600 bg-gray-100/50 rounded-xl transition-all whitespace-nowrap ${styles.secondaryHover} ${action.hiddenMobile ? 'hidden sm:flex' : 'flex'}`}
                    disabled={isGenerating}
                  >
                    <action.icon size={14} className={iconClr} />
                    <span className="sm:inline">{action.label}</span>
                  </button>
                  {idx < secondaryActions.length - 1 && !secondaryActions[idx+1].hiddenMobile && <div className="w-px h-3 bg-gray-200 mx-0.5 hidden lg:block"></div>}
                </React.Fragment>
                );
              })}
            </div>
            <button
              onClick={() => promptValue.trim() && onPromptSubmit?.()}
              disabled={!promptValue.trim() || isGenerating}
              className={`flex items-center justify-center gap-1.5 px-4 md:px-6 py-2.5 md:py-3 rounded-[12px] md:rounded-[16px] text-[11px] md:text-sm font-bold transition-all whitespace-nowrap shrink-0 ${
                promptValue.trim() && !isGenerating
                  ? `${styles.button} text-white active:scale-95`
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }`}
            >
              <PrimaryActionIcon size={14} />
              {isGenerating ? 'Processing...' : (typeof window !== 'undefined' && window.innerWidth < 640 ? 'Generate' : primaryActionLabel)}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudioHero;
