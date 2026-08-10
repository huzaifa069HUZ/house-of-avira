'use client';

import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import ShippingSubNav from '@/components/admin/shipping/ShippingSubNav';
import { Ship } from 'lucide-react';

export default function ShippingLayout({ children }) {
  const { user, role, loading } = useAuthStore();
  const router = useRouter();
  const allowedEmails = ['orders.houseofavira@gmail.com', 'order.houseofavira@gmail.com', 'huzaifatabish9145@gmail.com', 'huaifatabish9145@gmail.com'];
  
  useEffect(() => {
    const checkAccess = async () => {
      if (!loading) {
        if (!user) {
          router.replace('/auth/login?redirect=/admin/shipping');
        } else if (role !== 'admin_owner' && !allowedEmails.includes(user.email.toLowerCase())) {
          router.replace('/');
        }
      }
    };
    checkAccess();
  }, [user, role, loading, router]);

  if (loading || !user || (role !== 'admin_owner' && !allowedEmails.includes(user.email.toLowerCase()))) {
    return <div className="p-12 text-center text-neutral-500 uppercase tracking-widest text-sm">Verifying Access...</div>;
  }

  return (
    <div className="min-h-screen bg-[#F5F5F7]" style={{ fontFamily: '"DM Sans", sans-serif' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Header */}
        <div className="border-b border-[#d2d2d7] pb-6 mb-6">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4">
            <div>
              <h1 className="text-3xl font-semibold tracking-tight text-black flex items-center gap-3">
                <Ship className="w-8 h-8 text-[#0071e3]" />
                Shipment Management
              </h1>
              <p className="text-sm text-[#86868b] mt-2 tracking-wide">Manage order weights, shipment batches, and shipping invoices.</p>
            </div>
            <a 
              href="/admin" 
              className="text-[11px] font-bold uppercase tracking-widest text-[#86868b] hover:text-black transition-colors"
            >
              ← Back to Control Panel
            </a>
          </div>
        </div>

        {/* Sub Navigation */}
        <ShippingSubNav />

        {/* Page Content */}
        <div className="mt-6">
          {children}
        </div>
      </div>
    </div>
  );
}
