'use client';

import Link from 'next/link';
import { useEffect } from 'react';
import { Mail, MessageCircle, Info } from 'lucide-react';

export default function PolicyPage() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) entry.target.classList.add('animate-in');
        });
      },
      { threshold: 0.1 }
    );
    document.querySelectorAll('.fade-up').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-[#FAFAF8] font-dm-sans">
      <style jsx>{`
        .fade-up {
          opacity: 0; transform: translateY(40px);
          transition: opacity 0.8s cubic-bezier(0.16,1,0.3,1), transform 0.8s cubic-bezier(0.16,1,0.3,1);
        }
        .fade-up.animate-in { opacity: 1; transform: translateY(0); }
        @keyframes pulse-dot { 0%,100%{opacity:1;} 50%{opacity:0.3;} }
        .pulse-dot { animation: pulse-dot 2s ease-in-out infinite; }
      `}</style>

      {/* ═══════ HERO ═══════ */}
      <section className="relative min-h-[40vh] flex items-end overflow-hidden pt-24 pb-16">
        <div className="absolute inset-0 bg-[#0A0A0A]">
          <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 80px, rgba(255,255,255,0.08) 80px, rgba(255,255,255,0.08) 81px), repeating-linear-gradient(90deg, transparent, transparent 80px, rgba(255,255,255,0.08) 80px, rgba(255,255,255,0.08) 81px)' }} />
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full" style={{ background: 'radial-gradient(circle, rgba(138,0,26,0.1) 0%, transparent 70%)' }} />
        </div>
        <div className="relative z-10 max-w-4xl mx-auto px-6 md:px-12 w-full text-center">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-2 h-2 rounded-full bg-[#8A001A] pulse-dot" />
            <span className="text-[11px] font-bold tracking-[0.4em] uppercase text-[#8A001A]">House of Avira</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-perandory text-white tracking-tight leading-[0.95] flex flex-col items-center">
            <span className="font-perandory">LEGAL &</span>
            <span className="font-aston-script text-[#8A001A] mt-2 lowercase text-6xl md:text-8xl">Policies</span>
          </h1>
        </div>
      </section>

      {/* ═══════ COPYRIGHT & IMAGE USAGE ═══════ */}
      <section className="py-24 md:py-32 bg-[#FAFAF8]">
        <div className="max-w-3xl mx-auto px-6 md:px-12">
          
          <div className="fade-up mb-16 text-center">
            <Info className="w-8 h-8 text-[#8A001A] mx-auto mb-6 opacity-80" />
            <h2 className="text-3xl md:text-4xl font-perandory text-[#1a1a1a] tracking-tight mb-6">Copyright & Image Usage Notice</h2>
            <p className="text-[#1a1a1a]/60 text-base md:text-lg leading-[1.9] font-light">
              We love sharing beautiful aesthetics, fashion inspiration, and curated finds with our community. To maintain transparency, we want to be clear about where our visual content comes from.
            </p>
          </div>

          <div className="space-y-8">
            {/* Sourcing */}
            <div className="fade-up bg-white border border-neutral-200 rounded-2xl p-8 md:p-10 shadow-sm relative overflow-hidden group hover:border-[#8A001A]/30 transition-colors">
              <div className="absolute top-0 right-0 w-24 h-24 bg-neutral-50 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none group-hover:bg-[#8A001A]/5 transition-colors"></div>
              <h3 className="text-sm font-bold tracking-[0.2em] uppercase text-[#8A001A] mb-4">Content Sourcing</h3>
              <p className="text-[#1a1a1a]/70 text-base leading-[1.8] font-light">
                The images, product photos, references, and other visual content displayed on our website may be sourced from our suppliers, manufacturers, customers, publicly available references, or third-party sources. They are not necessarily our own original product shoots unless explicitly stated.
              </p>
            </div>

            {/* Original Content */}
            <div className="fade-up bg-white border border-neutral-200 rounded-2xl p-8 md:p-10 shadow-sm relative overflow-hidden group hover:border-[#8A001A]/30 transition-colors">
              <div className="absolute top-0 right-0 w-24 h-24 bg-neutral-50 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none group-hover:bg-[#8A001A]/5 transition-colors"></div>
              <h3 className="text-sm font-bold tracking-[0.2em] uppercase text-[#8A001A] mb-4">Our Original Content</h3>
              <p className="text-[#1a1a1a]/70 text-base leading-[1.8] font-light">
                When an image has been created, styled, or photographed originally by the House of Avira team, it will be clearly identified, credited, or watermarked accordingly to show it as our own authentic work.
              </p>
            </div>

            {/* Removal/Credit Requests */}
            <div className="fade-up bg-[#0A0A0A] border border-[#1a1a1a] rounded-2xl p-8 md:p-10 shadow-lg relative overflow-hidden text-white mt-12">
              <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,0.1) 10px, rgba(255,255,255,0.1) 11px)' }} />
              
              <h3 className="text-lg md:text-xl font-perandory text-white mb-4 relative z-10">Content Removal & Credit Requests</h3>
              <p className="text-white/70 text-base leading-[1.8] font-light mb-8 relative z-10">
                We deeply respect the creative work of photographers, brands, and creators. If any individual, copyright owner, or creator finds their image or content on our website and would like it to be appropriately credited, modified, or removed entirely, please reach out to us directly. 
                <br/><br/>
                Upon receiving a valid request, we will review it promptly and take the appropriate action without any hassle.
              </p>

              <div className="relative z-10 flex flex-col sm:flex-row gap-4 pt-6 border-t border-white/10">
                <a href="mailto:houseofavira@gmail.com" className="flex items-center gap-3 bg-white/5 hover:bg-white/10 border border-white/10 px-5 py-3 rounded-xl transition-colors">
                  <Mail className="w-5 h-5 text-white/60" />
                  <div className="flex flex-col">
                    <span className="text-[10px] text-white/50 uppercase tracking-widest font-bold">Email Us</span>
                    <span className="text-sm text-white">houseofavira@gmail.com</span>
                  </div>
                </a>
                
                <a href="https://wa.me/919986742779" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 bg-[#8A001A]/20 hover:bg-[#8A001A]/30 border border-[#8A001A]/30 px-5 py-3 rounded-xl transition-colors">
                  <MessageCircle className="w-5 h-5 text-[#8A001A]" />
                  <div className="flex flex-col">
                    <span className="text-[10px] text-[#8A001A]/70 uppercase tracking-widest font-bold">WhatsApp</span>
                    <span className="text-sm text-white">+91 9986742779</span>
                  </div>
                </a>
              </div>
            </div>
          </div>
          
        </div>
      </section>
      
      {/* ═══════ STORE POLICIES LINK ═══════ */}
      <section className="bg-white py-20 border-t border-neutral-200">
        <div className="max-w-4xl mx-auto px-6 md:px-12 text-center">
          <p className="text-[#1a1a1a]/60 text-base font-light mb-6">
            Looking for information about Shipping, Returns, and Ordering?
          </p>
          <Link href="/order-info/policies" className="inline-flex items-center justify-center gap-2 bg-[#0A0A0A] text-white px-8 py-4 rounded-xl text-xs font-bold tracking-widest uppercase hover:bg-[#8A001A] transition-colors shadow-lg">
            View Store Policies
          </Link>
        </div>
      </section>

    </div>
  );
}
