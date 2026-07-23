'use client';

import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Heart, Edit2, Package, ChevronRight } from 'lucide-react';
import AddressManager from '@/components/profile/AddressManager';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { getStatusColor, ORDER_STATUS_LABELS, formatCurrency } from '@/lib/shipping-constants';
import Script from 'next/script';

export default function AccountPage() {
  const { user, role, loading, signOut, updateUser } = useAuthStore();

  const router = useRouter();

  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState('');

  const [editPhone, setEditPhone] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login');
    } else if (user && !isEditing) {
      setEditName(user.name || user.displayName || '');
      
      const phoneRaw = user.phone || user.phoneNumber || '';
      const parts = phoneRaw.trim().split(' ');
      if (parts.length > 1 && parts[0].startsWith('+')) {
        setEditPhone(parts.slice(1).join(' '));
      } else {
        setEditPhone(phoneRaw);
      }
    }
  }, [user, loading, router, isEditing]);

  useEffect(() => {
    async function fetchOrders() {
      if (!user || !user.email) return;
      try {
        setLoadingOrders(true);
        const res = await fetch(`/api/orders/user?email=${encodeURIComponent(user.email)}`);
        const data = await res.json();
        
        if (data.success) {
          setOrders(data.orders);
        } else {
          console.error("Error from orders API:", data.error);
        }
      } catch (err) {
        console.error("Failed to fetch orders:", err);
      } finally {
        setLoadingOrders(false);
      }
    }

    if (user) {
      fetchOrders();
    }
  }, [user]);

  if (loading || !user) {
    return <div className="p-12 text-center text-[#000000]/60 uppercase tracking-widest text-sm font-dm-sans">Loading...</div>;
  }

  const handleLogout = async () => {
    await signOut();
    router.push('/');
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await updateUser({ name: editName, phone: `+91 ${editPhone}`.trim() });
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to update profile", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleRetryPayment = async (orderId) => {
    try {
      const res = await fetch('/api/orders/retry-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId }),
      });
      const data = await res.json();
      
      if (!data.success) {
        alert(data.message || 'Failed to initialize payment.');
        return;
      }
      
      const { db_order_id, order_id, amount, currency, customer_info } = data;
      
      if (typeof window.Razorpay === 'undefined') {
        alert('Razorpay script not loaded. Please wait a moment and try again.');
        return;
      }

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: amount.toString(),
        currency: currency,
        name: 'House of Avira',
        description: 'Order Payment',
        order_id: order_id,
        handler: async function (response) {
          try {
            const verifyRes = await fetch('/api/verify-payment', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature,
                db_order_id: db_order_id,
              }),
            });
            const verifyData = await verifyRes.json();
            if (verifyData.success) {
              window.location.reload();
            } else {
              alert('Payment verification failed: ' + verifyData.message);
            }
          } catch (e) {
            console.error(e);
            alert('Verification error.');
          }
        },
        prefill: {
          name: customer_info?.name || user?.name || '',
          email: customer_info?.email || user?.email || '',
          contact: customer_info?.phone || user?.phone || '',
        },
        theme: { color: '#000000' }
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.on('payment.failed', function (response) {
        alert(response.error.description);
      });
      paymentObject.open();
    } catch (e) {
      console.error(e);
      alert('Failed to retry payment');
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 pb-6 border-b border-black/10">
        <div>
          <h1 className="text-4xl md:text-5xl font-perandory tracking-tight text-[#000000] mb-2">My Account</h1>
          <p className="text-lg font-gambetta italic font-normal text-[#000000]/60">Manage your profile and orders</p>
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
            <div className="flex justify-between items-center mb-8 border-b border-black/5 pb-4">
              <h2 className="text-3xl lg:text-4xl font-perandory tracking-tight text-[#000000]">Personal Details</h2>
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
                <label className="block text-[9px] font-sans font-bold tracking-[0.25em] uppercase text-[#000000]/40 mb-1.5">Name</label>
                {isEditing ? (
                  <input 
                    type="text" 
                    value={editName} 
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full border-b border-black/20 pb-2 outline-none focus:border-black text-sm font-dm-sans transition-colors bg-transparent"
                    placeholder="Enter your name"
                  />
                ) : (
                  <p className="text-lg font-dm-sans text-[#000000]">{user.name || user.displayName || 'No name set'}</p>
                )}
              </div>
              
              <div>
                <label className="block text-[9px] font-sans font-bold tracking-[0.25em] uppercase text-[#000000]/40 mb-1.5">Email</label>
                <p className="text-lg font-dm-sans text-[#000000] opacity-80">{user.email}</p>
              </div>

              <div>
                <label className="block text-[9px] font-sans font-bold tracking-[0.25em] uppercase text-[#000000]/40 mb-1.5">Phone Number</label>
                {isEditing ? (
                  <div className="flex">
                    <span className="block w-[80px] px-3 py-2 border-b border-black/20 text-sm font-dm-sans bg-transparent text-center text-black/70">+91</span>
                    <input 
                      type="tel" 
                      value={editPhone} 
                      onChange={(e) => setEditPhone(e.target.value)}
                      className="w-full border-b border-black/20 pb-2 pl-3 outline-none focus:border-black text-sm font-dm-sans transition-colors bg-transparent"
                      placeholder="1234567890"
                    />
                  </div>
                ) : (
                  <p className="text-lg font-dm-sans text-[#000000]">{user.phone || user.phoneNumber || <span className="font-gambetta italic text-base text-black/40">No phone added</span>}</p>
                )}
              </div>
            </div>

            <div className="mt-10 flex flex-col gap-2.5">
              <Link href="/wishlist" className="flex items-center justify-between border border-black/10 px-5 py-3 hover:border-black hover:bg-black/5 transition-colors group">
                <div className="flex items-center gap-2">
                  <span className="font-aston-script text-xl text-white bg-black px-3 py-1 rounded-sm lowercase leading-none">my</span>
                  <span className="font-perandory text-lg tracking-widest uppercase text-black">Wishlist</span>
                </div>
                <Heart className="w-4 h-4 text-black group-hover:fill-black/10 transition-colors" />
              </Link>

              {role === 'admin_owner' && (
                <Link href="/admin" className="mt-4 flex items-center justify-center font-perandory text-sm text-white bg-black px-5 py-3.5 uppercase tracking-widest hover:bg-black/80 transition-colors">
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
            <div className="flex justify-between items-center mb-8 border-b border-black/5 pb-4">
              <h2 className="text-3xl lg:text-4xl font-perandory tracking-tight text-[#000000]">Recent Orders</h2>
            </div>
            
            {loadingOrders ? (
              <div className="py-12 text-center text-[#000000]/60 uppercase tracking-widest text-xs font-dm-sans">
                Loading orders...
              </div>
            ) : orders.length === 0 ? (
              <div className="bg-[#FAFAFA] border border-black/5 p-16 text-center flex flex-col items-center justify-center">
                <p className="text-lg font-gambetta italic text-[#000000]/60 mb-6">No orders placed yet</p>
                <Link href="/catalogue" className="text-[11px] font-dm-sans uppercase tracking-widest font-bold border-b-2 border-black pb-1 hover:text-black/60 hover:border-black/60 transition-colors">
                  Continue Shopping
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map(order => {
                  const colors = getStatusColor(order.order_status);
                  return (
                    <div key={order.id} className="border border-black/10 p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:border-black/30 transition-colors bg-white">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <span className="font-dm-sans font-bold text-black uppercase tracking-wider text-xs">Order #{order.id.slice(-6)}</span>
                          <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-widest border ${colors.bg} ${colors.text} ${colors.border}`}>
                            {ORDER_STATUS_LABELS[order.order_status] || order.order_status}
                          </span>
                        </div>
                        <p className="font-dm-sans text-xs text-[#86868b]">
                          {new Date(order.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })} • {order.items_count} items
                        </p>
                      </div>
                      <div className="flex items-center justify-between w-full md:w-auto gap-6 border-t border-black/5 pt-4 md:border-0 md:pt-0">
                        <div className="text-right">
                          <p className="text-[10px] font-bold uppercase tracking-widest text-[#000000]/40 mb-1">Product Total</p>
                          <p className="font-dm-sans font-bold text-lg text-black">
                            {formatCurrency(order.payable_amount, 'INR')}
                          </p>
                          {order.product_payment_status === 'PENDING' && (
                            <button
                              onClick={() => handleRetryPayment(order.id)}
                              className="mt-2 inline-block text-[9px] font-bold uppercase tracking-widest bg-[#8A001A] text-white px-3 py-1 hover:bg-[#8A001A]/80 transition-colors"
                            >
                              Retry Payment
                            </button>
                          )}
                        </div>
                        {(order.order_status === 'SHIPPING_INVOICED' || order.order_status === 'SHIPPING_PAID') && order.shipping_amount_due && (
                          <div className="text-right border-l border-black/10 pl-6">
                            <p className="text-[10px] font-bold uppercase tracking-widest text-[#000000]/40 mb-1">Shipping</p>
                            <p className="font-dm-sans font-bold text-lg text-black mb-1">
                              {formatCurrency(order.shipping_paid_amount || order.shipping_amount_due, 'INR')}
                            </p>
                            {order.order_status === 'SHIPPING_INVOICED' && order.shipping_payment_link && (
                              <a 
                                href={order.shipping_payment_link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-block text-[9px] font-bold uppercase tracking-widest bg-black text-white px-3 py-1 hover:bg-black/80 transition-colors"
                              >
                                Pay Now
                              </a>
                            )}
                            {order.order_status === 'SHIPPING_PAID' && (
                              <span className="inline-block text-[9px] font-bold uppercase tracking-widest text-green-600 bg-green-50 px-2 py-0.5 border border-green-200">
                                Paid
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
