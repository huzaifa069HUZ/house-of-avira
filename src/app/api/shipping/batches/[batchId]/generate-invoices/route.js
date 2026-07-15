import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import {
  BATCH_STATUS,
  ORDER_STATUS,
  INVOICE_STATUS,
  INVOICE_PAYMENT_STATUS,
  generateInvoiceNumber,
  getCurrencyForCountry,
} from '@/lib/shipping-constants';
import Razorpay from 'razorpay';

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// ── POST /api/shipping/batches/[batchId]/generate-invoices — Generate shipping invoices ──
export async function POST(request, { params }) {
  try {
    if (!adminDb) {
      return NextResponse.json(
        { error: 'Firebase Admin not initialized' },
        { status: 500 }
      );
    }

    const { batchId } = await params;

    // Parse optional due_date from body
    let dueDate = null;
    try {
      const body = await request.json();
      dueDate = body.due_date || null;
    } catch {
      // No body or invalid JSON — due_date remains null
    }

    // 1. Fetch batch and validate status
    const batchRef = adminDb.collection('shipment_batches').doc(batchId);
    const batchDoc = await batchRef.get();

    if (!batchDoc.exists) {
      return NextResponse.json({ error: 'Batch not found' }, { status: 404 });
    }

    const batchData = batchDoc.data();

    if (batchData.status !== BATCH_STATUS.COST_ALLOCATED) {
      return NextResponse.json(
        {
          error: `Cannot generate invoices for batch with status "${batchData.status}". Batch must have status COST_ALLOCATED (allocation must be completed first).`,
        },
        { status: 400 }
      );
    }

    // 2. Fetch allocations for this batch
    const allocationsSnapshot = await adminDb
      .collection('batch_allocations')
      .where('batch_id', '==', batchId)
      .get();

    if (allocationsSnapshot.empty) {
      return NextResponse.json(
        {
          error:
            'No allocations found for this batch. Run allocation first.',
        },
        { status: 400 }
      );
    }

    const allocations = allocationsSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    const now = new Date().toISOString();
    const writeBatch = adminDb.batch();
    let createdCount = 0;
    let skippedCount = 0;

    for (const allocation of allocations) {
      // 3. Check if invoice already exists for this order+batch combo (idempotent)
      const existingInvoiceSnapshot = await adminDb
        .collection('shipping_invoices')
        .where('order_id', '==', allocation.order_id)
        .where('batch_id', '==', batchId)
        .limit(1)
        .get();

      if (!existingInvoiceSnapshot.empty) {
        skippedCount++;
        continue;
      }

      // Fetch order to get customer country
      const orderDoc = await adminDb.collection('orders').doc(allocation.order_id).get();
      const orderData = orderDoc.exists ? orderDoc.data() : {};
      const currency = getCurrencyForCountry(orderData.customer_country || 'india');
      
      const invoiceNumber = generateInvoiceNumber();
      const invoiceRef = adminDb.collection('shipping_invoices').doc();
      
      // Generate Razorpay Payment Link
      let paymentLinkId = null;
      let paymentLinkUrl = null;
      try {
        const amountInPaise = Math.round(allocation.rounded_shipping_amount * 100);
        const paymentLink = await razorpay.paymentLink.create({
          amount: amountInPaise,
          currency: currency.code,
          accept_partial: false,
          reference_id: invoiceNumber,
          description: `Shipping Payment for Order ${allocation.order_id}`,
          customer: {
            name: allocation.customer_name || 'Customer',
            email: allocation.customer_email || ''
          },
          notify: {
            email: true, // Razorpay will send email
            sms: false
          },
          reminder_enable: true,
          callback_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'https://houseofavira.com'}/shipping-success?invoice_id=${invoiceRef.id}`,
          callback_method: 'get'
        });
        paymentLinkId = paymentLink.id;
        paymentLinkUrl = paymentLink.short_url;
      } catch (err) {
        console.error('Error creating Razorpay payment link:', err);
        // We can either fail the whole process or continue without payment link
        // We will throw so it doesn't create partial invoices without links
        throw new Error(`Failed to generate payment link for order ${allocation.order_id}: ${err.message}`);
      }

      const invoiceData = {
        invoice_number: invoiceNumber,
        order_id: allocation.order_id,
        batch_id: batchId,
        batch_name: batchData.batch_name || batchId,
        payment_link_id: paymentLinkId,
        payment_link_url: paymentLinkUrl,
        customer_id: allocation.customer_id || null,
        customer_name: allocation.customer_name || null,
        customer_email: allocation.customer_email || null,
        customer_phone: orderData.customer_phone || allocation.customer_phone || null,
        amount_due: allocation.rounded_shipping_amount,
        amount_paid: 0,
        due_date: dueDate,
        invoice_status: INVOICE_STATUS.DRAFT,
        payment_status: INVOICE_PAYMENT_STATUS.NOT_PAID,
        created_at: now,
        updated_at: now,
        sent_at: null,
        paid_at: null,
      };

      writeBatch.set(invoiceRef, invoiceData);

      // 5. Update the order with invoice reference and status
      const orderRef = adminDb.collection('orders').doc(allocation.order_id);
      writeBatch.update(orderRef, {
        shipping_invoice_id: invoiceRef.id,
        shipping_payment_link: paymentLinkUrl,
        shipping_amount_due: allocation.rounded_shipping_amount,
        order_status: ORDER_STATUS.SHIPPING_INVOICED,
        updated_at: now,
      });

      createdCount++;
    }

    // 6. Update batch status
    writeBatch.update(batchRef, {
      status: BATCH_STATUS.INVOICES_GENERATED,
      invoices_generated_at: now,
      updated_at: now,
    });

    await writeBatch.commit();

    // 7. Return created invoices count
    return NextResponse.json({
      success: true,
      batch_id: batchId,
      invoices_created: createdCount,
      invoices_skipped: skippedCount,
      total_allocations: allocations.length,
    });
  } catch (error) {
    console.error('Error generating invoices:', error);
    return NextResponse.json(
      { error: 'Failed to generate invoices' },
      { status: 500 }
    );
  }
}
