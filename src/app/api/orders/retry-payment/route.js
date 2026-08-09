import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import Razorpay from 'razorpay';
import { PRODUCT_PAYMENT_STATUS } from '@/lib/shipping-constants';

export async function POST(request) {
  try {
    const { orderId } = await request.json();

    if (!orderId) {
      return NextResponse.json({ success: false, message: 'Order ID is required.' }, { status: 400 });
    }

    if (!adminDb) {
      return NextResponse.json({ success: false, message: 'Database not connected.' }, { status: 500 });
    }

    const orderRef = adminDb.collection('orders').doc(orderId);
    const orderDoc = await orderRef.get();

    if (!orderDoc.exists) {
      return NextResponse.json({ success: false, message: 'Order not found.' }, { status: 404 });
    }

    const data = orderDoc.data();

    if (data.product_payment_status !== PRODUCT_PAYMENT_STATUS.PENDING) {
      return NextResponse.json({ success: false, message: 'Order is not pending payment.' }, { status: 400 });
    }

    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    const amountInPaise = Math.max(100, Math.round(data.payable_amount * 100));

    const razorpayOrder = await razorpay.orders.create({
      amount: amountInPaise,
      currency: 'INR',
      receipt: orderId,
    });

    await orderRef.update({
      razorpay_order_id: razorpayOrder.id
    });

    return NextResponse.json({
      success: true,
      db_order_id: orderId,
      order_id: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      customer_info: {
        name: data.customer_name,
        email: data.customer_email,
        phone: data.customer_phone
      }
    });

  } catch (error) {
    console.error('Retry Payment Error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to retry payment.' },
      { status: 500 }
    );
  }
}
