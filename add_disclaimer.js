const fs = require('fs');

let c = fs.readFileSync('src/app/shipping/page.js', 'utf8');

const searchTarget = `                    ))}
                  </div>
                </div>
              </div>
            </FadeIn>`;

const replacement = `                    ))}
                  </div>
                  <p className="mt-8 text-[12px] md:text-[13px] text-[#666666] text-center italic opacity-80" style={{ fontFamily: "var(--font-dm-sans), sans-serif" }}>
                    (These are the primary components of the shipping cost. Additional minor operational charges may also be included where applicable.)
                  </p>
                </div>
              </div>
            </FadeIn>`;

if (c.includes(searchTarget)) {
    c = c.replace(searchTarget, replacement);
    fs.writeFileSync('src/app/shipping/page.js', c);
    console.log("Successfully added the disclaimer.");
} else {
    console.log("Could not find the target to replace.");
}
