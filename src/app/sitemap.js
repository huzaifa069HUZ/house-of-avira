import { db } from '@/lib/firebase';
import { collection, getDocs } from 'firebase/firestore';

export default async function sitemap() {
  const baseUrl = 'https://houseofavira.shop';

  // Fetch all products
  let products = [];
  try {
    const querySnapshot = await getDocs(collection(db, 'products'));
    products = querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        url: `${baseUrl}/product/${data.slug || doc.id}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.8,
      };
    });
  } catch (error) {
    console.error("Error fetching products for sitemap:", error);
  }

  // Define static routes
  const staticRoutes = [
    '',
    '/catalogue',
    '/category/women',
    '/category/accessories',
    '/policy',
    '/faq',
    '/contact',
    '/track-order'
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === '' ? 'daily' : 'weekly',
    priority: route === '' ? 1.0 : 0.7,
  }));

  return [...staticRoutes, ...products];
}
