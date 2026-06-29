import fs from 'fs';

let content = fs.readFileSync('src/app/shipping/page.js', 'utf8');
const oldShipping = fs.readFileSync('old_shipping_page.js', 'utf16le');

// Find the flow diagram code in old_shipping_page.js
const startMatch = '{/* Diagram */}';
const endMatch = '{/* Modern Price Breakdown UI */}';
const startIndex = oldShipping.indexOf(startMatch);
const endIndex = oldShipping.indexOf(endMatch);
const flowCode = oldShipping.substring(startIndex, endIndex);

// The section we want to replace in the current page.js
// It starts with <GsapImageStack /> and ends right before {/* Modern Price Breakdown UI */}
const curStartMatch = '<GsapImageStack />';
const curEndMatch = '{/* Modern Price Breakdown UI */}';
const curStartIndex = content.indexOf(curStartMatch);
const curEndIndex = content.indexOf(curEndMatch);

if (curStartIndex !== -1 && curEndIndex !== -1) {
    // Slice everything before <GsapImageStack />
    const before = content.substring(0, curStartIndex);
    
    // In old_shipping_page, the flowCode is already inside a `<main className="max-w-4xl mx-auto px-6 py-16 md:py-24 space-y-24 md:space-y-32">\n        <section>\n          <FadeIn delay={0.1}>`
    // Actually no, wait. Let's look at what's before <GsapImageStack /> in page.js
    // It's `      </main>\n\n      <GsapImageStack />\n\n      <main ...>`
    // The previous design didn't have two <main> tags. It just had one continuous <main>.
    // Let's replace the whole block from </main>\n\n      <GsapImageStack /> up to {/* Modern Price Breakdown UI */}
    // Wait, the easiest way is to just replace everything from <GsapImageStack /> to {/* Modern Price Breakdown UI */} with:
    // `<main className="max-w-4xl mx-auto px-6 py-16 md:py-24 space-y-24 md:space-y-32">\n        <section>\n          <FadeIn delay={0.1}>\n            <div className="bg-white border border-[#E5E5E5]/50 rounded-[32px] p-6 md:p-12 mb-12 shadow-[0_8px_30px_rgb(0,0,0,0.04)] relative overflow-hidden">\n` + flowCode 
    // Let's print out what we are replacing.
    
    // Instead of complex logic, let's use a regex that matches the exact block from GsapImageStack to the price breakdown
    const replaceRegex = /<GsapImageStack \/>[\s\S]*?(?=\{\/\* Modern Price Breakdown UI \*\/})/;
    
    // Let's see what flowCode has.
    // flowCode starts with `{/* Diagram */}` and ends with `</div>` (the Why wait box).
    // Does flowCode include the opening `<main>` or `<FadeIn>`?
    console.log("flowCode starts with:");
    console.log(flowCode.substring(0, 100));
    
    // We will do a manual replace.
    const newContent = content.replace(replaceRegex, `      <main className="max-w-4xl mx-auto px-6 py-16 md:py-24 space-y-24 md:space-y-32">
        <section>
          <FadeIn delay={0.1}>
            <div className="bg-white border border-[#E5E5E5]/50 rounded-[32px] p-6 md:p-12 mb-12 shadow-[0_8px_30px_rgb(0,0,0,0.04)] relative overflow-hidden">
              ` + flowCode + `\n              `);
              
    fs.writeFileSync('src/app/shipping/page.js', newContent);
    console.log("Successfully replaced GsapImageStack block!");
} else {
    console.log("Could not find GsapImageStack or Modern Price Breakdown UI");
}

// Remove the import for GsapImageStack
let finalContent = fs.readFileSync('src/app/shipping/page.js', 'utf8');
finalContent = finalContent.replace(/const GsapImageStack = dynamic\(\(\) => import\('@\/components\/ui\/gsap-image-stack'\), \{\s*ssr: false,\s*loading: \(\) => <div className="w-full h-screen flex items-center justify-center text-xs tracking-widest uppercase text-neutral-400">Loading Animations...<\/div>\s*\}\);\n/, '');
finalContent = finalContent.replace(/import \{ ScrollTrigger \} from 'gsap\/ScrollTrigger';\n/, '');
finalContent = finalContent.replace(/import \{ useGSAP \} from '@gsap\/react';\n/, '');

// Fix "WORTH THE WAIT"
finalContent = finalContent.replace(/<div className="mb-12 text-center">\s*<span className="font-aston-script text-3xl md:text-4xl text-\[#8A001A\] lowercase">worth the wait<\/span>\s*<\/div>/gi, '');
finalContent = finalContent.replace(/Totally worth the wait!/gi, 'Totally worth it!');

// Fix pre-order warning
const warningRegex = /<div className="bg-\[#FFF5F5\] border-2 border-\[#8A001A\]\/20 rounded-2xl p-5 md:p-7 mb-10 relative overflow-hidden">[\s\S]*?<\/div>\s*<\/div>\s*<\/div>\s*<\/div>/;
finalContent = finalContent.replace(warningRegex, `<p className="text-[14px] text-[#8A001A] font-medium text-left">All orders are pre-orders. Your delivery timeline begins only after your batch closes and you pay your shipping payment — not from the day you place your order.</p>`);


fs.writeFileSync('src/app/shipping/page.js', finalContent);
