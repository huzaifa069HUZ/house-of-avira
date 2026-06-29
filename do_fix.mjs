import fs from 'fs';

let c = fs.readFileSync('src/app/shipping/page.js', 'utf8');

const regex = /<GsapImageStack \/>[\s\S]*?<div className="bg-\[#FAFAFA\] border border-\[#E5E5E5\] rounded-xl p-6 shadow-sm">\s*<h4 className="text-\[18px\] font-perandory font-bold text-\[#8A001A\] mb-2">Why wait for the batch date\?<\/h4>\s*<p className="text-\[14px\] text-\[#444444\] leading-relaxed font-dm-sans" style={{ fontFamily: "var\(--font-dm-sans\), sans-serif" }}>\s*When multiple people place orders, we pack them together into one large international shipment. Once this shipment arrives in India, the total delivery cost is distributed precisely according to the weight and category of your items. This ensures you <strong>only pay the real, un-marked-up shipping price<\/strong>.\s*<\/p>\s*<\/div>/;

const flowCode = fs.readFileSync('flow_code.jsx', 'utf8');
const replacement = `      <main className="max-w-4xl mx-auto px-6 py-16 md:py-24 space-y-24 md:space-y-32">
        <section>
` + flowCode.replace('{/* Diagram */}\n', '');

if(regex.test(c)) {
   c = c.replace(regex, replacement.trim());
   fs.writeFileSync('src/app/shipping/page.js', c);
   console.log('Replaced successfully using regex');
} else {
   console.log('Regex failed');
}
