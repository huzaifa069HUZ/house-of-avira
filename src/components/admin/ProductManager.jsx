'use client';

import { useState, useRef, useEffect } from 'react';
import { uploadImagesToCloudinary } from '@/app/actions/uploadActions';
import { db } from '@/lib/firebase';
import { collection, addDoc, doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { UploadCloud, X, Image as ImageIcon, Tag, Loader2, CheckCircle2 } from 'lucide-react';

const CATEGORY_DATA = [
  { 
    title: "Women", 
    children: ["tops", "pants / jeans", "skirts", "dresses", "jackets", "footwear", "beach wear"]
  },
  {
    title: "Men",
    children: ["tops", "pants/jeans", "jackets", "footwear"]
  },
  {
    title: "Unisex",
    children: ["tops", "pants/jeans", "jackets"]
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
  
  // State for interactive tags (Sizes and Colors)
  const [sizes, setSizes] = useState([]);
  const [sizeInput, setSizeInput] = useState('');
  
  const [colors, setColors] = useState([]);
  const [colorInput, setColorInput] = useState('');

  // State for Inventory
  const [inStock, setInStock] = useState(true);

  // State for Images
  const [existingImages, setExistingImages] = useState([]);
  const [files, setFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
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
      setSizes(initialProduct.sizes || []);
      setColors(initialProduct.swatches?.map(s => s.color) || []);
      setInStock(initialProduct.inStock !== false);
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

  const removeColor = (colorToRemove) => setColors(prev => prev.filter(c => c !== colorToRemove));

  const processColorInput = (value) => {
    const val = value.trim();
    if (val && !colors.includes(val)) {
      setColors(prev => [...prev, val]);
    }
  };

  const handleColorKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      processColorInput(colorInput);
      setColorInput('');
    }
  };

  const handleColorBlur = () => {
    if (colorInput.trim()) {
      processColorInput(colorInput);
      setColorInput('');
    }
  };
  
  const handleColorChange = (e) => {
    const val = e.target.value;
    if (val.includes(',')) {
      val.split(',').forEach(v => {
        if(v.trim()) processColorInput(v);
      });
      setColorInput('');
    } else {
      setColorInput(val);
    }
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
        
        finalImageUrls = [...finalImageUrls, ...uploadResult.urls];
      }

      // 2. Format Colors
      const swatchesArray = colors.map((color, index) => ({
        color: color.trim(),
        active: index === 0 // Make the first color active by default
      }));

      // 3. Save or Update Product in Firestore
      const productData = {
        name,
        price: parseFloat(price),
        description,
        section: sections[0], // backward compatibility
        sections,
        category,
        subcategory,
        badge,
        imageUrl: finalImageUrls[0], // Primary image
        images: finalImageUrls, // All images
        sizes,
        swatches: swatchesArray,
        extraColors: swatchesArray.length > 3 ? swatchesArray.length - 3 : 0,
        inStock,
      };

      if (initialProduct) {
        // Edit Mode
        const docRef = doc(db, 'products', initialProduct.id);
        await updateDoc(docRef, productData);
        setSuccess('Product successfully updated!');
      } else {
        // Add Mode
        productData.createdAt = serverTimestamp();
        await addDoc(collection(db, 'products'), productData);
        setSuccess('Product successfully added!');
        
        // Reset form only on add
        setName(''); setPrice(''); setDescription(''); setSections(['New Arrivals']); setBadge('');
        setCategory(CATEGORY_DATA[0].title); setSubcategory(CATEGORY_DATA[0].children[0] || '');
        setSizes([]); setColors([]); setFiles([]); setPreviews([]); setExistingImages([]);
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
                <label className="block text-sm font-medium text-black mb-1">Colors (Hex Codes or Names)</label>
                <p className="text-[13px] text-[#86868b] mb-2">Type a color hex code (e.g. #000000) or name (e.g. Black) and press Enter.</p>
                <div className="p-2 bg-white border border-[#d2d2d7] rounded-xl flex flex-wrap gap-2 focus-within:ring-4 focus-within:ring-[#0071e3]/20 focus-within:border-[#0071e3] transition-all min-h-[46px] items-center">
                  {colors.map(color => (
                    <span key={color} className="bg-[#F5F5F7] text-black text-[13px] font-medium px-3 py-1 rounded-full flex items-center gap-2 border border-[#d2d2d7]">
                      <span className="w-3.5 h-3.5 rounded-full border border-[#d2d2d7]" style={{ backgroundColor: color }}></span>
                      {color}
                      <button type="button" onClick={() => removeColor(color)} className="text-[#86868b] hover:text-[#ff3b30] focus:outline-none ml-1 transition-colors">
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </span>
                  ))}
                  <input type="text" value={colorInput} onChange={handleColorChange} onKeyDown={handleColorKeyDown} onBlur={handleColorBlur} className="flex-1 min-w-[80px] outline-none text-[13px] px-1 bg-transparent" placeholder={colors.length === 0 ? "e.g. #ff0000, white..." : ""} />
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
                      className="absolute top-1.5 right-1.5 w-6 h-6 bg-black/60 hover:bg-[#ff3b30] text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all backdrop-blur-sm"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                    {idx === 0 && <span className="absolute bottom-1 left-1 text-[9px] font-medium bg-black/70 backdrop-blur-sm text-white px-2 py-0.5 rounded-full shadow-sm">Primary</span>}
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
                      className="absolute top-1.5 right-1.5 w-6 h-6 bg-black/60 hover:bg-[#ff3b30] text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all backdrop-blur-sm"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                    <span className="absolute bottom-1 right-1 text-[9px] font-bold text-[#0071e3] bg-white px-1.5 py-0.5 rounded shadow-sm">NEW</span>
                    {existingImages.length === 0 && idx === 0 && <span className="absolute bottom-1 left-1 text-[9px] font-medium bg-black/70 backdrop-blur-sm text-white px-2 py-0.5 rounded-full shadow-sm">Primary</span>}
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
                    <input type="checkbox" checked={sections.includes('Curated Aesthetics')} onChange={(e) => {
                      if (e.target.checked) setSections([...sections, 'Curated Aesthetics']);
                      else setSections(sections.filter(s => s !== 'Curated Aesthetics'));
                    }} className="accent-[#0071e3] w-4 h-4 cursor-pointer" /> Curated Aesthetics
                  </label>
                  <label className="flex items-center gap-2 text-sm cursor-pointer">
                    <input type="checkbox" checked={sections.includes('Top Picks Grid')} onChange={(e) => {
                      if (e.target.checked) setSections([...sections, 'Top Picks Grid']);
                      else setSections(sections.filter(s => s !== 'Top Picks Grid'));
                    }} className="accent-[#0071e3] w-4 h-4 cursor-pointer" /> Top Picks Grid
                  </label>
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
