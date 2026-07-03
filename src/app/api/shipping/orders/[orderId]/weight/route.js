import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import {
  ORDER_STATUS,
  WEIGHT_STATUS,
} from '@/lib/shipping-constants';

export async function PATCH(request, { params }) {
  try {
    const { orderId } = await params;

    if (!orderId) {
      return NextResponse.json(
        { success: false, message: 'Order ID is required.' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { estimated_order_weight } = body;

    // ── Validate weight ──
    if (
      estimated_order_weight === undefined ||
      estimated_order_weight === null ||
      typeof estimated_order_weight !== 'number' ||
      estimated_order_weight <= 0
    ) {
      return NextResponse.json(
        { success: false, message: 'Estimated order weight must be a positive number.' },
        { status: 400 }
      );
    }

    // ── Fetch the order to validate it exists and is in an allowed state ──
    const orderRef = adminDb.collection('orders').doc(orderId);
    const orderSnap = await orderRef.get();

    if (!orderSnap.exists) {
      return NextResponse.json(
        { success: false, message: 'Order not found.' },
        { status: 404 }
      );
    }

    const orderData = orderSnap.data();

    // Only allow weight entry/update when order is in PRODUCT_PAID or WEIGHT_ENTERED state
    const allowedStatuses = [ORDER_STATUS.PRODUCT_PAID, ORDER_STATUS.WEIGHT_ENTERED];
    if (!allowedStatuses.includes(orderData.order_status)) {
      return NextResponse.json(
        {
          success: false,
          message: `Cannot update weight when order status is "${orderData.order_status}". Order must be in PRODUCT_PAID or WEIGHT_ENTERED status.`,
        },
        { status: 409 }
      );
    }

    // ── Update the order ──
    await orderRef.update({
      estimated_order_weight,
      weight_status: WEIGHT_STATUS.ENTERED,
      order_status: ORDER_STATUS.WEIGHT_ENTERED,
      updated_at: new Date().toISOString(),
    });

    return NextResponse.json({
      success: true,
      message: 'Order weight updated successfully.',
    });
  } catch (error) {
    console.error('Error updating order weight:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to update order weight.' },
      { status: 500 }
    );
  }
}
