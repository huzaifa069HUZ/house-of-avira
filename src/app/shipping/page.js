'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import breakdownImg from '../../../15f12b5c-ac29-439c-81bc-14b46ef75005.png';
import { 
  Route, Plane, Tag, Shield, HelpCircle, 
  Store, Home, UserRound, Ship, Weight, Award, 
  Landmark, MapPin, Package, Gem, Droplet, Box, 
  Footprints, ChevronDown, Sparkles, Heart, Calculator, Truck
} from 'lucide-react';

const FadeIn = ({ children, delay = 0, className = "" }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-50px" }}
    transition={{ duration: 0.6, delay, ease: "easeOut" }}
    className={className}
  >
    {children}
  </motion.div>
);

const TimelineItem = ({ step, idx }) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 85%", "start 40%"]
  });
  const opacity = useTransform(scrollYProgress, [0, 1], [0.2, 1]);
  const x = useTransform(scrollYProgress, [0, 1], [-20, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [0.95, 1]);
  const isActionRequired = step.badge === 'ACTION REQUIRED';

  return (
    <motion.div ref={ref} style={{ opacity, x, scale }} className={`relative group ${isActionRequired ? 'bg-gradient-to-r from-[#FFF5F2] to-white -mx-4 md:-mx-6 px-4 md:px-6 py-5 rounded-2xl border-l-4 border-l-[#D92D20] border-y border-r border-[#F0D4C4] shadow-md my-6 z-20' : 'py-4'}`}>
      <div className={`absolute ${isActionRequired ? '-left-[18px] md:-left-[28px] top-6 w-5 h-5' : '-left-[30px] md:-left-[38px] top-5 w-4 h-4'} rounded-full border-2 ${isActionRequired ? 'border-[#D92D20] bg-white shadow-[0_0_0_4px_#FEE4E2] animate-pulse' : 'border-[#C97B6E] bg-[#FAF7F2]'} z-10 transition-all duration-300 ${step.state === 'done' ? 'bg-[#C97B6E]' : ''}`}></div>
      <div>
        <div className={`flex items-center flex-wrap gap-3 mb-2 transition-colors ${isActionRequired ? 'text-[#D92D20] text-[18px] font-bold' : 'text-[#2D2420] text-[16px] font-medium group-hover:text-[#C97B6E]'}`}>
          {step.title}
          {step.badge && (
            <span className={`${isActionRequired ? 'bg-[#D92D20] text-white text-[12px] px-3 py-1 shadow-sm' : 'bg-[#FDE8DC] text-[#8B3A1E] text-[10px] px-2 py-0.5'} font-bold rounded-full tracking-widest uppercase flex items-center gap-1`}>
              {isActionRequired && <Sparkles className="w-3 h-3 animate-pulse" />} {step.badge}
            </span>
          )}
          {step.icon && <step.icon className={`w-4 h-4 ${isActionRequired ? 'text-[#D92D20]' : 'text-[#C97B6E]'} ml-1`} />}
        </div>
        <div className={`leading-relaxed ${isActionRequired ? 'text-[#8B3A1E] text-[14px] font-medium' : 'text-[#6B5248] text-[14px]'}`}>{step.desc}</div>
      </div>
    </motion.div>
  );
};

