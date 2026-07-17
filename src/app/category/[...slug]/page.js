import CategoryClient from './CategoryClient';

function getCategoryName(slugArray) {
  if (!slugArray || slugArray.length === 0) return 'Category';
  const main = slugArray[0];
  const sub = slugArray.length > 1 ? slugArray[1] : '';
  
  const formatName = (str) => str.charAt(0).toUpperCase() + str.slice(1).replace(/-/g, ' ');
  
  if (sub) {
    return `${formatName(sub)} | ${formatName(main)}`;
  }
  return formatName(main);
}

export async function generateMetadata({ params: paramsPromise }) {
  const params = await paramsPromise;
  const categoryName = getCategoryName(params.slug);
  
  return {
    title: `${categoryName} | House of Avira`,
    description: `Shop the latest ${categoryName.toLowerCase()} at House of Avira. Premium import based shopping and trendy luxury aesthetics.`,
    openGraph: {
      title: `${categoryName} | House of Avira`,
      description: `Shop the latest ${categoryName.toLowerCase()} at House of Avira.`,
      images: ["/opengraph-image.png"],
    },
  };
}

export default async function CategoryPage({ params }) {
  // Pass the slug to the client component
  // slug[0] = main category (e.g. 'women')
  // slug[1] = sub category (e.g. 'tops')
  const resolvedParams = await params;
  return <CategoryClient slug={resolvedParams.slug} />;
}
