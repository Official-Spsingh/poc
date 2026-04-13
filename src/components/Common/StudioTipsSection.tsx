import { LucideIcon } from 'lucide-react';
import React from 'react';

interface Tip {
  icon: LucideIcon;
  title: string;
  description: string;
}

interface StudioTipsSectionProps {
  tips: Tip[];
}

const StudioTipsSection: React.FC<StudioTipsSectionProps> = ({ tips }) => {
  return (
    <div className="mt-12 md:mt-20 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-8">
      {tips.map((tip, i) => (
        <div key={i} className="p-5 md:p-6 bg-mod-surface-card rounded-2xl border border-mod-surface-border">
          <div className={`w-10 h-10 bg-mod-tips-icon-bg text-mod-tips-icon-text rounded-xl flex items-center justify-center mb-4`}>
            <tip.icon size={20} />
          </div>
          <h4 className="font-bold text-mod-surface-text-primary mb-2">{tip.title}</h4>
          <p className="text-xs text-mod-surface-text-secondary leading-relaxed">{tip.description}</p>
        </div>
      ))}
    </div>
  );
};

export default StudioTipsSection;
