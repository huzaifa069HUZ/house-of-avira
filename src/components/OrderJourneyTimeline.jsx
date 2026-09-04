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
    <div className="w-full mt-10 mb-8 bg-[#FAFAFA] rounded-2xl p-5 md:p-6 border border-black/5 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-center gap-2 mb-6">
        <span className="text-base">🌍</span>
        <h3 className="text-[10px] md:text-xs uppercase tracking-[0.2em] font-bold text-black font-dm-sans">
          Sourced Internationally, Delivered to India
        </h3>
        <span className="text-base">🇮🇳</span>
      </div>
      
      {/* Timeline Container - Horizontal on all devices */}
      <div className="relative w-full overflow-x-auto hide-scrollbar pb-2 snap-x snap-mandatory">
        <div className="flex items-start justify-between min-w-[480px] md:min-w-0 relative px-2">
          
          {/* Connecting Line */}
          <div className="absolute top-6 left-12 right-12 h-[1px] bg-black/10 z-0" />
          
          {steps.map((step, idx) => (
            <div key={idx} className="relative z-10 flex flex-col items-center w-1/4 px-1 group snap-center">
              <div className="w-12 h-12 bg-white rounded-full border border-black/10 shadow-sm flex items-center justify-center mb-3 group-hover:scale-110 group-hover:border-[#8A001A] transition-all duration-300">
                <step.icon className="w-5 h-5 text-gray-700 group-hover:text-[#8A001A] transition-colors" strokeWidth={1.5} />
              </div>
              <div className="text-center">
                <p className="text-[10px] md:text-[11px] font-bold tracking-wider uppercase text-black font-dm-sans mb-0.5">{step.title}</p>
                <p className="text-[9px] md:text-[10px] text-gray-500 font-dm-sans leading-snug max-w-[100px] mx-auto">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
