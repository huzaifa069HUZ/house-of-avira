const fs = require('fs');

let c = fs.readFileSync('src/app/shipping/page.js', 'utf8');

// 1. Restore static flow diagram
const oldStr = `<GsapImageStack />

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

const flowCode = fs.readFileSync('flow_code.jsx', 'utf8');
const replacement = `      <main className="max-w-4xl mx-auto px-6 py-16 md:py-24 space-y-24 md:space-y-32">
        <section>
` + flowCode.replace('{/* Diagram */}\n', '');

if (c.includes(oldStr)) {
  c = c.replace(oldStr, replacement);
  console.log('Restored diagram successfully');
} else {
  console.log('Failed to find exact diagram string');
}

// 2. Remove box from "All orders are pre-orders..."
const heroBoxRegex = /<div className="bg-gradient-to-br from-\[#FAFAFA\] to-\[#FFFFFF\] border-2 border-\[#E5E5E5\] rounded-2xl p-6 md:p-8 max-w-2xl mx-auto mb-6 shadow-sm relative overflow-hidden group hover:border-\[#8A001A\] transition-colors duration-500">[\s\S]*?<Sparkles className="w-32 h-32 text-\[#8A001A\]" \/>[\s\S]*?<\/div>[\s\S]*?<p className="text-lg md:text-xl text-\[#8A001A\] font-medium leading-relaxed relative z-10 italic">([\s\S]*?)<\/p>\s*<\/div>/;
const match = c.match(heroBoxRegex);
if(match) {
    // We want to keep the text, but remove the "invoice" if it's there.
    let text = match[1].trim();
    text = text.replace(/shipping invoice/g, 'shipping payment');
    const newHeroText = `<p className="text-[15px] md:text-[16px] text-[#8A001A] font-medium leading-relaxed max-w-2xl mx-auto mb-6">
              ${text}
            </p>`;
    c = c.replace(heroBoxRegex, newHeroText);
    console.log('Removed box from hero text successfully');
} else {
    console.log('Failed to find hero box string');
}

// 3. Change font of "The delivery timeline does NOT start from the day you order"
const h4Regex = /<h4 className="font-perandory text-xl md:text-2xl text-\[#8A001A\] mb-2">The delivery timeline does NOT start from the day you order<\/h4>/;
if (h4Regex.test(c)) {
    c = c.replace(h4Regex, `<h4 className="text-xl md:text-2xl text-[#000000] mb-2" style={{ fontFamily: '"Cormorant Garamond", serif', fontStyle: 'normal', fontWeight: 700, fontSize: '24px', lineHeight: '32px' }}>The delivery timeline does NOT start from the day you order</h4>`);
    console.log('Updated font for delivery timeline tab successfully');
} else {
    console.log('Failed to find h4 string');
}

// 4. Cleanup GsapImageStack import
c = c.replace(/const GsapImageStack = dynamic\(\(\) => import\('@\/components\/ui\/gsap-image-stack'\), \{\s*ssr: false,\s*loading: \(\) => <div className="w-full h-screen flex items-center justify-center text-xs tracking-widest uppercase text-neutral-400">Loading Animations...<\/div>\s*\}\);\n/g, '');
c = c.replace(/const GsapImageStack = dynamic\(\(\) => import\('@\/components\/ui\/gsap-image-stack'\), \{[\s\S]*?\}\);\n/g, '');

fs.writeFileSync('src/app/shipping/page.js', c);
