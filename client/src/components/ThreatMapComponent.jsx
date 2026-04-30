import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ThreatMapComponent = ({ threats, isMitigating }) => {
  // Simple World Map SVG simplified for styling
  // We'll use a series of dots to represent the world
  const dots = [];
  for (let i = 0; i < 40; i++) {
    for (let j = 0; j < 20; j++) {
      if (Math.random() > 0.6) {
        dots.push({ x: i * 2.5, y: j * 5 });
      }
    }
  }

  return (
    <div className="w-full h-full relative bg-slate-950 overflow-hidden">
      {/* Abstract World Grid */}
      <svg viewBox="0 0 100 100" className="w-full h-full opacity-10">
        {dots.map((dot, i) => (
          <circle key={i} cx={dot.x} cy={dot.y} r="0.2" fill="white" />
        ))}
      </svg>

      {/* Defense Perimeter */}
      {isMitigating && (
        <motion.div 
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 border-2 border-neon-green/30 rounded-full"
        >
          <div className="absolute inset-0 border border-neon-green/20 rounded-full animate-ping"></div>
        </motion.div>
      )}

      {/* Target Node (Central Hub) */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4">
        <div className={`absolute inset-0 rounded-full animate-ping opacity-75 ${isMitigating ? 'bg-neon-green' : 'bg-neon-blue'}`}></div>
        <div className={`absolute inset-0 rounded-full shadow-[0_0_15px] ${isMitigating ? 'bg-neon-green shadow-neon-green' : 'bg-neon-blue shadow-neon-blue'}`}></div>
      </div>

      {/* Attack Lines */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100">
        <AnimatePresence>
          {threats.map((threat) => {
            const x = ((threat.from.lng + 180) / 360) * 100;
            const y = ((90 - threat.from.lat) / 180) * 100;
            
            return (
              <g key={threat.id}>
                {/* Attacker Node */}
                <motion.circle
                  initial={{ r: 0, opacity: 0 }}
                  animate={{ r: 1, opacity: 1 }}
                  exit={{ r: 0, opacity: 0 }}
                  cx={x}
                  cy={y}
                  fill={isMitigating ? '#22c55e' : (threat.severity === 'Critical' ? '#ef4444' : '#f97316')}
                />
                
                {/* Attack Path */}
                <motion.path
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ 
                    pathLength: isMitigating ? 0.3 : 1, 
                    opacity: isMitigating ? 0.1 : 0.4 
                  }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                  d={`M ${x} ${y} Q ${(x + 50) / 2} ${(y + 50) / 2 - 10} 50 50`}
                  stroke={isMitigating ? '#22c55e' : (threat.severity === 'Critical' ? '#ef4444' : '#f97316')}
                  strokeWidth="0.5"
                  fill="none"
                  strokeDasharray="2 1"
                />

                {/* Packet Animation - Intercepted if mitigating */}
                {!isMitigating && (
                  <motion.circle
                    initial={{ offset: 0 }}
                    animate={{ offset: 1 }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                    r="0.5"
                    fill="white"
                  >
                    <animateMotion 
                      dur="1.5s" 
                      repeatCount="indefinite" 
                      path={`M ${x} ${y} Q ${(x + 50) / 2} ${(y + 50) / 2 - 10} 50 50`} 
                    />
                  </motion.circle>
                )}
              </g>
            );
          })}
        </AnimatePresence>
      </svg>

      {/* Map Labels */}
      <div className="absolute bottom-4 left-4 flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-neon-blue rounded-full"></div>
          <span className="text-[10px] text-slate-400 font-mono">PRIMARY HUB (DC-01)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-neon-red rounded-full"></div>
          <span className="text-[10px] text-slate-400 font-mono">ACTIVE ATTACK VECTOR</span>
        </div>
      </div>
    </div>
  );
};

export default ThreatMapComponent;
