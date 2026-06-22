# House of Avira — Product Requirements Document (PRD)
### Version 2.0 | For AI-Assisted Development
### Based on: Website Development Contract (Signed 6 June 2026) + Client Updated Requirements

---

> **AI DEVELOPER INSTRUCTIONS**
> This PRD is written for an AI agent that will generate the complete codebase. Read every section fully before writing any code. This document is the single source of truth. Do not infer, skip, or simplify any requirement. Every feature described here must be implemented exactly as specified.

---

## 1. PROJECT OVERVIEW

**Product Name:** House of Avira — Preorder E-Commerce Website
**Business Type:** International preorder and import-based e-commerce business
**Core Business Model:** Customers place preorders by paying only the product price upfront. International shipping charges and domestic shipping charges are collected separately at a later stage. No cancellations, refunds, or exchanges are permitted after an order is placed.
**Objective:** Replace manual Instagram DM-based ordering with a fully automated, customer-educating e-commerce website that handles preorder management, payment collection, order tracking, and admin operations.

**The website has two audiences:**
1. **Customers** — browse, learn, acknowledge terms, add to cart, checkout, and track orders
2. **Admins** — manage products, orders, shipping, customers, and site content

**The website must constantly educate the customer** about the preorder nature of the business. This is not optional. Every key page must surface these facts prominently.

---

## 2. TECH STACK

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router) |
| Styling | Tailwind CSS |
| Database | Firebase Firestore |
| Authentication | Firebase Auth |
| Media Storage | Cloudinary |
| Payments | Razorpay |
| Email | Brevo (Sendinblue) — Transactional API |
| Hosting | Vercel |
| Domestic Shipping Rates | Shiprocket API |
| AI Chatbot | Gemini API (Google) OR Chatbase embed — to be integrated as final phase |

---

## 3. USER ROLES

### 3.1 Customer (Public User)
- Browses the product catalogue
- Reads product details and preorder information
- Creates an account or logs in
- Adds products to cart
- Views and manages cart
- Completes mandatory acknowledgment before checkout
- Pays product price via Razorpay
- Views order confirmation
- Tracks order status via Order Tracking page
- Views order history in their dashboard
- Saves products to wishlist
- Manages profile and multiple delivery addresses
- Subscribes to newsletter
- Submits product reviews and ratings
- Contacts support via contact form
- Uses WhatsApp chat/support button

### 3.2 Admin (Owner — Full Access)
- Full access to all admin panel sections
- Manages products, categories, inventory
- Manages all orders and order statuses
- Manages customers
- Manages batches and shipping cost calculations
- Configures shipping and payment settings
- Manages coupons and discounts
- Manages banners and homepage content
- Views analytics and sales reports
- Manages user roles and permissions
- Manages returns and refunds
- Moderates reviews and ratings
- Manages notifications (email/SMS/WhatsApp)
- Manages SEO settings
- Manages tax settings
- Bulk import/export products
- Views audit logs and activity tracking
- Manages backups and restore

### 3.3 Admin (Team Member — Limited Access)
- Views and manages orders only
- Updates order statuses
- Adds tracking information
- Views customer details linked to orders

---

## 4. PERSISTENT SITE-WIDE CUSTOMER EDUCATION

> **CRITICAL REQUIREMENT:** The following information must be visible throughout the entire website. It must NOT be hidden exclusively within policy pages. It must appear prominently on the homepage, product pages, cart, checkout, and confirmation pages.

The website must permanently communicate:
- Products are imported
- Delivery timelines are estimates only
- International shipping charges are separate and compulsory
- Domestic shipping charges are separate and compulsory
- Shipping costs vary by product, weight, and category
- No cancellations are permitted after ordering
- No refunds are permitted after ordering
- No exchanges are permitted after ordering

**Implementation:** A persistent sticky banner must appear across the entire website at all times. It must not be dismissible. Suggested text: *"House of Avira is a preorder & import business. Shipping is charged separately. Delivery timelines are estimates. No cancellations or refunds after ordering."*

---

## 5. COMPLETE PAGE AND ROUTE STRUCTURE

```
PUBLIC ROUTES:
/                          Homepage
/catalogue                 Product catalogue
/product/[slug]            Product detail page
/cart                      Shopping cart
/checkout/acknowledge      Mandatory acknowledgment (pre-checkout)
/checkout                  Checkout form + Razorpay payment
/checkout/success          Order confirmation page
/track                     Order tracking page
/how-it-works              Process explainer page
/policies                  Policies and FAQ page
/wholesale                 B2B / Wholesale enquiry page
/contact                   Contact Us page
/faq                       FAQ page
/returns                   Return, Refund & Cancellation policy
/privacy-policy            Privacy Policy page
/terms-and-conditions      Terms & Conditions page

AUTH ROUTES:
/auth/register             Customer registration
/auth/login                Customer login

CUSTOMER DASHBOARD:
/account                   Account dashboard
/account/orders            Order history
/account/orders/[id]       Order detail + tracking
/account/wishlist          Saved wishlist
/account/profile           Profile management
/account/addresses         Delivery address management

ADMIN ROUTES (all protected):
/admin                     Admin dashboard
/admin/products            Product list
/admin/products/new        Add product
/admin/products/[id]       Edit product
/admin/categories          Category management
/admin/orders              Order management board (Kanban)
/admin/orders/[id]         Order detail page
/admin/batches             Batch manager
/admin/batches/[id]        Batch detail + shipping calculator
/admin/customers           Customer directory
/admin/shipping            Shipping management
/admin/coupons             Coupon & discount management
/admin/banners             Banner management
/admin/homepage            Homepage content management
/admin/reviews             Review & rating moderation
/admin/returns             Returns & refund management
/admin/reports             Sales reports & analytics
/admin/tax                 Tax management
/admin/notifications       Notification management
/admin/seo                 SEO settings
/admin/users               User roles & permissions
/admin/newsletter          Newsletter subscriber management
/admin/support             Customer support / inquiry management
/admin/logs                Audit logs & activity tracking
/admin/backup              Backup & restore management
/admin/settings            Website settings management

API ROUTES:
/api/razorpay/create-order
/api/razorpay/create-payment-link
/api/razorpay/webhook
/api/email/send
/api/shipping/calculate
/api/shiprocket/rates
/api/chatbot                  (AI chatbot proxy — final phase)
```

