const fs = require('fs');

let c = fs.readFileSync('src/app/shipping/page.js', 'utf8');

const duplicateBlock = `              <div className="bg-[#FAFAFA] border border-[#E5E5E5] rounded-xl p-6 mt-8 shadow-sm">
                <h4 className="text-[18px] font-perandory font-bold text-[#8A001A] mb-2">Why wait for the batch date?</h4>
                <p className="text-[14px] text-[#444444] leading-relaxed font-dm-sans" style={{ fontFamily: "var(--font-dm-sans), sans-serif" }}>
                  When multiple people place orders, we pack them together into one large international shipment. Once this shipment arrives in India, the total delivery cost is distributed precisely according to the weight and category of your items. This ensures you <strong>only pay the real, un-marked-up shipping price</strong>.
                </p>
              </div>`;

// Find first occurrence
const firstIdx = c.indexOf(duplicateBlock);
if (firstIdx !== -1) {
  // Find second occurrence
  const secondIdx = c.indexOf(duplicateBlock, firstIdx + 1);
  if (secondIdx !== -1) {
    // Remove the second occurrence
    c = c.substring(0, secondIdx) + c.substring(secondIdx + duplicateBlock.length);
    fs.writeFileSync('src/app/shipping/page.js', c);
    console.log("Removed second duplicate block successfully.");
  } else {
    console.log("Could not find second occurrence. Only found one.");
  }
} else {
  console.log("Could not find any occurrence.");
}
