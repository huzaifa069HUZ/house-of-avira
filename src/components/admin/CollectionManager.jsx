'use client';

import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { Plus, Trash2, Edit2, Loader2, Save, X, Search, CheckSquare, Square, Link as LinkIcon, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { fetchCollections, createCollection, updateCollection, deleteCollection } from '@/app/actions/collectionActions';

export default function CollectionManager() {
  const [collections, setCollections] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Form State
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedProductIds, setSelectedProductIds] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch collections securely via Server Action
      const cols = await fetchCollections();
      setCollections(cols);
    } catch (error) {
      console.error("Error fetching collections:", error);
    }

    try {
      // Fetch products for selection
      const prodQ = query(collection(db, 'products'), orderBy('createdAt', 'desc'));
      const prodSnap = await getDocs(prodQ);
      setAllProducts(prodSnap.docs.map(d => ({ id: d.id, ...d.data() })));
    } catch (error) {
      console.error("Error fetching products:", error);
    }
    
    setLoading(false);
  };

  const generateSlug = (text) => {
    return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || selectedProductIds.length === 0) {
      alert("Please enter a title and select at least one product.");
      return;
    }

    setSaving(true);
    const slug = generateSlug(title);

    try {
      const collectionData = {
        title,
        slug,
        description,
        productIds: selectedProductIds,
      };

      if (isEditing && currentId) {
        await updateCollection(currentId, collectionData);
      } else {
        await createCollection(collectionData);
      }

      // Reset and refetch
      setIsEditing(false);
      setCurrentId(null);
      setTitle('');
      setDescription('');
      setSelectedProductIds([]);
      setSearchQuery('');
      await fetchData();
    } catch (error) {
      console.error("Error saving collection:", error);
      alert("Failed to save collection. Check server logs.");
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (col) => {
    setCurrentId(col.id);
    setTitle(col.title);
    setDescription(col.description || '');
    setSelectedProductIds(col.productIds || []);
    setIsEditing(true);
  };

  const handleDelete = async (id, title) => {
    if (window.confirm(`Are you sure you want to delete collection "${title}"?`)) {
      try {
        await deleteCollection(id);
        setCollections(prev => prev.filter(c => c.id !== id));
      } catch (error) {
        console.error("Error deleting collection:", error);
        alert("Failed to delete collection.");
      }
    }
  };

  const toggleProduct = (productId) => {
    setSelectedProductIds(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const filteredProducts = allProducts.filter(p => {
    const nameMatch = (p.name || '').toLowerCase().includes(searchQuery.toLowerCase());
    const categoryMatch = (p.category || '').toLowerCase().includes(searchQuery.toLowerCase());
    return nameMatch || categoryMatch;
  });

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32">
        <Loader2 className="w-8 h-8 animate-spin text-[#0071e3] mb-4" />
        <p className="text-sm text-[#86868b]">Loading collections...</p>
      </div>
    );
  }

  if (isEditing) {
    return (
      <div className="bg-white rounded-2xl shadow-[0_2px_10px_rgba(0,0,0,0.04)] border border-[#d2d2d7]/50 p-6">
        <div className="flex items-center justify-between border-b border-[#d2d2d7]/50 pb-4 mb-6">
          <h2 className="text-xl font-semibold text-black">
            {currentId ? 'Edit Collection' : 'Create New Collection'}
          </h2>
          <button 
            onClick={() => { setIsEditing(false); setCurrentId(null); setTitle(''); setDescription(''); setSelectedProductIds([]); }}
            className="p-2 text-[#86868b] hover:bg-[#F5F5F7] rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-black mb-2">Collection Title</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Insta Reel Drop 1"
              className="w-full px-4 py-2 border border-[#d2d2d7] rounded-lg focus:ring-[#0071e3] focus:border-[#0071e3]"
            />
            <p className="text-xs text-[#86868b] mt-1">
              Link will be: /collection/{title ? generateSlug(title) : '...'}
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-black mb-2">Description (Optional)</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Short description for this collection page"
              className="w-full px-4 py-2 border border-[#d2d2d7] rounded-lg focus:ring-[#0071e3] focus:border-[#0071e3] min-h-[80px]"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-black">Select Products ({selectedProductIds.length} selected)</label>
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#86868b]" />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 pr-3 py-1.5 text-sm border border-[#d2d2d7] rounded-lg focus:ring-[#0071e3] focus:border-[#0071e3]"
                />
              </div>
            </div>

            <div className="border border-[#d2d2d7] rounded-lg h-[300px] overflow-y-auto bg-[#F5F5F7]/30 p-2 space-y-1">
              {filteredProducts.map(product => {
                const isSelected = selectedProductIds.includes(product.id);
                return (
                  <div 
                    key={product.id}
                    onClick={() => toggleProduct(product.id)}
                    className={`flex items-center gap-4 p-3 rounded-lg cursor-pointer transition-colors border ${isSelected ? 'bg-white border-[#0071e3] shadow-sm' : 'bg-transparent border-transparent hover:bg-white hover:border-[#d2d2d7]'}`}
                  >
                    {isSelected ? <CheckSquare className="w-5 h-5 text-[#0071e3]" /> : <Square className="w-5 h-5 text-[#86868b]" />}
                    <img src={product.imageUrl} alt={product.name} className="w-10 h-10 object-cover rounded border border-[#d2d2d7]/50" />
                    <div className="flex flex-col flex-1">
                      <span className="text-sm font-medium text-black line-clamp-1">{product.name}</span>
                      <span className="text-xs text-[#86868b]">₹{product.price} • {product.category}</span>
                    </div>
                  </div>
                );
              })}
              {filteredProducts.length === 0 && (
                <p className="text-sm text-[#86868b] text-center mt-8">No products found.</p>
              )}
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-[#d2d2d7]/50">
            <button
              type="submit"
              disabled={saving || !title.trim() || selectedProductIds.length === 0}
              className="px-6 py-2 bg-black text-white rounded-full text-sm font-medium tracking-wide hover:bg-gray-900 transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              {saving && <Loader2 className="w-4 h-4 animate-spin" />}
              {currentId ? 'Save Changes' : 'Create Collection'}
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-[0_2px_10px_rgba(0,0,0,0.04)] border border-[#d2d2d7]/50 overflow-hidden">
      <div className="p-6 border-b border-[#d2d2d7]/50 flex items-center justify-between bg-[#F5F5F7]/30">
        <div>
          <h2 className="text-xl font-semibold text-black">Collections</h2>
          <p className="text-sm text-[#86868b] mt-1">Create custom product landing pages for social media.</p>
        </div>
        <button
          onClick={() => { setIsEditing(true); setCurrentId(null); setTitle(''); setDescription(''); setSelectedProductIds([]); }}
          className="px-4 py-2 bg-black text-white rounded-full text-sm font-medium flex items-center gap-2 hover:bg-gray-900 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Create Collection
        </button>
      </div>

      {collections.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20">
          <LinkIcon className="w-12 h-12 text-[#86868b] mb-4 opacity-50" />
          <h3 className="text-lg font-semibold text-black mb-1">No collections yet</h3>
          <p className="text-sm text-[#86868b]">Create a collection to group products together.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-[#F5F5F7] text-[#86868b] text-[11px] uppercase tracking-wider font-semibold border-b border-[#d2d2d7]">
              <tr>
                <th className="px-6 py-4">Title</th>
                <th className="px-6 py-4">Link</th>
                <th className="px-6 py-4">Products</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#d2d2d7]/50">
              {collections.map(col => (
                <tr key={col.id} className="hover:bg-[#F5F5F7]/50 transition-colors group">
                  <td className="px-6 py-4 font-medium text-black">
                    {col.title}
                  </td>
                  <td className="px-6 py-4">
                    <a 
                      href={`/collection/${col.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#0071e3] hover:underline flex items-center gap-1"
                    >
                      /collection/{col.slug}
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </td>
                  <td className="px-6 py-4 text-[#86868b]">
                    {col.productIds?.length || 0} items
                  </td>
                  <td className="px-6 py-4 text-right flex justify-end gap-2">
                    <button 
                      onClick={() => handleEdit(col)}
                      className="p-2 text-[#0071e3] hover:bg-[#0071e3]/10 rounded-full transition-colors opacity-100 sm:opacity-0 sm:group-hover:opacity-100 focus:opacity-100"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => handleDelete(col.id, col.title)}
                      className="p-2 text-[#ff3b30] hover:bg-[#ff3b30]/10 rounded-full transition-colors opacity-100 sm:opacity-0 sm:group-hover:opacity-100 focus:opacity-100"
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
