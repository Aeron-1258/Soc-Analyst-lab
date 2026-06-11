import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Zap, Target, AlertTriangle, ShieldCheck, Flame, Cpu } from 'lucide-react';
import { useSocket } from '../context/SocketContext';
import { toast } from 'react-hot-toast';

const DefenseHub = () => {
  const { isConnected, simulateAttack, simulateCompromise, simulatePhishing, isMitigating } = useSocket();

  return (
    <div className="glass-panel p-5 border border-[#2A2A2A] bg-[#171717] relative overflow-hidden font-sans">
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-xs font-bold text-[#FAFAFA] flex items-center gap-2 uppercase tracking-wider">
          <Shield className="text-[#4F46E5]" size={14} /> Active Mitigation Hub
        </h3>
        {isMitigating && (
          <span className="text-[9px] bg-[#16A34A]/5 text-[#16A34A] border border-[#16A34A]/25 px-2 py-0.5 rounded-full font-bold">
            LOCKDOWN_ENGAGED
          </span>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3">
        {/* SQLi Simulation */}
        <motion.button
          whileHover={{ y: -0.5, borderColor: '#DC2626' }}
          whileTap={{ scale: 0.98 }}
          onClick={() => simulateAttack("💉 SQL INJECTION")}
          className="flex flex-col items-center justify-center p-3.5 bg-[#1E1E1E] border border-[#2A2A2A] rounded-lg transition-all cursor-pointer text-center group"
        >
          <Target className="text-[#DC2626] mb-1.5" size={16} />
          <span className="text-[10px] font-semibold text-[#FAFAFA] tracking-tight">SQL Injection</span>
        </motion.button>

        {/* DDoS Simulation */}
        <motion.button
          whileHover={{ y: -0.5, borderColor: '#4F46E5' }}
          whileTap={{ scale: 0.98 }}
          onClick={() => simulateAttack("🌀 DDOS ATTACK")}
          className="flex flex-col items-center justify-center p-3.5 bg-[#1E1E1E] border border-[#2A2A2A] rounded-lg transition-all cursor-pointer text-center group"
        >
          <Zap className="text-[#4F46E5] mb-1.5" size={16} />
          <span className="text-[10px] font-semibold text-[#FAFAFA] tracking-tight">DDoS Stream</span>
        </motion.button>

        {/* Malware Simulation */}
        <motion.button
          whileHover={{ y: -0.5, borderColor: '#F59E0B' }}
          whileTap={{ scale: 0.98 }}
          onClick={() => simulateAttack("🦠 MALWARE")}
          className="flex flex-col items-center justify-center p-3.5 bg-[#1E1E1E] border border-[#2A2A2A] rounded-lg transition-all cursor-pointer text-center group"
        >
          <AlertTriangle className="text-[#F59E0B] mb-1.5" size={16} />
          <span className="text-[10px] font-semibold text-[#FAFAFA] tracking-tight">Malware</span>
        </motion.button>

        {/* Active Mitigation */}
        <motion.button
          whileHover={!isMitigating ? { y: -0.5, borderColor: '#16A34A' } : {}}
          whileTap={!isMitigating ? { scale: 0.98 } : {}}
          onClick={() => simulateAttack("🛡️ MANUAL MITIGATION")}
          disabled={isMitigating}
          className={`flex flex-col items-center justify-center p-3.5 rounded-lg transition-all cursor-pointer border text-center ${
            isMitigating 
              ? 'bg-[#16A34A]/5 border-[#16A34A]/30 cursor-not-allowed text-[#16A34A]' 
              : 'bg-[#1E1E1E] border-[#2A2A2A] hover:bg-[#1E1E1E]'
          }`}
        >
          {isMitigating ? (
            <ShieldCheck className="text-[#16A34A] mb-1.5" size={16} />
          ) : (
            <Shield className="text-[#A3A3A3] mb-1.5" size={16} />
          )}
          <span className="text-[10px] font-semibold text-[#FAFAFA] tracking-tight">
            {isMitigating ? 'Active Shield' : 'Mitigate'}
          </span>
        </motion.button>
      </div>

      <div className="grid grid-cols-1 mt-3 gap-2">
        <motion.button
          whileHover={{ y: -0.5 }}
          whileTap={{ scale: 0.99 }}
          onClick={() => {
            simulateCompromise();
            toast.error("ALERT: SUSPICIOUS AUTH SEQUENCE OBSERVED", {
              icon: '👤',
              style: { border: '1px solid #DC2626', background: '#171717', color: '#FAFAFA' }
            });
          }}
          className="flex items-center justify-center gap-2 py-2 bg-[#DC2626]/5 border border-[#DC2626]/20 hover:bg-[#DC2626]/10 rounded-lg text-[#DC2626] font-semibold text-xs transition-all cursor-pointer"
        >
          <Flame size={14} />
          <span>Simulate Account Takeover</span>
        </motion.button>

        <motion.button
          whileHover={{ y: -0.5 }}
          whileTap={{ scale: 0.99 }}
          onClick={() => {
            simulatePhishing();
            toast.error("ALERT: MALICIOUS EMAIL PATH INJECTED", {
              icon: '📧',
              style: { border: '1px solid #DC2626', background: '#171717', color: '#FAFAFA' }
            });
          }}
          className="flex items-center justify-center gap-2 py-2 bg-[#4F46E5]/5 border border-[#4F46E5]/20 hover:bg-[#4F46E5]/10 rounded-lg text-[#4F46E5] font-semibold text-xs transition-all cursor-pointer"
        >
          <Cpu size={14} />
          <span>Simulate Phishing Vectors</span>
        </motion.button>
      </div>

      <div className="mt-5 pt-4 border-t border-[#2A2A2A]">
        <div className="flex items-center justify-between text-xs">
          <span className="text-[#A3A3A3] font-medium">System Health</span>
          <span className={`font-semibold ${isMitigating ? 'text-[#16A34A]' : 'text-[#4F46E5]'}`}>
            {isMitigating ? '100% (SECURE)' : '94% (MONITORING)'}
          </span>
        </div>
        <div className="w-full h-1 bg-[#0A0A0A] rounded-full mt-2 overflow-hidden">
          <motion.div 
            initial={{ width: '94%' }}
            animate={{ width: isMitigating ? '100%' : '94%' }}
            className={`h-full ${isMitigating ? 'bg-[#16A34A]' : 'bg-[#4F46E5]'}`}
          />
        </div>
      </div>
    </div>
  );
};

export default DefenseHub;
