'use client';

import Link from 'next/link';
import { useEffect } from 'react';

export default function PoliciesPage() {
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
            <span className="text-[11px] font-bold tracking-[0.4em] uppercase text-[#8A001A]">Section 03</span>
          </div>
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-serif text-white tracking-tight leading-[0.95]">
            Policies <em className="text-[#8A001A] not-italic font-light">& Guidelines</em>
          </h1>
        </div>
      </section>

      {/* ═══════ ORDER CONFIRMATION ═══════ */}
      <section className="py-24 md:py-32 bg-[#FAFAF8]">
        <div className="max-w-4xl mx-auto px-6 md:px-12">
          <div className="fade-up flex items-start gap-6 md:gap-8 mb-12">
            <div className="shrink-0">
              <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-[#8A001A]/[0.06] border border-[#8A001A]/[0.12] flex items-center justify-center">
                <span className="text-2xl md:text-3xl font-serif text-[#8A001A]">01</span>
              </div>
            </div>
            <div>
              <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-[#8A001A] block mb-2">General</span>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif text-[#1a1a1a] tracking-tight">Order Confirmation</h2>
            </div>
          </div>
          <div className="fade-up space-y-5 text-[#1a1a1a]/60 text-base md:text-lg leading-[1.9] font-light max-w-3xl">
            <p>All orders placed with House of Avira are considered <strong className="font-semibold text-[#1a1a1a]">confirmed</strong> once payment has been successfully completed.</p>
            <p>By placing an order, the customer agrees to all store policies, processes, timelines, and shipping structures mentioned on this page.</p>
          </div>
          <div className="fade-up mt-8 bg-gradient-to-br from-[#FFF8F0] to-[#FFF5EB] border border-[#8A001A]/[0.08] rounded-2xl p-6 text-sm text-[#8A001A]/80">
            We strongly recommend reading all sections carefully before placing an order.
          </div>
        </div>
      </section>

      {/* ═══════ REFUND POLICY ═══════ */}
      <section className="py-24 md:py-32 bg-[#0A0A0A] relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: 'repeating-linear-gradient(90deg, transparent, transparent 120px, rgba(255,255,255,0.1) 120px, rgba(255,255,255,0.1) 121px)' }} />
        <div className="max-w-4xl mx-auto px-6 md:px-12 relative z-10">
          <div className="fade-up flex items-start gap-6 md:gap-8 mb-12">
            <div className="shrink-0">
              <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-[#8A001A]/[0.08] border border-[#8A001A]/[0.2] flex items-center justify-center">
                <span className="text-2xl md:text-3xl font-serif text-[#8A001A]">02</span>
              </div>
            </div>
            <div>
              <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-[#8A001A] block mb-2">Refunds</span>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif text-white tracking-tight">Refund Policy</h2>
            </div>
          </div>

          <p className="fade-up text-white/50 text-base md:text-lg font-light leading-[1.9] mb-12">
            Refunds are only applicable in cases where there is a verified issue or error from our side, such as incorrect product dispatch or a confirmed product-related problem.
          </p>

          <div className="fade-up mb-10">
            <h3 className="text-[11px] font-bold tracking-[0.3em] uppercase text-white/30 mb-6">Refunds are NOT applicable for</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { icon: '🔄', label: 'Change of mind' },
                { icon: '💸', label: 'Shipping cost being higher than expected' },
                { icon: '⏳', label: 'Delay in delivery' },
                { icon: '🛃', label: 'Customs charges or import duties' },
                { icon: '🚫', label: 'Decision to not proceed with shipping' },
                { icon: '👤', label: 'Personal preference after ordering' }
              ].map((item, idx) => (
                <div key={idx} className="flex items-center gap-4 bg-white/[0.03] border border-white/[0.06] rounded-xl p-5 group">
                  <span className="text-lg">{item.icon}</span>
                  <span className="text-sm text-white/40 font-light">{item.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="fade-up bg-[#8A001A]/[0.06] border border-[#8A001A]/[0.15] rounded-2xl p-6 text-center">
            <p className="text-sm text-[#8A001A]/90">Once an order is placed and processed, the product price is <strong className="font-semibold text-[#8A001A]">non-refundable</strong>.</p>
          </div>
        </div>
      </section>

      {/* ═══════ CANCELLATION ═══════ */}
      <section className="py-24 md:py-32 bg-[#FAFAF8]">
        <div className="max-w-4xl mx-auto px-6 md:px-12">
          <div className="fade-up flex items-start gap-6 md:gap-8 mb-12">
            <div className="shrink-0">
              <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-[#8A001A]/[0.06] border border-[#8A001A]/[0.12] flex items-center justify-center">
                <span className="text-2xl md:text-3xl font-serif text-[#8A001A]">03</span>
              </div>
            </div>
            <div>
              <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-[#8A001A] block mb-2">Cancellations</span>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif text-[#1a1a1a] tracking-tight">Cancellation Policy</h2>
            </div>
          </div>

          <div className="fade-up relative mb-8">
            <div className="absolute -inset-px bg-gradient-to-r from-[#8A001A]/20 via-[#8A001A]/5 to-[#8A001A]/20 rounded-2xl" />
            <div className="relative bg-[#0A0A0A] rounded-2xl p-10 md:p-14 text-center">
              <p className="text-2xl md:text-3xl font-serif text-white">
                Cancellations are <span className="text-[#8A001A]">not allowed</span> once an order has been placed and processed.
              </p>
            </div>
          </div>
          <p className="fade-up text-[#1a1a1a]/50 text-sm md:text-base font-light leading-[1.9]">
            Orders are immediately forwarded into processing and cannot be stopped, modified, or cancelled once confirmed. We kindly request customers to be fully certain before placing an order.
          </p>
        </div>
      </section>

      {/* ═══════ EXCHANGE & RETURN ═══════ */}
      <section className="py-24 md:py-32 bg-[#0A0A0A]">
        <div className="max-w-4xl mx-auto px-6 md:px-12">
          <div className="fade-up flex items-start gap-6 md:gap-8 mb-12">
            <div className="shrink-0">
              <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-[#8A001A]/[0.08] border border-[#8A001A]/[0.2] flex items-center justify-center">
                <span className="text-2xl md:text-3xl font-serif text-[#8A001A]">04</span>
              </div>
            </div>
            <div>
              <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-[#8A001A] block mb-2">Returns</span>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif text-white tracking-tight">Exchange & Return Policy</h2>
            </div>
          </div>
          <div className="fade-up grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-8 md:p-10 hover:border-white/[0.12] transition-all duration-500">
              <div className="flex items-center gap-3 mb-5">
                <span className="text-xl">🔁</span>
                <span className="text-[11px] font-bold tracking-[0.2em] uppercase text-white/60">Exchanges</span>
              </div>
              <p className="text-white/40 text-sm leading-[1.9] font-light">
                Exchanges are only possible if a replacement item is available in stock. If a replacement is not available, exchanges cannot be processed.
              </p>
            </div>
            <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-8 md:p-10 hover:border-white/[0.12] transition-all duration-500">
              <div className="flex items-center gap-3 mb-5">
                <span className="text-xl">📦</span>
                <span className="text-[11px] font-bold tracking-[0.2em] uppercase text-white/60">Returns</span>
              </div>
              <p className="text-white/40 text-sm leading-[1.9] font-light">
                Returns are not accepted under any circumstances. Due to hygiene, handling, and international logistics standards, all products are final once dispatched.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════ PRODUCT EXPECTATIONS ═══════ */}
      <section className="py-24 md:py-32 bg-[#FAFAF8]">
        <div className="max-w-4xl mx-auto px-6 md:px-12">
          <div className="fade-up flex items-start gap-6 md:gap-8 mb-12">
            <div className="shrink-0">
              <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-[#8A001A]/[0.06] border border-[#8A001A]/[0.12] flex items-center justify-center">
                <span className="text-2xl md:text-3xl font-serif text-[#8A001A]">05</span>
              </div>
            </div>
            <div>
              <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-[#8A001A] block mb-2">Quality</span>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif text-[#1a1a1a] tracking-tight">Product Expectations</h2>
            </div>
          </div>
          <div className="fade-up space-y-5 text-[#1a1a1a]/60 text-base leading-[1.9] font-light max-w-3xl mb-10">
            <p>All products are sourced based on product listings, reference images, and available supplier information. We ensure all details are shared as accurately as possible before purchase.</p>
          </div>
          <div className="fade-up">
            <h3 className="text-[11px] font-bold tracking-[0.3em] uppercase text-[#1a1a1a] mb-6">Minor variations may occur due to</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {['Manufacturing differences', 'Fabric or material batches', 'Lighting in product images', 'Production variations'].map((item, idx) => (
                <div key={idx} className="bg-[#0A0A0A] rounded-xl p-5 text-center text-xs text-white/40 font-light">
                  {item}
                </div>
              ))}
            </div>
            <p className="text-[#1a1a1a]/30 text-xs mt-6 font-light italic">These are normal in international products and will not be considered valid reasons for refunds or cancellations.</p>
          </div>
        </div>
      </section>

      {/* ═══════ CUSTOMER RESPONSIBILITY ═══════ */}
      <section className="py-24 md:py-32 bg-[#0A0A0A]">
        <div className="max-w-4xl mx-auto px-6 md:px-12">
          <div className="fade-up flex items-start gap-6 md:gap-8 mb-12">
            <div className="shrink-0">
              <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-[#8A001A]/[0.08] border border-[#8A001A]/[0.2] flex items-center justify-center">
                <span className="text-2xl md:text-3xl font-serif text-[#8A001A]">06</span>
              </div>
            </div>
            <div>
              <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-[#8A001A] block mb-2">Your Role</span>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif text-white tracking-tight">Customer Responsibility</h2>
            </div>
          </div>
          <div className="fade-up space-y-4">
            {[
              { num: '01', text: 'All shipping details (name, address, phone number) are entered correctly' },
              { num: '02', text: 'They review product details before placing an order' },
              { num: '03', text: 'They are available to receive deliveries' },
              { num: '04', text: 'They understand pre-order timelines and international shipping conditions' },
              { num: '05', text: 'Shipping payments are completed within the given deadline' }
            ].map((item) => (
              <div key={item.num} className="flex items-start gap-5 bg-white/[0.03] border border-white/[0.06] rounded-xl p-6 hover:border-[#8A001A]/15 transition-all duration-500 group">
                <span className="text-lg font-serif text-[#8A001A]/40 shrink-0 group-hover:text-[#8A001A] transition-colors">{item.num}</span>
                <span className="text-sm text-white/40 font-light leading-[1.8] group-hover:text-white/60 transition-colors">{item.text}</span>
              </div>
            ))}
          </div>
          <div className="fade-up mt-8 bg-[#8A001A]/[0.06] border border-[#8A001A]/[0.15] rounded-2xl p-6 text-sm text-[#8A001A]/80">
            If incorrect information is provided and results in delivery failure, delay, or loss of parcel, House of Avira will not be responsible.
          </div>
        </div>
      </section>

      {/* ═══════ AFTER DISPATCH ═══════ */}
      <section className="py-24 md:py-32 bg-[#FAFAF8]">
        <div className="max-w-4xl mx-auto px-6 md:px-12">
          <div className="fade-up flex items-start gap-6 md:gap-8 mb-12">
            <div className="shrink-0">
              <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-[#8A001A]/[0.06] border border-[#8A001A]/[0.12] flex items-center justify-center">
                <span className="text-2xl md:text-3xl font-serif text-[#8A001A]">07</span>
              </div>
            </div>
            <div>
              <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-[#8A001A] block mb-2">Post-Dispatch</span>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif text-[#1a1a1a] tracking-tight">After Dispatch</h2>
            </div>
          </div>
          <p className="fade-up text-[#1a1a1a]/60 text-base leading-[1.9] font-light mb-10">
            Once shipped and handed over to the courier partner, responsibility for the parcel lies with the shipping carrier.
          </p>
          <div className="fade-up grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
            {['Lost parcels', 'Delays in transit', 'Damage after dispatch', 'Courier handling failures'].map((item, idx) => (
              <div key={idx} className="bg-[#0A0A0A] rounded-xl p-5 text-center text-xs text-white/40 font-light">
                {item}
              </div>
            ))}
          </div>
          <p className="fade-up text-[#1a1a1a]/40 text-sm font-light">
            In such cases, contact the courier service directly using the provided tracking details. We will support wherever possible with tracking assistance.
          </p>
        </div>
      </section>

      {/* ═══════ UNBOXING ═══════ */}
      <section className="py-24 md:py-32 bg-[#0A0A0A]">
        <div className="max-w-4xl mx-auto px-6 md:px-12">
          <div className="fade-up flex items-start gap-6 md:gap-8 mb-12">
            <div className="shrink-0">
              <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-[#8A001A]/[0.08] border border-[#8A001A]/[0.2] flex items-center justify-center">
                <span className="text-2xl md:text-3xl font-serif text-[#8A001A]">08</span>
              </div>
            </div>
            <div>
              <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-[#8A001A] block mb-2">Claims</span>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif text-white tracking-tight">Unboxing & Claims</h2>
            </div>
          </div>
          <p className="fade-up text-white/50 text-base font-light leading-[1.9] mb-10">
            In case of any issue with a delivered product, customers must provide:
          </p>
          <div className="fade-up grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            {[
              { icon: '🎥', num: '01', title: 'Unboxing Video', desc: 'A clear unboxing video of the package' },
              { icon: '⏺️', num: '02', title: 'Continuous Recording', desc: 'Without cuts or edits from start to finish' },
              { icon: '🔍', num: '03', title: 'Proof of Issue', desc: 'Issue clearly shown within the video' }
            ].map((item) => (
              <div key={item.num} className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-8 text-center hover:border-[#8A001A]/20 transition-all duration-500 group">
                <span className="text-3xl block mb-4 group-hover:scale-110 transition-transform duration-300">{item.icon}</span>
                <span className="text-xl font-serif text-[#8A001A]/40 block mb-3">{item.num}</span>
                <h4 className="text-sm font-bold tracking-[0.1em] uppercase text-white mb-2">{item.title}</h4>
                <p className="text-xs text-white/30 font-light">{item.desc}</p>
              </div>
            ))}
          </div>
          <div className="fade-up bg-[#8A001A]/[0.06] border border-[#8A001A]/[0.15] rounded-2xl p-6 text-sm text-[#8A001A]/80 text-center">
            Claims raised without proper unboxing evidence may not be accepted. This is required to ensure fair handling of all customer concerns.
          </div>
        </div>
      </section>

      {/* ═══════ FINAL NOTE ═══════ */}
      <section className="py-24 md:py-32 bg-[#FAFAF8]">
        <div className="max-w-3xl mx-auto px-6 md:px-12 text-center">
          <div className="fade-up">
            <div className="w-16 h-16 rounded-full bg-[#8A001A]/[0.06] border border-[#8A001A]/[0.12] flex items-center justify-center mx-auto mb-8">
              <svg className="w-6 h-6 text-[#8A001A]" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
            </div>

            <h2 className="text-3xl md:text-4xl font-serif text-[#1a1a1a] tracking-tight mb-8">Final Note</h2>

            <div className="space-y-4 text-[#1a1a1a]/50 text-sm md:text-base leading-[1.9] font-light max-w-xl mx-auto">
              <p>We value transparency and customer trust above everything else.</p>
              <p>House of Avira operates on a pre-order model with international products, and every order goes through multiple stages including sourcing, international shipping, customs clearance, and domestic delivery.</p>
            </div>

            <div className="mt-12 relative inline-block w-full max-w-lg">
              <div className="absolute -inset-px bg-gradient-to-r from-[#8A001A]/20 via-[#8A001A]/5 to-[#8A001A]/20 rounded-2xl" />
              <div className="relative bg-[#0A0A0A] rounded-2xl p-8 text-left">
                <p className="text-[10px] font-bold tracking-[0.25em] uppercase text-[#8A001A] mb-5">Place an order only if comfortable with</p>
                <div className="space-y-3">
                  {['Pre-order processing timelines', 'Variable shipping costs', 'Customs charges', 'Possible delays due to external factors'].map((item, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <svg className="w-4 h-4 text-[#8A001A] shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                      <span className="text-white/50 text-sm font-light">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <p className="text-sm text-[#1a1a1a]/40 mt-10 font-light">
              By placing an order, you confirm that you have read and agreed to all policies.
            </p>
            <p className="text-sm text-[#1a1a1a]/25 mt-4 font-light">
              Thank you for trusting House of Avira <span className="text-[#8A001A]">♥</span>
            </p>
          </div>
        </div>
      </section>

      {/* ═══════ NAVIGATION ═══════ */}
      <section className="bg-[#0A0A0A] py-8">
        <div className="max-w-4xl mx-auto px-6 md:px-12 flex justify-between items-center">
          <Link href="/order-info/shipping" className="flex items-center gap-3 text-white/30 hover:text-white/60 transition-colors text-[10px] font-bold tracking-[0.2em] uppercase group">
            <svg className="w-4 h-4 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 12H5m0 0l7 7m-7-7l7-7" /></svg>
            Shipping & Delivery
          </Link>
          <Link href="/order-info" className="flex items-center gap-3 text-[#8A001A] hover:gap-4 transition-all text-[10px] font-bold tracking-[0.2em] uppercase">
            Back to Overview
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
          </Link>
        </div>
      </section>
    </div>
  );
}
