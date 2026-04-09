import { Check, ChevronDown, Filter, Grid, List, Search, X } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import { ToolbarColors } from '../../constants/themeColors';

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
  colors: ToolbarColors;
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
  colors,
  filterOptions = [],
  activeFilter,
  onFilterChange
}) => {
  const styles = colors;
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
      <h2 className="hidden md:block text-xl font-bold text-gray-900">{title}</h2>
      <div className="flex items-center justify-end gap-2 w-full md:w-auto">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <input
            type="text"
            placeholder={searchPlaceholder}
            className={`w-full pl-10 pr-10 py-2.5 bg-white border border-gray-200 rounded-xl text-sm outline-none transition-all ${styles.focusRing}`}
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
          {searchQuery && (
            <button 
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X size={16} />
            </button>
          )}
        </div>
        
        {filterOptions.length > 0 && (
          <div className="relative" ref={dropdownRef}>
            <button 
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className={`flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 transition-all shrink-0 ${isFilterOpen ? styles.bgLight : ''}`}
            >
              <Filter size={16} className={activeFilter && activeFilter !== 'all' ? styles.activeText : ''} />
              <span className="hidden sm:inline whitespace-nowrap">{activeOption?.label || 'Filter'}</span>
              <ChevronDown size={14} className={`transition-transform duration-200 ${isFilterOpen ? 'rotate-180' : ''}`} />
            </button>

            {isFilterOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-100 rounded-2xl shadow-xl z-50 py-2 overflow-hidden animate-in fade-in zoom-in duration-200">
                {filterOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => {
                      onFilterChange?.(option.value);
                      setIsFilterOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-4 py-2.5 text-sm text-gray-600 ${styles.menuHover || 'hover:bg-gray-50'} transition-colors`}
                  >
                    <span className={activeFilter === option.value ? `font-bold ${styles.activeText} whitespace-nowrap` : 'whitespace-nowrap'}>
                      {option.label}
                    </span>
                    {activeFilter === option.value && <Check size={14} className={styles.activeText} />}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        <div className="flex items-center gap-2 bg-gray-100 p-1 rounded-xl shrink-0">
          <button
            onClick={() => onViewModeChange('grid')}
            className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? `bg-white ${styles.activeText} shadow-sm border border-slate-100` : 'text-gray-400 hover:text-gray-600'}`}
          >
            <Grid size={18} />
          </button>
          <button
            onClick={() => onViewModeChange('list')}
            className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? `bg-white ${styles.activeText} shadow-sm border border-slate-100` : 'text-gray-400 hover:text-gray-600'}`}
          >
            <List size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default StudioToolbar;
