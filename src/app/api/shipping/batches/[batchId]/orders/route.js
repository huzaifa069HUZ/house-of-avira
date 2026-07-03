import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import { BATCH_STATUS, ORDER_STATUS } from '@/lib/shipping-constants';
import { FieldValue } from 'firebase-admin/firestore';

// ── POST /api/shipping/batches/[batchId]/orders — Add orders to batch ──
export async function POST(request, { params }) {
  try {
    if (!adminDb) {
      return NextResponse.json(
        { error: 'Firebase Admin not initialized' },
        { status: 500 }
      );
    }

    const { batchId } = await params;
    const { order_ids } = await request.json();

    if (!order_ids || !Array.isArray(order_ids) || order_ids.length === 0) {
      return NextResponse.json(
        { error: 'order_ids is required and must be a non-empty array' },
        { status: 400 }
      );
    }

    // Fetch the batch
    const batchRef = adminDb.collection('shipment_batches').doc(batchId);
    const batchDoc = await batchRef.get();

    if (!batchDoc.exists) {
      return NextResponse.json({ error: 'Batch not found' }, { status: 404 });
    }

    const batchData = batchDoc.data();

    // Validate batch is in an addable state
    if (
      batchData.status !== BATCH_STATUS.OPEN &&
      batchData.status !== BATCH_STATUS.WAITING_FINAL_COST
    ) {
      return NextResponse.json(
        {
          error: `Cannot add orders to batch with status "${batchData.status}". Batch must be OPEN or WAITING_FINAL_COST.`,
        },
        { status: 400 }
      );
    }

    // Fetch all the orders to be added
    const orderDocs = [];
    for (const orderId of order_ids) {
      const orderDoc = await adminDb.collection('orders').doc(orderId).get();
      if (!orderDoc.exists) {
        return NextResponse.json(
          { error: `Order ${orderId} not found` },
          { status: 404 }
        );
      }
      const orderData = orderDoc.data();

      // Validate order is not already in another batch
      if (orderData.batch_id && orderData.batch_id !== batchId) {
        return NextResponse.json(
          {
            error: `Order ${orderId} is already assigned to batch ${orderData.batch_id}`,
          },
          { status: 400 }
        );
      }

      orderDocs.push({ id: orderDoc.id, ...orderData });
    }

    const now = new Date().toISOString();
    const writeBatch = adminDb.batch();

    // Update each order: set batch_id and status
    for (const orderId of order_ids) {
      const orderRef = adminDb.collection('orders').doc(orderId);
      writeBatch.update(orderRef, {
        batch_id: batchId,
        order_status: ORDER_STATUS.IN_BATCH,
        updated_at: now,
      });
    }

    // Build the new combined order_ids list (merge existing + new, deduplicated)
    const existingOrderIds = batchData.order_ids || [];
    const mergedOrderIds = [
      ...new Set([...existingOrderIds, ...order_ids]),
    ];

    // Fetch ALL orders in the batch (existing + newly added) for accurate counts
    const allOrderDocs = [];
    for (const oid of mergedOrderIds) {
      // Use the already-fetched data for new orders
      const existing = orderDocs.find((o) => o.id === oid);
      if (existing) {
        allOrderDocs.push(existing);
      } else {
        const doc = await adminDb.collection('orders').doc(oid).get();
        if (doc.exists) {
          allOrderDocs.push({ id: doc.id, ...doc.data() });
        }
      }
    }

    // Calculate aggregate values
    const uniqueCustomerIds = new Set(
      allOrderDocs.map((o) => o.customer_id).filter(Boolean)
    );
    const estimatedTotalWeight = allOrderDocs.reduce((sum, o) => {
      const weight = parseFloat(o.estimated_order_weight) || 0;
      return sum + weight;
    }, 0);

    // Determine new status: if batch was OPEN, move to WAITING_FINAL_COST
    let newStatus = batchData.status;
    if (batchData.status === BATCH_STATUS.OPEN) {
      newStatus = BATCH_STATUS.WAITING_FINAL_COST;
    }

    // Update batch with new counts
    writeBatch.update(batchRef, {
      order_ids: mergedOrderIds,
      total_orders_count: mergedOrderIds.length,
      total_customers_count: uniqueCustomerIds.size,
      estimated_total_weight: estimatedTotalWeight,
      status: newStatus,
      updated_at: now,
    });

    await writeBatch.commit();

    return NextResponse.json({
      success: true,
      batch_id: batchId,
      added_orders: order_ids.length,
      total_orders_count: mergedOrderIds.length,
      total_customers_count: uniqueCustomerIds.size,
      estimated_total_weight: estimatedTotalWeight,
    });
  } catch (error) {
    console.error('Error adding orders to batch:', error);
    return NextResponse.json(
      { error: 'Failed to add orders to batch' },
      { status: 500 }
    );
  }
}

