import { db } from '@/lib/firebase';
import { collection, getDocs, doc, updateDoc, query, where } from 'firebase/firestore';
import { generateSlug } from '@/lib/slugify';

/**
 * Migrates all existing products to have a slug field.
 * Can be called from a client component or admin page.
 * Returns a summary of what was done.
 */
export async function migrateProductSlugs() {
  const productsRef = collection(db, 'products');
  const snapshot = await getDocs(productsRef);
  
  const results = {
    total: snapshot.docs.length,
    updated: 0,
    skipped: 0,
    errors: [],
    slugMap: [] // For showing what was generated
  };

  // Track all slugs to handle duplicates within the batch
  const usedSlugs = new Set();

  // First pass: collect any existing slugs
  for (const docSnap of snapshot.docs) {
    const data = docSnap.data();
    if (data.slug) {
      usedSlugs.add(data.slug);
    }
  }

  // Second pass: generate slugs for products that don't have one
  for (const docSnap of snapshot.docs) {
    const data = docSnap.data();
    
    // Skip products that already have a slug
    if (data.slug) {
      results.skipped++;
      results.slugMap.push({
        id: docSnap.id,
        name: data.name,
        slug: data.slug,
        status: 'already had slug'
      });
      continue;
    }

    try {
      const name = data.name || 'untitled-product';
      let baseSlug = generateSlug(name);
      let slug = baseSlug;
      let counter = 1;

      // Check against both Firestore and our local batch tracker
      while (usedSlugs.has(slug)) {
        counter++;
        slug = `${baseSlug}-${counter}`;
      }

      // Update Firestore
      const docRef = doc(db, 'products', docSnap.id);
      await updateDoc(docRef, { slug });

      usedSlugs.add(slug);
      results.updated++;
      results.slugMap.push({
        id: docSnap.id,
        name: data.name,
        slug,
        status: 'created'
      });
    } catch (error) {
      results.errors.push({
        id: docSnap.id,
        name: data.name,
        error: error.message
      });
    }
  }

  return results;
}
