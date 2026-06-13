"use client"

import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

const SQRT_5000 = Math.sqrt(5000);

const testimonials = [
  {
    tempId: 0,
    testimonial: "I was hesitant about imported fashion, but House of Avira delivered true quality. The material is so premium!",
    by: "Sarah M., Verified Buyer",
    imgSrc: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop"
  },
  {
    tempId: 1,
    testimonial: "These Pinterest finds are actually exactly as pictured. Fast shipping and the fit is perfect. The imports are 100% legit.",
    by: "Jessica L.",
    imgSrc: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop"
  },
  {
    tempId: 2,
    testimonial: "I know it's cliche, but the quality of these imports is unmatched. Best aesthetic pieces I've found online.",
    by: "Emily T.",
    imgSrc: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop"
  },
  {
    tempId: 3,
    testimonial: "Direct imports mean no middleman markup. The quality to price ratio is incredible. Highly recommended!",
    by: "Marie, Fashion Blogger",
    imgSrc: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&h=150&fit=crop"
  },
  {
    tempId: 4,
    testimonial: "If I could give 11 stars, I'd give 12. The fabric feels luxurious and the import process was totally transparent.",
    by: "Amanda R.",
    imgSrc: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop"
  },
  {
    tempId: 5,
    testimonial: "SO SO SO HAPPY I found this store!!!! Authentic Pinterest styles imported directly to my door.",
    by: "Chloe S.",
    imgSrc: "https://images.unsplash.com/photo-1531123897727-8f129e1bf08c?w=150&h=150&fit=crop"
  },
  {
    tempId: 6,
    testimonial: "Took some convincing, but now that I know these imports are 100% real and high quality, I'm never going back.",
    by: "Pam, Stylist",
    imgSrc: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop"
  },
  {
    tempId: 7,
    testimonial: "I would be lost without this aesthetic. The imported finds are genuine and exactly like the pictures.",
    by: "Daniela F.",
    imgSrc: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150&h=150&fit=crop"
  },
  {
    tempId: 8,
    testimonial: "It's just the best. Period. No cheap knockoffs here, only high quality sourced imports.",
    by: "Sophia L.",
    imgSrc: "https://images.unsplash.com/photo-1517365830460-955ce3ccd263?w=150&h=150&fit=crop"
  },
  {
    tempId: 9,
    testimonial: "I started shopping here 2 years ago and never looked back. The trust is real.",
    by: "Ava N.",
    imgSrc: "https://images.unsplash.com/photo-1554151228-14d9def656e4?w=150&h=150&fit=crop"
  },
  {
    tempId: 10,
    testimonial: "I've been searching for a trustworthy importer for YEARS. So glad I finally found House of Avira!",
    by: "Mia C.",
    imgSrc: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&h=150&fit=crop"
  },
  {
    tempId: 11,
    testimonial: "The clothes are beautifully crafted. It's rare to find an importer that actually cares about quality.",
    by: "Isabella K.",
    imgSrc: "https://images.unsplash.com/photo-1546961329-78bef0414d7c?w=150&h=150&fit=crop"
  },
  {
    tempId: 12,
    testimonial: "Their customer support is unparalleled. They answered all my questions about the import process.",
    by: "Olivia P.",
    imgSrc: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=150&h=150&fit=crop"
  },
  {
    tempId: 13,
    testimonial: "Every piece I've bought has exceeded my expectations. These aren't just fast fashion, they're curated pieces.",
    by: "Charlotte H.",
    imgSrc: "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=150&h=150&fit=crop"
  },
  {
    tempId: 14,
    testimonial: "House of Avira has revolutionized my wardrobe. Getting authentic pieces directly imported is a game-changer!",
    by: "Amelia W.",
    imgSrc: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=150&h=150&fit=crop"
  },
  {
    tempId: 15,
    testimonial: "The consistency in quality is impressive. Every single imported item feels luxurious and well-made.",
    by: "Evelyn R.",
    imgSrc: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=150&h=150&fit=crop"
  },
  {
    tempId: 16,
    testimonial: "I appreciate how they curate their collections. It takes the guesswork out of finding reliable overseas styles.",
    by: "Harper G.",
    imgSrc: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=150&h=150&fit=crop"
  },
  {
    tempId: 17,
    testimonial: "The value you get is incredible. The imports are genuine and the stitching is always flawless.",
    by: "Abigail J.",
    imgSrc: "https://images.unsplash.com/photo-1552374196-c4e7ffc6e126?w=150&h=150&fit=crop"
  },
  {
    tempId: 18,
    testimonial: "Beautiful aesthetic, reliable imports, and surprisingly fast shipping. The perfect balance.",
    by: "Ella M.",
    imgSrc: "https://images.unsplash.com/photo-1491308056676-205b7c9a7dc1?w=150&h=150&fit=crop"
  },
  {
    tempId: 19,
    testimonial: "I've tried many Pinterest-inspired stores, but House of Avira is the only one with real, high-quality imports.",
    by: "Grace D.",
    imgSrc: "https://images.unsplash.com/photo-1485875437342-9b39470b3d95?w=150&h=150&fit=crop"
  }
];

