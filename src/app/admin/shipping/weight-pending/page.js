'use client';

import { useState, useEffect } from 'react';
import { Scale, Search, Loader2, Save, CheckCircle2, PackageX, ChevronRight } from 'lucide-react';
import StatusBadge from '@/components/admin/shipping/StatusBadge';
import { formatCurrency, getCurrencyForCountry } from '@/lib/shipping-constants';

export default function WeightPendingPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [weightInputs, setWeightInputs] = useState({});
  const [savingIds, setSavingIds] = useState(new Set());
  const [savedIds, setSavedIds] = useState(new Set());
  const [error, setError] = useState(null);

  const fetchOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/shipping/orders?filter=weight_pending');
      if (!res.ok) throw new Error('Failed to fetch orders');
      const data = await res.json();
      setOrders(data.orders || []);
    } catch (err) {
      console.error('Error fetching weight pending orders:', err);
      setError('Failed to load orders. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleWeightChange = (orderId, value) => {
    setWeightInputs(prev => ({ ...prev, [orderId]: value }));
  };

  const handleSaveWeight = async (orderId) => {
    const weight = parseFloat(weightInputs[orderId]);
    if (!weight || weight <= 0) {
      alert('Please enter a valid weight greater than 0.');
      return;
    }

    setSavingIds(prev => new Set(prev).add(orderId));
    try {
      const res = await fetch(`/api/shipping/orders/${orderId}/weight`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ estimated_order_weight: weight }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Failed to save weight');
      }

      setSavedIds(prev => new Set(prev).add(orderId));
      
      // Remove from list after a brief success animation
      setTimeout(() => {
        setOrders(prev => prev.filter(o => o.id !== orderId));
        setSavedIds(prev => {
          const next = new Set(prev);
          next.delete(orderId);
          return next;
        });
      }, 1200);
    } catch (err) {
      console.error('Error saving weight:', err);
      alert(err.message || 'Failed to save weight.');
    } finally {
      setSavingIds(prev => {
        const next = new Set(prev);
        next.delete(orderId);
        return next;
      });
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

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32" style={{ fontFamily: '"DM Sans", sans-serif' }}>
        <Loader2 className="w-8 h-8 animate-spin text-[#0071e3] mb-4" />
        <p className="text-sm font-medium text-[#86868b]">Loading weight pending orders...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6" style={{ fontFamily: '"DM Sans", sans-serif' }}>
      {/* Stats Card */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-white p-5 rounded-2xl shadow-[0_2px_10px_rgba(0,0,0,0.04)] border border-[#d2d2d7]/50 flex items-center gap-4">
          <div className="w-11 h-11 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <Scale className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] text-[#86868b] font-bold uppercase tracking-widest mb-0.5">Weight Pending</p>
            <h3 className="text-2xl font-bold text-black">{orders.length}</h3>
          </div>
        </div>
      </div>

      {/* Search */}
      {orders.length > 0 && (
        <div className="relative max-w-sm">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#86868b]" />
          <input
            type="text"
            placeholder="Search by order ID, customer, country..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#d2d2d7] rounded-xl text-sm text-black placeholder-[#86868b] focus:outline-none focus:ring-2 focus:ring-[#0071e3] focus:border-transparent transition-shadow"
          />
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-700">{error}</div>
      )}

      {/* Orders Table */}
      {filteredOrders.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 bg-white rounded-2xl border border-[#d2d2d7]/50 shadow-sm">
          <PackageX className="w-12 h-12 text-[#d2d2d7] mb-4" />
          <h3 className="text-lg font-semibold text-black mb-1">
            {orders.length === 0 ? 'No Weight Pending Orders' : 'No Matching Orders'}
          </h3>
          <p className="text-sm text-[#86868b]">
            {orders.length === 0
              ? 'All confirmed orders already have weights entered.'
              : 'Try a different search term.'}
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-[0_2px_10px_rgba(0,0,0,0.04)] overflow-hidden border border-[#d2d2d7]/50">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[900px]">
              <thead>
                <tr className="border-b border-[#d2d2d7]/50 text-[10px] font-bold uppercase tracking-widest text-[#86868b] bg-[#F5F5F7]/60">
                  <th className="px-5 py-4">Order ID</th>
                  <th className="px-5 py-4">Customer</th>
                  <th className="px-5 py-4">Country</th>
                  <th className="px-5 py-4">Items</th>
                  <th className="px-5 py-4">Product Total</th>
                  <th className="px-5 py-4">Payment</th>
                  <th className="px-5 py-4">Est. Weight (kg)</th>
                  <th className="px-5 py-4">Order Date</th>
                  <th className="px-5 py-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#d2d2d7]/30">
                {filteredOrders.map(order => {
                  const currency = getCurrencyForCountry(order.customer_country);
                  const isSaving = savingIds.has(order.id);
                  const isSaved = savedIds.has(order.id);

                  return (
                    <tr
                      key={order.id}
                      className={`transition-all duration-300 ${
                        isSaved
                          ? 'bg-green-50/80 opacity-60 scale-[0.99]'
                          : 'hover:bg-[#F5F5F7]/50'
                      }`}
                    >
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
                          {order.items_count || order.items?.length || 0}
                        </span>
                      </td>
                      <td className="px-5 py-4 whitespace-nowrap text-sm font-semibold text-black">
                        {formatCurrency(order.payable_amount || order.product_total, currency.code)}
                      </td>
                      <td className="px-5 py-4 whitespace-nowrap">
                        <StatusBadge status={order.product_payment_status} />
                      </td>
                      <td className="px-5 py-4 whitespace-nowrap">
                        {isSaved ? (
                          <div className="flex items-center gap-1.5 text-green-600 text-sm font-bold animate-in zoom-in duration-300">
                            <CheckCircle2 className="w-4 h-4" />
                            Saved!
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <input
                              type="number"
                              step="0.01"
                              min="0.01"
                              placeholder="0.00"
                              value={weightInputs[order.id] || ''}
                              onChange={e => handleWeightChange(order.id, e.target.value)}
                              className="w-24 px-3 py-1.5 border border-[#d2d2d7] rounded-lg text-sm text-black placeholder-[#d2d2d7] focus:outline-none focus:ring-2 focus:ring-[#0071e3] focus:border-transparent text-center font-semibold"
                              disabled={isSaving}
                            />
                            <span className="text-[11px] text-[#86868b] font-medium">kg</span>
                          </div>
                        )}
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
                      <td className="px-5 py-4 whitespace-nowrap text-right">
                        {!isSaved && (
                          <button
                            onClick={() => handleSaveWeight(order.id)}
                            disabled={isSaving || !weightInputs[order.id]}
                            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-black text-white text-[10px] font-bold uppercase tracking-widest rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                          >
                            {isSaving ? (
                              <Loader2 className="w-3 h-3 animate-spin" />
                            ) : (
                              <Save className="w-3 h-3" />
                            )}
                            {isSaving ? 'Saving...' : 'Save'}
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
