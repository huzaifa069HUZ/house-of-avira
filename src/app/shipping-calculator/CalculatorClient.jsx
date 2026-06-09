'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Calculator, Sparkles } from 'lucide-react';
import { db } from '@/lib/firebase';
import { collection, getDocs } from 'firebase/firestore';

export default function CalculatorClient() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  
  const [selectedCat, setSelectedCat] = useState('');
  const [selectedProductId, setSelectedProductId] = useState('');
  const [mode, setMode] = useState('air');
  const [weight, setWeight] = useState(500);
  const [loading, setLoading] = useState(true);

  const [costs, setCosts] = useState({
    intlLow: 0, intlHigh: 0,
    customsLow: 0, customsHigh: 0,
    gstLow: 0, gstHigh: 0,
    domLow: 0, domHigh: 0,
    totalLow: 0, totalHigh: 0
  });

  // Fetch products from Firebase
  useEffect(() => {
    async function fetchProducts() {
      try {
        const querySnapshot = await getDocs(collection(db, 'products'));
        const fetchedProducts = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        
        setProducts(fetchedProducts);

        // Extract unique categories (using subcategory or category)
        const uniqueCats = [...new Set(fetchedProducts.map(p => p.subcategory || p.category || 'Other').filter(Boolean))];
        setCategories(uniqueCats);

        if (uniqueCats.length > 0) {
          setSelectedCat(uniqueCats[0]);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);

  // Update selected product when category changes
  useEffect(() => {
    const productsInCat = products.filter(p => (p.subcategory || p.category || 'Other') === selectedCat);
    if (productsInCat.length > 0) {
      setSelectedProductId(productsInCat[0].id);
    } else {
      setSelectedProductId('');
    }
  }, [selectedCat, products]);

  // Calculate costs
  useEffect(() => {
    const seaBase = 0.8, airBase = 2.2;
    const modeMult = mode === 'air' ? airBase : seaBase;

    // Int. Shipping based purely on weight
    const intlLow = Math.round(weight * modeMult * 0.85);
    const intlHigh = Math.round(weight * modeMult * 1.25);

    // Get selected product price
    const product = products.find(p => p.id === selectedProductId);
    const productVal = product?.price ? Number(product.price) : 3000;

    // Determine customs rate based on category string
    const catStr = (selectedCat || '').toLowerCase();
    let rate = 0.15; // default for accessories/others
    if (catStr.includes('bag')) rate = 0.10;
    else if (catStr.includes('shoe') || catStr.includes('footwear')) rate = 0.25;
    else if (catStr.includes('dress') || catStr.includes('top') || catStr.includes('jacket') || catStr.includes('trouser') || catStr.includes('apparel')) rate = 0.20;
    else if (catStr.includes('beauty')) rate = 0.18;

    const customsLow = Math.round(productVal * rate * 0.8);
    const customsHigh = Math.round(productVal * rate * 1.2);

    const gstLow = Math.round((intlLow + customsLow) * 0.18);
    const gstHigh = Math.round((intlHigh + customsHigh) * 0.18);
    const domLow = 60, domHigh = 130;

    const totalLow = intlLow + customsLow + gstLow + domLow;
    const totalHigh = intlHigh + customsHigh + gstHigh + domHigh;

    setCosts({
      intlLow, intlHigh,
      customsLow, customsHigh,
      gstLow, gstHigh,
      domLow, domHigh,
      totalLow, totalHigh
    });
  }, [selectedCat, selectedProductId, mode, weight, products]);

  const fmt = (n) => {
    if (isNaN(n) || n === null) return '₹0';
    return '₹' + n.toLocaleString('en-IN');
  };

  const productsInCurrentCat = products.filter(p => (p.subcategory || p.category || 'Other') === selectedCat);

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-[#000000] font-sans pb-24">
      {/* Soft Elegant Header */}
      <div className="bg-[#8A001A] text-white px-6 py-12 md:py-20 relative overflow-hidden rounded-b-[3rem] shadow-xl">
        <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>
        <div className="max-w-5xl mx-auto relative z-10">
          <Link href="/" className="inline-flex items-center gap-2 text-sm font-medium tracking-wide bg-white/10 hover:bg-white/20 backdrop-blur-md px-5 py-2.5 rounded-full transition-all mb-10 border border-white/20">
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </Link>
          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-white/10 backdrop-blur-md text-white rounded-2xl flex items-center justify-center mb-6 border border-white/20 shadow-lg">
              <Sparkles className="w-8 h-8" />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold font-['Syne',sans-serif] tracking-tight mb-4">
              Shipping Estimator
            </h1>
            <p className="text-lg md:text-xl font-['Caveat',cursive] opacity-90 max-w-2xl leading-relaxed tracking-wide">
              No surprises. Just transparent estimates based on India's customs rates.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 md:-mt-16 relative z-20">
        <div className="bg-white rounded-[2rem] p-6 md:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-[#000000]/5">
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
            
            {/* Inputs Form */}
            <div className="flex flex-col gap-6">
              <h2 className="text-2xl font-bold font-['Syne',sans-serif] text-[#000000] mb-2 flex items-center gap-2">
                <Calculator className="w-5 h-5 text-[#8A001A]" />
                Calculate Details
              </h2>
              
              <div className="flex flex-col gap-2.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-[#000000]/60">Product Category</label>
                {loading ? (
                  <div className="w-full bg-[#FAFAFA] border border-[#000000]/10 rounded-xl px-4 py-3.5 text-sm text-[#000000]/50 animate-pulse">Loading categories...</div>
                ) : (
                  <select 
                    value={selectedCat} 
                    onChange={(e) => setSelectedCat(e.target.value)}
                    className="w-full bg-[#FAFAFA] border border-[#000000]/10 text-[#000000] px-4 py-3.5 rounded-xl text-sm font-medium cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#8A001A]/30 focus:border-[#8A001A] transition-all hover:bg-white"
                  >
                    {categories.length === 0 && <option value="">No categories found</option>}
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                )}
              </div>

              <div className="flex flex-col gap-2.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-[#000000]/60">Select Product</label>
                <select 
                  value={selectedProductId} 
                  onChange={(e) => setSelectedProductId(e.target.value)}
                  className="w-full bg-[#FAFAFA] border border-[#000000]/10 text-[#000000] px-4 py-3.5 rounded-xl text-sm font-medium cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#8A001A]/30 focus:border-[#8A001A] transition-all hover:bg-white"
                  disabled={productsInCurrentCat.length === 0}
                >
                  {productsInCurrentCat.length === 0 && <option value="">No products available</option>}
                  {productsInCurrentCat.map(p => (
                    <option key={p.id} value={p.id}>{p.name} (₹{p.price})</option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-2.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-[#000000]/60">Shipping Mode</label>
                <select 
                  value={mode} 
                  onChange={(e) => setMode(e.target.value)}
                  className="w-full bg-[#FAFAFA] border border-[#000000]/10 text-[#000000] px-4 py-3.5 rounded-xl text-sm font-medium cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#8A001A]/30 focus:border-[#8A001A] transition-all hover:bg-white"
                >
                  <option value="sea">Sea Shipping (2–3 months, budget)</option>
                  <option value="air">Air Shipping (~15 days, faster)</option>
                </select>
              </div>

              <div className="flex flex-col gap-2.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-[#000000]/60">Approx. Product Weight (grams)</label>
                <div className="relative">
                  <input 
                    type="number" 
                    value={weight} 
                    onChange={(e) => setWeight(Math.max(100, Math.min(5000, parseInt(e.target.value) || 0)))}
                    min="100" max="5000"
                    className="w-full bg-[#FAFAFA] border border-[#000000]/10 text-[#000000] px-4 py-3.5 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#8A001A]/30 focus:border-[#8A001A] transition-all hover:bg-white pr-12"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-medium text-[#000000]/40">g</span>
                </div>
              </div>
            </div>

            {/* Results Card */}
            <div className="bg-[#FAFAFA] border border-[#000000]/5 rounded-3xl p-6 md:p-8 flex flex-col relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#8A001A]/20 via-[#8A001A] to-[#8A001A]/20"></div>
              
              <h3 className="text-sm font-bold uppercase tracking-widest text-[#000000]/80 mb-8 border-b border-[#000000]/10 pb-4">Estimated Breakdown</h3>
              
              <div className="flex flex-col gap-5 flex-grow">
                <div className="flex justify-between items-center group">
                  <span className="text-sm font-medium text-[#000000]/60 group-hover:text-[#000000] transition-colors">International Shipping</span>
                  <span className="font-semibold text-sm">{fmt(costs.intlLow)} – {fmt(costs.intlHigh)}</span>
                </div>
                <div className="flex justify-between items-center group">
                  <span className="text-sm font-medium text-[#000000]/60 group-hover:text-[#000000] transition-colors">Customs Duty (India)</span>
                  <span className="font-semibold text-sm">{fmt(costs.customsLow)} – {fmt(costs.customsHigh)}</span>
                </div>
                <div className="flex justify-between items-center group">
                  <span className="text-sm font-medium text-[#000000]/60 group-hover:text-[#000000] transition-colors">GST on Import</span>
                  <span className="font-semibold text-sm">{fmt(costs.gstLow)} – {fmt(costs.gstHigh)}</span>
                </div>
                <div className="flex justify-between items-center group">
                  <span className="text-sm font-medium text-[#000000]/60 group-hover:text-[#000000] transition-colors">Domestic Delivery</span>
                  <span className="font-semibold text-sm">{fmt(costs.domLow)} – {fmt(costs.domHigh)}</span>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-[#000000]/10 flex flex-col items-center text-center">
                <span className="text-xs font-semibold uppercase tracking-widest text-[#000000]/60 mb-2">Total Estimated Shipping</span>
                <span className="font-['Syne',sans-serif] text-3xl md:text-4xl font-bold text-[#8A001A]">
                  {fmt(costs.totalLow)} – {fmt(costs.totalHigh)}
                </span>
              </div>
              
              <div className="mt-8 bg-[#8A001A]/5 border border-[#8A001A]/20 p-5 rounded-xl text-center">
                <p className="text-xs font-bold text-[#8A001A] leading-relaxed uppercase tracking-wide">
                  THIS IS JUST AN ESTIMATE RATE. ACTUAL INTERNATIONAL SHIPPING WILL BE SENT TO YOUR MAIL AND REFLECT ON YOUR PROFILE AS WELL WITHIN 14 DAYS OF ORDERING.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Order Process Image Section */}
        <div className="mt-16 bg-white rounded-[2rem] p-6 md:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-[#000000]/5 flex flex-col items-center">
          <h2 className="text-2xl md:text-3xl font-bold font-['Syne',sans-serif] text-[#8A001A] mb-8 text-center tracking-tight">
            How Pre-Ordering Works
          </h2>
          <img 
            src="/order-process.png" 
            alt="Avira Order Process" 
            className="w-full max-w-4xl object-contain rounded-xl"
          />
        </div>
      </div>
    </div>
  );
}
