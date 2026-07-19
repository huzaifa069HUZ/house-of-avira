'use client';

import { useState, useEffect } from 'react';
import { useQuickAddStore } from '@/store/quickAddStore';
import { useCartStore } from '@/store/cartStore';
import { X, Ruler, ShoppingCart } from 'lucide-react';
import PriceDisplay from '@/components/PriceDisplay';

export default function ProductOptionsModal() {
  const { isOpen, product, closeQuickAdd } = useQuickAddStore();
  const { addToCart } = useCartStore();

  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [quantity, setQuantity] = useState(1);
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
      setQuantity(1);
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
      quantity: quantity,
      availableSizes: product.sizes || []
    });

    setIsAdding(false);
    
    if (success) {
      closeQuickAdd();
    }
  };

  const handleQuantityChange = (delta) => {
    setQuantity(prev => Math.max(1, prev + delta));
  };

  const currentImage = selectedColor?.imageUrl || product.imageUrl || (product.images && product.images[0]);

  // Brand Red Color
  const brandRed = '#8A001A';

  return (
    <div className="fixed inset-0 z-[110] flex items-end sm:items-center justify-end px-0 bg-black/50 backdrop-blur-[2px] transition-opacity font-[family-name:var(--font-dm-sans)]">
      {/* Background overlay click to close */}
      <div className="absolute inset-0" onClick={closeQuickAdd} />

      {/* Slide-over/Bottom-sheet Modal Content */}
      <div 
        className="relative bg-white w-full sm:max-w-[460px] max-h-[92dvh] sm:h-[100dvh] rounded-t-[28px] sm:rounded-t-none sm:rounded-l-2xl overflow-hidden flex flex-col shadow-2xl animate-in slide-in-from-bottom sm:slide-in-from-right duration-300 ease-out"
      >
        {/* Header - Close Button */}
        <button 
          onClick={closeQuickAdd}
          className="absolute top-4 right-4 sm:top-5 sm:right-5 text-neutral-500 hover:text-black transition-colors z-20 bg-white sm:bg-transparent rounded-full p-1.5 shadow-sm sm:shadow-none"
        >
          <X className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2]" />
        </button>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto px-5 sm:px-6 pt-8 sm:pt-10 pb-40">
          
          {/* Product Info Section */}
          <div className="flex gap-4 mb-6">
            <div className="w-[100px] sm:w-[120px] aspect-[4/5] rounded-xl overflow-hidden bg-[#F5F5F5] flex-shrink-0">
              <img src={currentImage} alt={product.name || product.title} className="w-full h-full object-cover" />
            </div>
            <div className="flex flex-col justify-center pr-6">
              <h2 className="text-[18px] sm:text-[20px] font-bold text-[#111111] font-[family-name:var(--font-playfair)] leading-tight mb-2">
                {product.name || product.title}
              </h2>
              <div className="text-[20px] sm:text-[24px] font-bold mb-2" style={{ color: brandRed }}>
                <PriceDisplay basePrice={product.price} />
              </div>
              
              <div className="text-[13px] text-neutral-600 mb-2 leading-snug hidden sm:block">
                {product.description || 'Lightweight, breathable and supportive. Designed for every move you make.'}
              </div>
              
              <div className="flex items-center gap-1.5 mb-1.5 mt-auto">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: brandRed }} />
                <span className="text-[13px] font-medium" style={{ color: brandRed }}>In Stock</span>
              </div>
              <p className="text-[12px] text-neutral-500">
                SKU: {product.sku || `PRD-${product.id}`}
              </p>
            </div>
          </div>

          <div className="w-full h-[1px] bg-neutral-100 mb-6" />
          
          {/* 1. Select Color */}
          {hasColors && (
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <h3 className="text-[14px] font-bold text-[#111111]">Color:</h3>
                <span className="text-[14px] text-neutral-500">{selectedColor?.colorName || 'Choose your color'}</span>
              </div>
              
              <div className="grid grid-cols-4 gap-2.5">
                {product.swatches.map((swatch, idx) => {
                  const isSelected = selectedColor?.color === swatch.color;
                  return (
                    <div 
                      key={idx}
                      onClick={() => setSelectedColor(swatch)}
                      className={`cursor-pointer flex flex-col items-center gap-1.5 rounded-xl transition-all p-1.5
                        ${isSelected ? 'border-[1.5px]' : 'border-[1.5px] border-transparent hover:border-black/10'}
                      `}
                      style={{ borderColor: isSelected ? brandRed : '' }}
                    >
                      <div className="w-full aspect-[4/5] rounded-lg overflow-hidden bg-[#F5F5F5] relative">
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
                        {isSelected && (
                          <div className="absolute top-1.5 right-1.5 w-[18px] h-[18px] bg-white rounded-full flex items-center justify-center shadow-sm">
                            <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: brandRed }} />
                          </div>
                        )}
                      </div>
                      
                      <span className="text-[11px] font-medium text-center text-[#111111] truncate w-full px-1">
                        {swatch.colorName || swatch.color}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {hasColors && hasSizes && <div className="w-full h-[1px] bg-neutral-100 mb-6" />}

          {/* 2. Select Size */}
          {hasSizes && (
            <div className="mb-6">
              <div className="flex justify-between items-center mb-3">
                <div className="flex items-center gap-2">
                  <h3 className="text-[14px] font-bold text-[#111111]">Size:</h3>
                  <span className="text-[14px] text-neutral-500">{selectedSize || 'Select your size'}</span>
                </div>
                <button className="flex items-center gap-1.5 text-[12px] text-neutral-500 hover:text-black font-medium transition-colors">
                  Size Guide <Ruler className="w-3.5 h-3.5" />
                </button>
              </div>
              
              <div className="grid grid-cols-5 gap-2">
                {product.sizes.map((size) => {
                  const isSelected = selectedSize === size;
                  return (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`py-2.5 rounded-lg text-[13px] font-medium transition-all ${
                        isSelected 
                          ? 'bg-transparent border-[1.5px] text-[#111111]' 
                          : 'bg-transparent border border-neutral-200 text-[#111111] hover:border-black/40'
                      }`}
                      style={{ borderColor: isSelected ? brandRed : '', color: isSelected ? brandRed : '' }}
                    >
                      {size}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Quantity */}
          <div className="mb-2">
             <h3 className="text-[14px] font-bold text-[#111111] mb-3">Quantity</h3>
             <div className="flex items-center justify-between">
                <div className="flex items-center border border-neutral-200 rounded-lg overflow-hidden w-[120px] h-[44px]">
                  <button 
                    onClick={() => handleQuantityChange(-1)} 
                    className="w-10 h-full flex items-center justify-center text-neutral-500 hover:bg-neutral-50 hover:text-black transition-colors"
                  >
                    -
                  </button>
                  <div className="flex-1 h-full flex items-center justify-center text-[14px] font-bold border-x border-neutral-200">
                    {quantity}
                  </div>
                  <button 
                    onClick={() => handleQuantityChange(1)} 
                    className="w-10 h-full flex items-center justify-center text-neutral-500 hover:bg-neutral-50 hover:text-black transition-colors"
                  >
                    +
                  </button>
                </div>

             </div>
          </div>

        </div>

        {/* Sticky Footer */}
        <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-neutral-100 px-5 sm:px-6 py-4 sm:py-5 z-20 flex flex-col gap-3">
          <button
            onClick={handleAddToCart}
            disabled={!canAddToCart || isAdding}
            className="w-full text-white font-bold text-[15px] py-3.5 rounded-xl shadow-md transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            style={{ backgroundColor: brandRed }}
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
              <>
                <ShoppingCart className="w-5 h-5" />
                {!canAddToCart ? 'Select Options' : 'Add to Cart'}
              </>
            )}
          </button>
          
          <button
            disabled={!canAddToCart || isAdding}
            className="w-full bg-white font-bold text-[15px] py-3.5 rounded-xl border-[1.5px] transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ borderColor: brandRed, color: brandRed }}
          >
            Buy It Now
          </button>
        </div>
      </div>
    </div>
  );
}
