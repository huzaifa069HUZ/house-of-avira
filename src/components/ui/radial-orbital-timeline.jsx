"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { ArrowRight, Link, Zap } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function RadialOrbitalTimeline({ timelineData }) {
  const [expandedItems, setExpandedItems] = useState({});
  const [rotationAngle, setRotationAngle] = useState(0);
  const [autoRotate, setAutoRotate] = useState(true);
  const [pulseEffect, setPulseEffect] = useState({});
  const [activeNodeId, setActiveNodeId] = useState(null);

  const containerRef = useRef(null);
  const orbitRef = useRef(null);
  const nodeRefs = useRef({});
  const angleRef = useRef(0);          // live angle without re-render lag
  const rafRef = useRef(null);
  const lastTimeRef = useRef(null);
  const autoRotateRef = useRef(true);   // shadow for raf closure

  // ── rAF-based rotation — smooth on every device ────────────
  const tick = useCallback((timestamp) => {
    if (!autoRotateRef.current) { rafRef.current = null; return; }
    if (lastTimeRef.current === null) lastTimeRef.current = timestamp;

    const delta = timestamp - lastTimeRef.current;
    lastTimeRef.current = timestamp;

    // ~0.3 deg / 50ms → 6 deg/s
    angleRef.current = (angleRef.current + (delta / 50) * 0.3) % 360;
    setRotationAngle(Number(angleRef.current.toFixed(3)));

    rafRef.current = requestAnimationFrame(tick);
  }, []);

  useEffect(() => {
    if (autoRotate) {
      autoRotateRef.current = true;
      lastTimeRef.current = null;
      rafRef.current = requestAnimationFrame(tick);
    } else {
      autoRotateRef.current = false;
      if (rafRef.current) { cancelAnimationFrame(rafRef.current); rafRef.current = null; }
    }
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [autoRotate, tick]);

  // ── click outside to reset ──────────────────────────────────
  const handleContainerClick = (e) => {
    if (e.target === containerRef.current || e.target === orbitRef.current) {
      setExpandedItems({});
      setActiveNodeId(null);
      setPulseEffect({});
      setAutoRotate(true);
      autoRotateRef.current = true;
    }
  };

  // ── toggle node ─────────────────────────────────────────────
  const toggleItem = (id) => {
    setExpandedItems((prev) => {
      const newState = {};
      Object.keys(prev).forEach((k) => { newState[parseInt(k)] = false; });
      newState[id] = !prev[id];

      if (!prev[id]) {
        setActiveNodeId(id);
        setAutoRotate(false);
        autoRotateRef.current = false;

        const related = getRelatedItems(id);
        const pulse = {};
        related.forEach((rid) => { pulse[rid] = true; });
        setPulseEffect(pulse);

        // snap rotation so node faces top
        const nodeIndex = timelineData.findIndex((item) => item.id === id);
        const total = timelineData.length;
        const targetAngle = (nodeIndex / total) * 360;
        const snapped = (270 - targetAngle + 360) % 360;
        angleRef.current = snapped;
        setRotationAngle(snapped);
      } else {
        setActiveNodeId(null);
        setAutoRotate(true);
        autoRotateRef.current = true;
        setPulseEffect({});
      }

      return newState;
    });
  };

  // ── position helpers ────────────────────────────────────────
  const calculateNodePosition = (index, total) => {
    const angle = ((index / total) * 360 + rotationAngle) % 360;
    const radius = 200;
    const radian = (angle * Math.PI) / 180;
    const x = radius * Math.cos(radian);
    const y = radius * Math.sin(radian);
    const zIndex = Math.round(100 + 50 * Math.cos(radian));
    const opacity = Math.max(0.4, Math.min(1, 0.4 + 0.6 * ((1 + Math.sin(radian)) / 2)));
    return { x, y, zIndex, opacity };
  };

  const getRelatedItems = (itemId) => {
    const item = timelineData.find((i) => i.id === itemId);
    return item ? item.relatedIds : [];
  };

  const isRelatedToActive = (itemId) => {
    if (!activeNodeId) return false;
    return getRelatedItems(activeNodeId).includes(itemId);
  };

  const getStatusStyles = (status) => {
    switch (status) {
      case "completed":   return "text-white bg-black border-white";
      case "in-progress": return "text-black bg-white border-black";
      case "pending":     return "text-white bg-black/40 border-white/50";
      default:            return "text-white bg-black/40 border-white/50";
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case "completed":   return "COMPLETE";
      case "in-progress": return "IN PROGRESS";
      default:            return "PENDING";
    }
  };

  // ── responsive radius ───────────────────────────────────────
  const isMobile = typeof window !== "undefined" && window.innerWidth < 640;
  const RADIUS_PX = 200; // matches calculateNodePosition radius above

  return (
    <div
      className="w-full flex flex-col items-center justify-center bg-black overflow-hidden"
      style={{ minHeight: "min(600px, 92vw)" }}
      ref={containerRef}
      onClick={handleContainerClick}
    >
      {/* Scale the whole orbital down on mobile via CSS transform */}
      <div
        className="relative flex items-center justify-center"
        style={{
          width: RADIUS_PX * 2 + 80,
          height: RADIUS_PX * 2 + 80,
          /* shrink to fit on narrow screens */
          transform: "scale(var(--orbital-scale, 1))",
          transformOrigin: "center center",
        }}
      >
        <style>{`
          @media (max-width: 639px)  { :root { --orbital-scale: 0.62; } }
          @media (min-width: 640px) and (max-width: 1023px) { :root { --orbital-scale: 0.82; } }
          @media (min-width: 1024px) { :root { --orbital-scale: 1; } }
        `}</style>

        {/* ── orbitRef: the centred plane all nodes live on ── */}
        <div
          ref={orbitRef}
          className="absolute inset-0 flex items-center justify-center"
          style={{ perspective: "1000px" }}
        >
          {/* Centre orb */}
          <div className="absolute w-16 h-16 rounded-full bg-gradient-to-br from-[#1a1a1a] to-[#8A001A] animate-pulse flex items-center justify-center z-10 shadow-[0_0_30px_rgba(138,0,26,0.4)]">
            <div className="absolute w-20 h-20 rounded-full border border-[#8A001A]/30 animate-ping opacity-70" />
            <div className="absolute w-24 h-24 rounded-full border border-[#8A001A]/15 animate-ping opacity-50" style={{ animationDelay: "0.5s" }} />
            <div className="w-8 h-8 rounded-full bg-white/80 backdrop-blur-md" />
          </div>

          {/* Orbital rings */}
          <div className="absolute rounded-full border border-white/10" style={{ width: RADIUS_PX * 2, height: RADIUS_PX * 2 }} />
          <div className="absolute rounded-full border border-white/5"  style={{ width: RADIUS_PX * 1.5, height: RADIUS_PX * 1.5 }} />

          {/* Nodes */}
          {timelineData.map((item, index) => {
            const position   = calculateNodePosition(index, timelineData.length);
            const isExpanded = !!expandedItems[item.id];
            const isRelated  = isRelatedToActive(item.id);
            const isPulsing  = !!pulseEffect[item.id];
            const Icon       = item.icon;

            return (
              <div
                key={item.id}
                ref={(el) => (nodeRefs.current[item.id] = el)}
                className="absolute transition-all duration-700 cursor-pointer"
                style={{
                  transform: `translate(${position.x}px, ${position.y}px)`,
                  zIndex: isExpanded ? 200 : position.zIndex,
                  opacity: isExpanded ? 1 : position.opacity,
                }}
                onClick={(e) => { e.stopPropagation(); toggleItem(item.id); }}
              >
                {/* Pulse aura */}
                <div
                  className={`absolute rounded-full -inset-1 ${isPulsing ? "animate-pulse" : ""}`}
                  style={{
                    background: "radial-gradient(circle, rgba(138,0,26,0.25) 0%, rgba(255,255,255,0) 70%)",
                    width: `${item.energy * 0.5 + 40}px`,
                    height: `${item.energy * 0.5 + 40}px`,
                    left: `-${(item.energy * 0.5) / 2}px`,
                    top: `-${(item.energy * 0.5) / 2}px`,
                  }}
                />

                {/* Icon button */}
                <div className={`
                  w-10 h-10 rounded-full flex items-center justify-center
                  border-2 transition-all duration-300 transform
                  ${isExpanded
                    ? "bg-white text-black border-white shadow-lg shadow-white/30 scale-150"
                    : isRelated
                      ? "bg-white/50 text-black border-white animate-pulse"
                      : "bg-black text-white border-white/40 hover:scale-110"
                  }
                `}>
                  <Icon size={16} />
                </div>

                {/* Label */}
                <div className={`
                  absolute top-12 left-1/2 -translate-x-1/2 whitespace-nowrap text-center
                  text-xs font-semibold tracking-wider transition-all duration-300
                  ${isExpanded ? "text-white scale-125" : "text-white/70"}
                `}>
                  {item.title}
                </div>

                {/* Expanded card */}
                {isExpanded && (
                  <Card className="absolute top-20 left-1/2 -translate-x-1/2 w-64 bg-black/90 backdrop-blur-lg border-white/30 shadow-xl shadow-white/10 overflow-visible z-50 font-sans">
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-px h-3 bg-white/50" />

                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-center">
                        <Badge className={`px-2 text-xs ${getStatusStyles(item.status)}`}>
                          {getStatusLabel(item.status)}
                        </Badge>
                        <span className="text-xs font-mono text-white/50">{item.date}</span>
                      </div>
                      <CardTitle className="text-sm mt-2 text-white">
                        {item.title}
                      </CardTitle>
                    </CardHeader>

                    <CardContent className="text-xs text-white/80">
                      <p>{item.content}</p>

                      {/* Energy bar */}
                      <div className="mt-4 pt-3 border-t border-white/10">
                        <div className="flex justify-between items-center text-xs mb-1">
                          <span className="flex items-center text-white/70">
                            <Zap size={10} className="mr-1" /> Energy Level
                          </span>
                          <span className="font-mono text-white/70">{item.energy}%</span>
                        </div>
                        <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-[#8A001A] to-[#ff4d6d]"
                            style={{ width: `${item.energy}%` }}
                          />
                        </div>
                      </div>

                      {/* Related Topics */}
                      {item.relatedIds?.length > 0 && (
                        <div className="mt-4 pt-3 border-t border-white/10">
                          <div className="flex items-center mb-2">
                            <Link size={10} className="text-white/70 mr-1" />
                            <h4 className="text-xs uppercase tracking-wider font-medium text-white/70">
                              Related Topics
                            </h4>
                          </div>
                          <div className="flex flex-wrap gap-1.5">
                            {item.relatedIds.map((relatedId) => {
                              const rel = timelineData.find((i) => i.id === relatedId);
                              return (
                                <Button
                                  key={relatedId}
                                  variant="outline"
                                  size="sm"
                                  className="flex items-center h-7 px-2.5 text-[11px] rounded-none border-white/20 bg-transparent hover:bg-white/10 text-white/80 hover:text-white transition-all cursor-pointer"
                                  onClick={(e) => { e.stopPropagation(); toggleItem(relatedId); }}
                                >
                                  {rel?.title}
                                  <ArrowRight size={9} className="ml-1 text-white/60" />
                                </Button>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
