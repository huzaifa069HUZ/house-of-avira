"use client";
import { useState, useEffect, useRef } from "react";
import { ArrowRight, Link, Zap } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function RadialOrbitalTimeline({ timelineData }) {
  const [expandedItems, setExpandedItems] = useState({});
  const [viewMode, setViewMode] = useState("orbital");
  const [rotationAngle, setRotationAngle] = useState(0);
  const [autoRotate, setAutoRotate] = useState(true);
  const [pulseEffect, setPulseEffect] = useState({});
  const [centerOffset, setCenterOffset] = useState({ x: 0, y: 0 });
  const [activeNodeId, setActiveNodeId] = useState(null);
  
  const containerRef = useRef(null);
  const orbitRef = useRef(null);
  const nodeRefs = useRef({});

  const handleContainerClick = (e) => {
    if (e.target === containerRef.current || e.target === orbitRef.current) {
      setExpandedItems({});
      setActiveNodeId(null);
      setPulseEffect({});
      setAutoRotate(true);
    }
  };

  const toggleItem = (id) => {
    setExpandedItems((prev) => {
      const newState = { ...prev };
      Object.keys(newState).forEach((key) => {
        if (parseInt(key) !== id) {
          newState[parseInt(key)] = false;
        }
      });

      newState[id] = !prev[id];

      if (!prev[id]) {
        setActiveNodeId(id);
        setAutoRotate(false);

        const relatedItems = getRelatedItems(id);
        const newPulseEffect = {};
        relatedItems.forEach((relId) => {
          newPulseEffect[relId] = true;
        });
        setPulseEffect(newPulseEffect);

        centerViewOnNode(id);
      } else {
        setActiveNodeId(null);
        setAutoRotate(true);
        setPulseEffect({});
      }

      return newState;
    });
  };

  useEffect(() => {
    let rotationTimer;

    if (autoRotate && viewMode === "orbital") {
      rotationTimer = setInterval(() => {
        setRotationAngle((prev) => {
          const newAngle = (prev + 0.3) % 360;
          return Number(newAngle.toFixed(3));
        });
      }, 50);
    }

    return () => {
      if (rotationTimer) {
        clearInterval(rotationTimer);
      }
    };
  }, [autoRotate, viewMode]);

  const centerViewOnNode = (nodeId) => {
    if (viewMode !== "orbital" || !nodeRefs.current[nodeId]) return;

    const nodeIndex = timelineData.findIndex((item) => item.id === nodeId);
    const totalNodes = timelineData.length;
    const targetAngle = (nodeIndex / totalNodes) * 360;

    setRotationAngle(270 - targetAngle);
  };

  const calculateNodePosition = (index, total) => {
    const angle = ((index / total) * 360 + rotationAngle) % 360;
    const radius = 220;
    const radian = (angle * Math.PI) / 180;

    const x = radius * Math.cos(radian) + centerOffset.x;
    const y = radius * Math.sin(radian) + centerOffset.y;

    const zIndex = Math.round(100 + 50 * Math.cos(radian));
    const opacity = Math.max(
      0.4,
      Math.min(1, 0.4 + 0.6 * ((1 + Math.sin(radian)) / 2))
    );

    return { x, y, angle, zIndex, opacity };
  };

  const getRelatedItems = (itemId) => {
    const currentItem = timelineData.find((item) => item.id === itemId);
    return currentItem ? currentItem.relatedIds : [];
  };

  const isRelatedToActive = (itemId) => {
    if (!activeNodeId) return false;
    const relatedItems = getRelatedItems(activeNodeId);
    return relatedItems.includes(itemId);
  };

  const getStatusStyles = (status) => {
    switch (status) {
      case "completed":
        return "text-white bg-black border-white";
      case "in-progress":
        return "text-black bg-white border-black";
      case "pending":
        return "text-white bg-black/40 border-white/50";
      default:
        return "text-[#1a1a1a] bg-[#FAFAF8] border-[#1a1a1a]/10";
    }
  };

  return (
    <div
      className="w-full h-[600px] flex flex-col items-center justify-center bg-transparent overflow-hidden py-12"
      ref={containerRef}
      onClick={handleContainerClick}
    >
      <div className="relative w-full max-w-4xl h-full flex items-center justify-center">
        <div
          className="absolute w-full h-full flex items-center justify-center"
          ref={orbitRef}
          style={{
            perspective: "1000px",
            transform: `translate(${centerOffset.x}px, ${centerOffset.y}px)`,
          }}
        >
          {/* Center orb */}
          <div className="absolute w-16 h-16 rounded-full bg-gradient-to-br from-[#1a1a1a] to-[#8A001A] animate-pulse flex items-center justify-center z-10 shadow-[0_0_30px_rgba(138,0,26,0.3)]">
            <div className="absolute w-20 h-20 rounded-full border border-[#8A001A]/20 animate-ping opacity-70"></div>
            <div
              className="absolute w-24 h-24 rounded-full border border-[#8A001A]/10 animate-ping opacity-50"
              style={{ animationDelay: "0.5s" }}
            ></div>
            <div className="w-8 h-8 rounded-full bg-white backdrop-blur-md shadow-inner flex items-center justify-center">
               <div className="w-3 h-3 rounded-full bg-[#1a1a1a]"></div>
            </div>
          </div>

          {/* Orbital path rings */}
          <div className="absolute w-[440px] h-[440px] rounded-full border border-[#1a1a1a]/20"></div>
          <div className="absolute w-[300px] h-[300px] rounded-full border border-[#1a1a1a]/15"></div>

          {timelineData.map((item, index) => {
            const position = calculateNodePosition(index, timelineData.length);
            const isExpanded = expandedItems[item.id];
            const isRelated = isRelatedToActive(item.id);
            const isPulsing = pulseEffect[item.id];
            const Icon = item.icon;

            const nodeStyle = {
              transform: `translate(${position.x}px, ${position.y}px)`,
              zIndex: isExpanded ? 200 : position.zIndex,
              opacity: isExpanded ? 1 : position.opacity,
            };

            return (
              <div
                key={item.id}
                ref={(el) => (nodeRefs.current[item.id] = el)}
                className="absolute transition-all duration-700 cursor-pointer"
                style={nodeStyle}
                onClick={(e) => {
                  e.stopPropagation();
                  toggleItem(item.id);
                }}
              >
                <div
                  className={`absolute rounded-full -inset-1 ${
                    isPulsing ? "animate-pulse duration-1000" : ""
                  }`}
                  style={{
                    background: `radial-gradient(circle, rgba(138,0,26,0.1) 0%, rgba(255,255,255,0) 70%)`,
                    width: `${item.energy * 0.5 + 40}px`,
                    height: `${item.energy * 0.5 + 40}px`,
                    left: `-${(item.energy * 0.5 + 40 - 40) / 2}px`,
                    top: `-${(item.energy * 0.5 + 40 - 40) / 2}px`,
                  }}
                ></div>

                <div
                  className={`
                  w-12 h-12 rounded-full flex items-center justify-center
                  ${
                    isExpanded
                      ? "bg-[#1a1a1a] text-white"
                      : isRelated
                      ? "bg-white text-[#1a1a1a] shadow-lg"
                      : "bg-[#FAFAF8] text-[#1a1a1a]"
                  }
                  border-2 
                  ${
                    isExpanded
                      ? "border-[#1a1a1a] shadow-2xl shadow-[#1a1a1a]/20"
                      : isRelated
                      ? "border-[#8A001A] animate-pulse"
                      : "border-[#1a1a1a]/10 hover:border-[#1a1a1a]/30"
                  }
                  transition-all duration-300 transform
                  ${isExpanded ? "scale-[1.3]" : "hover:scale-110"}
                `}
                >
                  <Icon size={24} strokeWidth={2.5} />
                </div>

                <div
                  className={`
                  absolute top-14 whitespace-nowrap text-center left-1/2 -translate-x-1/2
                  text-sm font-sans tracking-wide font-bold
                  transition-all duration-300
                  ${isExpanded ? "text-[#1a1a1a] scale-110 opacity-0 pointer-events-none" : "text-[#1a1a1a] opacity-100"}
                `}
                >
                  {item.title}
                </div>

                {isExpanded && (
                  <Card className="absolute top-20 left-1/2 -translate-x-1/2 w-72 bg-white/95 backdrop-blur-xl border-[#1a1a1a]/10 shadow-2xl shadow-[#1a1a1a]/10 overflow-visible z-50">
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-px h-4 bg-[#1a1a1a]/20"></div>
                    <CardHeader className="pb-3 border-b border-[#1a1a1a]/5">
                      <div className="flex justify-between items-center mb-1">
                        <Badge
                          variant="outline"
                          className={`px-2 py-0 h-5 text-[10px] uppercase tracking-wider font-sans rounded-sm ${getStatusStyles(
                            item.status
                          )}`}
                        >
                          {item.category}
                        </Badge>
                      </div>
                      <CardTitle className="text-xl font-perandory text-[#1a1a1a] mt-2 leading-tight">
                        {item.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-4 text-sm font-sans text-[#1a1a1a]/70 leading-relaxed font-light">
                      <p>{item.content}</p>

                      {item.relatedIds && item.relatedIds.length > 0 && (
                        <div className="mt-5 pt-4 border-t border-[#1a1a1a]/5">
                          <div className="flex items-center mb-2">
                            <Link size={12} className="text-[#1a1a1a]/40 mr-1.5" />
                            <h4 className="text-[10px] uppercase tracking-widest font-bold text-[#1a1a1a]/40">
                              Related Topics
                            </h4>
                          </div>
                          <div className="flex flex-wrap gap-1.5 mt-2">
                            {item.relatedIds.map((relatedId) => {
                              const relatedItem = timelineData.find(
                                (i) => i.id === relatedId
                              );
                              return (
                                <Button
                                  key={relatedId}
                                  variant="outline"
                                  size="sm"
                                  className="flex items-center h-7 px-2.5 py-0 text-[10px] font-sans font-medium rounded-full border-[#1a1a1a]/10 bg-transparent hover:bg-[#F0F6F5] text-[#1a1a1a]/70 hover:text-[#1a1a1a] transition-all cursor-pointer z-50"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    toggleItem(relatedId);
                                  }}
                                >
                                  {relatedItem?.title}
                                  <ArrowRight
                                    size={10}
                                    className="ml-1.5 text-[#8A001A]"
                                  />
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
