import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, Info, ShieldAlert, Bug } from 'lucide-react';

const AlertList = ({ alerts }) => {
  const getIcon = (severity) => {
    switch (severity) {
      case 'Critical': return <ShieldAlert className="text-[#DC2626]" size={14} />;
      case 'High': return <AlertTriangle className="text-[#EA580C]" size={14} />;
      case 'Medium': return <Bug className="text-[#F59E0B]" size={14} />;
      default: return <Info className="text-[#4F46E5]" size={14} />;
    }
  };

  const getSeverityStyles = (severity) => {
    switch (severity) {
      case 'Critical': return {
        border: 'border-l-2 border-l-[#DC2626] border-[#2A2A2A]',
        badge: 'bg-[#DC2626]/5 text-[#DC2626] border-[#DC2626]/20',
        dot: 'bg-[#DC2626]'
      };
      case 'High': return {
        border: 'border-l-2 border-l-[#EA580C] border-[#2A2A2A]',
        badge: 'bg-[#EA580C]/5 text-[#EA580C] border-[#EA580C]/20',
        dot: 'bg-[#EA580C]'
      };
      case 'Medium': return {
        border: 'border-l-2 border-l-[#F59E0B] border-[#2A2A2A]',
        badge: 'bg-[#F59E0B]/5 text-[#F59E0B] border-[#F59E0B]/20',
        dot: 'bg-[#F59E0B]'
      };
      default: return {
        border: 'border-l-2 border-l-[#4F46E5] border-[#2A2A2A]',
        badge: 'bg-[#4F46E5]/5 text-[#4F46E5] border-[#4F46E5]/20',
        dot: 'bg-[#4F46E5]'
      };
    }
  };

  return (
    <div className="flex-1 overflow-y-auto space-y-2.5 pr-1.5 scrollbar-hide font-sans">
      <AnimatePresence initial={false}>
        {alerts.map((alert) => {
          const styles = getSeverityStyles(alert.severity);
          return (
            <motion.div
              key={alert.id}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.2 }}
              className={`p-3 rounded-xl bg-[#1E1E1E]/40 border ${styles.border} flex items-center gap-3 group hover:bg-[#1E1E1E]/80 hover:border-[#2A2A2A] transition-all`}
            >
              <div className="p-2 rounded-lg bg-[#111111] border border-[#2A2A2A] flex items-center justify-center">
                {getIcon(alert.severity)}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center">
                  <p className="text-xs font-semibold text-[#FAFAFA] truncate">
                    {alert.type}
                  </p>
                  
                  <span className="text-[10px] text-[#A3A3A3] font-mono">
                    {new Date(alert.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })}
                  </span>
                </div>
                
                <div className="flex items-center gap-2 mt-1 text-[10px] text-[#A3A3A3]">
                  <span className="font-mono">SRC: {alert.sourceIP}</span>
                  <span className="text-[#2A2A2A] font-sans">•</span>
                  <span>{alert.location}</span>
                  <span className="ml-auto flex items-center">
                    <span className={`px-2 py-0.5 rounded text-[8px] font-bold tracking-wider uppercase border ${styles.badge} flex items-center gap-1`}>
                      <span className={`w-1 h-1 rounded-full ${styles.dot}`}></span>
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
