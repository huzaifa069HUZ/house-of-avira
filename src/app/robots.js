export default function robots() {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/', '/api/', '/account/'],
    },
    sitemap: 'https://houseofavira.shop/sitemap.xml',
  }
}
