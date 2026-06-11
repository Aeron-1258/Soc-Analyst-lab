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
      transition: { staggerChildren: 0.05 }
    }
  };

  const itemVariants = {
    hidden: { y: 10, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.4, ease: 'easeOut' } }
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6 relative font-sans text-[#A3A3A3]"
    >
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-[#FAFAFA] flex items-center gap-2 tracking-tight font-display">
            <Activity className="text-[#4F46E5]" size={18} /> System Overview
          </h2>
          <p className="text-xs text-[#A3A3A3] mt-0.5">Real-time telemetry, threat intelligence feeds, and active network throughput</p>
        </div>
        
        <div className="flex gap-2">
          {isConnected ? (
            <span className="flex items-center gap-2 px-3 py-1.5 bg-[#16A34A]/5 text-[#16A34A] border border-[#16A34A]/25 rounded-full text-xs font-semibold">
              <span className="w-1.5 h-1.5 bg-[#16A34A] rounded-full animate-pulse"></span>
              Live Uplink
            </span>
          ) : (
            <span className="flex items-center gap-2 px-3 py-1.5 bg-[#4F46E5]/5 text-[#4F46E5] border border-[#4F46E5]/25 rounded-full text-xs font-semibold">
              <span className="w-1.5 h-1.5 bg-[#4F46E5] rounded-full"></span>
              Simulation Mode
            </span>
          )}
        </div>
      </div>

      <StatCards alerts={alerts} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Threat Map */}
        <motion.div variants={itemVariants} className="lg:col-span-2 glass-panel p-5 min-h-[420px] flex flex-col bg-[#171717] border border-[#2A2A2A]">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-bold text-[#FAFAFA] flex items-center gap-2 uppercase tracking-wider">
              <Globe className="text-[#4F46E5]" size={14} /> Global Attack Activity
            </h3>
            <span className="text-[10px] text-[#A3A3A3] font-mono">ACTIVE TARGETS: {threats.length}</span>
          </div>
          
          <div className="flex-1 bg-[#111111]/45 rounded-lg relative overflow-hidden border border-[#2A2A2A]">
             <ThreatMapComponent threats={filteredThreats} isMitigating={isMitigating} />
          </div>
        </motion.div>

        {/* Real-time Alerts */}
        <motion.div variants={itemVariants} className="glass-panel p-5 flex flex-col h-[420px] bg-[#171717] border border-[#2A2A2A]">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-bold text-[#FAFAFA] flex items-center gap-2 uppercase tracking-wider">
              <ShieldAlert className="text-[#DC2626]" size={14} /> Live Incidents Ticker
            </h3>
            <button className="text-[10px] font-bold text-[#4F46E5] hover:text-[#3730A3] transition-colors cursor-pointer">
              View Log
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
        <motion.div variants={itemVariants} className="lg:col-span-3 glass-panel p-5 bg-[#171717] border border-[#2A2A2A] flex flex-col justify-between">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xs font-bold text-[#FAFAFA] flex items-center gap-2 uppercase tracking-wider">
              <Zap className="text-[#4F46E5]" size={14} /> Network Throughput
            </h3>
            <div className="flex gap-4 text-[10px] font-semibold uppercase">
              <span className="flex items-center gap-1.5 text-[#4F46E5]">
                <span className="w-1.5 h-1.5 bg-[#4F46E5] rounded-full"></span> Inbound
              </span>
              <span className="flex items-center gap-1.5 text-[#A3A3A3]">
                <span className="w-1.5 h-1.5 bg-[#A3A3A3] rounded-full"></span> Outbound
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
        <motion.div variants={itemVariants} className="glass-panel p-5 bg-[#171717] border border-[#2A2A2A]">
          <h3 className="text-xs font-bold text-[#FAFAFA] mb-6 uppercase tracking-wider">Threat Severity Distribution</h3>
          <div className="space-y-4">
            {['Critical', 'High', 'Medium', 'Low'].map((sev) => {
              const count = alerts.filter(a => a.severity === sev).length;
              const total = alerts.length || 1;
              const percentage = (count / total) * 100;
              const colorMap = {
                Critical: 'bg-[#DC2626]',
                High: 'bg-[#EA580C]',
                Medium: 'bg-[#F59E0B]',
                Low: 'bg-[#16A34A]'
              };
              
              return (
                <div key={sev} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-[#A3A3A3] font-medium">{sev}</span>
                    <span className="text-[#FAFAFA] font-semibold">{count}</span>
                  </div>
                  <div className="w-full h-1 bg-[#0A0A0A] rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${percentage}%` }}
                      transition={{ duration: 0.6, ease: 'easeOut' }}
                      className={`h-full ${colorMap[sev]}`}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* System Health / Status */}
        <motion.div variants={itemVariants} className="glass-panel p-5 flex flex-col justify-center items-center gap-5 bg-[#171717] border border-[#2A2A2A] min-h-[200px]">
           <div className="relative">
              <svg className="w-28 h-28 rotate-[-90deg]">
                <circle cx="56" cy="56" r="46" stroke="#2A2A2A" strokeWidth="4" fill="transparent" />
                <motion.circle 
                  cx="56" cy="56" r="46" stroke="#4F46E5" strokeWidth="4" fill="transparent" 
                  strokeDasharray="289.02"
                  initial={{ strokeDashoffset: 289.02 }}
                  animate={{ strokeDashoffset: 28.902 }} // 90%
                  transition={{ duration: 0.8, ease: 'easeOut' }}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-bold text-[#FAFAFA]">90%</span>
                <span className="text-[9px] text-[#A3A3A3] font-semibold uppercase tracking-wider">Health</span>
              </div>
           </div>
           <p className="text-xs text-[#A3A3A3] font-medium text-center">All operational nodes working within normal parameters</p>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Dashboard;
