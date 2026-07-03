'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ShippingPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/admin/shipping/weight-pending');
  }, [router]);

  return (
    <div className="flex justify-center items-center py-32" style={{ fontFamily: '"DM Sans", sans-serif' }}>
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
    </div>
  );
}
