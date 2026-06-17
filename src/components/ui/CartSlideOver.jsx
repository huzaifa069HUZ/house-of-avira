'use client';

import { useCartStore } from '@/store/cartStore';
import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Minus, Plus, ShoppingBag, Trash2, Globe, ChevronDown, Tag, Calculator, Plane, Ship } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import PriceDisplay from '@/components/PriceDisplay';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

const getCategoryMetrics = (item) => {
  const catStr = (item.subcategory || item.category || item.title || '').toLowerCase();
  
  if (catStr.includes('shoe') || catStr.includes('sneaker') || catStr.includes('footwear') || catStr.includes('boot')) {
    return { weight: 1200, duty: 0.35, igst: 0.18 };
  } else if (catStr.includes('bag') || catStr.includes('purse') || catStr.includes('wallet')) {
    return { weight: 800, duty: 0.20, igst: 0.18 };
  } else if (catStr.includes('jacket') || catStr.includes('coat') || catStr.includes('blazer')) {
    return { weight: 1000, duty: 0.25, igst: 0.18 };
  } else if (catStr.includes('sweater') || catStr.includes('hoodie') || catStr.includes('sweatshirt')) {
    return { weight: 700, duty: 0.20, igst: 0.18 };
  } else if (catStr.includes('jeans') || catStr.includes('denim')) {
    return { weight: 600, duty: 0.20, igst: 0.18 };
  } else if (catStr.includes('trouser') || catStr.includes('pant')) {
    return { weight: 500, duty: 0.20, igst: 0.18 };
  } else if (catStr.includes('dress')) {
    return { weight: 450, duty: 0.20, igst: 0.18 };
  } else if (catStr.includes('shirt') || catStr.includes('top') || catStr.includes('t-shirt') || catStr.includes('tshirt')) {
    return { weight: 250, duty: 0.20, igst: 0.18 };
  } else if (catStr.includes('beauty') || catStr.includes('makeup') || catStr.includes('cosmetic')) {
    return { weight: 150, duty: 0.20, igst: 0.18 };
  } else if (catStr.includes('accessory') || catStr.includes('jewelry') || catStr.includes('watch') || catStr.includes('sunglass')) {
    return { weight: 150, duty: 0.10, igst: 0.18 };
  }
  return { weight: 500, duty: 0.20, igst: 0.18 }; // Default
};

