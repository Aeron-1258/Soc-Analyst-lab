import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, Zap, Target, AlertTriangle, ShieldCheck, Flame } from 'lucide-react';
import { useSocket } from '../context/SocketContext';
import { toast } from 'react-hot-toast';

const DefenseHub = () => {
  const { isConnected, simulateAttack, isMitigating } = useSocket();

  const triggerBreach = () => {
    simulateAttack("🔥 MANUAL BREACH");
    toast.error("ALERT: MANUAL BREACH INJECTED", {
      icon: '🔥',
      style: { border: '1px solid #ef4444' }
    });
  };

  return (
    <div className="glass-panel p-6 border border-slate-800/50">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          <Shield className="text-neon-blue" size={20} /> Active Defense Hub
        </h3>
        {isMitigating && (
          <span className="text-[10px] bg-neon-green/10 text-neon-green border border-neon-green/30 px-2 py-0.5 rounded-full animate-pulse font-bold">
            SHIELD ACTIVE
          </span>
        )}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* SQLi Simulation */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => simulateAttack("💉 SQL INJECTION")}
          className="flex flex-col items-center justify-center p-3 bg-slate-900/40 border border-slate-800 rounded-xl hover:border-neon-red/40 transition-all"
        >
          <Target className="text-neon-red mb-2" size={20} />
          <span className="text-[10px] font-bold text-white uppercase">SQL Injection</span>
        </motion.button>

        {/* DDoS Simulation */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => simulateAttack("🌀 DDOS ATTACK")}
          className="flex flex-col items-center justify-center p-3 bg-slate-900/40 border border-slate-800 rounded-xl hover:border-neon-purple/40 transition-all"
        >
          <Zap className="text-neon-purple mb-2" size={20} />
          <span className="text-[10px] font-bold text-white uppercase">DDoS Attack</span>
        </motion.button>

        {/* Malware Simulation */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => simulateAttack("🦠 MALWARE")}
          className="flex flex-col items-center justify-center p-3 bg-slate-900/40 border border-slate-800 rounded-xl hover:border-neon-yellow/40 transition-all"
        >
          <AlertTriangle className="text-neon-yellow mb-2" size={20} />
          <span className="text-[10px] font-bold text-white uppercase">Malware</span>
        </motion.button>

        {/* Active Mitigation */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => simulateAttack("🛡️ MANUAL MITIGATION")}
          disabled={isMitigating}
          className={`flex flex-col items-center justify-center p-3 rounded-xl transition-all ${
            isMitigating 
              ? 'bg-neon-green/20 border-neon-green/50 cursor-not-allowed' 
              : 'bg-neon-blue/10 border-neon-blue/20 hover:border-neon-blue/40'
          }`}
        >
          {isMitigating ? (
            <ShieldCheck className="text-neon-green mb-2" size={20} />
          ) : (
            <Shield className="text-neon-blue mb-2" size={20} />
          )}
          <span className="text-[10px] font-bold text-white uppercase">
            {isMitigating ? 'Mitigated' : 'Mitigate'}
          </span>
        </motion.button>
      </div>

      <div className="mt-6 pt-6 border-t border-slate-800/50">
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span>System Integrity</span>
          <span className={isMitigating ? 'text-neon-green font-bold' : 'text-neon-blue'}>
            {isMitigating ? '100% (STABILIZING)' : '94% (MONITORING)'}
          </span>
        </div>
        <div className="w-full h-1.5 bg-slate-800 rounded-full mt-2 overflow-hidden">
          <motion.div 
            initial={{ width: '94%' }}
            animate={{ width: isMitigating ? '100%' : '94%' }}
            className={`h-full ${isMitigating ? 'bg-neon-green shadow-neon-green' : 'bg-neon-blue shadow-neon-blue'} shadow-[0_0_8px]`}
          />
        </div>
      </div>
    </div>
  );
};

export default DefenseHub;
