'use client';

import { useState, useEffect, use } from 'react';
import { db } from '@/lib/firebase';
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { useWishlistStore } from '@/store/wishlistStore';
import { useAuthStore } from '@/store/authStore';
import { useCartStore } from '@/store/cartStore';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Heart, ChevronLeft, ChevronRight, AlertTriangle, Tag, Globe, Truck, ArrowDown, Package, FileText, ArrowRight, Share2 } from 'lucide-react';
import ProductReviews from '@/components/product/ProductReviews';

export default function ProductPage({ params: paramsPromise }) {
  const params = use(paramsPromise);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');

  // Swipe state
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);

  const router = useRouter();
  const { user } = useAuthStore();
  const { wishlist, toggleWishlist } = useWishlistStore();
  const { addToCart } = useCartStore();

  const handleAddToCart = async () => {
    if (!user) {
      router.push('/auth/login');
      return;
    }
    
    const selectedSwatch = product.swatches?.find(s => s.color === selectedColor);
    const productImage = selectedSwatch?.imageUrl || images[0];
    
    await addToCart({
      id: product.id,
      title: product.name,
      price: product.price,
      image: productImage,
      size: selectedSize,
      color: selectedSwatch?.colorName || selectedColor
    });
  };

  useEffect(() => {
    async function fetchProduct() {
      try {
        let productData = null;
        
        // 1. Try fetching by slug first
        const productsRef = collection(db, 'products');
        const q = query(productsRef, where('slug', '==', params.id));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          const docSnap = querySnapshot.docs[0];
          productData = { id: docSnap.id, ...docSnap.data() };
        } else {
          // 2. Fallback to raw ID lookup for backward compatibility
          const docRef = doc(db, 'products', params.id);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            productData = { id: docSnap.id, ...docSnap.data() };
          }
        }

        if (productData) {
          setProduct(productData);
          if (productData.sizes && productData.sizes.length > 0) setSelectedSize(productData.sizes[0]);
          if (productData.swatches && productData.swatches.length > 0) setSelectedColor(productData.swatches[0].color);
        } else {
          console.error("Product not found");
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchProduct();
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <div className="flex-1 flex items-center justify-center text-xs uppercase tracking-widest text-neutral-400">
          Loading...
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <div className="flex-1 flex flex-col items-center justify-center">
          <h1 className="text-2xl font-sans text-[#000000] mb-4">Product Not Found</h1>
          <button onClick={() => router.push('/')} className="text-xs border-b border-[#000000] uppercase tracking-widest pb-1">Return Home</button>
        </div>
      </div>
    );
  }

  const isWishlisted = wishlist.some(item => item.id === product.id);

  const handleWishlist = async () => {
    if (!user) {
      router.push('/auth/login');
      return;
    }
    await toggleWishlist(product);
  };

  const images = product.images || [product.imageUrl];

  const handleScroll = (e) => {
    const scrollPosition = e.target.scrollLeft;
    const width = e.target.offsetWidth;
    const newIndex = Math.round(scrollPosition / width);
    setCurrentImageIndex(newIndex);
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  // Touch handlers for swipe
  const minSwipeDistance = 50;

  const onTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEndEvent = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    if (isLeftSwipe) {
      nextImage();
    }
    if (isRightSwipe) {
      prevImage();
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex flex-col font-sans">
      
      <main className="flex-1 w-full mx-auto pb-24 lg:pb-0">
        
        {/* Mobile Breadcrumbs */}
        <div className="lg:hidden px-4 py-4 text-[10px] uppercase tracking-widest text-neutral-500 flex gap-2">
          <span onClick={() => router.push('/')} className="cursor-pointer hover:text-black">Home</span>
          <span>/</span>
          <span className="text-black font-medium truncate">{product.name}</span>
        </div>

        <div className="flex flex-col lg:flex-row w-full max-w-[1400px] mx-auto relative gap-x-8 lg:justify-center">
          
          {/* Left: Image Gallery */}
          <div className="w-full lg:w-[45%] flex flex-col relative px-4 sm:px-8 lg:px-4 pt-8 lg:pt-16">
            
            {/* Desktop & Mobile Main Slider */}
            <div 
              className="relative w-full aspect-[4/5] lg:aspect-auto lg:h-[70vh] rounded-2xl overflow-hidden shadow-[0_20px_50px_-12px_rgba(0,0,0,0.1)] group bg-white touch-pan-y"
              onTouchStart={onTouchStart}
              onTouchMove={onTouchMove}
              onTouchEnd={onTouchEndEvent}
            >
              <img 
                src={images[currentImageIndex]} 
                alt={`${product.name} ${currentImageIndex + 1}`} 
                className="w-full h-full object-cover lg:object-contain bg-neutral-50 transition-opacity duration-300" 
              />

              {/* Share Icon */}
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  if (navigator.share) {
                    navigator.share({
                      title: product.name,
                      url: window.location.href,
                    }).catch(console.error);
                  } else {
                    navigator.clipboard.writeText(window.location.href);
                    alert("Link copied to clipboard!");
                  }
                }}
                className="absolute top-4 right-4 z-10 w-10 h-10 bg-white/80 backdrop-blur-md rounded-full flex items-center justify-center text-black shadow-sm hover:bg-white hover:scale-105 transition-all duration-300 group/share"
                aria-label="Share product"
              >
                <Share2 className="w-4 h-4 stroke-[2px] group-hover/share:text-[#8A001A] transition-colors" />
              </button>
              
              {/* Slider Arrows */}
              {images.length > 1 && (
                <>
                  <button 
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/80 backdrop-blur-md hover:bg-white text-black rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-xl hover:scale-105"
                    aria-label="Previous image"
                  >
                    <ChevronLeft className="w-6 h-6 stroke-[1.5]" />
                  </button>
                  <button 
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/80 backdrop-blur-md hover:bg-white text-black rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-xl hover:scale-105"
                    aria-label="Next image"
                  >
                    <ChevronRight className="w-6 h-6 stroke-[1.5]" />
                  </button>
                </>
              )}
              
              {/* Dots Indicator */}
              {images.length > 1 && (
                <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-2">
                  {images.map((_, idx) => (
                    <button 
                      key={idx} 
                      onClick={() => setCurrentImageIndex(idx)}
                      className={`h-1.5 rounded-full transition-all duration-300 ${currentImageIndex === idx ? 'w-6 bg-black' : 'w-1.5 bg-black/30 hover:bg-black/50'}`}
                      aria-label={`Go to image ${idx + 1}`}
                    />
                  ))}
                </div>
              )}

              {/* Badge Overlay */}
              {product.badge && (
                <div className="absolute top-4 left-4 z-10 bg-white px-3 py-1.5 text-[10px] font-bold tracking-widest uppercase text-black shadow-sm">
                  {product.badge}
                </div>
              )}
            </div>

            {/* Thumbnails (Desktop Only) */}
            {images.length > 1 && (
              <div className="hidden lg:flex gap-3 mt-6 overflow-x-auto hide-scrollbar pb-4">
                {images.map((img, idx) => (
                  <button 
                    key={idx}
                    onClick={() => setCurrentImageIndex(idx)}
                    className={`relative w-20 aspect-[4/5] shrink-0 rounded-xl overflow-hidden transition-all duration-300 ${currentImageIndex === idx ? 'ring-2 ring-black ring-offset-2 opacity-100 scale-105' : 'ring-1 ring-neutral-200 opacity-60 hover:opacity-100 hover:scale-105'}`}
                  >
                    <img src={img} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Desktop Only: Extreme Modern How You Pay Section */}
            <div className="hidden lg:block mt-24 pb-16">
              <div className="flex items-center gap-4 mb-10">
                <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent to-neutral-200"></div>
                <h3 className="text-xs uppercase tracking-widest font-bold text-black flex items-center gap-2">
                  <span className="w-2 h-2 bg-black rounded-full animate-pulse"></span>
                  How You Pay (3 Phases)
                </h3>
                <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent to-neutral-200"></div>
              </div>

              <div className="grid grid-cols-2 gap-6">

                {/* Animated Timeline */}
                <div className="col-span-1 flex flex-col justify-center bg-white p-6 xl:p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-neutral-100 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-neutral-50 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none"></div>
                  <div className="flex flex-col gap-0 relative z-10">
                    <div className="flex items-start gap-4 group">
                      <div className="flex flex-col items-center">
                        <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300 shadow-md">
                          <Tag className="w-3.5 h-3.5" />
                        </div>
                        <div className="w-px h-8 bg-neutral-200 group-hover:bg-black transition-colors duration-500"></div>
                      </div>
                      <div className="pt-1.5">
                        <p className="text-[10px] font-bold text-black uppercase tracking-wider mb-0.5">Phase 1: Product</p>
                        <p className="text-[10px] text-neutral-500 font-light leading-relaxed">Pay fixed item price.</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4 group">
                      <div className="flex flex-col items-center">
                        <div className="w-8 h-8 rounded-full border-2 border-black bg-white text-black flex items-center justify-center shrink-0 group-hover:bg-black group-hover:text-white transition-all duration-300 shadow-sm">
                          <Globe className="w-3.5 h-3.5" />
                        </div>
                        <div className="w-px h-8 bg-neutral-200 group-hover:bg-black transition-colors duration-500"></div>
                      </div>
                      <div className="pt-1.5">
                        <p className="text-[10px] font-bold text-black uppercase tracking-wider mb-0.5">Phase 2: Transit</p>
                        <p className="text-[10px] text-neutral-500 font-light leading-relaxed">Shipping + Duties.</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4 group">
                      <div className="flex flex-col items-center">
                        <div className="w-8 h-8 rounded-full border-2 border-neutral-300 bg-white text-neutral-500 flex items-center justify-center shrink-0 group-hover:border-black group-hover:text-black transition-all duration-300">
                          <Truck className="w-3.5 h-3.5" />
                        </div>
                      </div>
                      <div className="pt-1.5">
                        <p className="text-[10px] font-bold text-black uppercase tracking-wider mb-0.5">Phase 3: Delivery</p>
                        <p className="text-[10px] text-neutral-500 font-light leading-relaxed">Final local delivery fee.</p>
                      </div>
                    </div>
                  </div>
                </div>


              </div>
            </div>
          </div>

          {/* Right: Sticky Product Info */}
          <div className="w-full lg:w-[45%] px-4 sm:px-8 lg:px-8 pt-8 lg:pt-16 pb-12">
            <div className="lg:sticky lg:top-32 max-w-md mx-auto lg:mx-0">
              
              {/* Desktop Breadcrumbs */}
              <div className="hidden lg:flex mb-8 text-[10px] uppercase tracking-widest text-neutral-500 gap-2">
                <span onClick={() => router.push('/')} className="cursor-pointer hover:text-black transition-colors">Home</span>
                <span>/</span>
                <span className="text-black font-medium">{product.name}</span>
              </div>

              <h1 className="text-2xl md:text-3xl font-medium text-black tracking-wide uppercase mb-3 leading-tight">{product.name}</h1>
              <p className="text-lg text-neutral-600 mb-10">₹{product.price.toFixed(2)}</p>

              {/* Colors */}
              {product.swatches && product.swatches.length > 0 && (
                <div className="mb-8">
                  <p className="text-[10px] uppercase tracking-widest font-bold text-black mb-4">Color: <span className="font-normal text-neutral-500 ml-1">{selectedColor}</span></p>
                  <div className="flex flex-wrap gap-3">
                    {product.swatches.map((swatch, idx) => (
                      <button 
                        key={idx} 
                        onClick={() => setSelectedColor(swatch.color)}
                        className={`w-9 h-9 rounded-full border flex items-center justify-center transition-all ${selectedColor === swatch.color ? 'border-black p-[3px]' : 'border-transparent p-[2px] hover:border-black/30'}`}
                        aria-label={`Select color ${swatch.color}`}
                      >
                        <div className="w-full h-full rounded-full border border-black/10 shadow-sm" style={{ backgroundColor: swatch.color }} />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Sizes */}
              {product.sizes && product.sizes.length > 0 && (
                <div className="mb-10">
                  <div className="flex justify-between items-center mb-4">
                    <p className="text-[10px] uppercase tracking-widest font-bold text-black">Select Size</p>
                    <button className="text-[10px] uppercase tracking-widest text-neutral-500 underline hover:text-black transition-colors">Size Guide</button>
                  </div>
                  <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
                    {product.sizes.map((size) => (
                      <button 
                        key={size} 
                        onClick={() => setSelectedSize(size)}
                        className={`py-3.5 border text-xs font-medium transition-all ${selectedSize === size ? 'border-black bg-black text-white shadow-md' : 'border-neutral-200 text-black hover:border-black'}`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col gap-3 mb-10">
                {product.inStock !== false ? (
                  <>
                    <button onClick={handleAddToCart} className="w-full bg-black text-white uppercase tracking-widest font-bold text-xs py-4 rounded-xl hover:bg-neutral-800 transition-all flex items-center justify-center min-h-[56px] shadow-lg hover:shadow-xl hover:-translate-y-0.5" style={{ fontFamily: '"Mona Sans", sans-serif' }}>
                      BUY NOW
                    </button>
                    <div className="flex gap-3">
                      <button 
                        onClick={handleAddToCart}
                        className="flex-1 bg-white border border-neutral-200 text-black uppercase tracking-widest font-bold text-xs py-4 rounded-xl hover:bg-neutral-50 hover:border-neutral-300 transition-all min-h-[56px] shadow-sm" style={{ fontFamily: '"Mona Sans", sans-serif' }}>
                        ADD TO CART
                      </button>
                      <button 
                        onClick={handleWishlist}
                        className="w-[56px] shrink-0 border border-neutral-200 bg-white rounded-xl flex items-center justify-center hover:border-black transition-all group shadow-sm hover:shadow-md"
                        aria-label="Wishlist"
                      >
                        <Heart 
                          className={`w-5 h-5 transition-all duration-300 ${isWishlisted ? 'fill-red-500 stroke-red-500' : 'fill-none stroke-black group-hover:scale-110'}`} 
                        />
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="flex gap-3">
                    <button disabled className="flex-1 bg-neutral-100 text-neutral-400 uppercase tracking-widest font-bold text-xs py-4 rounded-xl cursor-not-allowed min-h-[56px] border border-neutral-200">
                      Out of Stock
                    </button>
                    <button 
                      onClick={handleWishlist}
                      className="w-[56px] shrink-0 border border-neutral-200 bg-white rounded-xl flex items-center justify-center hover:border-black transition-all group shadow-sm"
                      aria-label="Wishlist"
                    >
                      <Heart 
                        className={`w-5 h-5 transition-all duration-300 ${isWishlisted ? 'fill-red-500 stroke-red-500' : 'fill-none stroke-black group-hover:scale-110'}`} 
                      />
                    </button>
                  </div>
                )}
              </div>

              {/* Shipping Warning Box */}
              <div className="mt-2 mb-6 border border-neutral-200 rounded-xl p-6 bg-neutral-50 flex flex-col items-center justify-center text-center gap-5">
                <p className="text-xs tracking-widest leading-loose uppercase font-bold text-neutral-600 max-w-sm" style={{ fontFamily: "var(--font-dm-sans), sans-serif" }}>
                  * Please place an order only if you are comfortable with the international shipping process and charges.
                </p>
                <Link href="/shipping" className="bg-black text-white px-8 py-3.5 rounded-full text-[10px] tracking-widest uppercase font-bold hover:bg-neutral-800 transition-colors shadow-sm">
                  READ FULL SHIPPING DETAILS
                </Link>
              </div>

              {/* Accordion Details */}
              <div className="border-t border-neutral-200 pt-8 mt-6">
                <h3 className="text-xs uppercase tracking-widest font-bold text-black mb-4" style={{ fontFamily: '"Mona Sans", sans-serif' }}>Product Details</h3>
                <p className="text-sm text-neutral-600 leading-relaxed whitespace-pre-wrap font-light">
                  {product.description || "No description available for this item."}
                </p>
                
                <div className="mt-8 pt-8 border-t border-neutral-200">
                  <h3 className="text-xs uppercase tracking-widest font-bold text-black mb-4" style={{ fontFamily: '"Mona Sans", sans-serif' }}>Shipping & Returns</h3>
                  <p className="text-sm text-neutral-600 leading-relaxed font-light">
                    SHIPPING CHARGES ARE SEPERATE AS PRODUCTS ARE IMPORT BASED. Please note that returns or exchanges are not available because our products are globally sourced and imported specifically for your order, which involves clearing custom duties and international transit. We ensure the highest quality before dispatch.
                  </p>
                </div>
              </div>

              {/* Read Before Ordering Cards */}
              <div className="mt-12 font-chillax">
                <h3 className="text-3xl md:text-4xl mb-6 flex flex-wrap gap-2.5 items-baseline">
                  <span className="font-perandory text-black tracking-tight">READ BEFORE</span>
                  <span className="font-aston-script text-[#8A001A]">Ordering</span>
                </h3>
                <div className="flex flex-col gap-3">
                  <Link href="/order-info/order-process" className="group flex justify-between items-center p-5 rounded-2xl border border-neutral-200 bg-white hover:border-black hover:shadow-md transition-all duration-300">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center text-black group-hover:bg-black group-hover:text-white transition-colors duration-300">
                        <Package className="w-4 h-4" />
                      </div>
                      <span className="text-sm font-bold tracking-widest uppercase text-black">Order Process</span>
                    </div>
                    <span className="text-[10px] font-bold tracking-widest uppercase text-neutral-400 group-hover:text-black transition-colors duration-300 flex items-center gap-1.5">
                      Learn More <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </Link>

                  <Link href="/order-info/shipping" className="group flex justify-between items-center p-5 rounded-2xl border border-neutral-200 bg-white hover:border-black hover:shadow-md transition-all duration-300">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center text-black group-hover:bg-black group-hover:text-white transition-colors duration-300">
                        <Truck className="w-4 h-4" />
                      </div>
                      <span className="text-sm font-bold tracking-widest uppercase text-black">Shipping</span>
                    </div>
                    <span className="text-[10px] font-bold tracking-widest uppercase text-neutral-400 group-hover:text-black transition-colors duration-300 flex items-center gap-1.5">
                      Learn More <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </Link>

                  <Link href="/order-info/policies" className="group flex justify-between items-center p-5 rounded-2xl border border-neutral-200 bg-white hover:border-black hover:shadow-md transition-all duration-300">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center text-black group-hover:bg-black group-hover:text-white transition-colors duration-300">
                        <FileText className="w-4 h-4" />
                      </div>
                      <span className="text-sm font-bold tracking-widest uppercase text-black">Policies</span>
                    </div>
                    <span className="text-[10px] font-bold tracking-widest uppercase text-neutral-400 group-hover:text-black transition-colors duration-300 flex items-center gap-1.5">
                      Learn More <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </Link>
                </div>
              </div>

              {/* Warnings / Terms Highlight (Custom Visual Design) */}
              <div className="mt-6 relative overflow-hidden p-5 md:p-6 rounded-2xl md:rounded-[2rem] flex gap-5 items-center shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-neutral-100 bg-white">
                
                {/* Decorative Shapes */}
                {/* Top Left Yellow Blob */}
                <div className="absolute top-0 left-0 w-16 h-16 bg-[#FCD34D] rounded-br-full -translate-x-2 -translate-y-2 pointer-events-none"></div>
                
                {/* Bottom Left Green Dot */}
                <div className="absolute bottom-5 left-5 w-2 h-2 bg-[#84CC16] rounded-full pointer-events-none"></div>
                
                {/* Top Right Dot Grid */}
                <div className="absolute top-5 right-6 grid grid-cols-3 gap-1 opacity-80 pointer-events-none">
                  {[...Array(9)].map((_, i) => (
                    <div key={i} className="w-1 h-1 bg-[#84CC16] rounded-full"></div>
                  ))}
                </div>
                
                {/* Bottom Right Green Waves/Blobs */}
                <div className="absolute -bottom-16 -right-12 w-48 h-48 bg-[#ECFCCB] rounded-tl-full pointer-events-none"></div>
                <div className="absolute -bottom-12 -right-20 w-48 h-48 bg-[#84CC16] rounded-tl-full pointer-events-none"></div>

                {/* Content */}
                <div className="bg-[#FEF3C7] w-14 h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center shrink-0 relative z-10 ml-2 md:ml-4">
                  <AlertTriangle className="w-6 h-6 md:w-7 md:h-7 text-[#111827]" strokeWidth={1.5} />
                </div>
                <div className="flex flex-col gap-0.5 relative z-10">
                  <span className="text-[15px] md:text-[17px] font-extrabold text-[#111827] uppercase tracking-wide">
                    NO RETURN • NO EXCHANGE
                  </span>
                  <span className="text-xs md:text-[13px] text-neutral-500 uppercase tracking-wide font-medium mt-0.5">
                    EXTRA DELIVERY CHARGES APPLY
                  </span>
                </div>
              </div>

              {/* Mobile Only: Payment Steps */}
              <div className="lg:hidden mt-12 border-t border-neutral-200 pt-10">
                <h3 className="text-xs uppercase tracking-widest font-bold text-black mb-6 flex items-center gap-2">
                  <span className="w-2 h-2 bg-black rounded-full animate-pulse"></span>
                  How You Pay (3 Phases)
                </h3>
                
                <div className="flex flex-col gap-0 mb-10 relative">
                  <div className="flex items-start gap-4">
                    <div className="flex flex-col items-center">
                      <div className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center shrink-0 shadow-md"><Tag className="w-4 h-4" /></div>
                      <div className="w-px h-10 bg-neutral-200"></div>
                    </div>
                    <div className="pt-2">
                      <p className="text-xs font-bold text-black uppercase tracking-wider mb-1">Phase 1: Product Price</p>
                      <p className="text-xs text-neutral-500 font-light leading-relaxed">Pay the fixed item price to secure your order.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="flex flex-col items-center">
                      <div className="w-10 h-10 rounded-full border-2 border-black bg-white text-black flex items-center justify-center shrink-0 shadow-sm"><Globe className="w-4 h-4" /></div>
                      <div className="w-px h-10 bg-neutral-200"></div>
                    </div>
                    <div className="pt-2">
                      <p className="text-xs font-bold text-black uppercase tracking-wider mb-1">Phase 2: International Transit</p>
                      <p className="text-xs text-neutral-500 font-light leading-relaxed">Pay for shipping based on weight + custom duties.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="flex flex-col items-center">
                      <div className="w-10 h-10 rounded-full border-2 border-neutral-300 bg-white text-neutral-500 flex items-center justify-center shrink-0"><Truck className="w-4 h-4" /></div>
                    </div>
                    <div className="pt-2">
                      <p className="text-xs font-bold text-black uppercase tracking-wider mb-1">Phase 3: Domestic Delivery</p>
                      <p className="text-xs text-neutral-500 font-light leading-relaxed">Final payment for local shipment.</p>
                    </div>
                  </div>
                </div>
                

              </div>

            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <ProductReviews productId={product.id} />

      </main>
    </div>
  );
}
