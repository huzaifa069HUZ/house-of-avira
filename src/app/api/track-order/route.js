import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';

export async function POST(request) {
  try {
    let { orderId, contact } = await request.json();

    if (!orderId || !contact) {
      return NextResponse.json({ error: 'Order ID and Contact info are required.' }, { status: 400 });
    }
    
    // Normalize orderId (remove # and spaces) for robust searching
    orderId = orderId.replace(/[\s#]/g, '').toUpperCase();

    const orderDoc = await adminDb.collection('orders').doc(orderId).get();

    if (!orderDoc.exists) {
      return NextResponse.json({ error: 'Order not found. Please verify your Order ID.' }, { status: 404 });
    }

    const data = orderDoc.data();

    // Verify contact matches customer_email or customer_phone
    const isEmailMatch = data.customer_email && data.customer_email.toLowerCase() === contact.toLowerCase();
    const dataPhone = data.customer_phone ? data.customer_phone.replace(/[^0-9]/g, '') : '';
    const contactPhone = contact ? contact.replace(/[^0-9]/g, '') : '';
    const isPhoneMatch = dataPhone && contactPhone && (dataPhone.endsWith(contactPhone) || contactPhone.endsWith(dataPhone));

    if (!isEmailMatch && !isPhoneMatch) {
      return NextResponse.json({ error: 'Contact information does not match the order records.' }, { status: 403 });
    }

    // Map to tracking page schema
    const orderData = {
      orderId: orderDoc.id,
      status: data.order_status || 'Pending',
      createdAt: data.created_at,
      customerInfo: {
        name: data.customer_name,
        email: data.customer_email,
        phone: data.customer_phone || '',
      },
      shippingAddress: {
        addressLine1: data.shipping_address?.address || data.shipping_address?.line1 || '',
        city: data.shipping_address?.city || '',
        state: data.shipping_address?.state || '',
        pincode: data.shipping_address?.zip || data.shipping_address?.postal_code || data.shipping_address?.pincode || '',
      },
      paymentMethod: data.payment_method || 'Online',
      shippingFee: data.shipping_cost || 0,
      finalTotal: data.payable_amount || data.total_amount,
      items: data.items.map(item => ({
        name: item.name || item.title || 'Unknown Item',
        size: item.size || item.selectedSize || '',
        quantity: item.quantity || 1,
        price: item.price || 0
      }))
    };

    return NextResponse.json({ success: true, order: orderData });

  } catch (error) {
    console.error('Track Order API Error:', error);
    return NextResponse.json(
      { error: 'Server error while tracking order.' },
      { status: 500 }
    );
  }
}
