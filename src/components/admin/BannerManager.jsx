'use client';

import { useState, useEffect } from 'react';
import { collection, addDoc, getDocs, deleteDoc, doc, writeBatch } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { uploadImagesToCloudinary } from '@/app/actions/uploadActions';
import { Plus, Trash2, Image as ImageIcon, Link as LinkIcon, X, Loader2, GripVertical } from 'lucide-react';
import Image from 'next/image';

export default function BannerManager() {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [savingOrder, setSavingOrder] = useState(false);
  
  const [newBanner, setNewBanner] = useState({
    mobileImage: '',
    link: '/catalogue'
  });

  const fetchBanners = async () => {
    setLoading(true);
    try {
      const querySnapshot = await getDocs(collection(db, 'mobile_banners'));
      let bannersData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      // Sort by order field if it exists, otherwise by createdAt desc
      bannersData.sort((a, b) => {
        if (a.order !== undefined && b.order !== undefined) {
          return a.order - b.order;
        }
        const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return dateB - dateA;
      });
      
      setBanners(bannersData);
    } catch (error) {
      console.error('Error fetching mobile banners:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  const handleAddBanner = async (e) => {
    e.preventDefault();
    if (!newBanner.mobileImage && !selectedFile) return;

    setUploadingImage(true);
    let imageUrl = newBanner.mobileImage;

    try {
      if (selectedFile) {
        const formData = new FormData();
        formData.append('images', selectedFile);
        const uploadResult = await uploadImagesToCloudinary(formData);
        
        if (uploadResult.success && uploadResult.urls.length > 0) {
          imageUrl = uploadResult.urls[0];
        } else {
          throw new Error(uploadResult.error || 'Image upload failed');
        }
      }

      await addDoc(collection(db, 'mobile_banners'), {
        mobileImage: imageUrl,
        link: newBanner.link,
        order: banners.length,
        createdAt: new Date().toISOString()
      });
      
      setIsAdding(false);
      setNewBanner({ mobileImage: '', link: '/catalogue' });
      setSelectedFile(null);
      fetchBanners();
    } catch (error) {
      console.error('Error adding mobile banner:', error);
      alert('Failed to add banner: ' + error.message);
    } finally {
      setUploadingImage(false);
    }
  };

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this mobile banner?')) {
      try {
        await deleteDoc(doc(db, 'mobile_banners', id));
        fetchBanners();
      } catch (error) {
        console.error('Error deleting mobile banner:', error);
      }
    }
  };

  // --- Drag and Drop Logic ---
  const [draggedIndex, setDraggedIndex] = useState(null);

  const handleDragStart = (e, index) => {
    setDraggedIndex(index);
    // Needed for Firefox
    if (e.dataTransfer) {
      e.dataTransfer.effectAllowed = 'move';
      e.dataTransfer.setData('text/plain', index.toString());
    }
    // Timeout to apply styling after drag starts
    setTimeout(() => {
      e.target.classList.add('opacity-40');
    }, 0);
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    if (e.dataTransfer) e.dataTransfer.dropEffect = 'move';
    
    if (draggedIndex === null || draggedIndex === index) return;

    const newBanners = [...banners];
    const draggedItem = newBanners[draggedIndex];
    
    // Swap items
    newBanners.splice(draggedIndex, 1);
    newBanners.splice(index, 0, draggedItem);
    
    setDraggedIndex(index);
    setBanners(newBanners);
  };

  const handleDragEnd = async (e) => {
    e.target.classList.remove('opacity-40');
    setDraggedIndex(null);
    
    // Save new order to Firebase
    setSavingOrder(true);
    try {
      const batch = writeBatch(db);
      banners.forEach((banner, index) => {
        const docRef = doc(db, 'mobile_banners', banner.id);
        batch.update(docRef, { order: index });
      });
      await batch.commit();
    } catch (error) {
      console.error("Error updating order:", error);
      alert("Failed to save new order.");
    } finally {
      setSavingOrder(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-20">
      <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-[0_2px_10px_rgb(0,0,0,0.04)] border border-black/5">
        <div>
          <h2 className="text-2xl font-perandory tracking-tight text-[#8A001A]">Mobile Hero Banners</h2>
          <p className="text-sm text-gray-500 mt-1 font-dm-sans">Manage and reorder the images shown on the mobile homepage.</p>
        </div>
        <button 
          onClick={() => {
            setIsAdding(!isAdding);
            setNewBanner({ mobileImage: '', link: '/catalogue' });
            setSelectedFile(null);
          }}
          className="flex items-center gap-2 px-5 py-2.5 bg-black text-white text-[11px] font-bold tracking-[0.1em] uppercase rounded-lg hover:bg-[#8A001A] transition-all shadow-md active:scale-95"
        >
          {isAdding ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          {isAdding ? 'Cancel' : 'Add Banner'}
        </button>
      </div>

      {isAdding && (
        <form onSubmit={handleAddBanner} className="bg-white p-6 rounded-2xl border border-black/5 shadow-[0_2px_10px_rgb(0,0,0,0.04)] font-dm-sans">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-3">Banner Image</label>
              
              <div className="space-y-4">
                {/* File Upload */}
                <div>
                  <input 
                    type="file" 
                    accept="image/*"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        setSelectedFile(e.target.files[0]);
                        setNewBanner({...newBanner, mobileImage: ''});
                      }
                    }}
                    className="w-full text-sm text-gray-500 file:mr-4 file:py-2.5 file:px-6 file:rounded-lg file:border-0 file:text-[11px] file:font-bold file:tracking-wider file:uppercase file:bg-black file:text-white hover:file:bg-[#8A001A] hover:file:shadow-md file:cursor-pointer cursor-pointer file:transition-all"
                  />
                  {selectedFile && (
                    <p className="text-xs text-green-600 mt-2 font-medium">Selected: {selectedFile.name}</p>
                  )}
                </div>
                
                <div className="flex items-center gap-4 py-2">
                  <div className="h-px bg-gray-200 flex-1"></div>
                  <span className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">OR PASTE URL</span>
                  <div className="h-px bg-gray-200 flex-1"></div>
                </div>

                {/* URL Input */}
                <div className="relative">
                  <ImageIcon className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input 
                    type="text" 
                    value={newBanner.mobileImage}
                    onChange={(e) => {
                      setNewBanner({...newBanner, mobileImage: e.target.value});
                      setSelectedFile(null);
                    }}
                    disabled={!!selectedFile}
                    className={`w-full pl-9 pr-3 py-3 border rounded-lg focus:ring-1 focus:ring-black outline-none transition-colors text-sm ${selectedFile ? 'bg-gray-50 border-gray-200 text-gray-400 cursor-not-allowed' : 'border-gray-200 bg-white'}`}
                    placeholder="https://example.com/image.png"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-3">Link Destination</label>
              <div className="relative">
                <LinkIcon className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input 
                  type="text" 
                  value={newBanner.link}
                  onChange={(e) => setNewBanner({...newBanner, link: e.target.value})}
                  className="w-full pl-9 pr-3 py-3 border border-gray-200 rounded-lg focus:ring-1 focus:ring-black outline-none text-sm"
                  placeholder="/category/women"
                />
              </div>
              <p className="text-xs text-gray-500 mt-3 leading-relaxed">Where users go when they tap this banner on the homepage.</p>
            </div>
          </div>
          
          <div className="mt-8 flex justify-end">
            <button 
              type="submit" 
              disabled={uploadingImage || (!selectedFile && !newBanner.mobileImage)}
              className="flex items-center gap-2 px-8 py-3 bg-[#8A001A] text-white text-[11px] tracking-widest font-bold uppercase rounded-lg hover:bg-black transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
            >
              {uploadingImage ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Uploading...
                </>
              ) : (
                'Save Banner'
              )}
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <div className="flex justify-center py-24"><Loader2 className="w-10 h-10 animate-spin text-black/20" /></div>
      ) : banners.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-black/5 shadow-sm">
          <ImageIcon className="w-16 h-16 mx-auto text-gray-200 mb-4" />
          <h3 className="text-xl font-perandory text-black">No mobile banners yet</h3>
          <p className="text-gray-500 mt-2 font-dm-sans text-sm">Add a mobile banner above to display it on the homepage.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-[0_2px_10px_rgb(0,0,0,0.04)] border border-black/5 overflow-hidden font-dm-sans">
          {/* Header */}
          <div className="grid grid-cols-[auto_100px_1fr_auto] gap-8 p-5 border-b border-black/5 bg-gray-50/50 text-[10px] font-bold tracking-widest text-gray-500 uppercase">
            <div className="w-12 text-center">Order</div>
            <div className="text-center">Preview</div>
            <div>Link</div>
            <div className="w-20 text-center">Actions</div>
          </div>
          
          {/* Draggable List */}
          <div className="divide-y divide-black/5 relative">
            {savingOrder && (
               <div className="absolute inset-0 bg-white/40 backdrop-blur-[1px] z-10 flex items-center justify-center">
                 <div className="bg-white px-6 py-3 rounded-full shadow-lg border border-black/5 flex items-center gap-3">
                   <Loader2 className="w-5 h-5 animate-spin text-[#8A001A]" />
                   <span className="text-xs font-bold tracking-widest uppercase">Saving Order...</span>
                 </div>
               </div>
            )}
            
            {banners.map((banner, index) => (
              <div 
                key={banner.id}
                draggable
                onDragStart={(e) => handleDragStart(e, index)}
                onDragOver={(e) => handleDragOver(e, index)}
                onDragEnd={handleDragEnd}
                className={`grid grid-cols-[auto_100px_1fr_auto] gap-8 p-5 items-center transition-all bg-white hover:bg-gray-50 cursor-move ${draggedIndex === index ? 'shadow-inner bg-gray-50/80' : ''}`}
                title="Drag to reorder"
              >
                <div className="w-12 flex flex-col items-center justify-center text-gray-300 hover:text-black transition-colors">
                  <GripVertical className="w-6 h-6 mb-1" />
                  <span className="text-[10px] font-bold text-gray-500">#{index + 1}</span>
                </div>
                
                <div className="w-[100px] h-[140px] relative rounded-xl overflow-hidden shadow-sm border border-black/10 bg-gray-100 flex-shrink-0 group">
                  <Image 
                    src={banner.mobileImage} 
                    alt="Banner preview" 
                    fill 
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="100px"
                    unoptimized
                  />
                </div>
                
                <div className="font-medium text-sm text-gray-600 truncate bg-gray-50 px-4 py-2 rounded-lg border border-black/5 w-fit max-w-full">
                  {banner.link || '/'}
                </div>
                
                <div className="w-20 flex justify-center">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(banner.id);
                    }}
                    className="p-3 text-gray-400 hover:bg-red-50 hover:text-red-500 rounded-xl transition-all hover:shadow-sm"
                    title="Delete Banner"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
