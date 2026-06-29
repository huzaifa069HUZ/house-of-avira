import fs from 'fs';

const f = 'src/app/shipping/page.js';
let content = fs.readFileSync(f, 'utf8');

const oldBox = `<div className="bg-gradient-to-br from-[#FAFAFA] to-[#FFFFFF] border-2 border-[#E5E5E5] rounded-2xl p-6 md:p-8 max-w-2xl mx-auto mb-6 shadow-sm relative overflow-hidden group hover:border-[#8A001A] transition-colors duration-500">
            <div className="absolute -top-6 -right-6 p-4 opacity-10 group-hover:opacity-20 transition-opacity duration-500 group-hover:rotate-12">
              <Sparkles className="w-32 h-32 text-[#8A001A]" />
            </div>
            <p className="text-lg md:text-xl text-[#8A001A] font-medium leading-relaxed relative z-10 italic">
              All orders are pre-orders. Your delivery timeline begins only after your batch closes and you pay your shipping payment — not from the day you place your order.
            </p>
          </div>`;

const newText = `<p className="text-[15px] text-[#666666] leading-relaxed mb-10 max-w-2xl mx-auto">
            All orders are pre-orders. Your delivery timeline begins only after your batch closes and you pay your shipping payment — not from the day you place your order.
          </p>`;

content = content.replace(oldBox, newText);

content = content.replace(/<div className="mb-12 text-center">\s*<span className="font-aston-script text-3xl md:text-4xl text-\[#8A001A\] lowercase">worth the wait<\/span>\s*<\/div>/g, '');
content = content.replace(/<div className="text-center mt-6 mb-8">\s*<span className="font-aston-script text-4xl md:text-5xl text-\[#8A001A\] lowercase">worth the wait<\/span>\s*<p className="text-\[13px\] text-\[#999999\] mt-3 font-medium tracking-wide uppercase">Every order is hand-sourced, quality checked & shipped with care<\/p>\s*<\/div>/g, '');
content = content.replace(/{\/\* Worth the Wait tagline \*\/}\s*<div className="mb-2">\s*<span className="font-aston-script text-4xl md:text-5xl text-\[#8A001A\] lowercase">worth the wait<\/span>\s*<\/div>/g, '');

const oldShipping = fs.readFileSync('old_shipping_page.js', 'utf8');
const flowStart = '{/* FLOW SECTION */}';
const flowEnd = '{/* Modern Price Breakdown UI */}';
const startIndex = oldShipping.indexOf(flowStart);
const endIndex = oldShipping.indexOf(flowEnd);

if (startIndex !== -1 && endIndex !== -1) {
    const flowCode = oldShipping.substring(startIndex, endIndex);
    const gsapSectionStr = `<GsapImageStack />

      <main className="max-w-4xl mx-auto px-6 py-16 md:py-24 space-y-24 md:space-y-32">
        <section>
          <FadeIn delay={0.1}>
            <div className="bg-white border border-[#E5E5E5]/50 rounded-[32px] p-6 md:p-12 mb-12 shadow-[0_8px_30px_rgb(0,0,0,0.04)] relative overflow-hidden">`;
    
    content = content.replace(gsapSectionStr, `<div className="mt-12 bg-white border border-[#E5E5E5]/50 rounded-[32px] p-6 md:p-12 mb-12 shadow-[0_8px_30px_rgb(0,0,0,0.04)] relative overflow-hidden">\n` + flowCode);
} else {
    console.log('Could not find flow section in old_shipping_page.js');
}

fs.writeFileSync(f, content);
console.log('Update completed');
