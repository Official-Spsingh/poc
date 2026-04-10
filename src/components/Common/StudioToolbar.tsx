import { Check, ChevronDown, Filter, Grid, List, Search, X } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';

export interface FilterOption {
  label: string;
  value: string;
}

interface StudioToolbarProps {
  title: string;
  searchPlaceholder?: string;
  searchQuery: string;
  onSearchChange: (value: string) => void;
  viewMode: 'grid' | 'list';
  onViewModeChange: (mode: 'grid' | 'list') => void;
  filterOptions?: FilterOption[];
  activeFilter?: string;
  onFilterChange?: (value: string) => void;
}

const StudioToolbar: React.FC<StudioToolbarProps> = ({
  title,
  searchPlaceholder = "Search...",
  searchQuery,
  onSearchChange,
  viewMode,
  onViewModeChange,
  filterOptions = [],
  activeFilter,
  onFilterChange
}) => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsFilterOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const activeOption = filterOptions.find(opt => opt.value === activeFilter);

  return (
    <div className="flex items-center justify-between mb-4 md:mb-6">
      <h2 className="hidden md:block text-xl font-bold text-mod-surface-text-primary">{title}</h2>
      <div className="flex items-center justify-end gap-2 w-full md:w-auto">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-mod-surface-text-muted" size={16} />
          <input
            type="text"
            placeholder={searchPlaceholder}
            className={`w-full pl-10 pr-10 py-2.5 bg-mod-surface-input-bg border border-mod-surface-input-border text-mod-surface-text-primary rounded-xl text-sm outline-none transition-all mod-toolbar-focus-ring`}
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
          {searchQuery && (
            <button 
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-mod-surface-text-muted hover:text-mod-surface-text-secondary transition-colors"
            >
              <X size={16} />
            </button>
          )}
        </div>
        
        {filterOptions.length > 0 && (
          <div className="relative" ref={dropdownRef}>
            <button 
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className={`flex items-center gap-2 px-4 py-2.5 bg-mod-surface-card border border-mod-surface-input-border rounded-xl text-sm font-medium text-mod-surface-text-secondary hover:bg-mod-surface-hover transition-all shrink-0 ${isFilterOpen ? 'bg-mod-toolbar-bg-light' : ''}`}
            >
              <Filter size={16} className={activeFilter && activeFilter !== 'all' ? 'text-mod-toolbar-active-text' : ''} />
              <span className="hidden sm:inline whitespace-nowrap">{activeOption?.label || 'Filter'}</span>
              <ChevronDown size={14} className={`transition-transform duration-200 ${isFilterOpen ? 'rotate-180' : ''}`} />
            </button>

            {isFilterOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-mod-surface-card border border-mod-surface-border rounded-2xl z-50 py-2 overflow-hidden animate-in fade-in zoom-in duration-200">
                {filterOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => {
                      onFilterChange?.(option.value);
                      setIsFilterOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-4 py-2.5 text-sm text-mod-surface-text-secondary hover:bg-mod-toolbar-menu-hover-bg hover:text-mod-toolbar-menu-hover-text transition-colors`}
                  >
                    <span className={activeFilter === option.value ? `font-bold text-mod-toolbar-active-text whitespace-nowrap` : 'whitespace-nowrap'}>
                      {option.label}
                    </span>
                    {activeFilter === option.value && <Check size={14} className="text-mod-toolbar-active-text" />}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        <div className="flex items-center gap-2 bg-mod-surface-skeleton p-1 rounded-xl shrink-0">
          <button
            onClick={() => onViewModeChange('grid')}
            className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? `bg-mod-surface-card text-mod-toolbar-active-text border border-mod-surface-border` : 'text-mod-surface-text-muted hover:text-mod-surface-text-secondary'}`}
          >
            <Grid size={18} />
          </button>
          <button
            onClick={() => onViewModeChange('list')}
            className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? `bg-mod-surface-card text-mod-toolbar-active-text border border-mod-surface-border` : 'text-mod-surface-text-muted hover:text-mod-surface-text-secondary'}`}
          >
            <List size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default StudioToolbar;
