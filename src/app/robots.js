export default function robots() {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/', '/api/', '/account/', '/checkout/', '/order-success/', '/shipping-success/'],
    },
    sitemap: 'https://houseofavira.shop/sitemap.xml',
  }
}