---

## 6. PUBLIC WEBSITE — FEATURE SPECIFICATIONS

### 6.1 Homepage

**Persistent Education Banner (sticky, non-dismissible):**
- Displayed at the very top of every page
- Text: "This is a preorder business. Products are imported. Shipping is charged separately. No cancellations or refunds after ordering."
- Cannot be closed by the user

**Hero Section:**
- Full-width hero with brand imagery
- Tagline communicating the preorder nature of the business
- Call to action: "Browse Products" button linking to `/catalogue`

**How It Works Section (3-step visual):**
- Step 1: Browse & Add to Cart
- Step 2: Acknowledge Terms & Pay Product Price
- Step 3: Receive Updates & Get Your Order

**Trust Strip:**
- Displays: total orders delivered, years active, countries sourced from

**Category Quick Links:**
- Visual grid linking to filtered catalogue pages (Bags, Apparel, Accessories, Beauty, Branded, Budget)

**New Arrivals Grid:**
- Latest 8 products displayed as cards
- Each card: product image, name, category badge, price, "Preorder" tag

**Customer Education Block (must appear on homepage):**
- Clear block explaining:
  - This is a preorder business
  - International shipping is charged separately after batch processing
  - Domestic shipping is charged separately before final dispatch
  - No cancellations, refunds, or exchanges

**Newsletter Subscription Bar:**
- Email input + subscribe button
- On submit: store email in Firestore `/newsletter_subscribers`

**Footer:**
- Links: Policies, FAQ, Returns, Privacy Policy, Terms & Conditions, How It Works, Contact Us, Wholesale
- Social media links
- WhatsApp contact button

---

### 6.2 Product Catalogue Page (`/catalogue`)

**Layout:**
- Responsive grid (3 columns desktop, 2 tablet, 1 mobile)
- Filter sidebar/bar: All / Bags / Apparel / Accessories / Beauty / Branded / Budget
- Sorting: Newest / Price: Low to High / Price: High to Low / Popularity
- Search bar at top

**Product Card:**
- Product image
- Product name
- Category badge
- Price (clearly displayed)
- "Preorder Available" tag
- "Add to Cart" button directly on card
- "Add to Wishlist" icon button
- Clicking the card image/name goes to Product Detail Page

**Pagination or infinite scroll**

---

### 6.3 Product Detail Page (`/product/[slug]`)

**Every product page must clearly display all of the following:**

**Product Images:**    
- Multiple images with gallery/carousel view

**Product Information:**
- Product name
- Product category (linked to filtered catalogue)
- Product price (clearly shown)
- Product description
- Product variants (size, color, etc. if applicable)

**Preorder Information Block (mandatory, visually prominent):**
- "This is a preorder item"
- Estimated delivery timeline (e.g., "6–10 weeks estimated")
- "Delivery timelines are estimates only. Delays may occur."
- "This product is imported from abroad."

**Shipping Information Block (mandatory, visually prominent):**
- "Product price does NOT include international shipping charges"
- "Product price does NOT include domestic shipping charges"
- "International shipping is compulsory and will be charged separately after your batch is processed"
- "Domestic shipping will be charged separately before final dispatch"
- "Shipping costs vary based on weight, customs duties, taxes, and product category"
- International shipping calculator widget (allows customers to estimate costs)

**Category-Specific Notices (conditional):**
- Footwear: "Footwear may attract higher shipping due to box size and weight"
- Branded items: "Branded products may attract additional customs duty charges"
- Large/oversized items: "This item may attract higher import and shipping costs due to size/weight"
- Customs and taxes notice: applicable for all products

**Policy Notice Block:**
- "No cancellations, refunds, or exchanges after ordering. Please read our full policy before purchasing."
- Link to `/policies`

**Action Buttons:**
- "Add to Cart" — primary button
- "Add to Wishlist" — secondary button

**Product Reviews and Ratings Section:**
- Display existing approved reviews with star ratings
- Logged-in customers who have ordered this product can submit a review

**Recently Viewed Products:**
- Shows last 4–6 viewed products (stored in localStorage)

---

### 6.4 Shopping Cart (`/cart`)

**Cart Page Features:**
- List all cart items: product image, name, price, quantity controls (increase/decrease/remove)
- "Update Quantity" and "Remove Item" for each line
- Order subtotal
- Notice: "Shipping charges are NOT included. International and domestic shipping will be charged separately."
- Coupon/discount code input field — validate against Firestore coupons collection, apply discount
- Estimated international shipping display (based on product category averages — clearly marked as estimate)
- "Proceed to Checkout" button — leads to `/checkout/acknowledge`
- "Continue Shopping" link back to catalogue
- Empty cart state with prompt to browse products

