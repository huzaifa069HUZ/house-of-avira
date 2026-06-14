'use client';
import { ShoppingBag, Plane, PackageCheck, ArrowRight } from 'lucide-react';

export default function HowItWorks() {
  return (
    <section className="py-24 bg-[#FFFFFF] w-full border-t border-[#000000]/5 relative overflow-hidden">
      <div className="max-w-5xl mx-auto px-6 md:px-12 relative z-10 flex flex-col items-center">
        
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-sm md:text-base font-bold tracking-[0.2em] uppercase text-[#000000] mb-3">
            How It Works
          </h2>
          <p className="text-3xl md:text-5xl font-symphony text-[#000000]/80">
            Internally sourced and delivered to your doorstep.
          </p>
        </div>

        {/* Steps Flow */}
        <div className="flex flex-col md:flex-row items-center justify-center w-full gap-8 md:gap-4 relative mb-16">
          
          {/* Connecting Line (Desktop) */}
          <div className="hidden md:block absolute top-1/2 left-[15%] right-[15%] h-[1px] bg-[#000000]/10 -translate-y-1/2 z-0" />

          {/* Step 1 */}
          <div className="relative z-10 flex flex-col items-center flex-1 w-full text-center group">
            <div className="w-16 h-16 md:w-20 md:h-20 bg-white border border-[#000000]/10 rounded-full flex items-center justify-center mb-6 shadow-sm group-hover:border-[#000000] group-hover:shadow-md transition-all duration-500">
              <ShoppingBag className="w-6 h-6 md:w-8 md:h-8 text-[#000000] stroke-[1.5]" />
            </div>
            <h3 className="text-sm md:text-base font-bold tracking-widest uppercase text-[#000000]">
              Place Your Order
            </h3>
          </div>

          <ArrowRight className="w-6 h-6 text-[#000000]/20 md:hidden" />

          {/* Step 2 */}
          <div className="relative z-10 flex flex-col items-center flex-1 w-full text-center group">
            <div className="w-16 h-16 md:w-20 md:h-20 bg-white border border-[#000000]/10 rounded-full flex items-center justify-center mb-6 shadow-sm group-hover:border-[#000000] group-hover:shadow-md transition-all duration-500">
              <Plane className="w-6 h-6 md:w-8 md:h-8 text-[#000000] stroke-[1.5]" />
            </div>
            <h3 className="text-sm md:text-base font-bold tracking-widest uppercase text-[#000000]">
              International Shipping
            </h3>
          </div>

          <ArrowRight className="w-6 h-6 text-[#000000]/20 md:hidden" />

          {/* Step 3 */}
          <div className="relative z-10 flex flex-col items-center flex-1 w-full text-center group">
            <div className="w-16 h-16 md:w-20 md:h-20 bg-white border border-[#000000]/10 rounded-full flex items-center justify-center mb-6 shadow-sm group-hover:border-[#000000] group-hover:shadow-md transition-all duration-500">
              <PackageCheck className="w-6 h-6 md:w-8 md:h-8 text-[#000000] stroke-[1.5]" />
            </div>
            <h3 className="text-sm md:text-base font-bold tracking-widest uppercase text-[#000000]">
              Final Delivery
            </h3>
          </div>

        </div>

        {/* Disclaimer Note */}
        <div className="bg-[#FAFAFA] border border-[#000000]/5 px-8 py-5 rounded-2xl max-w-2xl w-full text-center">
          <p className="text-xs md:text-sm font-medium tracking-wide text-[#000000]/60 uppercase leading-relaxed">
            * Please place an order only if you are comfortable with the international shipping process and charges.
          </p>
        </div>

      </div>
    </section>
  );
}
