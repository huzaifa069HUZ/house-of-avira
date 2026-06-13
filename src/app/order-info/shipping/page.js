'use client';

import Link from 'next/link';
import { useEffect } from 'react';

export default function ShippingPage() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) entry.target.classList.add('animate-in');
        });
      },
      { threshold: 0.1 }
    );
    document.querySelectorAll('.fade-up').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-[#FAFAF8]">
      <style jsx>{`
        .fade-up {
          opacity: 0; transform: translateY(40px);
          transition: opacity 0.8s cubic-bezier(0.16,1,0.3,1), transform 0.8s cubic-bezier(0.16,1,0.3,1);
        }
        .fade-up.animate-in { opacity: 1; transform: translateY(0); }
        @keyframes pulse-dot { 0%,100%{opacity:1;} 50%{opacity:0.3;} }
        .pulse-dot { animation: pulse-dot 2s ease-in-out infinite; }
      `}</style>

      {/* ═══════ HERO ═══════ */}
      <section className="relative min-h-[50vh] flex items-end overflow-hidden pt-24">
        <div className="absolute inset-0 bg-[#0A0A0A]">
          <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 80px, rgba(255,255,255,0.08) 80px, rgba(255,255,255,0.08) 81px), repeating-linear-gradient(90deg, transparent, transparent 80px, rgba(255,255,255,0.08) 80px, rgba(255,255,255,0.08) 81px)' }} />
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full" style={{ background: 'radial-gradient(circle, rgba(138,0,26,0.1) 0%, transparent 70%)' }} />
        </div>
        <div className="relative z-10 max-w-5xl mx-auto px-6 md:px-12 pb-16 md:pb-20 w-full">
          <Link href="/order-info" className="inline-flex items-center gap-3 text-white/30 hover:text-white/60 transition-colors text-[10px] tracking-[0.25em] uppercase font-bold mb-12 group">
            <svg className="w-4 h-4 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 12H5m0 0l7 7m-7-7l7-7" /></svg>
            Back to Overview
          </Link>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-2 h-2 rounded-full bg-[#8A001A] pulse-dot" />
            <span className="text-[11px] font-bold tracking-[0.4em] uppercase text-[#8A001A]">Section 02</span>
          </div>
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-serif text-white tracking-tight leading-[0.95]">
            Shipping <em className="text-[#8A001A] not-italic font-light">& Delivery</em>
          </h1>
        </div>
      </section>

      {/* ═══════ INTERNATIONAL SHIPPING ═══════ */}
      <section className="py-24 md:py-32 bg-[#FAFAF8]">
        <div className="max-w-4xl mx-auto px-6 md:px-12">
          <div className="fade-up flex items-start gap-6 md:gap-8 mb-16">
            <div className="shrink-0">
              <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-[#8A001A]/[0.06] border border-[#8A001A]/[0.12] flex items-center justify-center">
                <span className="text-2xl md:text-3xl font-serif text-[#8A001A]">01</span>
              </div>
            </div>
            <div>
              <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-[#8A001A] block mb-2">Worldwide</span>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif text-[#1a1a1a] tracking-tight">International Shipping</h2>
            </div>
          </div>

          {/* Key Point */}
          <div className="fade-up relative mb-16">
            <div className="absolute -inset-px bg-gradient-to-r from-[#8A001A]/20 via-[#8A001A]/5 to-[#8A001A]/20 rounded-2xl" />
            <div className="relative bg-[#0A0A0A] rounded-2xl p-10 md:p-14">
              <p className="text-2xl md:text-3xl font-serif text-white leading-[1.4] mb-4">
                Shipping charges are <span className="text-[#8A001A]">completely separate</span> from the product price.
              </p>
              <p className="text-white/40 text-sm md:text-base font-light leading-[1.9]">
                These charges are NOT collected during checkout. They are calculated later once your products arrive at our shipping warehouse, allowing us to determine the most accurate amount possible.
              </p>
            </div>
          </div>

          {/* What it includes */}
          <div className="fade-up mb-16">
            <h3 className="text-[11px] font-bold tracking-[0.3em] uppercase text-[#1a1a1a] mb-8">May include</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { icon: '✈️', label: 'International freight charges' },
                { icon: '🛃', label: 'Customs duties' },
                { icon: '📝', label: 'Customs clearance fees' },
                { icon: '💰', label: 'Import-related taxes' },
                { icon: '🏭', label: 'Logistics costs' },
                { icon: '🤲', label: 'Handling charges' },
                { icon: '📦', label: 'Product-specific shipping requirements' }
              ].map((item, idx) => (
                <div key={idx} className="flex items-center gap-4 bg-white border border-[#000]/[0.04] rounded-xl p-5 hover:border-[#8A001A]/20 hover:shadow-lg hover:shadow-[#8A001A]/[0.03] transition-all duration-500 group">
                  <span className="text-xl group-hover:scale-125 transition-transform duration-300">{item.icon}</span>
                  <span className="text-sm text-[#1a1a1a]/60 font-light group-hover:text-[#1a1a1a] transition-colors">{item.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Factors */}
          <div className="fade-up mb-16">
            <h3 className="text-[11px] font-bold tracking-[0.3em] uppercase text-[#1a1a1a] mb-8">Final amount depends on</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {['Product weight', 'Volumetric weight', 'Parcel dimensions', 'Product category', 'Logistics rates', 'Customs requirements', 'Carrier rates', 'Economic conditions', 'Market conditions'].map((item, idx) => (
                <div key={idx} className="bg-[#0A0A0A] rounded-xl p-4 text-center text-xs text-white/40 font-light hover:text-white/70 hover:bg-[#0A0A0A]/90 transition-all duration-300 cursor-default">
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════ BRANDED PRODUCTS ═══════ */}
      <section className="py-24 md:py-32 bg-[#0A0A0A] relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: 'repeating-linear-gradient(90deg, transparent, transparent 120px, rgba(255,255,255,0.1) 120px, rgba(255,255,255,0.1) 121px)' }} />
        <div className="max-w-4xl mx-auto px-6 md:px-12 relative z-10">
          <div className="fade-up mb-12">
            <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-[#8A001A] block mb-4">Special Categories</span>
            <h2 className="text-3xl md:text-4xl font-serif text-white tracking-tight">Branded Products & Special Items</h2>
            <p className="text-white/40 text-sm md:text-base mt-4 font-light max-w-2xl leading-[1.9]">
              Certain products may attract higher customs and shipping costs due to additional inspections, clearance requirements, restrictions, or documentation.
            </p>
          </div>
          <div className="fade-up grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {['Ferrari, Adidas, Nike etc.', 'Cosmetics & Beauty', 'Lighters', 'Restricted categories', 'Fragile items', 'Oversized items', 'Special handling'].map((item, idx) => (
              <div key={idx} className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-5 text-center text-xs text-white/40 font-light hover:border-[#8A001A]/20 hover:text-white/60 transition-all duration-500">
                {item}
              </div>
            ))}
          </div>
          <p className="fade-up text-white/20 text-xs mt-8 font-light italic">These additional costs are generally included within your final shipping calculation.</p>
        </div>
      </section>

      {/* ═══════ SHIPPING UPDATES ═══════ */}
      <section className="py-24 md:py-32 bg-[#FAFAF8]">
        <div className="max-w-4xl mx-auto px-6 md:px-12">
          <div className="fade-up mb-12">
            <h3 className="text-[11px] font-bold tracking-[0.3em] uppercase text-[#1a1a1a] mb-8">Shipping Updates via</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { icon: '💬', label: 'WhatsApp' },
                { icon: '📱', label: 'SMS' },
                { icon: '📧', label: 'Email' },
                { icon: '📢', label: 'Official Channels' }
              ].map((item, idx) => (
                <div key={idx} className="bg-white border border-[#000]/[0.04] rounded-2xl p-6 text-center hover:border-[#8A001A]/20 hover:shadow-lg transition-all duration-500 group">
                  <span className="text-3xl block mb-3 group-hover:scale-110 transition-transform duration-300">{item.icon}</span>
                  <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#1a1a1a]/50 group-hover:text-[#1a1a1a] transition-colors">{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════ DOMESTIC SHIPPING ═══════ */}
      <section className="py-24 md:py-32 bg-[#0A0A0A] relative">
        <div className="max-w-4xl mx-auto px-6 md:px-12 relative z-10">
          <div className="fade-up flex items-start gap-6 md:gap-8 mb-16">
            <div className="shrink-0">
              <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-[#8A001A]/[0.08] border border-[#8A001A]/[0.2] flex items-center justify-center">
                <span className="text-2xl md:text-3xl font-serif text-[#8A001A]">02</span>
              </div>
            </div>
            <div>
              <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-[#8A001A] block mb-2">Within India</span>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif text-white tracking-tight">Domestic Shipping</h2>
            </div>
          </div>

          <p className="fade-up text-white/50 text-base md:text-lg font-light leading-[1.9] mb-12">
            Delivery of your parcel from our warehouse to your final delivery address within India.
          </p>

          <div className="fade-up grid grid-cols-2 md:grid-cols-4 gap-3 mb-12">
            {['Parcel weight', 'Parcel dimensions', 'Delivery location', 'Courier rates'].map((item, idx) => (
              <div key={idx} className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-5 text-center text-xs text-white/40 font-light">
                {item}
              </div>
            ))}
          </div>

          <div className="fade-up bg-white/[0.03] border border-white/[0.06] rounded-2xl p-8 md:p-10 space-y-4">
            <p className="text-white/50 text-sm leading-[1.9] font-light">
              Domestic shipping charges are not collected during checkout. They are included in the final shipping invoice together with your international shipping charges. A complete breakdown will always be provided before payment is requested.
            </p>
            <p className="text-white/30 text-xs font-light">Tracking information will be shared once the parcel has been dispatched. We currently ship across India.</p>
          </div>
        </div>
      </section>

      {/* ═══════ DELIVERY TIMELINES ═══════ */}
      <section className="py-24 md:py-32 bg-[#FAFAF8]">
        <div className="max-w-4xl mx-auto px-6 md:px-12">
          <div className="fade-up flex items-start gap-6 md:gap-8 mb-16">
            <div className="shrink-0">
              <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-[#8A001A]/[0.06] border border-[#8A001A]/[0.12] flex items-center justify-center">
                <span className="text-2xl md:text-3xl font-serif text-[#8A001A]">03</span>
              </div>
            </div>
            <div>
              <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-[#8A001A] block mb-2">Timelines</span>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif text-[#1a1a1a] tracking-tight">Delivery Timelines</h2>
            </div>
          </div>

          {/* Typical Delivery */}
          <div className="fade-up relative mb-16">
            <div className="absolute -inset-px bg-gradient-to-r from-[#8A001A]/20 via-[#8A001A]/5 to-[#8A001A]/20 rounded-2xl" />
            <div className="relative bg-[#0A0A0A] rounded-2xl p-12 md:p-16 text-center">
              <span className="text-[11px] font-bold tracking-[0.4em] uppercase text-[#8A001A] block mb-6">Typical Delivery</span>
              <p className="text-6xl md:text-7xl lg:text-8xl font-serif text-white tracking-tight">2–4</p>
              <p className="text-xl md:text-2xl font-serif text-white/60 mt-2">Weeks</p>
              <p className="text-white/25 text-xs mt-6 font-light">after shipment · estimates only · does not include sourcing period</p>
            </div>
          </div>

          <div className="fade-up bg-gradient-to-br from-[#FFF8F0] to-[#FFF5EB] border border-[#8A001A]/[0.08] rounded-2xl p-6 text-center mb-16">
            <p className="text-sm text-[#8A001A]/80">In some cases, orders may take up to <strong className="font-semibold text-[#8A001A]">8 weeks or longer</strong> depending on circumstances beyond our control.</p>
          </div>

          {/* Delay Factors */}
          <div className="fade-up mb-16">
            <h3 className="text-[11px] font-bold tracking-[0.3em] uppercase text-[#1a1a1a] mb-8">Delays may occur due to</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {['Customs inspections', 'Customs clearance', 'Logistics disruptions', 'Weather conditions', 'Public holidays', 'Transportation delays', 'Political situations', 'War-related disruptions', 'Economic conditions', 'Carrier delays', 'Supplier delays', 'Government regulations', 'Port congestion', 'Route disruptions'].map((item, idx) => (
                <div key={idx} className="bg-[#0A0A0A] rounded-xl p-4 text-center text-xs text-white/40 font-light hover:text-white/70 transition-colors duration-300 cursor-default">
                  {item}
                </div>
              ))}
            </div>
          </div>

          {/* Price Fluctuation */}
          <div className="fade-up mb-16">
            <h3 className="text-[11px] font-bold tracking-[0.3em] uppercase text-[#1a1a1a] mb-8">Shipping prices may also fluctuate due to</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {['Fuel costs', 'Logistics rates', 'Customs requirements', 'Carrier pricing', 'Economic conditions', 'Market fluctuations'].map((item, idx) => (
                <div key={idx} className="bg-white border border-[#000]/[0.04] rounded-xl p-4 text-center text-xs text-[#1a1a1a]/40 font-light hover:border-[#8A001A]/20 transition-all duration-300">
                  {item}
                </div>
              ))}
            </div>
            <p className="text-[#1a1a1a]/30 text-xs mt-6 font-light italic">These factors are completely outside of our control.</p>
          </div>

          {/* Transparency Notice */}
          <div className="fade-up relative">
            <div className="absolute -inset-px bg-gradient-to-r from-[#8A001A]/20 via-[#8A001A]/5 to-[#8A001A]/20 rounded-2xl" />
            <div className="relative bg-[#0A0A0A] rounded-2xl p-10 md:p-12">
              <p className="text-white/50 text-sm leading-[1.9] font-light">
                We kindly ask customers to place orders only if they are comfortable with possible delays, changing shipping costs, customs procedures, and international sourcing timelines. Our goal is to be <strong className="font-semibold text-white">transparent from the beginning</strong> so there are no surprises later.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════ NAVIGATION ═══════ */}
      <section className="bg-[#0A0A0A] py-8">
        <div className="max-w-4xl mx-auto px-6 md:px-12 flex justify-between items-center">
          <Link href="/order-info/order-process" className="flex items-center gap-3 text-white/30 hover:text-white/60 transition-colors text-[10px] font-bold tracking-[0.2em] uppercase group">
            <svg className="w-4 h-4 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 12H5m0 0l7 7m-7-7l7-7" /></svg>
            Order Process
          </Link>
          <Link href="/order-info/policies" className="flex items-center gap-3 text-[#8A001A] hover:gap-4 transition-all text-[10px] font-bold tracking-[0.2em] uppercase">
            Policies & Guidelines
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
          </Link>
        </div>
      </section>
    </div>
  );
}
