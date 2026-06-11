'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export default function CampaignAndGrid() {
  const containerRef = useRef(null);
  const campaignRef = useRef(null);
  const gridRef = useRef(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      // Pin the campaign section while the grid slides up over it
      ScrollTrigger.create({
        trigger: containerRef.current,
        start: "top top",
        end: "bottom bottom",
        pin: campaignRef.current,
        pinSpacing: false,
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const items = [
    { title: "T-SHIRTS", img: "/top.png", bg: "bg-[#F9F9F9]" },
    { title: "SHORTS AND BERMUDAS", img: "/skirt.png", bg: "bg-[#0A0A0A]" },
    { title: "TOPS AND BODYSUITS", img: "/boots.png", bg: "bg-[#F9F9F9]" },
    { title: "TROUSERS", img: "/trousers.png", bg: "bg-[#0A0A0A]" }
  ];

  return (
    <div ref={containerRef} className="relative w-full">
      {/* Soft Silhouettes Campaign Section (Pinned) */}
      <section ref={campaignRef} className="h-[80vh] md:h-[100vh] w-full overflow-hidden relative z-0">
        <div className="w-full h-full origin-bottom">
          <img src="/section.png" alt="Campaign" className="w-full h-full object-cover" />
        </div>
        <div className="absolute inset-0 bg-black/20" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center px-6">
          <h2 className="font-serif text-4xl md:text-7xl mb-6 drop-shadow-md">
            Soft silhouettes.<br />Bold presence.
          </h2>
          <a href="#" className="border-b border-white pb-1 text-xs uppercase tracking-widest hover:opacity-70 transition-opacity drop-shadow-md">
            Explore the Campaign
          </a>
        </div>
      </section>

      {/* 4-Grid Section (Slides over pinned campaign) */}
      <section ref={gridRef} className="w-full relative z-10 bg-white pt-2">
        {/* Mobile: 2x2 Grid with Text inside. Desktop: 4x1 Flex with images */}
        <div className="grid grid-cols-2 md:flex md:flex-row w-full md:h-[70vh]">
          {items.map((item, idx) => (
            <div
              key={idx}
              className={`w-full md:w-1/4 flex flex-col md:justify-end border-b md:border-b-0 border-r md:border-r-0 border-[#000000]/10`}
            >
              <div className={`w-full aspect-[4/5] md:h-full flex items-center justify-center overflow-hidden p-4 md:p-6 ${item.bg}`}>
                <img
                  src={item.img}
                  alt={item.title}
                  className="w-[85%] h-[85%] object-contain hover:scale-105 transition-transform duration-700"
                />
              </div>
              {/* Mobile text (hidden on desktop) */}
              <div className="md:hidden w-full p-3 bg-white">
                <h3 className="font-sans font-bold text-[11px] tracking-tight text-center uppercase text-[#000000]">
                  {item.title}
                </h3>
              </div>
            </div>
          ))}
        </div>

        {/* The White Text Bar at the Bottom (Desktop Only) */}
        <div className="hidden md:flex w-full flex-row bg-white border-b border-[#000000]/10">
          {items.map((item, idx) => (
            <div key={idx} className="w-1/4 p-5">
              <h3 className="font-sans font-bold text-[13px] tracking-tight w-full text-left uppercase text-[#000000]">
                {item.title}
              </h3>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
