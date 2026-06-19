'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Trash2, ShieldCheck, X } from 'lucide-react';
import { db, storage } from '@/lib/firebase';
import { collection, query, where, getDocs, deleteDoc, doc, updateDoc, increment } from 'firebase/firestore';
import { ref, deleteObject } from 'firebase/storage';
import { useAuthStore } from '@/store/authStore';
import ReviewFormModal from './ReviewFormModal';

export default function ProductReviews({ productId }) {
  const { user } = useAuthStore();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    fetchReviews();
  }, [productId]);

  const fetchReviews = async () => {
    try {
      const q = query(
        collection(db, 'reviews'),
        where('productId', '==', productId)
      );
      const querySnapshot = await getDocs(q);
      const fetchedReviews = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      // Sort by date descending
      fetchedReviews.sort((a, b) => {
        const timeA = a.createdAt?.toMillis ? a.createdAt.toMillis() : new Date(a.createdAt).getTime();
        const timeB = b.createdAt?.toMillis ? b.createdAt.toMillis() : new Date(b.createdAt).getTime();
        return timeB - timeA;
      });

      setReviews(fetchedReviews);
    } catch (error) {
      console.error("Error fetching reviews:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleReviewSubmitted = (newReview) => {
    setReviews(prev => [newReview, ...prev]);
  };

  const handleDeleteReview = async (review) => {
    if (!window.confirm("Are you sure you want to delete this review?")) return;
    
    try {
      if (review.imageUrls && review.imageUrls.length > 0) {
        for (const url of review.imageUrls) {
          try {
            const pathRegex = /o\/(.+?)\?alt=/;
            const match = url.match(pathRegex);
            if (match && match[1]) {
              const decodedPath = decodeURIComponent(match[1]);
              const imageRef = ref(storage, decodedPath);
              await deleteObject(imageRef);
            }
          } catch (e) {
            console.error("Failed to delete image", e);
          }
        }
      }

      await deleteDoc(doc(db, 'reviews', review.id));
      setReviews(prev => prev.filter(r => r.id !== review.id));
    } catch (error) {
      console.error("Error deleting review:", error);
      alert("Failed to delete review.");
    }
  };

  const avgRating = reviews.length > 0 
    ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1) 
    : 0;

  const ratingCounts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  reviews.forEach(r => ratingCounts[r.rating]++);

  return (
    <div className="w-full border-t border-neutral-200 mt-16 font-lato relative bg-gradient-to-b from-[#FAFAFA] to-[#EAEAEA]">
      <div className="absolute inset-0 opacity-[0.04] mix-blend-multiply pointer-events-none" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}></div>
      <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-8 pt-16 pb-24 relative z-10">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-24">
        
        {/* Left: Summary & CTA */}
        <div className="w-full lg:w-[30%] shrink-0">
          <div className="mb-10">
            <h2 className="flex flex-col">
              <span className="font-perandory text-black text-3xl md:text-4xl uppercase tracking-widest leading-none mb-1">Customer</span>
              <span className="font-aston-script text-[#8A001A] text-5xl md:text-6xl -mt-2 leading-none">Reviews</span>
            </h2>
          </div>
          
          <div className="flex items-end gap-5 mb-10 border-b border-black/10 pb-8">
            <h3 className="text-7xl font-light text-black leading-none tracking-tighter">{avgRating}</h3>
            <div className="flex flex-col pb-1.5">
              <div className="flex gap-1.5 mb-2">
                {[1, 2, 3, 4, 5].map(star => (
                  <Star 
                    key={star} 
                    className={`w-5 h-5 ${star <= Math.round(avgRating) ? 'fill-[#8A001A] stroke-[#8A001A]' : 'fill-transparent stroke-gray-300'}`} 
                  />
                ))}
              </div>
              <p className="text-[11px] text-black font-bold uppercase tracking-[0.2em]">{reviews.length} Reviews</p>
            </div>
          </div>

          <div className="space-y-4 mb-12">
            {[5, 4, 3, 2, 1].map(star => {
              const percentage = reviews.length > 0 ? (ratingCounts[star] / reviews.length) * 100 : 0;
              return (
                <div key={star} className="flex items-center gap-4 text-xs font-bold tracking-widest text-black/60 uppercase">
                  <div className="flex items-center gap-1.5 w-12 shrink-0">
                    {star} <Star className="w-3.5 h-3.5 fill-[#8A001A]/40 stroke-[#8A001A]/40" />
                  </div>
                  <div className="flex-1 h-[2px] bg-black/10 relative">
                    <div className="absolute top-0 left-0 h-full bg-[#8A001A] transition-all duration-500" style={{ width: `${percentage}%` }}></div>
                  </div>
                  <div className="w-6 text-right text-[11px] text-black font-bold">{ratingCounts[star]}</div>
                </div>
              );
            })}
          </div>

          <button 
            onClick={() => {
              if (!user) {
                alert("Please login to write a review");
                return;
              }
              setIsModalOpen(true);
            }}
            className="w-full bg-transparent border border-[#8A001A] text-[#8A001A] py-4 text-sm font-bold tracking-widest uppercase hover:bg-[#8A001A] hover:text-white transition-all duration-300"
          >
            {user ? "write a review" : "login to review"}
          </button>
        </div>

        {/* Right: Review List */}
        <div className="flex-1 lg:pl-12 lg:border-l lg:border-black/5">
          {loading ? (
            <div className="flex justify-center items-center h-48">
              <div className="w-5 h-5 border-[2px] border-[#8A001A] border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : reviews.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-24">
              <p className="text-xl text-black/70 font-light">no reviews yet, be the first one to share your experience</p>
            </div>
          ) : (
            <div className="space-y-6">
              {reviews.map(review => (
                <div key={review.id} className="border border-black p-6 sm:p-8 rounded-xl bg-white shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] group">
                  {/* Top Row */}
                  <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center gap-3">
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map(star => (
                          <Star 
                            key={star} 
                            className={`w-4 h-4 ${star <= review.rating ? 'fill-[#8A001A] stroke-[#8A001A]' : 'fill-transparent stroke-gray-300'}`} 
                          />
                        ))}
                      </div>
                      <span className="font-medium text-black text-lg">{review.rating}.0</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-neutral-400 font-medium">
                        {review.createdAt?.toDate ? review.createdAt.toDate().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Recently'}
                      </span>
                      {user && user.uid === review.userId && (
                        <button 
                          onClick={() => handleDeleteReview(review)}
                          className="text-black/30 hover:text-[#8A001A] transition-colors"
                          title="Delete Review"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Comment */}
                  {review.comment && (
                    <p className="text-base sm:text-lg text-black/90 leading-relaxed font-normal mb-8">
                      {review.comment}
                    </p>
                  )}

                  {/* Review Images */}
                  {review.imageUrls && review.imageUrls.length > 0 && (
                    <div className="flex flex-wrap gap-3 mb-8">
                      {review.imageUrls.map((url, idx) => (
                        <div 
                          key={idx} 
                          onClick={() => setSelectedImage(url)}
                          className="w-20 h-24 sm:w-24 sm:h-28 overflow-hidden cursor-pointer bg-neutral-100 hover:opacity-80 transition-opacity rounded-md border border-neutral-200"
                        >
                          <img src={url} alt={`Review photo ${idx}`} className="w-full h-full object-cover" />
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Bottom Row */}
                  <div className="flex justify-between items-end">
                    <span className="font-bold text-black text-base">
                      {review.userName ? `${review.userName.charAt(0)}***${review.userName.charAt(review.userName.length - 1)}` : 'A***s'}
                    </span>
                    <span className="flex items-center gap-1.5 text-sm text-black font-medium">
                      <ShieldCheck className="w-4 h-4 text-green-600" /> Verified Buyer
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <ReviewFormModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        productId={productId} 
        onReviewSubmitted={handleReviewSubmitted}
      />

      {/* Fullscreen Image View */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedImage(null)}
            className="fixed inset-0 z-[110] bg-black/90 backdrop-blur-xl flex items-center justify-center p-4"
          >
            <button className="absolute top-6 right-6 text-white/70 hover:text-white p-2 bg-white/10 rounded-full transition-colors">
              <X className="w-6 h-6" />
            </button>
            <img src={selectedImage} alt="Fullscreen Review" className="max-w-full max-h-full object-contain rounded-lg shadow-2xl" />
          </motion.div>
        )}
      </AnimatePresence>
      </div>
    </div>
  );
}