export default function ShippingPage() {
  const [activeSection, setActiveSection] = useState('how-it-works');
  const [openFaq, setOpenFaq] = useState(null);
  const heroRef = useRef(null);
  const { scrollYProgress: heroScroll } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(heroScroll, [0, 1], ["0%", "50%"]);
  const heroOpacity = useTransform(heroScroll, [0, 1], [1, 0]);

  const sections = ['how-it-works', 'shipping-modes', 'special-cats', 'policies', 'faq'];

  // Handle intersection for sticky nav highlighting
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    }, { threshold: 0.2, rootMargin: "-100px 0px 0px 0px" });

    sections.forEach(id => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) {
      const y = el.getBoundingClientRect().top + window.scrollY - 100;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  const reviews = [
    { name: "Priya S.", location: "Mumbai, Maharashtra", text: "Was skeptical about the wait time, but my Coach bag arrived in perfect condition. The constant updates kept me at ease. Totally worth the wait!", rating: 5, item: "Coach Tabby" },
    { name: "Anjali R.", location: "Delhi, NCR", text: "The two-tier shipping sounded confusing at first, but it makes so much sense. Paid exact customs, no hidden charges. Highly transparent!", rating: 5, item: "Rhode Lip Tint Set" },
    { name: "Meera K.", location: "Bangalore, Karnataka", text: "Got my Hello Kitty merch faster than expected. The packaging was super secure. Will definitely preorder again.", rating: 5, item: "Sanrio Collection" },
    { name: "Sneha M.", location: "Pune, Maharashtra", text: "I've ordered international before and paid crazy surprise duties. Avira's method is so much better. You know what you're paying for.", rating: 5, item: "Nike Dunks" },
    { name: "Riya T.", location: "Hyderabad, Telangana", text: "Beautiful experience! The customer service was so sweet and answered all my 100 questions. Product is 100% authentic.", rating: 5, item: "Dior Saddle" },
    { name: "Kavya V.", location: "Chennai, Tamil Nadu", text: "Love the transparency! The air shipping for my rare makeup finds was surprisingly fast.", rating: 5, item: "Rare Beauty Blush" },
  ];

  const faqs = [
    {
      q: "Why can't you tell me the shipping cost upfront?",
      a: "We ship in batches. The international cost is split equally among all customers based on the total package weight. Since we collect all orders first and then ship together, the exact per-customer cost is only known when the full batch is packed. This ensures you're charged accurately — never based on a rough estimate."
    },
    {
      q: "Is COD (Cash on Delivery) available?",
      a: "No, COD is not available at House of Avira. We deal with imported products sourced internationally on your behalf — payment must be received before the order can be placed with our suppliers. We accept GPay, Paytm, UPI, bank transfers, and card payments."
    },
    {
      q: "How long will my order take?",
      a: "It depends on the shipping mode. Air shipping takes approximately 15 days from dispatch. Sea shipping takes 2–3 months. The total timeline includes batch collection time, international transit, customs clearance, and domestic delivery. All timelines are estimates — delays can occur due to customs and logistics."
    },
    {
      q: "Can I cancel my order if I change my mind?",
      a: "No. Once an order is placed, it is submitted to our suppliers immediately and cannot be cancelled, refunded, or exchanged. This applies even if there are delays, even if the shipping cost is higher than expected, and even if the shipping invoice has not yet been paid. Please only order if you are fully committed to the purchase."
    },
    {
      q: "What if I don't pay the shipping invoice on time?",
      a: "If the shipping invoice is not paid by the specified deadline, your parcel will not be shipped. No refund will be issued for your product payment, as the order has already been placed with our suppliers on your behalf. Please pay shipping invoices promptly when they are sent."
    },
    {
      q: "Are customs and duty charges included in the shipping invoice?",
      a: "Yes. India's customs duties and GST on imports are calculated and included in your international shipping invoice. You will receive a full itemised breakdown showing the shipping cost, customs duty, and GST before you are required to pay anything."
    },
    {
      q: "My order is delayed — can I get a refund?",
      a: "No. Delivery delays are not grounds for a refund or cancellation. International shipping and customs timelines can vary significantly due to factors completely outside our control. We ask that you only place an order if you are patient and comfortable with variable timelines. We will always keep you updated on your order's progress."
    }
  ];

  return (
    <div className="bg-[#FAF7F2] text-[#2D2420] min-h-screen font-sans selection:bg-[#C97B6E] selection:text-white overflow-x-hidden">
      
      {/* Education Marquee */}
      <div className="bg-[#8B5E52] text-white text-[11px] font-medium tracking-widest py-2.5 overflow-hidden whitespace-nowrap flex">
        <div className="animate-marquee-full flex shrink-0 items-center">
          {[...Array(4)].map((_, i) => (
            <span key={i} className="mx-4 uppercase">
              House of Avira is a preorder &amp; import business &middot; Products are sourced internationally &middot; Shipping is charged separately &middot; No cancellations or refunds after ordering &middot; Delivery timelines are estimates only &middot;
            </span>
          ))}
        </div>
        <div className="animate-marquee-full flex shrink-0 items-center" aria-hidden="true">
          {[...Array(4)].map((_, i) => (
            <span key={i} className="mx-4 uppercase">
              House of Avira is a preorder &amp; import business &middot; Products are sourced internationally &middot; Shipping is charged separately &middot; No cancellations or refunds after ordering &middot; Delivery timelines are estimates only &middot;
            </span>
          ))}
        </div>
      </div>

      {/* Sticky Nav */}
      <nav className="sticky top-0 z-50 bg-[#FAF7F2]/90 backdrop-blur-md border-b border-[#E8C4B8] px-6 md:px-8 h-14 flex items-center justify-between">
        <div className="font-perandory text-lg font-medium text-[#2D2420]">House of Avira</div>
        <div className="hidden md:flex gap-8">
          {[
            { id: 'how-it-works', label: 'How It Works' },
            { id: 'shipping-modes', label: 'Shipping Modes' },
            { id: 'policies', label: 'Policies' },
            { id: 'faq', label: 'FAQ' }
          ].map(link => (
            <button 
              key={link.id}
              onClick={() => scrollTo(link.id)}
              className={`text-[13px] font-medium transition-colors border-b-[1.5px] py-1 ${
                activeSection === link.id ? 'border-[#C97B6E] text-[#C97B6E]' : 'border-transparent text-[#8B5E52] hover:text-[#C97B6E]'
              }`}
            >
              {link.label}
            </button>
          ))}
        </div>
      </nav>

      {/* Hero */}
      <header ref={heroRef} className="relative pt-24 pb-20 px-6 text-center max-w-5xl mx-auto overflow-hidden rounded-b-[40px] mb-8">
        <motion.div style={{ y: heroY, opacity: heroOpacity }} className="absolute inset-0 z-0">
          <Image src="/shipping/hero.png" alt="Shipping Box" fill className="object-cover opacity-50 mix-blend-multiply" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#FAF7F2] via-[#FAF7F2]/60 to-[#FAF7F2]/90" />
        </motion.div>
        
        <FadeIn className="relative z-10">
          <div className="text-[11px] tracking-[0.12em] uppercase text-[#B8A99A] font-medium mb-4">Shipping &amp; Import Information</div>
          <h1 className="font-perandory text-5xl md:text-6xl font-light text-[#2D2420] mb-5 leading-tight">
            Everything about<br />
            <em className="font-aston-script text-5xl md:text-7xl lowercase text-[#8B5E52]">how your order travels</em>
          </h1>
          <div className="bg-gradient-to-br from-[#FDF0EB] to-[#FAF7F2] border-2 border-[#E8C4B8] rounded-2xl p-6 md:p-8 max-w-2xl mx-auto mb-12 shadow-sm relative overflow-hidden group hover:border-[#C97B6E] transition-colors duration-500">
            <div className="absolute -top-6 -right-6 p-4 opacity-10 group-hover:opacity-20 transition-opacity duration-500 group-hover:rotate-12">
              <Sparkles className="w-32 h-32 text-[#C97B6E]" />
            </div>
            <p className="text-lg md:text-xl text-[#8B3A1E] font-medium leading-relaxed relative z-10 italic">
              "From our suppliers abroad to your doorstep in India — here's exactly how our two-tier shipping model works, and what to expect every step of the way."
            </p>
          </div>
          
          <div className="flex flex-wrap justify-center gap-3">
            {[
              { id: 'how-it-works', icon: Route, label: 'The Journey' },
              { id: 'shipping-modes', icon: Plane, label: 'Air vs Sea' },
              { id: 'special-cats', icon: Tag, label: 'Special Categories' },
              { id: 'policies', icon: Shield, label: 'Policies' },
              { id: 'faq', icon: HelpCircle, label: 'FAQ' }
            ].map(btn => (
              <button 
                key={btn.id}
                onClick={() => scrollTo(btn.id)}
                className="bg-white border border-[#E8C4B8] rounded-full px-5 py-2.5 text-[13px] text-[#8B5E52] font-medium hover:bg-[#E8C4B8] hover:text-[#2D2420] transition-all flex items-center gap-2"
              >
                <btn.icon className="w-4 h-4" /> {btn.label}
              </button>
            ))}
          </div>
        </FadeIn>
      </header>

      <div className="h-px bg-gradient-to-r from-transparent via-[#E8C4B8] to-transparent max-w-5xl mx-auto"></div>

      <main className="max-w-4xl mx-auto px-6 py-16 md:py-24 space-y-24 md:space-y-32">
        
        {/* SECTION 1: HOW IT WORKS */}
        <section id="how-it-works" className="scroll-mt-24">
          <FadeIn>
            <div className="text-[11px] tracking-[0.12em] uppercase text-[#C97B6E] font-medium mb-3">Section 01</div>
            <h2 className="font-perandory text-4xl text-[#2D2420] mb-4">Your order's two-tier journey</h2>
            <p className="text-[15px] text-[#6B5248] leading-relaxed mb-10">There are two separate shipping charges on every order. Understanding this is key to placing your preorder with confidence.</p>
          </FadeIn>

          {/* Diagram */}
          <FadeIn delay={0.1}>
            <style dangerouslySetInnerHTML={{__html: `
              @keyframes flow {
                to { stroke-dashoffset: -12; }
              }
              .animate-flow { animation: flow 1s linear infinite; }
            `}} />
            <div className="bg-white border border-[#E8C4B8]/50 rounded-[32px] p-6 md:p-12 mb-12 shadow-[0_8px_30px_rgb(0,0,0,0.04)] relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-[#FDF0EB] rounded-full blur-3xl opacity-50 -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
              
              <h3 className="font-sans font-black tracking-tight text-2xl md:text-3xl text-center text-[#2D2420] mb-12 relative z-10">
                International + Domestic Flow
              </h3>
              
              {/* Tier 1 */}
              <div className="flex flex-col md:flex-row items-center gap-6 md:gap-0 mb-12 relative z-10">
                <div className="w-full md:w-[240px] shrink-0 bg-white border border-[#E8C4B8] rounded-[24px] p-5 text-center overflow-hidden relative group shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgba(201,123,110,0.15)] hover:-translate-y-1 transition-all duration-300 z-10">
                  <div className="absolute top-4 right-4 w-2 h-2 rounded-full bg-[#C97B6E] animate-pulse"></div>
                  <div className="w-full h-[120px] rounded-xl overflow-hidden mb-5 relative ring-1 ring-black/5">
                    <Image src="/shipping/international.png" alt="International Shipping" fill className="object-cover group-hover:scale-110 transition-transform duration-700" />
                  </div>
                  <div className="text-[15px] font-extrabold tracking-tight text-[#2D2420] leading-snug">Suppliers &amp; Manufacturers</div>
                  <div className="text-[11px] text-[#B8A99A] mt-1.5 font-bold tracking-[0.2em] uppercase">Abroad</div>
                </div>
                
                <div className="flex-1 flex flex-col items-center px-4 w-full relative min-h-[80px] md:min-h-0 justify-center">
                  <svg className="hidden md:block absolute top-1/2 left-0 w-full h-[2px] -translate-y-1/2 z-0" preserveAspectRatio="none">
                    <line x1="0" y1="1" x2="100%" y2="1" stroke="#E8C4B8" strokeWidth="2" strokeDasharray="6 6" className="animate-flow" />
                  </svg>
                  <div className="md:hidden absolute left-1/2 top-0 w-[2px] h-full -translate-x-1/2 z-0">
                    <line x1="1" y1="0" x2="1" y2="100%" stroke="#E8C4B8" strokeWidth="2" strokeDasharray="6 6" className="animate-flow" />
                  </div>
                  
                  <div className="bg-white border-2 border-[#8A001A] rounded-xl p-4 w-full md:w-[85%] text-center relative z-10 shadow-[0_8px_30px_rgba(138,0,26,0.12)] group hover:-translate-y-1 transition-all duration-300">
                    <div className="text-[13px] font-extrabold tracking-tight text-[#8A001A] mb-1.5 flex items-center justify-center gap-2">
                      <Plane className="w-4 h-4" /> International Shipping
                    </div>
                    <div className="text-[12px] text-[#6B5248] font-medium leading-relaxed">Cost split equally among all customers. Charged separately.</div>
                  </div>
                </div>

                <div className="w-full md:w-[180px] shrink-0 bg-white border border-[#E8C4B8] rounded-[24px] p-6 text-center shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgba(201,123,110,0.15)] hover:-translate-y-1 transition-all duration-300 z-10 relative group">
                  <div className="w-14 h-14 mx-auto bg-gradient-to-br from-[#FDF0EB] to-[#FAF7F2] rounded-full flex items-center justify-center mb-4 ring-1 ring-[#E8C4B8]/50 shadow-inner group-hover:scale-110 transition-transform duration-300">
                    <Home className="w-6 h-6 text-[#C97B6E]" />
                  </div>
                  <div className="text-[15px] font-extrabold tracking-tight text-[#2D2420] leading-snug">House of Avira</div>
                  <div className="text-[11px] text-[#B8A99A] mt-1.5 font-bold tracking-[0.2em] uppercase">India</div>
                </div>
              </div>

              {/* Separator */}
              <div className="flex items-center gap-3 my-6">
                <div className="flex-1 h-px bg-[#EDE0D8]"></div>
                <div className="bg-[#8B5E52] text-white rounded-full text-[9px] font-semibold px-3 py-1 tracking-widest uppercase shadow-sm">Arrives in India &middot; Customs Cleared</div>
                <div className="flex-1 h-px bg-[#EDE0D8]"></div>
              </div>

              {/* Tier 2 */}
              <div className="flex flex-col md:flex-row items-center gap-6 md:gap-0 relative z-10">
                <div className="w-full md:w-[180px] shrink-0 bg-white border border-[#B0D4E8] rounded-[24px] p-6 text-center shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgba(74,122,173,0.15)] hover:-translate-y-1 transition-all duration-300 z-10 relative group">
                  <div className="w-14 h-14 mx-auto bg-gradient-to-br from-[#EDF6FB] to-white rounded-full flex items-center justify-center mb-4 ring-1 ring-[#B0D4E8]/50 shadow-inner group-hover:scale-110 transition-transform duration-300">
                    <Home className="w-6 h-6 text-[#4A7AAD]" />
                  </div>
                  <div className="text-[15px] font-extrabold tracking-tight text-[#2D2420] leading-snug">House of Avira</div>
                  <div className="text-[11px] text-[#B8A99A] mt-1.5 font-bold tracking-[0.2em] uppercase">India</div>
                </div>
                
                <div className="flex-1 flex flex-col items-center px-4 w-full relative min-h-[80px] md:min-h-0 justify-center">
                  <svg className="hidden md:block absolute top-1/2 left-0 w-full h-[2px] -translate-y-1/2 z-0" preserveAspectRatio="none">
                    <line x1="0" y1="1" x2="100%" y2="1" stroke="#B0D4E8" strokeWidth="2" strokeDasharray="6 6" className="animate-flow" />
                  </svg>
                  <div className="md:hidden absolute left-1/2 top-0 w-[2px] h-full -translate-x-1/2 z-0">
                    <line x1="1" y1="0" x2="1" y2="100%" stroke="#B0D4E8" strokeWidth="2" strokeDasharray="6 6" className="animate-flow" />
                  </div>
                  
                  <div className="bg-white border-2 border-[#8A001A] rounded-xl p-4 w-full md:w-[85%] text-center relative z-10 shadow-[0_8px_30px_rgba(138,0,26,0.12)] group hover:-translate-y-1 transition-all duration-300">
                    <div className="text-[13px] font-extrabold tracking-tight text-[#8A001A] mb-1.5 flex items-center justify-center gap-2">
                      <Truck className="w-4 h-4" /> Domestic Shipping
                    </div>
                    <div className="text-[12px] text-[#6B5248] font-medium leading-relaxed">Cost based on pincode & weight. Charged before dispatch.</div>
                  </div>
                </div>

                <div className="w-full md:w-[240px] shrink-0 bg-white border border-[#B0D4E8] rounded-[24px] p-5 text-center overflow-hidden relative group shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgba(74,122,173,0.15)] hover:-translate-y-1 transition-all duration-300 z-10">
                  <div className="absolute top-4 right-4 w-2 h-2 rounded-full bg-[#4A7AAD] animate-pulse"></div>
                  <div className="w-full h-[120px] rounded-xl overflow-hidden mb-5 relative ring-1 ring-black/5">
                    <Image src="/shipping/domestic.png" alt="Domestic Shipping" fill className="object-cover group-hover:scale-110 transition-transform duration-700" />
                  </div>
                  <div className="text-[15px] font-extrabold tracking-tight text-[#2D2420] leading-snug">You</div>
                  <div className="text-[11px] text-[#B8A99A] mt-1.5 font-bold tracking-[0.2em] uppercase">Your doorstep</div>
                </div>
              </div>

              <div className="bg-[#FDF6F0] border border-[#F0D4C4] rounded-xl p-4 md:p-5 mt-8 text-[13px] text-[#6B5248] leading-relaxed">
                <strong className="text-[#8B3A1E] font-medium block mb-1">Why can't we give you the exact shipping cost upfront?</strong>
                International shipping is calculated based on the <em>total batch weight</em> — the combined weight of all orders in your batch. Since we collect orders first and ship together, the exact per-customer cost is only known when the batch is packed and ready to ship. This method ensures you're charged accurately — never overcharged on a rough estimate.
              </div>

              {/* Media Section for Price Breakdown */}
              <div className="mt-10 border-t border-[#E8C4B8] pt-8">
                <h4 className="font-perandory text-xl text-center text-[#2D2420] mb-6">Visual Price Breakdown</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="rounded-xl overflow-hidden border border-[#E8C4B8] shadow-sm bg-[#FAF7F2]">
                    <video 
                      src="/pricing/product price breakdown.mp4" 
                      controls 
                      autoPlay
                      muted
                      loop
                      playsInline
                      className="w-full h-full object-cover"
                    >
                      Your browser does not support the video tag.
                    </video>
                  </div>
                  <div className="rounded-xl overflow-hidden border border-[#E8C4B8] shadow-sm bg-white flex items-center justify-center">
                    <Image src={breakdownImg} alt="Price Breakdown" className="w-full h-auto" />
                  </div>
                </div>
              </div>
            </div>
          </FadeIn>

          <FadeIn delay={0.2}>
            <div className="text-[11px] tracking-[0.12em] uppercase text-[#C97B6E] font-medium mb-2 mt-16">Your Order Timeline</div>
            <h3 className="font-perandory text-3xl text-[#2D2420] mb-10">13 stages from order to delivery</h3>
            
            <div className="relative pl-8 md:pl-10">
              {/* Timeline Line */}
              <div className="absolute left-[11px] top-2 bottom-2 w-0.5 bg-gradient-to-b from-[#E8C4B8] via-[#C97B6E] to-[#E8C4B8]"></div>
              
              <div className="space-y-4">
                {[
                  { state: 'done', title: 'Order Placed & Product Payment Received', desc: 'You pay the product price only. Order confirmed. Your batch assignment begins.' },
                  { state: 'done', title: 'Batch Being Collected', desc: 'Your order is grouped with other orders into a batch for cost-efficient international shipping.' },
                  { state: 'done', title: 'Supplier Order Placed', desc: 'We place the order with our international suppliers on your behalf.' },
                  { state: 'done', title: 'Products at International Warehouse', desc: 'Your product has arrived at our international warehouse. Batch packing begins.' },
                  { state: 'active', title: 'International Shipping Invoice Sent', badge: 'ACTION REQUIRED', desc: 'We send you the calculated international shipping amount. Must be paid by the deadline to proceed.' },
                  { state: 'pending', title: 'International Shipping Paid', desc: 'Payment confirmed. Batch dispatched from our international warehouse towards India.' },
                  { state: 'pending', title: 'Dispatched to India & Customs & Clearance', desc: 'Shipment is in transit. Customs clearance happens at this stage. Customs fees are already included in your international shipping invoice.' },
                  { state: 'pending', title: 'Arrived in India', desc: 'Your order has cleared customs and arrived with us in India.' },
                  { state: 'pending', title: 'Domestic Shipping Invoice Sent', badge: 'ACTION REQUIRED', desc: 'We calculate your courier cost based on your pincode and package weight and send you the invoice.' },
                  { state: 'pending', title: 'Domestic Shipping Paid', desc: 'Payment confirmed. Your order is being packed for final domestic dispatch.' },
                  { state: 'pending', title: 'Dispatched Domestically', desc: 'Your order is with the courier. Tracking ID has been shared with you.' },
                  { state: 'pending', title: 'Delivered', icon: Heart, desc: 'Your order is at your door. Please record your unboxing — we love seeing it!' }
                ].map((step, idx) => (
                  <TimelineItem key={idx} step={step} idx={idx} />
                ))}
              </div>
            </div>
          </FadeIn>
        </section>

        <div className="h-px bg-gradient-to-r from-transparent via-[#E8C4B8] to-transparent w-full"></div>

        {/* SECTION 2: SHIPPING MODES */}
        <section id="shipping-modes" className="scroll-mt-24">
          <FadeIn>
            <div className="text-[11px] tracking-[0.12em] uppercase text-[#8A001A] font-bold mb-3">Section 02</div>
            <h2 className="font-sans font-black tracking-tight text-4xl text-[#2D2420] mb-4">Air vs Sea shipping</h2>
            <p className="text-[16px] font-medium text-[#6B5248] leading-relaxed mb-12 max-w-2xl">Most packages travel by sea — it's the default and most affordable option. Air shipping is faster but costs more, and requires a minimum batch weight to proceed.</p>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
            <FadeIn delay={0.1}>
              <div className="bg-white border border-gray-100 rounded-[32px] p-8 h-full hover:-translate-y-2 transition-all duration-300 shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:shadow-[0_8px_30px_rgba(138,0,26,0.08)] group relative overflow-hidden">
                <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-bl from-[#FDE8DC] to-transparent opacity-40 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700"></div>
                <div className="inline-flex items-center gap-1.5 bg-white border border-[#8A001A]/20 text-[#8A001A] text-[11px] font-extrabold tracking-widest uppercase px-4 py-1.5 rounded-full mb-6 shadow-sm relative z-10">
                  <Plane className="w-4 h-4" /> Air Shipping
                </div>
                <h3 className="font-sans font-black tracking-tight text-3xl md:text-4xl text-[#2D2420] mb-2 relative z-10">Fast Delivery</h3>
                <div className="font-mono text-[16px] font-bold text-[#8A001A] mb-8 relative z-10">~ 15 days</div>
                
                <ul className="space-y-4 mb-8 relative z-10">
                  {['Higher cost due to air freight', 'Requires a minimum batch weight to proceed', 'If minimum weight not met, automatically shifts to sea shipping'].map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-[14px] font-medium text-[#6B5248] leading-relaxed">
                      <div className="w-2 h-2 rounded-full bg-[#8A001A] mt-2 shrink-0"></div> {item}
                    </li>
                  ))}
                </ul>
                
                <div className="bg-gradient-to-r from-[#FFF5F2] to-white border border-[#FDE8DC] rounded-xl p-4 text-[13px] text-[#8B5E52] leading-relaxed relative z-10">
                  <strong className="text-[#8A001A] font-extrabold">Liquids only by air.</strong> Products like lip gloss and liquid beauty items are only eligible for air shipping — not sea.
                </div>
              </div>
            </FadeIn>

            <FadeIn delay={0.2}>
              <div className="bg-white border border-gray-100 rounded-[32px] p-8 h-full hover:-translate-y-2 transition-all duration-300 shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:shadow-[0_8px_30px_rgba(30,74,114,0.08)] group relative overflow-hidden">
                <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-bl from-[#DCE8F5] to-transparent opacity-50 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700"></div>
                <div className="inline-flex items-center gap-1.5 bg-white border border-[#1E4A72]/20 text-[#1E4A72] text-[11px] font-extrabold tracking-widest uppercase px-4 py-1.5 rounded-full mb-6 shadow-sm relative z-10">
                  <Ship className="w-4 h-4" /> Sea Shipping
                </div>
                <h3 className="font-sans font-black tracking-tight text-3xl md:text-4xl text-[#2D2420] mb-2 relative z-10">Budget Friendly</h3>
                <div className="font-mono text-[16px] font-bold text-[#1E4A72] mb-8 relative z-10">2 – 3 months</div>
                
                <ul className="space-y-4 mb-8 relative z-10">
                  {['Much more affordable than air freight', 'Default option for most packages', 'Best for bags, apparel, and accessories'].map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-[14px] font-medium text-[#6B5248] leading-relaxed">
                      <div className="w-2 h-2 rounded-full bg-[#1E4A72] mt-2 shrink-0"></div> {item}
                    </li>
                  ))}
                </ul>
                
                <div className="bg-gradient-to-r from-[#F0F4FB] to-white border border-[#DCE8F5] rounded-xl p-4 text-[13px] text-[#1E4A72] leading-relaxed relative z-10">
                  <strong className="font-extrabold">Most orders ship sea.</strong> This is the standard method for non-liquid products unless air is available for your batch.
                </div>
              </div>
            </FadeIn>
          </div>

          <FadeIn>
            <div className="text-[11px] tracking-[0.12em] uppercase text-[#8A001A] font-bold mb-3">What affects your cost</div>
            <h3 className="font-sans font-black tracking-tight text-3xl md:text-4xl text-[#2D2420] mb-10">Factors that determine shipping price</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { icon: Weight, color: '#8A001A', title: 'Product Weight', desc: 'Heavier products take a larger share of the total batch shipping cost.' },
                { icon: Award, color: '#C9A96E', title: 'Brand Tier', desc: 'Branded items (Coach, LV, Nike, Dior) attract higher duty and customs fees.' },
                { icon: Tag, color: '#1E4A72', title: 'Product Type', desc: 'Bags, apparel, beauty, shoes, and accessories each have different duty rates.' },
                { icon: Landmark, color: '#4A7AAD', title: 'Customs & Duties', desc: "India's import duty varies by category. Included in your international shipping invoice." },
              ].map((factor, i) => (
                <div key={i} className="bg-white border border-gray-100 rounded-[24px] p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgba(138,0,26,0.08)] hover:-translate-y-1 transition-all duration-300 group">
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6 bg-[#FAF7F2] ring-1 ring-black/5 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300" style={{ color: factor.color }}>
                    <factor.icon className="w-7 h-7" />
                  </div>
                  <h4 className="font-sans font-black text-xl text-[#2D2420] tracking-tight mb-2">{factor.title}</h4>
                  <p className="text-[14px] text-[#6B5248] font-medium leading-relaxed">{factor.desc}</p>
                </div>
              ))}
            </div>

            <div className="mt-12 text-center">
              <div className="inline-flex items-center justify-center gap-2 bg-[#FAF7F2] border border-[#E8C4B8] text-[#8B5E52] px-8 py-4 rounded-xl text-[15px] font-medium shadow-sm">
                <Calculator className="w-5 h-5" /> Add items to your cart to estimate shipping!
              </div>
            </div>
          </FadeIn>
        </section>

        <div className="h-px bg-gradient-to-r from-transparent via-[#E8C4B8] to-transparent w-full"></div>

        {/* SECTION 3: SPECIAL CATEGORIES */}
        <section id="special-cats" className="scroll-mt-24">
          <FadeIn>
            <div className="text-[11px] tracking-[0.12em] uppercase text-[#C97B6E] font-medium mb-3">Section 03</div>
            <h2 className="font-perandory text-4xl text-[#2D2420] mb-4">Special category notices</h2>
            <p className="text-[15px] text-[#6B5248] leading-relaxed mb-10">Some product types require extra attention. Please read the relevant notice before placing your order.</p>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { icon: Gem, bg: 'bg-[#FDF6EC]', border: 'border-[#E8D4B0]', iconColor: '#8B6914', title: 'Branded Items', text: 'Products from brands like Coach, Hello Kitty, Ferrari, LV, Dior, Chanel, Nike, and Stussy carry higher customs duties and a longer customs processing period. Expect higher international shipping costs and a slightly longer timeline.' },
              { icon: Droplet, bg: 'bg-[#EDF6FB]', border: 'border-[#B0D4E8]', iconColor: '#1E5A72', title: 'Liquids & Beauty Products', text: 'Liquid products such as lip glosses, serums, and skincare can only be shipped by air. Sea shipping is not permitted for liquids. This means a higher shipping cost and a faster delivery window (~15 days).' },
              { icon: Box, bg: 'bg-[#F4ECFD]', border: 'border-[#C8B0E8]', iconColor: '#5A3A8B', title: 'Oversized & Bulky Items', text: 'Large or bulky items take a bigger share of the batch weight, which means a higher shipping cost. This also applies domestically — oversized packages may attract higher courier charges based on volumetric weight.' },
              { icon: Footprints, bg: 'bg-[#ECFBF4]', border: 'border-[#B0E8CC]', iconColor: '#1A6B42', title: 'Footwear', text: 'Shoes and footwear ship in their original boxes, which are larger and heavier than standard packaging. This typically results in higher shipping costs compared to smaller items.' },
            ].map((cat, idx) => (
              <FadeIn key={idx} delay={idx * 0.1}>
                <div className={`${cat.bg} border ${cat.border} rounded-2xl p-5 md:p-6 flex items-start gap-4 h-full shadow-sm hover:shadow-md transition-shadow`}>
                  <cat.icon className="w-8 h-8 shrink-0" style={{ color: cat.iconColor }} strokeWidth={1.5} />
                  <div>
                    <h3 className="text-[14px] font-medium text-[#2D2420] mb-1.5">{cat.title}</h3>
                    <p className="text-[12px] text-[#6B5248] leading-relaxed">{cat.text}</p>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </section>

        <div className="h-px bg-gradient-to-r from-transparent via-[#E8C4B8] to-transparent w-full"></div>

        {/* SECTION 4: POLICIES */}
        <section id="policies" className="scroll-mt-24">
          <FadeIn>
            <div className="text-[11px] tracking-[0.12em] uppercase text-[#C97B6E] font-medium mb-3">Section 04</div>
            <h2 className="font-perandory text-4xl text-[#2D2420] mb-4">Important shipping policies</h2>
            <p className="text-[15px] text-[#6B5248] leading-relaxed mb-10">Please read and understand these policies before placing your order. By ordering from House of Avira, you agree to all of the following.</p>
          </FadeIn>

          <div className="space-y-3">
            {[
              { id: 'P-01', color: '#C97B6E', title: 'Payment deadline is mandatory', text: 'Once your shipping invoice is sent, it must be paid by the specified deadline. If the international shipping fee remains unpaid, your parcel will not be shipped and no refund will be issued. Your order is placed with suppliers immediately after you submit it — it cannot be reversed.' },
              { id: 'P-02', color: '#C97B6E', title: 'No cancellations or refunds after ordering', text: 'Once an order is submitted, we forward it to our suppliers immediately. Cancellations, refunds, and exchanges cannot be accommodated under any circumstances after this point — including if shipping costs are higher than expected or if there are delivery delays.' },
              { id: 'P-03', color: '#C9A96E', title: 'Shipping prices may change', text: 'International shipping prices may fluctuate due to carrier rates, customs regulations, and the nature of the product. The exact cost is calculated only when your parcel is packed and ready to ship. We recommend placing an order only if you\'re comfortable with this variable.' },
              { id: 'P-04', color: '#4A7AAD', title: 'Our responsibility ends at the courier', text: 'Once your domestic package is handed over to the courier and a tracking ID is provided, delivery delays, transit issues, or rare mishaps are beyond our control. We will always support you with tracking information, but we cannot take responsibility for courier-side delays or losses.' },
              { id: 'P-05', color: '#4A7AAD', title: 'Delays are not grounds for cancellation', text: 'We do not accept cancellations or offer refunds for delayed deliveries, particularly for imported goods. Delivery times may vary due to customs, logistics, and factors completely beyond our control. Please only order if you are patient and comfortable waiting.' },
              { id: 'P-06', color: '#C97B6E', title: 'Customs fees are included in your invoice', text: 'India\'s basic customs duty on imported goods varies by product type (bags ~10%, apparel ~20%, beauty ~18%, footwear ~25%). These charges are calculated and included in your international shipping invoice — you will receive a full cost breakdown before payment is required.' },
            ].map((policy, idx) => (
              <FadeIn key={idx} delay={idx * 0.05}>
                <div className="bg-white border-y border-r border-[#E8C4B8] border-l-4 rounded-xl p-5 md:p-6 flex flex-col md:flex-row gap-2 md:gap-5 shadow-sm hover:shadow-md transition-shadow" style={{ borderLeftColor: policy.color }}>
                  <div className="font-mono text-[11px] font-semibold mt-1 shrink-0" style={{ color: policy.color }}>{policy.id}</div>
                  <div>
                    <h3 className="text-[14px] font-medium text-[#2D2420] mb-1.5">{policy.title}</h3>
                    <p className="text-[13px] text-[#6B5248] leading-relaxed">{policy.text}</p>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </section>

        <div className="h-px bg-gradient-to-r from-transparent via-[#E8C4B8] to-transparent w-full"></div>

        {/* SECTION 5: FAQ */}
        <section id="faq" className="scroll-mt-24">
          <FadeIn>
            <div className="text-[11px] tracking-[0.12em] uppercase text-[#C97B6E] font-medium mb-3">Section 05</div>
            <h2 className="font-perandory text-4xl text-[#2D2420] mb-4">Frequently asked questions</h2>
            <p className="text-[15px] text-[#6B5248] leading-relaxed mb-10">The questions our team answers most often — answered here, permanently.</p>
          </FadeIn>

          <div className="border-t border-[#E8C4B8]">
            {faqs.map((faq, idx) => (
              <div key={idx} className="border-b border-[#E8C4B8] overflow-hidden">
                <button 
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full flex items-center justify-between py-5 text-left text-[14px] font-medium text-[#2D2420] hover:text-[#C97B6E] transition-colors focus:outline-none"
                >
                  <span className="pr-4">{faq.q}</span>
                  <ChevronDown className={`w-4 h-4 text-[#B8A99A] shrink-0 transition-transform duration-300 ${openFaq === idx ? 'rotate-180' : ''}`} />
                </button>
                <AnimatePresence>
                  {openFaq === idx && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                    >
                      <div className="pb-6 text-[13px] text-[#6B5248] leading-relaxed pr-8">
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* SECTION 6: REVIEWS */}
      <section className="py-24 bg-gradient-to-b from-transparent to-[#FDF0EB] -mx-6 px-6 md:-mx-auto md:px-0 rounded-t-[40px] overflow-hidden mt-16 border-t border-[#E8C4B8]">
        <div className="max-w-4xl mx-auto px-6 text-center mb-12">
          <FadeIn>
            <div className="text-[11px] tracking-[0.12em] uppercase text-[#C97B6E] font-medium mb-3 flex items-center justify-center gap-2">
              <Heart className="w-4 h-4 fill-[#C97B6E]" /> Real Stories
            </div>
            <h2 className="font-perandory text-4xl md:text-5xl text-[#2D2420] mb-4">Hear from people who ordered</h2>
            <p className="text-[15px] text-[#6B5248] leading-relaxed max-w-xl mx-auto">
              Join thousands of happy customers across India who trust our transparent two-tier shipping process.
            </p>
          </FadeIn>
        </div>

        <div className="relative w-full overflow-hidden flex items-center pb-8">
          {/* Gradient Masks */}
          <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-[#FDF0EB] to-transparent z-10 pointer-events-none"></div>
          <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-[#FDF0EB] to-transparent z-10 pointer-events-none"></div>
          
          <motion.div 
            animate={{ x: ["0%", "-50%"] }}
            transition={{ repeat: Infinity, ease: "linear", duration: 40 }}
            className="flex w-max gap-6 px-6"
          >
            {[...reviews, ...reviews].map((review, idx) => (
              <div key={idx} className="bg-white/80 backdrop-blur-md border border-[#E8C4B8] p-6 rounded-2xl w-[320px] md:w-[380px] shrink-0 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(201,123,110,0.1)] transition-all">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h4 className="font-semibold text-[#2D2420] text-[15px]">{review.name}</h4>
                    <p className="text-[#B8A99A] text-[12px] flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3 h-3" /> {review.location}
                    </p>
                  </div>
                  <div className="flex gap-0.5">
                    {[...Array(review.rating)].map((_, i) => (
                      <svg key={i} className="w-4 h-4 text-[#C9A96E] fill-[#C9A96E]" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                </div>
                <p className="text-[#6B5248] text-[14px] leading-relaxed mb-4 italic">
                  "{review.text}"
                </p>
                <div className="inline-flex items-center gap-1.5 bg-[#FAF7F2] text-[#8B5E52] px-3 py-1.5 rounded-lg text-[11px] font-medium border border-[#E8C4B8]/50">
                  <Package className="w-3.5 h-3.5" /> Preordered: {review.item}
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* BOTTOM CTA */}
      <footer className="bg-[#2D2420] text-[#FAF7F2] py-16 md:py-20 px-6 text-center mt-12">
        <FadeIn>
          <h2 className="font-perandory text-3xl md:text-4xl font-light mb-4">Still have questions?</h2>
          <p className="text-[14px] text-[#FAF7F2]/70 leading-relaxed max-w-lg mx-auto mb-8">
            Our team is always happy to help. DM us on Instagram or use our AI assistant — we'll make sure you have everything you need before placing your order.
          </p>
          <div className="flex flex-col md:flex-row justify-center gap-4 max-w-md mx-auto">
            <a href="#" className="bg-[#C97B6E] text-white px-6 py-3.5 rounded-lg text-[13px] font-medium hover:bg-[#B86B5E] transition-colors flex items-center justify-center gap-2">
              <Sparkles className="w-4 h-4" /> Ask Avira AI
            </a>
            <a href="https://www.instagram.com/" target="_blank" rel="noopener noreferrer" className="bg-transparent border border-[#FAF7F2]/30 text-[#FAF7F2] px-6 py-3.5 rounded-lg text-[13px] font-medium hover:border-[#FAF7F2]/60 transition-colors flex items-center justify-center gap-2">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg> DM on Instagram
            </a>
          </div>
          <div className="mt-16 text-[10px] text-[#FAF7F2]/40 tracking-widest uppercase font-mono">
            HOUSE OF AVIRA &middot; PREORDER &amp; IMPORT BUSINESS &middot; EST. 2022
          </div>
        </FadeIn>
      </footer>

    </div>
  );
}