---

### 6.5 Mandatory Acknowledgment Page (`/checkout/acknowledge`)

> **This page is non-skippable. The customer cannot proceed to payment without completing every checkbox.**

**Display:**
- Order summary (products in cart, prices, total)
- Clear heading: "Before you proceed, please read and confirm the following"

**Six mandatory checkboxes (ALL must be ticked to enable Proceed button):**
1. ☐ I understand this is a preorder item. Products are not available for immediate delivery.
2. ☐ I understand delivery timelines are estimates only and may vary due to factors outside House of Avira's control.
3. ☐ I understand international shipping charges are compulsory and will be collected separately at a later stage.
4. ☐ I understand domestic shipping charges are compulsory and will be collected separately before final dispatch.
5. ☐ I understand shipping costs may vary based on weight, customs duties, taxes, packaging requirements, and product category.
6. ☐ I understand there are absolutely no cancellations, refunds, or exchanges after placing an order.

**Behavior:**
- "Proceed to Checkout" button is disabled until all 6 checkboxes are ticked
- On proceed: log acknowledgment to Firestore with timestamp, user ID, and IP address
- Then redirect to `/checkout`

---

### 6.6 Checkout Page (`/checkout`)

**Customer Information Fields (required):**
- Full Name
- Phone Number
- Email Address
- Instagram Handle
- Delivery Address:
  - Address Line 1
  - Address Line 2 (optional)
  - City
  - State
  - Pincode
  - Country

**If logged in:** pre-fill from saved profile / saved addresses. Allow selection from multiple saved addresses.

**Order Summary Panel:**
- Product name(s), quantity, price
- Coupon/discount applied (if any)
- Total amount payable now (product price only)
- Clear notice: "You are paying the product price only. International and domestic shipping will be invoiced separately."

**Payment:**
- Razorpay checkout integration
- Supports: UPI, GPay, Paytm, Credit/Debit Cards, Net Banking
- On payment success → Firestore order created → confirmation email sent → redirect to `/checkout/success`
- On payment failure → show error, allow retry

---

### 6.7 Order Confirmation Page (`/checkout/success`)

**Displays:**
- Order confirmation message
- Unique order number
- Summary of what was ordered
- Expected next steps:
  1. You will receive an email confirmation
  2. Your order will be added to a batch
  3. International shipping will be calculated and sent to you
  4. Domestic shipping will be calculated and sent to you
  5. Your order will be dispatched
- Link to track order: `/track`
- Link to order in customer account: `/account/orders`

---

### 6.8 Order Tracking Page (`/track`)

**Public tracking (no login required):**
- Input: Email address + Order number
- Returns: order status, payment history, shipping status, tracking ID (when available)

**Order Status Visual Timeline (13 stages):**
1. Order Placed
2. Product Payment Received
3. Batch Being Collected
4. Supplier Order Placed
5. Products at International Warehouse
6. International Shipping Amount Sent to Customer
7. International Shipping Paid
8. Shipment Dispatched to India
9. Arrived in India
10. Domestic Shipping Amount Sent to Customer
11. Domestic Shipping Paid
12. Order Dispatched Domestically
13. Delivered

**Display for each completed stage:** timestamp of stage completion

---

### 6.9 How It Works Page (`/how-it-works`)

