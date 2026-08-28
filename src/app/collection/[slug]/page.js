import CollectionClient from './CollectionClient';

export const metadata = {
  title: 'Collection | House of Avira',
  description: 'Shop our exclusive collections at House of Avira.',
};

export default function CollectionPage({ params }) {
  return <CollectionClient slug={params.slug} />;
}
