"use client";
import { useState, useRef } from "react";
import { ArrowRight, Link, Zap } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const ORBIT_DURATION = "24s";
const RADIUS = 210; // px – used for desktop; mobile scales via CSS

export default function RadialOrbitalTimeline({ timelineData }) {
  const [expandedItem, setExpandedItem] = useState(null);
  const [paused, setPaused] = useState(false);
  const [pulseIds, setPulseIds] = useState([]);
  const containerRef = useRef(null);

  const totalNodes = timelineData.length;

  const handleContainerClick = (e) => {
    if (e.target === containerRef.current) {
      setExpandedItem(null);
      setPaused(false);
      setPulseIds([]);
    }
  };

  const toggleItem = (item) => {
    if (!item) return;
    if (expandedItem?.id === item.id) {
      setExpandedItem(null);
      setPaused(false);
      setPulseIds([]);
    } else {
      setExpandedItem(item);
      setPaused(true);
      setPulseIds(item.relatedIds || []);
    }
  };

  const getRelatedItem = (id) => timelineData.find((i) => i.id === id);

  const getStatusStyles = (status) => {
    switch (status) {
      case "completed":   return "text-white bg-black border-white";
      case "in-progress": return "text-black bg-white border-black";
      case "pending":     return "text-white bg-black/40 border-white/50";
      default:            return "text-[#1a1a1a] bg-[#FAFAF8] border-[#1a1a1a]/10";
    }
  };

  return (
    <>
      <style>{`
        @keyframes aviraOrbit {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        .avira-orbit-ring {
          animation: aviraOrbit ${ORBIT_DURATION} linear infinite;
          will-change: transform;
          transform-origin: 50% 50%;
        }
        .avira-orbit-ring.paused {
          animation-play-state: paused;
        }

        /* The ring and rings size */
        .avira-orbit-outer {
          width: ${RADIUS * 2}px;
          height: ${RADIUS * 2}px;
          border-radius: 9999px;
          border: 1px solid rgba(26,26,26,0.18);
          position: absolute;
        }
        .avira-orbit-inner {
          width: ${Math.round(RADIUS * 2 * 0.65)}px;
          height: ${Math.round(RADIUS * 2 * 0.65)}px;
          border-radius: 9999px;
          border: 1px solid rgba(26,26,26,0.10);
          position: absolute;
        }
        .avira-orbit-stage {
          width: ${RADIUS * 2}px;
          height: ${RADIUS * 2}px;
          position: absolute;
        }

        /* Mobile: shrink the orbit */
        @media (max-width: 640px) {
          .avira-orbit-outer  { width: 280px; height: 280px; }
          .avira-orbit-inner  { width: 182px; height: 182px; }
          .avira-orbit-stage  { width: 280px; height: 280px; }
        }
      `}</style>

      <div
        ref={containerRef}
        className="w-full flex flex-col items-center justify-center overflow-hidden py-8 sm:py-12"
        style={{ minHeight: 520 }}
        onClick={handleContainerClick}
      >
        {/* Stage — positions everything relative to centre */}
        <div className="relative flex items-center justify-center" style={{ minHeight: RADIUS * 2 + 80 }}>

          {/* Centre orb */}
          <div className="absolute z-20 w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-br from-[#1a1a1a] to-[#8A001A] animate-pulse flex items-center justify-center shadow-[0_0_30px_rgba(138,0,26,0.3)]">
            <div className="absolute w-20 h-20 rounded-full border border-[#8A001A]/20 animate-ping opacity-70" />
            <div className="absolute w-24 h-24 rounded-full border border-[#8A001A]/10 animate-ping opacity-50" style={{ animationDelay: "0.5s" }} />
            <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center">
              <div className="w-3 h-3 rounded-full bg-[#1a1a1a]" />
            </div>
          </div>

          {/* Decorative rings (static) */}
          <div className="avira-orbit-outer" />
          <div className="avira-orbit-inner" />

          {/* CSS-rotating ring that carries all nodes */}
          <div className={`avira-orbit-stage avira-orbit-ring${paused ? " paused" : ""}`}>
            {timelineData.map((item, index) => {
              const degPerNode = 360 / totalNodes;
              const nodeDeg = index * degPerNode;
              const isExpanded = expandedItem?.id === item.id;
              const isPulsing = pulseIds.includes(item.id);
              const Icon = item.icon;

              // Each node sits at top of ring, rotated to its slice
              // The node content counter-rotates so it reads upright
              return (
                <div
                  key={item.id}
                  className="absolute"
                  style={{
                    top: 0,
                    left: "50%",
                    transformOrigin: `0px ${RADIUS}px`,
                    transform: `translateX(-50%) rotate(${nodeDeg}deg)`,
                    cursor: "pointer",
                  }}
                  onClick={(e) => { e.stopPropagation(); toggleItem(item); }}
                >
                  {/* Counter-rotate so node UI stays upright */}
                  <div style={{ transform: `rotate(-${nodeDeg}deg)`, display: "flex", flexDirection: "column", alignItems: "center" }}>

                    {/* Node button */}
                    <div
                      className={`
                        relative w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center
                        border-2 transition-all duration-300
                        ${isExpanded
                          ? "bg-[#1a1a1a] text-white border-[#1a1a1a] shadow-2xl scale-125"
                          : isPulsing
                            ? "bg-white text-[#1a1a1a] border-[#8A001A] animate-pulse shadow-lg"
                            : "bg-[#FAFAF8] text-[#1a1a1a] border-[#1a1a1a]/10 hover:border-[#1a1a1a]/30 hover:scale-110"
                        }
                      `}
                    >
                      <Icon size={18} strokeWidth={2.5} />
                    </div>

                    {/* Node label */}
                    {!isExpanded && (
                      <div className="mt-2 whitespace-nowrap text-center text-[11px] sm:text-[12px] font-sans font-bold tracking-wide text-[#1a1a1a]">
                        {item.title}
                      </div>
                    )}

                    {/* Expanded info card */}
                    {isExpanded && (
                      <div
                        className="mt-3 z-50"
                        style={{ minWidth: "min(82vw, 288px)" }}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Card className="bg-white/97 backdrop-blur-xl border-[#1a1a1a]/10 shadow-2xl shadow-[#1a1a1a]/10 font-sans">
                          <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-px h-3 bg-[#1a1a1a]/20" />
                          <CardHeader className="pb-3 border-b border-[#1a1a1a]/5">
                            <Badge
                              variant="outline"
                              className={`px-2 py-0 h-5 text-[10px] uppercase tracking-wider font-sans rounded-sm w-fit ${getStatusStyles(item.status)}`}
                            >
                              {item.category}
                            </Badge>
                            <CardTitle className="text-base sm:text-lg font-sans font-bold text-[#1a1a1a] mt-2 leading-tight tracking-tight">
                              {item.title}
                            </CardTitle>
                          </CardHeader>

                          <CardContent className="pt-4 text-[13px] font-sans text-[#1a1a1a]/70 leading-relaxed font-light">
                            <p>{item.content}</p>

                            {item.relatedIds?.length > 0 && (
                              <div className="mt-5 pt-4 border-t border-[#1a1a1a]/5">
                                <div className="flex items-center mb-3">
                                  <Link size={13} className="text-[#1a1a1a]/40 mr-1.5" />
                                  <h4 className="text-[11px] uppercase tracking-widest font-bold text-[#1a1a1a]/40">
                                    Related Topics
                                  </h4>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                  {item.relatedIds.map((relId) => {
                                    const rel = getRelatedItem(relId);
                                    return (
                                      <Button
                                        key={relId}
                                        variant="outline"
                                        size="sm"
                                        className="flex items-center h-8 px-3 text-xs font-medium rounded-full border-[#1a1a1a]/15 bg-transparent hover:bg-[#F0F6F5] text-[#1a1a1a]/70 hover:text-[#1a1a1a] transition-all cursor-pointer"
                                        onClick={(e) => { e.stopPropagation(); toggleItem(rel); }}
                                      >
                                        {rel?.title}
                                        <ArrowRight size={11} className="ml-1.5 text-[#8A001A]" />
                                      </Button>
                                    );
                                  })}
                                </div>
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}
