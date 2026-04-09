import { X } from 'lucide-react';
import React from 'react';
import { createPortal } from 'react-dom';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  maxWidth?: string;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, maxWidth = "max-w-md" }) => {
  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm animate-in fade-in duration-200 selection:bg-transparent">
      <div className={`bg-white rounded-2xl shadow-2xl w-full ${maxWidth} overflow-hidden animate-in zoom-in-95 duration-200`}>
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
          <h3 className="font-bold text-gray-800">{title}</h3>
          <button onClick={onClose} className="p-1 hover:bg-gray-200 rounded-lg text-gray-500 transition-colors">
            <X size={18} />
          </button>
        </div>
        <div className="p-6 custom-scrollbar max-h-[85vh] overflow-y-auto">
          {children}
        </div>
      </div>
    </div>,
    document.body
  );
};

export default Modal;
