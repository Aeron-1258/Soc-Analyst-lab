import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, Shield, ShieldAlert } from 'lucide-react';

const ThreatMapComponent = ({ threats, isMitigating }) => {
  // Realistic world map paths (approximate continent shapes)
  const worldPaths = [
    // North America
    "M 10 20 L 25 20 L 30 30 L 25 45 L 15 45 L 10 35 Z",
    // South America
    "M 25 50 L 32 50 L 30 75 L 25 85 L 22 70 Z",
    // Europe & Asia (Eurasia)
    "M 45 15 L 65 15 L 85 25 L 90 45 L 75 55 L 55 55 L 45 40 Z",
    // Africa
    "M 45 45 L 55 45 L 60 65 L 55 75 L 45 70 L 42 55 Z",
    // Australia
    "M 75 65 L 85 65 L 88 75 L 80 80 L 72 75 Z",
    // Greenland
    "M 35 10 L 42 10 L 40 18 L 33 15 Z"
  ];

  // Generate background grid/hex effect
  const gridDots = useMemo(() => {
    const dots = [];
    for (let i = 0; i < 25; i++) {
      for (let j = 0; j < 15; j++) {
        dots.push({ x: i * 4, y: j * 7 });
      }
    }
    return dots;
  }, []);

  return (
    <div className="w-full h-full relative bg-[#0A0A0A] overflow-hidden border border-[#2A2A2A] rounded-lg group font-sans">
      {/* 1. Background Grid */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <defs>
            <pattern id="gridMap" width="8" height="8" patternUnits="userSpaceOnUse">
              <path d="M 8 0 L 0 0 0 8" fill="none" stroke="#2A2A2A" strokeWidth="0.1" />
            </pattern>
          </defs>
          <rect width="100" height="100" fill="url(#gridMap)" />
          {gridDots.map((dot, i) => (
            <circle key={i} cx={dot.x} cy={dot.y} r="0.12" fill="#555" />
          ))}
        </svg>
      </div>

      {/* 2. World Map Continents */}
      <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full opacity-65">
        {worldPaths.map((path, i) => (
          <path 
            key={i} 
            d={path} 
            fill="#171717" 
            stroke="#2A2A2A" 
            strokeWidth="0.25"
            className="transition-all duration-500"
          />
        ))}
      </svg>

      {/* 3. Target Node (HQ) - Clean dot indicator without neon shadow */}
      <div className="absolute top-[40%] left-[25%] -translate-x-1/2 -translate-y-1/2 w-6 h-6 z-10">
        <div className={`absolute inset-0 rounded-full border border-[#2A2A2A] flex items-center justify-center bg-[#1E1E1E] shadow-sm`}>
          <Shield size={8} className={isMitigating ? 'text-[#16A34A]' : 'text-[#4F46E5]'} />
        </div>
      </div>

      {/* 4. Attack Visualizations */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none z-10" viewBox="0 0 100 100">
        <AnimatePresence>
          {threats.map((threat) => {
            // Coordinate mapping (HQ is at 25, 40)
            const hqX = 25;
            const hqY = 40;
            const x = ((threat.from.lng + 180) / 360) * 100;
            const y = ((90 - threat.from.lat) / 180) * 100;
            const isCritical = threat.severity === 'Critical';
            
            return (
              <g key={threat.id}>
                {/* Attacker Node Ripple */}
                <motion.circle
                  initial={{ r: 0, opacity: 0 }}
                  animate={{ r: 2.5, opacity: [0, 0.3, 0] }}
                  transition={{ duration: 2.5, repeat: Infinity }}
                  cx={x} cy={y}
                  fill={isCritical ? '#DC2626' : '#4F46E5'}
                />

                {/* Attacker Node */}
                <motion.circle
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  cx={x} cy={y} r="0.6"
                  fill={isCritical ? '#DC2626' : '#4F46E5'}
                />
                
                {/* Attack Path Arc - clean gray vectors */}
                <motion.path
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: isMitigating ? 0.1 : 0.4 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 1.5, ease: "easeInOut" }}
                  d={`M ${x} ${y} Q ${(x + hqX) / 2} ${(y + hqY) / 2 - 15} ${hqX} ${hqY}`}
                  stroke={isCritical ? '#DC2626' : '#4F46E5'}
                  strokeWidth="0.25"
                  fill="none"
                />

                {/* Particle Animation (Packet) - minimal white dot */}
                <motion.circle r="0.25" fill="#FAFAFA">
                  <animateMotion 
                    dur="3s" 
                    repeatCount="indefinite" 
                    path={`M ${x} ${y} Q ${(x + hqX) / 2} ${(y + hqY) / 2 - 15} ${hqX} ${hqY}`} 
                  />
                </motion.circle>
              </g>
            );
          })}
        </AnimatePresence>
      </svg>

      {/* 5. Threat Intel Overlay (Real-time feed) */}
      <div className="absolute top-4 right-4 w-44 bg-[#171717] border border-[#2A2A2A] rounded-lg p-3 shadow-lg pointer-events-none z-20">
        <div className="flex items-center gap-2 mb-2 pb-1.5 border-b border-[#2A2A2A]">
          <Activity size={10} className="text-[#4F46E5]" />
          <span className="text-[9px] font-bold text-[#FAFAFA] uppercase tracking-wider">Telemetry Logs</span>
        </div>
        <div className="space-y-1.5">
          {threats.slice(-3).reverse().map((threat) => (
            <motion.div 
              key={threat.id}
              initial={{ opacity: 0, x: 5 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex flex-col gap-0.5"
            >
              <div className="flex items-center justify-between text-[8px]">
                <span className={`font-semibold uppercase ${threat.severity === 'Critical' ? 'text-[#DC2626]' : 'text-[#4F46E5]'}`}>
                  {threat.type?.split(' ')[0] || 'INTRUSION'}
                </span>
                <span className="text-[#A3A3A3]">
                  {threat.from.country}
                </span>
              </div>
              <div className="text-[8px] text-[#A3A3A3]/65 font-mono truncate">
                {threat.from.ip}
              </div>
            </motion.div>
          ))}
          {threats.length === 0 && (
            <div className="text-[8px] text-[#A3A3A3] italic text-center py-2">
              Monitoring vectors...
            </div>
          )}
        </div>
      </div>

      {/* 6. Map Status Legend */}
      <div className="absolute bottom-4 left-4 flex flex-col gap-1.5 z-20">
        <div className="flex items-center gap-2.5 bg-[#171717] border border-[#2A2A2A] px-2.5 py-1.5 rounded-lg shadow-md">
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 bg-[#4F46E5] rounded-full"></div>
            <span className="text-[8px] text-[#FAFAFA] font-bold tracking-wider">SYS_UP</span>
          </div>
          <div className="w-px h-3 bg-[#2A2A2A]"></div>
          <div className="flex items-center gap-1.5">
            <span className="text-[8px] text-[#A3A3A3]">NODES:</span>
            <span className="text-[8px] text-[#16A34A] font-bold">ONLINE</span>
          </div>
        </div>
        
        {isMitigating && (
          <motion.div 
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-1.5 bg-[#16A34A]/5 border border-[#16A34A]/25 px-2.5 py-1 rounded-lg text-[#16A34A] shadow-md"
          >
            <Shield size={10} />
            <span className="text-[8px] font-bold uppercase tracking-wider">Mitigation Shield Active</span>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default ThreatMapComponent;
