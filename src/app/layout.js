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
  title: "HOUSE OF AVIRA | Premium Import Based Shopping",
  description: "Internationally Sourced & Delivered to Your Doorstep. Discover premium shopping, trendy clothes, and luxury aesthetics at House of Avira.",
  keywords: ["House of Avira", "import based shopping", "premium shopping", "trendy clothes", "luxury aesthetics", "international clothing india", "Avira shopping"],
  verification: {
    google: "hliUadrK80fd7IaPduYmqG5-aOHzpBLlkWYOIt22yBA",
  },
  openGraph: {
    title: "HOUSE OF AVIRA | Premium Import Based Shopping",
    description: "Internationally Sourced & Delivered to Your Doorstep. Discover premium shopping and luxury aesthetics.",
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
    title: "HOUSE OF AVIRA | Premium Import Based Shopping",
    description: "Internationally Sourced & Delivered to Your Doorstep.",
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
    "@type": "Organization",
    name: "House of Avira",
    url: "https://houseofavira.shop",
    logo: "https://houseofavira.shop/icon.png",
    description: "Internationally Sourced & Delivered to Your Doorstep. Premium import based shopping for trendy clothes.",
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