// ── DELETE /api/shipping/batches/[batchId]/orders — Remove an order from batch ──
export async function DELETE(request, { params }) {
  try {
    if (!adminDb) {
      return NextResponse.json(
        { error: 'Firebase Admin not initialized' },
        { status: 500 }
      );
    }

    const { batchId } = await params;
    const { order_id } = await request.json();

    if (!order_id) {
      return NextResponse.json(
        { error: 'order_id is required' },
        { status: 400 }
      );
    }

    // Fetch the batch
    const batchRef = adminDb.collection('shipment_batches').doc(batchId);
    const batchDoc = await batchRef.get();

    if (!batchDoc.exists) {
      return NextResponse.json({ error: 'Batch not found' }, { status: 404 });
    }

    const batchData = batchDoc.data();

    // Only allow removal before allocation
    if (
      batchData.status !== BATCH_STATUS.OPEN &&
      batchData.status !== BATCH_STATUS.WAITING_FINAL_COST
    ) {
      return NextResponse.json(
        {
          error: `Cannot remove orders from batch with status "${batchData.status}". Only allowed before cost allocation.`,
        },
        { status: 400 }
      );
    }

    // Verify order is in this batch
    const currentOrderIds = batchData.order_ids || [];
    if (!currentOrderIds.includes(order_id)) {
      return NextResponse.json(
        { error: `Order ${order_id} is not in this batch` },
        { status: 400 }
      );
    }

    const now = new Date().toISOString();
    const writeBatch = adminDb.batch();

    // Reset the order
    const orderRef = adminDb.collection('orders').doc(order_id);
    writeBatch.update(orderRef, {
      batch_id: null,
      order_status: ORDER_STATUS.WEIGHT_ENTERED,
      updated_at: now,
    });

    // Recalculate batch aggregates without this order
    const remainingOrderIds = currentOrderIds.filter((id) => id !== order_id);

    // Fetch remaining orders for accurate counts
    const remainingOrders = [];
    for (const oid of remainingOrderIds) {
      const doc = await adminDb.collection('orders').doc(oid).get();
      if (doc.exists) {
        remainingOrders.push({ id: doc.id, ...doc.data() });
      }
    }

    const uniqueCustomerIds = new Set(
      remainingOrders.map((o) => o.customer_id).filter(Boolean)
    );
    const estimatedTotalWeight = remainingOrders.reduce((sum, o) => {
      const weight = parseFloat(o.estimated_order_weight) || 0;
      return sum + weight;
    }, 0);

    // Update batch
    writeBatch.update(batchRef, {
      order_ids: remainingOrderIds,
      total_orders_count: remainingOrderIds.length,
      total_customers_count: uniqueCustomerIds.size,
      estimated_total_weight: estimatedTotalWeight,
      updated_at: now,
    });

    await writeBatch.commit();

    return NextResponse.json({
      success: true,
      removed_order: order_id,
      total_orders_count: remainingOrderIds.length,
      total_customers_count: uniqueCustomerIds.size,
      estimated_total_weight: estimatedTotalWeight,
    });
  } catch (error) {
    console.error('Error removing order from batch:', error);
    return NextResponse.json(
      { error: 'Failed to remove order from batch' },
      { status: 500 }
    );
  }
}
