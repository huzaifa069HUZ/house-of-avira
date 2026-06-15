'use client';

import Link from 'next/link';
import { useEffect } from 'react';

export default function OrderProcessPage() {
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
          opacity: 0;
          transform: translateY(40px);
          transition: opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), transform 0.8s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .fade-up.animate-in { opacity: 1; transform: translateY(0); }
        @keyframes pulse-dot { 0%, 100% { opacity: 1; } 50% { opacity: 0.3; } }
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
            <span className="text-[11px] font-bold tracking-[0.4em] uppercase text-[#8A001A]">Section 01</span>
          </div>
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-serif text-white tracking-tight leading-[0.95]">
            Order <em className="text-[#8A001A] not-italic font-light">Process</em>
          </h1>
        </div>
      </section>

      {/* ═══════ INTRO ═══════ */}
      <section className="py-20 md:py-28 bg-[#FAFAF8]">
        <div className="max-w-4xl mx-auto px-6 md:px-12">
          <div className="fade-up">
            <p className="text-xl md:text-2xl lg:text-3xl text-[#1a1a1a]/80 leading-[1.6] font-light">
              We keep our ordering process as <strong className="font-semibold text-[#1a1a1a]">simple and transparent</strong> as possible.
            </p>
          </div>

          {/* Two Payments Banner */}
          <div className="fade-up mt-14 relative">
            <div className="absolute -inset-px bg-gradient-to-r from-[#8A001A]/30 via-[#8A001A]/10 to-[#8A001A]/30 rounded-2xl" />
            <div className="relative bg-[#0A0A0A] rounded-2xl p-10 md:p-14 text-center">
              <span className="text-[11px] font-bold tracking-[0.4em] uppercase text-[#8A001A] block mb-6">Key Fact</span>
              <p className="text-3xl md:text-4xl lg:text-5xl font-serif text-white tracking-tight">
                Only <em className="text-[#8A001A] not-italic">Two</em> Payments
              </p>
              <p className="text-white/30 text-sm md:text-base mt-4 font-light">are involved in your entire order</p>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════ PAYMENT 1: PRODUCT ═══════ */}
      <section className="py-24 md:py-32 bg-[#0A0A0A] relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: 'repeating-linear-gradient(90deg, transparent, transparent 120px, rgba(255,255,255,0.1) 120px, rgba(255,255,255,0.1) 121px)' }} />
        <div className="max-w-4xl mx-auto px-6 md:px-12 relative z-10">
          
          {/* Section Header */}
          <div className="fade-up flex items-start gap-6 md:gap-8 mb-16">
            <div className="shrink-0">
              <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-[#8A001A]/[0.08] border border-[#8A001A]/[0.2] flex items-center justify-center">
                <span className="text-2xl md:text-3xl font-serif text-[#8A001A]">01</span>
              </div>
            </div>
            <div>
              <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-[#8A001A] block mb-2">Payment One</span>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif text-white tracking-tight">Product Payment</h2>
              <p className="text-white/40 text-sm md:text-base mt-4 font-light max-w-lg">When placing your order, you will pay the slot fee and the product price.</p>
            </div>
          </div>

          {/* Slot Fee + Product Price Cards */}
          <div className="fade-up grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
            {/* Slot Fee */}
            <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-8 md:p-10 hover:border-[#8A001A]/20 transition-all duration-500 group">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-[#8A001A]" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                  </svg>
                  <span className="text-[11px] font-bold tracking-[0.2em] uppercase text-white/60">Slot Fee</span>
                </div>
                <span className="text-2xl font-serif text-[#8A001A] group-hover:scale-110 transition-transform duration-300">₹60</span>
              </div>
              <p className="text-white/40 text-sm leading-[1.9] font-light">
                Paid to reserve your place in the current ordering batch and confirm your order. Allows our team to begin processing, organizing, and sourcing products.
              </p>
              <div className="mt-6 bg-[#8A001A]/[0.06] border border-[#8A001A]/[0.12] rounded-lg p-4 text-xs text-[#8A001A]/80 leading-[1.8]">
                <strong className="font-semibold text-[#8A001A]">Non-refundable</strong> once a slot has been reserved and processing has begun.
              </div>
            </div>

            {/* Product Price */}
            <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-8 md:p-10 hover:border-white/[0.12] transition-all duration-500">
              <div className="flex items-center gap-3 mb-6">
                <svg className="w-5 h-5 text-[#8A001A]" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
                <span className="text-[11px] font-bold tracking-[0.2em] uppercase text-white/60">Product Price</span>
              </div>
              <p className="text-white/40 text-sm leading-[1.9] font-light mb-6">
                Covers only the product itself unless otherwise stated.
              </p>
              <div className="space-y-3">
                <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-white/20 block">Does not include</span>
                {['International shipping', 'Domestic shipping', 'Customs duties', 'Customs clearance charges', 'Import-related taxes', 'Logistics charges', 'Handling fees'].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3 text-white/30 text-xs">
                    <svg className="w-3 h-3 text-[#8A001A]/50 shrink-0" fill="currentColor" viewBox="0 0 8 8"><circle cx="4" cy="4" r="2" /></svg>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
              <p className="text-white/20 text-xs mt-4 font-light italic">These are calculated later and paid separately.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════ PAYMENT 2: SHIPPING ═══════ */}
      <section className="py-24 md:py-32 bg-[#FAFAF8]">
        <div className="max-w-4xl mx-auto px-6 md:px-12">
          
          {/* Section Header */}
          <div className="fade-up flex items-start gap-6 md:gap-8 mb-16">
            <div className="shrink-0">
              <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-[#8A001A]/[0.06] border border-[#8A001A]/[0.12] flex items-center justify-center">
                <span className="text-2xl md:text-3xl font-serif text-[#8A001A]">02</span>
              </div>
            </div>
            <div>
              <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-[#8A001A] block mb-2">Payment Two</span>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif text-[#1a1a1a] tracking-tight">Shipping Payment</h2>
              <p className="text-[#1a1a1a]/40 text-sm md:text-base mt-4 font-light max-w-lg">Shipping is paid separately from the product payment.</p>
            </div>
          </div>

          {/* Key Point */}
          <div className="fade-up relative mb-16">
            <div className="absolute -inset-px bg-gradient-to-r from-[#8A001A]/20 via-[#8A001A]/5 to-[#8A001A]/20 rounded-2xl" />
            <div className="relative bg-[#0A0A0A] rounded-2xl p-10 md:p-14">
              <div className="flex items-center gap-4 mb-6">
                <svg className="w-8 h-8 text-[#8A001A]" fill="none" stroke="currentColor" strokeWidth="1.2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
                <span className="text-[11px] font-bold tracking-[0.3em] uppercase text-[#8A001A]">Important</span>
              </div>
              <p className="text-2xl md:text-3xl font-serif text-white leading-[1.4]">
                You do <span className="text-[#8A001A]">not</span> pay shipping charges when placing your order.
              </p>
              <p className="text-white/40 text-sm md:text-base mt-6 font-light leading-[1.9] max-w-2xl">
                Instead, shipping charges are calculated later in the process after your products arrive at our international shipping warehouse and all applicable costs can be accurately determined.
              </p>
            </div>
          </div>

          {/* Shipping Includes */}
          <div className="fade-up mb-16">
            <h3 className="text-[11px] font-bold tracking-[0.3em] uppercase text-[#1a1a1a] mb-8">Your shipping payment will include</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { icon: '✈️', label: 'International shipping charges' },
                { icon: '🛃', label: 'Customs duties & clearance fees' },
                { icon: '📋', label: 'Import-related charges & taxes' },
                { icon: '🚚', label: 'Domestic shipping charges' },
                { icon: '📦', label: 'Logistics & handling charges' }
              ].map((item, idx) => (
                <div key={idx} className="flex items-center gap-4 bg-white border border-[#000]/[0.04] rounded-xl p-5 hover:border-[#8A001A]/20 hover:shadow-lg hover:shadow-[#8A001A]/[0.03] transition-all duration-500 group">
                  <span className="text-xl group-hover:scale-125 transition-transform duration-300">{item.icon}</span>
                  <span className="text-sm text-[#1a1a1a]/60 font-light group-hover:text-[#1a1a1a] transition-colors">{item.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* What You Receive */}
          <div className="fade-up mb-16">
            <h3 className="text-[11px] font-bold tracking-[0.3em] uppercase text-[#1a1a1a] mb-8">Once calculations are completed, you will receive</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { num: '01', title: 'Total Amount', desc: 'Your total shipping amount' },
                { num: '02', title: 'Breakdown', desc: 'A detailed breakdown of all charges' },
                { num: '03', title: 'Deadline', desc: 'Your payment deadline' }
              ].map((item) => (
                <div key={item.num} className="bg-[#0A0A0A] rounded-2xl p-8 text-center group hover:bg-[#0A0A0A]/95 transition-colors">
                  <span className="text-3xl font-serif text-[#8A001A]/30 block mb-4 group-hover:text-[#8A001A]/60 transition-colors">{item.num}</span>
                  <h4 className="text-sm font-bold tracking-[0.1em] uppercase text-white mb-2">{item.title}</h4>
                  <p className="text-xs text-white/30 font-light">{item.desc}</p>
                </div>
              ))}
            </div>
            <p className="text-[#1a1a1a]/40 text-sm font-light mt-6">Customers will be given a few days to complete shipping payment.</p>
          </div>

          {/* Payment Policy */}
          <div className="fade-up bg-gradient-to-br from-[#FFF8F0] to-[#FFF5EB] border border-[#8A001A]/[0.08] rounded-2xl p-8 md:p-12 mb-16">
            <div className="flex items-center gap-3 mb-6">
              <svg className="w-5 h-5 text-[#8A001A]" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <span className="text-[11px] font-bold tracking-[0.2em] uppercase text-[#8A001A]">Payment Policy</span>
            </div>
            <div className="space-y-4 text-[#1a1a1a]/60 text-sm leading-[1.9] font-light">
              <p>
                Shipping charges are an <strong className="font-semibold text-[#1a1a1a]">essential and mandatory</strong> part of your order and are required to complete the dispatch process. Shipping is not included in the product price and is calculated separately later.
              </p>
              <p>
                Once your order reaches our shipping stage, the applicable charges (including international shipping, customs duties, clearance fees, and domestic shipping within India) will be calculated and shared with a complete breakdown.
              </p>
              <p>
                A fixed deadline will be provided for payment. Shipping charges must be paid in full within the given timeframe. If payment is not completed, the order will not be dispatched and may remain on hold, and additional storage or handling charges may apply.
              </p>
            </div>
          </div>

          {/* Shipping Calculator Note */}
          <div className="fade-up bg-white border border-[#000]/[0.04] rounded-2xl p-8 md:p-10 mb-16">
            <div className="flex items-center gap-3 mb-4">
              <svg className="w-5 h-5 text-[#1a1a1a]/40" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 15.75V18m-7.5-6.75h.008v.008H8.25v-.008zm0 2.25h.008v.008H8.25v-.008zm0 2.25h.008v.008H8.25v-.008zm0 2.25h.008v.008H8.25v-.008zm2.25-6.75h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008v-.008zM12 6.75h.008v.008H12v-.008zm2.25 0h.008v.008h-.008v-.008zM6 20.25h12A2.25 2.25 0 0020.25 18V6A2.25 2.25 0 0018 3.75H6A2.25 2.25 0 003.75 6v12A2.25 2.25 0 006 20.25z" />
              </svg>
              <span className="text-[11px] font-bold tracking-[0.2em] uppercase text-[#1a1a1a]/50">Shipping Calculator</span>
            </div>
            <p className="text-[#1a1a1a]/50 text-sm leading-[1.9] font-light">
              A shipping calculator is available under your cart to provide an estimated idea of shipping charges. This estimate is only for reference purposes and may vary from the final amount.
            </p>
          </div>

          {/* Final Notice */}
          <div className="fade-up relative">
            <div className="absolute -inset-px bg-gradient-to-r from-[#8A001A]/20 via-[#8A001A]/5 to-[#8A001A]/20 rounded-2xl" />
            <div className="relative bg-[#0A0A0A] rounded-2xl p-10 md:p-12">
              <div className="flex items-center gap-3 mb-6">
                <svg className="w-5 h-5 text-[#8A001A]" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                </svg>
                <span className="text-[11px] font-bold tracking-[0.2em] uppercase text-[#8A001A]">Important Notice</span>
              </div>
              <p className="text-white/50 text-sm leading-[1.9] font-light">
                Once an order is placed and processed, the product price is <strong className="font-semibold text-white">non-refundable</strong>. If a customer chooses not to proceed after the final shipping charges are shared, the order will not be cancelled or refunded, and no returns or exchanges will be applicable. We encourage customers to review all policies before placing an order.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════ NAVIGATION ═══════ */}
      <section className="bg-[#0A0A0A] py-12 md:py-16 border-t border-white/10">
        <div className="max-w-4xl mx-auto px-6 md:px-12 flex flex-col sm:flex-row justify-between items-center gap-6">
          <Link href="/order-info" className="w-full sm:w-auto flex items-center justify-center sm:justify-start gap-4 text-white/60 hover:text-white hover:bg-white/5 border border-white/10 rounded-full px-8 py-4 transition-all text-xs md:text-sm font-bold tracking-[0.2em] uppercase group">
            <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 12H5m0 0l7 7m-7-7l7-7" /></svg>
            Back to Overview
          </Link>
          <Link href="/order-info/shipping" className="w-full sm:w-auto flex items-center justify-center sm:justify-end gap-4 text-white bg-[#8A001A] hover:bg-[#A3001E] rounded-full px-8 py-4 transition-all text-xs md:text-sm font-bold tracking-[0.2em] uppercase group shadow-[0_0_20px_rgba(138,0,26,0.2)]">
            Shipping & Delivery
            <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14m0 0l-7-7m7 7l-7 7" /></svg>
          </Link>
        </div>
      </section>
    </div>
  );
}
