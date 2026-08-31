import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
import admin from 'firebase-admin';

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
      clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
  });
}
const adminDb = admin.firestore();

async function test() {
  try {
    const slug = 'new';
    const colSnapshot = await adminDb.collection('collections')
      .where('slug', '==', slug)
      .limit(1)
      .get();
      
    const colDoc = colSnapshot.docs[0];
    const colData = colDoc.data();
    console.log("Collection:", colData);
    
    const productIds = colData.productIds || [];
    console.log("Product IDs:", productIds);
    
    if (productIds.length > 0) {
      const fetchPromises = productIds.map(id =>
        adminDb.collection('products').doc(id).get()
      );
      const snapshots = await Promise.all(fetchPromises);

      const products = snapshots
        .filter(doc => doc.exists)
        .map(doc => {
          const data = doc.data();
          return { id: doc.id, name: data.name };
        });
      console.log("Products found:", products.length);
    }
  } catch(e) {
    console.error(e);
  }
}

test();
