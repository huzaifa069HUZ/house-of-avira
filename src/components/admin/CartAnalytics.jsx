'use client';

import { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { BarChart3, ShoppingBag, User } from 'lucide-react';

export default function CartAnalytics() {
  const [abandonedCarts, setAbandonedCarts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCarts() {
      try {
        const querySnapshot = await getDocs(collection(db, 'users'));
        const cartsData = [];
        
        querySnapshot.forEach((doc) => {
          const userData = doc.data();
          if (userData.cart && userData.cart.length > 0) {
            const cartTotal = userData.cart.reduce((total, item) => total + (item.price * item.quantity), 0);
            cartsData.push({
              id: doc.id,
              email: userData.email || 'Unknown Email',
              name: userData.name || 'Unknown User',
              cart: userData.cart,
              total: cartTotal,
              itemCount: userData.cart.reduce((count, item) => count + item.quantity, 0)
            });
          }
        });
        
        // Sort by total descending
        cartsData.sort((a, b) => b.total - a.total);
        setAbandonedCarts(cartsData);
      } catch (error) {
        console.error("Error fetching carts for analytics:", error);
      } finally {
        setLoading(false);
      }
    }
    
    fetchCarts();
  }, []);

  const totalPotentialRevenue = abandonedCarts.reduce((total, cart) => total + cart.total, 0);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-[0_2px_10px_rgba(0,0,0,0.04)] border border-[#d2d2d7]/50 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
            <ShoppingBag className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-[#86868b] font-medium uppercase tracking-wider">Active/Abandoned Carts</p>
            <h3 className="text-3xl font-bold text-black">{abandonedCarts.length}</h3>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-2xl shadow-[0_2px_10px_rgba(0,0,0,0.04)] border border-[#d2d2d7]/50 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-green-50 text-green-600 flex items-center justify-center">
            <BarChart3 className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-[#86868b] font-medium uppercase tracking-wider">Potential Revenue</p>
            <h3 className="text-3xl font-bold text-black">${totalPotentialRevenue.toFixed(2)}</h3>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-[0_2px_10px_rgba(0,0,0,0.04)] border border-[#d2d2d7]/50 overflow-hidden">
        <div className="px-6 py-5 border-b border-[#d2d2d7]/50 bg-gray-50/50">
          <h2 className="text-lg font-semibold text-black">Cart Details</h2>
        </div>
        
        {abandonedCarts.length === 0 ? (
          <div className="p-12 text-center text-[#86868b]">
            No active carts found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#d2d2d7]/50 text-xs uppercase tracking-wider text-[#86868b]">
                  <th className="px-6 py-4 font-semibold">User</th>
                  <th className="px-6 py-4 font-semibold">Items</th>
                  <th className="px-6 py-4 font-semibold">Cart Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#d2d2d7]/30">
                {abandonedCarts.map((cart) => (
                  <tr key={cart.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 shrink-0">
                          <User className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="font-medium text-black">{cart.name}</div>
                          <div className="text-xs text-[#86868b]">{cart.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-black mb-1">
                        {cart.itemCount} item{cart.itemCount !== 1 ? 's' : ''}
                      </div>
                      <div className="flex flex-wrap gap-1 max-w-[200px]">
                        {cart.cart.map((item, idx) => (
                          <span key={idx} className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-gray-100 text-gray-800 truncate max-w-full">
                            {item.quantity}x {item.title}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-semibold text-black">
                        ${cart.total.toFixed(2)}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
