'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, Search } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#0A0A0A] flex flex-col items-center justify-center relative overflow-hidden selection:bg-[#8A001A] selection:text-white pt-20">
      
      {/* Background Decorative Elements */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#8A001A] rounded-full blur-[150px] opacity-10 pointer-events-none" />
      <div className="absolute top-1/4 right-1/4 w-[400px] h-[400px] bg-white rounded-full blur-[120px] opacity-[0.03] pointer-events-none" />
      
      {/* Grain Overlay */}
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-overlay"
        style={{ backgroundImage: 'url("https://upload.wikimedia.org/wikipedia/commons/7/76/1k_Dissolve_Noise_Texture.png")' }}
      ></div>

      <div className="relative z-10 flex flex-col items-center text-center px-6 max-w-4xl mx-auto">
        
        {/* Animated 404 Text */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="relative"
        >
          <h1 className="text-[120px] sm:text-[180px] md:text-[250px] font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-white/20 leading-none tracking-tighter drop-shadow-2xl">
            404
          </h1>
          <motion.div 
            initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
            animate={{ opacity: 1, scale: 1, rotate: -2 }}
            transition={{ duration: 1.2, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full"
          >
            <span className="font-aston-script text-[40px] sm:text-[60px] md:text-[80px] text-[#8A001A] drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)] whitespace-nowrap">
              Out of Style
            </span>
          </motion.div>
        </motion.div>

        {/* Description */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="mt-8 flex flex-col items-center"
        >
          <h2 className="font-perandory text-xl md:text-3xl text-white mb-4 tracking-wide uppercase">
            The page you're looking for does not exist.
          </h2>
          <p className="text-white/60 text-sm md:text-base font-dm-sans max-w-lg leading-relaxed">
            It seems you've followed a broken link or entered a URL that doesn't exist on our site. Let's get you back to our exquisite collection.
          </p>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="mt-12 flex flex-col sm:flex-row items-center gap-6"
        >
          <Link 
            href="/"
            className="group relative px-8 py-4 bg-white text-black font-semibold text-sm tracking-[0.2em] uppercase overflow-hidden flex items-center justify-center gap-3 transition-transform hover:scale-[1.02] active:scale-[0.98] w-full sm:w-auto"
          >
            <span className="absolute inset-0 w-full h-full bg-[#8A001A] -translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-[0.16,1,0.3,1]"></span>
            <ArrowLeft className="w-4 h-4 relative z-10 text-black group-hover:text-white transition-colors duration-500" />
            <span className="relative z-10 text-black group-hover:text-white transition-colors duration-500">
              Return Home
            </span>
          </Link>

          <Link 
            href="/catalogue"
            className="group px-8 py-4 bg-transparent border border-white/20 text-white font-semibold text-sm tracking-[0.2em] uppercase hover:bg-white/5 flex items-center justify-center gap-3 transition-all hover:border-white/40 w-full sm:w-auto"
          >
            <Search className="w-4 h-4 text-white/70 group-hover:text-white transition-colors" />
            <span>Shop Collection</span>
          </Link>
        </motion.div>

      </div>
      
      {/* Bottom Floating Decorative Text */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2, delay: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/20 font-perandory text-[10px] md:text-xs tracking-[0.3em] uppercase pointer-events-none whitespace-nowrap"
      >
        HOUSE OF AVIRA • EXCLUSIVE FINDS
      </motion.div>
    </div>
  );
}
