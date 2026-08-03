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
            className="w-full py-4 bg-[#25D366] text-white rounded-xl font-semibold text-sm tracking-wide font-dm-sans hover:bg-[#20b858] transition-colors flex items-center justify-center text-center px-4"
          >
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
