'use client';

import Link from 'next/link';
import { ChevronLeft, ArrowRight } from 'lucide-react';

export default function OrderProcessPage() {
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
            <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-[#8A001A]">Section 01</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-serif text-white tracking-tight leading-[1.1]">
            Order <span className="italic text-[#8A001A]">Process</span>
          </h1>
        </div>
      </section>

      {/* Content */}
      <article className="max-w-3xl mx-auto px-6 md:px-12 py-16 md:py-24">
        <div className="space-y-16">

          {/* Intro */}
          <div className="space-y-4 text-[#1a1a1a]/70 text-sm md:text-[15px] leading-[1.85] font-light">
            <p>We keep our ordering process as simple and transparent as possible.</p>
            <div className="bg-[#0a0a0a] text-white p-6 md:p-8 mt-4">
              <p className="text-[10px] font-bold tracking-[0.25em] uppercase text-[#8A001A] mb-3">Important</p>
              <p className="text-white/70 text-sm md:text-[15px] leading-[1.85] font-light">
                There are only <strong className="font-semibold text-white">TWO payments</strong> involved in your order.
              </p>
            </div>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-4">
            <div className="h-px flex-1 bg-[#000000]/[0.06]" />
            <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-[#1a1a1a]/30">Payment 1</span>
            <div className="h-px flex-1 bg-[#000000]/[0.06]" />
          </div>

          {/* Product Payment */}
          <section className="space-y-8">
            <div>
              <span className="text-[80px] font-serif font-light text-[#000000]/[0.04] leading-none block -mb-8 select-none">01</span>
              <h2 className="text-xl md:text-2xl font-serif text-[#1a1a1a] tracking-tight relative">Product Payment</h2>
            </div>

            <div className="space-y-4 text-[#1a1a1a]/70 text-sm md:text-[15px] leading-[1.85] font-light">
              <p>When placing your order, you will pay:</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border border-[#000000]/[0.06] p-6">
                  <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#8A001A] mb-3">Slot Fee</p>
                  <p className="text-[#1a1a1a]/60 text-xs leading-[1.8]">Reserved to confirm your place in the current ordering batch.</p>
                </div>
                <div className="border border-[#000000]/[0.06] p-6">
                  <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#8A001A] mb-3">Product Price</p>
                  <p className="text-[#1a1a1a]/60 text-xs leading-[1.8]">Covers the product itself unless otherwise stated.</p>
                </div>
              </div>
            </div>

            {/* Slot Fee */}
            <div className="border-l-2 border-[#8A001A]/20 pl-6 md:pl-8 space-y-4">
              <h3 className="text-sm font-bold tracking-[0.1em] uppercase text-[#1a1a1a]">Slot Fee</h3>
              <div className="space-y-3 text-[#1a1a1a]/70 text-sm md:text-[15px] leading-[1.85] font-light">
                <p>The slot fee is paid to reserve your place in the current ordering batch and confirm your order.</p>
                <div className="inline-flex items-center gap-2 bg-[#8A001A]/[0.05] px-4 py-2">
                  <span className="text-[10px] font-bold tracking-[0.15em] uppercase text-[#8A001A]">Slot Fee:</span>
                  <span className="text-sm font-semibold text-[#8A001A]">₹60</span>
                </div>
                <p>This allows our team to begin processing, organizing, and sourcing products for your order.</p>
                <div className="bg-[#FFF8F0] border border-[#8A001A]/10 p-4 text-xs text-[#8A001A]/80 leading-[1.8]">
                  Once a slot has been reserved and processing has begun, the slot fee is <strong className="font-semibold">non-refundable</strong>.
                </div>
              </div>
            </div>

            {/* Product Price */}
            <div className="border-l-2 border-[#000000]/[0.06] pl-6 md:pl-8 space-y-4">
              <h3 className="text-sm font-bold tracking-[0.1em] uppercase text-[#1a1a1a]">Product Price</h3>
              <div className="space-y-3 text-[#1a1a1a]/70 text-sm md:text-[15px] leading-[1.85] font-light">
                <p>The product price covers only the product itself unless otherwise stated.</p>
                <div className="bg-[#0a0a0a] p-6 text-white/70 text-xs leading-[1.9] space-y-2">
                  <p className="text-[10px] font-bold tracking-[0.25em] uppercase text-[#8A001A] mb-3">Product price does not include</p>
                  <ul className="space-y-2">
                    {[
                      'International shipping',
                      'Domestic shipping',
                      'Customs duties',
                      'Customs clearance charges',
                      'Import-related taxes',
                      'Logistics charges',
                      'Handling fees'
                    ].map((item, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <div className="w-1 h-1 rounded-full bg-[#8A001A] mt-1.5 shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <p className="text-[#1a1a1a]/50 text-xs">
                  These charges are calculated later in the process and paid separately.
                </p>
              </div>
            </div>
          </section>

          {/* Divider */}
          <div className="flex items-center gap-4">
            <div className="h-px flex-1 bg-[#000000]/[0.06]" />
            <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-[#1a1a1a]/30">Payment 2</span>
            <div className="h-px flex-1 bg-[#000000]/[0.06]" />
          </div>

          {/* Shipping Payment */}
          <section className="space-y-8">
            <div>
              <span className="text-[80px] font-serif font-light text-[#000000]/[0.04] leading-none block -mb-8 select-none">02</span>
              <h2 className="text-xl md:text-2xl font-serif text-[#1a1a1a] tracking-tight relative">Shipping Payment</h2>
            </div>

            <div className="space-y-4 text-[#1a1a1a]/70 text-sm md:text-[15px] leading-[1.85] font-light">
              <p>Shipping is paid separately from the product payment.</p>
              <div className="bg-[#0a0a0a] p-6 md:p-8">
                <p className="text-[10px] font-bold tracking-[0.25em] uppercase text-[#8A001A] mb-3">Key Point</p>
                <p className="text-white/70 text-sm leading-[1.85] font-light">
                  You do <strong className="font-semibold text-white">NOT</strong> pay shipping charges when placing your order.
                </p>
                <p className="text-white/50 text-xs mt-3 leading-[1.8]">
                  Instead, shipping charges are calculated later in the process after your products arrive at our international shipping warehouse and all applicable costs can be accurately determined.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-bold tracking-[0.1em] uppercase text-[#1a1a1a]">Your shipping payment will include</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  'International shipping charges',
                  'Customs duties & clearance fees',
                  'Import-related charges & taxes',
                  'Domestic shipping charges',
                  'Logistics & handling charges'
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3 border border-[#000000]/[0.06] p-4">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#8A001A] shrink-0" />
                    <span className="text-xs text-[#1a1a1a]/60 font-light">{item}</span>
                  </div>
                ))}
              </div>
              <p className="text-[#1a1a1a]/50 text-xs font-light italic">A complete breakdown will always be provided.</p>
            </div>

            <div className="border border-[#000000]/[0.06] p-6 md:p-8 space-y-4">
              <h3 className="text-sm font-bold tracking-[0.1em] uppercase text-[#1a1a1a]">Once calculations are completed, you will receive</h3>
              <ul className="space-y-3 text-[#1a1a1a]/60 text-xs leading-[1.8]">
                {[
                  'Your total shipping amount',
                  'A detailed breakdown of charges',
                  'Your payment deadline'
                ].map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <div className="w-5 h-5 border border-[#8A001A]/20 flex items-center justify-center shrink-0 text-[9px] font-bold text-[#8A001A]">
                      {idx + 1}
                    </div>
                    <span className="pt-0.5">{item}</span>
                  </li>
                ))}
              </ul>
              <p className="text-[#1a1a1a]/50 text-xs font-light">
                Customers will be given a few days to complete shipping payment.
              </p>
            </div>

            <div className="bg-[#FFF8F0] border border-[#8A001A]/10 p-6 text-xs text-[#1a1a1a]/70 leading-[1.9] font-light">
              <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#8A001A] mb-3">Payment Policy</p>
              <p>
                Shipping charges are an essential and mandatory part of your order and are required to complete the dispatch process. Please note that shipping is not included in the product price and is calculated separately later in the order process.
              </p>
              <p className="mt-3">
                Once your order reaches our shipping stage, the applicable shipping charges (including international shipping, customs duties, clearance fees, and domestic shipping within India) will be calculated and shared with you along with a complete breakdown.
              </p>
              <p className="mt-3">
                A fixed deadline will be provided for payment. Shipping charges must be paid in full within the given timeframe in order for your order to be shipped. If shipping payment is not completed, the order will not be dispatched and may remain on hold, and additional storage or handling charges may apply.
              </p>
            </div>

            <div className="border-l-2 border-[#000000]/[0.06] pl-6 space-y-3">
              <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#1a1a1a]/40">Shipping Calculator</p>
              <p className="text-[#1a1a1a]/60 text-xs leading-[1.8] font-light">
                A shipping calculator is available under your cart to provide an estimated idea of shipping charges. This estimate is only for reference purposes and may vary from the final amount, which can be higher or lower depending on actual logistics, customs, and carrier rates. It is intended only to help you understand approximate costs before placing an order.
              </p>
            </div>

            <div className="bg-[#0a0a0a] p-6 md:p-8">
              <p className="text-[10px] font-bold tracking-[0.25em] uppercase text-[#8A001A] mb-3">Important Notice</p>
              <p className="text-white/60 text-xs leading-[1.9] font-light">
                Once an order is placed and processed, the product price is non-refundable. If a customer chooses not to proceed after the final shipping charges are shared, the order will not be cancelled or refunded, and no returns or exchanges will be applicable. We encourage customers to review all policies and ensure they are comfortable with the full process before placing an order.
              </p>
            </div>
          </section>
        </div>

        {/* Navigation */}
        <div className="mt-20 pt-12 border-t border-[#000000]/[0.06] flex justify-between items-center">
          <Link href="/order-info" className="flex items-center gap-2 text-[10px] font-bold tracking-[0.2em] uppercase text-[#1a1a1a]/40 hover:text-[#1a1a1a] transition-colors">
            <ChevronLeft className="w-3 h-3" />
            Overview
          </Link>
          <Link href="/order-info/shipping" className="flex items-center gap-2 text-[10px] font-bold tracking-[0.2em] uppercase text-[#8A001A] hover:gap-3 transition-all">
            Shipping & Delivery
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </article>
    </div>
  );
}
