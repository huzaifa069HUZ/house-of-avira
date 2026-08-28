'use client';

import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import ProductCard from '@/components/ProductCard';
import { Loader2 } from 'lucide-react';
import { notFound } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function CollectionClient({ slug }) {
  const [collectionData, setCollectionData] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notFoundState, setNotFoundState] = useState(false);

  useEffect(() => {
    async function fetchCollection() {
      try {
        // Fetch collection by slug
        const q = query(collection(db, 'collections'), where('slug', '==', slug));
        const querySnapshot = await getDocs(q);
        
        if (querySnapshot.empty) {
          setNotFoundState(true);
          setLoading(false);
          return;
        }

        const colData = querySnapshot.docs[0].data();
        setCollectionData(colData);

        // Fetch products by IDs
        if (colData.productIds && colData.productIds.length > 0) {
          const productPromises = colData.productIds.map(id => getDoc(doc(db, 'products', id)));
          const productDocs = await Promise.all(productPromises);
          
          const fetchedProducts = productDocs
            .filter(doc => doc.exists())
            .map(doc => ({ id: doc.id, ...doc.data() }));
            
          setProducts(fetchedProducts);
        }
      } catch (error) {
        console.error("Error fetching collection:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchCollection();
  }, [slug]);

  if (notFoundState) {
    notFound();
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAFAFA] flex flex-col">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-[#8A001A]" />
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex flex-col">
      <Header />
      
      <main className="flex-grow pt-24 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center mb-12">
            <h1 className="font-perandory text-3xl md:text-5xl text-black mb-4 uppercase tracking-wider">
              {collectionData?.title}
            </h1>
            {collectionData?.description && (
              <p className="text-gray-600 font-dm-sans max-w-2xl mx-auto">
                {collectionData.description}
              </p>
            )}
            <div className="h-px w-24 bg-[#8A001A] mx-auto mt-8"></div>
          </div>

          {products.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8">
              {products.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 text-gray-500 font-dm-sans">
              No products found in this collection.
            </div>
          )}

        </div>
      </main>

      <Footer />
    </div>
  );
}
