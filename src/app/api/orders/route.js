import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import {
  ORDER_STATUS,
  WEIGHT_STATUS,
  PRODUCT_PAYMENT_STATUS,
  SHIPPING_PAYMENT_STATUS,
} from '@/lib/shipping-constants';

export async function POST(request) {
  try {
    const body = await request.json();

    const {
      items,
      customer_name,
      customer_email,
      customer_phone,
      customer_country,
      shipping_address,
      product_total,
      discount_amount,
      payable_amount,
      coupon_code,
    } = body;

    // ── Validation ──
    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { success: false, message: 'Items array is required and must not be empty.' },
        { status: 400 }
      );
    }

    if (!customer_name || !customer_email) {
      return NextResponse.json(
        { success: false, message: 'Customer name and email are required.' },
        { status: 400 }
      );
    }

    if (!shipping_address) {
      return NextResponse.json(
        { success: false, message: 'Shipping address is required.' },
        { status: 400 }
      );
    }

    if (typeof payable_amount !== 'number' || payable_amount < 0) {
      return NextResponse.json(
        { success: false, message: 'Payable amount must be a non-negative number.' },
        { status: 400 }
      );
    }

    // ── Calculate total item quantity ──
    const items_count = items.reduce((sum, item) => sum + (item.quantity || 1), 0);

    const now = new Date().toISOString();

    // ── Build order document ──
    const orderData = {
      // Customer info
      customer_name,
      customer_email,
      customer_phone: customer_phone || null,
      customer_country: customer_country || null,

      // Shipping address
      shipping_address,

      // Items
      items,
      items_count,

      // Product payment
      product_total: product_total || 0,
      discount_amount: discount_amount || 0,
      payable_amount,
      coupon_code: coupon_code || null,
      product_payment_status: PRODUCT_PAYMENT_STATUS.PENDING,

      // Weight / shipping fields — initialized to defaults
      estimated_order_weight: null,
      weight_status: WEIGHT_STATUS.PENDING,
      batch_id: null,
      shipping_due_amount: null,
      shipping_payment_status: SHIPPING_PAYMENT_STATUS.NOT_APPLICABLE,
      shipping_invoice_id: null,
      shipping_notes: null,

      // Order lifecycle
      order_status: ORDER_STATUS.PLACED,
      created_at: now,
      updated_at: now,
    };

    const docRef = await adminDb.collection('orders').add(orderData);

    return NextResponse.json(
      { success: true, order_id: docRef.id },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to create order.' },
      { status: 500 }
    );
  }
}
