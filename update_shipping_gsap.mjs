import fs from 'fs';

const f = 'src/app/shipping/page.js';
let content = fs.readFileSync(f, 'utf8');

const oldShipping = fs.readFileSync('old_shipping_page.js', 'utf16le');
const startMatch = '{/* Diagram */}';
const endMatch = '{/* Modern Price Breakdown UI */}';
const startIndex = oldShipping.indexOf(startMatch);
const endIndex = oldShipping.indexOf(endMatch);

if (startIndex !== -1 && endIndex !== -1) {
    const flowCode = oldShipping.substring(startIndex, endIndex);
    
    // The exact string to replace
    const gsapSectionStr = `<GsapImageStack />\n\n      <main className="max-w-4xl mx-auto px-6 py-16 md:py-24 space-y-24 md:space-y-32">\n        <section>\n          <FadeIn delay={0.1}>\n            <div className="bg-white border border-[#E5E5E5]/50 rounded-[32px] p-6 md:p-12 mb-12 shadow-[0_8px_30px_rgb(0,0,0,0.04)] relative overflow-hidden">`;
    
    // Check if it exists
    if (content.includes(gsapSectionStr)) {
        content = content.replace(gsapSectionStr, flowCode + "\n\n" + `<div className="mt-12 bg-white border border-[#E5E5E5]/50 rounded-[32px] p-6 md:p-12 mb-12 shadow-[0_8px_30px_rgb(0,0,0,0.04)] relative overflow-hidden">`);
        fs.writeFileSync(f, content);
        console.log('Update completed successfully');
    } else {
        console.log('Failed to find gsapSectionStr in current shipping page');
        // fallback regex search
        const regexStr = /<GsapImageStack \/>\s*<main className=\"max-w-4xl mx-auto px-6 py-16 md:py-24 space-y-24 md:space-y-32\">\s*<section>\s*<FadeIn delay={0.1}>\s*<div className=\"bg-white border border-\[#E5E5E5\]\/50 rounded-\[32px\] p-6 md:p-12 mb-12 shadow-\[0_8px_30px_rgb\(0,0,0,0.04\)\] relative overflow-hidden\">/;
        if (regexStr.test(content)) {
            content = content.replace(regexStr, flowCode + "\n\n" + `<div className="mt-12 bg-white border border-[#E5E5E5]/50 rounded-[32px] p-6 md:p-12 mb-12 shadow-[0_8px_30px_rgb(0,0,0,0.04)] relative overflow-hidden">`);
            fs.writeFileSync(f, content);
            console.log('Update completed successfully via regex');
        } else {
            console.log('Regex also failed.');
        }
    }
} else {
    console.log('Failed to find indices in old_shipping_page.js');
}
