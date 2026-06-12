'use client';
import { ShoppingBag, CreditCard, PackageOpen, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function HowItWorks() {
  return (
    <section className="py-24 bg-white w-full border-b-8 border-black relative overflow-hidden">
      {/* Subtle dotted background */}
      <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>
      
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16 flex flex-col items-center">
          <h2 className="text-5xl md:text-7xl uppercase tracking-tighter text-white rotate-[-3deg] inline-block bg-[#8A001A] px-6 py-3 shadow-[8px_8px_0px_0px_#000] font-['Syne',sans-serif] font-extrabold">
            How It Works
          </h2>
          <p className="mt-8 text-3xl md:text-4xl font-['Caveat',cursive] text-[#8A001A] rotate-2 tracking-wider bg-white/80 inline-block px-4">
            No secrets. Just immaculate vibes.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-14 mt-16 px-4 md:px-0">
          {/* Step 1 */}
          <div className="relative group">
            <div className="bg-white border-4 border-black p-8 shadow-[12px_12px_0px_0px_#000] transition-all duration-300 group-hover:-translate-y-4 group-hover:rotate-3 group-hover:shadow-[20px_20px_0px_0px_#8A001A] h-full flex flex-col items-center text-center">
              <div className="w-20 h-20 bg-black text-white rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <ShoppingBag className="w-10 h-10" />
              </div>
              <h3 className="text-2xl uppercase tracking-tight mb-4 font-['Syne',sans-serif] font-bold">1. Browse</h3>
              <p className="text-sm font-medium leading-relaxed opacity-80">
                Find your aesthetic. Add your favorite imported pieces to the bag. 
              </p>
              <div className="absolute -bottom-4 -left-4 bg-[#8A001A] text-white text-xs font-black uppercase px-3 py-1 -rotate-6 border-2 border-black shadow-[4px_4px_0px_0px_#000]">
                Curated
              </div>
            </div>
          </div>

          {/* Step 2 */}
          <div className="relative group md:mt-12">
            <div className="bg-black text-white border-4 border-black p-8 shadow-[12px_12px_0px_0px_#8A001A] transition-all duration-300 group-hover:-translate-y-4 group-hover:-rotate-2 group-hover:shadow-[20px_20px_0px_0px_#8A001A] h-full flex flex-col items-center text-center relative overflow-hidden">
              <div className="w-20 h-20 bg-[#8A001A] text-white rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform relative z-10">
                <CreditCard className="w-10 h-10" />
              </div>
              <h3 className="text-2xl uppercase tracking-tight mb-4 relative z-10 font-['Syne',sans-serif] font-bold text-white">2. Pay Fixed Price</h3>
              <p className="text-sm font-medium leading-relaxed relative z-10 opacity-90">
                You pay a fixed price for the items now. <span className="text-[#8A001A] bg-white px-2 mt-2 inline-block -rotate-1 font-bold shadow-[2px_2px_0px_0px_#8A001A]">Shipping is billed separately</span> when the item arrives.
              </p>
              
              {/* Micro-animation element */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-[#8A001A]/20 rounded-full opacity-0 group-hover:opacity-100 group-hover:scale-150 transition-all duration-1000 animate-pulse pointer-events-none"></div>
              
              {/* Sticker */}
              <div className="absolute -top-5 -right-5 bg-white text-[#8A001A] text-[11px] font-black uppercase px-3 py-2 rotate-12 border-2 border-black shadow-[4px_4px_0px_0px_#000] z-20 group-hover:rotate-[20deg] transition-transform">
                Preorder!
              </div>
            </div>
          </div>

          {/* Step 3 */}
          <div className="relative group">
            <div className="bg-white border-4 border-black p-8 shadow-[12px_12px_0px_0px_#000] transition-all duration-300 group-hover:-translate-y-4 group-hover:rotate-1 group-hover:shadow-[20px_20px_0px_0px_#8A001A] h-full flex flex-col items-center text-center">
              <div className="w-20 h-20 bg-black text-white rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <PackageOpen className="w-10 h-10" />
              </div>
              <h3 className="text-2xl uppercase tracking-tight mb-4 font-['Syne',sans-serif] font-bold">3. Receive</h3>
              <p className="text-sm font-medium leading-relaxed opacity-80">
                Patience is a virtue! We import your fits, handle logistics, and ship directly to you.
              </p>
              <div className="absolute -top-4 -left-4 font-['Caveat',cursive] text-[#8A001A] text-3xl -rotate-12 bg-white/90 px-3 group-hover:scale-110 transition-transform">
                Worth the wait!
              </div>
            </div>
          </div>
        </div>

        {/* Why Pay Shipping Separately Explanation */}
        <div className="mt-24 max-w-4xl mx-auto relative group perspective-1000">
          <div className="bg-[#8A001A] text-white p-8 md:p-12 border-4 border-black shadow-[16px_16px_0px_0px_#000] rotate-1 group-hover:rotate-0 transition-transform duration-500">
            <h3 className="text-3xl md:text-5xl uppercase tracking-tighter mb-6 font-['Syne',sans-serif] font-black">
              Why pay shipping separately?
            </h3>
            <p className="text-base md:text-lg font-medium leading-relaxed opacity-95 mb-6">
              Our curated pieces are <span className="bg-white text-[#8A001A] px-2 py-0.5 font-bold inline-block -rotate-1 shadow-[2px_2px_0px_0px_#000]">imported directly from foreign suppliers</span> to bring you the best global aesthetics. 
              The final shipping bill covers all the necessary logistics: <strong>customs duty, international taxes, export/import fees</strong>, and your final domestic delivery.
            </p>
            <p className="text-3xl md:text-4xl font-symphony tracking-wider opacity-100 mt-2">
              We separate this cost so you only pay exactly what it takes to get it across borders—no hidden markups! ✈️📦
            </p>
            
            <div className="mt-10 flex flex-col md:flex-row justify-center md:justify-start gap-4">
              <div className="group flex justify-center items-center gap-3 bg-white text-[#8A001A] font-medium tracking-wide text-sm px-8 py-3.5 rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.12)]">
                Check your cart to estimate shipping! 🛒
              </div>
              <Link href="/shipping" className="group flex justify-center items-center gap-3 bg-transparent border-2 border-white text-white font-medium tracking-wide text-sm px-8 py-3.5 rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:bg-white/10 hover:-translate-y-1 transition-all duration-300">
                Learn more about shipping
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
            
            {/* Decorative Tape */}
            <div className="absolute -top-5 left-1/2 -translate-x-1/2 w-40 h-10 bg-white/60 backdrop-blur-md rotate-[-3deg] border border-white/40 shadow-sm mix-blend-screen"></div>
            <div className="absolute -bottom-5 right-12 w-32 h-10 bg-white/60 backdrop-blur-md rotate-[5deg] border border-white/40 shadow-sm mix-blend-screen"></div>
          </div>
        </div>
      </div>
    </section>
  );
}
