import Fuse from 'fuse.js';
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

/**
 * Creates and returns a Fuse.js instance for searching products
 */
export function createSearchIndex(products) {
  const options = {
    keys: [
      { name: 'name', weight: 2.0 },
      { name: 'category', weight: 1.0 },
      { name: 'subcategory', weight: 1.0 },
      { name: 'description', weight: 0.5 }
    ],
    threshold: 0.4, // Lower means more strict, 0.4 allows some typos
    distance: 100,
    includeScore: true,
    ignoreLocation: true // Search anywhere in the text
  };

  return new Fuse(products, options);
}

/**
 * Searches the index and returns formatted results
 */
export function search(index, query, limit = 50) {
  if (!query || !index) return [];
  
  const results = index.search(query, { limit });
  return results.map(result => ({
    ...result.item,
    _score: result.score
  }));
}

/**
 * Gets top suggestions for autocomplete
 */
export function getTopSuggestions(index, query, limit = 5) {
  return search(index, query, limit);
}

/**
 * If search returns zero results, try with a looser threshold 
 * to find a "Did you mean?" suggestion
 */
export function getDidYouMean(products, query) {
  if (!query || !products || products.length === 0) return null;

  const looseOptions = {
    keys: ['name', 'category', 'subcategory'],
    threshold: 0.6, // Very loose to catch bad typos
    distance: 100,
  };
  
  const looseIndex = new Fuse(products, looseOptions);
  const results = looseIndex.search(query, { limit: 1 });
  
  if (results.length > 0 && results[0].score < 0.6) {
    return results[0].item.name;
  }
  
  return null;
}

/**
 * Log search query for analytics
 */
export async function logSearchAnalytics(query, resultsCount, source, userId = null) {
  if (!query || query.trim() === '') return;
  
  try {
    await addDoc(collection(db, 'search_analytics'), {
      query: query.trim().toLowerCase(),
      resultsCount,
      source,
      userId,
      timestamp: serverTimestamp()
    });
  } catch (error) {
    console.error('Failed to log search analytics:', error);
  }
}
