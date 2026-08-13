'use client';

import Link from 'next/link';
import { useRef } from 'react';
import { motion, useScroll, useInView, useSpring } from 'framer-motion';
import { ArrowLeft, ShieldCheck, Lock, Eye, Database, Globe, Mail } from 'lucide-react';

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

export default function PrivacyPolicyPage() {
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

      {/* ═══════ HERO ═══════ */}
      <section className="relative min-h-[50vh] flex items-end overflow-hidden pt-24 bg-[#0A0A0A]">
        <div className="absolute inset-0">
          <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 80px, rgba(255,255,255,0.08) 80px, rgba(255,255,255,0.08) 81px), repeating-linear-gradient(90deg, transparent, transparent 80px, rgba(255,255,255,0.08) 80px, rgba(255,255,255,0.08) 81px)' }} />
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full" style={{ background: 'radial-gradient(circle, rgba(138,0,26,0.1) 0%, transparent 70%)' }} />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-16 pb-16 md:pb-20 w-full">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <Link href="/" className="inline-flex items-center gap-3 text-white/50 hover:text-white transition-colors text-[10px] tracking-[0.25em] uppercase font-bold mb-12 group">
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              Back to Home
            </Link>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="flex items-center gap-3 mb-6">
            <div className="w-2 h-2 rounded-full bg-[#8A001A] animate-pulse" />
            <span className="text-[11px] font-bold tracking-[0.4em] uppercase text-[#8A001A]">Legal & Privacy</span>
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="text-4xl sm:text-5xl md:text-7xl lg:text-[7rem] font-perandory text-white uppercase tracking-tight leading-[1.1] md:leading-[0.95]">
            Privacy <br/><span className="text-[#8A001A] font-aston-script lowercase text-5xl sm:text-6xl md:text-8xl tracking-normal">Policy</span>
          </motion.h1>
        </div>
      </section>

      {/* ═══════ INTRODUCTION ═══════ */}
      <section className="relative py-24 md:py-36 bg-white overflow-hidden">
        <div className="absolute top-0 right-0 text-[15rem] md:text-[25rem] font-perandory text-black/[0.02] leading-none select-none pointer-events-none -translate-y-1/4">01</div>
        <div className="max-w-7xl mx-auto px-4 md:px-16 relative z-10">
          <RevealSection>
            <p className="text-[#8A001A] text-xs font-bold uppercase tracking-[0.3em] mb-4">Introduction</p>
            <h2 className="text-4xl md:text-6xl font-perandory text-black uppercase tracking-tight mb-8">Who We Are</h2>
          </RevealSection>
          
          <RevealLine className="mb-12" />

          <RevealSection delay={0.1}>
            <div className="max-w-3xl space-y-6 text-gray-600 text-lg md:text-xl font-light leading-relaxed">
              <p>Welcome to House of Avira. We value your privacy and are committed to protecting your personal data. This privacy policy explains how we look after your personal data when you visit our website (regardless of where you visit it from) and tells you about your privacy rights and how the law protects you.</p>
              <p>Please note that House of Avira operates exclusively within India. While we source our imported Pinterest-finds internationally from global suppliers, our services, deliveries, and legal jurisdiction are strictly confined to the borders of the Republic of India.</p>
            </div>
          </RevealSection>
        </div>
      </section>

      {/* ═══════ WHAT WE COLLECT ═══════ */}
      <section className="relative py-24 md:py-36 bg-[#FAFAFA] overflow-hidden">
        <div className="absolute top-0 right-0 text-[15rem] md:text-[25rem] font-perandory text-black/[0.02] leading-none select-none pointer-events-none -translate-y-1/4">02</div>
        <div className="max-w-7xl mx-auto px-4 md:px-16 relative z-10">
          <RevealSection>
            <p className="text-[#8A001A] text-xs font-bold uppercase tracking-[0.3em] mb-4">Data Collection</p>
            <h2 className="text-4xl md:text-6xl font-perandory text-black uppercase tracking-tight mb-8">What We Collect</h2>
          </RevealSection>
          
          <RevealLine className="mb-12" />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <RevealSection delay={0.1} className="bg-white p-8 border border-neutral-200 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
              <div className="w-12 h-12 rounded-full bg-[#8A001A]/10 flex items-center justify-center mb-6">
                <Database className="w-6 h-6 text-[#8A001A]" />
              </div>
              <h3 className="text-2xl font-perandory uppercase tracking-tight text-black mb-4">Personal Data</h3>
              <p className="text-gray-500 font-light leading-relaxed">To successfully process your international pre-orders and deliver them to your doorstep in India, we collect:</p>
              <ul className="mt-4 space-y-2 text-gray-500 font-light list-disc pl-5 marker:text-[#8A001A]">
                <li><strong className="text-black font-medium">Identity Data:</strong> Full name, username, or similar identifier.</li>
                <li><strong className="text-black font-medium">Contact Data:</strong> Delivery address within India, billing address, email address, and telephone numbers.</li>
              </ul>
            </RevealSection>
            
            <RevealSection delay={0.2} className="bg-white p-8 border border-neutral-200 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
              <div className="w-12 h-12 rounded-full bg-[#8A001A]/10 flex items-center justify-center mb-6">
                <Lock className="w-6 h-6 text-[#8A001A]" />
              </div>
              <h3 className="text-2xl font-perandory uppercase tracking-tight text-black mb-4">Financial Data</h3>
              <p className="text-gray-500 font-light leading-relaxed">We take your financial security very seriously.</p>
              <ul className="mt-4 space-y-2 text-gray-500 font-light list-disc pl-5 marker:text-[#8A001A]">
                <li><strong className="text-black font-medium">Payment Data:</strong> Details about payments to and from you, and other details of products you have purchased from us.</li>
                <li><strong className="text-black font-medium">Card Security:</strong> We do <span className="font-bold underline decoration-[#8A001A]">not</span> store your credit/debit card details on our servers. All payments are securely processed by third-party PCI-compliant payment gateways (e.g., Razorpay).</li>
              </ul>
            </RevealSection>
          </div>
        </div>
      </section>

      {/* ═══════ HOW WE USE YOUR DATA ═══════ */}
      <section className="relative py-24 md:py-36 bg-white overflow-hidden">
        <div className="absolute top-0 right-0 text-[15rem] md:text-[25rem] font-perandory text-black/[0.02] leading-none select-none pointer-events-none -translate-y-1/4">03</div>
        <div className="max-w-7xl mx-auto px-4 md:px-16 relative z-10">
          <RevealSection>
            <p className="text-[#8A001A] text-xs font-bold uppercase tracking-[0.3em] mb-4">Data Processing</p>
            <h2 className="text-4xl md:text-6xl font-perandory text-black uppercase tracking-tight mb-8">How We Use Your Data</h2>
          </RevealSection>
          
          <RevealLine className="mb-12" />

          <RevealSection delay={0.1}>
            <div className="max-w-3xl space-y-6 text-gray-600 text-lg md:text-xl font-light leading-relaxed mb-12">
              <p>Because our business involves sourcing goods internationally on a pre-order basis and bringing them into India, your data is essential for navigating logistics, customs, and final-mile delivery.</p>
            </div>
          </RevealSection>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 border-t border-neutral-100 pt-12">
            {[
              { icon: Globe, title: "International Sourcing", desc: "To process your pre-order with our foreign suppliers and manage international logistics effectively." },
              { icon: ShieldCheck, title: "Customs Clearance", desc: "To legally clear imported goods through Indian Customs on their way to you, as required by law." },
              { icon: Eye, title: "Order Tracking", desc: "To provide you with accurate, real-time updates as your package moves from overseas to your doorstep." }
            ].map((item, i) => (
              <RevealSection key={i} delay={0.2 + (i * 0.1)} className="p-8 border border-neutral-100 bg-[#FAFAFA] rounded-2xl hover:border-[#8A001A]/30 transition-colors">
                <item.icon className="w-8 h-8 text-[#8A001A] mb-6" />
                <h3 className="text-xl font-bold uppercase tracking-tight text-black mb-3">{item.title}</h3>
                <p className="text-sm text-neutral-500 leading-relaxed">{item.desc}</p>
              </RevealSection>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ DATA SHARING & CONTACT ═══════ */}
      <section className="relative py-24 md:py-36 bg-[#111111] overflow-hidden text-white">
        <div className="absolute top-0 right-0 text-[15rem] md:text-[25rem] font-perandory text-white/[0.02] leading-none select-none pointer-events-none -translate-y-1/4">04</div>
        <div className="max-w-7xl mx-auto px-4 md:px-16 relative z-10">
          <RevealSection>
            <p className="text-[#8A001A] text-xs font-bold uppercase tracking-[0.3em] mb-4">Transparency</p>
            <h2 className="text-4xl md:text-6xl font-perandory uppercase tracking-tight mb-8">Data Sharing & Security</h2>
          </RevealSection>
          
          <RevealLine className="mb-12" />

          <RevealSection delay={0.1}>
             <div className="max-w-4xl space-y-6 text-gray-300 text-lg font-light leading-relaxed mb-16">
              <p>We do not sell your personal data. We only share your data with trusted third parties strictly necessary to fulfill your order, including:</p>
              <ul className="list-disc pl-5 space-y-2 marker:text-[#8A001A]">
                <li><strong className="text-white font-medium">Logistics Partners:</strong> International freight forwarders, Indian customs brokers, and domestic couriers (e.g., Shiprocket, Delhivery, BlueDart) to deliver your items.</li>
                <li><strong className="text-white font-medium">Payment Processors:</strong> To securely process your transactions (e.g., Razorpay).</li>
                <li><strong className="text-white font-medium">Legal Authorities:</strong> If required by Indian law or customs regulations for importing goods.</li>
              </ul>
              <p className="pt-4">We have put in place appropriate security measures to prevent your personal data from being accidentally lost, used, or accessed in an unauthorized way, altered, or disclosed.</p>
            </div>
          </RevealSection>
          
          {/* Contact Box */}
          <RevealSection delay={0.2}>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-8 md:p-12 backdrop-blur-md">
              <h3 className="text-3xl font-perandory uppercase tracking-tight mb-4">Contact Us</h3>
              <p className="text-gray-400 font-light mb-8 max-w-2xl">If you have any questions about this privacy policy or our privacy practices, please contact our data privacy manager in the following ways:</p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <a href="mailto:houseofavira@gmail.com" className="flex items-center gap-4 bg-white text-black px-8 py-4 rounded-full font-bold hover:bg-[#8A001A] hover:text-white transition-colors duration-300 group">
                  <Mail className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  houseofavira@gmail.com
                </a>
              </div>
            </div>
          </RevealSection>
        </div>
      </section>
      
    </div>
  );
}
