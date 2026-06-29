{/* Diagram */}
          <FadeIn delay={0.1}>
            <style dangerouslySetInnerHTML={{__html: `
              @keyframes flow {
                to { stroke-dashoffset: -12; }
              }
              .animate-flow { animation: flow 1s linear infinite; }
            `}} />
            <div className="bg-white border border-[#E5E5E5]/50 rounded-[32px] p-6 md:p-12 mb-12 shadow-[0_8px_30px_rgb(0,0,0,0.04)] relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-[#FAFAFA] rounded-full blur-3xl opacity-50 -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
              
              <h3 className="font-sans font-black tracking-tight text-2xl md:text-3xl text-center text-[#000000] mb-12 relative z-10">
                International + Domestic Flow
              </h3>
              
              {/* Tier 1 */}
              <div className="flex flex-col md:flex-row items-center gap-6 md:gap-0 mb-12 relative z-10">
                <div className="w-full md:w-[240px] shrink-0 bg-white border border-[#E5E5E5] rounded-[24px] p-5 text-center overflow-hidden relative group shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgba(138,0,26,0.15)] hover:-translate-y-1 transition-all duration-300 z-10">
                  <div className="absolute top-4 right-4 w-2 h-2 rounded-full bg-[#8A001A] animate-pulse"></div>
                  <div className="w-full h-[120px] rounded-xl overflow-hidden mb-5 relative ring-1 ring-black/5">
                    <Image src="/shipping/international.png" alt="International Shipping" fill className="object-cover group-hover:scale-110 transition-transform duration-700" />
                  </div>
                  <div className="text-[15px] font-extrabold tracking-tight text-[#000000] leading-snug">Suppliers &amp; Manufacturers</div>
                  <div className="text-[11px] text-[#999999] mt-1.5 font-bold tracking-[0.2em] uppercase">Abroad</div>
                </div>
                
                <div className="flex-1 flex flex-col items-center px-4 w-full relative min-h-[80px] md:min-h-0 justify-center">
                  <svg className="hidden md:block absolute top-1/2 left-0 w-full h-[2px] -translate-y-1/2 z-0" preserveAspectRatio="none">
                    <line x1="0" y1="1" x2="100%" y2="1" stroke="#E5E5E5" strokeWidth="2" strokeDasharray="6 6" className="animate-flow" />
                  </svg>
                  <div className="md:hidden absolute left-1/2 top-0 w-[2px] h-full -translate-x-1/2 z-0">
                    <line x1="1" y1="0" x2="1" y2="100%" stroke="#E5E5E5" strokeWidth="2" strokeDasharray="6 6" className="animate-flow" />
                  </div>
                  
                  <div className="bg-white border-2 border-[#8A001A] rounded-xl p-4 w-full md:w-[85%] text-center relative z-10 shadow-[0_8px_30px_rgba(138,0,26,0.12)] group hover:-translate-y-1 transition-all duration-300">
                    <div className="text-[13px] font-extrabold tracking-tight text-[#8A001A] mb-1.5 flex items-center justify-center gap-2">
                      <Plane className="w-4 h-4" /> International Shipping
                    </div>
                    <div className="text-[12px] text-[#666666] font-medium leading-relaxed">Cost split equally among all customers. Charged separately.</div>
                  </div>
                </div>

                <div className="w-full md:w-[180px] shrink-0 bg-white border border-[#E5E5E5] rounded-[24px] p-6 text-center shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgba(138,0,26,0.15)] hover:-translate-y-1 transition-all duration-300 z-10 relative group">
                  <div className="w-14 h-14 mx-auto bg-gradient-to-br from-[#FAFAFA] to-[#FFFFFF] rounded-full flex items-center justify-center mb-4 ring-1 ring-[#E5E5E5]/50 shadow-inner group-hover:scale-110 transition-transform duration-300">
                    <Home className="w-6 h-6 text-[#8A001A]" />
                  </div>
                  <div className="text-[15px] font-extrabold tracking-tight text-[#000000] leading-snug">House of Avira</div>
                  <div className="text-[11px] text-[#999999] mt-1.5 font-bold tracking-[0.2em] uppercase">India</div>
                </div>
              </div>

              {/* Separator */}
              <div className="flex items-center gap-3 my-6">
                <div className="flex-1 h-px bg-[#E5E5E5]"></div>
                <div className="bg-[#000000] text-white rounded-full text-[9px] font-semibold px-3 py-1 tracking-widest uppercase shadow-sm">Arrives in India &middot; Customs Cleared</div>
                <div className="flex-1 h-px bg-[#E5E5E5]"></div>
              </div>

              {/* Tier 2 */}
              <div className="flex flex-col md:flex-row items-center gap-6 md:gap-0 relative z-10">
                <div className="w-full md:w-[180px] shrink-0 bg-white border border-[#E5E5E5] rounded-[24px] p-6 text-center shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.15)] hover:-translate-y-1 transition-all duration-300 z-10 relative group">
                  <div className="w-14 h-14 mx-auto bg-gradient-to-br from-[#FAFAFA] to-white rounded-full flex items-center justify-center mb-4 ring-1 ring-[#E5E5E5]/50 shadow-inner group-hover:scale-110 transition-transform duration-300">
                    <Home className="w-6 h-6 text-[#000000]" />
                  </div>
                  <div className="text-[15px] font-extrabold tracking-tight text-[#000000] leading-snug">House of Avira</div>
                  <div className="text-[11px] text-[#999999] mt-1.5 font-bold tracking-[0.2em] uppercase">India</div>
                </div>
                
                <div className="flex-1 flex flex-col items-center px-4 w-full relative min-h-[80px] md:min-h-0 justify-center">
                  <svg className="hidden md:block absolute top-1/2 left-0 w-full h-[2px] -translate-y-1/2 z-0" preserveAspectRatio="none">
                    <line x1="0" y1="1" x2="100%" y2="1" stroke="#E5E5E5" strokeWidth="2" strokeDasharray="6 6" className="animate-flow" />
                  </svg>
                  <div className="md:hidden absolute left-1/2 top-0 w-[2px] h-full -translate-x-1/2 z-0">
                    <line x1="1" y1="0" x2="1" y2="100%" stroke="#E5E5E5" strokeWidth="2" strokeDasharray="6 6" className="animate-flow" />
                  </div>
                  
                  <div className="bg-white border-2 border-[#8A001A] rounded-xl p-4 w-full md:w-[85%] text-center relative z-10 shadow-[0_8px_30px_rgba(138,0,26,0.12)] group hover:-translate-y-1 transition-all duration-300">
                    <div className="text-[13px] font-extrabold tracking-tight text-[#8A001A] mb-1.5 flex items-center justify-center gap-2">
                      <Truck className="w-4 h-4" /> Domestic Shipping
                    </div>
                    <div className="text-[12px] text-[#666666] font-medium leading-relaxed">Cost based on pincode & weight. Charged before dispatch.</div>
                  </div>
                </div>

                <div className="w-full md:w-[240px] shrink-0 bg-white border border-[#E5E5E5] rounded-[24px] p-5 text-center overflow-hidden relative group shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.15)] hover:-translate-y-1 transition-all duration-300 z-10">
                  <div className="absolute top-4 right-4 w-2 h-2 rounded-full bg-[#000000] animate-pulse"></div>
                  <div className="w-full h-[120px] rounded-xl overflow-hidden mb-5 relative ring-1 ring-black/5">
                    <Image src="/shipping/domestic.png" alt="Domestic Shipping" fill className="object-cover group-hover:scale-110 transition-transform duration-700" />
                  </div>
                  <div className="text-[15px] font-extrabold tracking-tight text-[#000000] leading-snug">You</div>
                  <div className="text-[11px] text-[#999999] mt-1.5 font-bold tracking-[0.2em] uppercase">Your doorstep</div>
                </div>
              </div>

              <div className="bg-[#FAFAFA] border border-[#E5E5E5] rounded-xl p-6 mt-8 shadow-sm">
                <h4 className="text-[18px] font-perandory font-bold text-[#8A001A] mb-2">Why wait for the batch date?</h4>
                <p className="text-[14px] text-[#444444] leading-relaxed font-dm-sans" style={{ fontFamily: "var(--font-dm-sans), sans-serif" }}>
                  When multiple people place orders, we pack them together into one large international shipment. Once this shipment arrives in India, the total delivery cost is distributed precisely according to the weight and category of your items. This ensures you <strong>only pay the real, un-marked-up shipping price</strong>.
                </p>
              </div>

              