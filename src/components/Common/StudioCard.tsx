import { ChevronRight, Clock, Globe, HardDrive, LucideIcon, MoreVertical } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';

import { studioThemeColors, CardColors } from '../../constants/themeColors';
import ActionDropdown from './ActionDropdown';

export interface MenuItem {
  label: string;
  icon: LucideIcon;
  onClick: () => void;
  variant?: 'default' | 'danger';
}

interface StudioCardProps {
  icon: LucideIcon;
  title: string;
  description?: string;
  tags?: string[];
  status?: string;
  statusVariant?: 'success' | 'warning' | 'info' | 'default';
  lastUpdated: string;
  onClick: () => void;
  menuItems?: MenuItem[];
  colors: CardColors;
  showDescription?: boolean;
  extraProps?: {
    isPublic?: boolean;
    saveResponse?: boolean;
  };
}

const StudioCard: React.FC<StudioCardProps> = ({
  icon: Icon,
  title,
  description,
  tags,
  status,
  lastUpdated,
  onClick,
  menuItems,
  colors,
  showDescription = true,
  extraProps
}) => {
  const styles = colors;

  return (
    <div 
      onClick={onClick}
      className={`group bg-white p-6 rounded-[24px] border border-gray-100 ${styles.border} transition-all duration-300 cursor-pointer relative flex flex-col min-h-[200px] ${styles.shadow}`}
    >
      
      <div className="flex items-start justify-between mb-5">
        <div className={`w-12 h-12 bg-gray-50 ${styles.iconBg} text-gray-400 ${styles.iconText} rounded-2xl flex items-center justify-center shrink-0 transition-colors`}>
          <Icon size={22} />
        </div>
        <div className="flex items-center gap-3">
          {extraProps && (
            <div className="flex items-center gap-1.5 mr-1">
              {extraProps.isPublic && (
                <div className={`p-1.5 ${styles.statusBg} ${styles.statusText} rounded-md`} title="Publicly Accessible">
                  <Globe size={14} />
                </div>
              )}
              {extraProps.saveResponse && (
                <div className={`p-1.5 ${styles.statusBg} ${styles.statusText} rounded-md`} title="Data Retention Enabled">
                  <HardDrive size={14} />
                </div>
              )}
            </div>
          )}
          {status && (
            <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold tracking-widest uppercase ${styles.statusBg} ${styles.statusText}`}>
              {status}
            </span>
          )}
          {menuItems && (
            <ActionDropdown
              theme={studioThemeColors.dashboard.homepage}
              itemHoverClass={styles.menuHover}
              trigger={(isOpen) => (
                <button 
                  className={`p-2 rounded-xl transition-all ${isOpen ? styles.statusBg + ' ' + styles.statusText : 'text-gray-400 hover:' + styles.statusText + ' hover:' + styles.statusBg}`}
                >
                  <MoreVertical size={20} />
                </button>
              )}
              items={menuItems.map(item => ({
                label: item.label,
                icon: <item.icon size={14} />,
                onClick: item.onClick,
                variant: item.variant
              }))}
            />
          )}
        </div>
      </div>

      <div className="flex-1">
        <h3 className={`text-lg font-bold text-gray-900 ${styles.titleHover} transition-colors leading-tight mb-2 pr-4`}>{title}</h3>
        {(!showDescription && tags && tags.length > 0) && (
          <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-2">
            {tags.join(' • ')}
          </p>
        )}
        {showDescription && (
          <p className="text-sm text-gray-500 leading-relaxed line-clamp-2">
            {description || 'No description provided.'}
          </p>
        )}
      </div>

      <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-50">
        <div className="flex items-center gap-2 text-[12px] text-gray-400 font-medium">
          <Clock size={14} />
          {lastUpdated}
        </div>
        <div className={`w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-300 ${styles.chevronBg} ${styles.chevronText} transition-all`}>
          <ChevronRight size={16} />
        </div>
      </div>
    </div>
  );
};

export const StudioCardSkeleton: React.FC = () => (
  <div className="bg-white p-6 rounded-[24px] border border-gray-100 flex flex-col min-h-[200px] animate-pulse">
    <div className="flex items-start justify-between mb-5">
      <div className="w-12 h-12 bg-gray-100 rounded-2xl" />
      <div className="w-20 h-6 bg-gray-100 rounded-md" />
    </div>
    <div className="flex-1">
      <div className="w-3/4 h-6 bg-gray-100 rounded-lg mb-3" />
      <div className="w-full h-4 bg-gray-50 rounded-lg mb-1.5" />
      <div className="w-2/3 h-4 bg-gray-50 rounded-lg" />
    </div>
    <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-50">
      <div className="w-24 h-4 bg-gray-50 rounded-lg" />
      <div className="w-8 h-8 rounded-full bg-gray-50" />
    </div>
  </div>
);

export default StudioCard;
