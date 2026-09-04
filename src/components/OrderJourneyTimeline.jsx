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
      {/* Header */}
      <div className="flex items-center justify-center gap-3 mb-8">
        <Globe className="w-4 h-4 text-neutral-400 shrink-0" />
        <h3 className="text-[12px] md:text-sm uppercase tracking-[0.2em] font-bold text-black" style={{ fontFamily: 'var(--font-perandory), "Perandory", serif' }}>
          Sourced Internationally, Delivered to India
        </h3>
        <img src="https://flagcdn.com/w40/in.png" srcSet="https://flagcdn.com/w80/in.png 2x" width="20" alt="India Flag" className="shrink-0 object-contain rounded-sm shadow-sm" />
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
