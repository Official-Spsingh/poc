import { AnimatePresence, motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import { CombinedTheme } from '../../constants/themeColors';

export interface DropdownItem {
  label: string;
  icon?: React.ReactNode;
  onClick: () => void;
  variant?: 'default' | 'danger';
  divider?: boolean;
  active?: boolean;
}

interface ActionDropdownProps {
  trigger: React.ReactNode | ((isOpen: boolean) => React.ReactNode);
  items: DropdownItem[];
  theme: CombinedTheme;
  header?: {
    title: string;
    actionIcon?: React.ReactNode;
    onAction?: () => void;
  };
  align?: 'left' | 'right';
  className?: string;
  onClose?: () => void;
  activeItemClass?: string;
  itemHoverClass?: string;
}

const ActionDropdown: React.FC<ActionDropdownProps> = ({ 
  trigger, 
  items, 
  theme, 
  header,
  align = 'right',
  className = '',
  onClose: externalOnClose,
  activeItemClass,
  itemHoverClass
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsOpen(!isOpen);
  };

  const closeDropdown = () => {
    setIsOpen(false);
    externalOnClose?.();
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        closeDropdown();
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  return (
    <div className={`global-action-dropdown relative inline-block ${className}`} ref={dropdownRef}>
      <div onClick={toggleDropdown} className="cursor-pointer">
        {typeof trigger === 'function' ? trigger(isOpen) : trigger}
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className={`absolute z-[100] mt-2 w-52 bg-mod-surface-card rounded-2xl border border-mod-surface-border py-2 overflow-hidden ${
              align === 'right' ? 'right-0' : 'left-0'
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            {header && (
              <div className="flex items-center justify-between px-4 py-2 mb-1 border-b border-mod-surface-divider">
                <span className="text-[10px] font-bold text-mod-surface-text-muted uppercase tracking-widest">{header.title}</span>
                {header.onAction && (
                  <button 
                    onClick={(e) => { e.stopPropagation(); header.onAction?.(); }} 
                    className="p-1 hover:bg-mod-surface-hover text-mod-header-icon-text rounded transition-colors"
                  >
                    {header.actionIcon || <Plus size={14} />}
                  </button>
                )}
              </div>
            )}
            <div className="global-action-dropdown-items">
              {items.map((item, index) => (
                <React.Fragment key={index}>
                  {item.divider && <div className="h-px bg-mod-surface-divider my-1 mx-2" />}
                  {item.label && (
                    <button
                      onClick={() => {
                        item.onClick();
                        closeDropdown();
                      }}
                      className={`w-full px-4 py-2.5 text-left text-xs flex items-center gap-3 transition-colors ${
                        item.active
                          ? `${activeItemClass || 'bg-mod-header-btn-bg'} text-white`
                          : item.variant === 'danger'
                            ? 'text-rose-500 hover:bg-rose-50 font-bold'
                            : `text-mod-surface-text-secondary ${itemHoverClass || 'hover:bg-mod-surface-hover'} font-bold`
                      }`}
                    >
                      {item.icon && (
                        <span className={`shrink-0 ${item.active ? 'text-white' : item.variant === 'danger' ? 'text-rose-500' : 'text-mod-surface-text-muted'}`}>
                          {item.icon}
                        </span>
                      )}
                      {item.label}
                    </button>
                  )}
                </React.Fragment>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ActionDropdown;
