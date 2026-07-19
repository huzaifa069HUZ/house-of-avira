import OrderInfoClient from './OrderInfoClient';

export const metadata = {
  title: 'How to Order — Read Before Ordering Imported Fashion | House of Avira',
  description: 'Everything you need to know before ordering from House of Avira. Pre-order process, payment options, sizing guide, returns policy & FAQ for imported fashion.',
  alternates: { canonical: 'https://houseofavira.shop/order-info' },
  openGraph: {
    title: 'How to Order | House of Avira',
    description: 'Pre-order process, payment options & everything you need to know about ordering imported fashion.',
    url: 'https://houseofavira.shop/order-info',
  },
};

export default function OrderInfoPage() {
  return <OrderInfoClient />;
}
