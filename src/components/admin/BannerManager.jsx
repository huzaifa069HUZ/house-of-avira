'use client';

import { useState, useEffect } from 'react';
import { collection, addDoc, getDocs, deleteDoc, doc, query, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Plus, Trash2, Image as ImageIcon, Link as LinkIcon, X, Loader2 } from 'lucide-react';

export default function BannerManager() {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
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
    if (!newBanner.mobileImage) return;

    try {
      await addDoc(collection(db, 'mobile_banners'), {
        ...newBanner,
        createdAt: new Date().toISOString()
      });
      setIsAdding(false);
      setNewBanner({ mobileImage: '', link: '/catalogue' });
      fetchBanners();
    } catch (error) {
      console.error('Error adding mobile banner:', error);
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
          onClick={() => setIsAdding(!isAdding)}
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
              <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
              <div className="relative">
                <ImageIcon className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input 
                  type="text" 
                  required
                  value={newBanner.mobileImage}
                  onChange={(e) => setNewBanner({...newBanner, mobileImage: e.target.value})}
                  className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black outline-none"
                  placeholder="https://example.com/image.png or /banner.png"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Link (Optional)</label>
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
            </div>
          </div>
          <div className="mt-6 flex justify-end">
            <button type="submit" className="px-6 py-2 bg-[#0071e3] text-white text-sm font-medium rounded-lg hover:bg-[#005bb5] transition-colors">
              Save Banner
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
                    <img src={banner.mobileImage} alt="Banner Preview" className="h-20 w-12 object-cover rounded border border-gray-200" />
                  </td>
                  <td className="px-6 py-4 text-gray-600">{banner.link || 'N/A'}</td>
                  <td className="px-6 py-4 text-right">
                    <button 
                      onClick={() => handleDelete(banner.id)}
                      className="text-gray-400 hover:text-red-500 transition-colors p-2"
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
