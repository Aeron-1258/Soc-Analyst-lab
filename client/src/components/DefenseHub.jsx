import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Zap, Target, AlertTriangle, ShieldCheck, Flame, Cpu } from 'lucide-react';
import { useSocket } from '../context/SocketContext';
import { toast } from 'react-hot-toast';

const DefenseHub = () => {
  const { isConnected, simulateAttack, simulateCompromise, simulatePhishing, isMitigating } = useSocket();

  return (
    <div className="glass-panel p-6 border border-white/5 bg-[#0b0b0b]/60 relative overflow-hidden">
      {/* Top ambient light line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-neon-purple/20 to-transparent"></div>

      <div className="flex items-center justify-between mb-6">
        <h3 className="text-sm font-extrabold text-white flex items-center gap-2 uppercase tracking-widest font-mono">
          <Shield className="text-neon-purple" size={16} /> Active Defense Hub
        </h3>
        {isMitigating && (
          <span className="text-[9px] bg-neon-green/10 text-neon-green border border-neon-green/20 px-2 py-0.5 rounded-full animate-pulse font-bold font-mono tracking-wider">
            SHIELD_ENGAGED
          </span>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3.5">
        {/* SQLi Simulation */}
        <motion.button
          whileHover={{ scale: 1.015, borderColor: 'rgba(239, 68, 68, 0.3)' }}
          whileTap={{ scale: 0.985 }}
          onClick={() => simulateAttack("💉 SQL INJECTION")}
          className="flex flex-col items-center justify-center p-4 bg-[#050505]/40 border border-white/5 rounded-xl hover:bg-neon-red/[0.02] transition-all cursor-pointer text-center relative group"
        >
          <Target className="text-neon-red mb-2 group-hover:scale-110 transition-transform" size={18} />
          <span className="text-[9px] font-bold text-slate-300 uppercase tracking-widest font-mono">SQL Injection</span>
        </motion.button>

        {/* DDoS Simulation */}
        <motion.button
          whileHover={{ scale: 1.015, borderColor: 'rgba(124, 58, 237, 0.3)' }}
          whileTap={{ scale: 0.985 }}
          onClick={() => simulateAttack("🌀 DDOS ATTACK")}
          className="flex flex-col items-center justify-center p-4 bg-[#050505]/40 border border-white/5 rounded-xl hover:bg-neon-purple/[0.02] transition-all cursor-pointer text-center relative group"
        >
          <Zap className="text-neon-purple mb-2 group-hover:scale-110 transition-transform" size={18} />
          <span className="text-[9px] font-bold text-slate-300 uppercase tracking-widest font-mono">DDoS Attack</span>
        </motion.button>

        {/* Malware Simulation */}
        <motion.button
          whileHover={{ scale: 1.015, borderColor: 'rgba(245, 158, 11, 0.3)' }}
          whileTap={{ scale: 0.985 }}
          onClick={() => simulateAttack("🦠 MALWARE")}
          className="flex flex-col items-center justify-center p-4 bg-[#050505]/40 border border-white/5 rounded-xl hover:bg-neon-yellow/[0.02] transition-all cursor-pointer text-center relative group"
        >
          <AlertTriangle className="text-neon-yellow mb-2 group-hover:scale-110 transition-transform" size={18} />
          <span className="text-[9px] font-bold text-slate-300 uppercase tracking-widest font-mono">Malware</span>
        </motion.button>

        {/* Active Mitigation */}
        <motion.button
          whileHover={!isMitigating ? { scale: 1.015, borderColor: 'rgba(16, 185, 129, 0.3)' } : {}}
          whileTap={!isMitigating ? { scale: 0.985 } : {}}
          onClick={() => simulateAttack("🛡️ MANUAL MITIGATION")}
          disabled={isMitigating}
          className={`flex flex-col items-center justify-center p-4 rounded-xl transition-all cursor-pointer border text-center ${
            isMitigating 
              ? 'bg-neon-green/5 border-neon-green/30 cursor-not-allowed text-neon-green' 
              : 'bg-[#050505]/40 border-white/5 hover:bg-neon-green/[0.02]'
          }`}
        >
          {isMitigating ? (
            <ShieldCheck className="text-neon-green mb-2" size={18} />
          ) : (
            <Shield className="text-slate-400 mb-2" size={18} />
          )}
          <span className="text-[9px] font-bold text-slate-300 uppercase tracking-widest font-mono">
            {isMitigating ? 'Mitigated' : 'Mitigate'}
          </span>
        </motion.button>
      </div>

      <div className="grid grid-cols-1 mt-4 gap-3">
        <motion.button
          whileHover={{ scale: 1.01, borderColor: 'rgba(239, 68, 68, 0.25)' }}
          whileTap={{ scale: 0.99 }}
          onClick={() => {
            simulateCompromise();
            toast.error("DETECTED: SUSPICIOUS LOGIN SEQUENCE", {
              icon: '👤',
              style: { border: '1px solid #ef4444', background: '#0b0b0b', color: '#fff' }
            });
          }}
          className="flex items-center justify-center gap-3 p-3.5 bg-neon-red/5 border border-white/5 hover:border-neon-red/20 rounded-xl hover:bg-neon-red/[0.08] transition-all text-neon-red cursor-pointer group"
        >
          <Flame size={16} className="group-hover:scale-110 transition-transform" />
          <span className="text-[10px] font-bold uppercase tracking-widest font-mono">Simulate Compromise</span>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.01, borderColor: 'rgba(59, 130, 246, 0.25)' }}
          whileTap={{ scale: 0.99 }}
          onClick={() => {
            simulatePhishing();
            toast.error("DETECTED: SUSPICIOUS EMAIL ACTIVITY", {
              icon: '📧',
              style: { border: '1px solid #ef4444', background: '#0b0b0b', color: '#fff' }
            });
          }}
          className="flex items-center justify-center gap-3 p-3.5 bg-neon-blue/5 border border-white/5 hover:border-neon-blue/20 rounded-xl hover:bg-neon-blue/[0.08] transition-all text-neon-blue cursor-pointer group"
        >
          <Cpu size={16} className="group-hover:scale-110 transition-transform" />
          <span className="text-[10px] font-bold uppercase tracking-widest font-mono">Simulate Phishing</span>
        </motion.button>
      </div>

      <div className="mt-6 pt-6 border-t border-white/5">
        <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
          <span>SYSTEM INTEGRITY</span>
          <span className={`font-bold ${isMitigating ? 'text-neon-green' : 'text-neon-purple'}`}>
            {isMitigating ? '100% (SECURE)' : '94% (MONITORING)'}
          </span>
        </div>
        <div className="w-full h-1 bg-[#050505] rounded-full mt-2.5 overflow-hidden">
          <motion.div 
            initial={{ width: '94%' }}
            animate={{ width: isMitigating ? '100%' : '94%' }}
            className={`h-full ${isMitigating ? 'bg-neon-green shadow-neon-green' : 'bg-neon-purple shadow-neon-purple'} shadow-[0_0_8px]`}
          />
        </div>
      </div>
    </div>
  );
};

export default DefenseHub;
