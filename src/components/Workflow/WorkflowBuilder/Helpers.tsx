import { Plus, Trash2 } from 'lucide-react';
import React from 'react';

export const FormLabel: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1 mb-1.5 block">
    {children}
  </label>
);

export const PayloadTable: React.FC<{
  items: { key: string; value: string }[];
  onUpdate: (newItems: { key: string; value: string }[]) => void;
  placeholderKey?: string;
  placeholderValue?: string;
}> = ({ items, onUpdate, placeholderKey = "Key", placeholderValue = "Value" }) => {
  const addItem = () => onUpdate([...items, { key: '', value: '' }]);
  const removeItem = (idx: number) => onUpdate(items.filter((_, i) => i !== idx));
  const updateItem = (idx: number, updates: Partial<{ key: string; value: string }>) => {
    onUpdate(items.map((item, i) => i === idx ? { ...item, ...updates } : item));
  };

  return (
    <div className="space-y-2">
      {items.map((item, idx) => (
        <div key={idx} className="flex gap-2 group/row">
          <input
            type="text"
            placeholder={placeholderKey}
            value={item.key}
            onChange={(e) => updateItem(idx, { key: e.target.value })}
            className="flex-1 px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs outline-none focus:border-blue-400 transition-colors"
          />
          <input
            type="text"
            placeholder={placeholderValue}
            value={item.value}
            onChange={(e) => updateItem(idx, { value: e.target.value })}
            className="flex-1 px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs outline-none focus:border-blue-400 transition-colors"
          />
          <button
            onClick={() => removeItem(idx)}
            className="p-1.5 text-gray-300 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors group-hover/row:text-gray-400"
          >
            <Trash2 size={14} />
          </button>
        </div>
      ))}
      <button
        onClick={addItem}
        className="flex items-center gap-1.5 text-[10px] font-bold text-blue-700 hover:text-blue-800 p-1.5 hover:bg-slate-50 rounded-lg transition-all"
      >
        <Plus size={12} /> Add Property
      </button>
    </div>
  );
};
