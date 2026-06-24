'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Plane, Globe, Package, FileText, Receipt, Truck, ShieldCheck, Clock, AlertTriangle, ChevronDown, MessageCircle, Mail, Smartphone, Megaphone, Scale, Box, Sparkles, Heart, Zap } from 'lucide-react';
import { useRef } from 'react';
import { motion, useScroll, useTransform, useInView, useSpring } from 'framer-motion';

/* ─── Reveal on scroll wrapper ─── */
function RevealSection({ children, className = '', delay = 0 }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });
  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: 60 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.9, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}

/* ─── Horizontal reveal line ─── */
function RevealLine({ className = '' }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  return (
    <motion.div
      ref={ref}
      className={`h-px bg-gradient-to-r from-transparent via-[#8A001A] to-transparent ${className}`}
      initial={{ scaleX: 0 }}
      animate={isInView ? { scaleX: 1 } : {}}
      transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
    />
  );
}

/* ─── Floating SVG decorations ─── */
function FloatingIcon({ children, delay = 0, className = '' }) {
  return (
    <motion.div
      className={`absolute pointer-events-none ${className}`}
      animate={{ y: [0, -20, 0], rotate: [0, 5, -5, 0] }}
      transition={{ duration: 6, repeat: Infinity, delay, ease: 'easeInOut' }}
    >
      {children}
    </motion.div>
  );
}

/* ─── Stagger variants ─── */
const staggerContainer = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.2 } }
};
const staggerItem = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } }
};

