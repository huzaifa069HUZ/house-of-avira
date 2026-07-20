'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { 
  ArrowLeft, Boxes, Scale, Calculator, Receipt, 
  Trash2, Loader2, CheckCircle2, User, Globe
} from 'lucide-react';
import Link from 'next/link';
import StatusBadge from '@/components/admin/shipping/StatusBadge';
import ConfirmModal from '@/components/admin/shipping/ConfirmModal';
import { formatCurrency, getCurrencyForCountry } from '@/lib/shipping-constants';

export default function BatchDetailPage({ params }) {
  const unwrappedParams = use(params);
  const batchId = unwrappedParams.batchId;
  const router = useRouter();

  const [batch, setBatch] = useState(null);
  const [orders, setOrders] = useState([]);
  const [allocations, setAllocations] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [finalCostInput, setFinalCostInput] = useState('');
  const [actualWeightInput, setActualWeightInput] = useState('');
  
  const [actionLoading, setActionLoading] = useState(false);
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, type: null, data: null });

  const fetchBatchData = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/shipping/batches/${batchId}`);
      if (!res.ok) {
        if (res.status === 404) {
          router.push('/admin/shipping/batches');
          return;
        }
        throw new Error('Failed to fetch batch details');
      }
      const data = await res.json();
      setBatch(data.batch);
      setOrders(data.orders || []);
      setAllocations(data.allocations || []);
      
      if (data.batch.final_total_shipment_cost) {
        setFinalCostInput(data.batch.final_total_shipment_cost.toString());
      }
      if (data.batch.actual_total_shipment_weight) {
        setActualWeightInput(data.batch.actual_total_shipment_weight.toString());
      }
    } catch (err) {
      console.error(err);
      alert('Error loading batch data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBatchData();
  }, [batchId]);

  const handleUpdateBatch = async () => {
    const cost = parseFloat(finalCostInput);
    if (isNaN(cost) || cost <= 0) {
      alert('Please enter a valid final shipment cost.');
      return;
    }
    const actualWt = parseFloat(actualWeightInput) || null;

    setActionLoading(true);
    try {
      const res = await fetch(`/api/shipping/batches/${batchId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          final_total_shipment_cost: cost,
          actual_total_shipment_weight: actualWt 
        }),
      });
      if (!res.ok) throw new Error('Failed to update batch');
      await fetchBatchData();
    } catch (err) {
      console.error(err);
      alert('Error updating batch.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleAllocate = async () => {
    setActionLoading(true);
    try {
      const res = await fetch(`/api/shipping/batches/${batchId}/allocate`, {
        method: 'POST'
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to allocate costs');
      }
      await fetchBatchData();
    } catch (err) {
      console.error(err);
      alert(err.message);
    } finally {
      setActionLoading(false);
      setConfirmModal({ isOpen: false });
    }
  };

  const handleGenerateInvoices = async () => {
    setActionLoading(true);
    try {
      const res = await fetch(`/api/shipping/batches/${batchId}/generate-invoices`, {
        method: 'POST'
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to generate invoices');
      }
      await fetchBatchData();
      router.push('/admin/shipping/invoices');
    } catch (err) {
      console.error(err);
      alert(err.message);
    } finally {
      setActionLoading(false);
      setConfirmModal({ isOpen: false });
    }
  };

  const handleRemoveOrder = async (orderId) => {
    setActionLoading(true);
    try {
      const res = await fetch(`/api/shipping/batches/${batchId}/orders`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ order_id: orderId }),
      });
      if (!res.ok) throw new Error('Failed to remove order');
      await fetchBatchData();
    } catch (err) {
      console.error(err);
      alert(err.message);
    } finally {
      setActionLoading(false);
      setConfirmModal({ isOpen: false });
    }
  };

  const handleDeleteBatch = async () => {
    setActionLoading(true);
    try {
      const res = await fetch(`/api/shipping/batches/${batchId}`, {
        method: 'DELETE'
      });
      if (!res.ok) throw new Error('Failed to delete batch');
      router.push('/admin/shipping/batches');
    } catch (err) {
      console.error(err);
      alert(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32" style={{ fontFamily: '"DM Sans", sans-serif' }}>
        <Loader2 className="w-8 h-8 animate-spin text-[#0071e3] mb-4" />
        <p className="text-sm font-medium text-[#86868b]">Loading batch details...</p>
      </div>
    );
  }

  if (!batch) return null;

  const isCostAllocated = ['COST_ALLOCATED', 'INVOICES_GENERATED', 'CLOSED'].includes(batch.status);
  const isInvoicesGenerated = ['INVOICES_GENERATED', 'CLOSED'].includes(batch.status);
  const canRemoveOrders = ['OPEN', 'WAITING_FINAL_COST'].includes(batch.status);

  return (
    <div className="space-y-6" style={{ fontFamily: '"DM Sans", sans-serif' }}>
      {/* Header */}
      <div className="flex items-center gap-4 mb-2">
        <Link 
          href="/admin/shipping/batches"
          className="w-8 h-8 rounded-full bg-white border border-[#d2d2d7] flex items-center justify-center hover:bg-[#F5F5F7] transition-colors"
        >
          <ArrowLeft className="w-4 h-4 text-[#86868b]" />
        </Link>
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-bold text-black">{batch.batch_name}</h2>
            <StatusBadge status={batch.status} />
          </div>
          <p className="text-xs text-[#86868b] mt-1">
            Created on {new Date(batch.created_at).toLocaleDateString()}
          </p>
        </div>
        <div className="ml-auto">
          {batch.status === 'OPEN' && (
            <button
              onClick={() => setConfirmModal({ type: 'DELETE_BATCH', isOpen: true })}
              className="inline-flex items-center gap-2 px-3 py-2 border border-red-200 text-red-600 bg-red-50 text-[11px] font-bold uppercase tracking-widest rounded-lg hover:bg-red-100 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Delete Batch
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Orders */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl shadow-[0_2px_10px_rgba(0,0,0,0.04)] border border-[#d2d2d7]/50 overflow-hidden">
            <div className="px-6 py-5 border-b border-[#d2d2d7]/50 flex justify-between items-center bg-[#F5F5F7]/30">
              <h3 className="text-sm font-bold uppercase tracking-widest text-black flex items-center gap-2">
                <Boxes className="w-4 h-4 text-[#86868b]" /> Orders in Batch ({orders.length})
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[600px]">
                <thead>
                  <tr className="border-b border-[#d2d2d7]/50 text-[10px] font-bold uppercase tracking-widest text-[#86868b] bg-[#F5F5F7]/60">
                    <th className="px-5 py-3">Order ID</th>
                    <th className="px-5 py-3">Customer</th>
                    <th className="px-5 py-3">Est. Weight</th>
                    {isCostAllocated && <th className="px-5 py-3">Allocated Cost</th>}
                    {canRemoveOrders && <th className="px-5 py-3 text-right">Action</th>}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#d2d2d7]/30">
                  {orders.map(order => {
                    const allocation = allocations.find(a => a.order_id === order.id);
                    return (
                      <tr key={order.id} className="hover:bg-[#F5F5F7]/50 transition-colors">
                        <td className="px-5 py-4 whitespace-nowrap">
                        <span className="text-sm font-bold text-black">#{order.id}</span>
                      </td>
                        <td className="px-5 py-3">
                          <div className="flex flex-col">
                            <span className="text-sm font-semibold text-black">{order.customer_name}</span>
                            <span className="text-[11px] text-[#86868b] flex items-center gap-1">
                              <Globe className="w-3 h-3" /> {order.customer_country || 'N/A'}
                            </span>
                          </div>
                        </td>
                        <td className="px-5 py-3">
                          <span className="text-sm font-medium text-black">
                            {order.estimated_order_weight?.toFixed(2)} kg
                            {allocation && (
                              <span className="ml-2 text-[10px] bg-[#F5F5F7] px-1.5 py-0.5 rounded text-[#86868b] font-bold">
                                {(allocation.weight_share_percent * 100).toFixed(1)}%
                              </span>
                            )}
                          </span>
                        </td>
                        {isCostAllocated && (
                          <td className="px-5 py-3">
                            {allocation ? (
                              <span className="text-sm font-bold text-black">
                                {formatCurrency(allocation.rounded_shipping_amount, getCurrencyForCountry(order.customer_country).code)}
                              </span>
                            ) : (
                              <span className="text-sm text-[#86868b]">—</span>
                            )}
                          </td>
                        )}
                        {canRemoveOrders && (
                          <td className="px-5 py-3 text-right">
                            <button
                              onClick={() => setConfirmModal({ type: 'REMOVE_ORDER', isOpen: true, data: order })}
                              className="p-1.5 text-[#86868b] hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Remove from batch"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        )}
                      </tr>
                    );
                  })}
                  {orders.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-5 py-8 text-center text-sm text-[#86868b]">
                        No orders in this batch.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Column: Calculations */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl shadow-[0_2px_10px_rgba(0,0,0,0.04)] border border-[#d2d2d7]/50 overflow-hidden">
            <div className="px-6 py-5 border-b border-[#d2d2d7]/50 bg-[#F5F5F7]/30">
              <h3 className="text-sm font-bold uppercase tracking-widest text-black flex items-center gap-2">
                <Calculator className="w-4 h-4 text-[#0071e3]" /> Batch Cost Allocation
              </h3>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-[#F5F5F7] rounded-xl border border-[#d2d2d7]/50">
                  <span className="text-xs font-bold uppercase tracking-widest text-[#86868b] flex items-center gap-1.5">
                    <Scale className="w-4 h-4" /> Est. Total Weight
                  </span>
                  <span className="text-lg font-bold text-black">
                    {(batch.estimated_total_weight || 0).toFixed(2)} kg
                  </span>
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-[#86868b] mb-1.5">
                    Final Shipment Cost (INR) *
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      step="0.01"
                      min="1"
                      value={finalCostInput}
                      onChange={e => setFinalCostInput(e.target.value)}
                      disabled={isInvoicesGenerated}
                      className="flex-1 px-4 py-2 bg-white border border-[#d2d2d7] rounded-xl text-sm font-semibold text-black placeholder-[#d2d2d7] focus:outline-none focus:ring-2 focus:ring-[#0071e3] disabled:bg-[#F5F5F7] disabled:text-[#86868b]"
                      placeholder="e.g. 15000"
                    />
                    {!isInvoicesGenerated && (
                      <button
                        onClick={handleUpdateBatch}
                        disabled={actionLoading || !finalCostInput}
                        className="px-4 py-2 bg-[#F5F5F7] text-black text-[11px] font-bold uppercase tracking-widest rounded-xl hover:bg-[#e5e5ea] transition-colors border border-[#d2d2d7] disabled:opacity-50"
                      >
                        Save
                      </button>
                    )}
                  </div>
                  <p className="text-[10px] text-[#86868b] mt-1.5">This is the total cost charged by your shipping partner.</p>
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-[#86868b] mb-1.5">
                    Actual Weight (kg) - Optional
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={actualWeightInput}
                    onChange={e => setActualWeightInput(e.target.value)}
                    disabled={isInvoicesGenerated}
                    className="w-full px-4 py-2 bg-white border border-[#d2d2d7] rounded-xl text-sm text-black placeholder-[#d2d2d7] focus:outline-none focus:ring-2 focus:ring-[#0071e3] disabled:bg-[#F5F5F7]"
                    placeholder="e.g. 25.5"
                  />
                </div>
              </div>

              <hr className="border-[#d2d2d7]/50" />

              {!isCostAllocated && (
                <button
                  onClick={() => setConfirmModal({ type: 'ALLOCATE', isOpen: true })}
                  disabled={!batch.final_total_shipment_cost || actionLoading || orders.length === 0}
                  className="w-full flex items-center justify-center gap-2 py-3.5 bg-black text-white text-[11px] font-bold uppercase tracking-widest rounded-xl hover:bg-gray-800 transition-colors disabled:bg-[#d2d2d7] disabled:cursor-not-allowed"
                >
                  Calculate Cost Allocation
                </button>
              )}

              {isCostAllocated && !isInvoicesGenerated && (
                <div className="space-y-3">
                  <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <p className="text-xs text-emerald-800">
                      Costs have been allocated successfully. Review the amounts in the table before generating invoices.
                    </p>
                  </div>
                  
                  <div className="flex gap-2">
                    <button
                      onClick={() => setConfirmModal({ type: 'ALLOCATE', isOpen: true })}
                      disabled={actionLoading}
                      className="flex-1 py-3 bg-white border border-[#d2d2d7] text-black text-[10px] font-bold uppercase tracking-widest rounded-xl hover:bg-[#F5F5F7] transition-colors disabled:opacity-50"
                    >
                      Recalculate
                    </button>
                    <button
                      onClick={() => setConfirmModal({ type: 'GENERATE_INVOICES', isOpen: true })}
                      disabled={actionLoading}
                      className="flex-[2] flex items-center justify-center gap-2 py-3 bg-[#0071e3] text-white text-[11px] font-bold uppercase tracking-widest rounded-xl hover:bg-[#0071e3]/90 transition-colors disabled:opacity-50"
                    >
                      <Receipt className="w-3.5 h-3.5" /> Generate Invoices
                    </button>
                  </div>
                </div>
              )}

              {isInvoicesGenerated && (
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl text-center">
                  <Receipt className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                  <h4 className="text-sm font-bold text-blue-900 mb-1">Invoices Generated</h4>
                  <p className="text-xs text-blue-700 mb-3">
                    Shipping invoices have been created for all orders in this batch.
                  </p>
                  <Link 
                    href={`/admin/shipping/invoices?batch_id=${batchId}`}
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 text-white text-[10px] font-bold uppercase tracking-widest rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    View Invoices <ArrowLeft className="w-3 h-3 rotate-180" />
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Confirm Modals */}
      <ConfirmModal
        isOpen={confirmModal.isOpen && confirmModal.type === 'DELETE_BATCH'}
        onClose={() => setConfirmModal({ isOpen: false })}
        onConfirm={handleDeleteBatch}
        title="Delete Batch"
        message="Are you sure you want to delete this batch? All associated orders will be released back to 'Ready for Batch' status."
        confirmText="Delete Batch"
        confirmVariant="destructive"
        loading={actionLoading}
      />

      <ConfirmModal
        isOpen={confirmModal.isOpen && confirmModal.type === 'REMOVE_ORDER'}
        onClose={() => setConfirmModal({ isOpen: false })}
        onConfirm={() => handleRemoveOrder(confirmModal.data?.id)}
        title="Remove Order from Batch"
        message={`Are you sure you want to remove order #${confirmModal.data?.id} from this batch?`}
        confirmText="Remove Order"
        confirmVariant="destructive"
        loading={actionLoading}
      />

      <ConfirmModal
        isOpen={confirmModal.isOpen && confirmModal.type === 'ALLOCATE'}
        onClose={() => setConfirmModal({ isOpen: false })}
        onConfirm={handleAllocate}
        title={isCostAllocated ? "Recalculate Costs" : "Calculate Allocation"}
        message={`This will distribute the final shipping cost of ${formatCurrency(batch.final_total_shipment_cost)} proportionally across all ${orders.length} orders based on their estimated weight. Proceed?`}
        confirmText="Calculate"
        loading={actionLoading}
      />

      <ConfirmModal
        isOpen={confirmModal.isOpen && confirmModal.type === 'GENERATE_INVOICES'}
        onClose={() => setConfirmModal({ isOpen: false })}
        onConfirm={handleGenerateInvoices}
        title="Generate Invoices"
        message={`Are you sure? This will create DRAFT shipping invoices for all ${orders.length} orders. This action locks the batch and cannot be undone.`}
        confirmText="Generate Invoices"
        loading={actionLoading}
      />

    </div>
  );
}
