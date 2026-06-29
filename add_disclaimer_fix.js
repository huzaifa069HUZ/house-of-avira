const fs = require('fs');

let c = fs.readFileSync('src/app/shipping/page.js', 'utf8');

const targetStr = `                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </FadeIn>`;

const replaceStr = `                      </div>
                    ))}
                  </div>
                  <p className="mt-8 text-[12px] md:text-[13px] text-[#666666] text-center" style={{ fontFamily: "var(--font-dm-sans), sans-serif" }}>
                    (These are the primary components of the shipping cost. Additional minor operational charges may also be included where applicable.)
                  </p>
                </div>
              </div>
            </FadeIn>`;

if (c.includes(targetStr)) {
    c = c.replace(targetStr, replaceStr);
    fs.writeFileSync('src/app/shipping/page.js', c);
    console.log("Replaced successfully!");
} else {
    // try a regex approach
    const regex = /                    \}\)\)\}\r?\n                  <\/div>\r?\n                <\/div>\r?\n              <\/div>\r?\n            <\/FadeIn>/;
    
    if (regex.test(c)) {
        c = c.replace(regex, replaceStr);
        fs.writeFileSync('src/app/shipping/page.js', c);
        console.log("Replaced successfully using regex!");
    } else {
        console.log("Could not find the target to replace.");
    }
}
