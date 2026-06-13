'use client';

import Link from 'next/link';
import { ChevronRight, ShoppingBag, Truck, FileText, Heart } from 'lucide-react';

const sections = [
  {
    title: 'Order Process',
    description: 'Understand how our pre-order system works, payment structure, slot fees, and what happens after you place an order.',
    href: '/order-info/order-process',
    icon: ShoppingBag,
    number: '01'
  },
  {
    title: 'Shipping & Delivery',
    description: 'International shipping, domestic delivery, customs, shipping calculations, delivery timelines, and shipping estimates.',
    href: '/order-info/shipping',
    icon: Truck,
    number: '02'
  },
  {
    title: 'Policies & Guidelines',
    description: 'Refunds, exchanges, cancellations, product expectations, customer responsibilities, and all store policies.',
    href: '/order-info/policies',
    icon: FileText,
    number: '03'
  }
];

export default function OrderInfoPage() {
  return (
    <div className="min-h-screen bg-[#FAFAF8] pt-24">

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(135deg,#0a0a0a_0%,#1a1a1a_50%,#0a0a0a_100%)]" />
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'1\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")' }} />
        
        <div className="relative max-w-4xl mx-auto px-6 md:px-12 py-20 md:py-32 text-center">
          {/* Eyebrow */}
          <div className="inline-flex items-center gap-2 mb-8">
            <div className="h-px w-8 bg-[#8A001A]" />
            <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-[#8A001A]">Important Information</span>
            <div className="h-px w-8 bg-[#8A001A]" />
          </div>
          
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-serif text-white tracking-tight leading-[1.1] mb-8">
            Read Before Placing<br />
            <span className="italic text-[#8A001A]">Your Order</span>
          </h1>

          <div className="w-12 h-px bg-white/20 mx-auto mb-8" />

          <p className="text-white/60 text-sm md:text-base leading-relaxed max-w-2xl mx-auto font-light">
            Thank you for choosing House of Avira <span className="text-[#8A001A]">💗</span>
          </p>
          <p className="text-white/40 text-xs md:text-sm leading-relaxed max-w-2xl mx-auto mt-4 font-light">
            We kindly request that you read this page carefully before placing an order.
          </p>
        </div>
      </section>

      {/* Introduction */}
      <section className="max-w-3xl mx-auto px-6 md:px-12 py-16 md:py-24">
        <div className="space-y-6 text-[#1a1a1a]/70 text-sm md:text-[15px] leading-[1.85] font-light">
          <p>
            House of Avira curates international trends and worldwide aesthetics, bringing global styles and creative finds straight to your doorstep through a <strong className="font-semibold text-[#1a1a1a]">pre-order experience</strong>.
          </p>
          <p>
            Since products are sourced internationally, shipping costs, customs charges, delivery timelines, and logistics fees may vary depending on the product, shipping conditions, customs requirements, and economic factors at the time of shipment.
          </p>
          <p>
            We believe in <strong className="font-semibold text-[#1a1a1a]">complete transparency</strong> and want every customer to fully understand our ordering process before making a purchase.
          </p>

          <div className="bg-[#0a0a0a] text-white/80 p-6 md:p-8 mt-8 text-xs md:text-sm leading-[1.9] space-y-3">
            <p className="text-[10px] font-bold tracking-[0.25em] uppercase text-[#8A001A] mb-4">By placing an order, you acknowledge</p>
            <p className="text-white/50 font-light">
              That you have read, understood, and agreed to all information and policies listed below.
            </p>
          </div>

          <div className="mt-8">
            <p className="text-[10px] font-bold tracking-[0.25em] uppercase text-[#1a1a1a] mb-5">Please place an order only if you are comfortable with:</p>
            <ul className="space-y-3">
              {[
                'Variable shipping costs',
                'Customs procedures and clearance requirements',
                'Estimated delivery timelines',
                'Possible delays caused by factors outside our control',
                'Our payment structure and store policies'
              ].map((item, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <div className="w-1 h-1 rounded-full bg-[#8A001A] mt-2 shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Section Cards */}
      <section className="max-w-5xl mx-auto px-6 md:px-12 pb-24 md:pb-32">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          {sections.map((section) => {
            const Icon = section.icon;
            return (
              <Link
                key={section.number}
                href={section.href}
                className="group relative bg-white border border-[#000000]/[0.06] p-8 md:p-10 flex flex-col transition-all duration-500 hover:border-[#000000]/10 hover:shadow-[0_8px_40px_rgba(0,0,0,0.06)]"
              >
                {/* Number */}
                <span className="text-[80px] md:text-[100px] font-serif font-light text-[#000000]/[0.03] leading-none absolute top-4 right-6 select-none">
                  {section.number}
                </span>

                <div className="relative z-10 flex flex-col h-full">
                  {/* Icon */}
                  <div className="w-10 h-10 border border-[#000000]/10 flex items-center justify-center mb-8 group-hover:border-[#8A001A]/30 group-hover:bg-[#8A001A]/[0.03] transition-all duration-500">
                    <Icon className="w-4 h-4 text-[#000000]/40 group-hover:text-[#8A001A] transition-colors duration-500" />
                  </div>

                  {/* Title */}
                  <h3 className="text-sm font-bold tracking-[0.1em] uppercase text-[#1a1a1a] mb-4">
                    {section.title}
                  </h3>

                  {/* Description */}
                  <p className="text-xs text-[#1a1a1a]/50 leading-[1.8] font-light flex-1 mb-8">
                    {section.description}
                  </p>

                  {/* CTA */}
                  <div className="flex items-center gap-2 text-[10px] font-bold tracking-[0.2em] uppercase text-[#8A001A]">
                    <span>Read More</span>
                    <ChevronRight className="w-3 h-3 group-hover:translate-x-1 transition-transform duration-300" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Bottom Note */}
      <section className="border-t border-[#000000]/[0.06]">
        <div className="max-w-3xl mx-auto px-6 md:px-12 py-16 md:py-20 text-center">
          <Heart className="w-4 h-4 text-[#8A001A] mx-auto mb-6" />
          <p className="text-xs md:text-sm text-[#1a1a1a]/50 leading-[1.9] font-light max-w-xl mx-auto">
            We value transparency and customer trust above everything else. By placing an order, you confirm that you have read and agreed to all policies.
          </p>
          <p className="text-xs text-[#1a1a1a]/30 mt-6 font-light">
            Thank you for trusting House of Avira <span className="text-[#8A001A]">💗</span>
          </p>
        </div>
      </section>
    </div>
  );
}
