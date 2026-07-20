'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCartStore } from '@/store/cartStore';
import { useAuthStore } from '@/store/authStore';
import { ChevronRight, ArrowLeft, ShieldCheck, CreditCard, Minus, Plus } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import Script from 'next/script';
import PriceDisplay from '@/components/PriceDisplay';
import { db } from '@/lib/firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';



const InputField = ({ label, type = "text", value, onChange, placeholder, required = false }) => (
  <div className="w-full">
    <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-1.5">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
      className="w-full bg-transparent border-b-2 border-gray-200 focus:border-black text-gray-900 placeholder-gray-400 py-2 outline-none transition-colors text-sm font-medium"
    />
  </div>
);

export default function CheckoutPage() {
  const { cart, discountAmount, appliedCoupon, updateQuantity, clearCart } = useCartStore();
  const { user } = useAuthStore();
  const [mounted, setMounted] = useState(false);
  
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [saveNewAddress, setSaveNewAddress] = useState(false);

  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    instagram: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    pincode: '',
    country: 'India'
  });

  useEffect(() => {
    setMounted(true);
    const fetchUserAddresses = async () => {
      if (user?.uid) {
        try {
          const docRef = doc(db, 'users', user.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const data = docSnap.data();
            let userAddresses = data.addresses || [];
            
            if (data.address && userAddresses.length === 0) {
              userAddresses = [{ ...data.address, id: Date.now().toString(), isDefault: true }];
              await updateDoc(docRef, { addresses: userAddresses });
            }
            
            setSavedAddresses(userAddresses);
            
            const defaultAddr = userAddresses.find(a => a.isDefault) || userAddresses[0];
            if (defaultAddr) {
               handleSelectSavedAddress(defaultAddr);
            } else {
               setFormData(prev => ({
                 ...prev,
                 fullName: user.name || '',
                 email: user.email || '',
                 phone: (user.phone || user.phoneNumber || '').replace('+91 ', ''),
               }));
            }
          }
        } catch (err) {
          console.error("Failed to fetch addresses:", err);
        }
      }
    };
    
    fetchUserAddresses();
  }, [user]);

  const handleSelectSavedAddress = (addr) => {
    setSelectedAddressId(addr.id);
    setFormData(prev => ({
      ...prev,
      fullName: user?.name || prev.fullName,
      email: user?.email || prev.email,
      phone: (user?.phone || user?.phoneNumber || '').replace('+91 ', '') || prev.phone,
      addressLine1: addr.street || '',
      addressLine2: '',
      city: addr.city || '',
      state: addr.stateName || addr.stateCode || '',
      pincode: addr.zip || '',
      country: addr.countryName || addr.countryCode || 'India',
    }));
  };

  const handleChange = (field, value) => {
    if (field === 'phone') {
      value = value.replace(/\D/g, '').slice(0, 10);
    }
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handlePincodeChange = async (e) => {
    const val = e.target.value;
    handleChange('pincode', val);
    
    if (formData.country === 'India' && val.length === 6) {
      try {
        const res = await fetch(`https://api.postalpincode.in/pincode/${val}`);
        const data = await res.json();
        if (data && data[0] && data[0].Status === 'Success') {
          const postOffice = data[0].PostOffice[0];
          handleChange('city', postOffice.District || postOffice.Block || postOffice.Name);
          handleChange('state', postOffice.State);
        }
      } catch (err) {
        console.error("Failed to fetch pincode details", err);
      }
    }
  };

  const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  const totalPayable = Math.max(0, subtotal - discountAmount);

  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    
    if (isLoading) return;

    if (user?.uid) {
       try {
         const docRef = doc(db, 'users', user.uid);
         let newAddresses = [...savedAddresses];
         
         if (selectedAddressId) {
            newAddresses = newAddresses.map(addr => {
               if (addr.id === selectedAddressId) {
                 return {
                   ...addr,
                   street: formData.addressLine1,
                   city: formData.city,
                   zip: formData.pincode,
                   countryName: formData.country,
                   stateName: formData.state,
                 };
               }
               return addr;
            });
            await updateDoc(docRef, { addresses: newAddresses });
         } else if (saveNewAddress && savedAddresses.length < 3) {
            newAddresses.push({
               id: Date.now().toString(),
               street: formData.addressLine1,
               city: formData.city,
               zip: formData.pincode,
               countryName: formData.country,
               stateName: formData.state,
               isDefault: savedAddresses.length === 0,
            });
            await updateDoc(docRef, { addresses: newAddresses });
         }
       } catch (err) {
         console.error("Error updating address on order:", err);
       }
    }

    if (cart.length === 0) {
      alert("Your cart is empty.");
      return;
    }

    setIsLoading(true);
    try {
      // 1. Create order in Firestore
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: cart.map(item => ({ ...item, name: item.title || item.name || 'Unknown Item' })),
          customer_id: user?.uid || null,
          customer_info: {
            name: formData.fullName,
            email: formData.email,
            phone: '+91 ' + formData.phone,
            country: formData.country,
            instagram: formData.instagram
          },
          shipping_address: {
            addressLine1: formData.addressLine1,
            addressLine2: formData.addressLine2,
            city: formData.city,
            state: formData.state,
            pincode: formData.pincode,
            country: formData.country
          },
          product_total: subtotal,
          discount_amount: discountAmount,
          payable_amount: totalPayable,
          coupon_code: appliedCoupon?.code || null
        })
      });

      if (!response.ok) {
        let errorMsg = 'Failed to create order';
        try {
          const text = await response.text();
          try {
            const data = JSON.parse(text);
            errorMsg = data.message || JSON.stringify(data);
          } catch (e) {
            errorMsg = `Server Error (${response.status}): ` + text.substring(0, 100);
          }
        } catch (e) {}
        throw new Error(errorMsg);
      }

      const data = await response.json();
      const { db_order_id, order_id, amount, currency } = data;
      
      if (typeof window.Razorpay === 'undefined') {
        throw new Error('Razorpay script not loaded. Please try again.');
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
              // Clear cart using the store action to sync with Firestore
              if (typeof clearCart === 'function') {
                await clearCart();
              } else {
                useCartStore.setState({ cart: [], discountAmount: 0, appliedCoupon: null });
              }
              // Redirect to new success page
              router.push(`/order-success?orderId=${db_order_id}`);
            } else {
              alert('Payment verification failed: ' + verifyData.message);
              setIsLoading(false);
            }
          } catch (error) {
            console.error('Verify error:', error);
            alert('Payment verification failed.');
            setIsLoading(false);
          }
        },
        prefill: {
          name: formData.fullName,
          email: formData.email,
          contact: '+91' + formData.phone,
        },
        theme: {
          color: '#000000',
        },
        modal: {
          ondismiss: function () {
            setIsLoading(false);
          },
        },
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.on('payment.failed', function (response) {
        alert(response.error.description);
        setIsLoading(false);
      });
      paymentObject.open();
      
    } catch (err) {
      console.error(err);
      alert("Error placing order: " + err.message);
      setIsLoading(false);
    }
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-black selection:bg-black selection:text-white pb-20 lg:pb-0" style={{ fontFamily: 'var(--font-dm-sans, "DM Sans", sans-serif)' }}>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />
      
      <div className="w-full bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between sticky top-0 z-30">
        <Link href="/" className="flex items-center gap-2 group">
          <ArrowLeft className="w-4 h-4 text-gray-400 group-hover:text-black transition-colors" />
          <span className="text-xs font-bold uppercase tracking-widest text-gray-500 group-hover:text-black transition-colors">Return to Shop</span>
        </Link>
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-green-500" />
          <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Secure SSL Checkout</span>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto lg:flex lg:h-[calc(100vh-61px)]">
        
        <div className="flex-1 overflow-y-auto px-6 py-10 lg:px-16 lg:py-16 bg-white">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-2xl mx-auto"
          >
            <h1 className="text-4xl lg:text-5xl mb-2 tracking-normal" style={{ fontFamily: 'var(--font-perandory, "Perandory", sans-serif)' }}>Checkout.</h1>
            <p className="text-gray-500 font-medium text-sm mb-10">Please enter your details to complete your order.</p>

            <form id="checkout-form" onSubmit={handlePlaceOrder} className="space-y-12">
              
              <div className="space-y-6">
                <div className="flex items-center gap-3 border-b border-gray-100 pb-3">
                  <span className="w-6 h-6 rounded-full bg-black text-white flex items-center justify-center text-xs font-bold">1</span>
                  <h2 className="text-lg font-bold tracking-tight">Contact Information</h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <InputField label="Full Name" value={formData.fullName} onChange={e => handleChange('fullName', e.target.value)} required />
                  <InputField label="Email Address" type="email" value={formData.email} onChange={e => handleChange('email', e.target.value)} required />
                  
                  <div className="w-full">
                    <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-1.5">
                      Phone Number <span className="text-red-500">*</span>
                    </label>
                    <div className="flex">
                      <span className="border-b-2 border-gray-200 text-gray-900 py-2 text-sm font-bold w-16 flex items-center select-none">+91</span>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={e => handleChange('phone', e.target.value)}
                        placeholder="Phone Number"
                        required
                        className="w-full bg-transparent border-b-2 border-gray-200 focus:border-black text-gray-900 placeholder-gray-400 py-2 outline-none transition-colors text-sm font-medium pl-3"
                      />
                    </div>
                  </div>

                  <InputField label="Instagram Handle (Optional)" placeholder="@username" value={formData.instagram} onChange={e => handleChange('instagram', e.target.value)} />
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex items-center gap-3 border-b border-gray-100 pb-3">
                  <span className="w-6 h-6 rounded-full bg-black text-white flex items-center justify-center text-xs font-bold">2</span>
                  <h2 className="text-lg font-bold tracking-tight">Delivery Address</h2>
                </div>
                
                {savedAddresses.length > 0 && (
                  <div className="mb-6">
                     <p className="text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-3">Saved Addresses</p>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                       {savedAddresses.map(addr => (
                          <div 
                            key={addr.id} 
                            onClick={() => handleSelectSavedAddress(addr)}
                            className={`border p-4 rounded-xl cursor-pointer transition-all ${selectedAddressId === addr.id ? 'border-black bg-gray-50' : 'border-gray-200 hover:border-black/50'}`}
                          >
                             {addr.isDefault && <span className="text-[9px] bg-black text-white px-2 py-0.5 rounded uppercase font-bold tracking-widest mb-2 inline-block">Default</span>}
                             <p className="text-sm font-bold text-black">{addr.street}</p>
                             <p className="text-xs text-gray-500 mt-1">{addr.city}, {addr.stateName} {addr.zip}</p>
                             <p className="text-xs text-gray-500">{addr.countryName}</p>
                          </div>
                       ))}
                     </div>
                     {selectedAddressId && (
                       <button type="button" onClick={() => { 
                         setSelectedAddressId(null); 
                         setFormData(prev => ({...prev, addressLine1: '', addressLine2: '', city: '', state: '', pincode: '', country: 'India'})); 
                       }} className="mt-4 text-[10px] font-bold uppercase tracking-widest text-black border-b border-black pb-0.5 hover:text-gray-600 transition-colors">
                         Enter a new address instead
                       </button>
                     )}
                  </div>
                )}

                <div className="space-y-6">
                  <div className="w-full">
                    <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-1.5">Country / Region</label>
                    <input
                      type="text"
                      readOnly
                      value="India"
                      className="w-full bg-transparent border-b-2 border-gray-200 text-gray-900 py-2 outline-none text-sm font-medium cursor-default"
                    />
                  </div>
                  
                  <InputField label="Address Line 1" placeholder="Street address, P.O. box, etc." value={formData.addressLine1} onChange={e => handleChange('addressLine1', e.target.value)} required />
                  <InputField label="Address Line 2 (Optional)" placeholder="Apartment, suite, unit, building, floor, etc." value={formData.addressLine2} onChange={e => handleChange('addressLine2', e.target.value)} />
                  
                  <div className="grid grid-cols-2 gap-6">
                    <InputField label="City" value={formData.city} onChange={e => handleChange('city', e.target.value)} required />
                    <InputField label="State / Province" value={formData.state} onChange={e => handleChange('state', e.target.value)} required />
                  </div>
                  <div className="w-1/2 pr-3">
                    <InputField label="Postal / ZIP Code" value={formData.pincode} onChange={handlePincodeChange} required />
                  </div>

                  {!selectedAddressId && user && savedAddresses.length < 3 && (
                    <div className="flex items-center gap-2 mt-4">
                      <input 
                        type="checkbox" 
                        id="saveNewAddress" 
                        checked={saveNewAddress}
                        onChange={(e) => setSaveNewAddress(e.target.checked)}
                        className="w-4 h-4 accent-black"
                      />
                      <label htmlFor="saveNewAddress" className="text-sm font-dm-sans font-medium text-gray-700">Save this address to my profile</label>
                    </div>
                  )}
                </div>
              </div>

            </form>
          </motion.div>
        </div>

        <div className="w-full lg:w-[450px] xl:w-[550px] bg-[#FAFAFA] lg:border-l border-gray-200 overflow-y-auto">
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="p-6 lg:p-10"
          >
            <h2 className="text-3xl mb-6 tracking-normal" style={{ fontFamily: 'var(--font-gambetta, "Gambetta", serif)', fontStyle: 'italic', fontWeight: 400 }}>Order Summary</h2>

            <div className="space-y-6 mb-8 max-h-[40vh] overflow-y-auto pr-4 pt-3 hide-scrollbar">
              {cart.map((item) => (
                <div key={item.cartItemId || item.id} className="flex gap-5">
                  <div className="relative w-24 h-28 shrink-0">
                    <div className="w-full h-full bg-gray-100 rounded-xl overflow-hidden border border-gray-200 relative z-0">
                      {item.image && <Image src={item.image} alt={item.title} fill className="object-cover" />}
                    </div>
                    <div className="absolute -top-2.5 -right-2.5 w-6 h-6 bg-black text-white text-[11px] font-bold rounded-full flex items-center justify-center z-20 shadow-md border-2 border-white">
                      {item.quantity}
                    </div>
                  </div>
                  <div className="flex-1 flex flex-col justify-center py-1">
                    <h3 className="text-[15px] font-bold leading-snug line-clamp-2 text-gray-900">{item.title}</h3>
                    <p className="text-xs text-gray-500 mt-1.5 uppercase tracking-widest font-semibold">{item.size && `Size: ${item.size}`} {item.color && `| Color: ${item.color}`}</p>
                    
                    <div className="flex items-center justify-between mt-3">
                      <p className="text-[15px] font-black text-black"><PriceDisplay basePrice={item.price} /></p>
                      
                      <div className="flex items-center bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden h-7">
                        <button type="button" onClick={() => updateQuantity(item.cartItemId || item.id, -1)} className="w-7 h-full flex items-center justify-center text-gray-500 hover:text-black hover:bg-gray-50 transition-colors">
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-5 text-center text-xs font-bold text-black">{item.quantity}</span>
                        <button type="button" onClick={() => updateQuantity(item.cartItemId || item.id, 1)} className="w-7 h-full flex items-center justify-center text-gray-500 hover:text-black hover:bg-gray-50 transition-colors">
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-3 border-t border-gray-200 pt-6 mb-6">
              <div className="flex justify-between text-sm font-medium text-gray-600">
                <span>Subtotal</span>
                <span><PriceDisplay basePrice={subtotal} /></span>
              </div>
              {appliedCoupon && (
                <div className="flex justify-between text-sm font-medium text-green-600">
                  <span>Discount ({appliedCoupon.code})</span>
                  <span>-<PriceDisplay basePrice={discountAmount} /></span>
                </div>
              )}
            </div>

            <div className="border-t border-gray-200 pt-6 mb-8">
              <div className="flex justify-between items-end mb-2">
                <span className="text-lg font-bold">Payable Now</span>
                <span className="text-3xl font-black tracking-tighter"><PriceDisplay basePrice={totalPayable} /></span>
              </div>
              <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mt-4 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-20 h-20 bg-blue-500/5 rounded-bl-full pointer-events-none"></div>
                <h4 className="text-xs font-bold text-blue-900 uppercase tracking-widest mb-1">Important Notice</h4>
                <p className="text-[13px] text-blue-800/80 leading-relaxed font-medium">
                  You are paying the <strong className="text-blue-900">product price only</strong> right now. International and domestic shipping charges will be billed separately at a later stage.
                </p>
              </div>
            </div>

            <button 
              type="submit"
              form="checkout-form"
              disabled={isLoading}
              className={`w-full bg-black text-white py-5 rounded-2xl font-bold tracking-wide transition-all flex items-center justify-center gap-2 shadow-xl shadow-black/10 group relative overflow-hidden ${isLoading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-gray-800 active:scale-[0.98]'}`}
            >
              {!isLoading && <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform ease-out duration-300"></div>}
              <span className="relative z-10 flex items-center gap-2">
                {isLoading ? 'Processing...' : (
                  <>
                    Place Order & Pay <PriceDisplay basePrice={totalPayable} /> <ChevronRight className="w-5 h-5" />
                  </>
                )}
              </span>
            </button>

            <div className="mt-6 flex items-center justify-center gap-2 text-xs font-semibold text-gray-400 uppercase tracking-widest">
              <CreditCard className="w-4 h-4" /> Secured by Razorpay
            </div>

          </motion.div>
        </div>
      </div>
    </div>
  );
}
