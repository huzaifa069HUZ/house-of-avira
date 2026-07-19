import { redirect } from 'next/navigation';

export const metadata = {
  title: 'Policies — Returns, Refunds, Privacy & Terms | House of Avira',
  description: 'Read House of Avira policies — returns & refunds, privacy policy, terms of service & shipping policies for imported fashion orders in India.',
  alternates: {
    canonical: 'https://houseofavira.shop/policy',
  },
};

export default function PolicyPage() {
  redirect('/order-info/policies');
}
