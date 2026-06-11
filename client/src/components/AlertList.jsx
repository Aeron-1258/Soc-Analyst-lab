import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, Info, ShieldAlert, Bug } from 'lucide-react';

const AlertList = ({ alerts }) => {
  const getIcon = (severity) => {
    switch (severity) {
      case 'Critical': return <ShieldAlert className="text-neon-red" size={14} />;
      case 'High': return <AlertTriangle className="text-neon-orange" size={14} />;
      case 'Medium': return <Bug className="text-neon-yellow" size={14} />;
      default: return <Info className="text-neon-blue" size={14} />;
    }
  };

  const getSeverityStyles = (severity) => {
    switch (severity) {
      case 'Critical': return {
        border: 'border-l-2 border-l-neon-red border-white/5',
        badge: 'bg-neon-red/10 text-neon-red border-neon-red/20',
        glow: 'bg-neon-red shadow-[0_0_6px_#ef4444]'
      };
      case 'High': return {
        border: 'border-l-2 border-l-neon-orange border-white/5',
        badge: 'bg-neon-orange/10 text-neon-orange border-neon-orange/20',
        glow: 'bg-neon-orange shadow-[0_0_6px_#f97316]'
      };
      case 'Medium': return {
        border: 'border-l-2 border-l-neon-yellow border-white/5',
        badge: 'bg-neon-yellow/10 text-neon-yellow border-neon-yellow/20',
        glow: 'bg-neon-yellow shadow-[0_0_6px_#f59e0b]'
      };
      default: return {
        border: 'border-l-2 border-l-neon-blue border-white/5',
        badge: 'bg-neon-blue/10 text-neon-blue border-neon-blue/20',
        glow: 'bg-neon-blue shadow-[0_0_6px_#3b82f6]'
      };
    }
  };

  return (
    <div className="flex-1 overflow-y-auto space-y-3.5 pr-2 scrollbar-hide">
      <AnimatePresence initial={false}>
        {alerts.map((alert) => {
          const styles = getSeverityStyles(alert.severity);
          return (
            <motion.div
              key={alert.id}
              initial={{ opacity: 0, x: -15 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
              className={`p-3.5 rounded-xl bg-[#0b0b0b]/35 border ${styles.border} flex items-center gap-3.5 group hover:bg-white/[0.02] hover:border-white/10 transition-all`}
              style={{ boxShadow: '0 4px 12px rgba(0, 0, 0, 0.4)' }}
            >
              <div className={`p-2 rounded-lg bg-white/[0.01] border border-white/5 group-hover:border-white/10 transition-colors shadow-sm`}>
                {getIcon(alert.severity)}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center">
                  <p className="text-xs font-bold text-white truncate font-sans tracking-wide">
                    {alert.type}
                  </p>
                  
                  <span className="text-[9px] text-slate-500 font-mono tracking-widest pl-2">
                    {new Date(alert.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })}
                  </span>
                </div>
                
                <div className="flex items-center gap-3 mt-1.5 text-[10px] text-slate-400 font-mono">
                  <span className="truncate">SRC: {alert.sourceIP}</span>
                  <span className="text-slate-600 font-sans">•</span>
                  <span className="truncate">{alert.location}</span>
                  <span className="ml-auto flex items-center gap-1.5">
                    <span className={`px-2 py-0.5 rounded text-[8px] font-bold tracking-wider uppercase border ${styles.badge} flex items-center gap-1`}>
                      <span className={`w-1 h-1 rounded-full ${styles.glow}`}></span>
                      {alert.severity}
                    </span>
                  </span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};

export default AlertList;
