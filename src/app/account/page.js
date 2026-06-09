'use client';

import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';
import { Heart } from 'lucide-react';

export default function AccountPage() {
  const { user, role, loading, signOut } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login');
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return <div className="p-12 text-center text-[#000000]/60 uppercase tracking-widest text-sm">Loading...</div>;
  }

  const handleLogout = async () => {
    await signOut();
    router.push('/');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="border-b border-[#000000]/10 pb-4 mb-8 flex justify-between items-end">
        <h1 className="text-3xl font-serif tracking-tight text-[#000000]">My Account</h1>
        <button 
          onClick={handleLogout}
          className="text-xs font-medium tracking-widest uppercase text-[#000000]/60 hover:text-[#000000] transition-colors"
        >
          Sign Out
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="col-span-1 space-y-6">
          <div className="bg-[#E5E0DA]/30 p-6 rounded-md border border-[#000000]/10">
            <h2 className="text-sm font-bold tracking-widest uppercase mb-4 text-[#000000]">Profile</h2>
            <p className="text-sm text-[#000000]/80 mb-1">{user.name || 'No name set'}</p>
            <p className="text-sm text-[#000000]/60 mb-4">{user.email}</p>
            <div className="flex flex-col gap-3">
              <Link href="/wishlist" className="flex items-center justify-between text-xs font-bold text-[#000000] border border-[#000000]/20 px-4 py-2.5 uppercase tracking-widest hover:bg-[#000000] hover:text-[#FFFFFF] transition-colors">
                <span>My Wishlist</span>
                <Heart className="w-4 h-4" />
              </Link>
              {role === 'admin_owner' && (
                <Link href="/admin" className="text-xs font-bold text-[#FFFFFF] bg-[#000000] px-4 py-2.5 uppercase tracking-widest hover:bg-[#000000]/90 transition-colors text-center border border-[#000000]">
                  Admin Dashboard
                </Link>
              )}
            </div>
          </div>
        </div>
        
        <div className="col-span-2">
          <h2 className="text-sm font-bold tracking-widest uppercase mb-6 text-[#000000]">Recent Orders</h2>
          <div className="bg-[#E5E0DA]/30 border border-[#000000]/10 rounded-md p-12 text-center text-[#000000]/50 text-sm">
            You haven't placed any orders yet.
          </div>
        </div>
      </div>
    </div>
  );
}
