import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import {
  ORDER_STATUS,
  PRODUCT_PAYMENT_STATUS,
} from '@/lib/shipping-constants';

export async function POST(request, { params }) {
  try {
    const { orderId } = await params;

    if (!orderId) {
      return NextResponse.json(
        { success: false, message: 'Order ID is required.' },
        { status: 400 }
      );
    }

    // ── Fetch the order to validate it exists ──
    const orderRef = adminDb.collection('orders').doc(orderId);
    const orderSnap = await orderRef.get();

    if (!orderSnap.exists) {
      return NextResponse.json(
        { success: false, message: 'Order not found.' },
        { status: 404 }
      );
    }

    const orderData = orderSnap.data();

    // ── Guard: don't confirm if already confirmed or cancelled ──
    if (orderData.product_payment_status === PRODUCT_PAYMENT_STATUS.CONFIRMED) {
      return NextResponse.json(
        { success: false, message: 'Payment has already been confirmed for this order.' },
        { status: 409 }
      );
    }

    if (orderData.order_status === ORDER_STATUS.CANCELLED) {
      return NextResponse.json(
        { success: false, message: 'Cannot confirm payment for a cancelled order.' },
        { status: 409 }
      );
    }

    // ── Update the order ──
    await orderRef.update({
      product_payment_status: PRODUCT_PAYMENT_STATUS.CONFIRMED,
      order_status: ORDER_STATUS.PRODUCT_PAID,
      updated_at: new Date().toISOString(),
    });

    return NextResponse.json({ success: true, message: 'Payment confirmed successfully.' });
  } catch (error) {
    console.error('Error confirming payment:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to confirm payment.' },
      { status: 500 }
    );
  }
}
