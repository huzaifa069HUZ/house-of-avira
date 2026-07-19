import ShopByPriceClient from './ShopByPriceClient';

export const metadata = {
  title: 'Shop by Price — Imported Fashion Under ₹199, ₹299, ₹599, ₹999 | House of Avira',
  description: 'Shop imported fashion by budget at House of Avira. Find premium clothing, bags & accessories under ₹199, ₹299, ₹599 & ₹999. Affordable luxury imported fashion India.',
  alternates: { canonical: 'https://houseofavira.shop/shop-by-price' },
  openGraph: {
    title: 'Shop by Price | House of Avira',
    description: 'Affordable imported fashion — shop under ₹199, ₹299, ₹599 & ₹999 at House of Avira.',
    url: 'https://houseofavira.shop/shop-by-price',
  },
};

export default function ShopByPricePage() {
  return <ShopByPriceClient />;
}
