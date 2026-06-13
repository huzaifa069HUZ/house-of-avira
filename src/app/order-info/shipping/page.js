'use client';

import Link from 'next/link';
import { ChevronLeft, ArrowRight } from 'lucide-react';

export default function ShippingPage() {
  return (
    <div className="min-h-screen bg-[#FAFAF8] pt-24">

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(135deg,#0a0a0a_0%,#1a1a1a_50%,#0a0a0a_100%)]" />
        <div className="relative max-w-4xl mx-auto px-6 md:px-12 py-16 md:py-24">
          <Link href="/order-info" className="inline-flex items-center gap-2 text-white/40 hover:text-white/70 transition-colors text-[10px] tracking-[0.2em] uppercase font-bold mb-10">
            <ChevronLeft className="w-3 h-3" />
            Back to Overview
          </Link>
          <div className="inline-flex items-center gap-2 mb-6 block">
            <div className="h-px w-8 bg-[#8A001A]" />
            <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-[#8A001A]">Section 02</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-serif text-white tracking-tight leading-[1.1]">
            Shipping <span className="italic text-[#8A001A]">& Delivery</span>
          </h1>
        </div>
      </section>

      {/* Content */}
      <article className="max-w-3xl mx-auto px-6 md:px-12 py-16 md:py-24">
        <div className="space-y-20">

          {/* ─── International Shipping ─── */}
          <section className="space-y-8">
            <div>
              <span className="text-[80px] font-serif font-light text-[#000000]/[0.04] leading-none block -mb-8 select-none">01</span>
              <h2 className="text-xl md:text-2xl font-serif text-[#1a1a1a] tracking-tight relative">International Shipping</h2>
            </div>

            <div className="space-y-4 text-[#1a1a1a]/70 text-sm md:text-[15px] leading-[1.85] font-light">
              <p>International shipping charges are completely separate from the product price.</p>
              
              <div className="bg-[#0a0a0a] p-6 md:p-8 space-y-3">
                <p className="text-[10px] font-bold tracking-[0.25em] uppercase text-[#8A001A] mb-3">Key Points</p>
                <p className="text-white/70 text-sm leading-[1.85] font-light">
                  These charges are <strong className="font-semibold text-white">NOT</strong> collected during checkout.
                </p>
                <p className="text-white/50 text-xs leading-[1.8]">
                  International shipping charges are calculated later in the process once your products arrive at our shipping warehouse. This allows us to calculate the most accurate shipping amount possible based on actual shipment conditions.
                </p>
              </div>
            </div>

            {/* What it includes */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold tracking-[0.1em] uppercase text-[#1a1a1a]">International shipping charges may include</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  'International freight charges',
                  'Customs duties',
                  'Customs clearance fees',
                  'Import-related taxes',
                  'Logistics costs',
                  'Handling charges',
                  'Product-specific shipping requirements'
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3 border border-[#000000]/[0.06] p-4">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#8A001A] shrink-0" />
                    <span className="text-xs text-[#1a1a1a]/60 font-light">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Factors */}
            <div className="border-l-2 border-[#8A001A]/20 pl-6 md:pl-8 space-y-4">
              <h3 className="text-sm font-bold tracking-[0.1em] uppercase text-[#1a1a1a]">The final amount depends on</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {[
                  'Product weight', 'Volumetric weight', 'Parcel dimensions',
                  'Product category', 'Current logistics rates', 'Customs requirements',
                  'Carrier rates', 'Economic conditions', 'International shipping market conditions'
                ].map((item, idx) => (
                  <div key={idx} className="text-xs text-[#1a1a1a]/50 font-light border border-[#000000]/[0.04] p-3 text-center">
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Divider */}
          <div className="flex items-center gap-4">
            <div className="h-px flex-1 bg-[#000000]/[0.06]" />
            <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-[#1a1a1a]/30">Special Categories</span>
            <div className="h-px flex-1 bg-[#000000]/[0.06]" />
          </div>

          {/* Branded Products */}
          <section className="space-y-6">
            <h2 className="text-xl md:text-2xl font-serif text-[#1a1a1a] tracking-tight">Branded Products & Special Categories</h2>
            <p className="text-[#1a1a1a]/70 text-sm md:text-[15px] leading-[1.85] font-light">
              Certain products may attract higher customs and shipping costs due to additional inspections, clearance requirements, restrictions, or documentation.
            </p>

            <div className="bg-[#FFF8F0] border border-[#8A001A]/10 p-6 md:p-8 space-y-4">
              <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#8A001A] mb-3">These may include</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {[
                  'Branded products (Ferrari, Adidas, Nike, Hello Kitty, Pop Mart, etc.)',
                  'Cosmetics & beauty products',
                  'Lighters',
                  'Restricted product categories',
                  'Fragile items',
                  'Oversized items',
                  'Products requiring special handling'
                ].map((item, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-xs text-[#1a1a1a]/60 font-light leading-[1.6]">
                    <div className="w-1 h-1 rounded-full bg-[#8A001A] mt-1.5 shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
              <p className="text-xs text-[#1a1a1a]/40 font-light italic mt-4">
                These additional costs are generally included within your final shipping calculation.
              </p>
            </div>
          </section>

          {/* Shipping Calculator Note */}
          <section className="space-y-4">
            <div className="border border-[#000000]/[0.06] p-6 md:p-8 space-y-4">
              <h3 className="text-sm font-bold tracking-[0.1em] uppercase text-[#1a1a1a]">Shipping Calculator</h3>
              <p className="text-[#1a1a1a]/60 text-xs leading-[1.9] font-light">
                A shipping calculator will be available below your cart to provide an estimated shipping cost before ordering.
              </p>
              <div className="space-y-2 mt-4">
                <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#1a1a1a]/40 mb-3">Please Note</p>
                {[
                  'This is only an estimate',
                  'It is not a guaranteed shipping amount',
                  'Actual shipping costs may be lower or higher',
                  'Estimates are provided only to help customers understand potential shipping costs before ordering'
                ].map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3 text-xs text-[#1a1a1a]/50 font-light">
                    <div className="w-1 h-1 rounded-full bg-[#000000]/20 mt-1.5 shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
              <p className="text-[#1a1a1a]/50 text-xs font-light mt-4 border-t border-[#000000]/[0.04] pt-4">
                The final shipping amount can only be confirmed once products arrive at our shipping warehouse and all charges have been finalized.
              </p>
            </div>
          </section>

          {/* Shipping Updates */}
          <section className="space-y-6">
            <h3 className="text-sm font-bold tracking-[0.1em] uppercase text-[#1a1a1a]">Shipping Updates</h3>
            <p className="text-[#1a1a1a]/70 text-sm leading-[1.85] font-light">
              Customers will receive updates regarding their order through:
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {['WhatsApp', 'SMS', 'Email', 'Official Channels'].map((channel, idx) => (
                <div key={idx} className="border border-[#000000]/[0.06] p-4 text-center">
                  <span className="text-[10px] font-bold tracking-[0.15em] uppercase text-[#1a1a1a]/60">{channel}</span>
                </div>
              ))}
            </div>
            <p className="text-[#1a1a1a]/50 text-xs font-light">
              We may also provide updates through group chats, announcements, or designated update channels where applicable.
            </p>
          </section>

          {/* Divider */}
          <div className="flex items-center gap-4">
            <div className="h-px flex-1 bg-[#000000]/[0.06]" />
            <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-[#1a1a1a]/30">Domestic</span>
            <div className="h-px flex-1 bg-[#000000]/[0.06]" />
          </div>

          {/* ─── Domestic Shipping ─── */}
          <section className="space-y-8">
            <div>
              <span className="text-[80px] font-serif font-light text-[#000000]/[0.04] leading-none block -mb-8 select-none">02</span>
              <h2 className="text-xl md:text-2xl font-serif text-[#1a1a1a] tracking-tight relative">Domestic Shipping</h2>
            </div>

            <div className="space-y-4 text-[#1a1a1a]/70 text-sm md:text-[15px] leading-[1.85] font-light">
              <p>Domestic shipping refers to the delivery of your parcel from our warehouse to your final delivery address within India.</p>
            </div>

            <div className="border-l-2 border-[#000000]/[0.06] pl-6 space-y-3">
              <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#1a1a1a]/40">Calculated based on</p>
              <div className="grid grid-cols-2 gap-2">
                {['Parcel weight', 'Parcel dimensions', 'Delivery location', 'Courier partner rates'].map((item, idx) => (
                  <div key={idx} className="text-xs text-[#1a1a1a]/50 font-light border border-[#000000]/[0.04] p-3 text-center">
                    {item}
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-[#0a0a0a] p-6 md:p-8 space-y-3">
              <p className="text-[10px] font-bold tracking-[0.25em] uppercase text-[#8A001A] mb-3">How it works</p>
              <p className="text-white/60 text-xs leading-[1.9] font-light">
                Domestic shipping charges are not collected during checkout. They are included in the final shipping invoice together with your international shipping charges.
              </p>
              <p className="text-white/50 text-xs leading-[1.8] mt-2">
                Customers receive one shipping payment containing both international and domestic shipping charges. A complete breakdown will always be provided before payment is requested.
              </p>
              <p className="text-white/50 text-xs leading-[1.8] mt-2">
                Tracking information will be shared once the parcel has been dispatched.
              </p>
            </div>

            <p className="text-[#1a1a1a]/50 text-xs font-light italic">We currently ship across India.</p>
          </section>

          {/* Divider */}
          <div className="flex items-center gap-4">
            <div className="h-px flex-1 bg-[#000000]/[0.06]" />
            <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-[#1a1a1a]/30">Timelines</span>
            <div className="h-px flex-1 bg-[#000000]/[0.06]" />
          </div>

          {/* ─── Delivery Timelines ─── */}
          <section className="space-y-8">
            <div>
              <span className="text-[80px] font-serif font-light text-[#000000]/[0.04] leading-none block -mb-8 select-none">03</span>
              <h2 className="text-xl md:text-2xl font-serif text-[#1a1a1a] tracking-tight relative">Delivery Timelines</h2>
            </div>

            <div className="space-y-4 text-[#1a1a1a]/70 text-sm md:text-[15px] leading-[1.85] font-light">
              <p>Since all products are sourced internationally, delivery timelines are estimates only and cannot be guaranteed.</p>
              
              <div className="bg-[#0a0a0a] p-6 md:p-8 text-center">
                <p className="text-[10px] font-bold tracking-[0.25em] uppercase text-[#8A001A] mb-4">Typical Delivery</p>
                <p className="text-white text-2xl md:text-3xl font-serif tracking-tight">2–4 Weeks</p>
                <p className="text-white/40 text-xs mt-3 font-light">after shipment · estimates only</p>
              </div>

              <p className="text-[#1a1a1a]/50 text-xs font-light">
                Please note that this estimate refers only to shipping and transit time and does not include the initial sourcing and processing period.
              </p>
              
              <div className="bg-[#FFF8F0] border border-[#8A001A]/10 p-4 text-xs text-[#8A001A]/80 leading-[1.8]">
                In some cases, orders may take up to <strong className="font-semibold">8 weeks or longer</strong> depending on circumstances beyond our control.
              </div>
            </div>

            {/* Delays */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold tracking-[0.1em] uppercase text-[#1a1a1a]">Delays may occur due to</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {[
                  'Customs inspections', 'Customs clearance', 'Logistics disruptions',
                  'Weather conditions', 'Public holidays', 'Transportation delays',
                  'Political situations', 'War-related disruptions', 'Economic conditions',
                  'Carrier delays', 'Supplier delays', 'Government regulations',
                  'Port congestion', 'Route disruptions'
                ].map((item, idx) => (
                  <div key={idx} className="text-xs text-[#1a1a1a]/50 font-light border border-[#000000]/[0.04] p-3 text-center">
                    {item}
                  </div>
                ))}
              </div>
            </div>

            {/* Price Fluctuations */}
            <div className="border-l-2 border-[#8A001A]/20 pl-6 space-y-3">
              <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#1a1a1a]/40">Shipping prices may also fluctuate due to</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {[
                  'Fuel costs', 'Logistics rates', 'Customs requirements',
                  'Carrier pricing', 'Economic conditions', 'Market fluctuations'
                ].map((item, idx) => (
                  <div key={idx} className="text-xs text-[#1a1a1a]/50 font-light border border-[#000000]/[0.04] p-3 text-center">
                    {item}
                  </div>
                ))}
              </div>
              <p className="text-[#1a1a1a]/40 text-xs font-light italic">These factors are completely outside of our control.</p>
            </div>

            <div className="bg-[#0a0a0a] p-6 md:p-8">
              <p className="text-white/60 text-xs leading-[1.9] font-light">
                We kindly ask customers to place orders only if they are comfortable with possible delays, changing shipping costs, customs procedures, and international sourcing timelines. Our goal is to be transparent from the beginning so there are no surprises later.
              </p>
            </div>
          </section>
        </div>

        {/* Navigation */}
        <div className="mt-20 pt-12 border-t border-[#000000]/[0.06] flex justify-between items-center">
          <Link href="/order-info/order-process" className="flex items-center gap-2 text-[10px] font-bold tracking-[0.2em] uppercase text-[#1a1a1a]/40 hover:text-[#1a1a1a] transition-colors">
            <ChevronLeft className="w-3 h-3" />
            Order Process
          </Link>
          <Link href="/order-info/policies" className="flex items-center gap-2 text-[10px] font-bold tracking-[0.2em] uppercase text-[#8A001A] hover:gap-3 transition-all">
            Policies & Guidelines
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </article>
    </div>
  );
}
