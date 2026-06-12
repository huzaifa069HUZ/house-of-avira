const fs = require('fs');
const path = 'c:/Users/huzai/Desktop/house of avira/src/components/admin/ProductManager.jsx';
let content = fs.readFileSync(path, 'utf8');

// 1. Imports
content = content.replace(
  /import { UploadCloud, X, Image as ImageIcon, Tag, Loader2, CheckCircle2 } from 'lucide-react';/,
  "import { UploadCloud, X, Image as ImageIcon, Tag, Loader2, CheckCircle2, Plus, Trash2 } from 'lucide-react';"
);

// 2. Initial state
content = content.replace(
  /const \[colors, setColors\] = useState\(\[\]\);\s*const \[colorInput, setColorInput\] = useState\(''\);/,
  "const [colors, setColors] = useState([]);"
);

// 3. useEffect
content = content.replace(
  /setColors\(initialProduct\.swatches\?\.map\(s => s\.color\) \|\| \[\]\);/,
  `setColors(initialProduct.swatches?.map((s, idx) => ({
        id: Date.now() + idx,
        colorName: s.colorName || s.color,
        colorHex: s.color,
        imageUrl: s.imageUrl || '',
        imageFile: null
      })) || []);`
);

// 4. Color handlers - replace all of them with new ones
const handlerRegex = /\s*const removeColor =.*?const handleColorChange =.*?\}\n.*?};/s;
content = content.replace(handlerRegex, `
  const addColorVariant = () => {
    setColors(prev => [...prev, { id: Date.now(), colorName: '', colorHex: '', imageUrl: '', imageFile: null }]);
  };

  const removeColorVariant = (id) => {
    setColors(prev => prev.filter(c => c.id !== id));
  };

  const updateColorVariant = (id, field, value) => {
    setColors(prev => prev.map(c => c.id === id ? { ...c, [field]: value } : c));
  };
`);

// 5. Submit logic
content = content.replace(
  /\/\/ 2\. Format Colors\s*const swatchesArray = colors\.map\(\(color, index\) => \(\{\s*color: color\.trim\(\),\s*active: index === 0 \/\/ Make the first color active by default\s*\}\)\);/s,
  `// 2. Format Colors and upload variant images
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
      }`
);

// 6. UI for Colors
const uiRegex = /\{\/\* Colors \*\/\}\s*<div>\s*<label className="block text-sm font-medium text-black mb-1">Colors \(Hex Codes or Names\)<\/label>.*?<\/div>\s*<\/div>/s;
content = content.replace(uiRegex, `{/* Colors */}
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
              </div>`);

fs.writeFileSync(path, content, 'utf8');
console.log('Successfully updated ProductManager.jsx');
