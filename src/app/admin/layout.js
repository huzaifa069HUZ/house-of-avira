'use client';

import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function AdminLayout({ children }) {
  const { user, role, loading } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push('/auth/login');
      } else if (role !== 'admin_owner' && !['Orders.houseofavira@gmail.com', 'huzaifatabish9145@gmail.com'].includes(user.email)) {
        // Strict check: role must be admin_owner or email must match precisely
        router.push('/');
      }
    }
  }, [user, role, loading, router]);

  if (loading || !user || (role !== 'admin_owner' && !['Orders.houseofavira@gmail.com', 'huzaifatabish9145@gmail.com'].includes(user.email))) {
    return <div className="p-12 text-center text-neutral-500 uppercase tracking-widest text-sm">Verifying Access...</div>;
  }

  return (
    <div className="flex-1 flex flex-col bg-neutral-100 min-h-screen">
      {children}
    </div>
  );
}
