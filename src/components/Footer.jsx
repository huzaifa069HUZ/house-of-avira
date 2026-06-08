import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-[#1A1A1A] text-[#F8F5F1] pt-24 pb-12 px-6 md:px-12 w-full mt-auto">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-24 max-w-7xl mx-auto">
        <div className="md:col-span-1">
          <h4 className="font-serif text-2xl tracking-widest uppercase mb-6">Avira</h4>
          <p className="text-xs text-gray-400 max-w-xs leading-relaxed">
            A luxury curation for the modern muse. Expensive minimalism and refined aesthetics.
          </p>
        </div>
        <div>
          <h5 className="text-xs uppercase tracking-widest mb-6 opacity-60">Shop</h5>
          <ul className="space-y-4 text-sm font-light">
            <li><Link href="/catalogue" className="hover:opacity-70 transition-opacity">New In</Link></li>
            <li><Link href="/catalogue" className="hover:opacity-70 transition-opacity">Bestsellers</Link></li>
            <li><Link href="/category/women" className="hover:opacity-70 transition-opacity">Clothing</Link></li>
            <li><Link href="/category/accessories" className="hover:opacity-70 transition-opacity">Accessories</Link></li>
          </ul>
        </div>
        <div>
          <h5 className="text-xs uppercase tracking-widest mb-6 opacity-60">Assistance</h5>
          <ul className="space-y-4 text-sm font-light">
            <li><Link href="/shipping-returns" className="hover:opacity-70 transition-opacity">Shipping & Returns</Link></li>
            <li><Link href="/care-guide" className="hover:opacity-70 transition-opacity">Care Guide</Link></li>
            <li><Link href="/contact" className="hover:opacity-70 transition-opacity">Contact Us</Link></li>
            <li><Link href="/faq" className="hover:opacity-70 transition-opacity">FAQ</Link></li>
          </ul>
        </div>
        <div>
          <h5 className="text-xs uppercase tracking-widest mb-6 opacity-60">Social</h5>
          <ul className="space-y-4 text-sm font-light">
            <li><a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:opacity-70 transition-opacity flex items-center gap-2">Instagram</a></li>
            <li><a href="https://pinterest.com" target="_blank" rel="noopener noreferrer" className="hover:opacity-70 transition-opacity flex items-center gap-2">Pinterest</a></li>
            <li><a href="https://tiktok.com" target="_blank" rel="noopener noreferrer" className="hover:opacity-70 transition-opacity flex items-center gap-2">TikTok</a></li>
          </ul>
        </div>
      </div>
      <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-[#F8F5F1]/10 text-xs text-gray-500 font-light max-w-7xl mx-auto">
        <p>© {new Date().getFullYear()} House of Avira. All rights reserved.</p>
        <div className="flex gap-6 mt-4 md:mt-0">
          <Link href="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link>
          <Link href="/terms-of-service" className="hover:text-white transition-colors">Terms of Service</Link>
        </div>
      </div>
    </footer>
  );
}
