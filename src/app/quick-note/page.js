import React from 'react';
import Link from 'next/link';
import OpenChatbotButton from '@/components/OpenChatbotButton';

export const metadata = {
  title: "A Quick Note Before You Place Your Order | House of Avira",
  description: "A simple guide to understanding our pre-order process, timelines, and why we ask you to confirm details before checkout.",
};

export default function QuickNotePage() {
  return (
    <div className="w-full bg-[#FAFAFA] min-h-screen py-16 px-4 md:px-8">
      <div className="max-w-3xl mx-auto bg-white p-8 md:p-12 lg:p-16 rounded-3xl shadow-sm border border-black/5">
        
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-perandory font-bold tracking-tight text-black mb-6">
            A quick note before you place your order
          </h1>
          <div className="w-16 h-0.5 bg-[#8A001A] mx-auto mb-6"></div>
          <p className="text-gray-600 font-dm-sans text-lg leading-relaxed">
            We want your shopping experience to be as exciting and stress-free as possible. 
            Because we operate a little differently from traditional fast-fashion stores, 
            we ask you to confirm a few details at checkout. Here is why.
          </p>
        </div>

        {/* Content Section */}
        <div className="space-y-12 font-dm-sans text-gray-700">
          
          {/* Point 1 */}
          <section className="group">
            <h2 className="text-xl md:text-2xl font-perandory font-bold tracking-widest uppercase text-black mb-4 flex items-center gap-3">
              <span className="text-[#8A001A]">01.</span> The Pre-Order Model
            </h2>
            <p className="leading-relaxed text-[15px] md:text-[16px] text-gray-600">
              House of Avira operates predominantly on a <strong>pre-order basis</strong>. This means that instead of holding massive amounts of inventory that could go to waste, we curate and produce pieces specifically for the orders we receive. This helps us remain sustainable and offer you exclusive, high-quality aesthetics without the fast-fashion markup. Because the items are crafted or sourced after you order, they aren't available for immediate next-day dispatch.
            </p>
          </section>

          {/* Point 2 */}
          <section className="group">
            <h2 className="text-xl md:text-2xl font-perandory font-bold tracking-widest uppercase text-black mb-4 flex items-center gap-3">
              <span className="text-[#8A001A]">02.</span> Delivery Timelines
            </h2>
            <p className="leading-relaxed text-[15px] md:text-[16px] text-gray-600">
              We ask you to acknowledge that delivery timelines are <strong>estimates</strong>. Since our items are often imported or made-to-order, factors like international customs, freight delays, or production schedules are outside of our direct control. We work tirelessly to get your pieces to you as fast as possible, but we want you to have realistic expectations so you aren't left wondering where your package is!
            </p>
          </section>

          {/* Point 3 */}
          <section className="group">
            <h2 className="text-xl md:text-2xl font-perandory font-bold tracking-widest uppercase text-black mb-4 flex items-center gap-3">
              <span className="text-[#8A001A]">03.</span> Shipping Charges
            </h2>
            <p className="leading-relaxed text-[15px] md:text-[16px] text-gray-600">
              We split the payment process to make things transparent. When you checkout, you are only paying for the <strong>products</strong>. Once your curated pieces arrive at our local fulfillment center and are thoroughly quality-checked, we will calculate the exact shipping cost based on the total weight of your package. We will then send you a secure link to pay the shipping fee right before final dispatch. We ask you to tick those boxes so you know this step is coming and there are no surprise fees!
            </p>
          </section>
        </div>

        {/* Reassurance & Links Section */}
        <div className="mt-16 pt-10 border-t border-gray-100">
          <div className="bg-[#8A001A]/5 rounded-2xl p-6 md:p-8 text-center mb-10">
            <h3 className="text-xl font-perandory font-bold text-[#8A001A] mb-3">Shop with Absolute Confidence</h3>
            <p className="text-sm text-gray-600 font-dm-sans leading-relaxed">
              We are a community-first brand. We ask for these confirmations not to scare you, but to ensure complete transparency. 
              We want you to know exactly how we work so you can sit back, relax, and look forward to receiving your new favorite pieces!
            </p>
          </div>

          {/* Helpful Links Grid */}
          <h4 className="text-sm font-bold tracking-widest uppercase text-black text-center mb-6 font-dm-sans">Helpful Resources</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <Link href="/how-it-works" className="flex flex-col items-center justify-center p-4 border border-gray-200 rounded-xl hover:border-[#8A001A] hover:shadow-sm transition-all group">
              <span className="text-xs font-bold tracking-wider uppercase text-gray-600 group-hover:text-[#8A001A] font-dm-sans">How it Works</span>
            </Link>
            <Link href="/order-info" className="flex flex-col items-center justify-center p-4 border border-gray-200 rounded-xl hover:border-[#8A001A] hover:shadow-sm transition-all group">
              <span className="text-xs font-bold tracking-wider uppercase text-gray-600 group-hover:text-[#8A001A] font-dm-sans">Order Guide</span>
            </Link>
            <Link href="/policies" className="flex flex-col items-center justify-center p-4 border border-gray-200 rounded-xl hover:border-[#8A001A] hover:shadow-sm transition-all group">
              <span className="text-xs font-bold tracking-wider uppercase text-gray-600 group-hover:text-[#8A001A] font-dm-sans">Policies</span>
            </Link>
            <OpenChatbotButton />
          </div>
        </div>

        {/* Action Button */}
        <div className="mt-12 flex justify-center">
          <Link href="/catalogue" className="bg-black text-white px-10 py-3 rounded-xl font-aston-script text-2xl md:text-3xl hover:bg-[#8A001A] hover:-translate-y-1 transition-all duration-300 shadow-md">
            Continue Shopping
          </Link>
        </div>

      </div>
    </div>
  );
}
