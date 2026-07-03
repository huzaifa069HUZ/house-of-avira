'use client';

import { useState, useEffect } from 'react';
import { PackageCheck, Search, Loader2, Plus, FolderPlus, PackageX } from 'lucide-react';
import StatusBadge from '@/components/admin/shipping/StatusBadge';
import BatchCreateModal from '@/components/admin/shipping/BatchCreateModal';
import BatchSelectModal from '@/components/admin/shipping/BatchSelectModal';
import { formatCurrency, getCurrencyForCountry } from '@/lib/shipping-constants';

export default function ReadyForBatchPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showSelectModal, setShowSelectModal] = useState(false);
  const [batches, setBatches] = useState([]);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/shipping/orders?filter=ready_for_batch');
      if (!res.ok) throw new Error('Failed to fetch orders');
      const data = await res.json();
      setOrders(data.orders || []);
    } catch (err) {
      console.error('Error fetching ready orders:', err);
      setError('Failed to load orders.');
    } finally {
      setLoading(false);
    }
  };

  const fetchBatches = async () => {
    try {
      const res = await fetch('/api/shipping/batches');
      if (!res.ok) return;
      const data = await res.json();
      setBatches((data.batches || []).filter(b => b.status === 'OPEN' || b.status === 'WAITING_FINAL_COST'));
    } catch (err) {
      console.error('Error fetching batches:', err);
    }
  };

  useEffect(() => {
    fetchOrders();
    fetchBatches();
  }, []);

  const toggleSelect = (id) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleAll = () => {
    if (selectedIds.size === filteredOrders.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredOrders.map(o => o.id)));
    }
  };

  const handleCreateBatch = async ({ batch_name, notes }) => {
    setActionLoading(true);
    try {
      // Create batch
      const createRes = await fetch('/api/shipping/batches', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ batch_name, notes }),
      });
      if (!createRes.ok) throw new Error('Failed to create batch');
      const { batch } = await createRes.json();

      // Add selected orders
      const addRes = await fetch(`/api/shipping/batches/${batch.id}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ order_ids: Array.from(selectedIds) }),
      });
      if (!addRes.ok) throw new Error('Failed to add orders to batch');

      setShowCreateModal(false);
      setSelectedIds(new Set());
      fetchOrders();
      fetchBatches();
    } catch (err) {
      console.error('Error:', err);
      alert(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleSelectBatch = async (batchId) => {
    setActionLoading(true);
    try {
      const res = await fetch(`/api/shipping/batches/${batchId}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ order_ids: Array.from(selectedIds) }),
      });
      if (!res.ok) throw new Error('Failed to add orders to batch');

      setShowSelectModal(false);
      setSelectedIds(new Set());
      fetchOrders();
      fetchBatches();
    } catch (err) {
      console.error('Error:', err);
      alert(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const filteredOrders = orders.filter(order => {
    if (!search) return true;
    const s = search.toLowerCase();
    return (
      order.id?.toLowerCase().includes(s) ||
      order.customer_name?.toLowerCase().includes(s) ||
      order.customer_email?.toLowerCase().includes(s) ||
      order.customer_country?.toLowerCase().includes(s)
    );
  });

  const totalSelectedWeight = Array.from(selectedIds).reduce((sum, id) => {
    const order = orders.find(o => o.id === id);
    return sum + (order?.estimated_order_weight || 0);
  }, 0);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32" style={{ fontFamily: '"DM Sans", sans-serif' }}>
        <Loader2 className="w-8 h-8 animate-spin text-[#0071e3] mb-4" />
        <p className="text-sm font-medium text-[#86868b]">Loading ready orders...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6" style={{ fontFamily: '"DM Sans", sans-serif' }}>
      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl shadow-[0_2px_10px_rgba(0,0,0,0.04)] border border-[#d2d2d7]/50 flex items-center gap-4">
          <div className="w-11 h-11 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <PackageCheck className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] text-[#86868b] font-bold uppercase tracking-widest mb-0.5">Ready for Batch</p>
            <h3 className="text-2xl font-bold text-black">{orders.length}</h3>
          </div>
        </div>

        {selectedIds.size > 0 && (
          <>
            <div className="bg-white p-5 rounded-2xl shadow-[0_2px_10px_rgba(0,0,0,0.04)] border border-[#0071e3]/30 flex items-center gap-4">
              <div className="w-11 h-11 rounded-full bg-[#0071e3]/10 text-[#0071e3] flex items-center justify-center shrink-0">
                <PackageCheck className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[10px] text-[#86868b] font-bold uppercase tracking-widest mb-0.5">Selected</p>
                <h3 className="text-2xl font-bold text-[#0071e3]">{selectedIds.size}</h3>
              </div>
            </div>
            <div className="bg-white p-5 rounded-2xl shadow-[0_2px_10px_rgba(0,0,0,0.04)] border border-[#d2d2d7]/50 flex items-center gap-4">
              <div>
                <p className="text-[10px] text-[#86868b] font-bold uppercase tracking-widest mb-0.5">Selected Total Weight</p>
                <h3 className="text-2xl font-bold text-black">{totalSelectedWeight.toFixed(2)} kg</h3>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 justify-between items-start sm:items-center">
        {orders.length > 0 && (
          <div className="relative max-w-sm w-full">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#86868b]" />
            <input
              type="text"
              placeholder="Search orders..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#d2d2d7] rounded-xl text-sm text-black placeholder-[#86868b] focus:outline-none focus:ring-2 focus:ring-[#0071e3] focus:border-transparent"
            />
          </div>
        )}

        {selectedIds.size > 0 && (
          <div className="flex gap-2 shrink-0">
            <button
              onClick={() => setShowCreateModal(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-black text-white text-[11px] font-bold uppercase tracking-widest rounded-xl hover:bg-gray-800 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              Create New Batch
            </button>
            {batches.length > 0 && (
              <button
                onClick={() => setShowSelectModal(true)}
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-white text-black border border-[#d2d2d7] text-[11px] font-bold uppercase tracking-widest rounded-xl hover:bg-[#F5F5F7] transition-colors"
              >
                <FolderPlus className="w-3.5 h-3.5" />
                Add to Existing Batch
              </button>
            )}
          </div>
        )}
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-700">{error}</div>
      )}

      {/* Table */}
      {filteredOrders.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 bg-white rounded-2xl border border-[#d2d2d7]/50 shadow-sm">
          <PackageX className="w-12 h-12 text-[#d2d2d7] mb-4" />
          <h3 className="text-lg font-semibold text-black mb-1">No Orders Ready for Batch</h3>
          <p className="text-sm text-[#86868b]">Orders will appear here after their estimated weight is entered.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-[0_2px_10px_rgba(0,0,0,0.04)] overflow-hidden border border-[#d2d2d7]/50">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[900px]">
              <thead>
                <tr className="border-b border-[#d2d2d7]/50 text-[10px] font-bold uppercase tracking-widest text-[#86868b] bg-[#F5F5F7]/60">
                  <th className="px-5 py-4 w-12">
                    <input
                      type="checkbox"
                      checked={selectedIds.size === filteredOrders.length && filteredOrders.length > 0}
                      onChange={toggleAll}
                      className="w-4 h-4 accent-black rounded"
                    />
                  </th>
                  <th className="px-5 py-4">Order ID</th>
                  <th className="px-5 py-4">Customer</th>
                  <th className="px-5 py-4">Country</th>
                  <th className="px-5 py-4">Items</th>
                  <th className="px-5 py-4">Product Total</th>
                  <th className="px-5 py-4">Est. Weight</th>
                  <th className="px-5 py-4">Order Date</th>
                  <th className="px-5 py-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#d2d2d7]/30">
                {filteredOrders.map(order => {
                  const currency = getCurrencyForCountry(order.customer_country);
                  return (
                    <tr
                      key={order.id}
                      className={`transition-colors cursor-pointer ${
                        selectedIds.has(order.id) ? 'bg-[#0071e3]/5' : 'hover:bg-[#F5F5F7]/50'
                      }`}
                      onClick={() => toggleSelect(order.id)}
                    >
                      <td className="px-5 py-4" onClick={e => e.stopPropagation()}>
                        <input
                          type="checkbox"
                          checked={selectedIds.has(order.id)}
                          onChange={() => toggleSelect(order.id)}
                          className="w-4 h-4 accent-black rounded"
                        />
                      </td>
                      <td className="px-5 py-4 whitespace-nowrap">
                        <span className="text-xs font-bold text-black">{order.id?.substring(0, 8)}...</span>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex flex-col">
                          <span className="text-sm font-semibold text-black">{order.customer_name}</span>
                          <span className="text-[11px] text-[#86868b]">{order.customer_email}</span>
                        </div>
                      </td>
                      <td className="px-5 py-4 whitespace-nowrap text-sm text-[#86868b]">
                        {order.customer_country || 'N/A'}
                      </td>
                      <td className="px-5 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-[#F5F5F7] text-xs font-bold text-black">
                          {order.items_count || 0}
                        </span>
                      </td>
                      <td className="px-5 py-4 whitespace-nowrap text-sm font-semibold text-black">
                        {formatCurrency(order.payable_amount || order.product_total, currency.code)}
                      </td>
                      <td className="px-5 py-4 whitespace-nowrap">
                        <span className="text-sm font-bold text-black">{order.estimated_order_weight?.toFixed(2)} kg</span>
                      </td>
                      <td className="px-5 py-4 whitespace-nowrap text-xs text-[#86868b]">
                        {order.created_at
                          ? new Date(order.created_at).toLocaleDateString('en-IN', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                            })
                          : 'N/A'}
                      </td>
                      <td className="px-5 py-4 whitespace-nowrap">
                        <StatusBadge status={order.order_status} />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modals */}
      <BatchCreateModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSubmit={handleCreateBatch}
        loading={actionLoading}
      />
      <BatchSelectModal
        isOpen={showSelectModal}
        onClose={() => setShowSelectModal(false)}
        onSelect={handleSelectBatch}
        batches={batches}
        loading={actionLoading}
      />
    </div>
  );
}
