import React from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="glass-panel w-full max-w-md overflow-hidden animate-slide-up rounded-[32px] border border-white/10 shadow-2xl">
        <div className="flex items-center justify-between px-8 py-6 border-b border-white/5 bg-slate-900/50">
          <h3 className="text-xl font-bold text-white tracking-tight">{title}</h3>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-all active:scale-90"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="px-8 py-8 bg-slate-950/50">
          {children}
        </div>
      </div>
    </div>
  );
};
