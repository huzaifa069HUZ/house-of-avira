import { db } from '@/lib/firebase';
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore';

// In-memory cache with TTL
let productsCache = null;
let cacheTimestamp = 0;
const CACHE_TTL = 60 * 1000; // 60 seconds

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const maxItems = parseInt(searchParams.get('limit') || '200', 10);

  const now = Date.now();
  
  // Return cached data if fresh
  if (productsCache && (now - cacheTimestamp) < CACHE_TTL) {
    const sliced = productsCache.slice(0, maxItems);
    return Response.json(sliced, {
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120',
      },
    });
  }

  try {
    const q = query(collection(db, 'products'), orderBy('createdAt', 'desc'), limit(500));
    const querySnapshot = await getDocs(q);
    const products = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      // Convert Firestore Timestamps to serializable values
      createdAt: doc.data().createdAt?.toDate?.()?.toISOString?.() || doc.data().createdAt || null,
      updatedAt: doc.data().updatedAt?.toDate?.()?.toISOString?.() || doc.data().updatedAt || null,
    }));

    // Update cache
    productsCache = products;
    cacheTimestamp = now;

    const sliced = products.slice(0, maxItems);
    return Response.json(sliced, {
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120',
      },
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    // If cache exists but is stale, still serve it on error
    if (productsCache) {
      return Response.json(productsCache.slice(0, maxItems), {
        headers: {
          'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=60',
        },
      });
    }
    return Response.json([], { status: 500 });
  }
}
