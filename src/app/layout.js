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
  title: "HOUSE OF AVIRA-PINTEREST COLLECTION",
  description: "Internationally Sourced & Delivered to Your Doorstep.",
  icons: {
    icon: "/LOGO.png",
    shortcut: "/LOGO.png",
    apple: "/LOGO.png",
  },
};

import RegionSelector from "@/components/RegionSelector";
import ProductOptionsModal from "@/components/ProductOptionsModal";

export default function RootLayout({ children }) {
  return (
      <html
        lang="en"
        className={`${geistSans.variable} ${geistMono.variable} ${playfair.variable} ${cormorant.variable} ${dmSans.variable} h-full antialiased`}
      >
      <body className="min-h-full flex flex-col bg-[#FFFFFF] text-[#000000] selection:bg-[#8A001A] selection:text-[#FFFFFF]">
        <AuthProvider>
          <Header />
          <main className="flex-1 flex flex-col">{children}</main>
          <Footer />
          <RegionSelector />
          <ProductOptionsModal />
        </AuthProvider>
      </body>
    </html>
  );
}
