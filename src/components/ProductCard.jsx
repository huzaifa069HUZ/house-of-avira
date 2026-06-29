import Link from 'next/link';
import { useWishlistStore } from '@/store/wishlistStore';
import { useAuthStore } from '@/store/authStore';
import { useCartStore } from '@/store/cartStore';
import { useQuickAddStore } from '@/store/quickAddStore';
import { useRouter } from 'next/navigation';
import { Heart, ShoppingBag, Layers } from 'lucide-react';
import PriceDisplay from '@/components/PriceDisplay';

export default function ProductCard({ product }) {
  const { id, slug, name, price, imageUrl, badge, swatches, sizes = [] } = product;
  
  const { user } = useAuthStore();
  const router = useRouter();
  const { wishlist, toggleWishlist } = useWishlistStore();
  const { addToCart } = useCartStore();
  const { openQuickAdd } = useQuickAddStore();
  
  const isWishlisted = wishlist.some(item => item.id === id);

  const handleWishlistClick = async (e) => {
    e.preventDefault(); // Prevent Link wrapper if this card gets wrapped
    if (!user) {
      router.push('/auth/login');
      return;
    }
    await toggleWishlist(product);
  };

  const handleAddToCart = async (e) => {
    e.preventDefault();
    if (!user) {
      router.push('/auth/login');
      return;
    }
    
    const hasColors = product.swatches && product.swatches.length > 0;
    const hasSizes = product.sizes && product.sizes.length > 0;
    
    if (hasColors || hasSizes) {
      openQuickAdd(product);
    } else {
      await addToCart({ 
        id: product.id, 
        title: product.name || product.title, 
        price: product.price, 
        image: product.imageUrl || (product.images && product.images[0]) 
      });
    }
  };

  return (
    <div className="group flex flex-col gap-2 relative cursor-pointer w-full">
      {/* Image Container */}
      <div className={`relative aspect-[3/4] w-full overflow-hidden rounded-md bg-[#E5E0DA] ${product.inStock === false ? 'opacity-70' : ''}`}>
        {product.images && product.images.length > 1 ? (
          <div className="flex w-full h-full overflow-x-auto snap-x snap-mandatory hide-scrollbar style-hide-scrollbar" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            <style jsx>{`
              .style-hide-scrollbar::-webkit-scrollbar {
                display: none;
              }
            `}</style>
            {product.images.map((img, idx) => (
              <div key={idx} className="w-full h-full flex-shrink-0 snap-center relative">
                <Link href={`/product/`} className="absolute inset-0 z-10">
                  <span className="sr-only">View {name} {idx + 1}</span>
                </Link>
                <img
                  src={img}
                  alt={`${name} - Image ${idx + 1}`}
                  className="h-full w-full object-cover object-center transition-transform duration-500"
                />
              </div>
            ))}
          </div>
        ) : (
          <>
            <Link href={`/product/`} className="absolute inset-0 z-10">
              <span className="sr-only">View {name}</span>
            </Link>
            <img
              src={imageUrl || (product.images && product.images[0])}
              alt={name}
              className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
            />
          </>
        )}
        
        {/* Out of Stock Overlay */}
        {product.inStock === false && (
          <div className="absolute inset-0 bg-white/40 flex items-center justify-center z-10 backdrop-blur-[1px]">
            <span className="bg-white/90 text-black px-4 py-2 text-[10px] font-bold tracking-[0.2em] shadow-sm uppercase">
              Out of Stock
            </span>
          </div>
        )}
        
        {/* Badge (MOST LOVED, NEW, etc.) */}
        {badge && (
          <div className="absolute top-2 left-2 z-20 bg-white px-2 py-1 text-[9px] font-bold tracking-widest uppercase text-black shadow-sm rounded-sm">
            {badge}
          </div>
        )}

        {/* Add to Cart Button (Top Right) */}
        <button 
          onClick={handleAddToCart}
          disabled={product.inStock === false}
          className={`absolute top-2 right-2 z-20 w-7 h-7 bg-white/90 backdrop-blur-sm rounded-sm flex items-center justify-center hover:bg-white transition-all duration-300 hover:scale-105 shadow-sm ${product.inStock === false ? 'cursor-not-allowed hidden' : ''}`}
          aria-label="Add to cart"
        >
          <Layers className="w-3.5 h-3.5 text-black" />
        </button>

        {/* Hover Sizes Panel */}
        {sizes && sizes.length > 0 && (
          <div className="absolute bottom-2 left-2 right-12 z-20 bg-white/95 backdrop-blur-sm py-2 px-2 flex justify-center items-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-[2px] shadow-sm">
            {sizes.slice(0, 5).map(size => (
              <span key={size} className="text-[10px] font-medium text-neutral-600 hover:text-black transition-colors">{size}</span>
            ))}
            {sizes.length > 5 && <span className="text-[10px] font-medium text-neutral-600">...</span>}
          </div>
        )}

        {/* Wishlist Heart Button (Bottom Right) */}
        <button 
          onClick={handleWishlistClick}
          className="absolute bottom-2 right-2 z-20 w-7 h-7 bg-white/90 backdrop-blur-sm rounded-sm flex items-center justify-center hover:bg-white transition-colors group/heart shadow-sm hover:scale-105"
          aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Heart 
            className={`w-3.5 h-3.5 transition-all duration-300 ease-[cubic-bezier(0.175,0.885,0.32,1.275)] ${
              isWishlisted 
                ? 'fill-[#8A001A] stroke-[#8A001A] scale-110' 
                : 'fill-none stroke-black group-hover/heart:scale-110 group-hover/heart:stroke-[#8A001A]'
            }`} 
          />
        </button>
      </div>

      {/* Details Section */}
      <div className="flex justify-between items-start pt-1">
        
        {/* Left Side: Title and Price */}
        <div className="flex flex-col gap-0.5 max-w-[70%]">
          <h3 className="text-[11px] font-medium tracking-wide text-black uppercase leading-tight truncate">
            {name}
          </h3>
          <p className="text-[11px] text-neutral-600 font-normal"><PriceDisplay basePrice={price} /></p>
        </div>
        
        {/* Right Side: Swatches */}
        {swatches && swatches.length > 0 && (
          <div className="flex items-center gap-1 shrink-0 mt-0.5">
            {swatches.map((swatch, idx) => (
              <div 
                key={idx} 
                className="w-3.5 h-3.5 rounded-full border border-black/10 flex items-center justify-center p-[2px]"
                style={swatch.active ? { borderColor: '#4285F4' } : {}}
              >
                <div 
                  className="w-full h-full rounded-full" 
                  style={{ backgroundColor: swatch.color }}
                />
              </div>
            ))}
            {product.extraColors > 0 && (
              <span className="text-[10px] text-neutral-600 font-medium ml-0.5">+{product.extraColors}</span>
            )}
          </div>
        )}
        
      </div>
    </div>
  );
}
