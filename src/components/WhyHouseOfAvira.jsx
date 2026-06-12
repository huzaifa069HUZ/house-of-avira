'use client';

import { motion } from 'framer-motion';
import { Plane, Truck, Package, CreditCard, Globe, ShieldCheck } from 'lucide-react';

export default function WhyHouseOfAvira() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
  };

  const lineVariants = {
    hidden: { scaleX: 0, originX: 0 },
    visible: { scaleX: 1, transition: { duration: 1.5, ease: 'easeInOut' } }
  };
  
  const lineVerticalVariants = {
    hidden: { scaleY: 0, originY: 0 },
    visible: { scaleY: 1, transition: { duration: 1.5, ease: 'easeInOut' } }
  };

  return (
    <section className="w-full bg-[#FAFAFA] py-24 md:py-32 overflow-hidden border-t border-[#000000]/10">
      <motion.div 
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
      >
        {/* Header Section */}
        <motion.div className="text-center mb-20 md:mb-28" variants={itemVariants}>
          <h2 className="text-4xl md:text-6xl font-perandory font-bold tracking-widest text-[#8A001A] uppercase mb-4">
            Why House of Avira
          </h2>
          <p className="text-3xl md:text-5xl text-[#000000] font-symphony lowercase">
            premium pinterest aesthetics, delivered directly.
          </p>
        </motion.div>

        {/* Business Model Explanation */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-32">
          <motion.div className="order-2 md:order-1 relative h-[500px] w-full rounded-2xl overflow-hidden group shadow-2xl" variants={itemVariants}>
             <img src="/fashion.png" alt="Pinterest Ready Styles" className="w-full h-full object-cover transition-transform duration-[2000ms] group-hover:scale-105" />
             <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-500"></div>
             <div className="absolute bottom-6 left-6 right-6 bg-white/90 backdrop-blur-md p-6 rounded-xl border border-white/50 shadow-xl">
               <h3 className="text-lg font-serif font-bold text-[#000000] mb-2 uppercase tracking-wide">Direct from Global Makers</h3>
               <p className="text-sm text-[#000000]/70 leading-relaxed font-sans">
                 We skip the middlemen, massive warehouse fees, and local markups. By connecting you directly with premium international suppliers, you get identical high-quality aesthetic pieces at a fraction of the cost.
               </p>
             </div>
          </motion.div>

          <motion.div className="order-1 md:order-2 space-y-10" variants={containerVariants}>
            <motion.div variants={itemVariants} className="flex gap-5">
              <div className="w-12 h-12 rounded-full bg-[#8A001A]/10 flex items-center justify-center shrink-0 mt-1">
                <Globe className="w-6 h-6 text-[#8A001A]" />
              </div>
              <div>
                <h4 className="text-xl font-bold font-sans tracking-tight text-[#000000] mb-2">Curated Global Aesthetics</h4>
                <p className="text-[#000000]/60 font-sans leading-relaxed">
                  Our team constantly scours international markets to find the most viral, Pinterest-worthy, and high-quality items before they even hit local stores.
                </p>
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="flex gap-5">
              <div className="w-12 h-12 rounded-full bg-[#000000]/5 flex items-center justify-center shrink-0 mt-1">
                <ShieldCheck className="w-6 h-6 text-[#000000]" />
              </div>
              <div>
                <h4 className="text-xl font-bold font-sans tracking-tight text-[#000000] mb-2">Uncompromised Quality</h4>
                <p className="text-[#000000]/60 font-sans leading-relaxed">
                  We don't do cheap knockoffs. We partner with the same manufacturers that supply high-end boutiques globally to ensure premium fabrics and flawless stitching.
                </p>
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="flex gap-5">
              <div className="w-12 h-12 rounded-full bg-[#8A001A]/10 flex items-center justify-center shrink-0 mt-1">
                <Package className="w-6 h-6 text-[#8A001A]" />
              </div>
              <div>
                <h4 className="text-xl font-bold font-sans tracking-tight text-[#000000] mb-2">Delivered to Your Doorstep</h4>
                <p className="text-[#000000]/60 font-sans leading-relaxed">
                  We handle the complex international logistics, customs clearance, and domestic routing. You just sit back and wait for your package.
                </p>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Three Stage Pricing Header */}
        <motion.div className="text-center mb-16" variants={itemVariants}>
          <h3 className="text-3xl md:text-4xl font-serif font-bold text-[#000000] mb-4">
            Transparent 3-Stage Pricing
          </h3>
          <p className="max-w-2xl mx-auto text-[#000000]/60 font-sans">
            Because we ship directly to you internationally, we separate the product cost from the shipping and duties. This ensures you only pay for exactly what you get.
          </p>
        </motion.div>

        {/* Three Stage Pricing Graph */}
        <motion.div className="relative" variants={containerVariants}>
          
          {/* Desktop Layout (Horizontal) */}
          <div className="hidden md:flex justify-between relative">
            {/* Connecting Line */}
            <div className="absolute top-12 left-[10%] right-[10%] h-0.5 bg-gray-200 -z-10">
               <motion.div className="h-full bg-[#8A001A]" variants={lineVariants} />
            </div>

            {/* Stage 1 */}
            <motion.div className="flex flex-col items-center text-center w-1/3 px-4 relative" variants={itemVariants}>
              <div className="w-24 h-24 rounded-full bg-white border-4 border-[#000000] flex items-center justify-center shadow-lg mb-6 z-10">
                <CreditCard className="w-10 h-10 text-[#000000]" />
              </div>
              <div className="bg-[#000000] text-white text-[10px] uppercase tracking-widest font-bold px-3 py-1 rounded-full mb-4">
                Pay Now
              </div>
              <h4 className="text-xl font-bold text-[#000000] mb-3">1. Fixed Product Price</h4>
              <p className="text-sm text-[#000000]/70">
                You pay only the transparent cost of the items at checkout today.
              </p>
            </motion.div>

            {/* Stage 2 */}
            <motion.div className="flex flex-col items-center text-center w-1/3 px-4 relative" variants={itemVariants}>
              <div className="w-24 h-24 rounded-full bg-white border-4 border-[#8A001A] flex items-center justify-center shadow-lg mb-6 z-10">
                <Plane className="w-10 h-10 text-[#8A001A]" />
              </div>
              <div className="bg-[#8A001A] text-white text-[10px] uppercase tracking-widest font-bold px-3 py-1 rounded-full mb-4">
                Billed Later
              </div>
              <h4 className="text-xl font-bold text-[#8A001A] mb-3">2. Int'l Shipping & Duty</h4>
              <p className="text-sm text-[#000000]/70">
                Once items arrive at our hub, we calculate the exact customs and international freight to your address.
              </p>
            </motion.div>

            {/* Stage 3 */}
            <motion.div className="flex flex-col items-center text-center w-1/3 px-4 relative" variants={itemVariants}>
              <div className="w-24 h-24 rounded-full bg-[#FAFAFA] border-4 border-[#000000] flex items-center justify-center shadow-lg mb-6 z-10">
                <Truck className="w-10 h-10 text-[#000000]" />
              </div>
              <div className="bg-gray-200 text-[#000000] text-[10px] uppercase tracking-widest font-bold px-3 py-1 rounded-full mb-4">
                Delivery
              </div>
              <h4 className="text-xl font-bold text-[#000000] mb-3">3. Doorstep Arrival</h4>
              <p className="text-sm text-[#000000]/70">
                After the final balance is cleared, we dispatch it locally straight to your hands via premium couriers.
              </p>
            </motion.div>
          </div>

          {/* Mobile Layout (Vertical) */}
          <div className="flex md:hidden flex-col gap-12 relative pl-8">
            {/* Connecting Vertical Line */}
            <div className="absolute top-4 bottom-4 left-[60px] w-0.5 bg-gray-200 -z-10">
              <motion.div className="w-full bg-[#8A001A]" variants={lineVerticalVariants} />
            </div>

            {/* Stage 1 */}
            <motion.div className="flex items-start gap-6 relative" variants={itemVariants}>
              <div className="w-14 h-14 rounded-full bg-white border-4 border-[#000000] flex items-center justify-center shadow-md shrink-0 z-10">
                <CreditCard className="w-6 h-6 text-[#000000]" />
              </div>
              <div>
                <div className="inline-block bg-[#000000] text-white text-[9px] uppercase tracking-widest font-bold px-2 py-0.5 rounded-full mb-2">
                  Pay Now
                </div>
                <h4 className="text-lg font-bold text-[#000000] mb-2">1. Fixed Product Price</h4>
                <p className="text-sm text-[#000000]/70">
                  You pay only the transparent cost of the items at checkout today.
                </p>
              </div>
            </motion.div>

            {/* Stage 2 */}
            <motion.div className="flex items-start gap-6 relative" variants={itemVariants}>
              <div className="w-14 h-14 rounded-full bg-white border-4 border-[#8A001A] flex items-center justify-center shadow-md shrink-0 z-10">
                <Plane className="w-6 h-6 text-[#8A001A]" />
              </div>
              <div>
                <div className="inline-block bg-[#8A001A] text-white text-[9px] uppercase tracking-widest font-bold px-2 py-0.5 rounded-full mb-2">
                  Billed Later
                </div>
                <h4 className="text-lg font-bold text-[#8A001A] mb-2">2. Int'l Shipping & Duty</h4>
                <p className="text-sm text-[#000000]/70">
                  Exact customs and international freight billed when it reaches our hub.
                </p>
              </div>
            </motion.div>

            {/* Stage 3 */}
            <motion.div className="flex items-start gap-6 relative" variants={itemVariants}>
              <div className="w-14 h-14 rounded-full bg-[#FAFAFA] border-4 border-[#000000] flex items-center justify-center shadow-md shrink-0 z-10">
                <Truck className="w-6 h-6 text-[#000000]" />
              </div>
              <div>
                <div className="inline-block bg-gray-200 text-[#000000] text-[9px] uppercase tracking-widest font-bold px-2 py-0.5 rounded-full mb-2">
                  Delivery
                </div>
                <h4 className="text-lg font-bold text-[#000000] mb-2">3. Doorstep Arrival</h4>
                <p className="text-sm text-[#000000]/70">
                  Locally dispatched straight to your hands via premium couriers.
                </p>
              </div>
            </motion.div>
          </div>
        </motion.div>

      </motion.div>
    </section>
  );
}
