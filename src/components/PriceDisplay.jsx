'use client';

import { useEffect, useState } from 'react';

export default function PriceDisplay({ basePrice, className }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // To prevent hydration errors, return the base INR price before mount.
  if (!mounted) {
    return <span className={className}>₹{basePrice.toFixed(2)}</span>;
  }

  let formattedPrice;
  try {
    formattedPrice = new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(basePrice);
  } catch (e) {
    formattedPrice = `₹${basePrice.toFixed(2)}`;
  }

  return <span className={className}>{formattedPrice}</span>;
}
