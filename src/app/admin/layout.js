'use client';

import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function AdminLayout({ children }) {
  const { user, role, loading } = useAuthStore();
  const router = useRouter();
  const allowedEmails = ['orders.houseofavira@gmail.com', 'order.houseofavira@gmail.com', 'huzaifatabish9145@gmail.com', 'huaifatabish9145@gmail.com'];
  
  useEffect(() => {
    const checkAccess = async () => {
      if (!loading) {
        if (!user) {
          router.replace('/auth/login?redirect=/admin');
        } else if (role !== 'admin_owner' && (!user.email || !allowedEmails.includes(user.email.toLowerCase()))) {
          router.replace('/');
        }
      }
    };
    checkAccess();
  }, [user, role, loading, router]);

  if (loading || !user || (role !== 'admin_owner' && (!user.email || !allowedEmails.includes(user.email.toLowerCase())))) {
    return <div className="p-12 text-center text-neutral-500 uppercase tracking-widest text-sm">Verifying Access...</div>;
  }

  return (
    <div className="flex-1 flex flex-col bg-neutral-100 min-h-screen">
      {children}
    </div>
  );
}
