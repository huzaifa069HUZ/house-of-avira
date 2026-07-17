import { db } from '@/lib/firebase';
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import ProductClient from './ProductClient';

// Helper function to fetch product by slug or id
async function getProduct(idOrSlug) {
  try {
    const productsRef = collection(db, 'products');
    const q = query(productsRef, where('slug', '==', idOrSlug));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      return { id: querySnapshot.docs[0].id, ...querySnapshot.docs[0].data() };
    }
    
    const docRef = doc(db, 'products', idOrSlug);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    }
  } catch (error) {
    console.error("Error fetching product for metadata:", error);
  }
  return null;
}

export async function generateMetadata({ params: paramsPromise }) {
  const params = await paramsPromise;
  const product = await getProduct(params.id);

  if (!product) {
    return {
      title: 'Product Not Found | House of Avira',
    };
  }

  const images = product.images || [];
  const imageUrl = images.length > 0 ? images[0] : '/opengraph-image.png';

  return {
    title: `${product.name} | House of Avira`,
    description: product.description ? product.description.substring(0, 160) : `Buy ${product.name} from House of Avira. Premium import based shopping for trendy clothes.`,
    openGraph: {
      title: `${product.name} | House of Avira`,
      description: product.description ? product.description.substring(0, 160) : `Buy ${product.name} from House of Avira.`,
      images: [
        {
          url: imageUrl,
          width: 800,
          height: 800,
          alt: product.name,
        },
      ],
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${product.name} | House of Avira`,
      description: product.description ? product.description.substring(0, 160) : `Buy ${product.name} from House of Avira.`,
      images: [imageUrl],
    }
  };
}

export default async function ProductPage({ params }) {
  const resolvedParams = await params;
  const product = await getProduct(resolvedParams.id);
  
  // Create Product structured data
  const jsonLd = product ? {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    image: product.images || [],
    description: product.description || `Buy ${product.name} from House of Avira`,
    offers: {
      '@type': 'Offer',
      url: `https://houseofavira.shop/product/${product.slug || product.id}`,
      priceCurrency: 'INR',
      price: product.price,
      availability: 'https://schema.org/InStock',
      seller: {
        '@type': 'Organization',
        name: 'House of Avira'
      }
    }
  } : null;

  return (
    <>
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
      <ProductClient params={params} />
    </>
  );
}
