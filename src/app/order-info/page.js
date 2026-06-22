'use client';

import Link from 'next/link';
import { useEffect, useRef } from 'react';

const sections = [
  {
    title: 'Order Process',
    description: 'How our pre-order system works, payment structure, slot fees & what happens after you place an order.',
    href: '/order-info/order-process',
    number: '01',
    icon: (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="4" y="4" width="24" height="24" rx="3" />
        <path d="M4 12h24" />
        <circle cx="10" cy="8" r="1" fill="currentColor" stroke="none" />
        <circle cx="14" cy="8" r="1" fill="currentColor" stroke="none" />
        <circle cx="18" cy="8" r="1" fill="currentColor" stroke="none" />
        <path d="M10 18h6" />
        <path d="M10 22h12" />
      </svg>
    ),
  },
  {
    title: 'Shipping & Delivery',
    description: 'International shipping, customs, delivery timelines, shipping estimates & domestic delivery.',
    href: '/order-info/shipping',
    number: '02',
    icon: (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 6l12-2 12 2v14l-12 8-12-8V6z" />
        <path d="M16 4v22" />
        <path d="M4 6l12 8 12-8" />
        <circle cx="16" cy="18" r="2" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    title: 'Policies & Guidelines',
    description: 'Refunds, exchanges, cancellations, product expectations & customer responsibilities.',
    href: '/order-info/policies',
    number: '03',
    icon: (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 2l2 6h6l-5 4 2 6-5-4-5 4 2-6-5-4h6l2-6z" />
        <rect x="6" y="20" width="20" height="8" rx="2" />
        <path d="M12 24h8" />
      </svg>
    ),
  }
];

const checklist = [
  'Variable shipping costs',
  'Customs procedures & clearance requirements',
  'Estimated delivery timelines',
  'Possible delays from external factors',
  'Our payment structure & store policies'
];

export default function OrderInfoPage() {
  const heroRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
          }
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
        .fade-up.animate-in {
          opacity: 1;
          transform: translateY(0);
        }
        .fade-up:nth-child(2) { transition-delay: 0.1s; }
        .fade-up:nth-child(3) { transition-delay: 0.2s; }
        .fade-up:nth-child(4) { transition-delay: 0.3s; }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }
        @keyframes pulse-ring {
          0% { transform: scale(1); opacity: 0.4; }
          100% { transform: scale(1.8); opacity: 0; }
        }
        .float-icon { animation: float 4s ease-in-out infinite; }
        .pulse-ring::after {
          content: '';
          position: absolute;
          inset: -8px;
          border: 1px solid currentColor;
          border-radius: inherit;
          animation: pulse-ring 2s ease-out infinite;
        }
        @keyframes gradient-x {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient-x 8s ease infinite;
        }
        @keyframes line-grow {
          from { transform: scaleX(0); }
          to { transform: scaleX(1); }
        }
        .line-grow { animation: line-grow 1.5s cubic-bezier(0.16, 1, 0.3, 1) forwards; transform-origin: left; }
      `}</style>

      {/* ═══════════════════════════ HERO ═══════════════════════════ */}
      <section ref={heroRef} className="relative min-h-[85vh] flex items-center justify-center overflow-hidden pt-24 bg-[#0A0A0A]">
        {/* Cinematic Globe Background */}
        <div className="absolute inset-0">
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-60"
            style={{ backgroundImage: "url('/images/order_info_globe.png')" }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/30 to-black/60" />
        </div>

        {/* Curved Bottom Separator */}
        <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none z-20 pointer-events-none">
          <svg 
            className="w-full h-[60px] md:h-[120px]" 
            viewBox="0 0 1440 100" 
            preserveAspectRatio="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M0,100 C480,0 960,0 1440,100 Z" fill="#FFFFFF" />
          </svg>
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-6 md:px-12 text-center">
          {/* Main Title */}
          <h1 className="fade-up text-5xl sm:text-6xl md:text-7xl lg:text-8xl flex flex-col items-center justify-center tracking-tight leading-[0.9] mb-8">
            <span className="font-perandory text-white uppercase mb-2">Read Before</span>
            <span className="font-aston-script text-[#8A001A] lowercase drop-shadow-md">placing your order</span>
          </h1>

          {/* Decorative Line */}
          <div className="fade-up w-20 h-[2px] bg-gradient-to-r from-transparent via-[#8A001A] to-transparent mx-auto mb-10" />

          {/* Scroll Indicator */}
          <div className="fade-up mt-16 flex flex-col items-center gap-2">
            <span className="text-[9px] tracking-[0.3em] uppercase text-white/20 font-bold">Scroll to explore</span>
            <div className="w-px h-12 bg-gradient-to-b from-white/20 to-transparent relative overflow-hidden">
              <div className="w-full h-4 bg-[#8A001A] animate-bounce" style={{ animationDuration: '2s' }} />
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════ INTRO ═══════════════════════════ */}
      <section className="relative py-24 md:py-32 bg-[#FFFFFF]">
        <div className="max-w-4xl mx-auto px-6 md:px-12 text-center">
          <div className="fade-up">
            <p className="text-3xl md:text-4xl lg:text-5xl text-[#8A001A] leading-[1.6] font-aston-script">
              House of Avira curates international trends and worldwide aesthetics, bringing global styles and creative finds straight to your doorstep through a pre-order experience.
            </p>
          </div>

          <div className="fade-up mt-8">
            <p className="text-3xl md:text-4xl lg:text-5xl text-[#8A001A] leading-[1.6] font-aston-script">
              Since products are sourced internationally, shipping costs, customs charges, delivery timelines, and logistics fees may vary depending on the product, shipping conditions, customs requirements, and economic factors at the time of shipment.
            </p>
          </div>

          <div className="fade-up mt-8">
            <p className="text-3xl md:text-4xl lg:text-5xl text-[#8A001A] leading-[1.6] font-aston-script">
              We believe in complete transparency and want every customer to fully understand our ordering process before making a purchase.
            </p>
          </div>

          {/* Acknowledgment Box */}
          <div className="fade-up mt-16 relative">
            <div className="absolute -inset-px bg-gradient-to-r from-[#1a1a1a]/5 via-[#1a1a1a]/0 to-[#1a1a1a]/5 rounded-2xl" />
            <div className="relative bg-[#FAFAF8] rounded-2xl p-8 md:p-12 border border-[#1a1a1a]/5 shadow-sm text-left">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-2 h-2 rounded-full bg-[#1a1a1a] relative" />
                <span className="text-[11px] font-bold tracking-[0.3em] uppercase text-[#1a1a1a]/60">Acknowledgment</span>
              </div>
              <p className="text-[#1a1a1a]/70 text-base md:text-lg leading-[1.9] font-light">
                By placing an order with House of Avira, you acknowledge that you have <span className="text-[#1a1a1a] font-medium">read, understood, and agreed</span> to all information and policies listed below.
              </p>
            </div>
          </div>

          {/* Checklist */}
          <div className="fade-up mt-16 text-left">
            <h3 className="text-[11px] font-bold tracking-[0.3em] uppercase text-[#1a1a1a]/80 mb-8">
              Place an order only if you are comfortable with
            </h3>
            <div className="space-y-4">
              {checklist.map((item, idx) => (
                <div key={idx} className="flex items-center gap-4 group">
                  <div className="w-10 h-10 rounded-full border border-[#1a1a1a]/10 flex items-center justify-center shrink-0 group-hover:bg-[#1a1a1a]/5 group-hover:border-[#1a1a1a]/20 transition-all duration-500">
                    <svg className="w-4 h-4 text-[#1a1a1a]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-[#1a1a1a]/70 text-sm md:text-base font-light group-hover:text-[#1a1a1a] transition-colors duration-300">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════ SECTION CARDS ═══════════════════════════ */}
      <section className="py-24 md:py-32 bg-[#FAFAF8] relative overflow-hidden">
        {/* Subtle BG Pattern */}
        <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 100px, rgba(0,0,0,0.1) 100px, rgba(0,0,0,0.1) 101px)' }} />

        <div className="max-w-6xl mx-auto px-6 md:px-12 relative z-10">
          <div className="fade-up text-center mb-20">
            <span className="text-[11px] font-bold tracking-[0.4em] uppercase text-[#1a1a1a]/40 block mb-4">Explore Sections</span>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif text-[#1a1a1a] tracking-tight">
              Everything You<br />Need to Know
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {sections.map((section, idx) => (
              <Link
                key={section.number}
                href={section.href}
                className="fade-up group relative block"
              >
                {/* Card */}
                <div className="relative bg-[#FFFFFF] border border-[#1a1a1a]/[0.06] rounded-2xl p-8 md:p-10 h-full flex flex-col transition-all duration-700 hover:border-[#1a1a1a]/[0.15] hover:shadow-[0_12px_40px_-10px_rgba(0,0,0,0.06)] overflow-hidden">
                  {/* Background Number */}
                  <span className="absolute -top-6 -right-4 text-[140px] font-serif font-light text-[#1a1a1a]/[0.02] leading-none select-none group-hover:text-[#1a1a1a]/[0.04] transition-colors duration-700">
                    {section.number}
                  </span>

                  {/* Icon */}
                  <div className="relative z-10 w-16 h-16 rounded-2xl bg-[#FAFAF8] border border-[#1a1a1a]/[0.05] flex items-center justify-center mb-8 text-[#1a1a1a] group-hover:bg-[#1a1a1a] group-hover:text-white transition-all duration-500 float-icon">
                    {section.icon}
                  </div>

                  {/* Number Tag */}
                  <span className="relative z-10 text-[10px] font-bold tracking-[0.3em] uppercase text-[#1a1a1a]/30 mb-3 block">Section {section.number}</span>

                  {/* Title */}
                  <h3 className="relative z-10 text-xl md:text-2xl font-serif text-[#1a1a1a] mb-4 group-hover:text-[#1a1a1a] transition-colors duration-500">
                    {section.title}
                  </h3>

                  {/* Description */}
                  <p className="relative z-10 text-sm text-[#1a1a1a]/60 leading-[1.8] font-light flex-1 mb-8">
                    {section.description}
                  </p>

                  {/* CTA */}
                  <div className="relative z-10 flex items-center gap-3 text-[#1a1a1a]/70 group-hover:text-[#1a1a1a] transition-colors duration-300">
                    <span className="text-[10px] font-bold tracking-[0.2em] uppercase">Read Section</span>
                    <svg className="w-4 h-4 group-hover:translate-x-2 transition-transform duration-500" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </div>

                  {/* Bottom Accent Line */}
                  <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#1a1a1a] scale-x-0 group-hover:scale-x-100 transition-transform duration-700" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════ BOTTOM ═══════════════════════════ */}
      <section className="py-24 md:py-32 bg-[#FFFFFF]">
        <div className="max-w-3xl mx-auto px-6 md:px-12 text-center">
          <div className="fade-up">
            {/* Heart Icon */}
            <div className="w-14 h-14 rounded-full bg-[#FAFAF8] border border-[#1a1a1a]/10 flex items-center justify-center mx-auto mb-8">
              <svg className="w-5 h-5 text-[#1a1a1a]/80" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
            </div>

            <p className="text-base md:text-lg text-[#1a1a1a]/70 leading-[1.9] font-light max-w-lg mx-auto">
              We value transparency and customer trust above everything else. By placing an order, you confirm that you have read and agreed to all policies.
            </p>
            <p className="text-sm text-[#1a1a1a]/50 mt-6 font-light">
              Thank you for trusting House of Avira <span className="text-[#8A001A]">♥</span>
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
