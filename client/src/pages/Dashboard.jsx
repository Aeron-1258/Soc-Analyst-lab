import React from 'react';
import { motion } from 'framer-motion';
import { useSocket } from '../context/SocketContext';
import StatCards from '../components/StatCards';
import TrafficChart from '../components/TrafficChart';
import AlertList from '../components/AlertList';
import ThreatMapComponent from '../components/ThreatMapComponent';
import DefenseHub from '../components/DefenseHub';
import FirewallTerminal from '../components/FirewallTerminal';
import { ShieldAlert, Activity, Globe, Zap } from 'lucide-react';

const Dashboard = () => {
  const { alerts, trafficData, threats, isMitigating, isConnected, searchTerm } = useSocket();

  const filteredAlerts = alerts.filter(a => 
    a.type.toLowerCase().includes(searchTerm.toLowerCase()) || 
    a.sourceIP.includes(searchTerm)
  );

  const filteredThreats = threats.filter(t => 
    t.type.toLowerCase().includes(searchTerm.toLowerCase()) || 
    t.from.ip.includes(searchTerm)
  );

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.08 }
    }
  };

  const itemVariants = {
    hidden: { y: 15, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.5 } }
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6 relative"
    >
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-extrabold text-white flex items-center gap-2.5 tracking-tight font-sans">
            <Activity className="text-neon-purple" size={20} /> SYSTEM OVERVIEW
          </h2>
          <p className="text-slate-400 text-xs md:text-sm font-medium mt-0.5">Real-time threat intelligence and network analysis</p>
        </div>
        
        <div className="flex gap-2">
          {isConnected ? (
            <span className="flex items-center gap-2 px-3 py-1.5 bg-[#0b0b0b] text-neon-green border border-neon-green/20 rounded-full text-[10px] md:text-xs font-bold font-mono shadow-[0_0_12px_rgba(16,185,129,0.1)]">
              <span className="w-1.5 h-1.5 bg-neon-green rounded-full animate-pulse shadow-[0_0_6px_#10b981]"></span>
              LIVE_UPLINK
            </span>
          ) : (
            <span className="flex items-center gap-2 px-3 py-1.5 bg-[#0b0b0b] text-neon-purple border border-neon-purple/20 rounded-full text-[10px] md:text-xs font-bold font-mono shadow-[0_0_12px_rgba(124,58,237,0.1)]">
              <span className="w-1.5 h-1.5 bg-neon-purple rounded-full animate-ping shadow-[0_0_6px_#7C3AED]"></span>
              SIMULATION_MODE
            </span>
          )}
        </div>
      </div>

      <StatCards alerts={alerts} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Threat Map */}
        <motion.div variants={itemVariants} className="lg:col-span-2 glass-panel p-6 min-h-[420px] flex flex-col bg-[#0b0b0b]/60 border border-white/5 relative">
          {/* Top ambient glow line */}
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-neon-purple/20 to-transparent"></div>

          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-extrabold text-white flex items-center gap-2 uppercase tracking-widest font-mono">
              <Globe className="text-neon-cyan" size={16} /> Global Threat Map
            </h3>
            <span className="text-[9px] text-slate-500 font-mono tracking-wider">ACTIVE NODES: {threats.length}</span>
          </div>
          
          <div className="flex-1 bg-[#050505]/40 rounded-2xl relative overflow-hidden border border-white/5 shadow-inner">
             <ThreatMapComponent threats={filteredThreats} isMitigating={isMitigating} />
          </div>
        </motion.div>

        {/* Real-time Alerts */}
        <motion.div variants={itemVariants} className="glass-panel p-6 flex flex-col h-[420px] bg-[#0b0b0b]/60 border border-white/5 relative">
          {/* Top ambient glow line */}
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-neon-purple/20 to-transparent"></div>

          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-extrabold text-white flex items-center gap-2 uppercase tracking-widest font-mono">
              <ShieldAlert className="text-neon-red" size={16} /> Live Incidents
            </h3>
            <button className="text-[9px] font-bold text-neon-purple uppercase tracking-widest font-mono hover:text-[#9D4EDD] transition-colors cursor-pointer">
              View All
            </button>
          </div>
          <AlertList alerts={filteredAlerts.slice(0, 10)} />
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Defense & Firewall Column */}
        <div className="lg:col-span-1 flex flex-col gap-6">
          <motion.div variants={itemVariants}>
            <DefenseHub />
          </motion.div>
          <motion.div variants={itemVariants} className="flex-1">
            <FirewallTerminal />
          </motion.div>
        </div>

        {/* Network Traffic */}
        <motion.div variants={itemVariants} className="lg:col-span-3 glass-panel p-6 bg-[#0b0b0b]/60 border border-white/5 relative flex flex-col justify-between">
          {/* Top ambient glow line */}
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-neon-purple/20 to-transparent"></div>

          <div className="flex items-center justify-between mb-6">
            <h3 className="text-sm font-extrabold text-white flex items-center gap-2 uppercase tracking-widest font-mono">
              <Zap className="text-neon-purple" size={16} /> Network Throughput
            </h3>
            <div className="flex gap-4 text-[9px] font-bold uppercase font-mono">
              <span className="flex items-center gap-1.5 text-neon-purple">
                <span className="w-1.5 h-1.5 bg-neon-purple rounded-full shadow-[0_0_4px_#7C3AED]"></span> Inbound
              </span>
              <span className="flex items-center gap-1.5 text-neon-blue">
                <span className="w-1.5 h-1.5 bg-neon-blue rounded-full shadow-[0_0_4px_#3b82f6]"></span> Outbound
              </span>
            </div>
          </div>
          <div className="flex-1 flex items-center">
            <TrafficChart data={trafficData} />
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Analytics Distribution */}
        <motion.div variants={itemVariants} className="glass-panel p-6 bg-[#0b0b0b]/60 border border-white/5 relative">
          {/* Top ambient glow line */}
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-neon-purple/20 to-transparent"></div>

          <h3 className="text-sm font-extrabold text-white mb-6 uppercase tracking-widest font-mono">Threat Severity Distribution</h3>
          <div className="space-y-4">
            {['Critical', 'High', 'Medium', 'Low'].map((sev) => {
              const count = alerts.filter(a => a.severity === sev).length;
              const total = alerts.length || 1;
              const percentage = (count / total) * 100;
              const colorMap = {
                Critical: 'bg-neon-red shadow-neon-red',
                High: 'bg-neon-orange shadow-neon-orange',
                Medium: 'bg-neon-yellow shadow-neon-yellow',
                Low: 'bg-neon-green shadow-neon-green'
              };
              
              return (
                <div key={sev} className="space-y-1.5">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-slate-400 font-bold uppercase tracking-wider">{sev}</span>
                    <span className="text-white font-bold">{count}</span>
                  </div>
                  <div className="w-full h-1 bg-[#050505] rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${percentage}%` }}
                      transition={{ duration: 0.8, ease: 'easeOut' }}
                      className={`h-full ${colorMap[sev]} shadow-[0_0_8px]`}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* System Health / Status */}
        <motion.div variants={itemVariants} className="glass-panel p-6 flex flex-col justify-center items-center gap-5 bg-[#0b0b0b]/60 border border-white/5 relative min-h-[200px]">
          {/* Top ambient glow line */}
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-neon-purple/20 to-transparent"></div>

           <div className="relative">
              <svg className="w-32 h-32 rotate-[-90deg]">
                <circle cx="64" cy="64" r="54" stroke="rgba(255,255,255,0.03)" strokeWidth="6" fill="transparent" />
                <motion.circle 
                  cx="64" cy="64" r="54" stroke="#7C3AED" strokeWidth="6" fill="transparent" 
                  className="text-neon-purple"
                  strokeDasharray="339.29"
                  initial={{ strokeDashoffset: 339.29 }}
                  animate={{ strokeDashoffset: 33.929 }} // 90%
                  transition={{ duration: 1.2, ease: 'easeOut' }}
                  strokeLinecap="round"
                  style={{ filter: 'drop-shadow(0 0 4px #7C3AED)' }}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-black text-white font-mono tracking-tighter">90%</span>
                <span className="text-[8px] text-slate-500 font-bold uppercase font-mono tracking-widest">Health</span>
              </div>
           </div>
           <p className="text-xs text-slate-400 font-mono tracking-wide uppercase">All services operating within normal limits</p>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Dashboard;