export default function ShippingPage() {
  const containerRef = useRef(null);

  /* ── Parallax scroll values ── */
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ['start start', 'end end'] });
  const heroY = useTransform(scrollYProgress, [0, 0.15], [0, -120]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.1], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.15], [1, 1.08]);

  /* ── Smooth spring for progress bar ── */
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

  return (
    <div ref={containerRef} className="relative bg-[#FAFAFA] text-[#1a1a1a] overflow-hidden" style={{ fontFamily: 'var(--font-dm-sans), sans-serif' }}>

      {/* ═══ PROGRESS BAR ═══ */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-[#8A001A] via-[#c4002a] to-[#8A001A] z-[9999] origin-left"
        style={{ scaleX }}
      />

      {/* ═══════ HERO — FULL VIEWPORT CINEMATIC ═══════ */}
      <section className="relative h-[100vh] flex items-center justify-center overflow-hidden">
        {/* Parallax background */}
        <motion.div className="absolute inset-0" style={{ y: heroY, scale: heroScale }}>
          <Image
            src="/images/shipping-hero-bg.png"
            alt="Shipping and delivery"
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/60" />
        </motion.div>

        {/* Floating decorative elements */}
        <FloatingIcon delay={0} className="top-[15%] left-[8%] opacity-20">
          <Plane className="w-8 h-8 text-[#8A001A]" />
        </FloatingIcon>
        <FloatingIcon delay={1.5} className="top-[20%] right-[10%] opacity-15">
          <Globe className="w-6 h-6 text-white" />
        </FloatingIcon>
        <FloatingIcon delay={3} className="bottom-[35%] left-[12%] opacity-10">
          <Package className="w-10 h-10 text-[#8A001A]" />
        </FloatingIcon>

        {/* Hero Content */}
        <motion.div
          className="relative z-10 text-center px-4 max-w-5xl"
          style={{ opacity: heroOpacity }}
        >
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="mb-6"
          >
            <Link href="/order-info" className="inline-flex items-center gap-2 text-white/60 hover:text-white transition-colors text-sm tracking-widest uppercase">
              <ArrowLeft className="w-4 h-4" />
              Return to Overview
            </Link>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, letterSpacing: '0.5em' }}
            animate={{ opacity: 1, letterSpacing: '0.3em' }}
            transition={{ delay: 0.5, duration: 1.2 }}
            className="text-[#8A001A] text-xs md:text-sm uppercase tracking-[0.3em] mb-4 font-bold"
          >
            House of Avira Logistics
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="font-perandory text-5xl md:text-7xl lg:text-[6rem] uppercase leading-[0.95] mb-4 text-white"
          >
            SHIPPING
            <br />
            <span className="text-[#8A001A]">& DELIVERY</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.8 }}
            className="font-aston-script text-[#c4a87c] text-3xl md:text-5xl mb-8"
          >
            Across the Globe
          </motion.p>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.3, duration: 1 }}
            className="text-white/50 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed"
          >
            Understanding your shipping journey from our warehouse to your doorstep — with complete transparency.
          </motion.p>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <span className="text-[10px] uppercase tracking-[0.3em] text-white/40">Scroll to explore</span>
          <ChevronDown className="w-5 h-5 text-white/40" />
        </motion.div>
      </section>

      {/* ═══════ SECTION 01 — INTERNATIONAL SHIPPING ═══════ */}
      <section className="relative py-24 md:py-36 bg-[#FAFAFA]">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[#8A001A]/5 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 md:px-16">
          {/* Step header */}
          <RevealSection className="mb-16 md:mb-24">
            <div className="flex items-end gap-6 md:gap-10">
              <span className="font-perandory text-[8rem] md:text-[12rem] leading-none text-black/[0.04] select-none">01</span>
              <div className="pb-4 md:pb-8">
                <p className="text-[#8A001A] text-xs font-bold uppercase tracking-[0.3em] mb-2">Worldwide</p>
                <h2 className="font-perandory text-3xl md:text-5xl lg:text-6xl uppercase">International Shipping</h2>
              </div>
            </div>
          </RevealSection>

          <RevealLine className="mb-16" />

          {/* Key Point — dark featured card */}
          <RevealSection delay={0.1} className="mb-16">
            <div className="relative rounded-2xl overflow-hidden bg-[#111] shadow-[0_8px_40px_rgb(0,0,0,0.08)]">
              <div className="absolute inset-0 bg-gradient-to-br from-[#8A001A]/10 via-transparent to-[#8A001A]/5" />
              <div className="relative p-10 md:p-16 border border-white/10 rounded-2xl">
                <p className="font-perandory text-2xl md:text-3xl text-white leading-[1.4] mb-4 uppercase tracking-wide">
                  Shipping charges are <span className="text-[#8A001A]">completely separate</span> from the product price.
                </p>
                <p className="text-white/50 text-sm md:text-base leading-[1.9]">
                  These charges are NOT collected during checkout. They are calculated later once your products arrive at our shipping warehouse, allowing us to determine the most accurate amount possible.
                </p>
              </div>
            </div>
          </RevealSection>

          {/* What it includes */}
          <RevealSection delay={0.15} className="mb-16">
            <h3 className="font-perandory text-lg uppercase tracking-[0.2em] text-[#1a1a1a] mb-8">May Include</h3>
            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 gap-4"
              variants={staggerContainer}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: '-50px' }}
            >
              {[
                { icon: Plane, label: 'International freight charges' },
                { icon: ShieldCheck, label: 'Customs duties' },
                { icon: FileText, label: 'Customs clearance fees' },
                { icon: Receipt, label: 'Import-related taxes' },
                { icon: Truck, label: 'Logistics costs' },
                { icon: Package, label: 'Handling charges' },
                { icon: Box, label: 'Product-specific shipping requirements' }
              ].map((item, idx) => (
                <motion.div
                  key={idx}
                  variants={staggerItem}
                  whileHover={{ y: -4, borderColor: 'rgba(138, 0, 26, 0.2)' }}
                  className="flex items-center gap-4 bg-white border border-gray-100 shadow-sm rounded-xl p-5 hover:shadow-md transition-all duration-500 group cursor-pointer"
                >
                  <item.icon className="w-5 h-5 text-[#8A001A] group-hover:scale-110 transition-transform duration-300 flex-shrink-0" />
                  <span className="text-sm text-gray-500 group-hover:text-[#1a1a1a] transition-colors">{item.label}</span>
                </motion.div>
              ))}
            </motion.div>
          </RevealSection>

          {/* Factors */}
          <RevealSection delay={0.2} className="mb-16">
            <h3 className="font-perandory text-lg uppercase tracking-[0.2em] text-[#1a1a1a] mb-8">Final Amount Depends On</h3>
            <motion.div
              className="grid grid-cols-2 sm:grid-cols-3 gap-3"
              variants={staggerContainer}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: '-50px' }}
            >
              {['Product weight', 'Volumetric weight', 'Parcel dimensions', 'Product category', 'Logistics rates', 'Customs requirements', 'Carrier rates', 'Economic conditions', 'Market conditions'].map((item, idx) => (
                <motion.div
                  key={idx}
                  variants={staggerItem}
                  whileHover={{ y: -4 }}
                  className="bg-[#111] rounded-xl p-4 text-center text-xs text-white/50 hover:text-white/80 hover:bg-[#1a1a1a] transition-all duration-300 cursor-default"
                >
                  {item}
                </motion.div>
              ))}
            </motion.div>
          </RevealSection>
        </div>
      </section>

      {/* ═══════ PARALLAX DIVIDER ═══════ */}
      <section className="relative h-[40vh] md:h-[50vh] overflow-hidden">
        <motion.div
          className="absolute inset-0"
          style={{ y: useTransform(scrollYProgress, [0.2, 0.35], [0, -60]) }}
        >
          <Image
            src="/images/branded-items-bg.png"
            alt="Branded products and logistics"
            fill
            className="object-cover"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-black/40" />
        </motion.div>
        <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-4">
          <RevealSection>
            <p className="text-xs uppercase tracking-[0.4em] text-white/50 mb-4">Special Categories</p>
            <h2 className="font-perandory text-4xl md:text-6xl lg:text-7xl uppercase mb-4 text-white">Branded Products</h2>
            <p className="font-aston-script text-[#c4a87c] text-2xl md:text-4xl">& Special Items</p>
          </RevealSection>
        </div>
      </section>

      {/* ═══════ BRANDED PRODUCTS ═══════ */}
      <section className="relative py-24 md:py-36 bg-[#111] text-white overflow-hidden">
        <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: 'repeating-linear-gradient(90deg, transparent, transparent 120px, rgba(255,255,255,0.1) 120px, rgba(255,255,255,0.1) 121px)' }} />
        <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-[#8A001A]/5 rounded-full blur-[200px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 md:px-16 relative z-10">
          <RevealSection className="mb-12">
            <p className="text-lg md:text-xl text-white/50 max-w-3xl leading-relaxed">
              Certain products may attract higher customs and shipping costs due to additional inspections, clearance requirements, restrictions, or documentation.
            </p>
          </RevealSection>

          <RevealLine className="mb-12" />

          <motion.div
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4"
            variants={staggerContainer}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-50px' }}
          >
            {[
              { label: 'Ferrari, Adidas, Nike etc.', icon: Sparkles },
              { label: 'Cosmetics & Beauty', icon: Heart },
              { label: 'Lighters', icon: Zap },
              { label: 'Restricted categories', icon: AlertTriangle },
              { label: 'Fragile items', icon: ShieldCheck },
              { label: 'Oversized items', icon: Box },
              { label: 'Special handling', icon: Package },
            ].map((item, idx) => (
              <motion.div
                key={idx}
                variants={staggerItem}
                whileHover={{ y: -6, borderColor: 'rgba(138, 0, 26, 0.3)' }}
                className="bg-white/[0.03] backdrop-blur-sm border border-white/[0.06] rounded-2xl p-6 text-center hover:bg-white/[0.06] transition-all duration-500 cursor-default group"
              >
                <item.icon className="w-5 h-5 text-[#8A001A] mx-auto mb-3 group-hover:scale-110 transition-transform" />
                <span className="text-xs text-white/50 group-hover:text-white/80 transition-colors">{item.label}</span>
              </motion.div>
            ))}
          </motion.div>

          <RevealSection delay={0.3}>
            <p className="text-white/20 text-xs mt-8 italic">These additional costs are generally included within your final shipping calculation.</p>
          </RevealSection>
        </div>
      </section>

      {/* ═══════ SHIPPING UPDATES ═══════ */}
      <section className="relative py-24 md:py-36 bg-[#FAFAFA] overflow-hidden">
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-[#8A001A]/5 rounded-full blur-[180px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 md:px-16">
          {/* Two-column layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">

            {/* Left — accent card */}
            <RevealSection>
              <div className="relative rounded-2xl overflow-hidden bg-[#111] shadow-[0_8px_40px_rgb(0,0,0,0.08)]">
                <div className="absolute inset-0 bg-gradient-to-br from-[#8A001A]/10 via-transparent to-[#8A001A]/5" />
                <div className="relative p-10 md:p-14 border border-white/10 rounded-2xl">
                  <p className="text-[#8A001A] text-xs font-bold uppercase tracking-[0.3em] mb-4">Stay Informed</p>
                  <h2 className="font-perandory text-3xl md:text-4xl uppercase text-white mb-6">Shipping Updates</h2>
                  <p className="font-aston-script text-[#c4a87c] text-2xl md:text-3xl mb-6">Real-time tracking</p>
                  <p className="text-white/50 text-sm leading-relaxed">
                    We keep you in the loop at every stage. From dispatch to doorstep, you&apos;ll receive timely updates through your preferred channel so you always know where your piece is.
                  </p>
                </div>
              </div>
            </RevealSection>

            {/* Right — channel cards */}
            <div>
              <motion.div
                className="grid grid-cols-2 gap-5"
                variants={staggerContainer}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: '-50px' }}
              >
                {[
                  { icon: MessageCircle, label: 'WhatsApp', desc: 'Instant order updates' },
                  { icon: Smartphone, label: 'SMS', desc: 'Delivery notifications' },
                  { icon: Mail, label: 'Email', desc: 'Detailed breakdowns' },
                  { icon: Megaphone, label: 'Official Channels', desc: 'Tracking & support' }
                ].map((item, idx) => (
                  <motion.div
                    key={idx}
                    variants={staggerItem}
                    whileHover={{ y: -6, scale: 1.02 }}
                    className="bg-white border border-gray-100 shadow-sm rounded-2xl p-6 hover:shadow-lg hover:border-[#8A001A]/20 transition-all duration-500 group cursor-pointer"
                  >
                    <motion.div
                      whileHover={{ rotate: 10, scale: 1.15 }}
                      transition={{ type: 'spring', stiffness: 300 }}
                    >
                      <item.icon className="w-8 h-8 text-[#8A001A] mb-4 group-hover:text-[#c4002a] transition-colors" />
                    </motion.div>
                    <h4 className="font-perandory text-sm uppercase tracking-wider text-[#1a1a1a] mb-1">{item.label}</h4>
                    <p className="text-[11px] text-gray-400 group-hover:text-gray-600 transition-colors">{item.desc}</p>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════ SECTION 02 — DOMESTIC SHIPPING ═══════ */}
      <section className="relative py-24 md:py-36 bg-[#111] text-white overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#8A001A]/5 rounded-full blur-[200px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 md:px-16 relative z-10">
          {/* Step header */}
          <RevealSection className="mb-16 md:mb-24">
            <div className="flex items-end gap-6 md:gap-10">
              <span className="font-perandory text-[8rem] md:text-[12rem] leading-none text-white/[0.04] select-none">02</span>
              <div className="pb-4 md:pb-8">
                <p className="text-[#8A001A] text-xs font-bold uppercase tracking-[0.3em] mb-2">Within India</p>
                <h2 className="font-perandory text-3xl md:text-5xl lg:text-6xl uppercase">Domestic Shipping</h2>
              </div>
            </div>
          </RevealSection>

          <RevealLine className="mb-16" />

          <RevealSection>
            <p className="text-lg md:text-xl text-white/50 max-w-3xl leading-relaxed mb-16">
              Delivery of your parcel from our warehouse to your final delivery address within India.
            </p>
          </RevealSection>

          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16"
            variants={staggerContainer}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-50px' }}
          >
            {[
              { icon: Scale, label: 'Parcel weight' },
              { icon: Box, label: 'Parcel dimensions' },
              { icon: Globe, label: 'Delivery location' },
              { icon: Truck, label: 'Courier rates' },
            ].map((item, idx) => (
              <motion.div
                key={idx}
                variants={staggerItem}
                whileHover={{ y: -4 }}
                className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-6 text-center transition-all duration-300 group"
              >
                <item.icon className="w-5 h-5 text-[#8A001A] mx-auto mb-3 group-hover:scale-110 transition-transform" />
                <span className="text-xs text-white/50 group-hover:text-white/70 transition-colors">{item.label}</span>
              </motion.div>
            ))}
          </motion.div>

          <RevealSection delay={0.2}>
            <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-8 md:p-10 space-y-4">
              <p className="text-white/50 text-sm leading-[1.9]">
                Domestic shipping charges are not collected during checkout. They are included in the final shipping invoice together with your international shipping charges. A complete breakdown will always be provided before payment is requested.
              </p>
              <p className="text-white/30 text-xs">Tracking information will be shared once the parcel has been dispatched. We currently ship across India.</p>
            </div>
          </RevealSection>
        </div>
      </section>

      {/* ═══════ SECTION 03 — DELIVERY TIMELINES ═══════ */}
      <section className="relative py-24 md:py-36 bg-[#FAFAFA]">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[#8A001A]/5 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 md:px-16">
          {/* Step header */}
          <RevealSection className="mb-16 md:mb-24">
            <div className="flex items-end gap-6 md:gap-10">
              <span className="font-perandory text-[8rem] md:text-[12rem] leading-none text-black/[0.04] select-none">03</span>
              <div className="pb-4 md:pb-8">
                <p className="text-[#8A001A] text-xs font-bold uppercase tracking-[0.3em] mb-2">Timelines</p>
                <h2 className="font-perandory text-3xl md:text-5xl lg:text-6xl uppercase">Delivery Timelines</h2>
              </div>
            </div>
          </RevealSection>

          <RevealLine className="mb-16" />

          {/* Typical Delivery — dark featured card */}
          <RevealSection delay={0.1} className="mb-16">
            <div className="relative rounded-2xl overflow-hidden bg-[#111] shadow-[0_8px_40px_rgb(0,0,0,0.08)]">
              <div className="absolute inset-0 bg-gradient-to-br from-[#8A001A]/10 via-transparent to-[#8A001A]/5" />
              <div className="relative p-12 md:p-20 text-center border border-white/10 rounded-2xl">
                <motion.div
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
                  className="absolute top-6 right-6 opacity-10"
                >
                  <Clock className="w-16 h-16 text-[#8A001A]" />
                </motion.div>
                <span className="text-[11px] font-bold tracking-[0.4em] uppercase text-[#8A001A] block mb-6">Typical Delivery</span>
                <p className="font-perandory text-7xl md:text-8xl lg:text-9xl text-white tracking-tight">2–4</p>
                <p className="font-perandory text-xl md:text-2xl text-white/60 mt-2 uppercase tracking-wider">Weeks</p>
                <p className="text-white/25 text-xs mt-8">after shipment · estimates only · does not include sourcing period</p>
              </div>
            </div>
          </RevealSection>

          <RevealSection delay={0.2} className="mb-16">
            <div className="bg-gradient-to-br from-[#FFF8F0] to-[#FFF5EB] border border-[#8A001A]/[0.08] rounded-2xl p-6 text-center">
              <p className="text-sm text-[#8A001A]/80">In some cases, orders may take up to <strong className="font-semibold text-[#8A001A]">8 weeks or longer</strong> depending on circumstances beyond our control.</p>
            </div>
          </RevealSection>

          {/* Delay Factors */}
          <RevealSection delay={0.25} className="mb-16">
            <h3 className="font-perandory text-lg uppercase tracking-[0.2em] text-[#1a1a1a] mb-8">Delays May Occur Due To</h3>
            <motion.div
              className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3"
              variants={staggerContainer}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: '-50px' }}
            >
              {['Customs inspections', 'Customs clearance', 'Logistics disruptions', 'Weather conditions', 'Public holidays', 'Transportation delays', 'Political situations', 'War-related disruptions', 'Economic conditions', 'Carrier delays', 'Supplier delays', 'Government regulations', 'Port congestion', 'Route disruptions'].map((item, idx) => (
                <motion.div
                  key={idx}
                  variants={staggerItem}
                  whileHover={{ y: -4 }}
                  className="bg-[#111] rounded-xl p-4 text-center text-xs text-white/50 hover:text-white/80 hover:bg-[#1a1a1a] transition-all duration-300 cursor-default"
                >
                  {item}
                </motion.div>
              ))}
            </motion.div>
          </RevealSection>

          {/* Price Fluctuation */}
          <RevealSection delay={0.3} className="mb-16">
            <h3 className="font-perandory text-lg uppercase tracking-[0.2em] text-[#1a1a1a] mb-8">Shipping Prices May Fluctuate Due To</h3>
            <motion.div
              className="grid grid-cols-2 sm:grid-cols-3 gap-3"
              variants={staggerContainer}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: '-50px' }}
            >
              {['Fuel costs', 'Logistics rates', 'Customs requirements', 'Carrier pricing', 'Economic conditions', 'Market fluctuations'].map((item, idx) => (
                <motion.div
                  key={idx}
                  variants={staggerItem}
                  whileHover={{ y: -4 }}
                  className="bg-white border border-gray-100 shadow-sm rounded-xl p-4 text-center text-xs text-gray-400 hover:text-[#1a1a1a] hover:border-[#8A001A]/20 hover:shadow-md transition-all duration-300"
                >
                  {item}
                </motion.div>
              ))}
            </motion.div>
            <p className="text-gray-400 text-xs mt-6 italic">These factors are completely outside of our control.</p>
          </RevealSection>

          {/* Transparency Notice */}
          <RevealSection delay={0.35}>
            <div className="relative rounded-2xl overflow-hidden bg-[#111] shadow-[0_8px_40px_rgb(0,0,0,0.08)]">
              <div className="absolute inset-0 bg-gradient-to-br from-[#8A001A]/10 via-transparent to-[#8A001A]/5" />
              <div className="relative p-10 md:p-14 border border-white/10 rounded-2xl">
                <p className="text-white/60 text-sm leading-[1.9]">
                  We kindly ask customers to place orders only if they are comfortable with possible delays, changing shipping costs, customs procedures, and international sourcing timelines. Our goal is to be <strong className="font-semibold text-white">transparent from the beginning</strong> so there are no surprises later.
                </p>
              </div>
            </div>
          </RevealSection>
        </div>
      </section>

      {/* ═══════ NAVIGATION ═══════ */}
      <section className="bg-[#111] py-10">
        <div className="max-w-7xl mx-auto px-4 md:px-16 flex justify-between items-center">
          <motion.div whileHover={{ x: -4 }} transition={{ duration: 0.2 }}>
            <Link href="/order-info/order-process" className="flex items-center gap-3 text-white/30 hover:text-white/60 transition-colors text-[10px] font-bold tracking-[0.2em] uppercase">
              <ArrowLeft className="w-4 h-4" />
              Order Process
            </Link>
          </motion.div>
          <motion.div whileHover={{ x: 4 }} transition={{ duration: 0.2 }}>
            <Link href="/order-info/policies" className="flex items-center gap-3 text-[#8A001A] hover:text-[#c4002a] transition-colors text-[10px] font-bold tracking-[0.2em] uppercase">
              Policies & Guidelines
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
