import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import Razorpay from 'razorpay';
import { sanitizeOrderInput } from '@/lib/sanitize';
import {
  ORDER_STATUS,
  WEIGHT_STATUS,
  PRODUCT_PAYMENT_STATUS,
  SHIPPING_PAYMENT_STATUS,
} from '@/lib/shipping-constants';

export async function POST(request) {
  try {
    const rawBody = await request.json();
    const body = sanitizeOrderInput(rawBody);

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

    if (!adminDb) {
      console.error("Firebase Admin SDK is not initialized.");
      return NextResponse.json(
        { success: false, message: 'Server Configuration Error: Database not connected.' },
        { status: 500 }
      );
    }

    // ── Secure Backend Pricing Calculation ──
    let secureSubtotal = 0;
    const validatedItems = [];

    // Fetch all products from Firestore to get accurate prices
    for (const item of items) {
      const productId = item.id || item.cartItemId;
      if (!productId) {
        return NextResponse.json({ success: false, message: 'Invalid item ID found.' }, { status: 400 });
      }

      const productRef = adminDb.collection('products').doc(productId);
      const productSnap = await productRef.get();

      if (!productSnap.exists) {
        return NextResponse.json({ success: false, message: `Product ${item.title || item.name || productId} no longer exists.` }, { status: 404 });
      }

      const productData = productSnap.data();
      const dbPrice = Number(productData.price) || 0;
      const quantity = Number(item.quantity) || 1;

      secureSubtotal += dbPrice * quantity;
      
      // Keep the item data but use the secure price
      validatedItems.push({
        ...item,
        price: dbPrice, // Override with secure price
        name: item.title || item.name || productData.name || 'Unknown Item'
      });
    }

    // Apply Coupon if valid
    let secureDiscount = 0;
    if (coupon_code) {
      const couponRef = adminDb.collection('coupons').doc(coupon_code);
      const couponSnap = await couponRef.get();
      
      if (couponSnap.exists) {
        const couponData = couponSnap.data();
        if (couponData.active !== false) { // Default to active if not explicitly false
          if (couponData.type === 'percentage') {
            secureDiscount = (secureSubtotal * Number(couponData.discount)) / 100;
          } else {
            secureDiscount = Number(couponData.discount) || 0;
          }
        }
      }
    }

    const securePayableAmount = Math.max(0, secureSubtotal - secureDiscount);

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
      items: validatedItems,
      items_count,

      // Product payment
      product_total: secureSubtotal,
      discount_amount: secureDiscount,
      payable_amount: securePayableAmount,
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
    const cleanOrderData = JSON.parse(JSON.stringify(orderData));

    const counterRef = adminDb.collection('counters').doc('orders');
    
    let newOrderId;
    await adminDb.runTransaction(async (t) => {
      const doc = await t.get(counterRef);
      let seq = 1;
      if (doc.exists) {
        seq = doc.data().seq + 1;
      }
      
      const paddedSeq = String(seq).padStart(3, '0');
      newOrderId = `HOA${paddedSeq}`;
      
      // Update counter
      t.set(counterRef, { seq }, { merge: true });
      
      // Create new order
      const newOrderRef = adminDb.collection('orders').doc(newOrderId);
      t.set(newOrderRef, cleanOrderData);
    });
    
    const docRef = { id: newOrderId };

    // Initialize Razorpay
    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    // Determine amount in minor units (paise for INR). Minimum 100 paise.
    const amountInPaise = Math.max(100, Math.round(securePayableAmount * 100));

    // Create order in Razorpay
    const razorpayOrder = await razorpay.orders.create({
      amount: amountInPaise,
      currency: 'INR',
      receipt: docRef.id,
    });

    // Save the razorpay_order_id back to Firestore for secure verification later
    await adminDb.collection('orders').doc(newOrderId).update({
      razorpay_order_id: razorpayOrder.id
    });

    // ── Send Emails ──
    try {
      const { sendOrderConfirmationEmail, sendAdminOrderNotificationEmail } = await import('@/lib/email-service');
      const currencySymbol = '₹';
      
      // Send to customer
      await sendOrderConfirmationEmail({
        customerEmail: customer_email,
        customerName: customer_name,
        orderId: docRef.id,
        items,
        payableAmount: securePayableAmount,
        shippingAddress: shipping_address,
        currencySymbol
      });
      
      // Send to admin
      await sendAdminOrderNotificationEmail({
        orderId: docRef.id,
        customerName: customer_name,
        customerEmail: customer_email,
        items,
        itemsCount: items_count,
        payableAmount: securePayableAmount,
        currencySymbol
      });
    } catch (emailErr) {
      console.error('Failed to send order emails:', emailErr);
      // We don't fail the order creation if emails fail
    }

    return NextResponse.json(
      { 
        success: true, 
        db_order_id: docRef.id,
        order_id: razorpayOrder.id,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency
      },
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
