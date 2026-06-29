import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { readFile } from 'fs/promises';

async function migrateSlugs() {
  try {
    const serviceAccount = JSON.parse(
      await readFile('./houseofavirabyshamhitha-firebase-adminsdk-fbsvc-7b69da08c4.json', 'utf8')
    );

    initializeApp({
      credential: cert(serviceAccount)
    });

    const db = getFirestore();
    const productsSnapshot = await db.collection('products').get();
    
    console.log(`Found ${productsSnapshot.size} products.`);
    
    let count = 0;
    const batch = db.batch();

    for (const doc of productsSnapshot.docs) {
      const data = doc.data();
      
      // Generate slug if it doesn't exist
      if (!data.slug && data.name) {
        // Base slug from name: lowercased, replaced non-alphanumeric with hyphens
        const baseSlug = data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        // 4 digit random code
        const randomCode = Math.floor(1000 + Math.random() * 9000);
        const slug = `${baseSlug}-${randomCode}`;
        
        batch.update(doc.ref, { slug });
        console.log(`Prepared update for ${doc.id}: ${slug}`);
        count++;
      } else if (data.slug) {
        console.log(`Product ${doc.id} already has a slug: ${data.slug}`);
      }
    }

    if (count > 0) {
      console.log(`Committing ${count} updates...`);
      await batch.commit();
      console.log('Migration completed successfully.');
    } else {
      console.log('No products needed updating.');
    }
    
  } catch (error) {
    console.error('Migration failed:', error);
  }
}

migrateSlugs();
