'use client';

import { useState } from 'react';
import { Plus, Minus } from 'lucide-react';

const faqs = [
  {
    question: "How does the two-stage pricing work?",
    answer: "You pay the product price at checkout. Once your item arrives at our local hub from our international warehouses, we will bill you for the exact international freight and customs duties before final delivery."
  },
  {
    question: "How long will my order take to arrive?",
    answer: "Since our items are imported directly and operate on a pre-order basis, standard delivery usually takes between 12-20 business days."
  },
  {
    question: "Do you accept returns or exchanges?",
    answer: "Because items are imported specifically for you, we only accept returns or exchanges for defective or incorrect items within 7 days of delivery."
  },
  {
    question: "Can I cancel my order?",
    answer: "You can cancel your order within 24 hours of placing it. After that, the processing with our international partners begins and cancellations are no longer possible."
  },
  {
    question: "Where do you ship from?",
    answer: "Our products are curated globally and shipped directly from our international partners to our local hubs before being dispatched to your doorstep."
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
          <h2 className="text-4xl md:text-6xl lg:text-7xl font-perandory font-bold tracking-tighter uppercase text-[#000000] leading-none mb-2" style={{ textShadow: '2px 2px 0px white' }}>
            QUESTIONS?
          </h2>
          <h2 className="text-4xl md:text-6xl lg:text-7xl font-perandory font-bold tracking-tighter uppercase text-[#e60000] leading-none" style={{ textShadow: '2px 2px 0px white' }}>
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
