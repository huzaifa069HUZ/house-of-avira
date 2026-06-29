'use client';

import Link from 'next/link';
import { useRef } from 'react';
import { motion, useScroll, useTransform, useInView, useSpring } from 'framer-motion';
import { ArrowLeft, RotateCcw, DollarSign, Clock, ShieldAlert, XCircle, UserX, AlertTriangle, FileText, CheckCircle2, PackageX, Scale, Box, Truck, ShieldCheck, Heart, Plane, Globe, Search, Camera, Video, Package, Info, Mail, MessageCircle } from 'lucide-react';

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

/* ─── Stagger variants ─── */
const staggerContainer = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.1 } }
};
const staggerItem = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } }
};

export default function PoliciesPage() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ['start start', 'end end'] });
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

  return (
    <div ref={containerRef} className="relative bg-white text-[#1a1a1a] overflow-hidden" style={{ fontFamily: 'var(--font-dm-sans), sans-serif' }}>
      
      {/* ═══ PROGRESS BAR ═══ */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-[#8A001A] via-[#c4002a] to-[#8A001A] z-[9999] origin-left"
        style={{ scaleX }}
      />

      {/* ═══════ HERO (Kept Dark) ═══════ */}
      <section className="relative min-h-[50vh] flex items-end overflow-hidden pt-24 bg-[#0A0A0A]">
        <div className="absolute inset-0">
          <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 80px, rgba(255,255,255,0.08) 80px, rgba(255,255,255,0.08) 81px), repeating-linear-gradient(90deg, transparent, transparent 80px, rgba(255,255,255,0.08) 80px, rgba(255,255,255,0.08) 81px)' }} />
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full" style={{ background: 'radial-gradient(circle, rgba(138,0,26,0.1) 0%, transparent 70%)' }} />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-16 pb-16 md:pb-20 w-full">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <Link href="/order-info" className="inline-flex items-center gap-3 text-white/50 hover:text-white transition-colors text-[10px] tracking-[0.25em] uppercase font-bold mb-12 group">
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              Back to Overview
            </Link>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="flex items-center gap-3 mb-6">
            <div className="w-2 h-2 rounded-full bg-[#8A001A] animate-pulse" />
            <span className="text-[11px] font-bold tracking-[0.4em] uppercase text-[#8A001A]">Section 03</span>
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="text-4xl sm:text-5xl md:text-7xl lg:text-[7rem] font-perandory text-white uppercase tracking-tight leading-[1.1] md:leading-[0.95]">
            Policies <br/><span className="text-[#8A001A] font-aston-script lowercase text-5xl sm:text-6xl md:text-8xl tracking-normal">& Guidelines</span>
          </motion.h1>
        </div>
      </section>

      {/* ═══════ ORDER CONFIRMATION ═══════ */}
      <section className="relative py-24 md:py-36 bg-white overflow-hidden">
        <div className="absolute top-0 right-0 text-[15rem] md:text-[25rem] font-perandory text-black/[0.02] leading-none select-none pointer-events-none -translate-y-1/4">01</div>
        <div className="max-w-7xl mx-auto px-4 md:px-16 relative z-10">
          <RevealSection>
            <p className="text-[#8A001A] text-xs font-bold uppercase tracking-[0.3em] mb-4">General</p>
            <h2 className="text-4xl md:text-6xl font-perandory text-black uppercase tracking-tight mb-8">Order Confirmation</h2>
          </RevealSection>
          
          <RevealLine className="mb-12" />

          <RevealSection delay={0.1}>
            <div className="max-w-3xl space-y-6 text-gray-600 text-lg md:text-xl font-light leading-relaxed">
              <p>All orders placed with House of Avira are considered <strong className="font-medium text-black">confirmed</strong> once payment has been successfully completed.</p>
              <p>By placing an order, the customer agrees to all store policies, processes, timelines, and shipping structures mentioned on this page.</p>
            </div>
            
            <div className="mt-12 inline-flex items-center gap-4 bg-[#8A001A]/5 border border-[#8A001A]/20 rounded-xl p-6 text-[#8A001A]">
              <FileText className="w-6 h-6 shrink-0" />
              <p className="text-sm font-medium tracking-wide">We strongly recommend reading all sections carefully before placing an order.</p>
            </div>
          </RevealSection>
        </div>
      </section>

      {/* ═══════ REFUND POLICY ═══════ */}
      <section className="relative py-24 md:py-36 bg-[#FAFAFA] overflow-hidden border-y border-black/5">
        <div className="absolute top-1/2 left-0 -translate-y-1/2 text-[15rem] md:text-[25rem] font-perandory text-black/[0.02] leading-none select-none pointer-events-none -translate-x-1/4">02</div>
        <div className="max-w-7xl mx-auto px-4 md:px-16 relative z-10">
          <RevealSection>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
              <div className="lg:col-span-5">
                <p className="text-[#8A001A] text-xs font-bold uppercase tracking-[0.3em] mb-4">Refunds</p>
                <h2 className="text-4xl md:text-6xl font-perandory text-black uppercase tracking-tight mb-8">Refund Policy</h2>
                <p className="text-gray-600 text-lg font-light leading-relaxed mb-8">
                  Refunds are only applicable in cases where there is a verified issue or error from our side, such as incorrect product dispatch or a confirmed product-related problem.
                </p>
                <div className="bg-white border-l-4 border-[#8A001A] shadow-sm p-6 rounded-r-xl">
                  <p className="text-sm text-gray-800">Once an order is placed and processed, the product price is <strong className="font-bold text-[#8A001A] uppercase tracking-wider">non-refundable</strong>.</p>
                </div>
              </div>
              
              <div className="lg:col-span-7">
                <h3 className="font-perandory text-xl text-black uppercase tracking-wider mb-8">Refunds are NOT applicable for:</h3>
                <motion.div className="grid grid-cols-1 sm:grid-cols-2 gap-4" variants={staggerContainer} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-50px' }}>
                  {[
                    { icon: RotateCcw, label: 'Change of mind' },
                    { icon: DollarSign, label: 'Shipping cost higher than expected' },
                    { icon: Clock, label: 'Delay in delivery' },
                    { icon: ShieldAlert, label: 'Customs charges or duties' },
                    { icon: XCircle, label: 'Decision not to proceed' },
                    { icon: UserX, label: 'Personal preference' }
                  ].map((item, idx) => (
                    <motion.div key={idx} variants={staggerItem} className="flex items-start gap-4 bg-white border border-gray-100 shadow-sm rounded-xl p-6 hover:shadow-md hover:border-[#8A001A]/20 transition-all duration-300">
                      <item.icon className="w-5 h-5 text-[#8A001A] shrink-0 mt-0.5" />
                      <span className="text-sm text-gray-700 font-medium">{item.label}</span>
                    </motion.div>
                  ))}
                </motion.div>
              </div>
            </div>
          </RevealSection>
        </div>
      </section>

      {/* ═══════ CANCELLATION ═══════ */}
      <section className="relative py-24 md:py-36 bg-white overflow-hidden text-center">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[#8A001A]/5 rounded-full blur-[120px] pointer-events-none" />
        <div className="max-w-4xl mx-auto px-4 md:px-16 relative z-10">
          <RevealSection>
            <p className="text-[#8A001A] text-xs font-bold uppercase tracking-[0.3em] mb-4">Cancellations</p>
            <h2 className="text-4xl md:text-6xl font-perandory text-black uppercase tracking-tight mb-12">Cancellation Policy</h2>
            
            <div className="relative rounded-2xl overflow-hidden bg-black shadow-2xl mb-12 transform hover:scale-[1.01] transition-transform duration-500">
              <div className="absolute inset-0 bg-gradient-to-br from-[#8A001A]/20 via-transparent to-[#8A001A]/10" />
              <div className="relative p-12 md:p-20 border border-[#8A001A]/20 rounded-2xl">
                <AlertTriangle className="w-12 h-12 text-[#8A001A] mx-auto mb-6" />
                <p className="text-3xl md:text-5xl font-perandory text-white uppercase leading-tight tracking-wide">
                  Cancellations are <span className="text-[#8A001A]">not allowed</span> once an order has been placed.
                </p>
              </div>
            </div>
            
            <p className="text-gray-600 text-lg font-light leading-relaxed">
              Orders are immediately forwarded into processing and cannot be stopped, modified, or cancelled once confirmed. We kindly request customers to be fully certain before placing an order.
            </p>
          </RevealSection>
        </div>
      </section>

      {/* ═══════ EXCHANGE & RETURN ═══════ */}
      <section className="relative py-24 md:py-36 bg-[#FAFAFA] overflow-hidden border-y border-black/5">
        <div className="max-w-7xl mx-auto px-4 md:px-16 relative z-10">
          <RevealSection className="mb-16">
            <p className="text-[#8A001A] text-xs font-bold uppercase tracking-[0.3em] mb-4">Returns</p>
            <h2 className="text-4xl md:text-6xl font-perandory text-black uppercase tracking-tight">Exchange & Return Policy</h2>
          </RevealSection>
          
          <RevealLine className="mb-16" />

          <motion.div className="grid grid-cols-1 md:grid-cols-2 gap-8" variants={staggerContainer} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-50px' }}>
            <motion.div variants={staggerItem} className="bg-white border border-gray-100 shadow-sm rounded-2xl p-10 hover:shadow-xl hover:border-[#8A001A]/20 transition-all duration-500">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-full bg-[#8A001A]/10 flex items-center justify-center">
                  <RotateCcw className="w-6 h-6 text-[#8A001A]" />
                </div>
                <h3 className="font-perandory text-2xl text-black uppercase tracking-wider">Exchanges</h3>
              </div>
              <p className="text-gray-600 leading-relaxed font-light text-lg">
                Exchanges are only possible if a replacement item is available in stock. If a replacement is not available, exchanges cannot be processed.
              </p>
            </motion.div>
            
            <motion.div variants={staggerItem} className="bg-white border border-gray-100 shadow-sm rounded-2xl p-10 hover:shadow-xl hover:border-[#8A001A]/20 transition-all duration-500">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-full bg-black/5 flex items-center justify-center">
                  <PackageX className="w-6 h-6 text-black" />
                </div>
                <h3 className="font-perandory text-2xl text-black uppercase tracking-wider">Returns</h3>
              </div>
              <p className="text-gray-600 leading-relaxed font-light text-lg">
                Returns are <strong className="font-medium text-black">not accepted</strong> under any circumstances. Due to hygiene, handling, and international logistics standards, all products are final once dispatched.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ═══════ PRODUCT EXPECTATIONS ═══════ */}
      <section className="relative py-24 md:py-36 bg-white overflow-hidden">
        <div className="absolute top-0 right-0 text-[15rem] md:text-[25rem] font-perandory text-black/[0.02] leading-none select-none pointer-events-none -translate-y-1/4">05</div>
        <div className="max-w-7xl mx-auto px-4 md:px-16 relative z-10">
          <RevealSection>
            <p className="text-[#8A001A] text-xs font-bold uppercase tracking-[0.3em] mb-4">Quality</p>
            <h2 className="text-4xl md:text-6xl font-perandory text-black uppercase tracking-tight mb-8">Product Expectations</h2>
            <p className="text-gray-600 text-lg md:text-xl font-light leading-relaxed max-w-3xl mb-12">
              All products are sourced based on product listings, reference images, and available supplier information. We ensure all details are shared as accurately as possible before purchase.
            </p>
          </RevealSection>
          
          <RevealSection delay={0.1}>
            <h3 className="font-perandory text-xl text-black uppercase tracking-wider mb-8">Minor variations may occur due to:</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {['Manufacturing differences', 'Fabric/material batches', 'Lighting in images', 'Production variations'].map((item, idx) => (
                <div key={idx} className="bg-[#FAFAFA] border border-gray-100 rounded-xl p-6 text-center shadow-sm">
                  <span className="text-sm font-medium text-gray-800">{item}</span>
                </div>
              ))}
            </div>
            <div className="inline-flex items-center gap-3 text-gray-600 text-sm bg-gray-50 px-5 py-3 rounded-full border border-gray-100">
              <AlertTriangle className="w-4 h-4 text-gray-500" />
              <span>These are normal and not valid reasons for refunds.</span>
            </div>
          </RevealSection>
        </div>
      </section>

      {/* ═══════ CUSTOMER RESPONSIBILITY ═══════ */}
      <section className="relative py-24 md:py-36 bg-[#FAFAFA] overflow-hidden border-y border-black/5">
        <div className="max-w-7xl mx-auto px-4 md:px-16 relative z-10">
          <RevealSection className="mb-16 text-center">
            <p className="text-[#8A001A] text-xs font-bold uppercase tracking-[0.3em] mb-4">Your Role</p>
            <h2 className="text-4xl md:text-6xl font-perandory text-black uppercase tracking-tight">Customer Responsibility</h2>
          </RevealSection>

          <RevealLine className="mb-16" />

          <motion.div className="max-w-4xl mx-auto space-y-4" variants={staggerContainer} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-50px' }}>
            {[
              { text: 'All shipping details (name, address, phone) are correct' },
              { text: 'Review product details thoroughly before ordering' },
              { text: 'Be available to receive deliveries at your address' },
              { text: 'Understand pre-order and international shipping timelines' },
              { text: 'Complete shipping payments within the given deadline' }
            ].map((item, idx) => (
              <motion.div key={idx} variants={staggerItem} className="flex items-center gap-6 bg-white border border-gray-100 shadow-sm rounded-xl p-6 md:p-8 hover:shadow-md hover:border-[#8A001A]/20 transition-all duration-300 group">
                <span className="text-4xl md:text-5xl font-perandory text-gray-200 group-hover:text-[#8A001A] transition-colors leading-none">0{idx + 1}</span>
                <span className="text-base md:text-lg text-gray-700 font-medium group-hover:text-black transition-colors">{item.text}</span>
              </motion.div>
            ))}
          </motion.div>
          
          <RevealSection delay={0.4} className="max-w-4xl mx-auto mt-12">
            <div className="bg-[#8A001A]/5 border-l-4 border-[#8A001A] p-6 rounded-r-xl">
              <p className="text-gray-800 text-sm font-medium">If incorrect information is provided and results in delivery failure, delay, or loss of parcel, House of Avira will not be responsible.</p>
            </div>
          </RevealSection>
        </div>
      </section>

      {/* ═══════ AFTER DISPATCH ═══════ */}
      <section className="relative py-24 md:py-36 bg-white overflow-hidden text-center">
        <div className="max-w-7xl mx-auto px-4 md:px-16 relative z-10">
          <RevealSection className="mb-16">
            <p className="text-[#8A001A] text-xs font-bold uppercase tracking-[0.3em] mb-4">Post-Dispatch</p>
            <h2 className="text-4xl md:text-6xl font-perandory text-black uppercase tracking-tight">After Dispatch</h2>
          </RevealSection>

          <RevealSection delay={0.1}>
            <p className="text-gray-600 text-lg font-light leading-relaxed max-w-3xl mx-auto mb-12">
              Once shipped and handed over to the courier partner, responsibility for the parcel lies with the shipping carrier.
            </p>
            
            <motion.div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12" variants={staggerContainer} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-50px' }}>
              {[
                { icon: Search, label: 'Lost parcels' },
                { icon: Clock, label: 'Delays in transit' },
                { icon: AlertTriangle, label: 'Damage after dispatch' },
                { icon: Truck, label: 'Courier failures' }
              ].map((item, idx) => (
                <motion.div key={idx} variants={staggerItem} className="bg-[#FAFAFA] border border-gray-100 rounded-xl p-6 text-center shadow-sm">
                  <item.icon className="w-6 h-6 text-[#8A001A] mx-auto mb-3" />
                  <span className="text-sm font-medium text-gray-800">{item.label}</span>
                </motion.div>
              ))}
            </motion.div>

            <div className="inline-flex flex-col md:flex-row items-center gap-4 text-gray-600 text-sm bg-[#FAFAFA] px-8 py-5 rounded-2xl border border-gray-100 shadow-sm w-full max-w-3xl">
              <span className="font-bold text-black uppercase tracking-widest text-xs shrink-0 bg-white border border-gray-200 px-3 py-1.5 rounded-md">Action Required</span>
              <span className="text-left font-light leading-relaxed">Contact the courier service directly using the provided tracking details. We will support wherever possible with tracking assistance.</span>
            </div>
          </RevealSection>
        </div>
      </section>

      {/* ═══════ UNBOXING & CLAIMS ═══════ */}
      <section className="relative py-24 md:py-36 bg-[#FAFAFA] overflow-hidden text-center border-y border-black/5">
        <div className="max-w-7xl mx-auto px-4 md:px-16 relative z-10">
          <RevealSection className="mb-16">
            <p className="text-[#8A001A] text-xs font-bold uppercase tracking-[0.3em] mb-4">Claims</p>
            <h2 className="text-4xl md:text-6xl font-perandory text-black uppercase tracking-tight mb-6">Unboxing Evidence</h2>
            <p className="text-gray-600 text-lg font-light max-w-2xl mx-auto">
              In case of any issue with a delivered product, customers must provide proper unboxing evidence to process a claim.
            </p>
          </RevealSection>

          <motion.div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16" variants={staggerContainer} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-50px' }}>
            {[
              { icon: Camera, title: 'Unboxing Video', desc: 'A clear video of the package being opened' },
              { icon: Video, title: 'Continuous Recording', desc: 'Without cuts or edits from start to finish' },
              { icon: Search, title: 'Proof of Issue', desc: 'Issue must be clearly shown in the video' }
            ].map((item, idx) => (
              <motion.div key={idx} variants={staggerItem} className="bg-white border border-gray-100 shadow-sm rounded-3xl p-10 hover:shadow-xl hover:-translate-y-2 transition-all duration-500 group">
                <div className="w-16 h-16 rounded-2xl bg-[#FAFAFA] border border-gray-100 shadow-sm flex items-center justify-center mx-auto mb-6 group-hover:bg-[#8A001A] group-hover:border-[#8A001A] transition-colors">
                  <item.icon className="w-8 h-8 text-[#8A001A] group-hover:text-white transition-colors" />
                </div>
                <h4 className="font-perandory text-xl text-black uppercase tracking-wider mb-3">{item.title}</h4>
                <p className="text-sm text-gray-600 font-light">{item.desc}</p>
              </motion.div>
            ))}
          </motion.div>

          <RevealSection delay={0.4}>
            <p className="text-sm text-gray-800 font-medium bg-white inline-block px-6 py-3 rounded-xl border border-gray-100 shadow-sm">Claims raised without proper unboxing evidence may not be accepted.</p>
          </RevealSection>
        </div>
      </section>
      {/* ═══════ COPYRIGHT & IMAGE USAGE ═══════ */}
      <RevealSection>
        <section className="py-24 md:py-32 bg-[#FAFAF8] relative z-10">
          <div className="max-w-3xl mx-auto px-6 md:px-12">
            
            <div className="mb-16 text-center">
              <Info className="w-8 h-8 text-[#8A001A] mx-auto mb-6 opacity-80" />
              <h2 className="text-3xl md:text-4xl font-perandory text-[#1a1a1a] tracking-tight mb-6">Copyright & Image Usage Notice</h2>
              <p className="text-[#1a1a1a]/60 text-base md:text-lg leading-[1.9] font-light">
                We love sharing beautiful aesthetics, fashion inspiration, and curated finds with our community. To maintain transparency, we want to be clear about where our visual content comes from.
              </p>
            </div>

            <div className="space-y-8">
              {/* Sourcing */}
              <div className="bg-white border border-neutral-200 rounded-2xl p-8 md:p-10 shadow-sm relative overflow-hidden group hover:border-[#8A001A]/30 transition-colors">
                <div className="absolute top-0 right-0 w-24 h-24 bg-neutral-50 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none group-hover:bg-[#8A001A]/5 transition-colors"></div>
                <h3 className="text-sm font-bold tracking-[0.2em] uppercase text-[#8A001A] mb-4">Content Sourcing</h3>
                <p className="text-[#1a1a1a]/70 text-base leading-[1.8] font-light">
                  The images, product photos, references, and other visual content displayed on our website may be sourced from our suppliers, manufacturers, customers, publicly available references, or third-party sources. They are not necessarily our own original product shoots unless explicitly stated.
                </p>
              </div>

              {/* Original Content */}
              <div className="bg-white border border-neutral-200 rounded-2xl p-8 md:p-10 shadow-sm relative overflow-hidden group hover:border-[#8A001A]/30 transition-colors">
                <div className="absolute top-0 right-0 w-24 h-24 bg-neutral-50 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none group-hover:bg-[#8A001A]/5 transition-colors"></div>
                <h3 className="text-sm font-bold tracking-[0.2em] uppercase text-[#8A001A] mb-4">Our Original Content</h3>
                <p className="text-[#1a1a1a]/70 text-base leading-[1.8] font-light">
                  When an image has been created, styled, or photographed originally by the House of Avira team, it will be clearly identified, credited, or watermarked accordingly to show it as our own authentic work.
                </p>
              </div>

              {/* Removal/Credit Requests */}
              <div className="bg-[#0A0A0A] border border-[#1a1a1a] rounded-2xl p-8 md:p-10 shadow-lg relative overflow-hidden text-white mt-12">
                <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,0.1) 10px, rgba(255,255,255,0.1) 11px)' }} />
                
                <h3 className="text-lg md:text-xl font-perandory text-white mb-4 relative z-10">Content Removal & Credit Requests</h3>
                <p className="text-white/70 text-base leading-[1.8] font-light mb-8 relative z-10">
                  We deeply respect the creative work of photographers, brands, and creators. If any individual, copyright owner, or creator finds their image or content on our website and would like it to be appropriately credited, modified, or removed entirely, please reach out to us directly. 
                  <br/><br/>
                  Upon receiving a valid request, we will review it promptly and take the appropriate action without any hassle.
                </p>

                <div className="relative z-10 flex flex-col sm:flex-row gap-4 pt-6 border-t border-white/10">
                  <a href="mailto:houseofavira@gmail.com" className="flex items-center gap-3 bg-white/5 hover:bg-white/10 border border-white/10 px-5 py-3 rounded-xl transition-colors">
                    <Mail className="w-5 h-5 text-white/60" />
                    <div className="flex flex-col">
                      <span className="text-[10px] text-white/50 uppercase tracking-widest font-bold">Email Us</span>
                      <span className="text-sm text-white">houseofavira@gmail.com</span>
                    </div>
                  </a>
                  
                  <a href="https://wa.me/919986742779" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 bg-[#8A001A]/20 hover:bg-[#8A001A]/30 border border-[#8A001A]/30 px-5 py-3 rounded-xl transition-colors">
                    <MessageCircle className="w-5 h-5 text-[#8A001A]" />
                    <div className="flex flex-col">
                      <span className="text-[10px] text-[#8A001A]/70 uppercase tracking-widest font-bold">WhatsApp</span>
                      <span className="text-sm text-white">+91 9986742779</span>
                    </div>
                  </a>
                </div>
              </div>
            </div>
            
          </div>
        </section>
      </RevealSection>


      {/* ═══════ FINAL NOTE ═══════ */}
      <section className="relative py-24 md:py-36 bg-black text-white text-center overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 40px, rgba(255,255,255,0.1) 40px, rgba(255,255,255,0.1) 41px)' }} />
        <div className="max-w-4xl mx-auto px-4 md:px-16 relative z-10">
          <RevealSection>
            <div className="w-20 h-20 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-10">
              <CheckCircle2 className="w-10 h-10 text-[#8A001A]" />
            </div>
            <h2 className="text-5xl md:text-7xl font-perandory uppercase tracking-tight mb-8">Final Note</h2>
            <div className="space-y-6 text-white/60 text-lg md:text-xl font-light max-w-2xl mx-auto mb-16">
              <p>We value transparency and customer trust above everything else.</p>
              <p>Every order goes through multiple stages including sourcing, international shipping, customs clearance, and domestic delivery.</p>
            </div>
          </RevealSection>

          <RevealSection delay={0.2}>
            <div className="bg-[#111] border border-white/10 rounded-2xl p-10 md:p-14 text-left max-w-2xl mx-auto shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#8A001A] to-transparent" />
              <p className="text-[11px] font-bold tracking-[0.3em] uppercase text-[#8A001A] mb-8 text-center">Place an order only if comfortable with</p>
              <div className="space-y-4">
                {['Pre-order processing timelines', 'Variable shipping costs', 'Customs charges', 'Possible delays due to external factors'].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-4 border-b border-white/5 pb-4 last:border-0 last:pb-0">
                    <CheckCircle2 className="w-5 h-5 text-[#8A001A] shrink-0" />
                    <span className="text-white/80 font-medium">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </RevealSection>

          <RevealSection delay={0.4}>
            <p className="text-sm text-white/40 mt-16 mb-4 uppercase tracking-widest font-bold">
              By placing an order, you confirm that you have read and agreed to all policies.
            </p>
            <p className="font-aston-script text-[#c4a87c] text-3xl md:text-5xl mt-6">
              Thank you for trusting House of Avira
            </p>
          </RevealSection>
        </div>
      </section>

      {/* ═══════ NAVIGATION ═══════ */}
      <section className="bg-[#111] py-10 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 md:px-16 flex justify-between items-center">
          <motion.div whileHover={{ x: -4 }} transition={{ duration: 0.2 }}>
            <Link href="/order-info/shipping" className="flex items-center gap-3 text-white/30 hover:text-white/60 transition-colors text-[10px] font-bold tracking-[0.2em] uppercase">
              <ArrowLeft className="w-4 h-4" />
              Shipping & Delivery
            </Link>
          </motion.div>
          <motion.div whileHover={{ x: 4 }} transition={{ duration: 0.2 }}>
            <Link href="/order-info" className="flex items-center gap-3 text-[#8A001A] hover:text-[#c4002a] transition-colors text-[10px] font-bold tracking-[0.2em] uppercase">
              Back to Overview
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
