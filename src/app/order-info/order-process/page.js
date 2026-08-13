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

  useEffect(() => {
    // Dynamically load the Lottie player script only on the client side
    const script = document.createElement('script');
    script.src = 'https://unpkg.com/@lottiefiles/lottie-player@latest/dist/lottie-player.js';
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <div ref={containerRef} className="relative bg-[#FFFFFF] text-[#111111] overflow-hidden" style={{ fontFamily: 'var(--font-montserrat), sans-serif' }}>

      {/* ═══ PROGRESS BAR ═══ */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-[#8A001A] z-[9999] origin-left"
        style={{ scaleX }}
      />

      {/* ═══ HERO — GEN-Z EDITORIAL ═══ */}
      <section ref={heroRef} className="relative pt-32 pb-16 md:pt-40 md:pb-24 bg-white flex flex-col md:flex-row items-center max-w-7xl mx-auto px-4 gap-12 overflow-hidden">
        {/* Left Side: Text */}
        <div className="flex-1 w-full relative z-10 pt-10 md:pt-0">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.6 }}
            className="mb-8"
          >
            <Link href="/order-info" className="inline-flex items-center gap-2 text-neutral-500 hover:text-black transition-colors text-[10px] sm:text-xs font-bold tracking-[0.2em] uppercase">
              <ArrowLeft className="w-3.5 h-3.5" />
              Back to Info
            </Link>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="text-[#8A001A] text-[10px] md:text-xs uppercase tracking-[0.3em] mb-4 font-bold"
          >
            How It Works
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="text-5xl md:text-6xl lg:text-[5.5rem] font-perandory uppercase tracking-tight text-[#111111] mb-2 leading-[0.9]"
          >
            YOUR JOURNEY <br /> <span className="text-neutral-300">WITH US</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="font-aston-script text-[#8A001A] text-4xl md:text-5xl mb-8 -mt-2 ml-4 md:ml-12"
          >
            From Screen to Doorstep
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.8 }}
            className="text-neutral-500 text-sm md:text-base max-w-md leading-relaxed"
          >
            A transparent, two-step journey. We handle the sourcing, quality checks, and international transit. You just track the magic.
          </motion.p>
        </div>

        {/* Right Side: Editorial Image */}
        <div className="flex-1 w-full h-[50vh] md:h-[75vh] relative rounded-[2rem] overflow-hidden shadow-2xl border border-neutral-100">
           <motion.div 
             className="absolute inset-0"
             initial={{ scale: 1.1, opacity: 0 }}
             animate={{ scale: 1, opacity: 1 }}
             transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
           >
             <Image
               src="/images/genz-hero.jpg"
               alt="Modern Editorial"
               fill
               className="object-cover"
               priority
             />
             {/* Subtle vignette/overlay */}
             <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
           </motion.div>
        </div>
      </section>

      {/* ═══ TRUST STATS BAR ═══ */}
      <section ref={statsRef} className="relative py-12 md:py-16 border-y border-neutral-100 bg-[#F8F9FA]">
        <div className="max-w-6xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-10 text-center">
          {[
            { target: 500, suffix: '+', label: 'Happy Customers' },
            { target: 30, suffix: 'k+', label: 'Insta Followers' },
            { target: 100, suffix: '%', label: 'Transparency' },
            { target: 24, suffix: '/7', label: 'Support Available' },
          ].map((stat, i) => (
            <RevealSection key={i} delay={i * 0.1}>
              <div className="text-3xl md:text-4xl font-bold text-[#111111] mb-1 font-montserrat">
                <AnimatedCounter target={stat.target} suffix={stat.suffix} inView={statsInView} />
              </div>
              <p className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-neutral-400">{stat.label}</p>
            </RevealSection>
          ))}
        </div>
      </section>

      {/* ═══ STEP 01 ═══ */}
      <section className="relative py-20 md:py-32 bg-white">
        <div className="max-w-6xl mx-auto px-4 md:px-8">
          <RevealSection className="mb-12 md:mb-20">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div>
                <p className="text-[#8A001A] text-2xl md:text-3xl font-aston-script mb-2">Step One</p>
                <h2 className="text-3xl md:text-5xl uppercase tracking-tighter text-[#111111] font-perandory">Securing Your Piece</h2>
              </div>
              <p className="text-neutral-500 text-sm max-w-md">
                Your first payment covers the actual product price. We immediately begin sourcing and inspecting your item.
              </p>
            </div>
          </RevealSection>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            <RevealSection delay={0.2}>
              <div className="bg-[#F8F9FA] rounded-2xl p-8 md:p-10 h-full border border-neutral-100 hover:border-neutral-200 transition-colors">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm mb-6">
                  <Package className="w-5 h-5 text-[#111111]" />
                </div>
                <h3 className="text-lg font-bold uppercase tracking-wide text-[#111111] mb-4">Sourcing & Quality</h3>
                <p className="text-neutral-600 text-sm leading-relaxed mb-6">
                  Once confirmed, our team begins the dedicated process of securing your item and preparing it for its international transit. Every piece goes through a strict quality check.
                </p>
                <ul className="space-y-3">
                  {['Dedicated Procurement', 'Initial Quality Inspection', 'Reservation Protection'].map((item, i) => (
                    <li key={i} className="flex items-center gap-3">
                      <div className="w-4 h-4 rounded-full bg-[#8A001A]/10 flex items-center justify-center flex-shrink-0">
                        <Check className="w-2.5 h-2.5 text-[#8A001A]" />
                      </div>
                      <span className="text-neutral-600 text-sm font-medium">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </RevealSection>
            
            <RevealSection delay={0.3}>
              <div className="bg-white border border-neutral-200 rounded-2xl p-8 md:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] h-full flex flex-col justify-center">
                <h3 className="font-aston-script text-3xl md:text-4xl text-[#8A001A] mb-4 text-center">What's included?</h3>
                <p className="text-neutral-500 text-sm text-center leading-relaxed">
                  Your piece is now secured. We handle the heavy lifting across borders so you don't have to worry about a thing until it reaches our hub.
                </p>
              </div>
            </RevealSection>
          </div>
        </div>
      </section>

      {/* ═══ EDITORIAL DIVIDER ═══ */}
      <section className="py-16 md:py-24 bg-[#111111] text-center px-4 overflow-hidden relative">
         <div className="absolute top-0 left-0 w-full h-full opacity-[0.03] bg-[radial-gradient(circle_at_center,_white_1px,_transparent_1px)] [background-size:24px_24px]" />
         <RevealSection>
           <h2 className="text-3xl md:text-5xl font-bold uppercase tracking-tighter text-white font-montserrat">
             ACROSS THE GLOBE
           </h2>
           <p className="text-white/50 text-[10px] md:text-xs mt-4 tracking-[0.3em] uppercase">Directly to your doorstep</p>
         </RevealSection>
      </section>

      {/* ═══ STEP 02 ═══ */}
      <section className="relative py-20 md:py-32 bg-white overflow-hidden">
        <div className="max-w-6xl mx-auto px-4 md:px-8">
          <RevealSection className="mb-12 md:mb-20">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div>
                <p className="text-[#8A001A] text-2xl md:text-3xl font-aston-script mb-2">Step Two</p>
                <h2 className="text-3xl md:text-5xl uppercase tracking-tighter text-[#111111] font-perandory">Bringing It Home</h2>
              </div>
              <p className="text-neutral-500 text-sm max-w-md">
                Once your piece reaches our international hub, we calculate the exact shipping and logistics costs for the final leg.
              </p>
            </div>
          </RevealSection>

          <RevealSection delay={0.2} className="mb-16">
            <div className="bg-[#F8F9FA] border border-neutral-100 rounded-2xl p-8 md:p-12 relative overflow-hidden flex flex-col md:flex-row items-center gap-10">
              
              <div className="flex-1 relative z-10">
                <div className="inline-flex items-center justify-center p-2 bg-[#8A001A]/10 rounded-lg mb-6">
                  <Receipt className="w-5 h-5 text-[#8A001A]" />
                </div>
                <h3 className="text-2xl font-bold text-[#111111] mb-4 font-montserrat">The Shipping Payment</h3>
                <p className="text-neutral-600 text-sm leading-relaxed mb-6 max-w-md">
                  A detailed cost breakdown for shipping, customs, and final delivery will be sent directly to your <span className="font-bold text-[#111111]">WhatsApp and Email</span>. Payment of this second invoice secures the final dispatch to your door.
                </p>
              </div>
              
              <div className="w-full md:w-1/3 flex justify-center">
                 <lottie-player 
                   src="https://lottie.host/efeb2b1c-ab48-49f4-bf8c-b2e14ba788e3/nC6ZCpxNax.json" 
                   background="transparent" 
                   speed="1" 
                   style={{ width: '300px', height: '300px' }} 
                   loop 
                   autoplay
                 ></lottie-player>
              </div>
            </div>
          </RevealSection>

          {/* Shipping Types Grid - INFINITE MARQUEE */}
          <div className="relative w-full overflow-hidden mt-12 py-4">
             {/* Fade Gradients */}
             <div className="absolute inset-y-0 left-0 w-16 md:w-32 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
             <div className="absolute inset-y-0 right-0 w-16 md:w-32 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />
             
             <motion.div 
               className="flex gap-4 md:gap-6 w-max"
               animate={{ x: ["0%", "-50%"] }}
               transition={{ repeat: Infinity, ease: "linear", duration: 30 }}
             >
               {[
                 { icon: Plane, title: 'Global Transit', subtitle: 'Calculations' },
                 { icon: Receipt, title: 'Customs', subtitle: 'Clearance' },
                 { icon: FileText, title: 'Import', subtitle: 'Charges' },
                 { icon: Truck, title: 'Final Mile', subtitle: 'Delivery' },
                 { icon: Package, title: 'Careful', subtitle: 'Handling' },
                 // Duplicate for infinite loop
                 { icon: Plane, title: 'Global Transit', subtitle: 'Calculations' },
                 { icon: Receipt, title: 'Customs', subtitle: 'Clearance' },
                 { icon: FileText, title: 'Import', subtitle: 'Charges' },
                 { icon: Truck, title: 'Final Mile', subtitle: 'Delivery' },
                 { icon: Package, title: 'Careful', subtitle: 'Handling' },
               ].map(({ icon: Icon, title, subtitle }, i) => (
                 <div key={i} className="bg-white border border-neutral-200 rounded-xl p-6 w-[200px] flex-shrink-0 flex flex-col items-center justify-center text-center hover:border-[#8A001A]/30 hover:shadow-sm transition-all group">
                   <Icon className="w-6 h-6 text-[#111111] mb-3 group-hover:text-[#8A001A] transition-colors" strokeWidth={1.5} />
                   <span className="text-[10px] font-bold tracking-widest uppercase text-neutral-500 group-hover:text-[#111111] transition-colors">
                     {title}<br />{subtitle}
                   </span>
                 </div>
               ))}
             </motion.div>
          </div>
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
          className="absolute -top-[100px] -bottom-[100px] left-0 right-0"
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
