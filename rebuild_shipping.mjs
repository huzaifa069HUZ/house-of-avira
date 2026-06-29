import fs from 'fs';

let content = fs.readFileSync('src/app/shipping/page.js', 'utf8');

// 1. Terminology: replace invoice with payment/shipping cost
content = content.replace(/shipping invoice/gi, 'shipping payment');
content = content.replace(/Shipping Invoice/gi, 'Shipping Payment Request');
content = content.replace(/pay your final invoice/gi, 'pay your final shipping cost');
content = content.replace(/invoice is paid/gi, 'shipping is paid');
content = content.replace(/Clear your final invoice/gi, 'Clear your final shipping cost');
content = content.replace(/invoice/gi, 'payment');

// 2. Remove WORTH THE WAIT
content = content.replace(/<div className="mb-12 text-center">\s*<span className="font-aston-script text-3xl md:text-4xl text-\[#8A001A\] lowercase">worth the wait<\/span>\s*<\/div>/g, '');
content = content.replace(/<div className="bg-\[#FAFAFA\] border border-\[#E5E5E5\] rounded-full px-4 py-2 mt-8 inline-flex items-center gap-2">\s*<div className="w-2 h-2 rounded-full bg-\[#8A001A\] animate-pulse"><\/div>\s*<span className="text-\[11px\] font-bold tracking-\[0.2em\] text-\[#000000\]">WORTH THE WAIT<\/span>\s*<\/div>/g, '');
content = content.replace(/<div className="bg-\[#000000\] text-white text-\[10px\] font-bold tracking-\[0.2em\] px-4 py-1.5 rounded-full inline-block mb-3">\s*WORTH THE WAIT\s*<\/div>/g, '');
content = content.replace(/Totally worth the wait!/g, 'Totally worth it!');
content = content.replace(/\{\/\* Worth the Wait tagline \*\/\}/g, '');

// 3. Simplify pre-order warning
const warningToReplace = `<div className="bg-[#FFF5F5] border-2 border-[#8A001A]/20 rounded-2xl p-5 md:p-7 mb-10 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1.5 h-full bg-[#8A001A] rounded-l-2xl" />
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 shrink-0 rounded-full bg-[#8A001A]/10 flex items-center justify-center mt-0.5">
                  <svg className="w-6 h-6 text-[#8A001A]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" /></svg>
                </div>
                <div>
                  <h4 className="font-perandory text-xl md:text-2xl text-[#8A001A] mb-2">The delivery timeline does NOT start from the day you order</h4>
                  <p className="text-[13px] md:text-[14px] text-[#666666] leading-relaxed mb-3">House of Avira operates on a <strong className="text-[#000000]">batch pre-order model</strong>. When you place an order, it joins a batch. Only after the batch closes do we begin sourcing, quality checking, and calculating your shipping costs.</p>
                  <div className="bg-white border border-[#E5E5E5] rounded-xl p-4 text-[13px] text-[#666666] leading-relaxed">
                    <strong className="text-[#000000] block mb-1">Example:</strong>
                    You order on <strong className="text-[#000000]">Oct 1st</strong>. Your batch closes on <strong className="text-[#000000]">Oct 20th</strong>. You wait until Oct 20th. After the batch closes, we source your products, QC them, pack them, and send you a shipping payment. Only after you <strong className="text-[#000000]">pay that payment</strong> does the 2-4 week shipping window begin.
                  </div>
                </div>
              </div>
            </div>`;

content = content.replace(warningToReplace, `<p className="text-[14px] text-[#8A001A] font-medium text-left">All orders are pre-orders. Your delivery timeline begins only after your batch closes and you pay your shipping payment — not from the day you place your order.</p>`);

// 4. Extract the exact static section block from old_shipping_page.js and overwrite the GsapImageStack in page.js
const oldShipping = fs.readFileSync('old_shipping_page.js', 'utf16le');
const startMatch = '{/* Diagram */}';
const endMatch = '{/* Modern Price Breakdown UI */}';
const startIndex = oldShipping.indexOf(startMatch);
const endIndex = oldShipping.indexOf(endMatch);
const flowCode = oldShipping.substring(startIndex, endIndex);

const targetReplaceBlock = `<GsapImageStack />

      <main className="max-w-4xl mx-auto px-6 py-16 md:py-24 space-y-24 md:space-y-32">
        <section>
          <FadeIn delay={0.1}>
            <div className="bg-white border border-[#E5E5E5]/50 rounded-[32px] p-6 md:p-12 mb-12 shadow-[0_8px_30px_rgb(0,0,0,0.04)] relative overflow-hidden">
              <div className="bg-[#FAFAFA] border border-[#E5E5E5] rounded-xl p-6 shadow-sm">
                <h4 className="text-[18px] font-perandory font-bold text-[#8A001A] mb-2">Why wait for the batch date?</h4>
                <p className="text-[14px] text-[#444444] leading-relaxed font-dm-sans" style={{ fontFamily: "var(--font-dm-sans), sans-serif" }}>
                  When multiple people place orders, we pack them together into one large international shipment. Once this shipment arrives in India, the total delivery cost is distributed precisely according to the weight and category of your items. This ensures you <strong>only pay the real, un-marked-up shipping price</strong>.
                </p>
              </div>`;

content = content.replace(targetReplaceBlock, flowCode);

// Remove unused import
content = content.replace(/const GsapImageStack = dynamic\(\(\) => import\('@\/components\/ui\/gsap-image-stack'\), \{\s*ssr: false,\s*loading: \(\) => <div className="w-full h-screen flex items-center justify-center text-xs tracking-widest uppercase text-neutral-400">Loading Animations...<\/div>\s*\}\);\n/, '');

fs.writeFileSync('src/app/shipping/page.js', content);
console.log('Update complete.');
