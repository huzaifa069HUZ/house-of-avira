import ShopAestheticClient from './ShopAestheticClient';

export const metadata = {
  title: 'Shop by Aesthetic — Old Money, Korean, Pinterest, Y2K Fashion | House of Avira',
  description: 'Discover imported fashion by aesthetic at House of Avira. Old money, quiet luxury, Korean fashion, Y2K, Pinterest inspired & more. Curated style collections.',
  alternates: { canonical: 'https://houseofavira.shop/shop-aesthetic' },
  openGraph: {
    title: 'Shop by Aesthetic | House of Avira',
    description: 'Explore fashion aesthetics — old money, Korean, Pinterest, Y2K & more curated collections.',
    url: 'https://houseofavira.shop/shop-aesthetic',
  },
};

export default function ShopAestheticPage() {
  return <ShopAestheticClient />;
}
