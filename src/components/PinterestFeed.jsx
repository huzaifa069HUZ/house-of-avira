'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { db } from '@/lib/firebase';
import { collection, getDocs, orderBy, query, limit } from 'firebase/firestore';
import StickyScroll from '@/components/ui/sticky-scroll';

export default function PinterestFeed() {
  const [images, setImages] = useState([]);

  useEffect(() => {
    async function fetchImages() {
      try {
        const q = query(collection(db, 'products'), orderBy('createdAt', 'desc'), limit(30));
        const snapshot = await getDocs(q);
        const imgs = [];
        snapshot.docs.forEach(doc => {
          const data = doc.data();
          const productImages = data.images || (data.imageUrl ? [data.imageUrl] : []);
          if (productImages[0]) {
            imgs.push({ src: productImages[0], id: doc.id });
          }
        });
        setImages(imgs);
      } catch (err) {
        console.error('PinterestFeed fetch error:', err);
      }
    }
    fetchImages();
  }, []);

  if (images.length === 0) return null;

  return (
    <StickyScroll products={images}>
      {/* Title Block - Fixed Visibility */}
      <div className="w-full bg-[#FAFAFA] pt-32 pb-16 relative z-30">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center max-w-[1400px] mx-auto"
        >
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="w-16 h-px bg-[#8A001A]/30" />
            <div className="w-2 h-2 bg-[#8A001A] rotate-45" />
            <div className="w-16 h-px bg-[#8A001A]/30" />
          </div>

          <h2 className="font-perandory text-4xl md:text-5xl lg:text-7xl font-bold tracking-widest uppercase text-black mb-6">
            Might Interest You
          </h2>
          <p className="font-aston-script text-3xl md:text-4xl lg:text-5xl text-[#8A001A] leading-relaxed max-w-4xl mx-auto px-4">
            Scroll and find according to your choice from our Pinterest board
          </p>

          <div className="flex items-center justify-center gap-4 mt-8">
            <div className="w-24 h-px bg-black/10" />
            <div className="w-2 h-2 bg-[#8A001A] rotate-45" />
            <div className="w-24 h-px bg-black/10" />
          </div>
        </motion.div>
      </div>
    </StickyScroll>
  );
}
