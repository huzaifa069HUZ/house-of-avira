import CategoryClient from './CategoryClient';

export default function CategoryPage({ params }) {
  // Pass the slug to the client component
  // slug[0] = main category (e.g. 'women')
  // slug[1] = sub category (e.g. 'tops')
  return <CategoryClient slug={params.slug} />;
}
