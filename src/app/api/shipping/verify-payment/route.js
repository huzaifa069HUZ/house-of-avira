import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import { INVOICE_PAYMENT_STATUS, ORDER_STATUS } from '@/lib/shipping-constants';
import Razorpay from 'razorpay';

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export async function POST(request) {
  try {
    const { razorpay_payment_id, razorpay_payment_link_id, invoice_id } = await request.json();

    if (!invoice_id || !razorpay_payment_id || !razorpay_payment_link_id) {
      return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
    }
    
    const paymentLink = await razorpay.paymentLink.fetch(razorpay_payment_link_id);
    
    if (paymentLink.status !== 'paid') {
      return NextResponse.json({ error: 'Payment is not marked as paid in Razorpay' }, { status: 400 });
    }

    const invoiceRef = adminDb.collection('shipping_invoices').doc(invoice_id);
    const invoiceDoc = await invoiceRef.get();

    if (!invoiceDoc.exists) {
      return NextResponse.json({ error: 'Invoice not found' }, { status: 404 });
    }

    const invoiceData = invoiceDoc.data();

    // Verify the invoice belongs to this payment link
    if (invoiceData.payment_link_id !== razorpay_payment_link_id) {
      return NextResponse.json({ error: 'Payment link mismatch' }, { status: 400 });
    }

    const now = new Date().toISOString();

    const writeBatch = adminDb.batch();

    // Update Invoice
    writeBatch.update(invoiceRef, {
      payment_status: INVOICE_PAYMENT_STATUS.PAID,
      amount_paid: paymentLink.amount_paid / 100, // convert paise back to standard
      paid_at: now,
      updated_at: now,
    });

    // Update Order
    if (invoiceData.order_id) {
      const orderRef = adminDb.collection('orders').doc(invoiceData.order_id);
      writeBatch.update(orderRef, {
        order_status: ORDER_STATUS.SHIPPING_PAID,
        shipping_paid_amount: paymentLink.amount_paid / 100,
        shipping_paid_at: now,
        updated_at: now,
      });
    }

    await writeBatch.commit();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error verifying shipping payment:', error);
    return NextResponse.json({ error: 'Payment verification failed' }, { status: 500 });
  }
}
