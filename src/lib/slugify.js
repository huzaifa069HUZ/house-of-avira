import { collection, query, where, getDocs } from 'firebase/firestore';

/**
 * Converts a product name into a URL-safe slug.
 * Example: "Classic Leather Tote Bag" → "classic-leather-tote-bag"
 */
export function generateSlug(name) {
  if (!name) return '';
  return name
    .toLowerCase()
    .trim()
    .replace(/['']/g, '')           // Remove apostrophes/quotes
    .replace(/&/g, 'and')            // Replace & with 'and'
    .replace(/[^a-z0-9\s-]/g, '')    // Remove special characters
    .replace(/\s+/g, '-')            // Replace spaces with hyphens
    .replace(/-+/g, '-')             // Collapse multiple hyphens
    .replace(/^-|-$/g, '');          // Trim leading/trailing hyphens
}

/**
 * Generates a unique slug by checking Firestore for duplicates.
 * If "classic-leather-tote-bag" already exists, returns "classic-leather-tote-bag-2", etc.
 * 
 * @param {string} name - The product name
 * @param {object} db - Firestore database instance
 * @param {string|null} excludeDocId - Document ID to exclude (for editing existing products)
 * @returns {Promise<string>} A unique slug
 */
export async function generateUniqueSlug(name, db, excludeDocId = null) {
  const baseSlug = generateSlug(name);
  if (!baseSlug) return '';

  const productsRef = collection(db, 'products');
  let slug = baseSlug;
  let counter = 1;

  while (true) {
    const q = query(productsRef, where('slug', '==', slug));
    const snapshot = await getDocs(q);

    // Check if the slug is taken by a DIFFERENT document
    const isTaken = snapshot.docs.some(doc => doc.id !== excludeDocId);

    if (!isTaken) {
      return slug;
    }

    counter++;
    slug = `${baseSlug}-${counter}`;
  }
}
