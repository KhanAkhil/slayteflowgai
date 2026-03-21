import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AlertTriangle, X } from 'lucide-react';

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: 'danger' | 'warning' | 'info';
}

export default function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  type = 'danger'
}: ConfirmModalProps) {
  const colors = {
    danger: 'bg-[#ef4444] hover:bg-[#dc2626] shadow-[#ef4444]/20',
    warning: 'bg-[#f59e0b] hover:bg-[#d97706] shadow-[#f59e0b]/20',
    info: 'bg-[#6c63ff] hover:bg-[#5a52e0] shadow-[#6c63ff]/20'
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            className="relative w-full max-w-md bg-[#1a1f2e] border border-[#252b3b] rounded-2xl shadow-2xl overflow-hidden"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-xl ${type === 'danger' ? 'bg-[#ef4444]/10 text-[#ef4444]' : type === 'warning' ? 'bg-[#f59e0b]/10 text-[#f59e0b]' : 'bg-[#6c63ff]/10 text-[#6c63ff]'}`}>
                  <AlertTriangle className="w-6 h-6" />
                </div>
                <button onClick={onClose} className="p-2 hover:bg-[#252b3b] rounded-lg text-[#4e566b] transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <h3 className="text-xl font-bold text-[#e2e5f0] mb-2">{title}</h3>
              <p className="text-[#8892ab] text-sm leading-relaxed mb-8">
                {message}
              </p>

              <div className="flex gap-3">
                <button
                  onClick={onClose}
                  className="flex-1 px-6 py-3 rounded-xl text-sm font-bold text-[#8892ab] hover:bg-[#252b3b] transition-colors"
                >
                  {cancelText}
                </button>
                <button
                  onClick={() => {
                    onConfirm();
                    onClose();
                  }}
                  className={`flex-1 ${colors[type]} text-white font-bold py-3 px-6 rounded-xl text-sm shadow-lg transition-all`}
                >
                  {confirmText}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
