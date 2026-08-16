export default function robots() {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/', '/api/', '/account/', '/checkout/', '/auth/', '/order-success/', '/shipping-success/', '/wishlist/'],
    },
    sitemap: 'https://houseofavira.shop/sitemap.xml',
  }
}
