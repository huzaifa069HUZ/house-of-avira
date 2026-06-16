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

        {/* Two Stage Pricing Header */}
        <motion.div className="text-center mb-16" variants={itemVariants}>
          <h3 className="text-4xl md:text-5xl lg:text-6xl font-perandory font-bold text-[#000000] mb-4">
            Two-Stage <span className="font-aston-script text-5xl md:text-6xl lg:text-7xl text-[#8A001A] lowercase tracking-normal font-normal">Pricing</span>
          </h3>
          <p className="max-w-3xl mx-auto text-[#000000] text-lg md:text-xl font-medium tracking-wide" style={{ fontFamily: "var(--font-dm-sans), sans-serif" }}>
            We only take two payments: one is the product price which you pay on the website while ordering, and the other is the SHIPPING + DELIVERY CHARGES.
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
