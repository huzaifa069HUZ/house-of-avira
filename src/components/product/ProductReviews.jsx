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
    <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-8 pt-16 pb-24 border-t border-neutral-200 mt-16 font-sans">
      <div className="flex flex-col lg:flex-row gap-12 lg:gap-24">
        
        {/* Left: Summary & CTA */}
        <div className="w-full lg:w-[30%] shrink-0">
          <h2 className="mb-10 flex flex-col">
            <span className="font-perandory text-black text-3xl md:text-4xl uppercase tracking-widest leading-none mb-1">Customer</span>
            <span className="font-aston-script text-[#4a0000] text-5xl md:text-6xl -mt-2 leading-none">Reviews</span>
          </h2>
          
          <div className="flex items-end gap-5 mb-10 border-b border-black/10 pb-8">
            <h3 className="text-7xl font-light text-black leading-none tracking-tighter" style={{ fontFamily: "'Cormorant Garamond', serif" }}>{avgRating}</h3>
            <div className="flex flex-col pb-1.5">
              <div className="flex gap-1.5 mb-2">
                {[1, 2, 3, 4, 5].map(star => (
                  <Star 
                    key={star} 
                    className={`w-4 h-4 ${star <= Math.round(avgRating) ? 'fill-black stroke-black' : 'fill-transparent stroke-gray-300'}`} 
                  />
                ))}
              </div>
              <p className="text-[10px] text-black uppercase tracking-[0.2em]">{reviews.length} Reviews</p>
            </div>
          </div>

          <div className="space-y-4 mb-12">
            {[5, 4, 3, 2, 1].map(star => {
              const percentage = reviews.length > 0 ? (ratingCounts[star] / reviews.length) * 100 : 0;
              return (
                <div key={star} className="flex items-center gap-4 text-xs tracking-widest text-black/60 uppercase">
                  <div className="flex items-center gap-1.5 w-12 shrink-0">
                    {star} <Star className="w-3 h-3 fill-black/40 stroke-black/40" />
                  </div>
                  <div className="flex-1 h-[1px] bg-black/10 relative">
                    <div className="absolute top-0 left-0 h-full bg-black transition-all duration-500" style={{ width: `${percentage}%` }}></div>
                  </div>
                  <div className="w-6 text-right text-[10px] text-black">{ratingCounts[star]}</div>
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
            className="w-full bg-transparent border border-black text-black py-4 text-xl hover:bg-black hover:text-white transition-colors duration-300"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            {user ? "write a review" : "login to review"}
          </button>
        </div>

        {/* Right: Review List */}
        <div className="flex-1 lg:pl-12 lg:border-l lg:border-black/5">
          {loading ? (
            <div className="flex justify-center items-center h-48">
              <div className="w-5 h-5 border-[1px] border-black border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : reviews.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-24">
              <p className="text-2xl text-black/80 font-light" style={{ fontFamily: "'Cormorant Garamond', serif" }}>no reviews yet, be the first one to share your experience</p>
            </div>
          ) : (
            <div className="space-y-12">
              {reviews.map(review => (
                <div key={review.id} className="border-b border-black/10 pb-12 last:border-0 group">
                  <div className="flex justify-between items-start mb-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-neutral-100 overflow-hidden flex items-center justify-center text-black font-light text-xl shrink-0" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                        {review.userAvatar ? (
                          <img src={review.userAvatar} alt={review.userName} className="w-full h-full object-cover" />
                        ) : (
                          review.userName.charAt(0).toUpperCase()
                        )}
                      </div>
                      <div className="flex flex-col">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="font-medium text-black uppercase tracking-wider text-sm">{review.userName}</span>
                          <span className="flex items-center gap-1 text-[9px] text-black/60 uppercase tracking-[0.2em] border border-black/10 px-2 py-0.5 rounded-none">
                            <ShieldCheck className="w-2.5 h-2.5" /> Verified
                          </span>
                        </div>
                        <span className="text-[10px] text-black/40 uppercase tracking-widest">
                          {review.createdAt?.toDate ? review.createdAt.toDate().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : 'Recently'}
                        </span>
                      </div>
                    </div>
                    
                    {user && user.uid === review.userId && (
                      <button 
                        onClick={() => handleDeleteReview(review)}
                        className="text-black/30 hover:text-[#4a0000] p-2 transition-colors"
                        title="Delete Review"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  <div className="flex gap-1.5 mb-5">
                    {[1, 2, 3, 4, 5].map(star => (
                      <Star 
                        key={star} 
                        className={`w-3.5 h-3.5 ${star <= review.rating ? 'fill-black stroke-black' : 'fill-transparent stroke-gray-300'}`} 
                      />
                    ))}
                  </div>

                  {review.comment && (
                    <p className="text-lg text-black/90 leading-relaxed font-light mb-6" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                      "{review.comment}"
                    </p>
                  )}

                  {review.imageUrls && review.imageUrls.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {review.imageUrls.map((url, idx) => (
                        <div 
                          key={idx} 
                          onClick={() => setSelectedImage(url)}
                          className="w-20 h-24 overflow-hidden cursor-pointer bg-neutral-100 hover:opacity-80 transition-opacity"
                        >
                          <img src={url} alt={`Review photo ${idx}`} className="w-full h-full object-cover" />
                        </div>
                      ))}
                    </div>
                  )}
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
  );
}
