'use client';

import { useState } from 'react';
import { Plus, Minus } from 'lucide-react';

const faqs = [
  {
    question: "Why can't you tell me the shipping cost upfront?",
    answer: "We ship in batches. The international cost is split equally among all customers based on the total package weight. Since we collect all orders first and then ship together, the exact per-customer cost is only known when the full batch is packed. This ensures you're charged accurately — never based on a rough estimate."
  },
  {
    question: "Is COD (Cash on Delivery) available?",
    answer: "No, COD is not available at House of Avira. We deal with imported products sourced internationally on your behalf — payment must be received before the order can be placed with our suppliers. We accept GPay, Paytm, UPI, bank transfers, and card payments."
  },
  {
    question: "How long will my order take?",
    answer: "It depends on the shipping mode. Air shipping takes approximately 15 days from dispatch. Sea shipping takes 2–3 months. The total timeline includes batch collection time, international transit, customs clearance, and domestic delivery. All timelines are estimates — delays can occur due to customs and logistics."
  },
  {
    question: "Can I cancel my order if I change my mind?",
    answer: "No. Once an order is placed, it is submitted to our suppliers immediately and cannot be cancelled, refunded, or exchanged. This applies even if there are delays, even if the shipping cost is higher than expected, and even if the shipping invoice has not yet been paid. Please only order if you are fully committed to the purchase."
  },
  {
    question: "What if I don't pay the shipping invoice on time?",
    answer: "If the shipping invoice is not paid by the specified deadline, your parcel will not be shipped. No refund will be issued for your product payment, as the order has already been placed with our suppliers on your behalf. Please pay shipping invoices promptly when they are sent."
  },
  {
    question: "Are customs and duty charges included in the shipping invoice?",
    answer: "Yes. India's customs duties and GST on imports are calculated and included in your international shipping invoice. You will receive a full itemised breakdown showing the shipping cost, customs duty, and GST before you are required to pay anything."
  },
  {
    question: "My order is delayed — can I get a refund?",
    answer: "No. Delivery delays are not grounds for a refund or cancellation. International shipping and customs timelines can vary significantly due to factors completely outside our control. We ask that you only place an order if you are patient and comfortable with variable timelines. We will always keep you updated on your order's progress."
  }
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleAccordion = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section 
      className="w-full relative py-20 px-6 md:px-12 bg-cover bg-center bg-no-repeat overflow-hidden border-t-[3px] border-[#000000]"
      style={{ backgroundImage: "url('/images/faq-bg-mobile.png')" }}
    >
      {/* Light overlay to ensure text readability against the busy background */}
      <div className="absolute inset-0 bg-white/40 backdrop-blur-[1px]"></div>

      <div className="max-w-3xl mx-auto relative z-10 flex flex-col items-center">
        {/* Title Group */}
        <div className="text-center mb-10">
          <h2 className="font-perandory text-4xl md:text-5xl lg:text-7xl font-bold tracking-widest uppercase text-black mb-4" style={{ textShadow: '2px 2px 0px white' }}>
            QUESTIONS?
          </h2>
          <h2 className="font-aston-script capitalize text-5xl md:text-6xl lg:text-8xl tracking-normal text-[#8A001A] leading-none" style={{ textShadow: '2px 2px 0px white' }}>
            ANSWERED.
          </h2>
        </div>

        {/* Accordion Container */}
        <div className="w-full border-t border-l border-r border-black bg-white shadow-2xl">
          {faqs.map((faq, index) => (
            <div 
              key={index} 
              className="border-b border-black last:border-b-2"
            >
              <button
                onClick={() => toggleAccordion(index)}
                className="w-full flex justify-between items-center p-5 text-left bg-white hover:bg-[#FAFAFA] transition-colors"
              >
                <span className="font-dm-sans font-bold text-base md:text-lg text-black pr-4">
                  {faq.question}
                </span>
                <span className="text-black flex-shrink-0">
                  {openIndex === index ? (
                    <Minus className="w-6 h-6" strokeWidth={1.5} />
                  ) : (
                    <Plus className="w-6 h-6" strokeWidth={1.5} />
                  )}
                </span>
              </button>
              
              <div 
                className={`overflow-hidden transition-all duration-300 ease-in-out bg-[#FAFAFA] ${
                  openIndex === index ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
                }`}
              >
                <div className="p-5 pt-2 text-sm md:text-base font-dm-sans text-black/80 leading-relaxed border-t border-black/5">
                  {faq.answer}
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Bottom red strip as seen in the reference image */}
        <div className="w-full mt-10 bg-[#e60000] text-white py-3 px-4 flex justify-between items-center overflow-hidden border-[3px] border-black">
           <div className="flex animate-marquee-slow whitespace-nowrap">
             <span className="font-dm-sans font-bold text-sm md:text-base tracking-widest uppercase mx-4">
               • CURATED GLOBALLY
             </span>
             <span className="font-dm-sans font-bold text-sm md:text-base tracking-widest uppercase mx-4">
               • NO IMITATIONS
             </span>
             <span className="font-dm-sans font-bold text-sm md:text-base tracking-widest uppercase mx-4">
               • CURATED GLOBALLY
             </span>
             <span className="font-dm-sans font-bold text-sm md:text-base tracking-widest uppercase mx-4">
               • NO IMITATIONS
             </span>
           </div>
        </div>
      </div>
    </section>
  );
}
