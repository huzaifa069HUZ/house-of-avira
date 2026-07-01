'use client';

import { useState, useRef, useEffect } from 'react';
import { uploadImagesToCloudinary, deleteImageFromCloudinary } from '@/app/actions/uploadActions';
import { db } from '@/lib/firebase';
import { collection, addDoc, doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { generateUniqueSlug } from '@/lib/slugify';
import { UploadCloud, X, Image as ImageIcon, Tag, Loader2, CheckCircle2, Plus, Trash2 } from 'lucide-react';

const CATEGORY_DATA = [
  { 
    title: "Women", 
    children: ["tops", "pants / jeans", "skirts", "dresses", "jackets", "beach wear", "co-ords", "t-shirts", "denim", "activewear", "homewear"]
  },
  {
    title: "Men",
    children: ["tops", "pants/jeans", "jackets"]
  },
  {
    title: "Footwear",
    children: ["heels", "boots", "shoes", "flats"]
  },
  {
    title: "Bags",
    children: ["Handbags", "mini bags", "shoulder Bags"]
  },
  {
    title: "Accessories",
    children: ["phone cases", "hair accessories", "belts", "jewellery", "nails and nail art supplies"]
  },
  {
    title: "Collectibles",
    children: ["Sanrio", "Nagano Characters", "Miffy", "Other Characters", "Blind Boxes"]
  },
  {
    title: "Pets",
    children: ["cats", "dogs"]
  }
];

export default function ProductManager({ initialProduct = null, onSuccess }) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  
  // State for Inputs
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [sections, setSections] = useState(['New Arrivals']);
  const [badge, setBadge] = useState('');
  
  // Categories state
  const [category, setCategory] = useState(CATEGORY_DATA[0].title);
  const [subcategory, setSubcategory] = useState(CATEGORY_DATA[0].children[0] || '');
  const [aesthetic, setAesthetic] = useState('');
  
  // State for interactive tags (Sizes and Colors)
  const [sizes, setSizes] = useState([]);
  const [sizeInput, setSizeInput] = useState('');
  
  const [colors, setColors] = useState([]);

  // State for Inventory & Best Seller
  const [inStock, setInStock] = useState(true);
  const [bestSeller, setBestSeller] = useState(false);

  // State for Images
  const [existingImages, setExistingImages] = useState([]);
  const [files, setFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [primaryIsNew, setPrimaryIsNew] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  // --- Populate Initial Data for Edit Mode ---
  useEffect(() => {
    if (initialProduct) {
      setName(initialProduct.name || '');
      setPrice(initialProduct.price?.toString() || '');
      setDescription(initialProduct.description || '');
      setSections(initialProduct.sections || [initialProduct.section || 'New Arrivals']);
      setBadge(initialProduct.badge || '');
      setCategory(initialProduct.category || CATEGORY_DATA[0].title);
      setSubcategory(initialProduct.subcategory || '');
      setAesthetic(initialProduct.aesthetic || '');
      setSizes(initialProduct.sizes || []);
      setColors(initialProduct.swatches?.map((s, idx) => ({
        id: Date.now() + idx,
        colorName: s.colorName || s.color,
        colorHex: s.color,
        imageUrl: s.imageUrl || '',
        imageFile: null
      })) || []);
      setInStock(initialProduct.inStock !== false);
      setBestSeller(initialProduct.bestSeller || false);
      setExistingImages(initialProduct.images || [initialProduct.imageUrl].filter(Boolean));
    }
  }, [initialProduct]);

  // --- Handlers for Tags ---
  const removeSize = (sizeToRemove) => setSizes(prev => prev.filter(s => s !== sizeToRemove));
  
  const processSizeInput = (value) => {
    const val = value.trim().toUpperCase();
    if (val && !sizes.includes(val)) {
      setSizes(prev => [...prev, val]);
    }
  };

  const handleSizeKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      processSizeInput(sizeInput);
      setSizeInput('');
    }
  };

  const handleSizeBlur = () => {
    if (sizeInput.trim()) {
      processSizeInput(sizeInput);
      setSizeInput('');
    }
  };
  
  const handleSizeChange = (e) => {
    const val = e.target.value;
    if (val.includes(',')) {
      val.split(',').forEach(v => {
        if(v.trim()) processSizeInput(v);
      });
      setSizeInput('');
    } else {
      setSizeInput(val);
    }
  };
  const addColorVariant = () => {
    setColors(prev => [...prev, { id: Date.now(), colorName: '', colorHex: '', imageUrl: '', imageFile: null }]);
  };

  const removeColorVariant = (id) => {
    setColors(prev => prev.filter(c => c.id !== id));
  };

  const updateColorVariant = (id, field, value) => {
    setColors(prev => prev.map(c => c.id === id ? { ...c, [field]: value } : c));
  };


  // --- Handlers for Drag & Drop Files ---
  const handleFilesAdded = (newFiles) => {
    const validFiles = Array.from(newFiles).filter(file => file.type.startsWith('image/'));
    setFiles(prev => [...prev, ...validFiles]);
    
    // Create previews
    const newPreviews = validFiles.map(file => URL.createObjectURL(file));
    setPreviews(prev => [...prev, ...newPreviews]);
  };

  const onDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };
  const onDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };
  const onDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFilesAdded(e.dataTransfer.files);
    }
  };
  const removeFile = (index) => {
    setFiles(files.filter((_, i) => i !== index));
    setPreviews(previews.filter((_, i) => i !== index));
  };

  const removeExistingImage = (index) => {
    setExistingImages(existingImages.filter((_, i) => i !== index));
  };

  const makeExistingPrimary = (index) => {
    setPrimaryIsNew(false);
    if (index === 0) return;
    const newImages = [...existingImages];
    const [selected] = newImages.splice(index, 1);
    newImages.unshift(selected);
    setExistingImages(newImages);
  };

  const makeNewPrimary = (index) => {
    setPrimaryIsNew(true);
    if (index === 0) return;
    const newFiles = [...files];
    const newPreviews = [...previews];
    const [selectedFile] = newFiles.splice(index, 1);
    const [selectedPreview] = newPreviews.splice(index, 1);
    newFiles.unshift(selectedFile);
    newPreviews.unshift(selectedPreview);
    setFiles(newFiles);
    setPreviews(newPreviews);
  };


  // --- Form Submission ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    if (files.length === 0 && existingImages.length === 0) {
      setError('Please select at least one image.');
      setLoading(false);
      return;
    }

    try {
      let finalImageUrls = [...existingImages];

      // 1. Upload New Images to Cloudinary via Server Action
      if (files.length > 0) {
        const formPayload = new FormData();
        files.forEach(file => formPayload.append('images', file));
        
        const uploadResult = await uploadImagesToCloudinary(formPayload);
        
        if (!uploadResult.success) {
          throw new Error(uploadResult.error || 'Failed to upload images');
        }
        
        if (primaryIsNew) {
          finalImageUrls = [uploadResult.urls[0], ...finalImageUrls, ...uploadResult.urls.slice(1)];
        } else {
          finalImageUrls = [...finalImageUrls, ...uploadResult.urls];
        }
      }

      // 2. Format Colors and upload variant images
      const swatchesArray = [];
      for (let i = 0; i < colors.length; i++) {
        const variant = colors[i];
        let vUrl = variant.imageUrl || '';
        if (variant.imageFile) {
           const vForm = new FormData();
           vForm.append('images', variant.imageFile);
           const vRes = await uploadImagesToCloudinary(vForm);
           if(vRes.success) vUrl = vRes.urls[0];
        }
        swatchesArray.push({
          color: (variant.colorHex || variant.colorName).trim(),
          colorName: (variant.colorName || variant.colorHex).trim(),
          imageUrl: vUrl,
          active: i === 0
        });
      }

      // Delete removed images from Cloudinary
      if (initialProduct) {
        const originalImages = initialProduct.images || [initialProduct.imageUrl].filter(Boolean);
        const imagesToDelete = originalImages.filter(img => !existingImages.includes(img));
        for (const imgUrl of imagesToDelete) {
          await deleteImageFromCloudinary(imgUrl).catch(console.error);
        }
      }

      // 3. Save or Update Product in Firestore
      const productData = {
        name,
        price: parseFloat(price),
        description,
        section: sections[0] || '', // backward compatibility
        sections,
        category,
        subcategory,
        aesthetic: sections.includes('Shop Your Look') || sections.includes('Shop your aesthetic') ? aesthetic : '',
        badge,
        imageUrl: finalImageUrls[0] || '', // Primary image
        images: finalImageUrls, // All images
        sizes,
        swatches: swatchesArray,
        extraColors: swatchesArray.length > 3 ? swatchesArray.length - 3 : 0,
        inStock,
        bestSeller,
      };

      if (initialProduct) {
        // Edit Mode — regenerate slug only if name changed
        if (name !== initialProduct.name) {
          productData.slug = await generateUniqueSlug(name, db, initialProduct.id);
        }
        const docRef = doc(db, 'products', initialProduct.id);
        await updateDoc(docRef, productData);
        setSuccess('Product successfully updated!');
      } else {
        // Add Mode — always generate a slug
        productData.slug = await generateUniqueSlug(name, db);
        productData.createdAt = serverTimestamp();
        await addDoc(collection(db, 'products'), productData);
        setSuccess('Product successfully added!');
        
        // Reset form only on add
        setName(''); setPrice(''); setDescription(''); setSections(['New Arrivals']); setBadge('');
        setCategory(CATEGORY_DATA[0].title); setSubcategory(CATEGORY_DATA[0].children[0] || ''); setAesthetic('');
        setSizes([]); setColors([]); setFiles([]); setPreviews([]); setExistingImages([]);
        setInStock(true); setBestSeller(false);
      }

      if (onSuccess) {
        setTimeout(() => onSuccess(), 1000);
      } else {
        setTimeout(() => setSuccess(''), 5000);
      }

    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#F5F5F7] -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-10 min-h-screen">
      
      {/* Sticky Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 sticky top-[73px] z-20 bg-[#F5F5F7]/80 backdrop-blur-xl py-4 border-b border-[#d2d2d7]/50">
        <div>
          <h2 className="text-3xl font-semibold tracking-tight text-black">{initialProduct ? 'Edit Product' : 'Add New Product'}</h2>
          <p className="text-sm text-[#86868b] mt-1">{initialProduct ? 'Update the details of your product.' : 'Fill in the details below to publish a new product.'}</p>
        </div>
        <div className="mt-4 md:mt-0 flex items-center gap-4">
          {onSuccess && <button onClick={onSuccess} className="text-sm font-medium text-[#0071e3] hover:opacity-80 transition-opacity">Cancel</button>}
          <button 
            onClick={handleSubmit}
            disabled={loading} 
            className="bg-[#0071e3] text-white text-sm font-medium px-5 py-2.5 rounded-full shadow-sm hover:bg-[#0077ed] disabled:opacity-50 transition-all flex items-center gap-2"
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            {loading ? 'Saving...' : (initialProduct ? 'Update Product' : 'Save Product')}
          </button>
        </div>
      </div>

      {/* Notifications */}
      {error && <div className="mb-6 p-4 bg-[#fff2f2] border border-[#ff3b30] text-[#ff3b30] text-sm rounded-2xl flex items-center gap-2"><X className="w-4 h-4"/> {error}</div>}
      {success && <div className="mb-6 p-4 bg-[#f0fdf4] border border-[#34c759] text-[#34c759] text-sm rounded-2xl flex items-center gap-2"><CheckCircle2 className="w-4 h-4"/> {success}</div>}

      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Left Column - Main Details */}
        <div className="flex-1 flex flex-col gap-6">
          
          {/* General Card */}
          <div className="bg-white p-6 rounded-2xl shadow-[0_2px_10px_rgba(0,0,0,0.04)]">
            <h3 className="text-base font-semibold text-black mb-4 flex items-center gap-2"><Tag className="w-4 h-4 text-[#86868b]"/> General Information</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-black mb-1">Product Name</label>
                <input required type="text" value={name} onChange={e => setName(e.target.value)} className="w-full px-4 py-2.5 bg-white border border-[#d2d2d7] rounded-xl focus:outline-none focus:ring-4 focus:ring-[#0071e3]/20 focus:border-[#0071e3] transition-all text-sm" placeholder="e.g. Valerie Ruffle Dress" />
              </div>
              <div>
                <label className="block text-sm font-medium text-black mb-1">Description</label>
                <textarea required rows="4" value={description} onChange={e => setDescription(e.target.value)} className="w-full px-4 py-2.5 bg-white border border-[#d2d2d7] rounded-xl focus:outline-none focus:ring-4 focus:ring-[#0071e3]/20 focus:border-[#0071e3] transition-all text-sm" placeholder="Write a compelling description..."></textarea>
              </div>
            </div>
          </div>

          {/* Pricing & Inventory Card */}
          <div className="bg-white p-6 rounded-2xl shadow-[0_2px_10px_rgba(0,0,0,0.04)]">
            <h3 className="text-base font-semibold text-black mb-4">Pricing & Inventory</h3>
            <div className="flex flex-col sm:flex-row gap-6">
              <div className="flex-1">
                <label className="block text-sm font-medium text-black mb-1">Price (₹)</label>
                <div className="relative">
                  <span className="absolute left-4 top-3 text-[#86868b] font-medium text-sm">₹</span>
                  <input required type="number" step="0.01" value={price} onChange={e => setPrice(e.target.value)} className="w-full pl-9 pr-4 py-2.5 bg-white border border-[#d2d2d7] rounded-xl focus:outline-none focus:ring-4 focus:ring-[#0071e3]/20 focus:border-[#0071e3] transition-all text-sm" placeholder="0.00" />
                </div>
              </div>
              <div className="flex-1 flex flex-col justify-center">
                <label className="block text-sm font-medium text-black mb-2 flex items-center justify-between">
                  <span>Stock Status</span>
                  {inStock ? (
                    <span className="text-[10px] font-bold tracking-widest uppercase bg-[#f0fdf4] text-[#34c759] px-2 py-0.5 rounded-full border border-[#34c759]/20">In Stock</span>
                  ) : (
                    <span className="text-[10px] font-bold tracking-widest uppercase bg-[#fff2f2] text-[#ff3b30] px-2 py-0.5 rounded-full border border-[#ff3b30]/20">Out of Stock</span>
                  )}
                </label>
                <div 
                  onClick={() => setInStock(!inStock)}
                  className={`w-12 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors ${inStock ? 'bg-[#34c759]' : 'bg-[#d2d2d7]'}`}
                >
                  <div className={`bg-white w-4 h-4 rounded-full shadow-sm transform transition-transform ${inStock ? 'translate-x-6' : 'translate-x-0'}`} />
                </div>
              </div>
              <div className="flex-1 flex flex-col justify-center">
                <label className="block text-sm font-medium text-black mb-2 flex items-center justify-between">
                  <span>Best Seller</span>
                  {bestSeller ? (
                    <span className="text-[10px] font-bold tracking-widest uppercase bg-[#f0fdf4] text-[#34c759] px-2 py-0.5 rounded-full border border-[#34c759]/20">Yes</span>
                  ) : (
                    <span className="text-[10px] font-bold tracking-widest uppercase bg-[#F5F5F7] text-[#86868b] px-2 py-0.5 rounded-full border border-[#d2d2d7]">No</span>
                  )}
                </label>
                <div 
                  onClick={() => setBestSeller(!bestSeller)}
                  className={`w-12 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors ${bestSeller ? 'bg-[#34c759]' : 'bg-[#d2d2d7]'}`}
                >
                  <div className={`bg-white w-4 h-4 rounded-full shadow-sm transform transition-transform ${bestSeller ? 'translate-x-6' : 'translate-x-0'}`} />
                </div>
              </div>
            </div>
          </div>

          {/* Variants Card (Interactive Pills) */}
          <div className="bg-white p-6 rounded-2xl shadow-[0_2px_10px_rgba(0,0,0,0.04)]">
            <h3 className="text-base font-semibold text-black mb-4">Variants</h3>
            <div className="space-y-6">
              {/* Sizes */}
              <div>
                <label className="block text-sm font-medium text-black mb-1">Sizes</label>
                <p className="text-[13px] text-[#86868b] mb-2">Type a size and press Enter.</p>
                <div className="p-2 bg-white border border-[#d2d2d7] rounded-xl flex flex-wrap gap-2 focus-within:ring-4 focus-within:ring-[#0071e3]/20 focus-within:border-[#0071e3] transition-all min-h-[46px] items-center">
                  {sizes.map(size => (
                    <span key={size} className="bg-[#F5F5F7] text-black text-[13px] font-medium px-3 py-1 rounded-full flex items-center gap-1.5 border border-[#d2d2d7]">
                      {size}
                      <button type="button" onClick={() => removeSize(size)} className="text-[#86868b] hover:text-[#ff3b30] focus:outline-none transition-colors">
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </span>
                  ))}
                  <input type="text" value={sizeInput} onChange={handleSizeChange} onKeyDown={handleSizeKeyDown} onBlur={handleSizeBlur} className="flex-1 min-w-[80px] outline-none text-[13px] px-1 bg-transparent" placeholder={sizes.length === 0 ? "e.g. S, M, L..." : ""} />
                </div>
              </div>

              {/* Colors */}
              <div>
                <div className="flex justify-between items-end mb-4">
                  <div>
                    <label className="block text-sm font-medium text-black mb-1">Colors & Variations</label>
                    <p className="text-[13px] text-[#86868b]">Add a color variation and optionally attach a specific image.</p>
                  </div>
                  <button type="button" onClick={addColorVariant} className="text-[#0071e3] text-[13px] font-medium flex items-center gap-1 hover:underline"><Plus className="w-4 h-4"/> Add Variant</button>
                </div>
                
                <div className="space-y-3">
                  {colors.length === 0 && (
                     <div className="text-center py-6 border border-dashed border-[#d2d2d7] rounded-xl bg-[#F5F5F7]">
                       <p className="text-[13px] text-[#86868b]">No variants added yet.</p>
                     </div>
                  )}
                  {colors.map((variant, index) => (
                    <div key={variant.id} className="flex items-start sm:items-center gap-4 bg-white border border-[#d2d2d7] p-3 rounded-xl shadow-sm relative group">
                      
                      {/* Image Upload Box */}
                      <div className="shrink-0 relative">
                        <label className="cursor-pointer flex items-center justify-center w-16 h-20 rounded-lg border border-[#d2d2d7] bg-[#F5F5F7] overflow-hidden hover:border-[#0071e3] transition-colors">
                          {variant.imageFile ? (
                            <img src={URL.createObjectURL(variant.imageFile)} className="w-full h-full object-cover" />
                          ) : variant.imageUrl ? (
                            <img src={variant.imageUrl} className="w-full h-full object-cover" />
                          ) : (
                            <ImageIcon className="w-6 h-6 text-[#86868b]" />
                          )}
                          <input 
                            type="file" 
                            accept="image/*" 
                            className="hidden" 
                            onChange={e => {
                               if (e.target.files && e.target.files[0]) {
                                  updateColorVariant(variant.id, 'imageFile', e.target.files[0]);
                               }
                            }} 
                          />
                        </label>
                        {variant.imageFile && <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 text-[9px] font-bold text-white bg-[#0071e3] px-1.5 py-0.5 rounded shadow-sm whitespace-nowrap">NEW</span>}
                      </div>

                      {/* Inputs */}
                      <div className="flex-1 flex flex-col sm:flex-row gap-3">
                         <div className="flex-1">
                            <input 
                               required
                               type="text" 
                               placeholder="Color Name (e.g. Black)" 
                               value={variant.colorName}
                               onChange={e => updateColorVariant(variant.id, 'colorName', e.target.value)}
                               className="w-full px-3 py-2 bg-white border border-[#d2d2d7] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0071e3]/20 focus:border-[#0071e3] transition-all text-[13px]" 
                            />
                         </div>
                         <div className="flex-1">
                            <div className="flex items-center gap-2">
                               <input 
                                  required
                                  type="text" 
                                  placeholder="Hex (e.g. #000000)" 
                                  value={variant.colorHex}
                                  onChange={e => updateColorVariant(variant.id, 'colorHex', e.target.value)}
                                  className="w-full px-3 py-2 bg-white border border-[#d2d2d7] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0071e3]/20 focus:border-[#0071e3] transition-all text-[13px]" 
                               />
                               {variant.colorHex && (
                                  <div className="w-6 h-6 rounded-full border border-[#d2d2d7] shrink-0" style={{backgroundColor: variant.colorHex}}></div>
                               )}
                            </div>
                         </div>
                      </div>

                      {/* Remove */}
                      <button 
                         type="button" 
                         onClick={() => removeColorVariant(variant.id)}
                         className="p-2 text-[#86868b] hover:text-[#ff3b30] hover:bg-[#fff2f2] rounded-lg transition-colors"
                      >
                         <Trash2 className="w-4 h-4" />
                      </button>

                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Right Column - Media & Organization */}
        <div className="w-full lg:w-[340px] flex flex-col gap-6">
          
          {/* Media Card (Drag & Drop) */}
          <div className="bg-white p-6 rounded-2xl shadow-[0_2px_10px_rgba(0,0,0,0.04)]">
            <h3 className="text-base font-semibold text-black mb-4 flex items-center gap-2"><ImageIcon className="w-4 h-4 text-[#86868b]"/> Media</h3>
            
            <div 
              onDragOver={onDragOver}
              onDragLeave={onDragLeave}
              onDrop={onDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-all ${isDragging ? 'border-[#0071e3] bg-[#0071e3]/5' : 'border-[#d2d2d7] hover:border-[#0071e3] hover:bg-black/5'}`}
            >
              <div className="w-12 h-12 rounded-full bg-[#F5F5F7] flex items-center justify-center mb-4">
                <UploadCloud className="w-6 h-6 text-[#0071e3]" />
              </div>
              <p className="text-[13px] font-semibold text-black">Click or drag images here</p>
              <p className="text-xs text-[#86868b] mt-1.5">High-res images. Auto-cropped to 3:4.</p>
              <input type="file" multiple accept="image/*" className="hidden" ref={fileInputRef} onChange={(e) => handleFilesAdded(e.target.files)} />
            </div>

            {/* Image Previews */}
            {(existingImages.length > 0 || previews.length > 0) && (
              <div className="mt-5 grid grid-cols-3 gap-3">
                {/* Existing Images */}
                {existingImages.map((img, idx) => (
                  <div key={`existing-${idx}`} className="relative aspect-[3/4] rounded-lg overflow-hidden border border-[#d2d2d7] group shadow-sm">
                    <img src={img} alt="Existing" className="w-full h-full object-cover" />
                    <button 
                      type="button"
                      onClick={(e) => { e.stopPropagation(); removeExistingImage(idx); }}
                      className="absolute top-1.5 right-1.5 w-7 h-7 bg-white/80 hover:bg-[#ff3b30] hover:text-white text-black shadow-md rounded-full flex items-center justify-center opacity-100 transition-all backdrop-blur-sm"
                    >
                      <X className="w-4 h-4" />
                    </button>
                    {!primaryIsNew && idx === 0 && <span className="absolute bottom-1.5 left-1.5 text-[10px] font-semibold bg-black/80 backdrop-blur-sm text-white px-2.5 py-1 rounded-full shadow-sm">Primary</span>}
                    {(primaryIsNew || idx !== 0) && (
                      <button 
                        type="button"
                        onClick={(e) => { e.stopPropagation(); makeExistingPrimary(idx); }}
                        className="absolute bottom-1.5 left-1.5 text-[10px] font-semibold bg-white/80 hover:bg-black hover:text-white text-black shadow-md px-2.5 py-1 rounded-full opacity-100 transition-all"
                      >
                        Set Primary
                      </button>
                    )}
                  </div>
                ))}
                {/* New Previews */}
                {previews.map((preview, idx) => (
                  <div key={`new-${idx}`} className="relative aspect-[3/4] rounded-lg overflow-hidden border border-[#0071e3]/50 group shadow-sm">
                    <img src={preview} alt="New Preview" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 border-2 border-[#0071e3] rounded-lg pointer-events-none" />
                    <button 
                      type="button"
                      onClick={(e) => { e.stopPropagation(); removeFile(idx); }}
                      className="absolute top-1.5 right-1.5 w-7 h-7 bg-white/80 hover:bg-[#ff3b30] hover:text-white text-black shadow-md rounded-full flex items-center justify-center opacity-100 transition-all backdrop-blur-sm"
                    >
                      <X className="w-4 h-4" />
                    </button>
                    <span className="absolute bottom-1.5 right-1.5 text-[10px] font-bold text-[#0071e3] bg-white px-1.5 py-0.5 rounded shadow-sm">NEW</span>
                    {(primaryIsNew || existingImages.length === 0) && idx === 0 && <span className="absolute bottom-1.5 left-1.5 text-[10px] font-semibold bg-black/80 backdrop-blur-sm text-white px-2.5 py-1 rounded-full shadow-sm">Primary</span>}
                    {((!primaryIsNew && existingImages.length > 0) || idx !== 0) && (
                      <button 
                        type="button"
                        onClick={(e) => { e.stopPropagation(); makeNewPrimary(idx); }}
                        className="absolute bottom-1.5 left-1.5 text-[10px] font-semibold bg-white/80 hover:bg-black hover:text-white text-black shadow-md px-2.5 py-1 rounded-full opacity-100 transition-all"
                      >
                        Set Primary
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Organization Card */}
          <div className="bg-white p-6 rounded-2xl shadow-[0_2px_10px_rgba(0,0,0,0.04)]">
            <h3 className="text-base font-semibold text-black mb-4">Organization</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-black mb-1">Website Section</label>
                <div className="flex flex-col gap-3 mt-2">
                  <label className="flex items-center gap-2 text-sm cursor-pointer">
                    <input type="checkbox" checked={sections.includes('New Arrivals')} onChange={(e) => {
                      if (e.target.checked) setSections([...sections, 'New Arrivals']);
                      else setSections(sections.filter(s => s !== 'New Arrivals'));
                    }} className="accent-[#0071e3] w-4 h-4 cursor-pointer" /> New Arrivals
                  </label>
                  <label className="flex items-center gap-2 text-sm cursor-pointer">
                    <input type="checkbox" checked={sections.includes('Shop Your Look')} onChange={(e) => {
                      if (e.target.checked) setSections([...sections, 'Shop Your Look']);
                      else setSections(sections.filter(s => s !== 'Shop Your Look'));
                    }} className="accent-[#0071e3] w-4 h-4 cursor-pointer" /> Shop Your Look
                  </label>
                  {sections.includes('Shop Your Look') && (
                    <div className="pl-6 mt-1">
                      <select 
                        value={aesthetic}
                        onChange={(e) => setAesthetic(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-[#d2d2d7] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0071e3]/20 focus:border-[#0071e3] transition-all text-sm cursor-pointer appearance-none"
                      >
                        <option value="">Select Look</option>
                        <option value="casual">Casual</option>
                        <option value="summer">Summer</option>
                        <option value="festivals / concerts">Festivals / Concerts</option>
                        <option value="trendy">Trendy</option>
                        <option value="babydoll / coquette">Babydoll / Coquette</option>
                        <option value="dark feminine">Dark Feminine</option>
                        <option value="office siren">Office Siren</option>
                        <option value="y2k">Y2K</option>
                        <option value="streetwear">Streetwear</option>
                        <option value="elegant chic">Elegant Chic</option>
                        <option value="opiúm">Opiúm</option>
                      </select>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-black mb-1">Category</label>
                <select 
                  value={category} 
                  onChange={e => {
                    setCategory(e.target.value);
                    const newSubcats = CATEGORY_DATA.find(c => c.title === e.target.value)?.children || [];
                    setSubcategory(newSubcats[0] || '');
                  }} 
                  className="w-full px-4 py-2.5 bg-white border border-[#d2d2d7] rounded-xl focus:outline-none focus:ring-4 focus:ring-[#0071e3]/20 focus:border-[#0071e3] transition-all text-sm cursor-pointer appearance-none"
                >
                  {CATEGORY_DATA.map(c => (
                    <option key={c.title} value={c.title}>{c.title}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-black mb-1">Subcategory</label>
                <select 
                  value={subcategory} 
                  onChange={e => setSubcategory(e.target.value)} 
                  className="w-full px-4 py-2.5 bg-white border border-[#d2d2d7] rounded-xl focus:outline-none focus:ring-4 focus:ring-[#0071e3]/20 focus:border-[#0071e3] transition-all text-sm cursor-pointer appearance-none"
                >
                  {(CATEGORY_DATA.find(c => c.title === category)?.children || []).map(sub => (
                    <option key={sub} value={sub}>{sub}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-black mb-1">Badge</label>
                <input type="text" value={badge} onChange={e => setBadge(e.target.value)} className="w-full px-4 py-2.5 bg-white border border-[#d2d2d7] rounded-xl focus:outline-none focus:ring-4 focus:ring-[#0071e3]/20 focus:border-[#0071e3] transition-all text-sm" placeholder="e.g. MOST LOVED, NEW" />
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
