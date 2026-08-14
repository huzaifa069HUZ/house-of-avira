'use client';

import Link from 'next/link';
import { useRef, useState } from 'react';
import { motion, useScroll, useInView, useSpring, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Globe, Package, Plane, ShoppingBag, Truck, ChevronDown, CheckCircle2 } from 'lucide-react';

/* ─── Reveal on scroll wrapper ─── */
function RevealSection({ children, className = '', delay = 0 }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });
  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] }}
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
      className={`h-px bg-[#8A001A]/20 ${className}`}
      initial={{ scaleX: 0 }}
      animate={isInView ? { scaleX: 1 } : {}}
      transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
      style={{ originX: 0 }}
    />
  );
}

/* ─── FAQ Accordion Item ─── */
function FaqItem({ question, answer }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border-b border-neutral-200">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full text-left py-6 flex justify-between items-center focus:outline-none group"
      >
        <span className="font-perandory text-xl md:text-2xl text-black pr-8 group-hover:text-[#8A001A] transition-colors">{question}</span>
        <ChevronDown className={`w-5 h-5 text-[#8A001A] transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <p className="pb-6 text-neutral-600 font-light leading-relaxed text-base md:text-lg">
              {answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function HowItWorksPage() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ['start start', 'end end'] });
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

  const faqs = [
    {
      question: "Why isn't shipping included in the product price?",
      answer: `Shipping charges are kept separate because they are not controlled by us and can fluctuate based on factors such as your location, package weight, dimensions, carrier rates, customs, and other applicable charges.

(We’ve explained this in more detail on that “Shipping & Charges” page — please link this section to that page.)

While we may provide an estimated shipping calculator for reference, the final amount can only be confirmed once the actual shipment is processed. We cannot guarantee an exact shipping cost beforehand.

Including a fluctuating shipping cost in the product MRP would mean constantly changing our product prices, which would create confusion for both us and our customers. That is why we clearly display the product price and shipping charges separately.`
    },
    {
      question: "Can I cancel my order if shipping is too high?",
      answer: `We completely understand that shipping costs can sometimes be higher than expected. This is exactly why we’ve explained the entire shipping process clearly and included the relevant information on every product page. We kindly ask you to read through these details before placing an order and proceed only if you’re comfortable with the process.

Shipping costs are determined by several factors that are outside our control, including package weight and dimensions, shipping rates, customs clearance, duties, taxes, the type of product, and other applicable charges. A complete breakdown of the applicable charges will be provided when the shipping amount is confirmed.

Since these charges are determined by external shipping and customs processes and are not set by us, orders cannot be cancelled solely because the final shipping cost is higher than expected once the order has been placed.

We want everything to be as transparent as possible.`
    },
    {
      question: "How long does delivery usually take?",
      answer: "Delivery timelines are estimates. Generally, it takes 3-4 weeks for the supplier to dispatch the batch, another 2-3 weeks for international transit and customs clearance, and finally 3-7 days for domestic delivery within India. Please expect a total wait time of 6-10 weeks."
    },
    {
      question: "How will I know when to pay for shipping?",
      answer: "You will receive an email and a WhatsApp notification (if provided) when your items arrive at our international hub (for international shipping) and again when they clear customs in India (for domestic shipping). You can pay these securely via the links provided."
    }
  ];

  return (
    <div ref={containerRef} className="relative bg-[#FAFAFA] text-[#1a1a1a] overflow-hidden" style={{ fontFamily: 'var(--font-dm-sans), sans-serif' }}>

      {/* ═══ PROGRESS BAR ═══ */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-[3px] bg-[#8A001A] z-[9999] origin-left"
        style={{ scaleX }}
      />

      {/* ═══════ HERO ═══════ */}
      <section className="relative min-h-[60vh] flex flex-col justify-center overflow-hidden pt-32 pb-16 bg-white">
        <div className="absolute inset-0 pointer-events-none opacity-[0.02]" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, black 1px, transparent 0)', backgroundSize: '32px 32px' }} />
        <div className="max-w-7xl mx-auto px-4 md:px-16 w-full relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <Link href="/" className="inline-flex items-center gap-3 text-neutral-400 hover:text-black transition-colors text-xs tracking-[0.2em] uppercase font-bold mb-12 group">
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              Back to Home
            </Link>
          </motion.div>

          <div className="max-w-4xl">
            <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="text-5xl md:text-7xl lg:text-[6rem] font-perandory text-black uppercase tracking-tight leading-[0.95] mb-6">
              The Avira <span className="text-[#8A001A] font-aston-script lowercase text-6xl md:text-8xl tracking-normal">Experience</span>
            </motion.h1>
            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="text-neutral-500 text-lg md:text-xl font-light leading-relaxed max-w-2xl">
              An in-depth guide to our international preorder model. Discover exactly how we source, ship, and deliver global aesthetics straight to your door in India.
            </motion.p>
          </div>
        </div>
      </section>

      {/* ═══════ THE PREORDER MODEL EXPLAINED ═══════ */}
      <section className="py-24 md:py-32 bg-[#FAFAFA] relative border-t border-neutral-100">
        <div className="max-w-4xl mx-auto px-4 md:px-16">
          <RevealSection>
            <h2 className="text-4xl md:text-5xl font-perandory uppercase tracking-tight text-black mb-10">
              Understanding <span className="text-[#8A001A] font-aston-script lowercase text-5xl md:text-7xl tracking-normal relative top-2">Preorders</span>
            </h2>
            <div className="space-y-6 text-neutral-600 font-light text-lg md:text-xl leading-relaxed">
              <p>
                House of Avira operates strictly on an <strong className="font-medium text-black">international preorder basis</strong>. We do not hold local inventory in India. When you place an order with us, you are requesting us to source and import a specific aesthetic piece from our global network of suppliers on your behalf.
              </p>
              <p>
                Because these items cross international borders, the logistics are vastly different from standard domestic e-commerce. <strong className="font-medium text-black">This requires patience, understanding, and transparency.</strong>
              </p>
            </div>
          </RevealSection>
        </div>
      </section>

      {/* ═══════ THE 3-STEP JOURNEY ═══════ */}
      <section className="py-24 md:py-32 bg-white relative">
        <div className="max-w-7xl mx-auto px-4 md:px-16">
          <RevealSection className="mb-20 text-center">
            <h2 className="text-4xl md:text-5xl font-perandory uppercase tracking-tight text-black">
              The Ordering <span className="text-[#8A001A] font-aston-script lowercase text-5xl md:text-7xl tracking-normal relative top-2">Journey</span>
            </h2>
            <p className="text-neutral-500 mt-6 max-w-2xl mx-auto font-light text-lg">From the moment you click "Buy" to the moment it arrives at your doorstep, here is exactly what happens.</p>
          </RevealSection>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
            {/* Connecting line for desktop */}
            <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-px bg-neutral-200 z-0" />

            {/* STEP 1 */}
            <RevealSection delay={0.1} className="relative z-10 flex flex-col items-center text-center">
              <div className="w-24 h-24 rounded-full bg-[#FAFAFA] border border-neutral-200 flex items-center justify-center mb-8 text-[#8A001A] shadow-sm">
                <ShoppingBag strokeWidth={1.5} className="w-10 h-10" />
              </div>
              <h3 className="font-perandory text-2xl uppercase tracking-tight mb-4">1. Product Payment</h3>
              <p className="text-neutral-500 font-light leading-relaxed">
                You browse the catalogue and pay <strong className="text-black">only the product price</strong> upfront. During checkout, you must acknowledge that shipping will be billed later. Once paid, the order is locked in—no cancellations or refunds.
              </p>
            </RevealSection>

            {/* STEP 2 */}
            <RevealSection delay={0.2} className="relative z-10 flex flex-col items-center text-center">
              <div className="w-24 h-24 rounded-full bg-[#FAFAFA] border border-neutral-200 flex items-center justify-center mb-8 text-[#8A001A] shadow-sm">
                <Globe strokeWidth={1.5} className="w-10 h-10" />
              </div>
              <h3 className="font-perandory text-2xl uppercase tracking-tight mb-4">2. Int'l Shipping & Customs</h3>
              <p className="text-neutral-500 font-light leading-relaxed">
                Your item joins a batch. Once the batch arrives at our foreign hub, we calculate your share of the international freight and customs duties. You receive an invoice to pay this <strong className="text-black">International Shipping Charge</strong>.
              </p>
            </RevealSection>

            {/* STEP 3 */}
            <RevealSection delay={0.3} className="relative z-10 flex flex-col items-center text-center">
              <div className="w-24 h-24 rounded-full bg-[#FAFAFA] border border-neutral-200 flex items-center justify-center mb-8 text-[#8A001A] shadow-sm">
                <Truck strokeWidth={1.5} className="w-10 h-10" />
              </div>
              <h3 className="font-perandory text-2xl uppercase tracking-tight mb-4">3. Domestic Dispatch</h3>
              <p className="text-neutral-500 font-light leading-relaxed">
                The batch arrives in India and clears customs. Before we dispatch your specific item to your local address via India post, we pay the final <strong className="text-black">Domestic Delivery Charge</strong>. Your item is then delivered!
              </p>
            </RevealSection>
          </div>
        </div>
      </section>

      {/* ═══════ WHY IS SHIPPING SEPARATE? (KNOWLEDGE BASE) ═══════ */}
      <section className="py-24 md:py-32 bg-[#111111] text-white relative">
        <div className="max-w-4xl mx-auto px-4 md:px-16">
          <RevealSection className="mb-16">
            <h2 className="text-3xl md:text-5xl font-perandory uppercase tracking-tight text-white mb-6">
              The Two-Tier Shipping Model
            </h2>
            <RevealLine className="bg-white/20" />
          </RevealSection>

          <div className="space-y-12">
            <RevealSection delay={0.1}>
              <h3 className="text-xl md:text-2xl font-bold uppercase tracking-widest text-[#8A001A] mb-4 flex items-center gap-4">
                <CheckCircle2 className="w-6 h-6" /> Why we don't include shipping in the MRP
              </h3>
              <p className="text-neutral-400 font-light text-lg leading-relaxed pl-10 border-l border-[#8A001A]/30 ml-3">
                Shipping costs are charged separately from the product MRP because they vary depending on several factors. For domestic shipping, the cost mainly depends on your location, as well as the product’s weight and dimensions.

                For international shipping, there are additional factors such as customs clearance, duties, taxes, carrier charges, and other fluctuating costs. Since these charges can change frequently, including them in the product price would mean constantly changing our MRPs.

                Therefore, we keep the product price and shipping charges separate. Please note that shipping and related charges are not controlled by us and are paid directly to the respective shipping and logistics companies..
              </p>
            </RevealSection>

            <RevealSection delay={0.2}>
              <h3 className="text-xl md:text-2xl font-bold uppercase tracking-widest text-[#8A001A] mb-4 flex items-center gap-4">
                <Plane className="w-6 h-6" /> International Shipping (Leg 1)
              </h3>
              <p className="text-neutral-400 font-light text-lg leading-relaxed pl-10 border-l border-[#8A001A]/30 ml-3">
                This covers the entire process of getting your order from our international sourcing team to India. It includes the shipping and applicable taxes/charges involved on the international side, followed by customs clearance, import duties, taxes, and other applicable charges when the shipment arrives in India.

                Since these costs vary depending on the shipment, product, weight, dimensions, customs requirements, and current rates, they are charged separately from the product price.
              </p>
            </RevealSection>

            <RevealSection delay={0.3}>
              <h3 className="text-xl md:text-2xl font-bold uppercase tracking-widest text-[#8A001A] mb-4 flex items-center gap-4">
                <Package className="w-6 h-6" /> Domestic Shipping (Leg 2)
              </h3>
              <p className="text-neutral-400 font-light text-lg leading-relaxed pl-10 border-l border-[#8A001A]/30 ml-3">
                Domestic orders are primarily shipped through India Post, India’s government-operated postal service.

                Domestic shipping charges are calculated based on the shipment from our warehouse to your doorstep and may vary depending on your location, along with the weight and dimensions of your package.

                Once your order has been dispatched, tracking details and shipping updates will be shared through our Instagram Stories, WhatsApp GC, and SMS/email notifications, wherever applicable. Please make sure to check these channels for your tracking information and delivery updates.
              </p>
            </RevealSection>
          </div>
        </div>
      </section>

      {/* ═══════ FAQ SECTION ═══════ */}
      <section className="py-24 md:py-32 bg-white relative">
        <div className="max-w-4xl mx-auto px-4 md:px-16">
          <RevealSection className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-perandory uppercase tracking-tight text-black mb-4">
              Frequently Asked <span className="text-[#8A001A] font-aston-script lowercase text-5xl md:text-7xl tracking-normal relative top-2">Questions</span>
            </h2>
            <p className="text-neutral-500 font-light">Everything else you need to know.</p>
          </RevealSection>

          <RevealSection delay={0.2}>
            <div className="border-t border-neutral-200">
              {faqs.map((faq, idx) => (
                <FaqItem key={idx} question={faq.question} answer={faq.answer} />
              ))}
            </div>
          </RevealSection>

          <RevealSection delay={0.3} className="mt-16 text-center">
            <p className="text-neutral-500 font-light mb-6">Still have questions about how Avira works?</p>
            <a href="mailto:houseofavira@gmail.com" className="inline-block border border-black text-black px-8 py-3 rounded-full uppercase tracking-widest text-xs font-bold hover:bg-black hover:text-white transition-colors">
              Contact Support
            </a>
          </RevealSection>
        </div>
      </section>

    </div>
  );
}
