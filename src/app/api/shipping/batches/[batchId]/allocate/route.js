import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import {
  BATCH_STATUS,
  SHIPPING_PAYMENT_STATUS,
  roundCurrency,
} from '@/lib/shipping-constants';

// ── POST /api/shipping/batches/[batchId]/allocate — Calculate shipping allocation ──
export async function POST(request, { params }) {
  try {
    if (!adminDb) {
      return NextResponse.json(
        { error: 'Firebase Admin not initialized' },
        { status: 500 }
      );
    }

    const { batchId } = await params;

    // 1. Fetch batch and validate
    const batchRef = adminDb.collection('shipment_batches').doc(batchId);
    const batchDoc = await batchRef.get();

    if (!batchDoc.exists) {
      return NextResponse.json({ error: 'Batch not found' }, { status: 404 });
    }

    const batchData = batchDoc.data();

    if (
      !batchData.final_total_shipment_cost ||
      batchData.final_total_shipment_cost <= 0
    ) {
      return NextResponse.json(
        {
          error:
            'Final total shipment cost must be set and greater than 0 before allocation.',
        },
        { status: 400 }
      );
    }

    const finalCost = parseFloat(batchData.final_total_shipment_cost);

    // 2. Fetch all orders in this batch
    const orderIds = batchData.order_ids || [];
    if (orderIds.length === 0) {
      return NextResponse.json(
        { error: 'No orders in this batch to allocate.' },
        { status: 400 }
      );
    }

    const orders = [];
    for (const orderId of orderIds) {
      const orderDoc = await adminDb.collection('orders').doc(orderId).get();
      if (orderDoc.exists) {
        orders.push({ id: orderDoc.id, ...orderDoc.data() });
      }
    }

    // Validate each order has weight
    for (const order of orders) {
      const weight = parseFloat(order.estimated_order_weight);
      if (!weight || weight <= 0) {
        return NextResponse.json(
          {
            error: `Order ${order.id} has no valid weight (estimated_order_weight: ${order.estimated_order_weight}). All orders must have weight > 0.`,
          },
          { status: 400 }
        );
      }
    }

    // 3. Calculate batch total weight
    const batchEstimatedTotalWeight = orders.reduce((sum, order) => {
      return sum + parseFloat(order.estimated_order_weight);
    }, 0);

    // 4. Calculate allocation for each order
    const allocations = orders.map((order) => {
      const orderWeight = parseFloat(order.estimated_order_weight);
      const weightSharePercent = orderWeight / batchEstimatedTotalWeight;
      const allocatedShippingAmount = weightSharePercent * finalCost;
      const roundedShippingAmount = roundCurrency(allocatedShippingAmount);

      return {
        order_id: order.id,
        batch_id: batchId,
        customer_id: order.customer_id || null,
        customer_name: order.customer_name || order.shipping_name || null,
        customer_email: order.customer_email || order.email || null,
        order_weight: orderWeight,
        weight_share_percent: roundCurrency(weightSharePercent * 100),
        allocated_shipping_amount: allocatedShippingAmount,
        rounded_shipping_amount: roundedShippingAmount,
        batch_total_weight: batchEstimatedTotalWeight,
        batch_total_cost: finalCost,
      };
    });

    const now = new Date().toISOString();
    const writeBatch = adminDb.batch();

    // 5. Delete existing allocations for this batch (for recalculation)
    const existingAllocations = await adminDb
      .collection('batch_allocations')
      .where('batch_id', '==', batchId)
      .get();

    for (const allocDoc of existingAllocations.docs) {
      writeBatch.delete(allocDoc.ref);
    }

    // Create new allocation documents
    const allocationResults = [];
    for (const allocation of allocations) {
      const allocRef = adminDb.collection('batch_allocations').doc();
      const allocData = {
        ...allocation,
        created_at: now,
        updated_at: now,
      };
      writeBatch.set(allocRef, allocData);
      allocationResults.push({ id: allocRef.id, ...allocData });
    }

    // 6. Update each order with shipping amount
    for (const allocation of allocations) {
      const orderRef = adminDb.collection('orders').doc(allocation.order_id);
      writeBatch.update(orderRef, {
        shipping_due_amount: allocation.rounded_shipping_amount,
        shipping_payment_status: SHIPPING_PAYMENT_STATUS.NOT_PAID,
        updated_at: now,
      });
    }

    // 7. Update batch status and metadata
    writeBatch.update(batchRef, {
      status: BATCH_STATUS.COST_ALLOCATED,
      estimated_total_weight: batchEstimatedTotalWeight,
      allocation_generated_at: now,
      updated_at: now,
    });

    await writeBatch.commit();

    // 8. Return allocation results
    return NextResponse.json({
      success: true,
      batch_id: batchId,
      final_total_shipment_cost: finalCost,
      batch_estimated_total_weight: batchEstimatedTotalWeight,
      total_orders_allocated: allocations.length,
      allocations: allocationResults,
    });
  } catch (error) {
    console.error('Error allocating shipping costs:', error);
    return NextResponse.json(
      { error: 'Failed to allocate shipping costs' },
      { status: 500 }
    );
  }
}
