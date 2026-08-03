'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Check, ArrowRight } from 'lucide-react';

function OrderSuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (!orderId) {
      router.replace('/');
    }
  }, [orderId, router]);

  if (!mounted || !orderId) return null;

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F5F5F7] px-4 py-12">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="bg-white rounded-3xl p-8 md:p-12 shadow-[0_8px_30px_rgb(0,0,0,0.04)] max-w-md w-full text-center border border-[#d2d2d7]/50"
      >
        <div className="flex justify-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ 
              type: "spring",
              stiffness: 260,
              damping: 20,
              delay: 0.1 
            }}
            className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center relative overflow-hidden"
          >
            <motion.svg
              xmlns="http://www.w3.org/2000/svg"
              width="48"
              height="48"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-green-600 z-10 relative"
            >
              <motion.path
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 0.8, ease: "easeOut", delay: 0.4 }}
                d="M20 6 9 17l-5-5"
              />
            </motion.svg>
            <motion.div 
              initial={{ scale: 0, opacity: 0.5 }}
              animate={{ scale: 1.5, opacity: 0 }}
              transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
              className="absolute inset-0 bg-green-200 rounded-full"
            />
          </motion.div>
        </div>

        <motion.h1 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-3xl font-bold tracking-tight text-black mb-4 font-dm-sans"
        >
          ORDER CONFIRMED
        </motion.h1>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="space-y-4"
        >
          <p className="text-[#86868b] text-sm leading-relaxed font-dm-sans">
            Thank you for shopping with House of Avira. Your order <span className="font-semibold text-black">#{orderId}</span> has been placed successfully.
          </p>
          <p className="text-[#86868b] text-sm leading-relaxed font-dm-sans">
            We've sent a confirmation email with your order details. You will receive another email when your items are ready for shipping payment.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="mt-10 flex flex-col gap-3"
        >
          <a 
            href="https://chat.whatsapp.com/C4jFjRfkYoEGEJWwzsrZLZ"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-4 bg-[#25D366] text-white rounded-xl font-semibold text-sm tracking-wide font-dm-sans hover:bg-[#20b858] transition-colors flex items-center justify-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            JOIN OUR WHATSAPP COMMUNITY TO GET UPDATES ABOUT YOUR ORDER
          </a>
          <Link 
            href="/account" 
            className="w-full py-4 bg-black text-white rounded-xl font-semibold text-sm tracking-wide font-dm-sans hover:bg-black/80 transition-colors flex items-center justify-center"
          >
            View My Orders
          </Link>
          <Link 
            href="/catalogue" 
            className="w-full py-4 bg-transparent text-black border border-[#d2d2d7] rounded-xl font-semibold text-sm tracking-wide font-dm-sans hover:bg-black/5 transition-colors flex items-center justify-center gap-2"
          >
            Continue Shopping <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>

      </motion.div>
    </div>
  );
}

export default function OrderSuccessPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#F5F5F7]" />}>
      <OrderSuccessContent />
    </Suspense>
  );
}
