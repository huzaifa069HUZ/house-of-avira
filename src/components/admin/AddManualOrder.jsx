'use client';

import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, addDoc, getDocs, query, orderBy, serverTimestamp } from 'firebase/firestore';
import { 
  ArrowLeft, Search, Plus, Trash2, Package, User, MapPin, 
  CreditCard, Loader2, Save, ShoppingBag, Truck
} from 'lucide-react';
import { 
  ORDER_STATUS, 
  PRODUCT_PAYMENT_STATUS, 
  SHIPPING_PAYMENT_STATUS,
  WEIGHT_STATUS 
} from '@/lib/shipping-constants';
import Image from 'next/image';

// Helper to generate IDs
const generateId = () => Math.random().toString(36).substring(2, 15);

export default function AddManualOrder({ onSuccess, onCancel }) {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  
  // Products Search State
  const [allProducts, setAllProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  
  // Order State
  const [selectedItems, setSelectedItems] = useState([]);
  const [customer, setCustomer] = useState({
    name: '', email: '', phone: '', instagram: ''
  });
  const [address, setAddress] = useState({
    addressLine1: '', addressLine2: '', city: '', state: '', pincode: '', country: 'India'
  });
  const [financials, setFinancials] = useState({
    discount: 0, shipping: 0
  });
  const [orderConfig, setOrderConfig] = useState({
    status: ORDER_STATUS.PLACED,
    paymentStatus: PRODUCT_PAYMENT_STATUS.PENDING,
    paymentMethod: 'CASH', // Default for manual
  });

  // Fetch all products on mount for client-side searching
  useEffect(() => {
    async function fetchProducts() {
      try {
        setLoading(true);
        const q = query(collection(db, 'products'), orderBy('createdAt', 'desc'));
        const snapshot = await getDocs(q);
        setAllProducts(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } catch (err) {
        console.error("Error fetching products:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);

  const searchResults = searchQuery.trim() === '' 
    ? [] 
    : allProducts.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase())).slice(0, 5);

  const addItem = (product) => {
    const newItem = {
      id: product.id,
      cartItemId: generateId(),
      name: product.name,
      price: product.price,
      quantity: 1,
      image: product.imageUrl || (product.images && product.images[0]) || '',
      selectedSize: product.sizes?.length > 0 ? product.sizes[0] : null,
      selectedColor: product.swatches?.length > 0 ? product.swatches[0].colorName : null,
      category: product.category,
      weight: product.weight || 0
    };
    setSelectedItems([...selectedItems, newItem]);
    setSearchQuery('');
  };

  const removeItem = (cartItemId) => {
    setSelectedItems(selectedItems.filter(item => item.cartItemId !== cartItemId));
  };

  const updateItem = (cartItemId, field, value) => {
    setSelectedItems(selectedItems.map(item => 
      item.cartItemId === cartItemId ? { ...item, [field]: value } : item
    ));
  };

  const subtotal = selectedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const total = subtotal - (Number(financials.discount) || 0) + (Number(financials.shipping) || 0);

  const handleSave = async () => {
    if (selectedItems.length === 0) return setError("Please add at least one product.");
    if (!customer.name || !customer.phone) return setError("Customer name and phone are required.");
    if (!address.addressLine1 || !address.city || !address.state || !address.pincode) return setError("Complete shipping address is required.");

    setSaving(true);
    setError('');

    try {
      const orderData = {
        // Customer
        customer_name: customer.name,
        customer_email: customer.email || `${customer.phone}@manual.order`,
        customer_phone: customer.phone,
        customer_country: address.country,
        instagram: customer.instagram,
        
        // Items
        items: selectedItems,
        items_count: selectedItems.reduce((sum, item) => sum + item.quantity, 0),
        
        // Shipping Address
        shipping_address: {
          ...address,
          firstName: customer.name.split(' ')[0] || '',
          lastName: customer.name.split(' ').slice(1).join(' ') || ''
        },

        // Financials
        product_total: subtotal,
        discount_amount: Number(financials.discount) || 0,
        shipping_due_amount: Number(financials.shipping) || 0,
        payable_amount: total,
        
        // Statuses
        order_status: orderConfig.status,
        product_payment_status: orderConfig.paymentStatus,
        payment_method: orderConfig.paymentMethod,
        shipping_payment_status: Number(financials.shipping) > 0 ? SHIPPING_PAYMENT_STATUS.PENDING : SHIPPING_PAYMENT_STATUS.NOT_APPLICABLE,
        weight_status: WEIGHT_STATUS.PENDING,
        
        // Timestamps
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        is_manual_order: true
      };

      await addDoc(collection(db, 'orders'), orderData);
      onSuccess();
    } catch (err) {
      console.error("Error saving manual order:", err);
      setError("Failed to save order: " + err.message);
      setSaving(false);
    }
  };

  return (
    <div className="bg-[#F5F5F7] font-dm-sans rounded-2xl overflow-hidden border border-[#d2d2d7]/50 shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b border-[#d2d2d7]/50 px-6 py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-4">
          <button onClick={onCancel} className="p-2 hover:bg-[#e5e5ea] rounded-full transition-colors text-[#86868b] hover:text-black shrink-0">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h2 className="text-xl font-semibold text-black tracking-tight">Create Manual Order</h2>
            <p className="text-xs text-[#86868b] mt-0.5 tracking-wide">Enter details for offline or manual sales</p>
          </div>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button onClick={onCancel} className="w-full sm:w-auto px-4 py-2 text-sm font-medium text-[#86868b] hover:text-black transition-colors rounded-full hover:bg-[#e5e5ea]">
            Cancel
          </button>
          <button 
            onClick={handleSave} 
            disabled={saving}
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-[#0071e3] hover:bg-[#0077ED] text-white px-5 py-2 rounded-full text-sm font-medium transition-colors shadow-sm disabled:opacity-50 shrink-0"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Save Order
          </button>
        </div>
      </div>

      <div className="p-6">
        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl border border-red-100 text-sm font-medium animate-in fade-in">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Products & Status */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Products Section */}
            <div className="bg-white rounded-2xl p-6 border border-[#d2d2d7]/50 shadow-sm">
              <h3 className="text-sm font-bold text-black uppercase tracking-wider mb-4 flex items-center gap-2">
                <Package className="w-4 h-4 text-[#86868b]" /> Select Products
              </h3>
              
              {/* Product Search */}
              <div className="relative mb-6">
                <div className="relative">
                  <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-[#86868b]" />
                  <input
                    type="text"
                    placeholder="Search products by name..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-[#F5F5F7] border border-transparent rounded-xl text-sm text-black placeholder-[#86868b] focus:bg-white focus:border-[#d2d2d7] focus:ring-4 focus:ring-[#0071e3]/10 transition-all outline-none"
                  />
                  {loading && <Loader2 className="w-4 h-4 absolute right-4 top-1/2 -translate-y-1/2 text-[#0071e3] animate-spin" />}
                </div>

                {searchResults.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-2xl border border-[#d2d2d7]/50 overflow-hidden z-30 divide-y divide-[#d2d2d7]/30">
                    {searchResults.map(product => (
                      <div 
                        key={product.id}
                        onClick={() => addItem(product)}
                        className="flex items-center gap-3 p-3 hover:bg-[#F5F5F7] cursor-pointer transition-colors"
                      >
                        <div className="w-10 h-10 rounded bg-[#e5e5ea] relative overflow-hidden flex-shrink-0">
                          {(product.imageUrl || (product.images && product.images[0])) && (
                            <Image src={product.imageUrl || product.images[0]} alt={product.name} fill className="object-cover" />
                          )}
                        </div>
                        <div className="flex-1">
                          <h4 className="text-sm font-medium text-black line-clamp-1">{product.name}</h4>
                          <p className="text-xs text-[#86868b]">₹{product.price}</p>
                        </div>
                        <Plus className="w-5 h-5 text-[#0071e3]" />
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Selected Products List */}
              <div className="space-y-4">
                {selectedItems.length === 0 ? (
                  <div className="text-center py-10 text-[#86868b] text-sm bg-[#FAFAFA] rounded-xl border border-dashed border-[#d2d2d7]">
                    Search and select products to add to this order.
                  </div>
                ) : (
                  selectedItems.map((item) => (
                    <div key={item.cartItemId} className="flex flex-col sm:flex-row gap-4 p-4 bg-white rounded-xl border border-[#d2d2d7]/50 items-start sm:items-center shadow-sm">
                      <div className="w-16 h-16 rounded-lg bg-[#e5e5ea] relative overflow-hidden flex-shrink-0">
                        {item.image && <Image src={item.image} alt={item.name} fill className="object-cover" />}
                      </div>
                      <div className="flex-1 space-y-2 w-full">
                        <h4 className="text-sm font-medium text-black line-clamp-1">{item.name}</h4>
                        <div className="flex flex-wrap gap-3">
                          <select 
                            value={item.quantity} 
                            onChange={(e) => updateItem(item.cartItemId, 'quantity', Number(e.target.value))}
                            className="bg-[#F5F5F7] border border-transparent hover:border-[#d2d2d7] rounded-md text-xs px-2 py-1.5 focus:ring-2 focus:ring-[#0071e3] outline-none cursor-pointer"
                          >
                            {[...Array(10)].map((_, i) => (
                              <option key={i+1} value={i+1}>Qty: {i+1}</option>
                            ))}
                          </select>
                          <input 
                            type="text" 
                            placeholder="Size" 
                            value={item.selectedSize || ''}
                            onChange={(e) => updateItem(item.cartItemId, 'selectedSize', e.target.value)}
                            className="w-20 bg-[#F5F5F7] border border-transparent hover:border-[#d2d2d7] rounded-md text-xs px-2 py-1.5 focus:bg-white focus:ring-2 focus:ring-[#0071e3] outline-none transition-all placeholder-[#86868b]"
                          />
                          <input 
                            type="text" 
                            placeholder="Color" 
                            value={item.selectedColor || ''}
                            onChange={(e) => updateItem(item.cartItemId, 'selectedColor', e.target.value)}
                            className="w-24 bg-[#F5F5F7] border border-transparent hover:border-[#d2d2d7] rounded-md text-xs px-2 py-1.5 focus:bg-white focus:ring-2 focus:ring-[#0071e3] outline-none transition-all placeholder-[#86868b]"
                          />
                        </div>
                      </div>
                      <div className="text-right flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-2">
                        <span className="text-sm font-semibold text-black tracking-tight">₹{item.price * item.quantity}</span>
                        <button onClick={() => removeItem(item.cartItemId)} className="text-red-500 hover:bg-red-50 p-1.5 rounded-full transition-colors" title="Remove Item">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Order Settings & Status */}
            <div className="bg-white rounded-2xl p-6 border border-[#d2d2d7]/50 shadow-sm">
              <h3 className="text-sm font-bold text-black uppercase tracking-wider mb-5 flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-[#86868b]" /> Order Settings
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div>
                  <label className="block text-xs font-semibold text-[#86868b] mb-1.5">Order Status</label>
                  <select 
                    value={orderConfig.status}
                    onChange={e => setOrderConfig({...orderConfig, status: e.target.value})}
                    className="w-full px-3 py-2 bg-[#F5F5F7] border border-transparent hover:border-[#d2d2d7] rounded-lg text-sm text-black focus:ring-2 focus:ring-[#0071e3] outline-none transition-all cursor-pointer"
                  >
                    {Object.values(ORDER_STATUS).map(s => <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#86868b] mb-1.5">Payment Status</label>
                  <select 
                    value={orderConfig.paymentStatus}
                    onChange={e => setOrderConfig({...orderConfig, paymentStatus: e.target.value})}
                    className="w-full px-3 py-2 bg-[#F5F5F7] border border-transparent hover:border-[#d2d2d7] rounded-lg text-sm text-black focus:ring-2 focus:ring-[#0071e3] outline-none transition-all cursor-pointer"
                  >
                    {Object.values(PRODUCT_PAYMENT_STATUS).map(s => <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#86868b] mb-1.5">Payment Method</label>
                  <select 
                    value={orderConfig.paymentMethod}
                    onChange={e => setOrderConfig({...orderConfig, paymentMethod: e.target.value})}
                    className="w-full px-3 py-2 bg-[#F5F5F7] border border-transparent hover:border-[#d2d2d7] rounded-lg text-sm text-black focus:ring-2 focus:ring-[#0071e3] outline-none transition-all cursor-pointer"
                  >
                    <option value="CASH">Cash</option>
                    <option value="BANK_TRANSFER">Bank Transfer</option>
                    <option value="UPI">UPI</option>
                    <option value="MANUAL">Manual / Other</option>
                  </select>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: Customer & Summary */}
          <div className="space-y-6">
            
            {/* Customer Details */}
            <div className="bg-white rounded-2xl p-6 border border-[#d2d2d7]/50 shadow-sm">
              <h3 className="text-sm font-bold text-black uppercase tracking-wider mb-5 flex items-center gap-2">
                <User className="w-4 h-4 text-[#86868b]" /> Customer Details
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-[#86868b] mb-1.5">Full Name *</label>
                  <input type="text" value={customer.name} onChange={e => setCustomer({...customer, name: e.target.value})} placeholder="John Doe" className="w-full px-3 py-2 bg-[#F5F5F7] border border-transparent rounded-lg text-sm text-black focus:bg-white focus:border-[#d2d2d7] focus:ring-4 focus:ring-[#0071e3]/10 transition-all outline-none placeholder-[#86868b]/50" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#86868b] mb-1.5">Phone Number *</label>
                  <input type="tel" value={customer.phone} onChange={e => setCustomer({...customer, phone: e.target.value})} placeholder="+91 9876543210" className="w-full px-3 py-2 bg-[#F5F5F7] border border-transparent rounded-lg text-sm text-black focus:bg-white focus:border-[#d2d2d7] focus:ring-4 focus:ring-[#0071e3]/10 transition-all outline-none placeholder-[#86868b]/50" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#86868b] mb-1.5">Email Address</label>
                  <input type="email" value={customer.email} onChange={e => setCustomer({...customer, email: e.target.value})} placeholder="john@example.com" className="w-full px-3 py-2 bg-[#F5F5F7] border border-transparent rounded-lg text-sm text-black focus:bg-white focus:border-[#d2d2d7] focus:ring-4 focus:ring-[#0071e3]/10 transition-all outline-none placeholder-[#86868b]/50" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#86868b] mb-1.5">Instagram Handle</label>
                  <input type="text" value={customer.instagram} onChange={e => setCustomer({...customer, instagram: e.target.value})} placeholder="@johndoe" className="w-full px-3 py-2 bg-[#F5F5F7] border border-transparent rounded-lg text-sm text-black focus:bg-white focus:border-[#d2d2d7] focus:ring-4 focus:ring-[#0071e3]/10 transition-all outline-none placeholder-[#86868b]/50" />
                </div>
              </div>
            </div>

            {/* Shipping Address */}
            <div className="bg-white rounded-2xl p-6 border border-[#d2d2d7]/50 shadow-sm">
              <h3 className="text-sm font-bold text-black uppercase tracking-wider mb-5 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#86868b]" /> Shipping Address
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-[#86868b] mb-1.5">Address Line 1 *</label>
                  <input type="text" value={address.addressLine1} onChange={e => setAddress({...address, addressLine1: e.target.value})} placeholder="House No, Street Name" className="w-full px-3 py-2 bg-[#F5F5F7] border border-transparent rounded-lg text-sm text-black focus:bg-white focus:border-[#d2d2d7] focus:ring-4 focus:ring-[#0071e3]/10 transition-all outline-none placeholder-[#86868b]/50" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#86868b] mb-1.5">Address Line 2 (Optional)</label>
                  <input type="text" value={address.addressLine2} onChange={e => setAddress({...address, addressLine2: e.target.value})} placeholder="Landmark, Apartment" className="w-full px-3 py-2 bg-[#F5F5F7] border border-transparent rounded-lg text-sm text-black focus:bg-white focus:border-[#d2d2d7] focus:ring-4 focus:ring-[#0071e3]/10 transition-all outline-none placeholder-[#86868b]/50" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#86868b] mb-1.5">City *</label>
                    <input type="text" value={address.city} onChange={e => setAddress({...address, city: e.target.value})} placeholder="Mumbai" className="w-full px-3 py-2 bg-[#F5F5F7] border border-transparent rounded-lg text-sm text-black focus:bg-white focus:border-[#d2d2d7] focus:ring-4 focus:ring-[#0071e3]/10 transition-all outline-none placeholder-[#86868b]/50" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#86868b] mb-1.5">Pincode *</label>
                    <input type="text" value={address.pincode} onChange={e => setAddress({...address, pincode: e.target.value})} placeholder="400001" className="w-full px-3 py-2 bg-[#F5F5F7] border border-transparent rounded-lg text-sm text-black focus:bg-white focus:border-[#d2d2d7] focus:ring-4 focus:ring-[#0071e3]/10 transition-all outline-none placeholder-[#86868b]/50" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#86868b] mb-1.5">State *</label>
                    <input type="text" value={address.state} onChange={e => setAddress({...address, state: e.target.value})} placeholder="Maharashtra" className="w-full px-3 py-2 bg-[#F5F5F7] border border-transparent rounded-lg text-sm text-black focus:bg-white focus:border-[#d2d2d7] focus:ring-4 focus:ring-[#0071e3]/10 transition-all outline-none placeholder-[#86868b]/50" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#86868b] mb-1.5">Country *</label>
                    <input type="text" value={address.country} onChange={e => setAddress({...address, country: e.target.value})} placeholder="India" className="w-full px-3 py-2 bg-[#F5F5F7] border border-transparent rounded-lg text-sm text-black focus:bg-white focus:border-[#d2d2d7] focus:ring-4 focus:ring-[#0071e3]/10 transition-all outline-none placeholder-[#86868b]/50" />
                  </div>
                </div>
              </div>
            </div>

            {/* Financial Summary */}
            <div className="bg-white rounded-2xl p-6 border border-[#d2d2d7]/50 shadow-sm">
              <h3 className="text-sm font-bold text-black uppercase tracking-wider mb-5 flex items-center gap-2">
                <ShoppingBag className="w-4 h-4 text-[#86868b]" /> Order Summary
              </h3>
              
              <div className="space-y-4 text-sm text-black font-medium">
                <div className="flex justify-between items-center bg-[#F5F5F7] p-3 rounded-lg border border-[#d2d2d7]/30">
                  <span className="text-[#86868b]">Subtotal</span>
                  <span className="tracking-tight">₹{subtotal}</span>
                </div>
                <div className="flex justify-between items-center p-1">
                  <span className="text-[#86868b]">Manual Discount (-)</span>
                  <div className="relative w-28">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#86868b] text-xs">₹</span>
                    <input type="number" min="0" value={financials.discount} onChange={e => setFinancials({...financials, discount: e.target.value})} className="w-full pl-7 pr-3 py-1.5 bg-[#F5F5F7] border border-transparent rounded-lg text-right focus:bg-white focus:border-[#0071e3] focus:ring-2 focus:ring-[#0071e3]/10 outline-none transition-all" />
                  </div>
                </div>
                <div className="flex justify-between items-center p-1">
                  <span className="text-[#86868b]">Shipping Cost (+)</span>
                  <div className="relative w-28">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#86868b] text-xs">₹</span>
                    <input type="number" min="0" value={financials.shipping} onChange={e => setFinancials({...financials, shipping: e.target.value})} className="w-full pl-7 pr-3 py-1.5 bg-[#F5F5F7] border border-transparent rounded-lg text-right focus:bg-white focus:border-[#0071e3] focus:ring-2 focus:ring-[#0071e3]/10 outline-none transition-all" />
                  </div>
                </div>
                
                <div className="pt-5 border-t border-[#d2d2d7]/50 flex justify-between items-end mt-2">
                  <span className="text-base font-bold text-[#86868b]">Total Payable</span>
                  <span className="text-3xl font-bold tracking-tighter text-[#0071e3]">₹{total > 0 ? total : 0}</span>
                </div>
              </div>

              <button 
                onClick={handleSave} 
                disabled={saving || selectedItems.length === 0}
                className="w-full mt-6 flex items-center justify-center gap-2 bg-black hover:bg-gray-800 text-white px-5 py-4 rounded-xl font-bold tracking-wide transition-all shadow-md active:scale-[0.98] disabled:opacity-50 disabled:active:scale-100"
              >
                {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Create Order'}
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
