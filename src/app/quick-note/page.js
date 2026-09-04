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
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-perandory font-bold tracking-tight text-black mb-6">
            A little note before you check out 🤍
          </h1>
          <div className="w-16 h-0.5 bg-[#8A001A] mx-auto mb-6"></div>
        </div>

        {/* Content Section - Letter Format */}
        <div className="space-y-6 font-dm-sans text-[15px] md:text-[16px] text-gray-700 leading-relaxed max-w-2xl mx-auto">
          <p>
            We know there are a few confirmations below, so we just wanted to explain why we ask you to go through them.
          </p>
          
          <p>
            House of Avira works a little differently from a regular store. We operate on a pre-order basis, which means the products you see on our website aren't sitting in a warehouse waiting to be shipped. When you place an order, we source that product specifically for you. 🫶🏻
          </p>
          
          <p>
            Because each order involves international sourcing, shipping, customs, taxes and careful packaging, we need to make sure you're comfortable with how the process works before we begin arranging your order. These confirmations are simply our way of being completely transparent with you from the very beginning — there are no hidden terms or surprises later.
          </p>
          
          <p>
            We'll keep you updated throughout the process, and before your order is dispatched, we'll also share pictures/videos wherever applicable so you know what's being sent to you. We take a lot of care with every order because, just like you, we want your package to reach you safely and exactly as expected. 🤍
          </p>
          
          <p>
            You're also not locked in immediately — cancellations can be requested within the initial cancellation window, before your order moves further into the sourcing process. After that point, since your product has already been arranged specifically for you, cancellations, refunds and exchanges generally aren't possible unless there is an issue from our end.
          </p>
          
          <p>
            So please take a moment to read the confirmations below. If you're happy with our pre-order process, simply tick the boxes and you're all set! ✨
          </p>
          
          <p className="font-bold pt-4 text-black text-center text-lg md:text-xl font-perandory">
            Thank you for trusting us and choosing to shop with House of Avira. Every order is genuinely sourced with you in mind. 🤍
          </p>
        </div>

        {/* Helpful Resources Section */}
        <div className="mt-16 pt-10 border-t border-gray-100">
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
