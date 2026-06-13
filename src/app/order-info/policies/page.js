'use client';

import Link from 'next/link';
import { ChevronLeft, Heart } from 'lucide-react';

export default function PoliciesPage() {
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
            <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-[#8A001A]">Section 03</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-serif text-white tracking-tight leading-[1.1]">
            Policies <span className="italic text-[#8A001A]">& Guidelines</span>
          </h1>
        </div>
      </section>

      {/* Content */}
      <article className="max-w-3xl mx-auto px-6 md:px-12 py-16 md:py-24">
        <div className="space-y-20">

          {/* ─── Order Confirmation ─── */}
          <section className="space-y-6">
            <div>
              <span className="text-[80px] font-serif font-light text-[#000000]/[0.04] leading-none block -mb-8 select-none">01</span>
              <h2 className="text-xl md:text-2xl font-serif text-[#1a1a1a] tracking-tight relative">Order Confirmation & General Policy</h2>
            </div>
            <div className="space-y-4 text-[#1a1a1a]/70 text-sm md:text-[15px] leading-[1.85] font-light">
              <p>
                All orders placed with House of Avira are considered confirmed once payment has been successfully completed.
              </p>
              <p>
                By placing an order, the customer agrees to all store policies, processes, timelines, and shipping structures mentioned on this page.
              </p>
              <div className="bg-[#FFF8F0] border border-[#8A001A]/10 p-4 text-xs text-[#8A001A]/80 leading-[1.8]">
                We strongly recommend reading all sections carefully before placing an order to ensure full clarity on how the process works.
              </div>
            </div>
          </section>

          {/* Divider */}
          <div className="flex items-center gap-4">
            <div className="h-px flex-1 bg-[#000000]/[0.06]" />
            <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-[#1a1a1a]/30">Refunds</span>
            <div className="h-px flex-1 bg-[#000000]/[0.06]" />
          </div>

          {/* ─── Refund Policy ─── */}
          <section className="space-y-6">
            <div>
              <span className="text-[80px] font-serif font-light text-[#000000]/[0.04] leading-none block -mb-8 select-none">02</span>
              <h2 className="text-xl md:text-2xl font-serif text-[#1a1a1a] tracking-tight relative">Refund Policy</h2>
            </div>
            <div className="space-y-4 text-[#1a1a1a]/70 text-sm md:text-[15px] leading-[1.85] font-light">
              <p>
                Refunds are only applicable in cases where there is a verified issue or error from our side, such as incorrect product dispatch or a confirmed product-related problem.
              </p>
              
              <div className="bg-[#0a0a0a] p-6 md:p-8 space-y-4">
                <p className="text-[10px] font-bold tracking-[0.25em] uppercase text-[#8A001A] mb-3">Refunds are NOT applicable for</p>
                <ul className="space-y-2.5">
                  {[
                    'Change of mind',
                    'Shipping cost being higher than expected',
                    'Delay in delivery',
                    'Customs charges or import duties',
                    'Customer decision to not proceed with shipping payment',
                    'Personal preference after ordering'
                  ].map((item, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-white/60 text-xs leading-[1.6]">
                      <div className="w-1 h-1 rounded-full bg-[#8A001A] mt-1.5 shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="bg-[#FFF8F0] border border-[#8A001A]/10 p-4 text-xs text-[#8A001A]/80 leading-[1.8]">
                Once an order is placed and processed, the product price is <strong className="font-semibold">non-refundable</strong>.
              </div>
            </div>
          </section>

          {/* Divider */}
          <div className="flex items-center gap-4">
            <div className="h-px flex-1 bg-[#000000]/[0.06]" />
            <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-[#1a1a1a]/30">Cancellations</span>
            <div className="h-px flex-1 bg-[#000000]/[0.06]" />
          </div>

          {/* ─── Cancellation Policy ─── */}
          <section className="space-y-6">
            <div>
              <span className="text-[80px] font-serif font-light text-[#000000]/[0.04] leading-none block -mb-8 select-none">03</span>
              <h2 className="text-xl md:text-2xl font-serif text-[#1a1a1a] tracking-tight relative">Cancellation Policy</h2>
            </div>
            <div className="space-y-4 text-[#1a1a1a]/70 text-sm md:text-[15px] leading-[1.85] font-light">
              <div className="bg-[#0a0a0a] p-6 md:p-8">
                <p className="text-[10px] font-bold tracking-[0.25em] uppercase text-[#8A001A] mb-3">Policy</p>
                <p className="text-white/70 text-sm leading-[1.85] font-light">
                  Once an order has been placed and processed, cancellations are <strong className="font-semibold text-white">not allowed</strong> under any circumstances.
                </p>
              </div>
              <p>
                Orders are immediately forwarded into processing and cannot be stopped, modified, or cancelled once confirmed.
              </p>
              <p className="text-[#1a1a1a]/50 text-xs font-light italic">
                We kindly request customers to be fully certain before placing an order.
              </p>
            </div>
          </section>

          {/* Divider */}
          <div className="flex items-center gap-4">
            <div className="h-px flex-1 bg-[#000000]/[0.06]" />
            <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-[#1a1a1a]/30">Exchange & Returns</span>
            <div className="h-px flex-1 bg-[#000000]/[0.06]" />
          </div>

          {/* ─── Exchange & Return Policy ─── */}
          <section className="space-y-6">
            <div>
              <span className="text-[80px] font-serif font-light text-[#000000]/[0.04] leading-none block -mb-8 select-none">04</span>
              <h2 className="text-xl md:text-2xl font-serif text-[#1a1a1a] tracking-tight relative">Exchange & Return Policy</h2>
            </div>
            <div className="space-y-4 text-[#1a1a1a]/70 text-sm md:text-[15px] leading-[1.85] font-light">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border border-[#000000]/[0.06] p-6 space-y-3">
                  <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#1a1a1a]">Exchanges</p>
                  <p className="text-xs text-[#1a1a1a]/60 leading-[1.8]">
                    Exchanges are only possible if a replacement item is available in stock. If a replacement is not available, exchanges cannot be processed.
                  </p>
                </div>
                <div className="border border-[#000000]/[0.06] p-6 space-y-3">
                  <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#1a1a1a]">Returns</p>
                  <p className="text-xs text-[#1a1a1a]/60 leading-[1.8]">
                    Returns are not accepted under any circumstances. Due to hygiene, handling, and international logistics standards, all products are final once dispatched for processing.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Divider */}
          <div className="flex items-center gap-4">
            <div className="h-px flex-1 bg-[#000000]/[0.06]" />
            <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-[#1a1a1a]/30">Expectations</span>
            <div className="h-px flex-1 bg-[#000000]/[0.06]" />
          </div>

          {/* ─── Product Expectations ─── */}
          <section className="space-y-6">
            <div>
              <span className="text-[80px] font-serif font-light text-[#000000]/[0.04] leading-none block -mb-8 select-none">05</span>
              <h2 className="text-xl md:text-2xl font-serif text-[#1a1a1a] tracking-tight relative">Product Expectations</h2>
            </div>
            <div className="space-y-4 text-[#1a1a1a]/70 text-sm md:text-[15px] leading-[1.85] font-light">
              <p>
                All products are sourced based on product listings, reference images, and available supplier information.
              </p>
              <p>
                We ensure that all details such as size charts, product descriptions, and reference images are shared as accurately as possible before purchase.
              </p>
              <div className="border-l-2 border-[#8A001A]/20 pl-6 space-y-3 mt-6">
                <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#1a1a1a]/40">Minor variations may occur due to</p>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    'Manufacturing differences',
                    'Fabric or material batches',
                    'Lighting in product images',
                    'International production variations'
                  ].map((item, idx) => (
                    <div key={idx} className="text-xs text-[#1a1a1a]/50 font-light border border-[#000000]/[0.04] p-3 text-center">
                      {item}
                    </div>
                  ))}
                </div>
                <p className="text-[#1a1a1a]/40 text-xs font-light italic">
                  These minor variations are normal in international products and will not be considered valid reasons for refunds or cancellations.
                </p>
              </div>
            </div>
          </section>

          {/* Divider */}
          <div className="flex items-center gap-4">
            <div className="h-px flex-1 bg-[#000000]/[0.06]" />
            <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-[#1a1a1a]/30">Responsibility</span>
            <div className="h-px flex-1 bg-[#000000]/[0.06]" />
          </div>

          {/* ─── Customer Responsibility ─── */}
          <section className="space-y-6">
            <div>
              <span className="text-[80px] font-serif font-light text-[#000000]/[0.04] leading-none block -mb-8 select-none">06</span>
              <h2 className="text-xl md:text-2xl font-serif text-[#1a1a1a] tracking-tight relative">Customer Responsibility</h2>
            </div>
            <div className="space-y-4 text-[#1a1a1a]/70 text-sm md:text-[15px] leading-[1.85] font-light">
              <p className="text-[10px] font-bold tracking-[0.15em] uppercase text-[#1a1a1a]">Customers are responsible for ensuring that:</p>
              <ul className="space-y-3">
                {[
                  'All shipping details (name, address, phone number) are entered correctly',
                  'They review product details before placing an order',
                  'They are available to receive deliveries',
                  'They understand pre-order timelines and international shipping conditions',
                  'Shipping payments are completed within the given deadline'
                ].map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <div className="w-5 h-5 border border-[#8A001A]/20 flex items-center justify-center shrink-0 text-[9px] font-bold text-[#8A001A]">
                      {idx + 1}
                    </div>
                    <span className="pt-0.5 text-xs text-[#1a1a1a]/60 leading-[1.8]">{item}</span>
                  </li>
                ))}
              </ul>
              <div className="bg-[#FFF8F0] border border-[#8A001A]/10 p-4 text-xs text-[#8A001A]/80 leading-[1.8] mt-4">
                If incorrect information is provided and results in delivery failure, delay, or loss of parcel, House of Avira will not be responsible.
              </div>
            </div>
          </section>

          {/* Divider */}
          <div className="flex items-center gap-4">
            <div className="h-px flex-1 bg-[#000000]/[0.06]" />
            <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-[#1a1a1a]/30">After Dispatch</span>
            <div className="h-px flex-1 bg-[#000000]/[0.06]" />
          </div>

          {/* ─── Responsibility After Dispatch ─── */}
          <section className="space-y-6">
            <div>
              <span className="text-[80px] font-serif font-light text-[#000000]/[0.04] leading-none block -mb-8 select-none">07</span>
              <h2 className="text-xl md:text-2xl font-serif text-[#1a1a1a] tracking-tight relative">Responsibility After Dispatch</h2>
            </div>
            <div className="space-y-4 text-[#1a1a1a]/70 text-sm md:text-[15px] leading-[1.85] font-light">
              <p>
                Once an order has been shipped and handed over to the courier partner, responsibility for the parcel lies with the shipping carrier.
              </p>
              <div className="bg-[#0a0a0a] p-6 md:p-8 space-y-4">
                <p className="text-[10px] font-bold tracking-[0.25em] uppercase text-[#8A001A] mb-3">House of Avira is not responsible for</p>
                <ul className="space-y-2.5">
                  {[
                    'Lost parcels',
                    'Delays in transit',
                    'Damage after dispatch',
                    'Delivery failures caused by courier handling'
                  ].map((item, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-white/60 text-xs leading-[1.6]">
                      <div className="w-1 h-1 rounded-full bg-[#8A001A] mt-1.5 shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <p className="text-[#1a1a1a]/50 text-xs font-light">
                In such cases, customers must directly contact the courier service using the provided tracking details. We will, however, support wherever possible with tracking assistance.
              </p>
            </div>
          </section>

          {/* Divider */}
          <div className="flex items-center gap-4">
            <div className="h-px flex-1 bg-[#000000]/[0.06]" />
            <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-[#1a1a1a]/30">Unboxing</span>
            <div className="h-px flex-1 bg-[#000000]/[0.06]" />
          </div>

          {/* ─── Unboxing & Claim Policy ─── */}
          <section className="space-y-6">
            <div>
              <span className="text-[80px] font-serif font-light text-[#000000]/[0.04] leading-none block -mb-8 select-none">08</span>
              <h2 className="text-xl md:text-2xl font-serif text-[#1a1a1a] tracking-tight relative">Unboxing & Claim Policy</h2>
            </div>
            <div className="space-y-4 text-[#1a1a1a]/70 text-sm md:text-[15px] leading-[1.85] font-light">
              <p>In case of any issue with a delivered product, customers must provide:</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {[
                  { num: '1', title: 'Unboxing Video', desc: 'A clear unboxing video of the package' },
                  { num: '2', title: 'Continuous Recording', desc: 'Without cuts or edits from start to finish' },
                  { num: '3', title: 'Proof of Issue', desc: 'Issue clearly shown within the video' }
                ].map((item) => (
                  <div key={item.num} className="border border-[#000000]/[0.06] p-6 text-center space-y-3">
                    <div className="w-8 h-8 border border-[#8A001A]/20 flex items-center justify-center mx-auto text-xs font-bold text-[#8A001A]">
                      {item.num}
                    </div>
                    <p className="text-[10px] font-bold tracking-[0.15em] uppercase text-[#1a1a1a]">{item.title}</p>
                    <p className="text-[10px] text-[#1a1a1a]/40 leading-[1.6]">{item.desc}</p>
                  </div>
                ))}
              </div>
              <div className="bg-[#FFF8F0] border border-[#8A001A]/10 p-4 text-xs text-[#8A001A]/80 leading-[1.8]">
                Claims raised without proper unboxing evidence may not be accepted. This is required to ensure fair handling of all customer concerns.
              </div>
            </div>
          </section>

          {/* ─── Final Note ─── */}
          <section className="border-t border-[#000000]/[0.06] pt-16 space-y-6">
            <div className="text-center">
              <Heart className="w-5 h-5 text-[#8A001A] mx-auto mb-6" />
              <h2 className="text-xl md:text-2xl font-serif text-[#1a1a1a] tracking-tight mb-6">Final Note</h2>
              <div className="max-w-xl mx-auto space-y-4 text-[#1a1a1a]/60 text-xs md:text-sm leading-[1.9] font-light">
                <p>
                  We value transparency and customer trust above everything else.
                </p>
                <p>
                  House of Avira operates on a pre-order model with international products, and every order goes through multiple stages including sourcing, international shipping, customs clearance, and domestic delivery.
                </p>
              </div>

              <div className="mt-8 bg-[#0a0a0a] p-6 md:p-8 max-w-xl mx-auto text-left">
                <p className="text-[10px] font-bold tracking-[0.25em] uppercase text-[#8A001A] mb-4">We kindly ask customers to place an order only if they are fully comfortable with</p>
                <ul className="space-y-2.5">
                  {[
                    'Pre-order processing timelines',
                    'Variable shipping costs',
                    'Customs charges',
                    'Possible delays due to external factors'
                  ].map((item, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-white/60 text-xs leading-[1.6]">
                      <div className="w-1 h-1 rounded-full bg-[#8A001A] mt-1.5 shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-10 space-y-2">
                <p className="text-xs text-[#1a1a1a]/50 font-light">
                  By placing an order, you confirm that you have read and agreed to all policies mentioned above.
                </p>
                <p className="text-xs text-[#1a1a1a]/30 font-light">
                  Thank you for trusting House of Avira <span className="text-[#8A001A]">💗</span>
                </p>
              </div>
            </div>
          </section>
        </div>

        {/* Navigation */}
        <div className="mt-20 pt-12 border-t border-[#000000]/[0.06] flex justify-between items-center">
          <Link href="/order-info/shipping" className="flex items-center gap-2 text-[10px] font-bold tracking-[0.2em] uppercase text-[#1a1a1a]/40 hover:text-[#1a1a1a] transition-colors">
            <ChevronLeft className="w-3 h-3" />
            Shipping & Delivery
          </Link>
          <Link href="/order-info" className="flex items-center gap-2 text-[10px] font-bold tracking-[0.2em] uppercase text-[#8A001A] hover:gap-3 transition-all">
            Back to Overview
          </Link>
        </div>
      </article>
    </div>
  );
}
