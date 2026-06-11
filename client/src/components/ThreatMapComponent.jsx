import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, Shield, ShieldAlert, Target } from 'lucide-react';

const ThreatMapComponent = ({ threats, isMitigating }) => {
  // Simplified realistic world map paths (approximate continent shapes)
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
    <div className="w-full h-full relative bg-[#050505] overflow-hidden border border-white/5 rounded-2xl group">
      {/* 1. Background Grid & Scanning Lines */}
      <div className="absolute inset-0 opacity-15 pointer-events-none">
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <defs>
            <pattern id="gridMap" width="8" height="8" patternUnits="userSpaceOnUse">
              <path d="M 8 0 L 0 0 0 8" fill="none" stroke="#222" strokeWidth="0.1" />
            </pattern>
          </defs>
          <rect width="100" height="100" fill="url(#gridMap)" />
          {gridDots.map((dot, i) => (
            <circle key={i} cx={dot.x} cy={dot.y} r="0.12" fill="#444" />
          ))}
        </svg>
      </div>

      {/* 2. World Map Continents */}
      <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full opacity-45">
        <defs>
          <linearGradient id="mapContinentGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0b0b0b" />
            <stop offset="100%" stopColor="#1c1c1e" />
          </linearGradient>
        </defs>
        {worldPaths.map((path, i) => (
          <path 
            key={i} 
            d={path} 
            fill="url(#mapContinentGrad)" 
            stroke="rgba(255, 255, 255, 0.08)" 
            strokeWidth="0.25"
            className="transition-all duration-1000"
          />
        ))}
      </svg>

      {/* 3. Scanning Radar Effect */}
      <div className="absolute inset-0 pointer-events-none opacity-30">
        <motion.div 
          animate={{ 
            rotate: 360,
          }}
          transition={{ 
            duration: 12, 
            repeat: Infinity, 
            ease: "linear" 
          }}
          className="absolute top-[-50%] left-[-50%] w-[200%] h-[200%] bg-[conic-gradient(from_0deg,transparent_0deg,rgba(124,58,237,0.08)_90deg,rgba(124,58,237,0.3)_180deg,transparent_180deg)]"
          style={{ transformOrigin: 'center center' }}
        />
      </div>

      {/* 4. Target Node (HQ) */}
      <div className="absolute top-[40%] left-[25%] -translate-x-1/2 -translate-y-1/2 w-8 h-8 z-10">
        <div className={`absolute inset-0 rounded-full animate-ping opacity-15 ${isMitigating ? 'bg-neon-green' : 'bg-neon-purple'}`}></div>
        <div className={`absolute inset-0 rounded-full blur-md opacity-35 ${isMitigating ? 'bg-neon-green' : 'bg-neon-purple'}`}></div>
        <div className={`absolute inset-0 rounded-full border border-white/10 flex items-center justify-center bg-[#050505]/90 shadow-lg ${isMitigating ? 'shadow-neon-green/20' : 'shadow-neon-purple/20'}`}>
          <Shield size={10} className={isMitigating ? 'text-neon-green' : 'text-neon-purple'} />
        </div>
      </div>

      {/* 5. Attack Visualizations */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none z-10" viewBox="0 0 100 100">
        <defs>
          {threats.map((threat) => (
            <linearGradient key={`threat-grad-${threat.id}`} id={`threat-grad-${threat.id}`} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="transparent" />
              <stop offset="50%" stopColor={threat.severity === 'Critical' ? '#ef4444' : '#7C3AED'} stopOpacity="0.8" />
              <stop offset="100%" stopColor={threat.severity === 'Critical' ? '#ef4444' : '#7C3AED'} />
            </linearGradient>
          ))}
        </defs>
        <AnimatePresence>
          {threats.map((threat) => {
            // Coordinate mapping (HQ is at 25, 40)
            const hqX = 25;
            const hqY = 40;
            const x = ((threat.from.lng + 180) / 360) * 100;
            const y = ((90 - threat.from.lat) / 180) * 100;
            
            return (
              <g key={threat.id}>
                {/* Attacker Node Ripple */}
                <motion.circle
                  initial={{ r: 0, opacity: 0 }}
                  animate={{ r: 3, opacity: [0, 0.4, 0] }}
                  transition={{ duration: 2.5, repeat: Infinity }}
                  cx={x} cy={y}
                  fill={threat.severity === 'Critical' ? '#ef4444' : '#7C3AED'}
                />

                {/* Attacker Node */}
                <motion.circle
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  cx={x} cy={y} r="0.7"
                  fill={threat.severity === 'Critical' ? '#ef4444' : '#7C3AED'}
                />
                
                {/* Attack Path Arc */}
                <motion.path
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: isMitigating ? 0.15 : 0.5 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 2.0, ease: "easeInOut" }}
                  d={`M ${x} ${y} Q ${(x + hqX) / 2} ${(y + hqY) / 2 - 15} ${hqX} ${hqY}`}
                  stroke={`url(#threat-grad-${threat.id})`}
                  strokeWidth="0.35"
                  fill="none"
                />

                {/* Particle Animation (Packet) */}
                <motion.circle r="0.35" fill="white">
                  <animateMotion 
                    dur="2.5s" 
                    repeatCount="indefinite" 
                    path={`M ${x} ${y} Q ${(x + hqX) / 2} ${(y + hqY) / 2 - 15} ${hqX} ${hqY}`} 
                  />
                  <div className="blur-sm bg-white/60 w-full h-full rounded-full" />
                </motion.circle>
              </g>
            );
          })}
        </AnimatePresence>
      </svg>

      {/* 6. Threat Intel Overlay (Real-time feed) */}
      <div className="absolute top-4 right-4 w-48 bg-[#0b0b0b]/80 backdrop-blur-md border border-white/5 rounded-xl p-3 shadow-2xl pointer-events-none z-20">
        <div className="flex items-center gap-2 mb-3 border-b border-white/5 pb-2">
          <Activity size={10} className="text-neon-purple animate-pulse" />
          <span className="text-[9px] font-bold text-slate-300 uppercase tracking-widest font-mono">Real-time Feed</span>
        </div>
        <div className="space-y-2">
          {threats.slice(-3).reverse().map((threat) => (
            <motion.div 
              key={threat.id}
              initial={{ opacity: 0, x: 15 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex flex-col gap-0.5"
            >
              <div className="flex items-center justify-between">
                <span className={`text-[8px] font-extrabold uppercase font-mono ${threat.severity === 'Critical' ? 'text-neon-red' : 'text-neon-purple'}`}>
                  {threat.type?.split(' ')[0] || 'THREAT'}
                </span>
                <span className="text-[7px] text-slate-500 font-mono">
                  {threat.from.country}
                </span>
              </div>
              <div className="text-[7px] text-slate-400 font-mono truncate">
                {threat.from.ip}
              </div>
            </motion.div>
          ))}
          {threats.length === 0 && (
            <div className="text-[8px] text-slate-600 italic text-center py-2 font-mono">
              Awaiting payload...
            </div>
          )}
        </div>
      </div>

      {/* 7. Map Status Legend */}
      <div className="absolute bottom-4 left-4 flex flex-col gap-2 z-20">
        <div className="flex items-center gap-3 bg-[#0b0b0b]/80 backdrop-blur-md border border-white/5 px-3 py-1.5 rounded-full shadow-lg">
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 bg-neon-purple rounded-full shadow-[0_0_5px_#7C3AED] animate-pulse"></div>
            <span className="text-[8px] text-slate-300 font-bold tracking-tight uppercase font-mono">HQ_NODE_UP</span>
          </div>
          <div className="w-px h-3 bg-white/5"></div>
          <div className="flex items-center gap-1.5">
            <span className="text-[8px] text-slate-500 font-mono">SENSORS:</span>
            <span className="text-[8px] text-neon-green font-mono font-bold">ACTIVE</span>
          </div>
        </div>
        
        {isMitigating && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 bg-neon-green/10 border border-neon-green/30 px-3 py-1 rounded-full text-neon-green shadow-lg"
          >
            <Shield size={10} />
            <span className="text-[8px] font-bold uppercase tracking-wider font-mono">Mitigation Lockdown Engaged</span>
          </motion.div>
        )}
      </div>

      {/* 8. Corner Technical Details */}
      <div className="absolute top-4 left-4 pointer-events-none opacity-30 z-20">
        <div className="flex flex-col gap-0.5 font-mono text-[7px] text-slate-500">
          <div>SYS: INTRUSION-GRID-V4</div>
          <div>LOC: 40.7128° N, 74.0060° W</div>
        </div>
      </div>
    </div>
  );
};

export default ThreatMapComponent;
