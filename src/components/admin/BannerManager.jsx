'use client';

import { useState, useEffect } from 'react';
import { collection, addDoc, getDocs, deleteDoc, doc, query, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { uploadImagesToCloudinary } from '@/app/actions/uploadActions';
import { Plus, Trash2, Image as ImageIcon, Link as LinkIcon, X, Loader2 } from 'lucide-react';

export default function BannerManager() {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  
  const [newBanner, setNewBanner] = useState({
    mobileImage: '',
    link: '/catalogue'
  });

  const fetchBanners = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, 'mobile_banners'), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      const bannersData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-black">Manage Mobile Banners</h2>
        <button 
          onClick={() => {
            setIsAdding(!isAdding);
            setNewBanner({ mobileImage: '', link: '/catalogue' });
            setSelectedFile(null);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-black text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors"
        >
          {isAdding ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          {isAdding ? 'Cancel' : 'Add New Banner'}
        </button>
      </div>

      {isAdding && (
        <form onSubmit={handleAddBanner} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Banner Image</label>
              
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
                    className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-black file:text-white hover:file:bg-gray-800 file:cursor-pointer cursor-pointer"
                  />
                  {selectedFile && (
                    <p className="text-xs text-green-600 mt-2 font-medium">Selected: {selectedFile.name}</p>
                  )}
                </div>
                
                <div className="flex items-center gap-4">
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
                    className={`w-full pl-9 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-black outline-none transition-colors ${selectedFile ? 'bg-gray-50 border-gray-200 text-gray-400 cursor-not-allowed' : 'border-gray-300 bg-white'}`}
                    placeholder="https://example.com/image.png"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Link Destination</label>
              <div className="relative">
                <LinkIcon className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input 
                  type="text" 
                  value={newBanner.link}
                  onChange={(e) => setNewBanner({...newBanner, link: e.target.value})}
                  className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black outline-none"
                  placeholder="/category/women"
                />
              </div>
              <p className="text-xs text-gray-500 mt-2">Where users go when they tap the "Shop Now" button.</p>
            </div>
          </div>
          
          <div className="mt-8 flex justify-end">
            <button 
              type="submit" 
              disabled={uploadingImage || (!selectedFile && !newBanner.mobileImage)}
              className="flex items-center gap-2 px-6 py-2.5 bg-[#0071e3] text-white text-sm font-medium rounded-lg hover:bg-[#005bb5] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {uploadingImage ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Uploading & Saving...
                </>
              ) : (
                'Save Banner'
              )}
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-gray-400" /></div>
      ) : banners.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
          <ImageIcon className="w-12 h-12 mx-auto text-gray-300 mb-3" />
          <h3 className="text-lg font-medium text-gray-900">No mobile banners yet</h3>
          <p className="text-gray-500 mt-1">Add a mobile banner to display it on the homepage for mobile users.</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 border-b border-gray-200 text-gray-600">
              <tr>
                <th className="px-6 py-3 font-medium w-32">Preview</th>
                <th className="px-6 py-3 font-medium">Link</th>
                <th className="px-6 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {banners.map(banner => (
                <tr key={banner.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <img src={banner.mobileImage} alt="Banner Preview" className="h-24 w-16 object-cover rounded-md border border-gray-200 shadow-sm" />
                  </td>
                  <td className="px-6 py-4 text-gray-600 font-mono text-xs">{banner.link || 'N/A'}</td>
                  <td className="px-6 py-4 text-right">
                    <button 
                      onClick={() => handleDelete(banner.id)}
                      className="text-gray-400 hover:text-red-500 transition-colors p-2 bg-white rounded-md border border-transparent hover:border-red-100 hover:bg-red-50"
                      title="Delete banner"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
