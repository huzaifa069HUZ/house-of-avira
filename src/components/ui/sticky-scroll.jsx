'use client';
import { ReactLenis } from 'lenis/react';
import React, { forwardRef } from 'react';
import Link from 'next/link';

const StickyScroll = forwardRef(({ products = [], children }, ref) => {
  const leftCol = [];
  const rightCol = [];

  // Explicitly use the requested 3 images for the center column
  const centerCol = [
    { id: 'static-swim', src: '/swim.png' },
    { id: 'static-sets', src: '/sets.png' },
    { id: 'static-product5', src: '/product5.png' }
  ];

  // Distribute all fetched products to the left and right columns
  products.forEach((prod, i) => {
    if (i % 2 === 0) {
      leftCol.push(prod);
    } else {
      rightCol.push(prod);
    }
  });

  return (
    <ReactLenis root>
      <div className='bg-[#FAFAFA]' ref={ref}>
        {/* Render the header passed as children */}
        {children}

        <section className='w-full bg-[#FAFAFA] pb-24 relative z-20'>
          <div className='max-w-[1400px] mx-auto px-4 sm:px-6 md:px-8'>
            <div className='grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6'>
              
              {/* Left Column - scrolls normally (Desktop only) */}
              <div className='hidden md:grid gap-4 md:gap-6 col-span-4 self-start'>
                {leftCol.map((item) => (
                  <Link key={item.id} href={`/product/${item.id}`} className="block group">
                    <figure className='w-full relative overflow-hidden rounded-2xl shadow-sm hover:shadow-xl transition-shadow duration-500'>
                      <img
                        src={item.src}
                        alt="Product image"
                        loading="lazy"
                        className='transition-all duration-700 ease-out group-hover:scale-105 group-hover:rotate-1 w-full h-[32rem] object-cover align-bottom'
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    </figure>
                  </Link>
                ))}
              </div>

              {/* Center Column - Sticky on Desktop */}
              <div className='md:sticky md:top-0 md:h-screen w-full col-span-12 md:col-span-4 gap-4 md:gap-6 grid grid-rows-3 md:py-6'>
                {centerCol.map((item) => (
                  <Link key={item.id} href={item.id.startsWith('static-') ? '/catalogue' : `/product/${item.id}`} className="block group w-full h-72 md:h-full relative overflow-hidden rounded-2xl shadow-sm hover:shadow-xl transition-shadow duration-500">
                    <figure className='w-full h-full'>
                      <img
                        src={item.src}
                        alt="Product image"
                        loading="lazy"
                        className='transition-all duration-700 ease-out group-hover:scale-105 group-hover:rotate-1 h-full w-full object-cover align-bottom'
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    </figure>
                  </Link>
                ))}
              </div>

              {/* Right Column - scrolls normally (Desktop only) */}
              <div className='hidden md:grid gap-4 md:gap-6 col-span-4 self-start mt-12 md:mt-32'>
                {/* Adding margin-top to stagger the right column visually */}
                {rightCol.map((item) => (
                  <Link key={item.id} href={`/product/${item.id}`} className="block group">
                    <figure className='w-full relative overflow-hidden rounded-2xl shadow-sm hover:shadow-xl transition-shadow duration-500'>
                      <img
                        src={item.src}
                        alt="Product image"
                        loading="lazy"
                        className='transition-all duration-700 ease-out group-hover:scale-105 group-hover:rotate-1 w-full h-[36rem] object-cover align-bottom'
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    </figure>
                  </Link>
                ))}
              </div>
              
              {/* Mobile Fallback: Stacked Grid for the rest of the items */}
              <div className='grid md:hidden grid-cols-2 gap-3 col-span-12 mt-2'>
                {leftCol.concat(rightCol).map((item) => (
                  <Link key={item.id} href={`/product/${item.id}`} className="block group">
                    <figure className='w-full relative overflow-hidden rounded-xl shadow-sm'>
                      <img
                        src={item.src}
                        alt="Product image"
                        loading="lazy"
                        className='transition-all duration-700 ease-out w-full h-56 object-cover align-bottom'
                      />
                    </figure>
                  </Link>
                ))}
              </div>

            </div>
          </div>
        </section>
      </div>
    </ReactLenis>
  );
});

StickyScroll.displayName = 'StickyScroll';

export default StickyScroll;
