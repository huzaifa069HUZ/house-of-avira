'use client';

import Link from 'next/link';
import { ArrowLeft, Check, Plane, Receipt, FileText, Truck, Package } from 'lucide-react';
import { useEffect } from 'react';

export default function OrderProcessPage() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) entry.target.classList.add('animate-in');
        });
      },
      { threshold: 0.1 }
    );
    document.querySelectorAll('.fade-up').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-[#1a1c1c] font-sans antialiased flex flex-col pt-24 md:pt-32">
      <style jsx>{`
        .fade-up {
          opacity: 0;
          transform: translateY(40px);
          transition: opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), transform 0.8s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .fade-up.animate-in { opacity: 1; transform: translateY(0); }
      `}</style>
      
      <main className="flex-grow px-4 md:px-16 max-w-[1440px] mx-auto w-full">
        {/* Hero Section */}
        <section className="text-center py-10 md:py-20 fade-up">
          <div className="mb-4 flex items-center justify-center gap-2">
            <Link href="/order-info" className="flex items-center gap-2 text-gray-600 hover:opacity-70 transition-opacity cursor-pointer">
              <ArrowLeft className="w-5 h-5" />
              <span className="text-xs font-semibold tracking-widest uppercase">Return to Overview</span>
            </Link>
          </div>
          <h2 className="font-perandory text-4xl md:text-6xl lg:text-7xl uppercase mb-2">YOUR JOURNEY WITH US</h2>
          <p className="font-aston-script text-[#8A001A] text-4xl md:text-5xl lg:text-6xl mb-6">Personal & Transparent</p>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">We want you to feel confident at every stage of your order.</p>
        </section>

        {/* Payment Step 1 */}
        <section className="py-10 fade-up">
          <div className="flex items-center gap-4 mb-8">
            <span className="font-perandory text-5xl md:text-6xl font-bold">01</span>
            <div>
              <h3 className="text-xs text-[#8A001A] font-bold uppercase tracking-widest mb-1">Step One</h3>
              <h4 className="font-perandory text-2xl md:text-3xl font-bold uppercase">Securing Your Piece</h4>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Product Price Card */}
            <div className="border border-gray-200 rounded p-6 md:p-8 bg-white flex flex-col justify-center">
              <h5 className="text-xs uppercase mb-4 font-bold tracking-widest">THE PRODUCT VALUE</h5>
              <p className="text-gray-600 mb-6">Your journey begins with the selection of your curated piece. This first payment covers the actual product price as listed on our website.</p>
              <div className="space-y-4">
                <p className="text-[#8A001A] font-semibold">What happens next?</p>
                <p className="text-gray-600">Once confirmed, our team begins the dedicated process of securing your item and preparing it for its international transit.</p>
              </div>
            </div>
            {/* Logistics Inclusions Card */}
            <div className="border border-gray-200 rounded p-6 md:p-8 bg-white">
              <h5 className="text-xs uppercase mb-4 font-bold tracking-widest">What's Included Now</h5>
              <p className="text-gray-600 mb-6">Securing your piece ensures it enters our managed logistics pipeline immediately.</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <h6 className="text-xs uppercase mb-4 font-bold tracking-widest">Priority Handling:</h6>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-[#8A001A]" />
                      <span>Sourcing & Procurement</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-[#8A001A]" />
                      <span>Initial Quality Check</span>
                    </li>
                  </ul>
                </div>
                <div>
                  <h6 className="text-xs uppercase mb-4 font-bold tracking-widest">Peace of Mind:</h6>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-[#8A001A]" />
                      <span>Reservation Protection</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-[#8A001A]" />
                      <span>Dedicated Order Support</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Payment Step 2 */}
        <section className="py-10 border-t border-gray-200 mt-10 pt-10 fade-up">
          <div className="flex items-center gap-4 mb-8">
            <span className="font-perandory text-5xl md:text-6xl font-bold">02</span>
            <div>
              <h3 className="text-xs text-[#8A001A] font-bold uppercase tracking-widest mb-1">Step Two</h3>
              <h4 className="font-perandory text-2xl md:text-3xl font-bold uppercase">Bringing It Home</h4>
            </div>
          </div>
          <p className="text-lg text-gray-600 mb-8 max-w-3xl">Once your curated piece arrives at our international warehouse, we calculate the final logistics and delivery costs specifically for your order.</p>
          
          {/* Important Policy Box */}
          <div className="bg-black text-white p-6 md:p-8 rounded mb-10 text-center">
            <h5 className="text-xs text-[#8A001A] uppercase mb-4 font-bold tracking-widest">The Shipping Invoice</h5>
            <p className="text-sm md:text-base">A detailed cost breakdown for shipping and logistics will be sent directly to your <span className="text-[#8A001A] font-bold underline uppercase tracking-wider">WhatsApp and Email</span>. Payment of this second invoice is required to secure your final delivery.</p>
          </div>

          {/* Shipping Types Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-12">
            <div className="border border-gray-200 rounded p-6 flex flex-col items-center justify-center text-center hover:border-black transition-colors cursor-pointer bg-white h-40">
              <Plane className="w-8 h-8 mb-4 text-[#8A001A]" />
              <span className="text-[10px] md:text-xs font-bold tracking-widest uppercase">Global Transit<br/>Calculations</span>
            </div>
            <div className="border border-gray-200 rounded p-6 flex flex-col items-center justify-center text-center hover:border-black transition-colors cursor-pointer bg-white h-40">
              <Receipt className="w-8 h-8 mb-4 text-[#8A001A]" />
              <span className="text-[10px] md:text-xs font-bold tracking-widest uppercase">Customs &<br/>Clearance Services</span>
            </div>
            <div className="border border-gray-200 rounded p-6 flex flex-col items-center justify-center text-center hover:border-black transition-colors cursor-pointer bg-white h-40">
              <FileText className="w-8 h-8 mb-4 text-[#8A001A]" />
              <span className="text-[10px] md:text-xs font-bold tracking-widest uppercase">Statutory Import<br/>Charges</span>
            </div>
            <div className="border border-gray-200 rounded p-6 flex flex-col items-center justify-center text-center hover:border-black transition-colors cursor-pointer bg-white h-40 col-span-2 md:col-span-1 md:col-start-2">
              <Truck className="w-8 h-8 mb-4 text-[#8A001A]" />
              <span className="text-[10px] md:text-xs font-bold tracking-widest uppercase">Final Mile<br/>Delivery</span>
            </div>
            <div className="border border-gray-200 rounded p-6 flex flex-col items-center justify-center text-center hover:border-black transition-colors cursor-pointer bg-white h-40 col-span-2 md:col-span-1">
              <Package className="w-8 h-8 mb-4 text-[#8A001A]" />
              <span className="text-[10px] md:text-xs font-bold tracking-widest uppercase">Careful Handling<br/>& Logistics</span>
            </div>
          </div>

          {/* Steps Progress indicator */}
          <div className="mb-16">
            <h5 className="text-xs uppercase mb-6 font-bold tracking-widest text-center">What happens once we calculate the final costs?</h5>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="bg-black text-white py-4 px-6 rounded-full flex items-center gap-3 flex-1 justify-center opacity-80 hover:opacity-100 transition-opacity">
                <span className="font-bold text-[#8A001A] text-lg">01</span>
                <span className="text-[11px] font-bold tracking-widest uppercase">Your Total</span>
              </div>
              <div className="bg-black text-white py-4 px-6 rounded-full flex items-center gap-3 flex-1 justify-center opacity-80 hover:opacity-100 transition-opacity">
                <span className="font-bold text-[#8A001A] text-lg">02</span>
                <span className="text-[11px] font-bold tracking-widest uppercase">The Details</span>
              </div>
              <div className="bg-black text-white py-4 px-6 rounded-full flex items-center gap-3 flex-1 justify-center opacity-80 hover:opacity-100 transition-opacity">
                <span className="font-bold text-[#8A001A] text-lg">03</span>
                <span className="text-[11px] font-bold tracking-widest uppercase">The Timeline</span>
              </div>
            </div>
          </div>

          {/* Payment Policy Disclaimer */}
          <div className="text-center max-w-3xl mx-auto border-t border-gray-200 pt-10 mb-12">
            <h5 className="text-xs text-[#8A001A] uppercase mb-4 font-bold tracking-widest">Our Promise on Fees</h5>
            <p className="text-sm text-gray-600 italic leading-relaxed">
              We believe in full transparency. Shipping and mandatory fees are calculated precisely based on your order's specific journey. We'll always guide you through the final payment schedule to ensure your piece arrives safely and promptly at your door.
            </p>
          </div>
          
          <div className="flex justify-center mt-12 pb-24">
            <Link href="/order-info/shipping" className="bg-[#8A001A] text-white text-xs font-bold uppercase py-4 px-12 rounded hover:bg-[#a1001e] transition-colors tracking-widest shadow-lg shadow-[#8A001A]/20">
              Learn about Delivery
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
