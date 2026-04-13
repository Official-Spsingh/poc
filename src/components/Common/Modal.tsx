import { X } from 'lucide-react';
import React from 'react';
import { createPortal } from 'react-dom';
import { useModuleTheme } from '../../contexts/ModuleThemeContext';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  maxWidth?: string;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, maxWidth = "max-w-md" }) => {
  const moduleTheme = useModuleTheme();
  const resolvedTheme = moduleTheme ?? document.documentElement.getAttribute('data-theme') ?? undefined;

  if (!isOpen) return null;

  return createPortal(
    <div data-theme={resolvedTheme} className="fixed inset-0 z-[20000] flex items-center justify-center p-4 bg-[#010714]/60 backdrop-blur-sm animate-in fade-in duration-200 selection:bg-transparent">
      <div className={`bg-mod-surface-card rounded-2xl shadow-mod-modal border border-mod-surface-border w-full ${maxWidth} overflow-hidden animate-in zoom-in-95 duration-200`}>
        <div className="px-6 py-4 border-b border-mod-surface-border flex items-center justify-between bg-mod-surface-skeleton/50">
          <h3 className="font-bold text-mod-surface-text-primary">{title}</h3>
          <button onClick={onClose} className="p-1 hover:bg-mod-surface-hover rounded-lg text-mod-surface-text-muted transition-colors">
            <X size={18} />
          </button>
        </div>
        <div className="p-6 scrollbar-custom max-h-[85vh] overflow-y-auto bg-mod-surface-card">
          {children}
        </div>
      </div>
    </div>,
    document.body
  );
};

export default Modal;
