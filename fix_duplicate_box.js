const fs = require('fs');
let c = fs.readFileSync('src/app/shipping/page.js', 'utf8');

// The duplicate block starts with <div className="bg-[#FAFAFA] border border-[#E5E5E5] rounded-xl p-6 mt-8 shadow-sm">
// or something similar. Let's find both.
const regex = /<div className="bg-\[#FAFAFA\] border border-\[#E5E5E5\] rounded-xl p-6[^>]*>[\s\S]*?<h4 className="text-\[18px\] font-perandory font-bold text-\[#8A001A\] mb-2">Why wait for the batch date\?<\/h4>[\s\S]*?<\/div>/g;

let count = 0;
c = c.replace(regex, (match) => {
    count++;
    if (count === 1) {
        // Keep the first one, but update its text
        return match.replace(
            /When multiple people place orders.*?shipping price<\/strong>\./s,
            "You can place an order whenever you like! We simply combine all orders received during the month into one large international batch before processing. Once this shipment arrives in India, the total delivery cost is distributed precisely according to the weight and category of your items. This ensures you <strong>only pay the real, un-marked-up shipping price</strong>."
        );
    }
    // Remove the second one
    return '';
});

fs.writeFileSync('src/app/shipping/page.js', c);
console.log(`Replaced. Found ${count} boxes.`);
