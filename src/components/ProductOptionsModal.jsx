'use client';

import { useState, useEffect } from 'react';
import { useQuickAddStore } from '@/store/quickAddStore';
import { useCartStore } from '@/store/cartStore';
import { X, Ruler, ShieldCheck, Undo2 } from 'lucide-react';

export default function ProductOptionsModal() {
  const { isOpen, product, closeQuickAdd } = useQuickAddStore();
  const { addToCart } = useCartStore();

  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    if (isOpen && product) {
      if (product.swatches && product.swatches.length > 0) {
        const defaultColor = product.swatches.find(s => s.active) || product.swatches[0];
        setSelectedColor(defaultColor);
      } else {
        setSelectedColor(null);
      }
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
    <div className="fixed inset-0 z-[110] flex items-center justify-end px-0 bg-black/50 backdrop-blur-[2px] transition-opacity">
      {/* Background overlay click to close */}
      <div className="absolute inset-0" onClick={closeQuickAdd} />

      {/* Slide-over Modal Content */}
      <div 
        className="relative bg-white w-full max-w-[460px] h-[100dvh] overflow-hidden flex flex-col shadow-2xl animate-in slide-in-from-right duration-300 ease-out sm:rounded-l-2xl"
      >
        {/* Header */}
        <div className="flex-shrink-0 px-6 py-6 border-b border-[#000000]/5 flex justify-between items-start bg-white z-10">
          <div>
            <h2 className="text-[17px] font-bold text-[#000000]">Choose your options</h2>
            <p className="text-[13px] text-neutral-500 mt-1">Select your preferred color and size</p>
          </div>
          <button 
            onClick={closeQuickAdd}
            className="text-neutral-400 hover:text-black transition-colors"
          >
            <X className="w-5 h-5 stroke-[1.5]" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto px-6 py-8 pb-32">
          
          {/* 1. Select Color */}
          {hasColors && (
            <div className="mb-10">
              <h3 className="text-[14px] font-bold text-[#000000] mb-4">1. Select Color</h3>
              
              <div className="grid grid-cols-4 gap-3">
                {product.swatches.map((swatch, idx) => {
                  const isSelected = selectedColor?.color === swatch.color;
                  return (
                    <div 
                      key={idx}
                      onClick={() => setSelectedColor(swatch)}
                      className={`cursor-pointer flex flex-col items-center gap-2 rounded-xl transition-all p-1.5
                        ${isSelected ? 'border border-black' : 'border border-transparent hover:border-black/10'}
                      `}
                    >
                      {/* Image Thumbnail */}
                      <div className="w-full aspect-[3/4] rounded-lg overflow-hidden bg-[#F5F5F5]">
                        {swatch.imageUrl ? (
                          <img 
                            src={swatch.imageUrl} 
                            alt={swatch.colorName || swatch.color} 
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div 
                            className="w-full h-full"
                            style={{ backgroundColor: swatch.color }}
                          />
                        )}
                      </div>
                      
                      {/* Color Name */}
                      <span className="text-[11px] font-medium text-center text-[#000000] truncate w-full px-1 pb-1">
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
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-[14px] font-bold text-[#000000]">
                  {hasColors ? "2. Select Size" : "1. Select Size"}
                </h3>
                <button className="flex items-center gap-1.5 text-[12px] text-[#4285F4] font-medium hover:underline">
                  View Size Chart <Ruler className="w-3.5 h-3.5" />
                </button>
              </div>
              
              <div className="grid grid-cols-5 gap-2 mb-6">
                {product.sizes.map((size) => {
                  const isSelected = selectedSize === size;
                  return (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`py-2.5 rounded-lg text-[13px] font-medium transition-all ${
                        isSelected 
                          ? 'bg-transparent border border-black text-black ring-1 ring-black shadow-sm' 
                          : 'bg-transparent border border-neutral-200 text-black hover:border-black/40'
                      }`}
                    >
                      {size}
                    </button>
                  );
                })}
              </div>

              {/* Recommended Size Box */}
              {selectedSize && (
                <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl p-4 flex flex-col gap-1">
                  <p className="text-[13px] font-medium text-[#000000]">
                    <span className="text-neutral-500 font-bold mr-1">{selectedSize}</span> Recommended for
                  </p>
                  <p className="text-[12px] text-neutral-500">
                    Weight: 47.5 - 55 kg <span className="mx-2">|</span> Height: 160 - 170 cm
                  </p>
                </div>
              )}
            </div>
          )}

        </div>

        {/* Sticky Footer */}
        <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-[#000000]/5 px-6 py-6 z-20">
          <button
            onClick={handleAddToCart}
            disabled={!canAddToCart || isAdding}
            className="w-full bg-[#111111] text-white font-medium text-[15px] py-4 rounded-xl shadow-lg transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100 flex items-center justify-center gap-2 mb-4 hover:bg-black"
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

          <div className="flex justify-center items-center gap-4 text-[12px] text-neutral-500 font-medium">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-neutral-400" />
              Secure checkout
            </span>
            <span>·</span>
            <span className="flex items-center gap-1.5">
              <Undo2 className="w-4 h-4 text-neutral-400" />
              Easy returns
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
