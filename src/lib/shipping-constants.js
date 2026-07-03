// ─── Shipment Batch Management — Constants & Helpers ───
// Centralized enums, status labels, colors, and currency config

// ── Order Status ──
export const ORDER_STATUS = {
  PLACED: 'PLACED',
  PRODUCT_PAID: 'PRODUCT_PAID',
  WEIGHT_ENTERED: 'WEIGHT_ENTERED',
  IN_BATCH: 'IN_BATCH',
  SHIPPING_INVOICED: 'SHIPPING_INVOICED',
  SHIPPING_PAID: 'SHIPPING_PAID',
  PROCESSING: 'PROCESSING',
  SHIPPED: 'SHIPPED',
  DELIVERED: 'DELIVERED',
  CANCELLED: 'CANCELLED',
};

export const ORDER_STATUS_LABELS = {
  [ORDER_STATUS.PLACED]: 'Order Placed',
  [ORDER_STATUS.PRODUCT_PAID]: 'Product Paid',
  [ORDER_STATUS.WEIGHT_ENTERED]: 'Weight Entered',
  [ORDER_STATUS.IN_BATCH]: 'In Batch',
  [ORDER_STATUS.SHIPPING_INVOICED]: 'Shipping Invoiced',
  [ORDER_STATUS.SHIPPING_PAID]: 'Shipping Paid',
  [ORDER_STATUS.PROCESSING]: 'Processing',
  [ORDER_STATUS.SHIPPED]: 'Shipped',
  [ORDER_STATUS.DELIVERED]: 'Delivered',
  [ORDER_STATUS.CANCELLED]: 'Cancelled',
};

// ── Weight Status ──
export const WEIGHT_STATUS = {
  PENDING: 'PENDING',
  ENTERED: 'ENTERED',
};

// ── Product Payment Status ──
export const PRODUCT_PAYMENT_STATUS = {
  PENDING: 'PENDING',
  CONFIRMED: 'CONFIRMED',
  FAILED: 'FAILED',
};

// ── Shipping Payment Status ──
export const SHIPPING_PAYMENT_STATUS = {
  NOT_APPLICABLE: 'NOT_APPLICABLE',
  NOT_PAID: 'NOT_PAID',
  PAID: 'PAID',
};

// ── Batch Status ──
export const BATCH_STATUS = {
  OPEN: 'OPEN',
  WAITING_FINAL_COST: 'WAITING_FINAL_COST',
  COST_ALLOCATED: 'COST_ALLOCATED',
  INVOICES_GENERATED: 'INVOICES_GENERATED',
  CLOSED: 'CLOSED',
};

export const BATCH_STATUS_LABELS = {
  [BATCH_STATUS.OPEN]: 'Open',
  [BATCH_STATUS.WAITING_FINAL_COST]: 'Waiting for Final Cost',
  [BATCH_STATUS.COST_ALLOCATED]: 'Cost Allocated',
  [BATCH_STATUS.INVOICES_GENERATED]: 'Invoices Generated',
  [BATCH_STATUS.CLOSED]: 'Closed',
};

// ── Invoice Status ──
export const INVOICE_STATUS = {
  DRAFT: 'DRAFT',
  SENT: 'SENT',
  PAID: 'PAID',
  OVERDUE: 'OVERDUE',
  CANCELLED: 'CANCELLED',
};

export const INVOICE_PAYMENT_STATUS = {
  NOT_PAID: 'NOT_PAID',
  PAID: 'PAID',
  MANUAL_CONFIRMED: 'MANUAL_CONFIRMED',
};

