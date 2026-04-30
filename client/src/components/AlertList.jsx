import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, Info, ShieldAlert, Bug } from 'lucide-react';

const AlertList = ({ alerts }) => {
  const getIcon = (severity) => {
    switch (severity) {
      case 'Critical': return <ShieldAlert className="text-neon-red" size={16} />;
      case 'High': return <AlertTriangle className="text-orange-500" size={16} />;
      case 'Medium': return <Bug className="text-neon-yellow" size={16} />;
      default: return <Info className="text-neon-blue" size={16} />;
    }
  };

  const getColorClass = (severity) => {
    switch (severity) {
      case 'Critical': return 'border-l-neon-red bg-neon-red/5';
      case 'High': return 'border-l-orange-500 bg-orange-500/5';
      case 'Medium': return 'border-l-neon-yellow bg-neon-yellow/5';
      default: return 'border-l-neon-blue bg-neon-blue/5';
    }
  };

  return (
    <div className="flex-1 overflow-y-auto space-y-3 scrollbar-hide pr-1">
      <AnimatePresence initial={false}>
        {alerts.map((alert) => (
          <motion.div
            key={alert.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className={`p-3 rounded-lg border-l-4 ${getColorClass(alert.severity)} border border-slate-800/50 flex items-center gap-3 group hover:border-slate-700 transition-all`}
          >
            <div className="flex-shrink-0">
              {getIcon(alert.severity)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-start">
                <p className="text-sm font-semibold text-white truncate">{alert.type}</p>
                <span className="text-[10px] text-slate-500 font-mono">
                  {new Date(alert.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                </span>
              </div>
              <p className="text-xs text-slate-400 truncate mt-0.5">Src: {alert.sourceIP} • {alert.location}</p>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default AlertList;
