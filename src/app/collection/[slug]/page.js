import CollectionClient from './CollectionClient';
import { fetchCollectionBySlug } from '@/app/actions/collectionActions';

export async function generateMetadata({ params }) {
  const { slug } = params;

  try {
    const colData = await fetchCollectionBySlug(slug);
    
    if (colData) {
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
