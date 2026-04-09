import { LucideIcon } from 'lucide-react';
import React from 'react';
import { TipsSectionColors } from '../../constants/themeColors';

interface Tip {
  icon: LucideIcon;
  title: string;
  description: string;
}

interface StudioTipsSectionProps {
  tips: Tip[];
  colors: TipsSectionColors;
}

const StudioTipsSection: React.FC<StudioTipsSectionProps> = ({ tips, colors }) => {
  const styles = colors;

  return (
    <div className="mt-12 md:mt-20 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-8">
      {tips.map((tip, i) => (
        <div key={i} className="p-5 md:p-6 bg-white rounded-2xl border border-gray-100 shadow-sm">
          <div className={`w-10 h-10 ${styles.iconBg} ${styles.iconText} rounded-xl flex items-center justify-center mb-4`}>
            <tip.icon size={20} />
          </div>
          <h4 className="font-bold text-gray-900 mb-2">{tip.title}</h4>
          <p className="text-xs text-gray-500 leading-relaxed">{tip.description}</p>
        </div>
      ))}
    </div>
  );
};

export default StudioTipsSection;
