'use client';

import { getStatusColor } from '@/lib/shipping-constants';

export default function StatusBadge({ status, className = '' }) {
  const colors = getStatusColor(status);
  const label = status ? status.replace(/_/g, ' ') : '';

  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border ${colors.bg} ${colors.text} ${colors.border} ${className}`}
      style={{ fontFamily: "'DM Sans', sans-serif" }}
    >
      {label}
    </span>
  );
}
