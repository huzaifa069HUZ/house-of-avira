'use client';

import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { Edit2, PackageX, Loader2 } from 'lucide-react';

export default function ProductList({ onEdit }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

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

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32">
        <Loader2 className="w-8 h-8 animate-spin text-[#0071e3] mb-4" />
        <p className="text-sm font-medium text-[#86868b]">Loading products...</p>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-32 bg-white rounded-2xl border border-[#d2d2d7] shadow-sm">
        <PackageX className="w-12 h-12 text-[#86868b] mb-4" />
        <h3 className="text-lg font-semibold text-black mb-1">No products found</h3>
        <p className="text-sm text-[#86868b]">You haven't added any products to your store yet.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-[0_2px_10px_rgba(0,0,0,0.04)] overflow-hidden border border-[#d2d2d7]/50">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-[#F5F5F7] text-[#86868b] text-[11px] uppercase tracking-wider font-semibold border-b border-[#d2d2d7]">
            <tr>
              <th className="px-6 py-4 rounded-tl-2xl">Product</th>
              <th className="px-6 py-4">Price</th>
              <th className="px-6 py-4">Category</th>
              <th className="px-6 py-4">Section</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right rounded-tr-2xl">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#d2d2d7]/50">
            {products.map((product) => (
              <tr key={product.id} className="hover:bg-[#F5F5F7]/50 transition-colors group">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-9 rounded overflow-hidden bg-[#F5F5F7] shrink-0 border border-[#d2d2d7]/50">
                      <img src={product.imageUrl} alt="" className="h-full w-full object-cover" />
                    </div>
                    <div className="flex flex-col">
                      <span className="font-semibold text-black">{product.name}</span>
                      <span className="text-[11px] text-[#86868b] uppercase tracking-widest">{product.badge || 'NO BADGE'}</span>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap font-medium text-black">
                  ₹{product.price?.toFixed(2)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex flex-col">
                    <span className="text-black">{product.category || 'N/A'}</span>
                    <span className="text-xs text-[#86868b]">{product.subcategory || ''}</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-[#86868b]">
                  {product.section}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {product.inStock !== false ? (
                    <span className="px-2.5 py-1 text-[10px] font-bold tracking-widest uppercase bg-[#f0fdf4] text-[#34c759] rounded-full border border-[#34c759]/20">
                      In Stock
                    </span>
                  ) : (
                    <span className="px-2.5 py-1 text-[10px] font-bold tracking-widest uppercase bg-[#fff2f2] text-[#ff3b30] rounded-full border border-[#ff3b30]/20">
                      Out of Stock
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  <button 
                    onClick={() => onEdit(product)}
                    className="p-2 text-[#0071e3] hover:bg-[#0071e3]/10 rounded-full transition-colors opacity-100 sm:opacity-0 sm:group-hover:opacity-100 focus:opacity-100"
                    aria-label="Edit product"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
