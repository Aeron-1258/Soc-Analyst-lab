import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, Globe, Shield, ShieldAlert, Target, Zap } from 'lucide-react';

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
    <div className="w-full h-full relative bg-[#020617] overflow-hidden border border-slate-800/50 rounded-2xl group">
      {/* 1. Background Grid & Scanning Lines */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <defs>
            <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
              <path d="M 10 0 L 0 0 0 10" fill="none" stroke="#1e293b" strokeWidth="0.1" />
            </pattern>
          </defs>
          <rect width="100" height="100" fill="url(#grid)" />
          {gridDots.map((dot, i) => (
            <circle key={i} cx={dot.x} cy={dot.y} r="0.15" fill="#334155" />
          ))}
        </svg>
      </div>

      {/* 2. World Map Continents */}
      <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full opacity-30">
        <defs>
          <linearGradient id="mapGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0f172a" />
            <stop offset="100%" stopColor="#1e293b" />
          </linearGradient>
        </defs>
        {worldPaths.map((path, i) => (
          <path 
            key={i} 
            d={path} 
            fill="url(#mapGradient)" 
            stroke="#334155" 
            strokeWidth="0.2"
            className="transition-all duration-1000"
          />
        ))}
      </svg>

      {/* 3. Scanning Radar Effect */}
      <div className="absolute inset-0 pointer-events-none opacity-40">
        <motion.div 
          animate={{ 
            rotate: 360,
          }}
          transition={{ 
            duration: 8, 
            repeat: Infinity, 
            ease: "linear" 
          }}
          className="absolute top-[-50%] left-[-50%] w-[200%] h-[200%] bg-[conic-gradient(from_0deg,transparent_0deg,rgba(59,130,246,0.1)_90deg,rgba(59,130,246,0.4)_180deg,transparent_180deg)]"
          style={{ transformOrigin: 'center center' }}
        />
      </div>

      {/* 4. Target Node (HQ) */}
      <div className="absolute top-[40%] left-[25%] -translate-x-1/2 -translate-y-1/2 w-8 h-8">
        <div className={`absolute inset-0 rounded-full animate-ping opacity-20 ${isMitigating ? 'bg-neon-green' : 'bg-neon-blue'}`}></div>
        <div className={`absolute inset-0 rounded-full blur-md opacity-40 ${isMitigating ? 'bg-neon-green' : 'bg-neon-blue'}`}></div>
        <div className={`absolute inset-0 rounded-full border border-white/20 flex items-center justify-center bg-slate-950/80 shadow-lg ${isMitigating ? 'shadow-neon-green/20' : 'shadow-neon-blue/20'}`}>
          <Shield size={10} className={isMitigating ? 'text-neon-green' : 'text-neon-blue'} />
        </div>
      </div>

      {/* 5. Attack Visualizations */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100">
        <defs>
          {threats.map((threat) => (
            <linearGradient key={`grad-${threat.id}`} id={`grad-${threat.id}`} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="transparent" />
              <stop offset="50%" stopColor={threat.severity === 'Critical' ? '#ef4444' : '#3b82f6'} stopOpacity="0.8" />
              <stop offset="100%" stopColor={threat.severity === 'Critical' ? '#ef4444' : '#3b82f6'} />
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
                  animate={{ r: 3, opacity: [0, 0.5, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  cx={x} cy={y}
                  fill={threat.severity === 'Critical' ? '#ef4444' : '#3b82f6'}
                />

                {/* Attacker Node */}
                <motion.circle
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  cx={x} cy={y} r="0.8"
                  fill={threat.severity === 'Critical' ? '#ef4444' : '#3b82f6'}
                  className="shadow-lg shadow-red-500/50"
                />
                
                {/* Attack Path Arc */}
                <motion.path
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: isMitigating ? 0.2 : 0.6 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 1.5, ease: "easeInOut" }}
                  d={`M ${x} ${y} Q ${(x + hqX) / 2} ${(y + hqY) / 2 - 15} ${hqX} ${hqY}`}
                  stroke={`url(#grad-${threat.id})`}
                  strokeWidth="0.4"
                  fill="none"
                />

                {/* Particle Animation (Packet) */}
                <motion.circle r="0.4" fill="white">
                  <animateMotion 
                    dur="2s" 
                    repeatCount="indefinite" 
                    path={`M ${x} ${y} Q ${(x + hqX) / 2} ${(y + hqY) / 2 - 15} ${hqX} ${hqY}`} 
                  />
                  <div className="blur-sm bg-white/50 w-full h-full rounded-full" />
                </motion.circle>
              </g>
            );
          })}
        </AnimatePresence>
      </svg>

      {/* 6. Threat Intel Overlay (Real-time feed) */}
      <div className="absolute top-4 right-4 w-48 bg-slate-950/80 backdrop-blur-md border border-slate-800 rounded-xl p-3 shadow-2xl pointer-events-none">
        <div className="flex items-center gap-2 mb-3 border-b border-slate-800 pb-2">
          <Activity size={12} className="text-neon-blue animate-pulse" />
          <span className="text-[10px] font-bold text-white uppercase tracking-widest">Global Feed</span>
        </div>
        <div className="space-y-2">
          {threats.slice(-3).reverse().map((threat, i) => (
            <motion.div 
              key={threat.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex flex-col gap-0.5"
            >
              <div className="flex items-center justify-between">
                <span className={`text-[8px] font-bold uppercase ${threat.severity === 'Critical' ? 'text-neon-red' : 'text-neon-yellow'}`}>
                  {threat.type?.split(' ')[0] || 'THREAT'}
                </span>
                <span className="text-[7px] text-slate-500 font-mono">
                  {threat.from.country}
                </span>
              </div>
              <div className="text-[7px] text-slate-400 font-mono truncate">
                SRC: {threat.from.ip}
              </div>
            </motion.div>
          ))}
          {threats.length === 0 && (
            <div className="text-[8px] text-slate-600 italic text-center py-2">
              Waiting for uplink...
            </div>
          )}
        </div>
      </div>

      {/* 7. Map Status Legend */}
      <div className="absolute bottom-4 left-4 flex flex-col gap-2">
        <div className="flex items-center gap-3 bg-slate-950/60 backdrop-blur-sm border border-slate-800/50 px-3 py-1.5 rounded-full">
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 bg-neon-blue rounded-full shadow-[0_0_5px_#3b82f6] animate-pulse"></div>
            <span className="text-[9px] text-slate-300 font-bold tracking-tight uppercase">HQ_NODE_ACTIVE</span>
          </div>
          <div className="w-px h-3 bg-slate-800"></div>
          <div className="flex items-center gap-1.5">
            <span className="text-[9px] text-slate-500 font-mono">SENSORS:</span>
            <span className="text-[9px] text-neon-green font-mono font-bold">100%</span>
          </div>
        </div>
        
        {isMitigating && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 bg-neon-green/10 border border-neon-green/30 px-3 py-1 rounded-full text-neon-green"
          >
            <Shield size={10} />
            <span className="text-[8px] font-bold uppercase tracking-wider">Perimeter Lockdown Active</span>
          </motion.div>
        )}
      </div>

      {/* 8. Corner Technical Details */}
      <div className="absolute top-4 left-4 pointer-events-none opacity-40">
        <div className="flex flex-col gap-0.5">
          <div className="text-[7px] text-slate-500 font-mono uppercase">System: OMEGA-MAP-V4.2</div>
          <div className="text-[7px] text-slate-500 font-mono uppercase">Uptime: 142.12.02:44</div>
          <div className="text-[7px] text-slate-500 font-mono uppercase">Lat: 40.7128° N, Long: 74.0060° W</div>
        </div>
      </div>
    </div>
  );
};

export default ThreatMapComponent;