export default function CartSlideOver() {
  const { cart, isOpen, closeCart, updateQuantity, updateItemSize, removeFromCart, appliedCoupon, discountAmount, applyCoupon, removeCoupon } = useCartStore();
  const [couponCode, setCouponCode] = useState('');
  const [couponMsg, setCouponMsg] = useState({ text: '', type: '' });
  
  // Shipping Estimator State
  const [showEstimator, setShowEstimator] = useState(false);
  const [shippingMode, setShippingMode] = useState('sea');
  const [customWeight, setCustomWeight] = useState(0);

  // Consent Modal State
  const [showConsentModal, setShowConsentModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [consents, setConsents] = useState({
    c1: false,
    c2: false,
    c3: false,
    c4: false,
    c5: false,
    c6: false,
  });

  const router = useRouter();
  const { user } = useAuthStore();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const allConsented = Object.values(consents).every(Boolean);

  const handleProceed = async () => {
    if (!allConsented) return;
    setIsProcessing(true);
    
    try {
      // Fetch IP
      let ip = 'Unknown';
      try {
        const ipRes = await fetch('https://api.ipify.org?format=json');
        const ipData = await ipRes.json();
        ip = ipData.ip;
      } catch (e) {
        console.error('Failed to fetch IP', e);
      }

      // Log to Firestore (Best Effort)
      try {
        await addDoc(collection(db, 'checkout_consents'), {
          userId: user?.uid || 'guest',
          userEmail: user?.email || 'guest',
          ipAddress: ip,
          timestamp: serverTimestamp(),
          agreedToTerms: true,
        });
      } catch (firestoreError) {
        console.error('Failed to log consent to Firestore', firestoreError);
      }

      // Navigate to checkout
      closeCart();
      router.push('/checkout');
    } catch (error) {
      console.error('Error proceeding to checkout', error);
      alert('An error occurred. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const baseCartWeight = useMemo(() => {
    return cart.reduce((total, item) => {
      const { weight } = getCategoryMetrics(item);
      return total + (weight * item.quantity);
    }, 0);
  }, [cart]);

  // Sync customWeight only when cart content changes in a way that alters the base weight
  useEffect(() => {
    setCustomWeight(baseCartWeight);
  }, [baseCartWeight]);

  const shippingCosts = useMemo(() => {
    if (cart.length === 0) return null;

    // Rates (per kg)
    const seaRatePerKg = 450; // ₹450 per kg
    const airRatePerKg = 1200; // ₹1200 per kg
    const modeRate = shippingMode === 'air' ? airRatePerKg : seaRatePerKg;

    // Total physical weight vs volumetric weight
    // We use the user-modified `customWeight` (in grams) for calculations
    let intlShippingBase = (customWeight / 1000) * modeRate;

    // We add a base fixed cost for handling/packaging per package
    const handlingFee = 500; 
    intlShippingBase += handlingFee;

    // We still give a range (e.g. +/- 15%) since rates fluctuate based on dimensional weight and fuel surcharges
    const intlLow = intlShippingBase * 0.85;
    const intlHigh = intlShippingBase * 1.15;

    let customsLow = 0;
    let customsHigh = 0;
    let gstLow = 0;
    let gstHigh = 0;

    cart.forEach(item => {
      const productVal = item.price ? Number(item.price) : 2000;
      const metrics = getCategoryMetrics(item);
      
      const bcdRate = metrics.duty; // Basic Custom Duty
      const swsRate = 0.10; // Social Welfare Surcharge (10% of BCD)
      const igstRate = metrics.igst;
      
      // Proportion of international shipping for this item based on base weights
      const itemWeightProp = baseCartWeight > 0 ? (metrics.weight * item.quantity) / baseCartWeight : (1 / cart.length);
      const itemIntlLow = intlLow * itemWeightProp;
      const itemIntlHigh = intlHigh * itemWeightProp;

      // Assessable Value = Product Value + Intl Shipping
      const assessableLow = (productVal * item.quantity) + itemIntlLow;
      const assessableHigh = (productVal * item.quantity) + itemIntlHigh;

      const bcdLow = assessableLow * bcdRate;
      const bcdHigh = assessableHigh * bcdRate;

      const swsLow = bcdLow * swsRate;
      const swsHigh = bcdHigh * swsRate;

      const totalDutyLow = bcdLow + swsLow;
      const totalDutyHigh = bcdHigh + swsHigh;

      customsLow += totalDutyLow;
      customsHigh += totalDutyHigh;

      // IGST applied on (Assessable Value + Total Duty)
      const valueForIgstLow = assessableLow + totalDutyLow;
      const valueForIgstHigh = assessableHigh + totalDutyHigh;

      gstLow += valueForIgstLow * igstRate;
      gstHigh += valueForIgstHigh * igstRate;
    });

    // Domestic shipping (e.g., Delhivery / BlueDart)
    // ~₹80 base for first 500g + ₹50 for every additional 500g
    const domesticBase = 80 + Math.max(0, Math.ceil((customWeight - 500) / 500)) * 50;
    const domLow = domesticBase * 0.9;
    const domHigh = domesticBase * 1.2;

    return {
      intlLow: Math.round(intlLow),
      intlHigh: Math.round(intlHigh),
      customsLow: Math.round(customsLow),
      customsHigh: Math.round(customsHigh),
      gstLow: Math.round(gstLow),
      gstHigh: Math.round(gstHigh),
      domLow: Math.round(domLow),
      domHigh: Math.round(domHigh),
      totalLow: Math.round(intlLow + customsLow + gstLow + domLow),
      totalHigh: Math.round(intlHigh + customsHigh + gstHigh + domHigh)
    };
  }, [cart, shippingMode, customWeight, baseCartWeight]);

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
            className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl z-50 flex flex-col overflow-hidden border-none rounded-none"
            style={{ fontFamily: 'var(--font-dm-sans, "DM Sans", sans-serif)' }}
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
                    <div key={item.cartItemId || item.id} className="flex bg-white rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-gray-100/80 p-5 relative transition-all hover:shadow-[0_4px_20px_rgba(0,0,0,0.06)]">
                      <div className="flex gap-6 w-full">
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
                              <p className="text-[12px] text-gray-400 line-through font-semibold tracking-tight"><PriceDisplay basePrice={item.price / 0.81} /></p>
                              <p className="text-[16px] font-black text-gray-900 leading-none mt-1 tracking-tight"><PriceDisplay basePrice={item.price || 0} /></p>
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
                  {/* Shipping Estimator */}
                  <div className="bg-[#FAFAFA] border border-gray-200 rounded-xl overflow-hidden mb-4">
                    <button 
                      onClick={() => setShowEstimator(!showEstimator)} 
                      className="w-full px-3 py-2.5 flex items-center justify-between text-sm font-bold bg-white hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <Calculator className="w-4 h-4 text-[#8A001A]" />
                        <span>Estimate Shipping</span>
                      </div>
                      <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${showEstimator ? 'rotate-180' : ''}`} />
                    </button>
                    
                    <AnimatePresence>
                      {showEstimator && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="px-3 py-3 border-t border-gray-100"
                        >
                          <div className="space-y-3 mb-4">
                            <div className="flex gap-2">
                              <button 
                                onClick={() => setShippingMode('sea')}
                                className={`flex-1 py-1.5 text-xs font-semibold rounded-md border flex justify-center items-center gap-1.5 transition-colors ${shippingMode === 'sea' ? 'bg-[#1E4A72]/10 border-[#1E4A72] text-[#1E4A72]' : 'bg-white border-gray-200 text-gray-500 hover:bg-gray-50'}`}
                              >
                                <Ship className="w-3.5 h-3.5" /> Sea
                              </button>
                              <button 
                                onClick={() => setShippingMode('air')}
                                className={`flex-1 py-1.5 text-xs font-semibold rounded-md border flex justify-center items-center gap-1.5 transition-colors ${shippingMode === 'air' ? 'bg-[#8A001A]/10 border-[#8A001A] text-[#8A001A]' : 'bg-white border-gray-200 text-gray-500 hover:bg-gray-50'}`}
                              >
                                <Plane className="w-3.5 h-3.5" /> Air
                              </button>
                            </div>
                            
                            <div className="flex items-center justify-between gap-3 text-xs">
                              <span className="text-gray-600 font-medium whitespace-nowrap">Est. Weight (g)</span>
                              <input 
                                type="number" 
                                value={customWeight} 
                                onChange={(e) => setCustomWeight(parseInt(e.target.value) || 0)}
                                className="w-20 text-right border border-gray-200 rounded px-2 py-1 outline-none focus:border-[#8A001A]"
                              />
                            </div>
                          </div>

                          {shippingCosts && (
                            <div className="space-y-1.5 text-[11px] mb-3 border-t border-gray-100 pt-3">
                              <div className="flex justify-between text-gray-500">
                                <span>Intl. Shipping</span>
                                <span><PriceDisplay basePrice={shippingCosts.intlLow} /> - <PriceDisplay basePrice={shippingCosts.intlHigh} /></span>
                              </div>
                              <div className="flex justify-between text-gray-500">
                                <span>Customs & Duty</span>
                                <span><PriceDisplay basePrice={shippingCosts.customsLow} /> - <PriceDisplay basePrice={shippingCosts.customsHigh} /></span>
                              </div>
                              <div className="flex justify-between text-gray-500">
                                <span>Import GST</span>
                                <span><PriceDisplay basePrice={shippingCosts.gstLow} /> - <PriceDisplay basePrice={shippingCosts.gstHigh} /></span>
                              </div>
                              <div className="flex justify-between text-gray-500">
                                <span>Domestic</span>
                                <span><PriceDisplay basePrice={shippingCosts.domLow} /> - <PriceDisplay basePrice={shippingCosts.domHigh} /></span>
                              </div>
                              <div className="flex justify-between font-bold text-black border-t border-gray-100 pt-1.5 mt-1.5">
                                <span>Est. Total Shipping</span>
                                <span><PriceDisplay basePrice={shippingCosts.totalLow} /> - <PriceDisplay basePrice={shippingCosts.totalHigh} /></span>
                              </div>
                            </div>
                          )}
                          <p className="text-[9px] text-[#8A001A] uppercase font-bold leading-tight text-center">This is an estimate. Actual shipping will be billed separately upon arrival.</p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {appliedCoupon && (
                    <div className="flex justify-between items-center text-[#00a86b]">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm">Discount ({appliedCoupon.code})</span>
                        <button onClick={removeCoupon} className="text-gray-400 hover:text-red-500">
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                      <span className="text-base font-semibold">-<PriceDisplay basePrice={discountAmount} /></span>
                    </div>
                  )}

                  <div className="pt-2">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-gray-700 font-bold text-sm">Estimated Shipping</span>
                      <span className="text-sm font-semibold text-gray-900">
                        {shippingCosts ? <><PriceDisplay basePrice={shippingCosts.totalLow} /> - <PriceDisplay basePrice={shippingCosts.totalHigh} /></> : <PriceDisplay basePrice={0} />}
                      </span>
                    </div>
                    <div className="w-full mb-3 space-y-1.5 flex flex-col items-end overflow-hidden">
                      <p className="font-sans text-[8px] sm:text-[9px] whitespace-nowrap overflow-hidden text-ellipsis font-bold text-red-500 uppercase tracking-tight text-right w-full">
                        * THIS PRICE IS AN ESTIMATE AND MIGHT GO HIGHER AS PER CUSTOM DUTY AND TAXES.
                      </p>
                      <Link href="/shipping" onClick={closeCart} className="font-sans text-[10px] font-bold text-blue-600 hover:text-blue-800 underline uppercase tracking-tight">
                        KNOW MORE ABOUT SHIPPING
                      </Link>
                    </div>
                    <div className="flex justify-between items-end">
                      <span className="text-gray-900 font-bold text-base mb-0.5">Total</span>
                      <span className="text-[22px] font-black text-black leading-none tracking-tight"><PriceDisplay basePrice={Math.max(0, subtotal - discountAmount)} /></span>
                    </div>
                  </div>
                </div>

                <p className="text-xs text-gray-500 mb-4 text-center">
                  Shipping and taxes will be sent to you via whatsapp/email
                </p>

                <button
                  onClick={() => setShowConsentModal(true)}
                  className="w-full bg-black text-white py-4 rounded-xl font-semibold tracking-wide hover:bg-gray-800 transition-all active:scale-[0.98] flex items-center justify-center gap-2 shadow-lg shadow-black/10"
                >
                  Proceed to Checkout
                </button>
              </div>
            )}

            {/* Consent Modal Overlay */}
            <AnimatePresence>
              {showConsentModal && (
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 50 }}
                  className="absolute inset-0 z-50 bg-white flex flex-col h-full w-full"
                >
                  <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 bg-white/80 backdrop-blur-md">
                    <h2 className="text-xl font-bold tracking-tight text-black">Terms of Checkout</h2>
                    <button
                      onClick={() => setShowConsentModal(false)}
                      className="p-2 rounded-full hover:bg-gray-100 transition-colors text-gray-500 hover:text-black"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  
                  <div className="flex-1 overflow-y-auto px-6 py-6 bg-[#FAFAFA] space-y-5">
                    <p className="text-sm font-semibold text-red-600 bg-red-50 p-3 rounded-lg border border-red-100">
                      Please read and acknowledge the following terms before proceeding. All fields are mandatory.
                    </p>

                    <div className="space-y-4 text-sm font-medium text-gray-800">
                      {[
                        { id: 'c1', label: 'I understand this is a preorder item. Products are not available for immediate delivery.' },
                        { id: 'c2', label: 'I understand delivery timelines are estimates only and may vary due to factors outside House of Avira\'s control.' },
                        { id: 'c3', label: 'I understand international shipping charges are compulsory and will be collected separately at a later stage.' },
                        { id: 'c4', label: 'I understand domestic shipping charges are compulsory and will be collected separately before final dispatch.' },
                        { id: 'c5', label: 'I understand shipping costs may vary based on weight, customs duties, taxes, packaging requirements, and product category.' },
                        { id: 'c6', label: 'I understand there are absolutely no cancellations, refunds, or exchanges after placing an order.' }
                      ].map(item => (
                        <label key={item.id} className="flex items-start gap-3 p-3 bg-white border border-gray-200 rounded-xl cursor-pointer hover:border-gray-300 transition-colors shadow-sm">
                          <input
                            type="checkbox"
                            checked={consents[item.id]}
                            onChange={(e) => setConsents(prev => ({ ...prev, [item.id]: e.target.checked }))}
                            className="mt-0.5 w-5 h-5 accent-black rounded border-gray-300 cursor-pointer"
                          />
                          <span className="leading-snug">{item.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="border-t border-gray-100 px-6 py-6 bg-white shrink-0">
                    <div className="text-center mb-4">
                      <Link href="/order-info" onClick={closeCart} className="text-blue-600 font-bold text-sm hover:underline uppercase tracking-wide" style={{ fontFamily: 'var(--font-dm-sans, "DM Sans", sans-serif)' }}>
                        Terms and Conditions
                      </Link>
                    </div>
                    <button
                      onClick={handleProceed}
                      disabled={!allConsented || isProcessing}
                      className="w-full bg-black text-white py-4 rounded-xl font-semibold tracking-wide disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-gray-800 transition-all active:scale-[0.98] flex items-center justify-center gap-2 shadow-lg shadow-black/10"
                    >
                      {isProcessing ? 'Processing...' : 'Accept & Proceed'}
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
