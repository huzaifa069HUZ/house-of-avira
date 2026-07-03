'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { Loader2, AlertTriangle, X } from 'lucide-react';

export default function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title = 'Confirm Action',
  message = 'Are you sure you want to proceed?',
  confirmText = 'Confirm',
  confirmVariant = 'default',
  loading = false,
}) {
  const isDestructive = confirmVariant === 'destructive';

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
        >
          {/* Overlay */}
          <motion.div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={!loading ? onClose : undefined}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Modal Card */}
          <motion.div
            className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 pt-6 pb-2">
              <div className="flex items-center gap-3">
                {isDestructive && (
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-red-50">
                    <AlertTriangle className="w-5 h-5 text-red-600" />
                  </div>
                )}
                <h3 className="text-lg font-semibold text-black tracking-tight">
                  {title}
                </h3>
              </div>
              <button
                onClick={onClose}
                disabled={loading}
                className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50"
              >
                <X className="w-4 h-4 text-[#86868b]" />
              </button>
            </div>

            {/* Body */}
            <div className="px-6 py-4">
              <p className="text-sm text-[#86868b] leading-relaxed">{message}</p>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-3 px-6 pb-6 pt-2">
              <button
                onClick={onClose}
                disabled={loading}
                className="px-5 py-2.5 text-sm font-medium text-[#86868b] border border-gray-200 rounded-lg hover:bg-gray-50 hover:text-black transition-all disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={onConfirm}
                disabled={loading}
                className={`px-5 py-2.5 text-sm font-medium text-white rounded-lg transition-all disabled:opacity-70 flex items-center gap-2 ${
                  isDestructive
                    ? 'bg-red-600 hover:bg-red-700'
                    : 'bg-black hover:bg-black/90'
                }`}
              >
                {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                {confirmText}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
