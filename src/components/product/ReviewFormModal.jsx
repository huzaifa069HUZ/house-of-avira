'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Star, UploadCloud, Loader2 } from 'lucide-react';
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useAuthStore } from '@/store/authStore';
import { uploadReviewImagesToCloudinary } from '@/app/actions/uploadActions';

export default function ReviewFormModal({ isOpen, onClose, productId, onReviewSubmitted }) {
  const { user } = useAuthStore();
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [images, setImages] = useState([]); // Array of File objects
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  
  const fileInputRef = useRef(null);

  const MAX_IMAGES = 5;
  const MAX_SIZE_MB = 15;

  const handleImageChange = (e) => {
    setError('');
    const files = Array.from(e.target.files);
    
    if (images.length + files.length > MAX_IMAGES) {
      setError(`You can only upload a maximum of ${MAX_IMAGES} images.`);
      return;
    }

    const validFiles = files.filter(file => {
      if (file.size > MAX_SIZE_MB * 1024 * 1024) {
        setError(`Each image must be under ${MAX_SIZE_MB}MB.`);
        return false;
      }
      return true;
    });

    setImages(prev => [...prev, ...validFiles]);
    // reset input so the same file can be selected again if removed
    e.target.value = null; 
  };

  const removeImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0) {
      setError('Please provide a rating.');
      return;
    }
    if (!comment.trim() && images.length === 0) {
      setError('Please provide a comment or an image.');
      return;
    }

    setUploading(true);
    setError('');

    try {
      let uploadedImageUrls = [];

      // Upload images using Cloudinary via Server Action
      if (images.length > 0) {
        const formData = new FormData();
        images.forEach(img => formData.append('images', img));
        const uploadResult = await uploadReviewImagesToCloudinary(formData);
        
        if (!uploadResult.success) {
          throw new Error(uploadResult.error || 'Failed to upload images to Cloudinary');
        }
        uploadedImageUrls = uploadResult.urls;
      }

      // Save to Firestore
      const newReview = {
        productId,
        userId: user.uid,
        userName: user.displayName || 'Anonymous User',
        userAvatar: user.photoURL || null,
        rating,
        comment,
        imageUrls: uploadedImageUrls,
        createdAt: serverTimestamp(),
        likes: 0
      };

      const docRef = await addDoc(collection(db, 'reviews'), newReview);
      
      onReviewSubmitted({ id: docRef.id, ...newReview, createdAt: new Date() });
      
      // Reset form
      setRating(0);
      setComment('');
      setImages([]);
      onClose();
    } catch (err) {
      console.error(err);
      setError('Failed to submit review. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9999] flex items-center justify-center p-4"
            onClick={onClose}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-[2rem] w-full max-w-lg overflow-hidden shadow-2xl relative"
            >
              {/* Header */}
              <div className="flex justify-between items-center p-6 border-b border-gray-100">
                <h3 className="text-xl font-bold font-serif text-black">Write a Review</h3>
                <button onClick={onClose} className="p-2 bg-gray-50 rounded-full hover:bg-gray-100 transition-colors">
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                
                {/* Error */}
                {error && (
                  <div className="p-3 bg-red-50 text-red-600 text-sm rounded-xl font-medium border border-red-100">
                    {error}
                  </div>
                )}

                {/* Rating */}
                <div className="flex flex-col items-center gap-2">
                  <span className="text-xs uppercase tracking-widest font-bold text-gray-400">Overall Rating</span>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        onClick={() => setRating(star)}
                        className="transition-transform hover:scale-110 focus:outline-none"
                      >
                        <Star 
                          className={`w-8 h-8 transition-colors duration-200 ${
                            (hoverRating || rating) >= star ? 'fill-black stroke-black' : 'fill-transparent stroke-gray-300'
                          }`} 
                        />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Comment Textarea */}
                <div>
                  <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Share your thoughts about this product..."
                    className="w-full h-32 p-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:ring-2 focus:ring-black/5 focus:border-gray-400 transition-all resize-none text-sm placeholder:text-gray-400 font-sans"
                  />
                </div>

                {/* Images Upload */}
                <div>
                  <div className="flex justify-between items-end mb-2">
                    <span className="text-xs uppercase tracking-widest font-bold text-gray-400">Add Photos</span>
                    <span className="text-[10px] text-gray-400 font-medium">{images.length}/{MAX_IMAGES} uploaded</span>
                  </div>
                  
                  {images.length > 0 && (
                    <div className="flex flex-wrap gap-3 mb-4">
                      {images.map((img, idx) => (
                        <div key={idx} className="relative w-20 h-20 rounded-xl overflow-hidden border border-gray-200 group">
                          <img src={URL.createObjectURL(img)} alt={`preview ${idx}`} className="w-full h-full object-cover" />
                          <button
                            type="button"
                            onClick={() => removeImage(idx)}
                            className="absolute top-1 right-1 bg-black/60 p-1 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {images.length < MAX_IMAGES && (
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full py-4 border-2 border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center gap-2 hover:border-gray-400 hover:bg-gray-50 transition-colors group"
                    >
                      <UploadCloud className="w-6 h-6 text-gray-400 group-hover:text-black transition-colors" />
                      <span className="text-xs font-semibold text-gray-500 group-hover:text-black">Click to upload images</span>
                      <span className="text-[10px] text-gray-400 font-medium">Max {MAX_SIZE_MB}MB per photo</span>
                    </button>
                  )}
                  <input 
                    type="file" 
                    accept="image/*" 
                    multiple 
                    className="hidden" 
                    ref={fileInputRef}
                    onChange={handleImageChange}
                  />
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={uploading}
                  className="w-full bg-black text-white py-4 rounded-xl font-bold tracking-widest uppercase text-xs hover:bg-gray-800 transition-all flex items-center justify-center gap-2 disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  {uploading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    'Submit Review'
                  )}
                </button>
              </form>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
