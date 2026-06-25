'use client';

import { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { BarChart3, ShoppingBag, Users, User, Phone, Mail, Loader2, CheckCircle2 } from 'lucide-react';

export default function CartAnalytics() {
  const [allUsers, setAllUsers] = useState([]);
  const [abandonedCarts, setAbandonedCarts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('carts'); // 'carts' or 'users'
  const [sendingIds, setSendingIds] = useState(new Set());
  const [sentIds, setSentIds] = useState(new Set());

  const handleSendReminder = async (cart) => {
    setSendingIds(prev => new Set(prev).add(cart.id));
    
    try {
      const response = await fetch('/api/send-reminder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: cart.email,
          name: cart.name,
          itemCount: cart.itemCount
        }),
      });
      
      if (response.ok) {
        setSentIds(prev => new Set(prev).add(cart.id));
      } else {
        console.error("Failed to send email");
      }
    } catch (error) {
      console.error("Error sending email:", error);
    } finally {
      setSendingIds(prev => {
        const next = new Set(prev);
        next.delete(cart.id);
        return next;
      });
    }
  };

  useEffect(() => {
    async function fetchUsersAndCarts() {
      try {
        const querySnapshot = await getDocs(collection(db, 'users'));
        const usersData = [];
        const cartsData = [];
        
        querySnapshot.forEach((doc) => {
          const userData = doc.data();
          const userObj = {
            id: doc.id,
            email: userData.email || 'No Email',
            name: userData.name || 'Unknown User',
            phone: userData.phone ? `${userData.countryCode || ''} ${userData.phone}`.trim() : 'No Phone',
            role: userData.role || 'customer',
          };
          
          usersData.push(userObj);

          if (userData.cart && userData.cart.length > 0) {
            const cartTotal = userData.cart.reduce((total, item) => total + (item.price * item.quantity), 0);
            cartsData.push({
              ...userObj,
              cart: userData.cart,
              total: cartTotal,
              itemCount: userData.cart.reduce((count, item) => count + item.quantity, 0)
            });
          }
        });
        
        // Sort by total descending for carts
        cartsData.sort((a, b) => b.total - a.total);
        setAbandonedCarts(cartsData);
        setAllUsers(usersData);
      } catch (error) {
        console.error("Error fetching analytics data:", error);
      } finally {
        setLoading(false);
      }
    }
    
    fetchUsersAndCarts();
  }, []);

  const totalPotentialRevenue = abandonedCarts.reduce((total, cart) => total + cart.total, 0);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-32">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500 font-dm-sans">
      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-[0_2px_10px_rgba(0,0,0,0.04)] border border-[#d2d2d7]/50 flex items-center gap-4 transition-transform hover:scale-[1.02]">
          <div className="w-12 h-12 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-[#86868b] font-bold uppercase tracking-wider mb-1">Total Users</p>
            <h3 className="text-3xl font-bold text-black">{allUsers.length}</h3>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-[0_2px_10px_rgba(0,0,0,0.04)] border border-[#d2d2d7]/50 flex items-center gap-4 transition-transform hover:scale-[1.02]">
          <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <ShoppingBag className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-[#86868b] font-bold uppercase tracking-wider mb-1">Active Carts</p>
            <h3 className="text-3xl font-bold text-black">{abandonedCarts.length}</h3>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-2xl shadow-[0_2px_10px_rgba(0,0,0,0.04)] border border-[#d2d2d7]/50 flex items-center gap-4 transition-transform hover:scale-[1.02]">
          <div className="w-12 h-12 rounded-full bg-green-50 text-green-600 flex items-center justify-center shrink-0">
            <BarChart3 className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-[#86868b] font-bold uppercase tracking-wider mb-1">Potential Revenue</p>
            <h3 className="text-3xl font-bold text-black">₹{totalPotentialRevenue.toFixed(2)}</h3>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="bg-white rounded-2xl shadow-[0_2px_10px_rgba(0,0,0,0.04)] border border-[#d2d2d7]/50 overflow-hidden flex flex-col">
        {/* Tabs */}
        <div className="flex border-b border-[#d2d2d7]/50 bg-gray-50/30">
          <button 
            onClick={() => setActiveTab('carts')}
            className={`px-6 py-4 text-sm font-semibold transition-colors border-b-2 ${activeTab === 'carts' ? 'border-black text-black' : 'border-transparent text-[#86868b] hover:text-black'}`}
          >
            Abandoned Carts
          </button>
          <button 
            onClick={() => setActiveTab('users')}
            className={`px-6 py-4 text-sm font-semibold transition-colors border-b-2 ${activeTab === 'users' ? 'border-black text-black' : 'border-transparent text-[#86868b] hover:text-black'}`}
          >
            All Registered Users
          </button>
        </div>
        
        {/* Tab Content */}
        <div className="overflow-x-auto">
          {activeTab === 'carts' ? (
            abandonedCarts.length === 0 ? (
              <div className="p-16 flex flex-col items-center justify-center text-center">
                <ShoppingBag className="w-12 h-12 text-gray-300 mb-4" />
                <h3 className="text-lg font-semibold text-black mb-1">No Active Carts</h3>
                <p className="text-sm text-[#86868b]">Users haven't left any items in their carts yet.</p>
              </div>
            ) : (
              <table className="w-full text-left border-collapse min-w-[600px]">
                <thead>
                  <tr className="border-b border-[#d2d2d7]/50 text-[10px] font-bold uppercase tracking-widest text-[#86868b] bg-gray-50/50">
                    <th className="px-6 py-4">Customer Details</th>
                    <th className="px-6 py-4">Cart Contents</th>
                    <th className="px-6 py-4 text-right">Cart Value</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#d2d2d7]/30">
                  {abandonedCarts.map((cart) => (
                    <tr key={cart.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4 align-top">
                        <div className="flex flex-col gap-1">
                          <div className="font-semibold text-black text-sm">{cart.name}</div>
                          <div className="flex items-center gap-1.5 text-xs text-[#86868b]">
                            <Mail className="w-3 h-3" />
                            {cart.email}
                          </div>
                          {cart.phone !== 'No Phone' && (
                            <div className="flex items-center gap-1.5 text-xs text-[#86868b]">
                              <Phone className="w-3 h-3" />
                              {cart.phone}
                            </div>
                          )}
                          {sentIds.has(cart.id) ? (
                            <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1.5 text-green-600 bg-green-50 text-[10px] font-bold uppercase tracking-widest rounded-md w-fit animate-in zoom-in duration-300">
                              <CheckCircle2 className="w-3 h-3" />
                              Sent Successfully
                            </div>
                          ) : (
                            <button 
                              onClick={() => handleSendReminder(cart)}
                              disabled={sendingIds.has(cart.id)}
                              className="mt-2 inline-flex items-center justify-center gap-1.5 px-3 py-1.5 bg-black text-white text-[10px] font-bold uppercase tracking-widest rounded-md hover:bg-gray-800 transition-colors w-fit disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                              {sendingIds.has(cart.id) ? (
                                <Loader2 className="w-3 h-3 animate-spin" />
                              ) : (
                                <Mail className="w-3 h-3" />
                              )}
                              {sendingIds.has(cart.id) ? 'Sending...' : 'Send Reminder'}
                            </button>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 align-top">
                        <div className="text-xs font-semibold text-black mb-2">
                          {cart.itemCount} item{cart.itemCount !== 1 ? 's' : ''}
                        </div>
                        <div className="flex flex-col gap-1.5">
                          {cart.cart.map((item, idx) => (
                            <div key={idx} className="flex items-center gap-2 text-xs">
                              <span className="w-5 h-5 rounded flex items-center justify-center bg-gray-100 text-[10px] font-bold shrink-0">
                                {item.quantity}x
                              </span>
                              <span className="text-gray-700 truncate max-w-[250px]">
                                {item.title} {item.size ? `(${item.size})` : ''}
                              </span>
                            </div>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4 align-top text-right">
                        <div className="text-sm font-bold text-black bg-gray-100 inline-block px-3 py-1 rounded-full">
                          ₹{cart.total.toFixed(2)}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )
          ) : (
            allUsers.length === 0 ? (
              <div className="p-16 flex flex-col items-center justify-center text-center">
                <Users className="w-12 h-12 text-gray-300 mb-4" />
                <h3 className="text-lg font-semibold text-black mb-1">No Users Found</h3>
                <p className="text-sm text-[#86868b]">There are no registered users in the database yet.</p>
              </div>
            ) : (
              <table className="w-full text-left border-collapse min-w-[600px]">
                <thead>
                  <tr className="border-b border-[#d2d2d7]/50 text-[10px] font-bold uppercase tracking-widest text-[#86868b] bg-gray-50/50">
                    <th className="px-6 py-4">User</th>
                    <th className="px-6 py-4">Contact</th>
                    <th className="px-6 py-4">Role</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#d2d2d7]/30">
                  {allUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 shrink-0">
                            <User className="w-5 h-5" />
                          </div>
                          <div>
                            <div className="font-semibold text-black text-sm">{user.name}</div>
                            <div className="text-[10px] uppercase tracking-widest text-gray-400 mt-0.5">ID: {user.id.substring(0,8)}...</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-1.5">
                          <div className="flex items-center gap-1.5 text-xs text-[#86868b]">
                            <Mail className="w-3.5 h-3.5" />
                            {user.email}
                          </div>
                          {user.phone !== 'No Phone' && (
                            <div className="flex items-center gap-1.5 text-xs text-[#86868b]">
                              <Phone className="w-3.5 h-3.5" />
                              {user.phone}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          user.role === 'admin_owner' 
                            ? 'bg-purple-100 text-purple-700' 
                            : user.role === 'admin_team'
                            ? 'bg-blue-100 text-blue-700'
                            : 'bg-gray-100 text-gray-700'
                        }`}>
                          {user.role.replace('_', ' ')}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )
          )}
        </div>
      </div>
    </div>
  );
}
