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
    <motion.div ref={ref} style={{ opacity, x, scale }} className={`relative group ${isActionRequired ? 'bg-gradient-to-r from-[#FAFAFA] to-white -mx-4 md:-mx-6 px-4 md:px-6 py-5 rounded-2xl border-l-4 border-l-[#8A001A] border-y border-r border-[#E5E5E5] shadow-md my-6 z-20' : 'py-4'}`}>
      <div className={`absolute ${isActionRequired ? '-left-[18px] md:-left-[28px] top-6 w-5 h-5' : '-left-[30px] md:-left-[38px] top-5 w-4 h-4'} rounded-full border-2 ${isActionRequired ? 'border-[#8A001A] bg-white shadow-[0_0_0_4px_#FAFAFA] animate-pulse' : 'border-[#8A001A] bg-[#FFFFFF]'} z-10 transition-all duration-300 ${step.state === 'done' ? 'bg-[#8A001A]' : ''}`}></div>
      <div>
        <div className={`flex items-center flex-wrap gap-3 mb-2 transition-colors ${isActionRequired ? 'text-[#8A001A] text-[18px] font-bold' : 'text-[#000000] text-[16px] font-medium group-hover:text-[#8A001A]'}`}>
          {step.title}
          {step.badge && (
            <span className={`${isActionRequired ? 'bg-[#8A001A] text-white text-[12px] px-3 py-1 shadow-sm' : 'bg-[#FAFAFA] text-[#8A001A] text-[10px] px-2 py-0.5'} font-bold rounded-full tracking-widest uppercase flex items-center gap-1`}>
              {isActionRequired && <Sparkles className="w-3 h-3 animate-pulse" />} {step.badge}
            </span>
          )}
          {step.icon && <step.icon className={`w-4 h-4 ${isActionRequired ? 'text-[#8A001A]' : 'text-[#8A001A]'} ml-1`} />}
        </div>
        <div className={`leading-relaxed ${isActionRequired ? 'text-[#8A001A] text-[14px] font-medium' : 'text-[#666666] text-[14px]'}`}>{step.desc}</div>
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
    { name: "Kavya V.", location: "Chennai, Tamil Nadu", text: "Love the transparency! The shipping for my rare makeup finds was surprisingly fast.", rating: 5, item: "Rare Beauty Blush" },
  ];

  const faqs = [
    {
      q: "Why can't you tell me the shipping cost upfront?",
      a: "We ship in batches. The international cost is split equally among all customers based on the total package weight. Since we collect all orders first and then ship together, the exact per-customer cost is only known when the full batch is packed. This ensures you're charged accurately ΓÇö never based on a rough estimate."
    },
    {
      q: "Is COD (Cash on Delivery) available?",
      a: "No, COD is not available at House of Avira. We deal with imported products sourced internationally on your behalf ΓÇö payment must be received before the order can be placed with our suppliers. We accept GPay, Paytm, UPI, bank transfers, and card payments."
    },
    {
      q: "How long will my order take?",
      a: "Important: the delivery timeline does NOT start from the day you place your order. All orders are pre-orders collected in batches. After your batch closes, we source the products, quality check them, calculate shipping costs, and send you a shipping invoice. Only after you pay that invoice does the shipping clock begin. Delivery typically takes 2ΓÇô4 weeks from this point, but may take longer depending on customs, logistics, and the factors mentioned earlier. For example, if you order on October 1st and your batch closes on October 20th, you first wait until October 20th. Processing and invoicing take a few days after that. The 2ΓÇô4 week shipping estimate starts only after your shipping invoice is paid."
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
      q: "My order is delayed ΓÇö can I get a refund?",
      a: "No. Delivery delays are not grounds for a refund or cancellation. International shipping and customs timelines can vary significantly due to factors completely outside our control. We ask that you only place an order if you are patient and comfortable with variable timelines. We will always keep you updated on your order's progress."
    }
  ];

  return (
    <div className="bg-[#FFFFFF] text-[#000000] min-h-screen font-sans selection:bg-[#8A001A] selection:text-white overflow-x-hidden">
      
      {/* Education Marquee */}
      <div className="bg-[#000000] text-white text-[11px] font-medium tracking-widest py-2.5 overflow-hidden whitespace-nowrap flex">
        <div className="animate-marquee-full flex shrink-0 items-center">
          {[...Array(4)].map((_, i) => (
            <span key={i} className="mx-4 uppercase">
              House of Avira: All orders are prepaid pre-orders &middot; Products are sourced internationally &middot; Shipping is charged separately &middot; No cancellations or refunds after ordering &middot; Delivery timelines are estimates only &middot;
            </span>
          ))}
        </div>
        <div className="animate-marquee-full flex shrink-0 items-center" aria-hidden="true">
          {[...Array(4)].map((_, i) => (
            <span key={i} className="mx-4 uppercase">
              House of Avira: All orders are prepaid pre-orders &middot; Products are sourced internationally &middot; Shipping is charged separately &middot; No cancellations or refunds after ordering &middot; Delivery timelines are estimates only &middot;
            </span>
          ))}
        </div>
      </div>

      {/* Sticky Nav */}
      <nav className="sticky top-0 z-50 bg-[#FFFFFF]/90 backdrop-blur-md border-b border-[#E5E5E5] px-6 md:px-8 h-14 flex items-center justify-between">
        <div className="font-perandory text-lg font-medium text-[#000000]">House of Avira</div>
        <div className="hidden md:flex gap-8">
          {[
            { id: 'how-it-works', label: 'How It Works' },
            { id: 'policies', label: 'Policies' },
            { id: 'faq', label: 'FAQ' }
          ].map(link => (
            <button 
              key={link.id}
              onClick={() => scrollTo(link.id)}
              className={`text-[13px] font-medium transition-colors border-b-[1.5px] py-1 ${
                activeSection === link.id ? 'border-[#8A001A] text-[#8A001A]' : 'border-transparent text-[#000000] hover:text-[#8A001A]'
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
          <div className="absolute inset-0 bg-gradient-to-t from-[#FFFFFF] via-[#FFFFFF]/60 to-[#FFFFFF]/90" />
        </motion.div>
        
        <FadeIn className="relative z-10">
          <div className="text-[11px] tracking-[0.12em] uppercase text-[#999999] font-medium mb-4">Shipping Information</div>
          <h1 className="font-perandory text-5xl md:text-6xl font-light text-[#000000] mb-5 leading-tight">
            Everything about<br />
            <em className="font-aston-script text-5xl md:text-7xl lowercase text-[#8A001A]">how your order travels</em>
          </h1>
          <div className="bg-gradient-to-br from-[#FAFAFA] to-[#FFFFFF] border-2 border-[#E5E5E5] rounded-2xl p-6 md:p-8 max-w-2xl mx-auto mb-6 shadow-sm relative overflow-hidden group hover:border-[#8A001A] transition-colors duration-500">
            <div className="absolute -top-6 -right-6 p-4 opacity-10 group-hover:opacity-20 transition-opacity duration-500 group-hover:rotate-12">
              <Sparkles className="w-32 h-32 text-[#8A001A]" />
            </div>
            <p className="text-lg md:text-xl text-[#8A001A] font-medium leading-relaxed relative z-10 italic">
              All orders are pre-orders. Your delivery timeline begins only after your batch closes and you pay your shipping invoice ΓÇö not from the day you place your order.
            </p>
          </div>

          <div className="mb-12 text-center">
            <span className="font-aston-script text-3xl md:text-4xl text-[#8A001A] lowercase">worth the wait</span>
          </div>
          
          <div className="flex flex-wrap justify-center gap-3">
            {[
              { id: 'how-it-works', icon: Route, label: 'The Journey' },
              { id: 'special-cats', icon: Tag, label: 'Special Categories' },
              { id: 'policies', icon: Shield, label: 'Policies' },
              { id: 'faq', icon: HelpCircle, label: 'FAQ' }
            ].map(btn => (
              <button 
                key={btn.id}
                onClick={() => scrollTo(btn.id)}
                className="bg-white border border-[#E5E5E5] rounded-full px-5 py-2.5 text-[13px] text-[#000000] font-medium hover:bg-[#E5E5E5] hover:text-[#000000] transition-all flex items-center gap-2"
              >
                <btn.icon className="w-4 h-4" /> {btn.label}
              </button>
            ))}
          </div>
        </FadeIn>