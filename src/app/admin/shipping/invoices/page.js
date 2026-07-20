'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Receipt, Search, Loader2, Send, CheckCircle2, Clock, XCircle, Mail, PackageX, ExternalLink, MessageCircle } from 'lucide-react';
import Link from 'next/link';
import StatusBadge from '@/components/admin/shipping/StatusBadge';
import ConfirmModal from '@/components/admin/shipping/ConfirmModal';
import { formatCurrency, getCurrencyForCountry, isOrderIdMatch } from '@/lib/shipping-constants';

export default function InvoicesPage() {
  const searchParams = useSearchParams();
  const initialBatchId = searchParams.get('batch_id');

  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('ALL');
  
  const [actionLoading, setActionLoading] = useState(false);
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, type: null, data: null });

  const fetchInvoices = async () => {
    setLoading(true);
    try {
      let url = '/api/shipping/invoices';
      if (initialBatchId) {
        url += `?batch_id=${initialBatchId}`;
      }
      const res = await fetch(url);
      if (!res.ok) throw new Error('Failed to fetch invoices');
      const data = await res.json();
      setInvoices(data.invoices || []);
    } catch (err) {
      console.error(err);
      alert('Error fetching invoices');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, [initialBatchId]);

  const handleAction = async (invoiceId, action, extraData = {}) => {
    setActionLoading(true);
    try {
      const res = await fetch(`/api/shipping/invoices/${invoiceId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, ...extraData }),
      });
      if (!res.ok) throw new Error(`Failed to ${action}`);
      await fetchInvoices();
    } catch (err) {
      console.error(err);
      alert(err.message);
    } finally {
      setActionLoading(false);
      setConfirmModal({ isOpen: false });
    }
  };

  const handleDeleteInvoice = async (invoiceId) => {
    setActionLoading(true);
    try {
      const res = await fetch(`/api/shipping/invoices/${invoiceId}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to delete invoice');
      await fetchInvoices();
    } catch (err) {
      console.error(err);
      alert(err.message);
    } finally {
      setActionLoading(false);
      setConfirmModal({ isOpen: false });
    }
  };
  const handleSendEmail = async (invoiceId) => {
    setActionLoading(true);
    try {
      const res = await fetch(`/api/shipping/invoices/${invoiceId}/send`, {
        method: 'POST'
      });
      if (!res.ok) throw new Error('Failed to send email');
      const data = await res.json();
      alert(data.message || 'Email sent successfully');
      await fetchInvoices();
    } catch (err) {
      console.error(err);
      alert(err.message);
    } finally {
      setActionLoading(false);
      setConfirmModal({ isOpen: false });
    }
  };

  const filteredInvoices = invoices.filter(inv => {
    // Status filter
    if (filterStatus !== 'ALL') {
      if (filterStatus === 'UNPAID' && inv.payment_status === 'PAID') return false;
      if (filterStatus === 'PAID' && inv.payment_status !== 'PAID') return false;
      if (filterStatus === 'DRAFT' && inv.invoice_status !== 'DRAFT') return false;
    }
    
    // Search filter
    if (!search) return true;
    const s = search.replace(/#/g, '').toLowerCase();
    return (
      inv.invoice_number?.toLowerCase().includes(s) ||
      isOrderIdMatch(inv.order_id, search) ||
      inv.customer_name?.toLowerCase().includes(s) ||
      inv.customer_email?.toLowerCase().includes(s)
    );
  });

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32" style={{ fontFamily: '"DM Sans", sans-serif' }}>
        <Loader2 className="w-8 h-8 animate-spin text-[#0071e3] mb-4" />
        <p className="text-sm font-medium text-[#86868b]">Loading shipping invoices...</p>
      </div>
    );
  }

  const formatWhatsAppNumber = (phone) => {
    if (!phone) return '';
    let cleaned = phone.replace(/[^0-9]/g, '');
    // Fix duplicate 91 (e.g. 9191xxxxxxxxxx -> 14 digits)
    if (cleaned.startsWith('9191') && cleaned.length === 14) {
      return cleaned.substring(2);
    }
    // Fix 91 followed by 0 (e.g. 910xxxxxxxxxx -> 13 digits)
    if (cleaned.startsWith('910') && cleaned.length === 13) {
      return '91' + cleaned.substring(3);
    }
    return cleaned;
  };

  return (
    <div className="space-y-6" style={{ fontFamily: '"DM Sans", sans-serif' }}>
      
      {initialBatchId && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-center justify-between">
          <p className="text-sm text-blue-800">
            Filtering invoices for batch: <strong className="font-bold">{initialBatchId}</strong>
          </p>
          <Link href="/admin/shipping/invoices" className="text-xs text-blue-600 font-bold uppercase tracking-widest hover:underline">
            Clear Filter
          </Link>
        </div>
      )}

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div className="relative max-w-sm w-full">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#86868b]" />
          <input
            type="text"
            placeholder="Search invoice, order, customer..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#d2d2d7] rounded-xl text-sm text-black placeholder-[#86868b] focus:outline-none focus:ring-2 focus:ring-[#0071e3] focus:border-transparent"
          />
        </div>

        <div className="flex bg-[#e5e5ea] p-1 rounded-lg shrink-0 overflow-x-auto w-full sm:w-auto">
          {['ALL', 'DRAFT', 'UNPAID', 'PAID'].map(tab => (
            <button
              key={tab}
              onClick={() => setFilterStatus(tab)}
              className={`px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest rounded-md whitespace-nowrap transition-all ${
                filterStatus === tab 
                  ? 'bg-white text-black shadow-sm' 
                  : 'text-[#86868b] hover:text-black'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      {filteredInvoices.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 bg-white rounded-2xl border border-[#d2d2d7]/50 shadow-sm">
          <PackageX className="w-12 h-12 text-[#d2d2d7] mb-4" />
          <h3 className="text-lg font-semibold text-black mb-1">No Invoices Found</h3>
          <p className="text-sm text-[#86868b]">
            {invoices.length === 0 
              ? 'Invoices will appear here once generated from a shipment batch.'
              : 'No invoices match your current filters.'}
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-[0_2px_10px_rgba(0,0,0,0.04)] overflow-hidden border border-[#d2d2d7]/50">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[1000px]">
              <thead>
                <tr className="border-b border-[#d2d2d7]/50 text-[10px] font-bold uppercase tracking-widest text-[#86868b] bg-[#F5F5F7]/60">
                  <th className="px-5 py-4">Invoice #</th>
                  <th className="px-5 py-4">Customer</th>
                  <th className="px-5 py-4">Batch</th>
                  <th className="px-5 py-4">Linked Order</th>
                  <th className="px-5 py-4">Amount Due</th>
                  <th className="px-5 py-4">Invoice Status</th>
                  <th className="px-5 py-4">Payment</th>
                  <th className="px-5 py-4">Sent At</th>
                  <th className="px-5 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#d2d2d7]/30">
                {filteredInvoices.map(inv => (
                  <tr key={inv.id} className="hover:bg-[#F5F5F7]/50 transition-colors">
                    <td className="px-5 py-4 whitespace-nowrap">
                      <span className="text-xs font-bold text-black">{inv.invoice_number}</span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex flex-col">
                        <span className="text-sm font-semibold text-black">{inv.customer_name}</span>
                        <span className="text-[11px] text-[#86868b]">{inv.customer_email}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap">
                      <div className="text-xs font-bold text-[#86868b] flex items-center gap-1.5">
                        <Link href={`/admin/shipping/batches/${inv.batch_id}`} className="hover:text-[#0071e3] transition-colors" title="View Batch">
                          {inv.batch_name || inv.batch_id.substring(0,8)}
                        </Link>
                      </div>
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap text-sm text-[#86868b]">
                      #{inv.order_id}
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap">
                      <span className="text-sm font-bold text-black">
                        {/* We don't have country directly on invoice, assume INR for display or add it later. In real scenario we'd fetch it or store it. Defaulting to INR format for now as per prompt request */}
                        {formatCurrency(inv.amount_due, 'INR')} 
                      </span>
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap">
                      <StatusBadge status={inv.invoice_status} />
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap">
                      <StatusBadge status={inv.payment_status} />
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap text-xs text-[#86868b]">
                      {inv.sent_at ? new Date(inv.sent_at).toLocaleDateString() : '—'}
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-2">
                        {inv.payment_status !== 'PAID' && inv.invoice_status !== 'CANCELLED' && (
                          <>
                            <button
                              onClick={() => setConfirmModal({ type: 'SEND_EMAIL', isOpen: true, data: inv })}
                              className="w-8 h-8 rounded-full bg-[#F5F5F7] text-[#86868b] flex items-center justify-center hover:bg-blue-50 hover:text-blue-600 transition-colors"
                              title={inv.invoice_status === 'DRAFT' ? "Send Invoice Email" : "Resend Email"}
                            >
                              <Send className="w-3.5 h-3.5" />
                            </button>
                            <a
                              href={`https://wa.me/${formatWhatsAppNumber(inv.customer_phone)}?text=${encodeURIComponent(`Hello ${inv.customer_name},\n\nHere is your shipping invoice ${inv.invoice_number} linked to order #${inv.order_id} at House of Avira.\n\nAmount Due: ${formatCurrency(inv.amount_due, 'INR')}\n\n${inv.payment_link_url ? `Please pay here: ${inv.payment_link_url}` : 'Please complete the payment to proceed with shipping.'}\n\nLet us know if you need any help!`)}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="w-8 h-8 rounded-full bg-[#F5F5F7] text-[#86868b] flex items-center justify-center hover:bg-green-50 hover:text-green-600 transition-colors"
                              title="Send via WhatsApp"
                            >
                              <MessageCircle className="w-3.5 h-3.5" />
                            </a>
                            <button
                              onClick={() => setConfirmModal({ type: 'MARK_PAID', isOpen: true, data: inv })}
                              className="w-8 h-8 rounded-full bg-[#F5F5F7] text-[#86868b] flex items-center justify-center hover:bg-green-50 hover:text-green-600 transition-colors"
                              title="Mark as Paid"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => setConfirmModal({ type: 'CANCEL', isOpen: true, data: inv })}
                              className="w-8 h-8 rounded-full bg-[#F5F5F7] text-[#86868b] flex items-center justify-center hover:bg-red-50 hover:text-red-600 transition-colors"
                              title="Delete Invoice"
                            >
                              <XCircle className="w-3.5 h-3.5" />
                            </button>
                          </>
                        )}
                        {inv.payment_status === 'PAID' && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-green-600 bg-green-50 px-2 py-1 rounded">
                            <CheckCircle2 className="w-3 h-3" /> Paid
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Confirm Modals */}
      <ConfirmModal
        isOpen={confirmModal.isOpen && confirmModal.type === 'SEND_EMAIL'}
        onClose={() => setConfirmModal({ isOpen: false })}
        onConfirm={() => handleSendEmail(confirmModal.data?.id)}
        title="Send Invoice Email"
        message={`This will email the shipping invoice of ${formatCurrency(confirmModal.data?.amount_due)} to ${confirmModal.data?.customer_email}.`}
        confirmText="Send Email"
        loading={actionLoading}
      />

      <ConfirmModal
        isOpen={confirmModal.isOpen && confirmModal.type === 'MARK_PAID'}
        onClose={() => setConfirmModal({ isOpen: false })}
        onConfirm={() => handleAction(confirmModal.data?.id, 'mark_paid')}
        title="Confirm Payment"
        message={`Are you sure you want to mark invoice ${confirmModal.data?.invoice_number} as PAID? This will also update the linked order to SHIPPING_PAID and send a payment confirmation email.`}
        confirmText="Confirm Payment"
        loading={actionLoading}
      />

      <ConfirmModal
        isOpen={confirmModal.isOpen && confirmModal.type === 'CANCEL'}
        onClose={() => setConfirmModal({ isOpen: false })}
        onConfirm={() => handleDeleteInvoice(confirmModal.data?.id)}
        title="Delete Invoice"
        message={`Are you sure you want to delete this invoice? The invoice will be permanently removed, and the linked order will be reset back to the batch ready state.`}
        confirmText="Delete Invoice"
        confirmVariant="destructive"
        loading={actionLoading}
      />

    </div>
  );
}
