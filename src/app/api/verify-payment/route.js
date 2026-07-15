import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { adminDb } from '@/lib/firebase-admin';
import { PRODUCT_PAYMENT_STATUS } from '@/lib/shipping-constants';

export async function POST(request) {
  try {
    const body = await request.json();
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, db_order_id } = body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !db_order_id) {
      return NextResponse.json(
        { success: false, message: 'Missing required payment verification fields.' },
        { status: 400 }
      );
    }

    // Verify signature
    const secret = process.env.RAZORPAY_KEY_SECRET;
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(razorpay_order_id + '|' + razorpay_payment_id)
      .digest('hex');

    if (expectedSignature !== razorpay_signature) {
      return NextResponse.json(
        { success: false, message: 'Invalid payment signature.' },
        { status: 400 }
      );
    }

    // Update Firestore order status
    if (!adminDb) {
      throw new Error('Database not connected.');
    }

    const orderRef = adminDb.collection('orders').doc(db_order_id);
    await orderRef.update({
      product_payment_status: PRODUCT_PAYMENT_STATUS.CONFIRMED,
      razorpay_order_id,
      razorpay_payment_id,
      updated_at: new Date().toISOString(),
    });

    return NextResponse.json({ success: true, message: 'Payment verified successfully.' });
  } catch (error) {
    console.error('Error verifying payment:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to verify payment.' },
      { status: 500 }
    );
  }
}
