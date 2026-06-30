'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Check, Plane, Receipt, FileText, Truck, Package, ShieldCheck, Globe, Clock, Heart, Sparkles, ChevronDown } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform, useInView, useSpring, AnimatePresence } from 'framer-motion';
import { GradientBackground } from '@/components/ui/gradient-background';
/* ─── Animated Counter ─── */
function AnimatedCounter({ target, suffix = '', inView }) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const duration = 2000;
    const step = Math.ceil(target / (duration / 16));
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setCount(target); clearInterval(timer); }
      else setCount(start);
    }, 16);
    return () => clearInterval(timer);
  }, [inView, target]);
  return <span>{count}{suffix}</span>;
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

/* ─── Reveal on scroll wrapper ─── */
function RevealSection({ children, className = '', delay = 0 }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: 80 }}
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

/* ─── Stagger children ─── */
const staggerContainer = {
  hidden: {},
  show: { transition: { staggerChildren: 0.15, delayChildren: 0.3 } }
};
const staggerItem = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } }
};

export default function OrderProcessPage() {
  const containerRef = useRef(null);
  const heroRef = useRef(null);
  const statsRef = useRef(null);
  const statsInView = useInView(statsRef, { once: true });

  /* ── Parallax scroll values ── */
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ['start start', 'end end'] });
  const heroY = useTransform(scrollYProgress, [0, 0.15], [0, -150]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.12], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.15], [1, 1.1]);

  /* ── Smooth spring for progress bar ── */
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

  return (
    <div ref={containerRef} className="relative bg-[#161616] text-white overflow-hidden" style={{ fontFamily: 'var(--font-dm-sans), sans-serif' }}>

      {/* ═══ PROGRESS BAR ═══ */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-[#8A001A] via-[#c4002a] to-[#8A001A] z-[9999] origin-left"
        style={{ scaleX }}
      />

      {/* ═══ HERO — FULL VIEWPORT CINEMATIC ═══ */}
      <section ref={heroRef} className="relative h-[100vh] flex items-center justify-center overflow-hidden">
        {/* Parallax background */}
        <motion.div className="absolute inset-0" style={{ y: heroY, scale: heroScale }}>
          <Image
            src="/images/order-hero-bg.png"
            alt="Luxury fashion"
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-[#161616]" />
        </motion.div>

        {/* Floating decorative elements */}
        <FloatingIcon delay={0} className="top-[15%] left-[8%] opacity-20">
          <Sparkles className="w-8 h-8 text-[#8A001A]" />
        </FloatingIcon>
        <FloatingIcon delay={1.5} className="top-[25%] right-[10%] opacity-15">
          <Heart className="w-6 h-6 text-[#8A001A]" />
        </FloatingIcon>
        <FloatingIcon delay={3} className="bottom-[30%] left-[15%] opacity-10">
          <Globe className="w-10 h-10 text-white" />
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
            The House of Avira Experience
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="font-perandory text-5xl md:text-7xl lg:text-[6rem] uppercase leading-[0.95] mb-4"
          >
            YOUR JOURNEY
            <br />
            <span className="text-[#8A001A]">WITH US</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.8 }}
            className="font-aston-script text-[#c4a87c] text-3xl md:text-5xl mb-8"
          >
            Personal & Transparent
          </motion.p>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.3, duration: 1 }}
            className="text-white/50 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed"
          >
            We want you to feel confident at every stage of your order. Follow your piece from selection to doorstep.
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

      {/* ═══ TRUST STATS BAR ═══ */}
      <section ref={statsRef} className="relative py-16 md:py-20 border-y border-white/10 bg-[#161616]">
        <div className="max-w-6xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { target: 500, suffix: '+', label: 'Happy Customers' },
            { target: 15, suffix: '+', label: 'Countries Served' },
            { target: 100, suffix: '%', label: 'Transparency' },
            { target: 24, suffix: '/7', label: 'Support Available' },
          ].map((stat, i) => (
            <RevealSection key={i} delay={i * 0.15}>
              <div className="text-4xl md:text-5xl font-perandory text-white mb-2">
                <AnimatedCounter target={stat.target} suffix={stat.suffix} inView={statsInView} />
              </div>
              <p className="text-xs uppercase tracking-[0.2em] text-white/40">{stat.label}</p>
            </RevealSection>
          ))}
        </div>
      </section>

      {/* ═══ STEP 01 — SECURING YOUR PIECE ═══ */}
      <section className="relative py-24 md:py-36 bg-[#FAFAFA] text-[#1a1a1a]">
        {/* Subtle radial glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[#8A001A]/5 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 md:px-16">
          {/* Step header */}
          <RevealSection className="mb-16 md:mb-24">
            <div className="flex items-end gap-6 md:gap-10">
              <span className="font-perandory text-[8rem] md:text-[12rem] leading-none text-black/[0.04] select-none">01</span>
              <div className="pb-4 md:pb-8">
                <p className="text-[#8A001A] text-xs font-bold uppercase tracking-[0.3em] mb-2">Step One</p>
                <h2 className="font-perandory text-3xl md:text-5xl lg:text-6xl uppercase">Securing Your Piece</h2>
              </div>
            </div>
          </RevealSection>

          <RevealLine className="mb-16" />

          {/* Content cards */}
          <div className="grid grid-cols-1 max-w-4xl mx-auto gap-8 mb-20">
              <RevealSection delay={0.3}>
                <div className="bg-white border border-gray-200 shadow-sm rounded-2xl p-8 md:p-10 hover:border-[#8A001A]/30 transition-all duration-500 group">
                  <h3 className="font-perandory text-xl md:text-2xl uppercase tracking-wider mb-5 group-hover:text-[#8A001A] transition-colors">THE PRODUCT VALUE</h3>
                  <p className="text-gray-600 leading-relaxed mb-6">Your journey begins with the selection of your curated piece. This first payment covers the actual product price as listed on our website.</p>
                  <div className="flex items-center gap-3 text-[#8A001A]">
                    <div className="w-8 h-px bg-[#8A001A]" />
                    <p className="font-semibold text-sm uppercase tracking-wider">What happens next?</p>
                  </div>
                  <p className="text-gray-500 mt-3 text-sm leading-relaxed">Once confirmed, our team begins the dedicated process of securing your item and preparing it for its international transit.</p>
                </div>
              </RevealSection>

              <RevealSection delay={0.45}>
                <div className="bg-white border border-gray-200 shadow-sm rounded-2xl p-8 md:p-10 hover:border-[#8A001A]/30 transition-all duration-500 group">
                  <h3 className="font-perandory text-xl md:text-2xl uppercase tracking-wider mb-5 group-hover:text-[#8A001A] transition-colors">WHAT&apos;S INCLUDED NOW</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <p className="text-xs uppercase tracking-[0.2em] text-gray-400 mb-4">Priority Handling</p>
                      <ul className="space-y-3">
                        {['Sourcing & Procurement', 'Initial Quality Check'].map((item, i) => (
                          <motion.li
                            key={i}
                            className="flex items-center gap-3"
                            whileHover={{ x: 5 }}
                            transition={{ duration: 0.2 }}
                          >
                            <Check className="w-4 h-4 text-[#8A001A] flex-shrink-0" />
                            <span className="text-gray-600 text-sm">{item}</span>
                          </motion.li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-[0.2em] text-gray-400 mb-4">Peace of Mind</p>
                      <ul className="space-y-3">
                        {['Reservation Protection', 'Dedicated Order Support'].map((item, i) => (
                          <motion.li
                            key={i}
                            className="flex items-center gap-3"
                            whileHover={{ x: 5 }}
                            transition={{ duration: 0.2 }}
                          >
                            <Check className="w-4 h-4 text-[#8A001A] flex-shrink-0" />
                            <span className="text-gray-600 text-sm">{item}</span>
                          </motion.li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </RevealSection>
            </div>
        </div>
      </section>

      {/* ═══ CINEMATIC DIVIDER — PARALLAX IMAGE ═══ */}
      <section className="relative h-[60vh] md:h-[70vh] overflow-hidden">
        <motion.div
          className="absolute inset-0"
          style={{ y: useTransform(scrollYProgress, [0.25, 0.45], [0, -80]) }}
        >
          <Image
            src="/ACROSS THE GLOBE.png"
            alt="Global shipping"
            fill
            className="object-cover"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-black/50" />
        </motion.div>
        <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-4">
          <RevealSection>
            <p className="text-xs uppercase tracking-[0.4em] text-white/50 mb-4">Your piece is on its way</p>
            <h2 className="font-perandory text-4xl md:text-6xl lg:text-7xl uppercase mb-4">ACROSS THE GLOBE</h2>
            <p className="font-aston-script text-[#c4a87c] text-2xl md:text-4xl">Directly to your doorstep</p>
          </RevealSection>
        </div>
      </section>

      {/* ═══ STEP 02 — BRINGING IT HOME ═══ */}
      <section className="relative py-24 md:py-36 bg-white text-[#1a1a1a] overflow-hidden">
        <Image
          src="/images/section-effect.png"
          alt="Bringing It Home Background"
          fill
          className="object-cover opacity-60"
          sizes="100vw"
        />
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#8A001A]/5 rounded-full blur-[200px] pointer-events-none" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-16">
          {/* Step header */}
          <RevealSection className="mb-16 md:mb-24">
            <div className="flex items-end gap-6 md:gap-10">
              <span className="font-perandory text-[8rem] md:text-[12rem] leading-none text-gray-100 select-none">02</span>
              <div className="pb-4 md:pb-8">
                <p className="text-[#8A001A] text-xs font-bold uppercase tracking-[0.3em] mb-2">Step Two</p>
                <h2 className="font-perandory text-3xl md:text-5xl lg:text-6xl uppercase">Bringing It Home</h2>
              </div>
            </div>
          </RevealSection>

          <RevealLine className="mb-16" />

          <RevealSection>
            <p className="text-lg md:text-xl text-gray-600 max-w-3xl leading-relaxed mb-16">
              Once your curated piece arrives at our international warehouse, we calculate the final logistics and delivery costs specifically for your order.
            </p>
          </RevealSection>

          {/* The shipping payment - cinematic card */}
          <RevealSection delay={0.2} className="mb-20">
            <div className="relative rounded-2xl overflow-hidden bg-[#FDFBF7] shadow-[0_8px_40px_rgb(0,0,0,0.08)] hover:shadow-[0_12px_50px_rgba(138,0,26,0.15)] transition-shadow duration-500">
              <div className="absolute inset-0 bg-gradient-to-br from-[#8A001A]/10 via-transparent to-[#8A001A]/5" />
              <div className="relative p-10 md:p-16 text-center border border-black/5 rounded-2xl">
                <motion.div
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                  className="absolute top-6 right-6 opacity-10"
                >
                  <Globe className="w-16 h-16 text-[#8A001A]" />
                </motion.div>
                <h3 className="font-aston-script text-4xl md:text-6xl text-[#8A001A] mb-6 capitalize">The shipping payment</h3>
                <p className="text-gray-700 max-w-2xl mx-auto leading-relaxed text-base md:text-lg">
                  A detailed cost breakdown for shipping and logistics will be sent directly to your{' '}
                  <span className="text-[#8A001A] font-bold uppercase tracking-wider">WhatsApp and Email</span>.
                  Payment of this second payment is required to secure your final delivery.
                </p>
              </div>
            </div>
          </RevealSection>

          {/* Shipping Types Grid — animated icons */}
          <motion.div
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6 mb-20"
            variants={staggerContainer}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-50px' }}
          >
            {[
              { icon: Plane, title: 'Global Transit', subtitle: 'Calculations' },
              { icon: Receipt, title: 'Customs &', subtitle: 'Clearance Services' },
              { icon: FileText, title: 'Statutory Import', subtitle: 'Charges' },
              { icon: Truck, title: 'Final Mile', subtitle: 'Delivery' },
              { icon: Package, title: 'Careful Handling', subtitle: '& Logistics' },
            ].map(({ icon: Icon, title, subtitle }, i) => (
              <motion.div
                key={i}
                variants={staggerItem}
                whileHover={{ y: -8, borderColor: 'rgba(138, 0, 26, 0.4)' }}
                className="bg-[#111] border border-white/5 shadow-[0_4px_20px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgba(138,0,26,0.15)] rounded-2xl p-6 md:p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-500 group h-44 md:h-52"
              >
                <motion.div
                  whileHover={{ rotate: 15, scale: 1.2 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                >
                  <Icon className="w-8 h-8 md:w-10 md:h-10 mb-4 text-[#8A001A] group-hover:text-[#c4002a] transition-colors" />
                </motion.div>
                <span className="text-[10px] md:text-xs font-bold tracking-widest uppercase text-white/50 group-hover:text-white transition-colors">
                  {title}<br />{subtitle}
                </span>
              </motion.div>
            ))}
          </motion.div>

        </div>
      </section>

      {/* ═══ TIMELINE WITH SHADER BACKGROUND ═══ */}
      <GradientBackground className="py-24 md:py-36" overlay={true} overlayOpacity={0.6}>
        <div className="max-w-7xl mx-auto px-4 md:px-16 w-full relative z-10">
          <RevealSection className="mb-16">
            <h3 className="font-perandory text-2xl md:text-3xl uppercase tracking-wider text-center mb-12">
              What happens once we calculate the final costs?
            </h3>
          </RevealSection>

          <div className="relative max-w-4xl mx-auto">
            {/* Vertical timeline line */}
            <div className="absolute left-6 md:left-1/2 md:-translate-x-px top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-[#8A001A]/40 to-transparent hidden md:block overflow-hidden">
              {/* Animated glowing beam */}
              <motion.div
                className="absolute left-0 top-0 w-full h-32 bg-gradient-to-b from-transparent via-[#ff0033] to-transparent"
                style={{
                  boxShadow: "0 0 15px 2px rgba(255, 0, 51, 0.8)",
                  filter: "blur(1px)"
                }}
                animate={{
                  top: ['-10%', '110%']
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "linear",
                }}
              />
            </div>

            {[
              { num: '01', title: 'Your Total', desc: 'We compile the exact shipping, customs, and delivery charges specific to your order and destination.' },
              { num: '02', title: 'The Details', desc: 'A transparent breakdown is sent to your WhatsApp and email — every line item clearly explained.' },
              { num: '03', title: 'The Timeline', desc: 'Estimated delivery windows are shared, so you know exactly when to expect your curated piece.' },
            ].map((step, i) => (
              <RevealSection key={i} delay={i * 0.2} className="mb-12 last:mb-0">
                <div className={`flex items-start gap-8 md:gap-12 ${i % 2 === 1 ? 'md:flex-row-reverse' : ''}`}>
                  <div className={`flex-1 ${i % 2 === 1 ? 'md:text-right' : ''}`}>
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      className="bg-white/[0.03] backdrop-blur-sm border border-white/10 rounded-2xl p-8 hover:border-[#8A001A]/30 transition-all duration-500"
                    >
                      <div className="flex items-center gap-4 mb-4">
                        <span className="font-perandory text-3xl md:text-4xl text-[#8A001A]">{step.num}</span>
                        <h4 className="font-perandory text-lg md:text-xl uppercase tracking-wider">{step.title}</h4>
                      </div>
                      <p className="text-white/50 leading-relaxed">{step.desc}</p>
                    </motion.div>
                  </div>
                  <div className="hidden md:flex items-center justify-center w-4 h-4 rounded-full bg-[#8A001A] ring-4 ring-[#8A001A]/20 flex-shrink-0 mt-10" />
                  <div className="flex-1 hidden md:block" />
                </div>
              </RevealSection>
            ))}
          </div>

        </div>
      </GradientBackground>

      {/* ═══ CINEMATIC DELIVERY IMAGE DIVIDER ═══ */}
      <section className="relative h-[50vh] md:h-[60vh] overflow-hidden">
        <motion.div
          className="absolute inset-0"
          style={{ y: useTransform(scrollYProgress, [0.6, 0.8], [0, -60]) }}
        >
          <Image
            src="/images/order-delivery-bg.png"
            alt="Premium delivery"
            fill
            className="object-cover"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-black/40" />
        </motion.div>
        <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-4">
          <RevealSection>
            <ShieldCheck className="w-12 h-12 text-[#8A001A] mx-auto mb-4" />
            <h2 className="font-perandory text-3xl md:text-5xl uppercase mb-3">Delivered With Care</h2>
            <p className="text-white/50 text-lg max-w-lg">Every piece arrives exactly as intended — inspected, packaged, and delivered to perfection.</p>
          </RevealSection>
        </div>
      </section>

      {/* ═══ PROMISE + CTA ═══ */}
      <section className="relative py-24 md:py-36 overflow-hidden">
        <Image
          src="/images/our-promise-bg.png"
          alt="Our promise background"
          fill
          className="object-cover hidden md:block"
          sizes="100vw"
        />
        <Image
          src="/images/our-promise-bg-mobile.png"
          alt="Our promise background"
          fill
          className="object-cover block md:hidden"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-black/60" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(138,0,26,0.1)_0%,_transparent_70%)]" />
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <RevealSection>
            <p className="text-xs uppercase tracking-[0.4em] text-[#8A001A] mb-6">A Commitment To You</p>
            <h2 className="font-perandory text-3xl md:text-5xl uppercase mb-8">Our Promise on Fees</h2>
            <p className="text-white/40 text-lg md:text-2xl leading-relaxed max-w-2xl mx-auto mb-16 font-aston-script">
              We believe in full transparency. Shipping and mandatory fees are calculated precisely based on your order&apos;s specific journey. We&apos;ll always guide you through the final payment schedule to ensure your piece arrives safely and promptly at your door.
            </p>
          </RevealSection>

          <RevealSection delay={0.3}>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
              <Link
                href="/order-info/shipping"
                className="inline-block bg-[#8A001A] text-white text-xs font-bold uppercase py-5 px-16 rounded-full hover:bg-[#a1001e] transition-all duration-300 tracking-[0.2em] shadow-2xl shadow-[#8A001A]/30 hover:shadow-[#8A001A]/50"
              >
                Learn about Delivery
              </Link>
            </motion.div>
          </RevealSection>
        </div>
      </section>
    </div>
  );
}
