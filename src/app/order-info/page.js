'use client';

import Link from 'next/link';
import { useEffect, useRef } from 'react';
import RadialOrbitalTimeline from '@/components/ui/radial-orbital-timeline';
import { DollarSign, ShieldAlert, Clock, AlertTriangle, CreditCard } from 'lucide-react';
import { TextRevealByWord } from '@/components/ui/text-reveal';

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

const timelineData = [
  {
    id: 1,
    title: "Variable Shipping Costs",
    date: "AWARENESS",
    content: "Shipping costs may vary depending on the destination, weight, and current logistics rates.",
    category: "Logistics",
    icon: DollarSign,
    relatedIds: [2, 3],
    status: "in-progress",
    energy: 90,
  },
  {
    id: 2,
    title: "Customs & Clearance",
    date: "INTERNATIONAL",
    content: "Customs procedures and clearance requirements are subject to local government regulations and may incur additional fees.",
    category: "Legal",
    icon: ShieldAlert,
    relatedIds: [1, 4],
    status: "pending",
    energy: 70,
  },
  {
    id: 3,
    title: "Estimated Delivery",
    date: "TIMELINES",
    content: "Delivery timelines are estimates and not guarantees, influenced by international transit and local couriers.",
    category: "Logistics",
    icon: Clock,
    relatedIds: [1, 4],
    status: "in-progress",
    energy: 85,
  },
  {
    id: 4,
    title: "Possible Delays",
    date: "EXTERNAL",
    content: "Delays can occur due to external factors like weather, global events, or carrier disruptions.",
    category: "Risk",
    icon: AlertTriangle,
    relatedIds: [2, 3],
    status: "pending",
    energy: 60,
  },
  {
    id: 5,
    title: "Store Policies",
    date: "AGREEMENT",
    content: "By ordering, you agree to our payment structure, slot fees, and overall store policies.",
    category: "Policy",
    icon: CreditCard,
    relatedIds: [1, 2, 3, 4],
    status: "completed",
    energy: 100,
  }
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
            <span className="font-aston-script text-[#8A001A] lowercase drop-shadow-md">Placing Your Order</span>
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

          <div className="mt-8">
            <TextRevealByWord text="Since products are sourced internationally, shipping costs, customs charges, delivery timelines, and logistics fees may vary depending on the product, shipping conditions, customs requirements, and economic factors at the time of shipment. We believe in complete transparency and want every customer to fully understand our ordering process before making a purchase." />
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
                By placing an order with House of Avira, you acknowledge that you have <span className="text-[#1a1a1a] font-medium">read, understood, and agreed</span> to all information and policies listed.
              </p>
            </div>
          </div>

          {/* Orbital Checklist Timeline */}
          <div className="fade-up mt-24 text-left border-t border-[#1a1a1a]/10 pt-16 relative">
            <h3 className="text-3xl md:text-4xl lg:text-5xl font-perandory font-bold text-[#1a1a1a] mb-4 tracking-tight fade-up">
              Place an order only if you are comfortable with...
            </h3>
            <p className="text-[#1a1a1a]/50 text-sm font-sans mb-8">
              Click on any orbital node to expand its details
            </p>
            <div className="-mx-6 md:mx-0">
              <RadialOrbitalTimeline timelineData={timelineData} />
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
            <span className="text-[11px] font-bold tracking-[0.4em] uppercase text-[#8A001A] block mb-4">Explore Sections</span>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-perandory text-[#1a1a1a] tracking-tight">
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
                <div className="relative bg-[#B2D5E5] border border-white/40 rounded-[32px] p-8 md:p-10 h-full flex flex-col transition-all duration-700 hover:-translate-y-3 hover:shadow-[0_30px_60px_-15px_rgba(178,213,229,0.6)] overflow-hidden group-hover:border-white/80">
                  {/* Background Number */}
                  <span className="absolute -top-6 -right-4 text-[140px] font-bold text-white/30 leading-none select-none transition-transform duration-700 font-sans group-hover:scale-110 group-hover:rotate-6">
                    {section.number}
                  </span>

                  {/* Icon */}
                  <div className="relative z-10 w-16 h-16 rounded-2xl bg-white/60 backdrop-blur-md text-[#1a1a1a] flex items-center justify-center mb-10 group-hover:bg-white group-hover:text-[#8A001A] group-hover:shadow-xl transition-all duration-500 group-hover:-translate-y-2">
                    {section.icon}
                  </div>

                  {/* Number Tag */}
                  <span className="relative z-10 text-[10px] font-bold tracking-[0.3em] uppercase text-[#1a1a1a]/60 mb-3 block group-hover:text-[#1a1a1a] transition-colors duration-500">Section {section.number}</span>

                  {/* Title */}
                  <h3 className="relative z-10 text-2xl md:text-3xl font-bold text-[#1a1a1a] mb-5 tracking-tight font-sans">
                    {section.title}
                  </h3>

                  {/* Description */}
                  <p className="relative z-10 text-sm md:text-base text-[#1a1a1a]/80 leading-relaxed font-medium flex-1 mb-10">
                    {section.description}
                  </p>

                  {/* CTA */}
                  <div className="relative z-10 flex items-center gap-4 text-[#1a1a1a] font-bold">
                    <span className="text-[11px] tracking-[0.2em] uppercase relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-px after:bg-[#1a1a1a] after:scale-x-0 group-hover:after:scale-x-100 after:transition-transform after:duration-500 after:origin-left pb-1">
                      Read Section
                    </span>
                    <div className="w-8 h-8 rounded-full bg-white/40 flex items-center justify-center group-hover:bg-white group-hover:shadow-lg transition-all duration-500 group-hover:translate-x-3">
                      <svg className="w-4 h-4 transition-transform duration-500" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════ BOTTOM ═══════════════════════════ */}
      <section className="relative py-24 md:py-32 bg-[#FFFFFF] overflow-hidden">
        {/* Background Image */}
        <div
          className="absolute inset-0 z-0 opacity-[0.85]"
          style={{
            backgroundImage: "url('/real.png')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat"
          }}
        />

        <div className="relative z-10 max-w-3xl mx-auto px-6 md:px-12 text-center">
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
