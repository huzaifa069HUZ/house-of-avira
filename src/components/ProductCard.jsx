import Link from 'next/link';
import { useWishlistStore } from '@/store/wishlistStore';
import { useAuthStore } from '@/store/authStore';
import { useCartStore } from '@/store/cartStore';
import { useRouter } from 'next/navigation';
import { Heart, ShoppingBag } from 'lucide-react';

export default function ProductCard({ product }) {
  const { id, name, price, imageUrl, badge, swatches, sizes = [] } = product;
  
  const { user } = useAuthStore();
  const router = useRouter();
  const { wishlist, toggleWishlist } = useWishlistStore();
  const { addToCart } = useCartStore();
  
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
    await addToCart({ id, title: name, price, image: imageUrl || (product.images && product.images[0]) });
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
                <Link href={`/product/${id}`} className="absolute inset-0 z-10">
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
            <Link href={`/product/${id}`} className="absolute inset-0 z-10">
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

        {/* Wishlist Heart Button with Animation */}
        <button 
          onClick={handleWishlistClick}
          className="absolute top-2 right-2 z-20 w-7 h-7 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors group/heart"
          aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Heart 
            className={`w-3.5 h-3.5 transition-all duration-300 ease-[cubic-bezier(0.175,0.885,0.32,1.275)] ${
              isWishlisted 
                ? 'fill-red-500 stroke-red-500 scale-110' 
                : 'fill-none stroke-black group-hover/heart:scale-110'
            }`} 
          />
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

        {/* Add to Cart Button */}
        <button 
          onClick={handleAddToCart}
          disabled={product.inStock === false}
          className={`absolute bottom-2 right-2 z-20 w-8 h-8 bg-black/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-black transition-all duration-300 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 ${product.inStock === false ? 'cursor-not-allowed hidden' : ''}`}
          aria-label="Add to cart"
        >
          <ShoppingBag className="w-4 h-4 text-white" />
        </button>
      </div>

      {/* Details Section */}
      <div className="flex justify-between items-start pt-1">
        
        {/* Left Side: Title and Price */}
        <div className="flex flex-col gap-0.5 max-w-[70%]">
          <h3 className="text-[11px] font-medium tracking-wide text-black uppercase leading-tight truncate">
            {name}
          </h3>
          <p className="text-[11px] text-neutral-600 font-normal">${price.toFixed(2)}</p>
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
