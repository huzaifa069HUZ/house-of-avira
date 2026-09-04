'use client';
import { ShoppingBag, Globe, Warehouse, Truck, Plane } from 'lucide-react';

export default function OrderJourneyTimeline() {
  const steps = [
    { icon: ShoppingBag, title: "Order Collection", desc: "" },
    { icon: Globe, title: "Intl. Freight", desc: "& Custom Clearance" },
    { icon: Warehouse, title: "Domestic Hub", desc: "Arrives at our India warehouse & we pack it" },
    { icon: Truck, title: "Delivery", desc: "Shipped to your doorstep in India" }
  ];

  return (
    <div className="relative w-full mt-6 lg:mt-0 mb-8 rounded-[2rem] p-6 lg:p-8 border border-neutral-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-white/50">
      
      {/* Background Image Gradient */}
      <div className="absolute inset-0 rounded-[2rem] overflow-hidden pointer-events-none">
        <img src="/shipping-bg-product-page.webp" alt="" className="w-full h-full object-cover opacity-[0.15]" />
      </div>

      <div className="relative z-10">
        {/* Header with Micro-animation & Soft Gradient */}
        <div className="flex justify-center mb-12 mt-2">
          <div className="relative group cursor-default">
            {/* Animated blurred gradient background */}
            <div className="absolute -inset-1 bg-gradient-to-r from-orange-200 via-neutral-100 to-green-200 rounded-full blur-md opacity-60 group-hover:opacity-100 transition duration-1000 group-hover:duration-300 animate-pulse"></div>
            
            {/* Main Pill */}
            <div className="relative inline-flex items-center justify-center gap-3 md:gap-4 px-6 md:px-8 py-3.5 rounded-full bg-[#8A001A]/[0.03] backdrop-blur-sm border border-[#8A001A]/10 shadow-sm">
              <Globe className="w-4 h-4 md:w-5 md:h-5 text-[#8A001A]/70 shrink-0 group-hover:text-[#8A001A] transition-colors duration-500" strokeWidth={1.5} />
              
              <h3 className="flex items-center gap-2 text-xs md:text-[15px] uppercase tracking-[0.15em] md:tracking-[0.2em] font-bold text-neutral-800" style={{ fontFamily: 'var(--font-perandory), "Perandory", serif' }}>
                GLOBAL FASHION <span className="text-[#8A001A] text-sm md:text-lg font-sans">→</span> US <span className="text-[#8A001A] text-sm md:text-lg font-sans">→</span> YOU
              </h3>
              
              <img 
                src="/indian-flag.png" 
                alt="India Flag" 
                className="w-5 md:w-6 h-auto shrink-0 object-contain drop-shadow-sm group-hover:rotate-6 group-hover:scale-110 transition-all duration-300 origin-bottom-right" 
              />
            </div>
          </div>
        </div>
        
        {/* Timeline Container - Horizontal on all devices */}
        <div className="relative w-full overflow-x-auto hide-scrollbar pb-4 snap-x snap-mandatory">
          <div className="flex items-start justify-between min-w-[480px] md:min-w-0 relative px-2">
            
            {/* Connecting Line */}
            <div className="absolute top-6 left-12 right-12 h-[1px] bg-black/10 z-0" />

            {/* 2-4 Weeks Airplane Badge (Between Step 2 and 3) */}
            <div className="absolute top-[24px] left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-3 py-1.5 flex items-center gap-1.5 z-10 border border-[#8A001A]/30 rounded-full shadow-sm text-[8px] md:text-[9px] font-bold text-[#8A001A] tracking-widest uppercase">
              <Plane className="w-3 h-3 md:w-3.5 md:h-3.5" strokeWidth={2.5} />
              <span>2-4 WEEKS</span>
            </div>
            
            {steps.map((step, idx) => (
              <div key={idx} className="relative z-10 flex flex-col items-center w-1/4 px-1 group snap-center">
                <div className="w-12 h-12 bg-white rounded-full border border-[#8A001A] shadow-sm flex items-center justify-center mb-4 group-hover:scale-110 transition-all duration-300">
                  <step.icon className="w-5 h-5 text-[#8A001A]" strokeWidth={1.5} />
                </div>
                <div className="text-center">
                  <p className="text-[10px] md:text-[11px] font-bold tracking-wider uppercase text-black font-dm-sans mb-1 leading-tight max-w-[90px] mx-auto">{step.title}</p>
                  {step.desc && (
                    <p className="text-[9px] md:text-[10px] text-gray-500 font-dm-sans leading-snug max-w-[120px] mx-auto mt-1">{step.desc}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
