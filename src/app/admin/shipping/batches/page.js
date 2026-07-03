'use client';

import { useState, useEffect } from 'react';
import { Boxes, Search, Loader2, PackageX, Calendar, Users, Scale, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import StatusBadge from '@/components/admin/shipping/StatusBadge';
import { formatCurrency } from '@/lib/shipping-constants';

export default function BatchesPage() {
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchBatches();
  }, []);

  const fetchBatches = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/shipping/batches');
      if (!res.ok) throw new Error('Failed to fetch batches');
      const data = await res.json();
      setBatches(data.batches || []);
    } catch (err) {
      console.error('Error fetching batches:', err);
      setError('Failed to load shipment batches.');
    } finally {
      setLoading(false);
    }
  };

  const filteredBatches = batches.filter(batch => {
    if (!search) return true;
    const s = search.toLowerCase();
    return (
      batch.id?.toLowerCase().includes(s) ||
      batch.batch_name?.toLowerCase().includes(s)
    );
  });

  const getStatusOrder = (status) => {
    const order = {
      'OPEN': 1,
      'WAITING_FINAL_COST': 2,
      'COST_ALLOCATED': 3,
      'INVOICES_GENERATED': 4,
      'CLOSED': 5,
    };
    return order[status] || 99;
  };

  // Sort batches: Active first, then by date desc
  const sortedBatches = [...filteredBatches].sort((a, b) => {
    const statusDiff = getStatusOrder(a.status) - getStatusOrder(b.status);
    if (statusDiff !== 0) return statusDiff;
    
    const dateA = new Date(a.created_at || 0).getTime();
    const dateB = new Date(b.created_at || 0).getTime();
    return dateB - dateA;
  });

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32" style={{ fontFamily: '"DM Sans", sans-serif' }}>
        <Loader2 className="w-8 h-8 animate-spin text-[#0071e3] mb-4" />
        <p className="text-sm font-medium text-[#86868b]">Loading shipment batches...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6" style={{ fontFamily: '"DM Sans", sans-serif' }}>
      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl shadow-[0_2px_10px_rgba(0,0,0,0.04)] border border-[#d2d2d7]/50 flex items-center gap-4">
          <div className="w-11 h-11 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <Boxes className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] text-[#86868b] font-bold uppercase tracking-widest mb-0.5">Total Batches</p>
            <h3 className="text-2xl font-bold text-black">{batches.length}</h3>
          </div>
        </div>
        
        <div className="bg-white p-5 rounded-2xl shadow-[0_2px_10px_rgba(0,0,0,0.04)] border border-[#d2d2d7]/50 flex items-center gap-4">
          <div>
            <p className="text-[10px] text-[#86868b] font-bold uppercase tracking-widest mb-0.5">Active Batches</p>
            <h3 className="text-2xl font-bold text-blue-600">
              {batches.filter(b => b.status !== 'CLOSED').length}
            </h3>
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 justify-between items-start sm:items-center">
        {batches.length > 0 && (
          <div className="relative max-w-sm w-full">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#86868b]" />
            <input
              type="text"
              placeholder="Search batches..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#d2d2d7] rounded-xl text-sm text-black placeholder-[#86868b] focus:outline-none focus:ring-2 focus:ring-[#0071e3] focus:border-transparent"
            />
          </div>
        )}
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-700">{error}</div>
      )}

      {/* Grid */}
      {sortedBatches.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 bg-white rounded-2xl border border-[#d2d2d7]/50 shadow-sm">
          <PackageX className="w-12 h-12 text-[#d2d2d7] mb-4" />
          <h3 className="text-lg font-semibold text-black mb-1">
            {batches.length === 0 ? 'No Shipment Batches Yet' : 'No Matching Batches'}
          </h3>
          <p className="text-sm text-[#86868b]">
            {batches.length === 0 
              ? 'Create a batch from the "Ready for Batch" tab.' 
              : 'Try a different search term.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedBatches.map(batch => (
            <Link 
              key={batch.id} 
              href={`/admin/shipping/batches/${batch.id}`}
              className="group block bg-white rounded-2xl p-6 shadow-[0_2px_10px_rgba(0,0,0,0.04)] border border-[#d2d2d7]/50 hover:border-[#0071e3]/40 hover:shadow-md transition-all duration-300"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-bold text-black mb-1 group-hover:text-[#0071e3] transition-colors">
                    {batch.batch_name}
                  </h3>
                  <div className="flex items-center gap-1.5 text-xs text-[#86868b]">
                    <Calendar className="w-3.5 h-3.5" />
                    {new Date(batch.created_at).toLocaleDateString('en-IN', {
                      day: 'numeric', month: 'short', year: 'numeric'
                    })}
                  </div>
                </div>
                <StatusBadge status={batch.status} />
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between items-center py-2 border-b border-[#d2d2d7]/30">
                  <span className="flex items-center gap-2 text-sm text-[#86868b]">
                    <Boxes className="w-4 h-4" /> Orders
                  </span>
                  <span className="text-sm font-bold text-black">{batch.total_orders_count || 0}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-[#d2d2d7]/30">
                  <span className="flex items-center gap-2 text-sm text-[#86868b]">
                    <Users className="w-4 h-4" /> Customers
                  </span>
                  <span className="text-sm font-bold text-black">{batch.total_customers_count || 0}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-[#d2d2d7]/30">
                  <span className="flex items-center gap-2 text-sm text-[#86868b]">
                    <Scale className="w-4 h-4" /> Est. Total Weight
                  </span>
                  <span className="text-sm font-bold text-black">{(batch.estimated_total_weight || 0).toFixed(2)} kg</span>
                </div>
              </div>

              {batch.final_total_shipment_cost && (
                <div className="bg-[#F5F5F7]/80 rounded-xl p-3 mb-4 flex justify-between items-center border border-[#d2d2d7]/30">
                  <span className="text-xs font-bold uppercase tracking-widest text-[#86868b]">Final Cost</span>
                  <span className="text-sm font-bold text-black">{formatCurrency(batch.final_total_shipment_cost)}</span>
                </div>
              )}

              <div className="flex items-center justify-between mt-auto">
                <span className="text-xs text-[#86868b] line-clamp-1">{batch.notes || 'No notes'}</span>
                <div className="w-8 h-8 rounded-full bg-[#F5F5F7] flex items-center justify-center group-hover:bg-[#0071e3] group-hover:text-white transition-colors">
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