**Content sections:**
- Full visual journey: how a preorder works from browsing to delivery
- Two-tier shipping diagram: International (supplier → Avira's warehouse) + Domestic (Avira → customer)
- Why shipping is not included in product price (batch weight explanation)
- Air vs Sea shipping comparison (timeframes and cost differences)
- Customs and duties explained in plain language
- Estimated timelines (clearly labeled as estimates)
- FAQ accordions for common questions

---

### 6.10 Policies Page (`/policies`)

- All store policies in full
- Searchable FAQ accordion
- Sections: Store Policies / Shipping Policies / Customer Responsibilities / About Preorders
- Shareable URL (for team to paste in customer DMs)

---

### 6.11 FAQ Page (`/faq`)
- Dedicated FAQ accordion page separate from Policies
- Categories: Ordering, Shipping, Payments, Tracking, Returns, General

---

### 6.12 Returns, Refund & Cancellation Policy Page (`/returns`)
- Full policy text
- Clear statement: No cancellations, no refunds, no exchanges after ordering
- Exceptions (if any) clearly stated

---

### 6.13 Privacy Policy Page (`/privacy-policy`)
- Standard privacy policy covering data collection, usage, storage

---

### 6.14 Terms & Conditions Page (`/terms-and-conditions`)
- Full T&C covering preorder nature, shipping obligations, customer responsibilities

---

### 6.15 Contact Us Page (`/contact`)
- Contact form: Name, Email, Phone, Subject, Message
- On submit: email sent to House of Avira team via Brevo + auto-reply to customer
- WhatsApp contact button (pre-filled wa.me link)

---

### 6.16 Wholesale / B2B Page (`/wholesale`)
- Landing page for bulk buyers
- Form: Name, Business Type, Products Needed, Quantity, Budget, Contact Details
- On submit: email sent to Avira team + auto-reply to enquirer
- WhatsApp alternative contact

---

## 7. CUSTOMER AUTHENTICATION AND ACCOUNT

### 7.1 Registration (`/auth/register`)
- Fields: Full Name, Email, Phone Number, Password
- Email verification flow (Firebase Auth)
- On register: create user document in Firestore `/users/{uid}`

### 7.2 Login (`/auth/login`)
- Email + Password login
- "Forgot Password" reset flow
- Session persists across browser sessions (Firebase Auth persistence)

### 7.3 Account Dashboard (`/account`)
- Welcome message with name
- Quick stats: total orders, active orders
- Links to: My Orders, Wishlist, Profile, Addresses

### 7.4 Order History (`/account/orders`)
- List all orders with: order number, date, product(s), status, total paid
- Click to view full order detail

### 7.5 Order Detail (`/account/orders/[id]`)
- Full order information
- Full 13-stage status timeline
- Payment history (product payment + shipping payments)
- Tracking information (when available)

### 7.6 Wishlist (`/account/wishlist`)
- All wishlisted products
- "Add to Cart" from wishlist
- "Remove from Wishlist" button

### 7.7 Profile Management (`/account/profile`)
- Edit: Full Name, Phone Number, Email, Instagram Handle, Password
- Profile picture upload

### 7.8 Address Management (`/account/addresses`)
- Add multiple delivery addresses
- Edit / delete addresses
- Set default address

---

## 8. FIRESTORE DATABASE SCHEMA

### 8.1 Collections

```
/users/{uid}
  - uid: string
  - name: string
  - email: string
  - phone: string
  - instagramHandle: string
  - role: "customer" | "admin_owner" | "admin_team"
  - createdAt: timestamp
  - profilePicUrl: string (optional)

/addresses/{addressId}
  - userId: string
  - label: string (e.g. "Home", "Work")
  - addressLine1: string
  - addressLine2: string (optional)
  - city: string
  - state: string
  - pincode: string
  - country: string
  - isDefault: boolean
  - createdAt: timestamp

/products/{productId}
  - productId: string
  - name: string
  - slug: string (URL-friendly, unique)
  - description: string
  - price: number
  - category: string (bags | apparel | accessories | beauty | branded | budget)
  - images: string[] (Cloudinary URLs)
  - estimatedWaitWeeks: string (e.g. "6–10 weeks")
  - isActive: boolean
  - isFootwear: boolean
  - isBranded: boolean
  - isOversized: boolean
  - variants: { size: string[], color: string[] }
  - stockStatus: "available" | "out_of_stock" | "limited"
  - weight: number (in grams, for shipping calculation)
  - createdAt: timestamp
  - updatedAt: timestamp
  - seoTitle: string
  - seoDescription: string

/categories/{categoryId}
  - name: string
  - slug: string
  - description: string
  - imageUrl: string
  - isActive: boolean
  - sortOrder: number

/orders/{orderId}
  - orderId: string
  - orderNumber: string (unique, human-readable e.g. "AVR-20260608-001")
  - userId: string (null if guest — but guest checkout should prompt to create account)
  - customerName: string
  - customerEmail: string
  - customerPhone: string
  - customerInstagram: string
  - deliveryAddress: { addressLine1, addressLine2, city, state, pincode, country }
  - items: [{ productId, productName, price, quantity, variantSelected }]
  - productTotal: number
  - discountCode: string (optional)
  - discountAmount: number
  - finalProductAmount: number
  - razorpayOrderId: string
  - razorpayPaymentId: string
  - productPaymentStatus: "pending" | "paid" | "failed"
  - productPaymentTimestamp: timestamp
  - status: OrderStatus (see enum below)
  - batchId: string (assigned after order is placed)
  - internationalShippingAmount: number (set by admin)
  - internationalShippingPaymentLinkId: string
  - internationalShippingPaymentStatus: "pending" | "sent" | "paid"
  - internationalShippingPaymentTimestamp: timestamp
  - domesticShippingAmount: number (set by admin)
  - domesticShippingPaymentLinkId: string
  - domesticShippingPaymentStatus: "pending" | "sent" | "paid"
  - domesticShippingPaymentTimestamp: timestamp
  - trackingId: string (optional)
  - trackingCourier: string (optional)
  - trackingUrl: string (optional)
  - adminNotes: string
  - acknowledgmentTimestamp: timestamp
  - acknowledgmentIp: string
  - createdAt: timestamp
  - updatedAt: timestamp

ORDER STATUS ENUM:
  ORDER_PLACED
  PRODUCT_PAYMENT_RECEIVED
  BATCH_BEING_COLLECTED
  SUPPLIER_ORDER_PLACED
  AT_INTERNATIONAL_WAREHOUSE
  INTL_SHIPPING_AMOUNT_SENT
  INTL_SHIPPING_PAID
  DISPATCHED_TO_INDIA
  ARRIVED_IN_INDIA
  DOMESTIC_SHIPPING_AMOUNT_SENT
  DOMESTIC_SHIPPING_PAID
  DISPATCHED_DOMESTICALLY
  DELIVERED

/batches/{batchId}
  - batchId: string
  - batchName: string
  - status: "open" | "collecting" | "processing" | "dispatched" | "arrived" | "closed"
  - orderIds: string[]
  - totalInternationalCost: number (entered by admin)
  - totalBatchWeight: number (sum of all product weights)
  - internationalCostPerKg: number (calculated)
  - shippingMode: "air" | "sea"
  - createdAt: timestamp
  - updatedAt: timestamp

/wishlists/{wishlistId}
  - userId: string
  - productId: string
  - addedAt: timestamp

/cart/{cartId}
  - userId: string
  - items: [{ productId, productName, price, quantity, variantSelected, imageUrl }]
  - updatedAt: timestamp

/reviews/{reviewId}
  - productId: string
  - userId: string
  - userName: string
  - rating: number (1–5)
  - comment: string
  - status: "pending" | "approved" | "rejected"
  - createdAt: timestamp

/coupons/{couponId}
  - code: string (unique)
  - discountType: "percentage" | "fixed"
  - discountValue: number
  - minOrderValue: number
  - maxUses: number
  - usedCount: number
  - isActive: boolean
  - expiryDate: timestamp

/banners/{bannerId}
  - text: string
  - imageUrl: string (optional)
  - linkUrl: string (optional)
  - isActive: boolean
  - position: "top" | "hero" | "middle"
  - sortOrder: number

/newsletter_subscribers/{id}
  - email: string
  - subscribedAt: timestamp
  - isActive: boolean

/support_inquiries/{id}
  - name: string
  - email: string
  - phone: string
  - subject: string
  - message: string
  - status: "open" | "resolved"
  - createdAt: timestamp

/wholesale_inquiries/{id}
  - name: string
  - businessType: string
  - productsNeeded: string
  - quantity: string
  - budget: string
  - contactDetails: string
  - status: "new" | "contacted" | "closed"
  - createdAt: timestamp

/audit_logs/{id}
  - userId: string
  - action: string
  - targetCollection: string
  - targetId: string
  - oldValue: any
  - newValue: any
  - timestamp: timestamp
  - ipAddress: string

/site_settings/main
  - siteDisruptionBannerText: string
  - siteDisruptionBannerActive: boolean
  - whatsappNumber: string
  - instagramHandle: string
  - emailAddress: string
  - maintenanceMode: boolean
```

---

## 9. RAZORPAY PAYMENT FLOWS

### 9.1 Flow 1 — Product Payment (at checkout)
1. Customer fills checkout form and clicks "Pay Now"
2. Frontend calls `/api/razorpay/create-order` with cart total
3. Razorpay order created server-side, order ID returned to frontend
4. Razorpay checkout modal opens in browser
5. Customer completes payment
6. Razorpay sends webhook event: `payment.captured`
7. Webhook handler (`/api/razorpay/webhook`) verifies signature
8. On verified success:
   - Create order document in Firestore with all details
   - Set `productPaymentStatus: "paid"`
   - Set `status: "PRODUCT_PAYMENT_RECEIVED"`
   - Clear customer's cart
   - Send order confirmation email via Brevo
   - Return order number to frontend
9. Frontend redirects to `/checkout/success`

### 9.2 Flow 2 — International Shipping Payment
1. Admin enters total international shipping cost for a batch in `/admin/batches/[id]`
2. System auto-calculates per-customer share (see Section 10)
3. Admin reviews breakdown and approves
4. System calls `/api/razorpay/create-payment-link` per customer with their calculated amount
5. Unique Razorpay Payment Link generated per customer (with expiry date)
6. Payment link stored in Firestore order document
7. Email automatically sent to customer with payment link and amount
8. Order status updated to `INTL_SHIPPING_AMOUNT_SENT`
9. Customer clicks link and pays
10. Webhook: `payment_link.paid` → update order to `INTL_SHIPPING_PAID` → send confirmation email

### 9.3 Flow 3 — Domestic Shipping Payment
1. When batch arrives in India, admin triggers domestic shipping calculation for each order
2. System calls Shiprocket API: origin pincode (House of Avira) + customer pincode + package weight
3. Admin reviews calculated amounts and approves
4. Razorpay Payment Links generated per customer
5. Email sent to customer with domestic shipping amount and payment link
6. Order status updated to `DOMESTIC_SHIPPING_AMOUNT_SENT`
7. Customer pays
8. Webhook: `payment_link.paid` → update order to `DOMESTIC_SHIPPING_PAID` → send confirmation email

---

## 10. SHIPPING CALCULATION LOGIC

### 10.1 International Shipping Split (Per Customer)
```
customerWeightShare = customerProductWeight / totalBatchWeight
customerInternationalCost = customerWeightShare × totalInternationalCost

HSN_DUTY_RATES = {
  bags: 0.10,
  apparel: 0.20,
  beauty: 0.18,
  accessories: 0.15,
  footwear: 0.25,
  branded: 0.20,
  budget: 0.10
}

customsDuty = customerInternationalCost × HSN_DUTY_RATES[productCategory]
gst = (customerInternationalCost + customsDuty) × 0.18
totalForCustomer = customerInternationalCost + customsDuty + gst
```

### 10.2 Domestic Shipping
- Call Shiprocket API with: origin pincode, customer pincode, weight, dimensions
- If Shiprocket API unavailable: use flat rate fallback table:
  - Metro cities: ₹80–120
  - Non-metro: ₹100–150
  - Remote/northeast: ₹150–200
- Admin can override calculated amount before sending to customer

### 10.3 Admin Review Before Sending
- Admin must see a full per-customer breakdown table before any payment link is sent
- Table shows: customer name, order number, product, weight, calculated cost, customs, GST, final amount
- Admin clicks "Approve & Send All Payment Links" — this triggers the Razorpay Payment Link creation and email sending in one action

---

## 11. ADMIN PANEL — FULL FEATURE SPECIFICATIONS

### 11.1 Admin Login (`/admin/login`)
- Firebase Auth: Email + Password
- Role-based access: `admin_owner` sees everything, `admin_team` sees orders only
- Session persists 7 days

### 11.2 Admin Dashboard (`/admin`)
**Metrics displayed:**
- Total orders (all time)
- Orders this month
- Active orders (not yet delivered)
- Pending international shipping payments count
- Pending domestic shipping payments count
- Recent orders feed (last 10)
- Revenue summary (product payments received this month)
- Open batches count

**Quick actions:**
- Disruption banner toggle + text edit
- Link to order board
- Link to batch manager

### 11.3 Product Management (`/admin/products`)
- List all products with: image, name, category, price, status (active/inactive), created date
- Search and filter by category/status
- "Add New Product" button

**Add/Edit Product Form:**
- Name
- Slug (auto-generated from name, editable)
- Description (rich text)
- Price
- Category (select: bags / apparel / accessories / beauty / branded / budget)
- Product images (multi-upload via Cloudinary — minimum 1, maximum 10)
- Estimated wait time (text, e.g. "6–10 weeks")
- Product weight in grams (used for shipping calculation)
- Variants: size options (comma-separated), color options (comma-separated)
- Stock status: Available / Out of Stock / Limited
- Flags: Is Footwear (checkbox), Is Branded (checkbox), Is Oversized (checkbox)
- Active/Inactive toggle
- SEO Title
- SEO Description

### 11.4 Product Category Management (`/admin/categories`)
- Create / edit / delete categories
- Set category name, slug, description, image, sort order, active status

### 11.5 Order Management Board (`/admin/orders`)
**Kanban Board with columns for all 13 order statuses**

Each order card displays:
- Order number
- Customer name
- Instagram handle
- Product name
- Order date
- Payment status

Dragging a card to a new column updates the order status in Firestore and triggers the appropriate automated email.

Filters: by status / by batch / by date range / by customer search

### 11.6 Order Detail Page (`/admin/orders/[id]`)
**Displays:**
- Full customer information
- Full delivery address
- All ordered products with prices
- Acknowledgment log (timestamp + IP)
- Full payment history:
  - Product payment: amount, Razorpay ID, timestamp
  - International shipping payment: amount, payment link, status, timestamp
  - Domestic shipping payment: amount, payment link, status, timestamp
- 13-stage order timeline with timestamps
- Tracking information section (enter courier name, tracking ID, tracking URL)
- Admin notes field (internal, not visible to customer)
- WhatsApp one-click send button (opens pre-filled wa.me message for this customer)
- Status update dropdown (with confirmation before updating)

### 11.7 Batch Manager (`/admin/batches`)
- List all batches with: name, status, number of orders, creation date
- Create new batch
- Assign orders to batches

**Batch Detail Page (`/admin/batches/[id]`):**
- All orders in this batch listed in a table
- Total batch weight (auto-calculated from product weights)
- **International Shipping Cost Entry:**
  - Admin enters: Total international shipping cost (₹ amount)
  - System displays full per-customer breakdown table (see Section 10)
  - "Approve and Send All Payment Links" button
- Track batch stage: Collecting → Ordered → At Warehouse → Dispatched → Arrived India

### 11.8 Customer Management (`/admin/customers`)
- Searchable directory: search by name, email, phone, Instagram handle
- Customer card: name, email, total orders, total amount paid
- Click to view full customer profile + complete order history
- WhatsApp one-click button per customer

### 11.9 Shipping Management (`/admin/shipping`)
- Configure shipping zones and flat rate fallback rates
- View all pending shipping payments (international and domestic)
- Override individual shipping amounts before sending

### 11.10 Coupon & Discount Management (`/admin/coupons`)
- Create coupons: code, discount type (% or fixed ₹), value, min order value, max uses, expiry date, active toggle
- List all coupons with usage statistics
- Deactivate / delete coupons

### 11.11 Banner Management (`/admin/banners`)
- Create/edit/delete banners (image + text + link)
- Toggle active/inactive
- Set display position: top strip / hero / middle of homepage

### 11.12 Homepage Content Management (`/admin/homepage`)
- Edit hero section text and image
- Edit trust strip numbers
- Toggle which sections are visible
- Manage featured categories order
- Manage new arrivals (auto-pulls last 8 active products, but can override)

### 11.13 Review & Rating Moderation (`/admin/reviews`)
- List all pending reviews with: customer name, product, rating, comment, date
- Approve / Reject each review
- Approved reviews appear on product pages

### 11.14 Returns & Refund Management (`/admin/returns`)
- Log return/refund requests submitted via contact form
- Track status: Received / Under Review / Resolved
- Internal notes field
- Note: Per business policy, no refunds/returns are permitted, so this is primarily for exception handling and record-keeping

### 11.15 Notification Management (`/admin/notifications`)
- View all automated emails sent: timestamp, recipient, type, subject, delivery status
- View all WhatsApp pre-fill messages initiated: timestamp, recipient, content
- Re-send email option for failed deliveries

### 11.16 SEO Settings (`/admin/seo`)
- Global SEO title template
- Global SEO description
- Per-page meta overrides for static pages (homepage, catalogue, how-it-works, etc.)
- Robots.txt configuration
- Sitemap generation trigger

### 11.17 Analytics Dashboard (`/admin/reports`)
- Total revenue (product payments only)
- Orders over time chart (daily/weekly/monthly)
- Top-selling products
- Orders by category
- Average order value
- Customer acquisition chart (new registrations over time)
- Pending payments summary (international + domestic outstanding)

### 11.18 Tax Management (`/admin/tax`)
- Configure GST rates applicable to different product categories
- View tax collected summary

### 11.19 Bulk Product Import/Export (`/admin/products`)
- Export all products to CSV
- Import products from CSV (template downloadable)
- Bulk activate / deactivate products

### 11.20 User Roles & Permissions (`/admin/users`)
- List all admin users
- Invite new admin: send invite email
- Set role: `admin_owner` or `admin_team`
- Deactivate admin accounts

### 11.21 Newsletter Subscriber Management (`/admin/newsletter`)
- List all subscribers with email and subscription date
- Export to CSV
- Mark inactive / delete

### 11.22 Customer Support / Inquiry Management (`/admin/support`)
- List all contact form submissions
- List all wholesale inquiries
- Status tracking: Open / Contacted / Resolved
- Internal notes

### 11.23 Audit Logs & Activity Tracking (`/admin/logs`)
- All admin actions logged: who did what, when, on which record
- Filter by user, action type, date range

### 11.24 Backup & Restore Management (`/admin/backup`)
- Trigger manual Firestore export
- List of recent backups
- Restore guidance documentation link

### 11.25 Website Settings (`/admin/settings`)
- Edit: WhatsApp number, Instagram handle, email address, business address
- Disruption banner: text input + on/off toggle
- Maintenance mode toggle
- Contact form email recipient address

---

## 12. AUTOMATED EMAIL SYSTEM (BREVO)

All emails sent from: `hello@houseofavira.com`
All emails use branded HTML templates with House of Avira logo and styling.

| Trigger | Email Subject | Content |
|---|---|---|
| Order placed (product paid) | "Your Preorder is Confirmed — Order #[OrderNo]" | Order summary, next steps, what happens now, tracking link |
| Status → BATCH_BEING_COLLECTED | "Your Order is Being Processed" | Batch update, estimated international dispatch window |
| Status → SUPPLIER_ORDER_PLACED | "We've Placed Your Order with Our Supplier" | Update message |
| Status → AT_INTERNATIONAL_WAREHOUSE | "Your Product is at Our International Warehouse" | Update, next step: shipping cost calculation |
| International shipping amount sent | "Action Required — International Shipping Payment" | Amount due, Razorpay payment link, due date |
| International shipping paid | "International Shipping Confirmed" | Thanks, order dispatching soon |
| Status → DISPATCHED_TO_INDIA | "Your Order Has Been Dispatched Internationally" | Dispatch confirmation |
| Status → ARRIVED_IN_INDIA | "Your Order Has Arrived in India!" | Arrival confirmation, domestic shipping coming |
| Domestic shipping amount sent | "Action Required — Domestic Shipping Payment" | Amount due, Razorpay payment link, due date |
| Domestic shipping paid | "Domestic Shipping Confirmed" | Thanks, dispatching soon |
| Status → DISPATCHED_DOMESTICALLY | "Your Order is On Its Way to You!" | Courier name, tracking ID, tracking link |
| Status → DELIVERED | "We Hope You Love Your Order!" | Thank you, invite to leave review, unboxing video reminder |

---

## 13. WHATSAPP INTEGRATION (Pre-filled wa.me Links)

WhatsApp Business API is NOT included in this phase. Instead, the admin panel provides one-click pre-filled WhatsApp message links via wa.me.

**Pre-filled templates (stored in site settings, rendered per order):**

```
INTERNATIONAL_SHIPPING_DUE:
"Hi [CustomerName]! 👋

Your international shipping for Order #[OrderNo] ([ProductName]) is ready.

Amount Due: ₹[Amount]
Please pay by [DueDate]: [PaymentLink]

Thank you for your patience 🙏
— House of Avira"

BATCH_DISPATCHED:
"Hi [CustomerName]! 🎉

Great news — your batch has been dispatched from our international warehouse.
Order #[OrderNo] is on its way to India!

We'll keep you updated.
— House of Avira"

DOMESTIC_SHIPPING_DUE:
"Hi [CustomerName]! 📦

Your order has arrived in India!

Domestic shipping for Order #[OrderNo]: ₹[Amount]
Payment link: [PaymentLink]

— House of Avira"

TRACKING_SHARED:
"Hi [CustomerName]! 🚀

Your order #[OrderNo] has been dispatched!
Courier: [CourierName]
Tracking ID: [TrackingID]
Track here: [TrackingURL]

Please record your unboxing video for us! 🎥
— House of Avira"
```

Admin sees a WhatsApp button on every order card and order detail page. One click opens WhatsApp with the relevant pre-filled message.

---

## 14. SECURITY REQUIREMENTS

- All `/admin/*` routes protected by Firebase Auth middleware — redirect to login if not authenticated
- Role check on every admin API call — `admin_team` cannot access product/settings/reports endpoints
- Razorpay webhook signature verified on every incoming webhook event
- All API keys stored in environment variables — never exposed to client-side code
- Razorpay API calls made server-side only (`/api/*` routes)
- Brevo API calls made server-side only
- Firestore Security Rules:
  - Customers can only read/write their own user document, orders, addresses, cart, wishlist
  - Admins can read/write all collections
  - Products and categories are publicly readable
  - Banners and site settings are publicly readable
- Order acknowledgment logged with timestamp, user ID, and IP address
- Payment links expire after configured due date (set in Razorpay)
- Input validation and sanitization on all form fields
- Rate limiting on public API routes

---

## 15. ENVIRONMENT VARIABLES

```env
# Firebase
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
FIREBASE_ADMIN_PRIVATE_KEY=
FIREBASE_ADMIN_CLIENT_EMAIL=
FIREBASE_ADMIN_PROJECT_ID=

# Razorpay
RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=
NEXT_PUBLIC_RAZORPAY_KEY_ID=
RAZORPAY_WEBHOOK_SECRET=

# Cloudinary
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

# Brevo (Email)
BREVO_API_KEY=
EMAIL_FROM=hello@houseofavira.com
ADMIN_EMAIL=admin@houseofavira.com

# Shiprocket
SHIPROCKET_EMAIL=
SHIPROCKET_PASSWORD=

# AI Chatbot (to be added in final phase — either one)
GEMINI_API_KEY=
# OR
CHATBASE_BOT_ID=

# App Config
NEXT_PUBLIC_APP_URL=https://houseofavira.com
NEXT_PUBLIC_WHATSAPP_NUMBER=91XXXXXXXXXX
```

---

## 16. AI CHATBOT — FINAL PHASE

> **The AI chatbot is the last feature to be integrated after the entire website is complete and functional.**

**Two options — implement whichever is confirmed at time of integration:**

### Option A: Gemini API (Google)
- Use Google Gemini API (`gemini-1.5-flash` model)
- API route: `/api/chatbot` (server-side to protect API key)
- System prompt: full House of Avira policy knowledge base (all policies, FAQs, preorder process, shipping explanation)
- Brand voice in system prompt: warm, helpful, personal, never robotic
- Floating widget on every page (bottom-right corner)
- Dedicated chatbot page: `/ask-avira`
- Quick-tap buttons: "What is COD?", "Why isn't shipping included?", "When will my order arrive?", "Can I cancel?", "How does preorder work?"
- Handoff message: if question requires human, bot responds: "For this, please DM us on Instagram → [link]"

### Option B: Chatbase Embed
- Create a Chatbase bot trained on the policy knowledge base
- Embed the Chatbase widget script in the Next.js layout
- Floating widget on every page
- Dedicated page `/ask-avira` with full-size embed

**Regardless of option chosen:**
- Chatbot is always called "Ask Avira"
- It must know the complete business policy
- It must never promise specific shipping amounts or specific delivery dates
- It must always refer customers to Instagram DM for complex or sensitive issues
- It must be the LAST thing integrated — all other features must be live and tested first

---

## 17. OUT OF SCOPE (This Phase)

The following are NOT included:
- WhatsApp Business API (automated WhatsApp — may be Phase 2)
- Reseller / affiliate portal
- Instagram Shopping tag integration
- Multi-language support
- Mobile app
- Supplier portal
- Inventory management automation

---

## 18. KEY BUSINESS RULES SUMMARY (FOR AI REFERENCE)

1. Customers pay ONLY the product price at checkout. Shipping is never included in the product price.
2. International shipping is always compulsory. No order can be delivered without the customer paying international shipping.
3. Domestic shipping is always compulsory. No order can be dispatched domestically without the customer paying domestic shipping.
4. No cancellations, refunds, or exchanges are permitted under any circumstances after an order is placed.
5. Every customer must complete the 6-checkbox acknowledgment before payment is processed.
6. Delivery timelines are estimates. The website must never state a guaranteed delivery date.
7. The admin never manually creates orders. All orders are created automatically upon successful Razorpay payment.
8. The admin must approve shipping cost calculations before any payment link is sent to a customer.
9. All product management (uploads, pricing, descriptions, categorization) is the client's responsibility. The admin panel must make this fully self-serve.
10. The developer/system must never require access to product pricing data, supplier information, or profit margin data.

---

## 19. DEVELOPMENT SEQUENCE (RECOMMENDED BUILD ORDER FOR AI)

Build in this order to ensure dependencies are resolved:

1. Next.js project setup, Tailwind, Firebase initialization, environment variables
2. Firebase Auth — customer registration, login, session management
3. Firestore schema — create all collections with security rules
4. Product management (admin) — add/edit/delete products with Cloudinary image upload
5. Product catalogue and product detail pages (public)
6. Cart functionality (add to cart, update, remove, persist in Firestore)
7. Acknowledgment page with 6 mandatory checkboxes
8. Checkout page with order form + Razorpay payment integration
9. Webhook handler for Razorpay payment events
10. Order confirmation page + order creation in Firestore
11. Automated email system (Brevo) — all 12 email triggers
12. Customer account dashboard (orders, wishlist, profile, addresses)
13. Order tracking page (public)
14. Admin order board (Kanban) with status updates
15. Admin order detail page + WhatsApp pre-fill buttons
16. Batch manager + shipping cost calculator
17. Razorpay Payment Links for international and domestic shipping
18. Admin dashboard with metrics
19. All remaining admin panel features (customers, coupons, banners, reviews, reports, etc.)
20. All remaining public pages (How It Works, Policies, FAQ, Contact, Wholesale, Returns, T&C, Privacy)
21. SEO setup (meta tags, sitemap, robots.txt)
22. Security audit (route protection, Firestore rules, webhook verification)
23. **FINAL: AI Chatbot integration (Gemini API or Chatbase)**

---

*End of PRD v2.0*
