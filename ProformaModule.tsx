import React from 'react';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

export default function Modal({ isOpen, onClose, title, children, footer }: ModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-[#0d1018]/80 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-4xl bg-[#141824] border border-[#252b3b] sm:rounded-2xl shadow-2xl overflow-hidden flex flex-col h-full sm:h-auto sm:max-h-[90vh]"
          >
            <div className="flex items-center justify-between p-4 sm:p-6 border-b border-[#252b3b] sticky top-0 bg-[#141824] z-10">
              <h3 className="text-lg sm:text-xl font-bold text-[#e2e5f0]">{title}</h3>
              <button
                onClick={onClose}
                className="p-2 hover:bg-[#1a1f2e] rounded-xl transition-colors text-[#4e566b] hover:text-[#e2e5f0]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 sm:p-6 overflow-y-auto flex-1">
              {children}
            </div>
            {footer && (
              <div className="p-4 sm:p-6 border-t border-[#252b3b] bg-[#1a1f2e]/50 flex justify-end gap-3 sticky bottom-0 z-10">
                {footer}
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
