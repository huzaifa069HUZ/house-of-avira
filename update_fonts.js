const fs = require('fs');
let c = fs.readFileSync('src/app/shipping/page.js', 'utf8');

c = c.replace(
  '<p className="text-[13px] md:text-[14px] text-[#666666] leading-relaxed mb-3">House of Avira',
  '<p className="mb-3" style={{ fontFamily: \'"Cormorant Garamond", serif\', fontStyle: \'normal\', fontWeight: 700, fontSize: \'24px\', lineHeight: \'32px\', color: \'#000000\' }}>House of Avira'
);

c = c.replace(
  '<div className="bg-white border border-[#E5E5E5] rounded-xl p-4 text-[13px] text-[#666666] leading-relaxed">',
  '<div className="bg-white border border-[#E5E5E5] rounded-xl p-4" style={{ fontFamily: \'"Cormorant Garamond", serif\', fontStyle: \'normal\', fontWeight: 700, fontSize: \'24px\', lineHeight: \'32px\', color: \'#000000\' }}>'
);

// Second request: make the first letter capital in "how your order travels"
c = c.replace(
  '<em className="font-aston-script text-5xl md:text-7xl lowercase text-[#8A001A]">how your order travels</em>',
  '<em className="font-aston-script text-5xl md:text-7xl lowercase text-[#8A001A]" style={{ textTransform: \'none\' }}>How Your Order Travels</em>'
);
// Wait! If the class has "lowercase", I must remove it or override it!
// Let's just remove "lowercase" class from it and change the text.
c = c.replace(
  '<em className="font-aston-script text-5xl md:text-7xl lowercase text-[#8A001A]" style={{ textTransform: \'none\' }}>How Your Order Travels</em>',
  '<em className="font-aston-script text-5xl md:text-7xl text-[#8A001A]">How Your Order Travels</em>'
);
// Actually, let me just do this cleanly:
c = c.replace(
  /<em className="font-aston-script text-5xl md:text-7xl lowercase text-\[#8A001A\]">how your order travels<\/em>/,
  '<em className="font-aston-script text-5xl md:text-7xl text-[#8A001A]">How Your Order Travels</em>'
);


fs.writeFileSync('src/app/shipping/page.js', c);
console.log('Fonts updated successfully');
