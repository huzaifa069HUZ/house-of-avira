'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { db } from '@/lib/firebase';
import { collection, getDocs, orderBy, query, limit } from 'firebase/firestore';
import StickyScroll from '@/components/ui/sticky-scroll';

export default function PinterestFeed({ children }) {
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
      {children}
    </StickyScroll>
  );
}
