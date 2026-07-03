'use client';

import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Loader2, X, Boxes } from 'lucide-react';
import { generateBatchName } from '@/lib/shipping-constants';

export default function BatchCreateModal({
  isOpen,
  onClose,
  onSubmit,
  loading = false,
}) {
  const [batchName, setBatchName] = useState('');
  const [notes, setNotes] = useState('');

  // Generate a fresh batch name each time the modal opens
  useEffect(() => {
    if (isOpen) {
      setBatchName(generateBatchName());
      setNotes('');
    }
  }, [isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!batchName.trim()) return;
    onSubmit({
      batch_name: batchName.trim(),
      notes: notes.trim(),
    });
  };

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
            className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 pt-6 pb-2">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-50">
                  <Boxes className="w-5 h-5 text-[#0071e3]" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-black tracking-tight">
                    Create New Batch
                  </h3>
                  <p className="text-xs text-[#86868b] mt-0.5">
                    Group orders together for shipment
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                disabled={loading}
                className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50"
              >
                <X className="w-4 h-4 text-[#86868b]" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="px-6 py-5 space-y-5">
              {/* Batch Name */}
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-[#86868b] mb-2">
                  Batch Name
                </label>
                <input
                  type="text"
                  value={batchName}
                  onChange={(e) => setBatchName(e.target.value)}
                  required
                  placeholder="BATCH-2026-JUL-001"
                  className="w-full px-4 py-3 text-sm text-black bg-[#F5F5F7] border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0071e3]/30 focus:border-[#0071e3] transition-all placeholder:text-gray-400"
                  style={{ fontFamily: "'DM Sans', sans-serif" }}
                />
              </div>

              {/* Notes */}
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-[#86868b] mb-2">
                  Notes
                  <span className="ml-1 font-normal normal-case tracking-normal text-gray-400">
                    (optional)
                  </span>
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                  placeholder="Add any notes about this batch..."
                  className="w-full px-4 py-3 text-sm text-black bg-[#F5F5F7] border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0071e3]/30 focus:border-[#0071e3] transition-all resize-none placeholder:text-gray-400"
                  style={{ fontFamily: "'DM Sans', sans-serif" }}
                />
              </div>

              {/* Footer */}
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={loading}
                  className="px-5 py-2.5 text-sm font-medium text-[#86868b] border border-gray-200 rounded-lg hover:bg-gray-50 hover:text-black transition-all disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading || !batchName.trim()}
                  className="px-5 py-2.5 text-sm font-medium text-white bg-black rounded-lg hover:bg-black/90 transition-all disabled:opacity-70 flex items-center gap-2"
                >
                  {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                  Create Batch
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
