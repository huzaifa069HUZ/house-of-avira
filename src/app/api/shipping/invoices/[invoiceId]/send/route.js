import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import { getCurrencyForCountry, INVOICE_STATUS } from '@/lib/shipping-constants';
import { sendShippingInvoiceEmail } from '@/lib/email-service';

// POST /api/shipping/invoices/[invoiceId]/send
export async function POST(request, { params }) {
  try {
    if (!adminDb) {
      return NextResponse.json(
        { error: 'Firebase Admin not initialized' },
        { status: 500 }
      );
    }

    const { invoiceId } = await params;

    // 1. Fetch the invoice
    const invoiceRef = adminDb.collection('shipping_invoices').doc(invoiceId);
    const invoiceDoc = await invoiceRef.get();

    if (!invoiceDoc.exists) {
      return NextResponse.json(
        { error: 'Invoice not found' },
        { status: 404 }
      );
    }

    const invoiceData = invoiceDoc.data();

    // Prevent sending cancelled or already-paid invoices
    if (invoiceData.invoice_status === INVOICE_STATUS.CANCELLED) {
      return NextResponse.json(
        { error: 'Cannot send a cancelled invoice' },
        { status: 400 }
      );
    }

    if (invoiceData.invoice_status === INVOICE_STATUS.PAID) {
      return NextResponse.json(
        { error: 'Cannot send a paid invoice' },
        { status: 400 }
      );
    }

    // 2. Fetch the linked order to get customer_country for currency
    if (!invoiceData.order_id) {
      return NextResponse.json(
        { error: 'Invoice has no linked order' },
        { status: 400 }
      );
    }

    const orderDoc = await adminDb
      .collection('orders')
      .doc(invoiceData.order_id)
      .get();

    if (!orderDoc.exists) {
      return NextResponse.json(
        { error: 'Linked order not found' },
        { status: 404 }
      );
    }

    const orderData = orderDoc.data();
    const currency = getCurrencyForCountry(orderData.customer_country);

    // 3. Send the shipping invoice email
    await sendShippingInvoiceEmail({
      customerEmail: orderData.customer_email,
      customerName: orderData.customer_name || orderData.customer_email,
      orderId: invoiceData.order_id,
      shippingAmount: invoiceData.amount,
      dueDate: invoiceData.due_date,
      batchRef: invoiceData.batch_name || invoiceData.batch_ref || null,
      currencySymbol: currency.symbol,
    });

    // 4. Update invoice: set status to SENT (if it was DRAFT), record sent_at
    const now = new Date().toISOString();
    const updatePayload = {
      sent_at: now,
      updated_at: now,
    };

    // Only transition to SENT if currently in DRAFT status
    // If already SENT or OVERDUE, keep the current status (this is a resend)
    if (invoiceData.invoice_status === INVOICE_STATUS.DRAFT) {
      updatePayload.invoice_status = INVOICE_STATUS.SENT;
    }

    await invoiceRef.update(updatePayload);

    // 5. Return success
    return NextResponse.json({
      success: true,
      message:
        invoiceData.invoice_status === INVOICE_STATUS.DRAFT
          ? 'Invoice sent successfully'
          : 'Invoice resent successfully',
    });
  } catch (error) {
    console.error('Error sending invoice email:', error);
    return NextResponse.json(
      { error: 'Failed to send invoice email', details: error.message },
      { status: 500 }
    );
  }
}
