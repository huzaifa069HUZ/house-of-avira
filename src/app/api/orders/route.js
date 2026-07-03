import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import {
  ORDER_STATUS,
  WEIGHT_STATUS,
  PRODUCT_PAYMENT_STATUS,
  SHIPPING_PAYMENT_STATUS,
  getCurrencyForCountry,
} from '@/lib/shipping-constants';

export async function POST(request) {
  try {
    const body = await request.json();

    const {
      items,
      customer_info,
      shipping_address,
      product_total,
      discount_amount,
      payable_amount,
      coupon_code,
      customer_id,
    } = body;

    // Handle both flat and nested customer_info for backward compatibility
    const customer_name = customer_info?.name || body.customer_name;
    const customer_email = customer_info?.email || body.customer_email;
    const customer_phone = customer_info?.phone || body.customer_phone;
    const customer_country = customer_info?.country || body.customer_country;
    const instagram = customer_info?.instagram || body.instagram || null;

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
      customer_id: customer_id || null,
      customer_name,
      customer_email,
      customer_phone: customer_phone || null,
      customer_country: customer_country || null,
      instagram,

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

    // Firebase Firestore throws an error if any field anywhere in the object tree is strictly 'undefined'.
    // The easiest way to strip all undefined values deeply is to JSON serialize and parse.
    const cleanOrderData = JSON.parse(JSON.stringify(orderData));

    if (!adminDb) {
      console.error("Firebase Admin SDK is not initialized.");
      return NextResponse.json(
        { success: false, message: 'Server Configuration Error: Database not connected.' },
        { status: 500 }
      );
    }

    const docRef = await adminDb.collection('orders').add(cleanOrderData);
    
    // ── Send Emails ──
    try {
      const { sendOrderConfirmationEmail, sendAdminOrderNotificationEmail } = await import('@/lib/email-service');
      const currencyData = getCurrencyForCountry(customer_country);
      const currencySymbol = currencyData.symbol;
      
      // Send to customer
      await sendOrderConfirmationEmail({
        customerEmail: customer_email,
        customerName: customer_name,
        orderId: docRef.id,
        items,
        payableAmount: payable_amount,
        shippingAddress: shipping_address,
        currencySymbol
      });
      
      // Send to admin
      await sendAdminOrderNotificationEmail({
        orderId: docRef.id,
        customerName: customer_name,
        customerEmail: customer_email,
        itemsCount: items_count,
        payableAmount: payable_amount,
        currencySymbol
      });
    } catch (emailErr) {
      console.error('Failed to send order emails:', emailErr);
      // We don't fail the order creation if emails fail
    }

    return NextResponse.json(
      { success: true, order_id: docRef.id },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating order:', error);
    
    let errMsg = 'Failed to create order.';
    if (error instanceof Error) {
      errMsg = error.message;
    } else if (typeof error === 'string') {
      errMsg = error;
    } else if (error && typeof error === 'object' && error.message) {
      errMsg = error.message;
    }
    
    return NextResponse.json(
      { success: false, message: errMsg },
      { status: 500 }
    );
  }
}
