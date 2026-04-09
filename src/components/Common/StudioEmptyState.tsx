import { motion } from 'framer-motion';
import { Filter, Rocket, Search, X } from 'lucide-react';
import React from 'react';
import { EmptyStateColors } from '../../constants/themeColors';

interface StudioEmptyStateProps {
  type: 'initial' | 'search' | 'filter' | 'both';
  searchQuery?: string;
  activeFilterLabel?: string;
  onClear?: () => void;
  onAction?: () => void;
  actionLabel?: string;
  secondaryActionLabel?: string;
  onSecondaryAction?: () => void;
  secondaryIcon?: React.ElementType;
  colors: EmptyStateColors;
  customTitle?: string;
  customDescription?: string;
}

const StudioEmptyState: React.FC<StudioEmptyStateProps> = ({
  type,
  searchQuery,
  activeFilterLabel,
  onClear,
  onAction,
  actionLabel,
  secondaryActionLabel,
  onSecondaryAction,
  secondaryIcon: SecondaryIcon,
  colors,
  customTitle,
  customDescription
}) => {
  const styles = colors;

  const getTitle = () => {
    if (customTitle) return customTitle;
    if (type === 'initial') return "Ready to start your journey?";
    if (type === 'search') return "No matches for your search";
    if (type === 'filter') return `No items match "${activeFilterLabel}"`;
    return "No matches found";
  };

  const getDescription = () => {
    if (customDescription) return customDescription;
    if (type === 'initial') return "Create your first project to get started. Use our AI assistant above or build manually.";
    if (type === 'search') return `We couldn't find anything matching "${searchQuery}". Try a different keyword or check your spelling.`;
    if (type === 'filter') return `There are currently no items in the "${activeFilterLabel}" category.`;
    if (type === 'both') return `No items found in "${activeFilterLabel}" matching "${searchQuery}".`;
    return "Try adjusting your filters or search terms.";
  };

  const getIcon = () => {
    if (type === 'initial') return <Rocket size={32} />;
    if (type === 'filter') return <Filter size={32} />;
    return <Search size={32} />;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-10 md:py-16 px-4 text-center bg-white/40 backdrop-blur-2xl rounded-[48px] border border-white/50 shadow-lg w-full max-w-[1440px] mx-auto my-4 overflow-hidden"
    >
      <div className="relative mb-6">
        <motion.div 
          animate={{ opacity: [0.1, 0.3, 0.1] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className={`absolute inset-0 blur-3xl rounded-full ${styles.glow}`} 
        />
        <div className={`w-20 h-20 rounded-3xl flex items-center justify-center relative shadow-lg ${styles.iconBg}`}>
          {getIcon()}
        </div>
      </div>

      <h3 className="text-xl md:text-2xl font-black text-gray-900 mb-3 tracking-tight">
        {getTitle()}
      </h3>
      <p className="text-gray-500 max-w-md text-[13px] md:text-sm leading-relaxed mb-8">
        {getDescription()}
      </p>

      {type === 'initial' ? (
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full justify-center">
          {onAction && actionLabel && (
            <button
              onClick={onAction}
              className={`w-full sm:w-auto px-8 py-3 text-white rounded-2xl font-bold shadow-xl transition-all flex items-center justify-center gap-2 text-sm hover:scale-[1.02] active:scale-95 ${styles.button}`}
            >
              {actionLabel}
            </button>
          )}
          {onSecondaryAction && secondaryActionLabel && (
            <button
              onClick={onSecondaryAction}
              className={`w-full sm:w-auto px-6 py-3 bg-gray-50 text-gray-600 rounded-2xl font-bold transition-all flex items-center justify-center gap-2 text-sm ${styles.secondaryBg} ${styles.secondaryText}`}
            >
              {SecondaryIcon && <SecondaryIcon size={18} />}
              {secondaryActionLabel}
            </button>
          )}
        </div>
      ) : (
        <button
          onClick={onClear}
          className="px-8 py-3 bg-gray-900 text-white rounded-2xl font-bold hover:bg-gray-800 transition-all flex items-center gap-2 text-sm shadow-xl"
        >
          <X size={18} /> Clear Filters & Search
        </button>
      )}
    </motion.div>
  );
};

export default StudioEmptyState;
