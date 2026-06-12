'use client';

import { useState, useEffect } from 'react';
import { useQuickAddStore } from '@/store/quickAddStore';
import { useCartStore } from '@/store/cartStore';
import { X, Check } from 'lucide-react';
import PriceDisplay from '@/components/PriceDisplay';

export default function ProductOptionsModal() {
  const { isOpen, product, closeQuickAdd } = useQuickAddStore();
  const { addToCart } = useCartStore();

  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    if (isOpen && product) {
      // Set defaults if available
      if (product.swatches && product.swatches.length > 0) {
        // Find default active or just use first
        const defaultColor = product.swatches.find(s => s.active) || product.swatches[0];
        setSelectedColor(defaultColor);
      } else {
        setSelectedColor(null);
      }

      // We do not set default size, force user to pick one
      setSelectedSize(null);
    }
  }, [isOpen, product]);

  if (!isOpen || !product) return null;

  const hasColors = product.swatches && product.swatches.length > 0;
  const hasSizes = product.sizes && product.sizes.length > 0;

  const canAddToCart = (!hasColors || selectedColor) && (!hasSizes || selectedSize);

  const handleAddToCart = async () => {
    if (!canAddToCart) return;
    
    setIsAdding(true);
    
    const selectedImage = selectedColor?.imageUrl || product.imageUrl || (product.images && product.images[0]);
    
    const success = await addToCart({
      id: product.id,
      title: product.name || product.title,
      price: product.price,
      image: selectedImage,
      color: selectedColor?.colorName || selectedColor?.color || null,
      size: selectedSize || null,
    });

    setIsAdding(false);
    
    if (success) {
      closeQuickAdd();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center sm:justify-end px-4 sm:px-0 bg-black/40 backdrop-blur-sm transition-opacity">
      {/* Background overlay click to close */}
      <div className="absolute inset-0" onClick={closeQuickAdd} />

      {/* Modal Content */}
      <div 
        className="relative bg-white w-full max-w-lg sm:h-full sm:max-h-[100dvh] overflow-y-auto shadow-2xl rounded-2xl sm:rounded-none sm:rounded-l-2xl flex flex-col transform transition-transform animate-in slide-in-from-bottom-8 sm:slide-in-from-right-8 duration-300"
      >
        {/* Header */}
        <div className="sticky top-0 bg-white z-10 px-6 py-5 border-b border-[#000000]/10 flex justify-between items-start">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-black">Choose your options</h2>
            <p className="text-sm text-neutral-500 mt-0.5 truncate max-w-[280px]">{product.name || product.title}</p>
          </div>
          <button 
            onClick={closeQuickAdd}
            className="p-2 -mr-2 text-neutral-400 hover:text-black transition-colors rounded-full hover:bg-neutral-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 px-6 py-6 space-y-8">
          
          {/* 1. Select Color */}
          {hasColors && (
            <div>
              <div className="flex justify-between items-baseline mb-3">
                <h3 className="text-sm font-bold text-black">1. Select Color</h3>
                {selectedColor && <span className="text-xs text-neutral-500 font-medium">{selectedColor.colorName || selectedColor.color}</span>}
              </div>
              
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                {product.swatches.map((swatch, idx) => {
                  const isSelected = selectedColor?.color === swatch.color;
                  return (
                    <div 
                      key={idx}
                      onClick={() => setSelectedColor(swatch)}
                      className={`cursor-pointer flex flex-col items-center gap-2 group p-2 rounded-xl transition-all ${isSelected ? 'border-2 border-black bg-neutral-50' : 'border border-transparent hover:bg-neutral-50'}`}
                    >
                      {/* Image Thumbnail or Color Circle Fallback */}
                      {swatch.imageUrl ? (
                        <div className="w-full aspect-[3/4] rounded-lg overflow-hidden bg-neutral-100 relative">
                          <img 
                            src={swatch.imageUrl} 
                            alt={swatch.colorName || swatch.color} 
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          {isSelected && (
                            <div className="absolute top-1.5 right-1.5 w-5 h-5 bg-white rounded-full flex items-center justify-center shadow-sm">
                              <Check className="w-3 h-3 text-black" />
                            </div>
                          )}
                        </div>
                      ) : (
                        <div 
                          className="w-12 h-12 rounded-full border border-black/10 flex items-center justify-center shadow-sm relative"
                          style={{ backgroundColor: swatch.color }}
                        >
                          {isSelected && <Check className={`w-5 h-5 ${['#ffffff', 'white', '#fff'].includes(swatch.color.toLowerCase()) ? 'text-black' : 'text-white'}`} />}
                        </div>
                      )}
                      
                      {/* Color Name */}
                      <span className="text-[11px] font-medium text-center text-neutral-600 truncate w-full">
                        {swatch.colorName || swatch.color}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* 2. Select Size */}
          {hasSizes && (
            <div>
              <div className="flex justify-between items-baseline mb-3">
                <h3 className="text-sm font-bold text-black">
                  {hasColors ? "2. Select Size" : "1. Select Size"}
                </h3>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((size) => {
                  const isSelected = selectedSize === size;
                  return (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`min-w-[3rem] px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                        isSelected 
                          ? 'bg-black text-white shadow-md scale-[1.02]' 
                          : 'bg-white text-black border border-[#000000]/20 hover:border-black'
                      }`}
                    >
                      {size}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white border-t border-[#000000]/10 p-6 z-10">
          <div className="flex justify-between items-center mb-4">
            <span className="text-sm text-neutral-500 font-medium">Total Price</span>
            <span className="text-xl font-bold text-black"><PriceDisplay basePrice={product.price} /></span>
          </div>
          
          <button
            onClick={handleAddToCart}
            disabled={!canAddToCart || isAdding}
            className="w-full bg-black text-white font-bold tracking-widest uppercase text-sm py-4 rounded-xl shadow-lg transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100 flex items-center justify-center gap-2"
          >
            {isAdding ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Adding...
              </>
            ) : (
              !canAddToCart ? 'Select Options' : 'Add to Cart'
            )}
          </button>
          <div className="mt-4 flex justify-center items-center gap-4 text-[10px] text-neutral-400 font-medium tracking-wide">
            <span className="flex items-center gap-1">
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
              Secure checkout
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 15v-1a4 4 0 00-4-4H8m0 0l3 3m-3-3l3-3m9 14V5a2 2 0 00-2-2H6a2 2 0 00-2 2v16l4-2 4 2 4-2 4 2z" /></svg>
              Easy returns
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
