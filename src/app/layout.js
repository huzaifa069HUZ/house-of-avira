import { Geist, Geist_Mono, Playfair_Display, Cormorant_Garamond, DM_Sans } from "next/font/google";
import AuthProvider from "@/components/AuthProvider";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

const cormorant = Cormorant_Garamond({
  weight: ["400", "700"],
  variable: "--font-cormorant",
  subsets: ["latin"],
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
});

export const metadata = {
  metadataBase: new URL("https://houseofavira.shop"),
  title: "HOUSE OF AVIRA | Avira Shopping | Premium Import Based Shopping",
  description: "Internationally Sourced & Delivered to Your Doorstep. Discover premium shopping, imported pinterest finds, trendy clothes, and luxury aesthetics at House of Avira Shopping.",
  keywords: [
    "House of Avira", 
    "Avira Shopping", 
    "HOUSEOFAVIRA", 
    "premium shopping", 
    "import based shopping", 
    "trendy clothes", 
    "luxury aesthetics", 
    "international clothing india", 
    "buy streetwear online",
    "genz fashion store",
    "korean fashion india",
    "y2k fashion india",
    "imported pinterest finds",
    "aesthetic clothes",
    "vintage clothing online",
    "sneakers and collectibles",
    "trendy bags and accessories",
    "high quality imported clothes",
    "Avira clothing brand",
    "Avira fashion store",
    "Avira"
  ],
  verification: {
    google: "hliUadrK80fd7IaPduYmqG5-aOHzpBLlkWYOIt22yBA",
  },
  alternates: {
    canonical: "https://houseofavira.shop",
  },
  openGraph: {
    title: "HOUSE OF AVIRA | Avira Shopping | Premium Import Based Shopping",
    description: "Internationally Sourced & Delivered to Your Doorstep. Discover premium shopping and luxury aesthetics at House of Avira.",
    url: "https://houseofavira.shop",
    siteName: "House of Avira",
    images: [
      {
        url: "/opengraph-image.png",
        width: 1200,
        height: 630,
        alt: "House of Avira Logo",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "HOUSE OF AVIRA | Avira Shopping | Premium Import Based Shopping",
    description: "Internationally Sourced & Delivered to Your Doorstep. Discover imported pinterest finds at House of Avira.",
    images: ["/opengraph-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

import ProductOptionsModal from "@/components/ProductOptionsModal";

export default function RootLayout({ children }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": "https://houseofavira.shop/#organization",
        "name": "House of Avira",
        "alternateName": ["Avira Shopping", "HOUSEOFAVIRA"],
        "url": "https://houseofavira.shop",
        "logo": {
          "@type": "ImageObject",
          "url": "https://houseofavira.shop/icon.png"
        },
        "description": "Internationally Sourced & Delivered to Your Doorstep. Premium import based shopping for trendy clothes.",
        "contactPoint": {
          "@type": "ContactPoint",
          "contactType": "customer support",
          "email": "support@houseofavira.shop"
        },
        "sameAs": [
          "https://www.instagram.com/houseofavira"
        ]
      },
      {
        "@type": "WebSite",
        "@id": "https://houseofavira.shop/#website",
        "url": "https://houseofavira.shop",
        "name": "House of Avira",
        "publisher": {
          "@id": "https://houseofavira.shop/#organization"
        },
        "potentialAction": {
          "@type": "SearchAction",
          "target": "https://houseofavira.shop/catalogue?q={search_term_string}",
          "query-input": "required name=search_term_string"
        }
      },
      {
        "@type": "Store",
        "name": "House of Avira",
        "image": "https://houseofavira.shop/icon.png",
        "@id": "https://houseofavira.shop",
        "url": "https://houseofavira.shop",
        "priceRange": "$$$",
        "description": "Premium imported fashion, streetwear, and GenZ aesthetic clothing store."
      }
    ]
  };

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${playfair.variable} ${cormorant.variable} ${dmSans.variable} h-full antialiased`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-[#FFFFFF] text-[#000000] selection:bg-[#8A001A] selection:text-[#FFFFFF]">
        <AuthProvider>
          <Header />
          <main className="flex-1 flex flex-col">{children}</main>
          <Footer />
          <ProductOptionsModal />
        </AuthProvider>
      </body>
    </html>
  );
}
