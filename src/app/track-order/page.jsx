import TrackOrderClient from './TrackOrderClient';

export const metadata = {
  title: 'Track Your Order — Order Status & Delivery Tracking | House of Avira',
  description: 'Track your House of Avira order in real-time. Check delivery status, estimated arrival & shipping updates for your imported fashion order.',
  alternates: { canonical: 'https://houseofavira.shop/track-order' },
  openGraph: {
    title: 'Track Your Order | House of Avira',
    description: 'Track your imported fashion order status and delivery in real-time.',
    url: 'https://houseofavira.shop/track-order',
  },
};

export default function TrackOrderPage() {
  return <TrackOrderClient />;
}
