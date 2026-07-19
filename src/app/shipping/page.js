import ShippingClient from './ShippingClient';

export const metadata = {
  title: 'Shipping Information — International Delivery to India | House of Avira',
  description: 'Learn about House of Avira shipping process. International to India delivery, customs, timeline, and two-step shipping payment model for imported pre-orders.',
  alternates: { canonical: 'https://houseofavira.shop/shipping' },
  openGraph: {
    title: 'Shipping & Delivery | House of Avira',
    description: 'Everything you need to know about our international shipping process to India.',
    url: 'https://houseofavira.shop/shipping',
  },
};

export default function ShippingPage() {
  return <ShippingClient />;
}
