'use server';

import { adminDb } from '@/lib/firebase-admin';

export async function fetchCollections() {
  if (!adminDb) throw new Error("Admin DB not initialized");
  const snapshot = await adminDb.collection('collections').orderBy('createdAt', 'desc').get();
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data(), createdAt: doc.data().createdAt?.toDate()?.toISOString() || null }));
}

export async function fetchCollectionBySlug(slug) {
  if (!adminDb) throw new Error("Admin DB not initialized");
  const snapshot = await adminDb.collection('collections').where('slug', '==', slug).limit(1).get();
  if (snapshot.empty) return null;
  const doc = snapshot.docs[0];
  return { id: doc.id, ...doc.data(), createdAt: doc.data().createdAt?.toDate()?.toISOString() || null };
}

export async function fetchProductsByIds(productIds) {
  if (!adminDb) throw new Error("Admin DB not initialized");
  if (!productIds || productIds.length === 0) return [];
  
  // fetch in chunks of 10 if necessary, but we can also just fetch individually since it's the admin SDK
  // or use 'in' query for chunks of 10
  const fetchPromises = productIds.map(id => adminDb.collection('products').doc(id).get());
  const snapshots = await Promise.all(fetchPromises);
  
  return snapshots
    .filter(doc => doc.exists)
    .map(doc => {
      const data = doc.data();
      return { 
        id: doc.id, 
        ...data, 
        createdAt: data.createdAt?.toDate?.()?.toISOString() || null 
      };
    });
}

export async function createCollection(data) {
  if (!adminDb) throw new Error("Admin DB not initialized");
  const ref = await adminDb.collection('collections').add({
    ...data,
    createdAt: new Date(),
    updatedAt: new Date()
  });
  return ref.id;
}

export async function updateCollection(id, data) {
  if (!adminDb) throw new Error("Admin DB not initialized");
  await adminDb.collection('collections').doc(id).update({
    ...data,
    updatedAt: new Date()
  });
  return true;
}

export async function deleteCollection(id) {
  if (!adminDb) throw new Error("Admin DB not initialized");
  await adminDb.collection('collections').doc(id).delete();
  return true;
}
