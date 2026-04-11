import { ChevronRight, Clock, Globe, HardDrive, LucideIcon, MoreVertical } from 'lucide-react';
import React from 'react';
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
  showDescription = true,
  extraProps
}) => {
  return (
    <div 
      onClick={onClick}
      className={`group bg-mod-surface-card p-6 rounded-[24px] border border-mod-card-border hover:border-mod-card-hover-border transition-all duration-300 cursor-pointer relative flex flex-col min-h-[200px] mod-card-hover-shadow`}
    >
      
      <div className="flex items-start justify-between mb-5">
        <div className={`w-12 h-12 bg-mod-card-icon-bg text-mod-card-icon-text rounded-2xl flex items-center justify-center shrink-0 transition-colors`}>
          <Icon size={22} />
        </div>
        <div className="flex items-center gap-3">
          {extraProps && (
            <div className="flex items-center gap-1.5 mr-1">
              {extraProps.isPublic && (
                <div className={`p-1.5 bg-mod-card-status-bg text-mod-card-status-text rounded-md`} title="Publicly Accessible">
                  <Globe size={14} />
                </div>
              )}
              {extraProps.saveResponse && (
                <div className={`p-1.5 bg-mod-card-status-bg text-mod-card-status-text rounded-md`} title="Data Retention Enabled">
                  <HardDrive size={14} />
                </div>
              )}
            </div>
          )}
          {status && (
            <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold tracking-widest uppercase bg-mod-card-status-bg text-mod-card-status-text`}>
              {status}
            </span>
          )}
          {menuItems && (
            <ActionDropdown
              itemHoverClass="hover:bg-mod-card-menu-hover-bg hover:text-mod-card-menu-hover-text"
              trigger={(isOpen) => (
                <button 
                  className={`p-2 rounded-xl transition-all ${isOpen ? 'bg-mod-card-status-bg text-mod-card-status-text' : 'text-mod-surface-text-muted hover:text-mod-card-status-text hover:bg-mod-card-status-bg'}`}
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
        <h3 className={`text-lg font-bold text-mod-surface-text-primary group-hover:text-mod-card-title-hover transition-colors leading-tight mb-2 pr-4`}>{title}</h3>
        {(!showDescription && tags && tags.length > 0) && (
          <p className="text-[10px] text-mod-surface-text-muted font-black uppercase tracking-widest mb-2">
            {tags.join(' • ')}
          </p>
        )}
        {showDescription && (
          <p className="text-sm text-mod-surface-text-secondary leading-relaxed line-clamp-2">
            {description || 'No description provided.'}
          </p>
        )}
      </div>

      <div className="flex items-center justify-between mt-6 pt-4 border-t border-mod-surface-divider">
        <div className="flex items-center gap-2 text-[12px] text-mod-surface-text-muted font-medium">
          <Clock size={14} />
          {lastUpdated}
        </div>
        <div className={`w-8 h-8 rounded-full bg-mod-surface-hover flex items-center justify-center text-mod-surface-text-muted group-hover:bg-mod-card-chevron-bg group-hover:text-mod-card-chevron-text transition-all`}>
          <ChevronRight size={16} />
        </div>
      </div>
    </div>
  );
};

export const StudioCardSkeleton: React.FC = () => (
  <div className="bg-mod-surface-card p-6 rounded-[24px] border border-mod-surface-border flex flex-col min-h-[200px] animate-pulse">
    <div className="flex items-start justify-between mb-5">
      <div className="w-12 h-12 bg-mod-surface-skeleton rounded-2xl" />
      <div className="w-20 h-6 bg-mod-surface-skeleton rounded-md" />
    </div>
    <div className="flex-1">
      <div className="w-3/4 h-6 bg-mod-surface-skeleton rounded-lg mb-3" />
      <div className="w-full h-4 bg-mod-surface-skeleton-light rounded-lg mb-1.5" />
      <div className="w-2/3 h-4 bg-mod-surface-skeleton-light rounded-lg" />
    </div>
    <div className="flex items-center justify-between mt-6 pt-4 border-t border-mod-surface-divider">
      <div className="w-24 h-4 bg-mod-surface-skeleton-light rounded-lg" />
      <div className="w-8 h-8 rounded-full bg-mod-surface-skeleton-light" />
    </div>
  </div>
);

export default StudioCard;