const TestimonialCard = ({ 
  position, 
  testimonial, 
  handleMove, 
  cardSize 
}) => {
  const isCenter = position === 0;

  return (
    <div
      onClick={() => handleMove(position)}
      className={cn(
        "absolute left-1/2 top-1/2 cursor-pointer border-2 p-8 transition-all duration-500 ease-in-out",
        isCenter 
          ? "z-10 bg-black text-white border-black" 
          : "z-0 bg-white text-black border-gray-200 hover:border-black/50"
      )}
      style={{
        width: cardSize,
        height: cardSize,
        clipPath: `polygon(50px 0%, calc(100% - 50px) 0%, 100% 50px, 100% 100%, calc(100% - 50px) 100%, 50px 100%, 0 100%, 0 0)`,
        transform: `
          translate(-50%, -50%) 
          translateX(${(cardSize / 1.5) * position}px)
          translateY(${isCenter ? -65 : position % 2 ? 15 : -15}px)
          rotate(${isCenter ? 0 : position % 2 ? 2.5 : -2.5}deg)
        `,
        boxShadow: isCenter ? "0px 8px 0px 4px rgba(0,0,0,0.1)" : "0px 0px 0px 0px transparent"
      }}
    >
      <span
        className="absolute block origin-top-right rotate-45 bg-gray-200"
        style={{
          right: -2,
          top: 48,
          width: SQRT_5000,
          height: 2
        }}
      />
      <img
        src={testimonial.imgSrc}
        alt={`${testimonial.by.split(',')[0]}`}
        className="mb-4 h-14 w-12 bg-gray-100 object-cover object-top"
        style={{
          boxShadow: "3px 3px 0px #fff"
        }}
      />
      <h3 className={cn(
        "text-base sm:text-xl font-medium",
        isCenter ? "text-white" : "text-black"
      )}>
        "{testimonial.testimonial}"
      </h3>
      <p className={cn(
        "absolute bottom-8 left-8 right-8 mt-2 text-sm italic",
        isCenter ? "text-white/80" : "text-gray-500"
      )}>
        - {testimonial.by}
      </p>
    </div>
  );
};

export const StaggerTestimonials = () => {
  const [cardSize, setCardSize] = useState(365);
  const [testimonialsList, setTestimonialsList] = useState(testimonials);

  const handleMove = (steps) => {
    const newList = [...testimonialsList];
    if (steps > 0) {
      for (let i = steps; i > 0; i--) {
        const item = newList.shift();
        if (!item) return;
        newList.push({ ...item, tempId: Math.random() });
      }
    } else {
      for (let i = steps; i < 0; i++) {
        const item = newList.pop();
        if (!item) return;
        newList.unshift({ ...item, tempId: Math.random() });
      }
    }
    setTestimonialsList(newList);
  };

  useEffect(() => {
    const updateSize = () => {
      const { matches } = window.matchMedia("(min-width: 640px)");
      setCardSize(matches ? 365 : 290);
    };

    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  return (
    <div
      className="relative w-full overflow-hidden bg-white/30"
      style={{ height: 600 }}
    >
      {testimonialsList.map((testimonial, index) => {
        const position = testimonialsList.length % 2
          ? index - (testimonialsList.length + 1) / 2
          : index - testimonialsList.length / 2;
        return (
          <TestimonialCard
            key={testimonial.tempId}
            testimonial={testimonial}
            handleMove={handleMove}
            position={position}
            cardSize={cardSize}
          />
        );
      })}
      <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
        <button
          onClick={() => handleMove(-1)}
          className={cn(
            "flex h-14 w-14 items-center justify-center text-2xl transition-colors",
            "bg-white border-2 border-black hover:bg-black hover:text-white",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2"
          )}
          aria-label="Previous testimonial"
        >
          <ChevronLeft />
        </button>
        <button
          onClick={() => handleMove(1)}
          className={cn(
            "flex h-14 w-14 items-center justify-center text-2xl transition-colors",
            "bg-white border-2 border-black hover:bg-black hover:text-white",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2"
          )}
          aria-label="Next testimonial"
        >
          <ChevronRight />
        </button>
      </div>
    </div>
  );
};
