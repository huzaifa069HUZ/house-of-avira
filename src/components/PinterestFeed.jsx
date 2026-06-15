'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import Link from 'next/link';
import { db } from '@/lib/firebase';
import { collection, getDocs, orderBy, query, limit } from 'firebase/firestore';

function MasonryImage({ src, productId, index, columnIndex, globalIndex }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });
  
  const delay = (index % 5) * 0.1;

  // Varied aspect ratios for the masonry effect
  const aspectRatios = [
    'aspect-[3/4]',
    'aspect-[4/5]',
    'aspect-[2/3]',
    'aspect-[5/7]',
    'aspect-[3/5]',
    'aspect-square'
  ];
  const ratioClass = aspectRatios[globalIndex % aspectRatios.length];

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50, scale: 0.95 }}
      animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ 
        duration: 0.8, 
        delay, 
        ease: [0.25, 0.46, 0.45, 0.94] 
      }}
      className={`mb-4 sm:mb-6 break-inside-avoid group`}
    >
      <Link href={`/product/${productId}`}>
        <div className={`relative overflow-hidden rounded-2xl cursor-pointer ${ratioClass} shadow-sm hover:shadow-xl transition-shadow duration-500`}>
          <img
            src={src}
            alt="Product image"
            loading="lazy"
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 group-hover:rotate-1"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        </div>
      </Link>
    </motion.div>
  );
}

export default function PinterestFeed() {
  const [images, setImages] = useState([]);
  const sectionRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start']
  });

  // Different parallax speeds for columns
  const y1 = useTransform(scrollYProgress, [0, 1], [0, -250]);
  const y2 = useTransform(scrollYProgress, [0, 1], [150, -100]);
  const y3 = useTransform(scrollYProgress, [0, 1], [-50, -350]);
  const y4 = useTransform(scrollYProgress, [0, 1], [100, -150]);
  
  const columnTransforms = [y1, y2, y3, y4];

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

  const imagesWithGlobalIndex = images.map((img, i) => ({ ...img, globalIndex: i }));

  // Columns for Desktop (4)
  const colsDesktop = 4;
  const columnsDesktop = Array.from({ length: colsDesktop }, () => []);
  imagesWithGlobalIndex.forEach((img, i) => {
    columnsDesktop[i % colsDesktop].push(img);
  });

  // Columns for Tablet (3)
  const colsTablet = 3;
  const columnsTablet = Array.from({ length: colsTablet }, () => []);
  imagesWithGlobalIndex.forEach((img, i) => {
    columnsTablet[i % colsTablet].push(img);
  });

  // Columns for Mobile (2)
  const colsMobile = 2;
  const columnsMobile = Array.from({ length: colsMobile }, () => []);
  imagesWithGlobalIndex.forEach((img, i) => {
    columnsMobile[i % colsMobile].push(img);
  });

  return (
    <section
      ref={sectionRef}
      className="relative w-full bg-[#FAFAFA] overflow-hidden"
    >
      <div className="absolute top-0 left-0 right-0 h-40 bg-gradient-to-b from-[#FAFAFA] to-transparent z-10 pointer-events-none" />

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-8 pt-32 pb-12 relative z-20">
        
        {/* Title Block - Fixed Visibility */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center mb-24 relative z-30"
        >
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="w-16 h-px bg-[#8A001A]/30" />
            <div className="w-2 h-2 bg-[#8A001A] rotate-45" />
            <div className="w-16 h-px bg-[#8A001A]/30" />
          </div>

          <h2 className="font-perandory text-4xl md:text-5xl lg:text-7xl font-bold tracking-widest uppercase text-black mb-6">
            Might Interest You
          </h2>
          <p className="font-blosta-script text-3xl md:text-4xl lg:text-5xl text-[#8A001A] leading-relaxed max-w-4xl mx-auto px-4">
            Scroll and find according to your choice from our Pinterest board
          </p>

          <div className="flex items-center justify-center gap-4 mt-8">
            <div className="w-24 h-px bg-black/10" />
            <div className="w-2 h-2 bg-[#8A001A] rotate-45" />
            <div className="w-24 h-px bg-black/10" />
          </div>
        </motion.div>

        {/* Masonry Grid */}
        <div className="relative" style={{ perspective: '2000px' }}>
          
          {/* Parallax Container */}
          <div style={{ transformStyle: 'preserve-3d' }}>
            {/* Desktop: 4 columns */}
            <div className="hidden lg:grid grid-cols-4 gap-6 px-4">
              {columnsDesktop.map((col, colIdx) => (
                <motion.div 
                  key={colIdx} 
                  className="flex flex-col"
                  style={{ 
                    marginTop: colIdx % 2 === 1 ? '4rem' : '0',
                    y: columnTransforms[colIdx]
                  }}
                >
                  {col.map((img, imgIdx) => (
                    <MasonryImage
                      key={img.id}
                      src={img.src}
                      productId={img.id}
                      index={imgIdx}
                      columnIndex={colIdx}
                      globalIndex={img.globalIndex}
                    />
                  ))}
                </motion.div>
              ))}
            </div>

            {/* Tablet: 3 columns */}
            <div className="hidden md:grid lg:hidden grid-cols-3 gap-5 px-2">
              {columnsTablet.map((col, colIdx) => (
                <motion.div 
                  key={colIdx} 
                  className="flex flex-col"
                  style={{ 
                    marginTop: colIdx % 2 === 1 ? '3rem' : '0',
                    y: columnTransforms[colIdx]
                  }}
                >
                  {col.map((img, imgIdx) => (
                    <MasonryImage
                      key={img.id}
                      src={img.src}
                      productId={img.id}
                      index={imgIdx}
                      columnIndex={colIdx}
                      globalIndex={img.globalIndex}
                    />
                  ))}
                </motion.div>
              ))}
            </div>

            {/* Mobile: 2 columns */}
            <div className="grid md:hidden grid-cols-2 gap-3">
              {columnsMobile.map((col, colIdx) => (
                <motion.div 
                  key={colIdx} 
                  className="flex flex-col"
                  style={{ 
                    marginTop: colIdx % 2 === 1 ? '2rem' : '0',
                    y: columnTransforms[colIdx]
                  }}
                >
                  {col.map((img, imgIdx) => (
                    <MasonryImage
                      key={img.id}
                      src={img.src}
                      productId={img.id}
                      index={imgIdx}
                      columnIndex={colIdx}
                      globalIndex={img.globalIndex}
                    />
                  ))}
                </motion.div>
              ))}
            </div>
          </div>

          {/* Strong Bottom Overlay for 3D/Bent Effect */}
          <div 
            className="absolute bottom-0 left-0 right-0 z-20 pointer-events-none"
            style={{ height: '400px' }}
          >
            <div 
              className="w-full h-full"
              style={{
                background: 'linear-gradient(to top, rgba(250,250,250,1) 0%, rgba(250,250,250,0.85) 40%, rgba(250,250,250,0) 100%)',
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
                maskImage: 'linear-gradient(to top, black 0%, black 50%, transparent 100%)',
                WebkitMaskImage: 'linear-gradient(to top, black 0%, black 50%, transparent 100%)',
              }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
