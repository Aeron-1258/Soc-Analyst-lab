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
  const { alerts, trafficData, threats, isMitigating } = useSocket();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Activity className="text-neon-blue" /> System Overview
          </h2>
          <p className="text-slate-400 text-sm">Real-time threat intelligence and network analysis</p>
        </div>
        <div className="flex gap-2">
          <span className="flex items-center gap-1.5 px-3 py-1 bg-neon-green/10 text-neon-green border border-neon-green/30 rounded-full text-xs font-bold animate-pulse">
            <span className="w-2 h-2 bg-neon-green rounded-full"></span>
            LIVE SERVER
          </span>
        </div>
      </div>

      <StatCards alerts={alerts} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Threat Map */}
        <motion.div variants={itemVariants} className="lg:col-span-2 glass-panel p-6 min-h-[400px] flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <Globe className="text-neon-cyan" size={18} /> Global Threat Map
            </h3>
            <span className="text-xs text-slate-500 font-mono">Active Nodes: {threats.length}</span>
          </div>
          <div className="flex-1 bg-slate-900/50 rounded-xl relative overflow-hidden border border-slate-800/50">
             <ThreatMapComponent threats={threats} isMitigating={isMitigating} />
          </div>
        </motion.div>

        {/* Real-time Alerts */}
        <motion.div variants={itemVariants} className="glass-panel p-6 flex flex-col h-[400px]">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <ShieldAlert className="text-neon-red" size={18} /> Live Incidents
            </h3>
            <button className="text-xs text-neon-blue hover:underline">View All</button>
          </div>
          <AlertList alerts={alerts.slice(0, 10)} />
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
        <motion.div variants={itemVariants} className="lg:col-span-3 glass-panel p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <Zap className="text-neon-yellow" size={18} /> Network Throughput
            </h3>
            <div className="flex gap-4 text-xs">
              <span className="flex items-center gap-1 text-neon-blue">
                <span className="w-2 h-2 bg-neon-blue rounded-full"></span> Incoming
              </span>
              <span className="flex items-center gap-1 text-neon-purple">
                <span className="w-2 h-2 bg-neon-purple rounded-full"></span> Outgoing
              </span>
            </div>
          </div>
          <TrafficChart data={trafficData} />
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Analytics Distribution */}
        <motion.div variants={itemVariants} className="glass-panel p-6">
          <h3 className="text-lg font-semibold text-white mb-6">Threat Severity</h3>
          <div className="space-y-4">
            {['Critical', 'High', 'Medium', 'Low'].map((sev) => {
              const count = alerts.filter(a => a.severity === sev).length;
              const total = alerts.length || 1;
              const percentage = (count / total) * 100;
              const colorMap = {
                Critical: 'bg-neon-red',
                High: 'bg-orange-500',
                Medium: 'bg-neon-yellow',
                Low: 'bg-neon-green'
              };
              
              return (
                <div key={sev} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400">{sev}</span>
                    <span className="text-white font-mono">{count}</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${percentage}%` }}
                      className={`h-full ${colorMap[sev]} shadow-[0_0_8px] shadow-current`}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* System Health / Status */}
        <motion.div variants={itemVariants} className="glass-panel p-6 flex flex-col justify-center items-center gap-4">
           <div className="relative">
              <svg className="w-32 h-32 rotate-[-90deg]">
                <circle cx="64" cy="64" r="56" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-slate-800" />
                <motion.circle 
                  cx="64" cy="64" r="56" stroke="currentColor" strokeWidth="8" fill="transparent" 
                  className="text-neon-blue"
                  strokeDasharray="351.85"
                  initial={{ strokeDashoffset: 351.85 }}
                  animate={{ strokeDashoffset: 35.185 }} // 90%
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-bold text-white">90%</span>
                <span className="text-[10px] text-slate-500 uppercase">Health</span>
              </div>
           </div>
           <p className="text-sm text-slate-400">All systems within normal thresholds</p>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Dashboard;
