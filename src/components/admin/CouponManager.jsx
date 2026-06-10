'use client';

import { useState, useEffect } from 'react';
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Plus, Trash2, Ticket, Percent, X, Loader2 } from 'lucide-react';

export default function CouponManager() {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [newCoupon, setNewCoupon] = useState({
    code: '',
    discountType: 'percentage', // or 'fixed'
    discountValue: '',
    minOrderValue: '',
    isActive: true
  });

  const fetchCoupons = async () => {
    setLoading(true);
    try {
      const querySnapshot = await getDocs(collection(db, 'coupons'));
      const couponsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setCoupons(couponsData);
    } catch (error) {
      console.error('Error fetching coupons:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const handleAddCoupon = async (e) => {
    e.preventDefault();
    if (!newCoupon.code || !newCoupon.discountValue) return;

    try {
      await addDoc(collection(db, 'coupons'), {
        ...newCoupon,
        code: newCoupon.code.toUpperCase(),
        discountValue: Number(newCoupon.discountValue),
        minOrderValue: Number(newCoupon.minOrderValue) || 0,
        createdAt: new Date().toISOString()
      });
      setIsAdding(false);
      setNewCoupon({ code: '', discountType: 'percentage', discountValue: '', minOrderValue: '', isActive: true });
      fetchCoupons();
    } catch (error) {
      console.error('Error adding coupon:', error);
    }
  };

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this coupon?')) {
      try {
        await deleteDoc(doc(db, 'coupons', id));
        fetchCoupons();
      } catch (error) {
        console.error('Error deleting coupon:', error);
      }
    }
  };

  const toggleStatus = async (id, currentStatus) => {
    try {
      await updateDoc(doc(db, 'coupons', id), {
        isActive: !currentStatus
      });
      fetchCoupons();
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-black">Manage Coupons</h2>
        <button 
          onClick={() => setIsAdding(!isAdding)}
          className="flex items-center gap-2 px-4 py-2 bg-black text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors"
        >
          {isAdding ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          {isAdding ? 'Cancel' : 'Add New Coupon'}
        </button>
      </div>

      {isAdding && (
        <form onSubmit={handleAddCoupon} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Coupon Code</label>
              <div className="relative">
                <Ticket className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input 
                  type="text" 
                  required
                  value={newCoupon.code}
                  onChange={(e) => setNewCoupon({...newCoupon, code: e.target.value.toUpperCase()})}
                  className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black outline-none uppercase"
                  placeholder="e.g. SUMMER20"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Discount Type</label>
              <select 
                value={newCoupon.discountType}
                onChange={(e) => setNewCoupon({...newCoupon, discountType: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black outline-none bg-white"
              >
                <option value="percentage">Percentage (%)</option>
                <option value="fixed">Fixed Amount (₹)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Discount Value</label>
              <div className="relative">
                {newCoupon.discountType === 'percentage' ? (
                  <Percent className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                ) : (
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-medium">₹</span>
                )}
                <input 
                  type="number" 
                  required
                  min="1"
                  value={newCoupon.discountValue}
                  onChange={(e) => setNewCoupon({...newCoupon, discountValue: e.target.value})}
                  className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black outline-none"
                  placeholder={newCoupon.discountType === 'percentage' ? "20" : "500"}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Minimum Order Value (Optional)</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-medium">₹</span>
                <input 
                  type="number" 
                  min="0"
                  value={newCoupon.minOrderValue}
                  onChange={(e) => setNewCoupon({...newCoupon, minOrderValue: e.target.value})}
                  className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black outline-none"
                  placeholder="2000"
                />
              </div>
            </div>
          </div>
          <div className="mt-6 flex justify-end">
            <button type="submit" className="px-6 py-2 bg-[#0071e3] text-white text-sm font-medium rounded-lg hover:bg-[#005bb5] transition-colors">
              Save Coupon
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-gray-400" /></div>
      ) : coupons.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
          <Ticket className="w-12 h-12 mx-auto text-gray-300 mb-3" />
          <h3 className="text-lg font-medium text-gray-900">No coupons yet</h3>
          <p className="text-gray-500 mt-1">Create your first discount code to boost sales.</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 border-b border-gray-200 text-gray-600">
              <tr>
                <th className="px-6 py-3 font-medium">Code</th>
                <th className="px-6 py-3 font-medium">Discount</th>
                <th className="px-6 py-3 font-medium">Min. Order</th>
                <th className="px-6 py-3 font-medium">Status</th>
                <th className="px-6 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {coupons.map(coupon => (
                <tr key={coupon.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4 font-bold text-black tracking-wide">{coupon.code}</td>
                  <td className="px-6 py-4 text-gray-600">
                    {coupon.discountType === 'percentage' ? `${coupon.discountValue}% OFF` : `₹${coupon.discountValue} OFF`}
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    {coupon.minOrderValue ? `₹${coupon.minOrderValue}` : 'None'}
                  </td>
                  <td className="px-6 py-4">
                    <button 
                      onClick={() => toggleStatus(coupon.id, coupon.isActive)}
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${coupon.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}
                    >
                      {coupon.isActive ? 'Active' : 'Inactive'}
                    </button>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button 
                      onClick={() => handleDelete(coupon.id)}
                      className="text-gray-400 hover:text-red-500 transition-colors p-2"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
