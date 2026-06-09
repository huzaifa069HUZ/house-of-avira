'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { db } from '@/lib/firebase';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { Loader2, Layers, Heart, X } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { useWishlistStore } from '@/store/wishlistStore';
import './catalogue.css';

const CATEGORIES = [
  'ALL',
  'JACKETS',
  'TOPS',
  'TROUSERS',
  'DRESSES',
  'JEWELLERY',
  'BAGS',
  'FOOTWEAR',
  'ACCESSORIES',
  'COLLECTIBLES',
  'PETS'
];

export default function CatalogueClient() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('ALL');
  const [showLoginModal, setShowLoginModal] = useState(false);

  const { user } = useAuthStore();
  const { wishlist, toggleWishlist } = useWishlistStore();

  useEffect(() => {
    async function fetchProducts() {
      try {
        const q = query(collection(db, 'products'), orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(q);
        const productsList = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setProducts(productsList);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, []);

  const displayProducts = activeCategory === 'ALL' 
    ? products 
    : products.filter(p => {
        const term = activeCategory.toLowerCase();
        return (
          p.category?.toLowerCase().includes(term) ||
          p.subcategory?.toLowerCase().includes(term) ||
          p.badge?.toLowerCase().includes(term) ||
          p.section?.toLowerCase().includes(term) ||
          p.name?.toLowerCase().includes(term) ||
          p.description?.toLowerCase().includes(term)
        );
      });

  const handleHeartClick = (e, product) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      setShowLoginModal(true);
    } else {
      toggleWishlist(product);
    }
  };

  return (
    <div className="avira-catalogue-container relative">
      {/* Header */}
      <header className="avira-catalogue-header">
        <h1 className="avira-catalogue-title">GET THE LOOK</h1>
        <p className="avira-catalogue-subtitle">
          Share your looks on socials by mentioning @houseofavira and #AviraStyle.
        </p>
      </header>

      {/* Categories Scroll */}
      <nav className="avira-cat-scroller-container">
        <div className="avira-cat-scroller">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              className={`avira-cat-btn ${activeCategory === cat ? 'active' : ''}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </nav>

      {/* Masonry Grid */}
      {loading ? (
        <div className="avira-loading">
          <Loader2 className="w-5 h-5 animate-spin" />
          Loading collection...
        </div>
      ) : displayProducts.length === 0 ? (
        <div className="avira-empty">
          <h3>No looks available yet</h3>
          <p>Check back soon for curated styles.</p>
        </div>
      ) : (
        <div className="avira-masonry-grid">
          {displayProducts.map((product) => {
            const isWishlisted = wishlist.some(item => item.id === product.id);
            return (
              <Link 
                key={product.id} 
                href={`/product/${product.id}`}
                className="avira-masonry-item group"
              >
                <div className="avira-item-img-wrapper">
                  <img 
                    src={product.imageUrl} 
                    alt={product.name} 
                    className="avira-item-img"
                    loading="lazy"
                  />
                  
                  <div className="avira-item-overlay">
                    {/* Top Right Layers Icon */}
                    <div className="avira-icon-top-right">
                      <Layers className="w-4 h-4" />
                    </div>
                    
                    {/* Bottom Left Username Tag */}
                    <div className="avira-tag-bottom-left">
                      @HOUSEOFAVIRA
                    </div>

                    {/* Bottom Right Heart Icon */}
                    <div 
                      className="avira-icon-bottom-right cursor-pointer hover:scale-105 transition-transform"
                      onClick={(e) => handleHeartClick(e, product)}
                    >
                      <Heart className={`w-4 h-4 transition-colors ${isWishlisted ? 'fill-[#8A001A] text-[#8A001A]' : 'text-black hover:text-[#8A001A]'}`} />
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}

      {/* Login Modal */}
      {showLoginModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
          <div className="bg-white p-8 max-w-[400px] w-full flex flex-col items-center text-center relative shadow-2xl">
            <button 
              onClick={() => setShowLoginModal(false)}
              className="absolute top-4 right-4 text-black hover:opacity-70 transition-opacity p-1"
            >
              <X className="w-5 h-5" />
            </button>
            
            <h2 className="text-[15px] font-bold tracking-widest uppercase text-black mb-3 mt-4">
              Log in to save this look
            </h2>
            <p className="text-[13px] text-black/80 mb-8 leading-relaxed px-2">
              Log in or create an account to save your favourite looks and view them at any time.
            </p>
            
            <Link 
              href="/auth/login"
              className="w-full bg-black text-white text-xs font-bold uppercase tracking-[0.15em] py-4 mb-4 hover:bg-[#8A001A] transition-colors"
            >
              Log in or create account
            </Link>
            
            <button 
              onClick={() => setShowLoginModal(false)}
              className="w-full bg-transparent text-black text-[11px] font-bold uppercase tracking-widest py-2 hover:opacity-70 transition-opacity"
            >
              Go back without saving
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
