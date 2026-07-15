'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { X, Boxes, Package, Inbox } from 'lucide-react';
import StatusBadge from './StatusBadge';

export default function BatchSelectModal({
  isOpen,
  onClose,
  onSelect,
  batches = [],
  loading = false,
}) {
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
            onClick={onClose}
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
            <div className="flex items-center justify-between px-6 pt-6 pb-4">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-50">
                  <Boxes className="w-5 h-5 text-[#0071e3]" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-black tracking-tight">
                    Select Batch
                  </h3>
                  <p className="text-xs text-[#86868b] mt-0.5">
                    Choose an open batch to add the order to
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <X className="w-4 h-4 text-[#86868b]" />
              </button>
            </div>

            {/* Batch List */}
            <div className="px-6 pb-6 max-h-[400px] overflow-y-auto">
              {loading ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <div className="w-8 h-8 border-2 border-gray-200 border-t-black rounded-full animate-spin" />
                  <p className="text-sm text-[#86868b] mt-3">Loading batches...</p>
                </div>
              ) : batches.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="flex items-center justify-center w-16 h-16 rounded-full bg-[#F5F5F7] mb-4">
                    <Inbox className="w-8 h-8 text-[#86868b]" />
                  </div>
                  <h4 className="text-sm font-semibold text-black mb-1">
                    No Open Batches
                  </h4>
                  <p className="text-xs text-[#86868b] max-w-[240px]">
                    Create a new batch first, then you can add orders to it.
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  {batches.map((batch) => (
                    <button
                      key={batch.id}
                      onClick={() => onSelect(batch.id)}
                      className="w-full flex items-center justify-between p-4 bg-[#F5F5F7] rounded-xl border border-transparent hover:border-[#0071e3] hover:bg-blue-50/30 transition-all group text-left"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-white shadow-sm border border-gray-100 shrink-0">
                          <Package className="w-4 h-4 text-[#86868b] group-hover:text-[#0071e3] transition-colors" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-black truncate group-hover:text-[#0071e3] transition-colors">
                            {batch.batch_name || batch.id}
                          </p>
                          <p className="text-[11px] text-[#86868b] mt-0.5">
                            {batch.total_orders_count || 0}{' '}
                            {(batch.total_orders_count || 0) === 1 ? 'order' : 'orders'}
                          </p>
                        </div>
                      </div>
                      <StatusBadge status={batch.status} />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
