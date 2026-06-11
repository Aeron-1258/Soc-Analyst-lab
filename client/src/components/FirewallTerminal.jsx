import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldX, Trash2, Terminal, WifiOff } from 'lucide-react';
import { useSocket } from '../context/SocketContext';

const FirewallTerminal = () => {
  const { blacklist, setBlacklist } = useSocket();

  const removeIP = (ip) => {
    setBlacklist(prev => prev.filter(item => item !== ip));
  };

  return (
    <div className="glass-panel p-5 border border-[#2A2A2A] bg-[#171717] flex flex-col h-full relative overflow-hidden font-sans">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xs font-bold text-[#FAFAFA] flex items-center gap-2 uppercase tracking-wider">
          <Terminal className="text-[#A3A3A3]" size={14} /> Firewall Restrictions
        </h3>
        <span className="text-[10px] text-[#A3A3A3] font-mono">BLOCKED: {blacklist.length}</span>
      </div>

      <div className="flex-1 overflow-y-auto space-y-2 pr-1.5 scrollbar-hide min-h-[140px]">
        <AnimatePresence initial={false}>
          {blacklist.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-[#64748B] py-8">
              <ShieldX size={24} className="mb-1.5 opacity-30" />
              <p className="text-[9px] uppercase font-bold tracking-widest font-mono">No IP Constraints</p>
            </div>
          ) : (
            blacklist.map((ip) => (
              <motion.div
                key={ip}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.98 }}
                className="flex items-center justify-between p-2.5 bg-[#1E1E1E] border border-[#2A2A2A] rounded-lg group hover:border-[#A3A3A3]/25 transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="p-1.5 bg-[#DC2626]/5 rounded-md border border-[#DC2626]/10">
                    <WifiOff className="text-[#DC2626]" size={12} />
                  </div>
                  <div>
                    <p className="text-xs font-mono font-semibold text-[#FAFAFA]">{ip}</p>
                    <p className="text-[9px] text-[#A3A3A3] tracking-tight mt-0.5">Automated filter block</p>
                  </div>
                </div>
                
                <button 
                  onClick={() => removeIP(ip)}
                  className="p-1.5 text-[#A3A3A3] hover:text-[#FAFAFA] hover:bg-[#2A2A2A] rounded-md transition-all cursor-pointer opacity-0 group-hover:opacity-100"
                >
                  <Trash2 size={12} />
                </button>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>

      <div className="mt-4 pt-4 border-t border-[#2A2A2A]">
        <div className="p-2.5 bg-[#111111] rounded-lg border border-[#2A2A2A]">
          <div className="flex items-center gap-2 text-[10px] text-[#A3A3A3] tracking-wide font-medium">
            <span className="w-1.5 h-1.5 bg-[#16A34A] rounded-full animate-pulse"></span>
            Filter daemon active and protecting nodes
          </div>
        </div>
      </div>
    </div>
  );
};

export default FirewallTerminal;
