import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';

export async function POST(request) {
  try {
    const orderData = await request.json();
    
    if (!adminDb) {
      return NextResponse.json({ success: false, message: 'Admin DB not initialized' }, { status: 500 });
    }

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
      
      t.set(counterRef, { seq }, { merge: true });
      
      const newOrderRef = adminDb.collection('orders').doc(newOrderId);
      t.set(newOrderRef, orderData);
    });

    return NextResponse.json({ success: true, orderId: newOrderId });
  } catch (error) {
    console.error("Error creating manual order:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
