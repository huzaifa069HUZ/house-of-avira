'use client';

import { useCartStore } from '@/store/cartStore';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Minus, Plus, ShoppingBag, Trash2, Globe, ChevronDown, Tag } from 'lucide-react';
import Image from 'next/image';

export default function CartSlideOver() {
  const { cart, isOpen, closeCart, updateQuantity, updateItemSize, removeFromCart, appliedCoupon, discountAmount, applyCoupon, removeCoupon } = useCartStore();
  const [couponCode, setCouponCode] = useState('');
  const [couponMsg, setCouponMsg] = useState({ text: '', type: '' });

  const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;
    setCouponMsg({ text: 'Applying...', type: 'info' });
    const res = await applyCoupon(couponCode);
    setCouponMsg({ text: res.message, type: res.success ? 'success' : 'error' });
    if (res.success) {
      setCouponCode('');
      setTimeout(() => setCouponMsg({ text: '', type: '' }), 3000);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.4 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            className="fixed inset-0 bg-black z-50 cursor-pointer"
          />

          {/* Slide Over Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl z-50 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 bg-white/80 backdrop-blur-md">
              <div className="flex items-center gap-3">
                <ShoppingBag className="w-5 h-5 text-black" />
                <h2 className="text-xl font-bold tracking-tight text-black">Your Cart</h2>
              </div>
              <button
                onClick={closeCart}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors text-gray-500 hover:text-black"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto px-6 py-6 bg-[#FAFAFA]">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                  <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center">
                    <ShoppingBag className="w-8 h-8 text-gray-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-black">Your cart is empty</h3>
                    <p className="text-sm text-gray-500 mt-1">Looks like you haven't added anything yet.</p>
                  </div>
                  <button
                    onClick={closeCart}
                    className="mt-6 px-6 py-3 bg-black text-white text-sm font-medium rounded-xl hover:bg-gray-800 transition-colors"
                  >
                    Continue Shopping
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="bg-gradient-to-r from-[#000000] to-[#2c2c2c] rounded-xl p-4 flex gap-3 items-center shadow-lg mb-6 relative overflow-hidden">
                    <div className="absolute right-0 top-0 w-32 h-32 bg-white/5 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none"></div>
                    <div className="bg-white/10 p-2.5 rounded-full backdrop-blur-md shrink-0 border border-white/10">
                      <Globe className="w-5 h-5 text-white" />
                    </div>
                    <div className="relative z-10">
                      <p className="text-[10px] font-bold text-white uppercase tracking-[0.2em] mb-0.5 flex items-center gap-2">
                        Global Sourcing <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></span>
                      </p>
                      <p className="text-[11px] text-gray-300 font-light leading-relaxed pr-2">
                        Premium imported goods sourced directly from international suppliers.
                      </p>
                    </div>
                  </div>

                  {cart.map((item) => (
                    <div key={item.cartItemId || item.id} className="flex bg-white rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-gray-100/80 p-4 relative transition-all hover:shadow-[0_4px_20px_rgba(0,0,0,0.06)]">
                      <div className="flex gap-5 w-full">
                        {/* Image */}
                        <div className="relative w-[100px] h-[135px] rounded-xl overflow-hidden bg-[#F5F5F7] flex-shrink-0 border border-gray-100/50 shadow-sm">
                          {item.image ? (
                            <Image src={item.image} alt={item.title} fill className="object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-300"><ShoppingBag className="w-6 h-6" /></div>
                          )}
                        </div>

                        {/* Details */}
                        <div className="flex flex-col flex-1 py-0.5">
                          <div className="flex justify-between items-start w-full gap-3">
                            <div className="flex flex-col gap-2 flex-1">
                              <h3 className="text-[14px] text-gray-900 font-bold leading-snug line-clamp-2 tracking-tight">
                                {item.title}
                              </h3>
                              <div className="flex items-center gap-2 mt-0.5">
                                <div className="relative">
                                  <select
                                    value={item.size || ''}
                                    onChange={(e) => updateItemSize(item.cartItemId || item.id, e.target.value)}
                                    className="appearance-none border border-gray-200 rounded-md pl-2.5 pr-7 py-1 text-[11px] font-bold text-gray-900 bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer shadow-sm outline-none uppercase tracking-widest"
                                  >
                                    {!item.size && <option value="" disabled>SIZE</option>}
                                    {['XS', 'S', 'M', 'L', 'XL', 'XXL', '36', '37', '38', '39', '40', '41', '42', '43', '44', '45'].map(s => (
                                      <option key={s} value={s}>{s}</option>
                                    ))}
                                  </select>
                                  <ChevronDown className="w-3.5 h-3.5 text-gray-500 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
                                </div>
                                {item.color && (
                                  <span className="text-[11px] font-bold text-gray-600 capitalize bg-gray-100 border border-gray-200 px-2.5 py-1.5 rounded-md shadow-sm">{item.color}</span>
                                )}
                              </div>
                            </div>

                            <div className="flex flex-col items-end text-right shrink-0">
                              <p className="text-[12px] text-gray-400 line-through font-semibold tracking-tight">₹{(item.price / 0.81).toFixed(2)}</p>
                              <p className="text-[16px] font-black text-gray-900 leading-none mt-1 tracking-tight">₹{item.price?.toFixed(2)}</p>
                              <p className="text-[10px] font-black text-[#00a86b] mt-1.5 tracking-widest">(19% OFF)</p>
                            </div>
                          </div>

                          <div className="flex justify-end items-center mt-auto gap-4">
                            {/* Quantity controls */}
                            <div className="flex items-center bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                              <button onClick={() => updateQuantity(item.cartItemId || item.id, -1)} className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-black hover:bg-gray-50 transition-colors">
                                <Minus className="w-3.5 h-3.5" />
                              </button>
                              <span className="w-6 text-center text-[13px] font-black text-black">{item.quantity}</span>
                              <button onClick={() => updateQuantity(item.cartItemId || item.id, 1)} className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-black hover:bg-gray-50 transition-colors">
                                <Plus className="w-3.5 h-3.5" />
                              </button>
                            </div>

                            {/* Trash */}
                            <button onClick={() => removeFromCart(item.cartItemId || item.id)} className="text-gray-400 hover:text-red-500 transition-colors p-2 hover:bg-red-50 rounded-lg group">
                              <Trash2 className="w-4 h-4 group-hover:scale-110 transition-transform" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* Coupon UI Section */}
                  <div className="mt-6 border border-gray-200 rounded-2xl bg-white p-4 shadow-[0_2px_12px_rgba(0,0,0,0.02)]">
                    <div className="flex items-center gap-3 border border-gray-200 rounded-xl px-4 py-3 bg-[#FAFAFA] focus-within:bg-white focus-within:border-gray-300 focus-within:ring-2 focus-within:ring-black/5 transition-all">
                      <Tag className="w-5 h-5 text-[#00a86b]" />
                      <input
                        type="text"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                        placeholder="Enter Coupon Code"
                        className="w-full text-sm outline-none bg-transparent placeholder-gray-400 text-gray-800 font-medium uppercase"
                      />
                      <button
                        onClick={handleApplyCoupon}
                        className="text-sm font-semibold text-black hover:text-[#00a86b] transition-colors"
                      >
                        Apply
                      </button>
                    </div>
                    {couponMsg.text && (
                      <p className={`text-xs mt-2 font-medium px-1 ${couponMsg.type === 'error' ? 'text-red-500' : couponMsg.type === 'success' ? 'text-green-600' : 'text-gray-500'}`}>
                        {couponMsg.text}
                      </p>
                    )}
                    <button className="text-[#0056b3] text-sm font-semibold mt-3 hover:underline px-1 flex items-center gap-1 transition-colors hover:text-[#004494]">
                      View All Offers <span className="text-lg leading-none">&rsaquo;</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            {cart.length > 0 && (
              <div className="border-t border-gray-100 px-6 py-6 bg-white">
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500 font-medium text-sm">Subtotal</span>
                    <span className="text-base font-semibold text-gray-900">₹{subtotal.toFixed(2)}</span>
                  </div>

                  {appliedCoupon && (
                    <div className="flex justify-between items-center text-[#00a86b]">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm">Discount ({appliedCoupon.code})</span>
                        <button onClick={removeCoupon} className="text-gray-400 hover:text-red-500">
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                      <span className="text-base font-semibold">-₹{discountAmount.toFixed(2)}</span>
                    </div>
                  )}

                  <div className="pt-4 border-t border-gray-100">
                    <div className="w-full mb-3">
                      <p className="font-sans text-[10px] font-bold text-red-500 uppercase tracking-tight text-right leading-tight">
                        * INTERNATIONAL SHIPPING WILL BE CHARGED LATER, IT'S ONLY THE FIXED PRICE.
                      </p>
                    </div>
                    <div className="flex justify-between items-end">
                      <span className="text-gray-900 font-bold text-base mb-0.5">Total</span>
                      <span className="text-[22px] font-black text-black leading-none tracking-tight">₹{Math.max(0, subtotal - discountAmount).toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                <p className="text-xs text-gray-500 mb-4 text-center">
                  Shipping and taxes will be sent to you via whatsapp/email
                </p>

                <button
                  className="w-full bg-black text-white py-4 rounded-xl font-semibold tracking-wide hover:bg-gray-800 transition-all active:scale-[0.98] flex items-center justify-center gap-2 shadow-lg shadow-black/10"
                >
                  Proceed to Checkout
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
