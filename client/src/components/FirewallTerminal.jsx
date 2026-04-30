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
    <div className="glass-panel p-6 border border-slate-800/50 flex flex-col h-full">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          <Terminal className="text-neon-cyan" size={20} /> Firewall Rules
        </h3>
        <span className="text-[10px] text-slate-500 font-mono">ACTIVE BLOCKS: {blacklist.length}</span>
      </div>

      <div className="flex-1 overflow-y-auto space-y-3 pr-2 scrollbar-hide">
        <AnimatePresence initial={false}>
          {blacklist.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-slate-600">
              <ShieldX size={32} className="mb-2 opacity-20" />
              <p className="text-xs">No active IP blocks</p>
            </div>
          ) : (
            blacklist.map((ip) => (
              <motion.div
                key={ip}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="flex items-center justify-between p-3 bg-slate-900/50 border border-slate-800 rounded-lg group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-1.5 bg-neon-red/10 rounded border border-neon-red/20">
                    <WifiOff className="text-neon-red" size={14} />
                  </div>
                  <div>
                    <p className="text-xs font-mono text-white">{ip}</p>
                    <p className="text-[10px] text-slate-500 uppercase">Blocked by AI-Defense</p>
                  </div>
                </div>
                <button 
                  onClick={() => removeIP(ip)}
                  className="p-2 text-slate-500 hover:text-white hover:bg-white/5 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                >
                  <Trash2 size={14} />
                </button>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>

      <div className="mt-4 pt-4 border-t border-slate-800/50">
        <div className="p-3 bg-slate-950 rounded-lg border border-slate-900">
          <div className="flex items-center gap-2 text-[10px] text-slate-500 font-mono">
            <span className="w-1.5 h-1.5 bg-neon-cyan rounded-full animate-pulse"></span>
            SYSTEM MONITORING INBOUND TRAFFIC...
          </div>
        </div>
      </div>
    </div>
  );
};

export default FirewallTerminal;
