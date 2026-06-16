'use client';

import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Heart, Globe, Edit2 } from 'lucide-react';
import { useCurrencyStore } from '@/store/currencyStore';
import AddressManager from '@/components/profile/AddressManager';

export default function AccountPage() {
  const { user, role, loading, signOut, updateUser } = useAuthStore();
  const { currency, setRegionModalOpen } = useCurrencyStore();
  const router = useRouter();

  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login');
    } else if (user && !isEditing) {
      setEditName(user.name || user.displayName || '');
      setEditPhone(user.phoneNumber || '');
    }
  }, [user, loading, router, isEditing]);

  if (loading || !user) {
    return <div className="p-12 text-center text-[#000000]/60 uppercase tracking-widest text-sm">Loading...</div>;
  }

  const handleLogout = async () => {
    await signOut();
    router.push('/');
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await updateUser({ name: editName, phoneNumber: editPhone });
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to update profile", error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 pb-6 border-b border-black/10">
        <div>
          <h1 className="text-4xl md:text-5xl font-cormorant-garamond tracking-tight text-[#000000] mb-2">My Account</h1>
          <p className="text-xs tracking-widest text-[#000000]/50 uppercase">Manage your profile and orders</p>
        </div>
        <button 
          onClick={handleLogout}
          className="mt-6 md:mt-0 px-8 py-2.5 border border-[#8A001A] text-[#8A001A] text-[10px] sm:text-xs font-bold tracking-[0.2em] uppercase hover:bg-[#8A001A] hover:text-white transition-colors shadow-sm"
        >
          Sign Out
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="col-span-1 lg:col-span-4 space-y-12">
          {/* Profile Section */}
          <div className="bg-white">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-perandory tracking-tight text-[#000000] uppercase">Personal Details</h2>
              {!isEditing ? (
                <button onClick={() => setIsEditing(true)} className="text-[10px] uppercase tracking-widest text-[#000000]/50 hover:text-[#000000] flex items-center gap-1.5 transition-colors font-bold">
                  <Edit2 className="w-3 h-3" /> Edit
                </button>
              ) : (
                <div className="flex gap-4">
                  <button onClick={() => setIsEditing(false)} disabled={isSaving} className="text-[10px] font-bold uppercase tracking-widest text-[#000000]/50 hover:text-[#000000] transition-colors">
                    Cancel
                  </button>
                  <button onClick={handleSave} disabled={isSaving} className="text-[10px] uppercase tracking-widest text-black font-bold hover:opacity-70 transition-opacity">
                    {isSaving ? 'Saving...' : 'Save'}
                  </button>
                </div>
              )}
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-[9px] font-bold tracking-[0.25em] uppercase text-[#000000]/40 mb-1.5">Name</label>
                {isEditing ? (
                  <input 
                    type="text" 
                    value={editName} 
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full border-b border-black/20 pb-2 outline-none focus:border-black text-sm transition-colors bg-transparent"
                    placeholder="Enter your name"
                  />
                ) : (
                  <p className="text-sm text-[#000000] font-medium">{user.name || user.displayName || 'No name set'}</p>
                )}
              </div>
              
              <div>
                <label className="block text-[9px] font-bold tracking-[0.25em] uppercase text-[#000000]/40 mb-1.5">Email</label>
                <p className="text-sm text-[#000000] opacity-80 font-medium">{user.email}</p>
              </div>

              <div>
                <label className="block text-[9px] font-bold tracking-[0.25em] uppercase text-[#000000]/40 mb-1.5">Phone Number</label>
                {isEditing ? (
                  <input 
                    type="tel" 
                    value={editPhone} 
                    onChange={(e) => setEditPhone(e.target.value)}
                    className="w-full border-b border-black/20 pb-2 outline-none focus:border-black text-sm transition-colors bg-transparent"
                    placeholder="+1 (234) 567-8900"
                  />
                ) : (
                  <p className="text-sm text-[#000000] font-medium">{user.phoneNumber || <span className="text-black/30 italic font-normal">No phone added</span>}</p>
                )}
              </div>
            </div>

            <div className="mt-10 flex flex-col gap-2.5">
              <Link href="/wishlist" className="flex items-center justify-between text-[11px] font-bold text-[#000000] border border-black/10 px-5 py-3.5 uppercase tracking-widest hover:border-black hover:bg-black/5 transition-colors">
                <span>My Wishlist</span>
                <Heart className="w-4 h-4" />
              </Link>
              <button onClick={() => setRegionModalOpen(true)} className="group flex items-center justify-between text-[11px] font-bold text-[#000000] border border-black/10 px-5 py-3.5 uppercase tracking-widest hover:border-black hover:bg-black/5 transition-colors">
                <div className="flex items-center gap-3">
                  <span>Region / Currency</span>
                  <span className="bg-black/5 px-2 py-0.5 text-[9px] rounded-sm">{currency}</span>
                </div>
                <Globe className="w-4 h-4" />
              </button>
              {role === 'admin_owner' && (
                <Link href="/admin" className="mt-4 flex items-center justify-center text-[11px] font-bold text-white bg-black px-5 py-3.5 uppercase tracking-widest hover:bg-black/80 transition-colors">
                  Admin Dashboard
                </Link>
              )}
            </div>
          </div>
        </div>
        
        <div className="col-span-1 lg:col-span-8 space-y-12 pl-0 lg:pl-12 lg:border-l border-black/10">
          <div>
            <AddressManager />
          </div>

          <div>
            <h2 className="text-2xl font-cormorant-garamond tracking-tight text-[#000000] mb-6">Recent Orders</h2>
            <div className="bg-[#FAFAFA] border border-black/5 p-16 text-center flex flex-col items-center justify-center">
              <p className="text-[10px] tracking-[0.2em] text-[#000000]/40 uppercase font-bold mb-6">No orders placed yet</p>
              <Link href="/catalogue" className="text-[11px] uppercase tracking-widest font-bold border-b-2 border-black pb-1 hover:text-black/60 hover:border-black/60 transition-colors">
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
