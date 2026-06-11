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
    <div className="glass-panel p-6 border border-white/5 bg-[#0b0b0b]/60 flex flex-col h-full relative overflow-hidden">
      {/* Top ambient glow line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-neon-purple/20 to-transparent"></div>

      <div className="flex items-center justify-between mb-6">
        <h3 className="text-sm font-extrabold text-white flex items-center gap-2 uppercase tracking-widest font-mono">
          <Terminal className="text-neon-cyan" size={16} /> Firewall Rules
        </h3>
        <span className="text-[9px] text-slate-500 font-mono tracking-wider">BLOCKED_IPS: {blacklist.length}</span>
      </div>

      <div className="flex-1 overflow-y-auto space-y-3 pr-1.5 scrollbar-hide min-h-[140px]">
        <AnimatePresence initial={false}>
          {blacklist.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-slate-600 py-8">
              <ShieldX size={28} className="mb-2 opacity-15" />
              <p className="text-[10px] uppercase font-bold tracking-widest font-mono">No Active Blocks</p>
            </div>
          ) : (
            blacklist.map((ip) => (
              <motion.div
                key={ip}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="flex items-center justify-between p-3.5 bg-[#050505]/40 border border-white/5 rounded-xl group hover:border-white/10 hover:bg-white/[0.01] transition-all"
                style={{ boxShadow: '0 4px 12px rgba(0, 0, 0, 0.4)' }}
              >
                <div className="flex items-center gap-3.5">
                  <div className="p-2 bg-neon-red/5 rounded-lg border border-neon-red/10 group-hover:border-neon-red/25 transition-colors">
                    <WifiOff className="text-neon-red" size={14} />
                  </div>
                  <div>
                    <p className="text-xs font-mono font-bold text-white tracking-wide">{ip}</p>
                    <p className="text-[8px] text-slate-500 uppercase tracking-wider font-mono mt-0.5">Blocked by AI-Defense</p>
                  </div>
                </div>
                
                <button 
                  onClick={() => removeIP(ip)}
                  className="p-2 text-slate-500 hover:text-white hover:bg-white/5 rounded-lg transition-all cursor-pointer opacity-0 group-hover:opacity-100"
                >
                  <Trash2 size={13} />
                </button>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>

      <div className="mt-4 pt-4 border-t border-white/5">
        <div className="p-3 bg-[#050505] rounded-xl border border-white/5">
          <div className="flex items-center gap-2.5 text-[9px] text-slate-500 font-mono tracking-wider uppercase">
            <span className="w-1.5 h-1.5 bg-neon-cyan rounded-full animate-pulse shadow-[0_0_4px_#06b6d4]"></span>
            Firewall uplink connected...
          </div>
        </div>
      </div>
    </div>
  );
};

export default FirewallTerminal;
