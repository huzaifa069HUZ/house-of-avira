'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, ThumbsUp, Trash2, MessageSquare, ShieldCheck, X } from 'lucide-react';
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

  const handleLike = async (reviewId) => {
    if (!user) {
      alert("Please login to like reviews.");
      return;
    }
    try {
      await updateDoc(doc(db, 'reviews', reviewId), {
        likes: increment(1)
      });
      setReviews(prev => prev.map(r => r.id === reviewId ? { ...r, likes: (r.likes || 0) + 1 } : r));
    } catch (error) {
      console.error("Error liking review:", error);
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
        <div className="w-full lg:w-[35%] shrink-0">
          <h2 className="text-3xl font-serif text-black mb-6">Customer Reviews</h2>
          
          <div className="flex items-end gap-4 mb-8">
            <h3 className="text-6xl font-medium text-black leading-none">{avgRating}</h3>
            <div className="flex flex-col pb-1">
              <div className="flex gap-1 mb-1">
                {[1, 2, 3, 4, 5].map(star => (
                  <Star 
                    key={star} 
                    className={`w-5 h-5 ${star <= Math.round(avgRating) ? 'fill-black stroke-black' : 'fill-transparent stroke-gray-300'}`} 
                  />
                ))}
              </div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest">Based on {reviews.length} reviews</p>
            </div>
          </div>

          <div className="space-y-3 mb-10">
            {[5, 4, 3, 2, 1].map(star => {
              const percentage = reviews.length > 0 ? (ratingCounts[star] / reviews.length) * 100 : 0;
              return (
                <div key={star} className="flex items-center gap-4 text-sm font-medium text-gray-600">
                  <div className="flex items-center gap-1 w-12">
                    {star} <Star className="w-3.5 h-3.5 fill-gray-400 stroke-gray-400" />
                  </div>
                  <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-black rounded-full" style={{ width: `${percentage}%` }}></div>
                  </div>
                  <div className="w-8 text-right text-xs text-gray-400">{ratingCounts[star]}</div>
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
            className="w-full bg-white border-2 border-black text-black py-4 rounded-xl font-bold tracking-widest uppercase text-xs hover:bg-black hover:text-white transition-all shadow-sm"
          >
            Write a Review
          </button>
        </div>

        {/* Right: Review List */}
        <div className="flex-1">
          {loading ? (
            <div className="flex justify-center items-center h-48">
              <div className="w-6 h-6 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : reviews.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-16 bg-gray-50 rounded-3xl border border-gray-100">
              <MessageSquare className="w-12 h-12 text-gray-300 mb-4" />
              <p className="text-sm font-bold text-gray-900 mb-1">No reviews yet</p>
              <p className="text-xs text-gray-500 font-medium">Be the first to share your thoughts!</p>
            </div>
          ) : (
            <div className="space-y-8">
              {reviews.map(review => (
                <div key={review.id} className="border-b border-gray-100 pb-8 last:border-0 group">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden flex items-center justify-center text-gray-500 font-bold font-serif shrink-0">
                        {review.userAvatar ? (
                          <img src={review.userAvatar} alt={review.userName} className="w-full h-full object-cover" />
                        ) : (
                          review.userName.charAt(0).toUpperCase()
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-black">{review.userName}</span>
                          <span className="flex items-center gap-1 text-[10px] text-[#00a86b] font-bold tracking-widest uppercase bg-[#00a86b]/10 px-2 py-0.5 rounded-full">
                            <ShieldCheck className="w-3 h-3" /> Verified
                          </span>
                        </div>
                        <span className="text-xs text-gray-400 font-medium">
                          {review.createdAt?.toDate ? review.createdAt.toDate().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : 'Recently'}
                        </span>
                      </div>
                    </div>
                    
                    {user && user.uid === review.userId && (
                      <button 
                        onClick={() => handleDeleteReview(review)}
                        className="text-gray-400 hover:text-red-500 p-2 opacity-0 lg:group-hover:opacity-100 transition-opacity"
                        title="Delete Review"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  <div className="flex gap-1 mb-3">
                    {[1, 2, 3, 4, 5].map(star => (
                      <Star 
                        key={star} 
                        className={`w-4 h-4 ${star <= review.rating ? 'fill-black stroke-black' : 'fill-transparent stroke-gray-300'}`} 
                      />
                    ))}
                  </div>

                  {review.comment && (
                    <p className="text-sm text-gray-700 leading-relaxed font-light mb-4">
                      {review.comment}
                    </p>
                  )}

                  {review.imageUrls && review.imageUrls.length > 0 && (
                    <div className="flex flex-wrap gap-3 mb-4">
                      {review.imageUrls.map((url, idx) => (
                        <div 
                          key={idx} 
                          onClick={() => setSelectedImage(url)}
                          className="w-24 h-24 rounded-xl overflow-hidden cursor-pointer border border-gray-100 hover:border-gray-300 transition-colors shadow-sm hover:shadow-md"
                        >
                          <img src={url} alt={`Review photo ${idx}`} className="w-full h-full object-cover" />
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="flex items-center gap-4">
                    <button 
                      onClick={() => handleLike(review.id)}
                      className="flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-black transition-colors"
                    >
                      <ThumbsUp className="w-3.5 h-3.5" /> Helpful {review.likes > 0 && `(${review.likes})`}
                    </button>
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
  );
}
