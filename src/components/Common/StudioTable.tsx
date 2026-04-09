import { AnimatePresence, motion } from 'framer-motion';
import { LucideIcon, MoreVertical } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';

import { TableColors } from '../../constants/themeColors';

export interface MenuItem {
  label: string;
  icon: LucideIcon;
  onClick: () => void;
  variant?: 'default' | 'danger';
}

export interface Column<T> {
  header: string;
  render: (item: T) => React.ReactNode;
  align?: 'left' | 'center' | 'right';
  width?: string;
  className?: string; // Applied to both header AND cell
  headerClassName?: string; // Applied ONLY to header
  cellClassName?: string; // Applied ONLY to cell
}

interface StudioTableProps<T> {
  data: T[];
  columns: Column<T>[];
  onRowClick?: (item: T) => void;
  colors: TableColors;
  menuItems?: (item: T) => MenuItem[];
  isLoading?: boolean;
}

const TableActionMenu: React.FC<{ items: MenuItem[]; colors: TableColors }> = ({ items, colors }) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const styles = colors;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={menuRef} onClick={(e) => e.stopPropagation()}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-xl transition-all"
      >
        <MoreVertical size={18} />
      </button>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            className="absolute top-full right-0 mt-2 w-48 bg-white border border-gray-100 rounded-2xl shadow-2xl z-[100] py-2 overflow-hidden"
          >
            {items.map((item, idx) => (
              <button 
                key={idx}
                onClick={() => { item.onClick(); setIsOpen(false); }}
                className={`w-full px-4 py-2.5 text-left text-xs font-bold flex items-center gap-3 transition-colors ${
                  item.variant === 'danger' 
                  ? 'text-rose-500 hover:bg-rose-50' 
                  : `text-gray-600 ${styles.menuHover}`
                }`}
              >
                <item.icon size={14} className={item.variant === 'danger' ? '' : 'text-slate-600'} />
                {item.label}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export const StudioTableSkeleton: React.FC<{ columns: number }> = ({ columns }) => (
  <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden animate-pulse">
    <div className="bg-gray-50 border-b border-gray-200 h-14 w-full" />
    <div className="divide-y divide-gray-100">
      {[1, 2, 3, 4, 5].map(i => (
        <div key={i} className="px-8 py-5 flex items-center gap-4">
          <div className="w-10 h-10 bg-gray-100 rounded-xl shrink-0" />
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-gray-100 rounded w-1/4" />
            <div className="h-3 bg-gray-50 rounded w-1/2" />
          </div>
          <div className="w-20 h-4 bg-gray-100 rounded" />
          <div className="w-24 h-4 bg-gray-100 rounded" />
          <div className="w-8 h-8 bg-gray-50 rounded-xl" />
        </div>
      ))}
    </div>
  </div>
);

export function StudioTable<T>({ 
  data, 
  columns, 
  onRowClick, 
  colors, 
  menuItems,
  isLoading 
}: StudioTableProps<T>) {
  if (isLoading) return <StudioTableSkeleton columns={columns.length + (menuItems ? 1 : 0)} />;

  const styles = colors;

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-gray-50 border-b border-gray-200">
            {columns.map((col, idx) => (
              <th 
                key={idx} 
                className={`px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest ${col.align === 'center' ? 'text-center' : (col.align === 'right' ? 'text-right' : '')} ${col.className || ''} ${col.headerClassName || ''}`}
                style={{ width: col.width }}
              >
                {col.header}
              </th>
            ))}
            {menuItems && <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-right">Actions</th>}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {data.map((item, rowIdx) => (
            <tr 
              key={rowIdx} 
              onClick={() => onRowClick?.(item)}
              className={`${styles.hoverBg} cursor-pointer transition-colors group`}
            >
              {columns.map((col, colIdx) => (
                <td 
                  key={colIdx} 
                  className={`px-8 py-5 ${col.align === 'center' ? 'text-center' : (col.align === 'right' ? 'text-right' : '')} ${col.className || ''} ${col.cellClassName || ''}`}
                >
                  {col.render(item)}
                </td>
              ))}
              {menuItems && (
                <td className="px-8 py-5 text-right">
                  <TableActionMenu items={menuItems(item)} colors={colors} />
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default StudioTable;
