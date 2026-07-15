'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import Link from 'next/link';

function ShippingSuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [status, setStatus] = useState('loading');
  const [errorMessage, setErrorMessage] = useState('');

  const invoiceId = searchParams.get('invoice_id');
  const razorpayPaymentId = searchParams.get('razorpay_payment_id');
  const razorpayPaymentLinkId = searchParams.get('razorpay_payment_link_id');
  const razorpayPaymentLinkStatus = searchParams.get('razorpay_payment_link_status');

  useEffect(() => {
    if (!invoiceId || !razorpayPaymentId || !razorpayPaymentLinkId) {
      // If we don't have the params, just wait a bit or show error
      // Maybe the user refreshed, or they cancelled
      if (razorpayPaymentLinkStatus && razorpayPaymentLinkStatus !== 'paid') {
        setStatus('error');
        setErrorMessage('Payment was not completed or cancelled.');
      } else {
        setStatus('error');
        setErrorMessage('Invalid payment callback parameters. If your payment was deducted, please contact support.');
      }
      return;
    }

    const verifyPayment = async () => {
      try {
        const res = await fetch('/api/shipping/verify-payment', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            invoice_id: invoiceId,
            razorpay_payment_id: razorpayPaymentId,
            razorpay_payment_link_id: razorpayPaymentLinkId
          }),
        });

        const data = await res.json();
        
        if (!res.ok) {
          throw new Error(data.error || 'Payment verification failed');
        }

        setStatus('success');
      } catch (error) {
        console.error('Verification Error:', error);
        setStatus('error');
        setErrorMessage(error.message);
      }
    };

    verifyPayment();
  }, [invoiceId, razorpayPaymentId, razorpayPaymentLinkId, razorpayPaymentLinkStatus]);

  if (status === 'loading') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="w-12 h-12 text-[#0071e3] animate-spin mb-4" />
        <h2 className="text-xl font-bold text-black mb-2">Verifying Payment...</h2>
        <p className="text-[#86868b]">Please do not close or refresh this page.</p>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <XCircle className="w-16 h-16 text-red-500 mb-6" />
        <h2 className="text-2xl font-bold text-black mb-3">Payment Verification Failed</h2>
        <p className="text-[#86868b] max-w-md mb-8">{errorMessage}</p>
        <Link href="/profile" className="px-8 py-3 bg-black text-white text-sm font-bold uppercase tracking-wider rounded-full hover:bg-gray-800 transition-colors">
          Go to Profile
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <CheckCircle2 className="w-16 h-16 text-green-500 mb-6" />
      <h2 className="text-2xl font-bold text-black mb-3">Shipping Payment Successful!</h2>
      <p className="text-[#86868b] max-w-md mb-8">
        Thank you! We have received your shipping payment. Your order is now ready for dispatch, and we will update you with the tracking details shortly.
      </p>
      <Link href="/profile" className="px-8 py-3 bg-black text-white text-sm font-bold uppercase tracking-wider rounded-full hover:bg-gray-800 transition-colors">
        View Order Status
      </Link>
    </div>
  );
}

export default function ShippingSuccessPage() {
  return (
    <div className="min-h-screen bg-[#F5F5F7] pt-24 pb-12" style={{ fontFamily: '"DM Sans", sans-serif' }}>
      <Suspense fallback={<div className="flex justify-center py-32"><Loader2 className="w-8 h-8 animate-spin text-black" /></div>}>
        <ShippingSuccessContent />
      </Suspense>
    </div>
  );
}