// ── Status Colors (Tailwind class strings matching existing admin style) ──
export const STATUS_COLORS = {
  // Order statuses
  [ORDER_STATUS.PLACED]: { bg: 'bg-yellow-50', text: 'text-yellow-700', border: 'border-yellow-200' },
  [ORDER_STATUS.PRODUCT_PAID]: { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200' },
  [ORDER_STATUS.WEIGHT_ENTERED]: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
  [ORDER_STATUS.IN_BATCH]: { bg: 'bg-indigo-50', text: 'text-indigo-700', border: 'border-indigo-200' },
  [ORDER_STATUS.SHIPPING_INVOICED]: { bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-200' },
  [ORDER_STATUS.SHIPPING_PAID]: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' },
  [ORDER_STATUS.PROCESSING]: { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200' },
  [ORDER_STATUS.SHIPPED]: { bg: 'bg-cyan-50', text: 'text-cyan-700', border: 'border-cyan-200' },
  [ORDER_STATUS.DELIVERED]: { bg: 'bg-green-50', text: 'text-green-800', border: 'border-green-300' },
  [ORDER_STATUS.CANCELLED]: { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200' },
  // Batch statuses
  [BATCH_STATUS.OPEN]: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
  [BATCH_STATUS.WAITING_FINAL_COST]: { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' },
  [BATCH_STATUS.COST_ALLOCATED]: { bg: 'bg-violet-50', text: 'text-violet-700', border: 'border-violet-200' },
  [BATCH_STATUS.INVOICES_GENERATED]: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' },
  [BATCH_STATUS.CLOSED]: { bg: 'bg-gray-100', text: 'text-gray-600', border: 'border-gray-200' },
  // Invoice statuses
  [INVOICE_STATUS.DRAFT]: { bg: 'bg-gray-100', text: 'text-gray-600', border: 'border-gray-200' },
  [INVOICE_STATUS.SENT]: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
  [INVOICE_STATUS.PAID]: { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200' },
  [INVOICE_STATUS.OVERDUE]: { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200' },
  [INVOICE_STATUS.CANCELLED]: { bg: 'bg-gray-100', text: 'text-gray-500', border: 'border-gray-200' },
  // Payment statuses
  [INVOICE_PAYMENT_STATUS.NOT_PAID]: { bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-200' },
  [INVOICE_PAYMENT_STATUS.PAID]: { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200' },
  [INVOICE_PAYMENT_STATUS.MANUAL_CONFIRMED]: { bg: 'bg-teal-50', text: 'text-teal-700', border: 'border-teal-200' },
  [SHIPPING_PAYMENT_STATUS.NOT_PAID]: { bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-200' },
  [SHIPPING_PAYMENT_STATUS.PAID]: { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200' },
  [SHIPPING_PAYMENT_STATUS.NOT_APPLICABLE]: { bg: 'bg-gray-50', text: 'text-gray-500', border: 'border-gray-200' },
  [PRODUCT_PAYMENT_STATUS.PENDING]: { bg: 'bg-yellow-50', text: 'text-yellow-700', border: 'border-yellow-200' },
  [PRODUCT_PAYMENT_STATUS.CONFIRMED]: { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200' },
  [PRODUCT_PAYMENT_STATUS.FAILED]: { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200' },
};

export function getStatusColor(status) {
  return STATUS_COLORS[status] || { bg: 'bg-gray-100', text: 'text-gray-600', border: 'border-gray-200' };
}

// ── Currency Configuration ──
export const CURRENCIES = {
  INR: { code: 'INR', symbol: '₹', name: 'Indian Rupee' },
  USD: { code: 'USD', symbol: '$', name: 'US Dollar' },
  PHP: { code: 'PHP', symbol: '₱', name: 'Philippine Peso' },
  AED: { code: 'AED', symbol: 'د.إ', name: 'UAE Dirham' },
};

// Map delivery countries to currencies
const COUNTRY_CURRENCY_MAP = {
  'india': 'INR',
  'united states': 'USD',
  'united states of america': 'USD',
  'usa': 'USD',
  'us': 'USD',
  'philippines': 'PHP',
  'united arab emirates': 'AED',
  'uae': 'AED',
  'dubai': 'AED',
};

export function getCurrencyForCountry(country) {
  if (!country) return CURRENCIES.INR;
  const key = country.toLowerCase().trim();
  const currencyCode = COUNTRY_CURRENCY_MAP[key] || 'INR';
  return CURRENCIES[currencyCode];
}

export function formatCurrency(amount, currencyCode = 'INR') {
  const currency = CURRENCIES[currencyCode] || CURRENCIES.INR;
  const rounded = Math.round(amount * 100) / 100;
  return `${currency.symbol}${rounded.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

// ── Allocation Helpers ──
export function roundCurrency(amount) {
  return Math.round(amount * 100) / 100;
}

export function generateBatchName() {
  const now = new Date();
  const month = now.toLocaleString('en-US', { month: 'short' }).toUpperCase();
  const year = now.getFullYear();
  const rand = Math.floor(Math.random() * 900) + 100;
  return `BATCH-${year}-${month}-${rand}`;
}

export function generateInvoiceNumber() {
  const now = new Date();
  const ts = now.getTime().toString(36).toUpperCase();
  return `SHP-INV-${ts}`;
}
