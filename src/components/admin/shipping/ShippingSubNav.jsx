'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Scale, PackageCheck, Boxes, Receipt } from 'lucide-react';

const TABS = [
  {
    label: 'Weight Pending',
    href: '/admin/shipping/weight-pending',
    icon: Scale,
  },
  {
    label: 'Ready for Batch',
    href: '/admin/shipping/ready-for-batch',
    icon: PackageCheck,
  },
  {
    label: 'Batches',
    href: '/admin/shipping/batches',
    icon: Boxes,
  },
  {
    label: 'Invoices',
    href: '/admin/shipping/invoices',
    icon: Receipt,
  },
];

export default function ShippingSubNav({ activeTab }) {
  const pathname = usePathname();

  return (
    <nav
      className="flex flex-wrap sm:flex-nowrap gap-1 sm:gap-0 bg-[#e5e5ea] p-1 rounded-lg w-full sm:w-fit"
      style={{ fontFamily: "'DM Sans', sans-serif" }}
    >
      {TABS.map((tab) => {
        const Icon = tab.icon;
        // Active if explicitly set via prop, or inferred from pathname
        const isActive = activeTab
          ? activeTab === tab.href
          : pathname === tab.href || pathname?.startsWith(tab.href + '/');

        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={`flex items-center gap-2 px-4 py-1.5 text-sm font-medium rounded-md transition-all whitespace-nowrap ${
              isActive
                ? 'bg-white text-black shadow-sm'
                : 'text-[#86868b] hover:text-black'
            }`}
          >
            <Icon className="w-4 h-4" />
            {tab.label}
          </Link>
        );
      })}
    </nav>
  );
}
