import ShopYourLookClient from './ShopYourLookClient';

export const metadata = {
  title: 'Shop Your Look — Complete Outfit Inspiration | House of Avira',
  description: 'Get complete outfit inspiration at House of Avira. Curated imported fashion looks styled for every occasion. Shop the entire outfit in one click.',
  alternates: { canonical: 'https://houseofavira.shop/shop-your-look' },
  openGraph: {
    title: 'Shop Your Look | House of Avira',
    description: 'Complete outfit inspiration with imported fashion. Curated looks for every occasion.',
    url: 'https://houseofavira.shop/shop-your-look',
  },
};

export default function ShopYourLookPage() {
  return <ShopYourLookClient />;
}
