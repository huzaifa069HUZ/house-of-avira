'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import Link from 'next/link';
import { db } from '@/lib/firebase';
import { collection, getDocs, orderBy, query, limit } from 'firebase/firestore';

function MasonryImage({ src, productId, index, columnIndex }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });
  
  // Stagger delay based on index within the column
  const delay = (index % 5) * 0.12;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 60, scale: 0.95 }}
      animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ 
        duration: 0.7, 
        delay, 
        ease: [0.25, 0.46, 0.45, 0.94] 
      }}
      className="mb-4 break-inside-avoid group"
    >
      <Link href={`/product/${productId}`}>
        <div className="relative overflow-hidden rounded-2xl cursor-pointer">
          <img
            src={src}
            alt=""
            loading="lazy"
            className="w-full h-auto object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
          />
          {/* Hover overlay */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-500" />
        </div>
      </Link>
    </motion.div>
  );
}

export default function PinterestFeed() {
  const [images, setImages] = useState([]);
  const sectionRef = useRef(null);
  const gridRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start']
  });

  // Parallax for the entire grid — subtle upward drift
  const gridY = useTransform(scrollYProgress, [0, 1], [80, -80]);

  // Title animations
  const titleOpacity = useTransform(scrollYProgress, [0, 0.15], [0, 1]);
  const titleY = useTransform(scrollYProgress, [0, 0.15], [40, 0]);

  // Bottom fade/blur/3D perspective
  const bottomOverlayOpacity = useTransform(scrollYProgress, [0.6, 0.85], [0, 1]);

  useEffect(() => {
    async function fetchImages() {
      try {
        const q = query(collection(db, 'products'), orderBy('createdAt', 'desc'), limit(30));
        const snapshot = await getDocs(q);
        const imgs = [];
        snapshot.docs.forEach(doc => {
          const data = doc.data();
          const productImages = data.images || (data.imageUrl ? [data.imageUrl] : []);
          // Take the first image from each product
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

  // Split images into columns for masonry
  const cols = 4; // Desktop columns
  const columns = Array.from({ length: cols }, () => []);
  images.forEach((img, i) => {
    columns[i % cols].push({ ...img, globalIndex: i });
  });

  return (
    <section
      ref={sectionRef}
      className="relative w-full bg-[#FAFAFA] overflow-hidden"
      style={{ perspective: '1200px' }}
    >
      {/* Top fade-in from previous section */}
      <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-white to-transparent z-10 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 pt-24 pb-8 relative z-10">
        
        {/* Title Block */}
        <motion.div
          style={{ opacity: titleOpacity, y: titleY }}
          className="text-center mb-16"
        >
          {/* Decorative divider top */}
          <div className="flex items-center justify-center gap-4 mb-8">
            <div className="w-12 h-px bg-[#8A001A]/30" />
            <div className="w-1.5 h-1.5 bg-[#8A001A] rotate-45" />
            <div className="w-12 h-px bg-[#8A001A]/30" />
          </div>

          <h2 className="font-perandory text-3xl md:text-5xl lg:text-6xl font-bold tracking-widest uppercase text-[#000000] mb-4">
            Might Interest You
          </h2>
          <p className="font-blosta-script text-xl md:text-3xl lg:text-4xl text-[#8A001A] leading-relaxed max-w-3xl mx-auto">
            Scroll and find according to your choice from our Pinterest board
          </p>

          {/* Decorative divider bottom */}
          <div className="flex items-center justify-center gap-4 mt-8">
            <div className="w-16 h-px bg-black/10" />
            <div className="w-2 h-2 bg-[#8A001A] rotate-45" />
            <div className="w-16 h-px bg-black/10" />
          </div>
        </motion.div>

        {/* Masonry Grid */}
        <motion.div
          ref={gridRef}
          style={{ y: gridY }}
          className="relative"
        >
          {/* The 3D bent-inward + blur overlay at the bottom */}
          <div 
            className="absolute bottom-0 left-0 right-0 z-20 pointer-events-none"
            style={{ height: '35%' }}
          >
            <motion.div
              style={{ opacity: bottomOverlayOpacity }}
              className="w-full h-full"
            >
              {/* Gradient + blur */}
              <div 
                className="w-full h-full"
                style={{
                  background: 'linear-gradient(to top, rgba(250,250,250,1) 0%, rgba(250,250,250,0.95) 25%, rgba(250,250,250,0.7) 50%, rgba(250,250,250,0) 100%)',
                  backdropFilter: 'blur(6px)',
                  WebkitBackdropFilter: 'blur(6px)',
                  maskImage: 'linear-gradient(to top, black 0%, black 40%, transparent 100%)',
                  WebkitMaskImage: 'linear-gradient(to top, black 0%, black 40%, transparent 100%)',
                }}
              />
            </motion.div>
          </div>

          {/* 3D Perspective tilt at the bottom — applied via a wrapper */}
          <div
            style={{
              transformStyle: 'preserve-3d',
            }}
          >
            {/* Desktop: 4 columns */}
            <div className="hidden lg:grid grid-cols-4 gap-4">
              {columns.map((col, colIdx) => (
                <div 
                  key={colIdx} 
                  className="flex flex-col"
                  style={{ 
                    marginTop: colIdx % 2 === 1 ? '2rem' : '0',
                  }}
                >
                  {col.map((img, imgIdx) => (
                    <MasonryImage
                      key={img.id}
                      src={img.src}
                      productId={img.id}
                      index={imgIdx}
                      columnIndex={colIdx}
                    />
                  ))}
                </div>
              ))}
            </div>

            {/* Tablet: 3 columns */}
            <div className="hidden md:grid lg:hidden grid-cols-3 gap-4">
              {Array.from({ length: 3 }, (_, colIdx) => (
                <div 
                  key={colIdx} 
                  className="flex flex-col"
                  style={{ marginTop: colIdx % 2 === 1 ? '1.5rem' : '0' }}
                >
                  {images
                    .filter((_, i) => i % 3 === colIdx)
                    .map((img, imgIdx) => (
                      <MasonryImage
                        key={img.id}
                        src={img.src}
                        productId={img.id}
                        index={imgIdx}
                        columnIndex={colIdx}
                      />
                    ))}
                </div>
              ))}
            </div>

            {/* Mobile: 2 columns */}
            <div className="grid md:hidden grid-cols-2 gap-3">
              {Array.from({ length: 2 }, (_, colIdx) => (
                <div 
                  key={colIdx} 
                  className="flex flex-col"
                  style={{ marginTop: colIdx % 2 === 1 ? '1rem' : '0' }}
                >
                  {images
                    .filter((_, i) => i % 2 === colIdx)
                    .map((img, imgIdx) => (
                      <MasonryImage
                        key={img.id}
                        src={img.src}
                        productId={img.id}
                        index={imgIdx}
                        columnIndex={colIdx}
                      />
                    ))}
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Bottom fade-out into next section */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent z-30 pointer-events-none" />
    </section>
  );
}
