'use client';

import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, query, getDocs, orderBy, limit } from 'firebase/firestore';
import { formatCurrency } from '@/lib/shipping-constants';
import { Loader2 } from 'lucide-react';
import StatusBadge from './shipping/StatusBadge';

export default function OrderManager() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAllOrders() {
      try {
        setLoading(true);
        const ordersRef = collection(db, 'orders');
        // Fetch latest 100 orders for admin dashboard
        const q = query(ordersRef, orderBy('created_at', 'desc'), limit(100));
        const snapshot = await getDocs(q);
        
        const fetchedOrders = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        setOrders(fetchedOrders);
      } catch (err) {
        console.error("Failed to fetch admin orders:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchAllOrders();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 bg-white rounded-2xl border border-[#d2d2d7]/50 shadow-sm">
        <Loader2 className="w-8 h-8 animate-spin text-[#0071e3] mb-4" />
        <p className="text-[#86868b] font-dm-sans text-sm tracking-wide">Loading orders...</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-[#d2d2d7]/50 shadow-sm overflow-hidden font-dm-sans">
      <div className="p-6 border-b border-[#d2d2d7]/50 bg-[#FAFAFA] flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold text-black tracking-tight">Recent Orders</h2>
          <p className="text-sm text-[#86868b] mt-1">View all store orders.</p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-[#d2d2d7]/50 bg-white">
              <th className="py-4 px-6 text-xs font-bold text-[#86868b] uppercase tracking-wider">Order ID & Date</th>
              <th className="py-4 px-6 text-xs font-bold text-[#86868b] uppercase tracking-wider">Customer</th>
              <th className="py-4 px-6 text-xs font-bold text-[#86868b] uppercase tracking-wider">Amount</th>
              <th className="py-4 px-6 text-xs font-bold text-[#86868b] uppercase tracking-wider">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#d2d2d7]/30">
            {orders.length === 0 ? (
              <tr>
                <td colSpan="4" className="py-12 text-center text-[#86868b] text-sm">
                  No orders found.
                </td>
              </tr>
            ) : (
              orders.map((order) => (
                <tr key={order.id} className="hover:bg-[#F5F5F7]/50 transition-colors">
                  <td className="py-4 px-6">
                    <div className="font-semibold text-black text-sm mb-1 uppercase tracking-wider">#{order.id.slice(-6)}</div>
                    <div className="text-xs text-[#86868b]">
                      {new Date(order.created_at).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="font-medium text-black text-sm">{order.customer_name}</div>
                    <div className="text-xs text-[#86868b]">{order.customer_email}</div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="font-semibold text-black text-sm">
                      {formatCurrency(order.payable_amount, order.customer_country === 'USA' ? 'USD' : 'INR')}
                    </div>
                    <div className="text-xs text-[#86868b]">{order.items_count} items</div>
                  </td>
                  <td className="py-4 px-6">
                    <StatusBadge status={order.order_status} />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
