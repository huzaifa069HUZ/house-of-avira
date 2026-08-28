import CollectionClient from './CollectionClient';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';

export async function generateMetadata({ params }) {
  const { slug } = params;

  try {
    const q = query(collection(db, 'collections'), where('slug', '==', slug));
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      const colData = querySnapshot.docs[0].data();
      return {
        title: `${colData.title} | House of Avira`,
        description: colData.description || `Shop the exclusive ${colData.title} collection at House of Avira.`,
        openGraph: {
          title: `${colData.title} | House of Avira`,
          description: colData.description || `Shop the exclusive ${colData.title} collection at House of Avira.`,
        }
      };
    }
  } catch (error) {
    console.error("Error generating metadata for collection:", error);
  }

  return {
    title: 'Collection | House of Avira',
    description: 'Shop our exclusive collections at House of Avira.',
  };
}

export default function CollectionPage({ params }) {
  return <CollectionClient slug={params.slug} />;
}
