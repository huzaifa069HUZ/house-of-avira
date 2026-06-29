const fs = require('fs');

let c = fs.readFileSync('src/app/shipping/page.js', 'utf8');
const lines = c.split(/\r?\n/);

const idx = lines.findIndex(l => l.includes('Your Order Timeline'));
if (idx !== -1) {
    // The structure before "Your Order Timeline" is:
    //                   </div>
    //                 </div>
    //               </div>
    //             </FadeIn>
    //   
    //             <FadeIn delay={0.2}>
    //               <div className="text-[11px] tracking-[0.12em] uppercase text-[#8A001A] font-medium mb-2 mt-16">Your Order Timeline</div>
    
    // We want to insert the disclaimer 4 lines above the FadeIn
    // Let's find the `</div>` that closes the grid.
    
    // Walk backwards from idx to find `</div>` `</div>` `</div>` `</FadeIn>`
    let fadeOutIdx = -1;
    for (let i = idx; i >= 0; i--) {
        if (lines[i].includes('</FadeIn>')) {
            fadeOutIdx = i;
            break;
        }
    }
    
    if (fadeOutIdx !== -1) {
        // Insert right above the first </div> before </FadeIn>
        // Wait, the structure is:
        //                   </div>
        //                 </div>
        //               </div>
        //             </FadeIn>
        const disclaimer = `                  <p className="mt-8 text-[12px] md:text-[13px] text-[#666666] text-center" style={{ fontFamily: "var(--font-dm-sans), sans-serif" }}>
                    (These are the primary components of the shipping cost. Additional minor operational charges may also be included where applicable.)
                  </p>`;
        
        // Let's just insert it 3 lines before fadeOutIdx, which is after the grid's closing </div>
        lines.splice(fadeOutIdx - 2, 0, disclaimer);
        fs.writeFileSync('src/app/shipping/page.js', lines.join('\n'));
        console.log("Successfully inserted disclaimer!");
    } else {
        console.log("Could not find </FadeIn> before Your Order Timeline");
    }
} else {
    console.log("Could not find Your Order Timeline");
}
