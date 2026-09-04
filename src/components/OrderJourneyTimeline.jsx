'use client';
import { ShoppingBag, Globe, Warehouse, Truck } from 'lucide-react';

export default function OrderJourneyTimeline() {
  const steps = [
    { icon: ShoppingBag, title: "You Order", desc: "Secure your piece" },
    { icon: Globe, title: "We Source It", desc: "Globally curated for you" },
    { icon: Warehouse, title: "Quality Check", desc: "Inspected at our hub" },
    { icon: Truck, title: "Delivered", desc: "Shipped to your door" }
  ];

  return (
    <div className="w-full mt-6 lg:mt-0 mb-8 bg-[#FAFAFA] rounded-[2rem] p-6 lg:p-8 border border-neutral-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden">
      
      {/* Header with Micro-animation & Soft Gradient */}
      <div className="flex justify-center mb-10 mt-2">
        <div className="relative group cursor-default">
          {/* Animated blurred gradient background */}
          <div className="absolute -inset-0.5 bg-gradient-to-r from-orange-200 via-neutral-200 to-green-200 rounded-full blur-md opacity-40 group-hover:opacity-70 transition duration-1000 group-hover:duration-300 animate-pulse"></div>
          
          {/* Main Pill */}
          <div className="relative inline-flex items-center justify-center gap-3 md:gap-4 px-6 md:px-8 py-3 rounded-full bg-white/90 backdrop-blur-sm border border-neutral-100 shadow-sm">
            <Globe className="w-4 h-4 md:w-5 md:h-5 text-neutral-400 shrink-0 group-hover:text-blue-400 transition-colors duration-500" />
            
            <h3 className="text-xs md:text-[15px] uppercase tracking-[0.15em] md:tracking-[0.2em] font-bold text-neutral-800" style={{ fontFamily: 'var(--font-perandory), "Perandory", serif' }}>
              Sourced Internationally, Delivered to India
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
          
          {steps.map((step, idx) => (
            <div key={idx} className="relative z-10 flex flex-col items-center w-1/4 px-1 group snap-center">
              <div className="w-12 h-12 bg-white rounded-full border border-black/10 shadow-sm flex items-center justify-center mb-4 group-hover:scale-110 group-hover:border-[#8A001A] transition-all duration-300">
                <step.icon className="w-5 h-5 text-gray-700 group-hover:text-[#8A001A] transition-colors" strokeWidth={1.5} />
              </div>
              <div className="text-center">
                <p className="text-[10px] md:text-[11px] font-bold tracking-wider uppercase text-black font-dm-sans mb-1">{step.title}</p>
                <p className="text-[9px] md:text-[10px] text-gray-500 font-dm-sans leading-snug max-w-[110px] mx-auto">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
